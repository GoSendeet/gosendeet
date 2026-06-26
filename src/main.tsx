import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initAnalytics } from "./lib/analytics.ts";
import { syncSessionFromStorage } from "./lib/authSession.ts";
import { ensureCurrentUserTimezoneStored } from "./lib/timezone.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/query.ts";
import { Toaster } from "@/components/ui/sonner";
import { LoadScriptNext } from "@react-google-maps/api";
import { Spinner } from "./components/Spinner/index.tsx";

initAnalytics();
ensureCurrentUserTimezoneStored();

const renderApp = () =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <LoadScriptNext
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}
          libraries={["places"]}
          loadingElement={
            <div className="h-[100vh] w-full flex items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <App />
        </LoadScriptNext>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </StrictMode>
  );

syncSessionFromStorage().then(renderApp);
