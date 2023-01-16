import { LoadingOverlay } from "@/components/LoadingIndicator";
import { useLoadingState } from "@/components/TransitionRouter";
import { routes as authRoutes } from "@/features/auth";
import { routes as chatRoutes } from "@/features/core/routes";
import { routes as settingsRoutes } from "@/features/settings/routes";
import { useAuth } from "@/lib/auth";
import { Routes } from "react-router-dom";

const authenticatedRoutes = (
  <>
    {chatRoutes}
    {settingsRoutes}
  </>
);

const unAuthenticatedRoutes = <>{authRoutes}</>;

function App() {
  const { state } = useAuth();
  const isPending = useLoadingState();
  return (
    <>
      <LoadingOverlay isPending={isPending} />
      <Routes>
        {state.state === "unauthenticated"
          ? unAuthenticatedRoutes
          : authenticatedRoutes}
      </Routes>
    </>
  );
}

export default App;
