#!/usr/bin/env bash
#
# Астерия — полная установка на VPS Рег.ру (Ubuntu 24.04, без Vercel/Supabase)
# Запуск от root:  sudo bash deploy/vps/setup-regru.sh
#
# Что делает:
#   1) Основа: обновления, часовой пояс, firewall (ufw)
#   2) Node 22 + PM2
#   3) PostgreSQL (локальная БД), создание БД/pользователя из .env
#   4) Swap (защита от OOM при сборке)
#   5) .env, npm ci, миграции, next build
#   6) Запуск через PM2 + автозапуск при старте
#   7) Nginx + Let's Encrypt (если DNS уже указывает на сервер)
#
# Требование: файлы проекта уже лежат в /var/www/asteria
# (git clone или распакованный архив). Пароли/secret берутся из .env.

set -euo pipefail

# ----------------------------------------------------------------------------
# Пути и переменные
# ----------------------------------------------------------------------------
APP_DIR="/var/www/asteria"
ENV_FILE="$APP_DIR/.env"
ENV_TEMPLATE="$APP_DIR/deploy/vps/.env.asteria-law.ru"

log()  { echo -e "\e[1;32m[+]\e[0m $*"; }
warn() { echo -e "\e[1;33m[!]\e[0m $*"; }
err()  { echo -e "\e[1;31m[x]\e[0m $*" >&2; }

if [[ $EUID -ne 0 ]]; then
  err "Запускай от root: sudo bash $0"
  exit 1
fi

if [[ ! -d "$APP_DIR" ]]; then
  err "Не найден каталог $APP_DIR. Сначала положи туда проект (git clone или архив)."
  exit 1
fi

# Кладём .env
if [[ ! -f "$ENV_FILE" ]]; then
  if [[ -f "$ENV_TEMPLATE" ]]; then
    cp "$ENV_TEMPLATE" "$ENV_FILE"
    log "Скопирован .env из $ENV_TEMPLATE -> $ENV_FILE"
  else
    err "Нет .env и нет шаблона $ENV_TEMPLATE. Добавь .env вручную."
    exit 1
  fi
else
  log ".env уже существует: $ENV_FILE"
fi

# shellcheck disable=SC1091
set -a; source "$ENV_FILE"; set +a

# ----------------------------------------------------------------------------
# Разбор DATABASE_URL (user:pass@host:port/db)
# ----------------------------------------------------------------------------
_uu="${DATABASE_URL#*://}"
_userpass="${_uu%%@*}"
DB_USER="${_userpass%%:*}"
DB_PASS="${_userpass#*:}"
_hostport="${_uu#*@}"
_hostport="${_hostport%%/*}"
DB_HOST="${_hostport%%:*}"
DB_PORT="${_hostport#*:}"
_dbpart="${_uu#*@}"; _dbpart="${_dbpart#*/}"
DB_NAME="${_dbpart%%\?*}"

# Домен из SITE_URL
_DOMAIN="${SITE_URL#*://}"
DOMAIN="${_DOMAIN%%/}"

log "БД:     postgres://$DB_USER:***@$DB_HOST:$DB_PORT/$DB_NAME"
log "Домен:  $DOMAIN"

# ----------------------------------------------------------------------------
# 1. Основа системы
# ----------------------------------------------------------------------------
export DEBIAN_FRONTEND=noninteractive
log "Обновление системы и базовые пакеты"
apt-get update -y
apt-get upgrade -y
apt-get install -y curl ca-certificates gnupg ufw git nginx certbot python3-certbot-nginx

timedatectl set-timezone Europe/Moscow 2>/dev/null || true
hostnamectl set-hostname asteria 2>/dev/null || true

log "Firewall (ufw)"
ufw allow 22/tcp >/dev/null 2>&1 || true
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 'Nginx Full' >/dev/null 2>&1 || true
ufw --force enable >/dev/null 2>&1 || true
ufw status || true

