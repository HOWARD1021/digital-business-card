# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **Digital Business Card Scanner** application built with Next.js 15 and Cloudflare Workers. It features a flippable business card UI, comprehensive shopping list management, script template management with AI integration, and image processing capabilities.

### Key Features
- 🎴 Interactive digital business card with flip animation
- 🛒 Comprehensive shopping list management system (hidden `/shoplist` route)
- 📝 Script template management with AI generation using Cloudflare Workers + D1
- 🖼️ Image style processing and management dashboard
- 📊 Analytics and rating systems for scripts and images

## Development Commands

### Core Development Workflow
```bash
# Quick start (runs both frontend and backend)
npm run quick-start

# Manual start (preferred for debugging) - requires 2 terminals:
# Terminal 1: Backend (Cloudflare Workers)
npm run dev:workers
# Backend runs on http://localhost:8787

# Terminal 2: Frontend (Next.js)
npm run dev  
# Frontend runs on http://localhost:3000
```

### Build & Deployment
```bash
# Build Next.js frontend
npm run build

# Deploy Cloudflare Workers API
npm run build:workers

# Start production frontend
npm run start
```

### Testing & Quality
```bash
# Lint code
npm run lint

# Health check endpoints
npm run health-check
# Or manually:
curl http://localhost:8787/health
curl http://localhost:3000/api/uploads/stats
```

### Database & Storage (Cloudflare)
```bash
# Create D1 database
npm run workers:db:create

# Run migrations
npm run workers:db:migrate          # Production
npm run workers:db:migrate:local    # Local development

# Create R2 storage bucket
npm run workers:r2:create

# Create KV namespace
npm run workers:kv:create
```

### Environment Setup
```bash
# Run environment setup script
./scripts/setup-env.sh

# Check environment status
npm run check-env
```

## Architecture & Code Structure

### Full-Stack Architecture
This is a **hybrid Next.js + Cloudflare Workers** application with clear separation:

**Frontend (Next.js 15 + React 19)**
- `src/app/` - Next.js App Router pages
- `src/app/components/` - Reusable React components
- `src/lib/api-client.ts` - Centralized API client for backend communication

**Backend (Cloudflare Workers + Hono)**  
- `src/workers/index.ts` - Main Hono app with CORS and error handling
- `src/workers/routes/` - API route handlers (scripts, ratings, uploads, stats, auth)
- `src/types/index.ts` - Shared TypeScript types and interfaces

**Data Layer**
- Cloudflare D1 (SQLite) for structured data (scripts, ratings, users)
- Cloudflare R2 for file storage (images, generated content) 
- Cloudflare KV for caching and session data

### Key Pages & Routes
- `/` - Main business card with flip animation (CardFlip component)
- `/script` - Script template management interface 
- `/dashboard` - Modern image management dashboard with drag-and-drop
- `/slideswipe` - Image style processing interface
- `/shoplist` - **Hidden** comprehensive shopping list (not linked in UI)
- `/shorts` - Video content generation
- `/api/*` - Proxied to Cloudflare Workers backend (localhost:8787)

### API Integration Pattern
All frontend components use the centralized `apiClient` from `src/lib/api-client.ts`:

```typescript
// Example usage in components
import { apiClient } from '../lib/api-client';

const scripts = await apiClient.getScripts({ category_id: 1 });
const image = await apiClient.uploadImage(file, description, tags);
```

The API client automatically handles:
- Authentication headers (`x-user-id`)
- Error handling with user-friendly messages  
- TypeScript interfaces for type safety
- Request/response standardization

### Database Schema (D1)
Key tables managed through migrations in `migrations/`:
- `script_categories` - Script classification system
- `script_templates` - AI prompt templates with versioning
- `script_ratings` - User rating system (1-5 stars)
- `script_usage` - Analytics tracking (views, copies, generations)
- `images` - Image metadata with R2 storage keys
- `users` - Simple user management

## Development Guidelines

### Frontend Development (from .cursor/rules/frontend.mdc)
- Use **early returns** and descriptive variable names with `handle` prefix for event functions
- Implement **accessibility features** (tabindex, aria-label, keyboard navigation)
- Use **const** instead of function declarations, define types where possible
- Use **Tailwind classes** exclusively for styling, avoid CSS/style tags
- Use **":" instead of ternary operator** in class tags when possible

### API Integration Requirements
- Use centralized `apiClient` for all backend communication
- Implement proper **error handling** with user-friendly messages
- Use **TypeScript interfaces** from `src/types/index.ts` for type safety
- Handle **loading states** and provide user feedback
- Implement **optimistic updates** for better UX where appropriate

### Cloudflare Workers Best Practices  
- Follow **RESTful conventions** with proper error handling
- Use **Zod for validation** in request/response handling
- Implement **rate limiting** and authentication where needed
- Support **pagination** for list endpoints  
- Use **KV store** for caching strategies
- Handle **CORS properly** for frontend integration

### Image Processing Integration
- Extend existing `/slideswipe` functionality for style processing
- Support **multiple formats** (JPG, PNG, WebP) with optimization
- Implement **drag-and-drop upload** with progress indicators  
- Show **before/after previews** with processing status
- Handle **batch operations** and proper error states

## Special Considerations

### Hidden Shopping List Feature
The `/shoplist` route contains comprehensive shopping data but is **intentionally hidden** from the business card UI. It consolidates:
- Original grocery list (19 items)
- Woolworths Mt Eden receipt (14 items) 
- PAK'nSAVE Royal Oak receipt (12 items)
- Color-coded store tags (🔵 Jadan, 🟢 Woolworths, 🔴 PAK'nSAVE)
- CSV export functionality with dual currency support (NZD/TWD)

### Environment Configuration
- Copy `wrangler.toml.example` to `wrangler.toml` and configure:
  - Database IDs for D1
  - Bucket names for R2
  - KV namespace IDs  
  - Environment variables (JWT_SECRET, CORS_ORIGIN)
- Copy `env.example` to `.env.local` for Next.js environment variables

### API Proxy Configuration
Next.js proxies `/api/*` requests to `localhost:8787` (Cloudflare Workers) via `next.config.ts`. This enables seamless full-stack development with both servers running simultaneously.

### Script Management System
The script management system supports:
- **Template categorization** with emoji and descriptions
- **Version control** for script templates
- **AI-powered generation** with parameter support
- **Rating and feedback** system (1-5 stars with comments)
- **Usage analytics** tracking views, copies, generations
- **Batch operations** for template management

This architecture enables rapid development of AI-powered content generation features while maintaining clean separation between frontend UI and backend data processing.