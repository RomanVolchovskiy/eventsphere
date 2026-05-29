const ROWS = [
  {
    idx: "01",
    date: "30 / V",
    title: "Open Studio: ательє Atelier Flores",
    place: "Поділ · Київ",
    price: "Free",
    tag: "Open",
  },
  {
    idx: "02",
    date: "31 / V",
    title: "Сніданок у Saint Bread з шеф-кондитером",
    place: "Saksahanskoho 24 · Київ",
    price: "650 ₴",
    tag: "Brunch",
  },
  {
    idx: "03",
    date: "02 / VI",
    title: "Лекція: «Сценографія без декорацій»",
    place: "PinchukArtCentre",
    price: "Free",
    tag: "Talk",
  },
  {
    idx: "04",
    date: "05 / VI",
    title: "Vinyl evening: Trio Mariychuk + special guest",
    place: "Closer · Хорива 50",
    price: "400 ₴",
    tag: "Live",
  },
  {
    idx: "05",
    date: "08 / VI",
    title: "Майстерня каліграфії запрошень",
    place: "House of Letters · Львів",
    price: "1 200 ₴",
    tag: "Workshop",
  },
  {
    idx: "06",
    date: "11 / VI",
    title: "Дегустація натуральних вин з винарем",
    place: "Bochka · Одеса",
    price: "850 ₴",
    tag: "Tasting",
  },
  {
    idx: "07",
    date: "14 / VI",
    title: "Pop-up dinner із шеф Romanchenko",
    place: "Закрита локація · Київ",
    price: "2 400 ₴",
    tag: "Pop-up",
  },
];

export default function Index() {
  return (
    <section className="noir-section" id="daily">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-8">
        <div className="flex flex-col gap-6 max-w-[640px]">
          <span className="noir-label">Розділ 05 — Daily Index</span>
          <h2 className="noir-h2">
            Що відбувається <span className="accent">сьогодні</span> у місті
          </h2>
          <p className="noir-lead">
            Куратори ЄСвято ведуть щоденну колонку — відкриті події,
            відкриття, дегустації, поп-ап вечері. Без афіш і шуму.
          </p>
        </div>
        <span className="noir-num">№ 05 / 07</span>
      </div>

      <div className="noir-index">
        <div className="noir-index-head">
          <span>№</span>
          <span>Дата</span>
          <span>Подія</span>
          <span className="h-place">Місце</span>
          <span style={{ textAlign: "right" }}>Вхід</span>
          <span className="h-tag" style={{ textAlign: "right" }}>Формат</span>
        </div>
        {ROWS.map((r) => (
          <div className="noir-index-row" key={r.idx}>
            <span className="idx">{r.idx}</span>
            <span className="date">{r.date}</span>
            <span className="title">{r.title}</span>
            <span className="place">{r.place}</span>
            <span className="price">{r.price}</span>
            <span className="tag">{r.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
