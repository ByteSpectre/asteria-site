-- Выполнить под суперпользователем PostgreSQL на VPS (один раз).
-- Перед запуском замените CHANGE_ME_DB_PASSWORD на тот же пароль, что в .env
-- (DATABASE_URL / DIRECT_URL).
--
--   sudo -u postgres psql -f deploy/vps/postgres-init.sql

CREATE USER asteria WITH PASSWORD 'asteria123';
CREATE DATABASE asteria OWNER asteria;
\c asteria
GRANT ALL ON SCHEMA public TO asteria;
ALTER SCHEMA public OWNER TO asteria;
