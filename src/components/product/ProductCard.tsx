import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/format";

type ProductCardProps = {
  product: Product;
  rotateImages?: boolean;
};

export function ProductCard({ product, rotateImages = false }: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const imageSignature = product.images.join("|");
  const currentImage = product.images[imageIndex] ?? product.images[0];

  useEffect(() => {
    setImageIndex(0);
  }, [product.id, imageSignature]);

  useEffect(() => {
    if (!rotateImages || isPaused || product.images.length < 2) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setImageIndex((currentIndex) => (currentIndex + 1) % product.images.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, [isPaused, product.images.length, rotateImages]);

  return (
    <Link
      className="product-card"
      to={`/producto/${product.slug}`}
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <img
        className={rotateImages ? "product-card-image is-rotating" : "product-card-image"}
        key={currentImage}
        src={currentImage}
        alt={product.name}
        loading="lazy"
      />
      <div className="product-card-copy">
        <span>{product.brand}</span>
        <h3>{product.name}</h3>
        <p>{formatPrice(product.price)}</p>
        <small>Sizes {product.sizes.join(", ")}</small>
      </div>
    </Link>
  );
}
