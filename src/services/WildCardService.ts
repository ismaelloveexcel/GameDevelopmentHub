/**
 * WildCardService
 * 
 * Manages the wild card library for Game Roulette.
 * Wild cards add unexpected, fun twists to generated games.
 */

import { WildCard, WildCardEffect } from '../types/gift';

/**
 * The complete wild card library - 20 unique wild cards
 */
const WILD_CARDS: WildCard[] = [
  // Theme Overrides (5)
  {
    id: 'dinosaur',
    name: 'Dinosaurs',
    icon: '🦖',
    description: 'Everything becomes prehistoric!',
    effect: { type: 'theme_override', value: 'prehistoric' },
    rarity: 'common',
  },
  {
    id: 'space',
    name: 'Space Adventure',
    icon: '🚀',
    description: 'Blast off to the cosmos!',
    effect: { type: 'theme_override', value: 'cosmic' },
    rarity: 'common',
  },
  {
    id: 'underwater',
    name: 'Underwater World',
    icon: '🐠',
    description: 'Dive into the ocean depths!',
    effect: { type: 'theme_override', value: 'ocean' },
    rarity: 'common',
  },
  {
    id: 'jungle',
    name: 'Jungle Safari',
    icon: '🌴',
    description: 'Explore the wild jungle!',
    effect: { type: 'theme_override', value: 'tropical' },
    rarity: 'common',
  },
  {
    id: 'ice',
    name: 'Frozen Kingdom',
    icon: '❄️',
    description: 'Enter the ice age!',
    effect: { type: 'theme_override', value: 'frozen' },
    rarity: 'common',
  },

  // Character Swaps (5)
  {
    id: 'ninja',
    name: 'Ninja Mode',
    icon: '🥷',
    description: 'Become a stealthy ninja!',
    effect: { type: 'character_swap', value: 'ninja' },
    rarity: 'rare',
  },
  {
    id: 'robot',
    name: 'Robot Revolution',
    icon: '🤖',
    description: 'Transform into a robot!',
    effect: { type: 'character_swap', value: 'robot' },
    rarity: 'rare',
  },
  {
    id: 'cat',
    name: 'Cat Life',
    icon: '🐱',
    description: 'Play as an adorable cat!',
    effect: { type: 'character_swap', value: 'cat' },
    rarity: 'common',
  },
  {
    id: 'superhero',
    name: 'Superhero',
    icon: '🦸',
    description: 'Become a mighty hero!',
    effect: { type: 'character_swap', value: 'hero' },
    rarity: 'rare',
  },
  {
    id: 'wizard',
    name: 'Wizard Magic',
    icon: '🧙',
    description: 'Cast powerful spells!',
    effect: { type: 'character_swap', value: 'wizard' },
    rarity: 'rare',
  },

  // Collectible Swaps (3)
  {
    id: 'pizza',
    name: 'Pizza Party',
    icon: '🍕',
    description: 'Collect delicious pizza!',
    effect: { type: 'collectible_swap', value: 'food' },
    rarity: 'common',
  },
  {
    id: 'candy',
    name: 'Candy Land',
    icon: '🍬',
    description: 'Sweet candy everywhere!',
    effect: { type: 'collectible_swap', value: 'candy' },
    rarity: 'common',
  },
  {
    id: 'gems',
    name: 'Gem Hunter',
    icon: '💎',
    description: 'Collect precious gems!',
    effect: { type: 'collectible_swap', value: 'gems' },
    rarity: 'rare',
  },

  // Add Elements (4)
  {
    id: 'unicorn',
    name: 'Unicorn Magic',
    icon: '🦄',
    description: 'Rainbow trails everywhere!',
    effect: { type: 'add_element', value: 'rainbow_trail' },
    rarity: 'legendary',
  },
  {
    id: 'ghost',
    name: 'Spooky Ghosts',
    icon: '👻',
    description: 'Friendly ghosts appear!',
    effect: { type: 'add_element', value: 'spooky' },
    rarity: 'rare',
  },
  {
    id: 'music',
    name: 'Musical',
    icon: '🎵',
    description: 'Music notes float around!',
    effect: { type: 'add_element', value: 'music_notes' },
    rarity: 'common',
  },
  {
    id: 'fire',
    name: 'Fire Power',
    icon: '🔥',
    description: 'Everything is on fire!',
    effect: { type: 'add_element', value: 'flames' },
    rarity: 'rare',
  },

  // Visual Filters (2)
  {
    id: 'retro',
    name: 'Retro TV',
    icon: '📺',
    description: 'Classic CRT scanlines!',
    effect: { type: 'filter', value: 'crt_scanlines' },
    rarity: 'legendary',
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    icon: '✨',
    description: 'Everything glows!',
    effect: { type: 'filter', value: 'neon_glow' },
    rarity: 'legendary',
  },

  // Scale Effects (1)
  {
    id: 'tiny',
    name: 'Tiny World',
    icon: '🔍',
    description: 'Everything is miniature!',
    effect: { type: 'scale', value: 'miniature' },
    rarity: 'legendary',
  },
];

