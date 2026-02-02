/**
 * AIService
 * 
 * AI integration service using Grok (xAI) for:
 * - Emoji interpretation
 * - Easter egg generation
 * - Enhanced Genie responses
 * - Content generation
 */

import { 
  EmojiStory, 
  EmojiInterpretation, 
  EasterEgg,
  BlindDateConfig,
} from '../types/gift';
import { templateLibrary } from './TemplateLibrary';
import { artStyleService } from './ArtStyleService';

// Grok API configuration
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_MODEL = 'grok-4-1-fast-reasoning';

// Enhanced system prompt for thoughtful gift-game creation
const GIFTFORGE_SYSTEM_PROMPT = `You are a thoughtful gift-game creator. Generate emotionally tuned mini-game params, dialogue, intro/end message based on JSON inputs. Reason step-by-step for max delight and safety.

Your responsibilities:
1. Create age-appropriate, heartfelt game content
2. Personalize every element to the recipient's interests and personality
3. Match the emotional tone requested by the gift creator
4. Include encouraging, joyful moments throughout
5. End with a meaningful message that honors the relationship
6. Never include inappropriate, harmful, or unsafe content
7. Always respond with valid JSON only`;

interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GrokResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

class AIService {
  private apiKey: string | null = null;

  constructor() {
    // Load from environment if available
    if (typeof process !== 'undefined' && process.env?.XAI_API_KEY) {
      this.apiKey = process.env.XAI_API_KEY;
    }
  }

