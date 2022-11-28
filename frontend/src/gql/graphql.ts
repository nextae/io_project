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

export type AddChannelResponse = Channel | ChannelNameExists | ChannelNameTooLong;

export type AddMemberResponse = Member | MemberExists;

export type AddMessageResponse = Message | MessageTooLong;

export type AddServerResponse = Server | ServerNameTooLong;

export type ChangeChannelNameResponse = Channel | ChannelNameExists | ChannelNameTooLong | ChannelNotFound;

export type ChangeMemberRoleResponse = Member | MemberNotFound;

export type ChangePasswordResponse = InvalidPassword | PasswordTooShort | User;

export type ChangeServerNameResponse = Server | ServerNameTooLong;

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

export type ChannelNotFound = Error & {
  __typename?: 'ChannelNotFound';
  message: Scalars['String'];
};

export type DeleteChannelResponse = Channel | ChannelNotFound;

export type DeleteMemberResponse = Member | MemberNotFound;

export type DeleteServerResponse = Server | ServerNotFound;

export type DeleteUserResponse = User | UserNotFound;

export type EmailExists = Error & {
  __typename?: 'EmailExists';
  message: Scalars['String'];
};

export type Error = {
  message: Scalars['String'];
};

export type GetChannelResponse = Channel | ChannelNotFound;

export type GetMemberResponse = Member | MemberNotFound;

export type GetMessageResponse = Message | MessageNotFound;

export type GetServerResponse = Server | ServerNotFound;

export type GetUserResponse = User | UserNotFound;

export type InvalidLoginData = Error & {
  __typename?: 'InvalidLoginData';
  message: Scalars['String'];
};

export type InvalidPassword = Error & {
  __typename?: 'InvalidPassword';
  message: Scalars['String'];
};

export type LoginResponse = InvalidLoginData | User;

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
  addChannel: AddChannelResponse;
  addMember: AddMemberResponse;
  addMessage: AddMessageResponse;
  addServer: AddServerResponse;
  changeChannelName: ChangeChannelNameResponse;
  changeMemberRole: ChangeMemberRoleResponse;
  changePassword: ChangePasswordResponse;
  changeServerName: ChangeServerNameResponse;
  deleteChannel: DeleteChannelResponse;
  deleteMember: DeleteMemberResponse;
  deleteServer: DeleteServerResponse;
  deleteUser: DeleteUserResponse;
  login: LoginResponse;
  register: RegisterResponse;
};


export type MutationAddChannelArgs = {
  name: Scalars['String'];
  serverId: Scalars['Int'];
};


