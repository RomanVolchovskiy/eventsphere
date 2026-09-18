import Link from "next/link";

const ACTS = [
  {
    roman: "I",
    title: "Опишіть захід",
    body: "Тип свята, місто, кількість гостей і бюджет. Три кроки, приблизно хвилина.",
  },
  {
    roman: "II",
    title: "Отримайте підбір",
    body: "Ми добираємо виконавця на кожну роль — зал, кейтеринг, фото, ведучого, декор — і показуємо, скільки з бюджету йде на кожну.",
  },
  {
    roman: "III",
    title: "Забронюйте",
    body: "Пишете виконавцю прямо на сайті й бронюєте дату. Зараз — без передоплати.",
  },
];

export default function Acts() {
  return (
    <section className="af-section" id="how">
      <div className="af-head">
        <span className="af-kicker">Як це працює</span>
        <h2 className="af-h2">
          Від ідеї до броні — <span className="accent">три акти</span>
        </h2>
      </div>

      <div className="af-acts">
        {ACTS.map((a) => (
          <article className="af-act" key={a.roman}>
            <span className="act-label">Акт {a.roman}</span>
            <span className="roman">{a.roman}</span>
            <h3>{a.title}</h3>
            <p>{a.body}</p>
          </article>
        ))}
      </div>

      <div className="af-cta-row" style={{ marginTop: 48 }}>
        <Link href="/smart-match" className="af-btn">
          <span>Почати підбір</span>
          <span className="arr">→</span>
        </Link>
        <Link href="/catalog" className="af-btn-ghost">
          <span>Подивитись виконавців</span>
          <span className="arr">↗</span>
        </Link>
      </div>
    </section>
  );
}
