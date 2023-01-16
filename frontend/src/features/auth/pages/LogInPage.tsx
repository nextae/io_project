import styles from "../style.module.css";

import { Button } from "@/components/Button";
import { FancyInput } from "@/components/FancyInput";
import { FormError } from "@/components/FormError";
import { LogInMutation } from "@/lib/api/mutations";
import { useAuth } from "@/lib/auth";
import { useDocumentTitle, validateResult } from "@/lib/utils";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "urql";

export const LogInPage = () => {
  const {
    actions: { logIn },
  } = useAuth();

  useDocumentTitle("Log in");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const [_, mutate] = useMutation(LogInMutation);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPending(true);
      setError("");
      const result = validateResult(
        await mutate({ username, password }),
        (data) =>
          data.login.__typename === "AuthPayload"
            ? data.login
            : data.login.message
      );
      if (result.isError) {
        setError(result.error);
        setPending(false);
        return;
      }
      logIn(result.data.token, +result.data.user.id);
    },
    [username, password, mutate, logIn]
  );

  return (
    <main className={styles.loginPage}>
      <div className={styles.box}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1>Log in</h1>
          <FormError error={error} />
          <FancyInput
            type="text"
            required
            value={username}
                       autoComplete="username"
            label="Username"
            spellCheck={false}
            onChange={(e) => setUsername(e.target.value)}
          />

          <FancyInput
            type="password"
            required
            value={password}
                       autoComplete="current-password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" kind="primary" pending={pending}>
            Log in
          </Button>
        </form>
        <div className={styles.links}>
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </main>
  );
};
