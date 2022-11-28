import { graphql } from "@/gql";
import { useUser } from "@/lib/auth";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "urql";
import { ProfilePicturePlaceholder } from "./ProfilePicturePlaceholder";

const ServerSidebarQuery = graphql(/* GraphQL */ `
  query ServerSidebarQuery($serverId: Int!) {
    server(serverId: $serverId) {
      __typename
      ... on Server {
        id
        name
        channels {
          id
          name
        }
        members {
          id
          name
        }
      }
    }
  }
`);

export const ServerSidebar = () => {
  const params = useParams();
  const user = useUser();

  const [{ data, fetching, error }] = useQuery({
    query: ServerSidebarQuery,
    variables: { serverId: +params.serverId! },
  });

  if (fetching) return <div className="rightSide">Loading...</div>;
  if (error) return <div className="rightSide">Error: {error.message}</div>;
  if (data?.server.__typename !== "Server")
    return <div className="rightSide">Not found</div>;

  return (
    <div className="rightSide">
      <div className="header">
        <h3>Channels</h3>
      </div>
      <div className="channellist">
        {data.server.channels.map((channel) => (
          <NavLink
            to={`/chat/${params.serverId}/${channel.id}`}
            key={channel.id}
            children={({ isActive }) => (
              <div
                key={channel.id}
                className={`${isActive ? "channel_active" : "channel"}`}
              >
                <p>{channel.name}</p>
              </div>
            )}
          />
        ))}
      </div>
      <div className="peoplelist">
        {data.server.members.map((member) => (
          <div className="block" key={member.id}>
            <div className="imgbx">
              <ProfilePicturePlaceholder name={member.name} />
            </div>
            <div className="details">
              <div className="listHead">
                <p>
                  {member.name} {+member.id === user && "(you)"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
