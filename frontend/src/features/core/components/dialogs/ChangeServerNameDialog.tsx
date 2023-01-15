import { FancyInput } from "@/components/FancyInput";
import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { ChangeServerNameMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { useCallback } from "react";
import { useMutation } from "urql";

export const ChangeServerNameDialog = (
  props: {
    serverId: number;
    serverName: string;
  } & Partial<FormDialogProps>
) => {
  const [_, mutate] = useMutation(ChangeServerNameMutation);

  const action = useCallback(
    async (form: FormData) => {
      const value = form.get("name") as string;
      const result = validateResult(
        await mutate({
          serverId: props.serverId,
          name: value,
        }),
        (data) =>
          data.changeServerName.__typename !== "Server"
            ? data.changeServerName.message
            : data.changeServerName
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
      title={`Rename the server '${props.serverName}'`}
      action={action}
      actionName="Save"
    >
      <FancyInput name="name" label="New server name"/>
    </FormDialog>
  );
};
