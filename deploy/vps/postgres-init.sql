-- Выполнить под суперпользователем PostgreSQL на VPS (один раз).
-- psql -U postgres -f deploy/vps/postgres-init.sql

CREATE USER asteria WITH PASSWORD 'CHANGE_ME_DB_PASSWORD';
CREATE DATABASE asteria OWNER asteria;
\c asteria
GRANT ALL ON SCHEMA public TO asteria;
ALTER SCHEMA public OWNER TO asteria;
