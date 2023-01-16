from datetime import datetime, timezone, timedelta
from os import getenv
from typing import Any

from jose import JWTError, jwt
from starlette.requests import Request
from starlette.websockets import WebSocket
from strawberry import BasePermission
from strawberry.fastapi import GraphQLRouter
from strawberry.fastapi.handlers import GraphQLWSHandler, GraphQLTransportWSHandler
from strawberry.subscriptions.protocols.graphql_transport_ws.types import SubscribeMessage
from strawberry.subscriptions.protocols.graphql_ws.types import OperationMessage
from strawberry.types import Info

JWT_SECRET_KEY = getenv('JWT_SECRET_KEY')
ALGORITHM = 'HS256'
EXPIRE_TIME_IN_MINUTES = 30

__all__ = (
    'encode_token',
    'decode_token',
    'IsAuthenticated',
    'AuthGraphQLRouter'
)


def encode_token(user_id: int) -> str:
    """Encodes a new JWT token and returns it."""

    payload = {
        'sub': str(user_id),
        'exp': datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_TIME_IN_MINUTES),
        'iat': datetime.now(timezone.utc)
    }

    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> int | None:
    """Decodes the JWT token. Returns the user id."""

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

    return int(payload['sub'])


class IsAuthenticated(BasePermission):
    message = 'User is not authenticated'

    def has_permission(self, source: Any, info: Info, **kwargs) -> bool:
        """Checks if the user is authenticated and saves the user id in the context."""

        if info.context is None:
            return False

        # Check the context
        if 'token' in info.context:
            user_id = decode_token(info.context['token'])
            if user_id is None:
                return False

            info.context['user_id'] = user_id
            return True

        request: Request | WebSocket = info.context['request']

        token = None

        # Check the Authorization header
        if 'authorization' in request.headers:
            header = request.headers['authorization']

            bearer, _, token = header.partition(' ')
            if bearer.lower() != 'bearer':
                return False

        # Check the query parameters
        elif 'auth' in request.query_params:
            token = request.query_params['auth']

        if token is None:
            return False

        user_id = decode_token(token)
        if user_id is None:
            return False

        info.context['user_id'] = user_id
        return True


class AuthGraphQLWSHandler(GraphQLWSHandler):
    """Custom Websockets handler to use authentication."""

    token: str | None = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def handle_connection_init(self, message: OperationMessage):
        self.token = message['payload'].get('auth')
        await super().handle_connection_init(message)

    async def get_context(self):
        context = await super().get_context()
        context['token'] = self.token
        return context


class AuthGraphQLTransportWSHandler(GraphQLTransportWSHandler):
    """Custom Websockets handler to use authentication."""

    token: str | None = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def handle_subscribe(self, message: SubscribeMessage):
        self.token = message.payload.variables.get('auth')
        await super().handle_subscribe(message)

    async def get_context(self):
        context = await super().get_context()
        context['token'] = self.token
        return context


class AuthGraphQLRouter(GraphQLRouter):
    graphql_ws_handler_class = AuthGraphQLWSHandler
    graphql_transport_ws_handler_class = AuthGraphQLTransportWSHandler
