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

export default function Kasa() {
  return (
    <section className="af-section" id="smart-match">
      <div className="af-head">
        <span className="af-kicker">Підбір команди</span>
        <h2 className="af-h2">
          Команда для свята <span className="accent">за хвилину</span>
        </h2>
        <p className="af-lead">
          Скажіть, яке свято, у якому місті, скільки гостей і скільки грошей.
          Ми покажемо, кого взяти на кожну роль і скільки це коштуватиме.
        </p>
      </div>

      <div className="af-match">
        <div className="af-match-paper">
          <div className="hd">
            <span className="t">Що ви вказуєте · приклад</span>
            <span className="code">A.01</span>
          </div>
          {BRIEF.map(([k, v]) => (
            <div className="af-match-row" key={k}>
              <span className="k">{k}</span>
              <span className="v">{v}</span>
            </div>
          ))}
          <Link href="/smart-match" className="af-btn">
            <span>Розповісти про свято</span>
            <span className="arr">→</span>
          </Link>
        </div>

        <div className="af-match-dark">
          <div className="hd">
            <span className="t">Кого пропонуємо</span>
            <span className="code">B.01</span>
          </div>
          <div className="af-score">
            <span className="big">98</span>
            <span className="of">
              зі 100 — наскільки виконавець підходить під ваш запит
            </span>
          </div>
          {RESULT.map(([k, v]) => (
            <div className="af-match-row" key={k}>
              <span className="k">{k}</span>
              <span className="v hot">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
