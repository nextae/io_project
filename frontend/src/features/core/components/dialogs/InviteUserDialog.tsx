import { FancyInput } from "@/components/FancyInput";
import { FormDialog } from "@/components/FormDialog";
import { graphql } from "@/gql";
import { InviteUserMutation } from "@/lib/api/mutations";
import { validateResult } from "@/lib/utils";
import { ReactElement, useCallback } from "react";
import { useClient, useMutation } from "urql";

const FindUserQuery = graphql(/* GraphQL */ `
  query FindUserQuery($name: String!) {
    user(username: $name) {
      __typename
      ... on User {
        id
      }
      ... on Error {
        message
      }
    }
  }
`);

export const InviteUserDialog = (props: {
  serverId: number;
  trigger: ReactElement;
}) => {
  const [_, mutate] = useMutation(InviteUserMutation);
  const client = useClient();

  const action = useCallback(
    async (form: FormData) => {
      const name = form.get("username") as string;
      const content = form.get("content") as string;

      const user = validateResult(
        await client.query(FindUserQuery, { name }).toPromise(),
        (data) =>
          data.user.__typename !== "User" ? data.user.message : data.user
      );
      if (user.isError) return user.error;

      const result = validateResult(
        await mutate({
          userId: +user.data.id,
          serverId: props.serverId,
          content,
        }),
        (data) =>
          data.inviteUser.__typename !== "Invitation"
            ? data.inviteUser.message
            : data.inviteUser
      );

      if (result.isError) {
        return result.error;
      }
    },
    [props.serverId]
  );

  return (
    <FormDialog
      title="Invite a user to the server"
      action={action}
      actionName="Invite"
      trigger={props.trigger}
    >
      <FancyInput name="username" label="Username"/>
      <FancyInput name="content" label="Invitation content"/>
    </FormDialog>
  );
};
