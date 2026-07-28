---
name: commit-and-push
description: Use when the user says "commit and push", "commit & push", or asks to commit and push changes. Verifies the API client points at production (abantu-api.modulrza.app) before committing, commits all changes with a message summarizing changes since the last commit, then runs git push.
---

# Commit and Push

When the user says "commit and push" (or any close variant), run this workflow
in order. Do not skip steps. Do not commit if a check fails.

## 1. Verify the API URL points at production

Read `src/server/api/client.ts`. The active `API` constant (the one assigned
and NOT commented out) MUST be `https://abantu-api.modulrza.app`.

- If it already is, continue.
- If it is anything else (e.g. `http://localhost:3001` or a local IP), edit
  the file so the production URL is the active, uncommented assignment and the
  previously-active URL is commented out. Preserve the other commented lines
  as they are.

The correct end state of the relevant lines:

```ts
export const API = "https://abantu-api.modulrza.app";
```

with every other `API` candidate line commented out.

## 2. Inspect the changes since the last commit

Run `git status` and `git diff` (and `git diff --staged` if anything is
already staged) to understand every change. Also run
`git log --oneline -5` to match the existing commit message style.

## 3. Stage and commit

- Stage all changes: `git add -A`.
- Write a concise commit message that summarizes the changes since the last
  commit. Match the tone and length of recent commits in the repo. Do not
  mention the API URL check unless it produced an actual change.
- Commit: `git commit -m "<message>"`. Do not use `--amend`, `-i`, or
  `--no-verify`.

## 4. Push

Run `git push`. If the branch has no upstream set, run
`git push -u origin HEAD`.

## 5. Report

Report back in one line: the commit hash, the message, and that the push
succeeded. If any step failed, stop and say what failed.
