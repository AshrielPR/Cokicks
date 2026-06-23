import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Database } from "../types/database";
import type { Product } from "../types/product";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    model: row.model,
    price: Number(row.price),
    sizes: row.sizes,
    description: row.description,
    images: row.images,
    addedAt: row.created_at,
  };
}

export async function getPublishedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(toProduct);
}

export async function getPublishedProductBySlug(
  slug: string | undefined,
): Promise<Product | undefined> {
  if (!slug) {
    return undefined;
  }

  if (!isSupabaseConfigured || !supabase) {
    return undefined;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toProduct(data) : undefined;
}
