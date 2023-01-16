import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

export type AuthState =
  | { state: "unauthenticated" }
  | { state: "authenticated"; token: string; userId: number };

export interface AuthContextType {
  state: AuthState;
  actions: {
    logIn: (token: string, userId: number) => void;
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
    return state.userId;
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
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    return (token && userId)
      ? { state: "authenticated", token: token, userId: +userId }
      : { state: "unauthenticated" };
  });

  const context = useMemo<AuthContextType>(() => ({
    state,
    actions: {
      logIn(token: string, userId: number) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId.toString());
        setState({ state: "authenticated", token: token, userId: userId });
      },
      logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setState({ state: "unauthenticated" });
      },
    },
  }), [state]);

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}
