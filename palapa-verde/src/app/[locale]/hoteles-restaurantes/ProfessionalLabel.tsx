import Image from "next/image";
import type { Locale } from "@/lib/commerce/types";
import styles from "./professional-label.module.css";

const copy = {
  es: {
    title: "Etiqueta profesional",
    lead: "Un ejemplo con hummus de zanahoria. La etiqueta reúne lo que necesita la cocina al recibir, abrir y servir cada envase.",
    sample: "Muestra de diseño. Los datos de producto y lote se completarán antes de la impresión.",
    guide: "Cómo leerla",
    entries: [
      {
        title: "Qué producto llegó",
        text: "El nombre y el sabor aparecen primero para distinguir, por ejemplo, el hummus de zanahoria del de remolacha. El contenido neto corresponde al envase que se entrega.",
      },
      {
        title: "Ingredientes y alérgenos",
        text: "El productor completará estos campos con la receta y la declaración de alérgenos confirmadas para ese producto. Si un comensal pregunta por un alérgeno, el equipo podrá consultar la etiqueta final o solicitar la ficha del producto.",
      },
      {
        title: "Lote, fechas y conservación",
        text: "El productor indicará el lote, la fecha de elaboración, la de vencimiento y las condiciones de conservación. Al recibir el pedido, la cocina puede identificar el lote de cada envase y usar ese código en cualquier consulta.",
      },
      {
        title: "Qué anotar al abrir",
        text: "La persona que abra el envase anotará el día, el mes, el año y sus iniciales en el recuadro. El siguiente turno podrá reconocer cuándo se abrió y consultar las instrucciones de conservación después de la apertura.",
      },
    ],
  },
  en: {
    title: "Professional label",
    lead: "Carrot hummus shows how the label works. It brings together what the kitchen needs when receiving, opening and serving each pack.",
    sample: "Sample design. Product and batch details will be completed before printing.",
    guide: "How to read it",
    entries: [
      {
        title: "Which product arrived",
        text: "The name and flavour come first, so the team can distinguish carrot hummus from beet hummus at a glance. The net weight refers to the pack delivered.",
      },
      {
        title: "Ingredients and allergens",
        text: "The producer will fill these fields with the confirmed recipe and allergen declaration for that product. When a guest asks about an allergen, the team can check the final label or ask for the product specification.",
      },
      {
        title: "Batch, dates and storage",
        text: "The producer will supply the batch code, production date, use-by date and storage instructions. At delivery, the kitchen can identify the batch on each pack and quote the code if a question comes up.",
      },
      {
        title: "What to record when opening",
        text: "The person opening the pack writes the day, month, year and their initials in the box. The next shift can see when it was opened and refer to the instructions for storage after opening.",
      },
    ],
  },
};

const printedFields = [
  ["Lote", "Batch"],
  ["Contenido neto", "Net weight"],
  ["Elaboración", "Made on"],
  ["Vencimiento", "Use by"],
] as const;

function Bilingual({ es, en }: { es: string; en: string }) {
  return <><span lang="es">{es}</span><span className={styles.translation} lang="en">{en}</span></>;
}

export function ProfessionalLabel({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section className={styles.section} aria-labelledby="professional-label-heading">
      <header className={styles.header}>
        <h2 id="professional-label-heading">{t.title}</h2>
        <p>{t.lead}</p>
      </header>
      <div className={styles.layout}>
        <figure className={styles.figure}>
          <div className={styles.paper}>
            <Image className={styles.palapa} src="/media/horeca/etiqueta-palapa.svg" width={1012} height={238} alt="Palapa Verde" />
            <div className={styles.product}>
              <div>
                <strong lang="es">Hummus de zanahoria</strong>
                <span lang="en">Carrot hummus</span>
              </div>
              <Image src="/media/horeca/etiqueta-zanahoria.svg" width={148} height={121} alt="" />
            </div>
            <div className={styles.specifications}>
              <span><Bilingual es="Ingredientes" en="Ingredients" /></span>
              <span><Bilingual es="Alérgenos" en="Allergens" /></span>
              <span><Bilingual es="Conservación" en="Storage" /></span>
              <small><span lang="es">Por confirmar</span> · <span lang="en">To be confirmed</span></small>
            </div>
            <div className={styles.fields}>
              {printedFields.map(([es, en]) => (
                <div key={es}><Bilingual es={es} en={en} /><i aria-hidden="true" /></div>
              ))}
            </div>
            <div className={styles.opening}>
              <div><Bilingual es="Abierto el" en="Opened on" /><span className={styles.writeLine} aria-hidden="true" /></div>
              <div><Bilingual es="Iniciales" en="Initials" /><span className={styles.writeLine} aria-hidden="true" /></div>
            </div>
            <Image className={styles.parentBrand} src="/media/horeca/etiqueta-go-veggie-life.svg" width={199} height={35} alt="Go Veggie Life" />
          </div>
          <figcaption>{t.sample}</figcaption>
        </figure>
        <div className={styles.guide}>
          <h3>{t.guide}</h3>
          {t.entries.map(({ title, text }, index) => (
            <details key={title} open={index === 0}>
              <summary>{title}</summary>
              <p>{text}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
