import Link from "next/link";

function BrandMark({ size = 64 }: { size?: number }) {
  return (
    <span className="bm">
      <svg viewBox="0 0 40 44" width={size} height={(size * 44) / 40} aria-hidden>
        <defs>
          <linearGradient id="footGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0D080" />
            <stop offset="45%" stopColor="#C9A24C" />
            <stop offset="100%" stopColor="#8C6E2F" />
          </linearGradient>
        </defs>

        {/* Star above crown */}
        <path
          d="M20 1 L20.6 3 L22.5 3.6 L20.6 4.2 L20 6.2 L19.4 4.2 L17.5 3.6 L19.4 3 Z"
          fill="url(#footGold)"
        />

        {/* Crown */}
        <path
          d="M11 14 L12.5 8 L16 11.5 L20 6.5 L24 11.5 L27.5 8 L29 14 Z"
          fill="url(#footGold)"
        />
        <circle cx="12.5" cy="8" r="1.1" fill="url(#footGold)" />
        <circle cx="27.5" cy="8" r="1.1" fill="url(#footGold)" />

        {/* Letter Є */}
        <text
          x="20" y="30"
          textAnchor="middle"
          fontFamily="var(--font-fraunces), Fraunces, Georgia, serif"
          fontSize="22"
          fontStyle="italic"
          fontWeight="500"
          fill="url(#footGold)"
        >
          Є
        </text>

        {/* Ribbon flourish below */}
        <path
          d="M9 38 Q14 33 20 37 Q26 41 31 38 Q26 35 20 39 Q14 43 9 38 Z"
          fill="url(#footGold)"
          opacity="0.95"
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
          Плануєте <em>свято</em>?
        </h2>
        <div className="foot-cta-actions">
          <Link href="/smart-match" className="btn-elegant">
            <span>Підібрати команду</span>
            <span className="arr">→</span>
          </Link>
          <Link href="/pro" className="btn-elegant-ghost">
            <span>Я виконавець</span>
            <span className="arr">↗</span>
          </Link>
        </div>
      </div>

      <div className="foot-grid">
        <div className="foot-brand">
          <Link href="/" className="brand">
            <BrandMark />
            <span className="bn">
              <span className="bn-gold">Є</span>Свято
            </span>
          </Link>
          <p>
            Виконавці для свят в одному місці. Знайдіть, домовтесь і
            забронюйте — без десятка дзвінків.
          </p>
        </div>
        <div>
          <h5>Гостям</h5>
          <Link href="/smart-match">Підібрати команду</Link>
          <Link href="/catalog">Виконавці</Link>
          <Link href="/planner">Мої свята</Link>
          <Link href="/daily">На щодень</Link>
        </div>
        <div>
          <h5>Виконавцям</h5>
          <Link href="/register">Додати себе в каталог</Link>
          <Link href="/pro">Тарифи</Link>
        </div>
        <div>
          <h5>Зв&apos;язок</h5>
          <a href="mailto:hello@eventsphere.ua">hello@eventsphere.ua</a>
          <a href="tel:+380440000000">+38 044 000 0000</a>
          <a href="#">@eventsphere.ua</a>
        </div>
      </div>

      <div className="foot-base">
        <span className="mono">© 2026 ЄСвято · Зроблено в Україні</span>
      </div>
    </footer>
  );
}
