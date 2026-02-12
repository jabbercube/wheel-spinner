# Feature: Add GitHub Actions CI/CD Pipeline

The following plan should be complete, but it's important that you validate documentation and codebase patterns before you start implementing.

## Feature Description

Implement automated Continuous Integration (CI) pipeline using GitHub Actions to validate pull requests and commits. The pipeline will run linting (ESLint), unit tests (Mocha), code coverage analysis (NYC/Istanbul), and development build checks on every pull request and push to main branches.

This ensures code quality standards are met before merging, prevents regressions, and provides visibility into test coverage metrics.

## User Story

As a project maintainer
I want automated checks to run on every pull request
So that I can ensure code quality, prevent broken code from being merged, and maintain high test coverage standards

## Problem Statement

Currently, the Wheel Spinner project has no automated validation for pull requests. This creates several risks:

1. **No automated linting** - Code style violations can be merged without detection
2. **No automated testing** - Breaking changes can slip through manual review
3. **No coverage tracking** - Declining test coverage goes unnoticed
4. **Manual validation burden** - Maintainers must manually run tests and builds
5. **Inconsistent validation** - Different reviewers may skip validation steps

The project has 116 passing unit tests and a working build system, but these are only run manually by developers who remember to do so.

## Solution Statement

Create a GitHub Actions CI/CD pipeline with three parallel jobs:

1. **Lint Job** - Run ESLint on all `.js` and `.vue` files to enforce code quality standards
2. **Test Job** - Execute the full Mocha test suite (116 tests) to prevent regressions
3. **Coverage Job** - Generate code coverage reports with NYC and track metrics over time
4. **Build Job** - Verify webpack dev build succeeds without errors

The pipeline will run on:
- Pull requests to `master` and `develop` branches
- Pushes to `master`, `develop`, and `feature/**` branches
- Skip on documentation-only changes (*.md files)

## Feature Metadata

**Feature Type**: New Capability (DevOps/CI/CD)
**Estimated Complexity**: Low-Medium
**Primary Systems Affected**:
- GitHub Actions (new `.github/workflows/` directory)
- Project configuration (new ESLint config, nyc config)
- Package.json (new scripts and dependencies)

**Dependencies**:
- `eslint@^8.57.0` - JavaScript linter
- `eslint-plugin-vue@^8.7.1` - Vue.js 2 linting rules
- `@babel/eslint-parser@^7.23.0` - Babel parser for ESLint
- `vue-eslint-parser@^9.4.0` - Parser for .vue files
- `nyc@^17.1.0` - Istanbul CLI for code coverage

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `package.json` - Why: Contains existing scripts (`test`, `dev`, `build:dev`) that CI will use. Need to add new lint and coverage scripts.
- `babel.config.js` - Why: ESLint will use this Babel config for parsing. Uses @babel/env targeting IE11+.
- `.gitignore` - Why: Already ignores `coverage/` and `.eslintcache`, confirms these paths are appropriate.
- `test/test-Util.js` (lines 1-30) - Why: Example test file structure using Mocha + assert. Shows import patterns.
- `static/index.js` (lines 1-57) - Why: Main entry point. Shows Vue 2 setup, Buefy usage, and import patterns to lint.
- `static/WheelConfig.js` (lines 1-100) - Why: Core model file. Representative of JS code style in project.
- `static/pages/wheelPage.vue` - Why: Main Vue component. ESLint must handle .vue single-file components.
- `build_dev.sh` - Why: Sets NODE_OPTIONS=--openssl-legacy-provider for webpack. CI must use this flag.
- `.claude/skills/validate/SKILL.md` (lines 1-46) - Why: Existing validation commands. CI should mirror this: tests → build.

### New Files to Create

- `.github/workflows/ci.yml` - Main CI workflow definition with lint, test, coverage, and build jobs
- `.eslintrc.js` - ESLint configuration for Vue 2 + Babel + Webpack project
- `.eslintignore` - Patterns to exclude from linting (dist/, build/, node_modules/)
- `.nycrc` (optional) - Code coverage configuration for NYC/Istanbul

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

**Research Document**: See the comprehensive research output from the subagent above, which includes:
- GitHub Actions Node.js setup with v6 (2026 best practices)
- ESLint configuration for Vue.js 2 projects
- NYC/Istanbul code coverage setup
- Workflow structure and triggers
- Badge generation for README

