# 🛡️ Deployment Guardian - Quick Reference Card

## Installation & Setup

```bash
# Clone repository
git clone https://github.com/ismaelloveexcel/GameDevelopmentHub.git
cd GameDevelopmentHub

# Install dependencies
npm ci

# Run deployment readiness check
npm run deploy:check
```

## Quick Commands

### Deployment Checks
```bash
# Full deployment validation
npm run deploy:check

# Complete validation (lint + test + deploy check)
npm run deploy:validate

# Individual checks
npm run lint              # ESLint
npm test                  # Jest tests
npx tsc --noEmit         # TypeScript
npm audit                # Security audit
```

### Build Commands
```bash
# Web build (local test)
npm run build:web

# Mobile builds (requires EAS setup)
npm run eas:build:android
npm run eas:build:ios
npm run eas:preview
```

### GitHub Actions
```bash
# Trigger workflows manually
gh workflow run deploy-web.yml
gh workflow run build-mobile.yml --field platform=android --field profile=production

# Monitor workflow status
gh run list
gh run view <run-id> --log
gh run watch
```

### Secrets Management
```bash
# Set secrets
gh secret set EXPO_TOKEN
gh secret set GH_TOKEN

# List secrets
gh secret list

# Remove secrets
gh secret remove EXPO_TOKEN
```

## Readiness Score Interpretation

| Score | Status | Action |
|-------|--------|--------|
| 9.0-10.0 | 🟢 **GREEN** | Deploy immediately |
| 7.5-8.9 | 🟡 **YELLOW** | Deploy with monitoring |
| 0-7.4 | 🔴 **RED** | Fix blockers first |

## Common Issues

### ❌ CI Failing
```bash
# Check locally
npm run lint
npm test
npx tsc --noEmit

# Fix and push
git add .
git commit -m "fix: CI issues"
git push
```

### 🔒 Security Vulnerabilities
```bash
# Automatic fix
npm audit fix

# Force fix (breaking changes)
npm audit fix --force
```

### 🌐 GitHub Pages 404
1. Go to Settings → Pages
2. Set Source to "GitHub Actions"
3. Trigger deploy: `gh workflow run deploy-web.yml`

### 📱 EAS Build Failing
```bash
# Reconfigure EAS
eas build:configure

# Check Expo config
npx expo-doctor

# Build with verbose
eas build --platform android --profile preview --verbose
```

## Deployment Workflow

### Web Deployment (Automatic)
```
1. Make changes
2. git push origin main
3. GitHub Actions builds & deploys
4. Check: https://ismaelloveexcel.github.io/GameDevelopmentHub/
```

### Mobile Deployment (Manual)
```
1. gh workflow run build-mobile.yml --field platform=android --field profile=production
2. Monitor: https://expo.dev/accounts/[user]/projects/[slug]/builds
3. Download APK/IPA
4. Test on device
```

## Pre-Deployment Checklist

```
✓ npm run deploy:check passes
✓ All tests passing
✓ No TypeScript errors
✓ Security vulnerabilities acceptable
✓ Documentation up to date
✓ Changes reviewed
✓ Secrets configured (if needed)
```

## GitHub Copilot Agent

```
@deployment-guardian check deployment status
@deployment-guardian fix failing CI
@deployment-guardian suggest improvements
@deployment-guardian validate configuration
```

## Key Files

- `.github/copilot-agents/deployment-guardian.md` - Agent definition
- `scripts/deployment-check.js` - Automated checker
- `docs/DEPLOYMENT_GUARDIAN_GUIDE.md` - Complete guide
- `.github/workflows/ci.yml` - CI checks
- `.github/workflows/deploy-web.yml` - Web deployment
- `.github/workflows/build-mobile.yml` - Mobile builds

## URLs

- **GitHub Actions**: `github.com/ismaelloveexcel/GameDevelopmentHub/actions`
- **GitHub Pages**: `ismaelloveexcel.github.io/GameDevelopmentHub/`
- **EAS Builds**: `expo.dev/accounts/[user]/projects/gameforge-mobile/builds`

## Support

- 📖 Docs: `/docs` folder
- 🐛 Issues: [GitHub Issues](https://github.com/ismaelloveexcel/GameDevelopmentHub/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/ismaelloveexcel/GameDevelopmentHub/discussions)

---

**Deployment Guardian v1.0** | Ready for your green light! 🚀
