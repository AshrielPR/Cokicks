import { business } from "../config/business";

export function PoliciesPage() {
  return (
    <section className="page-section policies-page">
      <div className="section-heading policies-heading">
        <p className="eyebrow">CoKicks</p>
        <h1>Politicas de compra</h1>
        <p className="section-intro">
          Consulta las condiciones antes de confirmar una orden.
        </p>
      </div>

      <div className="policies-content">
        <PolicySection title="Informacion general">
          <p>
            Todos los productos ofrecidos por CoKicks son gestionados por pedido. La
            disponibilidad de un producto puede variar y esta sujeta a confirmacion
            antes de procesar el pago.
          </p>
        </PolicySection>

        <PolicySection title="Proceso de compra">
          <ol>
            <li>El cliente confirma el modelo y la size deseado.</li>
            <li>
              El cliente envia su nombre completo, numero de contacto y direccion
              postal.
            </li>
            <li>Se realiza el pago.</li>
            <li>La orden es procesada.</li>
            <li>El producto es enviado al cliente.</li>
          </ol>
          <p>
            Es responsabilidad del cliente asegurarse de que toda la informacion
            proporcionada sea correcta para garantizar una entrega exitosa.
          </p>
        </PolicySection>

        <PolicySection title="Metodos de pago">
          <p>Actualmente aceptamos:</p>
          <ul>
            <li>ATH Movil</li>
            <li>PayPal (Goods and Services)</li>
          </ul>
          <p>La orden no sera procesada hasta que el pago haya sido confirmado.</p>
        </PolicySection>

        <PolicySection title="Envios">
          <ul>
            <li>Todos los pedidos son enviados directamente a la direccion proporcionada por el cliente.</li>
            <li>Utilizamos servicios de envio como UPS y FedEx.</li>
            <li>El tiempo estimado de entrega es de hasta 2 semanas desde el procesamiento de la orden.</li>
            <li>Los tiempos de entrega pueden variar debido a situaciones fuera del control de CoKicks.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Encuentros presenciales">
          <p>
            CoKicks no realiza encuentros presenciales ni entregas en persona. Todos
            los pedidos se envian por correo mediante companias como UPS o FedEx.
          </p>
        </PolicySection>

        <PolicySection title="Disponibilidad de productos">
          <p>
            La disponibilidad de los productos puede cambiar en cualquier momento.
            La confirmacion final de disponibilidad se realiza antes de procesar el
            pago.
          </p>
        </PolicySection>

        <PolicySection title="Cancelaciones">
          <p>
            Todas las ordenes son procesadas de manera inmediata tras la confirmacion
            del pago, generalmente en cuestion de minutos. Debido a la naturaleza
            automatizada y externa de este proceso, una vez realizado el pago, la
            orden entra en gestion directa con nuestros proveedores y no puede ser
            detenida, modificada ni cancelada.
          </p>
          <p>
            Por esta razon, CoKicks no ofrece cancelaciones bajo ninguna circunstancia
            una vez el pago ha sido completado.
          </p>
        </PolicySection>

        <PolicySection title="Reembolsos y devoluciones">
          <p>
            CoKicks no realiza reembolsos ni acepta devoluciones por cambios de
            opinion, errores en la seleccion de talla, direccion incorrecta
            proporcionada por el cliente o cualquier decision posterior a la compra.
          </p>
          <p>
            Dado que los productos son gestionados a traves de proveedores externos y
            procesados inmediatamente despues del pago, CoKicks no tiene control
            directo sobre la cancelacion o reversion de ordenes una vez iniciadas.
          </p>
          <p>
            En casos excepcionales donde exista un inconveniente con la orden,
            cualquier posible solucion dependera exclusivamente de la disposicion del
            proveedor. CoKicks podra asistir como intermediario para gestionar la
            situacion, pero no garantiza reembolsos, cambios ni compensaciones.
          </p>
          <p>
            Al completar una compra, el cliente acepta y reconoce estas condiciones en
            su totalidad.
          </p>
        </PolicySection>

        <PolicySection title="Contacto">
          <p>
            Si buscas un modelo especifico que no aparece en el catalogo, puedes
            comunicarte directamente con nosotros. CoKicks puede ayudarte a conseguir
            una amplia variedad de modelos mediante pedido.
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
