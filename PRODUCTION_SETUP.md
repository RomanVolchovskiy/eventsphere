# 🚀 EventSphere — Інструкція запуску в продакшн

> Оновлено: 2026-06-19
> Стан: автодеплой із GitHub працює ✅ · залишилось налаштувати env-змінні та зовнішні сервіси

---

## 📍 Поточний стан (факти)

| Що | Значення |
|----|----------|
| **GitHub репо** | `RomanVolchovskiy/eventsphere` (гілка `main`) |
| **Vercel команда** | `rpman's projects` |
| **Vercel проєкт** | `eventsphere` |
| **Прод-URL** | https://eventsphere-rpmans-projects.vercel.app |
| **Останній деплой** | комміт `aaac1dd`, статус READY |
| **Автодеплой** | ✅ кожен `git push` у `main` автоматично збирає й публікує |

**Висновок:** сайт уже публікується автоматично. Запускати `vercel deploy` вручну НЕ треба.
Бракує лише **environment variables** — без них логін/платежі/БД не працюють (сайт відкривається, але функції — ні).

> ⚠️ Локальний `.vercel/project.json` вказує на старий проєкт (інша команда). Це не заважає,
> бо деплой іде через GitHub-інтеграцію, а не з локальної машини.

---

## КРОК 1 — Базовий запуск (БД + авторизація email)

Це підніме робочий сайт: відкривається, реєстрація через email і каталог працюють.

### 1.1 Додати env-змінні у Vercel

Відкрийте:
👉 https://vercel.com/rpmans-projects/eventsphere/settings/environment-variables

Натисніть **Add New** і додайте кожну (Environment = **Production**):

| Key | Value |
|-----|-------|
| `DATABASE_URL` | рядок підключення з Neon (див. нижче) |
| `NEXTAUTH_URL` | `https://eventsphere-rpmans-projects.vercel.app` |
| `NEXTAUTH_SECRET` | `105769863841c2cbd54a4f0c4a6987821baa2ec1ca920703326687bbd18d45fd` |

`DATABASE_URL` беріть із **Neon Console** → ваш проєкт → **Connection string**
(формат: `postgresql://<user>:<password>@<host>/<db>?sslmode=require`).

Натискайте **Save** після кожної.

### 1.2 Перезапустити деплой

Змінні підхоплюються лише новим деплоєм. Один зі способів:
- **Vercel Dashboard** → проєкт → **Deployments** → останній → меню `…` → **Redeploy**, або
- Просто попросіть мене — я запущу redeploy через інтеграцію.

### 1.3 Перевірка

1. Відкрийте https://eventsphere-rpmans-projects.vercel.app
2. Зайдіть на `/register` → зареєструйтесь через email
3. Відкрийте `/catalog` — має показати дані з БД

✅ Якщо реєстрація проходить — база й авторизація працюють.

---

## КРОК 2 — Вхід через Google (Google OAuth)

Потрібен акаунт Google. Дає кнопку «Увійти через Google» + синхронізацію Google Calendar.

### 2.1 Створити OAuth-креденшіали

1. Відкрийте https://console.cloud.google.com
2. Згори створіть/виберіть проєкт (напр. `EventSphere`)
3. **APIs & Services → Library** → знайдіть **Google Calendar API** → **Enable**
4. **APIs & Services → OAuth consent screen**:
   - User Type: **External** → Create
   - App name: `EventSphere`
   - User support email: ваша пошта
   - Developer contact: ваша пошта
   - Save and Continue (Scopes/Test users можна лишити за замовчуванням) → Back to Dashboard
5. **APIs & Services → Credentials → + CREATE CREDENTIALS → OAuth client ID**
   - Application type: **Web application**
   - Name: `EventSphere Web`
   - **Authorized JavaScript origins:**
     - `https://eventsphere-rpmans-projects.vercel.app`
     - `http://localhost:3000`
   - **Authorized redirect URIs:**
     - `https://eventsphere-rpmans-projects.vercel.app/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google`
   - **Create** → скопіюйте **Client ID** і **Client Secret**

### 2.2 Додати у Vercel (Production)

| Key | Value |
|-----|-------|
| `GOOGLE_CLIENT_ID` | значення з Google |
| `GOOGLE_CLIENT_SECRET` | значення з Google |

→ Redeploy → перевірте кнопку «Google» на `/login`.

---

## КРОК 3 — Платежі (Stripe)

