import { useEffect, useState } from "react";
import { ProductDraftForm } from "../components/admin/ProductDraftForm";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export function AdminPage() {
  const [email, setEmail] = useState("");
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
          Crea listings y publica nuevos pares en el catalogo. El acceso se
          valida con Supabase Auth, tu rol de administrador y Row Level Security.
        </p>
      </div>

      <div className="security-note">
        <strong>Modo seguro</strong>
        <p>
          Solo cuentas autorizadas pueden crear, editar o eliminar datos. La
          escritura publica permanece bloqueada por las reglas de Supabase.
        </p>
      </div>

      <ProductDraftForm />
    </section>
  );
}
