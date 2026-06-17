import { ProductDraftForm } from "../components/admin/ProductDraftForm";

export function AdminPage() {
  return (
    <section className="page-section admin-page">
      <div className="section-heading">
        <p className="eyebrow">Admin</p>
        <h1>Listings</h1>
        <p className="section-intro">
          Borrador visual para el panel futuro. La publicacion real se conectara
          cuando Supabase Auth, Database y Storage esten listos.
        </p>
      </div>

      <ProductDraftForm />
    </section>
  );
}
