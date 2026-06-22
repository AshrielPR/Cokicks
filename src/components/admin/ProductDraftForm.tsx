import { useEffect, useState } from "react";
import { brands } from "../../data/brands";
import { createSlug } from "../../lib/slug";
import { getProductImagePath } from "../../lib/productImages";
import { supabase } from "../../lib/supabase";
import type { ManagedProduct, ProductDraft } from "../../types/admin";

const emptyDraft: ProductDraft = {
  name: "",
  brand: brands[0],
  model: "",
  price: "",
  sizes: "",
  description: "",
  isPublished: true,
};

type ProductDraftFormProps = {
  listing?: ManagedProduct;
  onCancel?: () => void;
  onSaved: () => void;
};

function toDraft(listing?: ManagedProduct): ProductDraft {
  if (!listing) {
    return emptyDraft;
  }

  return {
    name: listing.name,
    brand: listing.brand,
    model: listing.model,
    price: String(listing.price),
    sizes: listing.sizes.join(", "),
    description: listing.description,
    isPublished: listing.is_published,
  };
}

export function ProductDraftForm({ listing, onCancel, onSaved }: ProductDraftFormProps) {
  const [draft, setDraft] = useState<ProductDraft>(() => toDraft(listing));
  const [existingImages, setExistingImages] = useState<string[]>(listing?.images ?? []);
  const [files, setFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(listing);

  useEffect(() => {
    setDraft(toDraft(listing));
    setExistingImages(listing?.images ?? []);
    setFiles(null);
    setMessage("");
  }, [listing]);

  function resetForm() {
    setDraft(emptyDraft);
    setExistingImages([]);
    setFiles(null);
    setMessage("");
  }

  async function uploadImages() {
    if (!supabase || !files?.length) {
      return [];
    }

    const uploadedImages: string[] = [];

    try {
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
    } catch (error) {
      const uploadedPaths = uploadedImages
        .map(getProductImagePath)
        .filter((path): path is string => Boolean(path));

      if (uploadedPaths.length) {
        await supabase.storage.from("product-images").remove(uploadedPaths);
      }

      throw error;
    }

    return uploadedImages;
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase no esta configurado.");
      return;
    }

    const price = Number(draft.price);
    const hasNewImages = Boolean(files?.length);

    if (!draft.name.trim() || !Number.isFinite(price) || price < 0 || (!existingImages.length && !hasNewImages)) {
      setMessage("Nombre, precio valido y al menos una foto son requeridos.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    let uploadedImages: string[] = [];

    try {
      uploadedImages = await uploadImages();
      const images = [...existingImages, ...uploadedImages];
      const sizes = draft.sizes
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);
      const values = {
        slug: createSlug(draft.name),
        name: draft.name.trim(),
        brand: draft.brand,
        model: draft.model.trim(),
        price,
        sizes,
        description: draft.description.trim(),
        images,
        status: "available" as const,
        is_published: draft.isPublished,
      };

      const { error } = listing
        ? await supabase.from("products").update(values).eq("id", listing.id)
        : await supabase.from("products").insert(values);

      if (error) {
        throw error;
      }

      const removedPaths = (listing?.images ?? [])
        .filter((image) => !existingImages.includes(image))
        .map(getProductImagePath)
        .filter((path): path is string => Boolean(path));

      if (removedPaths.length) {
        await supabase.storage.from("product-images").remove(removedPaths);
      }

      if (isEditing) {
        onSaved();
      } else {
        resetForm();
        onSaved();
      }
    } catch (error) {
      const uploadedPaths = uploadedImages
        .map(getProductImagePath)
        .filter((path): path is string => Boolean(path));

      if (uploadedPaths.length) {
        await supabase.storage.from("product-images").remove(uploadedPaths);
      }

      const code = typeof error === "object" && error && "code" in error ? error.code : "";
      setMessage(
        code === "23505"
          ? "Ya existe un listing con ese nombre. Cambia el nombre para continuar."
          : "No se pudo guardar el listing. Intenta de nuevo.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSave}>
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
          inputMode="decimal"
          placeholder="285"
          value={draft.price}
          onChange={(event) => setDraft({ ...draft, price: event.target.value })}
        />
      </label>
      <label className="admin-wide">
        <span>Sizes</span>
        <input
          placeholder="8, 9.5, 10"
          value={draft.sizes}
          onChange={(event) => setDraft({ ...draft, sizes: event.target.value })}
        />
      </label>
      {existingImages.length ? (
        <div className="admin-wide image-manager">
          <span>Fotos actuales</span>
          <div className="admin-image-grid">
            {existingImages.map((image) => (
              <div className="admin-image" key={image}>
                <img src={image} alt="Foto actual del listing" />
                <button
                  aria-label="Quitar foto"
                  className="image-remove"
                  type="button"
                  onClick={() => setExistingImages((images) => images.filter((item) => item !== image))}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <label className="admin-wide">
        <span>{isEditing ? "Añadir fotos" : "Fotos"}</span>
        <input
          accept="image/png,image/jpeg,image/webp"
          multiple
          type="file"
          onChange={(event) => setFiles(event.target.files)}
        />
      </label>
      {files?.length ? <p className="admin-file-count">{files.length} fotos listas para subir.</p> : null}
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
        <span>Visible en catalogo</span>
      </label>
      {message ? <p className="admin-message">{message}</p> : null}
      <div className="admin-wide admin-actions">
        <button className="primary-action" disabled={isSaving} type="submit">
          {isSaving ? "Guardando" : isEditing ? "Guardar cambios" : "Crear listing"}
        </button>
        {isEditing && onCancel ? (
          <button className="secondary-action" type="button" onClick={onCancel}>
            Cancelar
          </button>
        ) : (
          <button className="secondary-action" type="button" onClick={resetForm}>
            Limpiar
          </button>
        )}
      </div>
    </form>
  );
}
