# GameForge Mobile - Automated Deployment Workflow

## 📊 Visual Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPER WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

                              ┌──────────┐
                              │ Developer │
                              │ Commits  │
                              └─────┬────┘
                                    │
                        ┌───────────┼───────────┐
                        │           │           │
                   ┌────▼────┐ ┌───▼────┐ ┌───▼────┐
                   │  Main   │ │Develop │ │   PR   │
                   │ Branch  │ │ Branch │ │ Branch │
                   └────┬────┘ └────┬───┘ └───┬────┘
                        │           │          │
                        │           │          │
┌───────────────────────┼───────────┼──────────┼──────────────────┐
│                       │  GITHUB   │ ACTIONS  │                  │
│                       │           │          │                  │
│                  ┌────▼───────────▼──────────▼────┐             │
│                  │    Trigger Workflows            │             │
│                  └─────────────┬───────────────────┘             │
│                                │                                 │
│                  ┌─────────────┼─────────────┐                  │
│                  │             │             │                  │
│         ┌────────▼────┐  ┌────▼────┐  ┌────▼────┐              │
│         │   CI Check  │  │   Web   │  │ Mobile  │              │
│         │   (ci.yml)  │  │ Deploy  │  │  Build  │              │
│         │             │  │(deploy  │  │(build-  │              │
│         │ • Lint      │  │-web.yml)│  │mobile.  │              │
│         │ • Test      │  │         │  │yml)     │              │
│         │ • TypeCheck │  │         │  │         │              │
│         └─────┬───────┘  └────┬────┘  └────┬────┘              │
│               │               │             │                  │
│         ┌─────▼───────┐  ┌────▼────┐  ┌────▼────┐              │
│         │   Status    │  │  Build  │  │  Setup  │              │
│         │   Report    │  │   Web   │  │  Expo   │              │
│         └─────────────┘  │   App   │  │   EAS   │              │
│                          └────┬────┘  └────┬────┘              │
│                               │            │                  │
│                          ┌────▼────┐  ┌────▼────┐              │
│                          │ Deploy  │  │  Build  │              │
│                          │   to    │  │ Android │              │
│                          │ GitHub  │  │   iOS   │              │
│                          │  Pages  │  │         │              │
│                          └────┬────┘  └────┬────┘              │
│                               │            │                  │
└───────────────────────────────┼────────────┼───────────────────┘
                                │            │
                                │            │
┌───────────────────────────────┼────────────┼───────────────────┐
│                    DEPLOYMENT TARGETS                           │
│                               │            │                  │
│                      ┌────────▼────┐  ┌────▼─────┐             │
│                      │   GitHub    │  │   EAS    │             │
│                      │   Pages     │  │ (Mobile) │             │
│                      │  (Web App)  │  │          │             │
│                      └─────┬───────┘  └────┬─────┘             │
│                            │               │                  │
│                      ┌─────▼────────┐ ┌────▼──────┐            │
│                      │ Production   │ │ Download  │            │
│                      │     URL      │ │  APK/IPA  │            │
│                      │ismaelloveexcel│ │          │            │
│                      │.github.io/   │ │           │            │
│                      │GameDevHub    │ │           │            │
│                      └──────────────┘ └───────────┘            │
└─────────────────────────────────────────────────────────────────┘

                              ┌──────────┐
                              │   Users  │
                              │  Access  │
                              │   Apps   │
                              └──────────┘
```

## 🔄 Workflow Triggers

### Automatic Triggers

| Event | Branch | Workflow | Result |
|-------|--------|----------|--------|
| Push | main | CI, Web Deploy | Production deployment |
| Push | develop | CI | Quality check only |
| PR | any → main | CI, Web Preview | Preview + checks |
| Push | main (mobile files) | Mobile Build | EAS build triggered |

### Manual Triggers

| Workflow | Inputs | Purpose |
|----------|--------|---------|
| Mobile Build | platform, profile | On-demand builds |

## ⚙️ Workflow Details

### 1. CI Check Workflow (ci.yml)

```
┌──────────────────────┐
│ Checkout Code        │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ Setup Node.js 20     │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ Install Dependencies │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼────┐ ┌───▼────┐
│  Lint   │ │  Test  │
└────┬────┘ └───┬────┘
     │          │
