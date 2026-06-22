import { Link } from "react-router-dom";
import { brands } from "../data/brands";
import { usePublishedProducts } from "../hooks/usePublishedProducts";

export function BrandsPage() {
  const { isLoading, products } = usePublishedProducts();

  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Marcas</p>
        <h1>Curado para rotaciones premium</h1>
        <p className="section-intro">
          Esta base queda lista para crecer con mas marcas, filtros y listings
          conectados a Supabase cuando llegue el admin panel.
        </p>
      </div>

      <div className="brand-grid">
        {brands.map((brand) => {
          const count = products.filter((product) => product.brand === brand).length;

          return (
            <Link className="brand-card" key={brand} to={`/catalogo?brand=${encodeURIComponent(brand)}`}>
              <span>{brand}</span>
              <small>
                {isLoading ? "Cargando" : count === 1 ? "1 listing" : `${count} listings`}
              </small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
