#!/bin/bash
# Timeweb / Ubuntu cloud-init for Asteria (Next.js + Postgres + Nginx + PM2).
# Paste this whole file into Cloud-init. Edit REPO_URL if the GitHub repo differs.
# After boot: cat /root/asteria-bootstrap.txt
set -euxo pipefail
export DEBIAN_FRONTEND=noninteractive

REPO_URL="https://github.com/ByteSpectre/asteria-site.git"
APP_DIR="/var/www/asteria"
LOG="/var/log/asteria-cloud-init.log"
exec > >(tee -a "$LOG") 2>&1

echo "==> $(date -Is) Asteria bootstrap start"

apt-get update
apt-get install -y curl ca-certificates gnupg ufw git nginx certbot python3-certbot-nginx postgresql postgresql-contrib

if ! command -v node >/dev/null 2>&1 || [[ "$(node -v 2>/dev/null || true)" != v22* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

npm i -g pm2

systemctl enable --now postgresql nginx

DB_PASS="$(openssl rand -hex 24)"
AUTH_SECRET="$(openssl rand -hex 32)"
ADMIN_PASS="$(openssl rand -hex 12)"
ADMIN_LOGIN="admin@asteria.com"

sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='asteria'" | grep -q 1 \
  && sudo -u postgres psql -c "ALTER ROLE asteria WITH PASSWORD '${DB_PASS}';" \
  || sudo -u postgres psql -c "CREATE USER asteria WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='asteria'" | grep -q 1 \
  || sudo -u postgres createdb -O asteria asteria
sudo -u postgres psql -d asteria -c "GRANT ALL ON SCHEMA public TO asteria; ALTER SCHEMA public OWNER TO asteria;"

mkdir -p "$APP_DIR"
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone --branch main --depth 1 "$REPO_URL" "$APP_DIR"
else
  git -C "$APP_DIR" fetch origin main
  git -C "$APP_DIR" reset --hard origin/main
fi

mkdir -p "$APP_DIR/storage/uploads" "$APP_DIR/storage/logs"
chmod -R u+rwX "$APP_DIR/storage"

cd "$APP_DIR"
npm ci

ADMIN_HASH_B64="$(
  node -e "require('bcryptjs').hash(process.argv[1], 12).then((h) => console.log(Buffer.from(h).toString('base64')))" "$ADMIN_PASS"
)"

PUBLIC_IP="$(curl -4 -fsS --max-time 8 https://ifconfig.me || hostname -I | awk '{print $1}')"
SITE_URL="http://${PUBLIC_IP}"

cat > "$APP_DIR/.env" <<ENV
NODE_ENV=production
DATABASE_URL="postgresql://asteria:${DB_PASS}@127.0.0.1:5432/asteria?schema=public"
DIRECT_URL="postgresql://asteria:${DB_PASS}@127.0.0.1:5432/asteria?schema=public"
ADMIN_LOGIN="${ADMIN_LOGIN}"
ADMIN_PASSWORD_HASH_B64="${ADMIN_HASH_B64}"
AUTH_SECRET="${AUTH_SECRET}"
SITE_URL="${SITE_URL}"
TRUST_PROXY="true"
BLOB_READ_WRITE_TOKEN=""
UPLOAD_DIR="${APP_DIR}/storage/uploads"
CONTACT_TO_EMAIL=""
CONTACT_FROM_EMAIL=""
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER=""
SMTP_PASS=""
ENV
chmod 600 "$APP_DIR/.env"

npm run db:deploy
npm run build

cat > /etc/nginx/sites-available/asteria <<'NGINX'
upstream asteria_next {
    server 127.0.0.1:3000;
    keepalive 32;
}
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    client_max_body_size 6M;
    location / {
        proxy_pass http://asteria_next;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_buffering off;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/asteria /etc/nginx/sites-enabled/asteria
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

pm2 start "$APP_DIR/deploy/vps/ecosystem.config.cjs" || pm2 reload "$APP_DIR/deploy/vps/ecosystem.config.cjs" --update-env
pm2 save
env PATH="$PATH" pm2 startup systemd -u root --hp /root | tail -n 1 | bash || true

ufw allow OpenSSH
ufw allow "Nginx Full"
ufw --force enable

cat > /root/asteria-bootstrap.txt <<INFO
Asteria cloud-init finished: $(date -Is)

URL (until DNS/SSL): ${SITE_URL}
Admin login: ${ADMIN_LOGIN}
Admin password: ${ADMIN_PASS}

Next:
1. Point domain A-records to ${PUBLIC_IP}
2. nano ${APP_DIR}/.env  → SITE_URL=https://your-domain.ru  and SMTP
3. certbot --nginx -d your-domain.ru -d www.your-domain.ru
4. pm2 reload ${APP_DIR}/deploy/vps/ecosystem.config.cjs --update-env

Change the admin password after first login.
Log: ${LOG}
INFO
chmod 600 /root/asteria-bootstrap.txt

echo "==> $(date -Is) Asteria bootstrap done"
