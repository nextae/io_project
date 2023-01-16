import { FancyInput } from "@/components/FancyInput";
import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { CreateChannelMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { useCallback } from "react";
import { useMutation } from "urql";

export const CreateChannelDialog = (
  props: {
    serverId: number;
  } & Partial<FormDialogProps>
) => {
  const [_, mutate] = useMutation(CreateChannelMutation);

  const action = useCallback(
    async (form: FormData) => {
      const value = form.get("name") as string;
      const result = validateResult(
        await mutate({ name: value, serverId: props.serverId }),
        (data) =>
          data.addChannel.__typename !== "Channel"
            ? data.addChannel.message
            : data.addChannel
      );
      if (result.isError) {
        return result.error;
      }
    },
    [props.serverId]
  );

  return (
    <FormDialog
      {...props}
      title="Create a new channel"
      action={action}
      actionName="Create"
    >
      <FancyInput name="name" label="Channel name"/>
    </FormDialog>
  );
};
