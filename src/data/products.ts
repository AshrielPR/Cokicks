import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "ck-001",
    slug: "jordan-4-retro-bred-reimagined",
    name: "Jordan 4 Retro Bred Reimagined",
    brand: "Jordan",
    model: "Air Jordan 4",
    price: 285,
    sizes: ["8", "9.5", "10"],
    description:
      "Par destacado con silueta clasica, materiales premium y presencia fuerte para rotacion diaria o coleccion.",
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85",
    ],
    addedAt: "2026-06-15",
  },
  {
    id: "ck-002",
    slug: "nike-dunk-low-panda",
    name: "Nike Dunk Low Panda",
    brand: "Nike",
    model: "Dunk Low",
    price: 145,
    sizes: ["7.5", "8", "11"],
    description:
      "Colorway blanco y negro facil de combinar, con perfil bajo y look limpio para uso casual.",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1400&q=85",
    ],
    addedAt: "2026-06-14",
  },
  {
    id: "ck-003",
    slug: "new-balance-9060-sea-salt",
    name: "New Balance 9060 Sea Salt",
    brand: "New Balance",
    model: "9060",
    price: 195,
    sizes: ["9", "10", "10.5"],
    description:
      "Runner moderno con volumen editorial, tonos neutros y comodidad para outfits streetwear premium.",
    images: [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=1400&q=85",
    ],
    addedAt: "2026-06-12",
  },
  {
    id: "ck-004",
    slug: "adidas-samba-og-black-white",
    name: "Adidas Samba OG Black White",
    brand: "Adidas",
    model: "Samba OG",
    price: 130,
    sizes: ["8", "8.5", "9"],
    description:
      "Perfil bajo, suela gum y estetica minimalista. Un par esencial para rotaciones limpias.",
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1400&q=85",
    ],
    addedAt: "2026-06-10",
  },
];
