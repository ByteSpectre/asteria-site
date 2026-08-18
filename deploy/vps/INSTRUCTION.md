# Перенос Астерии на VPS (чистый Ubuntu)

> **Сейчас на Vercel?** См. [`../DEPLOY.md`](../DEPLOY.md) — один репозиторий для Vercel и VPS.

Инструкция для **Ubuntu 22.04 / 24.04 без панели** (без ISPmanager).  
Стек: **Nginx → PM2 → Next.js (127.0.0.1:3000)**, **PostgreSQL** на том же сервере, файлы в `UPLOAD_DIR`.  
Supabase и Vercel Blob не нужны.

Локальная проверка перед VPS: [INSTRUCTION-WSL.md](./INSTRUCTION-WSL.md).

---

## 1. Что нужно

| Нужно | Рекомендация |
|--------|----------------|
| VPS | Ubuntu 22.04 / 24.04, **от 4 GB RAM**, 2 vCPU |
| SSH | root или пользователь с `sudo` |
| Домен | A-записи `@` и `www` → IP VPS (DNS у регистратора / DNSAdmin) |
| ПО | Node.js 22, Nginx, PostgreSQL 15+, Certbot, PM2 |

Обычный shared-хостинг (только PHP) **не подойдёт**.

---

## Быстрый старт: Cloud-init (Timeweb)

При создании сервера вставьте содержимое [`cloud-init.sh`](./cloud-init.sh) в поле **Cloud-init**. Скрипт ставит Node 22, Postgres, Nginx, PM2, клонирует репозиторий, собирает сайт и пишет пароль админки.

1. ОС: **Ubuntu 24.04** (или 22.04), **2 vCPU / 4 ГБ**, публичный IPv4, **без панели**.
2. Cloud-init: весь файл `deploy/vps/cloud-init.sh` (при другом GitHub-репо поправьте `REPO_URL` в начале).
3. Дождитесь статуса сервера **Running** + 5–10 минут на сборку.
4. SSH:

```bash
cat /root/asteria-bootstrap.txt
```

Там URL по IP, логин и пароль админки.

5. DNS: A `@` и `www` → IP сервера.
6. Домен и SSL:

```bash
nano /var/www/asteria/.env   # SITE_URL=https://hekl.ru и SMTP
certbot --nginx -d hekl.ru -d www.hekl.ru
pm2 reload /var/www/asteria/deploy/vps/ecosystem.config.cjs --update-env
```

Если репозиторий **приватный**, cloud-init с HTTPS-клоном не сработает — либо сделайте репо публичным на время установки, либо после создания сервера клонируйте по SSH вручную (разделы 3–6 ниже).

Лог установки: `/var/log/asteria-cloud-init.log`.

---

## 2. DNS до Certbot

Пока DNS не отдаёт IP сервера, Let's Encrypt не выпустит сертификат.

```bash
dig ваш-домен.ru A +short
dig www.ваш-домен.ru A +short
```

Должен быть IP вашего VPS (без лишних чужих A-записей).

---

## 3. Установка ПО

```bash
sudo apt-get update
sudo apt-get install -y curl ca-certificates gnupg ufw
```

### 3.1. Node.js 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # v22.x
npm -v
```

### 3.2. PM2

```bash
sudo npm i -g pm2
pm2 startup
# выполните команду, которую выведет pm2
```

### 3.3. PostgreSQL

```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Создайте БД (пароль замените):

```bash
sudo -u postgres psql <<'SQL'
CREATE USER asteria WITH PASSWORD 'CHANGE_ME_DB_PASSWORD';
CREATE DATABASE asteria OWNER asteria;
\c asteria
GRANT ALL ON SCHEMA public TO asteria;
ALTER SCHEMA public OWNER TO asteria;
SQL
```

Или после клона репозитория отредактируйте и выполните `deploy/vps/postgres-init.sql`.

Опционально Postgres в Docker: `deploy/vps/docker-compose.postgres.yml`.

