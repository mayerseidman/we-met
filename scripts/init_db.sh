#!/bin/bash

set -e

echo "🚀 Starting database setup..."

export $(grep -v '^#' .env | xargs)

DB_SUPERUSER=${DB_SUPERUSER:-postgres}

echo "💬 Connecting as superuser: $DB_SUPERUSER"

# Create role if not exists
psql -U "$DB_SUPERUSER" -h "$DB_HOST" -p "$DB_PORT" -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || \
  psql -U "$DB_SUPERUSER" -h "$DB_HOST" -p "$DB_PORT" -d postgres -c "CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';"

# Always ensure CREATEDB permission
psql -U "$DB_SUPERUSER" -h "$DB_HOST" -p "$DB_PORT" -d postgres -c "ALTER ROLE ${DB_USER} CREATEDB;"

# Create database if not exists
psql -U "$DB_SUPERUSER" -h "$DB_HOST" -p "$DB_PORT" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
  psql -U "$DB_SUPERUSER" -h "$DB_HOST" -p "$DB_PORT" -d postgres -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

# Grant privileges
psql -U "$DB_SUPERUSER" -h "$DB_HOST" -p "$DB_PORT" -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

echo "✅ Database, role, and permissions set successfully!"
