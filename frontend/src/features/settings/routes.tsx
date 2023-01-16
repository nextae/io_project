import { Route } from "react-router-dom";
import { SettingsPage } from "./pages/SettingsPage";

export const routes = (
  <>
    <Route path="/account" element={<SettingsPage />} />
  </>
);
