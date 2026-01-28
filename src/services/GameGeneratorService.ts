import { GameGeneratorCriteria, GeneratedGameConfig, ArtStyle, TemplateCategory } from '../types';
import { templateLibrary } from './TemplateLibrary';
import { artStyleService } from './ArtStyleService';

/**
 * Game Generator Service
 * Generates themed games based on user criteria for special occasions and situations
 */
class GameGeneratorService {
  /**
   * Generate a game configuration based on user criteria
   */
  async generateGame(criteria: GameGeneratorCriteria): Promise<GeneratedGameConfig> {
    // Select the best template based on criteria
    const template = this.selectTemplate(criteria);
    
    // Determine art style
    const artStyle = criteria.artStyle || this.suggestArtStyle(criteria.theme, criteria.occasion);
    
    // Generate game name and description
    const { name, description } = this.generateGameInfo(criteria);
    
    // Build customizations
    const customizations = {
      theme: criteria.theme,
      occasion: criteria.occasion,
      colors: this.generateColorPalette(criteria.theme, artStyle),
      features: criteria.features || [],
    };
    
    return {
      name,
      description,
      templateId: template.id,
      artStyle,
      customizations,
    };
  }
  
  /**
   * Select the most appropriate template based on criteria
   */
  private selectTemplate(criteria: GameGeneratorCriteria) {
    // If game type is specified, filter by that
    let candidates = criteria.gameType
      ? templateLibrary.getTemplatesByCategory(criteria.gameType)
      : templateLibrary.getAllTemplates();
    
    // Filter by difficulty if specified
    if (criteria.difficulty) {
      const difficultyTemplates = templateLibrary.getTemplatesByDifficulty(criteria.difficulty);
      candidates = candidates.filter(t => difficultyTemplates.some(dt => dt.id === t.id));
    }
    
    // If no candidates after filtering, use all templates
    if (candidates.length === 0) {
      candidates = templateLibrary.getAllTemplates();
    }
    
    // Score templates based on criteria match
    const scored = candidates.map(template => ({
      template,
      score: this.scoreTemplate(template, criteria),
    }));
    
    // Sort by score and return the best match
    scored.sort((a, b) => b.score - a.score);
    
    return scored[0].template;
  }
  
  /**
   * Score a template based on how well it matches criteria
   */
  private scoreTemplate(template: { id: string; name: string; description: string; features: string[]; category: string; difficulty: string }, criteria: GameGeneratorCriteria): number {
    let score = 0;
    
    // Match theme keywords
    const themeKeywords = criteria.theme.toLowerCase().split(' ');
    const templateText = `${template.name} ${template.description} ${template.features.join(' ')}`.toLowerCase();
    
    themeKeywords.forEach(keyword => {
      if (templateText.includes(keyword)) score += 2;
    });
    
    // Match occasion
    if (criteria.occasion) {
      const occasionMap: Record<string, string[]> = {
        birthday: ['quiz', 'interactive-story', 'puzzle'],
        wedding: ['interactive-story', 'quiz', 'puzzle'],
        holiday: ['puzzle', 'quiz', 'interactive-story'],
        education: ['quiz', 'virtual-museum', 'interactive-story'],
        corporate: ['quiz', 'virtual-museum', 'training'],
        party: ['quiz', 'rhythm', 'interactive-story'],
      };
      
      const occasionKey = criteria.occasion.toLowerCase();
      if (occasionMap[occasionKey] && occasionMap[occasionKey].includes(template.id)) {
        score += 5;
      }
    }
    
    // Match target audience
    if (criteria.targetAudience) {
      const audience = criteria.targetAudience.toLowerCase();
      if (audience.includes('child') || audience.includes('kid')) {
        if (['puzzle', 'educational', 'story'].includes(template.category)) score += 3;
        if (template.difficulty === 'beginner') score += 2;
      } else if (audience.includes('adult')) {
        if (['strategy', 'puzzle', 'vr'].includes(template.category)) score += 3;
      }
    }
    
    return score;
  }
  
  /**
   * Generate game name and description based on criteria
   */
  private generateGameInfo(criteria: GameGeneratorCriteria): { name: string; description: string } {
    const theme = criteria.theme;
    const occasion = criteria.occasion;
    
    let name = theme;
    let description = `A ${theme.toLowerCase()} themed game`;
    
    if (occasion) {
      name = `${theme} - ${occasion} Edition`;
      description = `A special ${theme.toLowerCase()} themed game created for ${occasion.toLowerCase()}`;
    }
    
    if (criteria.targetAudience) {
      description += ` designed for ${criteria.targetAudience.toLowerCase()}`;
    }
    
    if (criteria.customRequirements) {
      description += `. ${criteria.customRequirements}`;
    }
    
    return { name, description };
  }
  
