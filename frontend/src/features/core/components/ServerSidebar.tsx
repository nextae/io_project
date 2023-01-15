import { graphql } from "@/gql";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useQuery, useSubscription } from "urql";
import { ProfilePicturePlaceholder } from "@/components/ProfilePicture";
import * as subscriptions from "@/lib/api/subscriptions";

import { ChannelMenu } from "./ChannelMenu";
import { useDocumentTitle } from "@/lib/utils";
import { useUser } from "@/lib/auth";
import { Role } from "@/gql/graphql";
import { RoleProvider, VerifyRole } from "./VerifyRole";
import { MemberMenu } from "./MemberMenu";
import { FormError } from "@/components/FormError";

const ServerSidebarQuery = graphql(/* GraphQL */ `
  query ServerSidebarQuery($serverId: Int!, $userId: Int!) {
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
          serverId
          name
          role
        }
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

const ChannelItem = ({
  channel,
  serverId,
}: {
  channel: {
    id: string;
    name: string;
  };
  serverId: number;
}) => (
  <li className="channellistItem" key={channel.id}>
    <NavLink
      to={`/chat/${serverId}/${channel.id}`}
      children={({ isActive }) => (
        <div
          key={channel.id}
          className={`${isActive ? "channel_active" : "channel"}`}
        >
          <p>{channel.name}</p>
        </div>
      )}
    />
    <VerifyRole requiredRole={Role.Moderator}>
      <div className="channellistItemButton">
        <ChannelMenu
          channelId={+channel.id}
          serverId={serverId}
          channelName={channel.name}
        />
      </div>
    </VerifyRole>
  </li>
);

const MemberItem = ({
  member,
  serverId,
}: {
  serverId: number;
  member: {
    id: string;
    name: string;
    role: string;
  };
}) => (
  <li className="block" key={member.id}>
    <div className="imgbx">
      <ProfilePicturePlaceholder name={member.name} />
    </div>
    <div className="details">
      <div className="listHead">
        <p>
          {member.name}{" "}
          {member.role != "MEMBER" && `(${member.role.toLowerCase()})`}
        </p>
        <VerifyRole
          requiredRole={Role.Moderator}
          check={member.role != Role.Owner}
        >
          <MemberMenu
            memberName={member.name}
            userId={+member.id}
            serverId={serverId}
          />
        </VerifyRole>
      </div>
    </div>
  </li>
);

export const ServerSidebar = () => {
  const params = useParams();
  const userId = useUser();

  const [{ data, error }] = useQuery({
    query: ServerSidebarQuery,
    variables: { serverId: +params.serverId!, userId },
  });

  useDocumentTitle(
    data?.server.__typename === "Server" ? data.server.name : "Error"
  );

  const navigate = useNavigate();

  useSubscription({
    query: subscriptions.NewChannelSubscription,
    variables: { serverId: +params.serverId! },
  });
  useSubscription({
    query: subscriptions.NewMemberSubscription,
    variables: { serverId: +params.serverId! },
  });

  useSubscription({
    query: subscriptions.UpdatedServerNameSubscription,
    variables: { serverId: +params.serverId! },
  });
  useSubscription({
    query: subscriptions.UpdatedChannelNameSubscription,
    variables: { serverId: +params.serverId! },
  });

  useSubscription(
    {
      query: subscriptions.DeletedServerSubscription,
      variables: { serverId: +params.serverId! },
    },
    (_, response) => {
      navigate("/");
      return response;
    }
  );
  useSubscription({
    query: subscriptions.DeletedChannelSubscription,
    variables: { serverId: +params.serverId! },
  });
  useSubscription({
    query: subscriptions.DeletedMemberSubscription,
    variables: { serverId: +params.serverId! },
  });

  if (error)
    return (
      <div className="rightSide">
        <FormError error={error.message} />
      </div>
    );
  if (
    data?.server.__typename !== "Server" ||
    data?.member.__typename !== "Member"
  )
    return (
      <div className="rightSide">
        <FormError error="Server not found" full />
      </div>
    );

  const role = data.member.role;

  return (
    <RoleProvider value={role}>
      <div className="rightSide">
        <div className="header">
          <h3>Channels</h3>
        </div>
        <ul className="channellist">
          {data.server.channels.map((channel) => (
            <ChannelItem
              channel={channel}
              serverId={+params.serverId!}
              key={channel.id}
            />
          ))}
        </ul>
        <ul className="peoplelist">
          {data.server.members.map((member) => (
            <MemberItem
              member={member}
              key={member.id}
              serverId={+params.serverId!}
            />
          ))}
        </ul>
      </div>
    </RoleProvider>
  );
};
