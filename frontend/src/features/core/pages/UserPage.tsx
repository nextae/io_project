import { LoadingOverlay } from "@/components/LoadingIndicator";
import { useDocumentTitle } from "@/lib/utils";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { UserSidebar } from "../components/UserSidebar";

export const UserPage = () => {
  useDocumentTitle("Home");

  return (
    <div className="container">
      <Suspense
        fallback={
          <>
            <LoadingOverlay isPending={true} />
            <div className="leftSide"></div>
            <div className="centerBox"></div>
            <div className="rightSide"></div>
          </>
        }
      >
        <UserSidebar />
        <Outlet />
      </Suspense>
    </div>
  );
};
