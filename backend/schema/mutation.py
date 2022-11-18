from sqlalchemy import select, delete
from strawberry import type, mutation
from strawberry.types import Info

from database import models
from database.connection import get_session
from utils.passwords import get_password_hash, verify_password
from .errors import *
from .responses import *
from .types import Server, Channel, Message, User, Member, Role
from .utils import get_selected_fields, add_selected_fields

__all__ = ('Mutation',)


@type
class Mutation:
    @mutation
    async def add_server(self, name: str) -> AddServerResponse:
        if len(name) > 32:
            return ServerNameTooLong()

        async with get_session() as session:
            db_server = models.Server(name=name)
            session.add(db_server)
            await session.commit()

        return Server.from_model(db_server)

    @mutation
    async def change_server_name(self, server_id: int, new_name: str) -> ChangeServerNameResponse:
        raise NotImplementedError('Not implemented')

    @mutation
    async def delete_server(self, server_id: int) -> DeleteServerResponse:
        raise NotImplementedError('Not implemented')

    @mutation
    async def add_channel(self, server_id: int, name: str) -> AddChannelResponse:
        if len(name) > 32:
            return ChannelNameTooLong()

        async with get_session() as session:
            sql = select(models.Channel).where((models.Channel.server_id == server_id) & (models.Channel.name == name))
            existing_channel = (await session.execute(sql)).scalars().first()
            if existing_channel is not None:
                return ChannelNameExists()

            db_channel = models.Channel(server_id=server_id, name=name)
            session.add(db_channel)
            await session.commit()

        return Channel.from_model(db_channel)

    @mutation
    async def add_member(self, info: Info, server_id: int, user_id: int, role: Role = Role.MEMBER) -> AddMemberResponse:
        async with get_session() as session:
            sql = select(models.Member).where((models.Member.id == user_id) & (models.Member.server_id == server_id))
            existing_member = (await session.execute(sql)).scalars().first()
            if existing_member is not None:
                return MemberExists()

            db_server_member = models.ServerMember(server_id=server_id, user_id=user_id, role=role.value)
            session.add(db_server_member)

            selected_fields = get_selected_fields('Member', info.selected_fields)

            sql = select(models.Member).where((models.Member.id == user_id) & (models.Member.server_id == server_id))
            sql = add_selected_fields(sql, models.Member, selected_fields)

            db_member = (await session.execute(sql)).scalars().first()
            await session.commit()

        return Member.from_model(db_member, selected_fields)

    @mutation
    async def change_member_role(
            self,
            info: Info,
            server_id: int,
            user_id: int,
            new_role: Role
    ) -> ChangeMemberRoleResponse:
        raise NotImplementedError('Not implemented')

    @mutation
    async def delete_member(self, info: Info, server_id: int, user_id: int) -> DeleteMemberResponse:
        selected_fields = get_selected_fields('Member', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Member).where((models.Member.id == user_id) & (models.Member.server_id == server_id))
            sql = add_selected_fields(sql, models.Member, selected_fields)
            db_member = (await session.execute(sql)).scalars().first()
            if db_member is None:
                return MemberNotFound()

            sql = (
                delete(models.ServerMember)
                .where((models.ServerMember.server_id == server_id) & (models.ServerMember.user_id == user_id))
            )
            await session.execute(sql)
            await session.commit()

        return Member.from_model(db_member)

    @mutation
    async def change_channel_name(self, server_id: int, channel_id: int, new_name: str) -> ChangeChannelNameResponse:
        if len(new_name) > 32:
            return ChannelNameTooLong()

        async with get_session() as session:
            sql = (
                select(models.Channel)
                .where((models.Channel.server_id == server_id) & (models.Channel.name == new_name))
            )
            existing_channel = (await session.execute(sql)).scalars().first()
            if existing_channel is not None:
                return ChannelNameExists()

            sql = select(models.Channel).where(models.Channel.id == channel_id)
            db_channel: models.Channel = (await session.execute(sql)).scalars().first()
            if db_channel is None:
                return ChannelNotFound()

            db_channel.name = new_name
            await session.commit()

        channel = Channel.from_model(db_channel)
        await channel.publish_new_name()
        return channel

    @mutation
    async def delete_channel(self, channel_id: int) -> DeleteChannelResponse:
        raise NotImplementedError('Not implemented')

    @mutation
    async def register(self, username: str, password: str, email: str) -> RegisterResponse:
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

        return User.from_model(db_user)

    @mutation
    async def login(self, info: Info, username: str, password: str) -> LoginResponse:
        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.name == username)
            sql = add_selected_fields(sql, models.User, selected_fields)
            db_user: models.User = (await session.execute(sql)).scalars().first()
            if db_user is None or not verify_password(password, db_user.hashed_password):
                return InvalidLoginData()

        return User.from_model(db_user)

    @mutation
    async def change_password(self, user_id: int, old_password: str, new_password: str) -> ChangePasswordResponse:
        raise NotImplementedError('Not implemented')

    @mutation
    async def delete_user(self, user_id: int) -> DeleteUserResponse:
        raise NotImplementedError('Not implemented')

    @mutation
    async def add_message(self, server_id: int, channel_id: int, user_id: int, content: str) -> AddMessageResponse:
        if len(content) > 512:
            return MessageTooLong()

        async with get_session() as session:
            db_message = models.Message(server_id=server_id, channel_id=channel_id, author_id=user_id, content=content)
            session.add(db_message)
            await session.commit()

        message = Message.from_model(db_message)
        await message.publish()
        return message
