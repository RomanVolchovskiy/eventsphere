import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-4 md:px-9 pt-20 pb-7 border-t border-[var(--line)] mt-16">
      <div className="flex flex-wrap justify-between items-center gap-8 pb-14 mb-14 border-b border-[var(--line)]">
        <h2
          className="m-0 max-w-[16ch]"
          style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(40px, 5.5vw, 86px)",
            fontWeight: 400,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          Готовий <em>увімкнути</em> своє свято?
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="btn-pop">
            <span>✨</span><span>Створити акаунт</span><span>→</span>
          </Link>
          <Link href="/pro" className="btn-line">Я виконавець</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 pb-8 border-b border-[var(--line)]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <svg viewBox="0 0 32 32" width="22" height="22">
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
            <span style={{ fontFamily: "var(--display)", fontSize: 22 }}>EventSphere</span>
          </Link>
          <p className="text-[var(--muted)] text-sm mt-4 max-w-[320px]">
            Твій всесвіт свят. Один додаток, уся Україна.
          </p>
        </div>

        <div>
          <h5 className="text-[var(--gold)] mb-3.5" style={{ fontFamily: "var(--display)", fontSize: 18 }}>Клієнтам</h5>
          <Link href="/catalog" className="block py-1 text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors">Каталог</Link>
          <Link href="/daily" className="block py-1 text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors">Щодня</Link>
          <Link href="/planner" className="block py-1 text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors">Планувальник</Link>
          <Link href="/smart-match" className="block py-1 text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors">Smart Match</Link>
        </div>

        <div>
          <h5 className="text-[var(--gold)] mb-3.5" style={{ fontFamily: "var(--display)", fontSize: 18 }}>Бізнесу</h5>
          <Link href="/pro" className="block py-1 text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors">Pro-портфоліо</Link>
          <Link href="/pro" className="block py-1 text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors">CRM</Link>
          <Link href="/pro" className="block py-1 text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors">Тарифи</Link>
        </div>

        <div>
          <h5 className="text-[var(--gold)] mb-3.5" style={{ fontFamily: "var(--display)", fontSize: 18 }}>Контакт</h5>
          <a href="mailto:hello@eventsphere.ua" className="block py-1 text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors">hello@eventsphere.ua</a>
          <a href="tel:+380440000000" className="block py-1 text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors">+38 044 000 0000</a>
          <a href="#" className="block py-1 text-[var(--muted)] hover:text-[var(--ink)] text-sm transition-colors">@eventsphere.ua</a>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-4 pt-6">
        <span className="mono">© 2026 EventSphere · made in Україна</span>
        <span className="mono dim">v.8.0 — carnival edition</span>
      </div>
    </footer>
  );
}
