# 🛡️ Deployment Guardian Guide

## Overview

The **Deployment Guardian** is a specialized GitHub Copilot agent designed to help you achieve 100% deployment readiness for the GameDevelopmentHub repository. It provides automated checks, structured reports, and actionable recommendations to ensure smooth deployments to GitHub Pages and EAS (Expo Application Services).

## Quick Start

### Automated Deployment Check

Run the comprehensive deployment readiness check:

```bash
node scripts/deployment-check.js
```

This script will automatically:
- ✅ Verify repository structure
- ✅ Validate GitHub Actions workflows
- ✅ Check dependencies and security
- ✅ Run code quality checks (lint, TypeScript, tests)
- ✅ Validate configuration files
- ✅ Check documentation completeness

### Understanding the Results

The Deployment Guardian provides a **readiness score** from 0-10:

| Score | Status | Meaning |
|-------|--------|---------|
| 9.0-10.0 | 🟢 GREEN | Ready for production deployment |
| 7.5-8.9 | 🟡 YELLOW | Minor issues, safe to deploy with monitoring |
| 0-7.4 | 🔴 RED | Blockers present, fix before deploying |

## Deployment Checklist

Use this checklist before every deployment:

### Pre-Deployment Validation

- [ ] **Code Quality**
  - [ ] All tests passing (`npm test`)
  - [ ] No TypeScript errors (`npx tsc --noEmit`)
  - [ ] Linting warnings acceptable (`npm run lint`)
  
- [ ] **Security**
  - [ ] No critical vulnerabilities (`npm audit`)
  - [ ] All secrets properly configured in GitHub
  - [ ] No hardcoded credentials in code
  
- [ ] **Configuration**
  - [ ] `app.json` properly configured
  - [ ] `eas.json` has correct build profiles
  - [ ] GitHub Actions workflows validated
  
- [ ] **Documentation**
  - [ ] README.md up to date
  - [ ] Deployment guides current
  - [ ] API documentation complete

### GitHub Pages Deployment

- [ ] **Setup** (One-time)
  - [ ] GitHub Pages enabled in repository settings
  - [ ] Source set to "GitHub Actions"
  - [ ] Custom domain configured (optional)
  
- [ ] **Pre-Deploy**
  - [ ] Web build works locally (`npm run build:web`)
  - [ ] All CI checks passing
  - [ ] Changes reviewed and approved
  
- [ ] **Deploy**
  - [ ] Push to `main` branch or trigger workflow manually
  - [ ] Monitor workflow at `github.com/{owner}/{repo}/actions`
  - [ ] Verify deployment at GitHub Pages URL
  
- [ ] **Post-Deploy**
  - [ ] Test deployed application
  - [ ] Check all routes/pages work
  - [ ] Verify assets load correctly

### EAS Mobile Build

- [ ] **Setup** (One-time)
  - [ ] Expo account created
  - [ ] `EXPO_TOKEN` secret added to GitHub
  - [ ] EAS CLI installed (`npm install -g eas-cli`)
  - [ ] Signed in to EAS (`eas login`)
  
- [ ] **Pre-Build**
  - [ ] Build profile selected (development/preview/production)
  - [ ] Platform selected (iOS/Android/both)
  - [ ] App configuration validated
  
- [ ] **Build**
  - [ ] Trigger build via GitHub Actions or EAS CLI
  - [ ] Monitor build progress in EAS dashboard
  - [ ] Download built app when complete
  
- [ ] **Post-Build**
  - [ ] Test APK/IPA on device
  - [ ] Verify all features work
  - [ ] Check performance on low-end devices

## Common Issues & Fixes

### Issue: CI Workflow Failing

**Symptoms:**
- Red X on GitHub Actions
- Tests failing
- Lint errors

**Fix:**
```bash
# Run checks locally
npm run lint
npm test
npx tsc --noEmit

# Fix issues and commit
git add .
git commit -m "fix: resolve CI failures"
git push
```

### Issue: Security Vulnerabilities

**Symptoms:**
- npm audit shows vulnerabilities
- Deployment Guardian reports security issues

**Fix:**
```bash
# Attempt automatic fix
npm audit fix

# For breaking changes (use with caution)
npm audit fix --force

# Review and commit
git add package*.json
git commit -m "security: update dependencies"
git push
```

### Issue: GitHub Pages Not Deploying

**Symptoms:**
- Workflow succeeds but site not updated
- 404 error on GitHub Pages URL

**Fix:**
1. Verify GitHub Pages is enabled:
   - Go to `Settings → Pages`
   - Set Source to "GitHub Actions"
   
2. Check workflow permissions:
   - Go to `Settings → Actions → General`
   - Enable "Read and write permissions"
   
3. Trigger manual deployment:
   ```bash
   gh workflow run deploy-web.yml
   ```

### Issue: EAS Build Failing

**Symptoms:**
- EAS build fails
- Missing dependencies or configuration

**Fix:**
```bash
# Verify EAS configuration
eas build:configure

# Check Expo configuration
npx expo-doctor

# Trigger build with verbose logging
eas build --platform android --profile preview --verbose
```

### Issue: Missing Secrets

**Symptoms:**
- Workflow fails with "secret not found"
- EAS authentication fails

**Fix:**
```bash
# Add secret via GitHub CLI
gh secret set EXPO_TOKEN --repo owner/repo

# Or via GitHub UI:
# Settings → Secrets and variables → Actions → New repository secret
```

## Advanced Features

### Custom Deployment Checks

Add your own checks to the deployment script:

