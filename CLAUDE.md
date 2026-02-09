# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Digital Business Card Scanner - A Next.js 15 application with dual architecture:
- **Frontend**: Next.js 15 with React 19, TailwindCSS 4, and Framer Motion
- **Backend**: Cloudflare Workers with Hono framework, D1 database, R2 storage, and KV cache

This is a multi-feature application including digital business cards, AI-powered image transformation (I2I), script management, shopping list tracking, and image dashboard.

## Local Development Setup (First Time)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp env.example .env
# Edit .env with your configuration
```

### 3. Initialize Cloudflare Resources (Local)
```bash
npm run workers:db:create              # Create D1 database
npm run workers:db:migrate:local       # Apply database migrations locally
npm run workers:r2:create              # Create R2 storage bucket
npm run workers:kv:create              # Create KV namespace
```

### 4. Start Development Servers
```bash
npm run quick-start                    # Starts BOTH Next.js and Workers concurrently
```
This single command launches:
- **Next.js** frontend dev server (port 3000)
- **Cloudflare Workers** backend dev server (port 8787)

**Alternative**: Run servers separately in different terminals:
```bash
npm run dev              # Terminal 1: Next.js only
npm run dev:workers      # Terminal 2: Workers only
```

## Development Commands

### Frontend (Next.js)
```bash
npm run dev              # Start Next.js dev server with Turbopack
npm run build            # Build Next.js for production
npm start               # Start production server
npm run lint            # Run ESLint
```

### Backend (Cloudflare Workers)
```bash
npm run dev:workers                    # Start Cloudflare Workers local dev server
npm run build:workers                  # Deploy Workers to Cloudflare
npm run deploy:workers:prod           # Deploy to production environment
npm run deploy:workers:dev            # Deploy to development environment
```

### Database (Cloudflare D1)
```bash
npm run workers:db:migrate            # Apply migrations to remote D1
npm run workers:db:migrate:local      # Apply migrations locally
npm run db:migrate:prod               # Migrate production database
npm run db:migrate:dev                # Migrate development database
```

### Production Setup
```bash
npm run setup:prod                    # Complete production setup (DB + R2 + KV)
```

## Architecture Overview

### Dual Server Architecture
The project runs TWO separate servers that must work together:

1. **Next.js Frontend** (port 3000) - `npm run dev`
   - Serves pages, components, and frontend API routes
   - Located in `src/app/`
   - Handles SSR, routing, and UI rendering

2. **Cloudflare Workers Backend** (port 8787) - `npm run dev:workers`
   - Provides REST API via Hono framework
   - Located in `src/workers/`
   - Manages D1 database, R2 storage, and business logic

**IMPORTANT**: For full functionality, both servers must run simultaneously. Use `npm run quick-start` to launch both.

### Frontend Structure (`src/app/`)
- **App Router**: Next.js 15 uses app directory structure
- **Key Pages**:
  - `/` - Main business card with flip animation (`page.tsx`)
  - `/script` - Script management interface
  - `/slideswipe` - Image style processing
  - `/shoplist` - Shopping list (hidden from UI, direct URL access only)
  - `/dashboard` - Image management dashboard
  - `/admin/keys` - API key management (password protected)
  - `/shorts` - Shorts content page
- **API Routes**: Next.js API routes in `src/app/api/` handle I2I transformation and admin key management
- **Components**: `src/app/components/` contains shared React components

### Backend Structure (`src/workers/`)
- **Entry Point**: `src/workers/index.ts` - Hono app with route mounting
- **Routes**: Modular routers in `src/workers/routes/`:
  - `scripts.ts` - Script CRUD operations
  - `ratings.ts` - Rating and feedback system
  - `uploads.ts` - Image upload handling
  - `stats.ts` - Usage analytics
  - `auth.ts` - Authentication logic
  - `i2i.ts` - Image-to-Image transformation
- **Models**:
  - `database.ts` - D1 database operations
  - `image-storage.ts` - R2 storage operations

### Cloudflare Infrastructure
- **D1 Database**: SQL database for scripts, ratings, metadata
- **R2 Storage**: Object storage for images and generated content
- **KV Cache**: Key-value store for caching and sessions
- **Configuration**: `wrangler.toml` defines bindings and environments

### Library Organization (`src/lib/`)
- **API Client**: `api-client.ts` - Centralized HTTP client for Workers API
- **Kiro Framework**: `src/lib/kiro/` - Internal utilities:
  - `ai/google.ts` - Google AI integration (Gemini/Imagen)
  - `config/env.ts` - Environment configuration
  - `security/crypto.ts` - Encryption utilities
  - `db/d1.ts` - D1 database helpers
  - `storage/r2.ts` - R2 storage helpers

### TypeScript Configuration
- Path alias: `@/*` maps to `./src/*`
- Target: ES2020 with strict mode enabled
- Project uses TypeScript 5 with Next.js plugin

## Key Technical Patterns

### AI-Powered I2I (Image-to-Image) Transformation
The I2I system implements iterative image improvement:

1. **Dual-Model Strategy** (cost optimization):
   - **Paid Model** (image generation): Google Imagen API
   - **Free Model** (description/evaluation): Google Gemini Flash

2. **Iterative Improvement Loop** (max 3 iterations):
   ```
   Upload → Generate → Describe → Evaluate → Improve Prompt → Regenerate
   ```

3. **API Key Management**:
   - Encrypted storage using AES-256 in D1
   - Admin interface at `/admin/keys` (password protected)
   - Fallback mechanism: primary → secondary → fail gracefully

4. **Implementation Locations**:
   - Frontend API: `src/app/api/i2i/transform/route.ts`
   - Workers API: `src/workers/routes/i2i.ts`
   - AI Logic: `src/lib/kiro/ai/google.ts`
   - Security: `src/lib/kiro/security/crypto.ts`

### Frontend-Backend Communication
- Use centralized API client: `src/lib/api-client.ts`
- Workers API base URL configured per environment
- All requests/responses use consistent JSON format with `ApiResponse` type
- Error handling with user-friendly messages

### Security Practices
- API keys encrypted at rest using AES-256
- Password protection for admin interfaces
- CORS configuration per environment in `wrangler.toml`
- JWT authentication for protected endpoints
- Environment-based secrets (never commit to git)

## Important Design Decisions

### Shopping List Path Convention
- Path changed from `/grocery-list` to `/shoplist` for brevity
- Shopping list link is HIDDEN from business card UI
- Accessible only via direct URL navigation
- Consolidates data from multiple stores (Woolworths, PAK'nSAVE, Jadan)

### Component Styling
- Always use TailwindCSS classes (never inline CSS or `<style>` tags)
- Use ":" instead of ternary operator in className where possible
- Implement accessibility: `tabIndex`, `aria-label`, keyboard handlers
- Use `const` for function declarations, not `function` keyword
- Event handlers prefixed with "handle" (e.g., `handleClick`)

### Card Flip Feature (FR013)
- 3D flip animation between front/back sides
- Backside includes: avatar, description, action buttons, QR code, social icons
- QR code button toggles full-screen QR display
- Responsive and accessible (keyboard navigation, ARIA labels)

### Database Migrations
- Migrations stored in `/migrations` directory
- Apply locally with `npm run workers:db:migrate:local`
- Apply remotely with environment-specific commands

## Configuration Files

- **wrangler.toml**: Cloudflare Workers config with D1/R2/KV bindings
- **next.config.ts**: Next.js configuration
- **tsconfig.json**: TypeScript compiler options
- **.env**: Local environment variables (not committed)
- **env.example**: Template for environment variables

## Development Workflow

### First Time Setup
Follow the "Local Development Setup" section above to:
1. Install dependencies
2. Configure environment variables
3. Initialize Cloudflare resources (D1, R2, KV)
4. Start both servers with `npm run quick-start`

### Daily Development
1. **Start Development Servers**:
   ```bash
   npm run quick-start  # Starts both Next.js and Workers
   ```

2. **Making Changes**:
   - **Frontend changes**: Auto-reload on Next.js dev server (instant)
   - **Backend changes**: May require Workers server restart
   - **Database schema changes**: Run migrations with `npm run workers:db:migrate:local`

3. **Testing**:
   - Frontend: http://localhost:3000
   - Workers API: http://localhost:8787
   - Test files: `test-functionality.js`, `test-i2i.js`, `test-api.html`

4. **Deployment to Production**:
   ```bash
   npm run build                    # Build Next.js
   npm run deploy:workers:prod      # Deploy Workers to production
   npm run db:migrate:prod          # Apply database migrations (if needed)
   ```

## Important Notes from Cursor Rules

### Frontend Development (`.cursor/rules/frontend.mdc`)
- Think step-by-step before coding, provide pseudocode plans
- Implement complete functionality (NO todos/placeholders)
- Use early returns for readability
- Always use Tailwind for styling (never CSS/style tags)
- Descriptive naming: events use "handle" prefix
- Implement proper accessibility features
- Use centralized API client (`src/lib/api-client.ts`)
- Handle loading states and errors gracefully
- Use React's built-in state management

### Product Requirements (`.cursor/rules/prd.mdc`)
- See PRD document for complete feature requirements (FR001-FR025)
- All implementations must align with functional requirements
- I2I system requires iterative improvement with max 3 iterations
- Security: encrypted API keys, password-protected admin areas
- Shopping list consolidates multiple store data with color-coded tags
- Rate limiting: 10 requests per minute for I2I operations

## Testing

Test files:
- `test-functionality.js` - General functionality tests
- `test-i2i.js` - I2I transformation tests
- `test-api.html` - API endpoint testing interface

## Documentation

Refer to these additional docs for details:
- `WARP.md` - Cloudflare WARP setup
- `CLOUDFLARE_SETUP_GUIDE.md` - Infrastructure setup
- `QUICK_START.md` - Quick start guide
- `API_DOCUMENTATION.md` - API endpoint reference
- `SECURITY.md` - Security configuration
