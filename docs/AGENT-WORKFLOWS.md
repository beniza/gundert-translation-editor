# Workflows Reference

## Feature Development (MVP)

### 1. Adding a New Component

```bash
cd nextjs-app

# Create component
mkdir -p app/components/YourComponent
cat > app/components/YourComponent/YourComponent.tsx << 'EOF'
'use client';

export function YourComponent() {
  return <div>Your Component</div>;
}
EOF

# Import in page
# Edit app/[page]/page.tsx to add <YourComponent />

# Test locally
npm run dev
# Visit http://localhost:3000/[page]

# Add tests
cat > tests/YourComponent.test.ts << 'EOF'
describe('YourComponent', () => {
  it('renders', () => {
    // Your test
  });
});
EOF

npm test

# Commit
cd ..
git add .
git commit -m "feat(nextjs-app): add YourComponent"
```

---

### 2. Adding a New API Endpoint

```bash
cd nextjs-app

# Create route
mkdir -p app/api/your-endpoint
cat > app/api/your-endpoint/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Your logic
  return NextResponse.json({ data: 'result' });
}
EOF

# Test endpoint
npm run dev
# POST http://localhost:3000/api/your-endpoint

# Add tests
cat > tests/api/your-endpoint.test.ts << 'EOF'
describe('/api/your-endpoint', () => {
  it('handles POST', async () => {
    // Your test
  });
});
EOF

npm test

# Commit
cd ..
git add .
git commit -m "feat(nextjs-app): add /api/your-endpoint"
```

---

## Testing

### Running Tests

```bash
cd nextjs-app

# All tests
npm test

# Watch mode
npm test -- --watch

# Specific file
npm test -- tests/api/your-endpoint.test.ts

# Coverage
npm test -- --coverage

# Database integration tests only
npm run test:db

# CI mode (single run)
npm test -- --ci
```

### Test Files Location
- API tests: `tests/api/*.test.ts`
- Component tests: `tests/[feature]/*.test.ts`
- Database tests: `tests/db/*.test.ts`
- Integration tests: Use `npm run test:db`

---

## Database Management

### Modifying Schema

```bash
cd nextjs-app

# 1. Edit schema in lib/db/schema.ts
# 2. Generate migration
npm run db:generate

# 3. Review migration in drizzle/[timestamp]_*.sql
# 4. Push to dev database
npm run db:push

# 5. Or run migration manually
npm run db:migrate
```

### Seeding Data

```bash
cd nextjs-app

# Run seed script (pushes demo data)
npm run seed
# Or via API endpoint
curl -X POST http://localhost:3000/api/seed
```

---

## Data Import & Processing

### Importing UBS XML

```bash
# From repository root
cd nextjs-app
npm run import:ubs

# Expected flow:
# 1. Reads XML from nextjs-app/data/xml/
# 2. Parses using lib/importer/ubs-xml-importer.ts
# 3. Inserts into PostgreSQL via Drizzle
# 4. Outputs JSON to nextjs-app/data/entries.json
```

### Running Data Analysis Scripts

```bash
# From repository root

# Analyze dictionaries (XML → JSON)
node scripts/analyze_dictionaries.js
# Output: nextjs-app/data/entries.json

# Analyze SFM files
node scripts/analyze_sfm.js
# Output: nextjs-app/data/stats.json

# Validate round-trip (import → DB → export)
cd nextjs-app
npm run validate:roundtrip
```

---

## Git Workflow

### Branching Strategy

1. **Feature branch** (from main)
   ```bash
   git checkout -b feat/your-feature
   ```

2. **Development** (within nextjs-app)
   ```bash
   cd nextjs-app
   npm run dev
   # Make changes
   npm test
   npm run build
   ```

3. **Commit** (from root)
   ```bash
   cd ..
   git add .
   git commit -m "feat(nextjs-app): description"
   ```

4. **Push & create PR**
   ```bash
   git push origin feat/your-feature
   # Create PR on GitHub
   ```

### Commit Message Format

```
<type>(scope): <description>

<optional body>
<optional footer>
```

**Scope Examples:**
- `nextjs-app` – MVP changes
- `legacy-poc` – PoC changes
- `root` – Root configuration
- `docs` – Documentation
- `ci` – CI/CD configuration

**Type Examples:**
- `feat` – New feature
- `fix` – Bug fix
- `refactor` – Code restructuring
- `test` – Test additions/updates
- `docs` – Documentation
- `chore` – Build/config changes

**Example:**
```
feat(nextjs-app): add translation caching layer

Improves performance by caching AI responses for identical prompts.
- Add CacheStore class to lib/
- Integrate with /api/translate endpoint
- Add tests for cache validation

Fixes #123
```

---

## Deployment

### Manual Testing Before Deploy

```bash
cd nextjs-app

# 1. Build locally
npm run build

# 2. Check for errors
npm run lint
npm test -- --ci

# 3. Check environment
echo $DATABASE_URL
echo $NEXTAUTH_SECRET
echo $GEMINI_API_KEY
```

### Deploy to Vercel

Automatic on `main` branch push (configured in `.github/workflows/`).

**Steps:**
1. Push to `main`
2. GitHub Actions runs tests
3. Vercel auto-deploys if tests pass
4. Monitor at vercel.com dashboard

### Environment Variables

All production environment variables configured in Vercel dashboard:
- `DATABASE_URL` – Neon production database
- `NEXTAUTH_SECRET` – Production session secret
- `NEXTAUTH_URL` – Production domain
- `GEMINI_API_KEY` – API key (from .env.local)
- `GEMINI_MODEL` – Model name
- `GEMINI_BASE_URL` – Base URL

Local development uses `.env.local` (not committed).

---

## Debugging Workflows

### Local Development Server

```bash
cd nextjs-app
npm run dev

# Access at http://localhost:3000
# Automatic reload on file changes
# Check terminal for errors
```

### Database Connection Issues

```bash
cd nextjs-app

# Verify environment
echo $DATABASE_URL

# Test connection
npm run db:push
```

### Building for Production

```bash
cd nextjs-app

# Production build
npm run build

# Check for errors
npm run start  # Runs production build locally
```

### API Debugging

- Check network tab in browser DevTools
- Verify request/response format
- Check server logs in terminal
- For Gemini API: See [AGENT-GEMINI-API.md](./AGENT-GEMINI-API.md)
