/**
 * Agent 2: 💰 Game Monetization Enforcer
 * 
 * Role: Game Monetization Enforcer
 * 
 * Goal: Prove a realistic path to AED 10k–20k/month with a small, paid user base.
 * 
 * Backstory: Commercial realist. Kills "fun but broke" ideas.
 * Optimizes for ARPU, not downloads.
 */

import {
  CrewAIAgent,
  MonetizationModel,
  MonetizationOutput,
  MonetizationValidation,
} from '../../types/agents';

export class GameMonetizationEnforcer implements CrewAIAgent {
  public readonly role = 'Game Monetization Enforcer';
  
  public readonly goal = 
    'Prove a realistic path to AED 10k–20k/month with a small, paid user base.';
  
  public readonly backstory = 
    'Commercial realist. Kills "fun but broke" ideas. Optimizes for ARPU, not downloads.';

  public readonly strictInstructions = [
    'Monetization must be one of: Subscription, Paid unlocks/packs, B2B/licensing',
    'Ads are NOT allowed',
    'Must show math clearly',
  ];

  public readonly autoRejectConditions = [
    'Needs >5,000 MAU',
    'ARPU < AED 20/month',
    'Monetization is "later"',
  ];

  public readonly allowedMonetizationModels: MonetizationModel[] = [
    'subscription',
    'paid_unlocks',
    'b2b_licensing',
  ];

  /**
   * Calculate required paid users for target revenue
   */
  public calculateRequiredUsers(targetRevenueAED: number, pricePointAED: number): number {
    if (pricePointAED <= 0) {
      throw new Error('Price point must be greater than 0');
    }
    return Math.ceil(targetRevenueAED / pricePointAED);
  }

  /**
   * Calculate ARPU (Average Revenue Per User)
   */
  public calculateARPU(monthlyRevenue: number, paidUsers: number): number {
    if (paidUsers <= 0) {
      throw new Error('Paid users must be greater than 0');
    }
    return monthlyRevenue / paidUsers;
  }

  /**
   * Check if monetization model is allowed
   */
  private isAllowedModel(model: MonetizationModel): boolean {
    return this.allowedMonetizationModels.includes(model);
  }

  /**
   * Validate monetization strategy
   */
  public validateMonetization(validation: MonetizationValidation): {
    isValid: boolean;
    rejectionReasons: string[];
  } {
    const rejectionReasons: string[] = [];

    // Check monetization model
    if (!this.isAllowedModel(validation.model)) {
      rejectionReasons.push(`Invalid monetization model. Allowed: ${this.allowedMonetizationModels.join(', ')}`);
    }

    // Check for ads
    if (validation.usesAds === true) {
      rejectionReasons.push('AUTO-REJECT: Ads are not allowed');
    }

    // Check MAU requirement
    if (validation.requiredMAU > 5000) {
      rejectionReasons.push(`AUTO-REJECT: Needs >5,000 MAU (${validation.requiredMAU} required)`);
    }

    // Check ARPU
    if (validation.arpu < 20) {
      rejectionReasons.push(`AUTO-REJECT: ARPU < AED 20/month (current: AED ${validation.arpu})`);
    }

    // Check if monetization plan exists
    if (validation.hasMonetizationPlan === false) {
      rejectionReasons.push('AUTO-REJECT: Monetization is "later" - must have clear plan');
    }

    return {
      isValid: rejectionReasons.length === 0,
      rejectionReasons,
    };
  }

