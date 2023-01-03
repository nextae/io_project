from database.models import Member, Channel, Server, User, Invitation, Message
from sqlalchemy import select
from database.connection import AsyncSession
from strawberry.types import Info
from schema.utils import add_selected_fields


__all__ = (
    'get_member',
    'get_server',
    'get_channel',
    'get_invitation',
    'get_user',
    'get_message'
)


async def get_member(
        session: AsyncSession,
        server_id: int,
        user_id: int,
        info: Info = None,
        is_response_union_type: bool = True
) -> Member | None:
    """Gets a Member from the database."""

    sql = select(Member).where(
        (Member.user_id == user_id) & (Member.server_id == server_id)
    )

    if info is not None:
        sql = add_selected_fields(sql, Member, info.selected_fields, is_response_union_type)

    return (await session.execute(sql)).scalars().first()


async def get_channel(
        session: AsyncSession,
        server_id: int,
        channel_id: int,
        info: Info = None,
        is_response_union_type: bool = True
) -> Channel | None:
    """Gets a Channel from the database."""

    sql = select(Channel).where(
        (Channel.id == channel_id)
        & (Channel.server_id == server_id)
    )

    if info is not None:
        sql = add_selected_fields(sql, Channel, info.selected_fields, is_response_union_type)

    return (await session.execute(sql)).scalars().first()


async def get_message(
        session: AsyncSession,
        server_id: int,
        channel_id: int,
        message_id: int,
        info: Info = None,
        is_response_union_type: bool = True
) -> Message | None:
    """Gets a Message from the database."""

    sql = select(Message).where(
        (Message.server_id == server_id)
        & (Message.channel_id == channel_id)
        & (Message.id == message_id)
    )

    if info is not None:
        sql = add_selected_fields(sql, Message, info.selected_fields, is_response_union_type)

    return (await session.execute(sql)).scalars().first()


async def get_server(
        session: AsyncSession,
        server_id: int,
        info: Info = None,
        is_response_union_type: bool = True
) -> Server | None:
    """Gets a Server from the database."""

    sql = select(Server).where(Server.id == server_id)

    if info is not None:
        sql = add_selected_fields(sql, Server, info.selected_fields, is_response_union_type)

    return (await session.execute(sql)).scalars().first()


async def get_user(
        session: AsyncSession,
        user_id: int,
        info: Info = None,
        is_response_union_type: bool = True
) -> User | None:
    """Gets a User from the database."""

    sql = select(User).where(User.id == user_id)

    if info is not None:
        sql = add_selected_fields(sql, User, info.selected_fields, is_response_union_type)

    return (await session.execute(sql)).scalars().first()


async def get_invitation(
        session: AsyncSession,
        server_id: int,
        user_id: int,
        info: Info = None,
        is_response_union_type: bool = True
) -> Invitation | None:
    """Gets an Invitation from the database."""

    sql = select(Invitation).where(
        (Invitation.user_id == user_id)
        & (Invitation.server_id == server_id)
    )

    if info is not None:
        sql = add_selected_fields(sql, Invitation, info.selected_fields, is_response_union_type)

    return (await session.execute(sql)).scalars().first()
