from fastapi import FastAPI
from strawberry import Schema
from strawberry.fastapi import GraphQLRouter

from schema import Query, Mutation, Subscription
from utils.broadcast import broadcast

schema = Schema(query=Query, mutation=Mutation, subscription=Subscription)
graphql_app = GraphQLRouter(schema, graphiql=True)

app = FastAPI()
app.include_router(graphql_app, prefix='/graphql')


@app.on_event('startup')
async def startup_event():
    await broadcast.connect()


@app.on_event('shutdown')
async def shutdown_event():
    await broadcast.disconnect()


@app.get('/')
def root():
    return {'Hello': 'World'}


