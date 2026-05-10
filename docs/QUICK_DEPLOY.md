# 🚀 EduScheduler: Quick Deploy Guide

One-liner deployment commands and quick setup for each platform. Full details in [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📋 Prerequisites (for all platforms)

```bash
# Install dependencies locally and test
npm install
npm run build
npm run test
npm start
```

---

## 🟦 Netlify (RECOMMENDED FOR BEGINNERS)

**Setup time:** 5 minutes | **Cost:** Free tier available

```bash
# Install CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify init
netlify deploy --prod
```

Or: Connect GitHub in [netlify.com](https://app.netlify.com) → Auto-deploys on push

**Dashboard:** https://app.netlify.com

---

## 🚂 Railway.app (RECOMMENDED FOR FULL-STACK)

**Setup time:** 5 minutes | **Cost:** $5-20/month for hobby projects

```bash
# Install CLI
npm install -g @railway/cli

# Deploy
railway login
cd docs
railway up
```

Or: Connect GitHub in [railway.app](https://railway.app) dashboard

**Add Database:**
```bash
railway add  # Choose PostgreSQL or MongoDB
```

**Dashboard:** https://railway.app

---

## ▲ Vercel (EASY FOR REACT)

**Setup time:** 3 minutes | **Cost:** Free tier available

```bash
# Install CLI
npm install -g vercel

# Deploy
vercel login
cd docs
vercel deploy --prod
```

Or: Import GitHub repo at [vercel.com/new](https://vercel.com/new)

**Dashboard:** https://vercel.com/dashboard

---

## 🐳 Docker (ANYWHERE)

**Setup time:** 10 minutes | **Cost:** Varies by hosting

```bash
# Build image
cd docs
docker build -t edusched:latest .

# Test locally
docker run -p 8080:8080 edusched:latest

# Push to Docker Hub
docker login
docker tag edusched:latest YOUR_USERNAME/edusched:latest
docker push YOUR_USERNAME/edusched:latest
```

**Deploy with Docker Compose:**
```bash
# Copy docker-compose.yml and run
docker-compose up -d
```

**Run with database:**
```bash
docker-compose up -d
# Runs on http://localhost:8080
```

---

## ☁️ AWS Quick Deploy

### AWS Amplify (Easiest)
```bash
# Install AWS CLI and Amplify CLI
npm install -g @aws-amplify/cli

# Initialize and deploy
amplify init
amplify publish
```

### EC2 (Most Control)
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-instance-ip

# On EC2:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
git clone YOUR_REPO
cd docs
npm install
npm run build
npm start
```

### Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy
eb init
eb create edusched-env
eb deploy
eb open
```

---

## 🔷 Azure App Service

```bash
# Install Azure CLI
# Then:
az login
az group create -n mygroup -l eastus
az appservice plan create -n myplan -g mygroup --sku FREE
az webapp create -n edusched -g mygroup -p myplan
az webapp deployment github auth

# Connect repo and it auto-deploys
```

---

## 🟣 DigitalOcean App Platform

```bash
# Create app.yaml in root:
cat > app.yaml << 'EOF'
name: edusched
services:
- name: web
  github:
    repo: YOUR_USERNAME/YOUR_REPO
    branch: main
  build_command: cd docs && npm install && npm run build
  run_command: cd docs && npm start
  http_port: 8080
EOF

# Deploy via dashboard: https://cloud.digitalocean.com/apps
```

---

## 📦 Heroku (Legacy but Works)

```bash
# Install Heroku CLI, then:
heroku login
heroku create edusched-app
git push heroku main

# Set environment variables:
heroku config:set VITE_PUBLIC_BUILDER_KEY=xxx
```

---

## 💾 GitHub Pages (Frontend Only - Static)

```bash
# Update vite.config.ts: base: '/repo-name/'

# Create .github/workflows/deploy.yml (see .github/workflows/deploy.yml)

# Push and it auto-deploys to: https://YOUR_USERNAME.github.io/repo-name/
```

---

## 🔄 GitHub Actions Auto-Deployment

Already configured! Just trigger with commit messages:

```bash
# Deploy to Railway
git commit -m "Deploy to production [railway]"
git push

# Deploy to Vercel
git commit -m "Deploy to production [vercel]"
git push

# Deploy Docker image
git commit -m "Deploy to production [docker]"
git push
```

See [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

---

## 📊 Comparison Table

| Platform | Setup | Cost | Scaling | Best For |
|----------|-------|------|---------|----------|
| **Netlify** | ⭐ 1 min | 💰 Free | Medium | Beginners, JAMstack |
| **Railway** | ⭐⭐ 3 min | 💰 $5+ | High | Full-stack, Database |
| **Vercel** | ⭐ 1 min | 💰 Free | High | React apps |
| **Docker** | ⭐⭐⭐ 15 min | 💰 $5+ | Very High | Maximum control |
| **AWS** | ⭐⭐⭐⭐ 30 min | 💰 $10+ | Very High | Enterprise |
| **Azure** | ⭐⭐⭐ 20 min | 💰 $10+ | Very High | Corporate |
| **GitHub Pages** | ⭐ 2 min | 💰 Free ♻️ | Low | Static frontend only |

---

## 🎯 Recommended for Showcasing

**Best for Demo/MVP:** **Netlify**
- Free tier covers showcase needs
- Auto-deploys on every push
- Live URL in 5 minutes
- Works perfectly for this project

```bash
# Go live in < 5 minutes:
npm install
npm run build
netlify deploy --prod --dir docs/dist/spa
```

**Link:** https://your-site.netlify.app

---

## 🔒 Security Tips

- [ ] Never commit `.env` files
- [ ] Use platform secrets management
- [ ] Enable HTTPS (automatic on all platforms)
- [ ] Setup CORS properly
- [ ] Validate/sanitize inputs
- [ ] Keep dependencies updated

---

## 🆘 Troubleshooting

**Build fails?**
```bash
npm run build:client
npm run build:server
npm start
```

**Port already in use?**
```bash
PORT=3000 npm start
```

**Database issues?**
Check `DATABASE_URL` environment variable

**Large bundle?**
```bash
npm run build -- --analyze
```

---

## 📞 Platform Support Links

- **Netlify:** https://docs.netlify.com/
- **Railway:** https://docs.railway.app/
- **Vercel:** https://vercel.com/docs
- **AWS:** https://docs.aws.amazon.com/
- **Azure:** https://docs.microsoft.com/azure/
- **Docker:** https://docs.docker.com/

---

## ✨ Next Steps

1. Choose a platform from the table above
2. Follow the one-liner commands
3. Use [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
4. Reference [DEPLOYMENT.md](./DEPLOYMENT.md) if needed
5. Test everything before showcasing

**Ready to deploy? Pick Netlify for fastest results! 🚀**
