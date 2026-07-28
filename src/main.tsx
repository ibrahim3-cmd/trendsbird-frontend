import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// Driver.js tour styles (bundled) — ensures no runtime CDN dependency
import "driver.js/dist/driver.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.tsx";
import { ThemeProvider } from "./providers/theme.provider.tsx";
import { DynamicThemeProvider } from "./providers/dynamicTheme.provider.tsx";
import { GoogleMapsProvider } from "./providers/GoogleMaps.provider.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store.ts";
import { Toaster } from "./components/ui/sonner.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { SystemErrorSupportModal } from "./components/modals/SystemErrorSupportModal.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <DynamicThemeProvider>
            <GoogleMapsProvider>
              <RouterProvider router={router} />
              <Toaster richColors />
            </GoogleMapsProvider>
            <SystemErrorSupportModal />
          </DynamicThemeProvider>
        </ThemeProvider>
      </ReduxProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
