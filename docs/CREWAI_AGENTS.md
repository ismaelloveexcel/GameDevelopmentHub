# CrewAI Game Development Agents

> AI-powered game concept validation for profitable, automated game products.

## System Philosophy

These agents operate under a strict commercial philosophy:

- **Games are products, not art projects**
- **Monetization > virality**
- **Automation > engagement tricks**
- **Small paid audiences > massive free users**

## The 4 Agents

### 🎯 Agent 1: Game Concept Sniper

**Role:** Game Concept Sniper

**Goal:** Identify simple, AI-driven game concepts that can monetize with small audiences and require near-zero manual content creation.

**Backstory:** Expert in casual, serious, and niche games. Allergic to multiplayer, live ops, and content debt. Focused on games that behave like SaaS.

#### Strict Requirements

Game must be:
- Single-player
- Content auto-generated
- Web-first (desktop/mobile browser)
- Core loop ≤ 3 actions
- No storylines/levels requiring manual design

#### Auto-Reject Conditions
- Multiplayer
- Needs weekly content updates
- Depends on ads or virality

#### Expected Output Format
```
GAME CONCEPT:
TARGET AUDIENCE:
CORE GAME LOOP (max 3 steps):
WHAT AI GENERATES:
WHY USERS PAY (not play):
```

---

### 💰 Agent 2: Game Monetization Enforcer

**Role:** Game Monetization Enforcer

**Goal:** Prove a realistic path to AED 10k–20k/month with a small, paid user base.

**Backstory:** Commercial realist. Kills "fun but broke" ideas. Optimizes for ARPU, not downloads.

#### Strict Requirements

Monetization must be one of:
- Subscription
- Paid unlocks / packs
- B2B / licensing

**Ads are NOT allowed**

Must show math clearly.

#### Auto-Kill Conditions
- Needs >5,000 MAU
- ARPU < AED 20/month
- Monetization is "later"

#### Expected Output Format
```
PRICE POINT (AED):
PAID USERS NEEDED FOR 10k AED:
PAID USERS NEEDED FOR 20k AED:
EXPECTED CONVERSION RATE:
WHY USERS WILL PAY CONSISTENTLY:
CHURN RISK (Low/Medium/High + why):
```

---

### ⚙️ Agent 3: Game Automation Architect

**Role:** Game Automation Architect

**Goal:** Ensure the game runs end-to-end with no daily human involvement.

**Backstory:** Backend-first engineer. Prefers boring systems that print money.

#### Strict Requirements

Must automate:
- Content generation
- Difficulty scaling
- Refresh cadence

**Manual moderation = FAIL**

#### Auto-Kill Conditions
- Automation < 80%
- Requires frequent releases

#### Expected Output Format
```
INTAKE (player input):
AI PROCESSING:
GAME LOGIC (rules-based):
OUTPUT (what player sees):
AUTOMATION SCORE (%):
ANY HUMAN INTERVENTION REQUIRED (Yes/No + why):
```

---

### 🛑 Agent 4: Kill-Switch Governor

**Role:** Kill-Switch Governor

**Goal:** Decide ruthlessly if the idea is worth your time.

**Backstory:** No emotions. No hype. Only scores.

#### Scoring Rules (Mandatory)

**Total: 100 points**

| Category | Points | Criteria |
|----------|--------|----------|
| **Monetization Strength** | 35 | Paid-first model (15), ARPU ≥ AED 20 (10), ≤1,000 users for AED 20k (10) |
| **Automation & Content** | 30 | AI-generated content (15), No manual updates (10), Simple loop (5) |
| **Retention Logic** | 20 | Daily/weekly return trigger (10), Progression without new content (5), No multiplayer dependency (5) |
| **Execution Simplicity** | 15 | Web deployable (5), No app store dependency (5), ≤2 hrs/week maintenance (5) |

#### Decision Rules

| Score | Decision |
|-------|----------|
| ≥85 | **BUILD** |
| 75–84 | **OPTIONAL TEST** |
| <75 | **KILL** |

#### Expected Output Format
```
FINAL SCORE:
GO / NO-GO:
ONE-PARAGRAPH JUSTIFICATION:
```

---

## Reference Game Architecture

This is not theoretical. This is the simplest architecture that works.

### 1️⃣ Frontend (Thin Layer)

**Purpose:** Display + interaction only

**Tech:**
- HTML / CSS / JS (or minimal React)
- Mobile-first responsive
- No complex state

**Features:**
- Login (email or magic link)
- Game screen
- Progress indicator
- Paywall / subscription gate

### 2️⃣ Backend (The Real Product)

**Purpose:** Control everything

**Core Modules:**
- User state (progress, streaks)
- Game rules engine
- Scoring / progression
- Subscription validation

### 3️⃣ AI Content Engine (Stateless)

**Purpose:** Infinite content, zero effort

**Pattern:**
- Prompt template + constraints
- Generate content daily or on demand
- Cache results (avoid re-generation costs)

**Content Examples:**
- Trivia questions
- Puzzles
- Challenges
- Scenarios

### 4️⃣ Automation Layer (Critical)

**Scheduled Jobs:**
- Daily content refresh
- Difficulty scaling
- Expiry of old content
- Email reminders (optional)

No dashboards needed initially.

### 5️⃣ Payments (Simple)

- Stripe / Paddle
- Monthly subscription
- Optional packs
- No trials longer than 7 days

### 6️⃣ Deployment (Zero Ops)

- Static frontend (GitHub Pages / Vercel)
- Backend on lightweight API (serverless)
- Cron-based automation

---

## Usage

### TypeScript/JavaScript

