import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/format";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link className="product-card" to={`/producto/${product.slug}`}>
      <img src={product.images[0]} alt={product.name} loading="lazy" />
      <div className="product-card-copy">
        <span>{product.brand}</span>
        <h3>{product.name}</h3>
        <p>{formatPrice(product.price)}</p>
        <small>Sizes {product.sizes.join(", ")}</small>
      </div>
    </Link>
  );
}
