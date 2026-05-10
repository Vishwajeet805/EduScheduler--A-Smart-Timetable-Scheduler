# 📋 Pre-Deployment Checklist for EduScheduler

Use this checklist before deploying your project to any platform.

## ✅ Local Setup & Testing

- [ ] Clone repository fresh: `git clone <repo-url>`
- [ ] Install dependencies: `npm install`
- [ ] Check Node.js version: `node -v` (should be 18+ or 20+)
- [ ] Verify all dependencies installed: `npm list`
- [ ] Create `.env` file from `.env.example`
- [ ] Update environment variables with local values
- [ ] Run tests: `npm run test` (should pass)
- [ ] Type checking: `npm run typecheck` (no errors)
- [ ] Fix any linting issues: `npm run format.fix`

## 🏗️ Build Verification

- [ ] Build client: `npm run build:client` ✓
- [ ] Build server: `npm run build:server` ✓
- [ ] Check build output: `ls -la dist/`
- [ ] Verify dist/spa has index.html
- [ ] Verify dist/server has .js files
- [ ] Test production build locally: `npm start`
- [ ] Check no console errors in browser
- [ ] Test API endpoints in production mode
- [ ] Verify static assets load correctly

## 🔍 Code Quality

- [ ] No TODO/FIXME comments left
- [ ] No console.log() statements in production code
- [ ] No hardcoded API URLs (use environment variables)
- [ ] No credentials/secrets in code
- [ ] API error handling implemented
- [ ] Loading states implemented
- [ ] Empty states handled in UI
- [ ] Mobile responsive (test on different screen sizes)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

## 🔐 Security

- [ ] `.env` files in `.gitignore` ✓
- [ ] `node_modules` in `.gitignore` ✓
- [ ] No private keys in repository
- [ ] CORS configured securely
- [ ] Input validation with Zod in place
- [ ] Rate limiting configured (if applicable)
- [ ] HTTPS enabled on production
- [ ] Dependencies audited: `npm audit`
- [ ] No high-severity vulnerabilities
- [ ] SQL injection protected (if using DB)

## 📦 Dependencies

- [ ] All dependencies listed in `package.json`
- [ ] No unused dependencies: `npm prune --production`
- [ ] Lock file is up-to-date: `package-lock.json`
- [ ] Peer dependencies resolved
- [ ] Development dependencies separated from production

## 🗄️ Database (if applicable)

- [ ] Database created
- [ ] Migrations run successfully
- [ ] Connection string in environment variable
- [ ] Database user created with proper permissions
- [ ] Backup strategy defined
- [ ] Connection pooling configured

## 🌐 Environment & Configuration

- [ ] `.env.production` created and reviewed
- [ ] Production API endpoints configured
- [ ] Production database URL set
- [ ] Application name updated
- [ ] Timezone configured
- [ ] Logging configured for production
- [ ] Monitoring/error tracking setup (optional)

## 📝 Documentation

- [ ] README.md is up-to-date
- [ ] API documentation exists
- [ ] Deployment instructions are clear
- [ ] Contributing guidelines updated
- [ ] License file present
- [ ] CHANGELOG.md updated

## 🚀 Platform-Specific Setup

### For Netlify:
- [ ] Netlify account created
- [ ] GitHub connected to Netlify
- [ ] Build command set: `npm run build:client`
- [ ] Publish directory set: `dist/spa`
- [ ] Functions directory set: `netlify/functions`
- [ ] Environment variables added in Netlify dashboard
- [ ] Redirects configured in `netlify.toml`

### For Vercel:
- [ ] Vercel account created
- [ ] Project connected to GitHub
- [ ] Build command set: `npm run build`
- [ ] Output directory set: `dist/spa`
- [ ] Environment variables added in Vercel dashboard

### For Railway:
- [ ] Railway account created
- [ ] Project created
- [ ] GitHub connected or manual push configured
- [ ] Build command: `npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variables added
- [ ] Database provisioned (if needed)

### For Docker:
- [ ] Dockerfile reviewed and tested
- [ ] `.dockerignore` file exists
- [ ] `docker build` successful
- [ ] `docker run` works locally
- [ ] Container image pushed to registry (Docker Hub/ECR/etc)

### For AWS:
- [ ] AWS account created
- [ ] IAM user with proper permissions
- [ ] EC2 instance configured (if EC2 deployment)
- [ ] RDS database setup (if needed)
- [ ] S3 bucket for static assets (if needed)
- [ ] CloudFront distribution configured (if CDN needed)

## 🧪 Final Testing

- [ ] Login functionality works
- [ ] Dashboard loads correctly
- [ ] Data displays properly
- [ ] Forms submit successfully
- [ ] File uploads work (if applicable)
- [ ] Responsive on mobile devices
- [ ] Performance acceptable (Lighthouse score > 80)
- [ ] No 404 errors
- [ ] No 500 errors

## 📊 Monitoring & Analytics

- [ ] Logging configured
- [ ] Error tracking enabled (Sentry/equivalent)
- [ ] Performance monitoring setup
- [ ] Uptime monitoring configured
- [ ] Alert notifications configured
- [ ] Analytics enabled (optional)

## ✨ Pre-Launch Communication

- [ ] Stakeholders informed of launch date
- [ ] Demo prepared for showcase
- [ ] Launch notes prepared
- [ ] FAQ prepared
- [ ] Support channel ready

## 🎉 Deployment Steps

1. [ ] Final code review completed
2. [ ] All checklist items checked
3. [ ] Create deployment branch (optional)
4. [ ] Push to main/master (triggers auto-deploy on most platforms)
5. [ ] Monitor logs for any errors
6. [ ] Verify live application
7. [ ] Test all critical features end-to-end
8. [ ] Get stakeholder approval
9. [ ] Announce launch 🚀

## 📞 Post-Deployment

- [ ] Monitor error logs daily for first week
- [ ] Collect user feedback
- [ ] Monitor performance metrics
- [ ] Be ready to rollback if critical issues
- [ ] Plan hotfixes if needed
- [ ] Document any issues encountered
- [ ] Schedule post-launch review meeting

---

**Need help?** Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed platform-specific instructions.

**Last Updated:** May 10, 2026
