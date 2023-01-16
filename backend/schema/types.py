from enum import Enum

import orjson
from sqlalchemy import select, desc
from strawberry import type, field, enum, ID, Private
from strawberry.types import Info

from database import models
from database.connection import get_session
from utils.broadcast import broadcast
from .auth import IsAuthenticated
from .utils import get_selected_fields, apply_selected_fields

__all__ = (
    'Server',
    'Channel',
    'Message',
    'User',
    'Member',
    'Role',
    'Invitation',
    'AuthPayload'
)


@enum
class Role(Enum):
    OWNER = 'owner'
    MODERATOR = 'moderator'
    MEMBER = 'member'


@type
class Server:
    id: ID
    name: str
    created_at: int

    @field(permission_classes=[IsAuthenticated])
    async def channels(self, info: Info) -> list['Channel']:
        if not self.has_permissions:
            return []

        if self.cached_channels is not None:
            return [Channel.from_model(channel) for channel in self.cached_channels]

        selected_fields = get_selected_fields('Server', info.selected_fields, False)
        async with get_session() as session:
            sql = select(models.Channel).where(models.Channel.server_id == int(self.id))
            sql = apply_selected_fields(sql, models.Channel, selected_fields)
            db_channels = (await session.execute(sql)).scalars().all()

            return [Channel.from_model(db_channel) for db_channel in db_channels]

    cached_channels: Private[list['Channel'] | None]

    @field(permission_classes=[IsAuthenticated])
    async def members(self, info: Info) -> list['Member']:
        if not self.has_permissions:
            return []

        user_id = info.context['user_id']

        if self.cached_members is not None:
            return [Member.from_model(member, has_permissions=member.id == user_id) for member in self.cached_members]

        selected_fields = get_selected_fields('Member', info.selected_fields, False)
        async with get_session() as session:
            sql = select(models.Member).where(models.Member.server_id == int(self.id))
            sql = apply_selected_fields(sql, models.Member, selected_fields)
            db_members = (await session.execute(sql)).scalars().all()

            return [Member.from_model(db_member, selected_fields, db_member.id == user_id) for db_member in db_members]

    cached_members: Private[list['Member'] | None]

    has_permissions: Private[bool]

    @classmethod
    def from_model(
            cls,
            model: models.Server,
            selected_fields: set[str] = None,
            has_permissions: bool = True
    ) -> 'Server':
        if selected_fields is None:
            selected_fields = set()

        return cls(
            id=ID(str(model.id)),
            name=model.name,
            created_at=int(model.created_at.timestamp()),
            cached_channels=model.channels if 'channels' in selected_fields else None,
            cached_members=model.members if 'members' in selected_fields else None,
            has_permissions=has_permissions
        )

    async def publish_new_name(self):
        """Publishes the new server name."""

        await broadcast.publish(channel=f'server_name_{self.id}', message=orjson.dumps(self.__dict__))

    async def publish_deletion(self):
        """Publishes the deletion of the server."""

        await broadcast.publish(channel=f'server_delete_{self.id}', message=orjson.dumps(self.__dict__))


@type
class Channel:
    id: ID
    server_id: int
    name: str
    created_at: int

    @field(permission_classes=[IsAuthenticated])
    async def server(self, info: Info) -> Server:
        if self.cached_server is not None:
            return Server.from_model(self.cached_server)

        selected_fields = get_selected_fields('Server', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Server).where(models.Server.id == self.server_id)
            sql = apply_selected_fields(sql, models.Server, selected_fields)
            db_server = (await session.execute(sql)).scalars().first()

            return Server.from_model(db_server, selected_fields, True)

    cached_server: Private[models.Server | None]

    @field(permission_classes=[IsAuthenticated])
    async def messages(self, info: Info, limit: int = 100, offset: int = 0) -> list['Message']:
        selected_fields = get_selected_fields('Message', info.selected_fields, False)
        async with get_session() as session:
            sql = (
                select(models.Message)
                .where(models.Message.channel_id == int(self.id))
                .order_by(desc(models.Message.created_at))
                .limit(limit)
                .offset(offset)
            )
            sql = apply_selected_fields(sql, models.Message, selected_fields)
            db_messages = (await session.execute(sql)).scalars().all()

            return [Message.from_model(db_message) for db_message in db_messages]

    @classmethod
    def from_model(cls, model: models.Channel) -> 'Channel':
        return cls(
            id=ID(str(model.id)),
            server_id=model.server_id,
            name=model.name,
            created_at=int(model.created_at.timestamp()),
            cached_server=model.server
        )

    async def publish_new_name(self):
        """Publishes the new channel name."""

        await broadcast.publish(channel=f'channel_name_{self.server_id}', message=orjson.dumps(self.__dict__))

    async def publish_deletion(self):
        """Publishes the deletion of the channel."""

        await broadcast.publish(channel=f'channel_delete_{self.server_id}', message=orjson.dumps(self.__dict__))

    async def publish_creation(self):
        """Publishes the creation of the channel."""

        await broadcast.publish(channel=f'channel_{self.server_id}', message=orjson.dumps(self.__dict__))


