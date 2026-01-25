import { GameTemplate } from '../types';

/**
 * Game Templates Library
 * Contains 15 complete game templates across different genres
 */

// Template 1: Puzzle Match-3
const match3Template: GameTemplate = {
  id: 'match3',
  name: 'Puzzle Match-3',
  description: 'Classic match-three puzzle mechanics with cascading gems',
  category: 'puzzle',
  thumbnail: 'assets/templates/match3.png',
  difficulty: 'beginner',
  features: ['Grid-based gameplay', 'Match detection', 'Score system', 'Power-ups'],
  engine: 'pixi',
  data: {
    scenes: [{
      id: 'game',
      name: 'Game Scene',
      type: '2d',
      objects: [],
      background: '#4a1c40',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 720, height: 1280 },
      orientation: 'portrait',
    },
  },
  documentation: 'Create engaging match-3 puzzle games with gem matching, combos, and special effects.',
};

// Template 2: Endless Runner
const endlessRunnerTemplate: GameTemplate = {
  id: 'runner',
  name: 'Endless Runner',
  description: 'Side-scrolling endless runner with obstacles and collectibles',
  category: 'action',
  thumbnail: 'assets/templates/runner.png',
  difficulty: 'beginner',
  features: ['Auto-scrolling', 'Jump mechanics', 'Obstacle generation', 'Score tracking'],
  engine: 'pixi',
  data: {
    scenes: [{
      id: 'game',
      name: 'Game Scene',
      type: '2d',
      objects: [],
      background: '#87CEEB',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 1280, height: 720 },
      orientation: 'landscape',
      physics: { enabled: true, gravity: { x: 0, y: 9.81, z: 0 }, engine: 'matter' },
    },
  },
  documentation: 'Build addictive endless runner games with smooth controls and procedural generation.',
};

// Template 3: Tower Defense
const towerDefenseTemplate: GameTemplate = {
  id: 'tower-defense',
  name: 'Tower Defense',
  description: 'Strategic tower defense with path-following enemies',
  category: 'strategy',
  thumbnail: 'assets/templates/tower-defense.png',
  difficulty: 'intermediate',
  features: ['Tower placement', 'Enemy pathfinding', 'Upgrade system', 'Wave management'],
  engine: 'pixi',
  data: {
    scenes: [{
      id: 'game',
      name: 'Game Scene',
      type: '2d',
      objects: [],
      background: '#2d5016',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 1280, height: 720 },
      orientation: 'landscape',
    },
  },
  documentation: 'Create strategic tower defense games with multiple tower types and enemy waves.',
};

// Template 4: Platformer
const platformerTemplate: GameTemplate = {
  id: 'platformer',
  name: 'Platformer',
  description: '2D platforming adventure with physics and collectibles',
  category: 'action',
  thumbnail: 'assets/templates/platformer.png',
  difficulty: 'intermediate',
  features: ['Player movement', 'Platform physics', 'Collectibles', 'Level design'],
  engine: 'pixi',
  data: {
    scenes: [{
      id: 'level1',
      name: 'Level 1',
      type: '2d',
      objects: [],
      background: '#5b6ee1',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 1280, height: 720 },
      orientation: 'landscape',
      physics: { enabled: true, gravity: { x: 0, y: 9.81, z: 0 }, engine: 'matter' },
    },
  },
  documentation: 'Design classic platformer games with precise physics and level progression.',
};

// Template 5: Racing Game
const racingTemplate: GameTemplate = {
  id: 'racing',
  name: 'Racing Game',
  description: '3D racing game with tracks and vehicles',
  category: 'racing',
  thumbnail: 'assets/templates/racing.png',
  difficulty: 'advanced',
  features: ['3D graphics', 'Vehicle physics', 'Track design', 'Lap timing'],
  engine: 'babylon',
  data: {
    scenes: [{
      id: 'race',
      name: 'Race Track',
      type: '3d',
      objects: [],
      background: '#87CEEB',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 1280, height: 720 },
      orientation: 'landscape',
      physics: { enabled: true, gravity: { x: 0, y: -9.81, z: 0 }, engine: 'cannon' },
    },
  },
  documentation: 'Build exciting 3D racing games with realistic physics and multiple tracks.',
};

