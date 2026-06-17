export type ProductStatus = "available" | "sold";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  sizes: string[];
  description: string;
  images: string[];
  status: ProductStatus;
  addedAt: string;
};
