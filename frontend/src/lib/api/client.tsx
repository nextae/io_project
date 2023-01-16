import schema from "@/../introspection.json";
import { graphql } from "@/gql";
import {
  Mutation,
  MutationAcceptInvitationArgs,
  MutationAddChannelArgs,
  MutationAddServerArgs,
  MutationChangeMemberRoleArgs,
  MutationDeclineInvitationArgs,
  MutationDeleteChannelArgs,
  MutationDeleteServerArgs,
  MutationKickMemberArgs,
  MutationLeaveServerArgs,
  Role,
  Subscription,
  SubscriptionDeletedChannelArgs,
  SubscriptionDeletedMemberArgs,
  SubscriptionDeletedServerArgs,
  SubscriptionNewChannelArgs,
  SubscriptionNewMemberArgs,
  SubscriptionNewMessageArgs,
} from "@/gql/graphql";
import { AuthContextType, useAuth } from "@/lib/auth";
import { devtoolsExchange } from "@urql/devtools";
import { AuthConfig, authExchange } from "@urql/exchange-auth";
import { cacheExchange, UpdateResolver } from "@urql/exchange-graphcache";
import { refocusExchange } from "@urql/exchange-refocus";
import { createClient as createWSClient } from "graphql-ws";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  makeOperation,
  Provider,
  subscriptionExchange,
} from "urql";

export const GetServersQuery = graphql(/* GraphQL */ `
  query GetServers {
    currentUser {
      ... on User {
        id
        servers {
          id
        }
      }
    }
  }
`);

export const GetMembersQuery = graphql(/* GraphQL */ `
  query GetMembers($serverId: Int!) {
    server(serverId: $serverId) {
      ... on Server {
        id
        members {
          id
          serverId
        }
      }
    }
  }
`);


export const GetMemberRolesQuery = graphql(/* GraphQL */ `
  query GetMemberRoles($serverId: Int!) {
    server(serverId: $serverId) {
      ... on Server {
        id
        members {
          id
          serverId
          role
        }
      }
    }
  }
`);


export const GetChannelsQuery = graphql(/* GraphQL */ `
  query GetChannels($serverId: Int!) {
    server(serverId: $serverId) {
      ... on Server {
        id
        channels {
          id
        }
      }
    }
  }
`);

export const GetInvitationsQuery = graphql(/* GraphQL */ `
  query GetInvitations {
    invitations {
      serverId
    }
  }
`);

const newMessage: UpdateResolver<
  Pick<Subscription, "newMessage">,
  SubscriptionNewMessageArgs
> = (result, args, cache, _info) => {
  const messagesArgs = {
    channelId: args.channelId,
    serverId: args.serverId,
  };

  const messages = cache.resolve("Query", "messages", messagesArgs);

  if (Array.isArray(messages)) {
    messages.unshift(result.newMessage as any);
    cache.link("Query", "messages", messagesArgs, messages as any);
  }
};

const deletedServer: UpdateResolver<
  Pick<Subscription, "deletedServer">,
  SubscriptionDeletedServerArgs
> = (result, args, cache, _info) => {
  if (result.deletedServer.__typename !== "Server") return;

  const { deletedServer } = result;
  cache.updateQuery(
    {
      query: GetServersQuery,
      variables: {},
    },
    (data) => {
      if (data?.currentUser.__typename === "User")
        data.currentUser.servers = data.currentUser.servers.filter(
          (server) => server.id !== deletedServer.id
        );
      return data;
    }
  );
};

const deletedChannel: UpdateResolver<
  Pick<Subscription, "deletedChannel">,
  SubscriptionDeletedChannelArgs
> = (result, args, cache, _info) => {
  if (result.deletedChannel.__typename !== "Channel") return;
  const { deletedChannel } = result;
  cache.updateQuery(
    {
      query: GetChannelsQuery,
      variables: args,
    },
    (data) => {
      if (data?.server.__typename === "Server")
        data.server.channels = data.server.channels.filter(
          (channel) => channel.id !== deletedChannel.id
        );
      return data;
    }
  );
};

const newChannel: UpdateResolver<
  Pick<Subscription, "newChannel">,
  SubscriptionNewChannelArgs
