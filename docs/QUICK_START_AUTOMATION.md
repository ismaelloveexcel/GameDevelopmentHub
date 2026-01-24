# Quick Start Guide: UAE Gaming Side Hustle

## 🚀 Getting Started in 30 Minutes

This guide helps you set up the automated game development pipeline for minimal manual intervention.

---

## Prerequisites

1. **GitHub Account** - For repository and automation
2. **OpenAI API Key** - For AI agents intelligence (https://platform.openai.com/api-keys)
3. **5-10 minutes/day** - For reviewing opportunities and approving builds

---

## Step 1: Configure API Keys (5 minutes)

### Option A: GitHub Actions (Recommended for Automation)

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `ANTHROPIC_API_KEY`: (Optional) For Claude AI
   - `SLACK_WEBHOOK_URL`: (Optional) For notifications

### Option B: Local Testing

Create `.env` file in repository root:
```bash
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**⚠️ Never commit .env to git!** (Already in .gitignore)

---

## Step 2: Install Dependencies (5 minutes)

### For Local Development
```bash
# Install Python dependencies
pip install crewai langchain langchain-openai beautifulsoup4 requests pandas python-dotenv

# Install Node.js dependencies (for testing React Native code)
npm install
```

### For GitHub Actions Only
- No local installation needed
- Dependencies install automatically on each run

---

## Step 3: Test the System (10 minutes)

### Test Market Research
```bash
python scripts/uae_automation.py --mode research
```

Expected output:
- Creates `automation_output/opportunities/research_TIMESTAMP.json`
- Lists 3-5 game opportunities with scores

### Test Business Validation
```bash
python scripts/uae_automation.py --mode validate
```

Expected output:
- Creates `automation_output/validations/validated_TIMESTAMP.json`
- Shows GO/HOLD/NO-GO decisions

### Test Full Pipeline
```bash
python scripts/uae_automation.py --mode full
```

Expected output:
- Runs complete automation
- May take 10-15 minutes
- Creates game prototype if opportunity scores ≥75

---

## Step 4: Enable Daily Automation (5 minutes)

### Automatic Daily Runs

The workflow `.github/workflows/daily-automation.yml` is already configured to run daily at 6 AM UAE time.

**What happens automatically:**
1. **3:00 AM UTC (6 AM UAE)** - Market research runs
2. Opportunities are identified and scored
3. Best opportunity is validated
4. If score ≥75: Game is built automatically
5. If score 60-74: Flagged for your review
6. Results uploaded as GitHub artifacts

### Manual Trigger (When Needed)

1. Go to **Actions** tab in GitHub
2. Click **Daily UAE Game Automation**
3. Click **Run workflow**
4. Select mode (research/validate/full)
5. Click **Run workflow** button

---

## Step 5: Daily Workflow (2-3 hours/week)

### Morning Review (10 minutes/day)
1. Check GitHub Actions results
2. Review `automation_output/` artifacts
3. Look for flagged opportunities (score 60-74)
4. Approve/reject conditional GO items

### Weekly Deep Dive (1 hour/week)
1. Review all generated games
2. Test top prototypes on device
3. Select 1-2 for app store submission
4. Adjust strategy based on results

### Monthly Planning (1 hour/month)
1. Review performance metrics
2. Update agent prompts if needed
3. Add seasonal opportunities manually
4. Plan marketing campaigns

---

## Understanding the Pipeline

### Automation Flow
```
Daily @ 6 AM UAE
    ↓
Market Research Agent
    → Scans UAE gaming trends
    → Identifies festival opportunities
    → Finds content gaps
    ↓
Business Validator Agent
    → Calculates ROI
    → Assesses risks
    → Scores 0-100
    ↓
Decision Logic
    → Score ≥75: Auto-build ✅
    → Score 60-74: Flag for review ⚠️
    → Score <60: Reject ❌
    ↓
If Approved:
    Idea Polisher → Repo Reviewer → Game Builder → Game Tester
    ↓
Output to prototypes/
```

### File Locations

**Automation Output:**
- `automation_output/opportunities/` - Market research results
- `automation_output/validations/` - Business validation scores
- `automation_output/reports/` - Complete pipeline results

**Code Output:**
- `prototypes/` - Generated game components
- Ready to integrate and test

**Logs:**
- GitHub Actions artifacts (download from Actions tab)

---

## Step 6: First Game Launch (Week 1-2)

### Days 1-3: Setup & Testing
- [x] Configure API keys
- [x] Test all modes locally
- [x] Review first automation results
- [ ] Select best opportunity manually

### Days 4-7: Build & Polish
- [ ] Review auto-generated prototype
- [ ] Test on mobile device (Expo Go)
- [ ] Add final touches (icons, sounds)
- [ ] Prepare app store assets

### Days 8-10: Deploy
- [ ] Create app store listings
- [ ] Submit for review (iOS: 24-48h, Android: instant)
- [ ] Set up monetization (AdMob, etc.)
- [ ] Launch soft launch in UAE

### Days 11-14: Monitor & Iterate
- [ ] Track downloads and revenue
- [ ] Gather user feedback
- [ ] Update based on data
- [ ] Start next game pipeline

---

## Key Success Metrics

### Week 1-4 (Learning Phase)
- **Goal:** System running smoothly
- **Metric:** 5+ opportunities identified per week
- **Target:** 1 game launched

### Month 2-3 (Growth Phase)
- **Goal:** Build portfolio
- **Metric:** 2-3 games launched per month
- **Target:** $500+ total monthly revenue

### Month 4-6 (Scale Phase)
- **Goal:** Optimize and scale
- **Metric:** 4-6 games in portfolio
- **Target:** $2,000+ monthly revenue

### Month 6+ (Passive Income)
- **Goal:** Minimal intervention
- **Metric:** Portfolio performing
- **Target:** $3,000-5,000/month
- **Time:** 2-3 hours/week

---

## Troubleshooting

### "No API key found"
- Add `OPENAI_API_KEY` to GitHub secrets or `.env` file
- Verify key is valid at https://platform.openai.com

### "CrewAI import error"
- Run: `pip install crewai langchain langchain-openai`
- Check Python version (requires 3.8+)

### "No opportunities found"
- Normal on some days (market conditions)
- Check `automation_output/opportunities/` for details
- Try manual trigger with `--mode research`

### "Score too low for auto-approval"
- Review validation in `automation_output/validations/`
- Manually approve if you believe in the idea
- Adjust thresholds in `uae_automation.py` if needed

### "GitHub Actions failing"
- Check Actions tab for error logs
- Verify API keys are set correctly
- Check workflow file syntax

---

## Advanced Configuration

### Adjust Auto-Approval Threshold
Edit `scripts/uae_automation.py`:
```python
# Line ~340
if score >= 75 and decision == 'GO':  # Change 75 to your threshold
```

### Change Schedule
Edit `.github/workflows/daily-automation.yml`:
```yaml
schedule:
  - cron: '0 3 * * *'  # 6 AM UAE = 3 AM UTC
  # Change to your preferred time
```

### Add Custom Agents
Create `.github/agents/your-agent.agent.md`:
```yaml
---
name: Your Agent Name
description: What it does
tools: [web_search, code_execution]
---
Your agent instructions here...
```

---

## Getting Help

### Documentation
- **Full Strategy:** `docs/AI_AUTOMATION_STRATEGY.md`
- **Agent Details:** `.github/agents/`
- **Code Reference:** `scripts/uae_automation.py`

### Resources
- **OpenAI Docs:** https://platform.openai.com/docs
- **CrewAI Docs:** https://docs.crewai.com
- **React Native:** https://reactnative.dev
- **Expo:** https://docs.expo.dev

### Community
- **Issues:** Open GitHub issue in repository
- **Discussions:** GitHub Discussions tab

---

## Next Steps

1. ✅ Complete this setup guide
2. 📊 Review `docs/AI_AUTOMATION_STRATEGY.md` for detailed strategy
3. 🤖 Customize agents in `.github/agents/` for your needs
4. 🚀 Launch first game and iterate
5. 📈 Scale portfolio based on data

---

## Remember

- **Start small:** One game at a time
- **Validate first:** Don't build without business validation
- **Iterate fast:** Launch, learn, improve
- **Trust the data:** Let agents and metrics guide decisions
- **Stay focused:** Quality over quantity in early stages

**Your goal:** $3,000-5,000/month passive income within 6 months with 2-3 hours/week effort.

Let the automation work for you! 🚀

---

**Last Updated:** 2026-01-24  
**Version:** 1.0
