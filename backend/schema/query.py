from sqlalchemy import select, desc
from strawberry import type, field
from strawberry.types import Info

from database import models
from database.connection import get_session
from database.utils import get_member, get_channel, get_message
from .auth import IsAuthenticated
from .errors import (
    ServerNotFound,
    ChannelNotFound,
    MessageNotFound,
    UserNotFound,
    MemberNotFound,
    NoPermissions
)
from .responses import (
    GetChannelResponse,
    GetServerResponse,
    GetUserResponse,
    GetMessageResponse,
    GetMemberResponse,
)
from .types import Server, Channel, Message, User, Member, Invitation
from .utils import get_selected_fields, apply_selected_fields

__all__ = ('Query',)


@type
class Query:
    @field(permission_classes=[IsAuthenticated])
    async def server(self, info: Info, server_id: int) -> GetServerResponse:
        """Gets a Server. User has to be authenticated and be a Member of that Server."""

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                return NoPermissions()

            selected_fields = get_selected_fields('Server', info.selected_fields)
            sql = select(models.Server).where(models.Server.id == server_id)
            sql = apply_selected_fields(sql, models.Server, selected_fields)

            db_server = (await session.execute(sql)).scalars().first()
            if db_server is None:
                return ServerNotFound()

        return Server.from_model(db_server, selected_fields)

    @field(permission_classes=[IsAuthenticated])
    async def channel(self, info: Info, server_id: int, channel_id: int) -> GetChannelResponse:
        """Gets a Channel. User has to be authenticated and be a Member of the Channel's Server."""

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                return NoPermissions()

            db_channel = await get_channel(session, server_id, channel_id, info)
            if db_channel is None:
                return ChannelNotFound()

        return Channel.from_model(db_channel)

    @field(permission_classes=[IsAuthenticated])
    async def first_channel(self, info: Info, server_id: int) -> GetChannelResponse:
        """Gets a Channel. User has to be authenticated and be a Member of the Channel's Server."""

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                return NoPermissions()

            selected_fields = get_selected_fields('Channel', info.selected_fields)
            sql = (
                select(models.Channel)
                .where(models.Channel.server_id == server_id)
                .order_by(models.Channel.created_at)
                .limit(1)
            )
            sql = apply_selected_fields(sql, models.Channel, selected_fields)
            db_channel = (await session.execute(sql)).scalars().first()

        if db_channel is None:
            return ChannelNotFound()

        return Channel.from_model(db_channel)

    @field(permission_classes=[IsAuthenticated])
    async def message(self, info: Info, server_id: int, channel_id: int, message_id: int) -> GetMessageResponse:
        """Gets a Message. User has to be authenticated and be a Member of the Message's Server."""

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                return NoPermissions()

            db_message = await get_message(session, server_id, channel_id, message_id, info)
            if db_message is None:
                return MessageNotFound()

        return Message.from_model(db_message)

    @field(permission_classes=[IsAuthenticated])
    async def messages(
            self,
            info: Info,
            server_id: int,
            channel_id: int,
            limit: int = 100,
            offset: int = 0
    ) -> list[Message]:
        """Gets Messages from a Channel. User has to be authenticated and be a Member of the Channel's Server."""

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                return []

            selected_fields = get_selected_fields('Message', info.selected_fields, False)
            sql = (
                select(models.Message)
                .where(
                    (models.Message.channel_id == channel_id)
                    & (models.Message.server_id == server_id)
                )
                .order_by(desc(models.Message.created_at))
                .limit(limit)
                .offset(offset)
            )
            sql = apply_selected_fields(sql, models.Message, selected_fields)
            db_messages = (await session.execute(sql)).unique().scalars().all()

        return [Message.from_model(db_message) for db_message in db_messages]

    @field(permission_classes=[IsAuthenticated])
    async def member(self, info: Info, server_id: int, user_id: int) -> GetMemberResponse:
        """Gets a Member. User has to be authenticated and be a Member of the same server as the Member."""

        authenticated_user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, authenticated_user_id)
            if db_member is None:
                return NoPermissions()

            selected_fields = get_selected_fields('Member', info.selected_fields)
            sql = select(models.Member).where((models.Member.id == user_id) & (models.Member.server_id == server_id))
            sql = apply_selected_fields(sql, models.Member, selected_fields)

            db_member = (await session.execute(sql)).scalars().first()
            if db_member is None:
                return MemberNotFound()

        return Member.from_model(db_member, selected_fields)

    @field(permission_classes=[IsAuthenticated])
    async def invitations(self, info: Info) -> list[Invitation]:
        """Gets Invitations for the User. User has to be authenticated."""

        user_id = info.context['user_id']

        selected_fields = get_selected_fields('Invitation', info.selected_fields, False)
        async with get_session() as session:
            sql = select(models.Invitation).where(models.Invitation.user_id == user_id)
            sql = apply_selected_fields(sql, models.Invitation, selected_fields)

            db_invitations = (await session.execute(sql)).unique().scalars().all()

        return [Invitation.from_model(db_invitation) for db_invitation in db_invitations]

    @field(permission_classes=[IsAuthenticated])
    async def current_user(self, info: Info) -> GetUserResponse:
        """Gets the currently authenticated User. User has to be authenticated."""

        user_id = info.context['user_id']

        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.id == user_id)
            sql = apply_selected_fields(sql, models.User, selected_fields)

            db_user = (await session.execute(sql)).scalars().first()
            if db_user is None:
                return UserNotFound()

        return User.from_model(db_user, selected_fields)

    @field(permission_classes=[IsAuthenticated])
    async def user(self, info: Info, username: str) -> GetUserResponse:
        """Gets a user by the username. User has to be authenticated."""

        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.name.ilike(username))
            sql = apply_selected_fields(sql, models.User, selected_fields)

            db_user = (await session.execute(sql)).scalars().first()
            if db_user is None:
                return UserNotFound()

        return User.from_model(db_user, selected_fields)
