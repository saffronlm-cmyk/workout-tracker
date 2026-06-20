#!/bin/bash
# SessionStart hook for the workout-tracker repo.
# This project is a single static index.html with no dependencies, so there is
# nothing to install. Instead we run the lightweight validation so the session
# starts with a known-good baseline (and surfaces a broken script early).
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}"

if ! command -v node >/dev/null 2>&1; then
  echo "session-start: node not found; skipping validation."
  exit 0
fi

echo "session-start: validating index.html…"
# Never block the session on a validation failure — report and continue.
node scripts/validate.mjs || echo "session-start: validation reported issues (see above)."
exit 0
