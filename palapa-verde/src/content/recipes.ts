import type { Localized } from "@/lib/commerce/types";

/**
 * Recetas Palapa Verde.
 *
 * ESTADO: todas son `draft` — «draft — kitchen testing required». Nadie las ha
 * preparado, cronometrado, probado ni fotografiado todavía. No describirlas como
 * probadas. Pasar a `tested` solo después de cocinarlas de verdad, ajustar tiempos
 * y cantidades y tener foto real (ver docs/CONTENT_GUIDE.md).
 *
 * Sin cálculos nutricionales ni costo por porción. Los alérgenos se calculan con
 * los ingredientes de la receta; los del producto Palapa Verde están pendientes.
 */

export type RecipeStatus = "draft" | "tested";
export type Occasion = "desayuno" | "almuerzo" | "cena" | "picadera";
export type Unit = "g" | "ml" | "cup" | "tbsp" | "tsp" | "pinch";

/** Sustantivo contable: [singular, plural] por idioma. */
export type Noun = { es: [string, string]; en: [string, string] };

export type Ingredient = {
  /** `null` = al gusto. */
  qty: number | null;
  /** `null` = se cuenta en unidades (usa `noun`). */
  unit: Unit | null;
  name: Localized | Noun;
  note?: Localized;
  /** Slug del producto Palapa Verde si la línea es el producto. */
  product?: string;
  /** Medida casera equivalente para el producto, p. ej. 8 cucharadas. */
  alt?: { qty: number; unit: Unit };
  optional?: boolean;
};

export type RecipeMedia = {
  photo: { src: string; alt: Localized; width: number; height: number } | null;
  /** Vídeo corto (vertical) cuando exista grabación real. */
  video: { src: string; poster: string } | null;
};

export type Recipe = {
  slug: string;
  status: RecipeStatus;
  title: Localized;
  intro: Localized;
  /** Producto Palapa Verde principal. */
  product: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  occasions: Occasion[];
  ingredients: Ingredient[];
  steps: Localized[];
  substitutions: Localized[];
  /** Alérgenos de los demás ingredientes de la receta. */
  allergens: Localized;
  media: RecipeMedia;
};

const t = (es: string, en: string): Localized => ({ es, en });
const n = (es1: string, es2: string, en1: string, en2: string): Noun => ({ es: [es1, es2], en: [en1, en2] });
const NO_MEDIA: RecipeMedia = { photo: null, video: null };
const PRODUCT_ALLERGENS = t(
  "Revisa además los alérgenos del producto Palapa Verde en su etiqueta (aún por confirmar).",
  "Also check the Palapa Verde product's allergens on its label (still to be confirmed).",
);

