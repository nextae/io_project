import styles from "./FormDialog.module.css";
import { FormError } from "@/components/FormError";
import * as Dialog from "@radix-ui/react-dialog";
import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { Button } from "./Button";

export interface FormDialogProps {
  /** The title of the dialog. */
  title: ReactNode;
  /** The content of the form. */
  children?: ReactNode;
  /** Element that will trigger the dialog to open. */
  trigger?: ReactNode;
  /** The name of the action displayed on the submit button. */
  actionName: ReactNode;
  /** Whether the dialog is open. If not provided, the dialog will manage its own state. */
  open?: boolean;
  /** Whether the dialog is dangerous. If true, the submit button will be red. */
  danger?: boolean;
  /** Called when the dialog is opened or closed. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Called when the user submits the form.
   * The action should return an error message if the action failed.
   * If the action succeeded, the dialog will close.
   */
  action: (value: FormData) => Promise<string | undefined>;
}

/**
 * A dialog that displays a form and then calls an action with the form data.
 * The action can return an error message, which will be displayed to the user.
 */
export const FormDialog = ({
  title,
  danger,
  actionName,
  action,
  onOpenChange,
  children,
  open: openProp,
  trigger,
}: FormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (openProp !== undefined) setOpen(openProp);
  }, [openProp]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setPending(true);
      const result = await action(new FormData(e.currentTarget));
      setPending(false);
      if (result) {
        setError(result);
        return;
      }
      setOpen(false);
      onOpenChange?.(false);
    },
    [action, onOpenChange]
  );

  const handleOpenChange = useCallback(
    (x: boolean) => {
      onOpenChange?.(false);
      setOpen(x);
      setError(null);
      setPending(false);
    },
    [onOpenChange]
  );

  return (
    <Dialog.Root modal open={open} onOpenChange={handleOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.dialog}>
          <Dialog.Title>{title}</Dialog.Title>
          <FormError error={error} />
          <form onSubmit={onSubmit}>
            {children}
            <div className={styles.actions}>
              <Dialog.Close asChild>
                <Button>Cancel</Button>
              </Dialog.Close>
              <Button
                type="submit"
                kind={danger ? "danger" : "primary"}
                pending={pending}
              >
                {actionName}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
