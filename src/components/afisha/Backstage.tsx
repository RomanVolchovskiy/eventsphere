import Link from "next/link";

// Відповідає тарифам на сторінці /pro — Standard безкоштовний,
// PRO 990 ₴/міс, MAX 2 490 ₴/міс.
const FEATURES = [
  {
    rn: "I",
    label: "Профіль у каталозі",
    desc: "Фото робіт, ціни, опис послуг. Клієнти знаходять вас через пошук і підбір.",
  },
  {
    rn: "II",
    label: "Запити напряму",
    desc: "Клієнт пише вам на сайті. Без посередників і комісії з боку платформи.",
  },
  {
    rn: "III",
    label: "Вище в пошуку",
    desc: "Платні тарифи піднімають ваш профіль у видачі та в підборі команди.",
  },
  {
    rn: "IV",
    label: "Відгуки та рейтинг",
    desc: "Оцінки від справжніх клієнтів, які бачать усі. Хороша робота — більше замовлень.",
  },
  {
    rn: "V",
    label: "Договори й рахунки",
    desc: "Готові шаблони договорів, рахунки в PDF одним натисканням.",
  },
  {
    rn: "VI",
    label: "Статистика",
    desc: "Скільки людей подивилось профіль, скільки написало, скільки заробили.",
  },
];

export default function Backstage() {
  return (
    <section className="af-section" id="pro">
      <div className="af-head">
        <span className="af-kicker">Для виконавців</span>
        <h2 className="af-h2">
          Ви виконавець? <span className="accent">Сцена — ваша</span>
        </h2>
        <p className="af-lead">
          Розмістіть себе в каталозі — безкоштовно. Платні тарифи піднімають
          вище в пошуку й додають інструменти для роботи з клієнтами.
        </p>
      </div>

      <div className="af-pro">
        <div className="af-pro-list">
          {FEATURES.map((f) => (
            <div className="af-pro-item" key={f.rn}>
              <span className="rn">{f.rn}</span>
              <div>
                <div className="lbl">{f.label}</div>
                <div className="dsc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="af-kasa">
          <span className="win">Каса · скільки коштує</span>

          <div>
            <div className="af-kasa-price">
              0&nbsp;₴
              <span className="per">
                щоб почати — профіль і запити від клієнтів безкоштовні
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="af-match-row">
              <span className="k">Standard</span>
              <span className="v hot">Безкоштовно</span>
            </div>
            <div className="af-match-row">
              <span className="k">PRO — вище в пошуку</span>
              <span className="v">990 ₴ / міс</span>
            </div>
            <div className="af-match-row">
              <span className="k">MAX — максимум замовлень</span>
              <span className="v">2 490 ₴ / міс</span>
            </div>
            <div className="af-match-row" style={{ borderBottom: 0 }}>
              <span className="k">Скасувати</span>
              <span className="v">Будь-коли</span>
            </div>
          </div>

          <div className="af-cta-row">
            <Link href="/register" className="af-btn">
              <span>Додати себе в каталог</span>
              <span className="arr">→</span>
            </Link>
            <Link href="/pro" className="af-btn-ghost">
              <span>Порівняти тарифи</span>
              <span className="arr">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
