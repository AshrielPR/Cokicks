import { business } from "../../config/business";
import { getWhatsappUrl } from "../../utils/whatsapp";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{business.name}</strong>
        <p>Catalogo premium de sneakers. {business.location}.</p>
      </div>
      <div className="footer-links">
        <a href={business.instagramUrl} target="_blank" rel="noreferrer">
          {business.instagramHandle}
        </a>
        <a href={getWhatsappUrl()} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
      </div>
    </footer>
  );
}
