# 📋 Your TODO List - External Setup Required

These tasks require accounts, credentials, or access to external services. Complete these before running the automated setup.

## ⏱️ Estimated Time: 15-20 minutes total

---

## 1. Database Setup (5 minutes)

### Supabase Account & Project
- [ ] Go to https://supabase.com
- [ ] Create account (free tier)
- [ ] Create new project
  - [ ] Choose a project name
  - [ ] Set a database password (save it!)
  - [ ] Select region (closest to you)
  - [ ] Wait for provisioning (~2 minutes)

### Get Supabase Credentials
- [ ] Go to Project Settings → Database
  - [ ] Copy **Connection string** (Pooling mode for production)
  - [ ] Copy **Direct connection** string (for local development)
- [ ] Go to Project Settings → API
  - [ ] Copy **Project URL** → `SUPABASE_URL`
  - [ ] Copy **anon public** key → `SUPABASE_ANON_KEY`
  - [ ] Copy **service_role** key → `SUPABASE_SERVICE_ROLE` (keep secret!)

### Create Storage Bucket (I'll provide the SQL)
- [ ] Open Supabase SQL Editor
- [ ] Wait for me to provide the SQL script
- [ ] Run the storage bucket creation script
- [ ] Verify bucket appears in Storage section

**Save these values - you'll need them for .env.local**

---

## 2. Authentication Setup (10 minutes)

### NextAuth Secret (30 seconds)
- [ ] Open Terminal
- [ ] Run: `openssl rand -base64 32`
- [ ] Copy the output → `NEXTAUTH_SECRET`

### Google OAuth (5 minutes) - Optional but Recommended
- [ ] Go to https://console.cloud.google.com
- [ ] Create new project or select existing
- [ ] Enable Google+ API
  - [ ] Navigate to "APIs & Services" → "Library"
  - [ ] Search for "Google+ API"
  - [ ] Click "Enable"
- [ ] Create OAuth 2.0 credentials
  - [ ] Go to "Credentials" → "Create Credentials" → "OAuth client ID"
  - [ ] Application type: **Web application**
  - [ ] Name: "Travel Photo Blog"
  - [ ] Authorized JavaScript origins:
    - [ ] Add `http://localhost:3000`
    - [ ] Add your production domain when ready
  - [ ] Authorized redirect URIs:
    - [ ] Add `http://localhost:3000/api/auth/callback/google`
    - [ ] Add `https://YOUR_DOMAIN/api/auth/callback/google` when ready
  - [ ] Click "Create"
- [ ] Copy credentials
  - [ ] Copy **Client ID** → `GOOGLE_CLIENT_ID`
  - [ ] Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

### Email Authentication (5 minutes) - Optional

**Choose ONE method:**

#### Option A: SMTP (Gmail example)
- [ ] Use existing Gmail account
- [ ] Enable 2-Factor Authentication
- [ ] Generate App Password
  - [ ] Go to Google Account → Security → 2-Step Verification → App passwords
  - [ ] Select "Mail" and your device
  - [ ] Copy the 16-character password
- [ ] Create SMTP URL:
  ```
  smtp://your-email@gmail.com:YOUR_APP_PASSWORD@smtp.gmail.com:587
  ```
  - [ ] Save as `SMTP_URL`
  - [ ] Set `EMAIL_FROM=your-email@gmail.com`

#### Option B: Resend (Recommended for production)
- [ ] Go to https://resend.com
- [ ] Create account (free tier: 3,000 emails/month)
- [ ] Add and verify your domain (or use their test domain)
- [ ] Create API key
  - [ ] Go to API Keys → Create API Key
  - [ ] Copy key → `RESEND_API_KEY`
  - [ ] Set `EMAIL_FROM=noreply@yourdomain.com`

---

## 3. Image Upload Service (2 minutes)

