# 🚀 Production Deployment Guide

This guide covers deploying Idea Vault to production with security best practices.

## 📋 Prerequisites

- Node.js 18+ or Docker
- PostgreSQL database (or use Docker Compose)
- Environment variables configured
- SSL certificate (for HTTPS)

## 🔐 Environment Configuration

Create a `.env.local` file with production values:

```bash
# Required
ADMIN_PASSWORD=

# Database (use PostgreSQL in production)
DATABASE_URL="postgresql://username:password@localhost:5432/idea_vault"

# Optional: Customize security settings
SESSION_MAX_AGE=86400
MAX_LOGIN_ATTEMPTS=5
LOGIN_WINDOW_MS=900000
FORCE_HTTPS=true
LOG_LEVEL=warn
```

## 🐳 Docker Deployment (Recommended)

### 1. Build and Deploy

```bash
# Set environment variables
export ADMIN_PASSWORD=
export POSTGRES_PASSWORD=

# Build and start services
docker-compose up -d

# Check logs
docker-compose logs -f app
```

### 2. Database Migration

```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed initial data (optional)
docker-compose exec app npx prisma db seed
```

## 🚀 Manual Deployment

### 1. Build Application

```bash
# Install dependencies
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Start production server
npm start
```

### 2. Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# Verify database connection
npx prisma studio
```

## 🔒 Security Checklist

- [ ] Strong `ADMIN_PASSWORD` set
- [ ] HTTPS enabled (SSL certificate)
- [ ] Database credentials secured
- [ ] Environment variables not exposed
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Input validation active
- [ ] Error messages don't leak information

## 📊 Monitoring & Logging

### Health Checks

```bash
# Check application health
curl https://yourdomain.com/api/auth/check

# Check database connection
npx prisma db execute --stdin
```

### Log Monitoring

Monitor these logs for issues:
- Application errors
- Failed login attempts
- Database connection issues
- Rate limiting events

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify `DATABASE_URL` format
   - Check database server status
   - Verify network connectivity

2. **Authentication Issues**
   - Confirm `ADMIN_PASSWORD` is set
   - Check cookie settings
   - Verify HTTPS in production

3. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies installed
   - Check Prisma schema syntax

### Performance Optimization

- Enable database connection pooling
- Use CDN for static assets
- Implement caching strategies
- Monitor memory usage

### Backup Strategy

```bash
# Database backup
pg_dump idea_vault > backup_$(date +%Y%m%d).sql

# Application backup
tar -czf app_backup_$(date +%Y%m%d).tar.gz .next/ public/ prisma/
```

## For deployment issues:

1. Check application logs
2. Verify environment configuration
3. Test database connectivity
4. Review security settings

