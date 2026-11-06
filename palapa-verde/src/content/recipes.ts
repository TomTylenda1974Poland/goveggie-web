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
  /** Volumen de aceite que necesita la sartén, independiente de las porciones. */
  scale?: "per-pan";
};

type RecipeImage = { src: string; alt: Localized; width: number; height: number };

export type RecipeMedia = {
  photo: RecipeImage | null;
  illustration?: RecipeImage;
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
function servingIllustration(file: string, es: string, en: string): RecipeMedia {
  return {
    photo: null,
    video: null,
    illustration: { src: `/media/recetas/${file}.webp`, alt: t(es, en), width: 960, height: 640 },
  };
}
const PRODUCT_ALLERGENS = t(
  "La composición y los alérgenos del producto están pendientes de confirmación. Antes de una degustación, verifica la información de la muestra concreta.",
  "The product ingredients and allergens are pending confirmation. Before a tasting, check the information for the specific sample.",
);

export const RECIPES: readonly Recipe[] = [
  {
    slug: "yuca-con-chutney-de-cilantro",
    status: "draft",
    title: t("Yuca con cebolla y chutney de cilantro", "Yuca with onions and cilantro chutney"),
    intro: t("La cebolla roja se termina con vinagre. Sirve el chutney aparte para probarlo primero con un solo trozo de yuca.", "Finish the red onion with vinegar. Serve the chutney on the side so you can try it with one piece of yuca first."),
    product: "chutney-de-cilantro",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    occasions: ["almuerzo", "picadera"],
    ingredients: [
      { qty: 1000, unit: "g", name: t("yuca dulce comercial, pelada y completamente cocida, peso escurrido", "commercially prepared sweet cassava, peeled and fully cooked, drained weight") },
      { qty: 0.25, unit: "tsp", name: t("sal fina", "fine salt") },
      { qty: 1, unit: null, name: n("cebolla roja mediana", "cebollas rojas medianas", "medium red onion", "medium red onions") },
      { qty: 2, unit: "tbsp", name: t("aceite vegetal", "vegetable oil") },
      { qty: 1, unit: "tbsp", name: t("vinagre blanco", "white vinegar") },
      { qty: 120, unit: "g", name: t("Chutney de Cilantro Palapa Verde", "Palapa Verde Cilantro Chutney"), product: "chutney-de-cilantro" },
    ],
    steps: [
      t("Escoge yuca que el envase identifique como ya cocida. Mide el peso escurrido y corta en trozos de unos 5 cm.", "Choose packaged yuca labelled fully cooked. Weigh it drained and cut it into roughly 5 cm pieces."),
      t("Calienta la yuca según las instrucciones del envase. Retira las fibras centrales que encuentres y reparte la sal sobre los trozos calientes.", "Heat the cooked yuca according to its package instructions. Remove any woody cores and sprinkle the salt over the hot pieces."),
      t("Mientras tanto, corta la cebolla en aros finos y saltéala 3–4 minutos en el aceite. Añade el vinagre al final.", "Meanwhile, slice the onion into thin rings and sauté it in the oil for 3–4 minutes. Add the vinegar at the end."),
      t("Sirve la yuca caliente con la cebolla por encima y el chutney en un bol al lado.", "Serve the yuca hot with the onions on top and the chutney in a bowl on the side."),
    ],
    substitutions: [
      t("Para 4 porciones: Cambia la yuca por 1 kg de batata pelada. Córtala en trozos de 3 cm y hiérvela hasta que esté tierna. Registra el tiempo de esta variante aparte.", "For 4 servings: Replace the yuca with 1 kg of peeled sweet potato. Cut into 3 cm pieces and boil until tender. Record the cooking time for this version separately."),
    ],
    allergens: t("Consulta los ingredientes de la yuca envasada, el aceite y el vinagre de la prueba. Registra cualquier alérgeno declarado.", "Read the labels of the packaged yuca, oil and vinegar used for the test. Record any declared allergens."),
    media: servingIllustration("yuca", "Yuca cocida con cebolla roja y un cuenco de chutney de cilantro.", "Boiled cassava with red onion and a bowl of cilantro chutney."),
  },
  {
    slug: "sandwich-de-pollo-con-chutney-de-cilantro",
    status: "draft",
    title: t("Sándwich de pollo a la plancha con chutney de cilantro", "Grilled chicken sandwich with cilantro chutney"),
    intro: t("Pollo a la plancha, aguacate y tomate en pan de agua, con el chutney en lugar de mayonesa.", "Grilled chicken, avocado and tomato in a Dominican bread roll, with the chutney instead of mayonnaise."),
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
      { qty: 60, unit: "g", name: t("Chutney de Cilantro Palapa Verde", "Palapa Verde Cilantro Chutney"), product: "chutney-de-cilantro" },
    ],
    steps: [
      t("Abre la pechuga en filetes finos y sazónala con la sal y la pimienta.", "Butterfly the chicken into thin fillets and season with the salt and pepper."),
      t("En una sartén caliente con el aceite, cocina el pollo unos 5–6 minutos por lado. Comprueba con termómetro que el centro de la parte más gruesa llegue a 74 °C. Pásalo a un plato limpio.", "Heat the oil in a skillet. Cook the chicken for about 5–6 minutes per side. Use a thermometer to check that the thickest part has reached 74°C/165°F. Transfer to a clean plate."),
      t("Abre y tuesta el pan. Corta el tomate y el aguacate en láminas.", "Split and toast the bread. Slice the tomato and avocado."),
      t("Unta el chutney en las dos caras del pan y arma con lechuga, pollo, tomate y aguacate.", "Spread the chutney on both sides of the bread and build with lettuce, chicken, tomato and avocado."),
    ],
    substitutions: [
      t("Para 2 porciones: En lugar de 300 g de pechuga, prueba 2 huevos fritos con la yema cuajada o 150 g de queso de freír dorado. Para el pan, usa 4 rebanadas de pan integral de trigo por las 2 unidades de pan de agua.", "For 2 servings: In place of the chicken, try 2 fried eggs with set yolks or 150 g of pan-seared frying cheese. Swap the two rolls for 4 slices of whole-wheat bread."),
    ],
    allergens: t("Pan de agua de trigo: trigo (gluten). El queso añade leche y el huevo añade huevo si eliges esas variantes. Comprueba la etiqueta del pan.", "Wheat rolls contain wheat (gluten). The cheese variation adds milk, and the egg variation adds egg. Check the bread label."),
    media: servingIllustration("sandwich", "Pan de agua con pollo a la plancha, tomate, aguacate y chutney verde.", "A Dominican bread roll with grilled chicken, tomato, avocado and green chutney."),
  },
  {
    slug: "huevos-revueltos-con-pesto-de-cilantro",
    status: "draft",
    title: t("Tostadas de huevo revuelto con pesto de cilantro", "Scrambled egg toast with cilantro pesto"),
    intro: t("Unta el pesto sobre el pan recién tostado y añade el huevo al final para que la base conserve su textura.", "Spread pesto on freshly toasted bread, then add the eggs just before serving to keep the base crisp."),
    product: "pesto-de-cilantro-con-semillas-de-auyama",
    prepMinutes: 5,
    cookMinutes: 5,
    servings: 2,
    occasions: ["desayuno"],
    ingredients: [
      { qty: 4, unit: null, name: n("huevo", "huevos", "egg", "eggs") },
      { qty: 0.125, unit: "tsp", name: t("sal fina", "fine salt") },
      { qty: 1, unit: "tbsp", name: t("mantequilla", "butter") },
      { qty: 2, unit: null, name: t("rebanadas de pan de trigo", "slices of wheat bread") },
      { qty: 1, unit: null, name: n("tomate pequeño", "tomates pequeños", "small tomato", "small tomatoes"), optional: true },
      { qty: 30, unit: "g", name: t("Pesto de Cilantro con Semillas de Auyama Palapa Verde", "Palapa Verde Cilantro Pesto with Pumpkin Seeds"), product: "pesto-de-cilantro-con-semillas-de-auyama" },
    ],
    steps: [
      t("Bate los huevos con la sal.", "Beat the eggs with the salt."),
      t("Derrite la mantequilla a fuego bajo. Agrega los huevos y mueve con una espátula hasta que estén cuajados y sin líquido visible.", "Melt the butter over low heat. Add the eggs and gently stir with a spatula until set throughout, with no liquid egg remaining."),
      t("Tuesta el pan y úntalo con el pesto.", "Toast the bread and spread it with the pesto."),
      t("Pon los huevos encima y, si quieres, el tomate en cubitos.", "Top with the eggs and, if you like, diced tomato."),
    ],
    substitutions: [
      t("Para 2 porciones: Usa 2 trozos de casabe tostado (unos 40 g en total) en vez de las 2 rebanadas. Puedes sustituir la mantequilla por 1 cucharada de aceite.", "For 2 servings: Use 2 pieces of toasted casabe (about 40 g total) instead of the bread. You can replace the butter with 1 tablespoon of oil."),
    ],
    allergens: t("Huevo, trigo (gluten) en el pan y leche en la mantequilla. Si cambias alguno, revisa las etiquetas del casabe y del aceite que utilices.", "Egg, wheat (gluten) in the bread and milk in the butter. Check the labels of any casabe or oil used as swaps."),
    media: servingIllustration("tostadas", "Tostadas con pesto verde y huevos revueltos.", "Toast spread with green pesto and topped with scrambled eggs."),
  },
  {
    slug: "pasta-con-pesto-auyama-y-berenjena",
    status: "draft",
    title: t("Pasta con pesto, auyama y berenjena asadas", "Pasta with pesto, roasted pumpkin and eggplant"),
    intro: t("Una cena con vegetales asados al horno y el pesto como salsa, aligerado con agua de la pasta.", "A dinner of oven-roasted vegetables with the pesto as the sauce, loosened with pasta water."),
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
      { qty: 120, unit: "g", name: t("Pesto de Cilantro con Semillas de Auyama Palapa Verde", "Palapa Verde Cilantro Pesto with Pumpkin Seeds"), product: "pesto-de-cilantro-con-semillas-de-auyama" },
    ],
    steps: [
      t("Calienta el horno a 200 °C. Mezcla la auyama y la berenjena con el aceite y la sal y ásalas 20–25 minutos en una bandeja, hasta que estén doradas.", "Heat the oven to 200 °C. Toss the pumpkin and eggplant with the oil and salt and roast on a tray for 20–25 minutes, until golden."),
      t("Mientras se asan los vegetales, cocina la pasta en agua según el paquete. Antes de escurrir, reserva la cantidad de agua indicada en la lista.", "While the vegetables roast, cook the pasta in water according to its packet. Before draining, reserve the amount of cooking water on the ingredient list."),
      t("En la olla vacía, mezcla la pasta con el pesto y el agua reservada hasta que quede cremosa.", "In the empty pot, toss the pasta with the pesto and the reserved water until creamy."),
      t("Añade los vegetales asados y sirve enseguida.", "Fold in the roasted vegetables and serve straight away."),
    ],
    substitutions: [
      t("Para 4 porciones: Sustituye la berenjena por 300 g de calabacín en cubos. Puedes cambiar la pasta de trigo por 400 g de pasta de maíz, siguiendo el tiempo de su paquete.", "For 4 servings: Replace the eggplant with 300 g diced zucchini. You can swap wheat pasta for 400 g of corn pasta, following its package timing."),
    ],
    allergens: t("La pasta de trigo aporta trigo (gluten). Revisa si la pasta elegida incluye huevo u otros alérgenos.", "Wheat pasta contains wheat (gluten). Check the chosen pasta for egg and other declared allergens."),
    media: servingIllustration("pasta", "Pasta corta con pesto, auyama asada y berenjena.", "Short pasta with pesto, roasted squash and eggplant."),
  },
  {
    slug: "picadera-de-vegetales-con-hummus-de-zanahoria",
    status: "draft",
    title: t("Picadera de vegetales y casabe con hummus de zanahoria", "Vegetable and casabe snack board with carrot hummus"),
    intro: t("Para compartir: vegetales crujientes y casabe alrededor de un bol de hummus.", "For sharing: crunchy vegetables and cassava bread around a bowl of hummus."),
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
      { qty: 120, unit: "g", name: t("casabe natural listo para comer", "plain ready-to-eat casabe") },
      { qty: 250, unit: "g", name: t("Hummus de Zanahoria Palapa Verde", "Palapa Verde Carrot Hummus"), product: "hummus-de-zanahoria" },
    ],
    steps: [
      t("Lava los vegetales. Corta la zanahoria, el pepino y los ajíes en bastones.", "Wash the vegetables. Cut the carrots, cucumber and peppers into sticks."),
      t("Parte el casabe en trozos de tamaño de bocado.", "Break the cassava bread into bite-size pieces."),
      t("Pon el hummus en un bol en el centro de una tabla y reparte los vegetales, los tomates y el casabe alrededor.", "Put the hummus in a bowl in the middle of a board and arrange the vegetables, tomatoes and cassava bread around it."),
    ],
    substitutions: [
      t("Para 6 porciones: Por los 120 g de casabe, usa 120 g de galletas de trigo. Puedes sustituir el pepino por 150 g de apio cortado en bastones.", "For 6 servings: Replace the 120 g of casabe with 120 g of wheat crackers. You can swap the cucumber for 150 g of celery sticks."),
    ],
    allergens: t("Revisa la etiqueta del casabe. Las galletas de trigo aportan trigo (gluten), y el apio debe declararse si eliges la sustitución.", "Check the casabe label. Wheat crackers add wheat (gluten), and celery should be identified if used as a swap."),
    media: servingIllustration("picadera", "Hummus de zanahoria rodeado de bastones de vegetales, tomates y casabe.", "Carrot hummus surrounded by vegetable sticks, tomatoes and cassava crispbread."),
  },
  {
    slug: "wrap-de-vegetales-asados-con-hummus-de-zanahoria",
    status: "draft",
    title: t("Wrap de vegetales a la plancha con hummus de zanahoria", "Grilled vegetable wrap with carrot hummus"),
    intro: t("Unta el hummus hasta cerca del borde. Así se reparte con cada mordida entre las tiras de vegetales a la plancha.", "Spread hummus almost to the edge of the tortilla so every bite has some alongside the strips of grilled vegetables."),
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
      { qty: 120, unit: "g", name: t("Hummus de Zanahoria Palapa Verde", "Palapa Verde Carrot Hummus"), product: "hummus-de-zanahoria" },
    ],
    steps: [
      t("Corta el ají, el calabacín y la cebolla en tiras. Mézclalos con el aceite y la sal.", "Cut the pepper, zucchini and onion into strips. Toss with the oil and salt."),
      t("Cocínalos en una plancha o sartén muy caliente 8–10 minutos, hasta que estén tiernos y marcados. Si usas queso, dóralo 1 minuto por lado.", "Cook on a very hot griddle or pan for 8–10 minutes, until tender and charred. If using cheese, brown it 1 minute per side."),
      t("Calienta las tortillas 20 segundos por lado.", "Warm the tortillas for 20 seconds per side."),
      t("Unta el hummus en las tortillas. Reparte las hojas, los vegetales y, si lo usas, el queso. Dobla los extremos y enrolla.", "Spread the hummus on the tortillas. Divide the greens, vegetables and optional cheese among them. Fold the ends in and roll up."),
    ],
    substitutions: [
      t("Para 4 porciones: Prueba 4 tortillas de maíz grandes del mismo diámetro y revisa su etiqueta. En vez del queso opcional, usa 100 g de garbanzos cocidos y escurridos.", "For 4 servings: Try 4 large corn tortillas of the same diameter and check their label. Replace the optional cheese with 100 g of cooked, drained chickpeas."),
    ],
    allergens: t("La tortilla de trigo aporta trigo (gluten). El queso opcional añade leche. Comprueba también la etiqueta de las tortillas de maíz si las usas.", "Wheat tortillas contain wheat (gluten). The optional cheese adds milk. If using corn tortillas, also check their label."),
    media: servingIllustration("wrap", "Un wrap cortado muestra hummus de zanahoria, ají rojo y vegetales a la plancha.", "A cut wrap reveals carrot hummus, red pepper and grilled vegetables."),
  },
  {
    slug: "casabe-con-hummus-de-remolacha-y-aguacate",
    status: "draft",
    title: t("Casabe con hummus de remolacha y aguacate", "Casabe with beet hummus and avocado"),
    intro: t("El casabe tostado hace de base crujiente para el hummus rosado y el aguacate con limón.", "Toasted cassava bread makes a crunchy base for the pink hummus and lime-dressed avocado."),
    product: "hummus-de-remolacha",
    prepMinutes: 10,
    cookMinutes: 2,
    servings: 2,
    occasions: ["desayuno", "picadera"],
    ingredients: [
      { qty: 60, unit: "g", name: t("casabe natural listo para comer", "plain ready-to-eat casabe") },
      { qty: 1, unit: null, name: n("aguacate maduro", "aguacates maduros", "ripe avocado", "ripe avocados") },
      { qty: 15, unit: "ml", name: t("jugo de limón", "fresh lime juice") },
      { qty: 0.125, unit: "tsp", name: t("sal fina", "fine salt") },
      { qty: 2, unit: "tbsp", name: t("cebolla roja picada fina", "finely chopped red onion") },
      { qty: 2, unit: "g", name: t("hojas de cilantro", "cilantro leaves"), optional: true },
      { qty: 90, unit: "g", name: t("Hummus de Remolacha Palapa Verde", "Palapa Verde Beet Hummus"), product: "hummus-de-remolacha" },
    ],
    steps: [
      t("Divide el casabe en trozos individuales y tuéstalos 1–2 minutos en una sartén seca.", "Divide the casabe into individual pieces and toast for 1–2 minutes in a dry skillet."),
      t("Corta el aguacate en láminas y aderézalo con el jugo de limón y la sal.", "Slice the avocado and dress it with the lime juice and salt."),
      t("Unta cada trozo de casabe con el hummus y coloca el aguacate encima.", "Spread each piece of cassava bread with the hummus and top with the avocado."),
      t("Termina con la cebolla y, si quieres, hojas de cilantro.", "Finish with the onion and, if you like, cilantro leaves."),
    ],
    substitutions: [
      t("Para 2 porciones: Por el casabe, prueba 2 rebanadas de pan de trigo tostado. En lugar del aguacate, corta 2 huevos duros en rodajas.", "For 2 servings: Try 2 slices of toasted wheat bread in place of the casabe. Instead of avocado, top with 2 sliced hard-boiled eggs."),
    ],
    allergens: t("Comprueba la etiqueta del casabe. La versión con pan de trigo contiene trigo (gluten) y la versión con huevo contiene huevo.", "Check the casabe label. The wheat bread version contains wheat (gluten), and the egg version contains egg."),
    media: servingIllustration("casabe", "Casabe tostado con hummus rosado de remolacha y aguacate en láminas.", "Toasted cassava crispbread with pink beet hummus and sliced avocado."),
  },
  {
    slug: "bowl-de-arroz-con-vegetales-y-hummus-de-remolacha",
    status: "draft",
    title: t("Bowl de arroz, vegetales asados y hummus de remolacha", "Rice bowl with roasted vegetables and beet hummus"),
    intro: t("Arroz blanco, brócoli y zanahoria asados, pepino fresco y una cucharada generosa de hummus.", "White rice, roasted broccoli and carrot, fresh cucumber and a generous spoonful of hummus."),
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
      { qty: 120, unit: "g", name: t("Hummus de Remolacha Palapa Verde", "Palapa Verde Beet Hummus"), product: "hummus-de-remolacha" },
    ],
    steps: [
      t("Lava el arroz y cocínalo con el agua y la mitad de la sal: hierve, tapa y deja 18–20 minutos a fuego bajo.", "Rinse the rice and cook it with the water and half the salt: bring to a boil, cover and simmer 18–20 minutes."),
      t("Mientras tanto, calienta el horno a 200 °C. Corta la zanahoria en rodajas, mézclala con el brócoli, el aceite y el resto de la sal y ásalos 15–20 minutos.", "Meanwhile, heat the oven to 200 °C. Slice the carrots, toss with the broccoli, oil and remaining salt and roast for 15–20 minutes."),
      t("Corta el pepino en medias lunas. Si usas huevos duros ya cocidos, pártelos por la mitad.", "Cut the cucumber into half-moons. If using the ready-cooked hard-boiled eggs, halve them."),
      t("Reparte el arroz entre los bowls. Añade los vegetales, el pepino, el huevo si lo usas y una porción del hummus en cada uno.", "Divide the rice among the bowls. Add the vegetables, cucumber and egg if using, then finish each bowl with its share of the hummus."),
    ],
    substitutions: [
      t("Para 4 porciones: En vez de los 4 huevos opcionales, usa 240 g de garbanzos cocidos y escurridos. Para arroz integral, usa 1½ tazas secas y ajusta el agua y la cocción según el paquete.", "For 4 servings: Instead of the 4 optional eggs, use 240 g of cooked, drained chickpeas. For brown rice, use 1½ cups dry and follow its package directions for water and cooking time."),
    ],
    allergens: t("El huevo es opcional. Registra si lo incluyes y revisa las etiquetas del aceite y de cualquier ingrediente envasado.", "Egg is optional. Record whether it was used and check the labels on the oil and any packaged ingredients."),
    media: servingIllustration("bowl", "Arroz blanco con zanahoria, brócoli, pepino y hummus de remolacha.", "White rice with carrot, broccoli, cucumber and beet hummus."),
  },
  {
    slug: "tacos-de-pescado-con-salsa-de-aguacate-y-jalapeno",
    status: "draft",
    title: t("Tacos de pescado con repollo y salsa de aguacate y jalapeño", "Fish tacos with cabbage and avocado–jalapeño salsa"),
    intro: t("El repollo con limón se coloca debajo del pescado. Añade la salsa justo antes de servir para que se vea en cada taco.", "Layer lime-dressed cabbage under the fish. Add the salsa just before serving so it stays visible on every taco."),
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
      { qty: 120, unit: "g", name: t("Salsa de Aguacate y Jalapeño Palapa Verde", "Palapa Verde Avocado & Jalapeño Salsa"), product: "salsa-de-aguacate-y-jalapeno" },
    ],
    steps: [
      t("Seca el pescado y sazónalo con la mitad de la sal, el pimentón y el comino.", "Pat the fish dry and season with half the salt, the paprika and the cumin."),
      t("En una sartén caliente con el aceite, cocina los filetes unos 3–4 minutos por lado, según el grosor. Comprueba que el centro llegue a 63 °C. Desmenuza en trozos grandes.", "Heat the oil in a skillet. Cook the fish for about 3–4 minutes per side, depending on thickness, until the center reaches 63°C/145°F. Break into large pieces."),
      t("Mezcla el repollo con el jugo del limón y el resto de la sal.", "Toss the cabbage with the lime juice and remaining salt."),
      t("Calienta las tortillas. Reparte el repollo, el pescado y toda la salsa entre los tacos.", "Warm the tortillas. Divide the cabbage, fish and all the salsa evenly among the tacos."),
    ],
    substitutions: [
      t("Para 4 porciones: Cambia el pescado por 500 g de hongos frescos en tiras y saltéalos hasta que se doren. Puedes usar 8 tortillas pequeñas de trigo en vez de las de maíz.", "For 4 servings: Swap fish for 500 g of sliced fresh mushrooms and sauté until browned. You can use 8 small wheat tortillas instead of corn tortillas."),
    ],
    allergens: t("Contiene pescado. Revisa la etiqueta de las tortillas de maíz. Si usas tortillas de trigo, se añade trigo (gluten).", "Contains fish. Check the corn tortilla label. Wheat tortillas add wheat (gluten)."),
    media: servingIllustration("tacos", "Tacos de pescado con repollo y salsa verde cremosa de aguacate.", "Fish tacos filled with cabbage and creamy green avocado salsa."),
  },
  {
    slug: "tostones-con-salsa-de-aguacate-y-jalapeno",
    status: "draft",
    title: t("Tostones con salsa de aguacate y jalapeño", "Tostones with avocado–jalapeño salsa"),
    intro: t("Tostones crujientes recién hechos, con la salsa y un poco de tomate y cebolla por encima.", "Freshly made crispy tostones topped with the salsa and a little tomato and onion."),
    product: "salsa-de-aguacate-y-jalapeno",
    prepMinutes: 10,
    cookMinutes: 15,
    servings: 4,
    occasions: ["picadera"],
    ingredients: [
      { qty: 3, unit: null, name: n("plátano verde", "plátanos verdes", "green plantain", "green plantains") },
      { qty: 500, unit: "ml", name: t("aceite vegetal para freír", "vegetable oil for frying"), scale: "per-pan", note: t("cantidad para la sartén de prueba; freír por tandas", "amount for the test pan; fry in batches") },
      { qty: 1, unit: "tsp", name: t("sal", "salt") },
      { qty: 1, unit: null, name: n("tomate", "tomates", "tomato", "tomatoes") },
      { qty: 2, unit: "tbsp", name: t("cebolla roja picada fina", "finely chopped red onion") },
      { qty: 0.5, unit: null, name: n("limón", "limones", "lime", "limes") },
      { qty: 120, unit: "g", name: t("Salsa de Aguacate y Jalapeño Palapa Verde", "Palapa Verde Avocado & Jalapeño Salsa"), product: "salsa-de-aguacate-y-jalapeno" },
    ],
    steps: [
      t("Pela los plátanos y córtalos en rodajas de 3 cm.", "Peel the plantains and cut them into 3 cm rounds."),
      t("Fríe las rodajas por tandas hasta que el centro esté tierno y puedas aplastarlas sin que se deshagan. Sácalas con una espumadera y aplástalas con una tostonera.", "Fry the plantain rounds in batches until tender in the center and easy to flatten. Lift out with a slotted spoon and press with a plantain press."),
      t("Fríelos otra vez 2–3 minutos, hasta que estén dorados y crujientes. Escurre y sala.", "Fry again for 2–3 minutes, until golden and crisp. Drain and salt."),
      t("Pica el tomate y mézclalo con la cebolla y el limón. Sirve los tostones con la salsa y el tomate por encima.", "Dice the tomato and mix it with the onion and lime. Serve the tostones topped with the salsa and tomato."),
    ],
    substitutions: [
      t("Para 4 porciones: Cambia el tomate por 120 g de mango firme en cubitos. Para otra picadera, sirve la misma salsa con 120 g de casabe listo para comer, sin freír.", "For 4 servings: Swap the tomato for 120 g diced firm mango. For another snack, serve the salsa with 120 g of ready-to-eat casabe, skipping the frying step."),
    ],
    allergens: t("Comprueba la etiqueta del aceite. Para la prueba, usa aceite nuevo y utensilios limpios. Revisa también el casabe si eliges esa variante.", "Check the oil label. For this test, use fresh frying oil and clean utensils. Also check the casabe if you choose that variation."),
    media: servingIllustration("tostones", "Tostones dorados con salsa de aguacate, tomate y cebolla roja.", "Golden fried plantain rounds with avocado salsa, tomato and red onion."),
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
