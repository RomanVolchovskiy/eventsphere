import Link from "next/link";

const FEATURES = [
  {
    ico: "I",
    label: "Особистий куратор",
    desc: "Один контакт замість десяти підрядників. Доступний на весь цикл події.",
  },
  {
    ico: "II",
    label: "Smart Match Pro",
    desc: "Розширений алгоритм підбору з ваги для вашого попереднього досвіду та переваг.",
  },
  {
    ico: "III",
    label: "Ескроу платежі",
    desc: "Гроші — на блокованому рахунку до виконання робіт. Виконавці отримують після події.",
  },
  {
    ico: "IV",
    label: "Документообіг",
    desc: "Договори, акти, рахунки — підготовлені редакцією. Один підпис замість дванадцяти.",
  },
  {
    ico: "V",
    label: "Архів подій",
    desc: "Всі ваші заходи в одному місці: команди, кошториси, фото — для наступних разів.",
  },
  {
    ico: "VI",
    label: "Закриті події",
    desc: "Доступ до запрошень, які ніколи не з'являються в публічному календарі.",
  },
];

export default function Pro() {
  return (
    <section className="noir-section" id="pro">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-8">
        <div className="flex flex-col gap-6 max-w-[640px]">
          <span className="noir-label">Розділ 06 — Membership</span>
          <h2 className="noir-h2">
            Pro — для тих, хто <span className="accent">не питає</span> ціну
          </h2>
          <p className="noir-lead">
            Річна підписка для людей і компаній, які проводять від
            чотирьох подій на рік. Усі сервіси редакції в одному пакеті.
          </p>
        </div>
        <span className="noir-num">№ 06 / 07</span>
      </div>

      <div className="noir-pro">
        <div className="noir-pro-side">
          <div className="noir-pro-features">
            {FEATURES.map((f) => (
              <div className="noir-pro-feature" key={f.ico}>
                <span className="ico">{f.ico}</span>
                <div>
                  <div className="label">{f.label}</div>
                  <div className="desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="noir-pro-card">
          <div className="flex items-center justify-between">
            <span className="noir-label">ЄСвято Pro · 2026</span>
            <span className="noir-num">Membership</span>
          </div>
          <div>
            <div className="noir-pro-price">
              <span className="cur">$</span>2&nbsp;400
            </div>
            <div className="noir-pro-price" style={{ marginTop: 8 }}>
              <span className="per">на рік / включно з усіма сервісами</span>
            </div>
          </div>

          <hr className="noir-rule" />

          <div className="flex flex-col gap-3">
            <div className="noir-match-row" style={{ borderBottomColor: "var(--line)" }}>
              <span className="k">Кураторських годин</span>
              <span className="v">До 120</span>
            </div>
            <div className="noir-match-row" style={{ borderBottomColor: "var(--line)" }}>
              <span className="k">Закритих запрошень</span>
              <span className="v">12 / рік</span>
            </div>
            <div className="noir-match-row" style={{ borderBottomColor: "var(--line)" }}>
              <span className="k">Smart Match</span>
              <span className="v accent">Необмежено</span>
            </div>
            <div className="noir-match-row" style={{ border: 0 }}>
              <span className="k">Скасування</span>
              <span className="v">У будь-який момент</span>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href="/pro" className="btn-elegant">
              <span>Оформити Pro</span>
              <span className="arr">→</span>
            </Link>
            <Link href="/pro#details" className="btn-elegant-ghost">
              <span>Дізнатись більше</span>
              <span className="arr">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
