/**
 * RouletteService
 * 
 * Handles the Game Roulette feature - randomly generates unique game combinations
 * using templates, art styles, and wild cards.
 */

import { templateLibrary } from './TemplateLibrary';
import { artStyleService } from './ArtStyleService';
import { wildCardService } from './WildCardService';
import { 
  RouletteResult, 
  RouletteRarity, 
  RouletteConfig,
  WildCard 
} from '../types/gift';
import { GameTemplate, ArtStyleConfig } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@giftforge/roulette_combinations';

/**
 * Rarity thresholds based on combination uniqueness
 */
const RARITY_THRESHOLDS = {
  legendary: { maxCount: 3, score: 95, color: '#f1c40f' },
  epic: { maxCount: 10, score: 80, color: '#9b59b6' },
  rare: { maxCount: 25, score: 60, color: '#3498db' },
  uncommon: { maxCount: 50, score: 40, color: '#2ecc71' },
  common: { maxCount: Infinity, score: 20, color: '#95a5a6' },
};

class RouletteService {
  private combinationCounts: Map<string, number> = new Map();
  private initialized: boolean = false;

  /**
   * Initialize the service (load saved combination counts)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.combinationCounts = new Map(Object.entries(data));
      }
      this.initialized = true;
    } catch (error) {
      console.error('Failed to load roulette data:', error);
      this.initialized = true;
    }
  }

  /**
   * Save combination counts to storage
   */
  private async saveCombinations(): Promise<void> {
    try {
      const data = Object.fromEntries(this.combinationCounts);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save roulette data:', error);
    }
  }

  /**
   * Generate a unique hash for a combination
   */
  generateCombinationHash(templateId: string, styleId: string, wildCardId: string): string {
    return `${templateId}:${styleId}:${wildCardId}`;
  }

  /**
   * Get or increment the count for a combination
   */
  private async incrementCombinationCount(hash: string): Promise<number> {
    await this.initialize();
    const currentCount = this.combinationCounts.get(hash) || 0;
    const newCount = currentCount + 1;
    this.combinationCounts.set(hash, newCount);
    await this.saveCombinations();
    return newCount;
  }

  /**
   * Get the count for a combination without incrementing
   */
  async getCombinationCount(hash: string): Promise<number> {
    await this.initialize();
    return this.combinationCounts.get(hash) || 0;
  }

  /**
   * Calculate rarity based on global count
   */
  calculateRarity(globalCount: number): RouletteRarity {
    if (globalCount <= RARITY_THRESHOLDS.legendary.maxCount) {
      return {
        score: RARITY_THRESHOLDS.legendary.score,
        label: 'Legendary',
        color: RARITY_THRESHOLDS.legendary.color,
      };
    }
    if (globalCount <= RARITY_THRESHOLDS.epic.maxCount) {
      return {
        score: RARITY_THRESHOLDS.epic.score,
        label: 'Epic',
        color: RARITY_THRESHOLDS.epic.color,
      };
    }
    if (globalCount <= RARITY_THRESHOLDS.rare.maxCount) {
      return {
        score: RARITY_THRESHOLDS.rare.score,
        label: 'Rare',
        color: RARITY_THRESHOLDS.rare.color,
      };
    }
    if (globalCount <= RARITY_THRESHOLDS.uncommon.maxCount) {
      return {
        score: RARITY_THRESHOLDS.uncommon.score,
        label: 'Uncommon',
        color: RARITY_THRESHOLDS.uncommon.color,
      };
    }
    return {
      score: RARITY_THRESHOLDS.common.score,
      label: 'Common',
      color: RARITY_THRESHOLDS.common.color,
    };
  }

