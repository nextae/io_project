import { Navigate, Route } from "react-router-dom";
import { Chat } from "@/features/chat/components/Chat";
import { UserPage } from "./pages/UserPage";
import { ServerPage } from "./pages/ServerPage";
import { ChannelRedirectPage } from "./pages/ChannelRedirectPage";
import { routes as settingsRoutes } from "@/features/settings/routes";

export const routes = (
  <>
    <Route path="/" element={<UserPage />}>
      <Route path="chat" element={<Navigate replace to="/" />} />
      <Route path="chat/:serverId" element={<ServerPage />}>
        <Route path=":channelId" element={<Chat />} />
        <Route index element={<ChannelRedirectPage />} />
      </Route>
      {settingsRoutes}
      <Route
        index
        element={
          <>
            <div className="centerBox">No server selected</div>
            <div className="rightSide"></div>
          </>
        }
      />
    </Route>
    <Route path="/log_in" element={<Navigate replace to="/" />} />
    <Route path="/register" element={<Navigate replace to="/" />} />
  </>
);
