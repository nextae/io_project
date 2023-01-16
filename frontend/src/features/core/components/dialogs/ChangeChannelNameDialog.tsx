import { FancyInput } from "@/components/FancyInput";
import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { ChangeChannelNameMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { useCallback } from "react";
import { useMutation } from "urql";

export const ChangeChannelNameDialog = (
  props: {
    serverId: number;
    channelId: number;
    channelName: string;
  } & Partial<FormDialogProps>
) => {
  const [_, mutate] = useMutation(ChangeChannelNameMutation);

  const action = useCallback(
    async (form: FormData) => {
      const value = form.get("name") as string;
      const result = validateResult(
        await mutate({
          name: value,
          serverId: props.serverId,
          channelId: props.channelId,
        }),
        (data) =>
          data.changeChannelName.__typename !== "Channel"
            ? data.changeChannelName.message
            : data.changeChannelName
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
      title={`Rename the channel '${props.channelName}'`}
      actionName="Save"
      action={action}
    >
      <FancyInput name="name" label="New name"/>
    </FormDialog>
  );
};
