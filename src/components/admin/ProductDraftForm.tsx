import { brands } from "../../data/brands";
import type { ProductDraft } from "../../types/admin";

const draft: ProductDraft = {
  name: "",
  brand: brands[0],
  model: "",
  price: "",
  sizes: "",
  description: "",
  images: "",
  status: "available",
};

export function ProductDraftForm() {
  return (
    <form className="admin-form">
      <label>
        <span>Nombre</span>
        <input placeholder="Jordan 4 Retro..." defaultValue={draft.name} />
      </label>
      <label>
        <span>Marca</span>
        <select defaultValue={draft.brand}>
          {brands.map((brand) => (
            <option key={brand}>{brand}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Modelo</span>
        <input placeholder="Air Jordan 4" defaultValue={draft.model} />
      </label>
      <label>
        <span>Precio</span>
        <input inputMode="numeric" placeholder="285" defaultValue={draft.price} />
      </label>
      <label>
        <span>Sizes</span>
        <input placeholder="8, 9.5, 10" defaultValue={draft.sizes} />
      </label>
      <label>
        <span>Estado</span>
        <select defaultValue={draft.status}>
          <option value="available">Disponible</option>
          <option value="sold">Vendido</option>
        </select>
      </label>
      <label className="admin-wide">
        <span>Fotos</span>
        <textarea placeholder="/products/par-1.jpg, /products/par-2.jpg" defaultValue={draft.images} />
      </label>
      <label className="admin-wide">
        <span>Descripcion</span>
        <textarea placeholder="Descripcion corta del par" defaultValue={draft.description} />
      </label>
      <div className="admin-wide admin-actions">
        <button className="primary-action" type="button">
          Guardar borrador
        </button>
        <button className="secondary-action" type="button">
          Limpiar
        </button>
      </div>
    </form>
  );
}
