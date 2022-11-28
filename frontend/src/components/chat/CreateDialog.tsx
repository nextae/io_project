import { FormError } from "@/components/common/FormError";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export const CreateDialog = (props: {
  title: React.ReactNode;
  fieldName: React.ReactNode;
  trigger: React.ReactElement;
  action: (value: string) => Promise<string | undefined>;
}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await props.action(value);
    if (result) {
      setError(result);
      return;
    }
    setOpen(false);
  };
  return (
    <Dialog.Root
      modal
      open={open}
      onOpenChange={(x) => {
        setOpen(x);
        setError(null);
      }}
    >
      <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialogOverlay" />
        <Dialog.Content className="createDialog">
          <Dialog.Title>{props.title}</Dialog.Title>
          <FormError error={error} />
          <form onSubmit={onSubmit}>
            <label htmlFor="value">{props.fieldName}</label>
            <input
              type="text"
              id="value"
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="createDialogActions">
              <Dialog.Close>Cancel</Dialog.Close>
              <button type="submit" className="mainButton">
                Create
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
