import { gameAutomationArchitect } from '../../services/agents/GameAutomationArchitect';

describe('GameAutomationArchitect', () => {
  describe('agent properties', () => {
    it('should have correct role', () => {
      expect(gameAutomationArchitect.role).toBe('Game Automation Architect');
    });

    it('should have defined goal', () => {
      expect(gameAutomationArchitect.goal).toContain('end-to-end');
      expect(gameAutomationArchitect.goal).toContain('no daily human involvement');
    });

    it('should have strict instructions', () => {
      expect(gameAutomationArchitect.strictInstructions.length).toBeGreaterThan(0);
      expect(gameAutomationArchitect.strictInstructions).toContain('Manual moderation = FAIL');
    });

    it('should have minimum automation score of 80', () => {
      expect(gameAutomationArchitect.minimumAutomationScore).toBe(80);
    });
  });

  describe('calculateAutomationScore', () => {
    it('should score full automation at 100', () => {
      const score = gameAutomationArchitect.calculateAutomationScore({
        contentGenerationAutomated: true,
        difficultyScalingAutomated: true,
        refreshCadenceAutomated: true,
        manualModerationRequired: false,
        requiresFrequentReleases: false,
        automationPercentage: 100,
      });

      expect(score).toBe(100);
    });

    it('should score no automation at 0', () => {
      const score = gameAutomationArchitect.calculateAutomationScore({
        contentGenerationAutomated: false,
        difficultyScalingAutomated: false,
        refreshCadenceAutomated: false,
        manualModerationRequired: true,
        requiresFrequentReleases: true,
        automationPercentage: 0,
      });

      expect(score).toBe(0);
    });

    it('should add 25 points for content generation', () => {
      const withContent = gameAutomationArchitect.calculateAutomationScore({
        contentGenerationAutomated: true,
        difficultyScalingAutomated: false,
        refreshCadenceAutomated: false,
        manualModerationRequired: true,
        requiresFrequentReleases: true,
        automationPercentage: 25,
      });

      const withoutContent = gameAutomationArchitect.calculateAutomationScore({
        contentGenerationAutomated: false,
        difficultyScalingAutomated: false,
        refreshCadenceAutomated: false,
        manualModerationRequired: true,
        requiresFrequentReleases: true,
        automationPercentage: 0,
      });

      expect(withContent - withoutContent).toBe(25);
    });

    it('should add 15 points for no manual moderation', () => {
      const noModeration = gameAutomationArchitect.calculateAutomationScore({
        contentGenerationAutomated: false,
        difficultyScalingAutomated: false,
        refreshCadenceAutomated: false,
        manualModerationRequired: false,
        requiresFrequentReleases: true,
        automationPercentage: 15,
      });

      const withModeration = gameAutomationArchitect.calculateAutomationScore({
        contentGenerationAutomated: false,
        difficultyScalingAutomated: false,
        refreshCadenceAutomated: false,
        manualModerationRequired: true,
        requiresFrequentReleases: true,
        automationPercentage: 0,
      });

      expect(noModeration - withModeration).toBe(15);
    });
  });

  describe('validateAutomation', () => {
    it('should validate fully automated system', () => {
      const result = gameAutomationArchitect.validateAutomation({
        contentGenerationAutomated: true,
        difficultyScalingAutomated: true,
        refreshCadenceAutomated: true,
        manualModerationRequired: false,
        requiresFrequentReleases: false,
        automationPercentage: 100,
      });

      expect(result.isValid).toBe(true);
      expect(result.automationScore).toBe(100);
      expect(result.rejectionReasons).toHaveLength(0);
    });

    it('should reject low automation score', () => {
      const result = gameAutomationArchitect.validateAutomation({
        contentGenerationAutomated: true,
        difficultyScalingAutomated: false,
        refreshCadenceAutomated: false,
        manualModerationRequired: true,
        requiresFrequentReleases: true,
        automationPercentage: 25,
      });

      expect(result.isValid).toBe(false);
      expect(result.rejectionReasons[0]).toContain('AUTO-REJECT: Automation score');
    });

    it('should fail when manual moderation is required', () => {
      const result = gameAutomationArchitect.validateAutomation({
        contentGenerationAutomated: true,
        difficultyScalingAutomated: true,
        refreshCadenceAutomated: true,
        manualModerationRequired: true,
        requiresFrequentReleases: false,
        automationPercentage: 85,
      });

      expect(result.isValid).toBe(false);
      expect(result.rejectionReasons).toContain('FAIL: Manual moderation required');
    });

    it('should reject frequent releases', () => {
      const result = gameAutomationArchitect.validateAutomation({
        contentGenerationAutomated: true,
        difficultyScalingAutomated: true,
        refreshCadenceAutomated: true,
        manualModerationRequired: false,
        requiresFrequentReleases: true,
        automationPercentage: 90,
      });

      expect(result.isValid).toBe(false);
      expect(result.rejectionReasons).toContain('AUTO-REJECT: Requires frequent releases');
    });

    it('should require content generation automation', () => {
      const result = gameAutomationArchitect.validateAutomation({
        contentGenerationAutomated: false,
        difficultyScalingAutomated: true,
        refreshCadenceAutomated: true,
        manualModerationRequired: false,
        requiresFrequentReleases: false,
        automationPercentage: 75,
      });

      expect(result.isValid).toBe(false);
      expect(result.rejectionReasons).toContain('Content generation must be automated');
    });
  });

  describe('analyzeAutomation', () => {
    it('should analyze valid automation', () => {
      const output = gameAutomationArchitect.analyzeAutomation(
        'User session data: input from API',
        'LLM generates content automatically',
        'Rules engine calculates scores',
        'Rendered game screen',
        false,
        'Fully automated'
      );

      expect(output.intake).toContain('session data');
      expect(output.aiProcessing).toContain('LLM');
      expect(output.gameLogic).toContain('Rules');
      expect(output.output).toContain('Rendered');
      expect(output.automationScore).toBeGreaterThanOrEqual(80);
      expect(output.humanInterventionRequired.required).toBe(false);
    });

    it('should throw error for low automation score', () => {
      expect(() => {
        gameAutomationArchitect.analyzeAutomation(
          'Manual content',
          'No AI',
          'No logic',
          'Static output',
          true,
          'Requires manual work'
        );
      }).toThrow('below minimum');
    });
  });

  describe('formatOutput', () => {
    it('should format output correctly', () => {
      const output = gameAutomationArchitect.analyzeAutomation(
        'Auto input',
        'AI generates content',
        'Rules engine',
        'Game screen',
        false,
        'None required'
      );

      const formatted = gameAutomationArchitect.formatOutput(output);

      expect(formatted).toContain('INTAKE (player input):');
      expect(formatted).toContain('AI PROCESSING:');
      expect(formatted).toContain('GAME LOGIC (rules-based):');
      expect(formatted).toContain('OUTPUT (what player sees):');
      expect(formatted).toContain('AUTOMATION SCORE (%):');
      expect(formatted).toContain('ANY HUMAN INTERVENTION REQUIRED');
    });
  });

  describe('getSampleArchitectures', () => {
    it('should return sample architectures', () => {
      const samples = gameAutomationArchitect.getSampleArchitectures();

      expect(samples.length).toBeGreaterThan(0);
      samples.forEach(sample => {
        expect(sample.automationScore).toBeGreaterThanOrEqual(80);
        expect(sample.humanInterventionRequired.required).toBe(false);
      });
    });
  });

  describe('getAutomationChecklist', () => {
    it('should return required and recommended items', () => {
      const checklist = gameAutomationArchitect.getAutomationChecklist();

      expect(checklist.required.length).toBeGreaterThan(0);
      expect(checklist.recommended.length).toBeGreaterThan(0);
      expect(checklist.required).toContain('Content generation via AI/algorithms');
    });
  });

  describe('getSystemPrompt', () => {
    it('should return a valid system prompt', () => {
      const prompt = gameAutomationArchitect.getSystemPrompt();

      expect(prompt).toContain('Game Automation Architect');
      expect(prompt).toContain('STRICT INSTRUCTIONS');
      expect(prompt).toContain('Auto-kill');
      expect(prompt).toContain('AUTOMATION SCORE');
    });
  });
});
