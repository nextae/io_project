import { FancyInput } from "@/components/FancyInput";
import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { DeleteServerMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { ReactElement, useCallback } from "react";
import { useMutation } from "urql";

export const DeleteServerDialog = (
  props: {
    serverId: number;
    serverName: string;
    trigger: ReactElement;
  } & Partial<FormDialogProps>
) => {
  const [_, mutate] = useMutation(DeleteServerMutation);

  const action = useCallback(
    async (form: FormData) => {
      const value = form.get("name") as string;
      if (value !== props.serverName) {
        return "The server name is not correct";
      }

      const result = validateResult(
        await mutate({
          serverId: props.serverId,
        }),
        (data) =>
          data.deleteServer.__typename !== "Server"
            ? data.deleteServer.message
            : data.deleteServer
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
      title={`Delete the server '${props.serverName}'?`}
      action={action}
      actionName="Delete"
      danger
    >
      <FancyInput name="name" label="Confirm server name"/>
    </FormDialog>
  );
};
