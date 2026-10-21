# Деплой: Vercel (сейчас) и VPS (позже)

Один репозиторий, два окружения. Код сам выбирает хранилище файлов и поведение cookies по переменным окружения.

| | **Vercel** | **VPS (Ubuntu)** |
|---|------------|------------------|
| База | Supabase / Neon (`DATABASE_URL` + `DIRECT_URL`) | Postgres на сервере |
| Файлы редактора | **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`) | `UPLOAD_DIR` на диске |
| Деплой | Push в `main` → Vercel | Push в `main` → GitHub Actions (если настроены Secrets) |
| `SITE_URL` | `https://ваш-проект.vercel.app` или свой домен | `https://hekl.ru` |
| `TRUST_PROXY` | `false` | `true` |
| `TRUST_CLOUDFLARE` | `false` (если не весь трафик через CF) | обычно `false` |

---

## Vercel — что настроить сейчас

### 1. Проект на Vercel

Репозиторий уже подключён. Каждый push в **`main`** собирает preview/production.

### 2. База (Supabase)

1. Создайте проект Supabase (или Neon).
2. В **Vercel → Settings → Environment Variables** (Production + Preview):

```env
DATABASE_URL=postgresql://...pooler...:6543/postgres?pgbouncer=true
```

Если проект подключён к Supabase через Vercel Storage, **`POSTGRES_URL_NON_POOLING`** уже есть — миграции при сборке используют его автоматически.

Иначе добавьте вручную:

```env
DIRECT_URL=postgresql://postgres:...@db.xxxx.supabase.co:5432/postgres?sslmode=require
```

### 3. Vercel Blob (загрузки в админке)

Vercel Dashboard → Storage → **Blob** → подключить к проекту.

Появится `BLOB_READ_WRITE_TOKEN` — добавьте в env (часто подставляется автоматически).

Без Blob загрузка картинок в редакторе на Vercel вернёт **503**.

### 4. Админка и форма

```env
ADMIN_LOGIN=admin@asteria.com
ADMIN_PASSWORD_HASH_B64=...   # см. .env.example
AUTH_SECRET=...                 # openssl rand -hex 32

SITE_URL=https://ваш-домен.vercel.app
TRUST_PROXY=false
TRUST_CLOUDFLARE=false

CONTACT_TO_EMAIL=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=...
SMTP_PASS=...
```

Хэш пароля (base64):

```bash
node -e "require('bcryptjs').hash('ваш_пароль',12).then(h=>console.log(Buffer.from(h).toString('base64')))"
```

**Первый админ:** `ADMIN_LOGIN` + `ADMIN_PASSWORD_HASH_B64` создают запись в БД **только пока таблица `admins` пустая**. После первого входа / появления админов в панели переменные env для логина больше не используются — управляйте учётками в **Администраторы**.

`UPLOAD_DIR` на Vercel **не нужен**, если есть Blob.

### 5. Проверка после деплоя

- Главная открывается
- `/admin/login` — вход
- Загрузка изображения в редакторе (Blob)
- Форма «Консультация» → письмо

### 6. GitHub Actions и Vercel

Workflow `.github/workflows/deploy-vps.yml` **не мешает** Vercel: если Secrets VPS не заданы, шаг пропускается.

Когда появится VPS — добавьте Secrets → тот же push будет обновлять и Vercel, и сервер (или отключите Vercel).

---

## VPS — когда будет сервер

Полная инструкция: [`deploy/vps/INSTRUCTION.md`](vps/INSTRUCTION.md)

Кратко:

```env
DATABASE_URL=postgresql://asteria:...@127.0.0.1:5432/asteria
DIRECT_URL=...тот же...
BLOB_READ_WRITE_TOKEN=          # пусто
UPLOAD_DIR=/var/www/asteria/storage/uploads
SITE_URL=https://hekl.ru
TRUST_PROXY=true
TRUST_CLOUDFLARE=false
```

Автодеплой: GitHub Secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` → см. раздел 10 в `INSTRUCTION.md`.

Первый запуск на сервере — вручную: клон → `.env` → `npm ci` → `db:deploy` → `build` → PM2 → Nginx/SSL (разделы 3–7 в `INSTRUCTION.md`).

---

## Частые проблемы

| Симптом | Vercel | VPS |
|---------|--------|-----|
| Build висит на migrate | `DIRECT_URL` на :5432, не :6543 | Postgres доступен |
| Нет таблиц | Задайте `DIRECT_URL`, redeploy | `npm run db:deploy` |
| Картинки 503 | Подключите Blob | `UPLOAD_DIR` + права |
| Админ не входит | `ADMIN_PASSWORD_HASH_B64`, `SITE_URL=https://...`; если админы уже в БД — пароль из панели, не из env | то же + `TRUST_PROXY` |
| GitHub Actions красный | Норма без VPS Secrets | Secrets + права `deploy` на `/var/www/asteria` |
