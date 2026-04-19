# Project Structure Reference

## Root Repository

```
/
├── index.html                          # App selector (entry point)
├── README.md                           # Project overview
├── AGENTS.md                           # Agent guidelines (minimal)
├── package.json                        # Reference only (do not use for npm)
├── .gitignore                          # Git ignore rules
├── .github/
│   └── workflows/                      # CI/CD configuration (runs from nextjs-app/)
├── nextjs-app/                         # ⭐ Active MVP application
├── legacy-poc/                         # Reference PoC application
├── scripts/                            # Data processing scripts
├── docs/                               # Documentation
│   ├── AGENT-*.md                      # Agent reference guides
│   ├── BROWSER_UI_DESIGN.md            # UI design documentation
│   ├── TRANSLATION_*.md                # Feature documentation
│   └── charts/                         # Architecture diagrams
└── schemas/                            # XML schema definitions
    └── thematic_lexicon.xsd
```

---

## MVP Application (nextjs-app/)

```
nextjs-app/
├── app/
│   ├── layout.tsx                      # Root layout (auth wrapper)
│   ├── page.tsx                        # Home/auth gateway
│   ├── globals.css                     # Global styles
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts                # NextAuth.js auth routes
│   │   ├── translate/
│   │   │   └── route.ts                # AI translation endpoint
│   │   ├── import/
│   │   │   └── route.ts                # Resource import
│   │   ├── resources/
│   │   │   └── entries/
│   │   │       └── route.ts            # Lexicon/entry queries
│   │   └── seed/
│   │       └── route.ts                # Demo data endpoint
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx                # Sign-in page
│   ├── browser/
│   │   └── page.tsx                    # Resource browser
│   ├── translator/
│   │   └── page.tsx                    # Translation workbench
│   └── lexicon/
│       ├── page.tsx                    # Lexicon browser
│       ├── LexiconInfiniteList.tsx     # Infinite scroll component
│       └── [resource]/[version]/[key]/
│           └── page.tsx                # Entry detail page
├── api/
│   └── translate.js                    # Express-compatible endpoint
├── lib/
│   ├── auth.ts                         # NextAuth configuration
│   ├── auth-types.ts                   # Auth TypeScript types
│   ├── db/
│   │   ├── index.ts                    # Database connection
│   │   └── schema.ts                   # Drizzle schema
│   ├── browser/
│   │   ├── entry-list.ts               # Entry filtering/sorting
│   │   ├── lexicon-utils.ts            # Lexicon utilities
│   │   └── reference-formatter.ts      # Bible reference formatting
│   ├── importer/
│   │   └── ubs-xml-importer.ts         # UBS XML import logic
│   ├── import-workflow/
│   │   └── contracts.ts                # Import contract types
│   └── xml-parser/
│       └── parser.ts                   # XML parsing utilities
├── data/
│   ├── entries.js                      # ALL_ENTRIES array (for legacy PoC)
│   ├── entries.json                    # JSON export of entries
│   ├── stats.json                      # Dictionary statistics
│   ├── sfm/                            # SFM format files
│   │   ├── 94XXAFFR.SFM
│   │   ├── 95XXBFFR.SFM
│   │   └── 96XXCFFR.SFM
│   └── xml/                            # XML format files
│       ├── FAUNA_en.xml
│       ├── FLORA_en.xml
│       ├── REALIA_en.xml
│       ├── FAUNA_fr.xml
│       └── [export drafts]
├── drizzle/
│   ├── 0000_wide_payback.sql           # Migration 0
│   ├── 0001_comprehensive_schema.sql   # Migration 1
│   └── meta/
│       ├── _journal.json
│       └── 0000_snapshot.json
├── tests/
│   ├── api/
│   │   ├── resources-entries-*.test.ts
│   │   └── ...
│   ├── browser/
│   │   ├── entry-list.test.ts
│   │   ├── lexicon-utils.test.ts
│   │   └── us-*.test.ts                # User story tests
│   ├── db/
│   │   ├── import.test.ts
│   │   └── schema.test.ts
│   ├── importer/
│   │   └── us-008.test.ts
│   ├── xml-parser.test.ts
│   ├── import-security-matrix.test.ts
│   └── import-workflow-risk-matrix.test.ts
├── public/
│   └── [static assets]
├── package.json
├── tsconfig.json
├── next.config.ts
├── jest.config.js
├── jest.setup.js
├── postcss.config.mjs
├── eslint.config.mjs
├── drizzle.config.ts
├── AGENTS.md                           # Minimal stub (refers to root)
├── CLAUDE.md                           # @AGENTS.md reference
└── README.md
```