> = (result, args, cache, _info) => {
  if (result.newChannel.__typename !== "Channel") return;

  const { newChannel } = result;

  cache.updateQuery(
    {
      query: GetChannelsQuery,
      variables: { serverId: args.serverId },
    },
    (data) => {
      if (
        data?.server.__typename === "Server" &&
        data.server.channels.findIndex(
          (channel) => channel.id === newChannel.id
        ) === -1
      ) {
        data.server.channels.push({
          id: newChannel.id,
          __typename: "Channel",
        });
      }
      return data;
    }
  );
};

const addChannel: UpdateResolver<
  Pick<Mutation, "addChannel">,
  MutationAddChannelArgs
> = (result, args, cache, _info) => {
  if (result.addChannel.__typename !== "Channel") return;
  const { addChannel } = result;
  cache.updateQuery(
    {
      query: GetChannelsQuery,
      variables: { serverId: args.serverId },
    },
    (data) => {
      if (
        data?.server.__typename === "Server" &&
        data.server.channels.findIndex(
          (channel) => channel.id === addChannel.id
        ) === -1
      ) {
        data.server.channels.push({
          id: addChannel.id,
          __typename: "Channel",
        });
      }
      return data;
    }
  );
};

const addServer: UpdateResolver<
  Pick<Mutation, "addServer">,
  MutationAddServerArgs
> = (result, args, cache, _info) => {
  if (result.addServer.__typename !== "Server") return;

  const { addServer } = result;
  cache.updateQuery(
    {
      query: GetServersQuery,
      variables: {},
    },
    (data) => {
      if (
        data?.currentUser.__typename === "User" &&
        data.currentUser.servers.findIndex((x) => x.id === addServer.id) === -1
      )
        data.currentUser.servers.push({
          id: addServer.id,
          __typename: "Server",
        });
      return data;
    }
  );
};

const deleteServer: UpdateResolver<
  Pick<Mutation, "deleteServer">,
  MutationDeleteServerArgs
> = (result, args, cache, _info) => {
  if (result.deleteServer.__typename !== "Server") return;

  const { deleteServer } = result;
  cache.updateQuery(
    {
      query: GetServersQuery,
      variables: {},
    },
    (data) => {
      if (data?.currentUser.__typename === "User")
        data.currentUser.servers = data.currentUser.servers.filter(
          (server) => server.id !== deleteServer.id
        );
      return data;
    }
  );
};

const deleteChannel: UpdateResolver<
  Pick<Mutation, "deleteChannel">,
  MutationDeleteChannelArgs
> = (result, args, cache, _info) => {
  if (result.deleteChannel.__typename !== "Channel") return;

  const { deleteChannel } = result;
  cache.updateQuery(
    {
      query: GetChannelsQuery,
      variables: { serverId: args.serverId },
    },
    (data) => {
      if (data?.server.__typename === "Server")
        data.server.channels = data.server.channels.filter(
          (channel) => channel.id !== deleteChannel.id
        );
      return data;
    }
  );
};

const leaveServer: UpdateResolver<
  Pick<Mutation, "leaveServer">,
  MutationLeaveServerArgs
> = (result, args, cache, _info) => {
  if (result.leaveServer.__typename !== "Member") return;

  const { leaveServer } = result;
  cache.updateQuery(
    {
      query: GetServersQuery,
      variables: {},
    },
    (data) => {
      if (data?.currentUser.__typename === "User")
        data.currentUser.servers = data.currentUser.servers.filter(
          (server) => +server.id !== leaveServer.serverId
        );
      return data;
    }
  );
};

const kickMember: UpdateResolver<
  Pick<Mutation, "kickMember">,
  MutationKickMemberArgs
> = (result, args, cache, _info) => {
  if (result.kickMember.__typename !== "Member") return;

  const { kickMember } = result;
  cache.updateQuery(
    {
      query: GetMembersQuery,
      variables: { serverId: args.serverId },
    },
    (data) => {
      if (data?.server.__typename === "Server")
        data.server.members = data.server.members.filter(
          (member) => member.id !== kickMember.id
        );
      return data;
    }
  );
};

