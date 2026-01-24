/**
 * Agent 4: 🛑 Kill-Switch Governor
 * 
 * Role: Kill-Switch Governor
 * 
 * Goal: Decide ruthlessly if the idea is worth your time.
 * 
 * Backstory: No emotions. No hype. Only scores.
 */

import {
  CrewAIAgent,
  KillSwitchScore,
  KillSwitchOutput,
  KillSwitchDecisionRule,
  GameConceptOutput,
  MonetizationOutput,
  AutomationOutput,
  DEFAULT_KILL_SWITCH_RULES,
} from '../../types/agents';

export class KillSwitchGovernor implements CrewAIAgent {
  public readonly role = 'Kill-Switch Governor';
  
  public readonly goal = 'Decide ruthlessly if the idea is worth your time.';
  
  public readonly backstory = 'No emotions. No hype. Only scores.';

  public readonly strictInstructions = [
    'Total score: 100 points',
    'Monetization Strength: 35 pts',
    'Automation & Content: 30 pts',
    'Retention Logic: 20 pts',
    'Execution Simplicity: 15 pts',
  ];

  public readonly autoRejectConditions = [
    'Score < 75 = KILL',
    'Score 75-84 = OPTIONAL TEST',
    'Score >= 85 = BUILD',
  ];

  public readonly decisionRules: KillSwitchDecisionRule = DEFAULT_KILL_SWITCH_RULES;

  /**
   * Score monetization strength (max 35 points)
   */
  public scoreMonetizationStrength(
    isPaidFirst: boolean,
    arpu: number,
    usersFor20k: number
  ): KillSwitchScore['monetizationStrength'] {
    let paidFirstModel = 0;
    let arpuThreshold = 0;
    let userThreshold = 0;

    // Paid-first model → 15 pts
    if (isPaidFirst) {
      paidFirstModel = 15;
    }

    // ARPU ≥ AED 20 → 10 pts
    if (arpu >= 20) {
      arpuThreshold = 10;
    }

    // ≤1,000 paid users for AED 20k → 10 pts
    if (usersFor20k <= 1000) {
      userThreshold = 10;
    }

    return {
      paidFirstModel,
      arpuThreshold,
      userThreshold,
      total: paidFirstModel + arpuThreshold + userThreshold,
    };
  }

  /**
   * Score automation & content (max 30 points)
   */
  public scoreAutomationContent(
    isAIGenerated: boolean,
    noManualUpdates: boolean,
    isSimpleLoop: boolean
  ): KillSwitchScore['automationContent'] {
    let aiGeneratedContent = 0;
    let noManualUpdatesScore = 0;
    let simpleLoop = 0;

    // AI-generated content → 15 pts
    if (isAIGenerated) {
      aiGeneratedContent = 15;
    }

    // No manual updates → 10 pts
    if (noManualUpdates) {
      noManualUpdatesScore = 10;
    }

    // Simple loop → 5 pts
    if (isSimpleLoop) {
      simpleLoop = 5;
    }

    return {
      aiGeneratedContent,
      noManualUpdates: noManualUpdatesScore,
      simpleLoop,
      total: aiGeneratedContent + noManualUpdatesScore + simpleLoop,
    };
  }

  /**
   * Score retention logic (max 20 points)
   */
  public scoreRetentionLogic(
    hasReturnTrigger: boolean,
    hasProgressionWithoutContent: boolean,
    noMultiplayerDependency: boolean
  ): KillSwitchScore['retentionLogic'] {
    let returnTrigger = 0;
    let progressionWithoutContent = 0;
    let noMultiplayerDep = 0;

    // Daily/weekly return trigger → 10 pts
    if (hasReturnTrigger) {
      returnTrigger = 10;
    }

    // Progression without new content → 5 pts
    if (hasProgressionWithoutContent) {
      progressionWithoutContent = 5;
    }

    // No multiplayer dependency → 5 pts
    if (noMultiplayerDependency) {
      noMultiplayerDep = 5;
    }

    return {
      returnTrigger,
      progressionWithoutContent,
      noMultiplayerDependency: noMultiplayerDep,
      total: returnTrigger + progressionWithoutContent + noMultiplayerDep,
    };
  }

  /**
   * Score execution simplicity (max 15 points)
   */
  public scoreExecutionSimplicity(
    isWebDeployable: boolean,
    noAppStoreDependency: boolean,
    isLowMaintenance: boolean
  ): KillSwitchScore['executionSimplicity'] {
    let webDeployable = 0;
    let noAppStore = 0;
    let lowMaintenance = 0;

    // Web deployable → 5 pts
    if (isWebDeployable) {
      webDeployable = 5;
    }

    // No app store dependency → 5 pts
    if (noAppStoreDependency) {
      noAppStore = 5;
    }

    // ≤2 hrs/week maintenance → 5 pts
    if (isLowMaintenance) {
      lowMaintenance = 5;
    }

    return {
      webDeployable,
      noAppStoreDependency: noAppStore,
      lowMaintenance,
      total: webDeployable + noAppStore + lowMaintenance,
    };
  }

