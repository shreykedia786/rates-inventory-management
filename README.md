# Rates & Inventory Management Platform

**Phase 1: MVP / Pilot Implementation**

A centralized platform for revenue managers and distribution teams to manage rates, inventory, and restrictions across multiple channels with AI-powered insights.

## 🏗️ Project Structure

```
rates-inventory-platform/
├── apps/
│   ├── frontend/          # React 18 + TypeScript frontend
│   └── backend/           # Node.js + NestJS backend API
├── packages/
│   ├── shared-types/      # Shared TypeScript types
│   ├── ui-components/     # Reusable UI components
│   └── utils/            # Shared utilities
├── infrastructure/        # AWS infrastructure code
└── docs/                 # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (for local development)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd rates-inventory-platform
   npm install
   ```

2. **Environment setup:**
   ```bash
   # Copy environment files
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   
   # Update with your local database credentials
   ```

3. **Database setup:**
   ```bash
   # Start local services
   docker-compose up -d postgres redis
   
   # Run database migrations
   npm run db:migrate --workspace=apps/backend
   
   # Seed initial data
   npm run db:seed --workspace=apps/backend
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs

## 📋 Phase 1 Features

### Core Features
- ✅ User authentication & RBAC
- ✅ Multi-tenant data isolation
- ✅ Spreadsheet-style rates & inventory grid
- ✅ Inline editing with real-time validation
- ✅ Bulk operations for rates and restrictions
- ✅ Channel manager integrations
- ✅ AI-powered rate suggestions
- ✅ Comprehensive audit trail

### User Roles
- **Revenue Manager**: Full property-level control
- **Distribution Manager**: Channel sync & approvals
- **Corporate Admin**: Multi-property & user management
- **AI Viewer**: Read-only insights access
- **Operations**: System monitoring & support

## 🔧 Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **Grid Component**: AG Grid Enterprise
- **State Management**: React Query + Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: Node.js + NestJS
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Authentication**: JWT + refresh tokens
- **API Docs**: OpenAPI/Swagger

### Infrastructure
- **Cloud**: AWS (ECS, RDS, ElastiCache, SQS)
- **Containers**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: DataDog

## 📊 Success Metrics

- **Performance**: < 30s rate updates, < 3s page loads
- **Reliability**: > 99% sync accuracy, > 99.9% uptime
- **User Experience**: > 80% satisfaction, 50% time reduction
- **Business Impact**: 3-5% RevPAR improvement

## 🏃‍♂️ Development Workflow

### Available Scripts

```bash
# Development
npm run dev                 # Start both frontend & backend
npm run dev:frontend       # Frontend only
npm run dev:backend        # Backend only

# Building
npm run build              # Build all workspaces
npm run build:frontend     # Build frontend only
npm run build:backend      # Build backend only

# Testing
npm run test               # Run all tests
npm run test:unit          # Unit tests only
npm run test:e2e           # E2E tests only

# Code Quality
npm run lint               # Lint all code
npm run type-check         # TypeScript checking
npm run format             # Format code with Prettier

# Database
npm run db:migrate         # Run migrations
npm run db:seed            # Seed test data
npm run db:reset           # Reset database
```

### Git Workflow

1. Create feature branch: `git checkout -b feature/RIM-123-rate-grid`
2. Make changes and commit: `git commit -m "feat: implement rate grid component"`
3. Push and create PR: `git push origin feature/RIM-123-rate-grid`
4. Code review and merge to main

### Commit Convention

Use conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/tool changes

## 🏢 Enterprise Guidelines

### Security
- All endpoints require authentication
- RBAC enforced at API level
- Multi-tenant data isolation
- Input validation and sanitization
- Audit logging for all changes

### Performance
- Database query optimization
- Redis caching for hot data
- CDN for static assets
- Lazy loading for large datasets
- Background job processing

### Monitoring
- Application performance monitoring
- Error tracking and alerting
- Business metrics dashboards
- Integration health checks
- User activity analytics

## 📚 Documentation

- [Phase 1 Detailed Specs](./phase1.md)
- [Master Plan](./Master-Plan.md)
- [API Documentation](./docs/api/)
- [Component Library](./docs/components/)
- [Deployment Guide](./docs/deployment/)

## 🤝 Team & Support

**Core Team:**
- Product Manager: [Name]
- UX Designer: [Name]
- Frontend Engineers: [Names]
- Backend Engineers: [Names]
- DevOps Engineer: [Name]
- QA Engineer: [Name]

**Support Channels:**
- Slack: #rates-inventory-platform
- Email: support@rates-inventory.com
- Issues: GitHub Issues

---

**Phase 1 Timeline:** 6 months (Current: Month 1 - Foundation & Architecture)

*Built with ❤️ by the UNO Product & UX Team* 