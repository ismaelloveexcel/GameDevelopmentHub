/**
 * AssetGeneratorService
 * 
 * AI-powered asset generation using Grok/xAI for:
 * - Logo generation
 * - Game sprites and characters
 * - Background art
 * - UI elements
 */

// xAI Grok API for image generation
const GROK_API_URL = 'https://api.x.ai/v1';

export interface GeneratedAsset {
  id: string;
  type: 'logo' | 'character' | 'background' | 'sprite' | 'icon';
  prompt: string;
  imageUrl: string;
  thumbnailUrl?: string;
  style: string;
  createdAt: Date;
}

export interface LogoGenerationRequest {
  appName: string;
  style: 'neon' | 'pixel' | 'modern' | 'playful' | 'elegant';
  primaryColor?: string;
  secondaryColor?: string;
  includeIcon?: boolean;
  includeTagline?: string;
  theme?: 'gaming' | 'gift' | 'social' | 'creative';
}

export interface CharacterGenerationRequest {
  description: string;
  artStyle: 'pixel' | 'cartoon' | 'anime' | 'realistic' | 'lowpoly';
  pose?: string;
  emotion?: string;
  accessories?: string[];
}

export interface BackgroundGenerationRequest {
  scene: string;
  artStyle: 'pixel' | 'painted' | 'vector' | 'photorealistic';
  mood: 'happy' | 'mysterious' | 'action' | 'calm' | 'festive';
  timeOfDay?: 'day' | 'night' | 'sunset' | 'dawn';
}

class AssetGeneratorService {
  private apiKey: string | null = null;

