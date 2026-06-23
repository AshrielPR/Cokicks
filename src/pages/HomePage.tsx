import { Link } from "react-router-dom";
import { ProductCard } from "../components/product/ProductCard";
import { assets } from "../config/assets";
import { business } from "../config/business";
import { brands } from "../data/brands";
import { getLatestProductList } from "../data/productQueries";
import { usePublishedProducts } from "../hooks/usePublishedProducts";

export function HomePage() {
  const { isLoading, products } = usePublishedProducts();
  const latestProducts = getLatestProductList(products, 3);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <img className="hero-logo" src={assets.logo} alt={business.name} />
          <p className="eyebrow">Puerto Rico sneaker catalog</p>
          <h1>{business.name}</h1>
          <p>
            Pares curados con estetica premium, listos para ver detalles y
            cerrar por WhatsApp.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" to="/catalogo">
              Ver catalogo
            </Link>
            <a className="secondary-action" href={business.instagramUrl} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="section-block editorial-band">
        <div>
          <p className="eyebrow">Como funciona</p>
          <h2>Ves el par. Abres el listing. Escribes por WhatsApp.</h2>
        </div>
        <p>
          CoKicks no usa carrito ni checkout. El catalogo existe para enseñar
          inventario con claridad y mover la conversacion directo a venta.
        </p>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Nuevos pares</p>
          <h2>Ultimos añadidos</h2>
        </div>
        <div className="product-grid">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {isLoading ? <p className="section-intro">Cargando nuevos pares.</p> : null}
        {!isLoading && latestProducts.length === 0 ? (
          <p className="section-intro">Nuevos listings muy pronto.</p>
        ) : null}
      </section>

      <section className="section-block brand-preview">
        <div className="section-heading">
          <p className="eyebrow">Marcas</p>
          <h2>Desde classics hasta designer pairs</h2>
        </div>
        <div className="brand-strip">
          {brands.slice(0, 9).map((brand) => (
            <Link key={brand} to={`/catalogo?brand=${encodeURIComponent(brand)}`}>
              {brand}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
