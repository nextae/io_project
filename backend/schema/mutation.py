from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from strawberry import type, mutation
from strawberry.types import Info

from database import models
from database.connection import get_session
from database.utils import get_member, get_channel, get_invitation, get_server
from utils.passwords import get_password_hash, verify_password
from .auth import encode_token, IsAuthenticated
from .errors import *
from .responses import *
from .types import Server, Channel, Message, User, Member, Role, Invitation, AuthPayload
from .utils import get_selected_fields, apply_selected_fields

__all__ = ('Mutation',)


@type
class Mutation:
    @mutation(permission_classes=[IsAuthenticated])
    async def add_server(self, info: Info, name: str) -> AddServerResponse:
        """Adds a new Server and makes the current User an owner. User has to be authenticated."""

        # Get the authenticated user's id
        user_id = info.context['user_id']

        # Check if the name is too short
        if len(name) < 4:
            return ServerNameTooShort()

        # Check if the name is too long
        if len(name) > 32:
            return ServerNameTooLong()

        # Add the Server to the database
        async with get_session() as session:
            db_server = models.Server(name=name)
            session.add(db_server)
            await session.commit()

        # Add the Member to the database
        async with get_session() as session:
            db_server_member = models.ServerMember(server_id=db_server.id, user_id=user_id, role=models.Role.OWNER)
            session.add(db_server_member)
            await session.commit()

        return Server.from_model(db_server)

    @mutation(permission_classes=[IsAuthenticated])
    async def change_server_name(self, info: Info, server_id: int, new_name: str) -> ChangeServerNameResponse:
        """
        Changes a Server's name.
        User has to be authenticated and be a Member of the Server with the MODERATOR or OWNER role.
        """

        # Get the authenticated user's id
        user_id = info.context['user_id']

        async with get_session() as session:
            # Check if the user is a Member of the Server and has the MODERATOR or OWNER role
            db_member = await get_member(session, server_id, user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            # Check if the name is too short
            if len(new_name) < 4:
                return ServerNameTooShort()

            # Check if the name is too long
            if len(new_name) > 32:
                return ServerNameTooLong()

            # Get the Server from the database
            db_server = await get_server(session, server_id, info)
            if db_server is None:
                return ServerNotFound()

            # Change the Server name
            db_server.name = new_name
            await session.commit()

        server = Server.from_model(db_server)
        await server.publish_new_name()
        return server

    @mutation(permission_classes=[IsAuthenticated])
    async def delete_server(self, info: Info, server_id: int) -> DeleteServerResponse:
        """Deletes a Server. User has to be authenticated and be a Member of the Server with the OWNER role."""

        # Get the authenticated user's id
        user_id = info.context['user_id']

        async with get_session() as session:
            # Check if the user is a Member of the Server and has the OWNER role
            db_member = await get_member(session, server_id, user_id)
            if db_member is None or db_member.role != models.Role.OWNER:
                return NoPermissions()

            # Get the Server from the database
            db_server = await get_server(session, server_id, info)
            if db_server is None:
                return ServerNotFound()

            # Delete the Server from the database
            await session.delete(db_server)
            await session.commit()

        server = Server.from_model(db_server)
        await server.publish_deletion()
        return server

    @mutation(permission_classes=[IsAuthenticated])
    async def add_channel(self, info: Info, server_id: int, name: str) -> AddChannelResponse:
        """
        Adds a new Channel in the Server.
        User has to be authenticated and be a Member of the Server with the MODERATOR or OWNER role.
        """

        # Get the authenticated user's id
        user_id = info.context['user_id']

        async with get_session() as session:
            # Check if the user is a Member of the Server and has the MODERATOR or OWNER role
            db_member = await get_member(session, server_id, user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            # Check if the name is too short
            if len(name) < 4:
                return ChannelNameTooShort()

            # Check if the name is too long
            if len(name) > 32:
                return ChannelNameTooLong()

            # Check if a Channel with this name already exists
            sql = select(models.Channel).where(
                (models.Channel.server_id == server_id)
                & (models.Channel.name == name)
            )
            existing_channel = (await session.execute(sql)).scalars().first()
            if existing_channel is not None:
                return ChannelNameExists()

            # Add the Channel to the database
            db_channel = models.Channel(server_id=server_id, name=name)
            session.add(db_channel)
            await session.commit()

        channel = Channel.from_model(db_channel)
        await channel.publish_creation()
        return channel

    @mutation(permission_classes=[IsAuthenticated])
    async def change_member_role(
            self,
            info: Info,
            server_id: int,
            user_id: int,
            new_role: Role
    ) -> ChangeMemberRoleResponse:
        """
        Changes a Member's role.
        User has to be authenticated and be a Member of the server with the OWNER role.
        If the OWNER role is chosen then the previous owner is demoted to a moderator.
        The owner cannot change their own role.
        """

        # Get the authenticated user's id
        authenticated_user_id = info.context['user_id']

        async with get_session() as session:
            # Check if the user is a Member of the Server
            db_member = await get_member(session, server_id, authenticated_user_id)
            if db_member is None or db_member.role != models.Role.OWNER:
                return NoPermissions()

            # Check if the target user is a Member of the Server
            db_member_target = await get_member(session, server_id, user_id)
            if db_member_target is None:
                return MemberNotFound()

            # Check if the user attempts to change their own role
            if db_member.id == db_member_target.id:
                return NoPermissions()

            # Change the role
            db_member_target.role = new_role.value
            if new_role.value == models.Role.OWNER:
                # If the role given is OWNER, demote the previous owner to a MODERATOR
                db_member.role = models.Role.MODERATOR

            await session.commit()

        return Member.from_model(db_member_target)

    @mutation(permission_classes=[IsAuthenticated])
    async def kick_member(self, info: Info, server_id: int, user_id: int) -> KickMemberResponse:
        """
        Kicks a Member from the Server.
        User has to be authenticated and be a Member of the server with the MODERATOR or OWNER role.
        Users cannot kick themselves.
        Moderators can only kick Members with the MEMBER role.
        """

        # Get the authenticated user's id
        authenticated_user_id = info.context['user_id']

        async with get_session() as session:
            # Check if the user is a Member of the Server and has the MODERATOR or OWNER role
            db_member = await get_member(session, server_id, authenticated_user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            # Check if the target user is a Member of the Server
            db_member_target = await get_member(session, server_id, user_id)
            if db_member_target is None:
                return MemberNotFound()

            # Check if the user attempts to kick themselves
            if db_member.id == db_member_target.id:
                return NoPermissions()

            # Check if the user has permissions to kick the target Member
            if db_member.role == models.Role.MODERATOR and db_member_target.role != models.Role.MEMBER:
                return NoPermissions()

            # Delete the target Member from the database
            sql = delete(models.ServerMember).where(
                (models.ServerMember.server_id == server_id)
                & (models.ServerMember.user_id == user_id)
            )
            await session.execute(sql)
            await session.commit()

        member = Member.from_model(db_member_target)
        await member.publish_deletion()
        return member

    @mutation(permission_classes=[IsAuthenticated])
    async def leave_server(self, info: Info, server_id: int) -> KickMemberResponse:
        """
        Leaves a Server.
        User has to be authenticated and be a Member of the server.
        The owner cannot leave the Server.
        """

        # Get the authenticated user's id
        authenticated_user_id = info.context['user_id']

        async with get_session() as session:
            # Check if the user is a Member of the Server
            db_member = await get_member(session, server_id, authenticated_user_id, info)
            if db_member is None:
                return NoPermissions()

            # Check if the owner attempts to leave the Server
            if db_member.role == models.Role.OWNER:
                return NoPermissions()

            # Delete the Member from the database
            sql = delete(models.ServerMember).where(
                (models.ServerMember.server_id == server_id)
                & (models.ServerMember.user_id == authenticated_user_id)
            )

            await session.execute(sql)
            await session.commit()

        member = Member.from_model(db_member)
        await member.publish_deletion()
        return member

    @mutation(permission_classes=[IsAuthenticated])
    async def change_channel_name(
            self,
            info: Info,
            server_id: int,
            channel_id: int,
            new_name: str
    ) -> ChangeChannelNameResponse:
        """
        Changes a Channel's name.
        User has to be authenticated and be a Member of the Server with the MODERATOR or OWNER role.
        """

        # Get the authenticated user's id
        user_id = info.context['user_id']

        async with get_session() as session:
            # Check if the user is a Member of the Server and has the MODERATOR or OWNER role
            db_member = await get_member(session, server_id, user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            # Check if the name is too short
            if len(new_name) < 4:
                return ChannelNameTooShort()

            # Check if the name is too long
            if len(new_name) > 32:
                return ChannelNameTooLong()

            # Check if a channel with this name already exists
            sql = select(models.Channel).where(
                (models.Channel.server_id == server_id)
                & (models.Channel.name == new_name)
            )
            existing_channel = (await session.execute(sql)).scalars().first()
            if existing_channel is not None:
                return ChannelNameExists()

            # Get the Channel from the database
            db_channel: models.Channel = await get_channel(session, server_id, channel_id, info)
            if db_channel is None:
                return ChannelNotFound()

            # Change the Channel name
            db_channel.name = new_name
            await session.commit()

        channel = Channel.from_model(db_channel)
        await channel.publish_new_name()
        return channel

    @mutation(permission_classes=[IsAuthenticated])
    async def delete_channel(self, info: Info, server_id: int, channel_id: int) -> DeleteChannelResponse:
        """
        Deletes a Channel.
        User has to be authenticated and be a Member of the Server with the MODERATOR or OWNER role.
        """

        # Get the authenticated user's id
        user_id = info.context['user_id']

        async with get_session() as session:
            # Check if the user is a Member of the Server and has the MODERATOR or OWNER role
            db_member = await get_member(session, server_id, user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            # Get the Channel from the database
            db_channel = await get_channel(session, server_id, channel_id, info)
            if db_channel is None:
                return ChannelNotFound()

            # Delete the Channel from the database
            await session.delete(db_channel)
            await session.commit()

        channel = Channel.from_model(db_channel)
        await channel.publish_deletion()
        return channel

    @mutation
    async def register(self, username: str, password: str, email: str) -> RegisterResponse:
        """Registers a new User."""

        # Check if the password is too short
        if len(password) < 8:
            return PasswordTooShort()

        async with get_session() as session:
            # Check if a user with this username or email already exists
            sql = select(models.User).where((models.User.name.ilike(username)) | (models.User.email.ilike(email)))
            existing_user: models.User = (await session.execute(sql)).scalars().first()
            if existing_user is not None:
                if existing_user.email.lower() == email.lower():
                    return EmailExists()

                if existing_user.name.lower() == username.lower():
                    return UserNameExists()

            # Add the User to the database
            db_user = models.User(name=username, hashed_password=get_password_hash(password), email=email)
            session.add(db_user)
            await session.commit()

        # Generate the JWT access token and return the data
        return AuthPayload(encode_token(db_user.id), db_user)

    @mutation
    async def login(self, info: Info, username: str, password: str) -> LoginResponse:
        """Logs in an existing User."""

        # Check if the login data is valid
        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.name == username)
            sql = apply_selected_fields(sql, models.User, selected_fields)
            db_user: models.User = (await session.execute(sql)).scalars().first()
            if db_user is None or not verify_password(password, db_user.hashed_password):
                return InvalidLoginData()

        # Generate the JWT access token and return the data
        return AuthPayload(encode_token(db_user.id), db_user)

    @mutation(permission_classes=[IsAuthenticated])
    async def change_password(self, info: Info, old_password: str, new_password: str) -> ChangePasswordResponse:
        """
        Changes the current User's password.
        User has to be authenticated.
        """

        # Get the authenticated user's id
        user_id = info.context['user_id']

        # Check if the password is too short
        if len(new_password) < 8:
            return PasswordTooShort()

        # Get the User from the database
        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.id == user_id)
            sql = apply_selected_fields(sql, models.User, selected_fields)
            db_user = (await session.execute(sql)).scalars().first()
            if db_user is None:
                return UserNotFound()

            # Check if the old password matches the hashed password
            if not verify_password(old_password, db_user.hashed_password):
                return InvalidPassword()

            # Change the password
            db_user.hashed_password = get_password_hash(new_password)
            await session.commit()

        return User.from_model(db_user, selected_fields)

    @mutation(permission_classes=[IsAuthenticated])
    async def delete_user(self, info: Info) -> DeleteUserResponse:
        """
        Deletes the current User.
        User has to be authenticated.
        """

        # Get the authenticated user's id
        user_id = info.context['user_id']

        # Get the User from the database
        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.id == user_id)
            sql = apply_selected_fields(sql, models.User, selected_fields)
            db_user = (await session.execute(sql)).scalars().first()
            if db_user is None:
                return UserNotFound()

            # Delete the User from the database
            await session.delete(db_user)
            await session.commit()

        return User.from_model(db_user, selected_fields)

    @mutation(permission_classes=[IsAuthenticated])
    async def add_message(self, info: Info, server_id: int, channel_id: int, content: str) -> AddMessageResponse:
        """
        Adds (sends) a Message.
        User has to be authenticated and be a Member of the Server.
        """

        # Get the authenticated user's id
        user_id = info.context['user_id']

        async with get_session() as session:
            # Check if the user is a Member of the Server
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                return NoPermissions()

            # Check if the Message content is too long
            if len(content) > 512:
                return MessageTooLong()

            # Add the Message to the database
            db_message = models.Message(server_id=server_id, channel_id=channel_id, author_id=user_id, content=content)
            session.add(db_message)
            await session.commit()

        message = Message.from_model(db_message)
        await message.publish()
        return message

    @mutation(permission_classes=[IsAuthenticated])
    async def invite_user(self, info: Info, server_id: int, user_id: int, content: str) -> InviteUserResponse:
        """
        Invites a User to the Server.
        User has to be authenticated and be a Member of the Server with the MODERATOR or OWNER role.
        """

        # Get the authenticated user's id
        authenticated_user_id = info.context['user_id']

        async with get_session() as session:
            # Check if the user is a Member of the Server and has the MODERATOR or OWNER role
            db_member = await get_member(session, server_id, authenticated_user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            # Check if the Invitation content is too long
            if len(content) > 512:
                return ContentTooLong()

            # Check if the user is already a Member of this server
            existing_member = await get_member(session, server_id, user_id)
            if existing_member is not None:
                return MemberExists()

            # Check if the user is already invited to this Server
            db_invitation = await get_invitation(session, server_id, user_id)
            if db_invitation is not None:
                return InvitationExists()

            # Add the Invitation to the database
            db_invitation = models.Invitation(server_id=server_id, user_id=user_id, content=content)
            session.add(db_invitation)

            try:
                await session.commit()
            except IntegrityError:
                return UserNotFound()

        invitation = Invitation.from_model(db_invitation)
        await invitation.publish_creation()
        return invitation

    @mutation(permission_classes=[IsAuthenticated])
    async def accept_invitation(self, info: Info, server_id: int) -> AcceptInvitationResponse:
        """Accepts a Server Invitation. User has to be authenticated."""

        # Get the authenticated user's id
        user_id = info.context['user_id']

        # Get the Invitation from the database
        async with get_session() as session:
            db_invitation = await get_invitation(session, server_id, user_id, info)
            if db_invitation is None:
                return InvitationNotFound()

            # Delete the Invitation from the database
            await session.delete(db_invitation)

            # Add the Member to the database
            db_server_member = models.ServerMember(server_id=server_id, user_id=user_id)
            session.add(db_server_member)
            await session.commit()

        return Invitation.from_model(db_invitation)

    @mutation(permission_classes=[IsAuthenticated])
    async def decline_invitation(self, info: Info, server_id: int) -> DeclineInvitationResponse:
        """Declines a Server Invitation. User has to be authenticated."""

        # Get the authenticated user's id
        user_id = info.context['user_id']

        # Get the Invitation from the database
        async with get_session() as session:
            db_invitation = await get_invitation(session, server_id, user_id, info)
            if db_invitation is None:
                return InvitationNotFound()

            # Delete the Invitation from the database
            await session.delete(db_invitation)
            await session.commit()

        return Invitation.from_model(db_invitation)
