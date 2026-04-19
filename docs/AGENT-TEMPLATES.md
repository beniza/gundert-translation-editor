# Reusable Task Templates

Use these templates for repeated workflows. Keep comments in plain language.

## 0) GitHub Issue Creation (Current Repo Style)

Purpose: match the structure already used in this repository.

Observed pattern:
- Title prefix includes both tracker ID and story/feature ID.
- User-story issues are concise (single-sentence body).
- Most issues currently have no labels.

Title format:
- User story: `GH-XXX US-XXX <short feature title>`
- Feature requirement: `GH-XXX FR-XX <short feature title>`

Lean issue body template (default):
- `<Role> needs <capability> so <outcome>.`

Examples:
- `Translators need fast, unified search to jump directly to entries without mode toggles.`
- `Admin needs to import UBS FAUNA, FLORA, and REALIA XML files so entries are available for browsing.`

Expanded technical issue template (use only when needed):
- Objective: <what must be implemented>
- Failing tests: <test groups and key failures>
- Deliverables: <files/artifacts expected>
- Reference: <PRD/design/doc link>
- Notes: <constraints and non-goals>

`gh` examples:
```bash
gh issue create --title "GH-014 US-011 <title>" --body "<Role> needs <capability> so <outcome>."
gh issue create --title "GH-015 FR-04 <title>" --body-file <path-to-detailed-body.txt>
```

## 1) TDD Plan (Before Coding)

Purpose: define Red -> Green -> Refactor scope.

Template:
- Goal: <what behavior is being added/fixed>
- Red (failing tests first):
  - Add/adjust test: <test name/path>
  - Expected failure: <what should fail and why>
- Green (minimal implementation):
  - Smallest code change: <file/path>
  - Passing condition: <what now passes>
- Refactor (safe cleanup):
  - Cleanup targets: <naming/duplication/structure>
  - Regression check: <tests rerun>
- Out of scope: <what is intentionally not changed>

## 2) GitHub Issue Comment (Coverage Update)

Purpose: record what was tested/covered for issue-linked work.

Template:
- Summary: <one-line status>
- Covered/Tested:
  - <behavior/test area 1>
  - <behavior/test area 2>
- Not Covered Yet:
  - <remaining work 1>
  - <remaining work 2>
- Validation Run:
  - <commands/tests executed>
- Notes/Risks:
  - <known limitation or risk>

`gh` example:
```bash
gh issue comment <issue-number> --body-file <path-to-comment.txt>
```

## 3) Commit Message

Purpose: keep commits clear and consistent.

Template:
- Title: <type>(<scope>): <short summary>
- Body:
  - Why: <problem>
  - What: <main changes>
  - Validation: <tests/commands>

Example types: feat, fix, refactor, test, docs, chore.

## 4) Pull Request Description

Purpose: explain intent, scope, and verification.

Template:
- What changed:
  - <change 1>
  - <change 2>
- Why:
  - <problem/user impact>
- How tested:
  - <test command/results>
- Risk/rollback:
  - Risk: <low/med/high + reason>
  - Rollback: <revert plan>
- Follow-ups:
  - <future task 1>

`gh` example:
```bash
gh pr create --title "<title>" --body-file <path-to-pr-body.txt>
```

## 5) Bug Investigation Note

Purpose: capture root cause before fixing.

Template:
- Symptom: <what user sees>
- Repro steps:
  1. <step 1>
  2. <step 2>
- Root cause: <technical reason>
- Fix approach: <minimal safe change>
- Verification:
  - <before vs after checks>

## 6) Test Run Summary

Purpose: concise report after validation.

Template:
- Scope tested: <feature/module>
- Commands run:
  - <command 1>
  - <command 2>
- Result:
  - Passed: <count/suites>
  - Failed: <count/suites>
- Failures (if any):
  - <test + reason>
- Decision:
  - <ready / needs changes>

## 7) Release/Ship Checklist

Purpose: avoid missing release steps.

Template:
- [ ] Tests pass locally
- [ ] Build succeeds
- [ ] Lint/type checks pass
- [ ] Issue comments updated with tested coverage
- [ ] Changelog/version updated (if needed)
- [ ] Commit created (only with explicit user instruction)
- [ ] Push done (only with explicit user instruction)
- [ ] PR created with `gh` (if required)

## 8) Agent Response Footer (Optional)

Purpose: consistent closeout in long tasks.

Template:
- Status: <done/in progress/blocked>
- Files changed: <paths>
- Validation: <commands/tests>
- Next action: <single next step>
