import { FormError } from "@/components/FormError";
import { IconButton } from "@/components/IconButton";
import { ProfilePicturePlaceholder } from "@/components/ProfilePicture";
import { graphql } from "@/gql";
import {
  DeletedServerSubscription,
  NewInvitationSubscription,
  UpdatedServerNameSubscription,
} from "@/lib/api/subscriptions";
import { useAuth } from "@/lib/auth";
import { validateResult } from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  IoAddOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useQuery, useSubscription } from "urql";
import { CreateServerDialog } from "./dialogs/CreateServerDialog";

const UserSidebarQuery = graphql(/* GraphQL */ `
  query UserSidebarQuery {
    currentUser {
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
    invitations {
      userId
      serverId
    }
  }
`);

const ServerItem = ({ server }: { server: { id: string; name: string } }) => {
  useSubscription({
    query: UpdatedServerNameSubscription,
    variables: { serverId: parseInt(server.id) },
  });
  useSubscription({
    query: DeletedServerSubscription,
    variables: { serverId: parseInt(server.id) },
  });

  return (
    <li>
      <NavLink
        to={`/chat/${server.id}`}
        children={({ isActive }) => (
          <div className={`block ${isActive ? "active" : ""}`}>
            <div className="details">
              <div className="listHead">
                <h4>{server.name}</h4>
              </div>
            </div>
          </div>
        )}
      />
    </li>
  );
};

export const UserSidebar = () => {
  const [queryResult] = useQuery({
    query: UserSidebarQuery,
  });
  useSubscription({ query: NewInvitationSubscription });

  const result = validateResult(queryResult, (result) =>
    result.currentUser.__typename === "User"
      ? { currentUser: result.currentUser, invitations: result.invitations }
      : "Not found"
  );

  const {
    actions: { logOut },
  } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const servers = useMemo(
    () =>
      !result.isError &&
      result.data.currentUser.servers.filter((server) =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [result, searchQuery]
  );

  if (result.isError)
    return (
      <div className="leftSide">
        <FormError error={result.error} full />
      </div>
    );

  const { currentUser: data } = result.data;
  const { invitations } = result.data;

  return (
    <div className="leftSide">
      <div className="header">
        <div className="imgText">
          <div className="userimg" title={data.id}>
            <ProfilePicturePlaceholder name={data.name} />
          </div>
          <h4 className="username">{data.name}</h4>
        </div>
        <ul className="nav_icons">
          <li>
            <IconButton
              title="Account"
              icon={<IoPersonOutline />}
              onClick={() => navigate("/account")}
              badge={invitations.length > 0}
            />
          </li>

          <li>
            <CreateServerDialog
              trigger={
                <IconButton title="Create server" icon={<IoAddOutline />} />
              }
            />
          </li>
          <li>
            <IconButton
              onClick={() => {
                navigate("/");
                logOut();
              }}
              title="Log out"
              icon={<IoLogOutOutline />}
            />
          </li>
        </ul>
      </div>

      <div className="search_chat">
        <div>
          <input
            type="text"
            placeholder="Search servers"
            required
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoSearchOutline className="ion-icon" />
        </div>
      </div>

      <ul className="chatlist">
        {servers &&
          servers.map((server) => (
            <ServerItem key={server.id} server={server} />
          ))}
      </ul>
    </div>
  );
};
