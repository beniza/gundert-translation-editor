# Testing Guide

## Test Status

**Current State:**
- ✅ **14 unit tests passing** - XML parser tests (no database needed)
- ⏭️ **76 integration tests skipped** - Database tests (waiting for schema deployment)

```
Test Suites: 1 passed, 2 skipped
Tests:       14 passed, 76 skipped
```

---

## Test Organization

### 1. Unit Tests: XML Parser (`tests/xml-parser.test.ts`)
**Status:** ✅ Passing

Tests the UBS XML import parser in isolation, without any database.

**Coverage:**
- XML parsing for FAUNA, FLORA, REALIA files
- Entry field extraction (keys, titles, sections, paragraphs)
- Bible reference extraction
- Index item parsing
- Round-trip serialization
- Checksum consistency
- Bulk processing
- Data structure validation

**Run locally:**
```bash
npm test -- tests/xml-parser.test.ts
```

---

### 2. Integration Tests: Database Import (`tests/db/import.test.ts`)
**Status:** ⏭️ Skipped (database required)

Tests the import pipeline using live Neon database.

**Prerequisites:**
1. Neon database configured (`POSTGRES_URL_NON_POOLING` in `.env.local`)
2. Schema deployed: `npm run db:push`
3. All 10 tables created

**Run when database ready:**
```bash
npm run db:push
npm test -- tests/db/import.test.ts --runInBand
```

**Coverage:**
- Database inserts (resource entries)
- JSONB source_content preservation
- Foreign key validation
- Idempotent upsert behavior
- Bulk import without duplicates

---

### 3. Integration Tests: Schema Validation (`tests/db/schema.test.ts`)
**Status:** ⏭️ Skipped (database required)

Tests database schema structure, constraints, and data types.

**Prerequisites:**
1. Same as Import tests above

**Run when database ready:**
```bash
npm run db:push
npm test -- tests/db/schema.test.ts --runInBand
```

**Coverage (50+ assertions):**
- All 10 tables exist with correct columns
- Data types: VARCHAR, JSONB, ENUMs, UUIDs
- Constraints: UNIQUE, NOT NULL, FKs
- Cascade deletes configured
- UTF-8 encoding for multilingual support
- Soft deletes (deleted_at column)
- Timestamps (created_at, updated_at)
- JSONB indexing

---

## Running Tests

### All Tests (Current)
```bash
npm test
```
- Runs unit tests ✅
- Skips integration tests ⏭️

### Run All Tests (Including Integration)
Requires: Database setup + `npm run db:push`
```bash
npm test -- --testPathIgnorePatterns=none
```

### Run Specific Test Suite
```bash
npm test -- tests/xml-parser.test.ts
npm test -- tests/db/import.test.ts
npm test -- tests/db/schema.test.ts
```

### Watch Mode
```bash
npm run test:watch
```

### Single Run (CI mode)
```bash
npm test -- --coverage
```

---

## Database Setup (For Integration Tests)

### Step 1: Ensure Database Connection
```bash
# Check .env.local has POSTGRES_URL_NON_POOLING
cat .env.local | grep POSTGRES_URL_NON_POOLING
```

### Step 2: Deploy Schema
```bash
npm run db:push
```
This creates all 10 tables in Neon.

### Step 3: Run Integration Tests
```bash
npm test -- tests/db/import.test.ts --runInBand
npm test -- tests/db/schema.test.ts --runInBand
```

### Step 4: Verify Import Script
After tests pass, test the actual importer:
```bash
npm run import:ubs
npm run validate:roundtrip
```

---

## Test Scripts

| Command | Purpose |
|---------|---------|
| `npm test` | Run all unit tests |
| `npm run test:watch` | Watch mode for development |
| `npm test -- --coverage` | Coverage report |
| `npm test -- tests/xml-parser.test.ts` | XML parser tests only |
| `npm test -- tests/db/import.test.ts --runInBand` | Integration tests (requires DB) |
| `npm run import:ubs` | Run actual UBS XML importer |
| `npm run validate:roundtrip` | Validate import integrity |

---

## CI/CD Pipeline

### Default CI (No Database)
```bash
npm test                    # Unit tests only
npm run build              # Build check
npm run lint               # Linting
```

### Full Integration CI (Requires Database)
```bash
npm run db:push            # Deploy schema to test DB
npm test -- tests/db/**    # Run all DB tests
npm run import:ubs         # Test importer
npm run validate:roundtrip # Verify round-trip
```

---

## Debugging Test Failures

### XML Parser Failures
```bash
# Run with verbose output
npm test -- tests/xml-parser.test.ts --verbose

# Check XML files exist
ls -la data/xml/
```

### Database Connection Issues
```bash
# Check connection string
echo $POSTGRES_URL_NON_POOLING

# Verify schema deployed
psql $POSTGRES_URL_NON_POOLING -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
```

### Import Test Failures
```bash
# Run single integration test
npm test -- tests/db/import.test.ts -t "should insert parsed entries"

# Check database state
npm run db:migrate
```

---

## Next Steps

1. ✅ **Unit tests passing** - GH-008 implementation verified
2. ⏳ **Deploy database schema** - `npm run db:push`
3. ⏳ **Run integration tests** - Verify import works with real DB
4. ⏳ **Test importer script** - `npm run import:ubs`
5. ⏳ **Validate round-trip** - `npm run validate:roundtrip`

