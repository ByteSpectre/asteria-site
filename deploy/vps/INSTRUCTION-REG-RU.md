# Развёртывание Астерии на VPS Рег.ру (без Vercel и Supabase)

Полный стек целиком на сервере:

```
Интернет → Nginx (443/80, Let's Encrypt) → PM2 → Next.js (127.0.0.1:3000)
                             └── PostgreSQL (127.0.0.1:5432)
                             └── файлы редактора в UPLOAD_DIR
```

**Ничего от Vercel и Supabase не требуется.** `@vercel/blob` отключается
(пустой `BLOB_READ_WRITE_TOKEN`), файлы пишутся на диск, база — локальный Postgres.

> Это адаптация общего гайда `deploy/vps/INSTRUCTION.md` под Рег.ру.
> Отличия Рег.ру: покупка в панели, возможная блокировка исходящих SMTP-портов,
> и DNS-зона, которой управляет сам Рег.ру.

---

## 1. Что заказать в Рег.ру

### 1.1. Тип сервера
У Рег.ру два варианта VPS:
- **«Классические VPS»** (SSD-XEN) — старый тариф, OpenVZ/Xen.
- **«Облачные серверы» (Рег.облако / reg.cloud)** — KVM + NVMe, почасовая оплата.

Рекомендую **облачные серверы (Рег.облако)**: современный KVM, NVMe, проще
масштабировать, есть почасовая оплата.

### 1.2. Операционная система
Выберите **«Шаблон ОС» → Ubuntu 24.04 LTS** (чистый, _без_ ispmanager/панели).

⚠️ **Не берите шаблон «Node.js»** — там Ubuntu 20.04 и старая Node.js v8/yarn.
Для этого проекта Node ставится вручную (раздел 4).

### 1.3. Ресурсы
Минимум для этого проекта (Next.js + Postgres + сборка):

| Параметр | Минимум | Комфортно |
|----------|---------|-----------|
| vCPU     | 2       | 4         |
| RAM      | 4 ГБ    | 8 ГБ      |
| Диск     | 60 ГБ   | 80 ГБ     |
| Тип диска| SSD     | NVMe      |

Подходящие тарифы Рег.облака:
- `Std C4-M4-D80` — 4 vCPU / 4 ГБ RAM / 80 ГБ SSD (≈1960 ₽/мес)
- `High C2-M4-D60` — 2 vCPU / 4 ГБ RAM / 60 ГБ NVMe (≈2180 ₽/мес)

Если бюджет позволяет — 8 ГБ RAM сильно упрощают `next build` и Postgres.

### 1.4. Регион
Москва / Санкт-Петербург / Самара. Выберите ближайший к вашей аудитории
(обычно Москва).

### 1.5. Сеть и IP
- Возьмите **публичный IPv4** (у Рег.ру он идёт бесплатно, но его нужно
  заказать/включить при создании сервера).
- SSH — по паролю root или сразу добавьте **SSH-ключ** (надёжнее).
- По желанию включите автоматические **снапшоты/бэкапы**.

> Если вы физлицо и берёте сервер в дата-центре РФ, Рег.ру может попросить
> документы/договор. Это нормально и делается один раз.

После заказа придёт письмо: **IP-адрес**, логин `root`, пароль.

---

## 2. DNS у Рег.ру (домен)

Домен должен быть у Рег.ру (или делегирован на NS Рег.ру).

1. В личном кабинете Рег.ру откройте **Домены → ваш домен → DNS-записи**
   (или управляйте зоной в панели Рег.облака).
2. Добавьте **A-записи**:
   - `@` → `<IP вашего сервера>`
   - `www` → `<IP вашего сервера>`
3. Уберите лишние A-записи (например, на старый хостинг).
4. Дождитесь обновления — проверьте:

```bash
dig ваш-домен.ru A +short
dig www.ваш-домен.ru A +short
```

Должен вернуться IP сервера. **Без этого Let's Encrypt не выпустит сертификат.**

---

## 3. Подключение по SSH (Windows)

