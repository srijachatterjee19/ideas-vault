#!/bin/bash

# Production Build Script for Idea Vault
set -e

echo "🚀 Building Idea Vault for production..."

# Check if required environment variables are set
if [ -z "$ADMIN_PASSWORD" ]; then
    echo "❌ ERROR: ADMIN_PASSWORD environment variable is required"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🔨 Building Next.js application..."
npm run build

# Verify build output
if [ -d ".next" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output: .next/"
    echo "🚀 Ready for deployment!"
else
    echo "❌ Build failed - .next directory not found"
    exit 1
fi