### 3.4. Nginx + Certbot

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx
```

### 3.5. Файрвол (рекомендуется)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 4. Код проекта

```bash
sudo mkdir -p /var/www/asteria
sudo chown -R "$USER:$USER" /var/www/asteria
cd /var/www
git clone https://github.com/ByteSpectre/asteria-site.git asteria
cd /var/www/asteria
```

Приватный репозиторий — SSH-ключ или deploy token.  
Без git: залейте архив (без `node_modules` и `.next`) в `/var/www/asteria`.

---

## 5. Файл `.env`

```bash
cd /var/www/asteria
cp deploy/vps/env.production.example .env
nano .env
```

Обязательно:

| Переменная | Значение |
|------------|----------|
| `DATABASE_URL` / `DIRECT_URL` | один URL к Postgres на `127.0.0.1:5432` |
| `ADMIN_LOGIN` | логин админки |
| `ADMIN_PASSWORD_HASH_B64` | bcrypt в **base64** (см. ниже) |
| `AUTH_SECRET` | ≥ 32 символа |
| `SITE_URL` | `https://ваш-домен.ru` (без `/` в конце) |
| `TRUST_PROXY` | `true` (сайт за Nginx) |
| `UPLOAD_DIR` | `/var/www/asteria/storage/uploads` |
| `BLOB_READ_WRITE_TOKEN` | пусто |
| SMTP_* | почта формы заявок |

```bash
# Хэш пароля админки (base64). Сырой bcrypt с $ Next.js dotenv ломает.
cd /var/www/asteria
npm ci   # если bcryptjs ещё нет
node -e "require('bcryptjs').hash('ВАШ_ПАРОЛЬ',12).then(h=>console.log(Buffer.from(h).toString('base64')))"

openssl rand -hex 32   # AUTH_SECRET
```

В `.env`: `ADMIN_PASSWORD_HASH_B64="..."` — не кладите «сырой» `$2b$12$...` в `ADMIN_PASSWORD_HASH`.

---

## 6. Первый запуск приложения

```bash
cd /var/www/asteria
chmod +x deploy/vps/deploy.sh
bash deploy/vps/deploy.sh
```

Скрипт создаёт `storage/`, ставит зависимости, миграции, сборку и PM2 на `127.0.0.1:3000`.

```bash
pm2 status
curl -I http://127.0.0.1:3000
```

---

## 7. Nginx + HTTPS

### 7.1. Конфиг сайта

```bash
sudo cp /var/www/asteria/deploy/vps/nginx.asteria.conf /etc/nginx/sites-available/asteria
sudo nano /etc/nginx/sites-available/asteria
```

Замените `example.ru` на ваш домен (оба `server_name`).

```bash
sudo ln -sf /etc/nginx/sites-available/asteria /etc/nginx/sites-enabled/asteria
# если мешает дефолтный сайт:
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Проверка по HTTP: `http://ваш-домен.ru` (пока без SSL тоже должен открываться через прокси).

### 7.2. Let's Encrypt

```bash
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

Если ошибка DNS (`SERVFAIL` / неверный IP) — сначала почините A-записи, потом снова Certbot.

После SSL в `.env` должно быть `SITE_URL=https://ваш-домен.ru`, затем:

```bash
cd /var/www/asteria
pm2 reload deploy/vps/ecosystem.config.cjs --update-env
```

---

## 8. Права на загрузки

```bash
mkdir -p /var/www/asteria/storage/uploads /var/www/asteria/storage/logs
chown -R "$USER:$USER" /var/www/asteria/storage
chmod -R u+rwX /var/www/asteria/storage
```

---

## 9. Проверка после запуска

- https://домен.ru  
- https://домен.ru/admin/login  
- создание услуги / статьи  
- загрузка картинки в редакторе  
- форма консультации (если SMTP заполнен)  
- `pm2 logs asteria`

---

## 10. Обновление

### Вручную

```bash
cd /var/www/asteria
git pull origin main
bash deploy/vps/deploy.sh
```

### Автодеплой с GitHub (как Vercel)

При каждом **push в `main`** GitHub Actions подключается по SSH и запускает `deploy/vps/deploy.sh`.

Workflow: `.github/workflows/deploy-vps.yml`

#### 10.1. Пользователь для деплоя на VPS