  /**
   * Spin the roulette and get a random combination
   */
  async spinRoulette(config?: RouletteConfig): Promise<RouletteResult> {
    await this.initialize();

    // Get random template
    let template: GameTemplate;
    if (config?.allowedTemplates && config.allowedTemplates.length > 0) {
      const filtered = config.allowedTemplates
        .map(id => templateLibrary.getTemplateById(id))
        .filter((t): t is GameTemplate => t !== undefined);
      template = filtered.length > 0 
        ? filtered[Math.floor(Math.random() * filtered.length)]
        : templateLibrary.getRandomTemplate();
    } else {
      template = templateLibrary.getRandomTemplate();
    }

    // Get random art style
    let style: ArtStyleConfig;
    if (config?.allowedStyles && config.allowedStyles.length > 0) {
      const filtered = config.allowedStyles
        .map(id => artStyleService.getStyleById(id as any))
        .filter((s): s is ArtStyleConfig => s !== undefined);
      style = filtered.length > 0
        ? filtered[Math.floor(Math.random() * filtered.length)]
        : artStyleService.getRandomStyle();
    } else {
      style = artStyleService.getRandomStyle();
    }

    // Get random wild card
    let wildCard: WildCard;
    if (config?.excludeWildCards && config.excludeWildCards.length > 0) {
      wildCard = wildCardService.getRandomWildCardExcluding(config.excludeWildCards);
    } else {
      wildCard = wildCardService.getRandomWildCard();
    }

    // Generate hash and get count
    const combinationHash = this.generateCombinationHash(template.id, style.id, wildCard.id);
    const globalCount = await this.incrementCombinationCount(combinationHash);
    const rarity = this.calculateRarity(globalCount);

    return {
      templateId: template.id,
      templateName: template.name,
      artStyleId: style.id,
      artStyleName: style.name,
      wildCard,
      combinationHash,
      globalCount,
      rarity,
      timestamp: new Date(),
    };
  }

  /**
   * Preview a spin without saving (for animations)
   */
  async previewSpin(config?: RouletteConfig): Promise<RouletteResult> {
    await this.initialize();

    const template = config?.allowedTemplates?.length
      ? templateLibrary.getTemplateById(config.allowedTemplates[Math.floor(Math.random() * config.allowedTemplates.length)]) || templateLibrary.getRandomTemplate()
      : templateLibrary.getRandomTemplate();

    const style = config?.allowedStyles?.length
      ? artStyleService.getStyleById(config.allowedStyles[Math.floor(Math.random() * config.allowedStyles.length)] as any) || artStyleService.getRandomStyle()
      : artStyleService.getRandomStyle();

    const wildCard = config?.excludeWildCards?.length
      ? wildCardService.getRandomWildCardExcluding(config.excludeWildCards)
      : wildCardService.getRandomWildCard();

    const combinationHash = this.generateCombinationHash(template.id, style.id, wildCard.id);
    const globalCount = await this.getCombinationCount(combinationHash);
    const rarity = this.calculateRarity(globalCount + 1); // +1 because it would be incremented

    return {
      templateId: template.id,
      templateName: template.name,
      artStyleId: style.id,
      artStyleName: style.name,
      wildCard,
      combinationHash,
      globalCount: globalCount + 1,
      rarity,
      timestamp: new Date(),
    };
  }

  /**
   * Get statistics about possible combinations
   */
  getStatistics(): {
    totalPossibleCombinations: number;
    templateCount: number;
    styleCount: number;
    wildCardCount: number;
    trackedCombinations: number;
  } {
    const templateCount = templateLibrary.getTemplateCount();
    const styleCount = artStyleService.getStyleCount();
    const wildCardCount = wildCardService.getWildCardCount();

    return {
      totalPossibleCombinations: templateCount * styleCount * wildCardCount,
      templateCount,
      styleCount,
      wildCardCount,
      trackedCombinations: this.combinationCounts.size,
    };
  }

  /**
   * Get the rarest combinations created
   */
  getRarestCombinations(limit: number = 10): Array<{ hash: string; count: number }> {
    const entries = Array.from(this.combinationCounts.entries());
    entries.sort((a, b) => a[1] - b[1]);
    return entries.slice(0, limit).map(([hash, count]) => ({ hash, count }));
  }

  /**
   * Parse a combination hash back to its components
   */
  parseCombinationHash(hash: string): {
    templateId: string;
    styleId: string;
    wildCardId: string;
  } | null {
    const parts = hash.split(':');
    if (parts.length !== 3) return null;
    return {
      templateId: parts[0],
      styleId: parts[1],
      wildCardId: parts[2],
    };
  }

  /**
   * Format result for display
   */
  formatResultForDisplay(result: RouletteResult): {
    title: string;
    subtitle: string;
    rarityBadge: string;
    shareText: string;
  } {
    return {
      title: `${result.templateName} + ${result.wildCard.name}`,
      subtitle: `in ${result.artStyleName} style`,
      rarityBadge: `${result.rarity.label} • 1 of ${result.globalCount}`,
      shareText: `I spun a ${result.rarity.label} combo on GiftForge! ${result.templateName} + ${result.wildCard.icon} in ${result.artStyleName} style. Only ${result.globalCount} people have this exact combo!`,
    };
  }

  /**
   * Clear all saved data (for testing/reset)
   */
  async clearAllData(): Promise<void> {
    this.combinationCounts.clear();
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

export const rouletteService = new RouletteService();
export { RouletteService };
