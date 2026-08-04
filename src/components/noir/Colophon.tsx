import Link from "next/link";

const CREDITS = [
  ["Редакція", "ЄСвято Editorial · Київ"],
  ["Працюємо з", "2026 року"],
  ["Куратори", "9 спеціалістів"],
  ["Виконавці", "2 414 у мережі"],
  ["Міста", "22 у фокусі"],
  ["Партнери", "За запитом"],
];

export default function Colophon() {
  return (
    <section className="noir-section" id="colophon">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-8">
        <div className="flex flex-col gap-6 max-w-[720px]">
          <span className="noir-label">Про ЄСвято</span>
          <h2 className="noir-h2">
            Свято без<br />
            <span className="accent">зайвого клопоту</span>
          </h2>
          <p className="noir-lead">
            ЄСвято збирає перевірених виконавців в одному місці, щоб вам
            не довелось шукати їх по знайомих і телефонувати кожному окремо.
          </p>
        </div>
      </div>

      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          background: "var(--line)",
          border: "1px solid var(--line)",
          marginTop: 56,
        }}
      >
        {CREDITS.map(([k, v]) => (
          <div
            key={k}
            style={{
              background: "var(--bg-0)",
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span className="noir-num">{k}</span>
            <span
              className="noir-h2"
              style={{ fontSize: 26, lineHeight: 1.15 }}
              dangerouslySetInnerHTML={{ __html: v }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-12 flex-wrap gap-6">
        <span className="noir-num">© 2026 — ЄСвято</span>
        <Link href="/smart-match" className="btn-elegant">
          <span>Підібрати команду</span>
          <span className="arr">→</span>
        </Link>
      </div>
    </section>
  );
}
