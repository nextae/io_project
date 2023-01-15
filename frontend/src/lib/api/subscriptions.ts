import { graphql } from "@/gql";

export const NewChannelSubscription = graphql(/* GraphQL */ `
  subscription NewChannelSubscription($serverId: Int!) {
    newChannel(serverId: $serverId) {
      id
      name
    }
  }
`);

export const NewMemberSubscription = graphql(/* GraphQL */ `
  subscription NewMemberSubscription($serverId: Int!) {
    newMember(serverId: $serverId) {
      id
      serverId
    }
  }
`);

export const UpdatedServerNameSubscription = graphql(/* GraphQL */ `
  subscription UpdatedServerNameSubscription($serverId: Int!) {
    updatedServerName(serverId: $serverId) {
      id
      name
    }
  }
`);

export const UpdatedChannelNameSubscription = graphql(/* GraphQL */ `
  subscription UpdatedChannelNameSubscription($serverId: Int!) {
    updatedChannelName(serverId: $serverId) {
      id
      name
    }
  }
`);

export const DeletedServerSubscription = graphql(/* GraphQL */ `
  subscription DeletedServerSubscription($serverId: Int!) {
    deletedServer(serverId: $serverId) {
      id
    }
  }
`);

export const DeletedChannelSubscription = graphql(/* GraphQL */ `
  subscription DeletedChannelSubscription($serverId: Int!) {
    deletedChannel(serverId: $serverId) {
      id
    }
  }
`);

export const DeletedMemberSubscription = graphql(/* GraphQL */ `
  subscription DeletedMemberSubscription($serverId: Int!) {
    deletedMember(serverId: $serverId) {
      id
      serverId
    }
  }
`);

export const MessageSubscription = graphql(/* GraphQL */ `
  subscription MessageSubscription($serverId: Int!, $channelId: Int!) {
    newMessage(serverId: $serverId, channelId: $channelId) {
      ...MessageFragment
    }
  }
`);

export const NewInvitationSubscription = graphql(/* GraphQL */ `
  subscription NewInvitationSubscription {
    newInvitation {
      serverId
    }
  }
`);
