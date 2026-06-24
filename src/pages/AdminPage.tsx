import { useEffect, useState } from "react";
import { ProductDraftForm } from "../components/admin/ProductDraftForm";
import { formatPrice } from "../utils/format";
import { getProductImagePath } from "../lib/productImages";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { ManagedProduct } from "../types/admin";

export function AdminPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [listings, setListings] = useState<ManagedProduct[]>([]);
  const [isListingsLoading, setIsListingsLoading] = useState(false);
  const [editor, setEditor] = useState<"create" | ManagedProduct | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (isMounted) {
        setIsAdmin(Boolean(adminUser));
        setIsLoading(false);
      }
    }

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      if (!supabase || !isAdmin) {
        return;
      }

      setIsListingsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (error) {
        setMessage("No se pudo cargar el inventario. Intenta de nuevo.");
      } else {
        setListings(data);
      }

      setIsListingsLoading(false);
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, [isAdmin, refreshKey]);

  async function sendMagicLink() {
    if (!supabase || !email.trim()) {
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.href,
        shouldCreateUser: false,
      },
    });

    setMessage(
      error
        ? "No se pudo solicitar acceso."
        : "Si el correo esta autorizado, recibira un enlace de acceso.",
    );
  }

  async function toggleVisibility(listing: ManagedProduct) {
    if (!supabase) {
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({ is_published: !listing.is_published })
      .eq("id", listing.id);

    if (error) {
      setMessage("No se pudo cambiar la visibilidad del listing.");
      return;
    }

    setRefreshKey((key) => key + 1);
  }

  async function deleteListing(listing: ManagedProduct) {
    if (!supabase || !window.confirm(`Eliminar ${listing.name}? Esta accion no se puede deshacer.`)) {
      return;
    }

    const { error } = await supabase.from("products").delete().eq("id", listing.id);

    if (error) {
      setMessage("No se pudo eliminar el listing.");
      return;
    }

    const imagePaths = listing.images
      .map(getProductImagePath)
      .filter((path): path is string => Boolean(path));

    if (imagePaths.length) {
      await supabase.storage.from("product-images").remove(imagePaths);
    }

    if (editor !== null && editor !== "create" && editor.id === listing.id) {
      setEditor(null);
    }

    setRefreshKey((key) => key + 1);
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setIsAdmin(false);
    setEditor(null);
    setMessage("");
  }

  if (!isSupabaseConfigured) {
    return (
      <section className="page-section compact-page">
        <p className="eyebrow">Admin</p>
        <h1>Supabase no esta configurado.</h1>
        <p>
          Esta area solo se activa con variables de entorno, Auth y Row Level
          Security.
        </p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="page-section compact-page">
        <p className="eyebrow">Admin</p>
        <h1>Verificando acceso.</h1>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="page-section compact-page">
        <p className="eyebrow">Admin</p>
        <h1>Acceso privado.</h1>
        <div className="admin-login">
          <input
            type="email"
            value={email}
            placeholder="tu@email.com"
            onChange={(event) => setEmail(event.target.value)}
          />
          <button className="primary-action" type="button" onClick={sendMagicLink}>
            Enviar magic link
          </button>
          {message ? <p>{message}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="page-section admin-page">
      <div className="section-heading">
        <p className="eyebrow">Admin</p>
        <h1>Listings</h1>
        <p className="section-intro">
          Crea y administra el catalogo. Solo los listings visibles aparecen para
          clientes.
        </p>
      </div>

      <div className="security-note">
        <strong>Modo seguro</strong>
        <p>
          Solo cuentas autorizadas pueden crear, editar, ocultar o eliminar datos.
          La escritura publica permanece bloqueada por las reglas de Supabase.
        </p>
      </div>

      <div className="admin-toolbar">
        <button className="primary-action" type="button" onClick={() => setEditor("create")}>
          Nuevo listing
        </button>
        <button className="secondary-action" type="button" onClick={signOut}>
          Cerrar sesion
        </button>
      </div>

      {editor ? (
        <section className="admin-editor">
          <div className="admin-editor-heading">
            <h2>{editor === "create" ? "Nuevo listing" : "Editar listing"}</h2>
          </div>
          <ProductDraftForm
            listing={editor === "create" ? undefined : editor}
            onCancel={() => setEditor(null)}
            onSaved={() => {
              setEditor(null);
              setRefreshKey((key) => key + 1);
            }}
          />
        </section>
      ) : null}

      <section className="admin-inventory">
        <div className="admin-inventory-heading">
          <h2>Inventario</h2>
          <span>{isListingsLoading ? "Cargando" : `${listings.length} listings`}</span>
        </div>

        {message ? <p className="admin-message">{message}</p> : null}

        <div className="admin-listings">
          {listings.map((listing) => (
            <article className="admin-listing" key={listing.id}>
              <img src={listing.images[0]} alt={listing.name} />
              <div className="admin-listing-copy">
                <span>{listing.brand}</span>
                <h3>{listing.name}</h3>
                <p>{formatPrice(Number(listing.price))}</p>
                <small>{listing.is_published ? "Visible en catalogo" : "Oculto del catalogo"}</small>
              </div>
              <div className="admin-listing-actions">
                <button className="secondary-action" type="button" onClick={() => setEditor(listing)}>
                  Editar
                </button>
                <button
                  className="secondary-action"
                  type="button"
                  onClick={() => toggleVisibility(listing)}
                >
                  {listing.is_published ? "Ocultar" : "Publicar"}
                </button>
                <button
                  className="danger-action"
                  type="button"
                  onClick={() => deleteListing(listing)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>

        {!isListingsLoading && listings.length === 0 ? (
          <div className="empty-state"><p>Aun no has creado listings.</p></div>
        ) : null}
      </section>
    </section>
  );
}
