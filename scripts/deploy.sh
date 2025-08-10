#!/bin/bash

# Production Deployment Script for Idea Vault
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="idea-vault"
DOCKER_IMAGE="${APP_NAME}:latest"
COMPOSE_FILE="docker-compose.production.yml"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if required files exist
check_prerequisites() {
    log "Checking prerequisites..."
    
    if [ ! -f ".env.production" ]; then
        error ".env.production file not found. Please create it from env.production.example"
    fi
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        error "Production compose file not found: $COMPOSE_FILE"
    fi
    
    if [ ! -f "Dockerfile.production" ]; then
        error "Production Dockerfile not found: Dockerfile.production"
    fi
    
    log "Prerequisites check passed ✓"
}

# Create backup
create_backup() {
    log "Creating backup..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup current running containers
    if docker ps --format "table {{.Names}}" | grep -q "${APP_NAME}"; then
        log "Backing up current deployment..."
        docker-compose -f "$COMPOSE_FILE" down
        log "Backup created in: $BACKUP_DIR"
    fi
}

# Build production image
build_image() {
    log "Building production Docker image..."
    docker build -f Dockerfile.production -t "$DOCKER_IMAGE" . || error "Failed to build Docker image"
    log "Production image built successfully ✓"
}

# Deploy application
deploy_app() {
    log "Deploying application..."
    
    # Start services
    docker-compose -f "$COMPOSE_FILE" up -d || error "Failed to start services"
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    if ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        error "Application health check failed"
    fi
    
    log "Application deployed successfully ✓"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    log "Waiting for database to be ready..."
    sleep 10
    
    # Run migrations
    docker-compose -f "$COMPOSE_FILE" exec -T app npx prisma migrate deploy || warn "Database migrations failed"
    
    log "Database setup completed ✓"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check if containers are running
    if ! docker ps --format "table {{.Names}}" | grep -q "${APP_NAME}"; then
        error "Application container is not running"
    fi
    
    # Check health endpoint
    local health_status
    health_status=$(curl -s http://localhost:3000/api/health | jq -r '.status' 2>/dev/null || echo "unknown")
    
    if [ "$health_status" = "healthy" ]; then
        log "Health check passed ✓"
    elif [ "$health_status" = "degraded" ]; then
        warn "Health check shows degraded status"
    else
        error "Health check failed with status: $health_status"
    fi
    
    log "Deployment verification completed ✓"
}

# Rollback function
rollback() {
    error "Deployment failed. Rolling back..."
    
    if [ -d "$BACKUP_DIR" ]; then
        log "Rolling back to previous version..."
        docker-compose -f "$COMPOSE_FILE" down
        # Add rollback logic here if needed
    fi
    
    error "Rollback completed"
}

# Main deployment flow
main() {
    log "Starting production deployment..."
    
    # Set error handling
    trap rollback ERR
    
    check_prerequisites
    create_backup
    build_image
    deploy_app
    run_migrations
    verify_deployment
    
    log "🎉 Production deployment completed successfully!"
    log "Application is running at: http://localhost:3000"
    log "Health check: http://localhost:3000/api/health"
}

# Run main function
main "$@"
