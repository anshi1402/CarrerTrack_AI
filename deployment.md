# 🚀 CareerTrack AI — Complete Deployment & Production Guide

> Comprehensive step-by-step instructions for deploying **CareerTrack AI** to **Vercel**, **Render**, and cloud databases (**MongoDB Atlas**), including environment variables, database configuration, custom domains, automated seeding, and troubleshooting.

---

## 📑 Table of Contents

1. [Architectural Overview](#-architectural-overview)
2. [Prerequisite: MongoDB Atlas Cloud Database Setup](#-prerequisite-mongodb-atlas-cloud-database-setup)
3. [Deploying on Vercel (Recommended)](#-deploying-on-vercel-recommended)
   - [Method 1: Vercel Web Dashboard (1-Click Git Integration)](#method-1-vercel-web-dashboard-1-click-git-integration)
   - [Method 2: Vercel CLI Deployment](#method-2-vercel-cli-deployment)
   - [Custom Domain Setup on Vercel](#custom-domain-setup-on-vercel)
4. [Deploying on Render (Full Stack Web Service)](#-deploying-on-render-full-stack-web-service)
   - [Method 1: Manual Web Service Setup](#method-1-manual-web-service-setup)
   - [Method 2: Blueprint Deployment with `render.yaml`](#method-2-blueprint-deployment-with-renderyaml)
5. [Environment Variables Reference](#-environment-variables-reference)
6. [Automated Database Seeding & Dual-Mode Storage](#-automated-database-seeding--dual-mode-storage)
7. [Post-Deployment Verification & Testing Checklist](#-post-deployment-verification--testing-checklist)
8. [Troubleshooting & Frequently Asked Questions](#-troubleshooting--frequently-asked-questions)

---

## 🏗️ Architectural Overview

CareerTrack AI is built with **Next.js 14 App Router**, React 18, TypeScript, and Tailwind CSS. The backend API is implemented as modern serverless route handlers (`/api/*`) with dual-mode data persistence:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CareerTrack AI Frontend                         │
│   (Next.js 14 App Router • React 18 • TypeScript • Tailwind CSS)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON API
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js Serverless API                          │
│   (/api/auth, /api/roadmaps, /api/progress, /api/goals, /api/health)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Dual-Mode Database Adapter (src/lib/db.ts)               │
│                                                                        │
│   ┌───────────────────────────────┐  ┌─────────────────────────────┐   │
│   │   Production Cloud Mode       │  │  Local Development Mode     │   │
│   │   MongoDB Atlas via Mongoose  │  │  Persistent JSON Storage    │   │
│   │   (Serverless Pooled Cache)   │  │  (data/db.json + Memory)    │   │
│   └───────────────────────────────┘  └─────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🍃 Prerequisite: MongoDB Atlas Cloud Database Setup

CareerTrack AI uses **MongoDB Atlas** (Free Tier `M0` cluster) for permanent cloud data storage across serverless function invocations.

### Step 1: Create a Free MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Under **Deploy your database**, select **M0 Free Tier** (Shared).
3. Choose your preferred Cloud Provider (e.g., AWS) and the Region closest to your users (e.g., `us-east-1` or `ap-south-1`).
4. Click **Create Cluster**.

### Step 2: Create a Database User
1. In the Atlas dashboard, navigate to **Security** ➔ **Database Access**.
2. Click **+ Add New Database User**.
3. Choose **Password** Authentication:
   - **Username**: `careertrack_admin` (or your preferred username)
   - **Password**: Generate or type a secure password (e.g., `SecurePass2026!`). *Make sure to note this down!*
4. Under **Database User Privileges**, select **Read and write to any database**.
5. Click **Add User**.

### Step 3: Configure Network Access (Whitelist IP)
Since serverless platforms like Vercel and Render use dynamic outbound IP addresses, you need to allow access from anywhere:
1. Navigate to **Security** ➔ **Network Access**.
2. Click **+ Add IP Address**.
3. Click **Allow Access from Anywhere** (which fills `0.0.0.0/0`).
4. Click **Confirm**.

### Step 4: Obtain your Connection String
1. Navigate to **Deployment** ➔ **Database**.
2. Click the **Connect** button on your cluster.
3. Select **Drivers** (Node.js).
4. Copy the connection string format:
   ```
   mongodb+srv://careertrack_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password and append the database name `careertrack`:
   ```
   mongodb+srv://careertrack_admin:SecurePass2026!@cluster0.abcde.mongodb.net/careertrack?retryWrites=true&w=majority
   ```
   *(Keep this URI ready for the environment variables step!)*

---

## 🔺 Deploying on Vercel (Recommended)

Vercel is the creator and optimal hosting platform for Next.js applications, offering instant global CDN edge caching, zero-config serverless API routes, and automated preview deployments.

### Method 1: Vercel Web Dashboard (1-Click Git Integration)

#### Step 1: Push Code to GitHub
Ensure your repository is pushed to GitHub, GitLab, or Bitbucket:
```bash
git add .
git commit -m "feat: configure MongoDB backend integration and production deployment"
git push origin main
```

#### Step 2: Import Project in Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** ➔ **Project**.
3. In the "Import Git Repository" section, locate your `CarrerTrack_AI` repository and click **Import**.

#### Step 3: Configure Project Settings
Vercel automatically detects Next.js:
- **Framework Preset**: `Next.js`
- **Root Directory**: `./`
- **Build Command**: `next build` (Default)
- **Output Directory**: `.next` (Default)
- **Install Command**: `npm install` (Default)

#### Step 4: Add Environment Variables
Expand the **Environment Variables** section and add the following keys:

| Key | Value | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://careertrack_admin:PASSWORD@cluster0.abcde.mongodb.net/careertrack?retryWrites=true&w=majority` | Your MongoDB Atlas Connection String |
| `JWT_SECRET` | `careertrack-ai-super-secret-key-prod-2026-xyz` | 32+ character random secret for JWT signing |
| `NODE_ENV` | `production` | Set environment mode to production |

#### Step 5: Deploy
1. Click **Deploy**.
2. Vercel will build your Next.js application, optimize static assets, and deploy serverless functions.
3. In ~60 seconds, your deployment will complete with a live URL (e.g., `https://careertrack-ai.vercel.app`)!

---

### Method 2: Vercel CLI Deployment

If you prefer deploying directly from your terminal:

1. **Install Vercel CLI globally**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link and Configure Environment Variables**:
   ```bash
   # Add your production MongoDB connection string
   vercel env add MONGODB_URI production
   # (Paste your MongoDB Atlas connection string when prompted)

   # Add your production JWT secret
   vercel env add JWT_SECRET production
   # (Paste your JWT secret when prompted)
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

### Custom Domain Setup on Vercel

1. In your project on the Vercel Dashboard, go to **Settings** ➔ **Domains**.
2. Enter your custom domain (e.g., `careertrack.yourdomain.com` or `yourdomain.com`).
3. Vercel will display the required DNS records:
   - For Apex Domain (`yourdomain.com`): Add an **A Record** pointing to `76.76.21.21`.
   - For Subdomain (`app.yourdomain.com`): Add a **CNAME Record** pointing to `cname.vercel-dns.com`.
4. Once DNS propagates (usually 1–5 minutes), Vercel automatically issues and renews free SSL certificates (HTTPS).

---

## 🌐 Deploying on Render (Full Stack Web Service)

Render provides persistent containerized Node.js services with automatic SSL, custom domains, and health check monitoring.

### Method 1: Manual Web Service Setup

#### Step 1: Create a New Web Service
1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub / GitLab repository.

#### Step 2: Configure Service Details
- **Name**: `careertrack-ai`
- **Region**: Select closest region (e.g., Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Root Directory**: Leave blank (root)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (or Starter)

#### Step 3: Configure Environment Variables
In the **Environment Variables** section, add:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | `careertrack-ai-super-secret-key-prod-2026-xyz` |
| `MONGODB_URI` | `mongodb+srv://careertrack_admin:PASSWORD@cluster0.abcde.mongodb.net/careertrack?retryWrites=true&w=majority` |

#### Step 4: Health Check Path
Under **Advanced Settings**:
- **Health Check Path**: `/api/health`
*(Render will automatically poll this endpoint to verify zero-downtime rollouts!)*

#### Step 5: Deploy
Click **Create Web Service**. Render will pull your repository, build the Next.js bundle, and launch the service at `https://careertrack-ai.onrender.com`.

---

### Method 2: Blueprint Deployment with `render.yaml`

The repository includes a ready-to-use `render.yaml` file:

1. In Render Dashboard, click **New +** ➔ **Blueprint**.
2. Select your repository. Render will automatically parse `render.yaml`.
3. Enter your `MONGODB_URI` under the prompt.
4. Click **Apply**. Render will automatically provision and configure the entire web service.

---

## 🔑 Environment Variables Reference

| Variable Name | Required? | Default Value | Purpose |
|---|---|---|---|
| `MONGODB_URI` | **Recommended in Production** | *Empty (Local fallback)* | Connection string for MongoDB Atlas cloud cluster. When omitted, falls back to local JSON store. |
| `JWT_SECRET` | **Required** | `careertrack-ai-production-super-secret-key-2026` | Secret string used to sign and verify JSON Web Tokens for secure authentication cookies. |
| `PORT` | Optional | `3000` (Local) / `10000` (Render) | Port on which the Next.js HTTP server listens. |
| `NODE_ENV` | Optional | `production` | Determines build optimization and secure cookie flags (`secure: true` in production). |
| `NEXT_PUBLIC_APP_URL` | Optional | `https://careertrack-ai.vercel.app` | Canonical public URL used for absolute redirects and metadata. |

---

## ⚡ Automated Database Seeding & Dual-Mode Storage

CareerTrack AI features an intelligent, zero-configuration database adapter (`src/lib/db.ts`):

1. **Automatic First-Run Cloud Seeding**:
   When the application connects to a fresh MongoDB Atlas database for the first time, it automatically detects empty collections and seeds:
   - All **8 Comprehensive Career Roadmaps** (Frontend, Backend, Full Stack, Java, Python, Data Analyst, Data Scientist, DevOps) with complete section topics, projects, and interview questions.
   - Initial badge definitions and system configuration so every new student account starts with a fresh, personalized workspace.
2. **Zero-Setup Local Mode**:
   If `MONGODB_URI` is not set (e.g. running offline during local development), the app smoothly uses `data/db.json` without throwing any errors or crashes.
3. **Serverless Connection Pooling**:
   `src/lib/mongodb.ts` implements global connection caching (`global.mongooseCache`), preventing MongoDB connection exhaustion across rapid serverless lambda executions.

---

## 🧪 Post-Deployment Verification & Testing Checklist

After your deployment completes, perform the following verification checks:

### 1. Health & Database Diagnostic Endpoint
Open `https://<your-app-url>/api/health` in your browser:
```json
{
  "status": "healthy",
  "environment": "production",
  "database": {
    "driver": "mongodb_atlas",
    "isMongoConfigured": true,
    "mongoConnectionState": "connected",
    "roadmapsLoaded": 8
  },
  "system": {
    "nodeVersion": "v20.x.x",
    "memoryUsageMb": 42,
    "responseTimeMs": 12
  }
}
```
- Verify `"driver": "mongodb_atlas"` and `"mongoConnectionState": "connected"`.

### 2. User Registration & Login Persistence Test
- Visit `https://<your-app-url>/register`.
- Create an account with:
  - Name: `John Doe`
  - Email: `johndoe@gmail.com`
  - Password: `password123`
- Complete the 4-step onboarding wizard.
- On `/roadmap`, check off topics.
- Log out from the user profile menu and log back in at `/login` with `johndoe@gmail.com`.
- Verify all checked topics and progress remain 100% intact!

### 3. Interactive Roadmap Checklist
- Visit `/roadmap`.
- Check and uncheck topics ➔ Verify that:
  - Progress percentage updates immediately.
  - Placement Readiness Score recalculates dynamically.
  - Completed topics counter increments.

### 4. Daily Goals & Streak Engine
- Visit `/goals`.
- Check off a daily task ➔ Verify progress bar updates.
- Check all tasks ➔ Verify celebratory confetti animation triggers and streak increments.

### 5. Notification Center & Theme Switcher
- Click the **Dark/Light Theme Toggle** in the top navigation bar ➔ Verify seamless theme transition.
- Visit `/notifications` and trigger a test notification ➔ Verify the in-app bell counter updates.

---

## 🛠️ Troubleshooting & Frequently Asked Questions

### 1. "MongoServerSelectionError: connect ECONNREFUSED" or IP Whitelist Error
- **Cause**: MongoDB Atlas is blocking incoming requests from Vercel's dynamic serverless IP addresses.
- **Solution**: In MongoDB Atlas, go to **Network Access** ➔ **Add IP Address** ➔ Select **Allow Access from Anywhere (`0.0.0.0/0`)** ➔ Click **Confirm**.

### 2. "Authentication Failed" on MongoDB Connection
- **Cause**: Incorrect username or password in the `MONGODB_URI` string, or special characters in the password are not URL-encoded.
- **Solution**: If your password contains special characters (like `@`, `#`, `%`), ensure they are URL-encoded, or create a password with alphanumeric characters only in **Database Access**.

### 3. Serverless Read-Only File System Error (`EROFS`)
- **Cause**: Trying to write local files in serverless environments like AWS Lambda / Vercel.
- **Solution**: Handled automatically! CareerTrack AI uses MongoDB Atlas in production, and provides an in-memory fallback so local file operations never throw fatal runtime crashes.

### 4. Vercel Build Times Out or Fails
- **Cause**: Missing dependencies or type issues.
- **Solution**: Run `npm run build` locally first to verify compilation. Ensure all environment variables are correctly populated in the Vercel project dashboard.

---

## 🎯 Summary

Your **CareerTrack AI** platform is now fully equipped with:
- ✅ Production-ready MongoDB Atlas cloud integration
- ✅ Serverless connection pooling cache
- ✅ Automated database schema initialization & seeding
- ✅ Comprehensive `/api/health` diagnostic route
- ✅ 100% verified zero-error Next.js 14 production build

*Deploy with confidence to Vercel or Render!*
