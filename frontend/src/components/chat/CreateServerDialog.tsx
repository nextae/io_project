import { graphql } from "@/gql";
import { useUser } from "@/lib/auth";
import { propagateError } from "@/lib/utils";
import { ReactElement } from "react";
import { useMutation } from "urql";
import { CreateDialog } from "./CreateDialog";

const CreateServerMutation = graphql(/* GraphQL */ `
  mutation CreateServerMutation($name: String!) {
    addServer(name: $name) {
      __typename
      ... on Server {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`);

const AddServerOwnerMutation = graphql(/* GraphQL */ `
  mutation AddServerOwnerMutation($serverId: Int!, $userId: Int!) {
    addMember(serverId: $serverId, userId: $userId, role: OWNER) {
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

export const CreateServerDialog = (props: { trigger: ReactElement }) => {
  const user = useUser();

  const [_, createServer] = useMutation(CreateServerMutation);
  const [__, addOwner] = useMutation(AddServerOwnerMutation);

  const action = async (name: string) => {
    const createServerResult = propagateError(
      await createServer({ name }),
      (data) =>
        data.addServer.__typename !== "Server"
          ? data.addServer.message
          : data.addServer
    );
    if (createServerResult.isError) {
      return createServerResult.error;
    }

    const addOwnerResult = propagateError(
      await addOwner({ serverId: +createServerResult.data.id, userId: user }),
      (data) =>
        data.addMember.__typename !== "Member" ? data.addMember.message : data
    );

    if (addOwnerResult.isError) {
      return addOwnerResult.error;
    }
  };
  return (
    <CreateDialog
      title="Create a new server"
      fieldName="Server name"
      action={action}
      trigger={props.trigger}
    />
  );
};
