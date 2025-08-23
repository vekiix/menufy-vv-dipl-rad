#!/bin/bash

# ==============================================
# Menufy Application Health Check Script
# ==============================================

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

# Function to check container status
check_containers() {
    print_status "Checking container status..."
    
    if docker-compose ps | grep -q "Up"; then
        print_success "All containers are running!"
        docker-compose ps
    else
        print_error "Some containers are not running!"
        docker-compose ps
        return 1
    fi
}

# Function to check application health endpoint
check_health_endpoint() {
    print_status "Checking application health endpoint..."
    
    # Try to get the domain from environment or use localhost
    DOMAIN=${DOMAIN_NAME:-localhost}
    
    if [ "$DOMAIN" = "localhost" ]; then
        HEALTH_URL="http://localhost/api/health"
    else
        HEALTH_URL="http://$DOMAIN/api/health"
    fi
    
    if curl -f "$HEALTH_URL" >/dev/null 2>&1; then
        print_success "Health endpoint is responding: $HEALTH_URL"
    else
        print_error "Health endpoint is not responding: $HEALTH_URL"
        return 1
    fi
}



# Function to check disk space
check_disk_space() {
    print_status "Checking disk space..."
    
    DISK_USAGE=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$DISK_USAGE" -lt 80 ]; then
        print_success "Disk space is sufficient: ${DISK_USAGE}% used"
    elif [ "$DISK_USAGE" -lt 90 ]; then
        print_warning "Disk space is getting low: ${DISK_USAGE}% used"
    else
        print_error "Disk space is critically low: ${DISK_USAGE}% used"
        return 1
    fi
}

# Function to check memory usage
check_memory() {
    print_status "Checking memory usage..."
    
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    
    if (( $(echo "$MEMORY_USAGE < 80" | bc -l) )); then
        print_success "Memory usage is normal: ${MEMORY_USAGE}%"
    elif (( $(echo "$MEMORY_USAGE < 90" | bc -l) )); then
        print_warning "Memory usage is high: ${MEMORY_USAGE}%"
    else
        print_error "Memory usage is critically high: ${MEMORY_USAGE}%"
        return 1
    fi
}

# Function to check logs for errors
check_logs() {
    print_status "Checking recent logs for errors..."
    
    ERROR_COUNT=$(docker-compose logs --tail=100 | grep -i "error\|exception\|fatal" | wc -l)
    
    if [ "$ERROR_COUNT" -eq 0 ]; then
        print_success "No errors found in recent logs"
    else
        print_warning "Found $ERROR_COUNT potential errors in recent logs"
        docker-compose logs --tail=100 | grep -i "error\|exception\|fatal" | tail -5
    fi
}

# Function to show system resources
show_resources() {
    print_status "System resource usage:"
    echo ""
    echo "Container Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    echo ""
    echo "Disk Usage:"
    df -h .
    echo ""
    echo "Memory Usage:"
    free -h
}

# Main health check function
main() {
    echo "=============================================="
    echo "    Menufy Application Health Check"
    echo "=============================================="
    echo ""
    
    local exit_code=0
    
    # Load environment variables if available
    if [ -f ".env.production" ]; then
        export $(cat .env.production | grep -v '^#' | xargs)
    elif [ -f ".env" ]; then
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    # Run all health checks
    check_containers || exit_code=1
    check_health_endpoint || exit_code=1
    check_disk_space || exit_code=1
    check_memory || exit_code=1
    check_logs || exit_code=1
    
    echo ""
    show_resources
    
    echo ""
    if [ $exit_code -eq 0 ]; then
        print_success "All health checks passed! Application is healthy."
    else
        print_error "Some health checks failed. Please review the issues above."
    fi
    
    exit $exit_code
}

# Run main function
main "$@"

