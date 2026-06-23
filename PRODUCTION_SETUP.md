# 🚀 EventSphere — Стан продакшну та запуску

> Оновлено: 2026-06-23
> Стан: **сайт живий і відкритий для користувачів** ✅ · БД + авторизація працюють · бронювання у режимі вільного доступу (без оплати)

---

## 📍 Поточний стан (перевірено на проді)

| Що | Значення |
|----|----------|
| **GitHub репо** | `RomanVolchovskiy/eventsphere` (гілка `main`, public) |
| **Vercel команда / проєкт** | `rpman's projects` / `eventsphere` |
| **Прод-URL** | https://eventsphere-rpmans-projects.vercel.app |
| **Автодеплой** | ✅ кожен `git push` у `main` автоматично збирає й публікує |
| **База даних (Neon + Prisma)** | 🟢 працює — каталог віддає реальні дані |
| **Авторизація** | 🟢 email + Google OAuth налаштовані й працюють |
| **Бронювання** | 🟢 режим вільного доступу — підтверджується одразу, без оплати |
| **Платежі (Stripe)** | ⏸️ вимкнені (Stripe не працює для UA — див. нижче) |

**Висновок:** сайт уже публічно доступний. Користувачі можуть реєструватися (email/Google),
переглядати каталог і **бронювати безкоштовно**. Запускати `vercel deploy` вручну НЕ треба.

> ⚠️ Локальний `.vercel/project.json` вказує на старий проєкт (інша команда). Це не заважає,
> бо деплой іде через GitHub-інтеграцію, а не з локальної машини.

---

## ✅ Що вже зроблено (кроки 1–2 завершені)

Раніше ці кроки були в планах — зараз вони **виконані й перевірені**:

- **env-змінні у Vercel** виставлені: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`,
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- **БД (Neon)** підключена — `/catalog` показує виконавців.
- **Авторизація** — реєстрація/вхід через email і Google працюють
  (перевірено через `/api/auth/providers`).

Перевірити самостійно: відкрити сайт → `/register` (email) або кнопка Google на `/login` →
далі `/catalog` має показати дані.

---

## 💳 Платежі — режим вільного доступу (поточний)

**Чому без оплати:** Stripe офіційно **не підтримує акаунти, зареєстровані в Україні**
для прийому платежів. Тому на період набору користувачів платний checkout вимкнено,
а бронювання підтверджується одразу.

**Як це керується — один прапорець у Vercel env vars:**

| `NEXT_PUBLIC_PAYMENTS_ENABLED` | Поведінка бронювання |
|-------------------------------|----------------------|
| не встановлено / ≠ `true` (зараз) | **Вільний доступ** — бронювання `CONFIRMED` одразу, без оплати |
| `=true` | Платний Stripe Checkout (потрібні Stripe-ключі, див. нижче) |

> Після зміни прапорця обов'язково **Redeploy** — env підхоплюються лише новим деплоєм.

### Коли будуть платежі: варіанти для України

Stripe для UA-юрособи не підходить. Реальні шляхи:

1. **Український платіжний шлюз** (рекомендовано для UA-ринку) — підтримують ФОП/ТОВ, UAH,
   локальні картки, Apple/Google Pay:
   - **WayForPay** або **Fondy** — підтримують *split-платежі* (комісія платформі + виплата
     виконавцю), що ідеально для маркетплейсу
   - **LiqPay** (ПриватБанк) — найпростіший старт для ФОП
   - **monobank acquiring / Plata by mono** — сучасний, швидке підключення
2. **Закордонна юрособа** (Польща / Естонія e-Residency / US LLC через Stripe Atlas) — тоді
   можна лишити Stripe, але додається юридична/податкова складність.

Заміна торкнеться 3 файлів: `src/app/api/payments/checkout/route.ts`,
`src/app/api/payments/webhook/route.ts`, `src/lib/stripe.ts` + клієнтський виклик у
`BookingPanel.tsx`. Логіка бронювань лишається.

### (Довідково) Якщо вмикати Stripe

1. Ключі: https://dashboard.stripe.com/apikeys → `STRIPE_SECRET_KEY`,
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. Вебхук: Developers → Webhooks → endpoint
   `https://<домен>/api/payments/webhook`, події `checkout.session.completed`,
   `charge.refunded` → `STRIPE_WEBHOOK_SECRET`
