import * as types from "@/gql/graphql";
import { initClient, mockWs } from "@/lib/testUtils";
import { GraphQLError } from "graphql";
import { graphql } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import * as wonka from "wonka";
import {
  ClientConfig,
  GetChannelsQuery,
  GetInvitationsQuery,
  GetMemberRolesQuery,
  GetMembersQuery,
  GetServersQuery,
} from "../client";
import * as mutations from "../mutations";

const VALID_TOKEN = "valid token";
const INVALID_TOKEN = "invalid token";

describe("HTTP client", () => {
  const server = setupServer(
    graphql.query("User", (req, res, ctx) => {
      if (req.headers.get("authorization") === `Bearer ${VALID_TOKEN}`) {
        return res(ctx.data({ currentUser: { __typename: "User", id: 0 } }));
      } else {
        return res(ctx.errors([{ message: "User is not authenticated" }]));
      }
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it("correctly authenticates", async () => {
    const { client } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    const result = await client
      .query(
        /* GraphQL */ `
          query User {
            currentUser {
              __typename
              ... on User {
                id
              }
            }
          }
        `,
        {}
      )
      .toPromise();

    expect(result.data).toEqual({ currentUser: { __typename: "User", id: 0 } });
    expect(result.error).toBeUndefined();
  });

  it("logs out when the token is invalid", async () => {
    const { client, authContext } = initClient({
      state: "authenticated",
      token: INVALID_TOKEN,
    });

    const result = await client
      .query(
        /* GraphQL */ `
          query User {
            currentUser {
              __typename
              ... on User {
                id
              }
            }
          }
        `,
        {}
      )
      .toPromise();

    expect(authContext.actions.logOut).toHaveBeenCalled();
    expect(result.data).toBeUndefined();
    expect(result.error).toBeDefined();
  });
});

describe("WebSocket client", () => {
  const mockSubscribe: ReturnType<ClientConfig["getWsClient"]>["subscribe"] = (
    payload,
    sink
  ) => {
    if (payload.variables && payload.variables.auth === VALID_TOKEN) {
      sink.next({
        data: { newMessage: { __typename: "Message", id: 0 } } as any,
      });
    } else {
      sink.next({ errors: [new GraphQLError("User is not authenticated")] });
    }
    return () => {};
  };

  it("correctly authenticates", () =>
    new Promise<void>((done) => {
      expect.hasAssertions();
      let { client, wsClient } = initClient({
        state: "authenticated",
        token: VALID_TOKEN,
      });
      mockWs(wsClient, mockSubscribe);

      wonka.pipe(
        client.subscription(
          /* GraphQL */ `
            subscription NewMessage {
              newMessage(channelId: 0, serverId: 0) {
                __typename
                id
              }
            }
          `,
          {}
        ),
        wonka.subscribe((result) => {
          expect(result.data).toEqual({
            newMessage: { __typename: "Message", id: 0 },
          });
          expect(result.error).toBeUndefined();
          done();
        })
      );
    }));

  it("logs out if the token is invalid", () =>
    new Promise<void>((done) => {
      expect.hasAssertions();
      let { client, wsClient, authContext } = initClient({
        state: "authenticated",
        token: INVALID_TOKEN,
      });
      mockWs(wsClient, mockSubscribe);

      wonka.pipe(
        client.subscription(
          /* GraphQL */ `
            subscription NewMessage {
              newMessage(channelId: 0, serverId: 0) {
                __typename
                id
              }
            }
          `,
          {}
        ),
        wonka.subscribe((result) => {
          expect(result.error).toBeDefined();
          expect(authContext.actions.logOut).toHaveBeenCalled();
          done();
        })
      );
    }));
});

describe("client graphcache", () => {
  const server = setupServer();

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it("handles addChannel mutation", async () => {
    const { client } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query("GetChannels", (req, res, ctx) => {
        return res(
          ctx.data({ server: { __typename: "Server", id: 0, channels: [] } })
        );
      }),
      graphql.mutation("AddChannel", (req, res, ctx) => {
        return res(ctx.data({ addChannel: { __typename: "Channel", id: 1 } }));
      })
    );

    await client.query(GetChannelsQuery, { serverId: 0 }).toPromise();

    await client
      .mutation(
        /* GraphQL */ `
          mutation AddChannel {
            addChannel(serverId: 0, name: "test") {
              ... on Channel {
                id
              }
            }
          }
        `,
        {}
      )
      .toPromise();

    const result = client.readQuery(GetChannelsQuery, { serverId: 0 });

    expect(result!.data).toEqual({
      server: {
        id: 0,
        channels: [{ id: 1 }],
      },
    });
  });

  it("handles addServer mutation", async () => {
    const { client } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query("GetServers", (req, res, ctx) => {
        return res(
          ctx.data({ currentUser: { __typename: "User", servers: [], id: 0 } })
        );
      }),
      graphql.mutation("AddServer", (req, res, ctx) => {
        return res(ctx.data({ addServer: { __typename: "Server", id: 1 } }));
      })
    );

    await client.query(GetServersQuery, {}).toPromise();

    await client
      .mutation(
        /* GraphQL */ `
          mutation AddServer {
            addServer(name: "test") {
              ... on Server {
                id
              }
            }
          }
        `,
        {}
      )
      .toPromise();

    const result = client.readQuery(GetServersQuery, {});

    expect(result!.data).toEqual({
      currentUser: {
        id: 0,
        servers: [{ id: 1 }],
      },
    });
  });

  it("handles deleteServer mutation", async () => {
    const { client } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query("GetServers", (req, res, ctx) => {
        return res(
          ctx.data({
            currentUser: {
              __typename: "User",
              servers: [{ __typename: "Server", id: 0 }],
              id: 0,
            },
          })
        );
      }),
      graphql.mutation("DeleteServer", (req, res, ctx) => {
        return res(ctx.data({ deleteServer: { __typename: "Server", id: 0 } }));
      })
    );

    await client.query(GetServersQuery, {}).toPromise();

    await client
      .mutation(
        /* GraphQL */ `
          mutation DeleteServer {
            deleteServer(serverId: 0) {
              ... on Server {
                id
              }
            }
          }
        `,
        {}
      )
      .toPromise();

    const result = client.readQuery(GetServersQuery, {});
    expect(result!.data).toEqual({
      currentUser: {
        id: 0,
        servers: [],
      },
    });
  });

  it("handles deleteChannel mutation", async () => {
    const { client } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query("GetChannels", (req, res, ctx) => {
        return res(
          ctx.data({
            server: {
              __typename: "Server",
              id: 0,
              channels: [{ __typename: "Channel", id: 0 }],
            },
          })
        );
      }),
      graphql.mutation("DeleteChannel", (req, res, ctx) => {
        return res(
          ctx.data({ deleteChannel: { __typename: "Channel", id: 0 } })
        );
      })
    );

    await client.query(GetChannelsQuery, { serverId: 0 }).toPromise();

    await client
      .mutation(
        /* GraphQL */ `
          mutation DeleteChannel {
            deleteChannel(serverId: 0, channelId: 0) {
              ... on Channel {
                id
              }
            }
          }
        `,
        {}
      )
      .toPromise();

    const result = client.readQuery(GetChannelsQuery, { serverId: 0 });
    expect(result!.data).toEqual({
      server: {
        id: 0,
        channels: [],
      },
    });
  });

  it("handles kickMember mutation", async () => {
    const { client } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query<types.GetMembersQuery>("GetMembers", (req, res, ctx) => {
        return res(
          ctx.data({
            server: {
              __typename: "Server",
              id: "0",
              members: [
                { __typename: "Member", id: "0", serverId: 0 },
                { __typename: "Member", id: "1", serverId: 0 },
              ],
            },
          })
        );
      }),
      graphql.mutation<types.KickMemberMutation>(
        "KickMember",
        (req, res, ctx) => {
          return res(
            ctx.data({
              kickMember: { __typename: "Member", id: "1", serverId: 0 },
            })
          );
        }
      )
    );

    await client.query(GetMembersQuery, { serverId: 0 }).toPromise();

    await client
      .mutation(
        /* GraphQL */ `
          mutation KickMember {
            kickMember(serverId: 0, userId: 1) {
              ... on Member {
                id
                serverId
              }
            }
          }
        `,
        {}
      )
      .toPromise();

    const result = client.readQuery(GetMembersQuery, { serverId: 0 });
    expect(result!.data).toEqual({
      server: {
        id: "0",
        members: [{ id: "0", serverId: 0 }],
      },
    });
  });

  it("handles leaveServer mutation", async () => {
    const { client } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query("GetServers", (req, res, ctx) => {
        return res(
          ctx.data({
            currentUser: {
              __typename: "User",
              servers: [{ __typename: "Server", id: 0 }],
              id: 0,
            },
          })
        );
      }),
      graphql.mutation("LeaveServer", (req, res, ctx) => {
        return res(
          ctx.data({
            leaveServer: { __typename: "Member", id: 0, serverId: 0 },
          })
        );
      })
    );

    await client.query(GetServersQuery, {}).toPromise();

    await client
      .mutation(
        /* GraphQL */ `
          mutation LeaveServer {
            leaveServer(serverId: 0) {
              ... on Member {
                id
                serverId
              }
            }
          }
        `,
        {}
      )
      .toPromise();

    const result = client.readQuery(GetServersQuery, {});
    expect(result!.data).toEqual({
      currentUser: {
        id: 0,
        servers: [],
      },
    });
  });

  it("handles newMessage subscription", async () => {
    const { client, wsClient } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query("Messages", (req, res, ctx) => {
        return res(ctx.data({ messages: [] }));
      })
    );

    mockWs(wsClient, (payload, sink) => {
      sink.next({
        data: { newMessage: { __typename: "Message", id: 1 } } as any,
      });
      sink.next({
        data: { newMessage: { __typename: "Message", id: 2 } } as any,
      });
      sink.complete();
      return () => {};
    });

    await client
      .query(
        /* GraphQL */ `
          query Messages {
            messages(channelId: 0, serverId: 0) {
              __typename
              id
            }
          }
        `,
        {}
      )
      .toPromise();

    await new Promise<void>((done) => {
      wonka.pipe(
        client.subscription(
          /* GraphQL */ `
            subscription NewMessage {
              newMessage(channelId: 0, serverId: 0) {
                __typename
                id
              }
            }
          `,
          {}
        ),
        wonka.onEnd(() => done()),
        wonka.subscribe((result) => {})
      );
    });

    const result = client.readQuery(
      /* GraphQL */ `
        query Messages {
          messages(channelId: 0, serverId: 0) {
            __typename
            id
          }
        }
      `,
      {}
    );

    expect(result!.data).toEqual({
      messages: [
        { __typename: "Message", id: 2 },
        { __typename: "Message", id: 1 },
      ],
    });
  });

  it("handles newChannel subscription", async () => {
    const { client, wsClient } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query("GetChannels", (req, res, ctx) => {
        return res(
          ctx.data({
            server: {
              __typename: "Server",
              id: 0,
              channels: [
                {
                  __typename: "Channel",
                  id: 0,
                },
              ],
            },
          })
        );
      })
    );

    mockWs(wsClient, (payload, sink) => {
      sink.next({
        data: {
          newChannel: { __typename: "Channel", id: 1 },
        } as any,
      });
      sink.complete();
      return () => {};
    });

    await client.query(GetChannelsQuery, { serverId: 0 }).toPromise();

    await new Promise<void>((done) => {
      wonka.pipe(
        client.subscription(
          /* GraphQL */ `
            subscription NewChannel {
              newChannel(serverId: 0) {
                __typename
                id
              }
            }
          `,
          {}
        ),
        wonka.onEnd(() => done()),
        wonka.subscribe((result) => {})
      );
    });

    const result = client.readQuery(GetChannelsQuery, { serverId: 0 });

    expect(result!.data).toEqual({
      server: {
        id: 0,
        channels: [
          {
            id: 0,
          },
          {
            id: 1,
          },
        ],
      },
    });
  });

  it("handles deletedServer subscription", async () => {
    const { client, wsClient } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query("GetServers", (req, res, ctx) => {
        return res(
          ctx.data({
            currentUser: {
              __typename: "User",
              id: 0,
              servers: [
                {
                  __typename: "Server",
                  id: 0,
                },
              ],
            },
          })
        );
      })
    );

    mockWs(wsClient, (payload, sink) => {
      sink.next({
        data: {
          deletedServer: { __typename: "Server", id: 0 },
        } as any,
      });
      sink.complete();
      return () => {};
    });

    await client.query(GetServersQuery, {}).toPromise();

    await new Promise<void>((done) => {
      wonka.pipe(
        client.subscription(
          /* GraphQL */ `
            subscription DeletedServer {
              deletedServer(serverId: 0) {
                ... on Server {
                  __typename
                  id
                }
              }
            }
          `,
          {}
        ),
        wonka.onEnd(() => done()),
        wonka.subscribe((result) => {})
      );
    });

    const result = client.readQuery(GetServersQuery, {});

    expect(result!.data).toEqual({
      currentUser: {
        id: 0,
        servers: [],
      },
    });
  });

  it("handles deletedChannel subscription", async () => {
    const { client, wsClient } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query("GetChannels", (req, res, ctx) => {
        return res(
          ctx.data({
            server: {
              __typename: "Server",
              id: 0,
              channels: [
                {
                  __typename: "Channel",
                  id: 0,
                },
              ],
            },
          })
        );
      })
    );

    mockWs(wsClient, (payload, sink) => {
      sink.next({
        data: {
          deletedChannel: { __typename: "Channel", id: 0 },
        } as any,
      });
      sink.complete();
      return () => {};
    });

    await client.query(GetChannelsQuery, { serverId: 0 }).toPromise();

    await new Promise<void>((done) => {
      wonka.pipe(
        client.subscription(
          /* GraphQL */ `
            subscription DeletedChannel {
              deletedChannel(serverId: 0) {
                __typename
                id
              }
            }
          `,
          {}
        ),
        wonka.onEnd(() => done()),
        wonka.subscribe((result) => {})
      );
    });

    const result = client.readQuery(GetChannelsQuery, { serverId: 0 });

    expect(result!.data).toEqual({
      server: {
        id: 0,
        channels: [],
      },
    });
  });

  it("handles deletedMember subscription", async () => {
    const { client, wsClient } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query<types.GetMembersQuery>("GetMembers", (req, res, ctx) => {
        return res(
          ctx.data({
            server: {
              __typename: "Server",
              id: "0",
              members: [
                {
                  __typename: "Member",
                  id: "0",
                  serverId: 0,
                },
              ],
            },
          })
        );
      }),
      graphql.query<types.GetServersQuery>("GetServers", (req, res, ctx) => {
        return res(
          ctx.data({
            currentUser: {
              __typename: "User",
              id: "0",
              servers: [
                {
                  __typename: "Server",
                  id: "0",
                },
              ],
            },
          })
        );
      })
    );

    mockWs(wsClient, (payload, sink) => {
      sink.next({
        data: {
          deletedMember: { __typename: "Member", id: "0", serverId: "0" },
        } as any,
      });
      sink.complete();
      return () => {};
    });

    await client.query(GetMembersQuery, { serverId: 0 }).toPromise();
    await client.query(GetServersQuery, {}).toPromise();

    await new Promise<void>((done) => {
      wonka.pipe(
        client.subscription(
          /* GraphQL */ `
            subscription DeletedMember {
              deletedMember(serverId: 0) {
                __typename
                id
                serverId
              }
            }
          `,
          {}
        ),
        wonka.onEnd(() => done()),
        wonka.subscribe((result) => {})
      );
    });

    const members = client.readQuery(GetMembersQuery, { serverId: 0 });

    expect(members!.data).toEqual({
      server: {
        id: "0",
        members: [],
      },
    });

    const servers = client.readQuery(GetServersQuery, {});

    expect(servers!.data).toEqual({
      currentUser: {
        id: "0",
        servers: [],
      },
    });
  });

  it("handles newMember subscription", async () => {
    const { client, wsClient } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query<types.GetMembersQuery>("GetMembers", (req, res, ctx) => {
        return res(
          ctx.data({
            server: {
              __typename: "Server",
              id: "0",
              members: [
                {
                  __typename: "Member",
                  id: "0",
                  serverId: 0,
                },
              ],
            },
          })
        );
      })
    );

    mockWs(wsClient, (payload, sink) => {
      sink.next({
        data: {
          newMember: { __typename: "Member", id: 1, serverId: 0 },
        } as any,
      });
      sink.complete();
      return () => {};
    });

    await client.query(GetMembersQuery, { serverId: 0 }).toPromise();

    await new Promise<void>((done) => {
      wonka.pipe(
        client.subscription(
          /* GraphQL */ `
            subscription NewMember {
              newMember(serverId: 0) {
                __typename
                id
                serverId
              }
            }
          `,
          {}
        ),
        wonka.onEnd(() => done()),
        wonka.subscribe((result) => {})
      );
    });

    const members = client.readQuery(GetMembersQuery, { serverId: 0 });

    expect(members!.data).toEqual({
      server: {
        id: "0",
        members: [
          {
            id: "0",
            serverId: 0,
          },
          {
            id: 1,
            serverId: 0,
          },
        ],
      },
    });
  });

  it("handles newInvitation subscription", async () => {
    const { client, wsClient } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query("GetInvitations", (req, res, ctx) => {
        return res(
          ctx.data({
            invitations: [],
          })
        );
      })
    );

    mockWs(wsClient, (payload, sink) => {
      sink.next({
        data: {
          newInvitation: { __typename: "Invitation", serverId: 1 },
        } as any,
      });
      sink.complete();
      return () => {};
    });

    await client.query(GetInvitationsQuery, {}).toPromise();

    await new Promise<void>((done) => {
      wonka.pipe(
        client.subscription(
          /* GraphQL */ `
            subscription NewInvitation {
              newInvitation {
                __typename
                serverId
              }
            }
          `,
          {}
        ),
        wonka.onEnd(() => done()),
        wonka.subscribe((result) => {})
      );
    });

    const invitations = client.readQuery(GetInvitationsQuery, {});

    expect(invitations!.data).toEqual({
      invitations: [
        {
          serverId: 1,
        },
      ],
    });
  });

  it("handles acceptInvitation mutation", async () => {
    const { client } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query<types.GetInvitationsQuery>(
        "GetInvitations",
        (req, res, ctx) => {
          return res(
            ctx.data({
              invitations: [
                {
                  serverId: 0,
                  __typename: "Invitation",
                },
              ],
            })
          );
        }
      )
    );

    server.use(
      graphql.query<types.GetMembersQuery>("GetMembers", (req, res, ctx) => {
        return res(
          ctx.data({
            server: {
              __typename: "Server",
              id: "0",
              members: [],
            },
          })
        );
      })
    );

    server.use(
      graphql.query<types.GetServersQuery>("GetServers", (req, res, ctx) => {
        return res(
          ctx.data({
            currentUser: {
              id: "0",
              __typename: "User",
              servers: [],
            },
          })
        );
      })
    );

    server.use(
      graphql.mutation("AcceptInvitation", (req, res, ctx) => {
        return res(
          ctx.data({
            acceptInvitation: {
              __typename: "Invitation",
              serverId: 0,
              userId: 0,
            },
          })
        );
      })
    );

    await client.query(GetMembersQuery, { serverId: 0 }).toPromise();
    await client.query(GetServersQuery, {}).toPromise();
    await client.query(GetInvitationsQuery, {}).toPromise();

    await client
      .mutation(
        /* GraphQL */ `
          mutation AcceptInvitation($serverId: Int!) {
            acceptInvitation(serverId: $serverId) {
              __typename
              ... on Invitation {
                serverId
                userId
              }
            }
          }
        `,
        { serverId: 0 }
      )
      .toPromise();

    const invitations = client.readQuery(GetInvitationsQuery, {});
    expect(invitations!.data).toEqual({
      invitations: [],
    });
    const members = client.readQuery(GetMembersQuery, { serverId: 0 });
    expect(members!.data).toEqual({
      server: {
        id: "0",
        members: [
          {
            id: "0",
            serverId: 0,
          },
        ],
      },
    });

    const servers = client.readQuery(GetServersQuery, {});
    expect(servers!.data).toEqual({
      currentUser: {
        id: "0",
        servers: [
          {
            id: "0",
          },
        ],
      },
    });
  });

  it("handles declineInvitation mutation", async () => {
    const { client } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query<types.GetInvitationsQuery>(
        "GetInvitations",
        (req, res, ctx) => {
          return res(
            ctx.data({
              invitations: [
                {
                  serverId: 0,
                  __typename: "Invitation",
                },
              ],
            })
          );
        }
      )
    );

    server.use(
      graphql.mutation("DeclineInvitation", (req, res, ctx) => {
        return res(
          ctx.data({
            declineInvitation: {
              __typename: "Invitation",
              serverId: 0,
            },
          })
        );
      })
    );

    await client.query(GetInvitationsQuery, {}).toPromise();

    await client
      .mutation(
        /* GraphQL */ `
          mutation DeclineInvitation($serverId: Int!) {
            declineInvitation(serverId: $serverId) {
              __typename
              ... on Invitation {
                serverId
              }
            }
          }
        `,
        { serverId: 0 }
      )
      .toPromise();

    const invitations = client.readQuery(GetInvitationsQuery, {});
    expect(invitations!.data).toEqual({
      invitations: [],
    });
  });

  it("handles changeMemberRole mutation", async () => {
    const { client } = initClient({
      state: "authenticated",
      token: VALID_TOKEN,
    });

    server.use(
      graphql.query<types.GetMemberRolesQuery>(
        "GetMemberRoles",
        (req, res, ctx) => {
          return res(
            ctx.data({
              server: {
                __typename: "Server",
                id: "0",
                members: [
                  {
                    __typename: "Member",
                    id: "0",
                    serverId: 0,
                    role: types.Role.Owner,
                  },
                  {
                    __typename: "Member",
                    id: "1",
                    serverId: 0,
                    role: types.Role.Member,
                  },
                ],
              },
            })
          );
        }
      )
    );

    server.use(
      graphql.mutation<types.ChangeMemberRoleMutationMutation>(
        "ChangeMemberRoleMutation",
        (req, res, ctx) => {
          return res(
            ctx.data({
              changeMemberRole: {
                __typename: "Member",
                id: "1",
                serverId: 0,
                name: "test",
                role: types.Role.Owner,
              },
            })
          );
        }
      )
    );

    await client.query(GetMemberRolesQuery, { serverId: 0 }).toPromise();
    await client.mutation(mutations.ChangeMemberRoleMutation, {serverId: 0, userId: 1, newRole: types.Role.Owner}).toPromise();
    const members = client.readQuery(GetMemberRolesQuery, { serverId: 0 });
    expect(members!.data).toEqual({
      server: {
        id: "0",
        members: [
          {
            id: "0",
            serverId: 0,
            role: types.Role.Moderator,
          },
          {
            id: "1",
            serverId: 0,
            role: types.Role.Owner,
          },
        ],
      },
    });
  });
});
