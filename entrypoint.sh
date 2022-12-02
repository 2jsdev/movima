#!/bin/sh

echo "[BASH]: Waitin for PostgreSQL to start..."

while ! netcat -z -v 0.0.0.0 5432; do
  sleep 0.1
done

echo "[BASH]: PostgreSQL started"

npm run db:create:dev
npm run migrate:dev
npm run start:dev
