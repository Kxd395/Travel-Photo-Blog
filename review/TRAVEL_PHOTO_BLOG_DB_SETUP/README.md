# Travel Photo Blog — Remote Database Setup

Use this folder to keep your SSH connection details and database creation steps for the travel photo blog project. All commands below assume you are working from the project root (`/Users/VScode_Projects/projects/travel-photo-blog`).

## 1. Collect Your Server Credentials

Fill in the following details before running any scripts:

- **SSH host (IP / DNS)**: `__ADD_HOST__`
- **SSH username**: `__ADD_USER__`
- **SSH port**: `22`
- **Private key path**: `~/.ssh/id_ed25519`
- **Database engine**: PostgreSQL 16+
- **Database name**: `travel_photo_blog`
- **Database user**: `travel_admin`
- **Database password**: `__ADD_STRONG_PASSWORD__`

> Replace the `__ADD_*__` placeholders with your real values. The helper script reads these either from environment variables or from inline defaults you edit inside the file.

## 2. Quick SSH Test

```bash
ssh -i ~/.ssh/id_ed25519 -p 22 __ADD_USER__@__ADD_HOST__ "echo 'Travel blog SSH connection OK'"
```

If you see the confirmation message, the connection is working. If not, check VPN/Tailscale status, key permissions (`chmod 600 ~/.ssh/id_ed25519`), and that the server’s firewall allows SSH traffic.

## 3. Database Bootstrap Script

Run the helper script to create the database, role, and extensions:

```bash
bash review/TRAVEL_PHOTO_BLOG_DB_SETUP/scripts/setup_travel_blog_db.sh
```

The script performs the following via SSH:

1. Creates the database role if it does not exist.
2. Creates the database owned by that role.
3. Enables useful extensions (`uuid-ossp`, `pgcrypto`) if available.
4. Outputs connection strings you can drop into `.env.local` or deployment settings.

You can override credentials on the fly:

```bash
DB_HOST=203.0.113.42 DB_PORT=2222 DB_USER=deploy DB_NAME=travel_photo_blog bash review/TRAVEL_PHOTO_BLOG_DB_SETUP/scripts/setup_travel_blog_db.sh
```

## 4. Manual SQL (If You Prefer)

If you would rather run the SQL manually after SSH’ing in:

```sql
CREATE ROLE travel_admin LOGIN PASSWORD 'your-strong-password';
CREATE DATABASE travel_photo_blog OWNER travel_admin;
GRANT ALL PRIVILEGES ON DATABASE travel_photo_blog TO travel_admin;
\c travel_photo_blog
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## 5. Update Your Application Environment

Once the database exists, create or update `.env.local` with the new connection strings:

```
DATABASE_URL="postgresql://travel_admin:your-strong-password@__DB_HOST__:5432/travel_photo_blog"
SHADOW_DATABASE_URL="postgresql://travel_admin:your-strong-password@__DB_HOST__:5432/travel_photo_blog_shadow"
```

If you move to Prisma or Drizzle later, those URLs become the single source of truth.

## 6. Next Steps

- Add Prisma/Drizzle schema files and run migrations.
- Build a protected `/admin` area for content management.
- Automate `next build` revalidation when content changes.

Keep this folder updated as credentials rotate so the team always has a single source of truth.
