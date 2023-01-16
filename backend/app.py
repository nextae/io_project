from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry import Schema

from schema import Query, Mutation, Subscription
from schema.auth import AuthGraphQLRouter
from utils.broadcast import broadcast

schema = Schema(query=Query, mutation=Mutation, subscription=Subscription)
graphql_app = AuthGraphQLRouter(schema, graphiql=True)

app = FastAPI()
app.include_router(graphql_app, prefix='/graphql')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://localhost:4173'],
    allow_methods=['*'],
    allow_headers=['*']
)


@app.on_event('startup')
async def startup_event():
    """Connects the broadcast on application startup."""

    await broadcast.connect()


@app.on_event('shutdown')
async def shutdown_event():
    """Disconnects the broadcast on application shutdown."""

    await broadcast.disconnect()


@app.get('/')
def root():
    return {'Hello': 'World'}
