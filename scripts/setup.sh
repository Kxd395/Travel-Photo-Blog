#!/bin/bash
# Travel Photo Blog - Complete Setup Script

set -e  # Exit on error

echo "🚀 Travel Photo Blog - Admin CMS Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found!${NC}"
    echo ""
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo -e "${GREEN}✓${NC} Created .env.local"
    echo ""
    echo -e "${YELLOW}IMPORTANT: You need to edit .env.local with your credentials!${NC}"
    echo ""
    echo "Required variables:"
    echo "  1. DATABASE_URL - Your PostgreSQL connection string"
    echo "  2. NEXTAUTH_SECRET - Generate with: openssl rand -base64 32"
    echo "  3. UPLOADTHING_SECRET - From uploadthing.com"
    echo "  4. UPLOADTHING_APP_ID - From uploadthing.com"
    echo ""
    read -p "Press Enter after you've edited .env.local to continue..."
fi

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check required variables
echo "🔍 Checking environment variables..."
MISSING_VARS=0

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}✗${NC} DATABASE_URL is not set"
    MISSING_VARS=1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo -e "${RED}✗${NC} NEXTAUTH_SECRET is not set"
    MISSING_VARS=1
fi

if [ -z "$UPLOADTHING_SECRET" ]; then
    echo -e "${YELLOW}⚠${NC} UPLOADTHING_SECRET is not set (upload features will not work)"
fi

if [ -z "$UPLOADTHING_APP_ID" ]; then
    echo -e "${YELLOW}⚠${NC} UPLOADTHING_APP_ID is not set (upload features will not work)"
fi

if [ $MISSING_VARS -eq 1 ]; then
    echo ""
    echo -e "${RED}Please set all required environment variables in .env.local${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Environment variables configured"
echo ""

# Test database connection
echo "🗄️  Testing database connection..."
if npx prisma db execute --stdin <<< "SELECT 1;" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Database connection successful"
else
    echo -e "${RED}✗${NC} Cannot connect to database"
    echo ""
    echo "Please check:"
    echo "  1. DATABASE_URL is correct"
    echo "  2. PostgreSQL server is running"
    echo "  3. Database exists"
    echo "  4. Network/firewall allows connection"
    echo ""
    exit 1
fi
echo ""

# Generate Prisma client
echo "📦 Generating Prisma client..."
npm run db:generate > /dev/null 2>&1
echo -e "${GREEN}✓${NC} Prisma client generated"
echo ""

# Push schema to database
echo "🔨 Pushing database schema..."
echo "This will create all tables in your database..."
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:push
    echo -e "${GREEN}✓${NC} Database schema created"
else
    echo "Skipped database push"
    exit 0
fi
echo ""

# Seed database
echo "🌱 Seeding database..."
echo "This will migrate your JSON data to the database..."
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:seed
    echo -e "${GREEN}✓${NC} Database seeded"
else
    echo "Skipped database seeding"
fi
echo ""

# Success message
echo -e "${GREEN}======================================"
echo "✨ Setup Complete!"
echo "======================================${NC}"
echo ""
echo "Your admin CMS is ready to use!"
echo ""
echo "Next steps:"
echo "  1. Start the dev server: npm run dev"
echo "  2. Open http://localhost:3000"
echo "  3. Sign in at http://localhost:3000/api/auth/signin"
echo "  4. Access admin at http://localhost:3000/admin"
echo ""
echo "Default admin credentials (from seed):"
echo "  Email: admin@example.com"
echo "  (Use magic link or set up OAuth)"
echo ""
echo "Useful commands:"
echo "  npm run dev         - Start development server"
echo "  npm run db:studio   - Open Prisma Studio (database GUI)"
echo "  npm run db:migrate  - Create migration files"
echo "  npm run build       - Build for production"
echo ""
echo "Documentation:"
echo "  - ADMIN_SETUP.md for full setup guide"
echo "  - README.md for project overview"
echo ""
