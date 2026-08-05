"use client";

import { useMemo, useState } from "react";
import {
  Sparkles, Star, ArrowRight, Users, DollarSign, MapPin, Loader2,
  Repeat, Check, X,
} from "lucide-react";

type MatchVendor = {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviewsCount: number;
  priceFrom: number;
  subscription: "STANDARD" | "PRO" | "MAX";
  isVerified: boolean;
  matchScore: number;
};

type MatchOption = {
  vendor: MatchVendor;
  estimatedCost: number;
  pricingNote: string | null;
  reason: string;
};

type MatchResult = MatchOption & {
  role: string;
  category: string;
  allocated: number;
  alternatives: MatchOption[];
};

type ApiResponse = {
  matches: MatchResult[];
  totalEstimate: number;
  budget: number;
  budgetOk: boolean;
  missingRoles: string[];
  message: string;
};

const EVENT_TYPES = ["Весілля", "Корпоратив", "День народження", "Ювілей", "Випускний", "Презентація"];
const STYLES = ["Класичний", "Мінімалізм", "Бохо", "Гламур", "Рустик", "Модерн"];
const CITIES = ["Київ", "Харків", "Одеса", "Львів", "Дніпро", "Запоріжжя"];

export default function SmartMatchPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Заміна виконавця: для кожної ролі — індекс обраного варіанта
  // (0 = рекомендований, далі alternatives). Яка роль зараз розгорнута.
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [openRole, setOpenRole] = useState<string | null>(null);

  /** Усі варіанти ролі одним списком: рекомендований + альтернативи. */
  function optionsOf(m: MatchResult): MatchOption[] {
    const { role, category, allocated, alternatives, ...recommended } = m;
    void role; void category; void allocated;
    return [recommended, ...alternatives];
  }

  function chosenOf(m: MatchResult): MatchOption {
    const opts = optionsOf(m);
    return opts[picked[m.category] ?? 0] ?? opts[0];
  }

  // Кошторис перераховується від того, що людина обрала, а не від
  // початкової відповіді сервера.
  const totals = useMemo(() => {
    if (!result) return null;
    const total = result.matches.reduce((sum, m) => {
      const opts = optionsOf(m);
      const opt = opts[picked[m.category] ?? 0] ?? opts[0];
      return sum + opt.estimatedCost;
    }, 0);
    return { total, ok: total <= result.budget };
  }, [result, picked]);

  const [form, setForm] = useState({
    eventType: "",
    style: "",
    city: "",
    guestsCount: 80,
    budget: 150000,
  });

  function set(key: string, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function runMatch() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/smart-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не вдалося виконати підбір. Спробуйте ще раз.");
        return;
      }
      setResult(data as ApiResponse);
      setPicked({});
      setOpenRole(null);
      setStep(4);
    } catch {
      setError("Немає зв'язку з сервером. Перевірте інтернет і спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-[var(--dark-card)] border-b border-[var(--dark-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-full px-4 py-2 mb-5">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-[var(--gold)] text-sm">Штучний інтелект</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Smart Match</h1>
          <p className="text-[var(--text-muted)]">
            Опишіть ваш захід за 3 кроки — AI підбере ідеальну команду виконавців
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Progress steps */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step > s
                    ? "bg-green-400 text-black"
                    : step === s
                    ? "bg-[var(--gold)] text-black"
                    : "bg-[var(--dark-border)] text-[var(--text-muted)]"
                }`}>
                  {step > s ? "✓" : s}
                </div>
                <span className={`text-sm hidden sm:block ${step === s ? "text-white" : "text-[var(--text-muted)]"}`}>
                  {s === 1 ? "Тип заходу" : s === 2 ? "Деталі" : "Бюджет"}
                </span>
                {s < 3 && <div className="flex-1 h-px bg-[var(--dark-border)]" />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-semibold text-lg mb-4">Який захід ви плануєте?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => set("eventType", type)}
                    className={`p-4 rounded-2xl border text-sm font-medium transition-all ${
                      form.eventType === type
                        ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                        : "border-[var(--dark-border)] bg-[var(--dark-card)] text-[var(--text-muted)] hover:border-[var(--gold)]/50 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-white font-semibold text-lg mb-4">Стиль заходу</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => set("style", s)}
                    className={`p-4 rounded-2xl border text-sm font-medium transition-all ${
                      form.style === s
                        ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                        : "border-[var(--dark-border)] bg-[var(--dark-card)] text-[var(--text-muted)] hover:border-[var(--gold)]/50 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!form.eventType || !form.style}
              onClick={() => setStep(2)}
              className="w-full bg-[var(--gold)] disabled:bg-[var(--dark-border)] disabled:text-[var(--text-muted)] text-black font-semibold py-3.5 rounded-xl hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              Далі <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--gold)]" />
                Місто проведення
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => set("city", city)}
                    className={`p-4 rounded-2xl border text-sm font-medium transition-all ${
                      form.city === city
                        ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                        : "border-[var(--dark-border)] bg-[var(--dark-card)] text-[var(--text-muted)] hover:border-[var(--gold)]/50 hover:text-white"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--gold)]" />
                  Кількість гостей
                </h2>
                <span className="text-[var(--gold)] font-bold text-lg">{form.guestsCount}</span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={form.guestsCount}
                onChange={(e) => set("guestsCount", Number(e.target.value))}
                className="w-full accent-[var(--gold)]"
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>10 гостей</span>
                <span>500 гостей</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-[var(--dark-border)] text-[var(--text-muted)] py-3.5 rounded-xl hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              >
                Назад
              </button>
              <button
                disabled={!form.city}
                onClick={() => setStep(3)}
                className="flex-1 bg-[var(--gold)] disabled:bg-[var(--dark-border)] disabled:text-[var(--text-muted)] text-black font-semibold py-3.5 rounded-xl hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                Далі <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[var(--gold)]" />
                  Загальний бюджет
                </h2>
                <span className="text-[var(--gold)] font-bold text-lg">
                  {form.budget.toLocaleString("uk-UA")} ₴
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={form.budget}
                onChange={(e) => set("budget", Number(e.target.value))}
                className="w-full accent-[var(--gold)]"
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>10 000 ₴</span>
                <span>500 000 ₴</span>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-2xl p-5">
              <p className="text-[var(--gold)] text-sm font-medium mb-3">Підсумок запиту</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Тип</span>
                  <span className="text-white">{form.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Стиль</span>
                  <span className="text-white">{form.style}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Місто</span>
                  <span className="text-white">{form.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Гості</span>
                  <span className="text-white">{form.guestsCount} осіб</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Бюджет</span>
                  <span className="text-white">{form.budget.toLocaleString("uk-UA")} ₴</span>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-[var(--dark-border)] text-[var(--text-muted)] py-3.5 rounded-xl hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
              >
                Назад
              </button>
              <button
                onClick={runMatch}
                disabled={loading}
                className="flex-1 bg-[var(--gold)] text-black font-semibold py-3.5 rounded-xl hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Аналізую...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Запустити Smart Match
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Results */}
        {step === 4 && result && (
          <div className="space-y-6">
            <div className="text-center pb-2">
              <div className="w-14 h-14 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-[var(--gold)]" />
              </div>
              <h2 className="text-white font-bold text-xl mb-2">
                {result.matches.length > 0 ? "Команда мрії знайдена!" : "Поки без результату"}
              </h2>
              <p className="text-[var(--text-muted)] text-sm">{result.message}</p>
            </div>

            <div className="space-y-4">
              {result.matches.map((m) => {
                const opts = optionsOf(m);
                const chosen = chosenOf(m);
                const chosenIndex = picked[m.category] ?? 0;
                const isOpen = openRole === m.category;
                const swapped = chosenIndex !== 0;

                return (
                  <div
                    key={m.category}
                    className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5 hover:border-[var(--gold)]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-[var(--gold)] text-xs font-medium mb-1">
                          {m.role}
                          {swapped && (
                            <span className="text-[var(--text-muted)] font-normal">
                              {" "}· замінено вами
                            </span>
                          )}
                        </p>
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          {chosen.vendor.name}
                          {chosen.vendor.subscription !== "STANDARD" && (
                            <span className="text-[10px] uppercase tracking-wide border border-[var(--gold)]/40 text-[var(--gold)] px-1.5 py-0.5 rounded">
                              {chosen.vendor.subscription}
                            </span>
                          )}
                        </h3>
                        <p className="text-[var(--text-muted)] text-xs mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {chosen.vendor.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] px-2 py-1 rounded-full">
                          {chosen.vendor.matchScore}% збіг
                        </div>
                      </div>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm mb-3">{chosen.reason}</p>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                          <span className="text-white text-sm">
                            {chosen.vendor.reviewsCount > 0
                              ? chosen.vendor.rating.toFixed(1)
                              : "—"}
                          </span>
                          <span className="text-[var(--text-muted)] text-xs">
                            ({chosen.vendor.reviewsCount})
                          </span>
                        </div>
                        <span className="text-white text-sm">
                          ≈ {chosen.estimatedCost.toLocaleString("uk-UA")} ₴
                        </span>
                        {chosen.pricingNote && (
                          <span className="text-[var(--text-muted)] text-xs">
                            {chosen.pricingNote}
                          </span>
                        )}
                      </div>
                      <a
                        href={`/catalog/${chosen.vendor.id}`}
                        className="text-[var(--gold)] text-sm hover:underline flex items-center gap-1"
                      >
                        Профіль <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[var(--dark-border)] flex items-center justify-between gap-3 text-xs flex-wrap">
                      <span className="text-[var(--text-muted)]">
                        Бюджет на роль: {m.allocated.toLocaleString("uk-UA")} ₴
                      </span>
                      <span
                        className={
                          chosen.estimatedCost <= m.allocated
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {chosen.estimatedCost <= m.allocated
                          ? `економія ${(m.allocated - chosen.estimatedCost).toLocaleString("uk-UA")} ₴`
                          : `+${(chosen.estimatedCost - m.allocated).toLocaleString("uk-UA")} ₴ понад`}
                      </span>
                    </div>

                    {/* Заміна виконавця на цю роль */}
                    {opts.length > 1 ? (
                      <div className="mt-3">
                        <button
                          onClick={() => setOpenRole(isOpen ? null : m.category)}
                          className="flex items-center gap-2 text-[var(--gold)] text-sm hover:underline"
                        >
                          {isOpen ? <X className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
                          {isOpen
                            ? "Згорнути"
                            : `Замінити виконавця (${opts.length - 1} ${
                                opts.length - 1 === 1 ? "варіант" : "варіанти"
                              })`}
                        </button>

                        {isOpen && (
                          <div className="mt-3 space-y-2">
                            {opts.map((o, i) => {
                              const active = i === chosenIndex;
                              return (
                                <button
                                  key={o.vendor.id}
                                  onClick={() => {
                                    setPicked((p) => ({ ...p, [m.category]: i }));
                                    setOpenRole(null);
                                  }}
                                  className={`w-full text-left rounded-xl border p-3 transition-colors ${
                                    active
                                      ? "border-[var(--gold)] bg-[var(--gold)]/5"
                                      : "border-[var(--dark-border)] bg-[var(--dark)] hover:border-[var(--gold)]/50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-white text-sm font-medium flex items-center gap-2">
                                        {active && (
                                          <Check className="w-3.5 h-3.5 text-[var(--gold)] flex-shrink-0" />
                                        )}
                                        <span className="truncate">{o.vendor.name}</span>
                                        {i === 0 && (
                                          <span className="text-[10px] uppercase tracking-wide text-[var(--text-muted)] flex-shrink-0">
                                            рекомендований
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-[var(--text-muted)] text-xs mt-0.5 truncate">
                                        {o.vendor.city} · {o.vendor.matchScore}% збіг ·{" "}
                                        {o.vendor.reviewsCount > 0
                                          ? `${o.vendor.rating.toFixed(1)}★ (${o.vendor.reviewsCount})`
                                          : "без відгуків"}
                                      </p>
                                    </div>
                                    <span className="text-white text-sm flex-shrink-0">
                                      ≈ {o.estimatedCost.toLocaleString("uk-UA")} ₴
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-[var(--text-muted)] text-xs">
                        Інших виконавців на цю роль у каталозі поки немає.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {result.missingRoles.length > 0 && (
              <p className="text-[var(--text-muted)] text-sm bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-4">
                Під ці ролі виконавців у каталозі ще немає:{" "}
                <span className="text-white">{result.missingRoles.join(", ")}</span>. Ми повідомимо,
                щойно вони з&apos;являться.
              </p>
            )}

            {result.matches.length > 0 && totals && (
              <div
                className={`rounded-2xl p-5 border ${
                  totals.ok
                    ? "bg-green-400/5 border-green-400/20"
                    : "bg-yellow-400/5 border-yellow-400/20"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className={`text-sm font-medium mb-1 ${
                        totals.ok ? "text-green-400" : "text-yellow-400"
                      }`}
                    >
                      {totals.ok ? "Вписується у бюджет" : "Дещо вище бюджету"}
                    </p>
                    <p className="text-[var(--text-muted)] text-xs">
                      Орієнтовна вартість команди з {result.budget.toLocaleString("uk-UA")} ₴
                      {totals.ok
                        ? ` · залишається ${(result.budget - totals.total).toLocaleString("uk-UA")} ₴`
                        : ` · перевищення ${(totals.total - result.budget).toLocaleString("uk-UA")} ₴`}
                    </p>
                  </div>
                  <p className="text-white font-bold text-xl flex-shrink-0">
                    {totals.total.toLocaleString("uk-UA")} ₴
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep(1); setResult(null); setError(null); }}
                className="flex-1 border border-[var(--dark-border)] text-[var(--text-muted)] py-3.5 rounded-xl hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors text-sm"
              >
                Нові параметри
              </button>
              <a
                href="/planner"
                className="flex-1 bg-[var(--gold)] text-black font-semibold py-3.5 rounded-xl hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-2 text-sm"
              >
                Додати до планувальника
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