```javascript
// scripts/deployment-check.js

async checkCustomLogic() {
  this.section('🎮 Game Engine Validation');
  
  // Your custom checks here
  const engineFiles = ['PixiEngine.ts', 'BabylonEngine.ts', 'AFrameEngine.ts'];
  
  for (const file of engineFiles) {
    if (fs.existsSync(`src/engines/${file}`)) {
      this.check(`Engine: ${file}`, 'pass');
    } else {
      this.check(`Engine: ${file}`, 'fail', 'Missing engine');
    }
  }
}
```

### Automated PR Deployments

Create preview deployments for pull requests:

```yaml
# .github/workflows/preview-deploy.yml
name: Preview Deployment

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build:web
      - name: Deploy to Surge
        run: |
          npm install -g surge
          surge ./web-build gamedev-hub-pr-${{ github.event.number }}.surge.sh
```

### Performance Monitoring

Add performance checks to deployment:

```javascript
async checkPerformance() {
  this.section('⚡ Performance');
  
  const buildSize = this.getBuildSize('web-build');
  
  if (buildSize < 5 * 1024 * 1024) { // 5MB
    this.check('Build size', 'pass', `${(buildSize / 1024 / 1024).toFixed(2)}MB`);
  } else {
    this.check('Build size', 'warn', `${(buildSize / 1024 / 1024).toFixed(2)}MB (optimize)`);
    this.addIssue('medium', 'Large build size', 
      'Build is larger than 5MB', 
      `Current size: ${(buildSize / 1024 / 1024).toFixed(2)}MB`,
      'Optimize assets and enable code splitting'
    );
  }
}
```

## Integration with GitHub Copilot

### Using the Deployment Guardian Agent

The Deployment Guardian is available as a GitHub Copilot agent:

```
@deployment-guardian check deployment status
@deployment-guardian suggest improvements
@deployment-guardian fix failing CI
```

### Agent Capabilities

The Deployment Guardian can:

1. **Analyze** - Review current deployment status
2. **Diagnose** - Identify issues and blockers
3. **Suggest** - Provide exact fixes and commands
4. **Validate** - Confirm readiness before deployment
5. **Guide** - Walk through deployment process

### Example Interactions

**Check overall status:**
```
@deployment-guardian run full deploy check
```

**Response:**
- 📊 Readiness score: 8.5/10 (YELLOW)
- ⚠️ 18 npm vulnerabilities detected
- ✅ All tests passing
- ✅ Workflows configured correctly
- 💡 Suggested fixes: Run `npm audit fix`

**Fix specific issue:**
```
@deployment-guardian fix failing CI
```

**Response:**
- 🔍 Analyzing CI logs...
- ❌ ESLint warnings causing failure
- 📝 Suggested fix:
  ```yaml
  # In .github/workflows/ci.yml
  - name: Run ESLint
    run: npm run lint || true  # Allow warnings
  ```

## Best Practices

### 1. Run Checks Before Every Commit

Add pre-commit hook:

```bash
# .husky/pre-commit
#!/bin/sh
npm run lint
npm test
```

### 2. Automated Deployment Schedule

For production releases:
- Deploy to staging first
- Run full test suite
- Manual QA check
- Deploy to production
- Monitor for 24 hours

### 3. Rollback Strategy

Always maintain ability to rollback:

```bash
# Revert last deployment
git revert HEAD
git push origin main

# Or redeploy previous version
git push origin <previous-commit-sha>:main
```

### 4. Monitoring After Deployment

Check these metrics post-deployment:
- ✅ Application loads successfully
- ✅ No console errors
- ✅ All routes accessible
- ✅ API calls working
- ✅ No significant performance regression

### 5. Security Hygiene

- ✅ Review all dependencies regularly
- ✅ Keep secrets in GitHub Secrets, never in code
- ✅ Run security audits before each deployment
- ✅ Enable Dependabot for automatic updates
- ✅ Use environment-specific configurations

## Quick Reference Commands

```bash
# Run deployment check
node scripts/deployment-check.js

# Build and test locally
npm ci
npm run lint
npm test
npm run build:web

# Deploy web (automatic on push to main)
git push origin main

# Manual web deployment
gh workflow run deploy-web.yml

# Build mobile app
gh workflow run build-mobile.yml \
  --field platform=android \
  --field profile=production

# Check workflow status
gh run list --workflow=ci.yml
gh run view <run-id> --log

# Update secrets
gh secret set EXPO_TOKEN

# View deployment
# Web: https://<username>.github.io/<repo>/
# EAS: https://expo.dev/accounts/<username>/projects/<slug>/builds
```

## Troubleshooting

### Deployment Check Script Fails

```bash
# Ensure dependencies installed
npm ci

# Run with debug output
node scripts/deployment-check.js 2>&1 | tee deploy-check.log
```

### GitHub Actions Timeout

```yaml
# Increase timeout in workflow
jobs:
  deploy:
    timeout-minutes: 30  # Default is 360
```

### Build Artifacts Too Large

```bash
# Analyze bundle size
npm install -g source-map-explorer
npm run build:web
source-map-explorer web-build/**/*.js
```

## Getting Help

### Resources

- **Documentation**: All guides in `/docs` folder
- **Workflow Logs**: GitHub Actions tab
- **Community**: GitHub Discussions
- **Support**: Create an issue

### Contact

- 📧 Email: support@gameforge.mobile
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/ismaelloveexcel/GameDevelopmentHub/issues)

---

## Summary

The Deployment Guardian helps you:
- ✅ Achieve 100% deployment readiness
- ✅ Identify and fix issues proactively
- ✅ Automate quality checks
- ✅ Deploy with confidence
- ✅ Monitor and maintain deployments

**Ready for your green light!** 🚀

---

*Last Updated: January 2026*
*Deployment Guardian v1.0*
