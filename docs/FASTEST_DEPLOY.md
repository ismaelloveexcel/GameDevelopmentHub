# 🚀 Fastest Way to Deploy GameForge Mobile

**Time to deploy: ~2 minutes | Manual steps: 2**

> **Note for forks:** Replace `ismaelloveexcel/GameDevelopmentHub` with your own `username/repo` in all URLs below.

---

## TL;DR - Just Do This

### Step 1: Enable GitHub Pages (1 click)

1. Go to https://github.com/ismaelloveexcel/GameDevelopmentHub/settings/pages
2. Under "Build and deployment" → Set **Source** to **"GitHub Actions"**
3. Click **Save**

### Step 2: Trigger Deployment

```bash
git push origin main
```

Or click **"Run workflow"** at: https://github.com/ismaelloveexcel/GameDevelopmentHub/actions/workflows/deploy-web.yml

---

## ✅ That's It!

Your app will be live at:
```
https://ismaelloveexcel.github.io/GameDevelopmentHub/
```

---

## Why This is the Easiest Method

| Factor | GitHub Pages | Vercel | Netlify |
|--------|-------------|--------|---------|
| **External accounts** | ❌ None | ✅ Required | ✅ Required |
| **Secrets/Tokens** | ❌ None | ✅ 3 required | ✅ 1 required |
| **Setup steps** | 2 | 5+ | 4+ |
| **Cost** | $0 | $0 | $0 |
| **Already configured** | ✅ Yes | ❌ No | ❌ No |

---

## What's Already Set Up For You

The repository includes pre-configured GitHub Actions workflows:

### 1. `deploy-web.yml` - Web Deployment
- **Triggers**: Push to `main` branch
- **Action**: Builds and deploys landing page to GitHub Pages
- **Result**: Live website

### 2. `ci.yml` - Continuous Integration
- **Triggers**: Push to `main`/`develop`, Pull requests
- **Action**: Runs ESLint, Jest tests, TypeScript checks
- **Result**: Quality gates on all changes

### 3. `build-mobile.yml` - Mobile Builds (Optional)
- **Triggers**: Manual workflow dispatch only
- **Action**: Builds Android/iOS with EAS
- **Requires**: `EXPO_TOKEN` secret (for mobile builds only)

---

## Deployment Flow

```
You push to main
       ↓
GitHub Actions triggered
       ↓
   ┌───┴───┐
   ↓       ↓
CI runs   Web builds
(lint,    (landing-page/)
 test)         ↓
   ↓      Upload artifact
Pass/Fail      ↓
          Deploy to GitHub Pages
               ↓
          🎉 Live at ismaelloveexcel.github.io/GameDevelopmentHub/
```

---

## Need Mobile Builds? (Optional)

For Android/iOS app builds, add the `EXPO_TOKEN` secret:

1. Create account at [expo.dev](https://expo.dev)
2. Get access token from Expo dashboard
3. Add secret at: https://github.com/ismaelloveexcel/GameDevelopmentHub/settings/secrets/actions
   - Name: `EXPO_TOKEN`
   - Value: Your Expo access token

Then trigger mobile build via GitHub UI:
1. Go to Actions tab → "Build Mobile App with EAS" workflow
2. Click "Run workflow"
3. Select platform (android/ios) and profile (production)
4. Click "Run workflow"

---

## Monitoring Deployments

- **Actions tab**: https://github.com/ismaelloveexcel/GameDevelopmentHub/actions
- **Live site**: https://ismaelloveexcel.github.io/GameDevelopmentHub/
- **Deployment history**: Actions → deploy-web.yml runs

---

## Troubleshooting

### Deployment failed?

1. Check if GitHub Pages is enabled:
   - Settings → Pages → Source must be "GitHub Actions"

2. View error logs:
   - Actions tab → Click failed run → View logs

### Changes not showing?

1. Confirm push reached `main`:
   ```bash
   git log --oneline -1
   ```

2. Check workflow status in Actions tab

3. Hard refresh browser: `Ctrl+Shift+R` / `Cmd+Shift+R`

---

## Summary

| What | How |
|------|-----|
| **Enable deployment** | Settings → Pages → Source = "GitHub Actions" |
| **Deploy** | `git push origin main` |
| **View site** | `ismaelloveexcel.github.io/GameDevelopmentHub/` |
| **Monitor** | Actions tab |

**Zero external services. Zero secrets. Zero cost.**

---

*Last updated: January 2026*
