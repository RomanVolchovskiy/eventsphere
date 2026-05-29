import Link from "next/link";

const BRIEF = [
  ["Подія", "Весілля"],
  ["Гості", "80–100"],
  ["Місто", "Київ"],
  ["Бюджет", "$28 000"],
  ["Дата", "13 / VI / 2026"],
];

const RESULT = [
  ["Фотограф", "Roman O."],
  ["Шеф", "Studio MUSA"],
  ["DJ + Live", "Quartet NIKA"],
  ["Декор", "Atelier Flores"],
  ["Координація", "ЄСвято"],
];

export default function Match() {
  return (
    <section className="noir-section" id="smart-match">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-8">
        <div className="flex flex-col gap-6 max-w-[640px]">
          <span className="noir-label">Розділ 04 — Smart Match</span>
          <h2 className="noir-h2">
            Команда за <span className="accent">сімдесят дві</span> секунди
          </h2>
          <p className="noir-lead">
            Алгоритм перетинає 2 400 виконавців з вашим брифом і повертає
            ансамбль. Куратор перевіряє кожну рекомендацію вручну.
          </p>
        </div>
        <span className="noir-num">№ 04 / 07</span>
      </div>

      <div className="noir-match-frame">
        <div className="noir-match-panel">
          <div className="flex items-center justify-between">
            <span className="noir-label">Бриф клієнта</span>
            <span className="noir-num">A.01</span>
          </div>
          {BRIEF.map(([k, v]) => (
            <div className="noir-match-row" key={k}>
              <span className="k">{k}</span>
              <span className="v">{v}</span>
            </div>
          ))}
          <Link href="/smart-match" className="btn-elegant-ghost mt-2">
            <span>Заповнити свій бриф</span>
            <span className="arr">→</span>
          </Link>
        </div>

        <div className="noir-match-panel dark">
          <div className="flex items-center justify-between">
            <span className="noir-label">Ансамбль · підбір редакції</span>
            <span className="noir-num">B.01</span>
          </div>
          <div className="noir-match-card">
            <span className="noir-num">Match score</span>
            <span className="noir-match-score">98</span>
            <span className="noir-num">з 100 — вище мінімального порогу 84</span>
          </div>
          {RESULT.map(([k, v]) => (
            <div className="noir-match-row" key={k}>
              <span className="k">{k}</span>
              <span className="v accent">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
