from passlib.context import CryptContext

password_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

__all__ = ('verify_password', 'get_password_hash')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies whether the plaintext password matches the hashed password."""

    return password_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hashes the plaintext password."""

    return password_context.hash(password)
