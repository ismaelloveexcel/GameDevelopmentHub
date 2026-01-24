/**
 * CrewAI Game Development Agents - Orchestration Service
 * 
 * This service orchestrates the 4 specialized agents for game concept validation:
 * 1. 🎯 Game Concept Sniper - Identifies viable game concepts
 * 2. 💰 Game Monetization Enforcer - Validates monetization path
 * 3. ⚙️ Game Automation Architect - Ensures automated operation
 * 4. 🛑 Kill-Switch Governor - Final decision maker
 * 
 * System Philosophy:
 * - Games are products, not art projects
 * - Monetization > virality
 * - Automation > engagement tricks
 * - Small paid audiences > massive free users
 */

import { gameConceptSniper, GameConceptSniper } from './GameConceptSniper';
import { gameMonetizationEnforcer, GameMonetizationEnforcer } from './GameMonetizationEnforcer';
import { gameAutomationArchitect, GameAutomationArchitect } from './GameAutomationArchitect';
import { killSwitchGovernor, KillSwitchGovernor } from './KillSwitchGovernor';
import {
  GameConceptAnalysis,
  GameArchitecture,
} from '../../types/agents';

export interface GameConceptInput {
  gameConcept: string;
  targetAudience: string;
  coreGameLoop: string[];
  whatAIGenerates: string;
  whyUsersPay: string;
}

export interface MonetizationInput {
  pricePointAED: number;
  expectedConversionRate: string;
  whyUsersPay: string;
  churnLevel: 'Low' | 'Medium' | 'High';
  churnReason: string;
}

export interface AutomationInput {
  intake: string;
  aiProcessing: string;
  gameLogic: string;
  output: string;
  humanInterventionRequired: boolean;
  humanInterventionReason?: string;
}

export class CrewAIOrchestrator {
  public readonly conceptSniper: GameConceptSniper;
  public readonly monetizationEnforcer: GameMonetizationEnforcer;
  public readonly automationArchitect: GameAutomationArchitect;
  public readonly killSwitchGovernor: KillSwitchGovernor;

  constructor() {
    this.conceptSniper = gameConceptSniper;
    this.monetizationEnforcer = gameMonetizationEnforcer;
    this.automationArchitect = gameAutomationArchitect;
    this.killSwitchGovernor = killSwitchGovernor;
  }

  /**
   * Run full game concept analysis through all 4 agents
   */
  private validateGameConceptInput(conceptInput: GameConceptInput): void {
    if (!conceptInput) {
      throw new Error('conceptInput is required for game concept analysis.');
    }

    const { gameConcept, targetAudience, coreGameLoop, whatAIGenerates, whyUsersPay } = conceptInput;

    if (!Array.isArray(coreGameLoop)) {
      throw new Error('coreGameLoop must be an array of steps.');
    }

    if (coreGameLoop.length === 0) {
      throw new Error('coreGameLoop must contain at least one step.');
    }

    // GameConceptSniper expects at most 3 steps in the coreGameLoop.
    if (coreGameLoop.length > 3) {
      throw new Error('coreGameLoop must contain at most 3 steps to satisfy GameConceptSniper requirements.');
    }

    if (!gameConcept || !gameConcept.trim()) {
      throw new Error('gameConcept is required and cannot be empty.');
    }

    if (!targetAudience || !targetAudience.trim()) {
      throw new Error('targetAudience is required and cannot be empty.');
    }

    if (!whatAIGenerates || !whatAIGenerates.trim()) {
      throw new Error('whatAIGenerates is required and cannot be empty.');
    }

    if (!whyUsersPay || !whyUsersPay.trim()) {
      throw new Error('whyUsersPay is required and cannot be empty.');
    }
  }

