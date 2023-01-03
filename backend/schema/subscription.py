import orjson
from strawberry import type, subscription
from strawberry.types import Info

from database.connection import get_session
from database.utils import get_member
from utils.broadcast import broadcast
from .auth import IsAuthenticated
from .types import Message, Server, Channel, Member, Invitation

__all__ = ('Subscription',)


class NoPermissionsException(Exception):
    pass


@type
class Subscription:
    @subscription(permission_classes=[IsAuthenticated])
    async def new_message(self, info: Info, server_id: int, channel_id: int) -> Message:
        """
        Receives every new Message sent in the given Channel.
        User has to be authenticated and be a Member of the Server.
        """

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                raise NoPermissionsException('You don\'t have permissions to do this')

        async with broadcast.subscribe(channel=f'message_channel_{channel_id}') as subscriber:
            async for event in subscriber:
                yield Message(**orjson.loads(event.message))

    @subscription(permission_classes=[IsAuthenticated])
    async def new_member(self, info: Info, server_id: int) -> Member:
        """
        Receives every new Member added to the Server.
        User has to be authenticated and be a Member of the Server.
        """

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                raise NoPermissionsException('You don\'t have permissions to do this')

        async with broadcast.subscribe(channel=f'member_{server_id}') as subscriber:
            async for event in subscriber:
                yield Member(**orjson.loads(event.message))

    @subscription(permission_classes=[IsAuthenticated])
    async def new_channel(self, info: Info, server_id: int) -> Channel:
        """
        Receives every new Channel added to the Server.
        User has to be authenticated and be a Member of the Server.
        """

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                raise NoPermissionsException('You don\'t have permissions to do this')

        async with broadcast.subscribe(channel=f'channel_{server_id}') as subscriber:
            async for event in subscriber:
                yield Channel(**orjson.loads(event.message))

    @subscription(permission_classes=[IsAuthenticated])
    async def new_invitation(self, info: Info) -> Invitation:
        """
        Receives new Invitations for the current User.
        User has to be authenticated.
        """

        user_id = info.context['user_id']

        async with broadcast.subscribe(channel=f'invitation_{user_id}') as subscriber:
            async for event in subscriber:
                yield Invitation(**orjson.loads(event.message))

    @subscription(permission_classes=[IsAuthenticated])
    async def updated_server_name(self, info: Info, server_id: int) -> Server:
        """
        Receives the Server with updated name whenever it gets updated.
        User has to be authenticated and be a Member of the Server.
        """

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                raise NoPermissionsException('You don\'t have permissions to do this')

        async with broadcast.subscribe(channel=f'server_name_{server_id}') as subscriber:
            async for event in subscriber:
                yield Server(**orjson.loads(event.message))

    @subscription(permission_classes=[IsAuthenticated])
    async def updated_channel_name(self, info: Info, server_id: int) -> Channel:
        """
        Receives every Channel in the given Server with updated name whenever it gets updated.
        User has to be authenticated and be a Member of the Server.
        """

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                raise NoPermissionsException('You don\'t have permissions to do this')

        async with broadcast.subscribe(channel=f'channel_name_{server_id}') as subscriber:
            async for event in subscriber:
                yield Channel(**orjson.loads(event.message))

    @subscription(permission_classes=[IsAuthenticated])
    async def deleted_server(self, info: Info, server_id: int) -> Server:
        """
        Receives the Server when it gets deleted.
        User has to be authenticated and be a Member of the Server.
        """

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                raise NoPermissionsException('You don\'t have permissions to do this')

        async with broadcast.subscribe(channel=f'server_delete_{server_id}') as subscriber:
            async for event in subscriber:
                yield Server(**orjson.loads(event.message))

    @subscription(permission_classes=[IsAuthenticated])
    async def deleted_channel(self, info: Info, server_id: int) -> Channel:
        """
        Receives every Channel in the given Server when it gets deleted.
        User has to be authenticated and be a Member of the Server.
        """

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                raise NoPermissionsException('You don\'t have permissions to do this')

        async with broadcast.subscribe(channel=f'channel_delete_{server_id}') as subscriber:
            async for event in subscriber:
                yield Channel(**orjson.loads(event.message))

    @subscription(permission_classes=[IsAuthenticated])
    async def deleted_member(self, info: Info, server_id: int) -> Member:
        """
        Receives every Member in the given Server when it gets deleted.
        User has to be authenticated and be a Member of the Server.
        """

        user_id = info.context['user_id']

        async with get_session() as session:
            db_member = await get_member(session, server_id, user_id)
            if db_member is None:
                raise NoPermissionsException('You don\'t have permissions to do this')

        async with broadcast.subscribe(channel=f'member_delete_{server_id}') as subscriber:
            async for event in subscriber:
                yield Member(**orjson.loads(event.message))
