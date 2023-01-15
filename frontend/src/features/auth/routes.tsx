import { Navigate, Route } from "react-router-dom";
import { LogInPage } from "./pages/LogInPage";
import { RegistrationPage } from "./pages/RegistrationPage";

export const routes = (
  <>
    <Route path="/log_in" element={<LogInPage />} />
    <Route path="/register" element={<RegistrationPage />} />
    <Route path="*" element={<Navigate replace to="/log_in" />} />
  </>
);
