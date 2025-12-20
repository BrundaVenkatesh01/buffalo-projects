#!/bin/bash

# Buffalo Projects - One-Click Deployment Script
# This script will deploy your app to Vercel with all configurations

echo "🚀 Buffalo Projects - Production Deployment"
echo "=========================================="
echo ""

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Please install from https://nodejs.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required. Please install Node.js"; exit 1; }

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo "Please follow the prompts:"
echo "1. Login if prompted"
echo "2. Set up project (choose default options)"
echo "3. Configure environment variables when asked"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✨ =========================================="
    echo "✨ DEPLOYMENT SUCCESSFUL!"
    echo "✨ =========================================="
    echo ""
    echo "📝 Next Steps:"
    echo "1. Add custom domain in Vercel dashboard"
    echo "2. Configure environment variables:"
    echo "   - VITE_GEMINI_API_KEY"
    echo "   - VITE_ANALYTICS_ID"
    echo "   - VITE_POSTHOG_KEY"
    echo "   - VITE_SENTRY_DSN"
    echo ""
    echo "📚 Documentation: https://github.com/yourusername/buffalo-projects"
    echo "🌐 Live site will be available at your Vercel URL"
    echo ""
    echo "🎉 Buffalo Projects is now live!"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi