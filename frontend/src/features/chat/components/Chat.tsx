import { FormError } from "@/components/FormError";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { graphql } from "@/gql";
import { MessageSubscription } from "@/lib/api/subscriptions";
import { validateResult } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useQuery, useSubscription } from "urql";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

const ChatQuery = graphql(/* GraphQL */ `
  query ChatQuery($serverId: Int!, $channelId: Int!) {
    channel(serverId: $serverId, channelId: $channelId) {
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

    messages(serverId: $serverId, channelId: $channelId) {
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

  const variables = {
    serverId,
    channelId,
  };

  const [result] = useQuery({
    query: ChatQuery,
    variables,
  });

  const validatedResult = validateResult(result, (data) =>
    data.channel.__typename === "Channel"
      ? {
          channel: data.channel,
          messages: data.messages,
        }
      : "Channel not found"
  );

  useSubscription({
    query: MessageSubscription,
    variables,
  });

  if (validatedResult.isError)
    return <FormError error={validatedResult.error} full />;

  return (
    <>
      <ChatMessages messages={validatedResult.data.messages} />
      <ChatInput channelId={channelId} serverId={serverId} />
    </>
  );
};
