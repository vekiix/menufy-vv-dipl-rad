# Menufy Application Deployment Guide

This guide will help you deploy your Menufy application on a VPS using Docker and make it available through a DNS name with SSL certificates.

## Prerequisites

### VPS Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+ (Ubuntu recommended)
- **RAM**: Minimum 2GB, recommended 4GB+
- **Storage**: Minimum 20GB, recommended 50GB+
- **CPU**: 2 cores minimum
- **Network**: Public IP address with ports 80 and 443 open

### Domain Name
- A registered domain name
- DNS access to point your domain to your VPS IP address

### Software Requirements
- Docker (latest version)
- Docker Compose (latest version)
- Git (for cloning the repository)

## Step 1: VPS Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.4 Install Additional Tools
```bash
# Install essential tools
sudo apt install -y curl wget git htop nginx certbot python3-certbot-nginx

# Install bc for health check script
sudo apt install -y bc
```

## Step 2: Application Deployment

### 2.1 Clone Repository
```bash
# Clone your repository
git clone <your-repository-url>
cd menufy-app

# Make scripts executable
chmod +x scripts/*.sh
```

### 2.2 Configure Environment
```bash
# Copy and edit the production environment file
cp env.production .env.production
nano .env.production
```

**Important**: Update these values in `.env.production`:
- `DOMAIN_NAME`: Your actual domain name
- `CERTBOT_EMAIL`: Your email for SSL notifications
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `API_URL`: Your backend API URL
- `API_WS_URL`: Your WebSocket API URL

### 2.3 Configure DNS
Point your domain to your VPS IP address:
```bash
# Add A record in your DNS provider:
# Type: A
# Name: @ (or your subdomain)
# Value: YOUR_VPS_IP_ADDRESS
# TTL: 300 (or default)

# Add CNAME record for www subdomain:
# Type: CNAME
# Name: www
# Value: your-domain.com
# TTL: 300 (or default)
```

### 2.4 Deploy Application
```bash
# Run the deployment script
./scripts/deploy.sh
```

The deployment script will:
- Check prerequisites
- Create necessary directories
- Update Nginx configuration with your domain
- Generate NextAuth secret if needed
- Build and start Docker containers
- Set up SSL certificates
- Show deployment status

## Step 3: SSL Certificate Setup

### 3.1 Automatic SSL (Recommended)
The deployment script automatically sets up SSL certificates using Let's Encrypt. If it fails during deployment, you can retry:

```bash
# Retry SSL certificate setup
docker-compose run --rm certbot

# Reload Nginx to use new certificates
docker-compose exec nginx nginx -s reload
```

### 3.2 Manual SSL Setup (Alternative)
If you prefer to use your own SSL certificates:

```bash
# Place your certificates in nginx/ssl/
# Update nginx/conf.d/menufy.conf with your certificate paths
# Restart Nginx
docker-compose restart nginx
```

## Step 4: Verification

### 4.1 Check Application Status
```bash
# Check container status
docker-compose ps

# Check application health
./scripts/health-check.sh

# View logs
docker-compose logs -f
```

### 4.2 Test Application
- Visit `https://your-domain.com` in your browser
- Check that HTTPS redirects work
- Verify the health endpoint: `https://your-domain.com/api/health`

## Step 5: Maintenance

### 5.1 Update Application
```bash
# Pull latest changes
git pull origin main

# Redeploy
./scripts/deploy.sh
```

### 5.2 SSL Certificate Renewal
Let's Encrypt certificates expire every 90 days. Set up automatic renewal:

```bash
# Create a cron job for automatic renewal
sudo crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * cd /path/to/your/app && docker-compose run --rm certbot renew && docker-compose exec nginx nginx -s reload
```

### 5.3 Backup
```bash
# Create backup of your configuration
tar -czf backup-$(date +%Y%m%d).tar.gz \
    .env.production \
    nginx/ \
    docker-compose.yml \
    Dockerfile
```

### 5.4 Monitoring
```bash
# Regular health checks
./scripts/health-check.sh

# Monitor resource usage
docker stats

# Check disk space
df -h
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the ports
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Stop conflicting services
sudo systemctl stop nginx  # if using system nginx
```

#### 2. SSL Certificate Issues
```bash
# Check certificate status
docker-compose run --rm certbot certificates

# Force certificate renewal
docker-compose run --rm certbot renew --force-renewal
```

#### 3. Application Not Starting
```bash
# Check container logs
docker-compose logs menufy-app

# Check environment variables
docker-compose exec menufy-app env | grep NEXTAUTH
```

#### 4. DNS Issues
```bash
# Test DNS resolution
nslookup your-domain.com
dig your-domain.com

# Check if DNS propagation is complete
# This can take up to 48 hours
```

### Debug Commands
```bash
# Enter running container
docker-compose exec menufy-app sh

# Check Nginx configuration
docker-compose exec nginx nginx -t

# View real-time logs
docker-compose logs -f --tail=100

# Restart specific service
docker-compose restart menufy-app
```

## Security Considerations

### 1. Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Regular Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

### 3. Environment Variables
- Never commit `.env.production` to version control
- Use strong, unique secrets for production
- Regularly rotate sensitive credentials

## Performance Optimization

### 1. Nginx Caching
The Nginx configuration includes caching for static assets. Monitor cache hit rates and adjust as needed.

### 2. Resource Limits
Add resource limits to your Docker containers in `docker-compose.yml`:

```yaml
services:
  menufy-app:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
```

### 3. Monitoring
Consider adding monitoring tools like:
- Prometheus + Grafana
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Docker's built-in monitoring

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs`
3. Run health checks: `./scripts/health-check.sh`
4. Check the application's health endpoint
5. Verify DNS and SSL certificate status

## Next Steps

After successful deployment:
1. Set up monitoring and alerting
2. Configure automated backups
3. Set up CI/CD pipeline for automated deployments
4. Implement logging aggregation
5. Set up performance monitoring

---

**Note**: This deployment strategy provides a solid foundation for production use. Consider your specific requirements and adjust the configuration accordingly.
