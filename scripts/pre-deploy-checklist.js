#!/usr/bin/env node
/**
 * Pre-Deployment Checklist
 * 
 * Interactive checklist to ensure all deployment requirements are met.
 * Run this before pushing to main or triggering a deployment.
 */

const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function checkItem(description, autoCheck = null) {
  if (autoCheck) {
    try {
      const result = autoCheck();
      if (result) {
        log(`✓ ${description}`, 'green');
        return true;
      } else {
        log(`✗ ${description}`, 'red');
        return false;
      }
    } catch (error) {
      log(`⚠ ${description} - Could not auto-check`, 'yellow');
      const answer = await question(`  Did you complete this? (y/n): `);
      return answer.toLowerCase() === 'y';
    }
  } else {
    const answer = await question(`${description} (y/n): `);
    return answer.toLowerCase() === 'y';
  }
}

async function runChecklist() {
  log('\n' + '═'.repeat(80), 'cyan');
  log('🛡️  PRE-DEPLOYMENT CHECKLIST', 'bold');
  log('═'.repeat(80) + '\n', 'cyan');
  
  const checks = [];
  
  // Code Quality
  log('📝 CODE QUALITY', 'cyan');
  checks.push(await checkItem('✓ All code changes committed', () => {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().length === 0;
  }));
  
  checks.push(await checkItem('✓ Tests passing (npm test)', () => {
    try {
      execSync('npm test -- --passWithNoTests 2>&1', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }));
  
  checks.push(await checkItem('✓ No TypeScript errors (npx tsc --noEmit)', () => {
    try {
      execSync('npx tsc --noEmit 2>&1', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }));
  
  checks.push(await checkItem('✓ Linting acceptable (npm run lint)'));
  
  // Configuration
  log('\n⚙️  CONFIGURATION', 'cyan');
  checks.push(await checkItem('✓ app.json updated with correct version', () => {
    const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
    return appJson.expo && appJson.expo.version;
  }));
  
  checks.push(await checkItem('✓ Build profiles in eas.json are correct', () => {
    const easJson = JSON.parse(fs.readFileSync('eas.json', 'utf8'));
    return easJson.build && Object.keys(easJson.build).length > 0;
  }));
  
  // Documentation
  log('\n📚 DOCUMENTATION', 'cyan');
  checks.push(await checkItem('✓ README.md is up to date'));
  checks.push(await checkItem('✓ CHANGELOG or release notes updated (if applicable)'));
  
  // Security
  log('\n🔒 SECURITY', 'cyan');
  checks.push(await checkItem('✓ No secrets or credentials in code'));
  checks.push(await checkItem('✓ GitHub Secrets configured (EXPO_TOKEN if needed)'));
  checks.push(await checkItem('✓ Reviewed npm audit results'));
  
  // Deployment Setup
  log('\n🚀 DEPLOYMENT SETUP', 'cyan');
  checks.push(await checkItem('✓ GitHub Pages enabled (for web deployment)'));
  checks.push(await checkItem('✓ Workflow permissions set correctly'));
  checks.push(await checkItem('✓ Target branch is correct (main/production)'));
  
  // Testing
  log('\n🧪 TESTING', 'cyan');
  checks.push(await checkItem('✓ Tested changes locally'));
  checks.push(await checkItem('✓ Tested on different devices/browsers (if applicable)'));
  checks.push(await checkItem('✓ No console errors in browser'));
  
  // Final Checks
  log('\n✅ FINAL CHECKS', 'cyan');
  checks.push(await checkItem('✓ Deployment target confirmed'));
  checks.push(await checkItem('✓ Rollback plan in place'));
  checks.push(await checkItem('✓ Team notified about deployment'));
  
  // Calculate results
  const passed = checks.filter(Boolean).length;
  const total = checks.length;
  const percentage = ((passed / total) * 100).toFixed(0);
  
  // Display results
  log('\n' + '═'.repeat(80), 'cyan');
  log('📊 CHECKLIST RESULTS', 'bold');
  log('═'.repeat(80), 'cyan');
  
  log(`\nCompleted: ${passed}/${total} (${percentage}%)`);
  
  if (passed === total) {
    log('\n✅ ALL CHECKS PASSED - READY FOR DEPLOYMENT!', 'green');
    log('\nNext steps:', 'cyan');
    log('  1. Run: npm run deploy:check', 'reset');
    log('  2. Push to main: git push origin main', 'reset');
    log('  3. Monitor: https://github.com/ismaelloveexcel/GameDevelopmentHub/actions\n', 'reset');
    rl.close();
    process.exit(0);
  } else if (passed >= total * 0.8) {
    log('\n⚠️  MOSTLY READY - Fix remaining items before deploying', 'yellow');
    log(`\nMissing: ${total - passed} items\n`, 'yellow');
    rl.close();
    process.exit(1);
  } else {
    log('\n❌ NOT READY - Complete more items before deploying', 'red');
    log(`\nMissing: ${total - passed} items\n`, 'red');
    rl.close();
    process.exit(1);
  }
}

// Run the checklist
log('\nThis interactive checklist will help ensure deployment readiness.\n');
log('Answer "y" for yes or "n" for no to each item.\n');

runChecklist().catch((error) => {
  log(`\nError: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});
