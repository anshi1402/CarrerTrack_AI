# CareerTrack AI 🎯

> **Track Skills. Stay Consistent. Become Placement Ready.**

**CareerTrack AI** is a role-based placement preparation and learning management platform built for engineering and degree students. It replaces scattered playlists, spreadsheets, and notes with structured role roadmaps, habit-based learning streaks, daily goal checklists, study analytics, in-app notifications, and a multi-signal **Placement Readiness Index**.

---

## 🌟 Key Features

### 1. 🗺️ Role-Based Career Roadmaps
- **8 Comprehensive Career Roadmaps**:
  - **Frontend Developer** (10 sections: Web Fundamentals, HTML5, CSS3, JavaScript ES6+, Git/GitHub, React, Frontend-Backend Integration, Real-World Projects, Deployment, Interview Prep)
  - **Backend Developer** (Programming Fundamentals, DSA, Backend Fundamentals, Node.js/Express, Databases SQL/NoSQL, Security, Projects, Deployment)
  - **Full Stack Developer** (7 structured stages: Frontend Foundation, Frameworks, Backend, Database, Full Stack Integration, Projects, Deployment)
  - **Java Developer** (Core Java, OOP, Collections, Multithreading, DSA, JDBC, Spring Boot, Projects, Interview Prep)
  - **Python Developer** (Python Core, OOP, Modules, SQL, FastAPI/Django, Testing, Deployment, Projects)
  - **Data Analyst** (Excel, SQL, Python NumPy/Pandas, Power BI/Tableau, BI Projects, Case Studies)
  - **Data Scientist** (Math & Statistics, EDA, Machine Learning, Deep Learning, ML Projects, Model Deployment)
  - **DevOps Engineer** (Linux, Networking, Docker, CI/CD Actions, Cloud AWS/GCP, Kubernetes, Monitoring)
- **Interactive Checklists**: Checkboxes reactively update progress, daily goals, streaks, and readiness scores across all views in real-time.
- **Search & Filter**: Search by keywords or filter by Completed, Incomplete, Projects, or Interview Questions.

### 2. 🔥 Habit-Based Learning Streak Engine
- Prominent streak indicator (🔥 **12-Day Streak**).
- Tracks current streak, longest streak, and weekly consistency dots.
- Automated streak validation: completing required daily goals secures the streak.
- Streak at-risk alert notifications to prevent breaking consistency before midnight.
- **🌓 Seamless Light & Dark Theme**: One-click instant theme toggle persisted in `localStorage` across the whole platform.

### 3. 🎯 Daily Goals & Habit Tracker
- Set target topics per day (e.g., 2, 3, or 5 topics/day).
- Add custom daily tasks or pick directly from curriculum milestones.
- Real-time progress bar with fraction counter (e.g., `3 / 4 tasks completed • 75%`).
- Celebratory confetti animations on 100% completion.

### 4. 🛡️ Placement Readiness Score Algorithm
Multi-signal weighted index calculating your placement preparedness:
- **Roadmap Completion** (35%)
- **Skill & Core Fundamentals** (20%)
- **Daily Consistency & Habit Health** (15%)
- **Real-World Portfolio Projects** (15%)
- **Technical Interview & DSA Preparation** (15%)
- **Readiness Levels**:
  - `0–20%` → Just Started
  - `21–40%` → Building Foundation
  - `41–60%` → Developing Skills
  - `61–80%` → Placement Ready Path
  - `81–100%` → Highly Prepared
- Highlights **Strong Foundation Areas** vs **Recommended Focus Areas**.

### 5. 💡 Smart "Continue Learning" & Next Milestone
- Automatically calculates the next incomplete topic in sequence with contextual placement reasoning.

### 6. 📊 Study Analytics & Trajectory
- **Weekly Learning Activity**: Interactive bar charts with topics completed.
- **Monthly Trajectory**: Area chart showing preparation momentum.
- **Curriculum Section Breakdown**: Progress gauges for every section.

### 7. 🏆 Achievements & Badges Showcase
- Badges for study streaks (3-Day, 7-Day, 30-Day), milestone topics (1st Topic, 10, 25, 50 Topics), project completions, and readiness score milestones.

### 8. 🔔 Notification Center & Preferences
- In-app notification bell with unread badge counter.
- Test notification triggers (Daily goal reminders & streak risk alerts).
- Browser Notification API integration.
- Configurable reminder schedule in Settings.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Celebration Effects**: Canvas-Confetti
- **Storage Layer**: Resilient dual-mode adapter (Mongoose MongoDB Atlas integration + local persistent zero-setup JSON store fallback)
- **Security & Auth**: JWT Tokens, HTTP-only cookie support, bcryptjs password hashing

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx        # Sign In + 1-Click Demo Login
│   │   │   └── register/page.tsx     # Student Registration
│   │   ├── onboarding/page.tsx       # 4-Step Interactive Personalization Wizard
│   │   ├── dashboard/page.tsx        # Central Command Hub
│   │   ├── roadmap/
│   │   │   ├── page.tsx              # Interactive Role Roadmap Checklist
│   │   │   └── [role]/page.tsx       # Dynamic Role-Specific Roadmap
│   │   ├── goals/page.tsx            # Daily Goals Planner & Streak Log
│   │   ├── analytics/page.tsx        # Recharts Study Analytics
│   │   ├── notifications/page.tsx    # Notification Center & Alert Tester
│   │   ├── profile/page.tsx          # Student Profile, Role Switcher & Badges
│   │   ├── settings/page.tsx         # Preference & Schedule Configuration
│   │   ├── layout.tsx                # Root layout with dark theme
│   │   ├── globals.css               # Design system & Tailwind styling
│   │   └── page.tsx                  # Landing Page
│   ├── components/
│   │   ├── Navbar.tsx                # Top navigation & notification dropdown
│   │   ├── Sidebar.tsx               # Desktop navigation menu
│   │   ├── MobileNav.tsx             # Mobile bottom touch navigation
│   │   ├── StreakCard.tsx            # Habit-based streak tracking card
│   │   ├── ThemeToggle.tsx           # Dark and Light mode toggle component
│   │   ├── ThemeProvider.tsx         # Theme Context provider with localStorage sync
│   │   ├── ReadinessGauge.tsx        # Placement Readiness index gauge
│   │   ├── DailyGoalsCard.tsx        # Today's goal checklist
│   │   ├── ContinueLearningCard.tsx  # Next milestone recommendation
│   │   ├── RoadmapItem.tsx           # Checkable topic item with details modal
│   │   ├── RoadmapSectionCard.tsx    # Collapsible accordion section
│   │   ├── AchievementBadgeCard.tsx  # Achievement badge card
│   │   ├── RoleSwitcherModal.tsx     # Dynamic role switching modal
│   │   └── ConfettiTrigger.tsx       # Celebratory confetti generator
│   ├── lib/
│   │   ├── db.ts                     # Dual-mode data repository & persistence
│   │   ├── auth.ts                   # JWT signing, verification & bcrypt
│   │   ├── seed-data.ts              # Rich seed roadmaps for 8 roles
│   │   ├── readiness.ts              # Readiness score algorithm
│   │   ├── streaks.ts                # Habit streak calculation engine
│   │   └── notifications.ts          # Reminder generator service
│   └── types/
│       └── index.ts                  # Comprehensive TypeScript definitions
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Pre-configured Demo Account

You can log in with a single click using the **"1-Click Quick Demo Login"** button, or enter:

- **Email**: `anshi@careertrack.ai`
- **Password**: `Demo@123`

---

## 📜 License
MIT License. Built with ❤️ for students preparing for campus placements.