  /**
   * Set the Grok API key
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return this.apiKey !== null && this.apiKey.length > 0;
  }

  /**
   * Make a completion request to Grok
   */
  async complete(prompt: string, options: CompletionOptions = {}): Promise<string> {
    // If no API key, use local fallback
    if (!this.isConfigured()) {
      console.warn('Grok API key not configured, using local fallback');
      return this.localFallback(prompt);
    }

    try {
      const messages: GrokMessage[] = [];
      
      if (options.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
      }
      
      messages.push({ role: 'user', content: prompt });

      const response = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: GROK_MODEL,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.status}`);
      }

      const data: GrokResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Grok API call failed:', error);
      return this.localFallback(prompt);
    }
  }

  /**
   * Interpret emojis into a person description
   */
  async interpretEmojis(story: EmojiStory): Promise<EmojiInterpretation> {
    // If no API key, use local fallback directly
    if (!this.isConfigured()) {
      return this.localEmojiInterpretation(story);
    }

    const templates = templateLibrary.getAllTemplates();
    const styles = artStyleService.getAllStyles();

    const prompt = `You are interpreting emoji descriptions of a person to help create a personalized game gift.

Given these emojis about someone:
- Personality: ${story.personality.join(' ') || 'None selected'}
- Hobbies/Interests: ${story.hobbies.join(' ') || 'None selected'}
- Mood/Vibe: ${story.mood.join(' ') || 'None selected'}

Please respond with a JSON object (no markdown, just JSON):
{
  "description": "A warm, friendly 2-3 sentence description of this person based on the emojis",
  "traits": ["trait1", "trait2", "trait3"],
  "suggestedTemplateId": "one of: ${templates.map(t => t.id).join(', ')}",
  "suggestedStyleId": "one of: ${styles.map(s => s.id).join(', ')}",
  "confidence": 0.85
}

Choose the template and style that best match their personality and interests.`;

    try {
      const response = await this.complete(prompt, {
        temperature: 0.7,
        systemPrompt: 'You are a helpful assistant that interprets emoji descriptions. Always respond with valid JSON only.',
      });

      // Parse JSON response
      const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        description: parsed.description || this.generateLocalDescription(story),
        traits: parsed.traits || [],
        suggestedTemplateId: parsed.suggestedTemplateId || 'match3',
        suggestedStyleId: parsed.suggestedStyleId || 'pixel',
        confidence: parsed.confidence || 0.7,
      };
    } catch (error) {
      console.error('Failed to parse emoji interpretation:', error);
      return this.localEmojiInterpretation(story);
    }
  }

  /**
   * Generate Easter eggs for blind date mode
   */
  async generateEasterEggs(config: BlindDateConfig['creatorInputs'], recipientName: string): Promise<EasterEgg[]> {
    // If no API key, use local fallback directly
    if (!this.isConfigured()) {
      return this.localEasterEggs(config, recipientName);
    }

    const prompt = `You are creating hidden Easter eggs for a personalized game gift.

About the recipient "${recipientName}":
- Things they love: ${config.thingsTheyLove.join(', ')}
- Inside joke (if any): ${config.insideJoke || 'None provided'}
- Special memory (if any): ${config.specialMemory || 'None provided'}
- Secret message to hide: ${config.secretMessage || 'None provided'}

Generate 3 creative Easter eggs to hide in the game. These should be delightful surprises when discovered.

Respond with a JSON array (no markdown, just JSON):
[
  {
    "id": "egg1",
    "type": "hidden_message",
    "content": "The actual hidden content",
    "location": "background",
    "hint": "A subtle hint to help find it"
  },
  {
    "id": "egg2", 
    "type": "secret_collectible",
    "content": "Description of the collectible",
    "location": "collectible",
    "hint": "Hint for this one"
  },
  {
    "id": "egg3",
    "type": "inside_joke",
    "content": "The joke reference",
    "location": "dialogue",
    "hint": "Hint for finding it"
  }
]

Types can be: hidden_message, secret_collectible, inside_joke, memory_reference
Locations can be: background, dialogue, collectible, level_name`;

    try {
      const response = await this.complete(prompt, {
        temperature: 0.8,
        systemPrompt: 'You are a creative game designer who hides delightful Easter eggs. Always respond with valid JSON only.',
      });

      const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return parsed.map((egg: any, index: number) => ({
        id: egg.id || `egg-${index + 1}`,
        type: egg.type || 'hidden_message',
        content: egg.content || '',
        location: egg.location || 'background',
        hint: egg.hint || '',
        discovered: false,
      }));
    } catch (error) {
      console.error('Failed to generate Easter eggs:', error);
      return this.localEasterEggs(config, recipientName);
    }
  }

  /**
   * Enhance a game description with personalization
   */
  async enhanceGameDescription(
    templateName: string,
    recipientName: string,
    traits: string[]
  ): Promise<string> {
    const prompt = `Create a short, exciting game description for a personalized ${templateName} game.

The recipient is ${recipientName}, who is ${traits.join(', ')}.

Write 1-2 sentences that make this sound like it was made just for them. Be warm and fun!`;

    try {
      return await this.complete(prompt, {
        temperature: 0.8,
        maxTokens: 100,
      });
    } catch {
      return `A special ${templateName} created just for ${recipientName}!`;
    }
  }

  /**
   * Generate promotional content for sharing
   */
  async generateShareText(
    templateName: string,
    recipientName: string,
    styleName: string
  ): Promise<string> {
    const prompt = `Write a fun, casual social media post about creating a personalized game.

Details:
- Game type: ${templateName}
- Made for: ${recipientName}
- Art style: ${styleName}

Keep it under 200 characters, include 1-2 emojis, make it sound exciting but not salesy.`;

    try {
      return await this.complete(prompt, {
        temperature: 0.9,
        maxTokens: 100,
      });
    } catch {
      return `Just made a ${templateName} game for ${recipientName}! 🎮✨`;
    }
  }

  // ============================================
  // LOCAL FALLBACKS (when API unavailable)
  // ============================================

  private localFallback(prompt: string): string {
    // Simple keyword-based responses
    if (prompt.includes('emoji') || prompt.includes('Emoji')) {
      return JSON.stringify({
        description: "Someone with a fun, creative personality!",
        traits: ["creative", "fun-loving", "unique"],
        suggestedTemplateId: "match3",
        suggestedStyleId: "pixel",
        confidence: 0.6,
      });
    }
    if (prompt.includes('Easter') || prompt.includes('egg')) {
      return JSON.stringify([
        { id: "egg1", type: "hidden_message", content: "You're awesome!", location: "background", hint: "Look at the clouds..." },
        { id: "egg2", type: "secret_collectible", content: "Golden star", location: "collectible", hint: "Not all stars are silver" },
        { id: "egg3", type: "inside_joke", content: "Remember that time?", location: "dialogue", hint: "Talk to everyone" },
      ]);
    }
    return "I'm here to help make your game special!";
  }

  private localEmojiInterpretation(story: EmojiStory): EmojiInterpretation {
    const description = this.generateLocalDescription(story);
    const traits = this.extractTraits(story);
    const templateId = this.suggestTemplate(story);
    const styleId = this.suggestStyle(story);

    return {
      description,
      traits,
      suggestedTemplateId: templateId,
      suggestedStyleId: styleId,
      confidence: 0.6,
    };
  }

  private generateLocalDescription(story: EmojiStory): string {
    const parts: string[] = [];

    if (story.personality.length > 0) {
      parts.push("Someone with a vibrant personality");
    }
    if (story.hobbies.length > 0) {
      parts.push("who loves spending time on their interests");
    }
    if (story.mood.length > 0) {
      parts.push("and always brings good energy");
    }

    return parts.length > 0 
      ? parts.join(' ') + '!'
      : "Someone special who deserves a fun game!";
  }

  private extractTraits(story: EmojiStory): string[] {
    const traitMap: Record<string, string> = {
      '🎨': 'creative', '🤓': 'intellectual', '💪': 'strong',
      '🧘': 'peaceful', '🤪': 'playful', '😎': 'cool',
      '☕': 'coffee-lover', '📚': 'bookworm', '🎮': 'gamer',
      '🎵': 'musical', '⚽': 'sporty', '🍳': 'foodie',
      '😂': 'funny', '🥹': 'emotional', '😍': 'loving',
    };

    const allEmojis = [...story.personality, ...story.hobbies, ...story.mood];
    const traits = allEmojis
      .map(e => traitMap[e])
      .filter(Boolean)
      .slice(0, 5);

    return traits.length > 0 ? traits : ['fun', 'unique', 'special'];
  }

  private suggestTemplate(story: EmojiStory): string {
    const allEmojis = [...story.personality, ...story.hobbies, ...story.mood].join('');

    if (allEmojis.includes('🎮') || allEmojis.includes('⚡')) return 'runner';
    if (allEmojis.includes('🧩') || allEmojis.includes('🤓')) return 'match3';
    if (allEmojis.includes('📚') || allEmojis.includes('🤔')) return 'quiz';
    if (allEmojis.includes('🎵') || allEmojis.includes('🎶')) return 'rhythm';
    if (allEmojis.includes('📖') || allEmojis.includes('✨')) return 'interactive-story';
    if (allEmojis.includes('🏎️') || allEmojis.includes('💨')) return 'racing';

    return 'match3'; // Default
  }

  private suggestStyle(story: EmojiStory): string {
    const allEmojis = [...story.personality, ...story.hobbies, ...story.mood].join('');

    if (allEmojis.includes('🌃') || allEmojis.includes('🔥') || allEmojis.includes('⚡')) return 'cyberpunk';
    if (allEmojis.includes('🎨') || allEmojis.includes('✏️') || allEmojis.includes('🖌️')) return 'handdrawn';
    if (allEmojis.includes('🌸') || allEmojis.includes('🌊') || allEmojis.includes('☁️')) return 'watercolor';
    if (allEmojis.includes('👾') || allEmojis.includes('🕹️')) return 'pixel';

    return 'pixel'; // Default
  }

  private localEasterEggs(config: BlindDateConfig['creatorInputs'], recipientName: string): EasterEgg[] {
    const eggs: EasterEgg[] = [];

    // Easter egg based on things they love
    if (config.thingsTheyLove.length > 0) {
      eggs.push({
        id: 'egg-love',
        type: 'secret_collectible',
        content: `A special ${config.thingsTheyLove[0]} just for ${recipientName}`,
        location: 'collectible',
        hint: 'Look for something that sparkles differently...',
        discovered: false,
      });
    }

    // Easter egg based on inside joke
    if (config.insideJoke) {
      eggs.push({
        id: 'egg-joke',
        type: 'inside_joke',
        content: config.insideJoke,
        location: 'dialogue',
        hint: 'One character knows your secret...',
        discovered: false,
      });
    }

    // Easter egg for secret message
    if (config.secretMessage) {
      eggs.push({
        id: 'egg-message',
        type: 'hidden_message',
        content: config.secretMessage,
        location: 'background',
        hint: 'Sometimes the background tells a story...',
        discovered: false,
      });
    }

    // Default eggs if none generated
    if (eggs.length === 0) {
      eggs.push({
        id: 'egg-default',
        type: 'hidden_message',
        content: `Made with love for ${recipientName}! 💝`,
        location: 'background',
        hint: 'Look closely at the sky...',
        discovered: false,
      });
    }

    return eggs.slice(0, 3);
  }
}

export const aiService = new AIService();
export { AIService };
