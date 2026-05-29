import Link from "next/link";

export default function Hero() {
  return (
    <section className="noir-hero">
      <div className="noir-hero-grid">
        <div className="noir-hero-left">
          <span className="noir-label">Edition №&nbsp;04 — Noir · 2026</span>

          <h1 className="noir-display noir-initial">
            <span className="initial">Є</span>
            <span className="lines">
              <span>привід,</span>
              <span>настрій,</span>
              <span>Свято.</span>
            </span>
          </h1>

          <p className="noir-lead">
            ЄСвято — це редакція святкування. Ми збираємо найкращих
            виконавців України, програмуємо логістику до хвилини й
            залишаємо вам тільки одне — присутність у моменті.
          </p>

          <div className="noir-cta-row">
            <Link href="#constructor" className="btn-elegant">
              <span>Скласти&nbsp;подію</span>
              <span className="arr">→</span>
            </Link>
            <Link href="/smart-match" className="btn-elegant-ghost">
              <span>Підібрати&nbsp;команду</span>
              <span className="arr">↗</span>
            </Link>
          </div>
        </div>

        <div className="noir-hero-right">
          <div className="noir-stat">
            <span className="noir-stat-value">
              2&nbsp;400<span className="unit">+</span>
            </span>
            <span className="noir-stat-label">Перевірених виконавців</span>
          </div>
          <div className="noir-stat">
            <span className="noir-stat-value">
              18<span className="unit">K</span>
            </span>
            <span className="noir-stat-label">Заходів на рік</span>
          </div>
          <div className="noir-stat">
            <span className="noir-stat-value">
              4.9<span className="unit">★</span>
            </span>
            <span className="noir-stat-label">Середня оцінка клієнтів</span>
          </div>
          <div className="noir-stat">
            <span className="noir-stat-value">22</span>
            <span className="noir-stat-label">Міста України</span>
          </div>
        </div>
      </div>
    </section>
  );
}
