# 🚀 EduScheduler Deployment Guide

This guide covers different ways to deploy your EduScheduler application. Choose the platform that best suits your needs.

---

## 📋 Pre-Deployment Checklist

Before deploying to any platform, complete these steps:

### 1. **Build & Test Locally**
```bash
npm install
npm run build
npm run test
npm start
```

### 2. **Environment Variables**
Create a `.env.production` file with production-specific variables:
```
VITE_PUBLIC_BUILDER_KEY=<your_production_key>
NODE_ENV=production
```

### 3. **Verify Production Build**
```bash
npm run build:client
npm run build:server
npm start  # Should start on production port
```

---

## 🌐 Deployment Options

### **Option 1: Netlify (Easiest - Already Configured!)**

**Why Netlify?**
- ✅ Already configured (`netlify.toml` exists)
- ✅ Free tier available
- ✅ Auto-deploys on git push
- ✅ Perfect for full-stack apps

**Steps:**

1. **Connect GitHub Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New Site from Git"
   - Choose GitHub and authenticate
   - Select your repository

2. **Configure Build Settings**
   - Build Command: `npm run build:client`
   - Publish Directory: `dist/spa`
   - Functions Directory: `netlify/functions`

3. **Set Environment Variables**
   - Go to Site Settings → Environment
   - Add `VITE_PUBLIC_BUILDER_KEY` and other production keys

4. **Deploy**
   - Push to master branch
   - Netlify auto-deploys
   - Your app is live! 🎉

---

### **Option 2: Railway.app (Recommended for Full-Stack)**

**Why Railway?**
- ✅ Easy database integration (PostgreSQL, MongoDB)
- ✅ Perfect for Node.js + React apps
- ✅ Simple dashboard
- ✅ Pay-as-you-go pricing

**Steps:**

1. **Create Account & Project**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize Railway Project**
   ```bash
   railway init
   ```

3. **Create `railway.toml` (optional)**
   ```toml
   [build]
   builder = "nixpacks"
   
   [deploy]
   numReplicas = 1
   ```

4. **Add Database (if needed)**
   - Dashboard → Add Service → PostgreSQL/MongoDB
   - Railway auto-generates connection string

5. **Deploy**
   ```bash
   railway up
   # or connect GitHub for auto-deploy
   ```

---

### **Option 3: Vercel (Great for React)**

**Why Vercel?**
- ✅ Optimized for React/Vite apps
- ✅ Zero-config deployment
- ✅ Automatic previews on PRs
- ✅ Edge functions support

**Steps:**

