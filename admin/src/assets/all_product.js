// all_product.js — Sugar Daddy's Bake Shoppe
// This file is a local reference only.
// All live product data is fetched from the backend at /allproducts.
// Add products via the Admin panel → Add Product.

const all_product = [
  {
    id: 1,
    name: "Peanut Butter Smash",
    category: "classic",
    subcategory: "Bestsellers",
    new_price: 5,
    old_price: 5,
    description: "A thick, crackled peanut butter cookie with the perfect balance of sweet and salty. Dense, chewy, and unapologetically nutty — a Sugar Daddy's staple.",
    ingredients: "Peanut butter, brown sugar, egg, vanilla, sea salt",
    origin: "Classic American",
    allergens: "Contains: peanuts, eggs",
  },
  {
    id: 2,
    name: "The Green One",
    category: "exotic",
    subcategory: "Single Origin",
    new_price: 5,
    old_price: 5,
    description: "Vibrant matcha cookie dusted with shredded coconut. Earthy, fragrant, and lightly sweet — a fan favorite for the adventurous palate.",
    ingredients: "Ceremonial grade matcha, shredded coconut, butter, sugar, flour",
    origin: "Japanese single-origin matcha",
    allergens: "Contains: gluten, dairy",
  },
  {
    id: 3,
    name: "Ooh-Baby",
    category: "artisanal",
    subcategory: "Bestsellers",
    new_price: 5,
    old_price: 5,
    description: "A rich ube sugar cookie with a gorgeous purple hue and a pillowy crumb. Subtly sweet with a hint of vanilla — stunning and delicious.",
    ingredients: "Ube extract, butter, sugar, egg, vanilla, flour",
    origin: "Filipino-inspired",
    allergens: "Contains: gluten, dairy, eggs",
  },
  {
    id: 4,
    name: "The Aztec",
    category: "exotic",
    subcategory: "Limited Edition",
    new_price: 5,
    old_price: 5,
    description: "Dark chocolate with a cayenne kick, rolled in red sugar crystals. Ancient flavors, modern obsession. Not too sweet — just like everything we make.",
    ingredients: "Colombian dark chocolate, cayenne pepper, red sugar crystals, butter",
    origin: "Single-origin Colombian cocoa",
    allergens: "Contains: gluten, dairy",
  },
];

export default all_product;
