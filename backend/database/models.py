from datetime import datetime

from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, PrimaryKeyConstraint, FetchedValue, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

__all__ = (
    'Server',
    'Channel',
    'Message',
    'User',
    'Member',
    'ServerMember',
    'Invitation',
    'Role',
    'Base'
)


Base = declarative_base()


class Role(Enum):
    OWNER = 'owner'
    MODERATOR = 'moderator'
    MEMBER = 'member'


class Server(Base):
    __tablename__ = 'servers'

    id: int = Column(Integer, primary_key=True, index=True)
    name: str = Column(String, nullable=False)
    created_at: datetime = Column(DateTime, nullable=False, server_default=FetchedValue())

    channels: list['Channel'] = relationship('Channel', lazy='noload', order_by='Channel.id', back_populates='server')
    members: list['Member'] = relationship('Member', lazy='noload', order_by='Member.user_id', back_populates='server')

    __mapper_args__ = {'eager_defaults': True}


class Channel(Base):
    __tablename__ = 'channels'

    id: int = Column(Integer, primary_key=True, index=True)
    server_id: int = Column(Integer, ForeignKey(Server.id), nullable=False)
    name: str = Column(String, nullable=False)
    created_at: datetime = Column(DateTime, nullable=False, server_default=FetchedValue())

    server: Server | None = relationship(Server, lazy='noload', back_populates='channels')

    __mapper_args__ = {'eager_defaults': True}


class User(Base):
    __tablename__ = 'users'

    id: int = Column(Integer, primary_key=True, index=True)
    name: str = Column(String, nullable=False, unique=True)
    hashed_password: str = Column(String, nullable=False)
    email: str = Column(String, nullable=False)
    created_at: datetime = Column(DateTime, nullable=False, server_default=FetchedValue())

    servers: list[Server] = relationship(
        Server,
        lazy='noload',
        secondary='server_members',
        primaryjoin='User.id == ServerMember.user_id',
        secondaryjoin='foreign(Server.id) == ServerMember.server_id',
        back_populates='members'
    )

    __mapper_args__ = {
        'polymorphic_identity': 'users',
        'eager_defaults': True
    }


class Member(User):
    __tablename__ = 'server_members'
    __table_args__ = (PrimaryKeyConstraint('server_id', 'user_id'),)

    server_id: int = Column(Integer, ForeignKey(Server.id), nullable=False)
    user_id: int = Column(Integer, ForeignKey(User.id), nullable=False)
    role: Role = Column(Enum('owner', 'moderator', 'member', name='Role'), nullable=False, server_default=Role.MEMBER)
    joined_at: datetime = Column(DateTime, nullable=False, server_default=FetchedValue())

    server: Server | None = relationship(Server, lazy='noload', back_populates='members')

    __mapper_args__ = {
        'polymorphic_identity': 'server_members',
        'eager_defaults': True
    }


class ServerMember(Base):
    __tablename__ = 'server_members'


class Message(Base):
    __tablename__ = 'messages'

    id: int = Column(Integer, primary_key=True, index=True)
    server_id: int = Column(Integer, ForeignKey(Server.id), nullable=False)
    channel_id: int = Column(Integer, ForeignKey(Channel.id), nullable=False)
    author_id: int | None = Column(Integer, ForeignKey(User.id))
    content: str = Column(String, nullable=False)
    created_at: datetime = Column(DateTime, nullable=False, server_default=FetchedValue())

    server: Server | None = relationship(Server, lazy='noload')
    channel: Channel | None = relationship(Channel, lazy='noload')
    author: Member | None = relationship(Member, lazy='noload', foreign_keys=[server_id, author_id])

    __mapper_args__ = {'eager_defaults': True}


class Invitation(Base):
    __tablename__ = 'invitations'
    __table_args__ = (PrimaryKeyConstraint('server_id', 'user_id'),)

    server_id: int = Column(Integer, ForeignKey(Server.id), nullable=False)
    user_id: int = Column(Integer, ForeignKey(User.id), nullable=False)
    content: str | None = Column(String)
    created_at: datetime = Column(DateTime, nullable=False, server_default=FetchedValue())

    server: Server | None = relationship(Server, lazy='noload')
    user: User | None = relationship(Member, lazy='noload')

    __mapper_args__ = {'eager_defaults': True}
