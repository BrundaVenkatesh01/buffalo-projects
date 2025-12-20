#!/bin/bash

# Buffalo Projects - Design System Migration Script
# Migrates codebase from hardcoded values to unified design system
# DO NOT run this on design system files themselves (ui-next, openai, yc, motion)

set -e

echo "🦬 Buffalo Projects Design System Migration"
echo "==========================================="
echo ""

# Directories to process
TARGET_DIRS="app src/components/workspace src/components/navigation src/components/comments src/components/notifications src/components/mentor src/components/common src/components/status"

# Directories to EXCLUDE (they ARE the design system)
EXCLUDE_PATTERN='ui-next\|/ui/\|openai\|yc/\|motion/\|design-system'

echo "Step 1: Updating import statements..."
echo "-------------------------------------"

# Replace old ui component imports with ui-next
find $TARGET_DIRS -name "*.tsx" -type f | grep -v "$EXCLUDE_PATTERN" | while read file; do
  # Only process files that actually import from @/components/ui/
  if grep -q 'from "@/components/ui/' "$file"; then
    echo "  Migrating imports in: $file"

    # Badge
    sed -i '' 's|from "@/components/ui/badge"|from "@/components/ui-next"|g' "$file"

    # Button
    sed -i '' 's|from "@/components/ui/button"|from "@/components/ui-next"|g' "$file"

    # Card components
    sed -i '' 's|from "@/components/ui/card"|from "@/components/ui-next"|g' "$file"

    # Input/Textarea
    sed -i '' 's|from "@/components/ui/input"|from "@/components/ui-next"|g' "$file"
  fi
done

echo ""
echo "Step 2: Replacing hardcoded colors with semantic tokens..."
echo "-----------------------------------------------------------"

find $TARGET_DIRS -name "*.tsx" -type f | grep -v "$EXCLUDE_PATTERN" | while read file; do
  # Check if file has hardcoded colors
  if grep -qE 'bg-\[#|text-\[#|border-\[#|bg-white/\[0\.|border-white/\[0\.' "$file"; then
    echo "  Fixing colors in: $file"

    # Background colors
    sed -i '' 's|bg-\[#000000\]|bg-background|g' "$file"
    sed -i '' 's|bg-\[#0A0A0A\]|bg-card|g' "$file"
    sed -i '' 's|bg-\[#0F0F0F\]|bg-popover|g' "$file"
    sed -i '' 's|bg-\[#141414\]|bg-elevation-1|g' "$file"
    sed -i '' 's|bg-\[#171717\]|bg-secondary|g' "$file"
    sed -i '' 's|bg-white/\[0\.03\]|bg-card|g' "$file"
    sed -i '' 's|bg-white/\[0\.04\]|bg-card|g' "$file"
    sed -i '' 's|bg-white/\[0\.05\]|bg-elevation-1|g' "$file"
    sed -i '' 's|bg-white/\[0\.06\]|bg-elevation-1|g' "$file"

    # Border colors
    sed -i '' 's|border-white/\[0\.08\]|border-border|g' "$file"
    sed -i '' 's|border-white/\[0\.10\]|border-border|g' "$file"
    sed -i '' 's|border-white/10|border-border|g' "$file"
    sed -i '' 's|border-white/\[0\.20\]|border-border-hover|g' "$file"
    sed -i '' 's|border-white/20|border-border-hover|g' "$file"
  fi
done

echo ""
echo "Step 3: Standardizing transition classes..."
echo "--------------------------------------------"

find $TARGET_DIRS -name "*.tsx" -type f | grep -v "$EXCLUDE_PATTERN" | while read file; do
  if grep -qE 'transition-colors duration-|transition-transform duration-' "$file"; then
    echo "  Fixing transitions in: $file"

    # Standardize to transition-all duration-200
    sed -i '' 's|transition-colors duration-150|transition-all duration-200|g' "$file"
    sed -i '' 's|transition-transform duration-150|transition-all duration-200|g' "$file"
    sed -i '' 's|transition-colors duration-200|transition-all duration-200|g' "$file"
    sed -i '' 's|transition-transform duration-200|transition-all duration-200|g' "$file"
  fi
done

echo ""
echo "Step 4: Cleaning up hover states..."
echo "-------------------------------------"

find $TARGET_DIRS -name "*.tsx" -type f | grep -v "$EXCLUDE_PATTERN" | while read file; do
  if grep -q 'hover:bg-white/\[0\.' "$file"; then
    echo "  Fixing hover states in: $file"

    sed -i '' 's|hover:bg-white/\[0\.05\]|hover:bg-muted|g' "$file"
    sed -i '' 's|hover:bg-white/\[0\.10\]|hover:bg-elevation-1|g' "$file"
    sed -i '' 's|hover:bg-white/5|hover:bg-muted|g' "$file"
  fi
done

echo ""
echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Review changes with: git diff"
echo "2. Test the application: npm run dev"
echo "3. Run type checking: npm run typecheck"
echo "4. Run tests: npm test"
echo ""
echo "Files migrated across:"
echo "  - app/ (23 route files)"
echo "  - src/components/workspace/ (9 files)"
echo "  - src/components/navigation/"
echo "  - src/components/comments/"
echo "  - src/components/notifications/"
echo "  - src/components/mentor/"
echo "  - src/components/common/"
echo ""
