# Project instructions

Always load the `suggest-only` skill before responding to any prompt in this repo.

## No installation without permission

Do NOT install any software (brew, apt, npm global packages, etc.) without explicit user permission. This includes tmux, clojure, or any other tool not already present on the system.

## Verification after edits

Do NOT run TypeScript typecheck commands (`tsc --noEmit`, `bunx tsc`, etc.) after making edits. The user runs the bun dev server continuously and sees compile errors there in real time. Only run checks if explicitly asked.