Рекомендуется отдельный пользователь (не root):

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG sudo deploy   # опционально; для деплоя sudo не нужен
sudo chown -R deploy:deploy /var/www/asteria
```

#### 10.2. Git на сервере (read-only deploy key)

```bash
sudo -u deploy bash
ssh-keygen -t ed25519 -C "asteria-vps-git" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Публичный ключ → GitHub: **Settings → Deploy keys → Add deploy key** (только **Read**).

```bash
cd /var/www/asteria
git remote -v
# если HTTPS — переключите на SSH:
git remote set-url origin git@github.com:ByteSpectre/asteria-site.git
ssh -T git@github.com
git fetch origin main
```

#### 10.3. SSH-ключ для GitHub Actions

На **своём ПК** (не на сервере):

```bash
ssh-keygen -t ed25519 -C "github-actions-asteria" -f github_actions_deploy -N ""
```

- **Публичный** ключ (`github_actions_deploy.pub`) → на VPS:

```bash
sudo mkdir -p /home/deploy/.ssh
sudo bash -c 'cat github_actions_deploy.pub >> /home/deploy/.ssh/authorized_keys'
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

- **Приватный** ключ (`github_actions_deploy`) → в GitHub репозитория:  
  **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Значение |
|--------|----------|
| `VPS_HOST` | IP или домен сервера |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | содержимое **приватного** ключа целиком |
| `VPS_PORT` | `22` (если другой порт SSH) |

#### 10.4. Проверка

1. Сделайте commit и **push в `main`**.
2. GitHub → **Actions** → workflow **Deploy VPS**.
3. На сервере: `pm2 status`, сайт открывается.

Ручной запуск без push: **Actions → Deploy VPS → Run workflow**.

Файл `.env` на сервере **не** в Git — workflow его не трогает.

---

## 11. Резервные копии

1. База:

```bash
pg_dump -U asteria -h 127.0.0.1 asteria > backup-$(date +%F).sql
```

2. Файлы: `/var/www/asteria/storage/uploads`  
3. Файл `.env` — храните отдельно, **не** коммитьте в Git.

---

## 12. Файлы в `deploy/vps`

| Файл | Назначение |
|------|------------|
| `INSTRUCTION.md` | эта инструкция (чистый Ubuntu) |
| `INSTRUCTION-WSL.md` | локальная проверка в WSL |
| `env.production.example` | шаблон `.env` |
| `env.wsl.example` | шаблон `.env` для WSL |
| `ecosystem.config.cjs` | PM2 |
| `nginx.asteria.conf` | Nginx |
| `postgres-init.sql` | создание БД |
| `docker-compose.postgres.yml` | Postgres в Docker (опционально) |
| `deploy.sh` | установка / обновление |
| `cloud-init.sh` | автоустановка при создании VPS (Timeweb) |
| `.github/workflows/deploy-vps.yml` | автодеплой при push в `main` |

---

## Частые проблемы

| Симптом | Что сделать |
|---------|-------------|
| `pm2` online, снаружи 502 | Nginx не проксирует на `127.0.0.1:3000`; `nginx -t`, `systemctl status nginx` |
| Certbot: DNS / SERVFAIL | A-записи домена на IP VPS; подождать DNS |
| `Missing .env` | `.env` должен лежать в корне проекта (`/var/www/asteria/.env`) |
| Ошибка БД | `DATABASE_URL`, пароль, `systemctl status postgresql` |
| Админ не входит | `ADMIN_PASSWORD_HASH_B64` (не сырой hash), `SITE_URL=https://...` |
| Картинки не грузятся | права на `UPLOAD_DIR`, пустой `BLOB_READ_WRITE_TOKEN` |
| CSRF / загрузки | точный `SITE_URL`, `TRUST_PROXY=true` |
| Письма не уходят | SMTP app-password, порт 465 |
| Actions: Permission denied (publickey) | `VPS_SSH_KEY`, `authorized_keys`, пользователь `deploy` |
| Actions: git fetch failed | Deploy key на GitHub, `git remote` на SSH |
| Actions: Missing .env | `.env` только на сервере, не в репозитории |

---

## Важно

- Панель управления **не нужна** — достаточно SSH + Nginx + PM2 + Postgres.  
- Сайт слушает только `127.0.0.1:3000`; снаружи — Nginx + SSL.  
- DNS можно вести у регистратора / DNSAdmin; ISPmanager для этого проекта не требуется.
