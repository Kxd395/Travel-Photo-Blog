#!/usr/bin/env bash
# Travel Photo Blog remote database bootstrap helper
# Usage: bash review/TRAVEL_PHOTO_BLOG_DB_SETUP/scripts/setup_travel_blog_db.sh
# You can override defaults with environment variables (see below).

set -euo pipefail

# ---- Configuration ---------------------------------------------------------
DB_HOST="${DB_HOST:-__ADD_HOST__}"
DB_PORT="${DB_PORT:-22}"
DB_SSH_USER="${DB_SSH_USER:-__ADD_USER__}"
DB_SSH_KEY="${DB_SSH_KEY:-$HOME/.ssh/id_ed25519}"
DB_NAME="${DB_NAME:-travel_photo_blog}"
DB_ROLE="${DB_ROLE:-travel_admin}"
DB_PASSWORD="${DB_PASSWORD:-__ADD_STRONG_PASSWORD__}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"

if [[ "$DB_HOST" == __ADD_HOST__* || "$DB_SSH_USER" == __ADD_USER__* || "$DB_PASSWORD" == __ADD_STRONG_PASSWORD__* ]]; then
  cat <<MSG
⚠️  Update setup_travel_blog_db.sh with your real SSH host, user, and database password.
    Either edit the defaults inside the script or export DB_HOST / DB_SSH_USER / DB_PASSWORD
    before running. Example:

    DB_HOST=203.0.113.42 DB_SSH_USER=deploy DB_PASSWORD='change-me' \
    bash review/TRAVEL_PHOTO_BLOG_DB_SETUP/scripts/setup_travel_blog_db.sh
MSG
  exit 1
fi

SSH_OPTS=(
  -i "$DB_SSH_KEY"
  -p "$DB_PORT"
  -o StrictHostKeyChecking=accept-new
  -o BatchMode=yes
)

SQL=$(cat <<SQL
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_ROLE}') THEN
    CREATE ROLE ${DB_ROLE} LOGIN PASSWORD '${DB_PASSWORD}';
  END IF;
END
$$;

CREATE DATABASE ${DB_NAME} OWNER ${DB_ROLE};

GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_ROLE};
SQL
)

EXTENSIONS=$(cat <<SQL
\c ${DB_NAME}
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
SQL
)

echo "🚀 Creating database '${DB_NAME}' on ${DB_HOST}:${POSTGRES_PORT}..."

ssh "${SSH_OPTS[@]}" "${DB_SSH_USER}@${DB_HOST}" <<CMD
set -euo pipefail
sudo -u postgres psql <<'PSQL'
${SQL}
PSQL

sudo -u postgres psql <<'PSQL'
${EXTENSIONS}
PSQL
CMD

cat <<DONE
✅ Database created (or already existed).

Add the following connection string to your .env:

DATABASE_URL="postgresql://${DB_ROLE}:${DB_PASSWORD}@${DB_HOST}:${POSTGRES_PORT}/${DB_NAME}"
DONE
