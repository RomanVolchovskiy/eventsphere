import Link from "next/link";

const STEPS = [
  {
    num: "I",
    title: "Бриф — двадцять хвилин розмови",
    body: "Куратор записує контекст: формат, гостей, бюджет, неможливе. Без шаблонних форм. Документ виходить за добу.",
    meta: [
      ["Тривалість", "20 хв"],
      ["Формат", "Дзвінок / офіс"],
      ["Куратор", "Призначається"],
    ],
  },
  {
    num: "II",
    title: "Команда під подію",
    body: "Smart Match складає ансамбль виконавців. Ви бачите альтернативи, ціни, портфоліо одним документом — без переписок.",
    meta: [
      ["Виконавців", "8–14"],
      ["Альтернативи", "3 / роль"],
      ["Згода", "У один клік"],
    ],
  },
  {
    num: "III",
    title: "Кошторис без зірочок",
    body: "Договір з кожним підрядником. Передоплата ескроу. Зміни — з прозорим перерахунком. Ви бачите остаточну цифру, не обіцянку.",
    meta: [
      ["Договори", "З виконавцем"],
      ["Платежі", "Ескроу"],
      ["Сюрпризи", "Виключені"],
    ],
  },
  {
    num: "IV",
    title: "День події — без вас",
    body: "Тайм-лайн з точністю до хвилини. Координатор на місці. Чат з командою. Ви на події, не на телефоні.",
    meta: [
      ["Координатор", "Включений"],
      ["Підтримка", "24 / 7"],
      ["Звіт", "Наступного дня"],
    ],
  },
];

export default function Constructor() {
  return (
    <section className="noir-section" id="constructor">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-8">
        <div className="flex flex-col gap-6 max-w-[640px]">
          <span className="noir-label">Розділ 02 — Процес</span>
          <h2 className="noir-h2">
            Чотири акти, які <span className="accent">знімають</span> з вас організацію
          </h2>
          <p className="noir-lead">
            Кожен етап має куратора, документи та строки. Ви не пишете
            повідомлень у п'ять чатів — пишете в один.
          </p>
        </div>
        <span className="noir-num">№ 02 / 07</span>
      </div>

      <div className="noir-steps">
        {STEPS.map((s) => (
          <article className="noir-step" key={s.num}>
            <div className="noir-step-num">{s.num}</div>
            <div className="noir-step-content">
              <h3 className="noir-step-title">{s.title}</h3>
              <p className="noir-step-body">{s.body}</p>
              <Link href="#" className="noir-num mt-2">
                Дізнатися більше →
              </Link>
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