> Порада: спершу налаштуйте в **Test-режимі**, перевірте повний flow, і лише потім переключіться на **Live**. Так не дебажите на реальних грошах.

### 3.1 Ключі API

1. https://dashboard.stripe.com/apikeys
2. Перемикач режиму (зверху ліворуч): **Test** для тестів / **Live** для бойового
3. Скопіюйте:
   - **Secret key** → `STRIPE_SECRET_KEY` (`sk_test_…` або `sk_live_…`)
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_…` / `pk_live_…`)

### 3.2 Вебхук

1. **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://eventsphere-rpmans-projects.vercel.app/api/payments/webhook`
3. **Select events:**
   - `checkout.session.completed`
   - `charge.refunded`
4. **Add endpoint** → на сторінці вебхука **Reveal** signing secret → `STRIPE_WEBHOOK_SECRET` (`whsec_…`)

### 3.3 Додати у Vercel (Production)

| Key | Value |
|-----|-------|
| `STRIPE_SECRET_KEY` | з кроку 3.1 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | з кроку 3.1 |
| `STRIPE_WEBHOOK_SECRET` | з кроку 3.2 |

→ Redeploy.

### 3.4 Перевірка

- Додайте послугу → **Checkout**
- Тестова картка (Test-режим): `4242 4242 4242 4242`, будь-яка майбутня дата, будь-який CVC
- Stripe → **Events** → переконайтесь, що `checkout.session.completed` дійшов

---

## КРОК 4 — Власний домен (необов'язково)

1. Vercel → проєкт → **Settings → Domains** → **Add**
2. Введіть домен → додайте записи DNS у реєстратора (Vercel покаже які)
3. Дочекайтесь видачі SSL (HTTPS автоматично)
4. **Оновіть** `NEXTAUTH_URL` на новий домен
5. **Додайте** новий домен у Google OAuth (origins + redirect URI) і Stripe webhook URL
6. Redeploy

---

## КРОК 5 — Безпека (зробити після успішного запуску)

- [ ] **Змінити пароль БД у Neon** — старий був у git до очищення (Neon Console → Roles → Reset password) і оновити `DATABASE_URL` у Vercel + локальному `.env`
- [ ] `NEXTAUTH_SECRET` у проді — новий (вже згенеровано), не дефолтний із `.env`
- [ ] Stripe/Google — на проді використовуються Live-ключі (не Test)
- [ ] `.env*` не комітиться (вже в `.gitignore`)
- [ ] HTTPS активний (Vercel автоматично)

---

## ⚙️ Технічна примітка: Prisma + Supabase

У проєкті присутні **і Prisma** (основна робота з БД, Neon), **і Supabase-клієнт** (доданий пізніше).
Перед активним розвитком варто визначитись, що є джерелом істини для БД, щоб уникнути дублювання.
Для поточного запуску працює Prisma + Neon (`DATABASE_URL`).

---

## 🔗 Корисні посилання

| Сервіс | URL |
|--------|-----|
| Vercel (проєкт) | https://vercel.com/rpmans-projects/eventsphere |
| Vercel env vars | https://vercel.com/rpmans-projects/eventsphere/settings/environment-variables |
| Прод-сайт | https://eventsphere-rpmans-projects.vercel.app |
| Google Cloud | https://console.cloud.google.com |
| Stripe Dashboard | https://dashboard.stripe.com |
| Stripe Events | https://dashboard.stripe.com/events |
| Neon Database | https://console.neon.tech |

---

## 🆘 Troubleshooting

| Симптом | Причина / рішення |
|---------|-------------------|
| Сайт відкривається, але реєстрація падає | Немає `DATABASE_URL` або не зроблено redeploy після додавання |
| `Configuration` error на логіні | Немає `NEXTAUTH_SECRET` / `NEXTAUTH_URL` не збігається з доменом |
| `redirect_uri_mismatch` (Google) | Redirect URI у Google ≠ домен сайту (має точно збігатися) |
| `Webhook signature verification failed` | Скопійовано не той secret — потрібен **signing secret** вебхука (`whsec_…`), не API-ключ |
| Зміни в env не діють | Env підхоплюються лише новим деплоєм — зробіть Redeploy |

---

**Послідовність запуску:** Крок 1 (база) → Крок 2 (Google) → Крок 3 (Stripe) → Крок 4 (домен) → Крок 5 (безпека).
Кожен крок дає робочий стан, який можна перевірити окремо.
