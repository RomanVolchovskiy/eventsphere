import Link from "next/link";

const CELLS = [
  {
    num: "01",
    tag: "Featured",
    title: "Весілля у Кам'янці",
    body: "Триденна камерна церемонія в каньйоні над Смотричем. 84 гостя, 12 виконавців, без compromise.",
    feature: true,
    span2: true,
    href: "/catalog",
  },
  {
    num: "02",
    tag: "Корпоратив",
    title: "Зимовий вечір BlockOne",
    body: "1 200 запрошених. Подвір'я Арсеналу.",
    href: "/catalog",
  },
  {
    num: "03",
    tag: "Live",
    title: "Музика без алгоритму",
    body: "Куратор підбирає квартет, дует, або біг-бенд за брифом.",
    href: "/smart-match",
  },
  {
    num: "04",
    tag: "Production",
    title: "Світло як режисура",
    body: "Технічний продакшен від проєкту до демонтажу. Свій склад, свої інженери.",
    href: "/catalog",
  },
  {
    num: "05",
    tag: "Catering",
    title: "Кухня шефа на виїзді",
    body: "Сезонне меню. Локальні продукти. Шеф приходить особисто.",
    href: "/catalog",
  },
  {
    num: "06",
    tag: "Decor",
    title: "Сценографія простору",
    body: "Архітектурні інсталяції, флористика, інтер'єрна графіка.",
    href: "/catalog",
  },
];

export default function Featured() {
  return (
    <section className="noir-section" id="featured">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-8">
        <div className="flex flex-col gap-6 max-w-[640px]">
          <span className="noir-label">Розділ 01 — Підбірка</span>
          <h2 className="noir-h2">
            Кращі історії <span className="accent">сезону</span>
          </h2>
          <p className="noir-lead">
            Не каталог послуг, а архів подій. Шість випадків, в яких
            редакція брала участь — і за які ручається.
          </p>
        </div>
        <span className="noir-num">№ 01 / 07</span>
      </div>

      <div className="noir-featured-grid">
        {CELLS.map((c) => (
          <Link
            href={c.href}
            key={c.num}
            className={`noir-cell ${c.feature ? "feature" : ""} ${
              c.span2 ? "span-2 span-2-row" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="noir-cell-num">{c.num}</span>
              <span className="noir-cell-tag">{c.tag}</span>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="noir-cell-title">{c.title}</h3>
              <p className="noir-cell-body">{c.body}</p>
              <span className="noir-num mt-2">Читати випадок →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
