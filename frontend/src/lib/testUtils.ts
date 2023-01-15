import { vi } from "vitest";
import { ClientConfig, getAuthConfig, getClient } from "./api/client";
import { AuthContextType } from "./auth";
import crossFetch from "cross-fetch";

const API_URL = "http://localhost/graphql";
const WS_URL = "ws://localhost/graphql";

export function initClient(authState: Partial<AuthContextType["state"]>) {
  const authContext: AuthContextType = {
    state: authState as AuthContextType["state"],
    actions: {
      logIn: vi.fn(),
      logOut: vi.fn(),
    },
  };

  const wsClient: ReturnType<ClientConfig["getWsClient"]> = {
    subscribe: vi.fn(() => () => {}),
    dispose: vi.fn(),
    on: vi.fn(),
    terminate: vi.fn(),
  };

  const client = getClient({
    url: API_URL,
    ws_url: WS_URL,
    authContext,
    getWsClient(url) {
      return wsClient;
    },
    getAuthConfig,
    fetchFunction: crossFetch,
  });

  return { client, wsClient, authContext };
}

export const mockWs = (
  client: ReturnType<ClientConfig["getWsClient"]>,
  subscribe: MockWsSubscribe
) => {
  (client.subscribe as ReturnType<typeof vi.fn>).mockImplementation(subscribe);
};

export type MockWsSubscribe = ReturnType<
  ClientConfig["getWsClient"]
>["subscribe"];
