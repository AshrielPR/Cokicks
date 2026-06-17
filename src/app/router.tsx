import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { CatalogPage } from "../pages/CatalogPage";
import { ContactPage } from "../pages/ContactPage";
import { HomePage } from "../pages/HomePage";
import { BrandsPage } from "../pages/BrandsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PoliciesPage } from "../pages/PoliciesPage";
import { ProductPage } from "../pages/ProductPage";

const AdminPage = lazy(() =>
  import("../pages/AdminPage").then((module) => ({ default: module.AdminPage })),
);

const publicRoutes = [
  { index: true, element: <HomePage /> },
  { path: "catalogo", element: <CatalogPage /> },
  { path: "marcas", element: <BrandsPage /> },
  { path: "producto/:slug", element: <ProductPage /> },
  { path: "politicas", element: <PoliciesPage /> },
  { path: "contacto", element: <ContactPage /> },
];

const developmentRoutes = import.meta.env.DEV
  || import.meta.env.VITE_ENABLE_ADMIN === "true"
  ? [
      {
        path: "admin",
        element: (
          <Suspense fallback={<section className="page-section compact-page">Cargando</section>}>
            <AdminPage />
          </Suspense>
        ),
      },
    ]
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
