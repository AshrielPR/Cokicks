import { useWishlist } from "../../context/WishlistContext";

type SaveButtonProps = {
  slug: string;
  productName: string;
  className?: string;
};

export function SaveButton({ slug, productName, className = "" }: SaveButtonProps) {
  const { isSaved, toggleSaved } = useWishlist();
  const saved = isSaved(slug);

  return (
    <button
      type="button"
      className={`save-button ${className}`.trim()}
      data-saved={saved}
      aria-label={saved ? `Quitar ${productName} de guardados` : `Guardar ${productName}`}
      aria-pressed={saved}
      title={saved ? "Quitar de guardados" : "Guardar"}
      onClick={() => toggleSaved(slug)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-10-9.2C.4 8 1.6 4.5 5 3.4c2.1-.7 4.3.1 5.5 1.9L12 7.3l1.5-2c1.2-1.8 3.4-2.6 5.5-1.9 3.4 1.1 4.6 4.6 3 7.9-2.5 4.6-10 9.2-10 9.2Z" />
      </svg>
    </button>
  );
}
