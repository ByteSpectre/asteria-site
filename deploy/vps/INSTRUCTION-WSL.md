# Локальная проверка на WSL Ubuntu (перед VPS)

Цель: прогнать тот же сценарий, что на VPS (Postgres + `npm run build` + `next start` / PM2), на вашем ПК в WSL — и убедиться, что всё работает **до** покупки/настройки сервера.

Полный деплой на REG.RU: [INSTRUCTION.md](./INSTRUCTION.md).

---

## 0. Что вы проверяете

| Как на VPS | Как в WSL |
|------------|-----------|
| Ubuntu + Node 22 | Ubuntu в WSL + Node 22 |
| PostgreSQL | Docker Compose или Postgres в WSL |
| `.env` production | `.env` из `env.wsl.example` |
| `deploy.sh` / PM2 | те же команды локально |
| Nginx + HTTPS | пока не обязательны; сайт на `http://127.0.0.1:3000` |

Если здесь всё ок — на VPS останутся домен, Nginx, SSL и тот же стек (см. [INSTRUCTION.md](./INSTRUCTION.md)).

---

## 1. Подготовка WSL

В PowerShell (от администратора, один раз):

```powershell
wsl --install -d Ubuntu-24.04
```

Перезагрузка при необходимости → откройте **Ubuntu** → создайте пользователя Linux.

Проверка:

```bash
uname -a
lsb_release -a
```

---

## 2. Где держать проект

**Рекомендуется** клон внутрь файловой системы Linux (быстрее `npm` / `next build`):

```bash
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/ByteSpectre/asteria-site.git asteria
cd ~/projects/asteria
```

Если клонировать не хотите — можно работать с Windows-диском:

```bash
cd "/mnt/c/Users/Admin/Asteria Site"
```

Минусы пути `/mnt/c/...`: медленнее установка зависимостей и сборка. Для проверки подойдёт; для комфорта лучше `~/projects/asteria`.

---

## 3. Установить Node.js 22

```bash
sudo apt-get update
sudo apt-get install -y curl ca-certificates
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # v22.x
npm -v
```

Опционально PM2 (как на VPS):

```bash
sudo npm i -g pm2
```

---

## 4. PostgreSQL

### Вариант A — Docker (проще, как в репозитории)

Нужен Docker Desktop с включённой интеграцией WSL **или** Docker Engine в Ubuntu.

Из корня проекта:

```bash
cd ~/projects/asteria   # или ваш путь
docker compose up -d
```

В корневом `docker-compose.yml` Postgres слушает **порт 5433** на хосте:

- пользователь: `asteria`
- пароль: `asteria_dev` (если не задавали `POSTGRES_PASSWORD`)
- БД: `asteria`

Проверка:

```bash
docker compose ps
```

### Вариант B — Postgres через apt в WSL

```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres psql -c "CREATE USER asteria WITH PASSWORD 'asteria_dev';"
sudo -u postgres psql -c "CREATE DATABASE asteria OWNER asteria;"
sudo -u postgres psql -d asteria -c "GRANT ALL ON SCHEMA public TO asteria; ALTER SCHEMA public OWNER TO asteria;"
```

Тогда в `.env` порт будет **5432**, не 5433.

---

## 5. Файл `.env` для WSL

```bash
cd ~/projects/asteria
cp deploy/vps/env.wsl.example .env
nano .env
```

Важно:

1. Сгенерируйте **`ADMIN_PASSWORD_HASH_B64`** и **`AUTH_SECRET`** (команды ниже).
2. Не кладите «сырой» bcrypt в `ADMIN_PASSWORD_HASH` — Next.js dotenv ломает `$` в значении. Используйте base64.
3. **`SITE_URL=http://127.0.0.1:3000`** — для локальной проверки без HTTPS.
4. **`TRUST_PROXY=false`** — пока нет Nginx перед приложением.
5. SMTP можно оставить пустым: сайт и админка заработают; форма заявок проверится после заполнения SMTP.

```bash
# Хэш пароля админки в base64 (запомните сам пароль)
node -e "require('bcryptjs').hash('admin123',12).then(h=>console.log(Buffer.from(h).toString('base64')))"

# Секрет сессии
openssl rand -hex 32
```

