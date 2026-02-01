import { ArtStyleConfig, ArtStyle } from '../types';

/**
 * Art Style Library
 * Contains 5 signature art styles with complete configurations
 */

// Style 1: Pixel Perfect
const pixelPerfectStyle: ArtStyleConfig = {
  id: 'pixel',
  name: 'Pixel Perfect',
  description: 'Retro pixel art style with crisp edges and limited colors',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#ffe66d',
    background: '#1a1a2e',
    text: '#f7fff7',
    custom: ['#95e1d3', '#f38181', '#aa96da', '#fcbad3', '#a8d8ea'],
  },
  filters: [
    {
      type: 'pixelate',
      parameters: { size: 4 },
    },
    {
      type: 'contrast',
      parameters: { amount: 1.2 },
    },
  ],
};

// Style 2: Low Poly 3D
const lowPolyStyle: ArtStyleConfig = {
  id: 'lowpoly',
  name: 'Low Poly 3D',
  description: 'Minimalist 3D aesthetic with flat shading and geometric shapes',
  colors: {
    primary: '#ff9a76',
    secondary: '#96ceb4',
    accent: '#ffeaa7',
    background: '#dfe6e9',
    text: '#2d3436',
    custom: ['#fab1a0', '#74b9ff', '#a29bfe', '#fd79a8', '#00b894'],
  },
  shaders: [
    {
      name: 'flatShading',
      vertexShader: `
        attribute vec3 position;
        attribute vec3 normal;
        uniform mat4 worldViewProjection;
        varying vec3 vNormal;
        void main() {
          gl_Position = worldViewProjection * vec4(position, 1.0);
          vNormal = normal;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vNormal;
        void main() {
          vec3 color = vec3(0.8, 0.6, 0.4);
          float lighting = dot(normalize(vNormal), normalize(vec3(1.0, 1.0, 1.0)));
          gl_FragColor = vec4(color * lighting, 1.0);
        }
      `,
      uniforms: {},
    },
  ],
};

// Style 3: Hand-Drawn
const handDrawnStyle: ArtStyleConfig = {
  id: 'handdrawn',
  name: 'Hand-Drawn',
  description: 'Sketch and cartoon style with organic, hand-crafted feel',
  colors: {
    primary: '#ff6b9d',
    secondary: '#c44569',
    accent: '#f8b500',
    background: '#fff5e4',
    text: '#3d3d3d',
    custom: ['#ea8685', '#f6c667', '#a3de83', '#7ed7c1', '#b8b8d0'],
  },
  filters: [
    {
      type: 'outline',
      parameters: { thickness: 2, color: '#000000' },
    },
    {
      type: 'sketch',
      parameters: { intensity: 0.3 },
    },
    {
      type: 'paper',
      parameters: { texture: 'rough' },
    },
  ],
};

