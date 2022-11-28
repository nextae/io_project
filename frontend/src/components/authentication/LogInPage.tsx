import { FormError } from "@/components/common/FormError";
import { graphql } from "@/gql";
import { useAuth } from "@/lib/auth";
import { propagateError } from "@/lib/utils";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "urql";

const LogInMutation = graphql(/* GraphQL */ `
  mutation LogInMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
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

export const LogInPage = () => {
  const {
    actions: { logIn },
  } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [_, mutate] = useMutation(LogInMutation);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = propagateError(
      await mutate({ username, password }),
      (data) =>
        data.login.__typename === "User" ? data.login : data.login.message
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
          <h2>Log in</h2>
          <FormError error={error} />
          <div className="inputBox">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span>Username</span>
            <i />
          </div>

          <div className="inputBox">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            <i />
          </div>

          <div className="links">
            <a href="#">Reset password</a>
            <Link to="/register">Create an account</Link>
          </div>
          <input type="submit" value="Log in" />
        </form>
      </div>
    </div>
  );
};
