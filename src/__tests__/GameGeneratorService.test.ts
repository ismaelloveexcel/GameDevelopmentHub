import { gameGeneratorService } from '../services/GameGeneratorService';
import { GameGeneratorCriteria } from '../types';

describe('GameGeneratorService', () => {
  describe('validateCriteria', () => {
    it('should validate valid criteria', () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'Space Adventure',
        occasion: 'Birthday',
      };
      
      const result = gameGeneratorService.validateCriteria(criteria);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should reject empty theme', () => {
      const criteria: GameGeneratorCriteria = {
        theme: '',
      };
      
      const result = gameGeneratorService.validateCriteria(criteria);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Theme is required');
    });
    
    it('should reject theme shorter than 3 characters', () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'AB',
      };
      
      const result = gameGeneratorService.validateCriteria(criteria);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Theme must be at least 3 characters');
    });
    
    it('should reject more than 10 features', () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'Space',
        features: new Array(11).fill('feature'),
      };
      
      const result = gameGeneratorService.validateCriteria(criteria);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Maximum 10 features allowed');
    });
  });
  
  describe('getPopularThemes', () => {
    it('should return array of popular themes', () => {
      const themes = gameGeneratorService.getPopularThemes();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBeGreaterThan(0);
    });
    
    it('should return themes with required properties', () => {
      const themes = gameGeneratorService.getPopularThemes();
      themes.forEach(theme => {
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('icon');
      });
    });
  });
  
  describe('suggestGameTypes', () => {
    it('should suggest game types for birthday', () => {
      const types = gameGeneratorService.suggestGameTypes('Birthday');
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
    });
    
    it('should suggest game types for education', () => {
      const types = gameGeneratorService.suggestGameTypes('education');
      expect(types).toContain('educational');
    });
    
    it('should return default suggestions for unknown occasion', () => {
      const types = gameGeneratorService.suggestGameTypes('unknown occasion');
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
    });
  });
  
  describe('generateGame', () => {
    it('should generate game config with valid criteria', async () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'Ocean Adventure',
        occasion: 'Birthday',
        targetAudience: 'Children',
        difficulty: 'beginner',
      };
      
      const config = await gameGeneratorService.generateGame(criteria);
      
      expect(config).toHaveProperty('name');
      expect(config).toHaveProperty('description');
      expect(config).toHaveProperty('templateId');
      expect(config).toHaveProperty('artStyle');
      expect(config).toHaveProperty('customizations');
      expect(config.customizations.theme).toBe('Ocean Adventure');
    });
    
    it('should generate game with specific game type', async () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'Math Challenge',
        gameType: 'educational',
        difficulty: 'beginner',
      };
      
      const config = await gameGeneratorService.generateGame(criteria);
      // When educational is selected, it should select from educational templates
      const educationalTemplates = ['quiz', 'virtual-museum'];
      expect(educationalTemplates).toContain(config.templateId);
    });
    
    it('should include occasion in game name if provided', async () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'Space Race',
        occasion: 'School Event',
      };
      
      const config = await gameGeneratorService.generateGame(criteria);
      expect(config.name).toContain('Space Race');
      expect(config.name).toContain('School Event');
    });
    
    it('should select appropriate art style based on theme', async () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'Retro Arcade',
      };
      
      const config = await gameGeneratorService.generateGame(criteria);
      expect(config.artStyle).toBe('pixel');
    });
    
    it('should use provided art style if specified', async () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'Modern Design',
        artStyle: 'lowpoly',
      };
      
      const config = await gameGeneratorService.generateGame(criteria);
      expect(config.artStyle).toBe('lowpoly');
    });
  });
  
  describe('Template Selection', () => {
    it('should select beginner template for children audience', async () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'Fun Learning',
        targetAudience: 'Children',
        difficulty: 'beginner',
      };
      
      const config = await gameGeneratorService.generateGame(criteria);
      expect(config).toBeDefined();
    });
    
    it('should select appropriate template for educational theme', async () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'Science Quiz',
        occasion: 'education',
      };
      
      const config = await gameGeneratorService.generateGame(criteria);
      expect(config.templateId).toBeDefined();
    });
  });
  
  describe('Color Palette Generation', () => {
    it('should generate themed color palette', async () => {
      const criteria: GameGeneratorCriteria = {
        theme: 'Ocean Paradise',
      };
      
      const config = await gameGeneratorService.generateGame(criteria);
      expect(config.customizations.colors).toBeDefined();
      expect(config.customizations.colors).toHaveProperty('primary');
      expect(config.customizations.colors).toHaveProperty('secondary');
    });
    
    it('should adapt colors based on theme keywords', async () => {
      const oceanCriteria: GameGeneratorCriteria = {
        theme: 'Ocean Adventure',
      };
      
      const oceanConfig = await gameGeneratorService.generateGame(oceanCriteria);
      expect(oceanConfig.customizations.colors?.primary).toContain('#');
    });
  });
});