В PowerShell (предустановлен в Windows):

```powershell
ssh root@<IP_сервера>
```

Введите пароль root из письма. Если блокирует — разрешите SSH-порт в брандмауэре
сервера (в панели Рег.ру или через `ufw`, см. раздел 4).

Сразу смените пароль root и задайте hostname:

```bash
passwd root
hostnamectl set-hostname asteria
```

---

## 4. Базовая настройка и защита

```bash
# Обновления
apt update && apt upgrade -y
apt install -y curl ca-certificates gnupg ufw git

# Часовая зона (Москва)
timedatectl set-timezone Europe/Moscow
```

**Firewall (UFW):**

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 22/tcp
ufw enable
ufw status
```

Создайте отдельного пользователя для деплоя (без sudo он не обязателен):

```bash
adduser --disabled-password --gecos "" deploy
mkdir -p /home/deploy/.ssh
# положите свой публичный ключ:
#   ssh-copy-id deploy@<IP>
# или вручную добавьте строку в /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

Дальше можно работать от `deploy` (или остаться под root — проще для первого запуска).

---

## 5. Установка ПО

### 5.1. Node.js 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v   # v22.x
npm -v
```

### 5.2. PM2

```bash
npm i -g pm2
pm2 startup
# выполните команду, которую выведет pm2 (для systemd)
```

### 5.3. PostgreSQL

На Ubuntu 24.04 ставится Postgres 16:

```bash
apt install -y postgresql postgresql-contrib
systemctl enable --now postgresql
```

Создайте базу (пароль замените на свой):

```bash
sudo -u postgres psql <<'SQL'
CREATE USER asteria WITH PASSWORD 'ЗАМЕНИ_НА_ПАРОЛЬ';
CREATE DATABASE asteria OWNER asteria;
\c asteria
GRANT ALL ON SCHEMA public TO asteria;
ALTER SCHEMA public OWNER TO asteria;
SQL
```

Либо отредактируйте `deploy/vps/postgres-init.sql` под тот же пароль и выполните:

```bash
sudo -u postgres psql -f deploy/vps/postgres-init.sql
```

> Пароль в SQL и в `.env` (`DATABASE_URL`/`DIRECT_URL`) должен **совпадать**.

### 5.4. Nginx + Certbot

```bash
apt install -y nginx certbot python3-certbot-nginx
systemctl enable --now nginx
```

---

## 6. Код проекта

### Вариант A — git clone (нужен доступ к репозиторию с сервера)
Репозиторий `https://github.com/ByteSpectre/asteria-site.git`.
Из РФ GitHub доступен, но может быть нестабилен/медленен — при ошибках см. Вариант B.

```bash
mkdir -p /var/www/asteria
chown -R deploy:deploy /var/www/asteria
cd /var/www
git clone https://github.com/ByteSpectre/asteria-site.git asteria
cd /var/www/asteria
```

Приватный репозиторий — нужен **deploy key** (read-only) или SSH.

### Вариант B — загрузка архива (надёжнее из РФ)
На своём ПК соберите архив **без** `node_modules` и `.next`:

```powershell
# из папки проекта
7z a -xr!node_modules -xr!.next asteria-site.zip .
```

И залейте на сервер:

```bash
scp asteria-site.zip deploy@<IP>:/tmp/
# на сервере:
mkdir -p /var/www/asteria
cd /var/www/asteria
unzip /tmp/asteria-site.zip
```

---

## 7. `.env`

```bash
cd /var/www/asteria
mkdir -p storage/uploads storage/logs
chmod -R u+rwX storage
chmod 600 .env

cp deploy/vps/env.production.example .env
nano .env
```

Заполните:

