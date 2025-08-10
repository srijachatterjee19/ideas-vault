#!/bin/bash

# Vercel Build Script
echo "🚀 Starting Vercel build process..."

# Check if we're in production
if [ "$NODE_ENV" = "production" ]; then
    echo "✅ Production environment detected"
    
    # Generate Prisma Client
    echo "🔧 Generating Prisma Client..."
    npx prisma generate
    
    # Run migrations
    echo "🗄️ Running database migrations..."
    npx prisma migrate deploy
    
    # Build Next.js app
    echo "🏗️ Building Next.js application..."
    npm run build:next
else
    echo "⚠️ Non-production environment, skipping migrations"
    
    # Generate Prisma Client
    echo "🔧 Generating Prisma Client..."
    npx prisma generate
    
    # Build Next.js app
    echo "🏗️ Building Next.js application..."
    npm run build:next
fi

echo "✅ Build process completed!"
