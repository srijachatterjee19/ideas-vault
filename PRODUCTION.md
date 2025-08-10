# 🚀 Production Deployment Guide

This guide covers deploying Idea Vault to production using Docker and best practices.

## 📋 Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database (can be local or cloud)
- Domain name and SSL certificates (for production)
- Environment variables configured

## 🔧 Environment Setup

### 1. Create Production Environment File

```bash
cp env.production.example .env.production
```

Edit `.env.production` with your actual values:

```bash
# Database
DATABASE_URL="postgresql://username:password@your-db-host:5432/idea_vault_prod"

# Authentication
ADMIN_PASSWORD="your-secure-production-password"

# Security
SESSION_SECRET="your-super-secure-session-secret"
COOKIE_SECRET="your-super-secure-cookie-secret"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="info"
```

### 2. Generate Secure Secrets

```bash
# Generate session secret
openssl rand -hex 32

# Generate cookie secret
openssl rand -hex 32
```

## 🐳 Docker Deployment

### Quick Start

```bash
# Build and deploy
./scripts/deploy.sh

# Or manually:
npm run docker:compose:prod
```

### Manual Deployment Steps

1. **Build Production Image**
   ```bash
   npm run docker:build
   ```

2. **Start Services**
   ```bash
   npm run docker:compose:prod
   ```

3. **Check Status**
   ```bash
   docker-compose -f docker-compose.production.yml ps
   ```

4. **View Logs**
   ```bash
   docker-compose -f docker-compose.production.yml logs -f app
   ```

## 🔍 Health Monitoring

### Health Check Endpoint

- **URL**: `http://your-domain/api/health`
- **Response**: JSON with application status, database connectivity, and metrics

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "checks": {
    "database": "healthy",
    "memory": "healthy",
    "disk": "healthy"
  },
  "metrics": {
    "responseTime": 15,
    "memoryUsage": {...},
    "databaseConnections": 1
  }
}
```

## 🛡️ Security Features

### Built-in Security

- ✅ Rate limiting on write operations
- ✅ Input validation with Zod schemas
- ✅ SQL injection protection via Prisma
- ✅ XSS protection headers
- ✅ CSRF protection via session cookies
- ✅ Secure cookie settings
- ✅ Content Security Policy

### Security Headers

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 📊 Monitoring & Logging

### Application Logs

```bash
# View application logs
docker-compose -f docker-compose.production.yml logs -f app

# View database logs
docker-compose -f docker-compose.production.yml logs -f db
```

### Database Monitoring

```bash
# Connect to database
docker-compose -f docker-compose.production.yml exec db psql -U postgres -d idea_vault_prod

# Check connections
SELECT * FROM pg_stat_activity;
```

## 🔄 Maintenance

### Database Migrations

```bash
# Run migrations
npm run db:migrate:prod

# Or manually
docker-compose -f docker-compose.production.yml exec app npx prisma migrate deploy
```

### Application Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and redeploy
./scripts/deploy.sh
```

### Backup & Restore

```bash
# Create backup
docker-compose -f docker-compose.production.yml exec db pg_dump -U postgres idea_vault_prod > backup.sql

# Restore from backup
docker-compose -f docker-compose.production.yml exec -T db psql -U postgres idea_vault_prod < backup.sql
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` in `.env.production`
   - Verify database is running and accessible
   - Check firewall settings

2. **Health Check Failing**
   - Check application logs: `docker-compose logs app`
   - Verify database connectivity
   - Check memory usage

3. **Rate Limiting Issues**
   - Adjust `RATE_LIMIT_MAX_REQUESTS` in environment
   - Check if multiple clients are hitting the same IP

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug docker-compose -f docker-compose.production.yml up

# Check Prisma logs
DEBUG=prisma:* docker-compose -f docker-compose.production.yml up
```

## 📈 Performance Optimization

### Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_idea_title ON "Idea"(title);
CREATE INDEX idx_idea_created_at ON "Idea"(created_at);
CREATE INDEX idx_idea_tags ON "Idea" USING GIN(tags);
```

### Application Optimization

- Enable gzip compression (already configured)
- Use CDN for static assets
- Implement caching strategies
- Monitor memory usage

## 🔐 SSL/HTTPS Setup

### Using Nginx (Recommended)

1. **Place SSL certificates** in `./nginx/ssl/`
2. **Update nginx configuration** in `./nginx/nginx.conf`
3. **Restart nginx container**

### Using Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/* ./nginx/ssl/
```

## 🌐 Domain Configuration

### DNS Settings

- **A Record**: Point to your server IP
- **CNAME**: `www` → `@` (if using www subdomain)

### Reverse Proxy (Optional)

If using a reverse proxy like Traefik or HAProxy, update the Docker Compose configuration accordingly.

## 📝 Production Checklist

- [ ] Environment variables configured
- [ ] Secure secrets generated
- [ ] Database created and accessible
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Health checks working
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Security headers enabled

## 🆘 Support

For production issues:

1. Check application logs
2. Verify health endpoint
3. Check database connectivity
4. Review environment configuration
5. Check Docker container status

## 📚 Additional Resources

- [Next.js Production Deployment](https://nextjs.org/docs/deployment)
- [Docker Production Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PostgreSQL Production Tuning](https://www.postgresql.org/docs/current/runtime-config.html)
- [Security Headers](https://owasp.org/www-project-secure-headers/)
