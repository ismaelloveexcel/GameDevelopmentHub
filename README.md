# GameForge Mobile 🎮✨

> AI-powered game creation platform - Create professional mobile games, VR experiences, and educational content with **zero coding required**.

## ⚠️ Important: Repository Organization

**This repository (GameDevelopmentHub)** serves as a documentation and project coordination hub. For active development and code contributions, please use the **[gameforge-mobile](https://github.com/ismaelloveexcel/gameforge-mobile)** repository.

📖 **See [REPOSITORY_STRUCTURE.md](REPOSITORY_STRUCTURE.md) for details on repository organization and where to submit your contributions.**

> **Note on [PR #27](https://github.com/ismaelloveexcel/GameDevelopmentHub/pull/27)**: The "Overall project understanding" PR (#27) contains GiftForge development code that should be submitted to the [gameforge-mobile](https://github.com/ismaelloveexcel/gameforge-mobile) repository instead. See [REPOSITORY_STRUCTURE.md](REPOSITORY_STRUCTURE.md) for more information.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-61DAFB.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)](https://www.typescriptlang.org/)
[![Deploy Web](https://github.com/ismaelloveexcel/GameDevelopmentHub/actions/workflows/deploy-web.yml/badge.svg)](https://github.com/ismaelloveexcel/GameDevelopmentHub/actions/workflows/deploy-web.yml)
[![Build Mobile](https://github.com/ismaelloveexcel/GameDevelopmentHub/actions/workflows/build-mobile.yml/badge.svg)](https://github.com/ismaelloveexcel/GameDevelopmentHub/actions/workflows/build-mobile.yml)
[![CI](https://github.com/ismaelloveexcel/GameDevelopmentHub/actions/workflows/ci.yml/badge.svg)](https://github.com/ismaelloveexcel/GameDevelopmentHub/actions/workflows/ci.yml)

## 🌟 Features

### Core Capabilities
- **🎨 15 Complete Game Templates** - Ready-to-use templates across all genres
- **🎯 AI Game Generator** - Create custom themed games for special occasions
- **🤖 Genie AI Assistant** - 4 specialized AI personalities to guide you
- **🎭 5 Signature Art Styles** - Professional visual themes for your games
- **🥽 VR/AR Support** - Create immersive experiences for Quest, PSVR, and WebXR
- **📊 Marketing Automation** - Built-in tools for promotion and analytics
- **🚀 Multi-Platform Export** - Deploy to iOS, Android, and Web

### Game Engines
- **Pixi.js** - High-performance 2D rendering
- **Babylon.js** - Advanced 3D graphics and physics
- **A-Frame** - VR/AR experiences with WebXR

### Genie AI Personalities
1. **Creative Mentor** 🎨 - Game design & storytelling guidance
2. **Technical Expert** ⚙️ - Implementation & optimization help
3. **Marketing Guru** 📈 - Promotion & monetization strategies
4. **Educator** 📚 - Teaching-focused content creation

### AI Game Generator 🎯

Create custom games tailored for specific occasions and situations! Perfect for:
- **Birthday Parties** - Fun, age-appropriate games
- **Weddings** - Romantic and entertaining experiences
- **Corporate Events** - Team building and training games
- **Education** - Learning-focused content
- **Holiday Celebrations** - Festive themed games
- **Special Occasions** - Any custom event or situation

Simply specify your theme, occasion, and requirements, and the AI will generate a complete game concept with:
- Appropriate game template selection
- Custom art style matching your theme
- Themed color palettes
- Difficulty tuning for your audience
- Name and description generation

### Game Templates

#### 2D Games (Pixi.js)
1. **Puzzle Match-3** - Classic gem-matching mechanics
2. **Endless Runner** - Side-scrolling action
3. **Tower Defense** - Strategic gameplay
4. **Platformer** - Jump and run adventure
5. **Quiz/Trivia** - Educational questions
6. **Card Game** - Deck building mechanics
7. **Idle Clicker** - Incremental progression
8. **Rhythm Game** - Music-based gameplay
9. **Interactive Story** - Choose-your-own-adventure

#### 3D Games (Babylon.js)
10. **Racing Game** - 3D tracks and vehicles
11. **Physics Puzzle** - Realistic physics challenges

#### VR/AR Games (A-Frame)
12. **VR Escape Room** - Immersive puzzle solving
13. **AR Treasure Hunt** - Location-based gameplay
14. **Virtual Museum** - Educational VR tours
15. **Shooting Gallery** - VR target practice

### Art Styles
1. **Pixel Perfect** 🕹️ - Retro pixel art
2. **Low Poly 3D** 🔷 - Minimalist 3D aesthetic
3. **Hand-Drawn** ✏️ - Sketch/cartoon style
4. **Neon Cyberpunk** 🌃 - Futuristic glowing effects
5. **Watercolor Dreams** 🎨 - Soft artistic rendering

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio

### Installation

```bash
# Clone the repository
git clone https://github.com/ismaelloveexcel/gameforge-mobile.git
cd gameforge-mobile

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS (Mac only)
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## 📖 Documentation

### Getting Started
- [Getting Started Guide](docs/GETTING_STARTED.md)
- [Template Documentation](docs/TEMPLATES.md)
- [Genie AI Guide](docs/GENIE_AI.md)
- [Art Styles Guide](docs/ART_STYLES.md)
- [Marketing Automation](docs/MARKETING.md)
- [VR Development](docs/VR_GUIDE.md)
- [API Reference](docs/API.md)

### Deployment Guides 🚀
- [**⚡ Fastest Deploy (2 min)**](docs/FASTEST_DEPLOY.md) - **Just 2 steps, zero accounts needed** ⭐ **RECOMMENDED!**
- [**GitHub Actions Automated Deployment**](docs/GITHUB_ACTIONS_DEPLOYMENT.md) - CI/CD with GitHub Actions
- [**Deployment Summary**](docs/DEPLOYMENT_SUMMARY.md) - Quick overview
- [**Free Deployment Recommendation**](docs/FREE_DEPLOYMENT_RECOMMENDATION.md) - Complete guide
- [**Quick Deploy Guide**](docs/QUICK_DEPLOY_GUIDE.md) - Deploy in under 2 minutes
- [**Platform Comparison**](docs/DEPLOYMENT_COMPARISON.md) - 8 platforms analyzed
- [Full Deployment Guide](docs/DEPLOYMENT.md) - All deployment options

## 🎯 Project Structure

```
gameforge-mobile/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (Theme, Genie)
│   ├── engines/          # Game engine implementations
│   │   ├── PixiEngine.ts      # Pixi.js 2D engine
│   │   ├── BabylonEngine.ts   # Babylon.js 3D engine
│   │   └── AFrameEngine.ts    # A-Frame VR/AR engine
│   ├── navigation/       # App navigation setup
│   ├── screens/          # App screens
│   ├── services/         # Business logic services
│   │   ├── GenieService.ts        # AI assistant
│   │   ├── TemplateLibrary.ts     # Game templates
│   │   ├── ArtStyleService.ts     # Art styles
│   │   └── MarketingService.ts    # Marketing tools
│   ├── styles/           # Shared styles
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, etc.
├── docs/                 # Documentation
├── App.tsx               # Root component
└── package.json          # Dependencies
```

## 🎮 Creating Your First Game

### Option 1: Generate a Themed Game (Fastest!)

```typescript
import { gameGeneratorService } from './services/GameGeneratorService';
import { projectService } from './services/ProjectService';
import { templateLibrary } from './services/TemplateLibrary';

// 1. Define your game criteria
const criteria = {
  theme: 'Ocean Adventure',
  occasion: 'Birthday Party',
  targetAudience: 'Children',
  difficulty: 'beginner',
};

// 2. Generate game configuration
const gameConfig = await gameGeneratorService.generateGame(criteria);

// 3. Get the selected template
const template = templateLibrary.getTemplateById(gameConfig.templateId);

// 4. Create project from generated config
const project = await projectService.createProject(
  gameConfig.name,
  gameConfig.description,
  'game',
  template.engine,
  gameConfig.templateId,
  gameConfig.artStyle
);

// Done! Your themed game is ready to customize
```

### Option 2: Start from Template

```typescript
import { templateLibrary } from './services/TemplateLibrary';
import { EngineFactory } from './engines/IGameEngine';

// 1. Select a template
const template = templateLibrary.getTemplateById('match3');

// 2. Create engine instance
const engine = await EngineFactory.createEngine('pixi');

// 3. Initialize engine
await engine.initialize(container);

// 4. Load template scene
await engine.loadScene(template.data.scenes[0]);

// 5. Start creating!
```

## 🤖 Using Genie AI

```typescript
import { useGenie } from './contexts/GenieContext';

function MyComponent() {
  const { personality, setPersonality, sendMessage } = useGenie();
  
  // Switch to Creative Mentor
  setPersonality('creative');
  
  // Ask for help
  await sendMessage('How do I create an engaging story?');
}
```

## 🎨 Applying Art Styles

```typescript
import { artStyleService } from './services/ArtStyleService';

// Get all available styles
const styles = artStyleService.getAllStyles();

// Apply a style to your game
artStyleService.applyStyleToEngine('pixel', engine);

// Get color palette
const colors = artStyleService.getStyleColors('cyberpunk');
```

## 📊 Marketing Tools

```typescript
import { marketingService } from './services/MarketingService';

// Create campaign
const campaign = marketingService.createCampaign(projectId, 'social');

// Generate promotional content
const content = await marketingService.generatePromotionalContent(
  'My Game',
  'puzzle',
  ['match-3', 'power-ups', 'leaderboards']
);

// Get analytics
const dashboard = marketingService.getAnalyticsDashboard(projectId);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint
```

## 🏗️ Building for Production

```bash
# Build for web
npm run build:web

# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

## 🚀 Deployment

### ⭐ Automated Deployment with GitHub Pages

GameForge Mobile is deployed using **GitHub Pages** - a free static site hosting service integrated directly into GitHub!

**What you get:**
- ✅ **Automatic web deployment** to GitHub Pages on every push to `main`
- ✅ **100% FREE** hosting for public repositories
- ✅ **Built-in GitHub integration** - no external services needed
- ✅ **Continuous integration** with linting and testing
- ✅ **Global CDN** for fast loading worldwide

**How it works:**
1. Push your changes to the `main` branch
2. GitHub Actions automatically builds the web app
3. The build is deployed to GitHub Pages
4. Your app is live at `https://ismaelloveexcel.github.io/GameDevelopmentHub/`

**Quick Setup:**
1. Go to your repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to `main` branch
4. Watch automated deployments at `https://github.com/ismaelloveexcel/GameDevelopmentHub/actions`

📖 **[Complete GitHub Actions Setup Guide](docs/GITHUB_ACTIONS_DEPLOYMENT.md)**

---

### Manual Deployment

For manual deployments or testing, the GitHub Actions workflow handles everything automatically. Simply:

**Quick Deploy:**
```bash
# Just push to main - deployment is automatic!
git push origin main

# For Android APK (Free with EAS)
eas build --platform android --profile production
```

**Why GitHub Pages?**
- ✅ 100% Free for public repositories
- ✅ Integrated with GitHub - no external accounts needed
- ✅ Automatic CI/CD from GitHub Actions
- ✅ Global CDN for fast loading
- ✅ Custom domain support
- ✅ HTTPS by default

**See detailed guides:**
- 🤖 [GitHub Actions Deployment](docs/GITHUB_ACTIONS_DEPLOYMENT.md) - Automated CI/CD setup
- 📘 [Free Deployment Recommendation](docs/FREE_DEPLOYMENT_RECOMMENDATION.md) - Complete platform comparison
- ⚡ [Quick Deploy Guide](docs/QUICK_DEPLOY_GUIDE.md) - Deploy in 10 minutes
- 📖 [Full Deployment Guide](docs/DEPLOYMENT.md) - All deployment options

### Alternative: GitHub Spark

This project also supports deployment on GitHub Spark. The `spark.yaml` configuration file is included in the repository root.

1. Navigate to your repository on GitHub
2. Access the Spark interface
3. GitHub Spark will automatically detect the configuration and deploy your app

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/)
- 2D rendering by [Pixi.js](https://pixijs.com/)
- 3D graphics by [Babylon.js](https://www.babylonjs.com/)
- VR/AR powered by [A-Frame](https://aframe.io/)

## 📞 Support

- 📧 Email: support@gameforge.mobile
- 💬 Discord: [Join our community](https://discord.gg/gameforge)
- 📖 Docs: [docs.gameforge.mobile](https://docs.gameforge.mobile)
- 🐛 Issues: [GitHub Issues](https://github.com/ismaelloveexcel/gameforge-mobile/issues)

---

**Made with ❤️ by the GameForge Team**

*Create games, not code.*