3. Додати ці 3 ключі + `NEXT_PUBLIC_PAYMENTS_ENABLED=true` у Vercel → Redeploy
4. Тест-картка: `4242 4242 4242 4242`, будь-яка майбутня дата, будь-який CVC

---

## 🔐 Безпека — зробити найближчим часом

- [ ] ⚠️ **Змінити пароль БД у Neon** — старий був у git-історії до очищення
  (Neon Console → Roles → Reset password), оновити `DATABASE_URL` у Vercel + локальному `.env`
- [ ] ⚠️ **Ротувати `NEXTAUTH_SECRET`** — попередня версія цього файлу містила його у відкритому
  вигляді в **публічному** репозиторії, тож вважати скомпрометованим. Згенерувати новий
  (`openssl rand -hex 32`), оновити у Vercel (це розлогінить наявних користувачів — нормально).
- [ ] `.env*` не комітиться (вже в `.gitignore`) ✅
- [ ] HTTPS активний (Vercel автоматично) ✅
- [ ] При вмиканні платежів — Live-ключі, не Test

---

## КРОК (опційно) — Власний домен

1. Vercel → проєкт → **Settings → Domains** → **Add**
2. Введіть домен → додайте DNS-записи у реєстратора (Vercel покаже які)
3. Дочекайтесь видачі SSL (HTTPS автоматично)
4. **Оновіть** `NEXTAUTH_URL` на новий домен
5. **Додайте** домен у Google OAuth (origins + redirect URI); за наявності платежів — у webhook URL
6. Redeploy

### (Довідково) Google OAuth — повне налаштування

Якщо знадобиться перевипустити креденшіали (наприклад під новий домен):
1. https://console.cloud.google.com → проєкт `EventSphere`
2. APIs & Services → Library → **Google Calendar API** → Enable
3. OAuth consent screen → External → заповнити назву й контакти
4. Credentials → Create OAuth client ID → Web application:
   - Authorized JavaScript origins: прод-домен + `http://localhost:3000`
   - Authorized redirect URIs: `<домен>/api/auth/callback/google` + localhost-варіант
5. Скопіювати Client ID / Secret → `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` у Vercel → Redeploy

---

## ⚙️ Технічна примітка: Prisma + Supabase

У проєкті присутні **і Prisma** (основна робота з БД, Neon), **і Supabase-клієнт**.
Для запуску працює Prisma + Neon (`DATABASE_URL`). Перед активним розвитком варто визначити
єдине джерело істини для БД, щоб уникнути дублювання.

---

## 🔗 Корисні посилання

| Сервіс | URL |
|--------|-----|
| Vercel (проєкт) | https://vercel.com/rpmans-projects/eventsphere |
| Vercel env vars | https://vercel.com/rpmans-projects/eventsphere/settings/environment-variables |
| Прод-сайт | https://eventsphere-rpmans-projects.vercel.app |
| Neon Database | https://console.neon.tech |
| Google Cloud | https://console.cloud.google.com |

---

## 🆘 Troubleshooting

| Симптом | Причина / рішення |
|---------|-------------------|
| Реєстрація/каталог падає | Перевірити `DATABASE_URL` і зробити Redeploy |
| `Configuration` error на логіні | `NEXTAUTH_SECRET` / `NEXTAUTH_URL` не збігається з доменом |
| `redirect_uri_mismatch` (Google) | Redirect URI у Google ≠ домен сайту (має точно збігатися) |
| Бронювання просить оплату, хоча має бути безкоштовним | Прибрати `NEXT_PUBLIC_PAYMENTS_ENABLED` (або ≠ `true`) → Redeploy |
| Зміни в env не діють | Env підхоплюються лише новим деплоєм — зробіть Redeploy |
