# 📖 CareerTrack AI — Step-by-Step Run & User Instructions

Welcome to **CareerTrack AI**! This guide contains all the commands you need to run the app and simple instructions explaining how to use all features.

---

## ⚡ How to Run the App in 3 Simple Steps

### Step 1: Open Terminal in Project Folder
Open your terminal (PowerShell, Command Prompt, or VS Code Terminal) in the `c:\CarrerTrack_AI` directory:
```bash
cd c:\CarrerTrack_AI
```

### Step 2: Install Dependencies (If not already installed)
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

### Step 4: Open in Your Browser
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Login Accounts (How to Sign In)

### Option A: 1-Click Demo Login (Fastest)
1. Go to the [Login Page](http://localhost:3000/login).
2. Click the purple button: **"1-Click Quick Demo Login"**.
3. You will immediately enter the demo workspace for student **Anshi** with pre-filled progress, streaks, goals, and badges!

### Option B: Sign in with Demo Credentials
- **Email**: `anshi@careertrack.ai`
- **Password**: `Demo@123`

### Option C: Create a New Custom Account
1. Click **"Get Started Free"** or go to [http://localhost:3000/register](http://localhost:3000/register).
2. Enter your Name, Email, Password, and Target Role.
3. Complete the **4-step Onboarding Wizard** to personalize your study goals and reminder time!

---

## 📱 How to Use Every Feature in CareerTrack AI (Simple Guide)

### 1. 🗺️ Following the Roadmap & Checking Off Topics
- Click **"Roadmap"** in the sidebar or go to `/roadmap`.
- You will see all major sections of your chosen career track (e.g. Web Fundamentals, HTML, CSS, JavaScript, React, Integration, Projects, Interview Prep).
- Click any **checkbox (⚪)** to mark a topic as completed (**✅**).
- **What happens automatically when you check a topic?**
  1. Your overall **Roadmap Progress %** increases immediately.
  2. If the topic was part of today's goals, today's **Daily Goal** updates.
  3. Your **Placement Readiness Score** increases.
  4. Your **Study Analytics** logs your study activity.
  5. If you hit a milestone (e.g. 1st topic or 10 topics), you unlock a shiny **Achievement Badge**!

### 2. 🔥 Maintaining Your Daily Learning Streak (Habit System)
- Look at the **🔥 Flame Badge** at the top right or on your Dashboard.
- Complete your daily goal target (e.g. 3 tasks) to keep your streak active for today.
- If you finish today's tasks, your streak automatically extends without duplicate counting on the same day.

### 3. 🎯 Setting & Completing Daily Goals
- Go to the **"Daily Goals"** page (`/goals`).
- Here you can:
  - Check off today's tasks with a single click.
  - Add a new custom task (e.g., "Solve 2 LeetCode problems").
  - Or pick a topic directly from the roadmap dropdown.
- When you hit 100% completion, a **celebratory confetti animation** will pop up! 🎉

### 4. 🛡️ Checking Your Placement Readiness Score
- On your **Dashboard** (`/dashboard`) or **Analytics** (`/analytics`), look at the **Placement Readiness Index**.
- This score evaluates:
  - **Roadmap topics completed** (35%)
  - **Core fundamentals & frameworks** (20%)
  - **Consistency & streak health** (15%)
  - **Hands-on portfolio projects** (15%)
  - **Interview questions & DSA** (15%)
- It also shows your **Strong Areas** (green) and **Focus Areas needing improvement** (amber).

### 5. 💡 "Continue Learning" (Next Recommended Milestone)
- Don't know what to learn next?
- Look at the **"Next Recommended Milestone"** card on your Dashboard.
- It automatically points to your next incomplete topic and gives you a reason explaining why learning it next is critical for your placement interviews.

### 6. 🔄 Switching Career Tracks
- Want to switch from **Frontend Developer** to **Full Stack Developer** or **Backend Developer**?
- Click the **"Switch Role"** button in the top navigation bar or in your Profile.
- Pick any of the 8 available roles. Your progress across each role is safely preserved!

### 7. 🔔 Notifications & Streak Alerts
- Click the **Bell icon** in the top navigation or visit `/notifications`.
- You will receive reminders if today's goals are unfinished.
- You can click **"Test Reminder"** or **"Simulate Streak Alert"** to test habit alerts in real time!
- You can also click **"Allow Notifications"** to enable desktop browser push alerts.

### 8. 🌓 Switching Between Light and Dark Mode
- Look for the **Sun / Moon icon (☀️ / 🌙)** in the top navigation bar.
- Click it at any time to seamlessly switch between **Sleek Dark Theme** and **Clean Crisp Light Theme**.
- Your theme preference is instantly saved to your browser and applies across all pages, charts, roadmaps, and modals!

### 9. ⚙️ Adjusting Settings
- Go to **Settings** (`/settings`).
- Change your daily task count (2, 3, or 5 tasks per day).
- Change your preferred reminder time (e.g. 08:00 PM).
- Toggle reminder notifications on or off.

---

## 🛠️ Common Commands Summary

| Action | Command |
| :--- | :--- |
| **Run Development Server** | `npm run dev` |
| **Build for Production** | `npm run build` |
| **Start Production Server** | `npm run start` |
| **Lint Code** | `npm run lint` |

---

## ❓ Frequently Asked Questions & Troubleshooting

### Q: Does it require a database to be installed on my laptop?
**A:** No! CareerTrack AI includes a built-in zero-configuration storage system (`data/db.json`). It works right away when you run `npm run dev`. If you want to connect to MongoDB Atlas in production, simply add `MONGODB_URI` in `.env.local`.

### Q: How do I reset the demo data?
**A:** If you want to reset everything back to fresh defaults, you can delete the `data/db.json` file and restart `npm run dev`.

---

Happy learning and best of luck with your campus placements! 🚀🎓
