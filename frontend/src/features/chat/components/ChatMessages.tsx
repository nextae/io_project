import { FragmentType, graphql, useFragment } from "@/gql";
import { useUser } from "@/lib/auth";
import { formatRelative } from "date-fns";
import { ProfilePicturePlaceholder } from "@/components/ProfilePicture";

const MessageFragment = graphql(/* GraphQL */ `
  fragment MessageFragment on Message {
    id
    content
    author {
      id
      serverId
      name
    }
    createdAt
    channelId
  }
`);

interface MessageProps {
  content: string;
  sender: string;
  time: string;
  isOwn?: boolean;
}

const Message = ({ content, sender, time, isOwn = false }: MessageProps) => (
  <div className={`message ${isOwn ? "my_message" : "frnd_message"}`}>
    {!isOwn && (
      <div className="frndimg">
        <ProfilePicturePlaceholder name={sender} />
      </div>
    )}
    <p>
      {!isOwn && <span className="nickname">{sender}</span>}
      {content}
      <br />
      <span>{time}</span>
    </p>
    {isOwn && (
      <div className="userimg">
        <ProfilePicturePlaceholder name={sender} />
      </div>
    )}
  </div>
);

export const ChatMessages = (props: {
  messages: FragmentType<typeof MessageFragment>[];
}) => {
  const user = useUser();
  const messages = useFragment(MessageFragment, props.messages);

  return (
    <div className="chatBox">
      <div>
        {[...messages].reverse().map((message) => (
          <Message
            key={message.id}
            content={message.content}
            sender={message.author!.name}
            isOwn={+message.author!.id === user}
            time={formatRelative(
              new Date(message.createdAt * 1000),
              new Date()
            )}
          />
        ))}
      </div>
    </div>
  );
};
