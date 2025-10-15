import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router";
import { router } from "./router/index.ts";
import { store } from "./redux/store.ts";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "./providers/theme.provider.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
<Toaster
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    style: {
      borderRadius: "12px",
      background: "hsl(var(--card))",
      color: "hsl(var(--card-foreground))",
      border: "1px solid hsl(var(--border))",
    },
  }}
/>

      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>
);
