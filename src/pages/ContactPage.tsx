import { business } from "../config/business";
import { getWhatsappUrl } from "../utils/whatsapp";

export function ContactPage() {
  return (
    <section className="page-section contact-page">
      <div className="section-heading">
        <p className="eyebrow">Contacto</p>
        <h1>Hablemos del par que tienes en mente.</h1>
        <p className="section-intro">
          La venta se coordina directo por WhatsApp o Instagram. Envia el
          listing, size y cualquier pregunta sobre disponibilidad.
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-panel">
          <span>WhatsApp</span>
          <strong>{business.whatsappDisplay}</strong>
          <a
            className="primary-action full-width"
            href={getWhatsappUrl("Hola, quiero informacion de CoKicks.")}
            target="_blank"
            rel="noreferrer"
          >
            Escribir ahora
          </a>
        </div>

        <div className="contact-panel">
          <span>Instagram</span>
          <strong>{business.instagramHandle}</strong>
          <a
            className="secondary-action full-width"
            href={business.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ver perfil
          </a>
        </div>
      </div>

      <div className="contact-notes">
        <div>
          <span>01</span>
          <p>Abre el listing del par que te interesa.</p>
        </div>
        <div>
          <span>02</span>
          <p>Verifica sizes disponibles y estado del producto.</p>
        </div>
        <div>
          <span>03</span>
          <p>Escribe por WhatsApp para coordinar la venta.</p>
        </div>
      </div>
    </section>
  );
}