  /**
   * Suggest an art style based on theme and occasion
   */
  private suggestArtStyle(theme: string, occasion?: string): ArtStyle {
    const themeLower = theme.toLowerCase();
    const occasionLower = occasion?.toLowerCase() || '';
    
    // Match keywords to art styles
    if (themeLower.includes('retro') || themeLower.includes('classic') || themeLower.includes('arcade')) {
      return 'pixel';
    }
    
    if (themeLower.includes('futur') || themeLower.includes('sci-fi') || themeLower.includes('cyber')) {
      return 'cyberpunk';
    }
    
    if (themeLower.includes('child') || themeLower.includes('kid') || occasionLower.includes('birthday')) {
      return 'handdrawn';
    }
    
    if (themeLower.includes('art') || themeLower.includes('paint') || themeLower.includes('creative')) {
      return 'watercolor';
    }
    
    if (themeLower.includes('minimal') || themeLower.includes('modern') || themeLower.includes('clean')) {
      return 'lowpoly';
    }
    
    // Default based on occasion
    if (occasionLower.includes('wedding') || occasionLower.includes('romantic')) {
      return 'watercolor';
    }
    
    if (occasionLower.includes('corporate') || occasionLower.includes('business')) {
      return 'lowpoly';
    }
    
    // Default to hand-drawn as it's versatile
    return 'handdrawn';
  }
  
  /**
   * Generate a color palette based on theme and art style
   */
  private generateColorPalette(theme: string, artStyle: ArtStyle) {
    // Get base palette from art style
    const baseStyle = artStyleService.getStyleById(artStyle);
    if (!baseStyle) {
      return {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        background: '#ffffff',
        text: '#1f2937',
        custom: [],
      };
    }
    
    const palette = { ...baseStyle.colors };
    const themeLower = theme.toLowerCase();
    
    // Adjust colors based on theme keywords
    if (themeLower.includes('ocean') || themeLower.includes('sea') || themeLower.includes('water')) {
      palette.primary = '#0ea5e9';
      palette.secondary = '#06b6d4';
      palette.accent = '#22d3ee';
    } else if (themeLower.includes('forest') || themeLower.includes('nature') || themeLower.includes('green')) {
      palette.primary = '#10b981';
      palette.secondary = '#059669';
      palette.accent = '#84cc16';
    } else if (themeLower.includes('fire') || themeLower.includes('hot') || themeLower.includes('summer')) {
      palette.primary = '#ef4444';
      palette.secondary = '#f97316';
      palette.accent = '#fbbf24';
    } else if (themeLower.includes('space') || themeLower.includes('cosmic') || themeLower.includes('galaxy')) {
      palette.primary = '#8b5cf6';
      palette.secondary = '#6366f1';
      palette.accent = '#ec4899';
    } else if (themeLower.includes('winter') || themeLower.includes('ice') || themeLower.includes('snow')) {
      palette.primary = '#38bdf8';
      palette.secondary = '#60a5fa';
      palette.accent = '#e0f2fe';
    }
    
    return palette;
  }
  
  /**
   * Get suggestions for popular themes
   */
  getPopularThemes(): { name: string; description: string; icon: string }[] {
    return [
      { name: 'Birthday Party', description: 'Fun games for birthday celebrations', icon: 'cake-variant' },
      { name: 'Wedding', description: 'Romantic and entertaining wedding games', icon: 'heart' },
      { name: 'Holiday Celebration', description: 'Festive games for any holiday', icon: 'gift' },
      { name: 'Corporate Training', description: 'Educational games for team building', icon: 'briefcase' },
      { name: 'School Education', description: 'Learning games for students', icon: 'school' },
      { name: 'Family Reunion', description: 'Games for family gatherings', icon: 'account-group' },
      { name: 'Team Building', description: 'Collaborative games for teams', icon: 'account-multiple' },
      { name: 'Anniversary', description: 'Special games for anniversaries', icon: 'calendar-heart' },
    ];
  }
  
  /**
   * Get suggestions for game types based on occasion
   */
  suggestGameTypes(occasion: string): TemplateCategory[] {
    const occasionLower = occasion.toLowerCase();
    
    const suggestions: Record<string, TemplateCategory[]> = {
      birthday: ['puzzle', 'action', 'quiz', 'story'],
      wedding: ['story', 'puzzle', 'quiz'],
      holiday: ['puzzle', 'quiz', 'story', 'rhythm'],
      education: ['educational', 'puzzle', 'quiz'],
      corporate: ['educational', 'puzzle', 'strategy', 'quiz'],
      party: ['action', 'rhythm', 'puzzle', 'quiz'],
      anniversary: ['story', 'puzzle', 'quiz'],
    };
    
    for (const [key, types] of Object.entries(suggestions)) {
      if (occasionLower.includes(key)) {
        return types;
      }
    }
    
    // Default suggestions
    return ['puzzle', 'quiz', 'story', 'action'];
  }
  
  /**
   * Validate criteria before generation
   */
  validateCriteria(criteria: GameGeneratorCriteria): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!criteria.theme || criteria.theme.trim().length === 0) {
      errors.push('Theme is required');
    }
    
    if (criteria.theme && criteria.theme.trim().length < 3) {
      errors.push('Theme must be at least 3 characters');
    }
    
    if (criteria.features && criteria.features.length > 10) {
      errors.push('Maximum 10 features allowed');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const gameGeneratorService = new GameGeneratorService();
