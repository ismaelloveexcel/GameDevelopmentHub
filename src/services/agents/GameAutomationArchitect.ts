/**
 * Agent 3: ⚙️ Game Automation Architect
 * 
 * Role: Game Automation Architect
 * 
 * Goal: Ensure the game runs end-to-end with no daily human involvement.
 * 
 * Backstory: Backend-first engineer. Prefers boring systems that print money.
 */

import {
  CrewAIAgent,
  AutomationOutput,
  AutomationValidation,
} from '../../types/agents';

export class GameAutomationArchitect implements CrewAIAgent {
  public readonly role = 'Game Automation Architect';
  
  public readonly goal = 
    'Ensure the game runs end-to-end with no daily human involvement.';
  
  public readonly backstory = 
    'Backend-first engineer. Prefers boring systems that print money.';

  public readonly strictInstructions = [
    'Must automate: Content generation',
    'Must automate: Difficulty scaling',
    'Must automate: Refresh cadence',
    'Manual moderation = FAIL',
  ];

  public readonly autoRejectConditions = [
    'Automation < 80%',
    'Requires frequent releases',
  ];

  public readonly minimumAutomationScore = 80;

  /**
   * Calculate automation score
   */
  public calculateAutomationScore(validation: AutomationValidation): number {
    let score = 0;

    // Content generation automated (25 points)
    if (validation.contentGenerationAutomated) {
      score += 25;
    }

    // Difficulty scaling automated (25 points)
    if (validation.difficultyScalingAutomated) {
      score += 25;
    }

    // Refresh cadence automated (25 points)
    if (validation.refreshCadenceAutomated) {
      score += 25;
    }

    // No manual moderation (15 points)
    if (!validation.manualModerationRequired) {
      score += 15;
    }

    // No frequent releases required (10 points)
    if (!validation.requiresFrequentReleases) {
      score += 10;
    }

    return score;
  }

  /**
   * Validate automation requirements
   */
  public validateAutomation(validation: AutomationValidation): {
    isValid: boolean;
    rejectionReasons: string[];
    automationScore: number;
  } {
    const rejectionReasons: string[] = [];
    const automationScore = this.calculateAutomationScore(validation);

    // Check automation percentage
    if (automationScore < this.minimumAutomationScore) {
      rejectionReasons.push(
        `AUTO-REJECT: Automation score ${automationScore}% < ${this.minimumAutomationScore}% minimum`
      );
    }

    // Check for manual moderation
    if (validation.manualModerationRequired) {
      rejectionReasons.push('FAIL: Manual moderation required');
    }

    // Check for frequent releases
    if (validation.requiresFrequentReleases) {
      rejectionReasons.push('AUTO-REJECT: Requires frequent releases');
    }

    // Check individual automation requirements
    if (!validation.contentGenerationAutomated) {
      rejectionReasons.push('Content generation must be automated');
    }

    if (!validation.difficultyScalingAutomated) {
      rejectionReasons.push('Difficulty scaling must be automated');
    }

    if (!validation.refreshCadenceAutomated) {
      rejectionReasons.push('Refresh cadence must be automated');
    }

    return {
      isValid: rejectionReasons.length === 0,
      rejectionReasons,
      automationScore,
    };
  }

  /**
   * Analyze automation and generate output
   */
  public analyzeAutomation(
    intake: string,
    aiProcessing: string,
    gameLogic: string,
    output: string,
    humanInterventionRequired: boolean,
    humanInterventionReason: string = 'None required'
  ): AutomationOutput {
    // Calculate automation score based on description analysis
    const automationScore = this.estimateAutomationScore(
      intake,
      aiProcessing,
      gameLogic,
      humanInterventionRequired
    );

    if (automationScore < this.minimumAutomationScore) {
      throw new Error(
        `Automation score ${automationScore}% is below minimum ${this.minimumAutomationScore}%`
      );
    }

    return {
      intake,
      aiProcessing,
      gameLogic,
      output,
      automationScore,
      humanInterventionRequired: {
        required: humanInterventionRequired,
        reason: humanInterventionReason,
      },
    };
  }

