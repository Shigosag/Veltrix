# Veltrix — AI SaaS Analytics Command Center

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2d3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <strong>“See the signal. Understand the story.”</strong>
</p>

---

## 📌 Overview

**Veltrix** is an enterprise-ready AI SaaS Analytics Command Center designed for high-density telemetry monitoring, real-time KPI tracking, statistical anomaly detection (Z-score analysis), and dataset ingestion. Built on a clean full-stack monorepo architecture separating the presentation client from the persistent API backend.

---

## 🌐 Live URL

🟢 **Visit Veltrix:**  
https://veltrix-y0tru.faable.link/

---

![Veltrix Command Center](Screenshots/veltrix_01_dashboard.png)

## 🚀 Key Features

* 📊 **Command Center Dashboard:** Real-time KPI summaries, SVG trend sparklines, and active telemetry anomaly alerts.
* 📈 **Interactive Data Visualizers:** Revenue trends, baseline tracking, conversion funnels, and retention cohort heatmaps powered by Recharts.
* 🧠 **Statistical AI Insights:** Automated rule-based diagnostic findings, severity scoring, and confidence intervals across all ingested datasets.
* 📁 **Dataset Manager:** Live metadata registry supporting JSON ingestion, schema detection, and streaming CSV export.
* 🔐 **Secure Authentication:** Stateless HS256 JWT cookie-based session verification with Next.js edge route guards.
* 🌓 **Dark & Light Interface:** Deep cyberpunk aesthetic (`#09090f` background, `#f43f5e` electric rose accent) with instant theme toggling.

---

## 🏗️ Architecture & Monorepo Layout

```text
veltrix/
├── client/                 # Next.js 15 frontend application
│   ├── src/app/            # App router pages (dashboard, analytics, datasets, insights)
│   ├── src/components/     # KPI cards, charts, data tables, sidebars
│   └── src/middleware.ts   # Edge route protection
├── server/                 # Express & Prisma backend service
│   ├── src/controllers/    # HTTP request controllers
│   ├── src/routes/         # REST endpoint declarations (/api/*)
│   ├── src/services/       # Analytical telemetry & aggregation services
│   └── prisma/             # PostgreSQL schema & database seeders
└── package.json            # Root workspace orchestrator
```

---

## ⚡ Quick Start (Local Development)

### 📋 Prerequisites
* **Node.js:** v20+ or v22+ LTS
* **Database:** PostgreSQL instance (or free serverless [Neon.tech](https://neon.tech))

---

### 1️⃣ Clone & Navigate to Project
```bash
git clone https://github.com/Shigosag/Veltrix.git
cd Veltrix
```

### 2️⃣ Configure Environment
Create `.env` at root and populate your database and JWT secret:
```bash
cp .env.example .env
cp .env server/.env
cp .env client/.env.local
```
*(Ensure `DATABASE_URL` points to your PostgreSQL connection string).*

### 3️⃣ Install Dependencies
```bash
npm run install:all
```

### 4️⃣ Initialize Database & Seed Telemetry
```bash
npm run db:push
npm run db:seed
```

### 5️⃣ Start Development Server
```bash
npm start
```

* 💻 **Frontend Application:** [http://localhost:3000](http://localhost:3000)
* ⚙️ **Backend API Server:** [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔑 Default Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin / Analytics Lead** | `demo@veltrix.ai` | `veltrix2026` |

---

## 🧪 Running Tests

Execute Vitest unit tests, component tests, and API integration tests:

```bash
npm run test
```

---

## 🛡️ Security & Performance Standards

* **Stateless Authorization:** Cryptographically signed JWT tokens stored in strict `HttpOnly`, `SameSite=Lax` cookies.
* **Database Protection:** Zero raw SQL injection vectors via Prisma ORM parameterized queries.
* **Security Headers:** Enforced Content Security Policy, HSTS, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff`.
* **Zero-Cost Production Ready:** Architected to deploy on free-tier platforms (Vercel/Faable + Neon PostgreSQL).

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
