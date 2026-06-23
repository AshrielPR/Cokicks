import { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../config/assets";
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
        <img className="brand-logo" src={assets.logo} alt="" aria-hidden="true" />
        <span>{business.name}</span>
      </NavLink>

      <button
        className="menu-button"
        type="button"
        aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
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
