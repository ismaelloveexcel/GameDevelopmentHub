# Contributing to GameForge Mobile

## Before You Start

1. Read the [Code of Conduct](CODE_OF_CONDUCT.md)
2. Check existing [issues](https://github.com/ismaelloveexcel/GameDevelopmentHub/issues) and [pull requests](https://github.com/ismaelloveexcel/GameDevelopmentHub/pulls)
3. For large changes, open an issue first to discuss the approach

## Development Setup

```bash
git clone https://github.com/ismaelloveexcel/GameDevelopmentHub.git
cd GameDevelopmentHub
npm install
npm test
npm run lint
```

All tests and lint checks must pass before submitting a PR.

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`: `git checkout -b feature/short-description`
3. Make your changes
4. Ensure tests pass: `npm test`
5. Ensure lint passes: `npm run lint`
6. Ensure TypeScript compiles: `npx tsc --noEmit`
7. Commit using conventional commits (see below)
8. Push to your fork and open a PR against `main`

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(templates): add racing game template
fix(engine): resolve Pixi.js memory leak on unmount
docs(readme): update local development setup
```

## Code Standards

- TypeScript strict mode is enforced
- All new code must include type annotations
- Avoid `any` types; use `unknown` or proper types
- Follow existing code patterns in the repository
- Keep functions focused and small
- Add JSDoc comments for public APIs

## Testing Requirements

- New features require tests
- Bug fixes require regression tests
- Maintain or improve existing test coverage
- Test files go in `src/__tests__/`

Run tests:
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## What We Accept

- Bug fixes with clear reproduction steps
- Documentation improvements
- Test coverage improvements
- Performance optimizations with benchmarks
- New templates following existing patterns

## What We Do Not Accept

- Breaking changes without prior discussion
- Features without tests
- Code that does not pass lint/type checks
- Large refactors without prior approval
- Dependencies without security review

## Questions

Open a GitHub issue with the `question` label.
