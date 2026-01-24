/**
 * CrewAI Game Development Agents
 * 
 * A collection of 4 specialized AI agents for game concept validation:
 * 
 * 1. 🎯 Game Concept Sniper
 *    - Identifies simple, AI-driven game concepts
 *    - Focuses on monetization with small audiences
 *    - Requires zero manual content creation
 * 
 * 2. 💰 Game Monetization Enforcer
 *    - Proves realistic path to AED 10k-20k/month
 *    - Optimizes for ARPU, not downloads
 *    - Kills "fun but broke" ideas
 * 
 * 3. ⚙️ Game Automation Architect
 *    - Ensures end-to-end automation
 *    - No daily human involvement
 *    - Prefers boring systems that print money
 * 
 * 4. 🛑 Kill-Switch Governor
 *    - Ruthless decision maker
 *    - No emotions, no hype, only scores
 *    - BUILD / OPTIONAL TEST / KILL decisions
 * 
 * System Philosophy:
 * - Games are products, not art projects
 * - Monetization > virality
 * - Automation > engagement tricks
 * - Small paid audiences > massive free users
 */

// Export individual agents
export { GameConceptSniper, gameConceptSniper } from './GameConceptSniper';
export { GameMonetizationEnforcer, gameMonetizationEnforcer } from './GameMonetizationEnforcer';
export { GameAutomationArchitect, gameAutomationArchitect } from './GameAutomationArchitect';
export { KillSwitchGovernor, killSwitchGovernor } from './KillSwitchGovernor';

// Export orchestrator
export { 
  CrewAIOrchestrator, 
  crewAIOrchestrator,
  type GameConceptInput,
  type MonetizationInput,
  type AutomationInput,
} from './CrewAIOrchestrator';

// Re-export types
export type {
  CrewAIAgent,
  GameConceptOutput,
  GameConceptValidation,
  MonetizationModel,
  MonetizationOutput,
  MonetizationValidation,
  AutomationOutput,
  AutomationValidation,
  KillSwitchScore,
  KillSwitchOutput,
  KillSwitchDecisionRule,
  GameArchitecture,
  FrontendLayer,
  BackendLayer,
  AIContentEngine,
  AutomationLayer,
  PaymentsLayer,
  DeploymentLayer,
  GameConceptAnalysis,
} from '../../types/agents';
