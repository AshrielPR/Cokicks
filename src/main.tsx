import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { WishlistProvider } from "./context/WishlistContext";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WishlistProvider>
      <RouterProvider router={router} />
    </WishlistProvider>
  </StrictMode>,
);
