import { Role } from "@/gql/graphql";
import { createContext, ReactNode, useContext } from "react";

export type VerifyRoleParams = {
  /** The role of the user. If not specified, it will be taken from the context. */
  role?: Role;
  /** Additional check to see if the user can see the children. */
  check?: boolean;
} & (
  | {
      /** The required role to see the children. */
      requiredRole: Role;
      roles?: never;
    }
  | {
      requiredRole?: never;
      /** Explicitly specify the roles of the user. */
      roles: Role[];
    }
);
export type VerifyRoleProps = {
  children: ReactNode;
} & VerifyRoleParams;

export function verifyRole(params: VerifyRoleParams) {
  if (!params.role) return false;
  if (params.check === false) return false;
  if (params.roles) {
    if (!params.roles.includes(params.role)) return false;
  }
  if (params.requiredRole) {
    const order = [Role.Member, Role.Moderator, Role.Owner];
    if (order.indexOf(params.role) < order.indexOf(params.requiredRole))
      return false;
  }
  return true;
};

/**
 * This component is used to verify if the user has the required role to see the children.
 */
export const VerifyRole = ({children, ...params}: VerifyRoleProps) => {
  const role = useContext(roleContext);
  if (role) params.role = role;
  if (!verifyRole(params)) return null;
  return <>{children}</>;
};

const roleContext = createContext<Role | null>(null);
export const RoleProvider = roleContext.Provider;

export function useRole() {
  return useContext(roleContext);
}
