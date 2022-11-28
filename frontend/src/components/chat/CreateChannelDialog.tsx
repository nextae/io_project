import { graphql } from "@/gql";
import { propagateError } from "@/lib/utils";
import { ReactElement } from "react";
import { useMutation } from "urql";
import { CreateDialog } from "./CreateDialog";

const CreateChannelMutation = graphql(/* GraphQL */ `
  mutation CreateChannelMutation($name: String!, $serverId: Int!) {
    addChannel(name: $name, serverId: $serverId) {
      __typename
      ... on Channel {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`);

export const CreateChannelDialog = (props: {
  serverId: number;
  trigger: ReactElement;
}) => {
  const [_, createChannel] = useMutation(CreateChannelMutation);

  const action = async (value: string) => {
    const createServerResult = propagateError(
      await createChannel({ name: value, serverId: props.serverId }),
      (data) =>
        data.addChannel.__typename !== "Channel"
          ? data.addChannel.message
          : data.addChannel
    );
    if (createServerResult.isError) {
      return createServerResult.error;
    }
  };

  return (
    <CreateDialog
      title="Create a new channel"
      fieldName="Channel name"
      action={action}
      trigger={props.trigger}
    />
  );
};