  /**
   * Analyze monetization and generate output
   */
  public analyzeMonetization(
    pricePointAED: number,
    expectedConversionRate: string,
    whyUsersPay: string,
    churnLevel: 'Low' | 'Medium' | 'High',
    churnReason: string
  ): MonetizationOutput {
    const paidUsersFor10k = this.calculateRequiredUsers(10000, pricePointAED);
    const paidUsersFor20k = this.calculateRequiredUsers(20000, pricePointAED);

    // Validate against auto-reject conditions
    const arpu = pricePointAED; // In subscription model, ARPU = price point
    
    if (arpu < 20) {
      throw new Error(`ARPU must be >= AED 20/month. Current: AED ${arpu}`);
    }

    if (paidUsersFor20k > 1000) {
      console.warn(`Warning: Requires ${paidUsersFor20k} users for AED 20k. Consider higher price point.`);
    }

    return {
      pricePointAED,
      paidUsersFor10kAED: paidUsersFor10k,
      paidUsersFor20kAED: paidUsersFor20k,
      expectedConversionRate,
      whyUsersPay,
      churnRisk: {
        level: churnLevel,
        reason: churnReason,
      },
    };
  }

  /**
   * Format output according to expected format
   */
  public formatOutput(output: MonetizationOutput): string {
    return `PRICE POINT (AED):
${output.pricePointAED}

PAID USERS NEEDED FOR 10k AED:
${output.paidUsersFor10kAED}

PAID USERS NEEDED FOR 20k AED:
${output.paidUsersFor20kAED}

EXPECTED CONVERSION RATE:
${output.expectedConversionRate}

WHY USERS WILL PAY CONSISTENTLY:
${output.whyUsersPay}

CHURN RISK (${output.churnRisk.level}):
${output.churnRisk.reason}`;
  }

  /**
   * Generate sample monetization strategies
   */
  public getSampleStrategies(): MonetizationOutput[] {
    return [
      {
        pricePointAED: 29,
        paidUsersFor10kAED: 345,
        paidUsersFor20kAED: 690,
        expectedConversionRate: '3-5% of engaged free users',
        whyUsersPay: 'Daily mental challenge becomes habit, tracked progress creates investment, premium features (no ads, unlimited puzzles, statistics) provide clear value',
        churnRisk: {
          level: 'Low',
          reason: 'Habit-forming daily engagement, progress tracking creates switching cost, low price point reduces cancellation friction',
        },
      },
      {
        pricePointAED: 49,
        paidUsersFor10kAED: 205,
        paidUsersFor20kAED: 409,
        expectedConversionRate: '2-4% of trial users',
        whyUsersPay: 'Measurable skill improvement for professional/educational goals, certificate of completion, personalized learning path',
        churnRisk: {
          level: 'Medium',
          reason: 'Users may churn after achieving specific goals - mitigate with continuous new challenge categories',
        },
      },
      {
        pricePointAED: 99,
        paidUsersFor10kAED: 102,
        paidUsersFor20kAED: 203,
        expectedConversionRate: '1-2% of B2B leads',
        whyUsersPay: 'Corporate training budget allocation, team progress tracking, compliance/certification requirements',
        churnRisk: {
          level: 'Low',
          reason: 'B2B contracts typically annual, switching costs high, budget already allocated',
        },
      },
    ];
  }

  /**
   * Get recommended price points for target revenue
   */
  public getRecommendedPricePoints(targetMonthlyRevenue: number): {
    conservative: { price: number; users: number };
    moderate: { price: number; users: number };
    premium: { price: number; users: number };
  } {
    return {
      conservative: {
        price: 25,
        users: this.calculateRequiredUsers(targetMonthlyRevenue, 25),
      },
      moderate: {
        price: 49,
        users: this.calculateRequiredUsers(targetMonthlyRevenue, 49),
      },
      premium: {
        price: 99,
        users: this.calculateRequiredUsers(targetMonthlyRevenue, 99),
      },
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
${this.strictInstructions.map(i => `- ${i}`).join('\n')}

Auto-kill if:
${this.autoRejectConditions.map(c => `- ${c}`).join('\n')}

Expected Output (exact format):
PRICE POINT (AED):
PAID USERS NEEDED FOR 10k AED:
PAID USERS NEEDED FOR 20k AED:
EXPECTED CONVERSION RATE:
WHY USERS WILL PAY CONSISTENTLY:
CHURN RISK (Low/Medium/High + why):

Remember: Kill "fun but broke" ideas. Optimize for ARPU, not downloads.`;
  }
}

export const gameMonetizationEnforcer = new GameMonetizationEnforcer();
