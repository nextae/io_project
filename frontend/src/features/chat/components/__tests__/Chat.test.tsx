import * as types from "@/gql/graphql";
import { AuthContext } from "@/lib/auth";
import { initClient, mockWs } from "@/lib/testUtils";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { graphql } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "urql";
import { vi } from "vitest";
import { Chat } from "../Chat";
import * as wonka from "wonka";

const USER = "0";
const SERVER = "43";
const CHANNEL = "142";
const SERVER_NAME = "Test Server";
const CHANNEL_NAME = "Test Channel";

describe("Chat", () => {
  const { client, authContext, wsClient } = initClient({
    state: "authenticated",
    token: "TOKEN",
    userId: +USER,
  });

  let messageId = 0;
  let subject = wonka.makeSubject();

  const server = setupServer(
    graphql.query<types.ChatQueryQuery, types.ChatQueryQueryVariables>(
      "ChatQuery",
      (req, res, ctx) => {
        if (
          req.variables.channelId !== +CHANNEL ||
          req.variables.serverId !== +SERVER
        ) {
          return res(
            ctx.data({
              channel: {
                __typename: "ChannelNotFound",
                message: "Channel with the given id has not been found",
              },
              messages: [],
            })
          );
        }
        return res(
          ctx.data({
            channel: {
              __typename: "Channel",
              id: CHANNEL,
              name: SERVER_NAME,
              server: {
                __typename: "Server",
                id: SERVER,
                name: CHANNEL_NAME,
              },
            },
            messages: [
              {
                __typename: "Message",
                id: "0",
                content: "Test Message",
                createdAt: 1673739925,
                author: {
                  __typename: "User",
                  id: "1",
                  serverId: SERVER,
                  name: "Test User",
                },
                channelId: CHANNEL,
              } as any,
            ],
          })
        );
      }
    ),
    graphql.mutation<
      types.SendMessageMutationMutation,
      types.SendMessageMutationMutationVariables
    >("SendMessageMutation", (req, res, ctx) => {
      const message = {
        __typename: "Message",
        id: (++messageId).toString(),
        content: req.variables.content,
        createdAt: 1673739925,
        author: {
          __typename: "User",
          id: USER,
          serverId: req.variables.serverId,
          name: "Sender",
        },
        channelId: req.variables.channelId,
      };
      subject.next({
        data: {
          newMessage: message,
        },
      });
      return res(
        ctx.data({
          addMessage: message as any,
        })
      );
    })
  );

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  beforeEach(() => {
    subject = wonka.makeSubject();
    mockWs(wsClient, (payload, sink) => {
      wonka.pipe(
        subject.source,
        wonka.onEnd(() => sink.complete()),
        wonka.subscribe((value) => {
          sink.next(value as any);
        })
      );
      return () => {};
    });
    messageId = 0;
  });
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
    server.resetHandlers();
  });

  const wrapper =
    (route: string) =>
    ({ children }: { children: React.ReactNode }) =>
      (
        <AuthContext.Provider value={authContext}>
          <Provider value={client}>
            <MemoryRouter initialEntries={[route]}>
              <Routes>
                <Route
                  path="/chat/:serverId/:channelId"
                  element={<>{children}</>}
                />
              </Routes>
            </MemoryRouter>
          </Provider>
        </AuthContext.Provider>
      );

  it("renders", async () => {
    render(<Chat />, { wrapper: wrapper(`/chat/${SERVER}/${CHANNEL}`) });
    expect(await screen.findByText("Test Message")).toBeInTheDocument();
    expect(await screen.findByText("Test User")).toBeInTheDocument();
    expect(await screen.findByRole("textbox")).toBeInTheDocument();
  });

  it("displays error when is channel not found", async () => {
    render(<Chat />, { wrapper: wrapper(`/chat/111${SERVER}/111${CHANNEL}`) });
    expect(await screen.findByText("Channel not found")).toBeInTheDocument();
  });

  it("sends message", async () => {
    const user = userEvent.setup();
    render(<Chat />, { wrapper: wrapper(`/chat/${SERVER}/${CHANNEL}`) });
    expect(await screen.findByRole("textbox")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), "Test Message 1");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText("Test Message 1")).toBeInTheDocument();
  });
});
