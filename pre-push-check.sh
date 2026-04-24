#!/bin/bash

# AliRwanda Pre-Push Verification Script
# Run this before pushing to production

echo "🔍 AliRwanda Production Readiness Check"
echo "======================================="
echo ""

ERRORS=0

# Check 1: .env files not in git
echo "✅ Checking .env files are not tracked..."
if git ls-files --error-unmatch server/.env 2>/dev/null; then
    echo "❌ ERROR: server/.env is tracked in git!"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ server/.env is properly ignored"
fi

if git ls-files --error-unmatch client/.env 2>/dev/null; then
    echo "❌ ERROR: client/.env is tracked in git!"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ client/.env is properly ignored"
fi

echo ""

# Check 2: Required files exist
echo "✅ Checking required files..."
FILES_OK=true

if [ ! -f "server/.env.example" ]; then
    echo "❌ Missing: server/.env.example"
    FILES_OK=false
    ERRORS=$((ERRORS + 1))
fi

if [ ! -f "client/.env.example" ]; then
    echo "❌ Missing: client/.env.example"
    FILES_OK=false
    ERRORS=$((ERRORS + 1))
fi

if [ ! -f "server/uploads/.gitignore" ]; then
    echo "❌ Missing: server/uploads/.gitignore"
    FILES_OK=false
    ERRORS=$((ERRORS + 1))
fi

if [ "$FILES_OK" = true ]; then
    echo "✅ All required files exist"
fi

echo ""

# Check 3: Dependencies installed
echo "✅ Checking dependencies..."
if [ ! -d "server/node_modules" ]; then
    echo "⚠️  Warning: server/node_modules not found"
    echo "   Run: cd server && npm install"
fi

if [ ! -d "client/node_modules" ]; then
    echo "⚠️  Warning: client/node_modules not found"
    echo "   Run: cd client && npm install"
fi

if [ -d "server/node_modules" ] && [ -d "client/node_modules" ]; then
    echo "✅ Dependencies installed"
fi

echo ""

# Check 4: Multer installed
echo "✅ Checking multer dependency..."
if grep -q "multer" server/package.json; then
    echo "✅ Multer is in package.json"
else
    echo "❌ ERROR: Multer not found in package.json"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check 5: No hardcoded secrets (basic check)
echo "✅ Checking for hardcoded secrets..."
if grep -r "mongodb://localhost" server/*.js 2>/dev/null; then
    echo "⚠️  Warning: Found localhost MongoDB references in code"
    echo "   Make sure .env has the correct MongoDB Atlas URI"
fi

echo ""

# Check 6: Git status
echo "✅ Git status:"
git status --short
echo ""

# Final result
echo "======================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed! Ready to push."
    echo ""
    echo "Next steps:"
    echo "1. Review the changes above"
    echo "2. Update .env files with production values"
    echo "3. Run: git add ."
    echo "4. Run: git commit -m 'Production ready deployment'"
    echo "5. Run: git push origin main"
else
    echo "❌ Found $ERRORS error(s). Please fix before pushing!"
    exit 1
fi
