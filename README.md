# Educational Campus Portal (Inspired by Ma'din Academy)

A clean, modern, and simple educational campus portal featuring a responsive front-facing website and a dedicated **Host Management Studio (`admin.html`)** for real-time editing of branding, stats, leadership, institutions, news, events, and admissions.

---

## 📂 Project Structure

```text
campus-portal/
├── index.html           # Public Campus Portal (Hero, Stats, Institutions, Events, etc.)
├── admin.html           # Dedicated Host Portal (Live CMS & Admissions Inbox)
├── vercel.json          # Instant deployment configuration for Vercel
├── firebase.json        # Instant deployment configuration for Firebase Hosting
├── .firebaserc          # Firebase project definition
├── .gitignore           # Git ignore list
├── package.json         # Package configuration
├── css/
│   ├── style.css        # Main responsive campus styles (Emerald & Gold theme)
│   └── admin.css        # Host Management Studio layout & forms
└── js/
    ├── data.js          # Data layer & localStorage persistence
    ├── app.js           # Public portal renderer & interactive forms
    └── admin.js         # Host CMS logic & CRUD operations
```

---

## 1. 🐙 How to Save & Push to GitHub

1. Open your terminal or PowerShell in this folder:
   ```bash
   cd "C:\Users\User\.gemini\antigravity\scratch\campus-portal"
   ```
2. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Educational campus portal with Host CMS"
   ```
3. Create a new repository on [GitHub.com](https://github.com/new).
4. Link and push to GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## 2. ▲ How to Deploy to Vercel (Fastest & Free)

### Option A: Import from GitHub (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select your `campus-portal` repository.
3. Keep default settings (`Framework Preset: Other`) and click **Deploy**.
4. Your site will be live instantly with a free `.vercel.app` domain!
   - Public Site: `https://your-domain.vercel.app/`
   - Host Portal: `https://your-domain.vercel.app/host` or `https://your-domain.vercel.app/admin.html`

### Option B: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 3. 🔥 How to Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```
3. Set your Firebase project ID in `.firebaserc`:
   ```json
   {
     "projects": {
       "default": "your-actual-firebase-project-id"
     }
   }
   ```
4. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```
5. Your site is live at `https://your-actual-firebase-project-id.web.app`!

---

## 🔑 Host Portal Access
- **Host Link**: `/admin.html` (or `/host` on Vercel/Firebase)
- **Default PIN**: `admin123` (Can be updated in Host Studio -> Settings)
