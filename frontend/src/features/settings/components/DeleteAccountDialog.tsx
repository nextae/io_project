import { FancyInput } from "@/components/FancyInput";
import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { DeleteAccountMutation } from "@/lib/api/mutations";
import { useAuth } from "@/lib/auth";
import { validateResult } from "@/lib/utils";
import { ReactElement, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

export const DeleteAccountDialog = (
  props: {
    username: string;
    trigger: ReactElement;
  } & Partial<FormDialogProps>
) => {
  const [_, mutate] = useMutation(DeleteAccountMutation);
  const {
    actions: { logOut },
  } = useAuth();
  const navigate = useNavigate();

  const action = useCallback(
    async (form: FormData) => {
      const value = form.get("name") as string;
      if (value !== props.username) {
        return "The username is not correct";
      }

      const result = validateResult(await mutate({}), (data) =>
        data.deleteUser.__typename !== "User"
          ? data.deleteUser.message
          : data.deleteUser
      );
      if (result.isError) {
        return result.error;
      }

      navigate("/");
      logOut();
    },
    [props.username]
  );

  return (
    <FormDialog
      {...props}
      title={`Do you want to delete your account?`}
      action={action}
      actionName="Delete"
      danger
    >
      <FancyInput name="name" label="Confirm your username"/>
    </FormDialog>
  );
};