# ----------------------------------------------------------------------------
# 2. Node.js 22 + PM2
# ----------------------------------------------------------------------------
log "Node.js 22"
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 22 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node -v; npm -v

log "PM2"
npm install -g pm2
PM2=$(command -v pm2)

# ----------------------------------------------------------------------------
# 3. PostgreSQL
# ----------------------------------------------------------------------------
log "PostgreSQL"
apt-get install -y postgresql postgresql-contrib
systemctl enable --now postgresql

# Создаём пользователя и БД (идемпотентно)
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
  log "Создан пользователь $DB_USER"
else
  log "Пользователь $DB_USER уже есть"
fi
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
  log "Создана БД $DB_NAME"
else
  log "БД $DB_NAME уже есть"
fi
sudo -u postgres psql -c "GRANT ALL ON SCHEMA public TO $DB_USER;" -d "$DB_NAME" || true
sudo -u postgres psql -c "ALTER SCHEMA public OWNER TO $DB_USER;" -d "$DB_NAME" || true

# ----------------------------------------------------------------------------
# 4. Swap (защита от OOM при next build)
# ----------------------------------------------------------------------------
log "Swap 4G"
if [[ ! -f /swapfile ]]; then
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# ----------------------------------------------------------------------------
# 5. Сборка
# ----------------------------------------------------------------------------
cd "$APP_DIR"
mkdir -p storage/uploads storage/logs
chmod -R u+rwX storage

log "npm ci"
npm ci

log "Миграции БД"
npm run db:deploy

log "Сборка Next.js"
NODE_OPTIONS=--max-old-space-size=3072 npm run build

# ----------------------------------------------------------------------------
# 6. Запуск через PM2
# ----------------------------------------------------------------------------
log "PM2: запуск asteria"
$PM2 delete asteria >/dev/null 2>&1 || true
$PM2 start deploy/vps/ecosystem.config.cjs
$PM2 save
# Автозапуск при перезагрузке
($PM2 startup systemd -u "$USER" --hp "$HOME" 2>/dev/null || true) >/dev/null

# ----------------------------------------------------------------------------
# 7. Nginx + Let's Encrypt
# ----------------------------------------------------------------------------
log "Nginx site"
NGINX_CONF="/etc/nginx/sites-available/asteria"
cat > "$NGINX_CONF" <<EOF
upstream asteria_next {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 6M;

    location / {
        proxy_pass http://asteria_next;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
        proxy_buffering off;
    }
}
EOF
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/asteria
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
log "Nginx настроен на $DOMAIN (http). Проверь: http://$DOMAIN"

log "Let's Encrypt"
if certbot --nginx --no-eff-email -d "$DOMAIN" -d "www.$DOMAIN" --agree-tos --redirect; then
  # После SSL обновить SITE_URL на https (уже https) и перечитать env
  pm2 reload deploy/vps/ecosystem.config.cjs --update-env || true
  log "SSL выпущен. Сайт: https://$DOMAIN"
else
  warn "Certbot не прошёл (возможно DNS ещё не указывает на сервер)."
  warn "Когда A-записи обновятся — выполни:"
  warn "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --redirect"
  warn "  cd $APP_DIR && sudo pm2 reload deploy/vps/ecosystem.config.cjs --update-env"
fi

# ----------------------------------------------------------------------------
# Итог
# ----------------------------------------------------------------------------
log "Готово!"
echo "------------------------------------------------------------"
echo "  Сайт:        https://$DOMAIN"
echo "  Админка:     https://$DOMAIN/admin/login"
echo "  Логин:       $ADMIN_LOGIN"
echo "  PM2 статус:  $PM2 status"
echo "------------------------------------------------------------"
warn "Не забудь вписать Яндекс app-пароль в $ENV_FILE (SMTP_PASS) и перезапустить:"
warn "  cd $APP_DIR && sudo pm2 reload deploy/vps/ecosystem.config.cjs --update-env"
