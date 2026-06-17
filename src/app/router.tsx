import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { AdminPage } from "../pages/AdminPage";
import { CatalogPage } from "../pages/CatalogPage";
import { ContactPage } from "../pages/ContactPage";
import { HomePage } from "../pages/HomePage";
import { BrandsPage } from "../pages/BrandsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PoliciesPage } from "../pages/PoliciesPage";
import { ProductPage } from "../pages/ProductPage";

const publicRoutes = [
  { index: true, element: <HomePage /> },
  { path: "catalogo", element: <CatalogPage /> },
  { path: "marcas", element: <BrandsPage /> },
  { path: "producto/:slug", element: <ProductPage /> },
  { path: "politicas", element: <PoliciesPage /> },
  { path: "contacto", element: <ContactPage /> },
];

const developmentRoutes = import.meta.env.DEV
  ? [{ path: "admin", element: <AdminPage /> }]
  : [];

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <NotFoundPage />,
      children: [...publicRoutes, ...developmentRoutes],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
