# Чеклист переноса Астерии на VPS (REG.RU + ISPmanager 6)

## Локально (WSL) — желательно до VPS
- [ ] Прогнан сценарий из [INSTRUCTION-WSL.md](./INSTRUCTION-WSL.md)
- [ ] Админка, загрузки и сборка `npm run build` работают на `http://127.0.0.1:3000`

## До переноса
- [ ] Куплен VPS (рекомендуется от 4 GB RAM) с Ubuntu
- [ ] Установлен ISPmanager 6
- [ ] Домен указывает A-записью на IP VPS
- [ ] Есть доступ root / SSH

## На сервере
- [ ] Установлены Node.js 20+ (лучше 22), Nginx, PostgreSQL, PM2 (или через панель)
- [ ] Создана БД `asteria` и пользователь (или через `postgres-init.sql`)
- [ ] Код в `/var/www/asteria` (git clone)
- [ ] Скопирован `.env` из `env.production.example` и заполнен
- [ ] `UPLOAD_DIR` существует и доступен на запись
- [ ] Выполнен `bash deploy/vps/deploy.sh`
- [ ] Сайт в ISPmanager: обработчик Node.js / proxy на порт 3000
- [ ] Выпущен SSL (Let's Encrypt)
- [ ] `SITE_URL=https://ваш-домен.ru`, `TRUST_PROXY=true`

## Проверка
- [ ] https://домен.ru открывается
- [ ] /admin/login — вход
- [ ] Создание статьи / услуги
- [ ] Загрузка изображения в редакторе
- [ ] Форма «Консультация» отправляет письмо
- [ ] `pm2 status` показывает `asteria` online
- [ ] Бэкапы: БД + `storage/uploads`

## Обновление
```bash
cd /var/www/asteria
git pull
bash deploy/vps/deploy.sh
```
