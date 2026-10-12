export const ITEM_SUBCATEGORY_BY_TITLE: Record<string, string> = {
  // Cafe Items
  Espresso: "Coffee",
  Vanisspresso: "Coffee",
  "Masala Tea": "Tea",
  "Caramal Frappe": "Frappe",
  "Chocolote Frappe": "Frappe",
  Cinnamocha: "Frappe",

  // North Indian
  "Butter Naan": "Naan",
  "Kashmiri Nann": "Naan",
  "Kurumi Naan": "Naan",
  "Stuffed Parata": "Paratha",
  "Channa Batura": "Chole Bhature",

  // South Indian
  "Ghee Dosai": "Dosa",
  "Masala Dosai": "Dosa",
  "Rava Dosa": "Dosa",
  "Onion Oothapam": "Uttapam",
  "Vegitable Oothapam": "Uttapam",
  Chapathi: "Roti",

  // Cakes
  "Choco chip Banana cake": "Specialty Cakes",
  "Strawberry paradise cake": "Specialty Cakes",
  "Mango Cream cake": "Specialty Cakes",
  "Chocolate lava cake": "Specialty Cakes",
  "Pyramid cake": "Specialty Cakes",
  "Cup Cakes": "Cupcakes",

  // Ice Cream
  "Banana Boat": "Sundaes",
  "Chocolate craze": "Sundaes",
  "Cookie Cream": "Sundaes",
  "Rocky Road": "Sundaes",
  Mango: "Fruit Ice Cream",
  "Strawberry red": "Fruit Ice Cream",

  // Chaat Items
  "Paani poori": "Puri",
  "Bhel Puri": "Puri",
  "Papdi chat": "Papdi",

  // Juices
  "Mint Lime Soda": "Sodas",
  "Orange Mint Soda": "Sodas",
  "Nannari Sharubat": "Sharbat",
  "Watermelon Sharubat": "Sharbat",
  "Avocado Juice": "Fresh Juices",
  "Mango Juice": "Fresh Juices",

  // Sweets
  "Carrot halwa": "Halwa",
  "Pista burfi": "Burfi",
  "Maysoor Pack": "Burfi",
  "Mothi Ladoo": "Ladoo",
  "Gulab Jamun": "Milk Sweets",
  "Soan Papdi": "Traditional Sweets",
};

export const SUBCATEGORY_ORDER: Record<string, string[]> = {
  "Cafe Items": ["Coffee", "Tea", "Frappe"],
  "North Indian": ["Naan", "Paratha", "Chole Bhature"],
  "South Indian": ["Dosa", "Uttapam", "Roti"],
  Cakes: ["Specialty Cakes", "Cupcakes"],
  "Ice Cream": ["Sundaes", "Fruit Ice Cream"],
  "Chaat Items": ["Puri", "Papdi"],
  Juices: ["Fresh Juices", "Sharbat", "Sodas"],
  Sweets: ["Halwa", "Burfi", "Ladoo", "Milk Sweets", "Traditional Sweets"],
};

export function getSubcategory(title: string, category: string): string {
  if (ITEM_SUBCATEGORY_BY_TITLE[title]) {
    return ITEM_SUBCATEGORY_BY_TITLE[title];
  }

  const name = title.toLowerCase();

  if (category === "Cafe Items") {
    if (name.includes("tea")) return "Tea";
    if (name.includes("frappe") || name.includes("mocha")) return "Frappe";
    return "Coffee";
  }

  if (category === "North Indian") {
    if (name.includes("parata") || name.includes("paratha")) return "Paratha";
    if (name.includes("channa") || name.includes("batura")) return "Chole Bhature";
    return "Naan";
  }

  if (category === "South Indian") {
    if (name.includes("oothapam") || name.includes("uttapam")) return "Uttapam";
    if (name.includes("chapathi") || name.includes("chapati") || name.includes("roti")) {
      return "Roti";
    }
    return "Dosa";
  }

  if (category === "Cakes") {
    if (name.includes("cup")) return "Cupcakes";
    return "Specialty Cakes";
  }

  if (category === "Ice Cream") {
    if (name.includes("mango") || name.includes("strawberry")) return "Fruit Ice Cream";
    return "Sundaes";
  }

  if (category === "Chaat Items") {
    if (name.includes("papdi")) return "Papdi";
    return "Puri";
  }

  if (category === "Juices") {
    if (name.includes("soda")) return "Sodas";
    if (name.includes("sharubat") || name.includes("sharbat")) return "Sharbat";
    return "Fresh Juices";
  }

  if (category === "Sweets") {
    if (name.includes("halwa")) return "Halwa";
    if (name.includes("ladoo")) return "Ladoo";
    if (name.includes("burfi") || name.includes("pack")) return "Burfi";
    if (name.includes("jamun")) return "Milk Sweets";
    return "Traditional Sweets";
  }

  return category;
}

export function sortSubcategories(category: string, subcategories: string[]): string[] {
  const preferred = SUBCATEGORY_ORDER[category] || [];
  const remaining = subcategories.filter((name) => !preferred.includes(name)).sort();
  return [...preferred.filter((name) => subcategories.includes(name)), ...remaining];
}