**Official Documentation**:
- [GitHub Actions setup-node@v6](https://github.com/actions/setup-node) - Node.js setup action with automatic npm caching
- [eslint-plugin-vue User Guide](https://eslint.vuejs.org/user-guide/) - Vue 2 linting rules (use `plugin:vue/vue2-recommended`)
- [NYC GitHub](https://github.com/istanbuljs/nyc) - Istanbul CLI for code coverage
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions) - Complete workflow reference

### Patterns to Follow

**Node.js Environment Setup** (from CLAUDE.md and MEMORY.md):
```bash
# Always source nvm and use Node 18
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
```

**Webpack Build Requirements** (from build_dev.sh and CLAUDE.md):
```bash
# Webpack requires OpenSSL legacy provider flag
NODE_OPTIONS=--openssl-legacy-provider npx webpack --config build/dev.config.js
```

**Test Execution** (from package.json):
```bash
# Current test command
mocha --require @babel/register
```

**Import Patterns** (from static/index.js and test files):
```javascript
// ES6 imports used throughout codebase
import Vue from 'vue';
import * as Util from './Util.js';
import assert from 'assert';
```

**Vue Component Structure** (from .vue files):
```vue
<!-- Single-file component format -->
<template>
  <!-- HTML template -->
</template>

<script>
export default {
  name: 'ComponentName',
  // component logic
}
</script>

<style scoped>
/* component styles */
</style>
```

**Project File Organization**:
- `static/` - All frontend source code (.js, .vue, .json)
- `static/pages/` - Route-level Vue components (8 pages)
- `static/store/` - Vuex store modules (4 stores)
- `static/locales/` - i18n translation files (6 languages)
- `test/` - Mocha unit tests (6 test files)
- `build/` - Webpack configuration files
- `dist/` - Compiled output (gitignored, should not lint)

---

## IMPLEMENTATION PLAN

### Phase 1: ESLint Configuration & Dependencies

Set up ESLint with Vue 2 support, install necessary dependencies, and create configuration files.

**Tasks:**
- Install ESLint packages for Vue.js 2
- Create `.eslintrc.js` with Vue 2 preset
- Create `.eslintignore` to exclude build artifacts
- Add lint scripts to package.json
- Test ESLint runs successfully on codebase

### Phase 2: Code Coverage Setup

Configure NYC (Istanbul) for code coverage reporting with appropriate thresholds.

**Tasks:**
- Install `nyc` package
- Create `.nycrc` configuration file
- Add coverage scripts to package.json
- Set coverage thresholds (80% lines, functions, statements)
- Test coverage generation works locally

### Phase 3: GitHub Actions Workflow

Create the main CI workflow with parallel jobs for linting, testing, coverage, and building.

**Tasks:**
- Create `.github/workflows/` directory
- Write `ci.yml` workflow file
- Configure Node 18 environment
- Set up npm caching
- Define lint, test, coverage, and build jobs
- Configure triggers (PR and push events)

### Phase 4: Testing & Validation

Test the GitHub Actions workflow and validate all jobs pass.

**Tasks:**
- Push changes to a feature branch
- Create test pull request
- Verify all CI jobs run and pass
- Check coverage report generation
- Validate build artifacts
- Add CI badge to README (optional)

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### 1. INSTALL ESLint Dependencies

- **ACTION**: Install ESLint and Vue.js 2 plugins as devDependencies
- **COMMAND**:
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
npm install --save-dev eslint@^8.57.0 eslint-plugin-vue@^8.7.1 @babel/eslint-parser@^7.23.0 vue-eslint-parser@^9.4.0
```
- **VALIDATE**: `npm list eslint eslint-plugin-vue @babel/eslint-parser vue-eslint-parser`
- **EXPECTED**: All 4 packages listed with correct versions
- **GOTCHA**: Must use Node 18 via nvm (user's default is v8.0.0)

### 2. CREATE `.eslintrc.js` Configuration File

- **ACTION**: Create ESLint config for Vue 2 + Babel + Webpack project
- **LOCATION**: `/Users/blinton/Workspace/jabbercube/wheel-spinner/.eslintrc.js`
- **CONTENT**:
```javascript
/*
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    mocha: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue2-recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2021,
    sourceType: 'module',
    requireConfigFile: true,
    babelOptions: {
      configFile: './babel.config.js'
    }
  },
  plugins: ['vue'],
  rules: {
    // Relax rules for existing codebase
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  },
  ignorePatterns: [
    'dist/**',
    'build/**',
    'node_modules/**',
    'coverage/**',
    '*.config.js',
    '.nyc_output/**'
  ]
};
```
- **PATTERN**: Based on research, `plugin:vue/vue2-recommended` for Vue 2 projects
- **GOTCHA**: Must set `requireConfigFile: true` and point to `babel.config.js`
- **VALIDATE**: `npx eslint --print-config static/index.js | grep "vue2-recommended"`
- **EXPECTED**: Config output shows Vue 2 rules are loaded

### 3. CREATE `.eslintignore` File

- **ACTION**: Create ESLint ignore file to exclude build artifacts and dependencies
- **LOCATION**: `/Users/blinton/Workspace/jabbercube/wheel-spinner/.eslintignore`
- **CONTENT**:
```
# Build output
dist/
build/Release/

# Dependencies
node_modules/

# Coverage reports
coverage/
.nyc_output/

# Logs
*.log

# Environment files
*.env

# Database
wheelspinner.db*

# Webpack configs (too complex for linting)
build/*.config.js
webpack.config.js

# Third-party vendored code
static/third_party/
```
- **PATTERN**: Mirror `.gitignore` patterns for consistency
- **VALIDATE**: `npx eslint dist/` (should output "No files matching the pattern")

### 4. ADD Lint Scripts to package.json

- **ACTION**: Update `package.json` scripts section to add lint commands
- **LOCATION**: `/Users/blinton/Workspace/jabbercube/wheel-spinner/package.json`
- **UPDATE**: Add these scripts to the `"scripts"` object:
```json
"lint": "eslint --ext .js,.vue static/ test/ server.js db.js",
"lint:fix": "eslint --ext .js,.vue static/ test/ server.js db.js --fix"
```
- **COMPLETE SCRIPTS SECTION** should look like:
```json
"scripts": {
  "start": "node server.js",
  "dev": "npm run build:dev && node server.js",
  "build:dev": "./build_dev.sh",
  "test": "mocha --require @babel/register",
  "test:coverage": "nyc npm test",
  "test:coverage:report": "nyc report --reporter=text-lcov > coverage/lcov.info",
  "lint": "eslint --ext .js,.vue static/ test/ server.js db.js",
  "lint:fix": "eslint --ext .js,.vue static/ test/ server.js db.js --fix"
}
```
- **GOTCHA**: Include `server.js` and `db.js` in lint targets (backend code)
- **VALIDATE**: `npm run lint -- --help` (should show ESLint help)

### 5. TEST ESLint Locally

- **ACTION**: Run ESLint to see baseline issues
- **COMMAND**:
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
npm run lint
```
- **EXPECTED**: Likely many warnings/errors (existing codebase wasn't linted before)
- **DECISION POINT**: Review output. You may need to:
  - Add more rules to disable in `.eslintrc.js` (use `'off'` or `'warn'`)
  - Fix auto-fixable issues: `npm run lint:fix`
  - Document remaining issues in plan report
- **VALIDATE**: Exit code 0 (no errors) or document issues
- **GOTCHA**: Do NOT auto-fix everything blindly. Review changes carefully.

### 6. INSTALL NYC for Code Coverage

- **ACTION**: Install NYC (Istanbul CLI) as devDependency
- **COMMAND**:
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
npm install --save-dev nyc@^17.1.0
```
- **VALIDATE**: `npm list nyc`
- **EXPECTED**: `nyc@17.1.0` (or higher patch version)

### 7. CREATE `.nycrc` Coverage Configuration

- **ACTION**: Create NYC config file for coverage thresholds and reporting
- **LOCATION**: `/Users/blinton/Workspace/jabbercube/wheel-spinner/.nycrc`
- **CONTENT**:
```json
{
  "include": [
    "static/**/*.js"
  ],
  "exclude": [
    "static/**/*.spec.js",
    "static/**/*.test.js",
    "static/third_party/**",
    "test/**",
    "build/**",
    "dist/**",
    "node_modules/**"
  ],
  "reporter": [
    "html",
    "text",
    "lcov",
    "json-summary"
  ],
  "check-coverage": false,
  "lines": 60,
  "functions": 60,
  "branches": 50,
  "statements": 60,
  "all": true,
  "report-dir": "./coverage",
  "temp-dir": "./.nyc_output",
  "exclude-after-remap": true
}
```
- **GOTCHA**: Set `check-coverage: false` initially (codebase has low coverage). Can tighten later.
- **GOTCHA**: Exclude `static/third_party/**` (vendored audio/image libraries)
- **PATTERN**: Thresholds set to 60% initially (realistic for untested legacy code)
- **VALIDATE**: `cat .nycrc | jq .` (verify valid JSON)

### 8. TEST Coverage Generation Locally

- **ACTION**: Run NYC to generate coverage report
- **COMMAND**:
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
npm run test:coverage
```
- **EXPECTED**:
  - Tests pass (116 passing)
  - Coverage report generated in `coverage/` directory
  - Text summary shows coverage percentages
  - HTML report at `coverage/index.html`
- **VALIDATE**: `ls -la coverage/` (should contain `lcov.info`, `index.html`, etc.)
- **GOTCHA**: First run may show low coverage (many files untested). This is expected.

### 9. CREATE GitHub Actions Workflow Directory

- **ACTION**: Create `.github/workflows/` directory for CI configuration
- **COMMAND**:
```bash
mkdir -p .github/workflows
```
- **VALIDATE**: `ls -la .github/workflows/` (directory exists)

### 10. CREATE `ci.yml` GitHub Actions Workflow

- **ACTION**: Write comprehensive CI workflow with lint, test, coverage, build jobs
- **LOCATION**: `/Users/blinton/Workspace/jabbercube/wheel-spinner/.github/workflows/ci.yml`
- **CONTENT**:
```yaml
name: CI

on:
  push:
    branches:
      - master
      - develop
      - 'feature/**'
    paths-ignore:
      - '**.md'
      - 'CLAUDE.md'
      - 'README-AGENTS.md'
      - 'LICENSE'
      - 'docs/**'
  pull_request:
    branches:
      - master
      - develop

env:
  NODE_VERSION: '18'

jobs:
  lint:
    name: ESLint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

  test:
    name: Test Suite
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Mocha tests
        run: npm test

  coverage:
    name: Code Coverage
    runs-on: ubuntu-latest
    needs: [test]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Archive coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 30

      - name: Upload coverage summary
        if: github.event_name == 'pull_request'
        run: |
          echo "## Code Coverage Summary" >> $GITHUB_STEP_SUMMARY
          echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
          cat coverage/coverage-summary.json | jq -r '.total | "Lines: \(.lines.pct)%\nStatements: \(.statements.pct)%\nFunctions: \(.functions.pct)%\nBranches: \(.branches.pct)%"' >> $GITHUB_STEP_SUMMARY
          echo "\`\`\`" >> $GITHUB_STEP_SUMMARY

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: ./build_dev.sh
        env:
          NODE_OPTIONS: --openssl-legacy-provider

      - name: Check build output
        run: |
          if [ ! -d "dist" ]; then
            echo "Error: dist/ directory not created"
            exit 1
          fi
          echo "Build artifacts created successfully"
          ls -lh dist/ | head -20

      - name: Archive build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist-files
          path: dist/
          retention-days: 7
```
- **PATTERN**: Jobs run in parallel except coverage/build (depend on test/lint passing)
- **GOTCHA**: Set `NODE_OPTIONS=--openssl-legacy-provider` env var for build job (Webpack requirement)
- **GOTCHA**: Use `npm ci` instead of `npm install` in CI (faster, deterministic)
- **PATTERN**: Use `actions/setup-node@v6` with `cache: 'npm'` (automatic caching)
- **PATTERN**: Upload artifacts for debugging (coverage reports, build output)
- **VALIDATE**: `yamllint .github/workflows/ci.yml` or validate at https://www.yamllint.com/

### 11. VALIDATE YAML Syntax

- **ACTION**: Check workflow YAML is valid before committing
- **COMMAND**:
```bash
# Install yamllint if needed
which yamllint || brew install yamllint  # or: pip install yamllint

# Validate YAML
yamllint .github/workflows/ci.yml
```
- **ALTERNATIVE**: Use GitHub's workflow editor to validate syntax
- **EXPECTED**: No YAML syntax errors
- **VALIDATE**: Exit code 0 or paste into https://www.yamllint.com/

### 12. COMMIT Changes to Feature Branch

- **ACTION**: Commit all CI/CD configuration files
- **PATTERN**: Follow conventional commits (from project's `.claude/skills/commit/SKILL.md`)
- **COMMAND**:
```bash
git checkout -b feature/add-github-actions-ci
git add .github/workflows/ci.yml .eslintrc.js .eslintignore .nycrc package.json package-lock.json
git commit -m "feat: add GitHub Actions CI/CD pipeline

- Add ESLint configuration for Vue 2 + Babel
- Add NYC code coverage with 60% thresholds
- Add GitHub Actions workflow with lint, test, coverage, build jobs
- Workflow runs on PR to master/develop and push to feature branches
- Skip CI on documentation-only changes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```
- **VALIDATE**: `git log -1 --stat` (commit shows all expected files)

### 13. PUSH Branch and Create Pull Request

- **ACTION**: Push feature branch to origin and create PR
- **COMMAND**:
```bash
git push -u origin feature/add-github-actions-ci
```
- **MANUAL STEP**: Create pull request via GitHub UI or `gh` CLI
- **VALIDATE**: PR created, GitHub Actions CI starts automatically
- **EXPECTED**: See "Checks" section in PR with 4 jobs: lint, test, coverage, build

### 14. VERIFY GitHub Actions Run Successfully

- **ACTION**: Monitor CI workflow run in GitHub Actions tab
- **MANUAL STEP**: Navigate to `https://github.com/<owner>/<repo>/actions`
- **EXPECTED**: All 4 jobs pass (green checkmarks)
  - ✅ ESLint - No errors or only warnings
  - ✅ Test Suite - 116 tests passing
  - ✅ Code Coverage - Report generated successfully
  - ✅ Build - Webpack build completes, dist/ artifacts created
- **GOTCHA**: First run may fail on lint errors. Review and fix:
  - Update `.eslintrc.js` to disable problematic rules
  - Run `npm run lint:fix` locally
  - Commit fixes and push to trigger new CI run
- **VALIDATE**: Check "Actions" tab shows green status

### 15. REVIEW Coverage Report Artifacts

- **ACTION**: Download coverage report from GitHub Actions artifacts
- **MANUAL STEP**:
  1. Go to workflow run page
  2. Scroll to "Artifacts" section
  3. Download `coverage-report.zip`
  4. Extract and open `coverage/index.html`
- **EXPECTED**: HTML report shows file-by-file coverage breakdown
- **ANALYSIS**: Note which files have low coverage for future improvement
- **VALIDATE**: Coverage percentages match GitHub Actions log output

### 16. ADD CI Badge to README (Optional)

- **ACTION**: Add workflow status badge to README.md
- **LOCATION**: `/Users/blinton/Workspace/jabbercube/wheel-spinner/README.md`
- **ADD**: Insert at top of README after title:
```markdown
# README

**This is not an officially supported Google product.**

[![CI](https://github.com/jabbercube/wheel-spinner/workflows/CI/badge.svg)](https://github.com/jabbercube/wheel-spinner/actions)

Wheel Spinner - Interactive spinning wheel web application for random selection.
```
- **PATTERN**: Badge format from GitHub Actions documentation
- **GOTCHA**: Update `jabbercube/wheel-spinner` to match actual repo owner/name
- **VALIDATE**: Badge renders correctly in GitHub (shows build status)

---

## TESTING STRATEGY

### Local Testing (Before Pushing)

**Phase 1: Lint Validation**
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
npm run lint
```
- **Expected**: Exit code 0 or only warnings (no errors)
- **If errors**: Run `npm run lint:fix` to auto-fix, or update `.eslintrc.js` rules

**Phase 2: Test Execution**
```bash
npm test
```
- **Expected**: 116 tests passing, 0 failures

**Phase 3: Coverage Generation**
```bash
npm run test:coverage
```
- **Expected**:
  - All tests pass
  - Coverage report generated in `coverage/`
  - Text summary shows percentages
  - No NYC errors

**Phase 4: Build Validation**
```bash
./build_dev.sh
```
- **Expected**: Webpack build succeeds, `dist/` directory created with bundles

### GitHub Actions Testing (After Pushing)

**Phase 1: Create Test PR**
- Push feature branch
- Create pull request to `develop` or `master`
- Verify CI triggers automatically

**Phase 2: Monitor Jobs**
- Check "Checks" tab in PR
- All 4 jobs should run in parallel (except coverage/build depend on test/lint)
- Review logs if any job fails

**Phase 3: Verify Artifacts**
- Download coverage report artifact
- Download build artifact
- Confirm files are present and valid

**Phase 4: Test Workflow Triggers**
- Push commit to PR branch → CI should re-run
- Push documentation change only (*.md) → CI should skip
- Test on different branches (feature/*, master, develop)

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Installation Validation

```bash
# Verify Node 18 is active
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
node --version  # Should output v18.x.x

# Verify ESLint dependencies installed
npm list eslint eslint-plugin-vue @babel/eslint-parser vue-eslint-parser

# Verify NYC installed
npm list nyc
```

**Expected**: All packages listed with correct versions

### Level 2: Linting

```bash
# Run ESLint on all source files
npm run lint

# Alternative: Run directly
npx eslint --ext .js,.vue static/ test/ server.js db.js
```

**Expected**: Exit code 0 (or only warnings, no errors)

### Level 3: Unit Tests

```bash
# Run full test suite
npm test

# Alternative: Run with coverage
npm run test:coverage
```

**Expected**:
- 116 tests passing
- 0 failures
- Coverage report generated

### Level 4: Build Validation

```bash
# Run development build
./build_dev.sh

# Verify output
ls -lh dist/
```

**Expected**:
- Webpack build succeeds
- `dist/` directory contains bundled JS/CSS files
- No build errors in output

### Level 5: GitHub Actions Workflow

```bash
# Validate YAML syntax
yamllint .github/workflows/ci.yml

# Alternative: Check with actionlint (if installed)
actionlint .github/workflows/ci.yml
```

**Expected**: No YAML or workflow syntax errors

### Level 6: Configuration Files

```bash
# Verify .eslintrc.js loads correctly
npx eslint --print-config static/index.js | head -50

# Verify .nycrc is valid JSON
cat .nycrc | jq .

# Check .eslintignore patterns work
npx eslint dist/  # Should output "No files matching"
```

**Expected**: All configs parse correctly

### Level 7: Git Status

```bash
# Verify all files added
git status

# Check for untracked config files
ls -la | grep -E '\.(eslintrc|eslintignore|nycrc)'
```

**Expected**: All new files tracked, ready to commit

---

## ACCEPTANCE CRITERIA

- [ ] **ESLint installed and configured**
  - `eslint`, `eslint-plugin-vue`, `@babel/eslint-parser`, `vue-eslint-parser` in devDependencies
  - `.eslintrc.js` uses `plugin:vue/vue2-recommended` preset
  - `.eslintignore` excludes `dist/`, `build/`, `node_modules/`

- [ ] **Linting runs successfully**
  - `npm run lint` executes without crashing
  - Exit code 0 or only warnings (configurable based on baseline)
  - Lints all `.js` and `.vue` files in `static/`, `test/`, and root

- [ ] **NYC code coverage configured**
  - `nyc` package installed
  - `.nycrc` config with 60% thresholds
  - `npm run test:coverage` generates HTML and lcov reports
  - Coverage reports saved to `coverage/` directory

- [ ] **GitHub Actions workflow created**
  - `.github/workflows/ci.yml` file exists
  - Workflow defines 4 jobs: lint, test, coverage, build
  - Jobs use Node.js 18 via `actions/setup-node@v6`
  - npm dependencies cached with `cache: 'npm'`

- [ ] **Workflow triggers correctly**
  - Runs on pull requests to `master` and `develop`
  - Runs on pushes to `master`, `develop`, and `feature/**` branches
  - Skips on documentation-only changes (*.md files)

- [ ] **Lint job passes**
  - ESLint runs on all source files
  - No errors (warnings acceptable)
  - Job fails if ESLint returns non-zero exit code

- [ ] **Test job passes**
  - All 116 Mocha tests execute
  - 0 failures
  - Job fails if any test fails

- [ ] **Coverage job passes**
  - NYC generates coverage report
  - lcov.info, HTML report, and json-summary created
  - Artifacts uploaded to GitHub Actions
  - Coverage summary displayed in PR (if applicable)

- [ ] **Build job passes**
  - Webpack dev build completes successfully
  - `dist/` directory created with bundles
  - No build errors
  - Build artifacts uploaded to GitHub Actions

- [ ] **No regressions**
  - Existing test suite still passes (116 tests)
  - Webpack build still works locally
  - No breaking changes to development workflow

- [ ] **Documentation updated** (optional)
  - README.md includes CI badge
  - CLAUDE.md updated if validation commands changed

- [ ] **Pull request validated**
  - Feature branch pushed to GitHub
  - PR created with all CI checks passing
  - All 4 jobs show green checkmarks in "Checks" tab

---

## COMPLETION CHECKLIST

- [ ] All ESLint dependencies installed (`npm list` confirms)
- [ ] `.eslintrc.js` created and validated
- [ ] `.eslintignore` created
- [ ] `npm run lint` executes successfully
- [ ] NYC installed (`npm list nyc`)
- [ ] `.nycrc` created with coverage thresholds
- [ ] `npm run test:coverage` generates reports
- [ ] Coverage reports in `coverage/` directory
- [ ] `.github/workflows/ci.yml` created
- [ ] Workflow YAML syntax validated
- [ ] Local tests pass (116 passing)
- [ ] Local build succeeds (`./build_dev.sh`)
- [ ] Changes committed to feature branch
- [ ] Feature branch pushed to GitHub
- [ ] Pull request created
- [ ] GitHub Actions CI triggered automatically
- [ ] Lint job passes in GitHub Actions
- [ ] Test job passes in GitHub Actions
- [ ] Coverage job passes, artifacts uploaded
- [ ] Build job passes, artifacts uploaded
- [ ] Coverage report reviewed (note baseline coverage %)
- [ ] CI badge added to README (optional)
- [ ] All acceptance criteria met

---

## NOTES

### Design Decisions

**ESLint Configuration**:
- Chose `plugin:vue/vue2-recommended` over `vue2-essential` for more comprehensive linting
- Set many rules to `'off'` or `'warn'` initially to avoid blocking existing codebase
- Can tighten rules incrementally in future PRs
- Excluded webpack config files (`build/*.config.js`) as they're build tooling, not application code

**Coverage Thresholds**:
- Set to 60% initially (realistic for legacy codebase without tests)
- Used `check-coverage: false` to not block CI on low coverage
- Future work: Increase thresholds as tests are added
- Excluded `static/third_party/` (vendored libraries shouldn't count toward coverage)

**Workflow Structure**:
- Lint and test run in parallel for speed
- Coverage depends on test (no point generating coverage if tests fail)
- Build depends on lint and test (don't build broken code)
- Used `needs` to create dependencies, not sequential jobs
- Set `paths-ignore` for *.md files to skip CI on docs-only changes

**Node Environment**:
- Hardcoded Node 18 (project requirement per CLAUDE.md)
- Set `NODE_OPTIONS=--openssl-legacy-provider` only for build job (Webpack needs it)
- Used `npm ci` instead of `npm install` for deterministic installs

### Potential Issues

**ESLint May Find Many Issues**:
- First run will likely show many linting errors/warnings
- This is expected for a codebase that wasn't previously linted
- Strategy: Start permissive (many rules off/warn), tighten gradually
- DO NOT auto-fix everything blindly - review changes

**Low Initial Coverage**:
- Only 6 test files exist (test Util, WheelConfig, Locales, Filters, CircularArray, CircularCounter)
- Many files in `static/` have 0% coverage
- This is OK - document baseline and improve over time
- Coverage will be low on first report (<30% likely)

**Build Time in CI**:
- Webpack build is slow (dev build with polyfills, 3 entry points)
- Consider using `cache: 'npm'` in setup-node (already included)
- Build job may take 2-3 minutes
- If too slow, could split test/build or cache dist/

**Workflow Badge**:
- Badge URL must match actual GitHub repo owner/name
- Format: `https://github.com/<OWNER>/<REPO>/workflows/CI/badge.svg`
- Update placeholder `jabbercube/wheel-spinner` to match reality

### Future Enhancements

**Phase 2 Improvements** (not in this plan):
- Add Codecov or Coveralls integration for coverage tracking
- Add PR comment bot to show coverage diff
- Add commitlint to enforce conventional commits
- Add Prettier for code formatting
- Add Dependabot for automated dependency updates
- Add production build job (currently only dev build)
- Add E2E tests with Playwright or Cypress
- Increase coverage thresholds as tests are added

**Workflow Optimization**:
- Cache `dist/` between builds if feasible
- Use matrix strategy to test multiple Node versions (18, 20, 22)
- Add workflow for scheduled dependency audits
- Add workflow for release automation (draft releases)

### Trade-offs

**Chose `.eslintrc.js` over `eslint.config.js`**:
- Legacy format (`.eslintrc.js`) more stable for Vue 2 projects
- New flat config (`eslint.config.js`) is ESLint v9+ recommended but less mature Vue support
- Can migrate to flat config later if needed

**Chose `.nycrc` over `package.json` nyc config**:
- Separate file keeps `package.json` cleaner
- Easier to maintain complex coverage config
- Standard practice in many projects

**Separate jobs vs combined workflow**:
- Pros: Parallel execution, faster feedback, clear separation of concerns
- Cons: More complex, more minutes consumed (but negligible)
- Decision: Parallel is better for developer experience

### Configuration References

**ESLint Vue 2 Presets** (from research):
- `plugin:vue/vue2-essential` - Minimal (prevent errors only)
- `plugin:vue/vue2-strongly-recommended` - Readability improvements
- `plugin:vue/vue2-recommended` - **CHOSEN** - Includes style rules

**NYC Reporters** (configured):
- `html` - Interactive HTML report (open `coverage/index.html`)
- `text` - Terminal output with table
- `lcov` - Machine-readable format for tools (Codecov, Coveralls)
- `json-summary` - JSON format for parsing coverage data

**GitHub Actions Best Practices** (applied):
- Use specific action versions (`@v4`, `@v6`) not `@latest`
- Use `actions/checkout@v4` (latest as of 2026)
- Use `actions/setup-node@v6` (latest, runs on Node 24)
- Use `npm ci` not `npm install` (faster, deterministic)
- Use `cache: 'npm'` for automatic caching
- Use `needs` for job dependencies
- Use artifacts for debugging reports
- Set `retention-days` to balance storage vs usefulness

---

## VALIDATION SUMMARY

**Pre-Implementation Checklist**:
- ✅ Read `package.json` to understand current scripts
- ✅ Read `babel.config.js` to configure ESLint parser
- ✅ Read `.gitignore` to mirror ignore patterns
- ✅ Read test files to understand Mocha + assert pattern
- ✅ Read `.claude/skills/validate/SKILL.md` to align with existing validation
- ✅ Review research document for ESLint Vue 2 setup
- ✅ Review research document for NYC configuration
- ✅ Review research document for GitHub Actions best practices

**Post-Implementation Validation**:
- Run all validation commands (Levels 1-7 above)
- Create PR and verify all CI jobs pass
- Download and review coverage report
- Verify README badge displays correctly
- Document baseline coverage percentage
- Note any linting issues for future cleanup

**Success Criteria**:
- All 4 GitHub Actions jobs pass (✅ green checkmarks)
- No blocking errors (warnings acceptable)
- Coverage report generated successfully
- Build artifacts created in CI
- Workflow runs on every PR automatically

---

## COMPLETION CONFIDENCE SCORE

**8.5/10** - High confidence in one-pass implementation success

**Reasoning**:
- ✅ Comprehensive research completed (GitHub Actions 2026 best practices)
- ✅ Clear ESLint configuration for Vue 2 provided
- ✅ NYC setup is straightforward
- ✅ GitHub Actions workflow follows proven patterns
- ✅ Node 18 requirement well-documented
- ✅ All validation commands specified
- ⚠️ Risk: Existing codebase may have many linting issues (mitigated by permissive config)
- ⚠️ Risk: First-time GitHub Actions setup may have repo-specific issues (mitigated by testing in PR)

**Potential Blockers**:
- Linting errors may require iterative rule adjustments (plan accounts for this)
- GitHub Actions permissions/secrets may need configuration (unlikely for public repo)
- Workflow syntax errors (mitigated by yamllint validation step)

**Mitigation Strategy**:
- Task 5 includes decision point to review/adjust ESLint rules
- Task 14 includes debugging guidance if CI fails
- Task 11 validates YAML before committing
