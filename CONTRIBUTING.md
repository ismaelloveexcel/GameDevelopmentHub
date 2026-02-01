# Contributing to GameForge Mobile

Thank you for your interest in contributing to GameForge Mobile! This document provides guidelines for contributing to the project.

## ⚠️ Important: Choose the Right Repository

Before contributing, please note:

- **[gameforge-mobile](https://github.com/ismaelloveexcel/gameforge-mobile)**: For code contributions, features, bug fixes, and active development
- **[GameDevelopmentHub](https://github.com/ismaelloveexcel/GameDevelopmentHub)**: For documentation, guides, and project coordination

📖 **See [REPOSITORY_STRUCTURE.md](REPOSITORY_STRUCTURE.md) for complete details on where to submit your contributions.**

## Code of Conduct

Please be respectful, inclusive, and professional in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/ismaelloveexcel/gameforge-mobile/issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Environment details (OS, device, versions)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Mockups or examples if applicable

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Write/update tests
5. Update documentation
6. Commit with clear messages
7. Push to your fork
8. Open a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/gameforge-mobile.git

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run linter
npm run lint
```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### TypeScript Guidelines

```typescript
// Use explicit types
function calculateScore(points: number): number {
  return points * 10;
}

// Use interfaces for objects
interface Player {
  id: string;
  name: string;
  score: number;
}

// Avoid any when possible
// Use proper types or unknown
```

### Component Guidelines

```typescript
// Functional components with TypeScript
import React from 'react';

interface Props {
  title: string;
  onPress: () => void;
}

export default function MyComponent({ title, onPress }: Props) {
  return (
    // JSX
  );
}
```

## Testing

- Write unit tests for utilities
- Write integration tests for services
- Test components with React Testing Library
- Aim for >80% code coverage

```typescript
// Example test
import { calculateScore } from './helpers';

describe('calculateScore', () => {
  it('multiplies points by 10', () => {
    expect(calculateScore(5)).toBe(50);
  });
});
```

## Documentation

- Update README if needed
- Add JSDoc comments to functions
- Update API documentation
- Include examples in docs

```typescript
/**
 * Calculate player score with multiplier
 * @param points - Base points earned
 * @param multiplier - Score multiplier (default: 1)
 * @returns Final calculated score
 * @example
 * calculateScore(100, 2) // returns 200
 */
export function calculateScore(points: number, multiplier = 1): number {
  return points * multiplier;
}
```

## Commit Messages

Use conventional commits:

```
feat: add new VR template
fix: resolve crash on iOS devices
docs: update API documentation
style: format code with prettier
refactor: simplify engine initialization
test: add tests for Genie service
chore: update dependencies
```

## Areas to Contribute

### High Priority
- New game templates
- Bug fixes
- Performance optimizations
- Documentation improvements

### Medium Priority
- New art styles
- Additional Genie personalities
- Marketing tools
- Analytics features

### Ideas Welcome
- Community features
- Multiplayer support
- Advanced editors
- Plugin system

## Questions?

- Open a discussion on GitHub
- Join our Discord community
- Email: dev@gameforge.mobile

Thank you for contributing! 🎮✨
