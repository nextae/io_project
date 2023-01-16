from contextlib import asynccontextmanager
from os import getenv
from typing import AsyncContextManager

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

__all__ = ('get_session', 'AsyncSession')

postgres_user = getenv('POSTGRES_USER')
postgres_password = getenv('POSTGRES_PASSWORD')
postgres_url = getenv('POSTGRES_URL')
postgres_port = getenv('POSTGRES_PORT')
db_name = getenv('POSTGRES_DATABASE_NAME')

engine = create_async_engine(
    f'postgresql+asyncpg://{postgres_user}:{postgres_password}@{postgres_url}:{postgres_port}/{db_name}',
    echo=True
)

async_session = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


@asynccontextmanager
async def get_session() -> AsyncContextManager[AsyncSession]:
    """Gets the database session."""

    async with async_session() as session:
        async with session.begin():
            try:
                yield session
            finally:
                await session.close()
