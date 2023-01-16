/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AcceptInvitationResponse = Invitation | InvitationNotFound;

export type AddChannelResponse = Channel | ChannelNameExists | ChannelNameTooLong | ChannelNameTooShort | NoPermissions;

export type AddMessageResponse = Message | MessageEmpty | MessageTooLong | NoPermissions;

export type AddServerResponse = Server | ServerNameTooLong | ServerNameTooShort;

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String'];
  user: User;
};

export type ChangeChannelNameResponse = Channel | ChannelNameExists | ChannelNameTooLong | ChannelNameTooShort | ChannelNotFound | NoPermissions;

export type ChangeMemberRoleResponse = Member | MemberNotFound | NoPermissions;

export type ChangePasswordResponse = InvalidPassword | PasswordTooShort | User | UserNotFound;

export type ChangeServerNameResponse = NoPermissions | Server | ServerNameTooLong | ServerNameTooShort | ServerNotFound;

export type Channel = {
  __typename?: 'Channel';
  createdAt: Scalars['Int'];
  id: Scalars['ID'];
  messages: Array<Message>;
  name: Scalars['String'];
  server: Server;
  serverId: Scalars['Int'];
};


export type ChannelMessagesArgs = {
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
};

export type ChannelNameExists = Error & {
  __typename?: 'ChannelNameExists';
  message: Scalars['String'];
};

export type ChannelNameTooLong = Error & {
  __typename?: 'ChannelNameTooLong';
  message: Scalars['String'];
};

export type ChannelNameTooShort = Error & {
  __typename?: 'ChannelNameTooShort';
  message: Scalars['String'];
};

export type ChannelNotFound = Error & {
  __typename?: 'ChannelNotFound';
  message: Scalars['String'];
};

export type ContentTooLong = Error & {
  __typename?: 'ContentTooLong';
  message: Scalars['String'];
};

export type DeclineInvitationResponse = Invitation | InvitationNotFound;

export type DeleteChannelResponse = Channel | ChannelNotFound | NoPermissions;

export type DeleteMemberResponse = Member | MemberNotFound | NoPermissions;

export type DeleteServerResponse = NoPermissions | Server | ServerNotFound;

export type DeleteUserResponse = User | UserNotFound;

export type EmailExists = Error & {
  __typename?: 'EmailExists';
  message: Scalars['String'];
};

export type Error = {
  message: Scalars['String'];
};

export type GetChannelResponse = Channel | ChannelNotFound | NoPermissions;

export type GetMemberResponse = Member | MemberNotFound | NoPermissions;

export type GetMessageResponse = Message | MessageNotFound | NoPermissions;

export type GetServerResponse = NoPermissions | Server | ServerNotFound;

export type GetUserResponse = User | UserNotFound;

export type InvalidLoginData = Error & {
  __typename?: 'InvalidLoginData';
  message: Scalars['String'];
};

export type InvalidPassword = Error & {
  __typename?: 'InvalidPassword';
  message: Scalars['String'];
};

export type Invitation = {
  __typename?: 'Invitation';
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['Int'];
  server: Server;
  serverId: Scalars['Int'];
  user?: Maybe<User>;
  userId: Scalars['Int'];
};

export type InvitationExists = Error & {
  __typename?: 'InvitationExists';
  message: Scalars['String'];
};

export type InvitationNotFound = Error & {
  __typename?: 'InvitationNotFound';
  message: Scalars['String'];
};

export type InviteUserResponse = ContentTooLong | Invitation | InvitationExists | MemberExists | NoPermissions | UserNotFound;

export type LoginResponse = AuthPayload | InvalidLoginData;

export type Member = {
  __typename?: 'Member';
  createdAt: Scalars['Int'];
  email: Scalars['String'];
  id: Scalars['ID'];
  joinedAt: Scalars['Int'];
  name: Scalars['String'];
  role: Role;
  server: Server;
  serverId: Scalars['Int'];
  servers: Array<Server>;
};

export type MemberExists = Error & {
  __typename?: 'MemberExists';
  message: Scalars['String'];
};

