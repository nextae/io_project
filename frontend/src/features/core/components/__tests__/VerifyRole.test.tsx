import { Role } from "@/gql/graphql";
import {
  describe,
  expect,
  it,
} from "vitest";

import { verifyRole } from "../VerifyRole";

describe("VerifyRole", () => {
  it("returns true if the user has the required role", () => {
    const params = {
      role: Role.Owner,
      requiredRole: Role.Moderator,
    };
    expect(verifyRole(params)).toBe(true);
  });

  it("returns false if the user does not have the required role", () => {
    const params = {
      role: Role.Member,
      requiredRole: Role.Moderator,
    };
    expect(verifyRole(params)).toBe(false);
  });

  it("returns true if the user has one of the required roles", () => {
    const params = {
      role: Role.Moderator,
      roles: [Role.Member, Role.Moderator],
    };
    expect(verifyRole(params)).toBe(true);
  });

  it("returns false if the user does not have one of the required roles", () => {
    const params = {
      role: Role.Owner,
      roles: [Role.Member, Role.Moderator],
    };
    expect(verifyRole(params)).toBe(false);
  });

  it("returns true if the user has the required role and the check is true", () => {
    const params = {
      role: Role.Owner,
      requiredRole: Role.Moderator,
      check: true,
    };
    expect(verifyRole(params)).toBe(true);
  });

  it("returns false if the user has the required role and the check is false", () => {
    const params = {
      role: Role.Owner,
      requiredRole: Role.Moderator,
      check: false,
    };
    expect(verifyRole(params)).toBe(false);
  });

  it("returns false if the user has one of the required roles and the check is false", () => {
    const params = {
      role: Role.Owner,
      roles: [Role.Member, Role.Moderator],
      check: false,
    };
    expect(verifyRole(params)).toBe(false);
  });
});
