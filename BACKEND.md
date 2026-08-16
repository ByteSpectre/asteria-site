# Backend Астерии

Приложение использует Next.js App Router как интерфейс и сервер, Prisma ORM и PostgreSQL. Статьи и услуги хранятся в PostgreSQL, загрузки редактора — в Vercel Blob на Vercel или в постоянной директории на обычном Node.js-хостинге.

## Локальный запуск

1. Скопируйте `.env.example` в `.env` и задайте реальные значения.
2. Запустите PostgreSQL: `docker compose up -d postgres`.
3. Примените миграции: `npm run db:deploy`.
4. Запустите проект: `npm run dev`.

Локальный `docker-compose.yml` публикует PostgreSQL на порту `5433`.

## Переменные окружения

- `DATABASE_URL` — PostgreSQL для runtime (на Supabase — Transaction pooler `:6543`).
- `DIRECT_URL` — прямое подключение для `prisma migrate` (`db.<project>.supabase.co:5432`). Без него migrate через pooler зависает, поэтому build пропускает migrate, пока `DIRECT_URL` не задан.
- `ADMIN_LOGIN` — логин единственного администратора.
- `ADMIN_PASSWORD_HASH` — bcrypt-хэш пароля, открытый пароль хранить нельзя.
- `AUTH_SECRET` — случайная строка длиной не менее 32 символов для подписи сессий и CAPTCHA.
- `BLOB_READ_WRITE_TOKEN` — токен Vercel Blob для production на Vercel.
- `UPLOAD_DIR` — постоянная директория загрузок на обычном Node.js-хостинге.
- `SITE_URL` — канонический origin сайта (нужен для CSRF-проверки загрузок на кастомном домене).
- `CONTACT_TO_EMAIL` — куда приходят заявки с формы (обязателен в production).
- `CONTACT_FROM_EMAIL` — отправитель (обычно совпадает с SMTP-ящиком).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` — SMTP для Nodemailer.
- `TRUST_PROXY` — `true` только если reverse proxy сам перезаписывает `X-Forwarded-For` / `X-Real-IP`.

Символы `$` в bcrypt-хэше внутри локального `.env` экранируются как `\$`. В панели Vercel значение вводится без обратных слешей.

## Развёртывание на Vercel

1. Подключите проект к Vercel.
2. Подключите PostgreSQL из Vercel Marketplace (например Neon), чтобы проект получил `DATABASE_URL`.
3. Создайте публичное Vercel Blob-хранилище и подключите его к проекту, чтобы появился `BLOB_READ_WRITE_TOKEN`.
4. Задайте `ADMIN_LOGIN`, `ADMIN_PASSWORD_HASH` и новый production `AUTH_SECRET`.
5. Примените миграции к production-базе командой `npm run db:deploy` с production `DATABASE_URL`.
6. Выполните production deployment.

Серверная загрузка ограничена 4 МБ, проверяется по реальной сигнатуре файла и доступна только авторизованному администратору с того же origin.

## Развёртывание на обычном Node.js-хостинге

```bash
npm ci
npm run db:deploy
npm run build
npm run start
```

Установите HTTPS на reverse proxy. `UPLOAD_DIR` должна находиться на постоянном диске и включаться в резервные копии. Файл `.env` не должен попадать в Git.

## Контент

- `/admin/knowledge` — CRUD статей и BlockNote-редактор.
- `/admin/services` — CRUD услуг.
- `/knowledge` и `/knowledge/[slug]` — публичные статьи.
- `/services` и `/services/[slug]` — публичные услуги.

Текст и структура блоков статьи хранятся в PostgreSQL как JSON.