```env
NODE_ENV=production

DATABASE_URL="postgresql://asteria:ЗАМЕНИ_НА_ПАРОЛЬ@127.0.0.1:5432/asteria?schema=public"
DIRECT_URL="postgresql://asteria:ЗАМЕНИ_НА_ПАРОЛЬ@127.0.0.1:5432/asteria?schema=public"

ADMIN_LOGIN="admin@asteria.com"
ADMIN_PASSWORD_HASH_B64="..."            # см. ниже
AUTH_SECRET="..."                         # openssl rand -hex 32

SITE_URL="https://ваш-домен.ru"           # без "/" в конце, https
TRUST_PROXY="true"                        # всегда за Nginx
TRUST_CLOUDFLARE="false"                  # у Рег.ру не Cloudflare — false

BLOB_READ_WRITE_TOKEN=""                  # отключаем Vercel Blob
UPLOAD_DIR="/var/www/asteria/storage/uploads"

CONTACT_TO_EMAIL="leads@ваш-домен.ru"
CONTACT_FROM_EMAIL="Asteria <noreply@ваш-домен.ru>"
SMTP_HOST="smtp.yandex.ru"                # см. раздел про почту
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="..."
SMTP_PASS="..."
```

### 7.1. Пароль админки (base64)

```bash
npm ci   # чтобы был bcryptjs
node -e "require('bcryptjs').hash('ВАШ_ПАРОЛЬ',12).then(h=>console.log(Buffer.from(h).toString('base64')))"
```

Полученную строку положите в `ADMIN_PASSWORD_HASH_B64` (в кавычках).
Не используйте «сырой» `$2b$12$...` — Next.js ломает `$` в dotenv.

### 7.2. AUTH_SECRET

```bash
openssl rand -hex 32
```

> `ADMIN_LOGIN`/`ADMIN_PASSWORD_HASH_B64` создают первого админа **только пока
> таблица `admins` пустая**. Дальше учётками управляют в панели «Администраторы».

---

## 8. Сборка и первый запуск

На 4 ГБ RAM сборке Next.js может не хватить памяти. Добавьте swap и ограничьте heap:

```bash
# swap 4 ГБ (на случай OOM при build / Postgres)
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

Сборка и запуск:

```bash
cd /var/www/asteria

npm ci
npm run db:deploy            # применяет миграции (prisma migrate deploy)
npm run build                # при OOM: NODE_OPTIONS=--max-old-space-size=3072 npm run build

pm2 start deploy/vps/ecosystem.config.cjs
pm2 save
```

Проверка:

```bash
pm2 status
curl -I http://127.0.0.1:3000
```

Сайт слушает только `127.0.0.1:3000` — наружу отдаёт Nginx.

---

## 9. Nginx + HTTPS (Let's Encrypt)

```bash
cd /var/www/asteria
sudo cp deploy/vps/nginx.asteria.conf /etc/nginx/sites-available/asteria
sudo nano /etc/nginx/sites-available/asteria
```

Замените `server_name` на ваш домен (оба). Уберите неверные имена.

```bash
sudo ln -sf /etc/nginx/sites-available/asteria /etc/nginx/sites-enabled/asteria
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Проверка по HTTP: `http://ваш-домен.ru` — сайт должен открыться через прокси.

Теперь SSL:

```bash
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

после выдачи обновите `SITE_URL` на `https://ваш-домен.ru` и перечитайте env:

```bash
cd /var/www/asteria
pm2 reload deploy/vps/ecosystem.config.cjs --update-env
```

---

## 10. Почта формы заявок (важно!)

Форма консультации шлёт письмо через Nodemailer + SMTP. На Рег.ру есть нюансы:

⚠️ **Исходящие SMTP-порты (25 и часто 465) на VPS Рег.ру могут быть заблокированы
по умолчанию** (антиспам). Это подтверждается отзывами.

Что делать — три варианта:

1. **Открыть порты через поддержку Рег.ру.** Напишите тикет: разрешить исходящий
   SMTP на портах 25/465 (или хотя бы 587) для вашего VPS. Это самый простой путь
   к любому SMTP-провайдеру.
2. **Использовать порт 587 + STARTTLS.** Если 465 закрыт, а 587 открыт — поставьте
   в `.env`:
   ```env
   SMTP_HOST="smtp.yandex.ru"
   SMTP_PORT="587"
   SMTP_SECURE="false"      # STARTTLS вместо implicit TLS
   ```
