/**
 * GiftForge Domain Types
 * 
 * Core types for the gift-game platform:
 * - Gift creation and sharing
 * - Roulette (random game generation)
 * - Emoji story input
 * - Gift wrapping and notes
 */

// ============================================
// WILD CARD TYPES
// ============================================

export type WildCardEffectType = 
  | 'theme_override'      // Changes entire game theme
  | 'character_swap'      // Swaps character sprites
  | 'collectible_swap'    // Changes collectible items
  | 'add_element'         // Adds visual elements
  | 'color_override'      // Changes color palette
  | 'filter'              // Applies visual filter
  | 'scale';              // Changes scale/perspective

export interface WildCardEffect {
  type: WildCardEffectType;
  value: string;
}

export interface WildCard {
  id: string;
  name: string;
  icon: string;          // Emoji representation
  description?: string;
  effect: WildCardEffect;
  rarity?: 'common' | 'rare' | 'legendary';
}

// ============================================
// ROULETTE TYPES
// ============================================

export interface RouletteResult {
  templateId: string;
  templateName: string;
  artStyleId: string;
  artStyleName: string;
  wildCard: WildCard;
  combinationHash: string;   // Unique hash of this combination
  globalCount: number;       // How many times this combo exists globally
  rarity: RouletteRarity;
  timestamp: Date;
}

export interface RouletteRarity {
  score: number;             // 1-100, higher = more rare
  label: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  color: string;             // Display color
}

export interface RouletteConfig {
  allowedTemplates?: string[];   // Limit to specific templates
  allowedStyles?: string[];      // Limit to specific styles
  excludeWildCards?: string[];   // Exclude specific wild cards
}

// ============================================
// EMOJI STORY TYPES
// ============================================

export interface EmojiStory {
  personality: string[];     // Emojis describing who they are
  hobbies: string[];         // Emojis describing what they love
  mood: string[];            // Emojis describing their vibe
  relationship?: string[];   // Emojis describing your relationship
}

export interface EmojiInterpretation {
  description: string;       // AI-generated description
  traits: string[];          // Extracted personality traits
  suggestedTemplateId: string;
  suggestedStyleId: string;
  confidence: number;        // 0-1 confidence score
}

// ============================================
// GIFT RECIPIENT TYPES
// ============================================

export type RecipientRelationship = 
  | 'friend'
  | 'best_friend'
  | 'partner'
  | 'spouse'
  | 'parent'
  | 'sibling'
  | 'child'
  | 'grandparent'
  | 'colleague'
  | 'teacher'
  | 'other';

export interface GiftRecipient {
  name: string;
  relationship?: RecipientRelationship;
  description?: string;      // Free-form description
  emojiStory?: EmojiStory;   // Emoji-based description
  interpretation?: EmojiInterpretation;  // AI interpretation
}

// ============================================
// GIFT WRAP TYPES
// ============================================

export type GiftWrapTheme = 
  | 'classic'
  | 'ramadan'
  | 'eid'
  | 'valentine'
  | 'birthday'
  | 'christmas'
  | 'graduation'
  | 'thank_you'
  | 'congrats';

export interface GiftWrap {
  theme: GiftWrapTheme;
  animation: string;         // Lottie animation file reference
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface GiftWrapOption {
  id: GiftWrapTheme;
  name: string;
  icon: string;
  description: string;
  animation: string;
  colors: GiftWrap['colors'];
  isPremium: boolean;
  seasonalAvailability?: {
    startMonth: number;      // 1-12
    endMonth: number;        // 1-12
  };
}

// ============================================
// GIFT NOTE TYPES
// ============================================

export type GiftNoteType = 'text' | 'voice';

export interface GiftNote {
  type: GiftNoteType;
  content: string;           // Text content or audio URL
  duration?: number;         // Duration in seconds (for voice)
  createdAt: Date;
}

// ============================================
// GIFT REACTION TYPES
// ============================================

export type ReactionType = 'emoji' | 'text' | 'voice' | 'video';

export interface GiftReaction {
  id: string;
  type: ReactionType;
  content: string;           // Emoji, text, or media URL
  createdAt: Date;
}

// ============================================
// BLIND DATE (EASTER EGG) TYPES
// ============================================

export type EasterEggType = 
  | 'hidden_message'
  | 'secret_collectible'
  | 'inside_joke'
  | 'memory_reference'
  | 'secret_level';

export type EasterEggLocation = 
  | 'background'
  | 'dialogue'
  | 'collectible'
  | 'level_name'
  | 'character_name'
  | 'sound_effect';

export interface EasterEgg {
  id: string;
  type: EasterEggType;
  content: string;           // The hidden content
  location: EasterEggLocation;
  hint: string;              // Hint to help find it
  discovered?: boolean;      // Whether recipient found it
}

export interface BlindDateConfig {
  enabled: boolean;
  creatorInputs: {
    thingsTheyLove: string[];
    insideJoke?: string;
    specialMemory?: string;
    secretMessage?: string;
  };
  easterEggs: EasterEgg[];
  hidePreviewFromCreator: boolean;
}

// ============================================
// MAIN GIFT TYPE
// ============================================

export type GiftStatus = 
  | 'draft'
  | 'created'
  | 'shared'
  | 'opened'
  | 'played';

export type GiftCreationMode = 
  | 'standard'      // Normal creation flow
  | 'roulette'      // Random spin
  | 'blind_date';   // Surprise creation

export interface Gift {
  id: string;
  
  // Game details
  gameId: string;
  templateId: string;
  artStyleId: string;
  
