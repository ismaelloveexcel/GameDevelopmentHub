// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Projects: undefined;
  ProjectList: undefined;
  ProjectEditor: { projectId: string };
  Templates: undefined;
  TemplateSelector: undefined;
  TemplatePreview: { templateId: string };
  GameGenerator: undefined;
  Genie: undefined;
  GenieAssistant: { projectId?: string };
  AssetLibrary: { projectId?: string };
  MarketingDashboard: { projectId: string };
  VREditor: { projectId: string };
  Settings: undefined;
  Publish: { projectId: string };
};

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'game' | 'vr' | 'educational';
  engine: 'pixi' | 'babylon' | 'aframe';
  template?: string;
  artStyle?: ArtStyle;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  data: ProjectData;
}

export interface ProjectData {
  scenes: Scene[];
  assets: Asset[];
  scripts: Script[];
  settings: ProjectSettings;
}

export interface Scene {
  id: string;
  name: string;
  type: '2d' | '3d' | 'vr';
  objects: GameObject[];
  background?: string;
  camera?: CameraSettings;
}

export interface GameObject {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z?: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z?: number };
  properties: Record<string, any>;
  components: Component[];
}

export interface Component {
  type: string;
  enabled: boolean;
  properties: Record<string, any>;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video' | '3dmodel' | 'font' | 'script';
  url: string;
  size: number;
  metadata?: Record<string, any>;
}

export interface Script {
  id: string;
  name: string;
  code: string;
  language: 'javascript' | 'typescript';
}

export interface ProjectSettings {
  resolution: { width: number; height: number };
  orientation: 'portrait' | 'landscape' | 'auto';
  physics?: PhysicsSettings;
  audio?: AudioSettings;
}

export interface PhysicsSettings {
  enabled: boolean;
  gravity: { x: number; y: number; z: number };
  engine: 'matter' | 'cannon' | 'ammo';
}

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
}

export interface CameraSettings {
  type: 'orthographic' | 'perspective';
  position: { x: number; y: number; z: number };
  target?: { x: number; y: number; z: number };
  fov?: number;
}

// Genie AI types
export type GeniePersonality = 'creative' | 'technical' | 'marketing' | 'educator';

export interface GenieMessage {
  id: string;
  personality: GeniePersonality;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  codeSnippet?: string;
}

export interface GenieContext {
  projectId?: string;
  currentScene?: string;
  recentActions: string[];
  userPreferences: Record<string, any>;
}

// Template types
export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
  engine: 'pixi' | 'babylon' | 'aframe';
  data: ProjectData;
  documentation: string;
}

export type TemplateCategory = 
  | 'puzzle'
  | 'action'
  | 'strategy'
  | 'racing'
  | 'educational'
  | 'vr'
  | 'ar'
  | 'idle'
  | 'rhythm'
  | 'story';

// Art Style types
export type ArtStyle = 
  | 'pixel'
  | 'lowpoly'
  | 'handdrawn'
  | 'cyberpunk'
  | 'watercolor';

export interface ArtStyleConfig {
  id: ArtStyle;
  name: string;
  description: string;
  colors: ColorPalette;
  shaders?: ShaderConfig[];
  filters?: FilterConfig[];
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  custom: string[];
}

export interface ShaderConfig {
  name: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, any>;
}

export interface FilterConfig {
  type: string;
  parameters: Record<string, any>;
}

// Marketing types
export interface MarketingCampaign {
  id: string;
  projectId: string;
  name: string;
  type: 'social' | 'email' | 'push' | 'inapp';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  startDate?: Date;
  endDate?: Date;
  content: CampaignContent;
  analytics: CampaignAnalytics;
}

export interface CampaignContent {
  title: string;
  description: string;
  media: string[];
  cta: string;
  hashtags?: string[];
}

export interface CampaignAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  engagement: number;
}

export interface AnalyticsDashboard {
  overview: {
    users: number;
    sessions: number;
    revenue: number;
    retention: number;
  };
  charts: ChartData[];
  metrics: MetricCard[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: any[];
  labels: string[];
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

// VR types
export interface VRSettings {
  platform: 'quest' | 'psvr' | 'webxr';
  locomotion: 'teleport' | 'smooth' | 'both';
  handTracking: boolean;
  controllerSupport: boolean;
  spatialAudio: boolean;
}

export interface VRController {
  hand: 'left' | 'right';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  buttons: Record<string, boolean>;
}

// Game Generator types
export interface GameGeneratorCriteria {
  theme: string;
  occasion?: string;
  targetAudience?: string;
  gameType?: TemplateCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  features?: string[];
  artStyle?: ArtStyle;
  customRequirements?: string;
}

export interface GeneratedGameConfig {
  name: string;
  description: string;
  templateId: string;
  artStyle: ArtStyle;
  customizations: {
    theme: string;
    occasion?: string;
    colors?: ColorPalette;
    features?: string[];
  };
}

// CrewAI Agent types
export * from './agents';
