import { Navigate, Outlet, Route } from "react-router-dom";
import { Chat } from "./Chat";
import { ChatHeader } from "./ChatHeader";
import { ServerSidebar } from "./ServerSidebar";
import { UserSidebar } from "./UserSidebar";

const ChatPage = () => (
  <div className="container">
    <UserSidebar />
    <Outlet />
  </div>
);

export const routes = (
  <>
    <Route path="/" element={<ChatPage />}>
      <Route
        path="chat/:serverId"
        element={
          <>
            <Outlet />
            <ServerSidebar />
          </>
        }
      >
        <Route path=":channelId" element={<Chat />} />
        <Route
          index
          element={
            <div className="centerBox">
              <ChatHeader />
              No chat selected
            </div>
          }
        />
      </Route>
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
