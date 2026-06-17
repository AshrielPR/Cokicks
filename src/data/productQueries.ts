import type { Product, ProductStatus } from "../types/product";
import { products } from "./products";

export type ProductFilters = {
  brand?: string;
  query?: string;
  status?: "all" | ProductStatus;
};

export function getLatestProducts(limit = 3) {
  return [...products]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit);
}

export function getProductBySlug(slug: string | undefined) {
  return products.find((product) => product.slug === slug);
}

export function getBrandProductCount(brand: string) {
  return products.filter((product) => product.brand === brand).length;
}

export function filterProducts({ brand, query = "", status = "all" }: ProductFilters) {
  const selectedBrand = brand ?? "Todos";
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesBrand =
      selectedBrand === "Todos" || product.brand === selectedBrand;
    const matchesStatus = status === "all" || product.status === status;
    const matchesQuery =
      normalizedQuery.length === 0 || searchableProductText(product).includes(normalizedQuery);

    return matchesBrand && matchesStatus && matchesQuery;
  });
}

function searchableProductText(product: Product) {
  return [product.name, product.brand, product.model, product.description, ...product.sizes]
    .join(" ")
    .toLowerCase();
}
