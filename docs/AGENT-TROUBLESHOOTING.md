# Troubleshooting Guide

## General Issues

### "Cannot find module" errors

**Symptom:**
```
Error: Cannot find module '@/lib/db'
```

**Solutions:**
1. Verify import path uses `@/` prefix (absolute imports)
2. Check `nextjs-app/tsconfig.json` for path mapping:
   ```json
   "paths": { "@/*": ["./*"] }
   ```
3. Verify file exists at correct location
4. Restart dev server: `npm run dev`

---

### Type errors in TypeScript

**Symptom:**
```
TS2339: Property 'x' does not exist on type 'y'
```

**Solutions:**
1. Check type definitions are imported: `import type { Type } from '@/lib/...'`
2. Verify schema types match database changes
3. Run type check: `npm run build` (catches all TS errors)
4. Check `.d.ts` files in `nextjs-app/next-env.d.ts`

---

## API Issues

### Gemini API returns 405 (Method Not Allowed)

**Symptom:**
```
Error: 405 from Gemini API
LLM request failed (405)
```

**Root Cause:** Endpoint mismatch. Code tried `/chat/completions` (OpenAI format) but Gemini doesn't support this.

**Solutions:**
1. Check endpoint in `nextjs-app/app/api/translate/route.ts` (line ~35):
   - ❌ Wrong: `https://api.openai.com/v1/chat/completions`
   - ✅ Right: `https://generativelanguage.googleapis.com/v1/models/{model}:generateContent`

2. Verify request format is Gemini native:
   ```javascript
   // ❌ Wrong (OpenAI format)
   { "messages": [...], "model": "..." }
   
   // ✅ Right (Gemini format)
   { "contents": [{ "parts": [{ "text": "..." }] }], "generationConfig": {...} }
   ```