1. **Connect GitHub**
   - Go to [vercel.com](https://vercel.com)
   - Import project from GitHub
   - Select repository

2. **Configure Project**
   - Framework: "Other"
   - Build Command: `npm run build`
   - Output Directory: `dist/spa`

3. **Set Environment**
   - Environment Variables → Add production keys

4. **Deploy**
   - Click Deploy
   - Auto-deploys on push to main branch

**Note:** Your Express server will run as serverless functions on Vercel.

---

### **Option 4: Docker + Any Hosting (Most Control)**

**Why Docker?**
- ✅ Works anywhere (AWS, Azure, DigitalOcean, etc.)
- ✅ Consistent environment
- ✅ Easy scaling

**Create `Dockerfile`:**
```dockerfile
# Build stage
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["npm", "start"]
```

**Create `.dockerignore`:**
```
node_modules
npm-debug.log
.git
.env.local
dist
build
.DS_Store
```

**Build & Run Locally:**
```bash
docker build -t edusched-app .
docker run -p 8080:8080 edusched-app
```

**Deploy:**
- **AWS**: Push to ECR, deploy with ECS/Fargate
- **DigitalOcean**: Push to App Platform
- **Azure**: Deploy with Container Instances
- **Google Cloud**: Push to Artifact Registry, deploy with Cloud Run

---

### **Option 5: AWS (Scalable & Production-Ready)**

**Why AWS?**
- ✅ Most powerful/scalable
- ✅ Database integration
- ✅ CDN support
- ✅ Auto-scaling

**Choice A: AWS Amplify (Easiest)**
1. Go to AWS Amplify Console
2. Connect GitHub repository
3. Set build settings:
   - Build: `npm run build`
   - Output: `dist/spa`
4. Deploy!

**Choice B: EC2 + Application Load Balancer**
1. Create EC2 instance (Ubuntu 24.04)
2. SSH and install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Clone repository and build:
   ```bash
   git clone <your-repo>
   cd docs
   npm install
   npm run build
   ```
4. Set up reverse proxy with Nginx
5. Configure Application Load Balancer
6. Set up RDS database (PostgreSQL/MySQL)

**Choice C: Elastic Beanstalk**
1. Create `.ebextensions/nodejs.config`:
   ```yaml
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: "npm start"
   ```
2. Deploy:
   ```bash
   eb create edusched-env
   eb deploy
   ```

---

### **Option 6: Azure App Service**

**Steps:**

1. **Create App Service**
   ```bash
   az group create -n my-resource-group -l eastus
   az appservice plan create -n myplan -g my-resource-group --sku FREE
   az webapp create -n edusched -g my-resource-group -p myplan
   ```

2. **Configure Deployment**
   - Connect GitHub via Azure Repos
   - App Service auto-builds and deploys

3. **Add Database**
   - Azure Database for PostgreSQL/MySQL
   - Add connection string to environment

---

### **Option 7: Heroku (Legacy but Still Works)**

**Steps:**

1. **Create `Procfile`:**
   ```
   web: npm start
   build: npm run build
   ```

2. **Deploy:**
   ```bash
   heroku login
   heroku create edusched-app
   git push heroku main
   ```

3. **Set Variables:**
   ```bash
   heroku config:set VITE_PUBLIC_BUILDER_KEY=xxx
   ```

---

### **Option 8: GitHub Pages (Frontend Only)**

**Note:** This only works if you deploy the frontend separately.

**Steps:**

1. **Update `vite.config.ts`:**
   ```typescript
   export default defineConfig({
     base: '/EduScheduler--A-Smart-Timetable-Scheduler/',
     // ... rest of config
   });
   ```

2. **Create GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
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
             node-version: '20'
         - run: npm install
         - run: npm run build:client
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist/spa
   ```

3. **Enable Pages:** Settings → Pages → Deploy from branch

---

## 🎯 Quick Recommendation

| Use Case | Platform |
|----------|----------|
| **Startup/Demo** | Netlify (free tier) |
| **Full-stack with DB** | Railway.app |
| **Best DX** | Vercel |
| **Production/Enterprise** | AWS or Azure |
| **Flexible/Own server** | Docker on DigitalOcean/Linode |

---

## 📊 Monitoring & Maintenance

After deployment:

- **Check Logs:**
  ```bash
  # For most platforms, use dashboard or:
  platform logs -f
  ```

- **Monitor Performance:**
  - Use built-in metrics (CloudWatch, App Insights)
  - Set up error tracking (Sentry, Rollbar)

- **Auto-scaling:**
  - Set min/max replicas
  - Configure CPU/memory thresholds

---

## 🔒 Security Checklist

- ✅ Never commit `.env` files
- ✅ Use secrets management for API keys
- ✅ Enable HTTPS (all modern platforms do this)
- ✅ Keep dependencies updated: `npm audit fix`
- ✅ Use rate limiting on API endpoints
- ✅ Sanitize user inputs (Zod validation already in place!)
- ✅ Set CORS properly for production

---

## 🆘 Troubleshooting

**Build fails with "out-dir not found":**
```bash
npm run build:client && npm run build:server
```

**Port conflicts:**
Set `PORT` environment variable to different port

**Database connection issues:**
Verify connection string in environment variables

**CORS errors:**
Update API URLs in `shared/api.ts` for production

**Large bundle size:**
```bash
npm run build -- --analyze
# Check for unused dependencies
```

---

## 📞 Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Docker Docs:** https://docs.docker.com
- **Express.js:** https://expressjs.com
- **Vite:** https://vitejs.dev

---

Happy deploying! 🎉 Choose a platform above and let us know if you need help with specific steps.
