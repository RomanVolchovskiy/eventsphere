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
              <span>Подивитись&nbsp;виконавців</span>
              <span className="arr">↗</span>
            </Link>
          </div>
        </div>

        {/* Тут раніше стояли вигадані цифри (2 400 виконавців, 18K заходів,
            22 міста) — вони розсипались одразу, щойно людина відкривала каталог.
            Замінено на твердження, які правдиві незалежно від розміру каталогу
            і які можна перевірити в коді: вільний режим бронювання, чат
            (/api/conversations), 5 значень EventCategory. */}
        <div className="noir-hero-right">
          <div className="noir-stat">
            <span className="noir-stat-value">
              0<span className="unit">&nbsp;₴</span>
            </span>
            <span className="noir-stat-label">Передоплата за бронювання</span>
          </div>
          <div className="noir-stat">
            <span className="noir-stat-value">5</span>
            <span className="noir-stat-label">
              Напрямки — від залу до декору
            </span>
          </div>
          <div className="noir-stat">
            <span className="noir-stat-value">
              1<span className="unit">&nbsp;хв</span>
            </span>
            <span className="noir-stat-label">На підбір команди</span>
          </div>
        </div>
      </div>
    </section>
  );
}
