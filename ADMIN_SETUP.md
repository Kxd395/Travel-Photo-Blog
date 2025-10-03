# Travel Photo Blog - Admin CMS Setup Guide

Complete guide to setting up the admin CMS with database, authentication, and image management.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Set up database (see Database Setup below)

# 4. Generate Prisma client
npm run db:generate

# 5. Push schema to database
npm run db:push

# 6. Seed with existing JSON data
npm run db:seed

# 7. Start development server
npm run dev
```

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (local or remote)
- UploadThing account (for image uploads)
- Google OAuth credentials (optional, for Google sign-in)

## 🗄️ Database Setup

### Option 1: Use Existing SSH Setup

If you have the server credentials filled in `review/TRAVEL_PHOTO_BLOG_DB_SETUP`:

```bash
# Run the setup script
bash review/TRAVEL_PHOTO_BLOG_DB_SETUP/scripts/setup_travel_blog_db.sh

# Copy the DATABASE_URL to .env.local
```

### Option 2: Local PostgreSQL

```bash
# Start PostgreSQL
# macOS with Homebrew:
brew services start postgresql@14

# Create database
psql postgres
CREATE DATABASE travel_photo_blog;
CREATE USER travel_admin WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE travel_photo_blog TO travel_admin;
\q

# Add to .env.local:
DATABASE_URL="postgresql://travel_admin:your-password@localhost:5432/travel_photo_blog"
```

### Option 3: Supabase (Recommended for Production)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the connection string from Settings → Database
3. Add to `.env.local`:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
   ```

## 🔐 Authentication Setup

### NextAuth Secret

Generate a secure secret:

```bash
openssl rand -base64 32
```

Add to `.env.local`:
```
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`:

```
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### Email Provider (Optional)

For passwordless email authentication, configure an SMTP server:

```
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

## 📸 Image Upload Setup

### UploadThing

1. Go to [uploadthing.com](https://uploadthing.com) and create an account
2. Create a new app
3. Copy your App ID and Secret
4. Add to `.env.local`:

```
UPLOADTHING_SECRET="your-secret"
UPLOADTHING_APP_ID="your-app-id"
```

## 🗂️ Database Schema

The Prisma schema includes:

- **User, Account, Session** - Authentication tables
- **Place** - Locations you've visited
- **Review** - Reviews with ratings, pros/cons, tips
- **Photo** - Images with EXIF data, blur placeholders
- **Trip** - Multi-day trips linking places and photos
- **TripPlace, TripPhoto** - Junction tables for ordering

## 📊 Migrating Existing Data

Your existing JSON data will be migrated automatically:

```bash
npm run db:seed
```

This will:
- Import all places, reviews, photos, and trips
- Preserve relationships and IDs
- Create a default admin user (admin@example.com)

## 👤 Creating Admin Users

After seeding, you'll have a default admin account. To create more:

```bash
# Connect to your database
psql $DATABASE_URL

# Create a new admin user
INSERT INTO "User" (id, email, name, role, "emailVerified")
VALUES (gen_random_uuid(), 'you@example.com', 'Your Name', 'admin', NOW());
```

Or through the database GUI (Supabase dashboard, pgAdmin, etc.)

## 🎨 Admin Features

### Dashboard (`/admin`)
- Overview statistics
- Recent reviews and trips
- Quick action buttons

### Places Management (`/admin/places`)
- List all places with filters
- Create/edit/delete places
- Map picker for coordinates
- Category management

### Reviews Management (`/admin/reviews`)
- WYSIWYG editor for review bodies
- Star rating selector
- Tag management
- Link to places

### Trips Management (`/admin/trips`)
- Date range selector
- Drag-and-drop place ordering
- Photo gallery selection
- Trip summary editor

### Photos Management (`/admin/photos`)
- Drag-and-drop upload
- Automatic EXIF extraction
- Blur placeholder generation
- Drag-and-drop reordering
- Bulk operations

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration files
npm run db:seed          # Seed database with JSON data

# Production
npm run build            # Build for production
npm start                # Start production server
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Important: Set these in Vercel:
- All variables from `.env.local`
- `NEXTAUTH_URL` should be your production domain

### Other Platforms

Works on:
- Netlify (with Next.js plugin)
- Railway
- Fly.io
- Docker/VPS

## 🔒 Security Checklist

- [ ] Change default admin email/password
- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS in production
- [ ] Set up CORS properly
- [ ] Configure CSP headers
- [ ] Regular database backups
- [ ] Monitor upload file sizes
- [ ] Rate limit API endpoints

## 📱 Mobile Admin

The admin interface is fully responsive and works great on tablets and mobile devices. Perfect for editing on the go!

## 🆘 Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL format
- Verify database is running
- Check firewall/network settings

### "Unauthorized" errors
- Verify NEXTAUTH_SECRET is set
- Check user role in database
- Clear browser cookies

### Upload failures
- Verify UPLOADTHING credentials
- Check file size limits
- Ensure server has internet access

### Prisma errors
- Run `npm run db:generate`
- Delete `node_modules/.prisma` and regenerate
- Check schema syntax

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [UploadThing](https://docs.uploadthing.com/)

## 🎉 What's Next?

After setup, you can:
1. Access admin at `http://localhost:3000/admin`
2. Upload your first photos
3. Create a new trip
4. Write a review
5. See it live on the public site!

---

Need help? Check the troubleshooting section or open an issue on GitHub.
