# 🌍 Travel Photo Blog - Admin CMS Edition

A modern, full-featured travel photo blog with a professional admin CMS. Built with Next.js 14, Prisma, NextAuth, and modern best practices.

![Status](https://img.shields.io/badge/status-ready_for_setup-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748)

## ✨ Features

### 🔐 Admin CMS
- **Full Authentication** - Google OAuth + email magic links
- **Photo Management** - Drag-drop upload, EXIF extraction, optimization
- **Dashboard** - Real-time statistics and quick actions
- **Role-Based Access** - Admin, editor, and viewer roles
- **Responsive Design** - Works on desktop, tablet, and mobile

### 📸 Photo Features
- **Drag-and-drop upload** with progress tracking
- **EXIF metadata extraction** (GPS, date, camera)
- **Automatic optimization** with sharp
- **Blur placeholders** for instant loading
- **Drag-to-reorder** functionality
- **Bulk operations** ready

### 🎨 Public Site
- Beautiful photo galleries
- Interactive maps with Leaflet
- Detailed place reviews
- Multi-day trip itineraries
- Responsive design
- Fast loading with optimizations

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ (or Supabase account)
- UploadThing account (free tier available)

### Installation

```bash
# 1. Clone and install
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Run automated setup
./scripts/setup.sh

# 4. Start development
npm run dev
```

Visit:
- 🌐 Public site: http://localhost:3000
- 🔐 Admin: http://localhost:3000/admin
- 📧 Sign in: http://localhost:3000/auth/signin

**See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.**

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Fast 5-minute setup guide
- **[ADMIN_SETUP.md](ADMIN_SETUP.md)** - Comprehensive setup with troubleshooting
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Step-by-step checklist
- **[STATUS.md](STATUS.md)** - Implementation status and roadmap
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What's been built
- **[NEXT_STEPS.md](NEXT_STEPS.md)** - Clear next actions

## 🛠️ Tech Stack

### Core
- **Next.js 14.2.33** - React framework with App Router
- **TypeScript 5.4.5** - Type safety
- **Tailwind CSS 3.4.7** - Styling

### Backend
- **Prisma 5.22.0** - Database ORM
- **PostgreSQL** - Database
- **NextAuth 4.24.8** - Authentication

### Features
- **UploadThing** - File uploads
- **Sharp** - Image optimization
- **ExifReader** - EXIF metadata
- **@dnd-kit** - Drag and drop
- **Leaflet** - Interactive maps
- **Lucide React** - Icons

## 📊 Project Structure

```
travel-photo-blog/
├── app/
│   ├── admin/              # Admin CMS interface
│   │   ├── layout.tsx      # Sidebar layout
│   │   ├── page.tsx        # Dashboard
│   │   └── photos/         # Photo management
│   ├── auth/               # Authentication pages
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth
│   │   ├── uploadthing/    # File uploads
│   │   └── admin/          # Admin APIs
│   ├── map/                # Interactive map page
│   ├── places/             # Place detail pages
│   ├── reviews/            # Reviews page
│   └── trips/              # Trip detail pages
├── components/
│   ├── admin/              # Admin UI components
│   ├── PhotoGrid.tsx       # Photo gallery
│   ├── ReviewCard.tsx      # Review display
│   └── StarRating.tsx      # Rating display
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── prisma.ts           # Database client
│   ├── data.ts             # Data utilities
│   └── types.ts            # TypeScript types
├── prisma/
│   └── schema.prisma       # Database schema
├── scripts/
│   ├── setup.sh            # Automated setup
│   └── seed.js             # Data migration
└── public/
    └── photos/             # Static images
```

## 🔒 Security

- JWT sessions with NextAuth
- Role-based access control
- Protected admin routes via middleware
- Server-side authentication checks
- SQL injection prevention (Prisma)
- XSS protection
- HTTPS-ready for production

## 📸 Admin Features

### Photo Management (Complete ✅)
- Multi-file drag-drop upload
- EXIF extraction (GPS, date, camera)
- Image optimization with sharp
- Blur placeholder generation
- Drag-to-reorder
- Delete with confirmation

### Coming Soon
- Places CRUD interface
- Reviews editor with WYSIWYG
- Trips management
- Map-based coordinate picker
- Tag management
- Search and filtering

## 🎯 Development Status

**Overall: 35% Complete**

- ✅ Infrastructure: 100%
- ✅ Authentication: 100%
- ✅ Photo Management: 100%
- ✅ Admin Dashboard: 90%
- 🚧 Places Management: 0%
- 🚧 Reviews Management: 0%
- 🚧 Trips Management: 0%

See [STATUS.md](STATUS.md) for detailed roadmap.

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

```bash
vercel
```

### Other Platforms
- Netlify (with Next.js plugin)
- Railway
- Fly.io
- Docker/VPS

**Important**: Update `NEXTAUTH_URL` to your production domain.

## 💻 Development Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:seed          # Seed with JSON data
npm run db:studio        # Open Prisma Studio GUI

# Production
npm run build            # Build for production
npm start                # Start production server
```

## 🔧 Environment Variables

Required in `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# File Upload
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."

# Optional: Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Optional: Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="..."
EMAIL_SERVER_PASSWORD="..."
EMAIL_FROM="..."
```

See [.env.example](.env.example) for complete template.

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Regenerate Prisma client
npm run db:generate
```

### Authentication Not Working
- Verify NEXTAUTH_SECRET is set
- Check callback URLs match
- Clear browser cookies

### Upload Failures
- Verify UploadThing credentials
- Check file size (<4MB default)
- Check browser console

See [ADMIN_SETUP.md](ADMIN_SETUP.md#troubleshooting) for more.

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [UploadThing](https://docs.uploadthing.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📝 Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  role          String    @default("viewer")
  emailVerified DateTime?
  // ... auth relations
}

model Place {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  country     String
  coordinates Json
  photos      Photo[]
  reviews     Review[]
  trips       TripPlace[]
}

model Photo {
  id            String      @id @default(cuid())
  url           String
  thumbnailUrl  String?
  blurDataURL   String?
  metadata      Json?
  position      Int         @default(0)
  place         Place?
  trips         TripPhoto[]
}

// ... and more models for Review, Trip, etc.
```

See [prisma/schema.prisma](prisma/schema.prisma) for full schema.

## 🤝 Contributing

Contributions welcome! This is a personal project but feel free to fork and adapt.

## 📄 License

MIT License - feel free to use for your own projects.

## 🙏 Acknowledgments

- Built with modern Next.js patterns
- Inspired by travel photography blogs
- Uses best practices from the community

---

## 🎉 What's Next?

After setup is complete:

1. **Upload your photos** - Let EXIF extraction work its magic
2. **Create places** - Coming soon with map picker
3. **Write reviews** - Coming soon with WYSIWYG editor
4. **Plan trips** - Coming soon with drag-drop itinerary
5. **Share your adventures!**

---

**Need help?** Check the documentation or open an issue.

**Ready to start?** Run `./scripts/setup.sh` and begin your journey! 🚀
