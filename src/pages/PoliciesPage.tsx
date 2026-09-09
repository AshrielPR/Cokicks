import { business } from "../config/business";

export function PoliciesPage() {
  return (
    <section className="page-section policies-page">
      <div className="section-heading policies-heading">
        <p className="eyebrow">CoKicks</p>
        <h1>Políticas de compra</h1>
        <p className="section-intro">Consulta las condiciones antes de confirmar una orden.</p>
      </div>

      <div className="policies-content">
        <PolicySection title="Información general">
          <p>
            Todos los productos ofrecidos por CoKicks son gestionados por pedido. La disponibilidad
            de un producto puede variar y está sujeta a confirmación antes de procesar el pago.
          </p>
        </PolicySection>

        <PolicySection title="Proceso de compra">
          <ol>
            <li>El cliente confirma el modelo y la talla deseada.</li>
            <li>El cliente envía su nombre completo, número de contacto y dirección postal.</li>
            <li>Se realiza el pago.</li>
            <li>La orden es procesada.</li>
            <li>El producto es enviado al cliente.</li>
          </ol>
          <p>
            Es responsabilidad del cliente asegurarse de que toda la información proporcionada sea
            correcta para garantizar una entrega exitosa.
          </p>
        </PolicySection>

        <PolicySection title="Métodos de pago">
          <p>Actualmente aceptamos:</p>
          <ul>
            <li>ATH Móvil</li>
            <li>PayPal (Goods and Services)</li>
          </ul>
          <p>La orden no será procesada hasta que el pago haya sido confirmado.</p>
        </PolicySection>

        <PolicySection title="Envíos">
          <ul>
            <li>
              Todos los pedidos son enviados directamente a la dirección proporcionada por el
              cliente.
            </li>
            <li>Utilizamos servicios de envío como UPS y FedEx.</li>
            <li>
              El tiempo estimado de entrega es de hasta 2 semanas desde el procesamiento de la
              orden.
            </li>
            <li>
              Los tiempos de entrega pueden variar debido a situaciones fuera del control de
              CoKicks.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="Encuentros presenciales">
          <p>
            CoKicks no realiza encuentros presenciales ni entregas en persona. Todos los pedidos se
            envían por correo mediante compañías como UPS o FedEx.
          </p>
        </PolicySection>

        <PolicySection title="Disponibilidad de productos">
          <p>
            La disponibilidad de los productos puede cambiar en cualquier momento. La confirmación
            final de disponibilidad se realiza antes de procesar el pago.
          </p>
        </PolicySection>

        <PolicySection title="Cancelaciones">
          <p>
            Todas las órdenes son procesadas de manera inmediata tras la confirmación del pago,
            generalmente en cuestión de minutos. Debido a la naturaleza automatizada y externa de
            este proceso, una vez realizado el pago, la orden entra en gestión directa con nuestros
            proveedores y no puede ser detenida, modificada ni cancelada.
          </p>
          <p>
            Por esta razón, CoKicks no ofrece cancelaciones bajo ninguna circunstancia una vez
            completado el pago.
          </p>
        </PolicySection>

        <PolicySection title="Reembolsos y devoluciones">
          <p>
            CoKicks no realiza reembolsos ni acepta devoluciones por cambios de opinión, errores en
            la selección de talla, dirección incorrecta proporcionada por el cliente o cualquier
            decisión posterior a la compra.
          </p>
          <p>
            Dado que los productos son gestionados a través de proveedores externos y procesados
            inmediatamente después del pago, CoKicks no tiene control directo sobre la cancelación o
            reversión de órdenes una vez iniciadas.
          </p>
          <p>
            En casos excepcionales en los que exista un inconveniente con la orden, cualquier
            posible solución dependerá exclusivamente de la disposición del proveedor. CoKicks podrá
            asistir como intermediario para gestionar la situación, pero no garantiza reembolsos,
            cambios ni compensaciones.
          </p>
          <p>
            Al completar una compra, el cliente acepta y reconoce estas condiciones en su totalidad.
          </p>
        </PolicySection>

        <PolicySection title="Contacto">
          <p>
            Si buscas un modelo específico que no aparece en el catálogo, puedes comunicarte
            directamente con nosotros. CoKicks puede ayudarte a conseguir una amplia variedad de
            modelos mediante pedido.
          </p>
          <div className="policy-contact-links">
            <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noreferrer">
              WhatsApp: {business.whatsappDisplay}
            </a>
            <a href={business.instagramUrl} target="_blank" rel="noreferrer">
              Instagram: {business.instagramHandle}
            </a>
          </div>
        </PolicySection>
      </div>
    </section>
  );
}

type PolicySectionProps = {
  children: React.ReactNode;
  title: string;
};

function PolicySection({ children, title }: PolicySectionProps) {
  return (
    <section className="policy-section">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
