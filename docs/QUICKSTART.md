# Quick Start Guide

Get your Travel Photo Blog admin up and running in minutes!

## 🚀 Fast Setup (5 minutes)

### 1. Install Dependencies ✅
```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Required: Database
DATABASE_URL="postgresql://user:password@localhost:5432/travel_photo_blog"

# Required: Auth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Required: UploadThing (from uploadthing.com)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 3. Set Up Database

#### Option A: Automated Script (Recommended)
```bash
./scripts/setup.sh
```

This will:
- Verify environment variables
- Test database connection
- Generate Prisma client
- Create database tables
- Seed with your existing JSON data

#### Option B: Manual Steps
```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push

# Migrate JSON data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

## 🎉 You're Ready!

- 🌐 **Public Site**: http://localhost:3000
- 🔐 **Sign In**: http://localhost:3000/auth/signin
- ⚙️ **Admin Dashboard**: http://localhost:3000/admin
- 🗄️ **Database GUI**: Run `npm run db:studio`

## 📧 Default Admin Account

After seeding, you can sign in with:
- **Email**: `admin@example.com`
- Use the magic link sent to your email

## 🔑 Getting Credentials

### Database (Choose One)

**Supabase** (Easiest for beginners):
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Paste into `DATABASE_URL`

**Local PostgreSQL**:
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14
createdb travel_photo_blog
```

### UploadThing (Required for uploads)

1. Go to [uploadthing.com](https://uploadthing.com)
2. Sign up (free plan available)
3. Create a new app
4. Copy `Secret` → `UPLOADTHING_SECRET`
5. Copy `App ID` → `UPLOADTHING_APP_ID`

### Google OAuth (Optional)

1. [Google Cloud Console](https://console.cloud.google.com)
2. Create project
3. Enable Google+ API
4. Create OAuth credentials
5. Add redirect: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret

## 🛠️ Common Issues

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
brew services list

# Test connection
psql $DATABASE_URL
```

### "Prisma Client not found"
```bash
npm run db:generate
```

### "Unauthorized" in admin
Check that your user has `role: 'admin'` in the database:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

### Upload errors
- Verify UPLOADTHING credentials are correct
- Check console for detailed error messages

## 📚 Next Steps

1. **Upload Photos**: Go to `/admin/photos`
2. **Create a Place**: Go to `/admin/places` (coming soon)
3. **Write a Review**: Go to `/admin/reviews` (coming soon)
4. **Plan a Trip**: Go to `/admin/trips` (coming soon)

## 🚢 Production Deployment

See `ADMIN_SETUP.md` for detailed production deployment guide.

Quick deploy to Vercel:
```bash
# Push to GitHub
git add .
git commit -m "Initial admin setup"
git push

# Deploy on Vercel
vercel
```

Remember to add all environment variables in Vercel dashboard!

## 📖 Documentation

- `ADMIN_SETUP.md` - Comprehensive setup guide
- `README.md` - Project overview
- `prisma/schema.prisma` - Database schema reference

---

**Need help?** Check the troubleshooting section in `ADMIN_SETUP.md`
