import Link from "next/link";

const POSTERS = [
  {
    num: "01",
    tag: "Весілля",
    title: "Весілля у Кам'янці",
    body: "Три дні у каньйоні над Смотричем. 84 гостя, 12 виконавців.",
    feature: true,
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

export default function PosterWall() {
  return (
    <section className="af-section" id="featured">
      <div className="af-head">
        <span className="af-kicker">Приклади свят</span>
        <h2 className="af-h2">
          Стіна афіш: свята, які вже <span className="accent">провели</span>
        </h2>
        <p className="af-lead">
          Приклади заходів: скільки було гостей, кого запрошували, як усе
          минуло.
        </p>
      </div>

      <div className="af-wall">
        {POSTERS.map((p) => (
          <Link
            href={p.href}
            key={p.num}
            className={`af-poster ${p.feature ? "feature" : ""}`}
          >
            <div className="af-poster-top">
              <span className="af-poster-num">№ {p.num}</span>
              <span className="af-poster-tag">{p.tag}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h3 className="af-poster-title">{p.title}</h3>
              <p className="af-poster-body">{p.body}</p>
              <span className="af-poster-link">Подивитись виконавців →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
