# Перенос Астерии на VPS (REG.RU + ISPmanager 6)

Всё необходимое лежит в папке `deploy/vps/`. Сайт — **Next.js** (Node.js), база — **PostgreSQL на том же сервере**, файлы — в `UPLOAD_DIR`, без Supabase и без Vercel Blob.

**Перед VPS** проверьте стек локально в WSL: [INSTRUCTION-WSL.md](./INSTRUCTION-WSL.md).

---

## 1. Что купить / подготовить

| Нужно | Рекомендация |
|--------|----------------|
| VPS | Ubuntu 22.04 / 24.04, **от 4 GB RAM**, 2 vCPU |
| Панель | ISPmanager 6 (у REG.RU часто идёт с тарифом) |
| Домен | A-запись на IP VPS |
| Node.js | **20 LTS или 22** |
| PostgreSQL | 15+ (через панель или `apt`) |

Обычный «виртуальный хостинг» (только PHP) **не подойдёт**.

---

## 2. Установка ПО на сервер

Подключитесь по SSH (`root` или пользователь с sudo).

### 2.1. Node.js 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
node -v   # v22.x
npm -v
```

### 2.2. PM2 (процесс сайта)

```bash
npm i -g pm2
pm2 startup
# выполните команду, которую выведет pm2
```

### 2.3. PostgreSQL

**Вариант A — через ISPmanager:**  
«Базы данных» → PostgreSQL → создать БД `asteria`, пользователя `asteria`, запомнить пароль.

**Вариант B — вручную:**

```bash
apt-get install -y postgresql postgresql-contrib
sudo -u postgres psql -f /var/www/asteria/deploy/vps/postgres-init.sql
# перед этим замените CHANGE_ME_DB_PASSWORD в SQL-файле
```

### 2.4. Nginx

Обычно уже есть с ISPmanager. Если нет:

```bash
apt-get install -y nginx
```

---

## 3. Код проекта на сервер

```bash
mkdir -p /var/www/asteria
cd /var/www
# замените URL на ваш репозиторий
git clone https://github.com/ByteSpectre/asteria-site.git asteria
cd /var/www/asteria
```

Если репозиторий приватный — используйте SSH-ключ или deploy token.

Альтернатива без git: залить архив проекта (без `node_modules` и `.next`) по SFTP в `/var/www/asteria`.

---

## 4. Файл окружения `.env`

```bash
cd /var/www/asteria
cp deploy/vps/env.production.example .env
nano .env
```

Обязательно заполните:

1. **`DATABASE_URL` и `DIRECT_URL`** — один и тот же URL к Postgres на `127.0.0.1:5432`
2. **`ADMIN_PASSWORD_HASH_B64`** — bcrypt в base64 (сырой hash с `$` Next.js ломает):
   ```bash
   node -e "require('bcryptjs').hash('ВАШ_ПАРОЛЬ',12).then(h=>console.log(Buffer.from(h).toString('base64')))"
   ```
3. **`AUTH_SECRET`** — длинная случайная строка (≥ 32 символа)
4. **`SITE_URL`** — `https://ваш-домен.ru` (без слэша в конце)
5. **`TRUST_PROXY=true`** — обязательно за Nginx / ISPmanager
6. **`UPLOAD_DIR=/var/www/asteria/storage/uploads`**
7. **SMTP_*** — почта для заявок с формы

Сгенерировать хэш пароля админки (base64):

```bash
cd /var/www/asteria
node -e "require('bcryptjs').hash('ВАШ_ПАРОЛЬ', 12).then(h=>console.log(Buffer.from(h).toString('base64')))"
```

Случайный `AUTH_SECRET`:

```bash
openssl rand -hex 32
```

В `.env` используйте `ADMIN_PASSWORD_HASH_B64="..."`. Не кладите «сырой» bcrypt в `ADMIN_PASSWORD_HASH` — dotenv в Next.js портит символы `$`.

---

## 5. Первый запуск

```bash
cd /var/www/asteria
chmod +x deploy/vps/deploy.sh
bash deploy/vps/deploy.sh
```