  // Creator info
  creatorId?: string;
  creatorName?: string;
  
  // Recipient info
  recipient: GiftRecipient;
  
  // Creation mode
  mode: GiftCreationMode;
  rouletteResult?: RouletteResult;
  blindDateConfig?: BlindDateConfig;
  
  // Wrapping
  wrap: GiftWrap;
  note?: GiftNote;
  
  // Sharing
  shareLink: string;
  shortCode: string;          // e.g., "gf-x8h3k"
  
  // Status & timestamps
  status: GiftStatus;
  createdAt: Date;
  sharedAt?: Date;
  openedAt?: Date;
  firstPlayedAt?: Date;
  
  // Engagement
  reactions: GiftReaction[];
  playCount: number;
  
  // Easter eggs (for blind date mode)
  easterEggsDiscovered?: string[];  // IDs of discovered eggs
}

// ============================================
// GIFT SERVICE INPUT TYPES
// ============================================

export interface CreateGiftInput {
  recipient: GiftRecipient;
  mode: GiftCreationMode;
  templateId?: string;        // Required if not roulette
  artStyleId?: string;        // Required if not roulette
  rouletteConfig?: RouletteConfig;
  blindDateConfig?: Omit<BlindDateConfig, 'easterEggs'>;
  wrap: GiftWrap;
  note?: Omit<GiftNote, 'createdAt'>;
  creatorName?: string;
}

export interface UpdateGiftInput {
  wrap?: GiftWrap;
  note?: Omit<GiftNote, 'createdAt'>;
  status?: GiftStatus;
}

// ============================================
// SHARE CARD TYPES
// ============================================

export interface ShareCardData {
  title: string;              // "I Made a Game!"
  recipientName: string;
  templateIcon: string;
  templateName: string;
  artStyleName: string;
  creationTime: string;       // "7 minutes"
  loveRating: number;         // 1-5 hearts
  shareUrl: string;
  qrCode?: string;            // Base64 QR code
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface GiftAnalytics {
  giftId: string;
  views: number;
  uniqueViews: number;
  playCount: number;
  averagePlayTime: number;    // seconds
  completionRate: number;     // 0-1
  reactionCount: number;
  shareCount: number;
}

// ============================================
// CONSTANTS
// ============================================

export const GIFT_WRAP_OPTIONS: GiftWrapOption[] = [
  {
    id: 'classic',
    name: 'Classic',
    icon: '🎁',
    description: 'Timeless gift wrapping',
    animation: 'wrap_classic',
    colors: { primary: '#e74c3c', secondary: '#c0392b', accent: '#f1c40f' },
    isPremium: false,
  },
  {
    id: 'ramadan',
    name: 'Ramadan',
    icon: '🌙',
    description: 'Blessed Ramadan theme',
    animation: 'wrap_ramadan',
    colors: { primary: '#1a472a', secondary: '#c9b037', accent: '#ffffff' },
    isPremium: false,
    seasonalAvailability: { startMonth: 2, endMonth: 4 },
  },
  {
    id: 'eid',
    name: 'Eid Mubarak',
    icon: '🕌',
    description: 'Celebrate Eid',
    animation: 'wrap_eid',
    colors: { primary: '#2c3e50', secondary: '#c9b037', accent: '#1abc9c' },
    isPremium: false,
    seasonalAvailability: { startMonth: 3, endMonth: 5 },
  },
  {
    id: 'valentine',
    name: 'Valentine',
    icon: '💝',
    description: 'Love is in the air',
    animation: 'wrap_valentine',
    colors: { primary: '#e91e63', secondary: '#ad1457', accent: '#fce4ec' },
    isPremium: true,
    seasonalAvailability: { startMonth: 1, endMonth: 2 },
  },
  {
    id: 'birthday',
    name: 'Birthday',
    icon: '🎂',
    description: 'Happy birthday celebration',
    animation: 'wrap_birthday',
    colors: { primary: '#9b59b6', secondary: '#8e44ad', accent: '#f39c12' },
    isPremium: true,
  },
  {
    id: 'christmas',
    name: 'Christmas',
    icon: '🎄',
    description: 'Festive holiday spirit',
    animation: 'wrap_christmas',
    colors: { primary: '#27ae60', secondary: '#c0392b', accent: '#f1c40f' },
    isPremium: true,
    seasonalAvailability: { startMonth: 11, endMonth: 12 },
  },
  {
    id: 'graduation',
    name: 'Graduation',
    icon: '🎓',
    description: 'Congratulations graduate!',
    animation: 'wrap_graduation',
    colors: { primary: '#2c3e50', secondary: '#34495e', accent: '#f1c40f' },
    isPremium: true,
  },
  {
    id: 'thank_you',
    name: 'Thank You',
    icon: '🙏',
    description: 'Show your appreciation',
    animation: 'wrap_thanks',
    colors: { primary: '#3498db', secondary: '#2980b9', accent: '#ecf0f1' },
    isPremium: false,
  },
  {
    id: 'congrats',
    name: 'Congratulations',
    icon: '🎉',
    description: 'Celebrate achievements',
    animation: 'wrap_congrats',
    colors: { primary: '#f39c12', secondary: '#e67e22', accent: '#ecf0f1' },
    isPremium: false,
  },
];

export const DEFAULT_GIFT_WRAP: GiftWrap = {
  theme: 'classic',
  animation: 'wrap_classic',
  colors: { primary: '#e74c3c', secondary: '#c0392b', accent: '#f1c40f' },
};
