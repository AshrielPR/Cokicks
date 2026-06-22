import { useEffect, useState } from "react";
import type { Product } from "../types/product";

type PublishedProductsState = {
  error: string | null;
  isLoading: boolean;
  products: Product[];
};

export function usePublishedProducts() {
  const [state, setState] = useState<PublishedProductsState>({
    error: null,
    isLoading: true,
    products: [],
  });

  useEffect(() => {
    let isMounted = true;

    import("../data/productRepository")
      .then(({ getPublishedProducts }) => getPublishedProducts())
      .then((products) => {
        if (isMounted) {
          setState({ error: null, isLoading: false, products });
        }
      })
      .catch(() => {
        if (isMounted) {
          setState({
            error: "No se pudo cargar el catalogo. Intenta de nuevo pronto.",
            isLoading: false,
            products: [],
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
