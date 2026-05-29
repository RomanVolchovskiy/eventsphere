const DAYS = [
  "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд",
];

const EVENT_DAYS = new Set([6, 13, 14, 19, 20, 21, 26, 27]);
const FEATURED_DAY = 13;

const EVENTS = [
  {
    d: "06",
    mo: "Червня",
    title: "Корпоратив NUMA",
    sub: "Подвір'я Арсеналу · 1 200 гостей",
    tag: "Sold-out",
  },
  {
    d: "13",
    mo: "Червня",
    title: "Весілля у Кам'янці",
    sub: "Каньйон над Смотричем · 84 гостя",
    tag: "Featured",
  },
  {
    d: "20",
    mo: "Червня",
    title: "Літня резиденція DTEK",
    sub: "Стара ферма · приватний прийом",
    tag: "Private",
  },
  {
    d: "27",
    mo: "Червня",
    title: "Vinyl Night vol. 12",
    sub: "Closer · 320 гостей",
    tag: "Open",
  },
];

export default function Calendar() {
  return (
    <section className="noir-section" id="planner">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-8">
        <div className="flex flex-col gap-6 max-w-[640px]">
          <span className="noir-label">Розділ 03 — Планер</span>
          <h2 className="noir-h2">
            Червень 2026 — <span className="accent">чотири суботи</span>, які варто запам'ятати
          </h2>
          <p className="noir-lead">
            Жива карта подій редакції. Дати, місця, статуси, кількість
            гостей — без перевідкривання дюжини вкладок.
          </p>
        </div>
        <span className="noir-num">№ 03 / 07</span>
      </div>

      <div className="noir-calendar">
        <div className="noir-cal-left">
          <div className="flex items-baseline justify-between">
            <span className="noir-h2" style={{ fontSize: 56 }}>VI</span>
            <span className="noir-num">2026</span>
          </div>
          <div className="noir-cal-grid">
            {DAYS.map((d) => (
              <div
                key={`h-${d}`}
                className="noir-cal-day"
                style={{ aspectRatio: "auto", padding: "10px 8px", justifyContent: "center", color: "var(--ash)", fontSize: 10, letterSpacing: "0.18em" }}
              >
                {d.toUpperCase()}
              </div>
            ))}
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const isEvent = EVENT_DAYS.has(day);
              const isFeatured = day === FEATURED_DAY;
              return (
                <div
                  key={`d-${day}`}
                  className={`noir-cal-day ${isEvent ? "has-event" : ""} ${
                    isFeatured ? "today" : ""
                  }`}
                >
                  {String(day).padStart(2, "0")}
                </div>
              );
            })}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`pad-${i}`}
                className="noir-cal-day"
                style={{ color: "var(--line)" }}
              />
            ))}
          </div>
          <div className="noir-meta mt-4">
            <span>4 події</span>
            <span>2 304 гостя</span>
            <span>16 виконавців</span>
          </div>
        </div>

        <div className="noir-events">
          {EVENTS.map((e) => (
            <div className="noir-event-row" key={e.d}>
              <div className="noir-event-date">
                {e.d}
                <span className="mo">{e.mo}</span>
              </div>
              <div className="noir-event-meta">
                <span className="noir-event-title">{e.title}</span>
                <span className="noir-event-sub">{e.sub}</span>
              </div>
              <span className="noir-event-tag">{e.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
