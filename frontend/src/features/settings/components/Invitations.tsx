import styles from "../style.module.css";

import { graphql } from "@/gql";
import {
  AcceptInvitationMutation,
  DeclineInvitationMutation,
} from "@/lib/api/mutations";
import { NewInvitationSubscription } from "@/lib/api/subscriptions";
import { useUser } from "@/lib/auth";
import { formatRelative } from "date-fns";
import { useMutation, useQuery, useSubscription } from "urql";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { IconButton } from "@/components/IconButton";

const InvitationsQuery = graphql(/* GraphQL */ `
  query InvitationsQuery {
    invitations {
      serverId
      userId
      content
      createdAt
      server {
        id
        name
      }
      user {
        id
      }
    }
  }
`);

export const Invitations = () => {
  const userId = useUser();
  let [{ data, error }] = useQuery({ query: InvitationsQuery });
  const [_, acceptInvitation] = useMutation(AcceptInvitationMutation);
  const [__, declineInvitation] = useMutation(DeclineInvitationMutation);
  useSubscription({ query: NewInvitationSubscription });

  if (error || !data) return null;

  return (
    <div className={`${styles.infoList} ${styles.invitations}`}>
      <h2>Invitations</h2>
      {data.invitations.map((invitation) => (
        <div
          key={invitation.serverId}
          className={`${styles.infoBlock} ${styles.invite}`}
        >
          <div className={styles.header}>
            <h3>server: <span>{invitation.server.name}</span></h3>
            <IconButton
            onClick={() => acceptInvitation({ serverId: invitation.serverId })}
            title="Accept invitation"
            icon={<IoCheckmarkOutline />}
          />
          <IconButton
            onClick={() =>
              declineInvitation({ serverId: invitation.serverId, userId })
            }
            title="Decline invitation"
            icon={<IoCloseOutline />}
          />
          </div>
          <p>{invitation.content}</p>
          <span className={styles.timestamp}>
            {formatRelative(new Date(invitation.createdAt * 1000), new Date())}
          </span>
         
        </div>
      ))}
    </div>
  );
};
