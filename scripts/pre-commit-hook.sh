#!/bin/sh
# Pre-commit hook for JS/TS review project
# Runs the ES version verification script before commit
set -euo pipefail

echo "Running ES version verification..."

# Check if Node.js is available
if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "❌ Node.js is required to run ES version verification"
  echo "   Install Node.js or skip with: git commit --no-verify"
  exit 1
fi

# Get the directory where this script is located (git root)
GIT_ROOT=$(git rev-parse --show-toplevel)

# Run verification script
node "$GIT_ROOT/scripts/verify-es-versions.js"

# Check exit code
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ ES version verification failed - please fix the issues before committing"
  exit 1
fi

echo "✅ ES version verification passed"
echo ""
