# 🤖 Agent TODO List - Code & Documentation Improvements

These are the missing pieces and improvements I need to implement based on the comprehensive review.

## Priority: HIGH - Critical Missing Pieces

### 1. Complete Environment Configuration
- [ ] Create comprehensive `.env.example` with ALL variables clearly documented
  - [ ] Add Node version requirement
  - [ ] Add exact variable names with examples
  - [ ] Group by category (DB, Auth, Upload, Email, Admin)
  - [ ] Add comments explaining each variable
  - [ ] Include both SMTP and Resend options for email

- [ ] Create `.nvmrc` file pinning Node 20.x
  ```
  20.11.0
  ```

- [ ] Update `package.json` engines field
  ```json
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
  ```

### 2. Enhanced Setup Script
- [ ] Create `scripts/setup-complete.sh` with:
  - [ ] macOS prerequisites check (Xcode CLT, OpenSSL, Node version)
  - [ ] Package manager detection (npm vs pnpm)
  - [ ] Environment variable validation (all required keys present)
  - [ ] Database connection test
  - [ ] Prisma generate + migrate workflow
  - [ ] Supabase bucket verification
  - [ ] Health check endpoint calls
  - [ ] Detailed error messages with fixes

- [ ] Create `scripts/env-generator.sh` to help build .env.local interactively
  - [ ] Prompt for each credential
  - [ ] Generate NEXTAUTH_SECRET automatically
  - [ ] Validate format (URLs, emails, etc.)
  - [ ] Create .env.local with proper structure

### 3. Supabase Storage Configuration
- [ ] Create `scripts/supabase-storage-setup.sql` with:
  - [ ] Photos bucket creation
  - [ ] Public read policy
  - [ ] Authenticated upload policy
  - [ ] Owner update/delete policies
  - [ ] CORS configuration if needed
  - [ ] Comments explaining each policy

- [ ] Create `lib/supabase.ts` client helper
  - [ ] Storage upload helper with EXIF extraction
  - [ ] Thumbnail generation
  - [ ] Public URL getter
  - [ ] Error handling

- [ ] Update UploadThing integration to optionally use Supabase Storage
  - [ ] Keep UploadThing as default
  - [ ] Add Supabase as alternative backend
  - [ ] Make it configurable via env var

### 4. Prisma Migration Workflow
- [ ] Document difference between `db:push` and `migrate`
  - [ ] `db:push` for development/prototyping
  - [ ] `migrate dev` for tracked changes
  - [ ] `migrate deploy` for production

- [ ] Update package.json scripts:
  ```json
  "db:migrate:dev": "prisma migrate dev",
  "db:migrate:deploy": "prisma migrate deploy",
  "db:migrate:reset": "prisma migrate reset"
  ```

- [ ] Add Prisma generate to postinstall
  - [ ] Already done ✅

- [ ] Create initial migration
  - [ ] Run `prisma migrate dev --name initial`
  - [ ] Commit migration files

### 5. Admin Access Control
- [ ] Create `lib/admin.ts` helper
  ```typescript
  export function isAdmin(email?: string | null): boolean {
    const allowList = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
    return !!email && allowList.includes(email.toLowerCase());
  }
  
  export function isEditor(email?: string | null): boolean {
    // Similar for editors
  }
  ```

- [ ] Update middleware.ts to use admin helper
- [ ] Add admin check to all admin API routes
- [ ] Update seed script to create admin user from ADMIN_EMAILS env

### 6. Email Authentication Configuration
- [ ] Update `lib/auth.ts` for both SMTP and Resend
  ```typescript
  // Support both email providers
  const emailProvider = process.env.SMTP_URL 
    ? EmailProvider({
        server: process.env.SMTP_URL,
        from: process.env.EMAIL_FROM
      })
    : process.env.RESEND_API_KEY
    ? ResendProvider({
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.EMAIL_FROM
      })
    : null;
  
  // Only add if configured
  const providers = [GoogleProvider(...)];
  if (emailProvider) providers.push(emailProvider);
  ```

- [ ] Add email provider to package.json dependencies
  - [ ] Add `resend` package
  - [ ] Keep `nodemailer` for SMTP option

- [ ] Document callback URLs for email signin

### 7. Google OAuth Callback Documentation
- [ ] Create `docs/OAUTH_SETUP.md` with:
  - [ ] Screenshots of Google Console
  - [ ] Exact callback URLs for local and prod
  - [ ] Common errors and fixes
  - [ ] Testing instructions

- [ ] Add callback URL validation in auth config
  - [ ] Check NEXTAUTH_URL matches environment

---

## Priority: MEDIUM - Quality of Life Improvements

### 8. Health Check Endpoint
- [ ] Create `app/api/health/route.ts`
  ```typescript
  export async function GET() {
    const checks = {
      database: await testDatabaseConnection(),
      storage: await testStorageConnection(),
      auth: await testAuthConfig(),
      timestamp: new Date().toISOString()
    };
    return Response.json(checks);
  }
  ```

- [ ] Add to setup verification script