const acceptInvitation: UpdateResolver<
  Pick<Mutation, "acceptInvitation">,
  MutationAcceptInvitationArgs
> = (result, args, cache, _info) => {
  if (result.acceptInvitation.__typename !== "Invitation") return;

  const { acceptInvitation } = result;
  cache.updateQuery(
    {
      query: GetInvitationsQuery,
      variables: {},
    },
    (data) => {
      if (data?.invitations)
        data.invitations = data.invitations.filter(
          (invitation) => invitation.serverId !== acceptInvitation.serverId
        );
      return data;
    }
  );

  cache.updateQuery({ query: GetServersQuery, variables: {} }, (data) => {
    if (
      data?.currentUser.__typename === "User" &&
      data.currentUser.servers.findIndex(
        (x) => x.id === acceptInvitation.serverId.toString()
      ) === -1
    )
      data.currentUser.servers.push({
        id: acceptInvitation.serverId.toString(),
        __typename: "Server",
      });
    return data;
  });

  cache.updateQuery(
    {
      query: GetMembersQuery,
      variables: { serverId: acceptInvitation.serverId },
    },
    (data) => {
      if (
        data?.server.__typename === "Server" &&
        data.server.members.findIndex(
          (x) => x.id === acceptInvitation.userId.toString()
        ) === -1
      )
        data.server.members.push({
          id: acceptInvitation.userId.toString(),
          serverId: acceptInvitation.serverId,
          __typename: "Member",
        });
      return data;
    }
  );
};

const declineInvitation: UpdateResolver<
  Pick<Mutation, "declineInvitation">,
  MutationDeclineInvitationArgs
> = (result, args, cache, _info) => {
  if (result.declineInvitation.__typename !== "Invitation") return;

  const { declineInvitation } = result;
  cache.updateQuery(
    {
      query: GetInvitationsQuery,
    },
    (data) => {
      if (data?.invitations)
        data.invitations = data.invitations.filter(
          (invitation) => invitation.serverId !== declineInvitation.serverId
        );
      return data;
    }
  );
};

const newInvitation: UpdateResolver<Pick<Subscription, "newInvitation">, {}> = (
  result,
  args,
  cache,
  _info
) => {
  if (result.newInvitation.__typename !== "Invitation") return;

  const { newInvitation } = result;
  cache.updateQuery(
    {
      query: GetInvitationsQuery,
      variables: {},
    },
    (data) => {
      data?.invitations.push(newInvitation);
      return data;
    }
  );
};

const deletedMember: UpdateResolver<
  Pick<Subscription, "deletedMember">,
  SubscriptionDeletedMemberArgs
> = (result, args, cache, _info) => {
  if (result.deletedMember.__typename !== "Member") return;

  const { deletedMember } = result;
  cache.updateQuery(
    {
      query: GetMembersQuery,
      variables: { serverId: args.serverId },
    },
    (data) => {
      if (data?.server.__typename === "Server")
        data.server.members = data.server.members.filter(
          (member) => member.id !== deletedMember.id
        );
      return data;
    }
  );
  
  cache.updateQuery(
    {
      query: GetServersQuery,
      variables: {},
    },
    (data) => {
      if (data?.currentUser.__typename === "User" && data.currentUser.id === deletedMember.id)
        data.currentUser.servers = data.currentUser.servers.filter(
          (server) => +server.id !== args.serverId
        );
      return data;
    }
  );
};

const newMember: UpdateResolver<
  Pick<Subscription, "newMember">,
  SubscriptionNewMemberArgs
> = (result, args, cache, _info) => {
  if (result.newMember.__typename !== "Member") return;

  const { newMember } = result;
  cache.updateQuery(
    {
      query: GetMembersQuery,
      variables: { serverId: args.serverId },
    },
    (data) => {
      if (
        data?.server.__typename === "Server" &&
        data.server.members.findIndex(
          (member) => member.id === newMember.id
        ) === -1
      )
        data.server.members.push({
          id: newMember.id,
          serverId: newMember.serverId,
          __typename: "Member",
        });
      return data;
    }
  );
};