┌────▼──────────▼────┐
│ TypeScript Check   │
└─────────┬──────────┘
          │
    ┌─────▼─────┐
    │ ✓ Success │
    │ ✗ Failure │
    └───────────┘
```

### 2. Web Deploy Workflow (deploy-web.yml)

```
┌──────────────────────┐
│ Checkout Code        │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ Setup Node.js 20     │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ Install Dependencies │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ Build Web App        │
│ (npm run build:web)  │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼────┐ ┌───▼────────┐
│Production│ │  Preview   │
│ Deploy  │ │   Deploy   │
│(on push)│ │   (on PR)  │
└────┬────┘ └───┬────────┘
     │          │
┌────▼──────────▼────────┐
│  Deploy to Vercel      │
└─────────┬──────────────┘
          │
    ┌─────▼─────────────┐
    │ Live at vercel.app│
    └───────────────────┘
```

### 3. Mobile Build Workflow (build-mobile.yml)

```
┌──────────────────────┐
│ Checkout Code        │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ Setup Node.js + Expo │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ Install Dependencies │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼────┐ ┌───▼────┐
│ Android │ │  iOS   │
│  Build  │ │  Build │
└────┬────┘ └───┬────┘
     │          │
┌────▼──────────▼────┐
│  EAS Build Cloud   │
└─────────┬──────────┘
          │
    ┌─────▼─────┐
    │ Download  │
    │ APK/IPA   │
    └───────────┘
```

## 🔐 Secrets Flow

```
┌─────────────────────────┐
│ GitHub Repository       │
│ Settings → Secrets      │
│                         │
│ • EXPO_TOKEN (optional) │
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│ GitHub Actions          │
│ Workflow Execution      │
└──────────┬──────────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼────┐ ┌───▼────┐
│ GitHub  │ │  Expo  │
│  Pages  │ │  API   │
└────┬────┘ └───┬────┘
     │          │
┌────▼──────────▼────┐
│ Authenticate &     │
│ Deploy Resources   │
└────────────────────┘
```

## 📈 Success Metrics

### Workflow Status Indicators

| Badge | Status | Meaning |
|-------|--------|---------|
| ![Passing](https://img.shields.io/badge/build-passing-brightgreen) | Passing | All checks successful |
| ![Failing](https://img.shields.io/badge/build-failing-red) | Failing | One or more checks failed |
| ![Pending](https://img.shields.io/badge/build-pending-yellow) | Pending | Workflow in progress |

### Expected Execution Times

| Workflow | Typical Duration |
|----------|------------------|
| CI Check | 2-5 minutes |
| Web Deploy | 3-7 minutes |
| Mobile Build | 10-20 minutes |

## 🚀 Deployment Pipeline

```
Developer Commits
        ↓
    Git Push
        ↓
GitHub Detects Change
        ↓
Trigger Workflows
        ↓
    ┌───┴───┐
    ↓       ↓
   CI    Deploy
    ↓       ↓
 Pass?   Build
    ↓       ↓
   Yes   Success
    ↓       ↓
  Merge  Live!
```

## 📊 Cost Optimization

```
GitHub Actions
(Free for public repos)
        │
        ├─→ GitHub Pages
        │   (Free tier: 100GB bandwidth)
        │
        └─→ Expo EAS
            (Free tier: Slower builds)

Total Cost: $0/month
```

## 🎯 Quality Gates

```
Pull Request Created
        ↓
    CI Checks
        ↓
    ┌───┴───┐
    ↓       ↓
  Lint    Test
    ↓       ↓
  Pass    Pass
    ↓       ↓
    └───┬───┘
        ↓
  TypeScript
        ↓
      Pass
        ↓
  All Green ✓
        ↓
Ready to Merge
```

---

**Quick Reference:**
- View workflows: `github.com/ismaelloveexcel/GameDevelopmentHub/actions`
- Web app: `ismaelloveexcel.github.io/GameDevelopmentHub/`
- Documentation: `docs/GITHUB_ACTIONS_DEPLOYMENT.md`

**Status:** ✅ All workflows operational
