# Repository Structure & Organization

## Overview

This document clarifies the relationship between related repositories and their intended purposes.

## Repository Relationships

### Primary Repository
**[gameforge-mobile](https://github.com/ismaelloveexcel/gameforge-mobile)**
- **Purpose**: Main development repository for the GameForge Mobile application
- **Contains**: Core application code, GiftForge features, and active development
- **Target for**: Feature PRs, bug fixes, and GiftForge pivot development

### Documentation/Hub Repository
**[GameDevelopmentHub](https://github.com/ismaelloveexcel/GameDevelopmentHub)**
- **Purpose**: Documentation, guides, and project coordination
- **Contains**: Deployment guides, setup instructions, and general documentation
- **Target for**: Documentation updates, guide improvements, and general project information

## Important Notes

### [PR #27 - Overall Project Understanding](https://github.com/ismaelloveexcel/GameDevelopmentHub/pull/27)

**Issue**: [PR #27](https://github.com/ismaelloveexcel/GameDevelopmentHub/pull/27) "Overall project understanding" was created in the GameDevelopmentHub repository but contains content intended for the gameforge-mobile repository.

**Resolution**: This PR includes:
- Specialized GitHub Copilot agents for GiftForge development
- New React Native components (EmojiPicker, RouletteWheel, StyleCarousel, etc.)
- Service implementations (AIService, ShareService, WildCardService)
- New screens for the GiftForge pivot (BrandingStudioScreen, GiftCreationScreen, etc.)
- Agent coordination documentation

**Recommendation**: The content from PR #27 should be submitted to the [gameforge-mobile](https://github.com/ismaelloveexcel/gameforge-mobile) repository instead, as it contains:
1. Application code changes (not documentation)
2. GiftForge-specific features
3. Active development work meant for the main codebase

## Guidelines for Contributors

When submitting PRs, please follow these guidelines:

### Submit to `gameforge-mobile` if your PR includes:
- New features or components
- Bug fixes in application code
- Service implementations
- UI/UX changes
- Mobile app-specific changes
- GiftForge pivot development

### Submit to `GameDevelopmentHub` if your PR includes:
- Documentation updates
- Deployment guide improvements
- Setup instruction changes
- General project information
- Architecture documentation (non-code)

## Migrating PR #27 Content

If you're working with PR #27 content, please:
1. Close or reference PR #27 in GameDevelopmentHub
2. Create a new PR in [gameforge-mobile](https://github.com/ismaelloveexcel/gameforge-mobile) with the same content
3. Update the PR description to reference this repository structure document

## Questions?

For questions about repository organization or where to submit your contribution, please open an issue in the appropriate repository or contact the maintainers.
