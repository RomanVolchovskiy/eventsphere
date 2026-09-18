import Link from "next/link";

export default function Hero() {
  return (
    <section className="af-hero">
      <div className="af-spot" aria-hidden="true" />

      <div className="af-marquee">
        <span className="t">ЄСвято</span>
        <span className="af-bulbs" aria-hidden="true" />
        <span className="t sub">Сезон 2026 · Україна</span>
        <span className="af-bulbs" aria-hidden="true" />
        <span className="t sub">Вхід вільний</span>
      </div>

      <div className="af-hero-grid">
        <div className="af-hero-left">
          <span className="af-hero-stamp af-stamp">Прем&rsquo;єра</span>
          <span className="af-kicker">Виконавці для свят по всій Україні</span>

          <h1 className="af-display">
            <span>Свято,</span>
            <span className="l2">гідне</span>
            <span className="l3">афіші.</span>
          </h1>

          {/* Головне речення сторінки — те саме чесне позиціювання,
              що і в Noir: без вигаданих обсягів каталогу. */}
          <p className="af-pitch">
            Зал, кейтеринг, фото, ведучий, декор — зберіть команду для свята
            в одному місці.
          </p>

          <p className="af-lead">
            Опишіть захід за три кроки, і ми підберемо виконавців під ваш
            бюджет і кількість гостей. Бронювання прямо на сайті, без
            передоплати.
          </p>

          <div className="af-cta-row">
            <Link href="/smart-match" className="af-btn">
              <span>Підібрати команду</span>
              <span className="arr">→</span>
            </Link>
            <Link href="/catalog" className="af-btn-ghost">
              <span>Каталог виконавців</span>
              <span className="arr">↗</span>
            </Link>
          </div>
        </div>

        {/* Чесні факти замість вигаданої статистики — як квиткові корінці */}
        <div className="af-tickets">
          <div className="af-ticket">
            <div>
              <div className="val">
                0<span className="unit">грн</span>
              </div>
              <div className="cap">Передоплата за бронювання</div>
            </div>
            <span className="num2" aria-hidden="true" />
            <span className="no">Квиток № 001</span>
          </div>
          <div className="af-ticket">
            <div>
              <div className="val">5</div>
              <div className="cap">Напрямки — від залу до декору</div>
            </div>
            <span className="num2" aria-hidden="true" />
            <span className="no">Квиток № 002</span>
          </div>
          <div className="af-ticket">
            <div>
              <div className="val">
                1<span className="unit">хв</span>
              </div>
              <div className="cap">На підбір команди</div>
            </div>
            <span className="num2" aria-hidden="true" />
            <span className="no">Квиток № 003</span>
          </div>
        </div>
      </div>
    </section>
  );
}
