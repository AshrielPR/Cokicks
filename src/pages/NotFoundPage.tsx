import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="page-section compact-page">
      <p className="eyebrow">404</p>
      <h1>La pagina no existe.</h1>
      <Link className="secondary-action" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}
