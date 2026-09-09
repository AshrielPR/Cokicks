import { Link } from "react-router-dom";
import { ProductCard } from "../components/product/ProductCard";
import { useWishlist } from "../context/WishlistContext";
import { usePublishedProducts } from "../hooks/usePublishedProducts";

export function WishlistPage() {
  const { savedSlugs } = useWishlist();
  const { error, isLoading, products } = usePublishedProducts();
  const savedSlugSet = new Set(savedSlugs);
  const savedProducts = products.filter((product) => savedSlugSet.has(product.slug));

  return (
    <section className="page-section wishlist-page">
      <div className="section-heading">
        <p className="eyebrow">Tu seleccion</p>
        <h1>Guardados</h1>
        <p className="section-intro">Tus pares guardados permanecen solamente en este navegador.</p>
      </div>

      {isLoading ? (
        <div className="empty-state">
          <p>Cargando guardados.</p>
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && savedSlugs.length === 0 ? (
        <div className="empty-state">
          <p>Aun no has guardado ningun par.</p>
          <Link className="secondary-action" to="/catalogo">
            Ver catalogo
          </Link>
        </div>
      ) : null}

      {!isLoading && !error && savedSlugs.length > 0 && savedProducts.length === 0 ? (
        <div className="empty-state">
          <p>Los pares guardados ya no aparecen en el catalogo.</p>
          <Link className="secondary-action" to="/catalogo">
            Ver catalogo
          </Link>
        </div>
      ) : null}

      {savedProducts.length > 0 ? (
        <div className="product-grid catalog-grid">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} rotateImages />
          ))}
        </div>
      ) : null}
    </section>
  );
}
