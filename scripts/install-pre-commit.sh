#!/bin/sh
# Install pre-commit hook for JS/TS review project

echo "Installing pre-commit hook..."

# Get git root directory
GIT_ROOT=$(git rev-parse --show-toplevel)
HOOK_SOURCE="$GIT_ROOT/scripts/pre-commit-hook.sh"
HOOK_DEST="$GIT_ROOT/.git/hooks/pre-commit"

# Check if source file exists
if [ ! -f "$HOOK_SOURCE" ]; then
  echo "❌ Hook source file not found: $HOOK_SOURCE"
  exit 1
fi

# Copy hook file
cp "$HOOK_SOURCE" "$HOOK_DEST"

# Make executable
chmod +x "$HOOK_DEST"

echo "✅ pre-commit hook installed successfully!"
echo ""
echo "The hook will now automatically run ES version verification before each commit."
echo "To skip verification for a single commit, use: git commit --no-verify"
