#!/bin/bash

# Menufy Application Deployment Script
# This script handles the deployment of the Menufy application using Docker Compose

set -e  # Exit on any error

# Configuration
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-menufy}"
ENVIRONMENT="${ENVIRONMENT:-production}"
BACKUP_DIR="./backups"
LOG_DIR="./logs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    mkdir -p "$BACKUP_DIR" "$LOG_DIR" "nginx/ssl" "nginx/conf.d"
}

# Check if required files exist
check_prerequisites() {
    log "Checking prerequisites..."
    
    if [ ! -f "docker-compose.yml" ]; then
        error "docker-compose.yml not found!"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        warning ".env file not found. Creating from template..."
        if [ -f "environment.template" ]; then
            cp environment.template .env
            warning "Please edit .env file with your configuration before running again."
            exit 1
        else
            error "environment.template not found!"
            exit 1
        fi
    fi
    
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed!"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker is not running!"
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed!"
        exit 1
    fi
}

# Backup function
backup_data() {
    if [ "$1" = "true" ]; then
        log "Creating backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        backup_file="$BACKUP_DIR/backup_$timestamp.tar.gz"
        
        # Backup volumes
        docker run --rm \
            -v menufy_redis-data:/data \
            -v "$PWD/$BACKUP_DIR":/backup \
            alpine tar czf "/backup/backup_$timestamp.tar.gz" /data
        
        success "Backup created: $backup_file"
    fi
}

# Deploy function
deploy() {
    log "Starting deployment for environment: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        production)
            COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
            ;;
        development)
            COMPOSE_FILES="-f docker-compose.yml -f docker-compose.dev.yml"
            ;;
        *)
            COMPOSE_FILES="-f docker-compose.yml"
            ;;
    esac
    
    # Pull latest images
    log "Pulling latest images..."
    docker-compose $COMPOSE_FILES pull
    
    # Build images
    log "Building images..."
    docker-compose $COMPOSE_FILES build --no-cache
    
    # Start services
    log "Starting services..."
    docker-compose $COMPOSE_FILES up -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    check_health
}

# Health check function
check_health() {
    log "Checking application health..."
    
    # Wait for the application to start
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/api/health &> /dev/null; then
            success "Application is healthy!"
            return 0
        fi
        
        log "Health check attempt $attempt/$max_attempts failed, waiting 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    error "Application failed health check after $max_attempts attempts"
    return 1
}

# Rollback function
rollback() {
    warning "Rolling back to previous version..."
    
    # This would implement rollback logic
    # For now, just restart services
    docker-compose down
    docker-compose up -d
}

# Cleanup function
cleanup() {
    log "Cleaning up unused Docker resources..."
    docker system prune -f
    docker volume prune -f
}

# SSL setup function
setup_ssl() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Setting up SSL certificates..."
        
        # This would integrate with Let's Encrypt
        warning "SSL setup requires manual configuration. Please refer to the documentation."
    fi
}

# Show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --environment    Set environment (production|development) [default: production]"
    echo "  -b, --backup        Create backup before deployment"
    echo "  -c, --cleanup       Clean up unused Docker resources after deployment"
    echo "  -r, --rollback      Rollback to previous version"
    echo "  -s, --ssl           Setup SSL certificates (production only)"
    echo "  -h, --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --environment production --backup"
    echo "  $0 --rollback"
    echo "  $0 --cleanup"
}

# Main execution
main() {
    local do_backup=false
    local do_cleanup=false
    local do_rollback=false
    local do_ssl=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -b|--backup)
                do_backup=true
                shift
                ;;
            -c|--cleanup)
                do_cleanup=true
                shift
                ;;
            -r|--rollback)
                do_rollback=true
                shift
                ;;
            -s|--ssl)
                do_ssl=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done
    
    log "Starting Menufy deployment script..."
    
    create_directories
    check_prerequisites
    
    if [ "$do_rollback" = "true" ]; then
        rollback
        exit $?
    fi
    
    backup_data $do_backup
    deploy
    
    if [ "$do_ssl" = "true" ]; then
        setup_ssl
    fi
    
    if [ "$do_cleanup" = "true" ]; then
        cleanup
    fi
    
    success "Deployment completed successfully!"
    log "Application is available at: http://localhost:3000"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Production monitoring available at:"
        log "  - Grafana: http://localhost:3001 (admin/admin)"
        log "  - Prometheus: http://localhost:9090"
    fi
}

# Run main function with all arguments
main "$@"

