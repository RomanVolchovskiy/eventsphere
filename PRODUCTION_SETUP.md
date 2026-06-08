# 🚀 EventSphere Production Setup Guide

> Дата: 2026-06-08
> Статус: Деплоєно на Vercel ✅
> Наступний крок: Налаштування зовнішніх сервісів

---

## 📋 Чек-лист (виконайте по порядку)

### 1️⃣ Google OAuth Setup (Google Calendar)

**Посилання:** https://console.cloud.google.com

**Кроки:**
1. Увійдіть з Google акаунтом
2. Створіть новий проект або виберіть існуючий
3. Перейдіть: **APIs & Services** → **Library**
4. Пошукайте **"Google Calendar API"** → натисніть **Enable**
5. Перейдіть: **APIs & Services** → **Credentials**
6. Натисніть **+ CREATE CREDENTIALS** → **OAuth Client ID**
7. Якщо побачите "OAuth consent screen" — налаштуйте його:
   - User Type: **External**
   - Application name: **EventSphere**
   - User support email: ваша@пошта.com
   - Developer contact: ваша@пошта.com
   - Збережіть
8. Повернітесь до Credentials, натисніть **+ CREATE CREDENTIALS** → **OAuth Client ID**
9. Application type: **Web application**
10. Authorized JavaScript origins:
    - `https://ваш-домен.com`
    - `http://localhost:3000` (для dev)
11. Authorized redirect URIs:
    - `https://ваш-домен.com/api/auth/callback/google`
    - `http://localhost:3000/api/auth/callback/google`
12. Натисніть **Create** → Скопіюйте:
    - **Client ID** → `GOOGLE_CLIENT_ID`
    - **Client Secret** → `GOOGLE_CLIENT_SECRET`

✅ **Отримані значення:**
```
GOOGLE_CLIENT_ID=копіюйте_звідси
GOOGLE_CLIENT_SECRET=копіюйте_звідси
```

---

### 2️⃣ Stripe Setup (Платежі)

**Посилання:** https://dashboard.stripe.com/apikeys

**Кроки:**
1. Увійдіть на Stripe Dashboard
2. Переконайтесь, що ви в режимі **Live** (не Test)
   - Є toggle у лівому верхньому кутку
3. Перейдіть: **Developers** → **API Keys**
4. Скопіюйте **Secret Key** → `STRIPE_SECRET_KEY`
5. Скопіюйте **Publishable Key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
6. Перейдіть: **Developers** → **Webhooks**
7. Натисніть **Add endpoint**
8. Endpoint URL: `https://ваш-домен.com/api/payments/webhook`
9. Events to send:
   - `checkout.session.completed`
   - `charge.refunded`
10. Натисніть **Add events** → **Create endpoint**
11. На сторінці вебхука натисніть **Reveal** → Скопіюйте signing secret → `STRIPE_WEBHOOK_SECRET`

✅ **Отримані значення:**
```
STRIPE_SECRET_KEY=sk_live_копіюйте_звідси
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_копіюйте_звідси
STRIPE_WEBHOOK_SECRET=whsec_копіюйте_звідси
```

---

### 3️⃣ Vercel Environment Variables Setup

**Посилання:** https://vercel.com/sobakahav-7468s-projects/eventsphere

**Кроки:**
1. Перейдіть на проект на Vercel
2. Натисніть **Settings** → **Environment Variables**
3. Натисніть **Add New**
4. Додайте ВСІ значення нижче:

| Key | Value | Scope |
|-----|-------|-------|
| `NEXTAUTH_URL` | `https://ваш-домен.com` | Production |
| `NEXTAUTH_SECRET` | згенеруйте: `openssl rand -hex 32` | Production |
| `GOOGLE_CLIENT_ID` | Значення з Google | Production |
| `GOOGLE_CLIENT_SECRET` | Значення з Google | Production |
| `STRIPE_SECRET_KEY` | Значення з Stripe | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Значення з Stripe | Production |
| `STRIPE_WEBHOOK_SECRET` | Значення з Stripe | Production |
| `DATABASE_URL` | `postgresql://<user>:<password>@<host>/<db>?sslmode=require` (з Neon Console) | Production |

5. Після додавання кожної змінної натисніть **Save**

---

### 4️⃣ Перевірка домену

**Встановіть домен на Vercel:**
1. Перейдіть на проект → **Settings** → **Domains**
2. Додайте ваш домен або виберіть Vercel domain
3. Vercel автоматично видасть SSL сертифікат (HTTPS)
4. Оновіть `NEXTAUTH_URL` на реальний домен

---

### 5️⃣ Запустіть новий деплой

Після всіх налаштувань:

```bash
vercel deploy --prod
```

---

## ✅ Перевірка на працездатність

Після деплоєму:

1. **Перейдіть на сайт:** https://ваш-домен.com
2. **Спробуйте увійти через Google:** кнопка "Login" → "Google"
3. **Запустіть платіж:** додайте послугу в кошик → checkout
4. **Перевірте Stripe events:** Dashboard → Events → переконайтесь, що `checkout.session.completed` були перейнесені

---

## 🔐 Security Checklist

- [ ] NEXTAUTH_SECRET змінено на новий (не default)
- [ ] Усі credentials використовують Live keys (не Test)
- [ ] HTTPS увімкнено (Vercel автоматично)
- [ ] Webhook сертифіковано (Stripe)
- [ ] Google OAuth редирект URIs правильні
- [ ] .env не комітиться в Git (вже в .gitignore)

---

## 📊 Посилання для моніторингу

| Сервіс | URL |
|--------|-----|
| **Vercel Dashboard** | https://vercel.com/sobakahav-7468s-projects/eventsphere |
| **Google Cloud** | https://console.cloud.google.com |
| **Stripe Dashboard** | https://dashboard.stripe.com |
| **Stripe Events** | https://dashboard.stripe.com/logs/events |
| **Neon Database** | https://console.neon.tech |

---

## 🆘 Troubleshooting

### "OAuth consent screen error"
→ Налаштуйте OAuth consent screen перед створенням credentials

### "Invalid redirect URI"
→ Переконайтесь, що домен у callback URI точно збігається

### "Webhook signature verification failed"
→ Скопіюйте signing secret з вебхука (не API key)

### "Database connection error"
→ Перевірте DATABASE_URL у Vercel env vars

---

**Готово! Сайт повинен бути повністю функціональним на production! 🎉**