export type MemberNotFound = Error & {
  __typename?: 'MemberNotFound';
  message: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  author?: Maybe<Member>;
  authorId: Scalars['Int'];
  channel: Channel;
  channelId: Scalars['Int'];
  content: Scalars['String'];
  createdAt: Scalars['Int'];
  id: Scalars['ID'];
  server: Server;
  serverId: Scalars['Int'];
};

export type MessageEmpty = Error & {
  __typename?: 'MessageEmpty';
  message: Scalars['String'];
};

export type MessageNotFound = Error & {
  __typename?: 'MessageNotFound';
  message: Scalars['String'];
};

export type MessageTooLong = Error & {
  __typename?: 'MessageTooLong';
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: AcceptInvitationResponse;
  addChannel: AddChannelResponse;
  addMessage: AddMessageResponse;
  addServer: AddServerResponse;
  changeChannelName: ChangeChannelNameResponse;
  changeMemberRole: ChangeMemberRoleResponse;
  changePassword: ChangePasswordResponse;
  changeServerName: ChangeServerNameResponse;
  declineInvitation: DeclineInvitationResponse;
  deleteChannel: DeleteChannelResponse;
  deleteServer: DeleteServerResponse;
  deleteUser: DeleteUserResponse;
  inviteUser: InviteUserResponse;
  kickMember: DeleteMemberResponse;
  leaveServer: DeleteMemberResponse;
  login: LoginResponse;
  register: RegisterResponse;
};


export type MutationAcceptInvitationArgs = {
  serverId: Scalars['Int'];
};


export type MutationAddChannelArgs = {
  name: Scalars['String'];
  serverId: Scalars['Int'];
};


export type MutationAddMessageArgs = {
  channelId: Scalars['Int'];
  content: Scalars['String'];
  serverId: Scalars['Int'];
};


export type MutationAddServerArgs = {
  name: Scalars['String'];
};


export type MutationChangeChannelNameArgs = {
  channelId: Scalars['Int'];
  newName: Scalars['String'];
  serverId: Scalars['Int'];
};


