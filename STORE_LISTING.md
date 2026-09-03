# HabitFlow: Official App Store & Google Play Store Listing Kit

Use the copy-paste-ready metadata below when filling out your store listings in **Google Play Console** and **Apple App Store Connect**.

---

## 1. App Store (iOS) - App Store Connect Metadata

- **App Name:** `HabitFlow: Daily Habit Tracker` *(29 / 30 chars)*
- **Subtitle:** `Satisfying Habits & Streaks` *(27 / 30 chars)*
- **Primary Category:** Health & Fitness (or Productivity)
- **Secondary Category:** Lifestyle
- **Price:** Free
- **Bundle ID:** `com.habitflow.app`
- **SKU:** `habitflow-001`
- **Promotional Text (170 chars):**
  > Build unstoppable momentum with tactile daily check-offs, spring animations, GitHub-style heatmaps, weekly streak freezes, and light gamification.

- **Keywords (Separated by commas, max 100 chars):**
  `habit tracker,daily routine,streaks,heatmaps,gamified,habitflow,routine planner,goal tracker,momentum`

- **Support URL:** `https://your-domain.com` *(or GitHub repo URL)*
- **Marketing URL:** `https://your-domain.com`
- **Privacy Policy URL:** `https://your-domain.com/privacy-policy.html`

### Description:
```markdown
Build habits that stick with HabitFlow — a daily momentum tracker designed to feel genuinely satisfying to use every single day.

Say goodbye to sterile checklists. HabitFlow turns habit building into a tactile, rewarding experience with spring physics, rolling counters, celebratory soundscapes, and GitHub-style consistency heatmaps.

KEY FEATURES

⚡ TACTILE CHECK-OFFS
Experience pure satisfaction with every completion: a spring-bounce checkmark, micro-haptics, crisp sound pops, and celebratory confetti.

🔥 UNSTOPPABLE STREAKS
Track your current and all-time longest streaks. Watch the flame grow as you stay consistent day after day.

🧊 WEEKLY STREAK FREEZE
Life happens. Use your weekly Streak Freeze to protect your hard-earned streak if you miss a day due to travel or rest.

📊 GITHUB-STYLE HEATMAPS
Visualize your consistency over 12+ weeks with commit-style intensity heatmaps for each habit and across all routines combined.

🌱 LIGHT GAMIFICATION & BADGES
Earn XP for every habit completed, level up your rank from Seedling Sprout to Zen Titan, and unlock milestone badges with scale-and-fade celebrations.

📅 FLEXIBLE SCHEDULING
- Daily habits
- Specific weekdays (e.g. Mon, Wed, Fri)
- Target times per week (e.g. 3x weekly)

✨ ZERO FRICTION & PRIVACY-FIRST
No mandatory accounts, no ads, and no tracking. All your data stays safely stored on your device. Easily export and import full JSON backups at any time.

Download HabitFlow today and start building momentum, one satisfying checkmark at a time!
```

---

## 2. Google Play Store (Android) - Play Console Metadata

- **App Name:** `HabitFlow - Habit Tracker` *(25 / 30 chars)*
- **Short Description (Max 80 chars):**
  `Build daily momentum with satisfying tactile check-offs, streaks & heatmaps.` *(76 chars)*
- **Category:** Health & Fitness or Productivity
- **Tags:** Habit Tracker, Routine Planner, Self Care, Productivity, Goal Tracker

### Data Safety Questionnaire Answers:
- **Does your app collect or share user data?** $\rightarrow$ **No** (all data is stored locally in device storage).
- **Does your app use encryption in transit?** $\rightarrow$ **Not applicable** (no external server communication).
- **Can users request deletion of their data?** $\rightarrow$ **Yes** (users can clear all data instantly via Settings).

### Content Rating Questionnaire Answers:
- **Violence:** No
- **Sexuality / Nudity:** No
- **Language / Profanity:** No
- **Controlled Substances:** No
- **User-generated content or open chat:** No
- **Result:** Rated for 3+ / Everyone (PEGI 3 / ESRB Everyone)

---

## 3. Required Store Graphics Checklist

All required graphics have been generated and located in the `/assets` directory:
- [x] **App Icon (512x512 PNG)**: [`assets/icon.png`](file:///Users/sabhay/.gemini/antigravity/scratch/habitflow-app/assets/icon.png) *(1024x1024 master, downscales cleanly to 512x512)*
- [x] **Feature Graphic (1024x500 PNG)**: [`assets/feature-graphic.png`](file:///Users/sabhay/.gemini/antigravity/scratch/habitflow-app/assets/feature-graphic.png) *(required by Google Play)*
- [x] **Splash Screen (2732x2732 PNG)**: [`assets/splash.png`](file:///Users/sabhay/.gemini/antigravity/scratch/habitflow-app/assets/splash.png)
- [x] **Native App Icons**: Auto-generated into `android/app/src/main/res/` and `ios/App/App/Assets.xcassets/`
