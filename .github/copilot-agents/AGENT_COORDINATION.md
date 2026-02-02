# GiftForge Agent Coordination

## Agent Overview

| Agent | Domain | Primary Output | Dependencies |
|-------|--------|----------------|--------------|
| **GiftForge Architect** | System Design | Types, Interfaces, Contracts | None (leads) |
| **Service Engineer** | Business Logic | Services, Data Persistence | Architect |
| **UI Component Builder** | Visual Layer | Screens, Components | Architect, Services |
| **AI Integration Specialist** | AI/ML | OpenAI/Claude Integration | Architect |
| **Animation Designer** | Motion/UX | Animations, Haptics | UI Builder |
| **Deployment Guardian** | DevOps | CI/CD, Builds | All (validates) |

---

## Parallel Development Tracks

```
TRACK A: Core Infrastructure (Week 1)
├── GiftForge Architect → Define types/interfaces
├── Service Engineer → Implement RouletteService, WildCardService
└── AI Integration Specialist → Setup AIService base

TRACK B: UI Foundation (Week 1-2)
├── UI Component Builder → StyleCarousel, RouletteWheel
├── Animation Designer → ConfettiBurst, RouletteSpinner
└── Coordinate with Track A for data contracts

TRACK C: Gift Flow (Week 2)
├── GiftForge Architect → GiftService interface
├── Service Engineer → Implement GiftService, ShareService
├── UI Component Builder → GiftWrapScreen, GiftReceivedScreen
└── Animation Designer → GiftUnwrap, CountdownReveal

TRACK D: AI Features (Week 2-3)
├── AI Integration Specialist → interpretEmojis, generateEasterEggs
├── UI Component Builder → EmojiInputScreen, BlindRevealScreen
└── Service Engineer → Connect to AI service
```

---

## Feature → Agent Mapping

### 🎰 Game Roulette

| Task | Agent | Deliverable |
|------|-------|-------------|
| RouletteResult type | Architect | `src/types/gift.ts` |
| WildCard data | Service Engineer | `src/services/WildCardService.ts` |
| Roulette logic | Service Engineer | `src/services/RouletteService.ts` |
| Wheel UI | UI Builder | `src/components/RouletteWheel.tsx` |
| Spin animation | Animation Designer | `assets/animations/roulette.json` |
| Screen flow | UI Builder | `src/screens/RouletteScreen.tsx` |

### 🎁 Gift Wrapping

| Task | Agent | Deliverable |
|------|-------|-------------|
| Gift, GiftWrap types | Architect | `src/types/gift.ts` |
| GiftService | Service Engineer | `src/services/GiftService.ts` |
| Wrap selection UI | UI Builder | `src/components/GiftWrapCard.tsx` |
| Unwrap animation | Animation Designer | `assets/animations/unwrap.json` |
| Wrap screen | UI Builder | `src/screens/GiftWrapScreen.tsx` |
| Recipient screen | UI Builder | `src/screens/GiftReceivedScreen.tsx` |

### 🎨 Style Remix

| Task | Agent | Deliverable |
|------|-------|-------------|
| Extend ArtStyleService | Service Engineer | Add `getRandomStyle()` |
| Carousel component | UI Builder | `src/components/StyleCarousel.tsx` |
| Style morph animation | Animation Designer | Transition effects |
| Screen integration | UI Builder | `src/screens/StyleRemixScreen.tsx` |

### 📱 Emoji Story Mode

| Task | Agent | Deliverable |
|------|-------|-------------|
| EmojiStory type | Architect | `src/types/gift.ts` |
| interpretEmojis method | AI Specialist | `src/services/AIService.ts` |
| Emoji picker UI | UI Builder | `src/components/EmojiPicker.tsx` |
| Input screen | UI Builder | `src/screens/EmojiInputScreen.tsx` |
| Pop animations | Animation Designer | Emoji feedback effects |

### 🎁 Blind Date Game

| Task | Agent | Deliverable |
|------|-------|-------------|
| BlindDateConfig type | Architect | `src/types/gift.ts` |
| generateEasterEggs | AI Specialist | `src/services/AIService.ts` |
| Reveal sequence UI | UI Builder | `src/components/CountdownReveal.tsx` |
| Reveal screen | UI Builder | `src/screens/BlindRevealScreen.tsx` |
| 3-2-1 animation | Animation Designer | Countdown effects |

---

## Communication Protocol

### Handoff Format

When passing work between agents, use this format:

```markdown
## Handoff: [From Agent] → [To Agent]

### What's Ready
- [File path]: [Description]

### Integration Points
- [Interface/Type]: [How to use it]

### Open Questions
- [Any decisions needed]

### Next Steps
- [What the receiving agent should do]
```

### Example Handoff

