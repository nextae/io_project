/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  query ChatQuery($serverId: Int!, $channelId: Int!) {\n    channel(serverId: $serverId, channelId: $channelId) {\n      __typename\n      ... on Channel {\n        id\n        name\n        server {\n          id\n          name\n        }\n      }\n      ... on Error {\n        message\n      }\n    }\n\n    messages(serverId: $serverId, channelId: $channelId) {\n      ...MessageFragment\n    }\n  }\n": types.ChatQueryDocument,
    "\n  fragment MessageFragment on Message {\n    id\n    content\n    author {\n      id\n      serverId\n      name\n    }\n    createdAt\n    channelId\n  }\n": types.MessageFragmentFragmentDoc,
    "\n  query ChatHeaderQuery($serverId: Int!, $userId: Int!) {\n    server(serverId: $serverId) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n    }\n\n    member(serverId: $serverId, userId: $userId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        role\n      }\n    }\n  }\n": types.ChatHeaderQueryDocument,
    "\n  query ServerSidebarQuery($serverId: Int!, $userId: Int!) {\n    server(serverId: $serverId) {\n      __typename\n      ... on Server {\n        id\n        name\n        channels {\n          id\n          name\n        }\n        members {\n          id\n          serverId\n          name\n          role\n        }\n      }\n    }\n\n    member(serverId: $serverId, userId: $userId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        role\n      }\n    }\n  }\n": types.ServerSidebarQueryDocument,
    "\n  query UserSidebarQuery {\n    currentUser {\n      __typename\n      ... on User {\n        id\n        name\n        servers {\n          id\n          name\n        }\n      }\n    }\n    invitations {\n      userId\n      serverId\n    }\n  }\n": types.UserSidebarQueryDocument,
    "\n  query FindUserQuery($name: String!) {\n    user(username: $name) {\n      __typename\n      ... on User {\n        id\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.FindUserQueryDocument,
    "\n  query FirstChannelQuery($serverId: Int!) {\n    firstChannel(serverId: $serverId) {\n      __typename\n      ... on Channel {\n        id\n      }\n    }\n  }\n": types.FirstChannelQueryDocument,
    "\n  query InvitationsQuery {\n    invitations {\n      serverId\n      userId\n      content\n      createdAt\n      server {\n        id\n        name\n      }\n      user {\n        id\n      }\n    }\n  }\n": types.InvitationsQueryDocument,
    "\n  query UserInfoQuery {\n    currentUser {\n      __typename\n      ... on User {\n        name\n        email\n        createdAt\n      }\n    }\n  }\n": types.UserInfoQueryDocument,
    "\n          query User {\n            currentUser {\n              __typename\n              ... on User {\n                id\n              }\n            }\n          }\n        ": types.UserDocument,
    "\n            subscription NewMessage {\n              newMessage(channelId: 0, serverId: 0) {\n                __typename\n                id\n              }\n            }\n          ": types.NewMessageDocument,
    "\n          mutation AddChannel {\n            addChannel(serverId: 0, name: \"test\") {\n              ... on Channel {\n                id\n              }\n            }\n          }\n        ": types.AddChannelDocument,
    "\n          mutation AddServer {\n            addServer(name: \"test\") {\n              ... on Server {\n                id\n              }\n            }\n          }\n        ": types.AddServerDocument,
    "\n          mutation DeleteServer {\n            deleteServer(serverId: 0) {\n              ... on Server {\n                id\n              }\n            }\n          }\n        ": types.DeleteServerDocument,
    "\n          mutation DeleteChannel {\n            deleteChannel(serverId: 0, channelId: 0) {\n              ... on Channel {\n                id\n              }\n            }\n          }\n        ": types.DeleteChannelDocument,
    "\n          mutation KickMember {\n            kickMember(serverId: 0, userId: 1) {\n              ... on Member {\n                id\n                serverId\n              }\n            }\n          }\n        ": types.KickMemberDocument,
    "\n          mutation LeaveServer {\n            leaveServer(serverId: 0) {\n              ... on Member {\n                id\n                serverId\n              }\n            }\n          }\n        ": types.LeaveServerDocument,
    "\n          query Messages {\n            messages(channelId: 0, serverId: 0) {\n              __typename\n              id\n            }\n          }\n        ": types.MessagesDocument,
    "\n        query Messages {\n          messages(channelId: 0, serverId: 0) {\n            __typename\n            id\n          }\n        }\n      ": types.MessagesDocument,
    "\n            subscription NewChannel {\n              newChannel(serverId: 0) {\n                __typename\n                id\n              }\n            }\n          ": types.NewChannelDocument,
    "\n            subscription DeletedServer {\n              deletedServer(serverId: 0) {\n                ... on Server {\n                  __typename\n                  id\n                }\n              }\n            }\n          ": types.DeletedServerDocument,
    "\n            subscription DeletedChannel {\n              deletedChannel(serverId: 0) {\n                __typename\n                id\n              }\n            }\n          ": types.DeletedChannelDocument,
    "\n            subscription DeletedMember {\n              deletedMember(serverId: 0) {\n                __typename\n                id\n                serverId\n              }\n            }\n          ": types.DeletedMemberDocument,
    "\n            subscription NewMember {\n              newMember(serverId: 0) {\n                __typename\n                id\n                serverId\n              }\n            }\n          ": types.NewMemberDocument,
    "\n            subscription NewInvitation {\n              newInvitation {\n                __typename\n                serverId\n              }\n            }\n          ": types.NewInvitationDocument,
    "\n          mutation AcceptInvitation($serverId: Int!) {\n            acceptInvitation(serverId: $serverId) {\n              __typename\n              ... on Invitation {\n                serverId\n                userId\n              }\n            }\n          }\n        ": types.AcceptInvitationDocument,
    "\n          mutation DeclineInvitation($serverId: Int!) {\n            declineInvitation(serverId: $serverId) {\n              __typename\n              ... on Invitation {\n                serverId\n              }\n            }\n          }\n        ": types.DeclineInvitationDocument,
    "\n  query GetServers {\n    currentUser {\n      ... on User {\n        id\n        servers {\n          id\n        }\n      }\n    }\n  }\n": types.GetServersDocument,
    "\n  query GetMembers($serverId: Int!) {\n    server(serverId: $serverId) {\n      ... on Server {\n        id\n        members {\n          id\n          serverId\n        }\n      }\n    }\n  }\n": types.GetMembersDocument,
    "\n  query GetMemberRoles($serverId: Int!) {\n    server(serverId: $serverId) {\n      ... on Server {\n        id\n        members {\n          id\n          serverId\n          role\n        }\n      }\n    }\n  }\n": types.GetMemberRolesDocument,
    "\n  query GetChannels($serverId: Int!) {\n    server(serverId: $serverId) {\n      ... on Server {\n        id\n        channels {\n          id\n        }\n      }\n    }\n  }\n": types.GetChannelsDocument,
    "\n  query GetInvitations {\n    invitations {\n      serverId\n    }\n  }\n": types.GetInvitationsDocument,
    "\n  mutation LogInMutation($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      __typename\n      ... on Error {\n        message\n      }\n      ... on AuthPayload {\n        user {\n          id\n        }\n        token\n      }\n    }\n  }\n": types.LogInMutationDocument,
    "\n  mutation SendMessageMutation(\n    $channelId: Int!\n    $serverId: Int!\n    $content: String!\n  ) {\n    addMessage(channelId: $channelId, serverId: $serverId, content: $content) {\n      __typename\n      ... on Error {\n        message\n      }\n      ... on Message {\n        id\n        ...MessageFragment\n      }\n    }\n  }\n": types.SendMessageMutationDocument,
    "\n  mutation ChangeChannelNameMutation(\n    $name: String!\n    $serverId: Int!\n    $channelId: Int!\n  ) {\n    changeChannelName(\n      serverId: $serverId\n      channelId: $channelId\n      newName: $name\n    ) {\n      __typename\n      ... on Channel {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.ChangeChannelNameMutationDocument,
    "\n  mutation ChangeMemberRoleMutation(\n    $serverId: Int!\n    $userId: Int!\n    $newRole: Role!\n  ) {\n    changeMemberRole(serverId: $serverId, userId: $userId, newRole: $newRole) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        name\n        role\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.ChangeMemberRoleMutationDocument,
    "\n  mutation RegistrationMutation(\n    $username: String!\n    $password: String!\n    $email: String!\n  ) {\n    register(username: $username, password: $password, email: $email) {\n      __typename\n      ... on Error {\n        message\n      }\n      ... on AuthPayload {\n        user {\n          id\n        }\n        token\n      }\n    }\n  }\n": types.RegistrationMutationDocument,
    "\n  mutation ChangeServerNameMutation($serverId: Int!, $name: String!) {\n    changeServerName(serverId: $serverId, newName: $name) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.ChangeServerNameMutationDocument,
    "\n  mutation CreateChannelMutation($name: String!, $serverId: Int!) {\n    addChannel(name: $name, serverId: $serverId) {\n      __typename\n      ... on Channel {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.CreateChannelMutationDocument,
    "\n  mutation CreateServerMutation($name: String!) {\n    addServer(name: $name) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.CreateServerMutationDocument,
    "\n  mutation DeleteChannelMutation($serverId: Int!, $channelId: Int!) {\n    deleteChannel(serverId: $serverId, channelId: $channelId) {\n      __typename\n      ... on Channel {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.DeleteChannelMutationDocument,
    "\n  mutation DeleteMemberMutation($serverId: Int!, $userId: Int!) {\n    kickMember(serverId: $serverId, userId: $userId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.DeleteMemberMutationDocument,
    "\n  mutation DeleteServerMutation($serverId: Int!) {\n    deleteServer(serverId: $serverId) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.DeleteServerMutationDocument,
    "\n  mutation InviteUserMutation(\n    $userId: Int!\n    $serverId: Int!\n    $content: String!\n  ) {\n    inviteUser(userId: $userId, serverId: $serverId, content: $content) {\n      __typename\n      ... on Invitation {\n        serverId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.InviteUserMutationDocument,
    "\n  mutation LeaveServerMutation($serverId: Int!) {\n    leaveServer(serverId: $serverId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.LeaveServerMutationDocument,
    "\n  mutation ChangePasswordMutation(\n    $oldPassword: String!\n    $newPassword: String!\n  ) {\n    changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {\n      __typename\n      ... on User {\n        id\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.ChangePasswordMutationDocument,
    "\n  mutation AcceptInvitationMutation($serverId: Int!) {\n    acceptInvitation(serverId: $serverId) {\n      __typename\n      ... on Invitation {\n        serverId\n        userId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.AcceptInvitationMutationDocument,
    "\n  mutation DeclineInvitationMutation($serverId: Int!) {\n    declineInvitation(serverId: $serverId) {\n      __typename\n      ... on Invitation {\n        serverId\n        userId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.DeclineInvitationMutationDocument,
    "\n  mutation DeleteAccountMutation {\n    deleteUser {\n      __typename\n      ... on User {\n        id\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.DeleteAccountMutationDocument,
    "\n  subscription NewChannelSubscription($serverId: Int!) {\n    newChannel(serverId: $serverId) {\n      id\n      name\n    }\n  }\n": types.NewChannelSubscriptionDocument,
    "\n  subscription NewMemberSubscription($serverId: Int!) {\n    newMember(serverId: $serverId) {\n      id\n      serverId\n    }\n  }\n": types.NewMemberSubscriptionDocument,
    "\n  subscription UpdatedServerNameSubscription($serverId: Int!) {\n    updatedServerName(serverId: $serverId) {\n      id\n      name\n    }\n  }\n": types.UpdatedServerNameSubscriptionDocument,
    "\n  subscription UpdatedChannelNameSubscription($serverId: Int!) {\n    updatedChannelName(serverId: $serverId) {\n      id\n      name\n    }\n  }\n": types.UpdatedChannelNameSubscriptionDocument,
    "\n  subscription DeletedServerSubscription($serverId: Int!) {\n    deletedServer(serverId: $serverId) {\n      id\n    }\n  }\n": types.DeletedServerSubscriptionDocument,
    "\n  subscription DeletedChannelSubscription($serverId: Int!) {\n    deletedChannel(serverId: $serverId) {\n      id\n    }\n  }\n": types.DeletedChannelSubscriptionDocument,
    "\n  subscription DeletedMemberSubscription($serverId: Int!) {\n    deletedMember(serverId: $serverId) {\n      id\n      serverId\n    }\n  }\n": types.DeletedMemberSubscriptionDocument,
    "\n  subscription MessageSubscription($serverId: Int!, $channelId: Int!) {\n    newMessage(serverId: $serverId, channelId: $channelId) {\n      ...MessageFragment\n    }\n  }\n": types.MessageSubscriptionDocument,
    "\n  subscription NewInvitationSubscription {\n    newInvitation {\n      serverId\n    }\n  }\n": types.NewInvitationSubscriptionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ChatQuery($serverId: Int!, $channelId: Int!) {\n    channel(serverId: $serverId, channelId: $channelId) {\n      __typename\n      ... on Channel {\n        id\n        name\n        server {\n          id\n          name\n        }\n      }\n      ... on Error {\n        message\n      }\n    }\n\n    messages(serverId: $serverId, channelId: $channelId) {\n      ...MessageFragment\n    }\n  }\n"): (typeof documents)["\n  query ChatQuery($serverId: Int!, $channelId: Int!) {\n    channel(serverId: $serverId, channelId: $channelId) {\n      __typename\n      ... on Channel {\n        id\n        name\n        server {\n          id\n          name\n        }\n      }\n      ... on Error {\n        message\n      }\n    }\n\n    messages(serverId: $serverId, channelId: $channelId) {\n      ...MessageFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MessageFragment on Message {\n    id\n    content\n    author {\n      id\n      serverId\n      name\n    }\n    createdAt\n    channelId\n  }\n"): (typeof documents)["\n  fragment MessageFragment on Message {\n    id\n    content\n    author {\n      id\n      serverId\n      name\n    }\n    createdAt\n    channelId\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ChatHeaderQuery($serverId: Int!, $userId: Int!) {\n    server(serverId: $serverId) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n    }\n\n    member(serverId: $serverId, userId: $userId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  query ChatHeaderQuery($serverId: Int!, $userId: Int!) {\n    server(serverId: $serverId) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n    }\n\n    member(serverId: $serverId, userId: $userId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        role\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ServerSidebarQuery($serverId: Int!, $userId: Int!) {\n    server(serverId: $serverId) {\n      __typename\n      ... on Server {\n        id\n        name\n        channels {\n          id\n          name\n        }\n        members {\n          id\n          serverId\n          name\n          role\n        }\n      }\n    }\n\n    member(serverId: $serverId, userId: $userId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  query ServerSidebarQuery($serverId: Int!, $userId: Int!) {\n    server(serverId: $serverId) {\n      __typename\n      ... on Server {\n        id\n        name\n        channels {\n          id\n          name\n        }\n        members {\n          id\n          serverId\n          name\n          role\n        }\n      }\n    }\n\n    member(serverId: $serverId, userId: $userId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        role\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserSidebarQuery {\n    currentUser {\n      __typename\n      ... on User {\n        id\n        name\n        servers {\n          id\n          name\n        }\n      }\n    }\n    invitations {\n      userId\n      serverId\n    }\n  }\n"): (typeof documents)["\n  query UserSidebarQuery {\n    currentUser {\n      __typename\n      ... on User {\n        id\n        name\n        servers {\n          id\n          name\n        }\n      }\n    }\n    invitations {\n      userId\n      serverId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FindUserQuery($name: String!) {\n    user(username: $name) {\n      __typename\n      ... on User {\n        id\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  query FindUserQuery($name: String!) {\n    user(username: $name) {\n      __typename\n      ... on User {\n        id\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FirstChannelQuery($serverId: Int!) {\n    firstChannel(serverId: $serverId) {\n      __typename\n      ... on Channel {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query FirstChannelQuery($serverId: Int!) {\n    firstChannel(serverId: $serverId) {\n      __typename\n      ... on Channel {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query InvitationsQuery {\n    invitations {\n      serverId\n      userId\n      content\n      createdAt\n      server {\n        id\n        name\n      }\n      user {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query InvitationsQuery {\n    invitations {\n      serverId\n      userId\n      content\n      createdAt\n      server {\n        id\n        name\n      }\n      user {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserInfoQuery {\n    currentUser {\n      __typename\n      ... on User {\n        name\n        email\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query UserInfoQuery {\n    currentUser {\n      __typename\n      ... on User {\n        name\n        email\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query User {\n            currentUser {\n              __typename\n              ... on User {\n                id\n              }\n            }\n          }\n        "): (typeof documents)["\n          query User {\n            currentUser {\n              __typename\n              ... on User {\n                id\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n            subscription NewMessage {\n              newMessage(channelId: 0, serverId: 0) {\n                __typename\n                id\n              }\n            }\n          "): (typeof documents)["\n            subscription NewMessage {\n              newMessage(channelId: 0, serverId: 0) {\n                __typename\n                id\n              }\n            }\n          "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation AddChannel {\n            addChannel(serverId: 0, name: \"test\") {\n              ... on Channel {\n                id\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation AddChannel {\n            addChannel(serverId: 0, name: \"test\") {\n              ... on Channel {\n                id\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation AddServer {\n            addServer(name: \"test\") {\n              ... on Server {\n                id\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation AddServer {\n            addServer(name: \"test\") {\n              ... on Server {\n                id\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation DeleteServer {\n            deleteServer(serverId: 0) {\n              ... on Server {\n                id\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation DeleteServer {\n            deleteServer(serverId: 0) {\n              ... on Server {\n                id\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation DeleteChannel {\n            deleteChannel(serverId: 0, channelId: 0) {\n              ... on Channel {\n                id\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation DeleteChannel {\n            deleteChannel(serverId: 0, channelId: 0) {\n              ... on Channel {\n                id\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation KickMember {\n            kickMember(serverId: 0, userId: 1) {\n              ... on Member {\n                id\n                serverId\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation KickMember {\n            kickMember(serverId: 0, userId: 1) {\n              ... on Member {\n                id\n                serverId\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation LeaveServer {\n            leaveServer(serverId: 0) {\n              ... on Member {\n                id\n                serverId\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation LeaveServer {\n            leaveServer(serverId: 0) {\n              ... on Member {\n                id\n                serverId\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query Messages {\n            messages(channelId: 0, serverId: 0) {\n              __typename\n              id\n            }\n          }\n        "): (typeof documents)["\n          query Messages {\n            messages(channelId: 0, serverId: 0) {\n              __typename\n              id\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query Messages {\n          messages(channelId: 0, serverId: 0) {\n            __typename\n            id\n          }\n        }\n      "): (typeof documents)["\n        query Messages {\n          messages(channelId: 0, serverId: 0) {\n            __typename\n            id\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n            subscription NewChannel {\n              newChannel(serverId: 0) {\n                __typename\n                id\n              }\n            }\n          "): (typeof documents)["\n            subscription NewChannel {\n              newChannel(serverId: 0) {\n                __typename\n                id\n              }\n            }\n          "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n            subscription DeletedServer {\n              deletedServer(serverId: 0) {\n                ... on Server {\n                  __typename\n                  id\n                }\n              }\n            }\n          "): (typeof documents)["\n            subscription DeletedServer {\n              deletedServer(serverId: 0) {\n                ... on Server {\n                  __typename\n                  id\n                }\n              }\n            }\n          "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n            subscription DeletedChannel {\n              deletedChannel(serverId: 0) {\n                __typename\n                id\n              }\n            }\n          "): (typeof documents)["\n            subscription DeletedChannel {\n              deletedChannel(serverId: 0) {\n                __typename\n                id\n              }\n            }\n          "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n            subscription DeletedMember {\n              deletedMember(serverId: 0) {\n                __typename\n                id\n                serverId\n              }\n            }\n          "): (typeof documents)["\n            subscription DeletedMember {\n              deletedMember(serverId: 0) {\n                __typename\n                id\n                serverId\n              }\n            }\n          "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n            subscription NewMember {\n              newMember(serverId: 0) {\n                __typename\n                id\n                serverId\n              }\n            }\n          "): (typeof documents)["\n            subscription NewMember {\n              newMember(serverId: 0) {\n                __typename\n                id\n                serverId\n              }\n            }\n          "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n            subscription NewInvitation {\n              newInvitation {\n                __typename\n                serverId\n              }\n            }\n          "): (typeof documents)["\n            subscription NewInvitation {\n              newInvitation {\n                __typename\n                serverId\n              }\n            }\n          "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation AcceptInvitation($serverId: Int!) {\n            acceptInvitation(serverId: $serverId) {\n              __typename\n              ... on Invitation {\n                serverId\n                userId\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation AcceptInvitation($serverId: Int!) {\n            acceptInvitation(serverId: $serverId) {\n              __typename\n              ... on Invitation {\n                serverId\n                userId\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          mutation DeclineInvitation($serverId: Int!) {\n            declineInvitation(serverId: $serverId) {\n              __typename\n              ... on Invitation {\n                serverId\n              }\n            }\n          }\n        "): (typeof documents)["\n          mutation DeclineInvitation($serverId: Int!) {\n            declineInvitation(serverId: $serverId) {\n              __typename\n              ... on Invitation {\n                serverId\n              }\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetServers {\n    currentUser {\n      ... on User {\n        id\n        servers {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetServers {\n    currentUser {\n      ... on User {\n        id\n        servers {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMembers($serverId: Int!) {\n    server(serverId: $serverId) {\n      ... on Server {\n        id\n        members {\n          id\n          serverId\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMembers($serverId: Int!) {\n    server(serverId: $serverId) {\n      ... on Server {\n        id\n        members {\n          id\n          serverId\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMemberRoles($serverId: Int!) {\n    server(serverId: $serverId) {\n      ... on Server {\n        id\n        members {\n          id\n          serverId\n          role\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMemberRoles($serverId: Int!) {\n    server(serverId: $serverId) {\n      ... on Server {\n        id\n        members {\n          id\n          serverId\n          role\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetChannels($serverId: Int!) {\n    server(serverId: $serverId) {\n      ... on Server {\n        id\n        channels {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetChannels($serverId: Int!) {\n    server(serverId: $serverId) {\n      ... on Server {\n        id\n        channels {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetInvitations {\n    invitations {\n      serverId\n    }\n  }\n"): (typeof documents)["\n  query GetInvitations {\n    invitations {\n      serverId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LogInMutation($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      __typename\n      ... on Error {\n        message\n      }\n      ... on AuthPayload {\n        user {\n          id\n        }\n        token\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LogInMutation($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      __typename\n      ... on Error {\n        message\n      }\n      ... on AuthPayload {\n        user {\n          id\n        }\n        token\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendMessageMutation(\n    $channelId: Int!\n    $serverId: Int!\n    $content: String!\n  ) {\n    addMessage(channelId: $channelId, serverId: $serverId, content: $content) {\n      __typename\n      ... on Error {\n        message\n      }\n      ... on Message {\n        id\n        ...MessageFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SendMessageMutation(\n    $channelId: Int!\n    $serverId: Int!\n    $content: String!\n  ) {\n    addMessage(channelId: $channelId, serverId: $serverId, content: $content) {\n      __typename\n      ... on Error {\n        message\n      }\n      ... on Message {\n        id\n        ...MessageFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeChannelNameMutation(\n    $name: String!\n    $serverId: Int!\n    $channelId: Int!\n  ) {\n    changeChannelName(\n      serverId: $serverId\n      channelId: $channelId\n      newName: $name\n    ) {\n      __typename\n      ... on Channel {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeChannelNameMutation(\n    $name: String!\n    $serverId: Int!\n    $channelId: Int!\n  ) {\n    changeChannelName(\n      serverId: $serverId\n      channelId: $channelId\n      newName: $name\n    ) {\n      __typename\n      ... on Channel {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeMemberRoleMutation(\n    $serverId: Int!\n    $userId: Int!\n    $newRole: Role!\n  ) {\n    changeMemberRole(serverId: $serverId, userId: $userId, newRole: $newRole) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        name\n        role\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeMemberRoleMutation(\n    $serverId: Int!\n    $userId: Int!\n    $newRole: Role!\n  ) {\n    changeMemberRole(serverId: $serverId, userId: $userId, newRole: $newRole) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        name\n        role\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RegistrationMutation(\n    $username: String!\n    $password: String!\n    $email: String!\n  ) {\n    register(username: $username, password: $password, email: $email) {\n      __typename\n      ... on Error {\n        message\n      }\n      ... on AuthPayload {\n        user {\n          id\n        }\n        token\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RegistrationMutation(\n    $username: String!\n    $password: String!\n    $email: String!\n  ) {\n    register(username: $username, password: $password, email: $email) {\n      __typename\n      ... on Error {\n        message\n      }\n      ... on AuthPayload {\n        user {\n          id\n        }\n        token\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeServerNameMutation($serverId: Int!, $name: String!) {\n    changeServerName(serverId: $serverId, newName: $name) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeServerNameMutation($serverId: Int!, $name: String!) {\n    changeServerName(serverId: $serverId, newName: $name) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateChannelMutation($name: String!, $serverId: Int!) {\n    addChannel(name: $name, serverId: $serverId) {\n      __typename\n      ... on Channel {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateChannelMutation($name: String!, $serverId: Int!) {\n    addChannel(name: $name, serverId: $serverId) {\n      __typename\n      ... on Channel {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateServerMutation($name: String!) {\n    addServer(name: $name) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateServerMutation($name: String!) {\n    addServer(name: $name) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteChannelMutation($serverId: Int!, $channelId: Int!) {\n    deleteChannel(serverId: $serverId, channelId: $channelId) {\n      __typename\n      ... on Channel {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteChannelMutation($serverId: Int!, $channelId: Int!) {\n    deleteChannel(serverId: $serverId, channelId: $channelId) {\n      __typename\n      ... on Channel {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteMemberMutation($serverId: Int!, $userId: Int!) {\n    kickMember(serverId: $serverId, userId: $userId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteMemberMutation($serverId: Int!, $userId: Int!) {\n    kickMember(serverId: $serverId, userId: $userId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteServerMutation($serverId: Int!) {\n    deleteServer(serverId: $serverId) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteServerMutation($serverId: Int!) {\n    deleteServer(serverId: $serverId) {\n      __typename\n      ... on Server {\n        id\n        name\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InviteUserMutation(\n    $userId: Int!\n    $serverId: Int!\n    $content: String!\n  ) {\n    inviteUser(userId: $userId, serverId: $serverId, content: $content) {\n      __typename\n      ... on Invitation {\n        serverId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation InviteUserMutation(\n    $userId: Int!\n    $serverId: Int!\n    $content: String!\n  ) {\n    inviteUser(userId: $userId, serverId: $serverId, content: $content) {\n      __typename\n      ... on Invitation {\n        serverId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LeaveServerMutation($serverId: Int!) {\n    leaveServer(serverId: $serverId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LeaveServerMutation($serverId: Int!) {\n    leaveServer(serverId: $serverId) {\n      __typename\n      ... on Member {\n        id\n        serverId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangePasswordMutation(\n    $oldPassword: String!\n    $newPassword: String!\n  ) {\n    changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {\n      __typename\n      ... on User {\n        id\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ChangePasswordMutation(\n    $oldPassword: String!\n    $newPassword: String!\n  ) {\n    changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {\n      __typename\n      ... on User {\n        id\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AcceptInvitationMutation($serverId: Int!) {\n    acceptInvitation(serverId: $serverId) {\n      __typename\n      ... on Invitation {\n        serverId\n        userId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AcceptInvitationMutation($serverId: Int!) {\n    acceptInvitation(serverId: $serverId) {\n      __typename\n      ... on Invitation {\n        serverId\n        userId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeclineInvitationMutation($serverId: Int!) {\n    declineInvitation(serverId: $serverId) {\n      __typename\n      ... on Invitation {\n        serverId\n        userId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeclineInvitationMutation($serverId: Int!) {\n    declineInvitation(serverId: $serverId) {\n      __typename\n      ... on Invitation {\n        serverId\n        userId\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteAccountMutation {\n    deleteUser {\n      __typename\n      ... on User {\n        id\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteAccountMutation {\n    deleteUser {\n      __typename\n      ... on User {\n        id\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription NewChannelSubscription($serverId: Int!) {\n    newChannel(serverId: $serverId) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  subscription NewChannelSubscription($serverId: Int!) {\n    newChannel(serverId: $serverId) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription NewMemberSubscription($serverId: Int!) {\n    newMember(serverId: $serverId) {\n      id\n      serverId\n    }\n  }\n"): (typeof documents)["\n  subscription NewMemberSubscription($serverId: Int!) {\n    newMember(serverId: $serverId) {\n      id\n      serverId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription UpdatedServerNameSubscription($serverId: Int!) {\n    updatedServerName(serverId: $serverId) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  subscription UpdatedServerNameSubscription($serverId: Int!) {\n    updatedServerName(serverId: $serverId) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription UpdatedChannelNameSubscription($serverId: Int!) {\n    updatedChannelName(serverId: $serverId) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  subscription UpdatedChannelNameSubscription($serverId: Int!) {\n    updatedChannelName(serverId: $serverId) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription DeletedServerSubscription($serverId: Int!) {\n    deletedServer(serverId: $serverId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  subscription DeletedServerSubscription($serverId: Int!) {\n    deletedServer(serverId: $serverId) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription DeletedChannelSubscription($serverId: Int!) {\n    deletedChannel(serverId: $serverId) {\n      id\n    }\n  }\n"): (typeof documents)["\n  subscription DeletedChannelSubscription($serverId: Int!) {\n    deletedChannel(serverId: $serverId) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription DeletedMemberSubscription($serverId: Int!) {\n    deletedMember(serverId: $serverId) {\n      id\n      serverId\n    }\n  }\n"): (typeof documents)["\n  subscription DeletedMemberSubscription($serverId: Int!) {\n    deletedMember(serverId: $serverId) {\n      id\n      serverId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription MessageSubscription($serverId: Int!, $channelId: Int!) {\n    newMessage(serverId: $serverId, channelId: $channelId) {\n      ...MessageFragment\n    }\n  }\n"): (typeof documents)["\n  subscription MessageSubscription($serverId: Int!, $channelId: Int!) {\n    newMessage(serverId: $serverId, channelId: $channelId) {\n      ...MessageFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription NewInvitationSubscription {\n    newInvitation {\n      serverId\n    }\n  }\n"): (typeof documents)["\n  subscription NewInvitationSubscription {\n    newInvitation {\n      serverId\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;