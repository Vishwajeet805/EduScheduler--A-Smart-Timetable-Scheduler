# 🎓 EduScheduler — Smart Timetable Scheduler

<div align="center">

> **"Smart timetables. Zero conflicts. Maximum productivity."**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v24.14.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)](https://edu-scheduler-a-smart-timetable-sch.vercel.app)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/Vishwajeet805/EduScheduler--A-Smart-Timetable-Scheduler/actions)

**EduScheduler** is a production-ready, full-stack web application that automates conflict-free academic timetable generation for schools, colleges, and coaching institutes.

[🌐 Live Demo](https://edu-scheduler-a-smart-timetable-sch.vercel.app) · [📖 Docs](./docs/) · [🚀 Deploy Guide](./DEPLOYMENT_START_HERE.md) · [🐛 Issues](https://github.com/Vishwajeet805/EduScheduler--A-Smart-Timetable-Scheduler/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [CI/CD & DevOps](#-cicd--devops)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🧠 About the Project

EduScheduler eliminates the manual, error-prone process of building academic timetables. Admins input their faculty, subjects, classrooms, and batch constraints — the engine handles the rest, producing a verified, conflict-free schedule in seconds.

Built entirely in **TypeScript** with a **React (Quasar) frontend** and an **Express.js backend**, the project is structured as a full-stack monorepo and is **100% production-ready** with Docker, CI/CD pipelines, and one-command deployments to Netlify, Vercel, and Railway.

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚡ **Auto Timetable Generation** | Smart algorithm allocates subjects, faculty, and classrooms without conflicts |
| ❌ **Conflict Detection** | Detects and resolves schedule clashes automatically |
| 👨‍🏫 **Faculty & Batch Management** | Full CRUD for managing faculty, student batches, and subjects |
| 🏫 **Classroom Allocation** | Optimizes room utilization across departments |
| 📊 **Admin Dashboard** | Centralized control panel for scheduling operations |
| 📤 **Export & Print** | Download or print personalized timetables |
| 🔒 **Input Validation** | Schema-level validation via **Zod** for all API inputs |
| 🌐 **Serverless API** | API routes deployed as Netlify Functions for zero-cost scaling |
| 🐳 **Docker Support** | Fully containerized with `Dockerfile` and `docker-compose.yml` |
| 🤖 **GitHub Actions CI/CD** | Automated build, test, and deployment on every push |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Language** | TypeScript (100% of codebase) |
| **Frontend** | React · Quasar Framework · TailwindCSS · Vite |
| **Backend** | Node.js · Express.js |
| **Validation** | Zod |
| **Serverless** | Netlify Functions |
| **Containerization** | Docker · Docker Compose |
| **CI/CD** | GitHub Actions |
| **Deployment** | Vercel · Netlify · Railway |
| **Package Manager** | npm v11.9.0 (workspaces) |
| **Runtime** | Node.js v24.14.0 |

> **Note:** The project is 100% TypeScript — no Python or traditional relational database is required out-of-the-box. The API layer runs as Express.js locally and as Netlify Functions in production.

---

## 📁 Project Structure

```
EduScheduler--A-Smart-Timetable-Scheduler/
│
├── .github/
│   └── workflows/
│       ├── build.yml          # CI: type-check, lint, build on every push
│       └── deploy.yml         # CD: auto-deploy to Railway/Vercel/Docker
│
├── api/                       # Shared API definitions / route handlers
│
├── docs/                      # Main application (Quasar monorepo workspace)
│   ├── src/                   # Frontend source (React + Quasar components)
│   ├── netlify/
│   │   └── functions/         # Serverless API (Netlify Functions)
│   ├── dist/
│   │   ├── spa/               # Built frontend output (1.6 MB minified)
│   │   └── server/
│   │       └── node-build.mjs # Built Express backend
│   ├── Dockerfile             # Container image definition
│   ├── docker-compose.yml     # Local full-stack testing with database
│   ├── .env.example           # Environment variables template
│   ├── QUICK_DEPLOY.md        # ⭐ One-liner deploy commands
│   ├── DEPLOYMENT.md          # Detailed platform guides
│   ├── DEPLOYMENT_CHECKLIST.md
│   └── DEPLOYMENT_READY.md    # Build verification report
│
├── DEPLOYMENT_START_HERE.md   # 🚀 Master deployment guide
├── netlify.toml               # Netlify build + redirect config
├── vercel.json                # Vercel build + SPA rewrite config
├── package.json               # Root workspace (delegates to docs/)
├── MIT License
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (v24.14.0 recommended)
- **npm** v11+
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Vishwajeet805/EduScheduler--A-Smart-Timetable-Scheduler.git
cd EduScheduler--A-Smart-Timetable-Scheduler

# 2. Install all dependencies (root workspace installs docs/ automatically)
npm install

# 3. Set up environment variables
cp docs/.env.example docs/.env
# Edit docs/.env with your configuration

# 4. Start the development server
npm run dev
# → App available at http://localhost:9000 (Quasar dev server)
```

### Build for Production

```bash
npm run build
# Frontend → docs/dist/spa/   (~1.6 MB minified)
# Backend  → docs/dist/server/node-build.mjs
```

### Run Production Build Locally

```bash
npm start
# → App available at http://localhost:8080
```

### Run with Docker

```bash
cd docs
docker build -t edusched:latest .
docker run -p 8080:8080 edusched:latest
# → App available at http://localhost:8080

# Or use docker-compose for full stack with database:
docker-compose up
```

### Type Checking & Linting

```bash
npm run typecheck   # TypeScript type verification
npm run format.fix  # Format code
npm test            # Run test suite
```

---

## 🌍 Deployment

EduScheduler ships with configs for **5 platforms** out of the box. All configs are pre-written — just pick and run.

| Platform | Time | Cost | Best For | Config File |
|---|---|---|---|---|
| **Vercel** | 3 min | Free | React/SPA apps, fast preview | `vercel.json` |
| **Netlify** | 5 min | Free | Demo, portfolio, serverless API | `netlify.toml` |
| **Railway** | 10 min | ~$5/mo | Full-stack with database | `.github/workflows/deploy.yml` |
| **Docker** | 15 min | $5+/mo | Any cloud provider, max control | `docs/Dockerfile` |
| **AWS/Azure** | 30 min | $20+/mo | Enterprise, scalability | See `docs/DEPLOYMENT.md` |

### Quick Deploy (Pick One)

```bash
# Vercel (3 minutes — recommended for SPA)
npm install -g vercel
cd docs && vercel deploy --prod

# Netlify (5 minutes — recommended for serverless API)
npm install -g netlify-cli
cd docs && netlify deploy --prod --dir dist/spa

# Railway (10 minutes — recommended for full-stack)
npm install -g @railway/cli
railway login && cd docs && railway up

# Docker (any cloud)
cd docs && docker build -t edusched . && docker run -p 8080:8080 edusched
```

📖 See [`DEPLOYMENT_START_HERE.md`](./DEPLOYMENT_START_HERE.md) for the full guide with environment variable setup, troubleshooting, and platform-specific tips.

---

## 🤖 CI/CD & DevOps

Two GitHub Actions workflows are pre-configured and ready:

**`build.yml`** — Runs on every push and pull request:
- Installs dependencies
- Type-checks all TypeScript
- Lints and formats code
- Builds the project and verifies output

**`deploy.yml`** — Triggered by commit message keywords:

```bash
git commit -m "New feature [vercel]"   # → deploys to Vercel
git commit -m "Bug fix [railway]"      # → deploys to Railway
git commit -m "Update [docker]"        # → builds Docker image
git push
```

### Build Metrics (Verified May 10, 2026)

```
✅ Frontend Build:  ~1.6 MB (minified + gzipped)
✅ Backend Build:   ~1.6 KB (Express entry point)
✅ Type Checking:   All green
✅ Tests:           Pass (npm test)
✅ Dependencies:    497 packages
✅ Node.js:         v24.14.0
✅ Security:        CORS, Zod validation, HTTPS enforced, .env gitignored
```

---

## 📖 Usage Guide

### For Admins
1. Log in to the **Admin Dashboard**
2. Add faculty members, student batches, subjects, and classroom resources
3. Click **Generate Timetable** — the scheduling engine produces a conflict-free schedule automatically
4. Review and approve; export or share with faculty and students

### For Faculty & Students
- View live, real-time timetable from the dashboard
- Use **Export / Print** to download a personalized schedule

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

```bash
# 1. Fork the repo and clone your fork
git clone https://github.com/<your-username>/EduScheduler--A-Smart-Timetable-Scheduler.git

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make changes, then verify everything passes
npm run typecheck && npm test && npm run build

# 4. Commit with a clear message
git commit -m "feat: add your feature description"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please keep PRs focused and include a brief description of what changed and why.

---

## 📄 License

This project is licensed under the **MIT License** — see the [`MIT License`](./MIT%20License) file for details.

---

## 📬 Contact

**Vishwajeet Singh**

- 📧 Email: [vishwajeetsingh80558055@gmail.com](mailto:vishwajeetsingh80558055@gmail.com)
- 🐙 GitHub: [@Vishwajeet805](https://github.com/Vishwajeet805)
- 🌐 Live App: [edu-scheduler-a-smart-timetable-sch.vercel.app](https://edu-scheduler-a-smart-timetable-sch.vercel.app)

---

<div align="center">
  Made with ❤️ by Vishwajeet Singh · <a href="https://opensource.org/licenses/MIT">MIT Licensed</a>
</div>
