import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { Role } from "@/gql/graphql";
import { ChangeMemberRoleMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { useCallback } from "react";
import { useMutation } from "urql";
import { useRole } from "../VerifyRole";

export const ChangeMemberRoleDialog = (
  props: {
    serverId: number;
    userId: number;
    memberName: string;
  } & Partial<FormDialogProps>
) => {
  const [_, mutate] = useMutation(ChangeMemberRoleMutation);

  const action = useCallback(
    async (form: FormData) => {
      const result = validateResult(
        await mutate({
          serverId: props.serverId,
          userId: props.userId,
          newRole: form.get("newRole") as Role,
        }),
        (data) =>
          data.changeMemberRole.__typename !== "Member"
            ? data.changeMemberRole.message
            : data.changeMemberRole
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
      title={`Change the role of '${props.memberName}'`}
      action={action}
      actionName="Save"
    >
      <select name="newRole">
        {Object.values(Role).map((role) => (
           <option value={role} key={role}>{role.toLowerCase()}</option>
        ))}
      </select>
    </FormDialog>
  );
};