  /**
   * Estimate automation score from descriptions
   */
  private estimateAutomationScore(
    intake: string,
    aiProcessing: string,
    gameLogic: string,
    humanInterventionRequired: boolean
  ): number {
    let score = 0;

    // Check intake automation keywords
    const intakeLower = intake.toLowerCase();
    if (intakeLower.indexOf('auto') >= 0 || intakeLower.indexOf('input') >= 0 || intakeLower.indexOf('api') >= 0) {
      score += 20;
    }

    // Check AI processing keywords
    const aiLower = aiProcessing.toLowerCase();
    if (aiLower.indexOf('ai') >= 0 || aiLower.indexOf('generate') >= 0 || aiLower.indexOf('llm') >= 0 || aiLower.indexOf('automatic') >= 0) {
      score += 30;
    }

    // Check game logic keywords
    const logicLower = gameLogic.toLowerCase();
    if (logicLower.indexOf('rule') >= 0 || logicLower.indexOf('algorithm') >= 0 || logicLower.indexOf('calculate') >= 0) {
      score += 25;
    }

    // Human intervention penalty
    if (humanInterventionRequired) {
      score -= 20;
    } else {
      score += 25;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Format output according to expected format
   */
  public formatOutput(output: AutomationOutput): string {
    return `INTAKE (player input):
${output.intake}

AI PROCESSING:
${output.aiProcessing}

GAME LOGIC (rules-based):
${output.gameLogic}

OUTPUT (what player sees):
${output.output}

AUTOMATION SCORE (%):
${output.automationScore}%

ANY HUMAN INTERVENTION REQUIRED (${output.humanInterventionRequired.required ? 'Yes' : 'No'}):
${output.humanInterventionRequired.reason}`;
  }

  /**
   * Generate sample automation architectures
   */
  public getSampleArchitectures(): AutomationOutput[] {
    return [
      {
        intake: 'User session data: difficulty level, performance history, time of day, streak count',
        aiProcessing: 'LLM generates puzzle content based on difficulty tier; prompt includes constraints for complexity, time-to-solve, and topic variety',
        gameLogic: 'Rules engine validates puzzle correctness, calculates score, updates streak, adjusts difficulty tier based on rolling 7-day performance',
        output: 'Rendered puzzle, timer, hint system, score animation, progress dashboard, streak badge',
        automationScore: 95,
        humanInterventionRequired: {
          required: false,
          reason: 'Fully automated pipeline - content generation, difficulty scaling, and refresh all run on scheduled jobs',
        },
      },
      {
        intake: 'User vocabulary level assessment, learning goals, session history, spaced repetition data',
        aiProcessing: 'AI generates contextual sentences, selects words from appropriate difficulty tier, creates distractor options',
        gameLogic: 'Spaced repetition algorithm schedules reviews, scoring system tracks mastery, progression unlocks new word categories',
        output: 'Word challenge cards, progress meters, mastery certificates, personalized statistics',
        automationScore: 92,
        humanInterventionRequired: {
          required: false,
          reason: 'Word banks are pre-curated but AI generates all dynamic content; no ongoing content creation needed',
        },
      },
      {
        intake: 'User math skill level, topic preferences, performance data, time constraints',
        aiProcessing: 'AI generates number problems within skill band, creates step-by-step solutions, generates hints at multiple levels',
        gameLogic: 'Adaptive difficulty engine, scoring with partial credit, topic rotation for variety',
        output: 'Math challenge interface, working space, hint reveals, detailed solutions, progress reports',
        automationScore: 88,
        humanInterventionRequired: {
          required: false,
          reason: 'All content generation and difficulty adjustment fully automated via AI and rules engine',
        },
      },
    ];
  }

  /**
   * Get automation checklist for implementation
   */
  public getAutomationChecklist(): {
    required: string[];
    recommended: string[];
  } {
    return {
      required: [
        'Content generation via AI/algorithms',
        'Difficulty scaling based on user performance',
        'Automated content refresh (daily/on-demand)',
        'No manual content moderation',
        'Scheduled jobs for maintenance tasks',
        'Automated user state management',
      ],
      recommended: [
        'Caching layer to reduce AI generation costs',
        'Content pre-generation during off-peak hours',
        'Automated error recovery and retry logic',
        'Monitoring and alerting without manual dashboards',
        'Automated backup and recovery',
        'Rate limiting and abuse prevention',
      ],
    };
  }

  /**
   * Get the system prompt for AI integration
   */
  public getSystemPrompt(): string {
    return `You are the ${this.role}.

${this.goal}

BACKSTORY:
${this.backstory}

STRICT INSTRUCTIONS (non-negotiable):
Must automate:
${this.strictInstructions.slice(0, 3).map(i => `- ${i.replace('Must automate: ', '')}`).join('\n')}

${this.strictInstructions[3]}

Auto-kill if:
${this.autoRejectConditions.map(c => `- ${c}`).join('\n')}

Expected Output (exact format):
INTAKE (player input):
AI PROCESSING:
GAME LOGIC (rules-based):
OUTPUT (what player sees):
AUTOMATION SCORE (%):
ANY HUMAN INTERVENTION REQUIRED (Yes/No + why):

Remember: Prefer boring systems that print money. No daily human involvement.`;
  }
}

export const gameAutomationArchitect = new GameAutomationArchitect();
