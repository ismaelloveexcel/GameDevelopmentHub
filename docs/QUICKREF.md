# GameForge Mobile - Quick Reference

## 🚀 Quick Start

```bash
npm install && npm start
```

## 📁 Key Files

| File/Folder | Purpose |
|-------------|---------|
| `src/engines/` | Pixi.js, Babylon.js, A-Frame implementations |
| `src/services/GenieService.ts` | AI assistant with 4 personalities |
| `src/services/TemplateLibrary.ts` | 15 game templates |
| `src/services/ArtStyleService.ts` | 5 art style systems |
| `src/services/MarketingService.ts` | Marketing & analytics |
| `src/services/ProjectService.ts` | Project CRUD |
| `src/services/AssetService.ts` | Asset management |
| `src/screens/` | All app screens |
| `docs/` | Complete documentation |

## 🎮 Using Templates

```typescript
import { templateLibrary } from '@/services/TemplateLibrary';

// Get template
const template = templateLibrary.getTemplateById('match3');

// Filter templates
const puzzles = templateLibrary.getTemplatesByCategory('puzzle');
const beginnerGames = templateLibrary.getTemplatesByDifficulty('beginner');
```

## 🤖 Using Genie AI

```typescript
import { useGenie } from '@/contexts/GenieContext';

function MyComponent() {
  const { setPersonality, sendMessage } = useGenie();
  
  // Switch personality
  setPersonality('creative'); // or 'technical', 'marketing', 'educator'
  
  // Ask question
  await sendMessage('How do I add physics?');
}
```

## 🎨 Applying Art Styles

```typescript
import { artStyleService } from '@/services/ArtStyleService';

// Get style
const style = artStyleService.getStyleById('pixel');

// Apply to engine
artStyleService.applyStyleToEngine('cyberpunk', engine);

// Get colors
const colors = artStyleService.getStyleColors('watercolor');
```

## 🎯 Creating Engines

```typescript
import { EngineFactory } from '@/engines/IGameEngine';

// Create 2D engine (Pixi.js)
const engine2D = await EngineFactory.createEngine('pixi');
await engine2D.initialize(container);

// Create 3D engine (Babylon.js)
const engine3D = await EngineFactory.createEngine('babylon');

// Create VR engine (A-Frame)
const engineVR = await EngineFactory.createEngine('aframe');
```

## 💾 Managing Projects

```typescript
import { projectService } from '@/services/ProjectService';

// Create project
const project = await projectService.createProject(
  'My Game',
  'An awesome game',
  'game',
  'pixi',
  'match3',
  'pixel'
);

// Get all projects
const projects = await projectService.getAllProjects();

// Update project
await projectService.updateProject(projectId, { name: 'New Name' });

// Delete project
await projectService.deleteProject(projectId);
```

## 📊 Marketing Tools

```typescript
import { marketingService } from '@/services/MarketingService';

// Create campaign
const campaign = marketingService.createCampaign(projectId, 'social');

// Generate content
const content = await marketingService.generatePromotionalContent(
  'My Game',
  'puzzle',
  ['match-3', 'power-ups']
);

// Get analytics
const analytics = marketingService.getAnalyticsDashboard(projectId);
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test helpers.test.ts
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm test` | Run tests |
| `npm run lint` | Lint code |

## 🎯 15 Game Templates

1. **Puzzle Match-3** - Pixi.js - Beginner
2. **Endless Runner** - Pixi.js - Beginner
3. **Tower Defense** - Pixi.js - Intermediate
4. **Platformer** - Pixi.js - Intermediate
5. **Racing Game** - Babylon.js - Advanced
6. **Quiz/Trivia** - Pixi.js - Beginner
7. **Card Game** - Pixi.js - Intermediate
8. **Idle Clicker** - Pixi.js - Beginner
9. **Rhythm Game** - Pixi.js - Intermediate
10. **VR Escape Room** - A-Frame - Advanced
11. **AR Treasure Hunt** - A-Frame - Advanced
12. **Virtual Museum** - A-Frame - Intermediate
13. **Physics Puzzle** - Babylon.js - Intermediate
14. **Shooting Gallery** - A-Frame - Intermediate
15. **Interactive Story** - Pixi.js - Beginner

## 🎨 5 Art Styles

1. **Pixel Perfect** - Retro pixel art
2. **Low Poly 3D** - Minimalist 3D
3. **Hand-Drawn** - Sketch/cartoon
4. **Neon Cyberpunk** - Futuristic neon
5. **Watercolor Dreams** - Soft artistic

## 🤖 4 AI Personalities

1. **Creative Mentor** 🎨 - Game design & storytelling
2. **Technical Expert** ⚙️ - Implementation & optimization
3. **Marketing Guru** 📈 - Promotion & monetization
4. **Educator** 📚 - Teaching & learning

## 🛠️ Utility Functions

```typescript
import {
  generateId,
  clamp,
  lerp,
  hexToRgb,
  rgbToHex,
  formatNumber,
  distance,
  angle,
  randomInt,
  shuffle,
  debounce,
  throttle
} from '@/utils/helpers';
```

## 📚 Documentation

- [Getting Started](docs/GETTING_STARTED.md)
- [Genie AI Guide](docs/GENIE_AI.md)
- [Templates](docs/TEMPLATES.md)
- [Art Styles](docs/ART_STYLES.md)
- [Marketing](docs/MARKETING.md)
- [VR Guide](docs/VR_GUIDE.md)
- [API Reference](docs/API.md)
- [Deployment](docs/DEPLOYMENT.md)

## 🎯 Common Tasks

### Create a new game from template
1. Open Templates screen
2. Select a template
3. Preview features
4. Click "Use Template"
5. Customize in editor

### Ask Genie for help
1. Open Genie screen
2. Select personality
3. Type your question
4. Get AI-powered guidance

### Apply an art style
1. Select project
2. Choose art style
3. Apply to engine
4. Customize colors

### Create marketing campaign
1. Open Marketing Dashboard
2. Create new campaign
3. Generate content
4. Schedule posts
5. Track analytics

## 🔧 Configuration

### Theme Colors
```typescript
const { theme } = useTheme();
theme.colors.primary    // #6366f1
theme.colors.secondary  // #8b5cf6
theme.colors.accent     // #ec4899
theme.colors.success    // #10b981
```

### Storage Keys
- Projects: `gameforge_projects`
- Settings: `gameforge_settings`

## 📦 Main Dependencies

- React Native: 0.72.6
- Expo: ~49.0.15
- TypeScript: 5.1.3
- Pixi.js: 7.3.2
- Babylon.js: 6.33.1
- A-Frame: 1.5.0

## 🐛 Troubleshooting

### Clear cache
```bash
expo start -c
```

### Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

### Reset project
```bash
watchman watch-del-all
rm -rf $TMPDIR/react-*
```

## 📞 Support

- 📧 Email: support@gameforge.mobile
- 💬 Discord: Join community
- 🐛 Issues: GitHub Issues
- 📖 Docs: Complete documentation

---

**Quick Tip:** Use Genie AI for instant help with any question!
