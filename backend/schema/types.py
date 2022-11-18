from enum import Enum

import orjson
from sqlalchemy import select, desc
from strawberry import type, field, enum, ID, Private
from strawberry.types import Info

from database import models
from database.connection import get_session
from utils.broadcast import broadcast
from .utils import get_selected_fields, add_selected_fields

__all__ = (
    'Server',
    'Channel',
    'Message',
    'User',
    'Member',
    'Role'
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

    @field
    async def channels(self, info: Info) -> list['Channel']:
        if self.cached_channels is not None:
            return [Channel.from_model(channel) for channel in self.cached_channels]

        selected_fields = get_selected_fields('Server', info.selected_fields, False)
        async with get_session() as session:
            sql = select(models.Channel).where(models.Channel.server_id == int(self.id))
            sql = add_selected_fields(sql, models.Channel, selected_fields)
            db_channels = (await session.execute(sql)).scalars().all()

            return [Channel.from_model(db_channel) for db_channel in db_channels]

    cached_channels: Private[list['Channel'] | None]

    @field
    async def members(self, info: Info) -> list['Member']:
        if self.cached_members is not None:
            return [Member.from_model(member) for member in self.cached_members]

        selected_fields = get_selected_fields('Member', info.selected_fields, False)
        async with get_session() as session:
            sql = select(models.Member).where(models.Member.server_id == int(self.id))
            sql = add_selected_fields(sql, models.Member, selected_fields)
            db_members = (await session.execute(sql)).scalars().all()

            return [Member.from_model(db_user) for db_user in db_members]

    cached_members: Private[list['Member'] | None]

    @classmethod
    def from_model(cls, model: models.Server, selected_fields: set[str] = None) -> 'Server':
        if selected_fields is None:
            selected_fields = set()

        return cls(
            id=ID(str(model.id)),
            name=model.name,
            created_at=int(model.created_at.timestamp()),
            cached_channels=model.channels if 'channels' in selected_fields else None,
            cached_members=model.members if 'members' in selected_fields else None
        )


@type
class Channel:
    id: ID
    server_id: int
    name: str
    created_at: int

    @field
    async def server(self, info: Info) -> Server:
        if self.cached_server is not None:
            return Server.from_model(self.cached_server)

        selected_fields = get_selected_fields('Server', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Server).where(models.Server.id == self.server_id)
            sql = add_selected_fields(sql, models.Server, selected_fields)
            db_server = (await session.execute(sql)).scalars().first()

            return Server.from_model(db_server, selected_fields)

    cached_server: Private[models.Server | None]

    @field
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
            sql = add_selected_fields(sql, models.Message, selected_fields)
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


@type
class User:
    id: ID
    name: str
    email: str
    created_at: int

    @field
    async def servers(self, info: Info) -> list[Server]:
        if self.cached_servers is not None:
            return [Server.from_model(db_server) for db_server in self.cached_servers]

        selected_fields = get_selected_fields('Server', info.selected_fields, False)
        async with get_session() as session:
            sql = select(models.Server).where(
                models.Server.id.in_(select(models.Member.server_id).where(models.Member.user_id == int(self.id)))
            )
            sql = add_selected_fields(sql, models.Server, selected_fields)
            db_servers = (await session.execute(sql)).unique().scalars().all()

            return [Server.from_model(db_server) for db_server in db_servers]

    cached_servers: Private[list[models.Server] | None]

    @classmethod
    def from_model(cls, model: models.User, selected_fields: set[str] = None) -> 'User':
        if selected_fields is None:
            selected_fields = set()

        return cls(
            id=ID(str(model.id)),
            name=model.name,
            email=model.email,
            created_at=int(model.created_at.timestamp()),
            cached_servers=model.servers if 'servers' in selected_fields else None
        )


@type
class Member(User):
    server_id: int
    role: Role
    joined_at: int

    @field
    async def server(self, info: Info) -> Server:
        if self.cached_server is not None:
            return Server.from_model(self.cached_server)

        selected_fields = get_selected_fields('Server', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Server).where(models.Server.id == self.server_id)
            sql = add_selected_fields(sql, models.Server, selected_fields)
            db_server = (await session.execute(sql)).scalars().first()

            return Server.from_model(db_server, selected_fields)

    cached_server: Private[models.Server | None]

    @classmethod
    def from_model(cls, model: models.Member, selected_fields: set[str] = None) -> 'Member':
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
            cached_servers=model.servers if 'servers' in selected_fields else None
        )


@type
class Message:
    id: ID
    server_id: int
    channel_id: int
    author_id: int
    content: str
    created_at: int

    @field
    async def author(self, info: Info) -> Member | None:
        if self.cached_author is not None:
            return Member.from_model(self.cached_author)

        selected_fields = get_selected_fields('Member', info.selected_fields)
        async with get_session() as session:
            sql = (
                select(models.Member)
                .where((models.Member.id == self.author_id) & (models.Member.server_id == self.server_id))
            )
            sql = add_selected_fields(sql, models.Message, selected_fields)
            db_member = (await session.execute(sql)).scalars().first()

            return Member.from_model(db_member)

    cached_author: Private[models.Member | None]

    @field
    async def channel(self, info: Info) -> Channel:
        if self.cached_channel is not None:
            return Channel.from_model(self.cached_channel)

        selected_fields = get_selected_fields('Channel', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Channel).where(models.Channel.id == self.channel_id)
            sql = add_selected_fields(sql, models.Channel, selected_fields)
            db_channel = (await session.execute(sql)).scalars().first()

            return Channel.from_model(db_channel)

    cached_channel: Private[models.Channel | None]

    @field
    async def server(self, info: Info) -> Server:
        if self.cached_server is not None:
            return Server.from_model(self.cached_server)

        selected_fields = get_selected_fields('Server', info.selected_fields)
        async with get_session() as session:
            sql = select(models.Server).where(models.Server.id == self.server_id)
            sql = add_selected_fields(sql, models.Server, selected_fields)
            db_server = (await session.execute(sql)).scalars().first()

            return Server.from_model(db_server, selected_fields)

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
