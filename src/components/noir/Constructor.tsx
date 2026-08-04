
const STEPS = [
  {
    num: "1",
    title: "Розкажіть про свято",
    body: "Яке свято, у якому місті, скільки гостей і скільки готові витратити. Це три коротких кроки на сайті.",
    meta: [
      ["Скільки часу", "1 хвилина"],
      ["Де", "На сайті"],
      ["Дзвінки", "Не потрібні"],
    ],
  },
  {
    num: "2",
    title: "Дивитесь, кого пропонуємо",
    body: "На кожну роль — зал, кейтеринг, фото, ведучий, декор — свій виконавець. З цінами, прикладами робіт і поясненням, чому саме він.",
    meta: [
      ["Ролей", "До 5"],
      ["Ціни", "Одразу видно"],
      ["Заміна", "У будь-який момент"],
    ],
  },
  {
    num: "3",
    title: "Пишете й домовляєтесь",
    body: "Чат із виконавцем прямо на сайті. Питаєте про вільні дати, деталі та ціну — не шукаючи телефони по інстаграмах.",
    meta: [
      ["Листування", "В одному місці"],
      ["Посередники", "Немає"],
      ["Комісія з вас", "0 ₴"],
    ],
  },
  {
    num: "4",
    title: "Бронюєте дату",
    body: "Підтверджуєте бронювання, і воно зберігається у вашому планувальнику разом з іншими. Зараз — без передоплати.",
    meta: [
      ["Передоплата", "Не потрібна"],
      ["Де зберігається", "У планувальнику"],
      ["Скасування", "Безкоштовно"],
    ],
  },
];

export default function Constructor() {
  return (
    <section className="noir-section" id="constructor">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-8">
        <div className="flex flex-col gap-6 max-w-[640px]">
          <span className="noir-label">Що ми беремо на себе</span>
          <h2 className="noir-h2">
            Ви святкуєте — <span className="accent">ми організовуємо</span>
          </h2>
          <p className="noir-lead">
            Домовлятися з кожним виконавцем окремо не треба. Усе листування —
            в одному місці, на сайті.
          </p>
        </div>
      </div>

      <div className="noir-steps">
        {STEPS.map((s) => (
          <article className="noir-step" key={s.num}>
            <div className="noir-step-num">{s.num}</div>
            <div className="noir-step-content">
              <h3 className="noir-step-title">{s.title}</h3>
              <p className="noir-step-body">{s.body}</p>
            </div>
            <div className="noir-step-meta">
              {s.meta.map(([k, v]) => (
                <div className="noir-step-meta-row" key={k}>
                  <span className="k">{k}</span>
                  <span className="v">{v}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
