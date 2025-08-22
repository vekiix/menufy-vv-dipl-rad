#!/bin/bash

# Health check script for Menufy application
# This script performs comprehensive health checks on all services

set -e

# Configuration
APP_URL="${APP_URL:-http://localhost:3000}"
NGINX_URL="${NGINX_URL:-http://localhost:80}"
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; }
warning() { echo -e "${YELLOW}[!]${NC} $1"; }

# Health check functions
check_docker_services() {
    log "Checking Docker services..."
    
    local services=("menufy-frontend" "menufy-nginx" "menufy-redis")
    local all_healthy=true
    
    for service in "${services[@]}"; do
        if docker ps --filter "name=$service" --filter "status=running" | grep -q "$service"; then
            success "$service is running"
        else
            error "$service is not running"
            all_healthy=false
        fi
    done
    
    return $([[ "$all_healthy" == "true" ]] && echo 0 || echo 1)
}

check_application_health() {
    log "Checking application health endpoint..."
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/health" || echo "000")
    
    if [ "$response" -eq 200 ]; then
        success "Application health check passed"
        return 0
    else
        error "Application health check failed (HTTP $response)"
        return 1
    fi
}

check_nginx() {
    log "Checking Nginx reverse proxy..."
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$NGINX_URL/health" || echo "000")
    
    if [ "$response" -eq 200 ]; then
        success "Nginx health check passed"
        return 0
    else
        error "Nginx health check failed (HTTP $response)"
        return 1
    fi
}

check_redis() {
    log "Checking Redis connection..."
    
    if command -v redis-cli &> /dev/null; then
        if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping | grep -q "PONG"; then
            success "Redis connection successful"
            return 0
        else
            error "Redis connection failed"
            return 1
        fi
    else
        warning "redis-cli not found, skipping Redis check"
        return 0
    fi
}

check_disk_space() {
    log "Checking disk space..."
    
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -lt 80 ]; then
        success "Disk usage is ${usage}% (healthy)"
        return 0
    elif [ "$usage" -lt 90 ]; then
        warning "Disk usage is ${usage}% (warning)"
        return 0
    else
        error "Disk usage is ${usage}% (critical)"
        return 1
    fi
}

check_memory() {
    log "Checking memory usage..."
    
    if command -v free &> /dev/null; then
        local mem_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
        
        if [ "$mem_usage" -lt 80 ]; then
            success "Memory usage is ${mem_usage}% (healthy)"
            return 0
        elif [ "$mem_usage" -lt 90 ]; then
            warning "Memory usage is ${mem_usage}% (warning)"
            return 0
        else
            error "Memory usage is ${mem_usage}% (critical)"
            return 1
        fi
    else
        warning "free command not found, skipping memory check"
        return 0
    fi
}

check_container_logs() {
    log "Checking for errors in container logs..."
    
    local containers=("menufy-frontend" "menufy-nginx" "menufy-redis")
    local error_found=false
    
    for container in "${containers[@]}"; do
        if docker ps --filter "name=$container" | grep -q "$container"; then
            local errors=$(docker logs "$container" --since 5m 2>&1 | grep -i "error\|exception\|fatal" | wc -l)
            
            if [ "$errors" -eq 0 ]; then
                success "$container has no recent errors"
            else
                warning "$container has $errors recent errors"
                error_found=true
            fi
        fi
    done
    
    return $([[ "$error_found" == "false" ]] && echo 0 || echo 1)
}

generate_report() {
    local exit_code=$1
    log "Generating health check report..."
    
    echo ""
    echo "=================================="
    echo "Health Check Summary"
    echo "=================================="
    echo "Timestamp: $(date)"
    echo "Overall Status: $([[ $exit_code -eq 0 ]] && echo "HEALTHY" || echo "UNHEALTHY")"
    echo ""
    
    # Show container status
    echo "Container Status:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=menufy"
    echo ""
    
    # Show resource usage
    echo "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" menufy-frontend menufy-nginx menufy-redis 2>/dev/null || echo "Unable to get stats"
    echo ""
}

# Main health check function
main() {
    local overall_status=0
    local check_functions=(
        "check_docker_services"
        "check_application_health" 
        "check_nginx"
        "check_redis"
        "check_disk_space"
        "check_memory"
        "check_container_logs"
    )
    
    log "Starting comprehensive health check..."
    echo ""
    
    for check_func in "${check_functions[@]}"; do
        if ! $check_func; then
            overall_status=1
        fi
        echo ""
    done
    
    generate_report $overall_status
    
    if [ $overall_status -eq 0 ]; then
        success "All health checks passed!"
    else
        error "Some health checks failed!"
    fi
    
    exit $overall_status
}

# Run main function
main "$@"

