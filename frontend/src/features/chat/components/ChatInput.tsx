import { IconButton } from "@/components/IconButton";
import { SendMessageMutation } from "@/lib/api/mutations";
import { useRef, useState } from "react";
import { IoReturnDownForwardOutline } from "react-icons/io5";
import { useMutation } from "urql";

export const ChatInput = ({
  channelId,
  serverId,
}: {
  channelId: number;
  serverId: number;
}) => {
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
    });

    if (result.data?.addMessage.__typename !== "Message") {
      console.debug("SENDING ERROR ", result);
    } else {
      setContent("");
      target.reset();
    }
  };
  return (
    <form ref={form} className="chatbox_input" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Type a message"
        required
        onChange={(e) => setContent(e.target.value)}
      />

      <IconButton
        icon={<IoReturnDownForwardOutline />}
        type="submit"
        title="Send message"
      />
    </form>
  );
};
