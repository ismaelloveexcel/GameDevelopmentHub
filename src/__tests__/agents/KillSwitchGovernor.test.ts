import { killSwitchGovernor } from '../../services/agents/KillSwitchGovernor';

describe('KillSwitchGovernor', () => {
  describe('agent properties', () => {
    it('should have correct role', () => {
      expect(killSwitchGovernor.role).toBe('Kill-Switch Governor');
    });

    it('should have defined goal', () => {
      expect(killSwitchGovernor.goal).toContain('ruthlessly');
      expect(killSwitchGovernor.goal).toContain('worth your time');
    });

    it('should have backstory', () => {
      expect(killSwitchGovernor.backstory).toContain('No emotions');
      expect(killSwitchGovernor.backstory).toContain('Only scores');
    });

    it('should have decision rules', () => {
      expect(killSwitchGovernor.decisionRules.buildThreshold).toBe(85);
      expect(killSwitchGovernor.decisionRules.optionalTestMin).toBe(75);
      expect(killSwitchGovernor.decisionRules.optionalTestMax).toBe(84);
      expect(killSwitchGovernor.decisionRules.killThreshold).toBe(74);
    });
  });

  describe('scoreMonetizationStrength', () => {
    it('should score max 35 points for full monetization', () => {
      const score = killSwitchGovernor.scoreMonetizationStrength(true, 30, 500);
      expect(score.total).toBe(35);
      expect(score.paidFirstModel).toBe(15);
      expect(score.arpuThreshold).toBe(10);
      expect(score.userThreshold).toBe(10);
    });

    it('should score 0 for paid-first if not paid first', () => {
      const score = killSwitchGovernor.scoreMonetizationStrength(false, 30, 500);
      expect(score.paidFirstModel).toBe(0);
    });

    it('should score 0 for ARPU if below 20', () => {
      const score = killSwitchGovernor.scoreMonetizationStrength(true, 15, 500);
      expect(score.arpuThreshold).toBe(0);
    });

    it('should score 0 for users if more than 1000 needed', () => {
      const score = killSwitchGovernor.scoreMonetizationStrength(true, 30, 1500);
      expect(score.userThreshold).toBe(0);
    });
  });

  describe('scoreAutomationContent', () => {
    it('should score max 30 points for full automation', () => {
      const score = killSwitchGovernor.scoreAutomationContent(true, true, true);
      expect(score.total).toBe(30);
      expect(score.aiGeneratedContent).toBe(15);
      expect(score.noManualUpdates).toBe(10);
      expect(score.simpleLoop).toBe(5);
    });

    it('should score 0 for no AI generated content', () => {
      const score = killSwitchGovernor.scoreAutomationContent(false, true, true);
      expect(score.aiGeneratedContent).toBe(0);
      expect(score.total).toBe(15);
    });
  });

  describe('scoreRetentionLogic', () => {
    it('should score max 20 points for full retention', () => {
      const score = killSwitchGovernor.scoreRetentionLogic(true, true, true);
      expect(score.total).toBe(20);
      expect(score.returnTrigger).toBe(10);
      expect(score.progressionWithoutContent).toBe(5);
      expect(score.noMultiplayerDependency).toBe(5);
    });
  });

  describe('scoreExecutionSimplicity', () => {
    it('should score max 15 points for simple execution', () => {
      const score = killSwitchGovernor.scoreExecutionSimplicity(true, true, true);
      expect(score.total).toBe(15);
      expect(score.webDeployable).toBe(5);
      expect(score.noAppStoreDependency).toBe(5);
      expect(score.lowMaintenance).toBe(5);
    });
  });

  describe('calculateScore', () => {
    it('should calculate perfect score of 100', () => {
      const score = killSwitchGovernor.calculateScore(
        { isPaidFirst: true, arpu: 30, usersFor20k: 500 },
        { isAIGenerated: true, noManualUpdates: true, isSimpleLoop: true },
        { hasReturnTrigger: true, hasProgressionWithoutContent: true, noMultiplayerDependency: true },
        { isWebDeployable: true, noAppStoreDependency: true, isLowMaintenance: true }
      );

      expect(score.finalScore).toBe(100);
      expect(score.monetizationStrength.total).toBe(35);
      expect(score.automationContent.total).toBe(30);
      expect(score.retentionLogic.total).toBe(20);
      expect(score.executionSimplicity.total).toBe(15);
    });

    it('should calculate score of 0 for worst case', () => {
      const score = killSwitchGovernor.calculateScore(
        { isPaidFirst: false, arpu: 10, usersFor20k: 2000 },
        { isAIGenerated: false, noManualUpdates: false, isSimpleLoop: false },
        { hasReturnTrigger: false, hasProgressionWithoutContent: false, noMultiplayerDependency: false },
        { isWebDeployable: false, noAppStoreDependency: false, isLowMaintenance: false }
      );

      expect(score.finalScore).toBe(0);
    });
  });

  describe('makeDecision', () => {
    it('should return BUILD for score >= 85', () => {
      expect(killSwitchGovernor.makeDecision(85)).toBe('BUILD');
      expect(killSwitchGovernor.makeDecision(100)).toBe('BUILD');
    });

    it('should return OPTIONAL_TEST for score 75-84', () => {
      expect(killSwitchGovernor.makeDecision(75)).toBe('OPTIONAL_TEST');
      expect(killSwitchGovernor.makeDecision(80)).toBe('OPTIONAL_TEST');
      expect(killSwitchGovernor.makeDecision(84)).toBe('OPTIONAL_TEST');
    });

    it('should return KILL for score < 75', () => {
      expect(killSwitchGovernor.makeDecision(74)).toBe('KILL');
      expect(killSwitchGovernor.makeDecision(50)).toBe('KILL');
      expect(killSwitchGovernor.makeDecision(0)).toBe('KILL');
    });
  });

  describe('analyze', () => {
    it('should return BUILD decision for high scores', () => {
      const output = killSwitchGovernor.analyze(
        { isPaidFirst: true, arpu: 30, usersFor20k: 500 },
        { isAIGenerated: true, noManualUpdates: true, isSimpleLoop: true },
        { hasReturnTrigger: true, hasProgressionWithoutContent: true, noMultiplayerDependency: true },
        { isWebDeployable: true, noAppStoreDependency: true, isLowMaintenance: true },
        'Test game concept'
      );

      expect(output.decision).toBe('BUILD');
      expect(output.score.finalScore).toBe(100);
      expect(output.justification).toContain('BUILD');
      expect(output.justification).toContain('Proceed with development');
    });

    it('should return OPTIONAL_TEST for medium scores', () => {
      const output = killSwitchGovernor.analyze(
        { isPaidFirst: true, arpu: 30, usersFor20k: 500 },
        { isAIGenerated: true, noManualUpdates: false, isSimpleLoop: true },
        { hasReturnTrigger: true, hasProgressionWithoutContent: false, noMultiplayerDependency: true },
        { isWebDeployable: true, noAppStoreDependency: true, isLowMaintenance: false },
        'Test game concept'
      );

      expect(output.decision).toBe('OPTIONAL_TEST');
      expect(output.justification).toContain('OPTIONAL TEST');
    });

    it('should return KILL for low scores', () => {
      const output = killSwitchGovernor.analyze(
        { isPaidFirst: false, arpu: 10, usersFor20k: 2000 },
        { isAIGenerated: false, noManualUpdates: false, isSimpleLoop: false },
        { hasReturnTrigger: false, hasProgressionWithoutContent: false, noMultiplayerDependency: false },
        { isWebDeployable: false, noAppStoreDependency: false, isLowMaintenance: false },
        'Test game concept'
      );

      expect(output.decision).toBe('KILL');
      expect(output.justification).toContain('KILL');
      expect(output.justification).toContain('Not worth pursuing');
    });
  });

  describe('analyzeFromAgentOutputs', () => {
    it('should analyze outputs from other agents', () => {
      const concept = {
        gameConcept: 'Test Game',
        targetAudience: 'Adults',
        coreGameLoop: ['Step 1', 'Step 2'],
        whatAIGenerates: 'Content',
        whyUsersPay: 'Value',
      };

      const monetization = {
        pricePointAED: 29,
        paidUsersFor10kAED: 345,
        paidUsersFor20kAED: 690,
        expectedConversionRate: '3-5%',
        whyUsersPay: 'Features',
        churnRisk: { level: 'Low' as const, reason: 'Habit' },
      };

      const automation = {
        intake: 'Input',
        aiProcessing: 'AI processing',
        gameLogic: 'Logic',
        output: 'Output',
        automationScore: 95,
        humanInterventionRequired: { required: false, reason: 'None' },
      };

      const output = killSwitchGovernor.analyzeFromAgentOutputs(
        concept,
        monetization,
        automation
      );

      expect(output.decision).toBeDefined();
      expect(output.score).toBeDefined();
      expect(output.justification).toBeDefined();
      expect(output.justification).toContain('AED 29/month');
    });
  });

  describe('formatOutput', () => {
    it('should format output correctly', () => {
      const output = killSwitchGovernor.analyze(
        { isPaidFirst: true, arpu: 30, usersFor20k: 500 },
        { isAIGenerated: true, noManualUpdates: true, isSimpleLoop: true },
        { hasReturnTrigger: true, hasProgressionWithoutContent: true, noMultiplayerDependency: true },
        { isWebDeployable: true, noAppStoreDependency: true, isLowMaintenance: true },
        'Test'
      );

      const formatted = killSwitchGovernor.formatOutput(output);

      expect(formatted).toContain('FINAL SCORE:');
      expect(formatted).toContain('100/100');
      expect(formatted).toContain('BREAKDOWN:');
      expect(formatted).toContain('Monetization Strength:');
      expect(formatted).toContain('Automation & Content:');
      expect(formatted).toContain('Retention Logic:');
      expect(formatted).toContain('Execution Simplicity:');
      expect(formatted).toContain('GO / NO-GO:');
      expect(formatted).toContain('BUILD');
      expect(formatted).toContain('ONE-PARAGRAPH JUSTIFICATION:');
    });
  });

  describe('getSystemPrompt', () => {
    it('should return a valid system prompt', () => {
      const prompt = killSwitchGovernor.getSystemPrompt();

      expect(prompt).toContain('Kill-Switch Governor');
      expect(prompt).toContain('SCORING RULES');
      expect(prompt).toContain('Monetization Strength');
      expect(prompt).toContain('Decision Rule');
      expect(prompt).toContain('≥85 → BUILD');
    });
  });
});
