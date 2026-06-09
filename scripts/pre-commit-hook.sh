#!/bin/sh
# Pre-commit hook for JS/TS review project
# Runs the ES version verification script before commit

echo "Running ES version verification..."

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
