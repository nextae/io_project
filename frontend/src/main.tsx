import App from "@/App";
import { AuthProvider } from "@/lib/auth";
import { ClientProvider } from "@/lib/client";
import "@/styles/style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ClientProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
