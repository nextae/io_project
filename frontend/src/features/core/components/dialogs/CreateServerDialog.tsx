import { FancyInput } from "@/components/FancyInput";
import { FormDialog, FormDialogProps } from "@/components/FormDialog";
import { CreateServerMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { useCallback } from "react";
import { useMutation } from "urql";

export const CreateServerDialog = (props: Partial<FormDialogProps>) => {
  const [_, mutate] = useMutation(CreateServerMutation);

  const action = useCallback(async (form: FormData) => {
    const name = form.get("name") as string;
    const result = validateResult(await mutate({ name }), (data) =>
      data.addServer.__typename !== "Server"
        ? data.addServer.message
        : data.addServer
    );
    if (result.isError) {
      return result.error;
    }
  }, []);

  return (
    <FormDialog
      {...props}
      title="Create a new server"
      action={action}
      actionName="Create"
    >
      <FancyInput name="name" label="Server name"/>
    </FormDialog>
  );
};