3. Check API key placement:
   - For Gemini: Query parameter `?key=...` or header `x-goog-api-key: ...`
   - ❌ Not: `Authorization: Bearer ...` (that's OpenAI)

4. Verify base URL in code (should be `/v1`, not `/v1beta/openai`)

**File to check:** `nextjs-app/app/api/translate/route.ts`

---

### Gemini API returns 401 (Unauthorized)

**Symptom:**
```
Error: 401 Unauthorized from Gemini API
```

**Solutions:**
1. Verify API key is set:
   ```bash
   echo $GEMINI_API_KEY
   ```

2. Check environment variable name is correct:
   - Should be: `GEMINI_API_KEY`
   - Set in: `nextjs-app/.env.local`

3. Verify key format (should be a long string starting with `AI...`)

4. Check key in Vercel dashboard if deployed

5. Make sure `.env.local` is in `nextjs-app/` folder, not root

---

### 500 error from /api/translate

**Symptom:**
```
POST /api/translate returns 500 Internal Server Error
```

**Debugging:**
1. Check server logs in terminal (where `npm run dev` is running)
2. Look for error message with stack trace
3. Check these common causes:
   - Missing environment variables
   - Database connection issue
   - XML parser failure
   - NextAuth session issue

**File to check:** `nextjs-app/app/api/translate/route.ts`

---

### NextAuth session not persisting

**Symptom:**
```
User logged out after refresh
Session is undefined
```

**Solutions:**
1. Verify `NEXTAUTH_SECRET` is set in `.env.local`:
   ```bash
   openssl rand -base64 32 > /tmp/secret.txt
   # Copy output to .env.local
   NEXTAUTH_SECRET=<paste-here>
   ```

2. Verify `NEXTAUTH_URL` matches your domain:
   - Local: `http://localhost:3000`
   - Vercel: `https://your-app.vercel.app`

3. Check session configuration in `nextjs-app/lib/auth.ts`

4. Restart dev server after `.env.local` changes

**File to check:** `nextjs-app/lib/auth.ts`

---

## Database Issues

### "entries.js not found" in legacy app

**Symptom:**
```
ReferenceError: ALL_ENTRIES is not defined
Error loading ../data/entries.js
```

**Root Cause:** `legacy-poc/data/entries.js` doesn't exist.

**Solutions:**
1. Verify file exists:
   ```bash
   ls legacy-poc/data/entries.js
   ```

2. If missing, copy from MVP:
   ```bash
   cp nextjs-app/data/entries.js legacy-poc/data/entries.js
   ```

3. Check path in `legacy-poc/pages/browser.html`:
   ```html
   <script src="../data/entries.js"></script>
   ```
   Should resolve to `legacy-poc/data/entries.js`

4. Verify entries.js is not empty:
   ```bash
   head legacy-poc/data/entries.js
   ```

---

### Database connection error

**Symptom:**
```
Error: could not connect to server: Connection refused
Database connection failed
```

**Solutions:**
1. Verify `DATABASE_URL` is set:
   ```bash
   echo $DATABASE_URL
   ```

2. Format should be:
   ```
   postgresql://user:password@host:5432/database
   ```

3. If using Neon, verify URL from Neon dashboard

4. Test connection:
   ```bash
   cd nextjs-app
   npm run db:push
   ```

5. Check `.env.local` is in `nextjs-app/` folder

**File to check:** `nextjs-app/lib/db/index.ts`

---

### Schema mismatch errors

**Symptom:**
```
Error: column "x" of relation "y" does not exist
PG error: UNIQUE constraint violated
```

**Solutions:**
1. Check schema is applied to database:
   ```bash
   cd nextjs-app
   npm run db:push
   ```

2. Verify migration files are committed:
   ```bash
   ls drizzle/
   ```

3. Check for uncommitted schema changes:
   ```bash
   npm run db:generate
   ```

4. If database is out of sync, reset (dev only):
   ```bash
   npm run db:push --force-recreate
   ```

**File to check:** `nextjs-app/lib/db/schema.ts`

---

## Build & Deployment

### Build fails with TypeScript errors

**Symptom:**
```
npm run build fails
Type 'x' is not assignable to type 'y'
```

**Solutions:**
1. Fix TypeScript errors locally:
   ```bash
   cd nextjs-app
   npm run build
   ```

2. Review error messages carefully

3. Check imports are correct

4. Verify all types are imported

---

### "node_modules not found"

**Symptom:**
```
Error: Cannot find module 'react'
```

**Solutions:**
1. Install dependencies:
   ```bash
   cd nextjs-app
   npm install
   ```

2. Verify you're in `nextjs-app/` folder

3. Check `package.json` exists and is valid

4. Clear cache if needed:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### ".env.local not found"

**Symptom:**
```
Error: NEXTAUTH_SECRET is undefined
Database connection failed
```

**Solutions:**
1. Verify `.env.local` exists:
   ```bash
   ls nextjs-app/.env.local
   ```

2. Create it with required variables:
   ```bash
   cat > nextjs-app/.env.local << 'EOF'
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-secret
   GEMINI_API_KEY=your-key
   EOF
   ```

3. Restart dev server after changes

4. **Never commit .env.local** (add to `.gitignore`)

---

## Legacy PoC Issues

### Legacy app won't load HTML

**Symptom:**
```
browser.html doesn't load
Blank page
```

**Solutions:**
1. Check file exists:
   ```bash
   ls legacy-poc/pages/browser.html
   ```

2. Open in browser directly or via file server:
   ```bash
   # Use a local file server (not recommended)
   # Or access via MVP's resource browser
   ```

3. Check browser console for JavaScript errors

4. Verify CSS loads:
   ```html
   <link rel="stylesheet" href="../assets/css/browser.css">
   ```

---

### Legacy app loads but no data displays

**Symptom:**
```
Browser shows empty table
No entries loaded
```

**Solutions:**
1. Check console for `ALL_ENTRIES is not defined`
2. Verify `legacy-poc/data/entries.js` exists
3. Check script tag loads it:
   ```html
   <script src="../data/entries.js"></script>
   ```
4. Verify entries.js contains `var ALL_ENTRIES = [...]`

---

### JavaScript errors in browser console

**Symptom:**
```
Uncaught ReferenceError: browser is not defined
```

**Solutions:**
1. Check all required scripts load in correct order:
   ```html
   <script src="../data/entries.js"></script>
   <script src="../assets/js/browser.js"></script>
   ```

2. Data must load before logic

3. Check for syntax errors in JS files

4. Use browser DevTools console to debug

---

## CI/CD Issues

### GitHub Actions fails

**Symptom:**
```
Workflow failed: npm command not found
Tests failed in CI
```

**Solutions:**
1. Check workflow runs from correct directory:
   - Should be: `nextjs-app/`
   - Not: root directory

2. Verify environment variables in Vercel dashboard

3. Check `.github/workflows/` configuration

4. Review test logs in GitHub Actions tab

---

### Vercel deployment fails

**Symptom:**
```
Build failed on Vercel
```

**Solutions:**
1. Check Vercel logs for specific error
2. Verify environment variables in Vercel dashboard
3. Build locally first to catch errors early:
   ```bash
   cd nextjs-app
   npm run build
   ```
4. Check Node.js version compatibility

---

## Getting Help

1. **Check error messages carefully** – they usually point to the issue
2. **Search in the codebase** for similar patterns
3. **Read relevant documentation files** in `docs/`
4. **Check commit history** for similar fixes: `git log --grep="error"`
5. **Run locally first** before assuming deployment issues