  /**
   * Calculate full score
   */
  public calculateScore(
    monetizationParams: { isPaidFirst: boolean; arpu: number; usersFor20k: number },
    automationParams: { isAIGenerated: boolean; noManualUpdates: boolean; isSimpleLoop: boolean },
    retentionParams: { hasReturnTrigger: boolean; hasProgressionWithoutContent: boolean; noMultiplayerDependency: boolean },
    executionParams: { isWebDeployable: boolean; noAppStoreDependency: boolean; isLowMaintenance: boolean }
  ): KillSwitchScore {
    const monetizationStrength = this.scoreMonetizationStrength(
      monetizationParams.isPaidFirst,
      monetizationParams.arpu,
      monetizationParams.usersFor20k
    );

    const automationContent = this.scoreAutomationContent(
      automationParams.isAIGenerated,
      automationParams.noManualUpdates,
      automationParams.isSimpleLoop
    );

    const retentionLogic = this.scoreRetentionLogic(
      retentionParams.hasReturnTrigger,
      retentionParams.hasProgressionWithoutContent,
      retentionParams.noMultiplayerDependency
    );

    const executionSimplicity = this.scoreExecutionSimplicity(
      executionParams.isWebDeployable,
      executionParams.noAppStoreDependency,
      executionParams.isLowMaintenance
    );

    const finalScore = 
      monetizationStrength.total +
      automationContent.total +
      retentionLogic.total +
      executionSimplicity.total;

    return {
      monetizationStrength,
      automationContent,
      retentionLogic,
      executionSimplicity,
      finalScore,
    };
  }

  /**
   * Make decision based on score
   */
  public makeDecision(score: number): 'BUILD' | 'OPTIONAL_TEST' | 'KILL' {
    if (score >= this.decisionRules.buildThreshold) {
      return 'BUILD';
    } else if (score >= this.decisionRules.optionalTestMin) {
      return 'OPTIONAL_TEST';
    } else {
      return 'KILL';
    }
  }

  /**
   * Generate full analysis output
   */
  public analyze(
    monetizationParams: { isPaidFirst: boolean; arpu: number; usersFor20k: number },
    automationParams: { isAIGenerated: boolean; noManualUpdates: boolean; isSimpleLoop: boolean },
    retentionParams: { hasReturnTrigger: boolean; hasProgressionWithoutContent: boolean; noMultiplayerDependency: boolean },
    executionParams: { isWebDeployable: boolean; noAppStoreDependency: boolean; isLowMaintenance: boolean },
    justificationContext: string
  ): KillSwitchOutput {
    const score = this.calculateScore(
      monetizationParams,
      automationParams,
      retentionParams,
      executionParams
    );

    const decision = this.makeDecision(score.finalScore);

    let justification = '';
    if (decision === 'BUILD') {
      justification = `Score of ${score.finalScore}/100 exceeds BUILD threshold (≥85). ${justificationContext} ` +
        `Strong monetization (${score.monetizationStrength.total}/35), solid automation (${score.automationContent.total}/30), ` +
        `good retention logic (${score.retentionLogic.total}/20), and simple execution (${score.executionSimplicity.total}/15). ` +
        `Proceed with development.`;
    } else if (decision === 'OPTIONAL_TEST') {
      justification = `Score of ${score.finalScore}/100 falls in OPTIONAL TEST range (75-84). ${justificationContext} ` +
        `Consider a minimal prototype to validate assumptions. Key areas to improve: ` +
        `${score.monetizationStrength.total < 30 ? 'monetization, ' : ''}` +
        `${score.automationContent.total < 25 ? 'automation, ' : ''}` +
        `${score.retentionLogic.total < 15 ? 'retention, ' : ''}` +
        `${score.executionSimplicity.total < 12 ? 'execution simplicity' : ''}`.replace(/, $/, '.');
    } else {
      justification = `Score of ${score.finalScore}/100 falls below KILL threshold (<75). ${justificationContext} ` +
        `Not worth pursuing in current form. Major issues: ` +
        `${score.monetizationStrength.total < 25 ? 'weak monetization, ' : ''}` +
        `${score.automationContent.total < 20 ? 'insufficient automation, ' : ''}` +
        `${score.retentionLogic.total < 10 ? 'poor retention logic, ' : ''}` +
        `${score.executionSimplicity.total < 10 ? 'complex execution' : ''}`.replace(/, $/, '.');
    }

    return {
      score,
      decision,
      justification,
    };
  }

