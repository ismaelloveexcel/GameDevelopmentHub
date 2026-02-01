/**
 * WildCardService Tests
 */

import { wildCardService } from '../services/WildCardService';

describe('WildCardService', () => {
  describe('getAllWildCards', () => {
    it('should return all 20 wild cards', () => {
      const cards = wildCardService.getAllWildCards();
      expect(cards.length).toBe(20);
    });

    it('should return cards with required properties', () => {
      const cards = wildCardService.getAllWildCards();
      cards.forEach(card => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('icon');
        expect(card).toHaveProperty('effect');
        expect(card.effect).toHaveProperty('type');
        expect(card.effect).toHaveProperty('value');
      });
    });
  });

  describe('getWildCardById', () => {
    it('should return correct wild card by ID', () => {
      const card = wildCardService.getWildCardById('dinosaur');
      expect(card).toBeDefined();
      expect(card?.name).toBe('Dinosaurs');
      expect(card?.icon).toBe('🦖');
    });

    it('should return undefined for non-existent ID', () => {
      const card = wildCardService.getWildCardById('nonexistent');
      expect(card).toBeUndefined();
    });
  });

  describe('getWildCardsByRarity', () => {
    it('should return common cards', () => {
      const cards = wildCardService.getWildCardsByRarity('common');
      expect(cards.length).toBeGreaterThan(0);
      cards.forEach(card => {
        expect(card.rarity).toBe('common');
      });
    });

    it('should return rare cards', () => {
      const cards = wildCardService.getWildCardsByRarity('rare');
      expect(cards.length).toBeGreaterThan(0);
      cards.forEach(card => {
        expect(card.rarity).toBe('rare');
      });
    });

    it('should return legendary cards', () => {
      const cards = wildCardService.getWildCardsByRarity('legendary');
      expect(cards.length).toBeGreaterThan(0);
      cards.forEach(card => {
        expect(card.rarity).toBe('legendary');
      });
    });
  });

  describe('getRandomWildCard', () => {
    it('should return a valid wild card', () => {
      const card = wildCardService.getRandomWildCard();
      expect(card).toBeDefined();
      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('name');
    });

    it('should return different cards over multiple calls', () => {
      const results = new Set<string>();
      for (let i = 0; i < 50; i++) {
        results.add(wildCardService.getRandomWildCard().id);
      }
      // Should get at least a few different cards
      expect(results.size).toBeGreaterThan(3);
    });
  });

  describe('getRandomWildCardExcluding', () => {
    it('should not return excluded cards', () => {
      const excluded = ['dinosaur', 'space', 'underwater'];
      for (let i = 0; i < 20; i++) {
        const card = wildCardService.getRandomWildCardExcluding(excluded);
        expect(excluded).not.toContain(card.id);
      }
    });
  });

  describe('getWildCardCount', () => {
    it('should return 20', () => {
      expect(wildCardService.getWildCardCount()).toBe(20);
    });
  });

  describe('getCountByRarity', () => {
    it('should return counts for each rarity', () => {
      const counts = wildCardService.getCountByRarity();
      expect(counts).toHaveProperty('common');
      expect(counts).toHaveProperty('rare');
      expect(counts).toHaveProperty('legendary');
      expect(counts.common + counts.rare + counts.legendary).toBe(20);
    });
  });

  describe('getDisplayInfo', () => {
    it('should return display info for valid card', () => {
      const info = wildCardService.getDisplayInfo('unicorn');
      expect(info).toBeDefined();
      expect(info?.name).toBe('Unicorn Magic');
      expect(info?.icon).toBe('🦄');
      expect(info?.rarityLabel).toBe('Legendary');
    });

    it('should return null for invalid card', () => {
      const info = wildCardService.getDisplayInfo('nonexistent');
      expect(info).toBeNull();
    });
  });
});