В `.env`:
```env
ADMIN_PASSWORD_HASH_B64="вставьте_вывод_команды_выше"
```

Если `bcryptjs` ещё не установлен:

---

## 6. Сборка и запуск «как на VPS»

### Способ 1 — скрипт деплоя

```bash
cd ~/projects/asteria
# если снова увидите «set: pipefail» — это CRLF:
sed -i 's/\r$//' deploy/vps/deploy.sh
chmod +x deploy/vps/deploy.sh
bash deploy/vps/deploy.sh
```

Скрипт ждёт PM2. Если PM2 нет:

```bash
sudo npm i -g pm2
```

Вне `/var/www/asteria` скрипт сам поднимает приложение через PM2 из текущей папки.

### Способ 2 — вручную (удобнее в WSL)

```bash
cd ~/projects/asteria
mkdir -p storage/uploads storage/logs
npm ci
npm run db:deploy
npm run build
npm run start
```

Сайт: **http://127.0.0.1:3000**  
Админка: **http://127.0.0.1:3000/admin/login**

Остановка: `Ctrl+C`.

Фоном через PM2 с текущей папки:

```bash
pm2 start npm --name asteria -- start -- -H 127.0.0.1 -p 3000
pm2 status
pm2 logs asteria
```

---

## 7. Чеклист проверки (тот же смысл, что на VPS)

- [ ] `http://127.0.0.1:3000` открывается
- [ ] `/admin/login` — вход с вашим паролем
- [ ] Создание / редактирование услуги или статьи
- [ ] Загрузка изображения в редакторе (файлы появляются в `storage/uploads`)
- [ ] (опционально) форма «Консультация» при заполненном SMTP
- [ ] После `Ctrl+C` / `pm2 stop` сайт останавливается без ошибок в логе

Если всё зелёное — стек готов к переносу; дальше следуйте [INSTRUCTION.md](./INSTRUCTION.md).

---

## 8. Типичные проблемы в WSL

| Симптом | Решение |
|---------|---------|
| `npm ci` очень долго | Клонируйте проект в `~/projects`, не в `/mnt/c/...` |
| Не подключается к БД | Docker запущен? Порт **5433** в URL? `docker compose ps` |
| `ECONNREFUSED 127.0.0.1:5432` | У вас Docker на 5433 — исправьте `.env` |
| bcrypt / логин не работает | Хэш без `\$`, пароль совпадает с тем, что хешировали |
| CSRF / загрузка картинок | `SITE_URL` должен совпадать с адресом в браузере (`http://127.0.0.1:3000`) |
| Админка: «Неверный ввод» / не входит | 1) `SITE_URL=http://127.0.0.1:3000` (не https). 2) Хэш без `\$`. 3) После правки `.env`: пересобрать или `pm2 reload ... --update-env`. 4) Вводите капчу с картинки |
| `deploy.sh` ищет `/var/www/asteria` | В WSL скрипт сам стартует через `pm2` из текущей папки; либо `npm run start` |
| `: invalid option name` / `set: pipefail` | В скрипте были Windows CRLF. Обновите файл из репо или: `sed -i 's/\r$//' deploy/vps/deploy.sh` |
| Порт 3000 занят | `npx next start -H 127.0.0.1 -p 3001` и обновите `SITE_URL` |

---

## 9. Остановка и очистка

```bash
# сайт
pm2 delete asteria 2>/dev/null || true
# или Ctrl+C если npm run start

# Postgres (Docker)
docker compose down
# данные БД сохранить: не добавляйте -v
# полностью стереть данные: docker compose down -v
```

---

## 10. Связь с VPS

После успешной проверки в WSL на сервере:

1. Те же Node 22 + Postgres + `.env` (уже с `https://домен` и `TRUST_PROXY=true`).
2. Тот же `npm ci` → `db:deploy` → `build` → PM2.
3. Добавляются Nginx, Certbot/SSL и `SITE_URL=https://...` (без панели).

Шаблон env для WSL: [env.wsl.example](./env.wsl.example).
