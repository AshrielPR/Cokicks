import { business } from "../config/business";

export function getProductWhatsappUrl(productName: string) {
  const message = `Hola, me interesa el ${productName} de CoKicks.`;
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsappUrl(message = "Hola, quiero informacion de CoKicks.") {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
