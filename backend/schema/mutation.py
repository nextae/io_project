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

        user_id = info.context['user_id']

        if len(name) < 4:
            return ServerNameTooShort()

        if len(name) > 32:
            return ServerNameTooLong()

        async with get_session() as session:
            db_server = models.Server(name=name)
            session.add(db_server)
            await session.commit()

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

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            if len(new_name) < 4:
                return ServerNameTooShort()

            if len(new_name) > 32:
                return ServerNameTooLong()

            db_server = await get_server(session, server_id, info)
            if db_server is None:
                return ServerNotFound()

            db_server.name = new_name
            await session.commit()

        server = Server.from_model(db_server)
        await server.publish_new_name()
        return server

    @mutation(permission_classes=[IsAuthenticated])
    async def delete_server(self, info: Info, server_id: int) -> DeleteServerResponse:
        """Deletes a Server. User has to be authenticated and be a Member of the Server with the OWNER role."""

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None or db_member.role != models.Role.OWNER:
                return NoPermissions()

            db_server = await get_server(session, server_id, info)
            if db_server is None:
                return ServerNotFound()

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

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            if len(name) < 4:
                return ChannelNameTooShort()

            if len(name) > 32:
                return ChannelNameTooLong()

            sql = select(models.Channel).where(
                (models.Channel.server_id == server_id)
                & (models.Channel.name == name)
            )
            existing_channel = (await session.execute(sql)).scalars().first()
            if existing_channel is not None:
                return ChannelNameExists()

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

        authenticated_user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, authenticated_user_id)
            if db_member is None or db_member.role != models.Role.OWNER:
                return NoPermissions()

            db_member_target = await get_member(session, server_id, user_id)
            if db_member_target is None:
                return MemberNotFound()

            if db_member.id == db_member_target.id:
                return NoPermissions()

            db_member_target.role = new_role.value
            if new_role.value == models.Role.OWNER:
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

        authenticated_user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, authenticated_user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            db_member_target = await get_member(session, server_id, user_id)
            if db_member_target is None:
                return MemberNotFound()

            if db_member.id == db_member_target.id:
                return NoPermissions()

            if db_member.role == models.Role.MODERATOR and db_member_target.role != models.Role.MEMBER:
                return NoPermissions()

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

        authenticated_user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, authenticated_user_id, info)
            if db_member is None:
                return NoPermissions()

            if db_member.role == models.Role.OWNER:
                return NoPermissions()

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

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            if len(new_name) < 4:
                return ChannelNameTooShort()

            if len(new_name) > 32:
                return ChannelNameTooLong()

            sql = select(models.Channel).where(
                (models.Channel.server_id == server_id)
                & (models.Channel.name == new_name)
            )
            existing_channel = (await session.execute(sql)).scalars().first()
            if existing_channel is not None:
                return ChannelNameExists()

            db_channel: models.Channel = await get_channel(session, server_id, channel_id, info)
            if db_channel is None:
                return ChannelNotFound()

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

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            db_channel = await get_channel(session, server_id, channel_id, info)
            if db_channel is None:
                return ChannelNotFound()

            await session.delete(db_channel)
            await session.commit()

        channel = Channel.from_model(db_channel)
        await channel.publish_deletion()
        return channel

    @mutation
    async def register(self, username: str, password: str, email: str) -> RegisterResponse:
        """Registers a new User."""

        if len(password) < 8:
            return PasswordTooShort()

        async with get_session() as session:
            sql = select(models.User).where((models.User.name.ilike(username)) | (models.User.email.ilike(email)))
            existing_user: models.User = (await session.execute(sql)).scalars().first()
            if existing_user is not None:
                if existing_user.email.lower() == email.lower():
                    return EmailExists()

                if existing_user.name.lower() == username.lower():
                    return UserNameExists()

            db_user = models.User(name=username, hashed_password=get_password_hash(password), email=email)
            session.add(db_user)
            await session.commit()

        return AuthPayload(encode_token(db_user.id), db_user)

    @mutation
    async def login(self, info: Info, username: str, password: str) -> LoginResponse:
        """Logs in an existing User."""

        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.name == username)
            sql = apply_selected_fields(sql, models.User, selected_fields)
            db_user: models.User = (await session.execute(sql)).scalars().first()
            if db_user is None or not verify_password(password, db_user.hashed_password):
                return InvalidLoginData()

        return AuthPayload(encode_token(db_user.id), db_user)

    @mutation(permission_classes=[IsAuthenticated])
    async def change_password(self, info: Info, old_password: str, new_password: str) -> ChangePasswordResponse:
        """
        Changes the current User's password.
        User has to be authenticated.
        """

        user_id = info.context['user_id']

        if len(new_password) < 8:
            return PasswordTooShort()

        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.id == user_id)
            sql = apply_selected_fields(sql, models.User, selected_fields)
            db_user = (await session.execute(sql)).scalars().first()
            if db_user is None:
                return UserNotFound()

            if not verify_password(old_password, db_user.hashed_password):
                return InvalidPassword()

            db_user.hashed_password = get_password_hash(new_password)
            await session.commit()

        return User.from_model(db_user, selected_fields)

    @mutation(permission_classes=[IsAuthenticated])
    async def delete_user(self, info: Info) -> DeleteUserResponse:
        """
        Deletes the current User.
        User has to be authenticated.
        """

        user_id = info.context['user_id']

        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.id == user_id)
            sql = apply_selected_fields(sql, models.User, selected_fields)
            db_user = (await session.execute(sql)).scalars().first()
            if db_user is None:
                return UserNotFound()

            await session.delete(db_user)
            await session.commit()

        return User.from_model(db_user, selected_fields)

    @mutation(permission_classes=[IsAuthenticated])
    async def add_message(self, info: Info, server_id: int, channel_id: int, content: str) -> AddMessageResponse:
        """
        Adds (sends) a Message.
        User has to be authenticated and be a Member of the Server.
        """

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                return NoPermissions()

            if len(content) > 512:
                return MessageTooLong()

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

        authenticated_user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, authenticated_user_id)
            if db_member is None or db_member.role == models.Role.MEMBER:
                return NoPermissions()

            if len(content) > 512:
                return ContentTooLong()

            existing_member = await get_member(session, server_id, user_id)
            if existing_member is not None:
                return MemberExists()

            db_invitation = await get_invitation(session, server_id, user_id)
            if db_invitation is not None:
                return InvitationExists()

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

        user_id = info.context['user_id']

        async with get_session() as session:
            db_invitation = await get_invitation(session, server_id, user_id, info)
            if db_invitation is None:
                return InvitationNotFound()

            await session.delete(db_invitation)

            # Adds the User to the Server
            db_server_member = models.ServerMember(server_id=server_id, user_id=user_id)
            session.add(db_server_member)
            await session.commit()

        return Invitation.from_model(db_invitation)

    @mutation(permission_classes=[IsAuthenticated])
    async def decline_invitation(self, info: Info, server_id: int, user_id: int) -> DeclineInvitationResponse:
        """Declines a Server Invitation. User has to be authenticated."""

        async with get_session() as session:
            db_invitation = await get_invitation(session, server_id, user_id, info)
            if db_invitation is None:
                return InvitationNotFound()

            await session.delete(db_invitation)
            await session.commit()

        return Invitation.from_model(db_invitation)
