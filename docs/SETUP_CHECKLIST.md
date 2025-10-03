# ✅ Setup Checklist

Use this checklist to complete your Travel Photo Blog admin CMS setup.

## 📋 Pre-Setup (Already Done ✅)

- [x] Dependencies installed (220 packages)
- [x] Next.js updated to 14.2.33
- [x] Prisma client generated
- [x] Security vulnerabilities addressed (3 minor low-severity remain in auth library, non-critical)
- [x] All admin code implemented
- [x] Documentation created

## 🔧 Required Setup Steps

### Step 1: Environment Configuration

- [ ] Create `.env.local` file:
  ```bash
  cp .env.example .env.local
  ```

- [ ] Generate NEXTAUTH_SECRET:
  ```bash
  openssl rand -base64 32
  ```

- [ ] Fill in `.env.local` with:
  - [ ] `DATABASE_URL` (from Supabase or local PostgreSQL)
  - [ ] `NEXTAUTH_SECRET` (from command above)
  - [ ] `NEXTAUTH_URL` (http://localhost:3000)
  - [ ] `UPLOADTHING_SECRET` (from uploadthing.com)
  - [ ] `UPLOADTHING_APP_ID` (from uploadthing.com)
  - [ ] `GOOGLE_CLIENT_ID` (optional - from Google Cloud)
  - [ ] `GOOGLE_CLIENT_SECRET` (optional - from Google Cloud)

### Step 2: Database Setup

Choose one option:

**Option A: Automated (Recommended)**
- [ ] Run setup script:
  ```bash
  ./scripts/setup.sh
  ```
  This will:
  - Verify environment variables
  - Test database connection
  - Create all tables
  - Seed with JSON data

**Option B: Manual**
- [ ] Push schema to database:
  ```bash
  npm run db:push
  ```
- [ ] Seed with existing data:
  ```bash
  npm run db:seed
  ```

### Step 3: Verify Installation

- [ ] Start dev server:
  ```bash
  npm run dev
  ```

- [ ] Check these pages work:
  - [ ] http://localhost:3000 (public site)
  - [ ] http://localhost:3000/auth/signin (sign in page)
  - [ ] http://localhost:3000/admin (admin dashboard - requires auth)

- [ ] Test sign in:
  - [ ] With Google OAuth (if configured)
  - [ ] With email magic link (if SMTP configured)

- [ ] Test admin features:
  - [ ] View dashboard statistics
  - [ ] Navigate to Photos page
  - [ ] Upload a test photo
  - [ ] Drag to reorder photos
  - [ ] Delete a test photo

## 🔍 Getting Credentials

### Database (Required)

#### Supabase (Recommended for Beginners)
1. [ ] Go to https://supabase.com
2. [ ] Create account (free tier available)
3. [ ] Create new project
4. [ ] Wait for provisioning (~2 minutes)
5. [ ] Go to Settings → Database
6. [ ] Copy "Connection string" under "Connection Pooling"
7. [ ] Paste into `.env.local` as `DATABASE_URL`

#### Local PostgreSQL
1. [ ] Install PostgreSQL:
   ```bash
   brew install postgresql@14
   ```
2. [ ] Start service:
   ```bash
   brew services start postgresql@14
   ```
3. [ ] Create database:
   ```bash
   createdb travel_photo_blog
   ```
4. [ ] Use this DATABASE_URL:
   ```
   postgresql://localhost:5432/travel_photo_blog
   ```

### UploadThing (Required)

1. [ ] Go to https://uploadthing.com
2. [ ] Sign up (free tier: 2GB storage, 25GB bandwidth/month)
3. [ ] Create new app
4. [ ] Click "API Keys"
5. [ ] Copy "Secret Key" → `UPLOADTHING_SECRET`
6. [ ] Copy "App ID" → `UPLOADTHING_APP_ID`

### Google OAuth (Optional but Recommended)

1. [ ] Go to https://console.cloud.google.com
2. [ ] Create new project or select existing
3. [ ] Enable "Google+ API"
4. [ ] Go to "Credentials"
5. [ ] Create "OAuth 2.0 Client ID"
6. [ ] Application type: "Web application"
7. [ ] Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. [ ] Copy "Client ID" → `GOOGLE_CLIENT_ID`
9. [ ] Copy "Client secret" → `GOOGLE_CLIENT_SECRET`

### Email SMTP (Optional)

For magic link authentication:

**Gmail Example:**
1. [ ] Enable 2FA on Google account
2. [ ] Generate App Password
3. [ ] Use these settings:
   ```
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=noreply@yourdomain.com
   ```

## 🐛 Troubleshooting

### "Cannot connect to database"
- [ ] Check DATABASE_URL format is correct
- [ ] Verify database exists
- [ ] Test connection:
  ```bash
  psql $DATABASE_URL
  ```
- [ ] Check firewall/network settings

### "Prisma Client not found"
- [ ] Regenerate client:
  ```bash
  npm run db:generate
  ```

### "Unauthorized" in admin
- [ ] Check user exists in database
- [ ] Verify user has `role: 'admin'`
- [ ] Update role if needed:
  ```sql
  UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
  ```

### Upload fails
- [ ] Verify UPLOADTHING credentials
- [ ] Check file size (<4MB default)
- [ ] Check browser console for errors
- [ ] Ensure internet connection

### Auth not working
- [ ] Verify NEXTAUTH_SECRET is set
- [ ] Check callback URLs match exactly
- [ ] Clear browser cookies
- [ ] Check server logs in terminal

## ✨ Post-Setup Tasks

### Create Your Admin Account

After seeding, default admin is `admin@example.com`. To add yourself:

```sql
-- Connect to database
psql $DATABASE_URL

-- Create admin user
INSERT INTO "User" (id, email, name, role, "emailVerified")
VALUES (gen_random_uuid(), 'you@example.com', 'Your Name', 'admin', NOW());
```

Or use Prisma Studio:
```bash
npm run db:studio
```

### Test the Full Workflow

- [ ] Sign in as admin
- [ ] Upload 3-5 test photos
- [ ] Verify EXIF extraction worked (check date/location)
- [ ] Reorder photos with drag-and-drop
- [ ] View public site to see changes
- [ ] Test on mobile device (responsive check)

### Next Development Steps

- [ ] Implement Places management
- [ ] Implement Reviews management
- [ ] Implement Trips management
- [ ] Add remaining UI components
- [ ] Set up production deployment

## 📚 Documentation Reference

- **QUICKSTART.md** - Fast setup guide
- **ADMIN_SETUP.md** - Comprehensive setup with details
- **STATUS.md** - Implementation status and roadmap
- **IMPLEMENTATION_SUMMARY.md** - What's been built
- **NEXT_STEPS.md** - Clear next actions

## 🚀 Production Deployment (Later)

When ready for production:

- [ ] Update NEXTAUTH_URL to production domain
- [ ] Use production DATABASE_URL
- [ ] Set up database backups
- [ ] Configure CDN for images
- [ ] Set up monitoring
- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Set up CI/CD

## ⏱️ Estimated Time

- **Environment setup**: 5-10 minutes (with credentials ready)
- **Database setup**: 2-3 minutes
- **Testing**: 5 minutes
- **Total**: 15-20 minutes

---

## 🎉 When Complete

You'll have:
- ✅ Secure admin authentication
- ✅ Professional photo management
- ✅ Database-backed CMS
- ✅ Mobile-responsive admin
- ✅ Production-ready foundation

**Ready to continue building the remaining CRUD interfaces!**

---

**Current Status**: Code complete, waiting for environment setup

**Start Here**: Create `.env.local` and get your credentials
