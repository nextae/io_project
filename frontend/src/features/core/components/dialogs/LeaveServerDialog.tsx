import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { LeaveServerMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { ReactElement, useCallback } from "react";
import { useMutation } from "urql";

export const LeaveServerDialog = (
  props: {
    serverId: number;
    serverName: string;
    trigger: ReactElement;
  } & Partial<FormDialogProps>
) => {
  const [_, mutate] = useMutation(LeaveServerMutation);

  const action = useCallback(
    async (form: FormData) => {
      const result = validateResult(
        await mutate({
          serverId: props.serverId,
        }),
        (data) =>
          data.leaveServer.__typename !== "Member"
            ? data.leaveServer.message
            : data.leaveServer
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
      title={`Leave the server '${props.serverName}'?`}
      action={action}
      actionName="Leave"
      danger
    />
  );
};
