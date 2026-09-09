import { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../config/assets";
import { business } from "../../config/business";
import { useWishlist } from "../../context/WishlistContext";

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/catalogo" },
  { label: "Marcas", to: "/marcas" },
  { label: "Políticas", to: "/politicas" },
  { label: "Contacto", to: "/contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { savedSlugs } = useWishlist();

  return (
    <header className="site-header">
      <NavLink className="brand-mark" to="/" onClick={() => setIsOpen(false)}>
        <img className="brand-logo" src={assets.logo} alt="" aria-hidden="true" />
        <span>{business.name}</span>
      </NavLink>

      <button
        className="menu-button"
        type="button"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-controls="site-navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <nav id="site-navigation" className={isOpen ? "site-nav is-open" : "site-nav"}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/guardados" onClick={() => setIsOpen(false)}>
          Guardados{savedSlugs.length > 0 ? ` (${savedSlugs.length})` : ""}
        </NavLink>
        <a
          href={business.instagramUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => setIsOpen(false)}
        >
          Instagram
        </a>
      </nav>
    </header>
  );
}
