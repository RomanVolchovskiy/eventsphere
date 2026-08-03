import Link from "next/link";

export default function Hero() {
  return (
    <section className="noir-hero">
      <div className="noir-hero-grid">
        <div className="noir-hero-left">
          <span className="noir-label">Виконавці для свят по всій Україні</span>

          <h1 className="noir-display noir-initial">
            <span className="initial">Є</span>
            <span className="lines">
              <span>привід,</span>
              <span>настрій,</span>
              <span>Свято.</span>
            </span>
          </h1>

          {/* Головне речення сторінки: перше, що має пояснити, куди людина
              потрапила. Поетичний рядок вище лишається знаком бренду. */}
          <p className="noir-pitch">
            Зал, кейтеринг, фото, ведучий, декор — зберіть команду для свята
            в одному місці.
          </p>

          <p className="noir-lead">
            Опишіть захід за три кроки, і ми підберемо виконавців під ваш
            бюджет і кількість гостей. Бронювання прямо на сайті, без передоплати.
          </p>

          <div className="noir-cta-row">
            <Link href="/smart-match" className="btn-elegant">
              <span>Підібрати&nbsp;команду</span>
              <span className="arr">→</span>
            </Link>
            <Link href="/catalog" className="btn-elegant-ghost">
              <span>Переглянути&nbsp;каталог</span>
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