### 9. Verification Checklist System
- [ ] Create `scripts/verify-setup.sh`
  - [ ] Test auth endpoints respond
  - [ ] Test database connection
  - [ ] Test storage bucket exists
  - [ ] Test admin access
  - [ ] Generate report

- [ ] Create interactive verification in browser
  - [ ] `/admin/setup-check` page
  - [ ] Visual status indicators
  - [ ] One-click tests

### 10. Enhanced Error Messages
- [ ] Create custom error pages
  - [ ] Database connection error with fix steps
  - [ ] Missing env var error with which ones
  - [ ] Auth error with specific provider
  - [ ] Upload error with storage backend

- [ ] Add error boundary components
- [ ] Add detailed logging in development
- [ ] Add Sentry integration option

### 11. Deployment Documentation
- [ ] Create `docs/DEPLOYMENT.md` with:
  - [ ] Vercel deployment step-by-step
  - [ ] Environment variable mapping
  - [ ] Prisma production setup
  - [ ] Supabase production considerations
  - [ ] Domain and callback URL updates
  - [ ] Database migration workflow
  - [ ] Storage bucket production setup

- [ ] Create Vercel-specific files
  - [ ] `vercel.json` if needed
  - [ ] Build command optimization
  - [ ] Output configuration

### 12. Troubleshooting Guide
- [ ] Create `docs/TROUBLESHOOTING.md` with:
  - [ ] OAuth redirect_uri_mismatch
  - [ ] PrismaClientInitializationError
  - [ ] UploadThing 401 errors
  - [ ] RLS "not authorized" errors
  - [ ] Email not sending
  - [ ] Admin access denied
  - [ ] Missing EXIF data
  - [ ] Image upload timeout

- [ ] Add troubleshooting section to README
- [ ] Link from error pages to troubleshooting

---

## Priority: LOW - Polish & Nice-to-Haves

### 13. Development Experience
- [ ] Add `scripts/dev.sh` with env validation before starting
- [ ] Add pre-commit hooks
  - [ ] Type checking
  - [ ] Linting
  - [ ] Format check

- [ ] Add `scripts/reset.sh` for clean slate
  - [ ] Drop database
  - [ ] Clear uploads
  - [ ] Reset .env.local

### 14. Testing Setup
- [ ] Add test structure
  - [ ] Unit tests for helpers
  - [ ] Integration tests for API routes
  - [ ] E2E tests for critical flows

- [ ] Add test data generators
- [ ] Add CI/CD configuration examples

### 15. Documentation Improvements
- [ ] Consolidate existing MD files
  - [ ] Too many similar docs (QUICKSTART, ADMIN_SETUP, START_HERE, etc.)
  - [ ] Create single comprehensive README
  - [ ] Move detailed guides to `docs/` folder

- [ ] Add architecture diagrams
  - [ ] Database schema visual
  - [ ] Authentication flow
  - [ ] Upload pipeline
  - [ ] Admin access flow

- [ ] Add API documentation
  - [ ] Document all API routes
  - [ ] Request/response examples
  - [ ] Error codes

### 16. Seed Data Improvements
- [ ] Update seed script to be environment-aware
  - [ ] Use ADMIN_EMAILS for admin user
  - [ ] Validate data before insert
  - [ ] Better error messages

- [ ] Add seed data validation
- [ ] Add option to seed with sample data vs production data

---

## Completion Checklist

### Phase 1: Critical (Complete Before User Setup)
- [ ] Complete .env.example with all variables
- [ ] Create .nvmrc
- [ ] Update package.json engines
- [ ] Create Supabase storage SQL script
- [ ] Create admin helper lib
- [ ] Update auth.ts for email providers
- [ ] Create setup-complete.sh script
- [ ] Create env-generator.sh script

### Phase 2: User Experience (Complete Before Testing)
- [ ] Create health check endpoint
- [ ] Create verification script
- [ ] Update troubleshooting docs
- [ ] Create deployment guide
- [ ] Test all flows end-to-end

### Phase 3: Polish (Complete Before Production)
- [ ] Consolidate documentation
- [ ] Add architecture diagrams
- [ ] Create API docs
- [ ] Add CI/CD examples
- [ ] Production deployment tested

---

## Estimated Time

- **Phase 1 (Critical)**: 2-3 hours
- **Phase 2 (UX)**: 1-2 hours  
- **Phase 3 (Polish)**: 2-3 hours

**Total**: 5-8 hours of development work

---

## Dependencies

**Blocked by user**:
- Actual credentials needed to test email auth
- Supabase project needed to test storage
- Google OAuth credentials to test that flow

**Can do independently**:
- All documentation
- All scripts and helpers
- Error handling improvements
- Code structure improvements

---

## Next Action

**Immediate**: Start Phase 1 - Critical missing pieces
1. Create comprehensive .env.example
2. Create Supabase storage setup script
3. Create admin helper
4. Update auth configuration for email
5. Create enhanced setup scripts

**Then**: Wait for user credentials to test everything

**Finally**: Polish and production-ready improvements

---

**Status**: 🚀 Ready to implement

**Start with**: Creating .env.example with ALL variables documented
