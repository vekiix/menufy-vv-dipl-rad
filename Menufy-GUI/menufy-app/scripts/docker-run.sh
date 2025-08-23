#!/bin/bash

# Docker run script for Menufy application
# Usage: ./scripts/docker-run.sh [dev|prod]

set -e

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

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to build and run production version
run_production() {
    print_status "Building and running production version..."
    
    # Stop existing containers
    docker-compose down 2>/dev/null || true
    
    # Build and start
    docker-compose up --build -d
    
    print_success "Production application is starting..."
    print_status "Access your application at: http://localhost:3000"
    print_status "To view logs: docker-compose logs -f menufy-app"
    print_status "To stop: docker-compose down"
}

# Function to build and run development version
run_development() {
    print_status "Building and running development version..."
    
    # Stop existing containers
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    # Build and start
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_success "Development application is starting..."
    print_status "Access your application at: http://localhost:3000"
    print_status "To view logs: docker-compose -f docker-compose.dev.yml logs -f menufy-app-dev"
    print_status "To stop: docker-compose -f docker-compose.dev.yml down"
}

# Function to stop all containers
stop_all() {
    print_status "Stopping all containers..."
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    print_success "All containers stopped"
}

# Function to show logs
show_logs() {
    local mode=${1:-prod}
    
    if [ "$mode" = "dev" ]; then
        docker-compose -f docker-compose.dev.yml logs -f menufy-app-dev
    else
        docker-compose logs -f menufy-app
    fi
}

# Function to show status
show_status() {
    print_status "Container status:"
    echo ""
    docker-compose ps 2>/dev/null || echo "No production containers running"
    echo ""
    docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "No development containers running"
}

# Main script logic
main() {
    check_docker
    
    case "${1:-prod}" in
        "dev"|"development")
            run_development
            ;;
        "prod"|"production")
            run_production
            ;;
        "stop")
            stop_all
            ;;
        "logs")
            show_logs "${2:-prod}"
            ;;
        "status")
            show_status
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [dev|prod|stop|logs|status|help]"
            echo ""
            echo "Commands:"
            echo "  dev, development  - Run development version with hot reloading"
            echo "  prod, production  - Run production version (default)"
            echo "  stop              - Stop all containers"
            echo "  logs [dev|prod]  - Show logs (default: production)"
            echo "  status            - Show container status"
            echo "  help              - Show this help message"
            ;;
        *)
            print_warning "Unknown option: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
