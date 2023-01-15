import * as types from "@/gql/graphql";
import { AuthContext, AuthContextType } from "@/lib/auth";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  Client, Provider
} from "urql";
import { vi } from "vitest";
import * as wonka from "wonka";
import { UserSidebar } from "../UserSidebar";

describe("UserSidebar", () => {
  const mockAuth: AuthContextType = {
    actions: {
      logIn: vi.fn(),
      logOut: vi.fn(),
    },
    state: {
      state: "authenticated",
      token: "TOKEN",
      userId: 1,
    },
  };

  const client = {
    executeQuery: vi.fn(),
    executeSubscription: vi.fn(),
    executeMutation: vi.fn(),
  } as unknown as Client;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={mockAuth}>
      <Provider value={client}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    </AuthContext.Provider>
  );
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("renders", () => {
    const result: types.UserSidebarQueryQuery = {
      currentUser: {
        __typename: "User",
        id: "1",
        name: "Test User",
        servers: [
          {
            id: "1",
            name: "Test Server",
          },
        ],
      },
      invitations: [],
    };
    (client.executeQuery as ReturnType<typeof vi.fn>).mockImplementation(() =>
      wonka.fromValue({ data: result })
    );
    render(<UserSidebar />, { wrapper: Wrapper });

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Test Server" })
    ).toBeInTheDocument();
  });

  it("displays errror message", () => {
    (client.executeQuery as ReturnType<typeof vi.fn>).mockImplementation(() =>
      wonka.fromValue({
        error: {
          message: "Test Error",
        },
      })
    );
    render(<UserSidebar />, { wrapper: Wrapper });
    expect(screen.getByText(/Test Error/)).toBeInTheDocument();
  });

  it("allows user to search for a server", async () => {
    const user = userEvent.setup();
    const result: types.UserSidebarQueryQuery = {
      currentUser: {
        __typename: "User",
        id: "1",
        name: "Test User",
        servers: [
          {
            id: "1",
            name: "Test Server A",
          },
          {
            id: "2",
            name: "Test Server B",
          },
        ],
      },
      invitations: [],
    };
    (client.executeQuery as ReturnType<typeof vi.fn>).mockImplementation(() =>
      wonka.fromValue({ data: result })
    );
    render(<UserSidebar />, { wrapper: Wrapper });

    expect(
      screen.getByRole("link", { name: "Test Server A" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Test Server B" })
    ).toBeInTheDocument();

    await user.type(screen.getByRole("textbox"), "Test Server A");

    expect(
      screen.getByRole("link", { name: "Test Server A" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Test Server B" })
    ).not.toBeInTheDocument();
  });
});
