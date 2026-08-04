import Link from "next/link";

// Відповідає тарифам на сторінці /pro — там Standard безкоштовний,
// PRO 990 ₴/міс, MAX 2 490 ₴/міс.
const FEATURES = [
  {
    ico: "I",
    label: "Профіль у каталозі",
    desc: "Фото робіт, ціни, опис послуг. Клієнти знаходять вас через пошук і підбір.",
  },
  {
    ico: "II",
    label: "Запити напряму",
    desc: "Клієнт пише вам на сайті. Без посередників і комісії з боку платформи.",
  },
  {
    ico: "III",
    label: "Вище в пошуку",
    desc: "Платні тарифи піднімають ваш профіль у видачі та в підборі команди.",
  },
  {
    ico: "IV",
    label: "Відгуки та рейтинг",
    desc: "Оцінки від справжніх клієнтів, які бачать усі. Хороша робота — більше замовлень.",
  },
  {
    ico: "V",
    label: "Договори й рахунки",
    desc: "Готові шаблони договорів, рахунки в PDF одним натисканням.",
  },
  {
    ico: "VI",
    label: "Статистика",
    desc: "Скільки людей подивилось профіль, скільки написало, скільки заробили.",
  },
];

export default function Pro() {
  return (
    <section className="noir-section" id="pro">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-8">
        <div className="flex flex-col gap-6 max-w-[640px]">
          <span className="noir-label">Для виконавців</span>
          <h2 className="noir-h2">
            Ви виконавець? <span className="accent">Отримуйте замовлення</span>
          </h2>
          <p className="noir-lead">
            Розмістіть себе в каталозі — безкоштовно. Платні тарифи піднімають
            вище в пошуку й додають інструменти для роботи з клієнтами.
          </p>
        </div>
      </div>

      <div className="noir-pro">
        <div className="noir-pro-side">
          <div className="noir-pro-features">
            {FEATURES.map((f) => (
              <div className="noir-pro-feature" key={f.ico}>
                <span className="ico">{f.ico}</span>
                <div>
                  <div className="label">{f.label}</div>
                  <div className="desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="noir-pro-card">
          <span className="noir-label">Скільки коштує</span>

          <div>
            <div className="noir-pro-price">0&nbsp;₴</div>
            <div className="noir-pro-price" style={{ marginTop: 8 }}>
              <span className="per">
                щоб почати — профіль і запити від клієнтів безкоштовні
              </span>
            </div>
          </div>

          <hr className="noir-rule" />

          <div className="flex flex-col gap-3">
            <div className="noir-match-row" style={{ borderBottomColor: "var(--line)" }}>
              <span className="k">Standard</span>
              <span className="v accent">Безкоштовно</span>
            </div>
            <div className="noir-match-row" style={{ borderBottomColor: "var(--line)" }}>
              <span className="k">PRO — вище в пошуку</span>
              <span className="v">990 ₴ / міс</span>
            </div>
            <div className="noir-match-row" style={{ borderBottomColor: "var(--line)" }}>
              <span className="k">MAX — максимум замовлень</span>
              <span className="v">2 490 ₴ / міс</span>
            </div>
            <div className="noir-match-row" style={{ border: 0 }}>
              <span className="k">Скасувати</span>
              <span className="v">Будь-коли</span>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href="/register" className="btn-elegant">
              <span>Додати&nbsp;себе в каталог</span>
              <span className="arr">→</span>
            </Link>
            <Link href="/pro" className="btn-elegant-ghost">
              <span>Порівняти&nbsp;тарифи</span>
              <span className="arr">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
