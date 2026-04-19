# Tech Stack Reference

## MVP (nextjs-app/)

### Frontend
- **Framework:** React 19
- **Build Tool:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS + PostCSS 4
- **Component Model:** Server-side rendering (default) + Client-side interactive components

### Backend
- **Runtime:** Node.js / Vercel
- **API Framework:** Next.js API Routes (`app/api/`)
- **Database:** PostgreSQL (Neon) via Serverless driver
- **ORM:** Drizzle ORM
- **Authentication:** NextAuth.js v5 (beta)

### Build & Dev Tools
- **Compiler:** TypeScript with integrated Next.js build
- **Linter:** ESLint 9
- **Testing:** Jest 30
- **Task Runner:** npm scripts

### Key Dependencies
- `next@16.2.2` – Web framework
- `react@19.2.4`, `react-dom@19.2.4` – UI library
- `drizzle-orm@0.41` – Database ORM
- `next-auth@5.0.0-beta` – Authentication
- `@neondatabase/serverless@0.10` – PostgreSQL driver
- `bcryptjs@3.0.3` – Password hashing
- `xml2js@0.6.2` – XML parsing
- `dotenv@17.4.2` – Environment variable loading

### Dev Dependencies
- `@types/*` – TypeScript definitions
- `@jest/globals@30` – Jest testing framework
- `@tailwindcss/postcss@4` – Tailwind CSS
- `cross-env@10.1.0` – Cross-platform env vars
- `drizzle-kit@0.30` – Database migrations
- `ts-node` – TypeScript execution

---

## Legacy PoC (legacy-poc/)

### Frontend
- **Framework:** Vanilla HTML + JavaScript (ES5/ES6)
- **Styling:** Custom CSS (no framework)
- **DOM Manipulation:** Direct JavaScript (no React)

### Backend
- **None** – Static files only, requires external API

### Testing
- **Test Runner:** Custom HTML-based test runner (`tests/test-runner.html`)
- **Framework:** None (vanilla JavaScript)

### Key Characteristics
- **No build step** – Runs directly in browser
- **Relative imports** – All paths relative to file location
- **No dependencies** – Standalone, no npm needed
- **Data:** Loaded from `../data/entries.js` (global `ALL_ENTRIES` array)

---

## Root Level

### Entry Point
- **index.html** – Pure static HTML app selector

### Build & CI
- **CI:** GitHub Actions (`.github/workflows/`) runs from `nextjs-app/` directory
- **Deployment:** Vercel (Next.js platform)
- **Build Output:** `nextjs-app/.next/`

### Scripts
- **Data Processing:** Node.js scripts in `scripts/` folder
  - `analyze_dictionaries.js` – Parse XML dictionaries
  - `analyze_sfm.js` – Parse SFM files
  - `import-ubs-xml.ts` – TypeScript import script
  - `validate-roundtrip.ts` – Validation script

---

## Version Lock

All major version constraints are in `nextjs-app/package.json`. Key versions:
- Node.js: 18+ (Vercel default)
- npm: 9+
- Next.js: 16.2.2
- React: 19.2.4
- TypeScript: Latest (via @types/)
- Jest: 30
- PostgreSQL: 14+ (Neon)
