import { useState } from "react";
import { brands } from "../../data/brands";
import { createSlug } from "../../lib/slug";
import { supabase } from "../../lib/supabase";
import type { ProductDraft } from "../../types/admin";

const initialDraft: ProductDraft = {
  name: "",
  brand: brands[0],
  model: "",
  price: "",
  sizes: "",
  description: "",
  images: [],
  status: "available",
  isPublished: true,
};

export function ProductDraftForm() {
  const [draft, setDraft] = useState<ProductDraft>(initialDraft);
  const [files, setFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!supabase) {
      setMessage("Supabase no esta configurado.");
      return;
    }

    if (!draft.name.trim() || !draft.price.trim() || !files?.length) {
      setMessage("Nombre, precio y al menos una foto son requeridos.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const uploadedImages: string[] = [];

    try {
      if (files) {
        for (const file of Array.from(files)) {
          const extension = file.name.split(".").pop() ?? "jpg";
          const path = `${createSlug(draft.name)}/${crypto.randomUUID()}.${extension}`;
          const { error } = await supabase.storage
            .from("product-images")
            .upload(path, file, { upsert: false });

          if (error) {
            throw error;
          }

          const { data } = supabase.storage.from("product-images").getPublicUrl(path);
          uploadedImages.push(data.publicUrl);
        }
      }

      const sizes = draft.sizes
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);

      const { error } = await supabase.from("products").insert({
        slug: createSlug(draft.name),
        name: draft.name.trim(),
        brand: draft.brand,
        model: draft.model.trim(),
        price: Number(draft.price),
        sizes,
        description: draft.description.trim(),
        images: uploadedImages,
        status: draft.status,
        is_published: draft.isPublished,
      });

      if (error) {
        throw error;
      }

      setDraft(initialDraft);
      setFiles(null);
      setMessage("Listing guardado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="admin-form">
      <label>
        <span>Nombre</span>
        <input
          placeholder="Jordan 4 Retro..."
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
        />
      </label>
      <label>
        <span>Marca</span>
        <select
          value={draft.brand}
          onChange={(event) => setDraft({ ...draft, brand: event.target.value })}
        >
          {brands.map((brand) => (
            <option key={brand}>{brand}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Modelo</span>
        <input
          placeholder="Air Jordan 4"
          value={draft.model}
          onChange={(event) => setDraft({ ...draft, model: event.target.value })}
        />
      </label>
      <label>
        <span>Precio</span>
        <input
          inputMode="numeric"
          placeholder="285"
          value={draft.price}
          onChange={(event) => setDraft({ ...draft, price: event.target.value })}
        />
      </label>
      <label>
        <span>Sizes</span>
        <input
          placeholder="8, 9.5, 10"
          value={draft.sizes}
          onChange={(event) => setDraft({ ...draft, sizes: event.target.value })}
        />
      </label>
      <label>
        <span>Estado</span>
        <select
          value={draft.status}
          onChange={(event) =>
            setDraft({ ...draft, status: event.target.value as ProductDraft["status"] })
          }
        >
          <option value="available">Disponible</option>
          <option value="sold">Vendido</option>
        </select>
      </label>
      <label className="admin-wide">
        <span>Fotos</span>
        <input
          accept="image/png,image/jpeg,image/webp"
          multiple
          type="file"
          onChange={(event) => setFiles(event.target.files)}
        />
      </label>
      <label className="admin-wide">
        <span>Descripcion</span>
        <textarea
          placeholder="Descripcion corta del par"
          value={draft.description}
          onChange={(event) => setDraft({ ...draft, description: event.target.value })}
        />
      </label>
      <label className="admin-check admin-wide">
        <input
          checked={draft.isPublished}
          type="checkbox"
          onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })}
        />
        <span>Publicado en catalogo</span>
      </label>
      {message ? <p className="admin-message">{message}</p> : null}
      <div className="admin-wide admin-actions">
        <button
          className="primary-action"
          disabled={isSaving}
          type="button"
          onClick={handleSave}
        >
          {isSaving ? "Guardando" : "Publicar listing"}
        </button>
        <button
          className="secondary-action"
          type="button"
          onClick={() => {
            setDraft(initialDraft);
            setFiles(null);
            setMessage("");
          }}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