/**
 * Rarity weights for random selection
 * Higher weight = more likely to be selected
 */
const RARITY_WEIGHTS: Record<string, number> = {
  common: 50,
  rare: 30,
  legendary: 20,
};

class WildCardService {
  private wildCards: WildCard[] = WILD_CARDS;

  /**
   * Get all wild cards
   */
  getAllWildCards(): WildCard[] {
    return [...this.wildCards];
  }

  /**
   * Get wild card by ID
   */
  getWildCardById(id: string): WildCard | undefined {
    return this.wildCards.find(wc => wc.id === id);
  }

  /**
   * Get wild cards by rarity
   */
  getWildCardsByRarity(rarity: 'common' | 'rare' | 'legendary'): WildCard[] {
    return this.wildCards.filter(wc => wc.rarity === rarity);
  }

  /**
   * Get a random wild card (weighted by rarity)
   */
  getRandomWildCard(): WildCard {
    const weightedCards: WildCard[] = [];
    
    this.wildCards.forEach(card => {
      const weight = RARITY_WEIGHTS[card.rarity || 'common'];
      for (let i = 0; i < weight; i++) {
        weightedCards.push(card);
      }
    });

    const randomIndex = Math.floor(Math.random() * weightedCards.length);
    return weightedCards[randomIndex];
  }

  /**
   * Get a truly random wild card (no weighting)
   */
  getRandomWildCardUnweighted(): WildCard {
    const randomIndex = Math.floor(Math.random() * this.wildCards.length);
    return this.wildCards[randomIndex];
  }

  /**
   * Get random wild card excluding specific IDs
   */
  getRandomWildCardExcluding(excludeIds: string[]): WildCard {
    const availableCards = this.wildCards.filter(wc => !excludeIds.includes(wc.id));
    
    if (availableCards.length === 0) {
      return this.getRandomWildCard();
    }

    const weightedCards: WildCard[] = [];
    availableCards.forEach(card => {
      const weight = RARITY_WEIGHTS[card.rarity || 'common'];
      for (let i = 0; i < weight; i++) {
        weightedCards.push(card);
      }
    });

    const randomIndex = Math.floor(Math.random() * weightedCards.length);
    return weightedCards[randomIndex];
  }

  /**
   * Get wild cards count
   */
  getWildCardCount(): number {
    return this.wildCards.length;
  }

  /**
   * Get count by rarity
   */
  getCountByRarity(): Record<string, number> {
    return {
      common: this.getWildCardsByRarity('common').length,
      rare: this.getWildCardsByRarity('rare').length,
      legendary: this.getWildCardsByRarity('legendary').length,
    };
  }

  /**
   * Apply wild card effect to game data
   * Returns modified game data (to be implemented with actual game engine)
   */
  applyWildCardEffect(wildCard: WildCard, gameData: any): any {
    const { effect } = wildCard;
    
    // Log for now - actual implementation depends on game engine
    console.log(`Applying wild card: ${wildCard.name}`);
    console.log(`Effect type: ${effect.type}, value: ${effect.value}`);
    
    // Return game data with wild card metadata attached
    return {
      ...gameData,
      wildCard: {
        id: wildCard.id,
        name: wildCard.name,
        effect: wildCard.effect,
      },
    };
  }

  /**
   * Get display info for a wild card (for UI)
   */
  getDisplayInfo(wildCardId: string): {
    name: string;
    icon: string;
    description: string;
    rarityColor: string;
    rarityLabel: string;
  } | null {
    const card = this.getWildCardById(wildCardId);
    if (!card) return null;

    const rarityColors: Record<string, string> = {
      common: '#95a5a6',
      rare: '#3498db',
      legendary: '#f1c40f',
    };

    return {
      name: card.name,
      icon: card.icon,
      description: card.description || '',
      rarityColor: rarityColors[card.rarity || 'common'],
      rarityLabel: (card.rarity || 'common').charAt(0).toUpperCase() + (card.rarity || 'common').slice(1),
    };
  }
}

export const wildCardService = new WildCardService();
export { WildCardService };
