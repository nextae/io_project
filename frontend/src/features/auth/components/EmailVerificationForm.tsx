import styles from "../style.module.css";

import { Button } from "@/components/Button";
import { FancyInput } from "@/components/FancyInput";
import { RegistrationMutation } from "@/lib/api/mutations";
import { useCallback, useState } from "react";
import { useMutation } from "urql";

interface EmailVerificationFormProps {
  onSubmit: (code: string) => void;
}

export const EmailVerificationForm = ({
  onSubmit,
}: EmailVerificationFormProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [_, mutate] = useMutation(RegistrationMutation);
  const [pending, setPending] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPending(true);
      onSubmit(verificationCode);
      setPending(false);
    },
    [mutate, verificationCode]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1>Verify email</h1>
      <p className={styles.message}>
        We've sent a verification code to your email. Check it and enter it
        below to verify your email.
      </p>
      <FancyInput
        inputMode="numeric"
        pattern="[0-9]*"
        value={verificationCode}
        required
        onChange={(e) => setVerificationCode(e.target.value)}
               label="Verification code"
      />
      <Button type="submit" kind="primary" pending={pending}>
        Verify
      </Button>
    </form>
  );
};