```markdown
## Handoff: Architect → Service Engineer

### What's Ready
- `src/types/gift.ts`: Full Gift domain types

### Integration Points
- `RouletteResult` interface: Use for spinRoulette() return type
- `WildCard` interface: Implement in WildCardService

### Open Questions
- Should combination tracking be local (AsyncStorage) or remote (API)?

### Next Steps
1. Implement WildCardService with 20 wild cards
2. Implement RouletteService using templateLibrary + artStyleService
3. Add random selection methods to existing services
```

---

## Daily Standup Structure

Each agent reports:

1. **Yesterday**: What I completed
2. **Today**: What I'm working on
3. **Blockers**: What I'm waiting for
4. **Handoffs**: What I'm passing to other agents

---

## Quality Gates

Before handoff, each agent must verify:

| Agent | Quality Check |
|-------|---------------|
| Architect | Types compile, JSDoc complete |
| Service Engineer | Unit tests pass, no lint errors |
| UI Builder | Component renders, theme support works |
| AI Specialist | API calls work, fallbacks in place |
| Animation Designer | 60fps performance, reduced motion support |
| Deployment Guardian | CI passes, no breaking changes |

---

## File Ownership

```
src/
├── types/
│   ├── index.ts          # Architect
│   ├── gift.ts           # Architect (NEW)
│   └── agents.ts         # Existing
├── services/
│   ├── GiftService.ts    # Service Engineer (NEW)
│   ├── RouletteService.ts # Service Engineer (NEW)
│   ├── WildCardService.ts # Service Engineer (NEW)
│   ├── ShareService.ts   # Service Engineer (NEW)
│   ├── AIService.ts      # AI Specialist (NEW)
│   ├── TemplateLibrary.ts # Service Engineer (extend)
│   ├── ArtStyleService.ts # Service Engineer (extend)
│   └── GenieService.ts   # AI Specialist (enhance)
├── screens/
│   ├── RouletteScreen.tsx # UI Builder (NEW)
│   ├── GiftWrapScreen.tsx # UI Builder (NEW)
│   ├── EmojiInputScreen.tsx # UI Builder (NEW)
│   ├── BlindRevealScreen.tsx # UI Builder (NEW)
│   ├── GiftReceivedScreen.tsx # UI Builder (NEW)
│   └── ... existing ...
├── components/
│   ├── RouletteWheel.tsx  # UI Builder (NEW)
│   ├── StyleCarousel.tsx  # UI Builder (NEW)
│   ├── EmojiPicker.tsx    # UI Builder (NEW)
│   ├── GiftWrapCard.tsx   # UI Builder (NEW)
│   └── animations/        # Animation Designer (NEW)
│       ├── ConfettiBurst.tsx
│       ├── GiftUnwrap.tsx
│       └── CountdownReveal.tsx
├── prompts/               # AI Specialist (NEW)
│   ├── emojiInterpretation.ts
│   └── easterEggs.ts
└── utils/
    ├── animations.ts      # Animation Designer (NEW)
    └── haptics.ts         # Animation Designer (NEW)

assets/
├── animations/            # Animation Designer (NEW)
│   ├── confetti.json
│   ├── roulette.json
│   ├── unwrap.json
│   └── countdown.json
└── sounds/                # Animation Designer (NEW)
```

---

## Sprint Planning

### Sprint 1: Foundation (Feb 1-7)
- [ ] Architect: All types defined
- [ ] Service Engineer: RouletteService, WildCardService
- [ ] AI Specialist: AIService base setup
- [ ] UI Builder: StyleCarousel, RouletteWheel
- [ ] Animation Designer: ConfettiBurst, RouletteSpinner

### Sprint 2: Core Features (Feb 8-14)
- [ ] Service Engineer: GiftService, ShareService
- [ ] UI Builder: GiftWrapScreen, RouletteScreen
- [ ] Animation Designer: GiftUnwrap
- [ ] AI Specialist: Emoji interpretation
- [ ] Deployment Guardian: Verify MVP builds

### Sprint 3: AI & Polish (Feb 15-21)
- [ ] AI Specialist: Easter eggs, enhance Genie
- [ ] UI Builder: EmojiInputScreen, BlindRevealScreen
- [ ] Animation Designer: CountdownReveal
- [ ] All: Integration testing

### Sprint 4: Launch Prep (Feb 22-28)
- [ ] All: Bug fixes
- [ ] Deployment Guardian: Production deployment
- [ ] All: Ramadan content preparation

---

## Quick Reference

### Invoke an Agent
```
@giftforge-architect Design the Gift data model
@service-engineer Implement RouletteService
@ui-component-builder Build the StyleCarousel component
@ai-integration-specialist Setup emoji interpretation
@animation-designer Create the confetti celebration
@deployment-guardian Run full deployment check
```

### Check Agent Status
```
@[agent-name] What's your current status?
```

### Request Handoff
```
@[agent-name] Hand off [deliverable] to @[other-agent]
```
