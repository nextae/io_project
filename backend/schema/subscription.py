import orjson
from strawberry import type, subscription

from utils.broadcast import broadcast
from .types import Message, Server, Channel

__all__ = ('Subscription',)


@type
class Subscription:
    @subscription
    async def new_message(self, channel_id: int) -> Message:
        async with broadcast.subscribe(channel=f'message_channel_{channel_id}') as subscriber:
            async for event in subscriber:
                yield Message(**orjson.loads(event.message))

    @subscription
    async def updated_server_name(self, server_id: int) -> Server:
        async with broadcast.subscribe(channel=f'server_name_{server_id}') as subscriber:
            async for event in subscriber:
                yield Server(**orjson.loads(event.message))

    @subscription
    async def updated_channel_name(self, server_id: int) -> Channel:
        async with broadcast.subscribe(channel=f'channel_name_{server_id}') as subscriber:
            async for event in subscriber:
                yield Channel(**orjson.loads(event.message))