  public analyzeGameConcept(
    conceptInput: GameConceptInput,
    monetizationInput: MonetizationInput,
    automationInput: AutomationInput
  ): GameConceptAnalysis {
    // Validate inputs against agent requirements before processing
    this.validateGameConceptInput(conceptInput);

    try {
      // Agent 1: Game Concept Sniper
      const concept = this.conceptSniper.analyzeGameConcept(
        conceptInput.gameConcept,
        conceptInput.targetAudience,
        conceptInput.coreGameLoop,
        conceptInput.whatAIGenerates,
        conceptInput.whyUsersPay
      );

      // Agent 2: Game Monetization Enforcer
      const monetization = this.monetizationEnforcer.analyzeMonetization(
        monetizationInput.pricePointAED,
        monetizationInput.expectedConversionRate,
        monetizationInput.whyUsersPay,
        monetizationInput.churnLevel,
        monetizationInput.churnReason
      );

      // Agent 3: Game Automation Architect
      const automation = this.automationArchitect.analyzeAutomation(
        automationInput.intake,
        automationInput.aiProcessing,
        automationInput.gameLogic,
        automationInput.output,
        automationInput.humanInterventionRequired,
        automationInput.humanInterventionReason
      );

      // Agent 4: Kill-Switch Governor
      const killSwitch = this.killSwitchGovernor.analyzeFromAgentOutputs(
        concept,
        monetization,
        automation
      );

      // Generate reference architecture
      const architecture = this.generateReferenceArchitecture();

      return {
        concept,
        monetization,
        automation,
        killSwitch,
        architecture,
        timestamp: new Date(),
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to analyze game concept: ${message}`);
    }
  }

  /**
   * Generate full formatted report
   */
  public generateReport(analysis: GameConceptAnalysis): string {
    const sections = [
      '═══════════════════════════════════════════════════════════════════',
      '                    CREWAI GAME CONCEPT ANALYSIS                    ',
      '═══════════════════════════════════════════════════════════════════',
      '',
      '🎯 AGENT 1: GAME CONCEPT SNIPER',
      '───────────────────────────────────────────────────────────────────',
      this.conceptSniper.formatOutput(analysis.concept),
      '',
      '💰 AGENT 2: GAME MONETIZATION ENFORCER',
      '───────────────────────────────────────────────────────────────────',
      this.monetizationEnforcer.formatOutput(analysis.monetization),
      '',
      '⚙️ AGENT 3: GAME AUTOMATION ARCHITECT',
      '───────────────────────────────────────────────────────────────────',
      this.automationArchitect.formatOutput(analysis.automation),
      '',
      '🛑 AGENT 4: KILL-SWITCH GOVERNOR',
      '───────────────────────────────────────────────────────────────────',
      this.killSwitchGovernor.formatOutput(analysis.killSwitch),
      '',
      '═══════════════════════════════════════════════════════════════════',
      `Analysis completed at: ${analysis.timestamp.toISOString()}`,
      '═══════════════════════════════════════════════════════════════════',
    ];

    return sections.join('\n');
  }

  /**
   * Generate reference game architecture
   */
  public generateReferenceArchitecture(): GameArchitecture {
    return {
      frontend: {
        purpose: 'display_and_interaction',
        tech: ['HTML', 'CSS', 'JS', 'React'],
        features: {
          login: 'magic_link',
          gameScreen: true,
          progressIndicator: true,
          paywallGate: true,
        },
        mobileFirst: true,
        complexState: false,
      },
      backend: {
        purpose: 'control_everything',
        modules: {
          userState: true,
          gameRulesEngine: true,
          scoringProgression: true,
          subscriptionValidation: true,
        },
      },
      aiContentEngine: {
        purpose: 'infinite_content_zero_effort',
        pattern: {
          promptTemplate: true,
          constraints: true,
          generateDaily: true,
          generateOnDemand: true,
          cacheResults: true,
        },
        contentTypes: ['trivia', 'puzzles', 'challenges', 'scenarios'],
      },
      automationLayer: {
        scheduledJobs: {
          dailyContentRefresh: true,
          difficultyScaling: true,
          contentExpiry: true,
          emailReminders: true,
        },
        noDashboardsInitially: true,
      },
      payments: {
        provider: 'Stripe',
        model: 'monthly_subscription',
        optionalPacks: true,
        maxTrialDays: 7,
      },
      deployment: {
        frontend: 'Vercel',
        backend: 'serverless',
        automation: 'cron_based',
        opsLevel: 'zero',
      },
    };
  }

  /**
   * Format architecture as documentation
   */
  public formatArchitectureDoc(arch: GameArchitecture): string {
    return `
REFERENCE GAME ARCHITECTURE (WEB · AI · ZERO-TOUCH)
═══════════════════════════════════════════════════════════════════

This is not theoretical. This is the simplest architecture that works.

1️⃣ FRONTEND (Thin Layer)
─────────────────────────
Purpose: Display + interaction only

Tech:
- ${arch.frontend.tech.join(' / ')}
- Mobile-first responsive
- No complex state

Features:
- Login (${arch.frontend.features.login})
- Game screen
- Progress indicator
- Paywall / subscription gate

2️⃣ BACKEND (The Real Product)
─────────────────────────────
Purpose: Control everything

Core Modules:
- User state (progress, streaks)
- Game rules engine
- Scoring / progression
- Subscription validation

3️⃣ AI CONTENT ENGINE (Stateless)
─────────────────────────────────
Purpose: Infinite content, zero effort

Pattern:
- Prompt template + constraints
- Generate content daily or on demand
- Cache results (avoid re-generation costs)

Content Examples:
${arch.aiContentEngine.contentTypes.map(t => `- ${t.charAt(0).toUpperCase() + t.slice(1)}`).join('\n')}

4️⃣ AUTOMATION LAYER (Critical)
───────────────────────────────
Scheduled Jobs:
- Daily content refresh
- Difficulty scaling
- Expiry of old content
- Email reminders (optional)

No dashboards needed initially.

5️⃣ PAYMENTS (Simple)
────────────────────
- ${arch.payments.provider} / Paddle
- Monthly subscription
- Optional packs
- No trials longer than ${arch.payments.maxTrialDays} days

6️⃣ DEPLOYMENT (Zero Ops)
─────────────────────────
- Static frontend (GitHub Pages / ${arch.deployment.frontend})
- Backend on lightweight API (${arch.deployment.backend})
- Cron-based automation

═══════════════════════════════════════════════════════════════════
`;
  }

  /**
   * Get all agent system prompts for AI integration
   */
  public getAllSystemPrompts(): {
    conceptSniper: string;
    monetizationEnforcer: string;
    automationArchitect: string;
    killSwitchGovernor: string;
  } {
    return {
      conceptSniper: this.conceptSniper.getSystemPrompt(),
      monetizationEnforcer: this.monetizationEnforcer.getSystemPrompt(),
      automationArchitect: this.automationArchitect.getSystemPrompt(),
      killSwitchGovernor: this.killSwitchGovernor.getSystemPrompt(),
    };
  }

  /**
   * Get sample complete analysis
   */
  public getSampleAnalysis(): GameConceptAnalysis {
    const sampleConcept = this.conceptSniper.getSampleConcepts()[0];
    const sampleMonetization = this.monetizationEnforcer.getSampleStrategies()[0];
    const sampleAutomation = this.automationArchitect.getSampleArchitectures()[0];
    const killSwitchOutput = this.killSwitchGovernor.analyzeFromAgentOutputs(
      sampleConcept,
      sampleMonetization,
      sampleAutomation
    );

    return {
      concept: sampleConcept,
      monetization: sampleMonetization,
      automation: sampleAutomation,
      killSwitch: killSwitchOutput,
      architecture: this.generateReferenceArchitecture(),
      timestamp: new Date(),
    };
  }
}

export const crewAIOrchestrator = new CrewAIOrchestrator();

// Re-export individual agents
export { gameConceptSniper } from './GameConceptSniper';
export { gameMonetizationEnforcer } from './GameMonetizationEnforcer';
export { gameAutomationArchitect } from './GameAutomationArchitect';
export { killSwitchGovernor } from './KillSwitchGovernor';
