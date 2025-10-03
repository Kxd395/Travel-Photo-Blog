# 🌍 Travel Photo Blog

A personal travel journal platform built with Next.js 14, featuring photo galleries, trip journals, interactive maps, and a full-featured admin CMS.

---

## 📚 Documentation

**→ All documentation has been moved to [`/docs`](./docs/)**

### Quick Links

- **[📖 Start Here](./docs/START_HERE.md)** - New to this project? Begin here
- **[⚡ Quick Start Guide](./docs/QUICKSTART.md)** - Get running in 15-20 minutes  
- **[📋 User Setup Checklist](./docs/TODO_USER.md)** - Gather your credentials
- **[📚 Full Documentation Index](./docs/README.md)** - Complete documentation hub

### Key Documents

- **[🎯 Project Description](./docs/PROJECT_DESCRIPTION.md)** - Comprehensive overview
- **[🏗️ Site Architecture](./docs/SITE_ARCHITECTURE.md)** - 40+ routes & page specs
- **[🎨 Design System](./docs/DESIGN_SYSTEM.md)** - Tokenized design system
- **[🗄️ Enhanced Schema](./docs/ENHANCED_SCHEMA.md)** - 20+ database models
- **[📈 Implementation Roadmap](./docs/IMPLEMENTATION_ROADMAP.md)** - Path A vs Path B
- **[⚙️ Tech Stack Analysis](./docs/TECH_STACK_ANALYSIS.md)** - Stack evaluation

---

## 🚀 Quick Start (macOS / Node 20+)

```bash
# 1) Clone and open in VS Code
cd travel-photo-blog

# 2) Install dependencies
npm install

# 3) Run dev server
npm run dev
# → http://localhost:3000
```

> **Next Steps**: See [`/docs/QUICKSTART.md`](./docs/QUICKSTART.md) for complete setup including database, authentication, and admin panel.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js 4
- **Storage**: Supabase Storage / UploadThing
- **Maps**: Leaflet + OpenStreetMap
- **Deployment**: Vercel (recommended)

See [`/docs/TECH_STACK_ANALYSIS.md`](./docs/TECH_STACK_ANALYSIS.md) for detailed analysis.

---

## 📁 Project Structure

```
travel-photo-blog/
├── app/                    # Next.js 14 App Router
│   ├── (routes)/          # Public pages
│   ├── admin/             # Admin CMS
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── components/            # React components
├── lib/                   # Utilities & helpers
├── prisma/               # Database schema
├── data/                 # JSON seed data
├── docs/                 # 📚 All documentation
└── public/               # Static assets
```

---

## ✨ Features

### Public-Facing
- 📸 **Photo Galleries** - Responsive grids with lightbox
- 🗺️ **Interactive Maps** - Leaflet-powered location views
- ✈️ **Trip Journals** - Organized travel stories
- 📍 **Place Pages** - Reviews, photos, and details
- ⭐ **Reviews** - Star ratings and recommendations
- 🏷️ **Tags & Collections** - Content discovery
- 🔍 **Search** - Find places, trips, and photos

### Admin CMS
- 🖼️ **Photo Management** - Upload, organize, and edit
- 📝 **Content Editor** - Trips, places, reviews
- 🎨 **Rich Media** - Drag-and-drop uploads
- 🔐 **Secure Auth** - NextAuth integration
- 📊 **Dashboard** - Content overview

See [`/docs/PROJECT_DESCRIPTION.md`](./docs/PROJECT_DESCRIPTION.md) for full feature list.

---

## 🛤️ Implementation Paths

### Path A: Basic Setup (3-4 hours)
Get the admin panel working with current features:
- ✅ Database setup (Supabase/Neon)
- ✅ Authentication (NextAuth)
- ✅ Basic photo upload
- ✅ Content management

**Best for**: Quick start, validating the concept, personal use

### Path B: Production Platform (10-13 hours)
Build the full production-grade platform:
- ✅ Enhanced database schema (20+ models)
- ✅ Advanced media pipeline (variants, deduplication)
- ✅ Security hardening (CSP, rate limiting)
- ✅ Admin UX improvements (bulk ops, keyboard shortcuts)
- ✅ Complete design system implementation

**Best for**: Public-facing site, portfolio showcase, scalable platform

**Decision Guide**: See [`/docs/IMPLEMENTATION_ROADMAP.md`](./docs/IMPLEMENTATION_ROADMAP.md)

---

## 📖 Documentation Structure

All documentation is organized in [`/docs`](./docs/):

### 🎯 Start Here
- [START_HERE.md](./docs/START_HERE.md) - Project introduction
- [PROJECT_DESCRIPTION.md](./docs/PROJECT_DESCRIPTION.md) - Complete overview
- [DOCS_INDEX.md](./docs/DOCS_INDEX.md) - Documentation navigator

### 🔧 Setup
- [QUICKSTART.md](./docs/QUICKSTART.md) - Fast setup (15-20 min)
- [TODO_USER.md](./docs/TODO_USER.md) - Your checklist
- [TODO_AGENT.md](./docs/TODO_AGENT.md) - Development roadmap
- [SETUP_CHECKLIST.md](./docs/SETUP_CHECKLIST.md) - Verification steps

### 🏗️ Architecture
- [TECH_STACK_ANALYSIS.md](./docs/TECH_STACK_ANALYSIS.md) - Stack evaluation
- [SITE_ARCHITECTURE.md](./docs/SITE_ARCHITECTURE.md) - 40+ routes & IA
- [ENHANCED_SCHEMA.md](./docs/ENHANCED_SCHEMA.md) - Database models
- [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) - Design tokens & components

### 📈 Implementation
- [IMPLEMENTATION_ROADMAP.md](./docs/IMPLEMENTATION_ROADMAP.md) - Path A vs B
- [IMPROVEMENTS.md](./docs/IMPROVEMENTS.md) - 3-session upgrade plan
- [ACTION_PLAN.md](./docs/ACTION_PLAN.md) - Master action plan

**→ [View Full Documentation Hub](./docs/README.md)**

---

## 🤝 Contributing

This is a personal project, but contributions are welcome! Please:

1. Check existing documentation in [`/docs`](./docs/)
2. Follow the design system in [`DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)
3. Reference the schema in [`ENHANCED_SCHEMA.md`](./docs/ENHANCED_SCHEMA.md)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Support

- **Documentation**: [`/docs`](./docs/)
- **Issues**: Open a GitHub issue
- **Questions**: See [START_HERE.md](./docs/START_HERE.md)

---

**Built with ❤️ for travel memories**

