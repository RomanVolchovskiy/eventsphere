import SectionLabel from "./SectionLabel";

const STORIES = [
  {
    kicker: "ATLAS №01",
    title: "Карпатські маєтки нової хвилі",
    meta: "Локації · 6 хв",
    body: "Дослідження приватних резиденцій між Косовом і Мікуличиним, що приймають заходи з 2024 року.",
  },
  {
    kicker: "RITUAL №14",
    title: "Як AI читає українські весілля",
    meta: "Smart Match · 4 хв",
    body: "Тренувальний датасет з 2 400 заходів — і чому модель раптом полюбила полонини.",
  },
  {
    kicker: "ECONOMY",
    title: "Виконавці заробляють на 38% більше",
    meta: "Pro · 5 хв",
    body: "Що сталося, коли ми відкрили CRM з прозорим календарем і миттєвими виплатами.",
  },
];

export default function Editorial() {
  return (
    <section className="ed-sec">
      <SectionLabel n="06">Редакція</SectionLabel>
      <div className="ed-head">
        <h2 className="display med italic">Редакційна колонка</h2>
        <p className="lead narrow">Історії та інсайти про те, як українці святкують у 2026.</p>
      </div>
      <div className="ed-grid">
        {STORIES.map((s, i) => (
          <article key={i} className="ed-card">
            <div className="ed-img">
              <div className="ed-pl mono">[ редакційне фото · {s.kicker.toLowerCase()} ]</div>
            </div>
            <div className="ed-meta mono">
              {s.kicker} · {s.meta}
            </div>
            <h3 className="ed-title">{s.title}</h3>
            <p className="ed-body">{s.body}</p>
            <a className="ed-link" href="#">
              читати <span>↗</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
