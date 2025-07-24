#!/bin/bash
echo "Validating Budget App..."

echo "1. Checking TypeScript compilation..."
npx tsc --noEmit --skipLibCheck
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

echo "2. Running tests..."
npm run test --run
if [ $? -eq 0 ]; then
    echo "✅ Tests passed"
else
    echo "❌ Tests failed"
    exit 1
fi

echo "3. Building production bundle..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Production build successful"
else
    echo "❌ Production build failed"
    exit 1
fi

echo "🎉 All validations passed! Budget App is ready."
