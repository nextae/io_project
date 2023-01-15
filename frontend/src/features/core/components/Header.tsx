import { IconButton } from "@/components/IconButton";
import { graphql } from "@/gql";
import { Role } from "@/gql/graphql";
import { useUser } from "@/lib/auth";
import {
  IoAddCircleOutline,
  IoExitOutline,
  IoPencilOutline,
  IoPersonAddOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useQuery } from "urql";
import { InviteUserDialog } from "./dialogs/InviteUserDialog";
import { ChangeServerNameDialog } from "./dialogs/ChangeServerNameDialog";
import { CreateChannelDialog } from "./dialogs/CreateChannelDialog";
import { DeleteServerDialog } from "./dialogs/DeleteServerDialog";
import { VerifyRole } from "./VerifyRole";
import { LeaveServerDialog } from "./dialogs/LeaveServerDialog";

const ChatHeaderQuery = graphql(/* GraphQL */ `
  query ChatHeaderQuery($serverId: Int!, $userId: Int!) {
    server(serverId: $serverId) {
      __typename
      ... on Server {
        id
        name
      }
    }

    member(serverId: $serverId, userId: $userId) {
      __typename
      ... on Member {
        id
        serverId
        role
      }
    }
  }
`);

export const Header = () => {
  const params = useParams();
  const serverId = +params.serverId!;
  const userId = useUser();
  const [{ data }] = useQuery({
    query: ChatHeaderQuery,
    variables: { serverId, userId },
  });

  if (
    data?.server.__typename !== "Server" ||
    data?.member.__typename !== "Member"
  )
    return <div className="header"></div>;

  const name = data?.server.name;
  const role = data?.member.role;

  return (
    <header className="header">
      <div className="imgText">
        <h4>{name}</h4>
      </div>
      <ul className="nav_icons">
        <VerifyRole role={role} requiredRole={Role.Moderator}>
          <li>
            <InviteUserDialog
              serverId={serverId}
              trigger={
                <IconButton
                  title="Invite user"
                  icon={<IoPersonAddOutline />}
                />
              }
            />
          </li>
          <li>
            <CreateChannelDialog
              serverId={serverId}
              trigger={
                <IconButton
                  title="Create channel"
                  icon={<IoAddCircleOutline />}
                />
              }
            />
          </li>
          <li>
            <ChangeServerNameDialog
              serverId={serverId}
              serverName={name}
              trigger={
                <IconButton
                  title="Rename server"
                  icon={<IoPencilOutline />}
                />
              }
            />
          </li>
        </VerifyRole>
        <VerifyRole role={role} requiredRole={Role.Owner}>
          <li>
            <DeleteServerDialog
              serverId={serverId}
              serverName={name}
              trigger={
                <IconButton
                  title="Delete server"
                  icon={<IoTrashBinOutline />}
                />
              }
            />
          </li>
        </VerifyRole>
        <VerifyRole role={role} roles={[Role.Member, Role.Moderator]}>
          <LeaveServerDialog
            serverId={serverId}
            serverName={name}
            trigger={
              <IconButton
                title="Leave server"
                icon={<IoExitOutline />}
                role="menuitem"
              />
            }
          />
        </VerifyRole>
      </ul>
    </header>
  );
};
