import { createContext, ReactNode, useContext, useState } from "react";
import { Navigate } from "react-router-dom";

type AuthState =
  | { state: "unauthenticated" }
  | { state: "authenticated"; user: number };

interface AuthContextType {
  state: AuthState;
  actions: {
    logIn: (user: number) => void;
    logOut: () => void;
  };
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function useAuth() {
  return useContext(AuthContext);
}

export function useUser() {
  const { state } = useAuth();
  if (state.state === "authenticated") {
    return state.user;
  }
  throw new Error("User is not authenticated");
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { state } = useAuth();
  if (state.state === "authenticated") {
    return <>{children}</>;
  }
  return <Navigate to="/login" />;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const userId = localStorage.getItem("userId");
    return userId
      ? { state: "authenticated", user: +userId }
      : { state: "unauthenticated" };
  });

  const context: AuthContextType = {
    state,
    actions: {
      logIn(userId: number) {
        localStorage.setItem("userId", userId.toString());
        setState({ state: "authenticated", user: userId });
      },
      logOut() {
        localStorage.removeItem("userId");
        setState({ state: "unauthenticated" });
      },
    },
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}
