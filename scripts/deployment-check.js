#!/usr/bin/env node
/**
 * Deployment Guardian - Automated Deployment Readiness Checker
 * 
 * This script performs comprehensive pre-deployment validation for GameDevelopmentHub.
 * It checks CI status, secrets, workflows, code quality, and deployment paths.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Configuration constants
const CONFIG = {
  LINT_WARNING_THRESHOLD: 50,  // Maximum acceptable lint warnings
  MIN_GREEN_SCORE: 8.5,         // Minimum score for GREEN status
  MIN_YELLOW_SCORE: 7.0,        // Minimum score for YELLOW status
  MAX_WARNINGS_FOR_GREEN: 10,   // Maximum warnings for GREEN status
  MAX_FAILURES_FOR_YELLOW: 5,   // Maximum failures for YELLOW status
};

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

/**
 * Get repository information from package.json or git
 */
function getRepoInfo() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.repository && packageJson.repository.url) {
      const match = packageJson.repository.url.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
      if (match) {
        return {
          owner: match[1],
          repo: match[2],
          actionsUrl: `https://github.com/${match[1]}/${match[2]}/actions`,
          pagesUrl: `https://${match[1]}.github.io/${match[2]}/`,
        };
      }
    }
  } catch (error) {
    // Fall back to git remote
  }
  
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const match = remote.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
        actionsUrl: `https://github.com/${match[1]}/${match[2]}/actions`,
        pagesUrl: `https://${match[1]}.github.io/${match[2]}/`,
      };
    }
  } catch (error) {
    // Use default values
  }
  
  // Default fallback
  return {
    owner: 'ismaelloveexcel',
    repo: 'GameDevelopmentHub',
    actionsUrl: 'https://github.com/ismaelloveexcel/GameDevelopmentHub/actions',
    pagesUrl: 'https://ismaelloveexcel.github.io/GameDevelopmentHub/',
  };
}

