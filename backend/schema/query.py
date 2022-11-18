from sqlalchemy import select, desc
from strawberry import type, field
from strawberry.types import Info

from database import models
from database.connection import get_session
from .errors import ServerNotFound, ChannelNotFound, UserNotFound, MessageNotFound, MemberNotFound
from .responses import (
    GetChannelResponse,
    GetServerResponse,
    GetUserResponse,
    GetMessageResponse,
    GetMemberResponse
)
from .types import Server, Channel, Message, User, Member
from .utils import get_selected_fields, add_selected_fields

__all__ = ('Query',)


@type
class Query:
    @field
    async def server(self, info: Info, server_id: int) -> GetServerResponse:
        selected_fields = get_selected_fields('Server', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Server).where(models.Server.id == server_id)
            sql = add_selected_fields(sql, models.Server, selected_fields)

            db_server = (await session.execute(sql)).scalars().first()

        if db_server is None:
            return ServerNotFound()

        return Server.from_model(db_server, selected_fields)

    @field
    async def channel(self, info: Info, channel_id: int) -> GetChannelResponse:
        selected_fields = get_selected_fields('Channel', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Channel).where(models.Channel.id == channel_id)
            sql = add_selected_fields(sql, models.Channel, selected_fields)
            db_channel = (await session.execute(sql)).scalars().first()

        if db_channel is None:
            return ChannelNotFound()

        return Channel.from_model(db_channel)

    @field
    async def first_channel(self, info: Info, server_id: int) -> GetChannelResponse:
        selected_fields = get_selected_fields('Channel', info.selected_fields)
        async with get_session() as session:
            sql = (
                select(models.Channel)
                .where(models.Channel.server_id == server_id)
                .order_by(models.Channel.created_at)
                .limit(1)
            )
            sql = add_selected_fields(sql, models.Channel, selected_fields)
            db_channel = (await session.execute(sql)).scalars().first()

        if db_channel is None:
            return ChannelNotFound()

        return Channel.from_model(db_channel)

    @field
    async def user(self, info: Info, user_id: int) -> GetUserResponse:
        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.id == user_id)
            sql = add_selected_fields(sql, models.User, selected_fields)
            db_user = (await session.execute(sql)).scalars().first()

        if db_user is None:
            return UserNotFound()

        return User.from_model(db_user, selected_fields)

    @field
    async def message(self, info: Info, message_id: int) -> GetMessageResponse:
        selected_fields = get_selected_fields('Message', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Message).where(models.Message.id == message_id)
            sql = add_selected_fields(sql, models.Message, selected_fields)
            db_message = (await session.execute(sql)).scalars().first()

        if db_message is None:
            return MessageNotFound()

        return Message.from_model(db_message)

    @field
    async def messages(self, info: Info, channel_id: int, limit: int = 100, offset: int = 0) -> list[Message]:
        selected_fields = get_selected_fields('Message', info.selected_fields, False)
        async with get_session() as session:
            sql = (
                select(models.Message)
                .where(models.Message.channel_id == channel_id)
                .order_by(desc(models.Message.created_at))
                .limit(limit)
                .offset(offset)
            )
            sql = add_selected_fields(sql, models.Message, selected_fields)
            db_messages = (await session.execute(sql)).unique().scalars().all()

        return [Message.from_model(db_message) for db_message in db_messages]

    @field
    async def member(self, info: Info, server_id: int, user_id: int) -> GetMemberResponse:
        selected_fields = get_selected_fields('Member', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Member).where((models.Member.id == user_id) & (models.Member.server_id == server_id))
            sql = add_selected_fields(sql, models.Member, selected_fields)
            db_member = (await session.execute(sql)).scalars().first()

        if db_member is None:
            return MemberNotFound()

        return Member.from_model(db_member, selected_fields)
