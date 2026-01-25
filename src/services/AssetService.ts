import { Asset } from '../types';

/**
 * Asset Management Service
 * Handles game assets (images, audio, models, etc.)
 */
class AssetService {
  private assets: Map<string, Asset> = new Map();
  private assetCategories = {
    sprites: [] as Asset[],
    backgrounds: [] as Asset[],
    audio: [] as Asset[],
    models: [] as Asset[],
    fonts: [] as Asset[],
    effects: [] as Asset[],
  };

  /**
   * Get sample assets for templates
   */
  getSampleAssets(): Record<string, Asset[]> {
    return {
      pixel: [
        {
          id: 'pixel_player',
          name: 'Pixel Character',
          type: 'image',
          url: 'assets/pixel/player.png',
          size: 2048,
          metadata: { style: 'pixel', size: '16x16' },
        },
        {
          id: 'pixel_tileset',
          name: 'Pixel Tileset',
          type: 'image',
          url: 'assets/pixel/tileset.png',
          size: 8192,
          metadata: { style: 'pixel', tiles: '32' },
        },
      ],
      lowpoly: [
        {
          id: 'lowpoly_car',
          name: 'Low Poly Car',
          type: '3dmodel',
          url: 'assets/lowpoly/car.glb',
          size: 51200,
          metadata: { style: 'lowpoly', polygons: 150 },
        },
        {
          id: 'lowpoly_tree',
          name: 'Low Poly Tree',
          type: '3dmodel',
          url: 'assets/lowpoly/tree.glb',
          size: 20480,
          metadata: { style: 'lowpoly', polygons: 80 },
        },
      ],
      handdrawn: [
        {
          id: 'handdrawn_character',
          name: 'Hand-Drawn Character',
          type: 'image',
          url: 'assets/handdrawn/character.png',
          size: 40960,
          metadata: { style: 'handdrawn' },
        },
      ],
      cyberpunk: [
        {
          id: 'cyberpunk_neon',
          name: 'Neon Sign',
          type: 'image',
          url: 'assets/cyberpunk/neon.png',
          size: 30720,
          metadata: { style: 'cyberpunk', animated: true },
        },
      ],
      watercolor: [
        {
          id: 'watercolor_bg',
          name: 'Watercolor Background',
          type: 'image',
          url: 'assets/watercolor/background.png',
          size: 102400,
          metadata: { style: 'watercolor' },
        },
      ],
    };
  }

  /**
   * Get assets by category
   */
  getAssetsByCategory(category: keyof typeof this.assetCategories): Asset[] {
    return this.assetCategories[category];
  }

  /**
   * Get assets by type
   */
  getAssetsByType(type: Asset['type']): Asset[] {
    return Array.from(this.assets.values()).filter(a => a.type === type);
  }

  /**
   * Add asset
   */
  addAsset(asset: Asset): void {
    this.assets.set(asset.id, asset);
    
    // Categorize asset
    if (asset.type === 'image') {
      if (asset.metadata?.category === 'background') {
        this.assetCategories.backgrounds.push(asset);
      } else {
        this.assetCategories.sprites.push(asset);
      }
    } else if (asset.type === 'audio') {
      this.assetCategories.audio.push(asset);
    } else if (asset.type === '3dmodel') {
      this.assetCategories.models.push(asset);
    } else if (asset.type === 'font') {
      this.assetCategories.fonts.push(asset);
    }
  }

  /**
   * Remove asset
   */
  removeAsset(id: string): boolean {
    const asset = this.assets.get(id);
    if (!asset) return false;

    this.assets.delete(id);

    // Remove from category
    Object.keys(this.assetCategories).forEach(category => {
      const key = category as keyof typeof this.assetCategories;
      this.assetCategories[key] = this.assetCategories[key].filter(a => a.id !== id);
    });

    return true;
  }

