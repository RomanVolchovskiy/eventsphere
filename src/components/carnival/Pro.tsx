import Link from "next/link";

export default function Pro() {
  return (
    <section className="pro-sec" id="pro">
      <div className="pro-card">
        <div className="pro-glow" />
        <div className="pro-stripes" />
        <div className="pro-left">
          <span className="mono dim">⊹ EVENTSPHERE PRO</span>
          <h2>
            Розвивайте свій <em>івент-бізнес</em>
          </h2>
          <p>
            Pro-портфоліо, CRM, аналітика, 360°-тури — інструменти, що множать репутацію та доходи.
          </p>
          <div className="pro-cta">
            <Link href="/pro" className="btn-pop">
              <span className="bp-spark">✨</span>
              <span>Стати партнером</span>
              <span className="bp-arrow">→</span>
            </Link>
            <Link href="/pro" className="btn-line">
              Тарифи
            </Link>
          </div>
        </div>
        <div className="pro-right">
          <div className="pro-num">
            <b>+38%</b>
            <span>сер. дохід</span>
          </div>
          <div className="pro-num">
            <b>×3.2</b>
            <span>швидкість угоди</span>
          </div>
          <div className="pro-num">
            <b>4.9</b>
            <span>репутація</span>
          </div>
          <div className="pro-num">
            <b>0%</b>
            <span>прихованих комісій</span>
          </div>
        </div>
      </div>
    </section>
  );
}
