import { useEffect, useState } from "react";
import { ProductDraftForm } from "../components/admin/ProductDraftForm";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function AdminPage() {
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL ?? "");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

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

  async function sendMagicLink() {
    if (!supabase || !email.trim()) {
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.href,
      },
    });

    setMessage(error ? error.message : "Revisa tu email para entrar.");
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
          Borrador visual solo para desarrollo local. Esta ruta no se incluye en
          builds de produccion. La publicacion real requiere Supabase Auth,
          roles de administrador y Row Level Security.
        </p>
      </div>

      <div className="security-note">
        <strong>Modo seguro</strong>
        <p>
          Este formulario no guarda datos, no sube fotos y no cambia el
          catalogo. No se debe activar escritura publica desde el frontend.
        </p>
      </div>

      <ProductDraftForm />
    </section>
  );
}
