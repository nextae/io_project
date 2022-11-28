import { graphql } from "@/gql";
import { useAuth, useUser } from "@/lib/auth";
import {
  IoAddOutline,
  IoLogOutOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useQuery } from "urql";
import { CreateServerDialog } from "./CreateServerDialog";
import { ProfilePicturePlaceholder } from "./ProfilePicturePlaceholder";

const UserSidebarQuery = graphql(/* GraphQL */ `
  query UserSidebarQuery($userId: Int!) {
    user(userId: $userId) {
      __typename
      ... on User {
        id
        name
        servers {
          id
          name
        }
      }
    }
  }
`);

export const UserSidebar = () => {
  const user = useUser();
  const [{ data, fetching, error }] = useQuery({
    query: UserSidebarQuery,
    variables: { userId: user },
  });
  const {
    actions: { logOut },
  } = useAuth();

  if (fetching) return <div className="leftSide">Loading...</div>;
  if (error) return <div className="leftSide">Error: {error.message}</div>;
  if (data?.user.__typename !== "User")
    return <div className="leftSide">Not found</div>;

  return (
    <div className="leftSide">
      <div className="header">
        <div className="userimg" title={data.user.id}>
          <ProfilePicturePlaceholder name={data.user.name} />
        </div>
        <ul className="nav_icons">
          <CreateServerDialog
            trigger={
              <li>
                <IoAddOutline className="ion-icon" title="Create server" />
              </li>
            }
          />
          <li onClick={() => logOut()}>
            <IoLogOutOutline className="ion-icon" title="Log out" />
          </li>
        </ul>
      </div>

      <div className="search_chat">
        <div>
          <input type="text" placeholder="Search" required />
          <IoSearchOutline className="ion-icon" />
        </div>
      </div>

      <div className="chatlist">
        {data.user.servers.map((server) => (
          <NavLink
            to={`/chat/${server.id}`}
            key={server.id}
            children={({ isActive }) => (
              <div
                key={server.id}
                className={`block ${isActive ? "active" : ""}`}
              >
                <div className="details">
                  <div className="listHead">
                    <h4>{server.name}</h4>
                  </div>
                </div>
              </div>
            )}
          />
        ))}
      </div>
    </div>
  );
};
