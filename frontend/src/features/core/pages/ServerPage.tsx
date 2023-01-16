import { LoadingIndicator } from "@/components/LoadingIndicator";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { ServerSidebar } from "../components/ServerSidebar";

export const ServerPage = () => (
  <Suspense
    fallback={
      <>
        <div className="centerBox">
          <LoadingIndicator />
        </div>
        <div className="rightSide"></div>
      </>
    }
  >
    <div className="centerBox">
      <Header />
      <Suspense
        fallback={
          <>
            <LoadingIndicator />
          </>
        }
      >
        <Outlet />
      </Suspense>
    </div>
    <ServerSidebar />
  </Suspense>
);