export type MutationChangeMemberRoleArgs = {
  newRole: Role;
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationChangeServerNameArgs = {
  newName: Scalars['String'];
  serverId: Scalars['Int'];
};


export type MutationDeclineInvitationArgs = {
  serverId: Scalars['Int'];
};


export type MutationDeleteChannelArgs = {
  channelId: Scalars['Int'];
  serverId: Scalars['Int'];
};


export type MutationDeleteServerArgs = {
  serverId: Scalars['Int'];
};


export type MutationInviteUserArgs = {
  content: Scalars['String'];
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationKickMemberArgs = {
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationLeaveServerArgs = {
  serverId: Scalars['Int'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type NoPermissions = Error & {
  __typename?: 'NoPermissions';
  message: Scalars['String'];
};

export type PasswordTooShort = Error & {
  __typename?: 'PasswordTooShort';
  message: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  channel: GetChannelResponse;
  currentUser: GetUserResponse;
  firstChannel: GetChannelResponse;
  invitations: Array<Invitation>;
  member: GetMemberResponse;
  message: GetMessageResponse;
  messages: Array<Message>;
  server: GetServerResponse;
  user: GetUserResponse;
};


export type QueryChannelArgs = {
  channelId: Scalars['Int'];
  serverId: Scalars['Int'];
};


export type QueryFirstChannelArgs = {
  serverId: Scalars['Int'];
};


export type QueryMemberArgs = {
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type QueryMessageArgs = {
  channelId: Scalars['Int'];
  messageId: Scalars['Int'];
  serverId: Scalars['Int'];
};


export type QueryMessagesArgs = {
  channelId: Scalars['Int'];
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
  serverId: Scalars['Int'];
};


export type QueryServerArgs = {
  serverId: Scalars['Int'];
};


export type QueryUserArgs = {
  username: Scalars['String'];
};

export type RegisterResponse = AuthPayload | EmailExists | PasswordTooShort | UserNameExists;

export enum Role {
  Member = 'MEMBER',
  Moderator = 'MODERATOR',
  Owner = 'OWNER'
}

export type Server = {
  __typename?: 'Server';
  channels: Array<Channel>;
  createdAt: Scalars['Int'];
  id: Scalars['ID'];
  members: Array<Member>;
  name: Scalars['String'];
};

export type ServerNameTooLong = Error & {
  __typename?: 'ServerNameTooLong';
  message: Scalars['String'];
};

export type ServerNameTooShort = Error & {
  __typename?: 'ServerNameTooShort';
  message: Scalars['String'];
};

export type ServerNotFound = Error & {
  __typename?: 'ServerNotFound';
  message: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  deletedChannel: Channel;
  deletedMember: Member;
  deletedServer: Server;
  newChannel: Channel;
  newInvitation: Invitation;
  newMember: Member;
  newMessage: Message;
  updatedChannelName: Channel;
  updatedServerName: Server;
};


export type SubscriptionDeletedChannelArgs = {
  serverId: Scalars['Int'];
};


export type SubscriptionDeletedMemberArgs = {
  serverId: Scalars['Int'];
};


export type SubscriptionDeletedServerArgs = {
  serverId: Scalars['Int'];
};


export type SubscriptionNewChannelArgs = {
  serverId: Scalars['Int'];
};


export type SubscriptionNewMemberArgs = {
  serverId: Scalars['Int'];
};


export type SubscriptionNewMessageArgs = {
  channelId: Scalars['Int'];
  serverId: Scalars['Int'];
};


export type SubscriptionUpdatedChannelNameArgs = {
  serverId: Scalars['Int'];
};


export type SubscriptionUpdatedServerNameArgs = {
  serverId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Int'];
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  servers: Array<Server>;
};

export type UserNameExists = Error & {
  __typename?: 'UserNameExists';
  message: Scalars['String'];
};

export type UserNotFound = Error & {
  __typename?: 'UserNotFound';
  message: Scalars['String'];
};

export type ChatQueryQueryVariables = Exact<{
  serverId: Scalars['Int'];
  channelId: Scalars['Int'];
}>;


export type ChatQueryQuery = { __typename?: 'Query', channel: { __typename: 'Channel', id: string, name: string, server: { __typename?: 'Server', id: string, name: string } } | { __typename: 'ChannelNotFound', message: string } | { __typename: 'NoPermissions', message: string }, messages: Array<(
    { __typename?: 'Message' }
    & { ' $fragmentRefs'?: { 'MessageFragmentFragment': MessageFragmentFragment } }
  )> };

export type MessageFragmentFragment = { __typename?: 'Message', id: string, content: string, createdAt: number, channelId: number, author?: { __typename?: 'Member', id: string, serverId: number, name: string } | null } & { ' $fragmentName'?: 'MessageFragmentFragment' };

export type ChatHeaderQueryQueryVariables = Exact<{
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type ChatHeaderQueryQuery = { __typename?: 'Query', server: { __typename: 'NoPermissions' } | { __typename: 'Server', id: string, name: string } | { __typename: 'ServerNotFound' }, member: { __typename: 'Member', id: string, serverId: number, role: Role } | { __typename: 'MemberNotFound' } | { __typename: 'NoPermissions' } };

export type ServerSidebarQueryQueryVariables = Exact<{
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type ServerSidebarQueryQuery = { __typename?: 'Query', server: { __typename: 'NoPermissions' } | { __typename: 'Server', id: string, name: string, channels: Array<{ __typename?: 'Channel', id: string, name: string }>, members: Array<{ __typename?: 'Member', id: string, serverId: number, name: string, role: Role }> } | { __typename: 'ServerNotFound' }, member: { __typename: 'Member', id: string, serverId: number, role: Role } | { __typename: 'MemberNotFound' } | { __typename: 'NoPermissions' } };

export type UserSidebarQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type UserSidebarQueryQuery = { __typename?: 'Query', currentUser: { __typename: 'User', id: string, name: string, servers: Array<{ __typename?: 'Server', id: string, name: string }> } | { __typename: 'UserNotFound' }, invitations: Array<{ __typename?: 'Invitation', userId: number, serverId: number }> };

export type FindUserQueryQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type FindUserQueryQuery = { __typename?: 'Query', user: { __typename: 'User', id: string } | { __typename: 'UserNotFound', message: string } };

export type FirstChannelQueryQueryVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type FirstChannelQueryQuery = { __typename?: 'Query', firstChannel: { __typename: 'Channel', id: string } | { __typename: 'ChannelNotFound' } | { __typename: 'NoPermissions' } };

export type InvitationsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type InvitationsQueryQuery = { __typename?: 'Query', invitations: Array<{ __typename?: 'Invitation', serverId: number, userId: number, content?: string | null, createdAt: number, server: { __typename?: 'Server', id: string, name: string }, user?: { __typename?: 'User', id: string } | null }> };

export type UserInfoQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type UserInfoQueryQuery = { __typename?: 'Query', currentUser: { __typename: 'User', name: string, email: string, createdAt: number } | { __typename: 'UserNotFound' } };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', currentUser: { __typename: 'User', id: string } | { __typename: 'UserNotFound' } };

export type NewMessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewMessageSubscription = { __typename?: 'Subscription', newMessage: { __typename: 'Message', id: string } };

export type AddChannelMutationVariables = Exact<{ [key: string]: never; }>;


export type AddChannelMutation = { __typename?: 'Mutation', addChannel: { __typename?: 'Channel', id: string } | { __typename?: 'ChannelNameExists' } | { __typename?: 'ChannelNameTooLong' } | { __typename?: 'ChannelNameTooShort' } | { __typename?: 'NoPermissions' } };

export type AddServerMutationVariables = Exact<{ [key: string]: never; }>;


export type AddServerMutation = { __typename?: 'Mutation', addServer: { __typename?: 'Server', id: string } | { __typename?: 'ServerNameTooLong' } | { __typename?: 'ServerNameTooShort' } };

export type DeleteServerMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteServerMutation = { __typename?: 'Mutation', deleteServer: { __typename?: 'NoPermissions' } | { __typename?: 'Server', id: string } | { __typename?: 'ServerNotFound' } };

export type DeleteChannelMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteChannelMutation = { __typename?: 'Mutation', deleteChannel: { __typename?: 'Channel', id: string } | { __typename?: 'ChannelNotFound' } | { __typename?: 'NoPermissions' } };

export type KickMemberMutationVariables = Exact<{ [key: string]: never; }>;


export type KickMemberMutation = { __typename?: 'Mutation', kickMember: { __typename?: 'Member', id: string, serverId: number } | { __typename?: 'MemberNotFound' } | { __typename?: 'NoPermissions' } };

export type LeaveServerMutationVariables = Exact<{ [key: string]: never; }>;


export type LeaveServerMutation = { __typename?: 'Mutation', leaveServer: { __typename?: 'Member', id: string, serverId: number } | { __typename?: 'MemberNotFound' } | { __typename?: 'NoPermissions' } };

export type MessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type MessagesQuery = { __typename?: 'Query', messages: Array<{ __typename: 'Message', id: string }> };

export type NewChannelSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewChannelSubscription = { __typename?: 'Subscription', newChannel: { __typename: 'Channel', id: string } };

export type DeletedServerSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type DeletedServerSubscription = { __typename?: 'Subscription', deletedServer: { __typename: 'Server', id: string } };

export type DeletedChannelSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type DeletedChannelSubscription = { __typename?: 'Subscription', deletedChannel: { __typename: 'Channel', id: string } };

export type DeletedMemberSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type DeletedMemberSubscription = { __typename?: 'Subscription', deletedMember: { __typename: 'Member', id: string, serverId: number } };

export type NewMemberSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewMemberSubscription = { __typename?: 'Subscription', newMember: { __typename: 'Member', id: string, serverId: number } };

export type NewInvitationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewInvitationSubscription = { __typename?: 'Subscription', newInvitation: { __typename: 'Invitation', serverId: number } };

export type AcceptInvitationMutationVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type AcceptInvitationMutation = { __typename?: 'Mutation', acceptInvitation: { __typename: 'Invitation', serverId: number, userId: number } | { __typename: 'InvitationNotFound' } };

export type DeclineInvitationMutationVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type DeclineInvitationMutation = { __typename?: 'Mutation', declineInvitation: { __typename: 'Invitation', serverId: number } | { __typename: 'InvitationNotFound' } };

export type GetServersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetServersQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, servers: Array<{ __typename?: 'Server', id: string }> } | { __typename?: 'UserNotFound' } };

export type GetMembersQueryVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type GetMembersQuery = { __typename?: 'Query', server: { __typename?: 'NoPermissions' } | { __typename?: 'Server', id: string, members: Array<{ __typename?: 'Member', id: string, serverId: number }> } | { __typename?: 'ServerNotFound' } };

export type GetMemberRolesQueryVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type GetMemberRolesQuery = { __typename?: 'Query', server: { __typename?: 'NoPermissions' } | { __typename?: 'Server', id: string, members: Array<{ __typename?: 'Member', id: string, serverId: number, role: Role }> } | { __typename?: 'ServerNotFound' } };

export type GetChannelsQueryVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type GetChannelsQuery = { __typename?: 'Query', server: { __typename?: 'NoPermissions' } | { __typename?: 'Server', id: string, channels: Array<{ __typename?: 'Channel', id: string }> } | { __typename?: 'ServerNotFound' } };

export type GetInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInvitationsQuery = { __typename?: 'Query', invitations: Array<{ __typename?: 'Invitation', serverId: number }> };

export type LogInMutationMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LogInMutationMutation = { __typename?: 'Mutation', login: { __typename: 'AuthPayload', token: string, user: { __typename?: 'User', id: string } } | { __typename: 'InvalidLoginData', message: string } };

export type SendMessageMutationMutationVariables = Exact<{
  channelId: Scalars['Int'];
  serverId: Scalars['Int'];
  content: Scalars['String'];
}>;


export type SendMessageMutationMutation = { __typename?: 'Mutation', addMessage: (
    { __typename: 'Message', id: string }
    & { ' $fragmentRefs'?: { 'MessageFragmentFragment': MessageFragmentFragment } }
  ) | { __typename: 'MessageEmpty', message: string } | { __typename: 'MessageTooLong', message: string } | { __typename: 'NoPermissions', message: string } };

export type ChangeChannelNameMutationMutationVariables = Exact<{
  name: Scalars['String'];
  serverId: Scalars['Int'];
  channelId: Scalars['Int'];
}>;


export type ChangeChannelNameMutationMutation = { __typename?: 'Mutation', changeChannelName: { __typename: 'Channel', id: string, name: string } | { __typename: 'ChannelNameExists', message: string } | { __typename: 'ChannelNameTooLong', message: string } | { __typename: 'ChannelNameTooShort', message: string } | { __typename: 'ChannelNotFound', message: string } | { __typename: 'NoPermissions', message: string } };

export type ChangeMemberRoleMutationMutationVariables = Exact<{
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
  newRole: Role;
}>;


export type ChangeMemberRoleMutationMutation = { __typename?: 'Mutation', changeMemberRole: { __typename: 'Member', id: string, serverId: number, name: string, role: Role } | { __typename: 'MemberNotFound', message: string } | { __typename: 'NoPermissions', message: string } };

export type RegistrationMutationMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegistrationMutationMutation = { __typename?: 'Mutation', register: { __typename: 'AuthPayload', token: string, user: { __typename?: 'User', id: string } } | { __typename: 'EmailExists', message: string } | { __typename: 'PasswordTooShort', message: string } | { __typename: 'UserNameExists', message: string } };

export type ChangeServerNameMutationMutationVariables = Exact<{
  serverId: Scalars['Int'];
  name: Scalars['String'];
}>;


export type ChangeServerNameMutationMutation = { __typename?: 'Mutation', changeServerName: { __typename: 'NoPermissions', message: string } | { __typename: 'Server', id: string, name: string } | { __typename: 'ServerNameTooLong', message: string } | { __typename: 'ServerNameTooShort', message: string } | { __typename: 'ServerNotFound', message: string } };

export type CreateChannelMutationMutationVariables = Exact<{
  name: Scalars['String'];
  serverId: Scalars['Int'];
}>;


export type CreateChannelMutationMutation = { __typename?: 'Mutation', addChannel: { __typename: 'Channel', id: string, name: string } | { __typename: 'ChannelNameExists', message: string } | { __typename: 'ChannelNameTooLong', message: string } | { __typename: 'ChannelNameTooShort', message: string } | { __typename: 'NoPermissions', message: string } };

export type CreateServerMutationMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateServerMutationMutation = { __typename?: 'Mutation', addServer: { __typename: 'Server', id: string, name: string } | { __typename: 'ServerNameTooLong', message: string } | { __typename: 'ServerNameTooShort', message: string } };

export type DeleteChannelMutationMutationVariables = Exact<{
  serverId: Scalars['Int'];
  channelId: Scalars['Int'];
}>;


export type DeleteChannelMutationMutation = { __typename?: 'Mutation', deleteChannel: { __typename: 'Channel', id: string, name: string } | { __typename: 'ChannelNotFound', message: string } | { __typename: 'NoPermissions', message: string } };

export type DeleteMemberMutationMutationVariables = Exact<{
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type DeleteMemberMutationMutation = { __typename?: 'Mutation', kickMember: { __typename: 'Member', id: string, serverId: number, name: string } | { __typename: 'MemberNotFound', message: string } | { __typename: 'NoPermissions', message: string } };

export type DeleteServerMutationMutationVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type DeleteServerMutationMutation = { __typename?: 'Mutation', deleteServer: { __typename: 'NoPermissions', message: string } | { __typename: 'Server', id: string, name: string } | { __typename: 'ServerNotFound', message: string } };

export type InviteUserMutationMutationVariables = Exact<{
  userId: Scalars['Int'];
  serverId: Scalars['Int'];
  content: Scalars['String'];
}>;


export type InviteUserMutationMutation = { __typename?: 'Mutation', inviteUser: { __typename: 'ContentTooLong', message: string } | { __typename: 'Invitation', serverId: number } | { __typename: 'InvitationExists', message: string } | { __typename: 'MemberExists', message: string } | { __typename: 'NoPermissions', message: string } | { __typename: 'UserNotFound', message: string } };

export type LeaveServerMutationMutationVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type LeaveServerMutationMutation = { __typename?: 'Mutation', leaveServer: { __typename: 'Member', id: string, serverId: number } | { __typename: 'MemberNotFound', message: string } | { __typename: 'NoPermissions', message: string } };

export type ChangePasswordMutationMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutationMutation = { __typename?: 'Mutation', changePassword: { __typename: 'InvalidPassword', message: string } | { __typename: 'PasswordTooShort', message: string } | { __typename: 'User', id: string } | { __typename: 'UserNotFound', message: string } };

export type AcceptInvitationMutationMutationVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type AcceptInvitationMutationMutation = { __typename?: 'Mutation', acceptInvitation: { __typename: 'Invitation', serverId: number, userId: number } | { __typename: 'InvitationNotFound', message: string } };

export type DeclineInvitationMutationMutationVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type DeclineInvitationMutationMutation = { __typename?: 'Mutation', declineInvitation: { __typename: 'Invitation', serverId: number, userId: number } | { __typename: 'InvitationNotFound', message: string } };

export type DeleteAccountMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountMutationMutation = { __typename?: 'Mutation', deleteUser: { __typename: 'User', id: string } | { __typename: 'UserNotFound', message: string } };

export type NewChannelSubscriptionSubscriptionVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type NewChannelSubscriptionSubscription = { __typename?: 'Subscription', newChannel: { __typename?: 'Channel', id: string, name: string } };

export type NewMemberSubscriptionSubscriptionVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type NewMemberSubscriptionSubscription = { __typename?: 'Subscription', newMember: { __typename?: 'Member', id: string, serverId: number } };

export type UpdatedServerNameSubscriptionSubscriptionVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type UpdatedServerNameSubscriptionSubscription = { __typename?: 'Subscription', updatedServerName: { __typename?: 'Server', id: string, name: string } };

export type UpdatedChannelNameSubscriptionSubscriptionVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type UpdatedChannelNameSubscriptionSubscription = { __typename?: 'Subscription', updatedChannelName: { __typename?: 'Channel', id: string, name: string } };

export type DeletedServerSubscriptionSubscriptionVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type DeletedServerSubscriptionSubscription = { __typename?: 'Subscription', deletedServer: { __typename?: 'Server', id: string } };

export type DeletedChannelSubscriptionSubscriptionVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type DeletedChannelSubscriptionSubscription = { __typename?: 'Subscription', deletedChannel: { __typename?: 'Channel', id: string } };

export type DeletedMemberSubscriptionSubscriptionVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type DeletedMemberSubscriptionSubscription = { __typename?: 'Subscription', deletedMember: { __typename?: 'Member', id: string, serverId: number } };

export type MessageSubscriptionSubscriptionVariables = Exact<{
  serverId: Scalars['Int'];
  channelId: Scalars['Int'];
}>;


export type MessageSubscriptionSubscription = { __typename?: 'Subscription', newMessage: (
    { __typename?: 'Message' }
    & { ' $fragmentRefs'?: { 'MessageFragmentFragment': MessageFragmentFragment } }
  ) };

export type NewInvitationSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewInvitationSubscriptionSubscription = { __typename?: 'Subscription', newInvitation: { __typename?: 'Invitation', serverId: number } };

export const MessageFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"channelId"}}]}}]} as unknown as DocumentNode<MessageFragmentFragment, unknown>;
export const ChatQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"server"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFragment"}}]}}]}},...MessageFragmentFragmentDoc.definitions]} as unknown as DocumentNode<ChatQueryQuery, ChatQueryQueryVariables>;
export const ChatHeaderQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatHeaderQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"server"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<ChatHeaderQueryQuery, ChatHeaderQueryQueryVariables>;
export const ServerSidebarQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServerSidebarQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"server"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<ServerSidebarQueryQuery, ServerSidebarQueryQueryVariables>;
export const UserSidebarQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserSidebarQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"servers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"invitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]} as unknown as DocumentNode<UserSidebarQueryQuery, UserSidebarQueryQueryVariables>;
export const FindUserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUserQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<FindUserQueryQuery, FindUserQueryQueryVariables>;
export const FirstChannelQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FirstChannelQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<FirstChannelQueryQuery, FirstChannelQueryQueryVariables>;
export const InvitationsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InvitationsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"server"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<InvitationsQueryQuery, InvitationsQueryQueryVariables>;
export const UserInfoQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserInfoQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<UserInfoQueryQuery, UserInfoQueryQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const NewMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<NewMessageSubscription, NewMessageSubscriptionVariables>;
export const AddChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"test","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AddChannelMutation, AddChannelMutationVariables>;
export const AddServerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"test","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AddServerMutation, AddServerMutationVariables>;
export const DeleteServerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteServerMutation, DeleteServerMutationVariables>;
export const DeleteChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const KickMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"KickMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kickMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]}}]} as unknown as DocumentNode<KickMemberMutation, KickMemberMutationVariables>;
export const LeaveServerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LeaveServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]}}]} as unknown as DocumentNode<LeaveServerMutation, LeaveServerMutationVariables>;
export const MessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MessagesQuery, MessagesQueryVariables>;
export const NewChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<NewChannelSubscription, NewChannelSubscriptionVariables>;
export const DeletedServerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"DeletedServer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeletedServerSubscription, DeletedServerSubscriptionVariables>;
export const DeletedChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"DeletedChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeletedChannelSubscription, DeletedChannelSubscriptionVariables>;
export const DeletedMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"DeletedMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]} as unknown as DocumentNode<DeletedMemberSubscription, DeletedMemberSubscriptionVariables>;
export const NewMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]} as unknown as DocumentNode<NewMemberSubscription, NewMemberSubscriptionVariables>;
export const NewInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewInvitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newInvitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]} as unknown as DocumentNode<NewInvitationSubscription, NewInvitationSubscriptionVariables>;
export const AcceptInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Invitation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const DeclineInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeclineInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"declineInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Invitation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]}}]} as unknown as DocumentNode<DeclineInvitationMutation, DeclineInvitationMutationVariables>;
export const GetServersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"servers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetServersQuery, GetServersQueryVariables>;
export const GetMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"server"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMembersQuery, GetMembersQueryVariables>;
export const GetMemberRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMemberRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"server"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMemberRolesQuery, GetMemberRolesQueryVariables>;
export const GetChannelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChannels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"server"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetChannelsQuery, GetChannelsQueryVariables>;
export const GetInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]} as unknown as DocumentNode<GetInvitationsQuery, GetInvitationsQueryVariables>;
export const LogInMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogInMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]}}]} as unknown as DocumentNode<LogInMutationMutation, LogInMutationMutationVariables>;
export const SendMessageMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessageMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFragment"}}]}}]}}]}},...MessageFragmentFragmentDoc.definitions]} as unknown as DocumentNode<SendMessageMutationMutation, SendMessageMutationMutationVariables>;
export const ChangeChannelNameMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeChannelNameMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeChannelName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"newName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ChangeChannelNameMutationMutation, ChangeChannelNameMutationMutationVariables>;
export const ChangeMemberRoleMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeMemberRoleMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newRole"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeMemberRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"newRole"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newRole"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ChangeMemberRoleMutationMutation, ChangeMemberRoleMutationMutationVariables>;
export const RegistrationMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegistrationMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]}}]} as unknown as DocumentNode<RegistrationMutationMutation, RegistrationMutationMutationVariables>;
export const ChangeServerNameMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeServerNameMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeServerName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"newName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ChangeServerNameMutationMutation, ChangeServerNameMutationMutationVariables>;
export const CreateChannelMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChannelMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CreateChannelMutationMutation, CreateChannelMutationMutationVariables>;
export const CreateServerMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateServerMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CreateServerMutationMutation, CreateServerMutationMutationVariables>;
export const DeleteChannelMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteChannelMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteChannelMutationMutation, DeleteChannelMutationMutationVariables>;
export const DeleteMemberMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMemberMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kickMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteMemberMutationMutation, DeleteMemberMutationMutationVariables>;
export const DeleteServerMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteServerMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteServerMutationMutation, DeleteServerMutationMutationVariables>;
export const InviteUserMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InviteUserMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Invitation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<InviteUserMutationMutation, InviteUserMutationMutationVariables>;
export const LeaveServerMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LeaveServerMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LeaveServerMutationMutation, LeaveServerMutationMutationVariables>;
export const ChangePasswordMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePasswordMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<ChangePasswordMutationMutation, ChangePasswordMutationMutationVariables>;
export const AcceptInvitationMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptInvitationMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Invitation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<AcceptInvitationMutationMutation, AcceptInvitationMutationMutationVariables>;
export const DeclineInvitationMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeclineInvitationMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"declineInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Invitation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<DeclineInvitationMutationMutation, DeclineInvitationMutationMutationVariables>;
export const DeleteAccountMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAccountMutation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteAccountMutationMutation, DeleteAccountMutationMutationVariables>;
export const NewChannelSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewChannelSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<NewChannelSubscriptionSubscription, NewChannelSubscriptionSubscriptionVariables>;
export const NewMemberSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewMemberSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]} as unknown as DocumentNode<NewMemberSubscriptionSubscription, NewMemberSubscriptionSubscriptionVariables>;
export const UpdatedServerNameSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UpdatedServerNameSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedServerName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdatedServerNameSubscriptionSubscription, UpdatedServerNameSubscriptionSubscriptionVariables>;
export const UpdatedChannelNameSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UpdatedChannelNameSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedChannelName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdatedChannelNameSubscriptionSubscription, UpdatedChannelNameSubscriptionSubscriptionVariables>;
export const DeletedServerSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"DeletedServerSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeletedServerSubscriptionSubscription, DeletedServerSubscriptionSubscriptionVariables>;
export const DeletedChannelSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"DeletedChannelSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeletedChannelSubscriptionSubscription, DeletedChannelSubscriptionSubscriptionVariables>;
export const DeletedMemberSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"DeletedMemberSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]} as unknown as DocumentNode<DeletedMemberSubscriptionSubscription, DeletedMemberSubscriptionSubscriptionVariables>;
export const MessageSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"MessageSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFragment"}}]}}]}},...MessageFragmentFragmentDoc.definitions]} as unknown as DocumentNode<MessageSubscriptionSubscription, MessageSubscriptionSubscriptionVariables>;
export const NewInvitationSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewInvitationSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newInvitation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverId"}}]}}]}}]} as unknown as DocumentNode<NewInvitationSubscriptionSubscription, NewInvitationSubscriptionSubscriptionVariables>;