@type
class User:
    id: ID
    name: str
    email: str
    created_at: int

    @field(permission_classes=[IsAuthenticated])
    async def servers(self, info: Info) -> list[Server]:
        if not self.has_permissions:
            return []

        if self.cached_servers is not None:
            return [Server.from_model(db_server, has_permissions=True) for db_server in self.cached_servers]

        selected_fields = get_selected_fields('Server', info.selected_fields, False)
        async with get_session() as session:
            sql = select(models.Server).where(
                models.Server.id.in_(
                    select(models.Member.server_id).where(
                        models.Member.user_id == int(self.id)
                    )
                )
            )
            sql = apply_selected_fields(sql, models.Server, selected_fields)
            db_servers = (await session.execute(sql)).unique().scalars().all()

            return [Server.from_model(db_server, selected_fields, True) for db_server in db_servers]

    cached_servers: Private[list[models.Server] | None]
    has_permissions: Private[bool]

    @classmethod
    def from_model(cls, model: models.User, selected_fields: set[str] = None, has_permissions: bool = False) -> 'User':
        if selected_fields is None:
            selected_fields = set()

        return cls(
            id=ID(str(model.id)),
            name=model.name,
            email=model.email,
            created_at=int(model.created_at.timestamp()),
            cached_servers=model.servers if 'servers' in selected_fields else None,
            has_permissions=has_permissions
        )


@type
class Member(User):
    server_id: int
    role: Role
    joined_at: int

    @field(permission_classes=[IsAuthenticated])
    async def servers(self, info: Info) -> list[Server]:
        if not self.has_permissions:
            return []

        selected_fields = get_selected_fields('Server', info.selected_fields, False)
        async with get_session() as session:
            sql = select(models.Server).where(
                models.Server.id.in_(
                    select(models.Member.server_id).where(
                        models.Member.user_id == int(self.id)
                    )
                )
            )
            sql = apply_selected_fields(sql, models.Server, selected_fields)
            db_servers = (await session.execute(sql)).unique().scalars().all()

            return [Server.from_model(db_server, selected_fields, True) for db_server in db_servers]

    @field(permission_classes=[IsAuthenticated])
    async def server(self, info: Info) -> Server:
        if self.cached_server is not None:
            return Server.from_model(self.cached_server)

        selected_fields = get_selected_fields('Server', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Server).where(models.Server.id == self.server_id)
            sql = apply_selected_fields(sql, models.Server, selected_fields)
            db_server = (await session.execute(sql)).scalars().first()

            return Server.from_model(db_server, selected_fields, True)

    cached_server: Private[models.Server | None]

    @classmethod
    def from_model(cls, model: models.Member, selected_fields: set[str] = None, has_permissions: bool = False) -> 'Member':
        if selected_fields is None:
            selected_fields = set()

        return cls(
            id=ID(str(model.id)),
            name=model.name,
            email=model.email,
            created_at=int(model.created_at.timestamp()),
            server_id=model.server_id,
            role=model.role,
            joined_at=int(model.joined_at.timestamp()),
            cached_server=model.server,
            cached_servers=model.servers if 'servers' in selected_fields else None,
            has_permissions=has_permissions
        )

    async def publish_creation(self):
        """Publishes the creation of the member."""

        await broadcast.publish(channel=f'member_{self.server_id}', message=orjson.dumps(self.__dict__))

    async def publish_deletion(self):
        """Publishes the deletion of the member."""

        await broadcast.publish(channel=f'member_delete_{self.server_id}', message=orjson.dumps(self.__dict__))


