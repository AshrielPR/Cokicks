import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SaveButton } from "../components/product/SaveButton";
import { business } from "../config/business";
import { usePageMeta } from "../hooks/usePageMeta";
import type { Product } from "../types/product";
import { formatPrice } from "../utils/format";
import { getProductWhatsappUrl } from "../utils/whatsapp";

export function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    import("../data/productRepository")
      .then(({ getPublishedProductBySlug }) => getPublishedProductBySlug(slug))
      .then((result) => {
        if (isMounted) {
          setProduct(result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProduct(undefined);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <section className="page-section compact-page">
        <p className="eyebrow">Catálogo</p>
        <h1>Cargando listing.</h1>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page-section compact-page">
        <p className="eyebrow">No encontrado</p>
        <h1>Este listing no está disponible.</h1>
        <Link className="secondary-action" to="/catalogo">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  return <ProductDetails product={product} />;
}

function ProductDetails({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");

  const productUrl = new URL(
    `producto/${encodeURIComponent(product.slug)}`,
    new URL(import.meta.env.BASE_URL, window.location.origin),
  ).toString();
  const primaryImage = product.images[0]
    ? new URL(product.images[0], window.location.href).toString()
    : undefined;
  const metaDescription =
    product.description.trim() ||
    `${product.name} en ${business.name}. Consulta sizes y disponibilidad por WhatsApp.`;

  usePageMeta({
    title: `${product.name} | ${business.name}`,
    description: metaDescription,
    image: primaryImage,
    url: productUrl,
  });

  useEffect(() => {
    setSelectedImage(product.images[0]);
  }, [product]);

  useEffect(() => {
    if (shareStatus === "idle") {
      return;
    }

    const timeout = window.setTimeout(() => setShareStatus("idle"), 2500);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  async function handleShare() {
    const shareData = {
      title: product.name,
      text: `Mira ${product.name} en ${business.name}`,
      url: productUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof DOMException && error.name !== "AbortError") {
          setShareStatus("error");
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(productUrl);
      setShareStatus("copied");
    } catch {
      setShareStatus("error");
    }
  }

  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    model: product.model,
    description: metaDescription,
    image: product.images.map((image) => new URL(image, window.location.href).toString()),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/LimitedAvailability",
      url: productUrl,
    },
  }).replace(/</g, "\\u003c");

  return (
    <section className="product-detail">
      <script type="application/ld+json">{structuredData}</script>
      <Link className="back-link" to="/catalogo">
        Volver al catálogo
      </Link>

      <div className="product-gallery">
        <img className="gallery-main" src={selectedImage} alt={product.name} />
        <div className="gallery-thumbs" aria-label="Fotos del producto">
          {product.images.map((image, index) => (
            <button
              className={selectedImage === image ? "thumb-button active" : "thumb-button"}
              key={image}
              type="button"
              aria-label={`Ver foto ${index + 1} de ${product.name}`}
              aria-pressed={selectedImage === image}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      </div>

      <aside className="product-info">
        <div className="product-info-heading">
          <div>
            <p className="eyebrow">{product.brand}</p>
            <h1>{product.name}</h1>
          </div>
          <div className="product-info-actions">
            <SaveButton slug={product.slug} productName={product.name} />
            <button
              type="button"
              className="share-button"
              aria-label="Compartir este producto"
              title="Compartir"
              onClick={handleShare}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .05 2.06L8.9 9.1a3 3 0 1 0 0 5.8l6.15 3.04A3 3 0 1 0 16 16l-6.15-3.04a3 3 0 0 0 0-1.92L16 7.99c.15.15.3.29.47.4Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="share-status" aria-live="polite">
          {shareStatus === "copied" ? "Enlace copiado." : null}
          {shareStatus === "error" ? "No se pudo compartir el enlace." : null}
        </div>
        <p className="model-name">{product.model}</p>
        <p className="product-price">{formatPrice(product.price)}</p>
        <div className="product-specs">
          <div>
            <span>Marca</span>
            <strong>{product.brand}</strong>
          </div>
          <div>
            <span>Modelo</span>
            <strong>{product.model}</strong>
          </div>
        </div>
        <div className="size-row">
          {product.sizes.map((size) => (
            <span key={size}>{size}</span>
          ))}
        </div>
        <p className="description">{product.description}</p>
        <a
          className="primary-action full-width product-cta"
          href={getProductWhatsappUrl(product.name)}
          target="_blank"
          rel="noreferrer"
        >
          Preguntar por WhatsApp
        </a>
      </aside>
    </section>
  );
}
