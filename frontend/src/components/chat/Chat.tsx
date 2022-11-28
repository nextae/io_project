import { graphql } from "@/gql";
import { useParams } from "react-router-dom";
import { useQuery, useSubscription } from "urql";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

const ChatQuery = graphql(/* GraphQL */ `
  query ChatQuery($channelId: Int!) {
    channel(channelId: $channelId) {
      __typename
      ... on Channel {
        id
        name
        server {
          id
          name
        }
      }
      ... on Error {
        message
      }
    }

    messages(channelId: $channelId) {
      ...MessageFragment
    }
  }
`);

const MessageSubscription = graphql(/* GraphQL */ `
  subscription MessageSubscription($channelId: Int!) {
    newMessage(channelId: $channelId) {
      ...MessageFragment
    }
  }
`);

export const Chat = () => {
  const params = useParams();
  if (params.channelId === undefined || params.serverId === undefined)
    throw new Error("Invalid params");
  const channelId = +params.channelId;
  const serverId = +params.serverId;

  const [{ data, fetching, error }] = useQuery({
    query: ChatQuery,
    variables: { channelId: channelId },
  });

  useSubscription({
    query: MessageSubscription,
    variables: { channelId: channelId },
  });

  if (fetching) return <div className="centerBox">Loading...</div>;
  if (error) return <div className="centerBox">Error: {error.message}</div>;
  if (data?.channel.__typename !== "Channel")
    return <div className="centerBox">Not found</div>;

  return (
    <div className="centerBox">
      <ChatHeader />
      <ChatMessages messages={data.messages} />
      <ChatInput channelId={channelId} serverId={serverId} />
    </div>
  );
};
