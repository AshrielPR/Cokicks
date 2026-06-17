import { useState } from "react";
import { NavLink } from "react-router-dom";
import { business } from "../../config/business";

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Catalogo", to: "/catalogo" },
  { label: "Marcas", to: "/marcas" },
  { label: "Politicas", to: "/politicas" },
  { label: "Contacto", to: "/contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <NavLink className="brand-mark" to="/" onClick={() => setIsOpen(false)}>
        <span className="brand-frog" aria-hidden="true" />
        <span>{business.name}</span>
      </NavLink>

      <button
        className="menu-button"
        type="button"
        aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <nav className={isOpen ? "site-nav is-open" : "site-nav"}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
            {item.label}
          </NavLink>
        ))}
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
