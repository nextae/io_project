import { graphql } from "@/gql";
import { IoAddCircleOutline, IoPersonAddOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useQuery } from "urql";
import { AddMemberDialog } from "./AddMemberDialog";
import { CreateChannelDialog } from "./CreateChannelDialog";

const ChatHeaderQuery = graphql(/* GraphQL */ `
  query ChatHeaderQuery($serverId: Int!) {
    server(serverId: $serverId) {
      __typename
      ... on Server {
        id
        name
      }
    }
  }
`);

export const ChatHeader = () => {
  const params = useParams();
  const serverId = +params.serverId!;
  const [{ data }] = useQuery({
    query: ChatHeaderQuery,
    variables: { serverId },
  });
  const name = data?.server.__typename === "Server" ? data.server.name : null;

  return (
    <div className="header">
      <div className="imgText">
        <h4>{name}</h4>
      </div>
      <ul className="nav_icons">
        <AddMemberDialog
          serverId={serverId}
          trigger={
            <li>
              <IoPersonAddOutline className="ion-icon" title="Add member" />
            </li>
          }
        />
        <CreateChannelDialog
          serverId={serverId}
          trigger={
            <li>
              <IoAddCircleOutline className="ion-icon" title="Create channel" />
            </li>
          }
        />
      </ul>
    </div>
  );
};
