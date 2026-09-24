import type { ReactNode } from "react";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";

export type LegalSection = { title: string; body: ReactNode };

/** Спільний макет для /terms і /privacy. */
export default function LegalDocument({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="pt-16 min-h-screen">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-[var(--text-muted)] text-xs mb-2">
          Редакція від {LEGAL.effectiveDate}
        </p>
        <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>
        <div className="text-[var(--text-muted)] text-sm leading-relaxed mb-10">{intro}</div>

        <ol className="space-y-8">
          {sections.map((s, i) => (
            <li key={s.title}>
              <h2 className="text-white font-semibold mb-3">
                {i + 1}. {s.title}
              </h2>
              <div className="text-[var(--text-muted)] text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-[var(--gold)] [&_a:hover]:underline">
                {s.body}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 pt-6 border-t border-[var(--dark-border)] text-sm flex flex-wrap gap-4">
          <Link href="/terms" className="text-[var(--gold)] hover:underline">Угода користувача</Link>
          <Link href="/privacy" className="text-[var(--gold)] hover:underline">Політика конфіденційності</Link>
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-[var(--gold)] hover:underline">
            {LEGAL.contactEmail}
          </a>
        </div>
      </article>
    </div>
  );
}
