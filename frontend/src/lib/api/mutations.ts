import { graphql } from "@/gql/gql.js";

export const LogInMutation = graphql(/* GraphQL */ `
  mutation LogInMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      __typename
      ... on Error {
        message
      }
      ... on AuthPayload {
        user {
          id
        }
        token
      }
    }
  }
`);

export const SendMessageMutation = graphql(/* GraphQL */ `
  mutation SendMessageMutation(
    $channelId: Int!
    $serverId: Int!
    $content: String!
  ) {
    addMessage(channelId: $channelId, serverId: $serverId, content: $content) {
      __typename
      ... on Error {
        message
      }
      ... on Message {
        id
        ...MessageFragment
      }
    }
  }
`);

export const ChangeChannelNameMutation = graphql(/* GraphQL */ `
  mutation ChangeChannelNameMutation(
    $name: String!
    $serverId: Int!
    $channelId: Int!
  ) {
    changeChannelName(
      serverId: $serverId
      channelId: $channelId
      newName: $name
    ) {
      __typename
      ... on Channel {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`);

export const ChangeMemberRoleMutation = graphql(/* GraphQL */ `
  mutation ChangeMemberRoleMutation(
    $serverId: Int!
    $userId: Int!
    $newRole: Role!
  ) {
    changeMemberRole(serverId: $serverId, userId: $userId, newRole: $newRole) {
      __typename
      ... on Member {
        id
        serverId
        name
        role
      }
      ... on Error {
        message
      }
    }
  }
`);

export const RegistrationMutation = graphql(/* GraphQL */ `
  mutation RegistrationMutation(
    $username: String!
    $password: String!
    $email: String!
  ) {
    register(username: $username, password: $password, email: $email) {
      __typename
      ... on Error {
        message
      }
      ... on AuthPayload {
        user {
          id
        }
        token
      }
    }
  }
`);

export const ChangeServerNameMutation = graphql(/* GraphQL */ `
  mutation ChangeServerNameMutation($serverId: Int!, $name: String!) {
    changeServerName(serverId: $serverId, newName: $name) {
      __typename
      ... on Server {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`);

export const CreateChannelMutation = graphql(/* GraphQL */ `
  mutation CreateChannelMutation($name: String!, $serverId: Int!) {
    addChannel(name: $name, serverId: $serverId) {
      __typename
      ... on Channel {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`);

export const CreateServerMutation = graphql(/* GraphQL */ `
  mutation CreateServerMutation($name: String!) {
    addServer(name: $name) {
      __typename
      ... on Server {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`);

export const DeleteChannelMutation = graphql(/* GraphQL */ `
  mutation DeleteChannelMutation($serverId: Int!, $channelId: Int!) {
    deleteChannel(serverId: $serverId, channelId: $channelId) {
      __typename
      ... on Channel {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`);

export const DeleteMemberMutation = graphql(/* GraphQL */ `
  mutation DeleteMemberMutation($serverId: Int!, $userId: Int!) {
    kickMember(serverId: $serverId, userId: $userId) {
      __typename
      ... on Member {
        id
        serverId
        name
      }
      ... on Error {
        message
      }
    }
  }
`);

export const DeleteServerMutation = graphql(/* GraphQL */ `
  mutation DeleteServerMutation($serverId: Int!) {
    deleteServer(serverId: $serverId) {
      __typename
      ... on Server {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`);

export const InviteUserMutation = graphql(/* GraphQL */ `
  mutation InviteUserMutation(
    $userId: Int!
    $serverId: Int!
    $content: String!
  ) {
    inviteUser(userId: $userId, serverId: $serverId, content: $content) {
      __typename
      ... on Invitation {
        serverId
      }
      ... on Error {
        message
      }
    }
  }
`);

export const LeaveServerMutation = graphql(/* GraphQL */ `
  mutation LeaveServerMutation($serverId: Int!) {
    leaveServer(serverId: $serverId) {
      __typename
      ... on Member {
        id
        serverId
      }
      ... on Error {
        message
      }
    }
  }
`);

export const ChangePasswordMutation = graphql(/* GraphQL */ `
  mutation ChangePasswordMutation(
    $oldPassword: String!
    $newPassword: String!
  ) {
    changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {
      __typename
      ... on User {
        id
      }
      ... on Error {
        message
      }
    }
  }
`);

export const AcceptInvitationMutation = graphql(/* GraphQL */ `
  mutation AcceptInvitationMutation($serverId: Int!) {
    acceptInvitation(serverId: $serverId) {
      __typename
      ... on Invitation {
        serverId
        userId
      }
      ... on Error {
        message
      }
    }
  }
`);

export const DeclineInvitationMutation = graphql(/* GraphQL */ `
  mutation DeclineInvitationMutation($serverId: Int!, $userId: Int!) {
    declineInvitation(serverId: $serverId, userId: $userId) {
      __typename
      ... on Invitation {
        serverId
        userId
      }
      ... on Error {
        message
      }
    }
  }
`);

export const DeleteAccountMutation = graphql(/* GraphQL */ `
  mutation DeleteAccountMutation {
    deleteUser {
      __typename
      ... on User {
        id
      }
      ... on Error {
        message
      }
    }
  }
`);