// Template 6: Quiz/Trivia
const quizTemplate: GameTemplate = {
  id: 'quiz',
  name: 'Quiz/Trivia',
  description: 'Educational quiz format with multiple choice questions',
  category: 'educational',
  thumbnail: 'assets/templates/quiz.png',
  difficulty: 'beginner',
  features: ['Question system', 'Multiple choice', 'Score tracking', 'Timer'],
  engine: 'pixi',
  data: {
    scenes: [{
      id: 'quiz',
      name: 'Quiz Scene',
      type: '2d',
      objects: [],
      background: '#6366f1',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 720, height: 1280 },
      orientation: 'portrait',
    },
  },
  documentation: 'Create engaging educational quiz games with customizable questions.',
};

// Template 7: Card Game
const cardGameTemplate: GameTemplate = {
  id: 'card-game',
  name: 'Card Game',
  description: 'Collectible card game with deck building mechanics',
  category: 'strategy',
  thumbnail: 'assets/templates/card-game.png',
  difficulty: 'intermediate',
  features: ['Card system', 'Deck building', 'Turn-based combat', 'Card effects'],
  engine: 'pixi',
  data: {
    scenes: [{
      id: 'game',
      name: 'Game Board',
      type: '2d',
      objects: [],
      background: '#1a472a',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 1280, height: 720 },
      orientation: 'landscape',
    },
  },
  documentation: 'Design strategic card games with deck building and card effects.',
};

// Template 8: Idle Clicker
const idleClickerTemplate: GameTemplate = {
  id: 'idle-clicker',
  name: 'Idle Clicker',
  description: 'Incremental game with passive income and upgrades',
  category: 'idle',
  thumbnail: 'assets/templates/idle-clicker.png',
  difficulty: 'beginner',
  features: ['Click mechanics', 'Passive income', 'Upgrade system', 'Progression'],
  engine: 'pixi',
  data: {
    scenes: [{
      id: 'game',
      name: 'Game Scene',
      type: '2d',
      objects: [],
      background: '#2d3748',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 720, height: 1280 },
      orientation: 'portrait',
    },
  },
  documentation: 'Build addictive idle games with progression and automation systems.',
};

// Template 9: Rhythm Game
const rhythmTemplate: GameTemplate = {
  id: 'rhythm',
  name: 'Rhythm Game',
  description: 'Music-based gameplay with beat synchronization',
  category: 'rhythm',
  thumbnail: 'assets/templates/rhythm.png',
  difficulty: 'intermediate',
  features: ['Beat detection', 'Note timing', 'Combo system', 'Music sync'],
  engine: 'pixi',
  data: {
    scenes: [{
      id: 'game',
      name: 'Game Scene',
      type: '2d',
      objects: [],
      background: '#0f172a',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 1280, height: 720 },
      orientation: 'landscape',
      audio: { masterVolume: 1, musicVolume: 0.8, sfxVolume: 0.6 },
    },
  },
  documentation: 'Create music rhythm games with precise timing and combo mechanics.',
};

// Template 10: VR Escape Room
const vrEscapeRoomTemplate: GameTemplate = {
  id: 'vr-escape-room',
  name: 'VR Escape Room',
  description: 'Immersive VR puzzle-solving escape room experience',
  category: 'vr',
  thumbnail: 'assets/templates/vr-escape-room.png',
  difficulty: 'advanced',
  features: ['VR interactions', 'Puzzle mechanics', 'Object manipulation', 'Room design'],
  engine: 'aframe',
  data: {
    scenes: [{
      id: 'room',
      name: 'Escape Room',
      type: 'vr',
      objects: [],
      background: '#000000',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 2560, height: 1440 },
      orientation: 'landscape',
    },
  },
  documentation: 'Design immersive VR escape rooms with interactive puzzles and clues.',
};

// Template 11: AR Treasure Hunt
const arTreasureHuntTemplate: GameTemplate = {
  id: 'ar-treasure-hunt',
  name: 'AR Treasure Hunt',
  description: 'Location-based AR treasure hunting game',
  category: 'ar',
  thumbnail: 'assets/templates/ar-treasure-hunt.png',
  difficulty: 'advanced',
  features: ['AR placement', 'Location tracking', 'Collection system', 'Map integration'],
  engine: 'aframe',
  data: {
    scenes: [{
      id: 'ar',
      name: 'AR Scene',
      type: 'vr',
      objects: [],
      background: 'transparent',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 1280, height: 720 },
      orientation: 'portrait',
    },
  },
  documentation: 'Create location-based AR games with treasure hunting mechanics.',
};

