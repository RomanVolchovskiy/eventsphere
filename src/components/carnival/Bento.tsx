import Link from "next/link";
import { SectionHead } from "./Festive";

const BENTO = [
  { key: "venue",  label: "Локації",       sub: "240+ просторів",  tone: "magenta", emoji: "🏛", size: "lg" },
  { key: "show",   label: "Шоу",            sub: "180+ артистів",   tone: "gold",    emoji: "🎭", size: "md" },
  { key: "food",   label: "Кейтеринг",      sub: "95+ кухонь",      tone: "mint",    emoji: "🍽", size: "md" },
  { key: "photo",  label: "Фото & відео",   sub: "320+ авторів",    tone: "violet",  emoji: "📷", size: "lg" },
  { key: "decor",  label: "Декор",          sub: "150+ студій",     tone: "cherry",  emoji: "🌸", size: "md" },
  { key: "host",   label: "Ведучі",         sub: "140+ голосів",    tone: "peach",   emoji: "🎤", size: "sm" },
  { key: "sweet",  label: "Кондитерські",   sub: "80+ майстрів",    tone: "pink",    emoji: "🍰", size: "sm" },
  { key: "music",  label: "DJ & гурти",     sub: "210+ виступів",   tone: "blue",    emoji: "🎶", size: "md" },
];

export default function Bento() {
  return (
    <section className="bento-sec" id="bento">
      <SectionHead
        n="02"
        kicker="Усі ритуали"
        title={
          <>
            Обери свій <em>напрямок радості</em>
          </>
        }
        sub="Кожна категорія — окремий світ виконавців, перевірений вручну. Натисни — і провалишся всередину."
      />
      <div className="bento-grid">
        {BENTO.map((b, i) => (
          <Link
            key={b.key}
            href={`/catalog?cat=${b.key}`}
            className={`bento-card t-${b.tone} s-${b.size}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="bc-mesh" aria-hidden="true" />
            <div className="bc-stripes" aria-hidden="true" />
            <div className="bc-num mono">0{i + 1}</div>
            <div className="bc-emoji">{b.emoji}</div>
            <div className="bc-bottom">
              <div>
                <div className="bc-label">{b.label}</div>
                <div className="bc-sub">{b.sub}</div>
              </div>
              <span className="bc-arrow">↗</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
