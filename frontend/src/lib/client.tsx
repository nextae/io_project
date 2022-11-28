import schema from "@/../introspection.json";
import { graphql } from "@/gql";
import {
  AddChannelResponse,
  AddMemberResponse,
  Message,
  MutationAddChannelArgs,
  MutationAddMemberArgs,
  SubscriptionNewMessageArgs,
} from "@/gql/graphql";
import { useAuth } from "@/lib/auth";
import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient as createWSClient } from "graphql-ws";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  Provider,
  subscriptionExchange,
} from "urql";

const GetServersQuery = graphql(/* GraphQL */ `
  query GetServers($userId: Int!) {
    user(userId: $userId) {
      ... on User {
        id
        servers {
          id
        }
      }
    }
  }
`);

const GetMembersQuery = graphql(/* GraphQL */ `
  query GetMembers($serverId: Int!) {
    server(serverId: $serverId) {
      ... on Server {
        id
        members {
          id
        }
      }
    }
  }
`);

const GetChannelsQuery = graphql(/* GraphQL */ `
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

const cache = cacheExchange({
  schema: schema as any,
  updates: {
    Subscription: {
      newMessage: (
        result: { newMessage: Message },
        args: SubscriptionNewMessageArgs,
        cache,
        _info
      ) => {
        const messagesArgs = {
          channelId: args.channelId,
        };
        const messages = cache.resolve("Query", "messages", messagesArgs);

        if (Array.isArray(messages)) {
          messages.unshift(result.newMessage as any);
          cache.link("Query", "messages", messagesArgs, messages as any);
        }
      },
    },
    Mutation: {
      addMember: (
        result: { addMember: AddMemberResponse },
        args: MutationAddMemberArgs,
        cache,
        _info
      ) => {
        if (result.addMember.__typename !== "Member") return;
        cache.updateQuery(
          {
            query: GetServersQuery,
            variables: { userId: args.userId },
          },
          (data) => {
            if (data?.user.__typename === "User") {
              data.user.servers.push({
                id: args.serverId.toString(),
                __typename: "Server",
              });
            }
            return data;
          }
        );

        cache.updateQuery(
          {
            query: GetMembersQuery,
            variables: { serverId: args.serverId },
          },
          (data) => {
            if (data?.server.__typename === "Server") {
              data.server.members.push({
                id: args.userId.toString(),
                __typename: "Member",
              });
              data.server.members.sort();
            }
            return data;
          }
        );
      },
      addChannel: (
        result: { addChannel: AddChannelResponse },
        args: MutationAddChannelArgs,
        cache,
        _info
      ) => {
        if (result.addChannel.__typename !== "Channel") return;
        const { addChannel } = result;
        cache.updateQuery(
          {
            query: GetChannelsQuery,
            variables: { serverId: args.serverId },
          },
          (data) => {
            if (data?.server.__typename === "Server")
              data.server.channels.push({
                id: addChannel.id,
                __typename: "Channel",
              });
            return data;
          }
        );
      },
    },
  },
});

const wsClient = createWSClient({
  url: import.meta.env.VITE_API_WS_URL,
  connectionParams: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});

const getClient = (userId: number | null) =>
  createClient({
    url: import.meta.env.VITE_API_URL,
    exchanges: [
      ...(import.meta.env.DEV ? [devtoolsExchange] : []),
      dedupExchange,
      cache,
      fetchExchange,
      subscriptionExchange({
        forwardSubscription: (operation) => ({
          subscribe: (sink) => ({
            unsubscribe: wsClient.subscribe(
              { query: operation.query, variables: operation.variables },
              sink
            ),
          }),
        }),
      }),
    ],
  });

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const client = getClient(
    auth.state.state === "authenticated" ? auth.state.user : null
  );

  return <Provider value={client}>{children}</Provider>;
};