  /**
   * Set the API key for image generation
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return this.apiKey !== null && this.apiKey.length > 0;
  }

  /**
   * Generate a logo using AI
   */
  async generateLogo(request: LogoGenerationRequest): Promise<GeneratedAsset> {
    const prompt = this.buildLogoPrompt(request);
    
    if (!this.isConfigured()) {
      console.warn('AssetGenerator: API key not configured, returning placeholder');
      return this.createPlaceholderAsset('logo', prompt, request.style);
    }

    try {
      const imageUrl = await this.generateImage(prompt, {
        size: '1024x1024',
        style: 'vivid',
      });

      return {
        id: `logo-${Date.now()}`,
        type: 'logo',
        prompt,
        imageUrl,
        style: request.style,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Logo generation failed:', error);
      return this.createPlaceholderAsset('logo', prompt, request.style);
    }
  }

  /**
   * Generate a game character using AI
   */
  async generateCharacter(request: CharacterGenerationRequest): Promise<GeneratedAsset> {
    const prompt = this.buildCharacterPrompt(request);

    if (!this.isConfigured()) {
      return this.createPlaceholderAsset('character', prompt, request.artStyle);
    }

    try {
      const imageUrl = await this.generateImage(prompt, {
        size: '1024x1024',
        style: 'vivid',
      });

      return {
        id: `char-${Date.now()}`,
        type: 'character',
        prompt,
        imageUrl,
        style: request.artStyle,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Character generation failed:', error);
      return this.createPlaceholderAsset('character', prompt, request.artStyle);
    }
  }

  /**
   * Generate a game background using AI
   */
  async generateBackground(request: BackgroundGenerationRequest): Promise<GeneratedAsset> {
    const prompt = this.buildBackgroundPrompt(request);

    if (!this.isConfigured()) {
      return this.createPlaceholderAsset('background', prompt, request.artStyle);
    }

    try {
      const imageUrl = await this.generateImage(prompt, {
        size: '1792x1024', // Wider for backgrounds
        style: 'vivid',
      });

      return {
        id: `bg-${Date.now()}`,
        type: 'background',
        prompt,
        imageUrl,
        style: request.artStyle,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Background generation failed:', error);
      return this.createPlaceholderAsset('background', prompt, request.artStyle);
    }
  }

  /**
   * Generate PlayGift logo specifically
   */
  async generatePlayGiftLogo(): Promise<GeneratedAsset> {
    return this.generateLogo({
      appName: 'PlayGift',
      style: 'neon',
      primaryColor: '#FF4081',
      secondaryColor: '#00E5FF',
      includeIcon: true,
      includeTagline: 'Personalized Game Gifts',
      theme: 'gaming',
    });
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private async generateImage(
    prompt: string,
    options: { size?: string; style?: string } = {}
  ): Promise<string> {
    // Using xAI's image generation endpoint
    // Note: Adjust based on actual xAI API documentation
    const response = await fetch(`${GROK_API_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-2-image',
        prompt,
        n: 1,
        size: options.size || '1024x1024',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.[0]?.url || '';
  }

  private buildLogoPrompt(request: LogoGenerationRequest): string {
    const parts: string[] = [];

    parts.push(`Professional logo design for "${request.appName}"`);
    
    if (request.theme === 'gaming') {
      parts.push('featuring a stylized gaming controller');
    } else if (request.theme === 'gift') {
      parts.push('featuring a gift box with ribbon');
    }

    switch (request.style) {
      case 'neon':
        parts.push('neon glow effect, cyberpunk aesthetic, glowing outlines');
        parts.push(`primary color ${request.primaryColor || '#FF4081'}`);
        parts.push(`secondary color ${request.secondaryColor || '#00E5FF'}`);
        parts.push('dark background, electric feel');
        break;
      case 'pixel':
        parts.push('pixel art style, retro gaming aesthetic, 8-bit inspired');
        break;
      case 'modern':
        parts.push('clean modern design, minimalist, flat design');
        break;
      case 'playful':
        parts.push('fun playful design, rounded shapes, vibrant colors');
        break;
      case 'elegant':
        parts.push('elegant sophisticated design, premium feel');
        break;
    }

    if (request.includeTagline) {
      parts.push(`with tagline "${request.includeTagline}"`);
    }

    parts.push('high quality, vector style, suitable for app icon');

    return parts.join(', ');
  }

  private buildCharacterPrompt(request: CharacterGenerationRequest): string {
    const parts: string[] = [];

    parts.push(`Game character: ${request.description}`);
    
    switch (request.artStyle) {
      case 'pixel':
        parts.push('pixel art style, 16-bit inspired, clear silhouette');
        break;
      case 'cartoon':
        parts.push('cartoon style, bold outlines, expressive');
        break;
      case 'anime':
        parts.push('anime style, big eyes, dynamic pose');
        break;
      case 'realistic':
        parts.push('semi-realistic style, detailed');
        break;
      case 'lowpoly':
        parts.push('low poly 3D style, geometric shapes');
        break;
    }

    if (request.pose) {
      parts.push(`pose: ${request.pose}`);
    }

    if (request.emotion) {
      parts.push(`expression: ${request.emotion}`);
    }

    if (request.accessories?.length) {
      parts.push(`wearing/holding: ${request.accessories.join(', ')}`);
    }

    parts.push('transparent background, game asset, centered');

    return parts.join(', ');
  }

  private buildBackgroundPrompt(request: BackgroundGenerationRequest): string {
    const parts: string[] = [];

    parts.push(`Game background scene: ${request.scene}`);

    switch (request.artStyle) {
      case 'pixel':
        parts.push('pixel art style, retro gaming');
        break;
      case 'painted':
        parts.push('digital painting style, hand-painted look');
        break;
      case 'vector':
        parts.push('vector art style, clean shapes, flat colors');
        break;
      case 'photorealistic':
        parts.push('photorealistic, high detail');
        break;
    }

    switch (request.mood) {
      case 'happy':
        parts.push('bright colors, cheerful atmosphere');
        break;
      case 'mysterious':
        parts.push('dark tones, foggy, atmospheric');
        break;
      case 'action':
        parts.push('dynamic, intense colors, motion blur');
        break;
      case 'calm':
        parts.push('peaceful, soft colors, serene');
        break;
      case 'festive':
        parts.push('celebration theme, confetti, party atmosphere');
        break;
    }

    if (request.timeOfDay) {
      parts.push(`time of day: ${request.timeOfDay}`);
    }

    parts.push('wide aspect ratio, seamless edges, game-ready');

    return parts.join(', ');
  }

  private createPlaceholderAsset(
    type: GeneratedAsset['type'],
    prompt: string,
    style: string
  ): GeneratedAsset {
    // Return a placeholder that indicates AI generation is needed
    return {
      id: `placeholder-${type}-${Date.now()}`,
      type,
      prompt,
      imageUrl: `https://via.placeholder.com/1024x1024.png?text=${encodeURIComponent(`${type}: ${style}`)}`,
      style,
      createdAt: new Date(),
    };
  }
}

export const assetGeneratorService = new AssetGeneratorService();
export { AssetGeneratorService };
