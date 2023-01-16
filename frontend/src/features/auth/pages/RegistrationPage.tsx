import styles from "../style.module.css";

import { FormError } from "@/components/FormError";
import { RegistrationMutation } from "@/lib/api/mutations";
import { useAuth } from "@/lib/auth";
import { useDocumentTitle, validateResult } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "urql";
import { EmailVerificationForm } from "../components/EmailVerificationForm";
import { RegistrationForm } from "../components/RegistrationForm";
import {
  generateVerificationCode,
  sendVerificationEmail,
} from "../verifyEmail";

export const RegistrationPage = () => {
  const {
    actions: { logIn },
  } = useAuth();

  useDocumentTitle("Sign up");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    username: string;
    password: string;
    email: string;
  } | null>(null);
  const [code, setCode] = useState("");

  const [_, mutate] = useMutation(RegistrationMutation);
  const navigate = useNavigate();

  const handleRegistrationSubmit = useCallback(
    async (x: { username: string; password: string; email: string }) => {
      setUserInfo(x);
      const newCode = generateVerificationCode();
      setCode(newCode);
      await sendVerificationEmail(x.email, newCode);
      setVerifying(true);
    },
    [code]
  );

  const handleVerificationSubmit = useCallback(
    async (newCode: string) => {
      if (newCode !== code) {
        setError("Invalid verification code");
        return;
      }

      setError("");

      const result = validateResult(await mutate(userInfo!), (data) =>
        data.register.__typename === "AuthPayload"
          ? data.register
          : data.register.message
      );
      if (result.isError) {
        setError(result.error);
        return;
      }
      logIn(result.data.token, +result.data.user.id);
      navigate("/");
    },
    [mutate, logIn, navigate, code, userInfo]
  );

  return (
    <main className={styles.loginPage}>
      <div className={styles.box}>
        <FormError error={error} />
        {verifying ? (
          <EmailVerificationForm onSubmit={handleVerificationSubmit} />
        ) : (
          <RegistrationForm onSubmit={handleRegistrationSubmit} />
        )}
        <div className={styles.links}>
          <Link to="/log_in">Already have an account?</Link>
        </div>
      </div>
    </main>
  );
};
