# Idea Vault

A modern, full-stack web application for capturing, organizing, and searching through your ideas. Built with Next.js 15, TypeScript, and Tailwind CSS with PostgreSQL database support.

## 🚀 Features

- **Create Ideas**: Add new ideas with titles, notes, and tags
- **Real-time Search**: Search through your ideas by title, note content, or tags
- **Tag Organization**: Organize ideas with comma-separated tags
- **Persistent Storage**: Ideas are stored in PostgreSQL database and persist between sessions
- **Responsive Design**: Clean, modern UI that works on all devices
- **Instant Updates**: Add and delete ideas without page refreshes
- **Authentication**: Simple password-based authentication system
- **Health Checks**: Built-in health monitoring endpoints
- **Production Ready**: Docker support and production deployment configurations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API routes with server actions
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React hooks (useState, useEffect)
- **Testing**: Cypress for end-to-end testing
- **Deployment**: Docker, Docker Compose, Vercel support
- **CI/CD**: GitHub Actions with automated testing

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker and Docker Compose (for local development)
- PostgreSQL database (local or cloud)

## 🚀 Quick Start

### Local Development


1. **Start the database**
   ```bash
   docker-compose up -d db
   ```

2. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build:prod

# Start production server
npm run start:prod
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose -f docker-compose.production.yml up -d

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Stop services
docker-compose -f docker-compose.production.yml down
```

### Manual Docker Build

```bash
# Build production image
npm run docker:build

# Run container
npm run docker:run
```

## ☁️ Vercel Deployment

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel:**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ADMIN_PASSWORD`: Your admin password
   - `NODE_ENV`: `production`
3. **Deploy automatically on push to main branch**

## 🧪 Testing

### Cypress E2E Tests

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run tests headlessly
npm run cypress:run
```

### CI/CD Testing

Tests run automatically on GitHub Actions for every push and pull request.

## 🔌 API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/ideas` - Retrieve all ideas (with pagination)
- `POST /api/ideas` - Create a new idea
- `DELETE /api/ideas?id={id}` - Delete an idea by ID
- `POST /api/login` - Authenticate user
- `POST /api/logout` - Logout user
- `GET /api/auth/check` - Check authentication status
- `POST /api/setup` - Database setup and health check

## 🎯 Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with NODE_ENV=production
- `npm run start` - Start production server
- `npm run start:prod` - Start production server with NODE_ENV=production

### Database
- `npm run migrate:deploy` - Deploy database migrations
- `npm run db:migrate:prod` - Deploy migrations in production
- `npm run db:seed:prod` - Seed production database

### Testing
- `npm run cypress:open` - Open Cypress Test Runner
- `npm run cypress:run` - Run Cypress tests headlessly

### Docker
- `npm run docker:build` - Build production Docker image
- `npm run docker:run` - Run production container
- `npm run docker:compose:prod` - Start production services
- `npm run docker:compose:prod:down` - Stop production services

### Build & Deploy
- `npm run vercel-build` - Build command for Vercel deployment

## 🔧 Configuration

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `ADMIN_PASSWORD`: Admin authentication password
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `SESSION_SECRET`: Session encryption secret
- `COOKIE_SECRET`: Cookie encryption secret

### Database Schema

The application uses Prisma with the following main entities:
- **Idea**: Core entity with title, note, tags, and timestamps
- **User**: Authentication and user management (future enhancement)
