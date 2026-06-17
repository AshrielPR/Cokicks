import type { ProductStatus } from "./product";

export type ProductDraft = {
  name: string;
  brand: string;
  model: string;
  price: string;
  sizes: string;
  description: string;
  images: string;
  status: ProductStatus;
};
