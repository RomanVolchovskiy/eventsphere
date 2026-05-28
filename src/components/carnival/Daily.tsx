import Link from "next/link";
import { SectionHead } from "./Festive";

const items = [
  { tag: "01", label: "Столик у ресторані", emoji: "🍽", tone: "magenta" },
  { tag: "02", label: "Букет на сьогодні",  emoji: "💐", tone: "cherry" },
  { tag: "03", label: "Сертифікат",         emoji: "🎁", tone: "gold" },
  { tag: "04", label: "Фотограф на годину", emoji: "📷", tone: "violet" },
  { tag: "05", label: "Лімузин",            emoji: "🚖", tone: "blue" },
  { tag: "06", label: "Сюрприз-музика",     emoji: "🎶", tone: "mint" },
];

export default function Daily() {
  return (
    <section className="daily-sec" id="daily">
      <SectionHead
        n="06"
        kicker="Свято щодня"
        title={
          <>
            Маленькі <em>ритуали радості</em>
          </>
        }
        sub="Від кави до подарунка — миттєві бронювання, без зайвих кліків."
      />
      <div className="daily-grid">
        {items.map(d => (
          <Link key={d.tag} href="/daily" className={`d-card t-${d.tone}`}>
            <div className="d-emoji">{d.emoji}</div>
            <div className="d-tag mono">{d.tag}</div>
            <div className="d-label">{d.label}</div>
            <div className="d-arrow">→</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
