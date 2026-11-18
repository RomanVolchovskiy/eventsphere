# EventSphere (ЄСвято)

Платформа для планування подій: каталог виконавців (зали, фото, кейтеринг, декор, музика),
підбір під бюджет (Smart Match), бронювання, чат із виконавцем і планувальник заходу
(завдання, гості, таймлайн).

- **Прод:** https://eventsphere-rpmans-projects.vercel.app
- **Репозиторій:** `RomanVolchovskiy/eventsphere`, гілка `main` (кожен push у неї автоматично деплоїться)
- **Стан продакшну, секрети, OAuth, платежі:** [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)

## Стек

| Шар | Що використовується |
|-----|---------------------|
| Фреймворк | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Стилі | Tailwind CSS 4 + власні стилі в `src/app/globals.css` |
| БД | PostgreSQL (Neon) через Prisma 7 з `@prisma/adapter-pg` |
| Авторизація | NextAuth 4: email + пароль (bcrypt) і Google OAuth |
| Rate limiting | Upstash Redis; без нього працює запасний лімітер у пам'яті |
| Платежі | Stripe, **зараз вимкнено**: Stripe не працює з українськими акаунтами |
| Хостинг | Vercel, команда `rpman's projects` |

> ⚠️ Next.js 16 має несумісні зміни відносно старіших версій. Перед тим як змінювати
> маршрутизацію, кешування чи middleware, читайте документацію в `node_modules/next/dist/docs/`
> (див. [AGENTS.md](AGENTS.md)).

## Локальний запуск

Потрібні Node.js 20+ і npm.

```bash
npm install          # postinstall сам запускає `prisma generate`
cp .env.production.example .env   # і заповнити значення (див. нижче)
npm run dev          # http://localhost:3000
```

> 🛑 **Локальний `.env` зараз вказує на ПРОДАКШН-базу.** Усе, що ви створюєте чи видаляєте
> в dev-режимі, відбувається на живих даних. Для експериментів створіть окрему гілку бази
> в Neon і підставте її `DATABASE_URL`.

### Змінні середовища

| Змінна | Обов'язкова | Призначення |
|--------|:-----------:|-------------|
| `DATABASE_URL` | так | Рядок підключення до Postgres (Neon) |
| `NEXTAUTH_URL` | так | Базова адреса сайту без `/` у кінці. Локально `http://localhost:3000` |
| `NEXTAUTH_SECRET` | так | Згенерувати: `openssl rand -hex 32` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | для входу через Google | OAuth-клієнт з Google Cloud |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | ні | Спільний rate limiter. Підходить і пара `KV_REST_API_URL` / `KV_REST_API_TOKEN` з інтеграції Vercel |
| `NEXT_PUBLIC_PAYMENTS_ENABLED` | ні | `true` вмикає Stripe Checkout. Без неї бронювання безкоштовні |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | лише з платежами | Ключі Stripe |

На Vercel env-змінні підхоплюються **лише новим деплоєм**: після зміни потрібен Redeploy.

### База даних

```bash
npx prisma migrate dev       # застосувати міграції до бази з DATABASE_URL (локально / dev-гілка)
npx prisma migrate deploy    # те саме для продакшну, без генерації нових міграцій
npx tsx prisma/seed.ts       # демо-виконавці для каталогу (tsx не в залежностях, npx його завантажить)
npx prisma studio            # переглянути дані в браузері
```

Схема лежить у [prisma/schema.prisma](prisma/schema.prisma) (`User`, `Vendor`, `Service`, `Event`,
`Booking`, `Review`, `Guest`, `Timeline`, `Availability`, `Conversation`, `Message`). Prisma Client
генерується в `src/generated/prisma`; код отримує його через `getDb()` з `src/lib/db.ts`.

**Демо-виконавці.** Seed створює виконавців з email на `@eventsphere.com` і без пароля, тож
увійти під ними неможливо. Інтерфейс показує їх з позначкою «Демо», без рейтингу, а бронювати
їх чи писати їм не можна ([src/lib/demo.ts](src/lib/demo.ts)). Реєстрацію на цей домен закрито.

## Скрипти

| Команда | Що робить |
|---------|-----------|
| `npm run dev` | Dev-сервер на Turbopack |
| `npm run build` | Продакшн-збірка |
| `npm run start` | Запуск зібраної версії |
| `npm run lint` | ESLint |

## Структура

```
prisma/              схема, міграції, seed
src/app/             сторінки та API (App Router)
  api/               auth, bookings, conversations, events (гості, таймлайн),
                     vendors, smart-match, payments, google-calendar
  catalog/           каталог виконавців і сторінка виконавця
  smart-match/       підбір виконавців під бюджет
  planner/           планувальник заходу
  messages/          чат
  dashboard/, me/    кабінет клієнта
  vendor/            кабінет виконавця
  pro/               тарифи
  daily/             демо-сторінка (дані захардкоджені, на сторінці є банер)
  terms/, privacy/   юридичні сторінки (тексти в src/lib/legal.ts)
src/components/
  afisha/            поточний дизайн головної, «Афіша»
  noir/, carnival/, atlas/   попередні редакції, головна їх уже не використовує
src/lib/             auth, db, match (движок Smart Match), ratelimit, conversations, stripe…
```

## Деплой

Деплой іде через GitHub-інтеграцію Vercel: push у `main` збирає й публікує прод. Запускати
`vercel deploy` вручну не потрібно. Локальна папка `.vercel/` прив'язана до старого проєкту
з іншого акаунта, тому CLI-команди `vercel env` / `vercel redeploy` звідси не працюють.
Змінні й редеплой робіть через дашборд Vercel.

## Перевірка змін

- Відповідь 200 і правдоподібна сторінка ще не означають, що вона працює: частину розділів
  колись наповнювали вигаданими масивами. Перевіряйте, що сторінка читає БД (`getDb()`)
  і що згенеровані нею посилання відкриваються.
- Авторизацію перевіряйте справжнім входом, а не через `/api/auth/providers`.
- Якщо вхід поштою працює, а через Google ні, майже завжди винен `NEXTAUTH_URL`
  (розділ про `NEXTAUTH_URL` у [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)).

## Відомі обмеження

- Онлайн-оплати вимкнено. Варіанти для України (WayForPay, Fondy, LiqPay, mono) описані
  в [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md).
- `/daily` працює на демо-даних.
- Реквізити оператора в `src/lib/legal.ts` ще не заповнені.
