import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/format";
import { SaveButton } from "./SaveButton";

const NEW_BADGE_DURATION_MS = 14 * 24 * 60 * 60 * 1000;

function isNewProduct(addedAt: string) {
  const age = Date.now() - new Date(addedAt).getTime();
  return Number.isFinite(age) && age >= 0 && age <= NEW_BADGE_DURATION_MS;
}

type ProductCardProps = {
  product: Product;
  rotateImages?: boolean;
};

export function ProductCard({ product, rotateImages = false }: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const imageSignature = product.images.join("|");

  useEffect(() => {
    setImageIndex(0);
    setIncomingIndex(null);
    setIsSliding(false);
  }, [product.id, imageSignature]);

  useEffect(() => {
    if (
      !rotateImages ||
      isPaused ||
      incomingIndex !== null ||
      product.images.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const nextIndex = (imageIndex + 1) % product.images.length;
    let nextImage: HTMLImageElement | null = null;
    const showNextImage = () => setIncomingIndex(nextIndex);
    const timer = window.setTimeout(() => {
      nextImage = new Image();
      nextImage.addEventListener("load", showNextImage, { once: true });
      nextImage.src = product.images[nextIndex];

      if (nextImage.complete) {
        showNextImage();
      }
    }, 3800);

    return () => {
      window.clearTimeout(timer);
      nextImage?.removeEventListener("load", showNextImage);
    };
  }, [imageIndex, incomingIndex, isPaused, product.images, rotateImages]);

  useEffect(() => {
    if (incomingIndex === null) {
      return;
    }

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setIsSliding(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [incomingIndex]);

  function finishSlide() {
    if (!isSliding || incomingIndex === null) {
      return;
    }

    setImageIndex(incomingIndex);
    setIncomingIndex(null);
    setIsSliding(false);
  }

  return (
    <article
      className="product-card"
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Link className="product-card-link" to={`/producto/${product.slug}`}>
        <div className="product-card-media">
          <div
            className={`product-card-image-track${isSliding ? " is-sliding" : ""}`}
            onTransitionEnd={finishSlide}
          >
            <img
              className="product-card-image"
              src={product.images[imageIndex]}
              alt={product.name}
              loading="lazy"
            />
            {incomingIndex !== null ? (
              <img
                className="product-card-image"
                src={product.images[incomingIndex]}
                alt=""
                aria-hidden="true"
              />
            ) : null}
          </div>
          {isNewProduct(product.addedAt) ? <span className="new-badge">Nuevo</span> : null}
        </div>
        <div className="product-card-copy">
          <span>{product.brand}</span>
          <h3>{product.name}</h3>
          <p>{formatPrice(product.price)}</p>
          <small>Sizes {product.sizes.join(", ")}</small>
        </div>
      </Link>
      <SaveButton className="product-card-save" slug={product.slug} productName={product.name} />
    </article>
  );
}
