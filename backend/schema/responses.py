from strawberry import union

from .errors import *
from .types import Server, Channel, Message, User, Member

__all__ = (
    'AddServerResponse',
    'AddChannelResponse',
    'AddMessageResponse',
    'GetServerResponse',
    'GetChannelResponse',
    'GetUserResponse',
    'GetMessageResponse',
    'RegisterResponse',
    'LoginResponse',
    'ChangeServerNameResponse',
    'ChangeChannelNameResponse',
    'ChangePasswordResponse',
    'DeleteUserResponse',
    'DeleteServerResponse',
    'DeleteChannelResponse',
    'DeleteMemberResponse',
    'AddMemberResponse',
    'ChangeMemberRoleResponse',
    'GetMemberResponse'
)

AddServerResponse = union('AddServerResponse', (Server, ServerNameTooLong))

AddChannelResponse = union('AddChannelResponse', (Channel, ChannelNameExists, ChannelNameTooLong))

AddMessageResponse = union('AddMessageResponse', (Message, MessageTooLong))

GetServerResponse = union('GetServerResponse', (Server, ServerNotFound))

GetChannelResponse = union('GetChannelResponse', (Channel, ChannelNotFound))

GetUserResponse = union('GetUserResponse', (User, UserNotFound))

GetMessageResponse = union('GetMessageResponse', (Message, MessageNotFound))

RegisterResponse = union('RegisterResponse', (User, UserNameExists, EmailExists, PasswordTooShort))

LoginResponse = union('LoginResponse', (User, InvalidLoginData))

ChangeServerNameResponse = union('ChangeServerNameResponse', (Server, ServerNameTooLong))

ChangeChannelNameResponse = union(
    'ChangeChannelNameResponse', (Channel, ChannelNameTooLong, ChannelNameExists, ChannelNotFound)
)

ChangePasswordResponse = union('ChangePasswordResponse', (User, InvalidPassword, PasswordTooShort))

DeleteUserResponse = union('DeleteUserResponse', (User, UserNotFound))

DeleteServerResponse = union('DeleteServerResponse', (Server, ServerNotFound))

DeleteChannelResponse = union('DeleteChannelResponse', (Channel, ChannelNotFound))

DeleteMemberResponse = union('DeleteMemberResponse', (Member, MemberNotFound))

AddMemberResponse = union('AddMemberResponse', (Member, MemberExists))

ChangeMemberRoleResponse = union('ChangeMemberRoleResponse', (Member, MemberNotFound))

GetMemberResponse = union('GetMemberResponse', (Member, MemberNotFound))
