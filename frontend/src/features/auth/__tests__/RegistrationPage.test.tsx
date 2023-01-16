import * as types from "@/gql/graphql";
import { AuthContext } from "@/lib/auth";
import { initClient } from "@/lib/testUtils";
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { graphql } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "urql";
import { vi } from "vitest";
import { RegistrationPage } from "../pages/RegistrationPage";
import { sendVerificationEmail } from "../verifyEmail";

vi.mock("../verifyEmail", async (importOriginal) => {
  const original = (await importOriginal()) as any;
  return {
    generateVerificationCode: original.generateVerificationCode,
    sendVerificationEmail: vi.fn(),
  };
});

describe("RegistrationPage", () => {
  const { client, authContext } = initClient({ state: "unauthenticated" });

  const server = setupServer(
    graphql.mutation<types.RegistrationMutationMutation>(
      "RegistrationMutation",
      (req, res, ctx) => {
        return res(
          ctx.data({
            register: {
              __typename: "AuthPayload",
              token: "TOKEN",
              user: {
                __typename: "User",
                id: "1",
              },
            },
          })
        );
      }
    )
  );

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
    server.resetHandlers();
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={authContext}>
      <Provider value={client}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    </AuthContext.Provider>
  );

  it("renders", () => {
    render(<RegistrationPage />, { wrapper: Wrapper });
    expect(
      screen.getByRole("button", { name: "Create account" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sign up" })
    ).toBeInTheDocument();
  });

  it("checks if password and password confirmation match", async () => {
    const user = userEvent.setup();
    render(<RegistrationPage />, { wrapper: Wrapper });
    await user.type(screen.getByLabelText("Username"), "username");
    await user.type(screen.getByLabelText("Email"), "username@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.type(screen.getByLabelText("Confirm password"), "not password");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(
      await screen.findByText("Passwords do not match")
    ).toBeInTheDocument();
  });

  it("checks if password is at least 8 characters long", async () => {
    const user = userEvent.setup();
    render(<RegistrationPage />, { wrapper: Wrapper });
    await user.type(screen.getByLabelText("Username"), "username");
    await user.type(screen.getByLabelText("Email"), "username@example.com");
    await user.type(screen.getByLabelText("Password"), "pass");
    await user.type(screen.getByLabelText("Confirm password"), "pass");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(
      await screen.findByText("Password must be at least 8 characters long")
    ).toBeInTheDocument();
  });

  it("verifies email and logs in", async () => {
    const user = userEvent.setup();
    render(<RegistrationPage />, { wrapper: Wrapper });

    await user.type(screen.getByLabelText("Username"), "username");
    await user.type(screen.getByLabelText("Email"), "username@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.type(screen.getByLabelText("Confirm password"), "password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Verify email")).toBeInTheDocument();
    expect(sendVerificationEmail).toHaveBeenCalledTimes(1);
    // @ts-expect-error
    const code = sendVerificationEmail.mock.lastCall[1];
    await user.type(screen.getByLabelText("Verification code"), code);
    await user.click(screen.getByRole("button", { name: "Verify" }));
    expect(authContext.actions.logIn).toHaveBeenCalledTimes(1);
  });

  it("displays error if verification code is incorrect", async () => {
    const user = userEvent.setup();
    render(<RegistrationPage />, { wrapper: Wrapper });

    await user.type(screen.getByLabelText("Username"), "username");
    await user.type(screen.getByLabelText("Email"), "username@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.type(screen.getByLabelText("Confirm password"), "password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Verify email")).toBeInTheDocument();
    expect(sendVerificationEmail).toHaveBeenCalledTimes(1);
    await user.type(screen.getByLabelText("Verification code"), "00000000");
    await user.click(screen.getByRole("button", { name: "Verify" }));
    expect(
      await screen.findByText("Invalid verification code")
    ).toBeInTheDocument();
  });
});
