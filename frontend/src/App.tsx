import { LogInPage } from "@/components/authentication/LogInPage";
import { RegistrationPage } from "@/components/authentication/RegistrationPage";
import { useAuth } from "@/lib/auth";
import { Navigate, Route, Routes } from "react-router-dom";
import { routes as chatRoutes } from "./components/chat/routes";

const authenticatedRoutes = <>{chatRoutes}</>;

const unAuthenticatedRoutes = (
  <>
    <Route path="/log_in" element={<LogInPage />} />
    <Route path="/register" element={<RegistrationPage />} />
    <Route path="*" element={<Navigate replace to="/log_in" />} />
  </>
);

function App() {
  const { state } = useAuth();
  return (
    <Routes>
      {state.state === "unauthenticated"
        ? unAuthenticatedRoutes
        : authenticatedRoutes}
    </Routes>
  );
}

export default App;