```typescript
import { 
  crewAIOrchestrator,
  gameConceptSniper,
  gameMonetizationEnforcer,
  gameAutomationArchitect,
  killSwitchGovernor 
} from './src/services/agents';

// Run full analysis
const analysis = crewAIOrchestrator.analyzeGameConcept(
  {
    gameConcept: 'Daily Logic Puzzler',
    targetAudience: 'Adults 25-55 seeking mental stimulation',
    coreGameLoop: ['Read puzzle', 'Input solution', 'Receive score'],
    whatAIGenerates: 'Unique logic puzzles, difficulty curves',
    whyUsersPay: 'Unlimited daily puzzles, tracked progress',
  },
  {
    pricePointAED: 29,
    expectedConversionRate: '3-5%',
    whyUsersPay: 'Daily habit, progress tracking, premium features',
    churnLevel: 'Low',
    churnReason: 'Habit-forming engagement',
  },
  {
    intake: 'User session data',
    aiProcessing: 'LLM generates puzzles based on difficulty',
    gameLogic: 'Rules engine validates and scores',
    output: 'Rendered puzzle with feedback',
    humanInterventionRequired: false,
  }
);

// Generate formatted report
const report = crewAIOrchestrator.generateReport(analysis);
console.log(report);

// Check final decision
console.log(`Decision: ${analysis.killSwitch.decision}`);
console.log(`Score: ${analysis.killSwitch.score.finalScore}/100`);
```

### Individual Agent Usage

```typescript
// Use Game Concept Sniper
const conceptValidation = gameConceptSniper.validateConcept({
  isSinglePlayer: true,
  isContentAutoGenerated: true,
  isWebFirst: true,
  coreLoopSteps: 3,
});

// Use Monetization Enforcer
const requiredUsers = gameMonetizationEnforcer.calculateRequiredUsers(20000, 29);
console.log(`Users needed: ${requiredUsers}`);

// Use Kill-Switch Governor
const score = killSwitchGovernor.calculateScore(
  { isPaidFirst: true, arpu: 29, usersFor20k: 690 },
  { isAIGenerated: true, noManualUpdates: true, isSimpleLoop: true },
  { hasReturnTrigger: true, hasProgressionWithoutContent: true, noMultiplayerDependency: true },
  { isWebDeployable: true, noAppStoreDependency: true, isLowMaintenance: true }
);

const decision = killSwitchGovernor.makeDecision(score.finalScore);
```

### Get AI System Prompts

```typescript
// Get prompts for integration with AI APIs (OpenAI, Claude, etc.)
const prompts = crewAIOrchestrator.getAllSystemPrompts();

console.log(prompts.conceptSniper);      // Game Concept Sniper prompt
console.log(prompts.monetizationEnforcer); // Monetization Enforcer prompt
console.log(prompts.automationArchitect);  // Automation Architect prompt
console.log(prompts.killSwitchGovernor);   // Kill-Switch Governor prompt
```

---

## Sample Analysis Output

```
═══════════════════════════════════════════════════════════════════
                    CREWAI GAME CONCEPT ANALYSIS                    
═══════════════════════════════════════════════════════════════════

🎯 AGENT 1: GAME CONCEPT SNIPER
───────────────────────────────────────────────────────────────────
GAME CONCEPT:
Daily Logic Puzzler - AI generates unique logic puzzles daily

TARGET AUDIENCE:
Adults 25-55 seeking mental stimulation during commutes

CORE GAME LOOP (max 3 steps):
1. Read AI-generated logic puzzle
2. Input solution
3. Receive score and streak update

WHAT AI GENERATES:
Unique logic puzzles, difficulty curves, hint systems

WHY USERS PAY (not play):
Unlimited daily puzzles, tracked progress, premium features

💰 AGENT 2: GAME MONETIZATION ENFORCER
───────────────────────────────────────────────────────────────────
PRICE POINT (AED): 29
PAID USERS NEEDED FOR 10k AED: 345
PAID USERS NEEDED FOR 20k AED: 690
EXPECTED CONVERSION RATE: 3-5% of engaged free users
WHY USERS WILL PAY CONSISTENTLY: Daily habit, progress tracking
CHURN RISK (Low): Habit-forming daily engagement

⚙️ AGENT 3: GAME AUTOMATION ARCHITECT
───────────────────────────────────────────────────────────────────
INTAKE (player input): User session data
AI PROCESSING: LLM generates puzzles based on difficulty tier
GAME LOGIC (rules-based): Validates, scores, adjusts difficulty
OUTPUT (what player sees): Rendered puzzle, timer, score
AUTOMATION SCORE (%): 95%
ANY HUMAN INTERVENTION REQUIRED (No): Fully automated pipeline

🛑 AGENT 4: KILL-SWITCH GOVERNOR
───────────────────────────────────────────────────────────────────
FINAL SCORE: 95/100

GO / NO-GO: BUILD

ONE-PARAGRAPH JUSTIFICATION:
Score of 95/100 exceeds BUILD threshold (≥85). Strong monetization 
(35/35), solid automation (30/30), good retention logic (15/20), 
and simple execution (15/15). Proceed with development.
═══════════════════════════════════════════════════════════════════
```

---

## File Structure

```
src/
├── services/
│   └── agents/
│       ├── index.ts                    # Main exports
│       ├── CrewAIOrchestrator.ts       # Orchestration service
│       ├── GameConceptSniper.ts        # Agent 1
│       ├── GameMonetizationEnforcer.ts # Agent 2
│       ├── GameAutomationArchitect.ts  # Agent 3
│       └── KillSwitchGovernor.ts       # Agent 4
├── types/
│   ├── index.ts                        # Type exports
│   └── agents.ts                       # Agent types
└── docs/
    └── CREWAI_AGENTS.md               # This documentation
```

---

## License

MIT License - See [LICENSE](../LICENSE) for details.
