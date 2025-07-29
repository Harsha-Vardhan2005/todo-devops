#!/bin/bash

# Deploy script for AWS EC2
set -e

echo "Starting deployment..."

# Pull latest images
docker-compose pull

# Stop existing containers
docker-compose down

# Start new containers
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Health check
if curl -f http://localhost:5000/health; then
    echo "Backend is healthy"
else
    echo "Backend health check failed"
    exit 1
fi

if curl -f http://localhost:3000; then
    echo "Frontend is accessible"
else
    echo "Frontend health check failed"
    exit 1
fi

echo "Deployment completed successfully!"

# Clean up old images
docker image prune -f