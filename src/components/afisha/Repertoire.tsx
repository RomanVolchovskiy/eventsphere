const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

const EVENT_DAYS = new Set([6, 13, 14, 19, 20, 21, 26, 27]);
const FEATURED_DAY = 13;

const EVENTS = [
  {
    d: "06",
    mo: "Червня",
    title: "Корпоратив NUMA",
    sub: "Подвір'я Арсеналу · 1 200 гостей",
    tag: "Місць немає",
  },
  {
    d: "13",
    mo: "Червня",
    title: "Весілля у Кам'янці",
    sub: "Каньйон над Смотричем · 84 гостя",
    tag: "Готується",
  },
  {
    d: "20",
    mo: "Червня",
    title: "Літня резиденція DTEK",
    sub: "Стара ферма · приватний прийом",
    tag: "Закрита",
  },
  {
    d: "27",
    mo: "Червня",
    title: "Vinyl Night vol. 12",
    sub: "Closer · 320 гостей",
    tag: "Вхід вільний",
  },
];

export default function Repertoire() {
  return (
    <section className="af-section" id="planner">
      <div className="af-head">
        <span className="af-kicker">Планувальник · приклад</span>
        <h2 className="af-h2">
          Усі ваші свята — <span className="accent">в одному календарі</span>
        </h2>
        <p className="af-lead">
          Дати, місця, скільки гостей і що вже забронювали. Не треба тримати
          це в голові чи в нотатках.
        </p>
      </div>

      <div className="af-cal">
        <div className="af-cal-board">
          <div className="af-cal-head">
            <span className="mo">Червень</span>
            <span className="af-num" style={{ color: "var(--af-amber)" }}>
              2026
            </span>
          </div>
          <div className="af-cal-grid">
            {DAYS.map((d) => (
              <div key={`h-${d}`} className="af-cal-day dow">
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
                  className={`af-cal-day ${isEvent ? "has-event" : ""} ${
                    isFeatured ? "star" : ""
                  }`}
                >
                  {String(day).padStart(2, "0")}
                </div>
              );
            })}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`pad-${i}`} className="af-cal-day pad">
                ·
              </div>
            ))}
          </div>
          <div className="af-cal-note">
            <span className="af-num">Приклад вигляду</span>
            <span className="af-num">Ваші свята будуть тут</span>
          </div>
        </div>

        <div className="af-bill">
          {EVENTS.map((e) => (
            <div className="af-bill-row" key={e.d}>
              <div className="af-bill-date">
                <span className="d">{e.d}</span>
                <span className="m">{e.mo}</span>
              </div>
              <div>
                <div className="af-bill-title">{e.title}</div>
                <div className="af-bill-sub">{e.sub}</div>
              </div>
              <span className="af-bill-tag">{e.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
