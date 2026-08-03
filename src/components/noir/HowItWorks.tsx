import Link from "next/link";

const STEPS = [
  {
    num: "1",
    title: "Опишіть захід",
    body: "Тип свята, місто, кількість гостей і бюджет. Три кроки, приблизно хвилина.",
  },
  {
    num: "2",
    title: "Отримайте підбір",
    body: "Ми добираємо виконавця на кожну роль — зал, кейтеринг, фото, ведучого, декор — і показуємо, скільки з бюджету йде на кожну.",
  },
  {
    num: "3",
    title: "Забронюйте",
    body: "Пишете виконавцю прямо на сайті й бронюєте дату. Зараз — без передоплати.",
  },
];

export default function HowItWorks() {
  return (
    <section className="noir-section" id="how">
      <div className="flex flex-col gap-6 max-w-[640px] mb-8">
        <span className="noir-label">Як це працює</span>
        <h2 className="noir-h2">
          Від ідеї до броні — <span className="accent">три кроки</span>
        </h2>
      </div>

      <div className="noir-steps">
        {STEPS.map((s) => (
          <article className="noir-step" key={s.num}>
            <div className="noir-step-num">{s.num}</div>
            <div className="noir-step-content">
              <h3 className="noir-step-title">{s.title}</h3>
              <p className="noir-step-body">{s.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="noir-cta-row mt-10">
        <Link href="/smart-match" className="btn-elegant">
          <span>Почати&nbsp;підбір</span>
          <span className="arr">→</span>
        </Link>
        <Link href="/catalog" className="btn-elegant-ghost">
          <span>Спершу&nbsp;подивитись каталог</span>
          <span className="arr">↗</span>
        </Link>
      </div>
    </section>
  );
}
