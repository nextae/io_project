from strawberry import union

from .errors import *
from .types import Server, Channel, Message, User, Member, Invitation, AuthPayload

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
    'KickMemberResponse',
    'AddMemberResponse',
    'ChangeMemberRoleResponse',
    'GetMemberResponse',
    'InviteUserResponse',
    'AcceptInvitationResponse',
    'DeclineInvitationResponse'
)

AddServerResponse = union('AddServerResponse', (Server, ServerNameTooLong, ServerNameTooShort))

AddChannelResponse = union(
    'AddChannelResponse',
    (Channel, ChannelNameExists, ChannelNameTooShort, ChannelNameTooLong, NoPermissions)
)

AddMessageResponse = union('AddMessageResponse', (Message, MessageTooLong, MessageEmpty, NoPermissions))

GetServerResponse = union('GetServerResponse', (Server, ServerNotFound, NoPermissions))

GetChannelResponse = union('GetChannelResponse', (Channel, ChannelNotFound, NoPermissions))

GetUserResponse = union('GetUserResponse', (User, UserNotFound))

GetMessageResponse = union('GetMessageResponse', (Message, MessageNotFound, NoPermissions))

RegisterResponse = union('RegisterResponse', (AuthPayload, UserNameExists, EmailExists, PasswordTooShort))

LoginResponse = union('LoginResponse', (AuthPayload, InvalidLoginData))

ChangeServerNameResponse = union(
    'ChangeServerNameResponse',
    (Server, ServerNotFound, ServerNameTooLong, ServerNameTooShort, NoPermissions)
)

ChangeChannelNameResponse = union(
    'ChangeChannelNameResponse',
    (Channel, ChannelNameTooLong, ChannelNameTooShort, ChannelNameExists, ChannelNotFound, NoPermissions)
)

ChangePasswordResponse = union(
    'ChangePasswordResponse', (User, UserNotFound, InvalidPassword, PasswordTooShort)
)

DeleteUserResponse = union('DeleteUserResponse', (User, UserNotFound))

DeleteServerResponse = union('DeleteServerResponse', (Server, ServerNotFound, NoPermissions))

DeleteChannelResponse = union('DeleteChannelResponse', (Channel, ChannelNotFound, NoPermissions))

KickMemberResponse = union('DeleteMemberResponse', (Member, MemberNotFound, NoPermissions))

LeaveServerResponse = union('LeaveServerResponse', (Member, NoPermissions))

AddMemberResponse = union('AddMemberResponse', (Member, MemberExists, NoPermissions))

ChangeMemberRoleResponse = union('ChangeMemberRoleResponse', (Member, MemberNotFound, NoPermissions))

GetMemberResponse = union('GetMemberResponse', (Member, MemberNotFound, NoPermissions))

InviteUserResponse = union(
    'InviteUserResponse', (Invitation, ContentTooLong, MemberExists, InvitationExists, UserNotFound, NoPermissions)
)

AcceptInvitationResponse = union('AcceptInvitationResponse', (Invitation, InvitationNotFound))

DeclineInvitationResponse = union('DeclineInvitationResponse', (Invitation, InvitationNotFound))
