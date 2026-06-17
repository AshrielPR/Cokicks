import { ProductDraftForm } from "../components/admin/ProductDraftForm";

export function AdminPage() {
  return (
    <section className="page-section admin-page">
      <div className="section-heading">
        <p className="eyebrow">Admin</p>
        <h1>Listings</h1>
        <p className="section-intro">
          Borrador visual solo para desarrollo local. Esta ruta no se incluye en
          builds de produccion. La publicacion real requiere Supabase Auth,
          roles de administrador y Row Level Security.
        </p>
      </div>

      <div className="security-note">
        <strong>Modo seguro</strong>
        <p>
          Este formulario no guarda datos, no sube fotos y no cambia el
          catalogo. No se debe activar escritura publica desde el frontend.
        </p>
      </div>

      <ProductDraftForm />
    </section>
  );
}
