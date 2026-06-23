import type { Product } from "../types/product";

export type ProductFilters = {
  brand?: string;
  query?: string;
};

export function getLatestProductList(productList: Product[], limit = 3) {
  return [...productList]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit);
}

export function filterProductList(
  productList: Product[],
  { brand, query = "" }: ProductFilters,
) {
  const selectedBrand = brand ?? "Todos";
  const normalizedQuery = query.trim().toLowerCase();

  return productList.filter((product) => {
    const matchesBrand =
      selectedBrand === "Todos" || product.brand === selectedBrand;
    const matchesQuery =
      normalizedQuery.length === 0 || searchableProductText(product).includes(normalizedQuery);

    return matchesBrand && matchesQuery;
  });
}

function searchableProductText(product: Product) {
  return [product.name, product.brand, product.model, product.description, ...product.sizes]
    .join(" ")
    .toLowerCase();
}