Скрипт:

- создаст `storage/uploads` и `storage/logs`
- установит зависимости (`npm ci`)
- применит миграции Prisma
- соберёт Next.js
- запустит приложение через PM2 на `127.0.0.1:3000`

Проверка:

```bash
pm2 status
curl -I http://127.0.0.1:3000
```

---

## 6. Домен и HTTPS в ISPmanager 6

1. Создайте сайт (WWW-домен) с вашим доменом.
2. Направьте трафик на Node.js **порт 3000** (прокси / «обработчик Node.js» — название зависит от версии панели).
3. Включите SSL Let's Encrypt для домена.
4. Убедитесь, что в прокси передаются заголовки:
   - `Host`
   - `X-Real-IP`
   - `X-Forwarded-For`
   - `X-Forwarded-Proto`

Если панель даёт править Nginx вручную — образец: `deploy/vps/nginx.asteria.conf`.

На голом Nginx без панели:

```bash
cp deploy/vps/nginx.asteria.conf /etc/nginx/sites-available/asteria
# замените example.ru на ваш домен
ln -s /etc/nginx/sites-available/asteria /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

После выпуска SSL снова проверьте `SITE_URL=https://...` и перезапустите:

```bash
pm2 reload asteria --update-env
```

---

## 7. Права на загрузки

```bash
mkdir -p /var/www/asteria/storage/uploads
chown -R $USER:$USER /var/www/asteria/storage
# если PM2 от другого пользователя — выдайте ему запись в storage/
```

---

## 8. Что проверить после запуска

- Главная: `https://домен.ru`
- Админка: `https://домен.ru/admin/login`
- Создание услуги / статьи
- Загрузка картинки в редакторе
- Кнопка «Заказать консультацию» → письмо на `CONTACT_TO_EMAIL`
- `pm2 logs asteria`

---

## 9. Обновление сайта

```bash
cd /var/www/asteria
git pull
bash deploy/vps/deploy.sh
```

---

## 10. Резервные копии

Делайте бэкап минимум двух вещей:

1. **База PostgreSQL**

```bash
pg_dump -U asteria -h 127.0.0.1 asteria > backup-$(date +%F).sql
```

2. **Файлы** — каталог `/var/www/asteria/storage/uploads`

Файл `.env` храните отдельно и **не** коммитьте в Git.

---

## 11. Содержимое папки `deploy/vps`

| Файл | Назначение |
|------|------------|
| `INSTRUCTION.md` | эта инструкция (VPS) |
| `INSTRUCTION-WSL.md` | локальная проверка в WSL Ubuntu |
| `CHECKLIST.md` | короткий чеклист |
| `env.production.example` | шаблон `.env` для VPS |
| `env.wsl.example` | шаблон `.env` для WSL |
| `ecosystem.config.cjs` | конфиг PM2 |
| `nginx.asteria.conf` | пример Nginx |
| `postgres-init.sql` | создание БД/пользователя |
| `deploy.sh` | установка / обновление |

---

## Частые проблемы

| Симптом | Что сделать |
|---------|-------------|
| `pm2` online, сайт 502 | Nginx не проксирует на `127.0.0.1:3000` |
| Ошибка БД при сборке | Проверьте `DATABASE_URL` / пароль / что Postgres слушает |
| Админ-логин не работает | Пересоздайте `ADMIN_PASSWORD_HASH`, сверьте `ADMIN_LOGIN` |
| Картинки не грузятся | Права на `UPLOAD_DIR`, пустой `BLOB_READ_WRITE_TOKEN` |
| Rate limit / CSRF | `SITE_URL` = точный https-домен, `TRUST_PROXY=true` |
| Письма не уходят | SMTP: app-password Gmail / пароль почты, порт 465 |

---

## Важно

- Supabase **не нужен** — Postgres на VPS.
- Vercel Blob **не нужен** — локальный `UPLOAD_DIR`.
- Сайт слушает только localhost:3000; снаружи — Nginx + SSL.
