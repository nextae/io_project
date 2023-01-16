import styles from "../style.module.css";

import { Button } from "@/components/Button";
import { FancyInput } from "@/components/FancyInput";
import { FormError } from "@/components/FormError";
import { RegistrationMutation } from "@/lib/api/mutations";
import { useCallback, useState } from "react";
import { useMutation } from "urql";

interface RegistrationFormProps {
  onSubmit: (params: {
    username: string;
    password: string;
    email: string;
  }) => void;
}

export const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);


  const [_, mutate] = useMutation(RegistrationMutation);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
      
      setPending(true);
      onSubmit({ username, password, email });
      setPending(false);
    },
    [username, password, confirmPassword, email, mutate, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1>Sign up</h1>
      <FormError error={error} />
      <FancyInput
        type="text"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        spellCheck={false}
               label="Username"
      />

      <FancyInput
        type="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
               label="Email"
      />

      <FancyInput
        type="password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
               label="Password"
      />

      <FancyInput
        type="password"
        value={confirmPassword}
        required
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
               label="Confirm password"
      />
      <Button type="submit" kind="primary" pending={pending}>
        Create account
      </Button>
    </form>
  );
};