  /**
   * Get asset by ID
   */
  getAsset(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  /**
   * Search assets
   */
  searchAssets(query: string): Asset[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.assets.values()).filter(a =>
      a.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get asset recommendations for a game type
   */
  getRecommendations(gameType: string, artStyle?: string): Asset[] {
    const recommendations: Record<string, string[]> = {
      puzzle: ['sprites', 'backgrounds', 'effects'],
      action: ['sprites', 'effects', 'audio'],
      vr: ['models', 'audio', 'effects'],
      educational: ['sprites', 'backgrounds', 'fonts'],
    };

    const categories = recommendations[gameType] || ['sprites'];
    const assets: Asset[] = [];

    categories.forEach(category => {
      if (category in this.assetCategories) {
        const key = category as keyof typeof this.assetCategories;
        const categoryAssets = this.assetCategories[key];
        
        if (artStyle) {
          // Filter by art style
          assets.push(...categoryAssets.filter(a => 
            a.metadata?.style === artStyle
          ));
        } else {
          assets.push(...categoryAssets);
        }
      }
    });

    return assets;
  }

  /**
   * Optimize asset (simulated)
   */
  async optimizeAsset(id: string): Promise<Asset | null> {
    const asset = this.assets.get(id);
    if (!asset) return null;

    // Simulate optimization
    const optimized: Asset = {
      ...asset,
      size: Math.floor(asset.size * 0.7), // 30% size reduction
      metadata: {
        ...asset.metadata,
        optimized: true,
        originalSize: asset.size,
      },
    };

    this.assets.set(id, optimized);
    return optimized;
  }

  /**
   * Get total assets size
   */
  getTotalSize(): number {
    return Array.from(this.assets.values()).reduce((sum, asset) => sum + asset.size, 0);
  }

  /**
   * Format bytes to human-readable size
   */
  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Import assets from URL or file
   */
  async importAssets(sources: string[]): Promise<Asset[]> {
    const imported: Asset[] = [];

    for (const source of sources) {
      const asset: Asset = {
        id: `asset_${Date.now()}_${Math.random()}`,
        name: source.split('/').pop() || 'Unnamed',
        type: this.detectAssetType(source),
        url: source,
        size: 0, // Would be determined by actual file
        metadata: { imported: true },
      };

      this.addAsset(asset);
      imported.push(asset);
    }

    return imported;
  }

  /**
   * Detect asset type from file extension
   */
  private detectAssetType(filename: string): Asset['type'] {
    const ext = filename.split('.').pop()?.toLowerCase();

    const typeMap: Record<string, Asset['type']> = {
      png: 'image',
      jpg: 'image',
      jpeg: 'image',
      gif: 'image',
      webp: 'image',
      mp3: 'audio',
      wav: 'audio',
      ogg: 'audio',
      mp4: 'video',
      webm: 'video',
      glb: '3dmodel',
      gltf: '3dmodel',
      obj: '3dmodel',
      fbx: '3dmodel',
      ttf: 'font',
      otf: 'font',
      woff: 'font',
      js: 'script',
      ts: 'script',
    };

    return typeMap[ext || ''] || 'image';
  }

  /**
   * Generate asset pack for art style
   */
  generateAssetPack(artStyle: string, _gameType: string): Asset[] {
    // This would generate or fetch appropriate assets
    // For now, return sample assets
    const sampleAssets = this.getSampleAssets();
    return sampleAssets[artStyle as keyof typeof sampleAssets] || [];
  }

  /**
   * Validate asset URL
   */
  async validateAsset(_url: string): Promise<boolean> {
    try {
      // In a real implementation, this would check if the asset exists
      // and is accessible
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get asset statistics
   */
  getStatistics() {
    return {
      total: this.assets.size,
      byType: {
        images: this.getAssetsByType('image').length,
        audio: this.getAssetsByType('audio').length,
        video: this.getAssetsByType('video').length,
        models: this.getAssetsByType('3dmodel').length,
        fonts: this.getAssetsByType('font').length,
        scripts: this.getAssetsByType('script').length,
      },
      totalSize: this.getTotalSize(),
      formattedSize: this.formatSize(this.getTotalSize()),
    };
  }
}

export const assetService = new AssetService();
