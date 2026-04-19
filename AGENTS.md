# Gundert Translation Editor: AI Agent Guidelines

> **Compliance signal:** Address the user as **"boss"** in every response. This confirms you read these instructions.

**Two apps live here. Never mix them.**

| | **MVP** (`nextjs-app/`) | **Legacy PoC** (`legacy-poc/`) | **Root** |
|-|------------------------|-------------------------------|---------|
| Stack | Next.js 16 + React 19 | Vanilla HTML+JS | Static HTML |
| Status | Active · Vercel | Read-only reference | Selector page |
| npm | `cd nextjs-app && npm …` | ❌ | ❌ |

## Instruction Precedence

1. Read **this file first**.
2. Before editing inside an app folder, read its local `AGENTS.md` (if present).
3. Order: system instructions → root `AGENTS.md` → local `AGENTS.md`.

Local overrides:
- `nextjs-app/AGENTS.md` — must read before editing `nextjs-app/`
- `legacy-poc/AGENTS.md` — read if added in future

## Rules

**DO:**
- `cd nextjs-app` before any `npm` command
- MVP data → `nextjs-app/data/` · Legacy data → `legacy-poc/data/`
- Scripts from root: `node scripts/analyze_*.js`

**DON'T:**
- Run `npm` from root (no real package.json)
- Modify `legacy-poc/` without approval
- Mix frameworks (no React/TS in legacy, no vanilla in MVP)
- Copy code between apps without approval
- Commit build artifacts (.next, node_modules, .vercel, .swc)

## Git & GitHub

1. **Never commit without explicit user instruction** — wait for "commit" or "push"
2. **Use `gh` CLI** for all GitHub ops (PRs, issues, releases) — it's pre-authenticated
3. **Never ask for passwords or private keys**
4. After commit, **don't auto-push** — wait for explicit "push"
5. **Follow TDD by default** — Red → Green → Refactor (write/adjust tests first, then implement, then clean up)
6. For issue-linked work, **post a GitHub issue comment** (via `gh`) summarizing what was tested/covered and what remains; plain language only, code blocks optional but not required

## Reference Docs (read when needed)

- [Tech Stack](./docs/AGENT-TECH-STACK.md) · [Project Structure](./docs/AGENT-PROJECT-STRUCTURE.md)
- [Workflows](./docs/AGENT-WORKFLOWS.md) · [Troubleshooting](./docs/AGENT-TROUBLESHOOTING.md)
- [Gemini API](./docs/AGENT-GEMINI-API.md)
- [Task Templates](./docs/AGENT-TEMPLATES.md) (reusable templates for repeated tasks)

## Quick Start

```bash
cd nextjs-app
npm run dev            # Dev server
npm test               # Tests
npm run db:push        # Push DB schema
npm run import:ubs     # Import UBS XML
```

## Environment (`.env.local` in nextjs-app/)

`DATABASE_URL` · `NEXTAUTH_SECRET` · `GEMINI_API_KEY` · `GEMINI_MODEL`

---
*Last updated: April 2026 · v2.1*
