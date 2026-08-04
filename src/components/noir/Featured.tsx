import Link from "next/link";

const CELLS = [
  {
    num: "01",
    tag: "Весілля",
    title: "Весілля у Кам'янці",
    body: "Три дні у каньйоні над Смотричем. 84 гостя, 12 виконавців.",
    feature: true,
    span2: true,
    href: "/catalog?cat=venue",
  },
  {
    num: "02",
    tag: "Корпоратив",
    title: "Зимовий вечір BlockOne",
    body: "1 200 запрошених у подвір'ї Арсеналу.",
    href: "/catalog?cat=venue",
  },
  {
    num: "03",
    tag: "Музика",
    title: "Ведучий і музиканти",
    body: "Дует, квартет чи біг-бенд — підберемо під формат свята.",
    href: "/catalog?cat=entertainment",
  },
  {
    num: "04",
    tag: "Фото і відео",
    title: "Зйомка свята",
    body: "Фотографи й відеооператори: репортаж, постановка, аерозйомка.",
    href: "/catalog?cat=photo",
  },
  {
    num: "05",
    tag: "Кейтеринг",
    title: "Кухня на виїзді",
    body: "Меню під ваш формат. Шеф і команда приїжджають на місце.",
    href: "/catalog?cat=catering",
  },
  {
    num: "06",
    tag: "Декор",
    title: "Оформлення залу",
    body: "Квіти, арки, світло, оформлення столів і фотозони.",
    href: "/catalog?cat=decor",
  },
];

export default function Featured() {
  return (
    <section className="noir-section" id="featured">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-8">
        <div className="flex flex-col gap-6 max-w-[640px]">
          <span className="noir-label">Приклади свят</span>
          <h2 className="noir-h2">
            Свята, які вже <span className="accent">провели</span>
          </h2>
          <p className="noir-lead">
            Приклади заходів: скільки було гостей, кого запрошували,
            як усе минуло.
          </p>
        </div>
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
              <span className="noir-num mt-2">Подивитись виконавців →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