3. **Поставить доменную почту от Рег.ру / ISPmanager** — тогда SMTP-сервер на том же
   провайдере, и проблем с блэклистом быть не должно.

Рекомендация для `.ru`-домена: **Яндекс 360 для домена** (`smtp.yandex.ru:465`) или
почта **VK/Mail.ru** (`smtp.mail.ru:465`) с **app-паролем**. Пароль приложения
создаётся в настройках почты (не основной пароль).

Проверка после настройки: отправить тест формы → письмо приходит.

---

## 11. Права на загрузки

```bash
cd /var/www/asteria
mkdir -p storage/uploads storage/logs
chown -R deploy:deploy storage
chmod -R u+rwX storage
```

`UPLOAD_DIR` и права должны совпадать с `.env`.

---

## 12. Проверка после запуска

- [ ] `https://ваш-домен.ru` — главная открывается
- [ ] `https://ваш-домен.ru/admin/login` — вход в админку
- [ ] Создание услуги / статьи сохраняется в БД
- [ ] Загрузка картинки в редакторе пишется в `storage/uploads`
- [ ] Форма «Консультация» → письмо на почту (если SMTP настроен)
- [ ] `pm2 logs asteria` — без ошибок

---

## 13. Резервное копирование

```bash
# База
pg_dump -U asteria -h 127.0.0.1 asteria > /var/backups/asteria-$(date +%F).sql

# Файлы
rsync -av /var/www/asteria/storage/uploads /var/backups/

# Крон (раз в день в 04:00)
crontab -e
# 0 4 * * * pg_dump -U asteria -h 127.0.0.1 asteria > /var/backups/asteria-$(date +\%F).sql
```

`.env` храните отдельно, **не** коммитьте в Git.

---

## 14. Обновление

```bash
cd /var/www/asteria
git pull origin main      # или залейте новый архив

npm ci
npm run db:deploy
npm run build
pm2 reload deploy/vps/ecosystem.config.cjs --update-env
pm2 save
```

---

## 15. Частые проблемы (Рег.ру)

| Симптом | Причина / решение |
|---------|-------------------|
| `pm2` online, снаружи 502 | Nginx не проксирует на `127.0.0.1:3000`; `nginx -t`, `systemctl status nginx`, проверьте `server_name` |
| Certbot: DNS / SERVFAIL | A-записи на IP сервера; DNS ещё не обновился; подождать и повторить |
| `next build` умирает по памяти | Мало RAM; добавьте swap (раздел 8), `NODE_OPTIONS=--max-old-space-size=3072` |
| Письма не уходят | Порт 465/25 заблокирован Рег.ру → тикет в поддержку, или порт 587 + `SMTP_SECURE=false`, или app-пароль |
| Админ не входит | `ADMIN_PASSWORD_HASH_B64` (base64, не сырой hash), `SITE_URL=https://...`; если админы уже в БД — пароль из панели |
| Картинки не грузятся | права на `UPLOAD_DIR`, `BLOB_READ_WRITE_TOKEN` пустой, `SITE_URL` точный |
| Ошибка БД | `DATABASE_URL`, пароль в SQL и `.env` совпадают; `systemctl status postgresql` |
| CSRF / загрузки не работают | точный `SITE_URL`, `TRUST_PROXY=true` |
| `git clone` из GitHub медленно/рвётся | Используйте загрузку архива (раздел 6, Вариант B) |

---

## Итоговый стек на сервере

- **OS:** Ubuntu 24.04 LTS (Рег.облако, без панели)
- **Runtime:** Node.js 22 + PM2
- **БД:** PostgreSQL 16 на `127.0.0.1:5432`
- **Web:** Nginx → `127.0.0.1:3000` (Next.js), Let's Encrypt
- **Файлы:** `UPLOAD_DIR` на диске
- **Почта:** SMTP (проверить открытие портов)

**Нет Vercel (Blob), нет Supabase.** Всё в одном сервере.