// Style 4: Neon Cyberpunk
const neonCyberpunkStyle: ArtStyleConfig = {
  id: 'cyberpunk',
  name: 'Neon Cyberpunk',
  description: 'Futuristic glowing aesthetic with neon colors and dark backgrounds',
  colors: {
    primary: '#ff00ff',
    secondary: '#00ffff',
    accent: '#ffff00',
    background: '#0a0e27',
    text: '#ffffff',
    custom: ['#ff006e', '#8338ec', '#3a86ff', '#fb5607', '#ffbe0b'],
  },
  shaders: [
    {
      name: 'neonGlow',
      vertexShader: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 worldViewProjection;
        varying vec2 vUV;
        void main() {
          gl_Position = worldViewProjection * vec4(position, 1.0);
          vUV = uv;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUV;
        uniform vec3 glowColor;
        uniform float glowIntensity;
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUV, center);
          float glow = glowIntensity * (1.0 - dist);
          gl_FragColor = vec4(glowColor * glow, 1.0);
        }
      `,
      uniforms: {
        glowColor: [1.0, 0.0, 1.0],
        glowIntensity: 2.0,
      },
    },
  ],
  filters: [
    {
      type: 'bloom',
      parameters: { strength: 1.5, threshold: 0.5 },
    },
    {
      type: 'scanlines',
      parameters: { intensity: 0.2 },
    },
  ],
};

// Style 5: Watercolor Dreams
const watercolorStyle: ArtStyleConfig = {
  id: 'watercolor',
  name: 'Watercolor Dreams',
  description: 'Soft artistic style with watercolor textures and pastel colors',
  colors: {
    primary: '#f5c7f7',
    secondary: '#c3aed6',
    accent: '#ffd2a0',
    background: '#fef9f3',
    text: '#6b5b5b',
    custom: ['#ffcce7', '#d4c5ff', '#b4e0ff', '#ffd4a3', '#ffeaa7'],
  },
  filters: [
    {
      type: 'watercolor',
      parameters: { wetness: 0.7, bleeding: 0.4 },
    },
    {
      type: 'blur',
      parameters: { amount: 2 },
    },
    {
      type: 'paper',
      parameters: { texture: 'watercolor' },
    },
  ],
};

/**
 * Art Style Service
 * Manages art styles and their application
 */
class ArtStyleService {
  private styles: ArtStyleConfig[] = [
    pixelPerfectStyle,
    lowPolyStyle,
    handDrawnStyle,
    neonCyberpunkStyle,
    watercolorStyle,
  ];

  getAllStyles(): ArtStyleConfig[] {
    return this.styles;
  }

  getStyleById(id: ArtStyle): ArtStyleConfig | undefined {
    return this.styles.find((s) => s.id === id);
  }

  getStyleColors(id: ArtStyle): ArtStyleConfig['colors'] | undefined {
    const style = this.getStyleById(id);
    return style?.colors;
  }

  /**
   * Apply art style filters to an engine
   */
  applyStyleToEngine(styleId: ArtStyle, engine: any): void {
    const style = this.getStyleById(styleId);
    if (!style) return;

    // Apply filters based on engine type
    if (style.filters) {
      style.filters.forEach((filter) => {
        this.applyFilter(engine, filter);
      });
    }

    // Apply shaders for 3D engines
    if (style.shaders) {
      style.shaders.forEach((shader) => {
        this.applyShader(engine, shader);
      });
    }
  }

  private applyFilter(engine: any, filter: any): void {
    // Filter application logic would go here
    // This would vary based on the engine (Pixi, Babylon, A-Frame)
    console.log('Applying filter:', filter.type, filter.parameters);
  }

  private applyShader(engine: any, shader: any): void {
    // Shader application logic would go here
    console.log('Applying shader:', shader.name);
  }

  /**
   * Generate color palette for UI elements
   */
  generateUIPalette(styleId: ArtStyle): any {
    const style = this.getStyleById(styleId);
    if (!style) return null;

    return {
      background: style.colors.background,
      surface: this.lighten(style.colors.background, 10),
      primary: style.colors.primary,
      secondary: style.colors.secondary,
      accent: style.colors.accent,
      text: style.colors.text,
      textSecondary: this.adjustOpacity(style.colors.text, 0.7),
      border: this.adjustOpacity(style.colors.text, 0.2),
      custom: style.colors.custom,
    };
  }

  /**
   * Lighten a color
   */
  private lighten(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }

  /**
   * Adjust color opacity
   */
  private adjustOpacity(hex: string, opacity: number): string {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');
    return `${hex}${alpha}`;
  }

  /**
   * Get asset recommendations for a style
   */
  getAssetRecommendations(styleId: ArtStyle): string[] {
    const recommendations: Record<ArtStyle, string[]> = {
      pixel: [
        '8x8 or 16x16 sprite sheets',
        'Limited color palette textures',
        'Chip-tune music',
        'Retro sound effects',
      ],
      lowpoly: [
        'Low polygon 3D models',
        'Flat-shaded materials',
        'Minimalist textures',
        'Ambient soundtrack',
      ],
      handdrawn: [
        'Hand-drawn sprite animations',
        'Sketchy UI elements',
        'Organic sound effects',
        'Acoustic music',
      ],
      cyberpunk: [
        'Neon textures and materials',
        'Holographic UI elements',
        'Synthwave music',
        'Electronic sound effects',
      ],
      watercolor: [
        'Watercolor textures',
        'Soft gradient backgrounds',
        'Gentle sound effects',
        'Classical music',
      ],
    };

    return recommendations[styleId] || [];
  }

  /**
   * Get a random art style
   */
  getRandomStyle(): ArtStyleConfig {
    const randomIndex = Math.floor(Math.random() * this.styles.length);
    return this.styles[randomIndex];
  }

  /**
   * Get random style excluding specific IDs
   */
  getRandomStyleExcluding(excludeIds: ArtStyle[]): ArtStyleConfig {
    const available = this.styles.filter(s => !excludeIds.includes(s.id));
    if (available.length === 0) {
      return this.getRandomStyle();
    }
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  /**
   * Get total style count
   */
  getStyleCount(): number {
    return this.styles.length;
  }

  /**
   * Check if a style is premium (for monetization)
   * Currently: lowpoly, cyberpunk, watercolor are premium
   */
  isPremiumStyle(styleId: ArtStyle): boolean {
    const premiumStyles: ArtStyle[] = ['lowpoly', 'cyberpunk', 'watercolor'];
    return premiumStyles.includes(styleId);
  }

  /**
   * Get free styles only
   */
  getFreeStyles(): ArtStyleConfig[] {
    return this.styles.filter(s => !this.isPremiumStyle(s.id));
  }

  /**
   * Get premium styles only
   */
  getPremiumStyles(): ArtStyleConfig[] {
    return this.styles.filter(s => this.isPremiumStyle(s.id));
  }
}

export const artStyleService = new ArtStyleService();
