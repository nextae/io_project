import App from "@/App";
import { ClientProvider } from "@/lib/api/client";
import { AuthProvider } from "@/lib/auth";
import "@/styles/main.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import { TransitionRouter } from "./components/TransitionRouter";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ClientProvider>
        <TransitionRouter>
          <Suspense>
            <App />
          </Suspense>
        </TransitionRouter>
      </ClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