  /**
   * Analyze from other agent outputs
   */
  public analyzeFromAgentOutputs(
    concept: GameConceptOutput,
    monetization: MonetizationOutput,
    automation: AutomationOutput
  ): KillSwitchOutput {
    // Extract parameters from agent outputs
    const monetizationParams = {
      isPaidFirst: true, // Assumed since ads not allowed
      arpu: monetization.pricePointAED,
      usersFor20k: monetization.paidUsersFor20kAED,
    };

    const automationParams = {
      isAIGenerated: automation.automationScore >= 80,
      noManualUpdates: !automation.humanInterventionRequired.required,
      isSimpleLoop: concept.coreGameLoop.length <= 3,
    };

    const retentionParams = {
      hasReturnTrigger: true, // Daily puzzles/challenges create return triggers
      hasProgressionWithoutContent: true, // AI generates content
      noMultiplayerDependency: true, // Single-player requirement
    };

    const executionParams = {
      isWebDeployable: true, // Web-first requirement
      noAppStoreDependency: true, // Web-first requirement
      isLowMaintenance: automation.automationScore >= 80,
    };

    const justificationContext = `Game concept targets ${concept.targetAudience} ` +
      `with ${concept.coreGameLoop.length}-step core loop. ` +
      `Monetization at AED ${monetization.pricePointAED}/month requires ${monetization.paidUsersFor20kAED} users for AED 20k target. ` +
      `Automation score: ${automation.automationScore}%.`;

    return this.analyze(
      monetizationParams,
      automationParams,
      retentionParams,
      executionParams,
      justificationContext
    );
  }

  /**
   * Format output according to expected format
   */
  public formatOutput(output: KillSwitchOutput): string {
    const score = output.score;
    
    return `FINAL SCORE: ${score.finalScore}/100

BREAKDOWN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Monetization Strength: ${score.monetizationStrength.total}/35
   - Paid-first model: ${score.monetizationStrength.paidFirstModel}/15
   - ARPU ≥ AED 20: ${score.monetizationStrength.arpuThreshold}/10
   - ≤1,000 users for AED 20k: ${score.monetizationStrength.userThreshold}/10

2️⃣ Automation & Content: ${score.automationContent.total}/30
   - AI-generated content: ${score.automationContent.aiGeneratedContent}/15
   - No manual updates: ${score.automationContent.noManualUpdates}/10
   - Simple loop: ${score.automationContent.simpleLoop}/5

3️⃣ Retention Logic: ${score.retentionLogic.total}/20
   - Daily/weekly return trigger: ${score.retentionLogic.returnTrigger}/10
   - Progression without new content: ${score.retentionLogic.progressionWithoutContent}/5
   - No multiplayer dependency: ${score.retentionLogic.noMultiplayerDependency}/5

4️⃣ Execution Simplicity: ${score.executionSimplicity.total}/15
   - Web deployable: ${score.executionSimplicity.webDeployable}/5
   - No app store dependency: ${score.executionSimplicity.noAppStoreDependency}/5
   - ≤2 hrs/week maintenance: ${score.executionSimplicity.lowMaintenance}/5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GO / NO-GO: ${output.decision}

ONE-PARAGRAPH JUSTIFICATION:
${output.justification}`;
  }

  /**
   * Get the system prompt for AI integration
   */
  public getSystemPrompt(): string {
    return `You are the ${this.role}.

${this.goal}

BACKSTORY:
${this.backstory}

SCORING RULES (MANDATORY):
Total: 100 points

1️⃣ Monetization Strength — 35 pts
   - Paid-first model → 15
   - ARPU ≥ AED 20 → 10
   - ≤1,000 paid users for AED 20k → 10

2️⃣ Automation & Content — 30 pts
   - AI-generated content → 15
   - No manual updates → 10
   - Simple loop → 5

3️⃣ Retention Logic — 20 pts
   - Daily/weekly return trigger → 10
   - Progression without new content → 5
   - No multiplayer dependency → 5

4️⃣ Execution Simplicity — 15 pts
   - Web deployable → 5
   - No app store dependency → 5
   - ≤2 hrs/week maintenance → 5

Decision Rule:
- ≥85 → BUILD
- 75–84 → OPTIONAL TEST
- <75 → KILL

Expected Output:
FINAL SCORE:
GO / NO-GO:
ONE-PARAGRAPH JUSTIFICATION:

Remember: No emotions. No hype. Only scores.`;
  }
}

export const killSwitchGovernor = new KillSwitchGovernor();
