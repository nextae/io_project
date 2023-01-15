import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { DeleteChannelMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { useCallback } from "react";
import { useMutation } from "urql";

export const DeleteChannelDialog = (
  props: {
    serverId: number;
    channelId: number;
    channelName: string;
  } & Partial<FormDialogProps>
) => {
  const [_, mutate] = useMutation(DeleteChannelMutation);

  const action = useCallback(
    async (_: FormData) => {
      const result = validateResult(
        await mutate({
          serverId: props.serverId,
          channelId: props.channelId,
        }),
        (data) =>
          data.deleteChannel.__typename !== "Channel"
            ? data.deleteChannel.message
            : data.deleteChannel
      );
      if (result.isError) {
        return result.error;
      }
    },
    [props.serverId, props.channelId]
  );

  return (
    <FormDialog
      {...props}
      title={`Delete the channel '${props.channelName}'?`}
      action={action}
      actionName="Delete"
      danger
    />
  );
};
