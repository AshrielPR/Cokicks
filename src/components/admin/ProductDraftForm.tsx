import { useEffect, useRef, useState } from "react";
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

type ProductImage =
  | { id: string; kind: "existing"; url: string }
  | { file: File; id: string; kind: "new"; url: string };

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

function existingImageItems(listing?: ManagedProduct): ProductImage[] {
  return (listing?.images ?? []).map((url) => ({
    id: url,
    kind: "existing",
    url,
  }));
}

export function ProductDraftForm({ listing, onCancel, onSaved }: ProductDraftFormProps) {
  const [draft, setDraft] = useState<ProductDraft>(() => toDraft(listing));
  const [images, setImages] = useState<ProductImage[]>(() => existingImageItems(listing));
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const previewUrls = useRef(new Set<string>());
  const isEditing = Boolean(listing);

  function releasePreview(image: ProductImage) {
    if (image.kind === "new") {
      URL.revokeObjectURL(image.url);
      previewUrls.current.delete(image.url);
    }
  }

  function releaseNewPreviews() {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current.clear();
  }

  useEffect(() => {
    setDraft(toDraft(listing));
    setImages((currentImages) => {
      currentImages.forEach(releasePreview);
      return existingImageItems(listing);
    });
    setMessage("");
  }, [listing]);

  useEffect(() => {
    return () => releaseNewPreviews();
  }, []);

  function resetForm() {
    releaseNewPreviews();
    setDraft(emptyDraft);
    setImages([]);
    setMessage("");
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) {
      return;
    }

    const newImages = Array.from(fileList).map((file) => {
      const url = URL.createObjectURL(file);
      previewUrls.current.add(url);
      return {
        file,
        id: crypto.randomUUID(),
        kind: "new" as const,
        url,
      };
    });

    setImages((currentImages) => [...currentImages, ...newImages]);
    setMessage("");
  }

  function moveImage(id: string, direction: -1 | 1) {
    setImages((currentImages) => {
      const index = currentImages.findIndex((image) => image.id === id);
      const nextIndex = index + direction;

      if (index === -1 || nextIndex < 0 || nextIndex >= currentImages.length) {
        return currentImages;
      }

      const reordered = [...currentImages];
      [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
      return reordered;
    });
  }

  function makeCover(id: string) {
    setImages((currentImages) => {
      const selected = currentImages.find((image) => image.id === id);
      return selected ? [selected, ...currentImages.filter((image) => image.id !== id)] : currentImages;
    });
  }

  function removeImage(id: string) {
    setImages((currentImages) => {
      const selected = currentImages.find((image) => image.id === id);
      if (selected) {
        releasePreview(selected);
      }

      return currentImages.filter((image) => image.id !== id);
    });
  }

  async function uploadImages() {
    if (!supabase) {
      return { images: [], uploadedImages: [] };
    }

    const uploadedImages: string[] = [];
    const uploadedUrls = new Map<string, string>();

    try {
      for (const image of images) {
        if (image.kind !== "new") {
          continue;
        }

        const extension = image.file.name.split(".").pop() ?? "jpg";
        const path = `${createSlug(draft.name)}/${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage
          .from("product-images")
          .upload(path, image.file, { upsert: false });

        if (error) {
          throw error;
        }

        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        uploadedImages.push(data.publicUrl);
        uploadedUrls.set(image.id, data.publicUrl);
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

    return {
      images: images.map((image) =>
        image.kind === "existing" ? image.url : uploadedUrls.get(image.id)!,
      ),
      uploadedImages,
    };
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase no esta configurado.");
      return;
    }

    const price = Number(draft.price);

    if (!draft.name.trim() || !Number.isFinite(price) || price < 0 || !images.length) {
      setMessage("Nombre, precio valido y al menos una foto son requeridos.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    let uploadedImages: string[] = [];

    try {
      const imageUpload = await uploadImages();
      uploadedImages = imageUpload.uploadedImages;
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
        images: imageUpload.images,
        status: "available" as const,
        is_published: draft.isPublished,
      };

      const { error } = listing
        ? await supabase.from("products").update(values).eq("id", listing.id)
        : await supabase.from("products").insert(values);

      if (error) {
        throw error;
      }

      const existingUrls = images
        .filter((image): image is Extract<ProductImage, { kind: "existing" }> => image.kind === "existing")
        .map((image) => image.url);
      const removedPaths = (listing?.images ?? [])
        .filter((image) => !existingUrls.includes(image))
        .map(getProductImagePath)
        .filter((path): path is string => Boolean(path));

      if (removedPaths.length) {
        await supabase.storage.from("product-images").remove(removedPaths);
      }

      releaseNewPreviews();

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
      <div className="admin-wide image-manager">
        <div className="image-manager-heading">
          <span>Fotos</span>
          <small>La primera foto es la portada.</small>
        </div>
        {images.length ? (
          <div className="admin-image-grid">
            {images.map((image, index) => (
              <div className="admin-image" key={image.id}>
                <div className="admin-image-preview">
                  <img src={image.url} alt={`Foto ${index + 1} del listing`} />
                  {index === 0 ? <span className="cover-label">Portada</span> : null}
                </div>
                <div className="admin-image-actions">
                  {index > 0 ? (
                    <button type="button" onClick={() => makeCover(image.id)}>
                      Portada
                    </button>
                  ) : null}
                  <button disabled={index === 0} type="button" onClick={() => moveImage(image.id, -1)}>
                    Anterior
                  </button>
                  <button
                    disabled={index === images.length - 1}
                    type="button"
                    onClick={() => moveImage(image.id, 1)}
                  >
                    Siguiente
                  </button>
                  <button className="image-remove" type="button" onClick={() => removeImage(image.id)}>
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <label className="admin-wide">
        <span>{images.length ? "Añadir fotos" : "Seleccionar fotos"}</span>
        <input
          accept="image/png,image/jpeg,image/webp"
          multiple
          type="file"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
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
