import Link from "next/link";
import SectionLabel from "./SectionLabel";

const DAILY = [
  { tag: "01", label: "Столик",         hint: "у ресторані за 60 секунд", meta: "560+ закладів" },
  { tag: "02", label: "Букет",          hint: "доставка від 30 хв",        meta: "флористи поруч" },
  { tag: "03", label: "Сертифікат",     hint: "цифровий — миттєво",        meta: "120+ брендів" },
  { tag: "04", label: "Фотограф",       hint: "на годину, на сьогодні",    meta: "AI-підбір" },
  { tag: "05", label: "Лімузин",        hint: "виклик за 20 хв",           meta: "verified parc" },
  { tag: "06", label: "Музика-сюрприз", hint: "співак до столика",         meta: "новинка" },
];

export default function Daily() {
  return (
    <section className="daily-sec" id="daily">
      <SectionLabel n="05">Щодня</SectionLabel>
      <div className="daily-head">
        <h2 className="display med">Свято щодня</h2>
        <p className="lead narrow">Маленькі ритуали, що тримають місто живим.</p>
      </div>
      <div className="daily-grid">
        {DAILY.map(d => (
          <Link key={d.tag} href="/daily" className="daily-card">
            <div className="dc-top">
              <span className="mono">{d.tag}</span>
              <span className="dc-arrow">↗</span>
            </div>
            <div className="dc-label italic">{d.label}</div>
            <div className="dc-hint">{d.hint}</div>
            <div className="dc-meta mono">— {d.meta}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