const changeMemberRole: UpdateResolver<
  Pick<Mutation, "changeMemberRole">,
  MutationChangeMemberRoleArgs
  > = (result, args, cache, _info) => {
  if (result.changeMemberRole.__typename !== "Member") return;

  const { changeMemberRole } = result;
  
  if (changeMemberRole.role !== Role.Owner) 
    return;

  // If the new role is `owner`, the old owner needs to be demoted to `moderator`

  cache.updateQuery(
    {
      query: GetMemberRolesQuery,
      variables: { serverId: args.serverId },
    },
    (data) => {
      if (data?.server.__typename === "Server") {
        const oldOwner = data.server.members.find(
          (member) => member.role === Role.Owner && member.id !== changeMemberRole.id
        );
        if (oldOwner) {
          oldOwner.role = Role.Moderator;
        }
      }
      return data;
    }
  );
};

const cache = cacheExchange({
  schema: schema as any,
  keys: {
    Invitation: (data) => data.serverId!.toString(),
    Member: (data) => `${data.id!.toString()},${data.serverId!.toString()}`,
  },
  updates: {
    Subscription: {
      newMessage,
      newChannel,
      newMember,
      newInvitation,
      deletedChannel,
      deletedServer,
      deletedMember,
    },
    Mutation: {
      addChannel,
      addServer,
      deleteServer,
      deleteChannel,
      leaveServer,
      kickMember,
      acceptInvitation,
      declineInvitation,
      changeMemberRole,
    },
  },
});

type AuthState = {
  token: string;
};

export const getAuthConfig = (config: ClientConfig): AuthConfig<AuthState> => ({
  getAuth: async ({ authState, mutate }) => {
    if (!authState) {
      return config.authContext.state.state === "authenticated"
        ? { token: config.authContext.state.token }
        : null;
    }
    config.authContext.actions.logOut();
    return null;
  },

  addAuthToOperation({ authState, operation }) {
    if (!authState || !authState.token) {
      return operation;
    }
    if (operation.kind === "subscription") {
      return makeOperation(
        operation.kind,
        {
          ...operation,
          variables: { ...operation.variables, auth: authState.token },
        },
        {
          ...operation.context,
        }
      );
    } else {
      const fetchOptions =
        typeof operation.context.fetchOptions === "function"
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {};

      return {
        ...operation,
        context: {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              Authorization: `Bearer ${authState.token}`,
            },
          },
        },
      };
    }
  },

  didAuthError({ error }) {
    return error.graphQLErrors.some(
      (e) => e.message === "User is not authenticated"
    );
  },
});

export interface ClientConfig {
  url: string;
  ws_url: string;
  authContext: AuthContextType;
  getWsClient: (config: ClientConfig) => ReturnType<typeof createWSClient>;
  getAuthConfig: (config: ClientConfig) => AuthConfig<AuthState>;
  fetchFunction?: typeof fetch;
}

export const getClient = (config: ClientConfig) => {
  const { url, getWsClient, getAuthConfig } = config;
  const authExchangeInstance = authExchange<AuthState>(getAuthConfig(config));
  const wsClient = getWsClient(config);
  const subscriptionExchangeInstance = subscriptionExchange({
    forwardSubscription: (operation) => ({
      subscribe: (sink) => ({
        unsubscribe: wsClient.subscribe(
          { query: operation.query, variables: operation.variables },
          sink
        ),
      }),
    }),
  });

  return createClient({
    url: url,
    exchanges: [
      ...(import.meta.env.DEV ? [devtoolsExchange] : []),
      dedupExchange,
      refocusExchange(),
      cache,
      authExchangeInstance,
      fetchExchange,
      subscriptionExchangeInstance,
    ],
    fetch: config.fetchFunction,
    suspense: true,
  });
};

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const client = getClient({
    url: import.meta.env.VITE_API_URL,
    ws_url: import.meta.env.VITE_API_WS_URL,
    authContext: auth,
    getWsClient(config) {
      return createWSClient({
        url: config.ws_url,
        connectionParams: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
    },
    getAuthConfig,
  });

  return <Provider value={client}>{children}</Provider>;
};
