import Link from "next/link";

function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <span className="bm">
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <defs>
          <linearGradient id="footbmg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFC857" />
            <stop offset="1" stopColor="#FF3D80" />
          </linearGradient>
        </defs>
        <path
          d="M16 2 L20 12 L30 13 L22 20 L25 30 L16 24 L7 30 L10 20 L2 13 L12 12 Z"
          fill="url(#footbmg)"
        />
      </svg>
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-cta">
        <h2>
          Готовий <em>увімкнути</em> своє свято?
        </h2>
        <div className="foot-cta-actions">
          <Link href="/register" className="btn-pop">
            <span className="bp-spark">✨</span>
            <span>Створити акаунт</span>
            <span className="bp-arrow">→</span>
          </Link>
          <Link href="/pro" className="btn-line">
            Я виконавець
          </Link>
        </div>
      </div>

      <div className="foot-grid">
        <div className="foot-brand">
          <Link href="/" className="brand">
            <BrandMark />
            <span className="bn">EventSphere</span>
          </Link>
          <p>Твій всесвіт свят. Один додаток, уся Україна.</p>
        </div>
        <div>
          <h5>Клієнтам</h5>
          <Link href="/catalog">Каталог</Link>
          <Link href="/daily">Щодня</Link>
          <Link href="/planner">Планувальник</Link>
          <Link href="/smart-match">Smart Match</Link>
        </div>
        <div>
          <h5>Бізнесу</h5>
          <Link href="/pro">Pro-портфоліо</Link>
          <Link href="/pro">CRM</Link>
          <Link href="/pro">Тарифи</Link>
        </div>
        <div>
          <h5>Контакт</h5>
          <a href="mailto:hello@eventsphere.ua">hello@eventsphere.ua</a>
          <a href="tel:+380440000000">+38 044 000 0000</a>
          <a href="#">@eventsphere.ua</a>
        </div>
      </div>

      <div className="foot-base">
        <span className="mono">© 2026 EventSphere · made in Україна</span>
        <span className="mono dim">v.8.0 — carnival edition</span>
      </div>
    </footer>
  );
}
