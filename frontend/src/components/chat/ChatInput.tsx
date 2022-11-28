import { graphql } from "@/gql";
import { useUser } from "@/lib/auth";
import { useRef, useState } from "react";
import {
  IoAttachOutline,
  IoHappyOutline,
  IoReturnDownForwardOutline,
} from "react-icons/io5";
import { useMutation } from "urql";

const SendMessageMutation = graphql(/* GraphQL */ `
  mutation SendMessageMutation(
    $channelId: Int!
    $serverId: Int!
    $userId: Int!
    $content: String!
  ) {
    addMessage(
      channelId: $channelId
      serverId: $serverId
      userId: $userId
      content: $content
    ) {
      __typename
      ... on Error {
        message
      }
      ... on Message {
        ...MessageFragment
      }
    }
  }
`);

export const ChatInput = ({
  channelId,
  serverId,
}: {
  channelId: number;
  serverId: number;
}) => {
  const userId = useUser()!;
  const [content, setContent] = useState("");
  const [_, executeMutation] = useMutation(SendMessageMutation);
  const form = useRef<HTMLFormElement | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content === "") return;
    const target = e.currentTarget;
    const result = await executeMutation({
      content,
      channelId,
      serverId,
      userId,
    });

    if (result.data?.addMessage.__typename !== "Message") {
      console.debug("SENDING ERROR? ", result);
    } else {
      setContent("");
      target.reset();
    }
  };
  return (
    <form ref={form} className="chatbox_input" onSubmit={onSubmit}>
      <IoHappyOutline className="ion-icon" />
      <IoAttachOutline className="ion-icon" />
      <input
        type="text"
        placeholder="Type a message"
        required
        onChange={(e) => setContent(e.target.value)}
      />
      <IoReturnDownForwardOutline
        className="ion-icon"
        onClick={() => {
          if (form.current) form.current.requestSubmit();
        }}
      />
    </form>
  );
};