@type
class Message:
    id: ID
    server_id: int
    channel_id: int
    author_id: int
    content: str
    created_at: int

    @field(permission_classes=[IsAuthenticated])
    async def author(self, info: Info) -> Member | None:
        user_id = info.context['user_id']

        if self.cached_author is not None:
            return Member.from_model(self.cached_author, has_permissions=self.cached_author.id == user_id)

        selected_fields = get_selected_fields('Member', info.selected_fields)
        async with get_session() as session:
            sql = (
                select(models.Member)
                .where((models.Member.id == self.author_id) & (models.Member.server_id == self.server_id))
            )
            sql = apply_selected_fields(sql, models.Member, selected_fields)
            db_member = (await session.execute(sql)).scalars().first()
            if db_member is None:
                return None

            return Member.from_model(db_member, selected_fields, db_member.id == user_id)

    cached_author: Private[models.Member | None]

    @field(permission_classes=[IsAuthenticated])
    async def channel(self, info: Info) -> Channel:
        if self.cached_channel is not None:
            return Channel.from_model(self.cached_channel)

        selected_fields = get_selected_fields('Channel', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Channel).where(models.Channel.id == self.channel_id)
            sql = apply_selected_fields(sql, models.Channel, selected_fields)
            db_channel = (await session.execute(sql)).scalars().first()

            return Channel.from_model(db_channel)

    cached_channel: Private[models.Channel | None]

    @field(permission_classes=[IsAuthenticated])
    async def server(self, info: Info) -> Server:
        if self.cached_server is not None:
            return Server.from_model(self.cached_server, has_permissions=True)

        selected_fields = get_selected_fields('Server', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Server).where(models.Server.id == self.server_id)
            sql = apply_selected_fields(sql, models.Server, selected_fields)
            db_server = (await session.execute(sql)).scalars().first()

            return Server.from_model(db_server, selected_fields, True)

    cached_server: Private[models.Server | None]

    @classmethod
    def from_model(cls, model: models.Message) -> 'Message':
        return cls(
            id=ID(str(model.id)),
            server_id=model.server_id,
            channel_id=model.channel_id,
            author_id=model.author_id,
            content=model.content,
            created_at=int(model.created_at.timestamp()),
            cached_server=model.server,
            cached_channel=model.channel,
            cached_author=model.author
        )

    async def publish(self):
        """Publishes the message."""

        await broadcast.publish(channel=f'message_channel_{self.channel_id}', message=orjson.dumps(self.__dict__))


@type
class Invitation:
    server_id: int
    user_id: int
    content: str | None
    created_at: int

    @field(permission_classes=[IsAuthenticated])
    async def server(self) -> Server:
        if self.cached_server is not None:
            return Server.from_model(self.cached_server, has_permissions=False)

        async with get_session() as session:
            sql = select(models.Server).where(models.Server.id == self.server_id)
            db_server = (await session.execute(sql)).scalars().first()

            return Server.from_model(db_server, has_permissions=False)

    cached_server: Private[models.Server | None]

    @field(permission_classes=[IsAuthenticated])
    async def user(self, info: Info) -> User | None:
        if self.cached_user is not None:
            return User.from_model(self.cached_user, has_permissions=True)

        selected_fields = get_selected_fields('User', info.selected_fields)
        async with get_session() as session:
            sql = select(models.User).where(models.User.id == self.user_id)
            sql = apply_selected_fields(sql, models.User, selected_fields)
            db_user = (await session.execute(sql)).scalars().first()

            return User.from_model(db_user, selected_fields, True)

    cached_user: Private[models.User | None]

    @classmethod
    def from_model(cls, model: models.Invitation) -> 'Invitation':
        return cls(
            server_id=model.server_id,
            user_id=model.user_id,
            content=model.content,
            created_at=int(model.created_at.timestamp()),
            cached_server=model.server,
            cached_user=model.user
        )

    async def publish_creation(self):
        """Publishes the creation of the invitation."""

        await broadcast.publish(channel=f'invitation_{self.user_id}', message=orjson.dumps(self.__dict__))


@type
class AuthPayload:
    token: str
    user: User

    def __init__(self, token: str, user_model: models.User):
        self.token = token
        self.user = User.from_model(user_model)
