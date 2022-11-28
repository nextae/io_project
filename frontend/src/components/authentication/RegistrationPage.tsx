import { FormError } from "@/components/common/FormError";
import { graphql } from "@/gql";
import { useAuth } from "@/lib/auth";
import { propagateError } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

const RegistrationMutation = graphql(/* GraphQL */ `
  mutation RegistrationMutation(
    $username: String!
    $password: String!
    $email: String!
  ) {
    register(username: $username, password: $password, email: $email) {
      __typename
      ... on Error {
        message
      }
      ... on User {
        id
      }
    }
  }
`);

export const RegistrationPage = () => {
  const {
    actions: { logIn },
  } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [_, mutate] = useMutation(RegistrationMutation);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = propagateError(
      await mutate({ username, password, email }),
      (data) =>
        data.register.__typename === "User"
          ? data.register
          : data.register.message
    );
    if (result.isError) {
      setError(result.error);
      return;
    }
    logIn(+result.data.id);
    navigate("/");
  };

  return (
    <div className="loginPage">
      <div className="box">
        <form onSubmit={handleSubmit} className="form">
          <h2>Sign up</h2>
          <FormError error={error} />
          <div className="inputBox">
            <input
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <span>Username</span>
            <i />
          </div>
          <div className="inputBox">
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
            <i />
          </div>
          <div className="inputBox">
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            <i />
          </div>
          <div className="inputBox">
            <input
              type="password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span>Confirm password</span>
            <i />
          </div>
          <input type="submit" value="Create account" />
        </form>
      </div>
    </div>
  );
};