// Template 12: Virtual Museum
const virtualMuseumTemplate: GameTemplate = {
  id: 'virtual-museum',
  name: 'Virtual Museum',
  description: 'Educational VR museum experience with exhibits',
  category: 'educational',
  thumbnail: 'assets/templates/virtual-museum.png',
  difficulty: 'intermediate',
  features: ['VR navigation', 'Information displays', 'Exhibit viewing', 'Audio guides'],
  engine: 'aframe',
  data: {
    scenes: [{
      id: 'museum',
      name: 'Museum Hall',
      type: 'vr',
      objects: [],
      background: '#f5f5f5',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 2560, height: 1440 },
      orientation: 'landscape',
    },
  },
  documentation: 'Build educational virtual museums with interactive exhibits.',
};

// Template 13: Physics Puzzle
const physicsPuzzleTemplate: GameTemplate = {
  id: 'physics-puzzle',
  name: 'Physics Puzzle',
  description: 'Physics-based puzzle challenges',
  category: 'puzzle',
  thumbnail: 'assets/templates/physics-puzzle.png',
  difficulty: 'intermediate',
  features: ['Physics simulation', 'Puzzle design', 'Object interaction', 'Solution validation'],
  engine: 'babylon',
  data: {
    scenes: [{
      id: 'puzzle',
      name: 'Puzzle Scene',
      type: '3d',
      objects: [],
      background: '#e0e7ff',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 1280, height: 720 },
      orientation: 'landscape',
      physics: { enabled: true, gravity: { x: 0, y: -9.81, z: 0 }, engine: 'cannon' },
    },
  },
  documentation: 'Design physics-based puzzles with realistic simulations.',
};

// Template 14: Shooting Gallery
const shootingGalleryTemplate: GameTemplate = {
  id: 'shooting-gallery',
  name: 'Shooting Gallery',
  description: 'VR shooting gallery with targets and scoring',
  category: 'vr',
  thumbnail: 'assets/templates/shooting-gallery.png',
  difficulty: 'intermediate',
  features: ['VR shooting', 'Target spawning', 'Scoring system', 'Controller input'],
  engine: 'aframe',
  data: {
    scenes: [{
      id: 'gallery',
      name: 'Shooting Range',
      type: 'vr',
      objects: [],
      background: '#87CEEB',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 2560, height: 1440 },
      orientation: 'landscape',
    },
  },
  documentation: 'Create VR shooting gallery experiences with target practice.',
};

// Template 15: Interactive Story
const interactiveStoryTemplate: GameTemplate = {
  id: 'interactive-story',
  name: 'Interactive Story',
  description: 'Choose-your-own-adventure narrative game',
  category: 'story',
  thumbnail: 'assets/templates/interactive-story.png',
  difficulty: 'beginner',
  features: ['Branching narrative', 'Choice system', 'Story progression', 'Character dialogue'],
  engine: 'pixi',
  data: {
    scenes: [{
      id: 'story',
      name: 'Story Scene',
      type: '2d',
      objects: [],
      background: '#1e293b',
    }],
    assets: [],
    scripts: [],
    settings: {
      resolution: { width: 1280, height: 720 },
      orientation: 'landscape',
    },
  },
  documentation: 'Build interactive narrative experiences with branching storylines.',
};

/**
 * Template Library Service
 */
class TemplateLibrary {
  private templates: GameTemplate[] = [
    match3Template,
    endlessRunnerTemplate,
    towerDefenseTemplate,
    platformerTemplate,
    racingTemplate,
    quizTemplate,
    cardGameTemplate,
    idleClickerTemplate,
    rhythmTemplate,
    vrEscapeRoomTemplate,
    arTreasureHuntTemplate,
    virtualMuseumTemplate,
    physicsPuzzleTemplate,
    shootingGalleryTemplate,
    interactiveStoryTemplate,
  ];

  getAllTemplates(): GameTemplate[] {
    return this.templates;
  }

  getTemplateById(id: string): GameTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }

  getTemplatesByCategory(category: string): GameTemplate[] {
    return this.templates.filter((t) => t.category === category);
  }

  getTemplatesByEngine(engine: 'pixi' | 'babylon' | 'aframe'): GameTemplate[] {
    return this.templates.filter((t) => t.engine === engine);
  }

  getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): GameTemplate[] {
    return this.templates.filter((t) => t.difficulty === difficulty);
  }
}

export const templateLibrary = new TemplateLibrary();