export const RECIPES: readonly Recipe[] = [
  {
    slug: "yuca-con-chutney-de-cilantro",
    status: "draft",
    title: t("Yuca con cebolla y chutney de cilantro", "Yuca with onions and cilantro chutney"),
    intro: t(
      "La yuca hervida de siempre, con cebolla salteada y el chutney de cilantro al lado para mojar.",
      "Classic boiled yuca with sautéed onions and cilantro chutney on the side for dipping.",
    ),
    product: "chutney-de-cilantro",
    prepMinutes: 10,
    cookMinutes: 25,
    servings: 4,
    occasions: ["almuerzo", "picadera"],
    ingredients: [
      { qty: 1000, unit: "g", name: t("yuca fresca", "fresh yuca (cassava)") },
      { qty: 1, unit: "tsp", name: t("sal", "salt") },
      { qty: 1, unit: null, name: n("cebolla roja mediana", "cebollas rojas medianas", "medium red onion", "medium red onions") },
      { qty: 2, unit: "tbsp", name: t("aceite vegetal", "vegetable oil") },
      { qty: 1, unit: "tbsp", name: t("vinagre blanco", "white vinegar") },
      { qty: 120, unit: "g", alt: { qty: 8, unit: "tbsp" }, name: t("Chutney de Cilantro Palapa Verde", "Palapa Verde Cilantro Chutney"), product: "chutney-de-cilantro" },
    ],
    steps: [
      t("Pela la yuca, córtala en trozos de unos 5 cm y retira la fibra del centro.", "Peel the yuca, cut it into 5 cm pieces and remove the woody core."),
      t("Cúbrela con agua fría y la sal. Hierve 20–25 minutos, hasta que un cuchillo entre sin esfuerzo. Escurre.", "Cover with cold water and the salt. Boil 20–25 minutes, until a knife slides in easily. Drain."),
      t("Mientras tanto, corta la cebolla en aros finos y saltéala 3–4 minutos en el aceite. Añade el vinagre al final.", "Meanwhile, slice the onion into thin rings and sauté it in the oil for 3–4 minutes. Add the vinegar at the end."),
      t("Sirve la yuca caliente con la cebolla por encima y el chutney en un bol al lado.", "Serve the yuca hot with the onions on top and the chutney in a bowl on the side."),
    ],
    substitutions: [
      t("Yuca → batata o papa (ajusta el tiempo de cocción).", "Yuca → sweet potato or potato (adjust the cooking time)."),
      t("Cebolla salteada → cebolla cruda en vinagre.", "Sautéed onion → raw pickled onion."),
    ],
    allergens: t("Los demás ingredientes no contienen alérgenos principales.", "The other ingredients contain no major allergens."),
    media: NO_MEDIA,
  },
  {
    slug: "sandwich-de-pollo-con-chutney-de-cilantro",
    status: "draft",
    title: t("Sándwich de pollo a la plancha con chutney de cilantro", "Grilled chicken sandwich with cilantro chutney"),
    intro: t(
      "Pollo a la plancha, aguacate y tomate en pan de agua, con el chutney en lugar de mayonesa.",
      "Grilled chicken, avocado and tomato in a Dominican bread roll, with the chutney instead of mayonnaise.",
    ),
    product: "chutney-de-cilantro",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 2,
    occasions: ["almuerzo"],
    ingredients: [
      { qty: 300, unit: "g", name: t("pechuga de pollo sin hueso", "boneless chicken breast") },
      { qty: 0.5, unit: "tsp", name: t("sal", "salt") },
      { qty: 0.25, unit: "tsp", name: t("pimienta negra molida", "ground black pepper") },
      { qty: 1, unit: "tbsp", name: t("aceite vegetal", "vegetable oil") },
      { qty: 2, unit: null, name: n("pan de agua", "panes de agua", "Dominican bread roll", "Dominican bread rolls") },
      { qty: 1, unit: null, name: n("tomate", "tomates", "tomato", "tomatoes") },
      { qty: 4, unit: null, name: n("hoja de lechuga", "hojas de lechuga", "lettuce leaf", "lettuce leaves") },
      { qty: 0.5, unit: null, name: n("aguacate", "aguacates", "avocado", "avocados") },
      { qty: 60, unit: "g", alt: { qty: 4, unit: "tbsp" }, name: t("Chutney de Cilantro Palapa Verde", "Palapa Verde Cilantro Chutney"), product: "chutney-de-cilantro" },
    ],
    steps: [
      t("Abre la pechuga en filetes finos y sazónala con la sal y la pimienta.", "Butterfly the chicken into thin fillets and season with the salt and pepper."),
      t("Cocínala en una sartén caliente con el aceite 5–6 minutos por lado, hasta que esté bien cocida por dentro.", "Cook in a hot pan with the oil for 5–6 minutes per side, until cooked through."),
      t("Abre y tuesta el pan. Corta el tomate y el aguacate en láminas.", "Split and toast the bread. Slice the tomato and avocado."),
      t("Unta el chutney en las dos caras del pan y arma con lechuga, pollo, tomate y aguacate.", "Spread the chutney on both sides of the bread and build with lettuce, chicken, tomato and avocado."),
    ],
    substitutions: [
      t("Pollo → huevo frito o queso de freír para una versión sin carne.", "Chicken → fried egg or frying cheese for a meat-free version."),
      t("Pan de agua → pan integral de sándwich.", "Dominican roll → wholemeal sandwich bread."),
    ],
    allergens: t("Contiene gluten (pan de trigo). Con queso: leche. Con huevo: huevo.", "Contains gluten (wheat bread). With cheese: milk. With egg: egg."),
    media: NO_MEDIA,
  },
  {
    slug: "huevos-revueltos-con-pesto-de-cilantro",
    status: "draft",
    title: t("Tostadas de huevo revuelto con pesto de cilantro", "Scrambled egg toast with cilantro pesto"),
    intro: t(
      "Un desayuno de diez minutos: huevos cremosos sobre pan tostado con una capa de pesto.",
      "A ten-minute breakfast: creamy eggs on toast with a layer of pesto.",
    ),
    product: "pesto-de-cilantro-con-semillas-de-auyama",
    prepMinutes: 5,
    cookMinutes: 5,
    servings: 2,
    occasions: ["desayuno"],
    ingredients: [
      { qty: 4, unit: null, name: n("huevo", "huevos", "egg", "eggs") },
      { qty: 1, unit: "pinch", name: t("sal", "salt") },
      { qty: 1, unit: "tbsp", name: t("mantequilla o aceite", "butter or oil") },
      { qty: 2, unit: null, name: n("rebanada de pan", "rebanadas de pan", "slice of bread", "slices of bread") },
      { qty: 1, unit: null, name: n("tomate pequeño", "tomates pequeños", "small tomato", "small tomatoes"), optional: true },
      { qty: 30, unit: "g", alt: { qty: 2, unit: "tbsp" }, name: t("Pesto de Cilantro con Semillas de Auyama Palapa Verde", "Palapa Verde Cilantro Pesto with Pumpkin Seeds"), product: "pesto-de-cilantro-con-semillas-de-auyama" },
    ],
    steps: [
      t("Bate los huevos con la sal.", "Beat the eggs with the salt."),
      t("Derrite la mantequilla a fuego bajo, añade los huevos y muévelos sin parar 2–3 minutos, hasta que cuajen pero sigan cremosos.", "Melt the butter over low heat, add the eggs and stir constantly for 2–3 minutes, until set but still creamy."),
      t("Tuesta el pan y úntalo con el pesto.", "Toast the bread and spread it with the pesto."),
      t("Pon los huevos encima y, si quieres, el tomate en cubitos.", "Top with the eggs and, if you like, diced tomato."),
    ],
    substitutions: [
      t("Pan → casabe tostado.", "Bread → toasted cassava bread (casabe)."),
      t("Mantequilla → aceite para evitar lácteos.", "Butter → oil to avoid dairy."),
    ],
    allergens: t("Contiene huevo y gluten (pan de trigo). Con mantequilla: leche.", "Contains egg and gluten (wheat bread). With butter: milk."),
    media: NO_MEDIA,
  },
  {
    slug: "pasta-con-pesto-auyama-y-berenjena",
    status: "draft",
    title: t("Pasta con pesto, auyama y berenjena asadas", "Pasta with pesto, roasted pumpkin and eggplant"),
    intro: t(
      "Una cena con vegetales asados al horno y el pesto como salsa, aligerado con agua de la pasta.",
      "A dinner of oven-roasted vegetables with the pesto as the sauce, loosened with pasta water.",
    ),
    product: "pesto-de-cilantro-con-semillas-de-auyama",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 4,
    occasions: ["cena"],
    ingredients: [
      { qty: 400, unit: "g", name: t("pasta corta (penne o fusilli)", "short pasta (penne or fusilli)") },
      { qty: 400, unit: "g", name: t("auyama pelada, en cubos de 2 cm", "peeled pumpkin (auyama), in 2 cm cubes") },
      { qty: 300, unit: "g", name: t("berenjena, en cubos de 2 cm", "eggplant, in 2 cm cubes") },
      { qty: 2, unit: "tbsp", name: t("aceite vegetal", "vegetable oil") },
      { qty: 0.5, unit: "tsp", name: t("sal", "salt") },
      { qty: 60, unit: "ml", name: t("agua de cocción de la pasta", "pasta cooking water") },
      { qty: 120, unit: "g", alt: { qty: 8, unit: "tbsp" }, name: t("Pesto de Cilantro con Semillas de Auyama Palapa Verde", "Palapa Verde Cilantro Pesto with Pumpkin Seeds"), product: "pesto-de-cilantro-con-semillas-de-auyama" },
    ],
    steps: [
      t("Calienta el horno a 200 °C. Mezcla la auyama y la berenjena con el aceite y la sal y ásalas 20–25 minutos en una bandeja, hasta que estén doradas.", "Heat the oven to 200 °C. Toss the pumpkin and eggplant with the oil and salt and roast on a tray for 20–25 minutes, until golden."),
      t("Cocina la pasta en agua con sal según el paquete. Antes de escurrir, guarda el agua indicada.", "Cook the pasta in salted water according to the packet. Before draining, keep the pasta water."),
      t("En la olla vacía, mezcla la pasta con el pesto y el agua reservada hasta que quede cremosa.", "In the empty pot, toss the pasta with the pesto and the reserved water until creamy."),
      t("Añade los vegetales asados y sirve enseguida.", "Fold in the roasted vegetables and serve straight away."),
    ],
    substitutions: [
      t("Berenjena → calabacín o ají cubanela.", "Eggplant → zucchini or cubanelle pepper."),
      t("Pasta de trigo → pasta sin gluten.", "Wheat pasta → gluten-free pasta."),
    ],
    allergens: t("Contiene gluten (pasta de trigo).", "Contains gluten (wheat pasta)."),
    media: NO_MEDIA,
  },
  {
    slug: "picadera-de-vegetales-con-hummus-de-zanahoria",
    status: "draft",
    title: t("Picadera de vegetales y casabe con hummus de zanahoria", "Vegetable and casabe snack board with carrot hummus"),
    intro: t(
      "Para compartir: vegetales crujientes y casabe alrededor de un bol de hummus.",
      "For sharing: crunchy vegetables and cassava bread around a bowl of hummus.",
    ),
    product: "hummus-de-zanahoria",
    prepMinutes: 15,
    cookMinutes: 0,
    servings: 6,
    occasions: ["picadera"],
    ingredients: [
      { qty: 2, unit: null, name: n("zanahoria", "zanahorias", "carrot", "carrots") },
      { qty: 1, unit: null, name: n("pepino", "pepinos", "cucumber", "cucumbers") },
      { qty: 2, unit: null, name: n("ají cubanela", "ajíes cubanela", "cubanelle pepper", "cubanelle peppers") },
      { qty: 1, unit: "cup", name: t("tomates cherry", "cherry tomatoes") },
      { qty: 2, unit: null, name: n("torta de casabe", "tortas de casabe", "round of cassava bread (casabe)", "rounds of cassava bread (casabe)") },
      { qty: 250, unit: "g", alt: { qty: 1, unit: "cup" }, name: t("Hummus de Zanahoria Palapa Verde", "Palapa Verde Carrot Hummus"), product: "hummus-de-zanahoria" },
    ],
    steps: [
      t("Lava los vegetales. Corta la zanahoria, el pepino y los ajíes en bastones.", "Wash the vegetables. Cut the carrots, cucumber and peppers into sticks."),
      t("Parte el casabe en trozos de tamaño de bocado.", "Break the cassava bread into bite-size pieces."),
      t("Pon el hummus en un bol en el centro de una tabla y reparte los vegetales, los tomates y el casabe alrededor.", "Put the hummus in a bowl in the middle of a board and arrange the vegetables, tomatoes and cassava bread around it."),
    ],
    substitutions: [
      t("Casabe → galletas de soda o pan tostado.", "Cassava bread → crackers or toast."),
      t("Pepino → apio.", "Cucumber → celery."),
    ],
    allergens: t(
      "Los demás ingredientes no contienen alérgenos principales. Con galletas o pan: gluten.",
      "The other ingredients contain no major allergens. With crackers or bread: gluten.",
    ),
    media: NO_MEDIA,
  },
  {
    slug: "wrap-de-vegetales-asados-con-hummus-de-zanahoria",
    status: "draft",
    title: t("Wrap de vegetales a la plancha con hummus de zanahoria", "Grilled vegetable wrap with carrot hummus"),
    intro: t(
      "Ají, calabacín y cebolla a la plancha, envueltos con hojas verdes y hummus. Se lleva bien al trabajo.",
      "Griddled pepper, zucchini and onion wrapped with greens and hummus. Travels well for lunch.",
    ),
    product: "hummus-de-zanahoria",
    prepMinutes: 15,
    cookMinutes: 10,
    servings: 4,
    occasions: ["almuerzo"],
    ingredients: [
      { qty: 1, unit: null, name: n("ají morrón rojo", "ajíes morrones rojos", "red bell pepper", "red bell peppers") },
      { qty: 1, unit: null, name: n("calabacín", "calabacines", "zucchini", "zucchini") },
      { qty: 1, unit: null, name: n("cebolla roja", "cebollas rojas", "red onion", "red onions") },
      { qty: 2, unit: "tbsp", name: t("aceite vegetal", "vegetable oil") },
      { qty: 0.5, unit: "tsp", name: t("sal", "salt") },
      { qty: 4, unit: null, name: n("tortilla de trigo grande", "tortillas de trigo grandes", "large wheat tortilla", "large wheat tortillas") },
      { qty: 2, unit: "cup", name: t("lechuga o espinaca", "lettuce or spinach") },
      { qty: 100, unit: "g", name: t("queso blanco de freír, en tiras", "frying cheese, in strips"), optional: true },
      { qty: 120, unit: "g", alt: { qty: 8, unit: "tbsp" }, name: t("Hummus de Zanahoria Palapa Verde", "Palapa Verde Carrot Hummus"), product: "hummus-de-zanahoria" },
    ],
    steps: [
      t("Corta el ají, el calabacín y la cebolla en tiras. Mézclalos con el aceite y la sal.", "Cut the pepper, zucchini and onion into strips. Toss with the oil and salt."),
      t("Cocínalos en una plancha o sartén muy caliente 8–10 minutos, hasta que estén tiernos y marcados. Si usas queso, dóralo 1 minuto por lado.", "Cook on a very hot griddle or pan for 8–10 minutes, until tender and charred. If using cheese, brown it 1 minute per side."),
      t("Calienta las tortillas 20 segundos por lado.", "Warm the tortillas for 20 seconds per side."),
      t("Unta el hummus en el centro de cada tortilla, añade las hojas, los vegetales y el queso, y enrolla cerrando los extremos.", "Spread the hummus in the middle of each tortilla, add the greens, vegetables and cheese, and roll up, tucking in the ends."),
    ],
    substitutions: [
      t("Tortilla de trigo → tortilla de maíz (revisa la etiqueta si evitas el gluten).", "Wheat tortilla → corn tortilla (check the label if avoiding gluten)."),
      t("Queso → garbanzos cocidos.", "Cheese → cooked chickpeas."),
    ],
    allergens: t("Contiene gluten (tortilla de trigo). Con queso: leche.", "Contains gluten (wheat tortilla). With cheese: milk."),
    media: NO_MEDIA,
  },
  {
    slug: "casabe-con-hummus-de-remolacha-y-aguacate",
    status: "draft",
    title: t("Casabe con hummus de remolacha y aguacate", "Casabe with beet hummus and avocado"),
    intro: t(
      "El casabe tostado hace de base crujiente para el hummus rosado y el aguacate con limón.",
      "Toasted cassava bread makes a crunchy base for the pink hummus and lime-dressed avocado.",
    ),
    product: "hummus-de-remolacha",
    prepMinutes: 10,
    cookMinutes: 2,
    servings: 2,
    occasions: ["desayuno", "picadera"],
    ingredients: [
      { qty: 1, unit: null, name: n("torta de casabe", "tortas de casabe", "round of cassava bread (casabe)", "rounds of cassava bread (casabe)") },
      { qty: 1, unit: null, name: n("aguacate maduro", "aguacates maduros", "ripe avocado", "ripe avocados") },
      { qty: 0.5, unit: null, name: n("limón", "limones", "lime", "limes") },
      { qty: 1, unit: "pinch", name: t("sal", "salt") },
      { qty: 2, unit: "tbsp", name: t("cebolla roja picada fina", "finely chopped red onion") },
      { qty: null, unit: null, name: t("hojas de cilantro", "cilantro leaves"), optional: true },
      { qty: 90, unit: "g", alt: { qty: 6, unit: "tbsp" }, name: t("Hummus de Remolacha Palapa Verde", "Palapa Verde Beet Hummus"), product: "hummus-de-remolacha" },
    ],
    steps: [
      t("Parte el casabe en cuartos y tuéstalo 1–2 minutos en una sartén seca.", "Break the cassava bread into quarters and toast it in a dry pan for 1–2 minutes."),
      t("Corta el aguacate en láminas y aderézalo con el jugo de limón y la sal.", "Slice the avocado and dress it with the lime juice and salt."),
      t("Unta cada trozo de casabe con el hummus y coloca el aguacate encima.", "Spread each piece of cassava bread with the hummus and top with the avocado."),
      t("Termina con la cebolla y, si quieres, hojas de cilantro.", "Finish with the onion and, if you like, cilantro leaves."),
    ],
    substitutions: [
      t("Casabe → pan tostado.", "Cassava bread → toast."),
      t("Aguacate → huevo duro en rodajas.", "Avocado → sliced hard-boiled egg."),
    ],
    allergens: t(
      "Los demás ingredientes no contienen alérgenos principales. Con pan: gluten. Con huevo: huevo.",
      "The other ingredients contain no major allergens. With bread: gluten. With egg: egg.",
    ),
    media: NO_MEDIA,
  },
  {
    slug: "bowl-de-arroz-con-vegetales-y-hummus-de-remolacha",
    status: "draft",
    title: t("Bowl de arroz, vegetales asados y hummus de remolacha", "Rice bowl with roasted vegetables and beet hummus"),
    intro: t(
      "Arroz blanco, brócoli y zanahoria asados, pepino fresco y una cucharada generosa de hummus.",
      "White rice, roasted broccoli and carrot, fresh cucumber and a generous spoonful of hummus.",
    ),
    product: "hummus-de-remolacha",
    prepMinutes: 15,
    cookMinutes: 25,
    servings: 4,
    occasions: ["almuerzo", "cena"],
    ingredients: [
      { qty: 1.5, unit: "cup", name: t("arroz blanco", "white rice") },
      { qty: 3, unit: "cup", name: t("agua", "water") },
      { qty: 1, unit: "tsp", name: t("sal", "salt") },
      { qty: 300, unit: "g", name: t("brócoli en floretes", "broccoli florets") },
      { qty: 2, unit: null, name: n("zanahoria", "zanahorias", "carrot", "carrots") },
      { qty: 2, unit: "tbsp", name: t("aceite vegetal", "vegetable oil") },
      { qty: 1, unit: null, name: n("pepino", "pepinos", "cucumber", "cucumbers") },
      { qty: 4, unit: null, name: n("huevo duro", "huevos duros", "hard-boiled egg", "hard-boiled eggs"), optional: true },
      { qty: 120, unit: "g", alt: { qty: 8, unit: "tbsp" }, name: t("Hummus de Remolacha Palapa Verde", "Palapa Verde Beet Hummus"), product: "hummus-de-remolacha" },
    ],
    steps: [
      t("Lava el arroz y cocínalo con el agua y la mitad de la sal: hierve, tapa y deja 18–20 minutos a fuego bajo.", "Rinse the rice and cook it with the water and half the salt: bring to a boil, cover and simmer 18–20 minutes."),
      t("Mientras tanto, calienta el horno a 200 °C. Corta la zanahoria en rodajas, mézclala con el brócoli, el aceite y el resto de la sal y ásalos 15–20 minutos.", "Meanwhile, heat the oven to 200 °C. Slice the carrots, toss with the broccoli, oil and remaining salt and roast for 15–20 minutes."),
      t("Corta el pepino en medias lunas y los huevos por la mitad.", "Cut the cucumber into half-moons and the eggs in half."),
      t("Reparte el arroz en cuatro bowls, añade los vegetales, el pepino y el huevo, y una porción de hummus en cada uno.", "Divide the rice between four bowls and add the vegetables, cucumber, egg and a portion of hummus to each."),
    ],
    substitutions: [
      t("Huevo → garbanzos o pollo a la plancha.", "Egg → chickpeas or grilled chicken."),
      t("Arroz blanco → arroz integral (cocción de unos 35 minutos).", "White rice → brown rice (about 35 minutes cooking)."),
    ],
    allergens: t("Con huevo: huevo. Los demás ingredientes no contienen alérgenos principales.", "With egg: egg. The other ingredients contain no major allergens."),
    media: NO_MEDIA,
  },
  {
    slug: "tacos-de-pescado-con-salsa-de-aguacate-y-jalapeno",
    status: "draft",
    title: t("Tacos de pescado con repollo y salsa de aguacate y jalapeño", "Fish tacos with cabbage and avocado–jalapeño salsa"),
    intro: t(
      "Pescado blanco a la plancha, repollo con limón y la salsa por encima. Listos en media hora.",
      "Griddled white fish, lime-dressed cabbage and the salsa on top. Ready in half an hour.",
    ),
    product: "salsa-de-aguacate-y-jalapeno",
    prepMinutes: 15,
    cookMinutes: 10,
    servings: 4,
    occasions: ["cena"],
    ingredients: [
      { qty: 500, unit: "g", name: t("filete de pescado blanco (dorado o mero)", "white fish fillet (mahi-mahi or grouper)") },
      { qty: 1, unit: "tsp", name: t("sal", "salt") },
      { qty: 1, unit: "tsp", name: t("pimentón dulce (paprika)", "sweet paprika") },
      { qty: 0.5, unit: "tsp", name: t("comino molido", "ground cumin") },
      { qty: 2, unit: "tbsp", name: t("aceite vegetal", "vegetable oil") },
      { qty: 2, unit: "cup", name: t("repollo rallado fino", "finely shredded cabbage") },
      { qty: 1, unit: null, name: n("limón", "limones", "lime", "limes") },
      { qty: 8, unit: null, name: n("tortilla de maíz", "tortillas de maíz", "corn tortilla", "corn tortillas") },
      { qty: 120, unit: "g", alt: { qty: 8, unit: "tbsp" }, name: t("Salsa de Aguacate y Jalapeño Palapa Verde", "Palapa Verde Avocado & Jalapeño Salsa"), product: "salsa-de-aguacate-y-jalapeno" },
    ],
    steps: [
      t("Seca el pescado y sazónalo con la mitad de la sal, el pimentón y el comino.", "Pat the fish dry and season with half the salt, the paprika and the cumin."),
      t("Cocínalo en una sartén caliente con el aceite 3–4 minutos por lado, hasta que esté opaco y se separe en lascas. Desmenúzalo en trozos grandes.", "Cook in a hot pan with the oil for 3–4 minutes per side, until opaque and flaking. Break it into large pieces."),
      t("Mezcla el repollo con el jugo del limón y el resto de la sal.", "Toss the cabbage with the lime juice and remaining salt."),
      t("Calienta las tortillas y arma cada taco con repollo, pescado y una cucharada de salsa.", "Warm the tortillas and build each taco with cabbage, fish and a spoonful of salsa."),
    ],
    substitutions: [
      t("Pescado → pollo desmenuzado u hongos salteados.", "Fish → shredded chicken or sautéed mushrooms."),
      t("Tortilla de maíz → tortilla de trigo.", "Corn tortilla → wheat tortilla."),
    ],
    allergens: t(
      "Contiene pescado. Con tortilla de trigo: gluten (revisa también la etiqueta de las tortillas de maíz).",
      "Contains fish. With wheat tortillas: gluten (also check the corn tortilla label).",
    ),
    media: NO_MEDIA,
  },
  {
    slug: "tostones-con-salsa-de-aguacate-y-jalapeno",
    status: "draft",
    title: t("Tostones con salsa de aguacate y jalapeño", "Tostones with avocado–jalapeño salsa"),
    intro: t(
      "Tostones crujientes recién hechos, con la salsa y un poco de tomate y cebolla por encima.",
      "Freshly made crispy tostones topped with the salsa and a little tomato and onion.",
    ),
    product: "salsa-de-aguacate-y-jalapeno",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    occasions: ["picadera"],
    ingredients: [
      { qty: 3, unit: null, name: n("plátano verde", "plátanos verdes", "green plantain", "green plantains") },
      { qty: 500, unit: "ml", name: t("aceite vegetal para freír", "vegetable oil for frying") },
      { qty: 1, unit: "tsp", name: t("sal", "salt") },
      { qty: 1, unit: null, name: n("tomate", "tomates", "tomato", "tomatoes") },
      { qty: 2, unit: "tbsp", name: t("cebolla roja picada fina", "finely chopped red onion") },
      { qty: 0.5, unit: null, name: n("limón", "limones", "lime", "limes") },
      { qty: 120, unit: "g", alt: { qty: 8, unit: "tbsp" }, name: t("Salsa de Aguacate y Jalapeño Palapa Verde", "Palapa Verde Avocado & Jalapeño Salsa"), product: "salsa-de-aguacate-y-jalapeno" },
    ],
    steps: [
      t("Pela los plátanos y córtalos en rodajas de 3 cm.", "Peel the plantains and cut them into 3 cm rounds."),
      t("Fríelos en el aceite caliente 3–4 minutos, sin dorar. Sácalos y aplástalos con una tostonera o el fondo de un vaso.", "Fry in the hot oil for 3–4 minutes without browning. Remove and flatten them with a tostonera or the bottom of a glass."),
      t("Fríelos otra vez 2–3 minutos, hasta que estén dorados y crujientes. Escurre y sala.", "Fry again for 2–3 minutes, until golden and crisp. Drain and salt."),
      t("Pica el tomate y mézclalo con la cebolla y el limón. Sirve los tostones con la salsa y el tomate por encima.", "Dice the tomato and mix it with the onion and lime. Serve the tostones topped with the salsa and tomato."),
    ],
    substitutions: [
      t("Freír → freidora de aire (unos 15 minutos a 200 °C, aplastando a mitad de tiempo).", "Deep-frying → air fryer (about 15 minutes at 200 °C, flattening halfway)."),
      t("Plátano verde → yuca frita.", "Green plantain → fried yuca."),
    ],
    allergens: t("Los demás ingredientes no contienen alérgenos principales.", "The other ingredients contain no major allergens."),
    media: NO_MEDIA,
  },
];

