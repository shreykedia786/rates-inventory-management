# 🚀 Deployment Guide

This guide covers different deployment options for the Revenue Management Platform.

## 🌐 Vercel (Recommended - Easiest)

Vercel is the recommended platform for deploying Next.js applications.

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps
1. **Push your code to GitHub** (use the `github-setup.sh` script)
2. **Visit [vercel.com](https://vercel.com)** and sign in with GitHub
3. **Click "New Project"**
4. **Import your repository** `rates-inventory-management`
5. **Configure project settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Add environment variables** (if needed):
   - `NEXT_PUBLIC_API_URL`
   - `DATABASE_URL`
   - `JWT_SECRET`
7. **Click "Deploy"**

Your app will be live at: `https://your-project-name.vercel.app`

### Automatic Deployments
- Every push to `main` branch triggers automatic deployment
- Pull requests get preview deployments
- Custom domains can be added in project settings

## 🐳 Docker Deployment

### Build and Run Locally
```bash
# Build the Docker image
docker build -t rates-inventory .

# Run the container
docker run -p 3000:3000 rates-inventory
```

### Docker Compose (Full Stack)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☁️ AWS Deployment

### Using AWS Amplify
1. **Connect GitHub repository** to AWS Amplify
2. **Configure build settings:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. **Deploy** - automatic deployments on git push

### Using EC2 + Load Balancer
1. **Launch EC2 instance** (t3.medium recommended)
2. **Install Node.js and PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
3. **Clone and setup:**
   ```bash
   git clone https://github.com/yourusername/rates-inventory-management.git
   cd rates-inventory-management
   npm install
   npm run build
   ```
4. **Start with PM2:**
   ```bash
   pm2 start npm --name "rates-inventory" -- start
   pm2 startup
   pm2 save
   ```

## 🔧 Environment Variables

### Production Environment Variables
```env
# Application
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=your-production-database-url

# Authentication
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=24h

# External APIs
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=GA-XXXXXXXXX
```

### Security Considerations
- Use strong, unique JWT secrets
- Enable HTTPS in production
- Set up proper CORS policies
- Use environment-specific database URLs
- Enable rate limiting for APIs

## 📊 Monitoring & Logging

### Vercel Analytics
- Built-in analytics available in Vercel dashboard
- Real-time performance monitoring
- Error tracking and debugging

### Custom Monitoring
```javascript
// Add to your Next.js config
module.exports = {
  // Enable built-in monitoring
  experimental: {
    instrumentationHook: true,
  },
  // Performance monitoring
  poweredByHeader: false,
  generateEtags: false,
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Issues

**Build Errors:**
- Check Node.js version (18+ required)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Verify all environment variables are set

**Performance Issues:**
- Enable Next.js Image Optimization
- Use CDN for static assets
- Implement proper caching strategies

**Database Connection:**
- Verify database URL format
- Check firewall settings
- Ensure database is accessible from deployment environment

### Support
- Check deployment logs in your platform's dashboard
- Review Next.js documentation for specific issues
- Create an issue in the GitHub repository

---

**Happy Deploying! 🚀** 