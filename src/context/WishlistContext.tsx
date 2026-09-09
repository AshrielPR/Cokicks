import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "cokicks:wishlist:v1";

type WishlistContextValue = {
  savedSlugs: string[];
  isSaved: (slug: string) => boolean;
  toggleSaved: (slug: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readSavedSlugs() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) {
      return [];
    }

    return [...new Set(value.filter((slug): slug is string => typeof slug === "string"))];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>(readSavedSlugs);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSlugs));
    } catch {
      // Guardados sigue funcionando durante la sesion si el navegador bloquea storage.
    }
  }, [savedSlugs]);

  useEffect(() => {
    function syncSavedSlugs(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setSavedSlugs(readSavedSlugs());
      }
    }

    window.addEventListener("storage", syncSavedSlugs);
    return () => window.removeEventListener("storage", syncSavedSlugs);
  }, []);

  const isSaved = useCallback((slug: string) => savedSlugs.includes(slug), [savedSlugs]);
  const toggleSaved = useCallback((slug: string) => {
    setSavedSlugs((current) =>
      current.includes(slug)
        ? current.filter((savedSlug) => savedSlug !== slug)
        : [...current, slug],
    );
  }, []);

  const value = useMemo(
    () => ({ savedSlugs, isSaved, toggleSaved }),
    [isSaved, savedSlugs, toggleSaved],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) {
    throw new Error("useWishlist debe usarse dentro de WishlistProvider");
  }

  return value;
}
