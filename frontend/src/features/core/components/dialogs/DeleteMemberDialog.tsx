import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { DeleteMemberMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { useCallback } from "react";
import { useMutation } from "urql";

export const DeleteMemberDialog = (
  props: {
    serverId: number;
    userId: number;
    memberName: string;
  } & Partial<FormDialogProps>
) => {
  const [_, mutate] = useMutation(DeleteMemberMutation);

  const action = useCallback(
    async (_: FormData) => {
      const result = validateResult(
        await mutate({
          serverId: props.serverId,
          userId: props.userId,
        }),
        (data) =>
          data.kickMember.__typename !== "Member"
            ? data.kickMember.message
            : data.kickMember
      );
      if (result.isError) {
        return result.error;
      }
    },
    [props.serverId, props.userId]
  );

  return (
    <FormDialog
      {...props}
      title={`Kick '${props.memberName}' from the server?`}
      action={action}
      actionName="Kick"
      danger
    />
  );
};
