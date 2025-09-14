window.products = [
  { id: 1, name: 'Retro 13 Black Flint', price: 190000, category: 'Zapatillas', img: 'img/IMG_9670.jpeg',
    condition: 'Usado - Excelente', sizes: ['40', '41', '42'], images: ['img/IMG_9670.jpeg'] },
  { id: 2, name: 'Gucci 77 Dark Silver', price: 420000, category: 'Zapatillas', img: 'img/IMG_9267.jpeg',
    condition: 'Usado - Muy bueno', sizes: ['41', '42'], images: ['img/IMG_9267.jpeg','img/IMG_9269.jpeg','img/IMG_9270.jpeg','img/IMG_9271.jpeg','img/IMG_9272.jpeg','img/IMG_9273.jpeg'] },
  { id: 3, name: 'Louboutin Orlato Flat Black', price: 520000, category: 'Zapatillas', img: 'img/IMG_9275.jpeg',
    condition: 'Nuevo con caja', sizes: ['41'], images: ['img/IMG_9275.jpeg','img/IMG_9276.jpeg','img/IMG_9277.jpeg','img/IMG_9279.jpeg','img/IMG_9282.jpeg','img/IMG_9275_1_.jpeg'] },
  { id: 4, name: 'Dolce & Gabanna Leather Black Metal Logo', price: 320000, category: 'Cinturón', img: 'img/F16E030F-D104-44EC-876B-3F7BE808B955.jpeg',
    condition: 'Usado - Excelente', sizes: ['95', '100'], images: ['img/F16E030F-D104-44EC-876B-3F7BE808B955.jpeg'] },
  { id: 5, name: 'Balmain Velvet Cap', price: 220000, category: 'Gorros', img: 'img/IMG_9728.jpeg',
    condition: 'Casi nuevo', sizes: ['TU 56-59'], images: ['img/IMG_9728.jpeg','img/IMG_9729.jpeg','img/IMG_9730.jpeg','img/IMG_9731.jpeg'] },
  { id: 6, name: 'Balmain Monogram Cap', price: 220000, category: 'Gorros', img: 'img/IMG_9732.jpeg',
    condition: 'Casi nuevo', sizes: ['TU 56-59'], images: ['img/IMG_9732.jpeg','img/IMG_9733.jpeg','img/IMG_9734.jpeg','img/IMG_9735.jpeg','img/IMG_9736.jpeg'] }
];// products.js
// Inventario de GRAILMARKET (usa rutas relativas a /img)

window.products = [
  /* ===================== ZAPATILLAS ===================== */
  {
    id: 1,
    name: "Retro 13 Black Flint",
    price: 190000,
    category: "Zapatillas",
    condition: "Usado - Excelente estado",
    sizes: ["41", "42"],                 // ajusta si quieres
    img: "img/IMG_9670.jpeg",
    images: [
      "img/IMG_9670.jpeg"
    ],
    description: "Air Jordan 13 Retro 'Black Flint'. 100% originales."
  },

  {
    id: 2,
    name: "Gucci 77 Dark Silver",
    price: 420000,
    category: "Zapatillas",
    condition: "Usado - Muy buen estado",
    sizes: ["41", "42"],                 // ajusta si quieres
    img: "img/IMG_9267.jpeg",
    images: [
      "img/IMG_9267.jpeg",
      "img/IMG_9269.jpeg",
      "img/IMG_9270.jpeg",
      "img/IMG_9271.jpeg",
      "img/IMG_9272.jpeg",
      "img/IMG_9273.jpeg"
    ],
    description: "Gucci 77 Dark Silver, originales. Incluye fotos en detalle."
  },

  {
    id: 3,
    name: "Louboutin Orlato Flat Black (Studded Toe)",
    price: 520000,
    category: "Zapatillas",
    condition: "Casi nuevo",
    sizes: ["41"],                        // ajusta si quieres
    img: "img/IMG_9275.jpeg",
    images: [
      "img/IMG_9275.jpeg",
      "img/IMG_9276.jpeg",
      "img/IMG_9277.jpeg",
      "img/IMG_9279.jpeg",
      "img/IMG_9282.jpeg"
    ],
    description: "Christian Louboutin Orlato Flat Black con puntera con tachas. 100% original."
  },

  /* ===================== ACCESORIOS ===================== */
  {
    id: 4,
    name: "Dolce & Gabanna Leather Black Metal Logo",
    price: 320000,
    category: "Cinturón",
    condition: "Casi nuevo",
    sizes: ["95", "100"],                 // largo aprox. del cinturón
    img: "img/F16E030F-D104-44EC-876B-3F7BE808B955.jpeg",
    images: [
      "img/F16E030F-D104-44EC-876B-3F7BE808B955.jpeg"
    ],
    description: "Cinturón de cuero D&G con hebilla metálica logo. 100% original."
  },

  /* ===================== GORROS ===================== */
  {
    id: 5,
    name: "Balmain Velvet Cap",
    price: 220000,
    category: "Gorros",
    condition: "Casi nuevo",
    sizes: ["Talla Única (56–59 cm)"],
    img: "img/IMG_9728.jpeg",
    images: [
      "img/IMG_9728.jpeg",
      "img/IMG_9729.jpeg",
      "img/IMG_9730.jpeg",
      "img/IMG_9731.jpeg",
      "img/IMG_9732.jpeg"
    ],
    description: "Gorra Balmain en terciopelo con monograma. Ajustable, original."
  },

  {
    id: 6,
    name: "Balmain Monogram Cap",
    price: 220000,
    category: "Gorros",
    condition: "Casi nuevo",
    sizes: ["Talla Única (56–59 cm)"],
    img: "img/IMG_9733.jpeg",
    images: [
      "img/IMG_9733.jpeg",
      "img/IMG_9734.jpeg",
      "img/IMG_9735.jpeg",
      "img/IMG_9736.jpeg"
    ],
    description: "Gorra Balmain con monograma tono a tono. Ajustable, original."
  }
];