### UploadThing Account
- [ ] Go to https://uploadthing.com
- [ ] Sign up (free tier: 2GB storage, 25GB bandwidth/month)
- [ ] Create new app
  - [ ] Name: "Travel Photo Blog"
  - [ ] Click "Create"
- [ ] Get credentials
  - [ ] Click on your app
  - [ ] Go to "API Keys" tab
  - [ ] Copy **App ID** → `UPLOADTHING_APP_ID`
  - [ ] Copy **Secret Key** → `UPLOADTHING_SECRET`

---

## 4. Admin Access Configuration (1 minute)

### Set Your Admin Email
- [ ] Decide which email will be the admin account
- [ ] This should match the email you'll use to sign in
- [ ] Save as `ADMIN_EMAILS` (can be comma-separated list)
  - Example: `ADMIN_EMAILS=you@example.com,admin@example.com`

---

## 5. Verify Prerequisites (1 minute)

### Check Node.js Version
- [ ] Run: `node --version`
- [ ] Ensure it's **v18 or higher** (v20 recommended)
- [ ] If not, install Node 20:
  ```bash
  # macOS with Homebrew
  brew install node@20
  
  # Or use nvm
  nvm install 20
  nvm use 20
  ```

### Check Package Manager
- [ ] Using npm (default) or pnpm?
- [ ] If using pnpm: `npm install -g pnpm`

---

## 📝 Credentials Checklist

By the end, you should have these values ready:

**Database (Supabase)**
- [ ] `DATABASE_URL` - Connection string
- [ ] `SUPABASE_URL` - Project URL
- [ ] `SUPABASE_ANON_KEY` - Anonymous key
- [ ] `SUPABASE_SERVICE_ROLE` - Service role key (secret!)

**Authentication (NextAuth)**
- [ ] `NEXTAUTH_SECRET` - Generated random string
- [ ] `NEXTAUTH_URL` - http://localhost:3000 (for now)

**Google OAuth (Optional)**
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`

**Email (Optional - choose one)**
- [ ] `SMTP_URL` - SMTP connection string
- OR
- [ ] `RESEND_API_KEY` - Resend API key
- [ ] `EMAIL_FROM` - Sender email address

**Image Upload (UploadThing)**
- [ ] `UPLOADTHING_APP_ID`
- [ ] `UPLOADTHING_SECRET`

**Admin Access**
- [ ] `ADMIN_EMAILS` - Your email address

---

## 🎯 Next Steps

Once you have all credentials:

1. **Let me know** - I'll create the complete setup with all the missing pieces
2. **Or run yourself**:
   ```bash
   # I'll provide you with an updated setup script
   ./scripts/setup-complete.sh
   ```

---

## ⏰ Time Breakdown

- Supabase setup: 5 min
- Google OAuth: 5 min (optional)
- Email setup: 5 min (optional)
- UploadThing: 2 min
- NextAuth secret: 30 sec
- Admin email: 30 sec
- Node version check: 1 min

**Total: 10-20 minutes** (depending on optional features)

---

## 💡 Pro Tips

1. **Use 1Password or similar** to store all these credentials securely
2. **Copy to a text file** as you go, then paste all at once into .env.local
3. **Take screenshots** of credential pages for future reference
4. **Use Supabase's pooled connection** for production (handles serverless better)
5. **Start with Google OAuth** - easiest sign-in experience
6. **Skip email auth** for now if you're just testing - add it later

---

## 🆘 If You Get Stuck

**Supabase issues**
- Make sure project finished provisioning (check dashboard)
- Use "Connection Pooling" URL for better performance
- Keep service_role key SECRET - never commit to git

**Google OAuth issues**
- Callback URLs must match EXACTLY (http vs https, trailing slash)
- Enable Google+ API before creating credentials
- Wait a few minutes after creating credentials for propagation

**UploadThing issues**
- Free tier is plenty for development
- You can upgrade later if needed
- Test upload works in their dashboard first

---

**Status**: ⏳ Waiting for credentials

**When ready**: Check off all boxes above and let me know!
