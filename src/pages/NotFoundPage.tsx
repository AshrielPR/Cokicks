import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="page-section compact-page">
      <p className="eyebrow">404</p>
      <h1>Ese enlace no está disponible.</h1>
      <p>El listing pudo haber cambiado o la página ya no existe.</p>
      <div className="hero-actions">
        <Link className="primary-action" to="/catalogo">
          Ver catálogo
        </Link>
        <Link className="secondary-action" to="/">
          Inicio
        </Link>
      </div>
    </section>
  );
}
