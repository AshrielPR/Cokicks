import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/product/ProductCard";
import { brands } from "../data/brands";
import { filterProductList } from "../data/productQueries";
import { usePublishedProducts } from "../hooks/usePublishedProducts";

export function CatalogPage() {
  const { error, isLoading, products } = usePublishedProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const brandParam = searchParams.get("brand");
  const initialBrand = brands.some((brand) => brand === brandParam) ? brandParam : "Todos";
  const [selectedBrand, setSelectedBrand] = useState(initialBrand ?? "Todos");
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return filterProductList(products, {
      brand: selectedBrand,
      query,
    });
  }, [products, query, selectedBrand]);

  function selectBrand(brand: string) {
    setSelectedBrand(brand);
    if (brand === "Todos") {
      setSearchParams({});
      return;
    }

    setSearchParams({ brand });
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Catalogo</p>
        <h1>Pares disponibles y recientes</h1>
        <p className="section-intro">
          Explora el inventario actual. Cada listing abre con fotos, sizes y
          contacto directo por WhatsApp.
        </p>
      </div>

      <div className="catalog-toolbar" aria-label="Filtros del catalogo">
        <label className="search-field">
          <span>Buscar</span>
          <input
            type="search"
            value={query}
            placeholder="Nombre, marca o modelo"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="filter-group">
          <span>Marca</span>
          <div className="filter-scroll">
            {["Todos", ...brands].map((brand) => (
              <button
                className={selectedBrand === brand ? "filter-chip active" : "filter-chip"}
                key={brand}
                type="button"
                onClick={() => selectBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="catalog-meta">
        <span>{isLoading ? "Cargando" : `${filteredProducts.length} listings`}</span>
        <span>Venta por WhatsApp</span>
      </div>

      <div className="product-grid catalog-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {isLoading ? <div className="empty-state"><p>Cargando catalogo.</p></div> : null}

      {error ? <div className="empty-state"><p>{error}</p></div> : null}

      {!isLoading && !error && filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No hay pares con esos filtros.</p>
          <button
            className="secondary-action"
            type="button"
            onClick={() => {
              selectBrand("Todos");
              setQuery("");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : null}

      <div className="brand-strip" id="marcas">
        {brands.map((brand) => (
          <span key={brand}>{brand}</span>
        ))}
      </div>
    </section>
  );
}