export type MutationAddMemberArgs = {
  role?: Role;
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationAddMessageArgs = {
  channelId: Scalars['Int'];
  content: Scalars['String'];
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
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
  userId: Scalars['Int'];
};


export type MutationChangeServerNameArgs = {
  newName: Scalars['String'];
  serverId: Scalars['Int'];
};


export type MutationDeleteChannelArgs = {
  channelId: Scalars['Int'];
};


export type MutationDeleteMemberArgs = {
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationDeleteServerArgs = {
  serverId: Scalars['Int'];
};


export type MutationDeleteUserArgs = {
  userId: Scalars['Int'];
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

export type PasswordTooShort = Error & {
  __typename?: 'PasswordTooShort';
  message: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  channel: GetChannelResponse;
  firstChannel: GetChannelResponse;
  member: GetMemberResponse;
  message: GetMessageResponse;
  messages: Array<Message>;
  server: GetServerResponse;
  user: GetUserResponse;
};


export type QueryChannelArgs = {
  channelId: Scalars['Int'];
};


export type QueryFirstChannelArgs = {
  serverId: Scalars['Int'];
};


export type QueryMemberArgs = {
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type QueryMessageArgs = {
  messageId: Scalars['Int'];
};


export type QueryMessagesArgs = {
  channelId: Scalars['Int'];
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
};


export type QueryServerArgs = {
  serverId: Scalars['Int'];
};


export type QueryUserArgs = {
  userId: Scalars['Int'];
};

export type RegisterResponse = EmailExists | PasswordTooShort | User | UserNameExists;

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

export type ServerNotFound = Error & {
  __typename?: 'ServerNotFound';
  message: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage: Message;
  updatedChannelName: Channel;
  updatedServerName: Server;
};


export type SubscriptionNewMessageArgs = {
  channelId: Scalars['Int'];
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

export type LogInMutationMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LogInMutationMutation = { __typename?: 'Mutation', login: { __typename: 'InvalidLoginData', message: string } | { __typename: 'User', id: string } };

export type RegistrationMutationMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegistrationMutationMutation = { __typename?: 'Mutation', register: { __typename: 'EmailExists', message: string } | { __typename: 'PasswordTooShort', message: string } | { __typename: 'User', id: string } | { __typename: 'UserNameExists', message: string } };

export type AddMemberMutationMutationVariables = Exact<{
  userId: Scalars['Int'];
  serverId: Scalars['Int'];
}>;


export type AddMemberMutationMutation = { __typename?: 'Mutation', addMember: { __typename: 'Member', id: string, name: string } | { __typename: 'MemberExists', message: string } };

export type ChatQueryQueryVariables = Exact<{
  channelId: Scalars['Int'];
}>;


export type ChatQueryQuery = { __typename?: 'Query', channel: { __typename: 'Channel', id: string, name: string, server: { __typename?: 'Server', id: string, name: string } } | { __typename: 'ChannelNotFound', message: string }, messages: Array<(
    { __typename?: 'Message' }
    & { ' $fragmentRefs'?: { 'MessageFragmentFragment': MessageFragmentFragment } }
  )> };

export type MessageSubscriptionSubscriptionVariables = Exact<{
  channelId: Scalars['Int'];
}>;


export type MessageSubscriptionSubscription = { __typename?: 'Subscription', newMessage: (
    { __typename?: 'Message' }
    & { ' $fragmentRefs'?: { 'MessageFragmentFragment': MessageFragmentFragment } }
  ) };

export type ChatHeaderQueryQueryVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type ChatHeaderQueryQuery = { __typename?: 'Query', server: { __typename: 'Server', id: string, name: string } | { __typename: 'ServerNotFound' } };

export type SendMessageMutationMutationVariables = Exact<{
  channelId: Scalars['Int'];
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
  content: Scalars['String'];
}>;


export type SendMessageMutationMutation = { __typename?: 'Mutation', addMessage: (
    { __typename: 'Message' }
    & { ' $fragmentRefs'?: { 'MessageFragmentFragment': MessageFragmentFragment } }
  ) | { __typename: 'MessageTooLong', message: string } };

export type MessageFragmentFragment = { __typename?: 'Message', id: string, content: string, createdAt: number, channelId: number, author?: { __typename?: 'Member', id: string, name: string } | null } & { ' $fragmentName'?: 'MessageFragmentFragment' };

export type CreateChannelMutationMutationVariables = Exact<{
  name: Scalars['String'];
  serverId: Scalars['Int'];
}>;


export type CreateChannelMutationMutation = { __typename?: 'Mutation', addChannel: { __typename: 'Channel', id: string, name: string } | { __typename: 'ChannelNameExists', message: string } | { __typename: 'ChannelNameTooLong', message: string } };

export type CreateServerMutationMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateServerMutationMutation = { __typename?: 'Mutation', addServer: { __typename: 'Server', id: string, name: string } | { __typename: 'ServerNameTooLong', message: string } };

export type AddServerOwnerMutationMutationVariables = Exact<{
  serverId: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type AddServerOwnerMutationMutation = { __typename?: 'Mutation', addMember: { __typename: 'Member', id: string, name: string } | { __typename: 'MemberExists', message: string } };

export type ServerSidebarQueryQueryVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type ServerSidebarQueryQuery = { __typename?: 'Query', server: { __typename: 'Server', id: string, name: string, channels: Array<{ __typename?: 'Channel', id: string, name: string }>, members: Array<{ __typename?: 'Member', id: string, name: string }> } | { __typename: 'ServerNotFound' } };

export type UserSidebarQueryQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type UserSidebarQueryQuery = { __typename?: 'Query', user: { __typename: 'User', id: string, name: string, servers: Array<{ __typename?: 'Server', id: string, name: string }> } | { __typename: 'UserNotFound' } };

export type GetServersQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type GetServersQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, servers: Array<{ __typename?: 'Server', id: string }> } | { __typename?: 'UserNotFound' } };

export type GetMembersQueryVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type GetMembersQuery = { __typename?: 'Query', server: { __typename?: 'Server', id: string, members: Array<{ __typename?: 'Member', id: string }> } | { __typename?: 'ServerNotFound' } };

export type GetChannelsQueryVariables = Exact<{
  serverId: Scalars['Int'];
}>;


export type GetChannelsQuery = { __typename?: 'Query', server: { __typename?: 'Server', id: string, channels: Array<{ __typename?: 'Channel', id: string }> } | { __typename?: 'ServerNotFound' } };

export const MessageFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"channelId"}}]}}]} as unknown as DocumentNode<MessageFragmentFragment, unknown>;
export const LogInMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogInMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<LogInMutationMutation, LogInMutationMutationVariables>;
export const RegistrationMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegistrationMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RegistrationMutationMutation, RegistrationMutationMutationVariables>;
export const AddMemberMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMemberMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<AddMemberMutationMutation, AddMemberMutationMutationVariables>;
export const ChatQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"server"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFragment"}}]}}]}},...MessageFragmentFragmentDoc.definitions]} as unknown as DocumentNode<ChatQueryQuery, ChatQueryQueryVariables>;
export const MessageSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"MessageSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFragment"}}]}}]}},...MessageFragmentFragmentDoc.definitions]} as unknown as DocumentNode<MessageSubscriptionSubscription, MessageSubscriptionSubscriptionVariables>;
export const ChatHeaderQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatHeaderQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"server"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ChatHeaderQueryQuery, ChatHeaderQueryQueryVariables>;
export const SendMessageMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessageMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFragment"}}]}}]}}]}},...MessageFragmentFragmentDoc.definitions]} as unknown as DocumentNode<SendMessageMutationMutation, SendMessageMutationMutationVariables>;
export const CreateChannelMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChannelMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CreateChannelMutationMutation, CreateChannelMutationMutationVariables>;
export const CreateServerMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateServerMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addServer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<CreateServerMutationMutation, CreateServerMutationMutationVariables>;
export const AddServerOwnerMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddServerOwnerMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"EnumValue","value":"OWNER"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Member"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<AddServerOwnerMutationMutation, AddServerOwnerMutationMutationVariables>;
export const ServerSidebarQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServerSidebarQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"server"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ServerSidebarQueryQuery, ServerSidebarQueryQueryVariables>;
export const UserSidebarQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserSidebarQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"servers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserSidebarQueryQuery, UserSidebarQueryQueryVariables>;
export const GetServersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetServers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"servers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetServersQuery, GetServersQueryVariables>;
export const GetMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"server"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMembersQuery, GetMembersQueryVariables>;
export const GetChannelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChannels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"server"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serverId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Server"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetChannelsQuery, GetChannelsQueryVariables>;