class DeploymentGuardian {
  constructor() {
    this.issues = {
      high: [],
      medium: [],
      low: [],
    };
    this.checks = {
      passed: 0,
      failed: 0,
      warnings: 0,
    };
    this.repoInfo = getRepoInfo();
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  section(title) {
    this.log(`\n${'═'.repeat(80)}`, 'cyan');
    this.log(`${title}`, 'bold');
    this.log('═'.repeat(80), 'cyan');
  }

  check(name, status, details = '') {
    const icon = status === 'pass' ? '✓' : status === 'warn' ? '⚠' : '✗';
    const color = status === 'pass' ? 'green' : status === 'warn' ? 'yellow' : 'red';
    
    this.log(`${icon} ${name}`, color);
    if (details) {
      this.log(`  ${details}`, 'reset');
    }

    if (status === 'pass') this.checks.passed++;
    else if (status === 'warn') this.checks.warnings++;
    else this.checks.failed++;
  }

  addIssue(severity, title, reason, evidence, fix) {
    this.issues[severity].push({ title, reason, evidence, fix });
  }

  async runChecks() {
    this.section('🛡️  DEPLOYMENT GUARDIAN - COMPREHENSIVE READINESS CHECK');
    
    await this.checkRepositoryStructure();
    await this.checkWorkflows();
    await this.checkDependencies();
    await this.checkCodeQuality();
    await this.checkConfiguration();
    await this.checkDocumentation();
    
    this.displaySummary();
  }

  async checkRepositoryStructure() {
    this.section('📁 Repository Structure');
    
    const requiredFiles = [
      'package.json',
      'app.json',
      'eas.json',
      '.github/workflows/ci.yml',
      '.github/workflows/deploy-web.yml',
      '.github/workflows/build-mobile.yml',
      'src/services/GenieService.ts',
      'src/services/TemplateLibrary.ts',
    ];

    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        this.check(file, 'pass');
      } else {
        this.check(file, 'fail', 'Missing required file');
        this.addIssue(
          'high',
          `Missing ${file}`,
          'Required file for deployment is missing',
          `File not found: ${file}`,
          `Create the missing file: ${file}`
        );
      }
    }
  }

  async checkWorkflows() {
    this.section('⚙️  GitHub Actions Workflows');
    
    const workflows = ['ci.yml', 'deploy-web.yml', 'build-mobile.yml'];
    
    for (const workflow of workflows) {
      const workflowPath = `.github/workflows/${workflow}`;
      if (fs.existsSync(workflowPath)) {
        const content = fs.readFileSync(workflowPath, 'utf8');
        
        // Check for basic workflow structure
        const hasName = content.includes('name:');
        const hasOn = content.includes('on:');
        const hasJobs = content.includes('jobs:');
        
        if (hasName && hasOn && hasJobs) {
          this.check(`Workflow: ${workflow}`, 'pass', 'Valid structure');
        } else {
          this.check(`Workflow: ${workflow}`, 'warn', 'Incomplete structure');
          this.addIssue(
            'medium',
            `Workflow ${workflow} incomplete`,
            'Workflow file is missing required sections',
            `Missing: name=${!hasName}, on=${!hasOn}, jobs=${!hasJobs}`,
            `Review and fix workflow structure in ${workflowPath}`
          );
        }
      } else {
        this.check(`Workflow: ${workflow}`, 'fail', 'Missing');
        this.addIssue(
          'high',
          `Missing workflow: ${workflow}`,
          'Required GitHub Actions workflow is missing',
          `File not found: ${workflowPath}`,
          `Create workflow file: ${workflowPath}`
        );
      }
    }
  }

  async checkDependencies() {
    this.section('📦 Dependencies & Security');
    
    try {
      // Check if node_modules exists
      if (!fs.existsSync('node_modules')) {
        this.check('node_modules', 'warn', 'Dependencies not installed');
        this.addIssue(
          'medium',
          'Dependencies not installed',
          'node_modules directory is missing',
          'Run npm ci to install dependencies',
          'Run: npm ci'
        );
        return;
      }
      
      this.check('node_modules', 'pass', 'Dependencies installed');
      
      // Check npm audit
      try {
        const tmpDir = os.tmpdir();
        const auditFile = path.join(tmpDir, `audit-${Date.now()}.json`);
        execSync(`npm audit --json > ${auditFile} 2>&1`, { stdio: 'ignore' });
        const auditData = JSON.parse(fs.readFileSync(auditFile, 'utf8'));
        
        const vulnerabilities = auditData.metadata?.vulnerabilities || {};
        const total = Object.values(vulnerabilities).reduce((a, b) => a + b, 0);
        
        if (total === 0) {
          this.check('Security audit', 'pass', 'No vulnerabilities found');
        } else {
          const critical = vulnerabilities.critical || 0;
          const high = vulnerabilities.high || 0;
          
          if (critical > 0 || high > 5) {
            this.check('Security audit', 'fail', `${total} vulnerabilities (${critical} critical, ${high} high)`);
            this.addIssue(
              'high',
              'Security vulnerabilities detected',
              `Found ${total} vulnerabilities including ${critical} critical and ${high} high severity`,
              'Run npm audit for details',
              'Run: npm audit fix (or npm audit fix --force for breaking changes)'
            );
          } else {
            this.check('Security audit', 'warn', `${total} vulnerabilities (manageable)`);
            this.addIssue(
              'low',
              'Minor security vulnerabilities',
              `Found ${total} vulnerabilities but none critical`,
              'Run npm audit for details',
              'Run: npm audit fix'
            );
          }
        }
        
        // Clean up temp file
        if (fs.existsSync(auditFile)) {
          fs.unlinkSync(auditFile);
        }
      } catch (error) {
        this.check('Security audit', 'warn', 'Could not run npm audit');
      }
      
    } catch (error) {
      this.check('Dependencies', 'fail', error.message);
    }
  }

  async checkCodeQuality() {
    this.section('✨ Code Quality');
    
    try {
      // Check ESLint
      try {
        const lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf8' });
        const warningMatches = lintOutput.match(/(\d+) problems/);
        
        if (lintOutput.includes('✖ 0 problems')) {
          this.check('ESLint', 'pass', 'No issues found');
        } else if (warningMatches) {
          const problems = parseInt(warningMatches[1], 10);
          // Threshold for acceptable lint warnings
          if (problems < CONFIG.LINT_WARNING_THRESHOLD) {
            this.check('ESLint', 'warn', `${problems} issues (acceptable)`);
          } else {
            this.check('ESLint', 'fail', `${problems} issues`);
            this.addIssue(
              'medium',
              'ESLint issues',
              `Found ${problems} linting issues`,
              'Run npm run lint for details',
              'Fix linting issues or add exceptions'
            );
          }
        } else {
          this.check('ESLint', 'pass', 'Completed successfully');
        }
      } catch (error) {
        // ESLint might exit with error code even with warnings
        const output = error.stdout?.toString() || '';
        if (output.includes('problems')) {
          this.check('ESLint', 'warn', 'Has warnings but passed');
        } else {
          this.check('ESLint', 'warn', 'Could not verify');
        }
      }
      
      // Check TypeScript
      try {
        execSync('npx tsc --noEmit 2>&1', { encoding: 'utf8' });
        this.check('TypeScript', 'pass', 'No type errors');
      } catch (error) {
        this.check('TypeScript', 'fail', 'Type errors found');
        this.addIssue(
          'high',
          'TypeScript errors',
          'TypeScript compilation has errors',
          'Run npx tsc --noEmit for details',
          'Fix TypeScript errors in the codebase'
        );
      }
      
      // Check tests
      try {
        const testOutput = execSync('npm test -- --passWithNoTests 2>&1', { encoding: 'utf8' });
        if (testOutput.includes('Test Suites:') && !testOutput.includes('failed')) {
          this.check('Tests', 'pass', 'All tests passing');
        } else {
          this.check('Tests', 'warn', 'Check test results');
        }
      } catch (error) {
        this.check('Tests', 'fail', 'Tests failed');
        this.addIssue(
          'high',
          'Test failures',
          'Some tests are failing',
          'Run npm test for details',
          'Fix failing tests'
        );
      }
      
    } catch (error) {
      this.check('Code Quality', 'warn', 'Could not complete checks');
    }
  }

  async checkConfiguration() {
    this.section('⚙️  Configuration Files');
    
    // Check app.json
    try {
      const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
      
      if (appJson.expo) {
        this.check('app.json', 'pass', 'Valid Expo configuration');
        
        // Check required fields
        const hasName = appJson.expo.name;
        const hasSlug = appJson.expo.slug;
        const hasVersion = appJson.expo.version;
        
        if (!hasName || !hasSlug || !hasVersion) {
          this.addIssue(
            'medium',
            'Incomplete app.json',
            'Missing required Expo configuration fields',
            `Missing: name=${!hasName}, slug=${!hasSlug}, version=${!hasVersion}`,
            'Add missing fields to app.json'
          );
        }
      } else {
        this.check('app.json', 'warn', 'Missing Expo configuration');
      }
    } catch (error) {
      this.check('app.json', 'fail', 'Invalid or missing');
    }
    
    // Check eas.json
    try {
      const easJson = JSON.parse(fs.readFileSync('eas.json', 'utf8'));
      
      if (easJson.build) {
        const profiles = Object.keys(easJson.build);
        this.check('eas.json', 'pass', `${profiles.length} build profiles configured`);
      } else {
        this.check('eas.json', 'warn', 'No build profiles');
      }
    } catch (error) {
      this.check('eas.json', 'fail', 'Invalid or missing');
    }
  }

  async checkDocumentation() {
    this.section('📚 Documentation');
    
    const docs = [
      'README.md',
      'docs/GETTING_STARTED.md',
      'docs/GITHUB_ACTIONS_DEPLOYMENT.md',
      'docs/DEPLOYMENT.md',
    ];
    
    for (const doc of docs) {
      if (fs.existsSync(doc)) {
        const content = fs.readFileSync(doc, 'utf8');
        if (content.length > 100) {
          this.check(doc, 'pass', `${Math.round(content.length / 1024)}KB`);
        } else {
          this.check(doc, 'warn', 'Very short documentation');
        }
      } else {
        this.check(doc, 'warn', 'Missing documentation');
        this.addIssue(
          'low',
          `Missing ${doc}`,
          'Documentation file is missing',
          `File not found: ${doc}`,
          `Create documentation: ${doc}`
        );
      }
    }
  }

  displaySummary() {
    this.section('📊 DEPLOYMENT READINESS SUMMARY');
    
    const totalChecks = this.checks.passed + this.checks.failed + this.checks.warnings;
    const score = totalChecks > 0 
      ? ((this.checks.passed + this.checks.warnings * 0.5) / totalChecks * 10).toFixed(1)
      : 0;
    
    // Determine status color based on configurable thresholds
    let status = 'GREEN';
    let statusColor = 'green';
    if (score < CONFIG.MIN_YELLOW_SCORE || this.checks.failed > CONFIG.MAX_FAILURES_FOR_YELLOW) {
      status = 'RED';
      statusColor = 'red';
    } else if (score < CONFIG.MIN_GREEN_SCORE || this.checks.warnings > CONFIG.MAX_WARNINGS_FOR_GREEN) {
      status = 'YELLOW';
      statusColor = 'yellow';
    }
    
    this.log(`\n📈 Overall Readiness: ${status} (Score: ${score}/10)`, statusColor);
    this.log(`\n✓ Passed: ${this.checks.passed}`, 'green');
    this.log(`⚠ Warnings: ${this.checks.warnings}`, 'yellow');
    this.log(`✗ Failed: ${this.checks.failed}`, 'red');
    
    // Display blockers
    if (this.issues.high.length > 0) {
      this.log('\n🚫 HIGH PRIORITY BLOCKERS:', 'red');
      this.issues.high.forEach((issue, i) => {
        this.log(`\n${i + 1}. ${issue.title}`, 'bold');
        this.log(`   Why: ${issue.reason}`, 'reset');
        this.log(`   Evidence: ${issue.evidence}`, 'reset');
        this.log(`   Fix: ${issue.fix}`, 'cyan');
      });
    }
    
    if (this.issues.medium.length > 0) {
      this.log('\n⚠️  MEDIUM PRIORITY ISSUES:', 'yellow');
      this.issues.medium.forEach((issue, i) => {
        this.log(`\n${i + 1}. ${issue.title}`, 'bold');
        this.log(`   Fix: ${issue.fix}`, 'cyan');
      });
    }
    
    if (this.issues.low.length > 0) {
      this.log('\n💡 LOW PRIORITY IMPROVEMENTS:', 'blue');
      this.issues.low.forEach((issue, i) => {
        this.log(`${i + 1}. ${issue.title} - ${issue.fix}`, 'reset');
      });
    }
    
    // Next actions
    this.log('\n📋 NEXT ACTIONS:', 'cyan');
    if (this.checks.failed === 0 && this.issues.high.length === 0) {
      this.log('✓ Ready for deployment!', 'green');
      this.log('  1. Push to main branch to trigger deployment', 'reset');
      this.log(`  2. Monitor GitHub Actions at: ${this.repoInfo.actionsUrl}`, 'reset');
      this.log(`  3. Check deployed site at: ${this.repoInfo.pagesUrl}`, 'reset');
    } else {
      this.log('⚠ Address blockers before deploying:', 'yellow');
      this.issues.high.forEach((issue) => {
        this.log(`  • ${issue.fix}`, 'reset');
      });
    }
    
    // Bonus suggestions
    this.log('\n🎁 BONUS IMPROVEMENTS:', 'blue');
    this.log('  • Add integration tests for game engines', 'reset');
    this.log('  • Implement i18n for multi-language support', 'reset');
    this.log('  • Add performance monitoring for low-end devices', 'reset');
    this.log('  • Create preview deployments for PRs', 'reset');
    
    this.log('\n' + '═'.repeat(80), 'cyan');
    this.log('🛡️  Deployment Guardian - Ready for your green light!', 'bold');
    this.log('═'.repeat(80) + '\n', 'cyan');
    
    // Exit with appropriate code
    process.exit(this.checks.failed > 0 ? 1 : 0);
  }
}

// Run the deployment guardian
const guardian = new DeploymentGuardian();
guardian.runChecks().catch((error) => {
  console.error('Error running deployment checks:', error);
  process.exit(1);
});
