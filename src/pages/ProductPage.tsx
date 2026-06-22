import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
        <p className="eyebrow">Catalogo</p>
        <h1>Cargando listing.</h1>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page-section compact-page">
        <p className="eyebrow">No encontrado</p>
        <h1>Este listing no esta disponible.</h1>
        <Link className="secondary-action" to="/catalogo">
          Volver al catalogo
        </Link>
      </section>
    );
  }

  return <ProductDetails product={product} />;
}

function ProductDetails({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  useEffect(() => {
    setSelectedImage(product.images[0]);
  }, [product]);

  return (
    <section className="product-detail">
      <Link className="back-link" to="/catalogo">
        Volver al catalogo
      </Link>

      <div className="product-gallery">
        <img className="gallery-main" src={selectedImage} alt={product.name} />
        <div className="gallery-thumbs" aria-label="Fotos del producto">
          {product.images.map((image, index) => (
            <button
              className={selectedImage === image ? "thumb-button active" : "thumb-button"}
              key={image}
              type="button"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt={`${product.name} foto ${index + 1}`} />
            </button>
          ))}
        </div>
      </div>

      <aside className="product-info">
        <p className="eyebrow">{product.brand}</p>
        <h1>{product.name}</h1>
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
