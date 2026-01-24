import { crewAIOrchestrator, CrewAIOrchestrator } from '../../services/agents/CrewAIOrchestrator';

describe('CrewAIOrchestrator', () => {
  describe('constructor', () => {
    it('should create orchestrator with all agents', () => {
      const orchestrator = new CrewAIOrchestrator();

      expect(orchestrator.conceptSniper).toBeDefined();
      expect(orchestrator.monetizationEnforcer).toBeDefined();
      expect(orchestrator.automationArchitect).toBeDefined();
      expect(orchestrator.killSwitchGovernor).toBeDefined();
    });
  });

  describe('analyzeGameConcept', () => {
    it('should run full analysis through all agents', () => {
      const analysis = crewAIOrchestrator.analyzeGameConcept(
        {
          gameConcept: 'Daily Logic Puzzler',
          targetAudience: 'Adults 25-55',
          coreGameLoop: ['Read puzzle', 'Solve', 'Score'],
          whatAIGenerates: 'Logic puzzles',
          whyUsersPay: 'Premium features',
        },
        {
          pricePointAED: 29,
          expectedConversionRate: '3-5%',
          whyUsersPay: 'Daily habit',
          churnLevel: 'Low',
          churnReason: 'Habit-forming',
        },
        {
          intake: 'Auto input from API',
          aiProcessing: 'LLM generates puzzles automatically',
          gameLogic: 'Rules engine calculates scores',
          output: 'Rendered puzzle',
          humanInterventionRequired: false,
          humanInterventionReason: 'Fully automated',
        }
      );

      expect(analysis.concept).toBeDefined();
      expect(analysis.concept.gameConcept).toBe('Daily Logic Puzzler');
      expect(analysis.monetization).toBeDefined();
      expect(analysis.monetization.pricePointAED).toBe(29);
      expect(analysis.automation).toBeDefined();
      expect(analysis.automation.automationScore).toBeGreaterThanOrEqual(80);
      expect(analysis.killSwitch).toBeDefined();
      expect(analysis.killSwitch.decision).toBeDefined();
      expect(analysis.architecture).toBeDefined();
      expect(analysis.timestamp).toBeDefined();
    });

    it('should throw error for invalid core loop length', () => {
      expect(() => {
        crewAIOrchestrator.analyzeGameConcept(
          {
            gameConcept: 'Game',
            targetAudience: 'Audience',
            coreGameLoop: ['1', '2', '3', '4'], // Too many steps
            whatAIGenerates: 'Content',
            whyUsersPay: 'Value',
          },
          {
            pricePointAED: 29,
            expectedConversionRate: '3-5%',
            whyUsersPay: 'Value',
            churnLevel: 'Low',
            churnReason: 'Reason',
          },
          {
            intake: 'Input',
            aiProcessing: 'AI',
            gameLogic: 'Logic',
            output: 'Output',
            humanInterventionRequired: false,
          }
        );
      }).toThrow('Core game loop must have ≤ 3 steps');
    });

    it('should throw error for low ARPU', () => {
      expect(() => {
        crewAIOrchestrator.analyzeGameConcept(
          {
            gameConcept: 'Game',
            targetAudience: 'Audience',
            coreGameLoop: ['1', '2'],
            whatAIGenerates: 'Content',
            whyUsersPay: 'Value',
          },
          {
            pricePointAED: 15, // Below minimum ARPU
            expectedConversionRate: '3-5%',
            whyUsersPay: 'Value',
            churnLevel: 'Low',
            churnReason: 'Reason',
          },
          {
            intake: 'Input',
            aiProcessing: 'AI',
            gameLogic: 'Logic',
            output: 'Output',
            humanInterventionRequired: false,
          }
        );
      }).toThrow('ARPU must be >= AED 20/month');
    });
  });

  describe('generateReport', () => {
    it('should generate formatted report', () => {
      const analysis = crewAIOrchestrator.analyzeGameConcept(
        {
          gameConcept: 'Test Game',
          targetAudience: 'Test Audience',
          coreGameLoop: ['Step 1', 'Step 2'],
          whatAIGenerates: 'Test content',
          whyUsersPay: 'Test value',
        },
        {
          pricePointAED: 29,
          expectedConversionRate: '3-5%',
          whyUsersPay: 'Test value',
          churnLevel: 'Low',
          churnReason: 'Test reason',
        },
        {
          intake: 'Auto input',
          aiProcessing: 'AI generates content',
          gameLogic: 'Rules engine',
          output: 'Output',
          humanInterventionRequired: false,
        }
      );

      const report = crewAIOrchestrator.generateReport(analysis);

      expect(report).toContain('CREWAI GAME CONCEPT ANALYSIS');
      expect(report).toContain('AGENT 1: GAME CONCEPT SNIPER');
      expect(report).toContain('AGENT 2: GAME MONETIZATION ENFORCER');
      expect(report).toContain('AGENT 3: GAME AUTOMATION ARCHITECT');
      expect(report).toContain('AGENT 4: KILL-SWITCH GOVERNOR');
      expect(report).toContain('Analysis completed at:');
    });
  });

  describe('generateReferenceArchitecture', () => {
    it('should generate complete architecture', () => {
      const arch = crewAIOrchestrator.generateReferenceArchitecture();

      expect(arch.frontend).toBeDefined();
      expect(arch.frontend.purpose).toBe('display_and_interaction');
      expect(arch.frontend.tech).toContain('HTML');
      expect(arch.frontend.mobileFirst).toBe(true);

      expect(arch.backend).toBeDefined();
      expect(arch.backend.purpose).toBe('control_everything');
      expect(arch.backend.modules.userState).toBe(true);
      expect(arch.backend.modules.gameRulesEngine).toBe(true);

      expect(arch.aiContentEngine).toBeDefined();
      expect(arch.aiContentEngine.purpose).toBe('infinite_content_zero_effort');
      expect(arch.aiContentEngine.contentTypes.length).toBeGreaterThan(0);

      expect(arch.automationLayer).toBeDefined();
      expect(arch.automationLayer.scheduledJobs.dailyContentRefresh).toBe(true);
      expect(arch.automationLayer.noDashboardsInitially).toBe(true);

      expect(arch.payments).toBeDefined();
      expect(arch.payments.provider).toBe('Stripe');
      expect(arch.payments.model).toBe('monthly_subscription');
      expect(arch.payments.maxTrialDays).toBe(7);

      expect(arch.deployment).toBeDefined();
      expect(arch.deployment.opsLevel).toBe('zero');
    });
  });

  describe('formatArchitectureDoc', () => {
    it('should format architecture as documentation', () => {
      const arch = crewAIOrchestrator.generateReferenceArchitecture();
      const doc = crewAIOrchestrator.formatArchitectureDoc(arch);

      expect(doc).toContain('REFERENCE GAME ARCHITECTURE');
      expect(doc).toContain('FRONTEND (Thin Layer)');
      expect(doc).toContain('BACKEND (The Real Product)');
      expect(doc).toContain('AI CONTENT ENGINE');
      expect(doc).toContain('AUTOMATION LAYER');
      expect(doc).toContain('PAYMENTS');
      expect(doc).toContain('DEPLOYMENT');
    });
  });

  describe('getAllSystemPrompts', () => {
    it('should return all agent prompts', () => {
      const prompts = crewAIOrchestrator.getAllSystemPrompts();

      expect(prompts.conceptSniper).toContain('Game Concept Sniper');
      expect(prompts.monetizationEnforcer).toContain('Game Monetization Enforcer');
      expect(prompts.automationArchitect).toContain('Game Automation Architect');
      expect(prompts.killSwitchGovernor).toContain('Kill-Switch Governor');
    });
  });

  describe('getSampleAnalysis', () => {
    it('should return a complete sample analysis', () => {
      const sample = crewAIOrchestrator.getSampleAnalysis();

      expect(sample.concept).toBeDefined();
      expect(sample.monetization).toBeDefined();
      expect(sample.automation).toBeDefined();
      expect(sample.killSwitch).toBeDefined();
      expect(sample.architecture).toBeDefined();
      expect(sample.timestamp).toBeDefined();
    });
  });

  describe('singleton export', () => {
    it('should export crewAIOrchestrator singleton', () => {
      expect(crewAIOrchestrator).toBeInstanceOf(CrewAIOrchestrator);
    });
  });
});
