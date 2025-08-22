# Menufy Application - Docker Deployment Guide

This guide provides comprehensive instructions for deploying the Menufy application using Docker and Docker Compose in a production environment.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Security](#security)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

## 🚀 Prerequisites

### System Requirements

- **Docker**: Version 20.10.0 or higher
- **Docker Compose**: Version 2.0.0 or higher
- **Memory**: Minimum 2GB RAM (4GB recommended for production)
- **Storage**: Minimum 10GB free space
- **OS**: Linux (Ubuntu 20.04+), macOS, or Windows with WSL2

### Network Requirements

- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 3000 (Application - internal)
- Port 6379 (Redis - internal)

## 🏃‍♂️ Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd menufy-app

# Copy environment template
cp environment.template .env

# Edit environment variables
nano .env
```

### 2. Configure Environment

Edit the `.env` file with your specific configuration:

```env
# Required variables
NEXTAUTH_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=https://your-domain.com
API_URL=http://your-backend-api:9100
API_WS_URL=http://your-backend-api:9002/ws
```

### 3. Deploy

```bash
# Production deployment
./scripts/deploy.sh --environment production --backup

# Development deployment
./scripts/deploy.sh --environment development
```

### 4. Health Check

```bash
./scripts/health-check.sh
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Node.js environment | `production` | Yes |
| `NEXTAUTH_SECRET` | JWT signing secret | - | Yes |
| `NEXTAUTH_URL` | Application URL | - | Yes |
| `API_URL` | Backend API URL | `http://localhost:9100` | Yes |
| `API_WS_URL` | WebSocket URL | `http://localhost:9002/ws` | Yes |
| `REDIS_PASSWORD` | Redis password | `menufy-redis-pass` | No |

### Docker Compose Files

- **`docker-compose.yml`**: Base configuration
- **`docker-compose.prod.yml`**: Production overrides
- **`docker-compose.dev.yml`**: Development overrides

### Usage Examples

```bash
# Production with SSL and monitoring
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Development with live reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Base configuration only
docker-compose up -d
```

## 🚀 Deployment

### Production Deployment

1. **SSL Certificate Setup**:
   ```bash
   # Place your SSL certificates
   cp your-cert.pem nginx/ssl/cert.pem
   cp your-key.pem nginx/ssl/key.pem
   
   # Or use Let's Encrypt
   ./scripts/deploy.sh --ssl
   ```

2. **Deploy with Monitoring**:
   ```bash
   ./scripts/deploy.sh --environment production --backup
   ```

3. **Verify Deployment**:
   ```bash
   ./scripts/health-check.sh
   ```

### Development Deployment

```bash
# Start development environment
./scripts/deploy.sh --environment development

# Access services
# - Application: http://localhost:3000
# - Redis Commander: http://localhost:8081
# - Database: localhost:5432
```

### Rolling Updates

```bash
# Update application
docker-compose pull
docker-compose up -d --no-deps menufy-app

# Rollback if needed
./scripts/deploy.sh --rollback
```

## 📊 Monitoring

### Built-in Monitoring

The production setup includes:

- **Prometheus**: Metrics collection (`:9090`)
- **Grafana**: Dashboards (`:3001`)
- **Health Checks**: Application monitoring
- **Log Aggregation**: Centralized logging

### Access Monitoring

```bash
# Grafana Dashboard
open http://localhost:3001
# Default: admin/admin

# Prometheus Metrics
open http://localhost:9090

# Application Health
curl http://localhost:3000/api/health
```

### Custom Monitoring

Add custom metrics to your application:

```javascript
// Example: Custom health check
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      api: await checkAPI()
    }
  };
  return Response.json(health);
}
```

## 🔐 Security

### Security Features

- **Nginx Security Headers**: XSS, CSRF, Content-Type protection
- **Rate Limiting**: API and login protection
- **Non-root Containers**: Reduced attack surface
- **SSL/TLS**: HTTPS encryption
- **Network Isolation**: Internal Docker networks

### Security Checklist

- [ ] Change default passwords
- [ ] Configure SSL certificates
- [ ] Set up firewall rules
- [ ] Enable log monitoring
- [ ] Regular security updates
- [ ] Backup encryption

### SSL Configuration

```bash
# Let's Encrypt (automated)
./scripts/deploy.sh --ssl

# Manual SSL setup
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem

# Update nginx configuration
# Uncomment HTTPS server block in nginx/conf.d/menufy.conf
```

## 🔧 Maintenance

### Backup & Restore

```bash
# Create backup
./scripts/deploy.sh --backup

# Restore backup
docker run --rm -v menufy_redis-data:/data -v $PWD/backups:/backup alpine sh -c "cd /data && tar xzf /backup/backup_YYYYMMDD_HHMMSS.tar.gz --strip 1"
```

### Log Management

```bash
# View logs
docker-compose logs -f menufy-app
docker-compose logs -f nginx
docker-compose logs -f redis

# Clean old logs
docker system prune -f
```

### Updates

```bash
# Update dependencies
docker-compose pull

# Rebuild images
docker-compose build --no-cache

# Deploy updates
./scripts/deploy.sh --environment production --backup
```

### Resource Cleanup

```bash
# Clean up unused resources
./scripts/deploy.sh --cleanup

# Manual cleanup
docker system prune -a -f
docker volume prune -f
```

## 🐛 Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check logs
docker-compose logs menufy-app

# Check environment variables
docker-compose config

# Verify health
./scripts/health-check.sh
```

#### Connection Issues

```bash
# Check network connectivity
docker network ls
docker network inspect menufy_menufy-network

# Test internal connectivity
docker exec menufy-frontend ping menufy-nginx
```

#### Performance Issues

```bash
# Check resource usage
docker stats

# Check disk space
df -h

# Monitor logs for errors
docker-compose logs -f | grep -i error
```

### Debug Commands

```bash
# Enter container shell
docker exec -it menufy-frontend sh

# Check application status
curl -f http://localhost:3000/api/health

# View Nginx configuration
docker exec menufy-nginx nginx -t

# Redis connectivity
docker exec menufy-redis redis-cli ping
```

### Recovery Procedures

```bash
# Restart all services
docker-compose restart

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Emergency rollback
./scripts/deploy.sh --rollback
```

## 📞 Support

### Logs Location

- Application: `docker-compose logs menufy-app`
- Nginx: `docker-compose logs nginx`
- Redis: `docker-compose logs redis`

### Configuration Files

- Docker: `docker-compose.yml`
- Nginx: `nginx/conf.d/menufy.conf`
- Environment: `.env`

### Health Endpoints

- Application: `http://localhost:3000/api/health`
- Nginx: `http://localhost/health`

For additional support, check the application logs and ensure all environment variables are correctly configured.

## 📝 License

This deployment configuration is part of the Menufy application project.
