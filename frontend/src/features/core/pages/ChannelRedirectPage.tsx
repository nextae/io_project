import { graphql } from "@/gql";
import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "urql";

const FirstChannelQuery = graphql(/* GraphQL */ `
  query FirstChannelQuery($serverId: Int!) {
    firstChannel(serverId: $serverId) {
      __typename
      ... on Channel {
        id
      }
    }
  }
`);

export const ChannelRedirectPage = () => {
  const { serverId } = useParams();
  const [{ data, error }] = useQuery({
    query: FirstChannelQuery,
    variables: { serverId: +serverId! },
  });

  if (error || data?.firstChannel.__typename !== "Channel") {
    return null;
  }

  return <Navigate to={`${data.firstChannel.id}`} />;
};
