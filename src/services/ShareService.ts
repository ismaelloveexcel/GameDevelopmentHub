/**
 * ShareService
 * 
 * Handles sharing functionality for gifts including
 * link generation, share cards, and social sharing.
 */

import { Gift, ShareCardData } from '../types/gift';
import { templateLibrary } from './TemplateLibrary';
import { artStyleService } from './ArtStyleService';

const BASE_URL = 'https://giftforge.app';

class ShareService {
  /**
   * Generate a full share URL for a gift
   */
  generateShareUrl(giftOrShortCode: Gift | string): string {
    const shortCode = typeof giftOrShortCode === 'string' 
      ? giftOrShortCode 
      : giftOrShortCode.shortCode;
    return `${BASE_URL}/g/${shortCode}`;
  }

  /**
   * Parse a share URL to extract the short code
   */
  parseShareUrl(url: string): string | null {
    const patterns = [
      /giftforge\.app\/g\/([a-z0-9-]+)/i,
      /^gf-([a-z0-9]+)$/i,
      /^([a-z0-9-]+)$/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const code = match[1];
        return code.startsWith('gf-') ? code : `gf-${code}`;
      }
    }
    return null;
  }

  /**
   * Generate share card data for a gift
   */
  generateShareCard(gift: Gift): ShareCardData {
    const template = templateLibrary.getTemplateById(gift.templateId);
    const style = artStyleService.getStyleById(gift.artStyleId as any);

    // Calculate creation time
    const creationTimeMs = gift.createdAt.getTime();
    const now = Date.now();
    const diffMinutes = Math.round((now - creationTimeMs) / 60000);
    const creationTime = diffMinutes < 60 
      ? `${diffMinutes} minutes` 
      : `${Math.round(diffMinutes / 60)} hours`;

    // Get template icon
    const templateIcon = this.getTemplateIcon(template?.category || 'puzzle');

    return {
      title: 'I Made a Game!',
      recipientName: gift.recipient.name,
      templateIcon,
      templateName: template?.name || 'Custom Game',
      artStyleName: style?.name || 'Custom Style',
      creationTime,
      loveRating: 5, // Can be dynamic based on effort/features used
      shareUrl: this.generateShareUrl(gift),
      qrCode: undefined, // Would generate QR code in production
    };
  }

  /**
   * Generate share text for different platforms
   */
  generateShareText(gift: Gift, platform: 'twitter' | 'whatsapp' | 'general' = 'general'): string {
    const template = templateLibrary.getTemplateById(gift.templateId);
    const recipientName = gift.recipient.name;
    const url = this.generateShareUrl(gift);

    switch (platform) {
      case 'twitter':
        return `I just created a personalized ${template?.name || 'game'} for ${recipientName} using @GiftForge! 🎮✨\n\nCreate yours: ${url}`;
      
      case 'whatsapp':
        return `🎁 Hey ${recipientName}! I made something special for you!\n\nOpen your gift: ${url}\n\nMade with GiftForge 🎮`;
      
      default:
        return `I created a personalized game for ${recipientName}! 🎮\n\nPlay it here: ${url}`;
    }
  }

  /**
   * Generate Instagram/TikTok story card text
   */
  generateStoryCard(gift: Gift): {
    line1: string;
    line2: string;
    line3: string;
    emoji: string;
  } {
    const template = templateLibrary.getTemplateById(gift.templateId);
    
    return {
      line1: '✨ I MADE A GAME! ✨',
      line2: `For: ${gift.recipient.name}`,
      line3: `${template?.name || 'Game'} • Made with GiftForge`,
      emoji: this.getTemplateIcon(template?.category || 'puzzle'),
    };
  }

  /**
   * Generate formatted result for Wordle-style sharing
   */
  generateWordleStyleShare(gift: Gift): string {
    const template = templateLibrary.getTemplateById(gift.templateId);
    const style = artStyleService.getStyleById(gift.artStyleId as any);
    const templateIcon = this.getTemplateIcon(template?.category || 'puzzle');
    const styleIcon = this.getStyleIcon(gift.artStyleId);

    let result = '🎁 GiftForge\n\n';
    result += `For: ${gift.recipient.name}\n`;
    result += `${templateIcon} ${template?.name || 'Game'}\n`;
    result += `${styleIcon} ${style?.name || 'Style'}\n`;

    if (gift.rouletteResult) {
      result += `${gift.rouletteResult.wildCard.icon} ${gift.rouletteResult.wildCard.name}\n`;
      result += `\n⭐ ${gift.rouletteResult.rarity.label} combo!`;
    }

    result += `\n\n${this.generateShareUrl(gift)}`;
    return result;
  }

  /**
   * Get appropriate icon for template category
   */
  private getTemplateIcon(category: string): string {
    const icons: Record<string, string> = {
      puzzle: '🧩',
      action: '⚡',
      strategy: '🏰',
      racing: '🏎️',
      educational: '📚',
      vr: '🥽',
      ar: '📱',
      idle: '💰',
      rhythm: '🎵',
      story: '📖',
    };
    return icons[category] || '🎮';
  }

  /**
   * Get appropriate icon for art style
   */
  private getStyleIcon(styleId: string): string {
    const icons: Record<string, string> = {
      pixel: '👾',
      lowpoly: '🔷',
      handdrawn: '✏️',
      cyberpunk: '🌃',
      watercolor: '🎨',
    };
    return icons[styleId] || '🎨';
  }

  /**
   * Check if URL is a valid GiftForge share link
   */
  isValidShareUrl(url: string): boolean {
    return this.parseShareUrl(url) !== null;
  }

  /**
   * Generate deep link for app opening
   */
  generateDeepLink(gift: Gift): string {
    return `giftforge://gift/${gift.shortCode}`;
  }

  /**
   * Generate universal link (works on web and app)
   */
  generateUniversalLink(gift: Gift): string {
    return `${BASE_URL}/gift/${gift.shortCode}`;
  }
}

export const shareService = new ShareService();
export { ShareService };
