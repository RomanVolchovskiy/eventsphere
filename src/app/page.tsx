import Link from "next/link";
import Confetti from "@/components/carnival/Confetti";
import {
  MarqueeFrame, Firework, Balloon, SectionHead, Ticker,
} from "@/components/carnival/Festive";

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

const DAILY = [
  { tag: "01", label: "Столик у ресторані", emoji: "🍽", tone: "magenta" },
  { tag: "02", label: "Букет на сьогодні",  emoji: "💐", tone: "cherry" },
  { tag: "03", label: "Сертифікат",         emoji: "🎁", tone: "gold" },
  { tag: "04", label: "Фотограф на годину", emoji: "📷", tone: "violet" },
  { tag: "05", label: "Лімузин",            emoji: "🚖", tone: "blue" },
  { tag: "06", label: "Сюрприз-музика",     emoji: "🎶", tone: "mint" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-spot" />
        <div className="hero-curtain l" />
        <div className="hero-curtain r" />
        <Confetti density={90} />
        <Firework x={12} y={22} hue="#FFC857" delay={0} size={120} />
        <Firework x={86} y={18} hue="#FF3D80" delay={0.7} size={100} />
        <Firework x={74} y={66} hue="#4DE0B5" delay={1.4} size={90} />
        <Firework x={20} y={70} hue="#7C5BFF" delay={2.1} size={80} />

        <div className="hero-balloons">
          <Balloon color="#FF3D80" x={6} delay={0} size={72} />
          <Balloon color="#FFC857" x={88} delay={0.6} size={86} />
          <Balloon color="#4DE0B5" x={92} delay={1.2} size={62} />
          <Balloon color="#7C5BFF" x={4} delay={1.8} size={66} />
        </div>

        <div className="hero-bar">
          <span className="mono">⊹ KYIV · СВЯТКУЄМО ЩОДНЯ</span>
          <span className="mono live"><i className="dot" /> LIVE · 2 412 ВИКОНАВЦІВ</span>
          <span className="mono">v.8.0 — carnival edition</span>
        </div>

        <MarqueeFrame>
          <div className="hero-inner">
            <div className="hero-pill">
              <span>🎉</span>
              <span>Платформа святкування 2026</span>
              <span className="dot pink" />
            </div>

            <h1 className="mega">
              <span className="line">Хай</span>
              <span className="line"><span className="grad">святкують</span></span>
              <span className="line">всі.</span>
            </h1>

            <p className="hero-sub">
              Від ранкової кави з квітами — до фейерверків над Дніпром. EventSphere збирає всі ритуали радості в одне місце: 2 400+ виконавців, AI-підбір команди, конструктор події та живу карту свят України.
            </p>

            <div className="hero-cta">
              <Link href="/catalog" className="btn-pop">
                <span style={{ display: "inline-block", animation: "spark 1.6s ease-in-out infinite" }}>✨</span>
                <span>Зібрати свято</span>
                <span>→</span>
              </Link>
              <Link href="/smart-match" className="btn-line">
                <span>Підібрати команду</span>
                <span className="dim">за 60 сек</span>
              </Link>
            </div>

            <div className="hero-stats">
              <div><b>2 400+</b><span>виконавців</span></div>
              <div className="div" />
              <div><b>18 K</b><span>заходів /рік</span></div>
              <div className="div" />
              <div><b>4.9 ★</b><span>рейтинг</span></div>
              <div className="div" />
              <div><b>22</b><span>міста</span></div>
            </div>
          </div>
        </MarqueeFrame>

        <Ticker />
      </section>

      {/* BENTO */}
      <section className="bento-sec">
        <SectionHead
          n="02"
          kicker="Усі ритуали"
          title={<>Обери свій <em>напрямок радості</em></>}
          sub="Кожна категорія — окремий світ виконавців, перевірений вручну. Натисни — і провалишся всередину."
        />
        <div className="bento-grid">
          {BENTO.map((b, i) => (
            <Link
              key={b.key}
              href={`/catalog?cat=${b.key}`}
              className={`bento-card t-${b.tone} s-${b.size}`}
            >
              <div className="bc-mesh" aria-hidden="true" />
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

      {/* DAILY */}
      <section className="daily-sec">
        <SectionHead
          n="03"
          kicker="Свято щодня"
          title={<>Маленькі <em>ритуали радості</em></>}
          sub="Від кави до подарунка — миттєві бронювання, без зайвих кліків."
        />
        <div className="daily-grid">
          {DAILY.map(d => (
            <Link key={d.tag} href="/daily" className={`d-card t-${d.tone}`}>
              <div className="d-emoji">{d.emoji}</div>
              <div className="d-tag mono">{d.tag}</div>
              <div className="d-label">{d.label}</div>
              <div className="d-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRO */}
      <section className="pro-sec">
        <div className="pro-card">
          <div className="pro-glow" />
          <div className="pro-stripes" />
          <div className="pro-left">
            <span className="mono dim">⊹ EVENTSPHERE PRO</span>
            <h2>Розвивайте свій <em>івент-бізнес</em></h2>
            <p>Pro-портфоліо, CRM, аналітика, 360°-тури — інструменти, що множать репутацію та доходи.</p>
            <div className="pro-cta">
              <Link href="/pro" className="btn-pop">
                <span>✨</span><span>Стати партнером</span><span>→</span>
              </Link>
              <Link href="/pro" className="btn-line">Тарифи</Link>
            </div>
          </div>
          <div className="pro-right">
            <div className="pro-num"><b>+38%</b><span>сер. дохід</span></div>
            <div className="pro-num"><b>×3.2</b><span>швидкість угоди</span></div>
            <div className="pro-num"><b>4.9</b><span>репутація</span></div>
            <div className="pro-num"><b>0%</b><span>прихованих комісій</span></div>
          </div>
        </div>
      </section>
    </>
  );
}
