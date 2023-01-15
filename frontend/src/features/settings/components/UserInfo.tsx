import { Button } from "@/components/Button";
import { FormError } from "@/components/FormError";
import { IconButton } from "@/components/IconButton";
import { graphql } from "@/gql";
import { validateResult } from "@/lib/utils";
import { IoPencilOutline } from "react-icons/io5";
import { useQuery } from "urql";
import styles from "../style.module.css";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

const UserInfoQuery = graphql(/* GraphQL */ `
  query UserInfoQuery {
    currentUser {
      __typename
      ... on User {
        name
        email
        createdAt
      }
    }
  }
`);

export const UserInfo = () => {
  const [queryResult] = useQuery({ query: UserInfoQuery });
  const result = validateResult(queryResult, (data) =>
    data.currentUser.__typename === "User" ? data.currentUser : "Invalid user"
  );
  if (result.isError)
    return (
      <div className={styles.infoList}>
        <FormError error={result.error} />
      </div>
    );

  const { name, email } = result.data;

  return (
    <div className={styles.infoList}>
      <div className={styles.infoBlock}>
        <h3>Username: </h3>
        <p>{name}</p>
      </div>
      <div className={styles.infoBlock}>
        <h3>Email address: </h3>
        <p>{email}</p>
      </div>
      <div className={styles.infoBlock}>
        <div className={styles.header}>
          <h3>Password: </h3>
          <ChangePasswordDialog
            trigger={
              <IconButton title="Change password" icon={<IoPencilOutline />} />
            }
          />
        </div>
        <p className={styles.password} aria-hidden>
          placeholder
        </p>
      </div>
      <DeleteAccountDialog
        trigger={<Button kind="danger">Delete account</Button>}
        username={name}
      />
    </div>
  );
};
