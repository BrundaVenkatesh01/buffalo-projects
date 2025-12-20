#!/bin/bash

# Script to update old route references to new taxonomy
# projects → gallery
# studio → workspace
# signup → join

echo "Updating route references..."

# Update router.push calls
find app src -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/router\.push("\/projects")/router.push("\/gallery")/g' {} \; \
  -exec sed -i '' "s/router\.push('\/projects')/router.push('\/gallery')/g" {} \; \
  -exec sed -i '' 's/router\.push("\/studio")/router.push("\/workspace")/g' {} \; \
  -exec sed -i '' "s/router\.push('\/studio')/router.push('\/workspace')/g" {} \; \
  -exec sed -i '' 's/router\.push("\/studio\/new")/router.push("\/workspace\/new")/g' {} \; \
  -exec sed -i '' "s/router\.push('\/studio\/new')/router.push('\/workspace\/new')/g" {} \; \
  -exec sed-i '' 's/router\.push("\/signup")/router.push("\/join")/g' {} \; \
  -exec sed -i '' "s/router\.push('\/signup')/router.push('\/join')/g" {} \; \
  -exec sed -i '' 's/redirect=\/studio/redirect=\/workspace/g' {} \;

# Update Link href attributes
find app src -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/href="\/projects"/href="\/gallery"/g' {} \; \
  -exec sed -i '' "s/href='\/projects'/href='\/gallery'/g" {} \; \
  -exec sed -i '' 's/href="\/studio"/href="\/workspace"/g' {} \; \
  -exec sed -i '' "s/href='\/studio'/href='\/workspace'/g" {} \; \
  -exec sed -i '' 's/href="\/studio\/new"/href="\/workspace\/new"/g' {} \; \
  -exec sed -i '' "s/href='\/studio\/new'/href='\/workspace\/new'/g" {} \; \
  -exec sed -i '' 's/href="\/signup"/href="\/join"/g' {} \; \
  -exec sed -i '' "s/href='\/signup'/href='\/join'/g" {} \;

echo "Done! Route references updated."
