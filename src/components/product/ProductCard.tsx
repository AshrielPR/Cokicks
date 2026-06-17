import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/format";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      className={product.status === "sold" ? "product-card is-sold" : "product-card"}
      to={`/producto/${product.slug}`}
    >
      <span className={`status-pill ${product.status}`}>
        {product.status === "available" ? "Disponible" : "Vendido"}
      </span>
      <img src={product.images[0]} alt={product.name} loading="lazy" />
      <div className="product-card-copy">
        <span>{product.brand}</span>
        <h3>{product.name}</h3>
        <p>{product.status === "sold" ? "Vendido" : formatPrice(product.price)}</p>
        <small>Sizes {product.sizes.join(", ")}</small>
      </div>
    </Link>
  );
}
