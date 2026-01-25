import {
  MarketingCampaign,
  AnalyticsDashboard,
  CampaignContent,
} from '../types';

/**
 * Marketing Automation Service
 * Handles campaigns, analytics, and promotional tools
 */
class MarketingService {
  private campaigns: Map<string, MarketingCampaign> = new Map();

  /**
   * Create a new marketing campaign
   */
  createCampaign(projectId: string, type: MarketingCampaign['type']): MarketingCampaign {
    const campaign: MarketingCampaign = {
      id: `campaign_${Date.now()}`,
      projectId,
      name: `New ${type} Campaign`,
      type,
      status: 'draft',
      content: {
        title: '',
        description: '',
        media: [],
        cta: 'Play Now!',
        hashtags: this.generateHashtags(type),
      },
      analytics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        engagement: 0,
      },
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  /**
   * Generate promotional content using AI
   */
  async generatePromotionalContent(
    projectName: string,
    gameType: string,
    features: string[]
  ): Promise<CampaignContent> {
    // Simulate AI content generation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const titles = [
      `🎮 ${projectName} - The Ultimate ${gameType} Experience!`,
      `🚀 Launch Day! ${projectName} is Here!`,
      `✨ Discover ${projectName} - ${gameType} Reimagined`,
    ];

    const descriptions = [
      `Experience ${projectName}, a groundbreaking ${gameType} that combines ${features.join(', ')}. Download now and join thousands of players!`,
      `${projectName} brings ${gameType} to life with stunning visuals and addictive gameplay. Features include ${features.slice(0, 3).join(', ')} and more!`,
      `Ready for an adventure? ${projectName} offers the best ${gameType} experience with ${features[0]} and ${features[1]}. Start playing today!`,
    ];

    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      media: [],
      cta: 'Download Now',
      hashtags: [
        '#GameDev',
        '#IndieGame',
        '#MobileGaming',
        `#${projectName.replace(/\s/g, '')}`,
        `#${gameType}`,
      ],
    };
  }

  /**
   * Generate hashtag recommendations
   */
  private generateHashtags(campaignType: string): string[] {
    const baseHashtags = ['#GameDev', '#IndieGame', '#Gaming'];
    const typeHashtags: Record<string, string[]> = {
      social: ['#SocialMedia', '#Community', '#Gamer'],
      email: ['#Newsletter', '#GameUpdates', '#Exclusive'],
      push: ['#MobileGaming', '#PlayNow', '#NewRelease'],
      inapp: ['#InGameEvent', '#SpecialOffer', '#LimitedTime'],
    };

    return [...baseHashtags, ...(typeHashtags[campaignType] || [])];
  }

  /**
   * Schedule campaign
   */
  scheduleCampaign(campaignId: string, startDate: Date, endDate?: Date): void {
    const campaign = this.campaigns.get(campaignId);
    if (campaign) {
      campaign.status = 'scheduled';
      campaign.startDate = startDate;
      campaign.endDate = endDate;
      this.campaigns.set(campaignId, campaign);
    }
  }

  /**
   * Get analytics dashboard
   */
  getAnalyticsDashboard(_projectId: string): AnalyticsDashboard {
    // In production, this would fetch real analytics data
    return {
      overview: {
        users: 12543,
        sessions: 45821,
        revenue: 8934.5,
        retention: 0.68,
      },
      charts: [
        {
          type: 'line',
          title: 'Daily Active Users',
          data: [120, 145, 178, 203, 189, 221, 245],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        {
          type: 'bar',
          title: 'Revenue by Source',
          data: [3200, 2100, 1800, 1834],
          labels: ['IAP', 'Ads', 'Subscriptions', 'Other'],
        },
        {
          type: 'pie',
          title: 'User Demographics',
          data: [35, 28, 22, 15],
          labels: ['18-24', '25-34', '35-44', '45+'],
        },
      ],
      metrics: [
        {
          title: 'Conversion Rate',
          value: '3.2%',
          change: 12,
          trend: 'up',
        },
        {
          title: 'Avg. Session Length',
          value: '8m 34s',
          change: 8,
          trend: 'up',
        },
        {
          title: 'Bounce Rate',
          value: '24%',
          change: -5,
          trend: 'down',
        },
        {
          title: 'ARPU',
          value: '$2.45',
          change: 15,
          trend: 'up',
        },
      ],
    };
  }

  /**
   * Generate social media post
   */
  async generateSocialPost(
    platform: 'twitter' | 'facebook' | 'instagram',
    content: CampaignContent
  ): Promise<string> {
    const platformSpecs: Record<string, { maxLength: number; style: string }> = {
      twitter: { maxLength: 280, style: 'concise' },
      facebook: { maxLength: 2000, style: 'engaging' },
      instagram: { maxLength: 2200, style: 'visual' },
    };

    const spec = platformSpecs[platform];
    let post = `${content.title}\n\n${content.description}\n\n`;

    // Add hashtags
    if (content.hashtags) {
      post += content.hashtags.join(' ');
    }

    // Truncate if needed
    if (post.length > spec.maxLength) {
      post = post.substring(0, spec.maxLength - 3) + '...';
    }

    return post;
  }

  /**
   * Analyze campaign performance
   */
  analyzeCampaignPerformance(campaignId: string): {
    score: number;
    insights: string[];
    recommendations: string[];
  } {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      return { score: 0, insights: [], recommendations: [] };
    }

    const { impressions, clicks, conversions, engagement } = campaign.analytics;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

    // Calculate performance score (0-100)
    const score = Math.min(
      100,
      (ctr * 2 + conversionRate * 3 + engagement * 0.5) / 5.5 * 100
    );

    const insights: string[] = [];
    const recommendations: string[] = [];

    // Generate insights
    if (ctr > 2) {
      insights.push(`Strong click-through rate of ${ctr.toFixed(2)}%`);
    } else {
      insights.push(`Click-through rate of ${ctr.toFixed(2)}% could be improved`);
      recommendations.push('Try A/B testing different headlines and imagery');
    }

    if (conversionRate > 5) {
      insights.push(`Excellent conversion rate of ${conversionRate.toFixed(2)}%`);
    } else {
      insights.push(`Conversion rate is ${conversionRate.toFixed(2)}%`);
      recommendations.push('Optimize landing page and call-to-action');
    }

    if (engagement > 1000) {
      insights.push(`High engagement with ${engagement} interactions`);
    } else {
      recommendations.push('Increase engagement with interactive content and contests');
    }

    if (recommendations.length === 0) {
      recommendations.push('Campaign is performing well. Consider scaling up budget.');
    }

    return { score: Math.round(score), insights, recommendations };
  }

  /**
   * Get user segmentation data
   */
  getUserSegments(_projectId: string): {
    name: string;
    count: number;
    characteristics: string[];
  }[] {
    return [
      {
        name: 'Power Users',
        count: 1250,
        characteristics: [
          'Daily active',
          'High engagement',
          'Made purchases',
          'Long session times',
        ],
      },
      {
        name: 'Casual Players',
        count: 6800,
        characteristics: [
          'Weekly active',
          'Medium engagement',
          'Ad-supported',
          'Short sessions',
        ],
      },
      {
        name: 'New Users',
        count: 2400,
        characteristics: [
          'Recently installed',
          'Exploring features',
          'Not yet converted',
          'Need onboarding',
        ],
      },
      {
        name: 'At Risk',
        count: 890,
        characteristics: [
          'Decreasing activity',
          'Haven\'t played recently',
          'Low engagement',
          'May churn',
        ],
      },
    ];
  }

  /**
   * Create email campaign
   */
  async createEmailCampaign(
    projectId: string,
    segment: string,
    content: CampaignContent
  ): Promise<string> {
    // Simulate email campaign creation
    await new Promise((resolve) => setTimeout(resolve, 500));

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${content.title}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
    <h1 style="color: white; margin: 0;">${content.title}</h1>
  </div>
  <div style="padding: 30px;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      ${content.description}
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="#" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
        ${content.cta}
      </a>
    </div>
  </div>
  <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>Sent to ${segment} segment</p>
  </div>
</body>
</html>
    `;
  }

  /**
   * Setup push notifications
   */
  async setupPushNotification(
    _title: string,
    _body: string,
    _scheduledTime?: Date
  ): Promise<string> {
    // Simulate push notification setup
    await new Promise((resolve) => setTimeout(resolve, 300));

    return `push_notification_${Date.now()}`;
  }

  /**
   * Track conversion event
   */
  trackConversion(campaignId: string, eventType: string, value?: number): void {
    const campaign = this.campaigns.get(campaignId);
    if (campaign) {
      campaign.analytics.conversions += 1;
      if (value) {
        // Track revenue if applicable
      }
      this.campaigns.set(campaignId, campaign);
    }
  }

  /**
   * Get campaign ROI
   */
  calculateROI(campaignId: string, cost: number, revenue: number): number {
    if (cost === 0) return 0;
    return ((revenue - cost) / cost) * 100;
  }
}

export const marketingService = new MarketingService();
