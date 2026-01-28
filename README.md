# GameForge Mobile

[![CI](https://github.com/ismaelloveexcel/GameDevelopmentHub/actions/workflows/ci.yml/badge.svg)](https://github.com/ismaelloveexcel/GameDevelopmentHub/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-0.1.0-blue)

## Project Overview

GameForge Mobile is a React Native/Expo application for creating 2D games (Pixi.js), 3D games (Babylon.js), and VR/AR experiences (A-Frame). The platform provides game templates, an AI assistant ("Genie") for guidance, and configurable art styles. It targets iOS, Android, and Web deployment via Expo and EAS Build.

## What This Repo Is / Is Not

**What it is:**
- A cross-platform mobile game development toolkit built on React Native and Expo
- A template-based game creation system with multiple engine support
- A development environment for 2D, 3D, and VR/AR game prototyping

**What it is not:**
- A production-ready game engine (it wraps existing engines)
- A no-code visual editor (code knowledge is beneficial)
- A backend service or game server infrastructure

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native 0.72.6 with Expo SDK 49 |
| Language | TypeScript 5.1+ |
| 2D Engine | Pixi.js 7.x |
| 3D Engine | Babylon.js 6.x |
| VR/AR | A-Frame 1.5 |
| State | Zustand, React Query |
| Navigation | React Navigation 6.x |
| Build | EAS Build, Expo CLI |
| Testing | Jest, React Testing Library |
| Linting | ESLint with TypeScript plugin |

## Local Development Setup

**Prerequisites:**
- Node.js 20+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Expo CLI: `npm install -g expo-cli`
- For iOS: macOS with Xcode and iOS Simulator
- For Android: Android Studio with emulator or physical device

**Installation:**

```bash
git clone https://github.com/ismaelloveexcel/GameDevelopmentHub.git
cd GameDevelopmentHub
npm install
```

**Run Development Server:**

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS Simulator (macOS only)
npm run android    # Run on Android Emulator/Device
npm run web        # Run in web browser
```

## Scripts and Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run ios` | Run on iOS Simulator |
| `npm run android` | Run on Android |
| `npm run web` | Run on web browser |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run build:web` | Export web build to `web-build/` |
| `npm run eas:build:android` | Build Android APK via EAS |
| `npm run eas:build:ios` | Build iOS app via EAS |

## Repo Structure

```
GameDevelopmentHub/
├── src/
│   ├── __tests__/        # Test files
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (Theme, Genie)
│   ├── engines/          # Game engine wrappers (Pixi, Babylon, A-Frame)
│   ├── navigation/       # React Navigation setup
│   ├── screens/          # App screens
│   ├── services/         # Business logic (GenieService, TemplateLibrary)
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Static assets (images, fonts)
├── docs/                 # Documentation
├── landing-page/         # Marketing landing page (separate)
├── .github/workflows/    # CI/CD workflows
├── App.tsx               # Root component
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Roadmap

**Phase 1 - Foundation (Current)**
- Repository stabilization and governance
- CI/CD pipeline hardening
- Documentation improvements

**Phase 2 - Core Stability**
- Test coverage expansion
- Engine wrapper improvements
- Template system refinement

**Phase 3 - Feature Completion**
- Additional game templates
- Enhanced AI assistant capabilities
- Multi-platform export improvements

**Phase 4 - Production Readiness**
- Performance optimization
- Security hardening
- Release automation

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

Before contributing:
1. Read the contribution guidelines
2. Check existing issues and PRs
3. Follow the code style and commit conventions
4. Ensure tests pass locally

## License

MIT License. See [LICENSE](LICENSE) for full text.
