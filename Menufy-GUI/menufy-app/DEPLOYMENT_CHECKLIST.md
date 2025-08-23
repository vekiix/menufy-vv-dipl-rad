# Deployment Checklist

Use this checklist to ensure you've completed all necessary steps for deploying your Menufy application.

## Pre-Deployment Checklist

### VPS Setup
- [ ] VPS is running Ubuntu 20.04+ or CentOS 8+
- [ ] VPS has minimum 2GB RAM and 20GB storage
- [ ] VPS has a public IP address
- [ ] Ports 80 and 443 are open on VPS
- [ ] System is updated (`sudo apt update && sudo apt upgrade -y`)

### Software Installation
- [ ] Docker is installed and running
- [ ] Docker Compose is installed
- [ ] User is added to docker group
- [ ] Git is installed
- [ ] Additional tools are installed (curl, wget, htop, nginx, certbot, bc)

### Domain Configuration
- [ ] Domain name is registered
- [ ] DNS A record points to VPS IP address
- [ ] DNS CNAME record for www subdomain is set
- [ ] DNS propagation is complete (can take up to 48 hours)

## Deployment Checklist

### Application Setup
- [ ] Repository is cloned to VPS
- [ ] Scripts are made executable (`chmod +x scripts/*.sh`)
- [ ] Environment file is configured (`.env.production`)
- [ ] Domain name is set in environment file
- [ ] NextAuth secret is generated or set
- [ ] API URLs are configured

### Deployment Execution
- [ ] Deployment script runs without errors
- [ ] All containers are running (`docker-compose ps`)
- [ ] Application responds to health checks
- [ ] Nginx is serving the application
- [ ] SSL certificates are obtained successfully

## Post-Deployment Verification

### Application Testing
- [ ] Application is accessible via HTTPS
- [ ] HTTP redirects to HTTPS work
- [ ] Health endpoint responds (`/api/health`)
- [ ] All application features work correctly
- [ ] WebSocket connections work (if applicable)

### Security Verification
- [ ] SSL certificate is valid and not expired
- [ ] Security headers are present
- [ ] Rate limiting is working
- [ ] Firewall is configured (UFW)
- [ ] Environment variables are secure

### Monitoring Setup
- [ ] Health check script runs successfully
- [ ] Container logs are accessible
- [ ] Resource usage is monitored
- [ ] SSL certificate renewal is automated
- [ ] Backup strategy is implemented

## Maintenance Checklist

### Regular Tasks
- [ ] System packages are updated monthly
- [ ] Docker images are updated regularly
- [ ] SSL certificates are renewed automatically
- [ ] Application is updated when new versions are available
- [ ] Logs are reviewed for errors

### Backup & Recovery
- [ ] Configuration files are backed up
- [ ] Environment variables are documented
- [ ] Recovery procedures are tested
- [ ] Backup retention policy is defined

## Troubleshooting Notes

### Common Issues & Solutions
- [ ] Port conflicts resolved
- [ ] DNS issues resolved
- [ ] SSL certificate issues resolved
- [ ] Application startup issues resolved
- [ ] Performance issues identified and resolved

---

## Quick Commands Reference

```bash
# Check deployment status
./scripts/health-check.sh

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update application
git pull && ./scripts/deploy.sh

# Check SSL certificate
docker-compose run --rm certbot certificates

# Renew SSL certificate
docker-compose run --rm certbot renew
```

## Support Contacts

- **Documentation**: Check DEPLOYMENT.md for detailed instructions
- **Health Checks**: Run `./scripts/health-check.sh` for diagnostics
- **Logs**: Use `docker-compose logs` to troubleshoot issues
- **SSL Issues**: Check Let's Encrypt status and certificate validity

---

**Note**: Mark each item as complete (✓) as you progress through the deployment. If you encounter issues, refer to the troubleshooting section in DEPLOYMENT.md.
