import { FancyInput } from "@/components/FancyInput";
import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { ChangePasswordMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { useCallback } from "react";
import { useMutation } from "urql";

export const ChangePasswordDialog = (props: Partial<FormDialogProps>) => {
  const [_, mutate] = useMutation(ChangePasswordMutation);

  const action = useCallback(async (form: FormData) => {
    const currentPassword = form.get("password") as string;
    const newPassword = form.get("newPassword") as string;
    const newPassword2 = form.get("newPassword2") as string;
    if (newPassword !== newPassword2) {
      return "Passwords do not match";
    }
    const result = validateResult(
      await mutate({
        oldPassword: currentPassword,
        newPassword: newPassword,
      }),
      (data) =>
        data.changePassword.__typename !== "User"
          ? data.changePassword.message
          : data.changePassword
    );
    if (result.isError) {
      return result.error;
    }
  }, []);

  return (
    <FormDialog
      {...props}
      title={`Change password`}
      actionName="Save"
      action={action}
    >
      <FancyInput
        name="password"
        label="Current password"
               type="password"
        autoComplete="current-password"
      />
      <FancyInput
        name="newPassword"
        label="New password"
               type="password"
        autoComplete="new-password"
      />
      <FancyInput
        name="newPassword2"
        label="Confirm new password"
               type="password"
        autoComplete="new-password"
      />
    </FormDialog>
  );
};
