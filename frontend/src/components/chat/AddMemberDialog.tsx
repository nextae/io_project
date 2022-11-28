import { graphql } from "@/gql";
import { propagateError } from "@/lib/utils";
import { ReactElement } from "react";
import { useMutation } from "urql";
import { CreateDialog } from "./CreateDialog";

const AddMemberMutation = graphql(/* GraphQL */ `
  mutation AddMemberMutation($userId: Int!, $serverId: Int!) {
    addMember(userId: $userId, serverId: $serverId) {
      __typename
      ... on Member {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`);

export const AddMemberDialog = (props: {
  serverId: number;
  trigger: ReactElement;
}) => {
  const [_, addMember] = useMutation(AddMemberMutation);

  const action = async (name: string) => {
    const addMemberResult = propagateError(
      await addMember({ userId: +name, serverId: props.serverId }),
      (data) =>
        data.addMember.__typename !== "Member"
          ? data.addMember.message
          : data.addMember
    );
    if (addMemberResult.isError) {
      return addMemberResult.error;
    }
  };
  return (
    <CreateDialog
      title="Add a member to the server"
      fieldName="User ID"
      action={action}
      trigger={props.trigger}
    />
  );
};
