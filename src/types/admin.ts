import type { Database } from "./database";

export type ManagedProduct = Database["public"]["Tables"]["products"]["Row"];

export type ProductDraft = {
  name: string;
  brand: string;
  model: string;
  price: string;
  sizes: string;
  description: string;
  isPublished: boolean;
};
