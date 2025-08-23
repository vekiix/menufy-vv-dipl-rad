# Docker Setup for Menufy Application

This guide will help you run the Menufy application using Docker on your local machine.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/) (usually comes with Docker Desktop)

## Quick Start

### Option 1: Using the provided script (Recommended)

```bash
# Run production version
./scripts/docker-run.sh prod

# Run development version with hot reloading
./scripts/docker-run.sh dev

# Stop all containers
./scripts/docker-run.sh stop

# View logs
./scripts/docker-run.sh logs prod  # or logs dev

# Check container status
./scripts/docker-run.sh status

# Show help
./scripts/docker-run.sh help
```

### Option 2: Using Docker Compose directly

```bash
# Production version
docker-compose up --build -d

# Development version
docker-compose -f docker-compose.dev.yml up --build -d

# Stop containers
docker-compose down
# or for dev
docker-compose -f docker-compose.dev.yml down
```

## What's Included

### Production Setup (`docker-compose.yml`)
- **menufy-app**: Your Next.js application running in production mode
- **nginx**: Optional reverse proxy (can be removed if not needed)
- Optimized for production with standalone output
- Health checks and restart policies

### Development Setup (`docker-compose.dev.yml`)
- **menufy-app-dev**: Development version with hot reloading
- Source code mounted for live updates
- Development environment variables
- Faster build times

## Configuration

### Environment Variables

The application uses environment variables from your `env.production` file. You can modify these in the docker-compose files or create a `.env` file.

Key variables:
- `NEXTAUTH_URL`: Authentication callback URL
- `API_URL`: Backend API endpoint
- `API_WS_URL`: WebSocket endpoint for real-time features
- `NEXTAUTH_SECRET`: JWT signing secret

### Ports

- **3000**: Main application (Next.js)
- **80/443**: Nginx reverse proxy (optional)

## File Structure

```
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services
├── .dockerignore           # Files excluded from Docker build
├── scripts/
│   └── docker-run.sh      # Helper script for running containers
└── nginx/                  # Nginx configuration (optional)
```

## Development Workflow

1. **Start development environment**:
   ```bash
   ./scripts/docker-run.sh dev
   ```

2. **Make changes to your code** - they will automatically reload

3. **View logs**:
   ```bash
   ./scripts/docker-run.sh logs dev
   ```

4. **Stop development environment**:
   ```bash
   ./scripts/docker-run.sh stop
   ```

## Production Deployment

1. **Build and start production**:
   ```bash
   ./scripts/docker-run.sh prod
   ```

2. **Access your application** at `http://localhost:3000`

3. **Monitor logs**:
   ```bash
   ./scripts/docker-run.sh logs prod
   ```

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   
   # Stop existing containers
   ./scripts/docker-run.sh stop
   ```

2. **Build failures**:
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Permission issues**:
   ```bash
   # Make script executable
   chmod +x scripts/docker-run.sh
   ```

### Useful Docker Commands

```bash
# View running containers
docker ps

# View container logs
docker logs <container_name>

# Execute commands in running container
docker exec -it <container_name> /bin/sh

# View resource usage
docker stats

# Clean up unused resources
docker system prune
```

## Customization

### Adding Services

To add more services (like a database), edit the appropriate docker-compose file:

```yaml
services:
  # ... existing services ...
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: menufy
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - menufy-network

volumes:
  postgres_data:
```

### Modifying Environment Variables

Edit the `environment` section in your docker-compose file or create a `.env` file:

```bash
# .env file
NEXTAUTH_SECRET=your-secret-here
API_URL=http://your-api-url
```

## Performance Tips

1. **Use volume mounts** for development to avoid rebuilding on every change
2. **Multi-stage builds** in production Dockerfile reduce final image size
3. **Health checks** ensure containers are truly ready before accepting traffic
4. **Resource limits** can be added to prevent containers from consuming too many resources

## Security Considerations

1. **Never commit secrets** to version control
2. **Use environment variables** for sensitive configuration
3. **Run containers as non-root users** (already configured in Dockerfile)
4. **Regularly update base images** to patch security vulnerabilities

## Next Steps

- [Deploy to production server](./DEPLOYMENT.md)
- [Set up CI/CD pipeline](./DEPLOYMENT_CHECKLIST.md)
- [Configure monitoring and logging](./DEPLOYMENT.md)
- [Set up SSL certificates](./nginx/README.md)
