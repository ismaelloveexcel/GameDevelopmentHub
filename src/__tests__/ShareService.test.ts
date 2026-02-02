/**
 * ShareService Tests
 */

import { shareService } from '../services/ShareService';
import { Gift, DEFAULT_GIFT_WRAP } from '../types/gift';

describe('ShareService', () => {
  const mockGift: Gift = {
    id: 'test-123',
    gameId: 'game-123',
    templateId: 'match3',
    artStyleId: 'pixel',
    recipient: { name: 'Sarah' },
    mode: 'standard',
    wrap: DEFAULT_GIFT_WRAP,
    shareLink: 'https://giftforge.app/g/gf-abc12',
    shortCode: 'gf-abc12',
    status: 'created',
    createdAt: new Date(),
    reactions: [],
    playCount: 0,
  };

  describe('generateShareUrl', () => {
    it('should generate URL from gift object', () => {
      const url = shareService.generateShareUrl(mockGift);
      expect(url).toBe('https://giftforge.app/g/gf-abc12');
    });

    it('should generate URL from short code string', () => {
      const url = shareService.generateShareUrl('gf-xyz99');
      expect(url).toBe('https://giftforge.app/g/gf-xyz99');
    });
  });

  describe('parseShareUrl', () => {
    it('should parse full URL', () => {
      const code = shareService.parseShareUrl('https://giftforge.app/g/gf-abc12');
      expect(code).toBe('gf-abc12');
    });

    it('should parse short code with prefix', () => {
      const code = shareService.parseShareUrl('gf-abc12');
      expect(code).toBe('gf-abc12');
    });

    it('should add prefix to bare code', () => {
      const code = shareService.parseShareUrl('abc12');
      expect(code).toBe('gf-abc12');
    });

    it('should return null for invalid URL', () => {
      const code = shareService.parseShareUrl('invalid-url-format!!!');
      expect(code).toBeNull();
    });
  });

  describe('generateShareCard', () => {
    it('should generate share card data', () => {
      const card = shareService.generateShareCard(mockGift);
      
      expect(card.title).toBe('I Made a Game!');
      expect(card.recipientName).toBe('Sarah');
      expect(card.templateName).toBe('Puzzle Match-3');
      expect(card.artStyleName).toBe('Pixel Perfect');
      expect(card.shareUrl).toContain('gf-abc12');
    });
  });

  describe('generateShareText', () => {
    it('should generate general share text', () => {
      const text = shareService.generateShareText(mockGift, 'general');
      expect(text).toContain('Sarah');
      expect(text).toContain('giftforge.app');
    });

    it('should generate Twitter-specific text', () => {
      const text = shareService.generateShareText(mockGift, 'twitter');
      expect(text).toContain('@GiftForge');
      expect(text).toContain('Sarah');
    });

    it('should generate WhatsApp-specific text', () => {
      const text = shareService.generateShareText(mockGift, 'whatsapp');
      expect(text).toContain('Hey Sarah');
      expect(text).toContain('🎁');
    });
  });

  describe('generateStoryCard', () => {
    it('should generate story card with lines', () => {
      const card = shareService.generateStoryCard(mockGift);
      
      expect(card.line1).toContain('MADE A GAME');
      expect(card.line2).toContain('Sarah');
      expect(card.line3).toContain('GiftForge');
      expect(card.emoji).toBeDefined();
    });
  });

  describe('generateWordleStyleShare', () => {
    it('should generate Wordle-style share text', () => {
      const text = shareService.generateWordleStyleShare(mockGift);
      
      expect(text).toContain('GiftForge');
      expect(text).toContain('Sarah');
      expect(text).toContain('Match-3');
      expect(text).toContain('Pixel');
    });
  });

  describe('isValidShareUrl', () => {
    it('should return true for valid URLs', () => {
      expect(shareService.isValidShareUrl('https://giftforge.app/g/gf-abc12')).toBe(true);
      expect(shareService.isValidShareUrl('gf-abc12')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(shareService.isValidShareUrl('invalid!!!')).toBe(false);
    });
  });

  describe('generateDeepLink', () => {
    it('should generate app deep link', () => {
      const link = shareService.generateDeepLink(mockGift);
      expect(link).toBe('giftforge://gift/gf-abc12');
    });
  });

  describe('generateUniversalLink', () => {
    it('should generate universal link', () => {
      const link = shareService.generateUniversalLink(mockGift);
      expect(link).toBe('https://giftforge.app/gift/gf-abc12');
    });
  });
});