export { PRODUCT_ALLERGENS };

export const OCCASIONS: readonly Occasion[] = ["desayuno", "almuerzo", "cena", "picadera"];

/** Tramos de tiempo para el filtro (minutos totales). */
export const TIME_BUCKETS = [
  { id: "15", max: 15 },
  { id: "30", max: 30 },
  { id: "60", max: Infinity },
] as const;
export type TimeBucket = (typeof TIME_BUCKETS)[number]["id"];

export function totalMinutes(r: Pick<Recipe, "prepMinutes" | "cookMinutes">): number {
  return r.prepMinutes + r.cookMinutes;
}

export function timeBucket(r: Pick<Recipe, "prepMinutes" | "cookMinutes">): TimeBucket {
  const total = totalMinutes(r);
  return (TIME_BUCKETS.find((b) => total <= b.max) ?? TIME_BUCKETS[2]).id;
}

/** Recetas en borrador visibles solo en previsualización, salvo SHOW_DRAFT_RECIPES. */
export function showDraftRecipes(env: Record<string, string | undefined> = process.env): boolean {
  if (env.SHOW_DRAFT_RECIPES === "true") return true;
  if (env.SHOW_DRAFT_RECIPES === "false") return false;
  return env.VERCEL_ENV !== "production";
}

export function visibleRecipes(env?: Record<string, string | undefined>): Recipe[] {
  const drafts = showDraftRecipes(env);
  return RECIPES.filter((r) => r.status === "tested" || drafts);
}

export function recipesForProduct(slug: string, env?: Record<string, string | undefined>): Recipe[] {
  return visibleRecipes(env).filter((r) => r.product === slug);
}
