#!/bin/bash

# ==============================================
# Menufy Application Deployment Script
# ==============================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Function to load environment variables
load_env() {
    print_status "Loading environment variables..."
    
    if [ -f ".env.production" ]; then
        export $(cat .env.production | grep -v '^#' | xargs)
        print_success "Loaded .env.production"
    elif [ -f ".env" ]; then
        export $(cat .env | grep -v '^#' | xargs)
        print_warning "Using .env file (consider using .env.production for production)"
    else
        print_error "No environment file found. Please create .env.production or .env"
        exit 1
    fi
    
    # Validate required variables
    if [ -z "$DOMAIN_NAME" ] || [ "$DOMAIN_NAME" = "your-domain.com" ]; then
        print_error "Please set DOMAIN_NAME in your environment file"
        exit 1
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" = "your-super-secret-jwt-key-here-change-this-in-production" ]; then
        print_error "Please set NEXTAUTH_SECRET in your environment file"
        exit 1
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p nginx/logs
    
    print_success "Directories created!"
}

# Function to update Nginx configuration with actual domain
update_nginx_config() {
    print_status "Updating Nginx configuration with domain: $DOMAIN_NAME"
    
    # Update the domain in nginx configuration files
    sed -i "s/your-domain\.com/$DOMAIN_NAME/g" nginx/conf.d/menufy.conf
    sed -i "s/your-domain\.com/$DOMAIN_NAME/g" docker-compose.yml
    
    print_success "Nginx configuration updated!"
}

# Function to generate NextAuth secret if not set
generate_nextauth_secret() {
    if [ "$NEXTAUTH_SECRET" = "your-super-secret-jwt-key-here-change-this-in-production" ]; then
        print_status "Generating NextAuth secret..."
        export NEXTAUTH_SECRET=$(openssl rand -base64 32)
        print_success "NextAuth secret generated: $NEXTAUTH_SECRET"
    fi
}

# Function to deploy application
deploy_app() {
    print_status "Deploying Menufy application..."
    
    # Stop existing containers
    docker-compose down --remove-orphans
    
    # Build and start services
    docker-compose up -d --build
    
    print_success "Application deployed successfully!"
}

# Function to check application health
check_health() {
    print_status "Checking application health..."
    
    # Wait for services to be ready
    sleep 30
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_success "All services are running!"
    else
        print_error "Some services failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
    
    # Check application health endpoint
    if curl -f http://localhost/api/health >/dev/null 2>&1; then
        print_success "Application is responding to health checks!"
    else
        print_warning "Application health check failed. This might be normal during startup."
    fi
}



# Function to show deployment status
show_status() {
    print_status "Deployment completed! Here's the status:"
    echo ""
    echo "Application URL: http://$DOMAIN_NAME"
    echo "Health Check: http://$DOMAIN_NAME/api/health"
    echo ""
    echo "Container Status:"
    docker-compose ps
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
    echo "To restart: docker-compose restart"
}

# Main deployment function
main() {
    echo "=============================================="
    echo "    Menufy Application Deployment Script"
    echo "=============================================="
    echo ""
    
    check_prerequisites
    load_env
    create_directories
    update_nginx_config
    generate_nextauth_secret
    deploy_app
    check_health
    show_status
    
    print_success "Deployment completed successfully!"
}

# Run main function
main "$@"

