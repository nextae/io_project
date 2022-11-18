from strawberry import interface, type

__all__ = (
    'ChannelNameExists',
    'ServerNotFound',
    'ChannelNotFound',
    'UserNotFound',
    'MemberNotFound',
    'MessageNotFound',
    'UserNameExists',
    'PasswordTooShort',
    'EmailExists',
    'InvalidLoginData',
    'InvalidPassword',
    'ServerNameTooLong',
    'MessageTooLong',
    'ChannelNameTooLong',
    'MemberExists'
)


@interface
class Error:
    message: str


@type
class ChannelNameExists(Error):
    message: str = 'Channel with this name already exist'


@type
class ServerNotFound(Error):
    message: str = 'Server with the given id has not been found'


@type
class ChannelNotFound(Error):
    message: str = 'Channel with the given id has not been found'


@type
class UserNotFound(Error):
    message: str = 'User with the given id has not been found'


@type
class MemberNotFound(Error):
    message: str = 'Member with the given server id and user id has not been found'


@type
class MessageNotFound(Error):
    message: str = 'Message with the given id has not been found'


@type
class UserNameExists(Error):
    message: str = 'This username is already taken'


@type
class PasswordTooShort(Error):
    message: str = 'Password is too short'


@type
class EmailExists(Error):
    message: str = 'This email is already taken'


@type
class InvalidLoginData(Error):
    message: str = 'Invalid username and/or password'


@type
class InvalidPassword(Error):
    message: str = 'Invalid password'


@type
class ServerNameTooLong(Error):
    message: str = 'Server name is too long'


@type
class MessageTooLong(Error):
    message: str = 'Message is too long'


@type
class ChannelNameTooLong(Error):
    message: str = 'Channel name is too long'


@type
class MemberExists(Error):
    message: str = 'User is already a member of this server'
