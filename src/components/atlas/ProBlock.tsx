import Link from "next/link";
import SectionLabel from "./SectionLabel";

export default function ProBlock() {
  return (
    <section className="pro-sec" id="pro">
      <SectionLabel n="07">Для бізнесу</SectionLabel>
      <div className="pro-card">
        <div className="pro-left">
          <div className="mono dim">EVENTSPHERE PRO · INDEX 2026</div>
          <h2 className="display med italic">Для виконавців</h2>
          <p className="lead">
            Pro-портфоліо, CRM, аналітика, 360°-тури — інструменти, що множать репутацію.
          </p>
          <div className="pro-cta">
            <Link href="/pro" className="btn btn-cream">
              Стати партнером <span className="arrow">↗</span>
            </Link>
            <Link href="/pro" className="btn btn-line">
              тарифи
            </Link>
          </div>
        </div>
        <div className="pro-right">
          <div className="pro-num">
            <div>
              <b>+38%</b>
              <span>ср. дохід</span>
            </div>
            <div>
              <b>×3.2</b>
              <span>швидкість угоди</span>
            </div>
            <div>
              <b>4.9</b>
              <span>репутація</span>
            </div>
            <div>
              <b>0%</b>
              <span>прихованих комісій</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
