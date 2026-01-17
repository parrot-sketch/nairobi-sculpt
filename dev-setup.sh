#!/bin/bash

# Nairobi Sculpt - Local Development Quick Start
# This script sets up and starts the entire development environment

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Nairobi Sculpt - Local Development Environment Setup         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check Docker
echo "🐳 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi
echo "✅ Docker found: $(docker --version)"

# Check Docker Compose
echo "🐳 Checking Docker Compose installation..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose."
    exit 1
fi
echo "✅ Docker Compose found: $(docker-compose --version)"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo ""
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

# Start Docker services
echo ""
echo "🚀 Starting Docker services..."
docker-compose up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if PostgreSQL is ready
echo "🔍 Checking PostgreSQL..."
until docker-compose exec -T postgres pg_isready -U nairobi_dev &> /dev/null; do
    echo "  Waiting for PostgreSQL..."
    sleep 2
done
echo "✅ PostgreSQL is ready"

# Check if Redis is ready
echo "🔍 Checking Redis..."
until docker-compose exec -T redis redis-cli ping &> /dev/null; do
    echo "  Waiting for Redis..."
    sleep 2
done
echo "✅ Redis is ready"

# Run database migrations
echo ""
echo "📊 Running database migrations..."
docker-compose exec -T api pnpm exec prisma migrate deploy 2>/dev/null || echo "  (migrations may already be applied)"

# Seed database (optional)
echo ""
echo "🌱 Seeding database with sample data..."
docker-compose exec -T api pnpm exec prisma db seed 2>/dev/null || echo "  (seed may have already run)"

# Display service information
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    Services Ready! 🎉                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Service URLs:"
echo "  • Web App:        http://localhost:5173"
echo "  • API:            http://localhost:3000/api"
echo "  • PgAdmin:        http://localhost:5050"
echo "  • API Docs:       http://localhost:3000/api"
echo ""
echo "🔐 Database Access:"
echo "  • Host:           localhost"
echo "  • Port:           5432"
echo "  • User:           nairobi_dev"
echo "  • Password:       dev_password_secure_123"
echo "  • Database:       nairobi_sculpt_dev"
echo ""
echo "🛠️  Useful Commands:"
echo "  • View logs:      docker-compose logs -f"
echo "  • Stop services:  docker-compose down"
echo "  • Database CLI:   docker-compose exec postgres psql -U nairobi_dev -d nairobi_sculpt_dev"
echo "  • Prisma Studio: docker-compose exec api pnpm exec prisma studio"
echo ""
echo "📚 Documentation:"
echo "  • Setup Guide:    cat LOCAL_DEVELOPMENT_SETUP.md"
echo "  • Architecture:   cat ARCHITECTURE.md"
echo "  • Phase 1 Status: cat PHASE_1_QUICK_REFERENCE.md"
echo ""
echo "✨ Ready for Phase 2 development! Start building at http://localhost:5173"
echo ""
