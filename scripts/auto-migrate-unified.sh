#!/bin/bash

# Auto-Migration Script for Unified Design System
# This script safely updates all component imports and Button API usage

set -e  # Exit on error

echo "🚀 Starting unified design system auto-migration..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
total_files=0
migrated_files=0

# Function to update a single file
migrate_file() {
    local file=$1
    local changes_made=false

    # Skip if file doesn't exist
    if [ ! -f "$file" ]; then
        return
    fi

    # Create backup
    cp "$file" "$file.bak"

    # Update Button import
    if grep -q 'from "@/components/ui/button"' "$file"; then
        sed -i '' 's|from "@/components/ui/button"|from "@/components/ui-next"|g' "$file"
        changes_made=true
    fi

    # Update Card imports (add all sub-components)
    if grep -q 'from "@/components/ui/card"' "$file"; then
        # This is more complex - need to preserve existing imports and add missing ones
        # For now, just update the path
        sed -i '' 's|from "@/components/ui/card"|from "@/components/ui-next"|g' "$file"
        changes_made=true
    fi

    # Update Input import
    if grep -q 'from "@/components/ui/input"' "$file"; then
        sed -i '' 's|from "@/components/ui/input"|from "@/components/ui-next"|g' "$file"
        changes_made=true
    fi

    # Update Badge import
    if grep -q 'from "@/components/ui/badge"' "$file"; then
        sed -i '' 's|from "@/components/ui/badge"|from "@/components/ui-next"|g' "$file"
        changes_made=true
    fi

    if [ "$changes_made" = true ]; then
        echo -e "${GREEN}✓${NC} Migrated: $file"
        ((migrated_files++))
        rm "$file.bak"  # Remove backup if successful
    else
        rm "$file.bak"  # Remove backup if no changes
    fi

    ((total_files++))
}

# Find all TypeScript/TSX files (excluding node_modules, .next, ui-next, yc, openai)
echo "Finding files to migrate..."
files=$(find app src -type f \( -name "*.ts" -o -name "*.tsx" \) \
    ! -path "*/node_modules/*" \
    ! -path "*/.next/*" \
    ! -path "*/ui-next/*" \
    ! -path "*/yc/*" \
    ! -path "*/openai/*" \
    ! -name "*.test.*" \
    ! -name "*.spec.*")

echo "Found $(echo "$files" | wc -l | tr -d ' ') files to check"
echo ""

# Migrate each file
for file in $files; do
    migrate_file "$file"
done

echo ""
echo "📊 Migration Summary:"
echo -e "${GREEN}✓ Migrated: $migrated_files files${NC}"
echo -e "○ Skipped: $((total_files - migrated_files)) files (no changes needed)"
echo -e "📁 Total: $total_files files checked"

if [ $migrated_files -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Important Next Steps:${NC}"
    echo "1. Run 'npm run typecheck' to verify types"
    echo "2. Run 'npm run lint' to check for issues"
    echo "3. Start dev server and test manually"
    echo "4. Run 'npm test' for E2E tests"
    echo ""
    echo -e "${YELLOW}Note:${NC} You may need to manually fix 'asChild' Button usage"
    echo "Pattern to find: grep -r 'Button.*asChild' app src"
fi

echo ""
echo "✨ Auto-migration complete!"
