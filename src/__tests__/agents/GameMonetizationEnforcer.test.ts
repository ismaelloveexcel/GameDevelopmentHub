import { gameMonetizationEnforcer } from '../../services/agents/GameMonetizationEnforcer';

describe('GameMonetizationEnforcer', () => {
  describe('agent properties', () => {
    it('should have correct role', () => {
      expect(gameMonetizationEnforcer.role).toBe('Game Monetization Enforcer');
    });

    it('should have defined goal', () => {
      expect(gameMonetizationEnforcer.goal).toContain('AED 10k–20k/month');
      expect(gameMonetizationEnforcer.goal).toContain('paid user base');
    });

    it('should have strict instructions', () => {
      expect(gameMonetizationEnforcer.strictInstructions.length).toBeGreaterThan(0);
      expect(gameMonetizationEnforcer.strictInstructions).toContain('Ads are NOT allowed');
    });

    it('should have allowed monetization models', () => {
      expect(gameMonetizationEnforcer.allowedMonetizationModels).toContain('subscription');
      expect(gameMonetizationEnforcer.allowedMonetizationModels).toContain('paid_unlocks');
      expect(gameMonetizationEnforcer.allowedMonetizationModels).toContain('b2b_licensing');
    });
  });

  describe('calculateRequiredUsers', () => {
    it('should calculate users correctly for 10k revenue at 29 AED', () => {
      const users = gameMonetizationEnforcer.calculateRequiredUsers(10000, 29);
      expect(users).toBe(345); // ceil(10000/29) = 345
    });

    it('should calculate users correctly for 20k revenue at 29 AED', () => {
      const users = gameMonetizationEnforcer.calculateRequiredUsers(20000, 29);
      expect(users).toBe(690); // ceil(20000/29) = 690
    });

    it('should throw error for zero price point', () => {
      expect(() => {
        gameMonetizationEnforcer.calculateRequiredUsers(10000, 0);
      }).toThrow('Price point must be greater than 0');
    });

    it('should throw error for negative price point', () => {
      expect(() => {
        gameMonetizationEnforcer.calculateRequiredUsers(10000, -10);
      }).toThrow('Price point must be greater than 0');
    });
  });

  describe('calculateARPU', () => {
    it('should calculate ARPU correctly', () => {
      const arpu = gameMonetizationEnforcer.calculateARPU(10000, 500);
      expect(arpu).toBe(20);
    });

    it('should throw error for zero users', () => {
      expect(() => {
        gameMonetizationEnforcer.calculateARPU(10000, 0);
      }).toThrow('Paid users must be greater than 0');
    });

    it('should throw error for negative users', () => {
      expect(() => {
        gameMonetizationEnforcer.calculateARPU(10000, -100);
      }).toThrow('Paid users must be greater than 0');
    });
  });

  describe('validateMonetization', () => {
    it('should validate a valid monetization strategy', () => {
      const result = gameMonetizationEnforcer.validateMonetization({
        model: 'subscription',
        usesAds: false,
        requiredMAU: 1000,
        arpu: 30,
        hasMonetizationPlan: true,
      });

      expect(result.isValid).toBe(true);
      expect(result.rejectionReasons).toHaveLength(0);
    });

    it('should reject invalid monetization model', () => {
      const result = gameMonetizationEnforcer.validateMonetization({
        model: 'freemium' as any,
        usesAds: false,
        requiredMAU: 1000,
        arpu: 30,
        hasMonetizationPlan: true,
      });

      expect(result.isValid).toBe(false);
      expect(result.rejectionReasons[0]).toContain('Invalid monetization model');
    });

    it('should auto-reject when using ads', () => {
      const result = gameMonetizationEnforcer.validateMonetization({
        model: 'subscription',
        usesAds: true,
        requiredMAU: 1000,
        arpu: 30,
        hasMonetizationPlan: true,
      });

      expect(result.isValid).toBe(false);
      expect(result.rejectionReasons).toContain('AUTO-REJECT: Ads are not allowed');
    });

    it('should auto-reject when MAU exceeds 5000', () => {
      const result = gameMonetizationEnforcer.validateMonetization({
        model: 'subscription',
        usesAds: false,
        requiredMAU: 6000,
        arpu: 30,
        hasMonetizationPlan: true,
      });

      expect(result.isValid).toBe(false);
      expect(result.rejectionReasons[0]).toContain('AUTO-REJECT: Needs >5,000 MAU');
    });

    it('should auto-reject when ARPU is below 20', () => {
      const result = gameMonetizationEnforcer.validateMonetization({
        model: 'subscription',
        usesAds: false,
        requiredMAU: 1000,
        arpu: 15,
        hasMonetizationPlan: true,
      });

      expect(result.isValid).toBe(false);
      expect(result.rejectionReasons[0]).toContain('AUTO-REJECT: ARPU < AED 20/month');
    });

    it('should auto-reject when monetization is not planned', () => {
      const result = gameMonetizationEnforcer.validateMonetization({
        model: 'subscription',
        usesAds: false,
        requiredMAU: 1000,
        arpu: 30,
        hasMonetizationPlan: false,
      });

      expect(result.isValid).toBe(false);
      expect(result.rejectionReasons).toContain('AUTO-REJECT: Monetization is "later" - must have clear plan');
    });
  });

  describe('analyzeMonetization', () => {
    it('should analyze valid monetization', () => {
      const output = gameMonetizationEnforcer.analyzeMonetization(
        29,
        '3-5%',
        'Premium features',
        'Low',
        'Habit-forming engagement'
      );

      expect(output.pricePointAED).toBe(29);
      expect(output.paidUsersFor10kAED).toBe(345);
      expect(output.paidUsersFor20kAED).toBe(690);
      expect(output.expectedConversionRate).toBe('3-5%');
      expect(output.whyUsersPay).toBe('Premium features');
      expect(output.churnRisk.level).toBe('Low');
      expect(output.churnRisk.reason).toBe('Habit-forming engagement');
    });

    it('should throw error for ARPU below 20', () => {
      expect(() => {
        gameMonetizationEnforcer.analyzeMonetization(
          15,
          '3-5%',
          'Value',
          'Low',
          'Reason'
        );
      }).toThrow('ARPU must be >= AED 20/month');
    });
  });

  describe('formatOutput', () => {
    it('should format output correctly', () => {
      const output = gameMonetizationEnforcer.analyzeMonetization(
        29,
        '3-5%',
        'Premium features',
        'Low',
        'Habit-forming'
      );

      const formatted = gameMonetizationEnforcer.formatOutput(output);

      expect(formatted).toContain('PRICE POINT (AED):');
      expect(formatted).toContain('29');
      expect(formatted).toContain('PAID USERS NEEDED FOR 10k AED:');
      expect(formatted).toContain('345');
      expect(formatted).toContain('PAID USERS NEEDED FOR 20k AED:');
      expect(formatted).toContain('690');
      expect(formatted).toContain('EXPECTED CONVERSION RATE:');
      expect(formatted).toContain('WHY USERS WILL PAY CONSISTENTLY:');
      expect(formatted).toContain('CHURN RISK');
    });
  });

  describe('getSampleStrategies', () => {
    it('should return sample strategies', () => {
      const samples = gameMonetizationEnforcer.getSampleStrategies();

      expect(samples.length).toBeGreaterThan(0);
      samples.forEach(sample => {
        expect(sample.pricePointAED).toBeGreaterThanOrEqual(20);
        expect(sample.paidUsersFor10kAED).toBeDefined();
        expect(sample.paidUsersFor20kAED).toBeDefined();
        expect(sample.churnRisk).toBeDefined();
      });
    });
  });

  describe('getRecommendedPricePoints', () => {
    it('should return recommended price points', () => {
      const recommendations = gameMonetizationEnforcer.getRecommendedPricePoints(10000);

      expect(recommendations.conservative.price).toBe(25);
      expect(recommendations.moderate.price).toBe(49);
      expect(recommendations.premium.price).toBe(99);
      expect(recommendations.conservative.users).toBe(400);
      expect(recommendations.premium.users).toBe(102);
    });
  });

  describe('getSystemPrompt', () => {
    it('should return a valid system prompt', () => {
      const prompt = gameMonetizationEnforcer.getSystemPrompt();

      expect(prompt).toContain('Game Monetization Enforcer');
      expect(prompt).toContain('STRICT INSTRUCTIONS');
      expect(prompt).toContain('Auto-kill');
      expect(prompt).toContain('ARPU');
    });
  });
});