---

## Legacy PoC (legacy-poc/)

```
legacy-poc/
├── index.html                          # Local file listing (not used)
├── README.md                           # Legacy documentation
├── pages/
│   ├── browser.html                    # Resource browser UI
│   ├── translator.html                 # Translation workbench UI
│   ├── dashboard.html                  # Dashboard UI
│   └── [resource]-specific pages
│       ├── fauna.html
│       ├── flora.html
│       └── realia.html
├── assets/
│   ├── js/
│   │   ├── browser.js                  # Browser logic
│   │   └── translator.js               # Translator logic
│   └── css/
│       ├── browser.css                 # Browser styling
│       └── translator.css              # Translator styling
├── data/
│   ├── entries.js                      # ALL_ENTRIES array (mirrored from MVP)
│   ├── entries.json                    # JSON export
│   ├── stats.json                      # Statistics
│   ├── sfm/                            # Reference SFM files
│   └── xml/                            # Reference XML files
├── tests/
│   ├── test-runner.html                # Browser-based test suite
│   ├── js/
│   │   ├── test-runner.js
│   │   └── test-*.js
│   └── css/
│       └── test-runner.css
└── v01/                                # Version 0.1 archive
    ├── analyze_sfm.js
    ├── dashboard.html
    └── stats.json
```

---

## Important Path Mappings

### MVP (TypeScript)
- **Absolute imports:** Use `@/` prefix
  - `@/lib/db` → `nextjs-app/lib/db`
  - `@/app/api` → `nextjs-app/app/api`
  - Configure in `nextjs-app/tsconfig.json` under `compilerOptions.paths`

### Legacy (Vanilla JS)
- **Relative paths:** From file location
  - `browser.html` → `../assets/js/browser.js`
  - `browser.html` → `../data/entries.js`
  - `browser.js` → `ALL_ENTRIES` (global array)

### Scripts (Node.js)
- **Root directory:** `scripts/` folder
  - Run from repository root: `node scripts/analyze_dictionaries.js`
  - Output: `nextjs-app/data/`
  - Can use `ts-node` for TypeScript scripts

---

## Data File Locations

| File | MVP Path | Legacy Path | Purpose |
|------|----------|-------------|---------|
| Entries | `nextjs-app/data/entries.js` | `legacy-poc/data/entries.js` | Global ALL_ENTRIES array |
| JSON Export | `nextjs-app/data/entries.json` | `legacy-poc/data/entries.json` | Structured entry data |
| Statistics | `nextjs-app/data/stats.json` | `legacy-poc/data/stats.json` | Dictionary statistics |
| UBS Dictionaries | `nextjs-app/data/xml/` | `legacy-poc/data/xml/` | Source XML files |
| SFM Files | `nextjs-app/data/sfm/` | `legacy-poc/data/sfm/` | Source SFM files |

---

## Build Artifacts (Not Committed)

- `.next/` – Next.js build output
- `.swc/` – SWC compiler cache
- `node_modules/` – npm dependencies
- `.vercel/` – Vercel deployment cache
- `.env.local` – Local environment variables
- `*.tsbuildinfo` – TypeScript build info
