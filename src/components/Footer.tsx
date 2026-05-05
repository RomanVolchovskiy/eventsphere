import Link from "next/link";
import { Sparkles, Globe, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--dark-border)] bg-[var(--dark-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-white font-semibold text-lg">
                Event<span className="text-[var(--gold)]">Sphere</span>
              </span>
            </Link>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              Від ранкової кави до весілля мрії — все в одному додатку.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Клієнтам */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Клієнтам</h4>
            <ul className="space-y-2">
              {[
                { href: "/catalog", label: "Каталог послуг" },
                { href: "/daily", label: "Бронювання на сьогодні" },
                { href: "/planner", label: "AI-Планувальник" },
                { href: "/how-it-works", label: "Як це працює" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[var(--text-muted)] hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Бізнесу */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Бізнесу</h4>
            <ul className="space-y-2">
              {[
                { href: "/pro", label: "Pro-портфоліо" },
                { href: "/pro/crm", label: "CRM-система" },
                { href: "/pro/marketing", label: "Центр розвитку" },
                { href: "/pro/pricing", label: "Тарифи" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[var(--text-muted)] hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Компанія */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Компанія</h4>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "Про нас" },
                { href: "/blog", label: "Блог" },
                { href: "/contacts", label: "Контакти" },
                { href: "/privacy", label: "Конфіденційність" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[var(--text-muted)] hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--dark-border)] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-muted)] text-xs">
            © 2025 EventSphere. Всі права захищено.
          </p>
          <p className="text-[var(--text-muted)] text-xs">
            Безпечні платежі · Верифіковані виконавці · Гарантія якості
          </p>
        </div>
      </div>
    </footer>
  );
}
