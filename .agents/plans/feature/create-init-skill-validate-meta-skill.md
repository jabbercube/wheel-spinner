# Feature: Create init-skill-validate Meta-Skill

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Create a reusable meta-skill called `init-skill-validate` that analyzes any project to discover available validation commands (linting, testing, coverage, type checking, builds, e2e tests) and automatically generates a project-specific `validate` skill that can run all discovered checks.

This is a "skill that creates a skill" - enabling rapid quality validation setup across different projects without manual configuration.

## User Story

As a developer working on multiple projects
I want to automatically discover and configure validation commands for a new project
So that I can quickly set up consistent quality checks without manually researching each project's tooling

## Problem Statement

When working across multiple projects (Node.js, Python, Go, etc.), each has different tooling for validation:
- Different test frameworks (Jest, Mocha, pytest, Go test, etc.)
- Different linters (ESLint, Pylint, golangci-lint, etc.)
- Different coverage tools (nyc, jest --coverage, pytest-cov, etc.)
- Different build commands and configuration locations

Manually creating a `validate` skill for each project is time-consuming and error-prone. We need an automated approach that discovers what's available and generates the appropriate skill.

## Solution Statement

Create `init-skill-validate` that:
1. **Analyzes the project** to detect language, frameworks, and tooling
2. **Discovers validation commands** by examining:
   - package.json, pyproject.toml, go.mod scripts for example
   - Config files (.eslintrc, pytest.ini, jest.config.js, etc.)
   - Test directories and frameworks
   - CI/CD configs (.github/workflows, .gitlab-ci.yml) for additional clues
3. **Generates a customized validate skill** at `.claude/skills/validate/SKILL.md` with:
   - All discovered validation commands in logical order
   - Expected outputs for each command
   - Include linting, testing, and coverage steps for both frontends and backends
   - Clear status indicators
   - Summary report section

The generated skill will be immediately usable with `/validate` skill. Create or rewrite the `/validate` skill as necessary so it's optimized to run linting, testing, and coverage tooling for the project's current state.

## Feature Metadata

**Feature Type**: New Capability (Meta-Skill)
**Estimated Complexity**: High
**Primary Systems Affected**: Claude Code skills system, project analysis
**Dependencies**: None (uses Read, Glob, Bash tools)

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

**Existing Skills (Pattern Reference):**
- `.claude/skills/validate/SKILL.md` — Current validate skill (example to mirror structure)
- `.claude/skills/init-skill-project-up/SKILL.md` — Example init-skill pattern
- `.claude/skills/init-doc-prd/SKILL.md` — Example of skill that generates artifacts
- `.claude/skills/plan-prime/SKILL.md` — Example of analysis-heavy skill

**Project Configuration Files (Analysis Targets):**
- `package.json` — npm scripts, devDependencies (Node.js projects)
- `pyproject.toml` — Python project metadata, tools config
- `go.mod` — Go modules
- `Makefile` — Common build/test targets
- `.github/workflows/*.yml` — CI/CD pipeline commands
- Config files: `.eslintrc*`, `jest.config*`, `pytest.ini`, `tox.ini`, etc.

### New Files to Create

**Primary Deliverable:**
- `.claude/skills/init-skill-validate/SKILL.md` — The meta-skill that analyzes projects and generates validate skills

**Generated Artifact:**
- `.claude/skills/validate/SKILL.md` — Project-specific validation skill (created by running the meta-skill)

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
  - Skills structure, YAML frontmatter format
  - Why: Defines skill file format and invocation
- [package.json scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts)
  - Standard script names (test, lint, build, etc.)
  - Why: Key for Node.js project detection
- [pyproject.toml specification](https://packaging.python.org/en/latest/specifications/pyproject-toml/)
  - [tool.*] sections for pytest, ruff, mypy, etc.
  - Why: Key for Python project detection

### Patterns to Follow

**Skill File Structure:**
```yaml
---
name: skill-name
description: Brief description of what this skill does
argument-hint: "[optional-arg-format]"  # Optional
---

# Skill Title

Instructions in markdown format with:
- Numbered sections (## 1. Section Name)
- Bash code blocks with commands
- Expected output descriptions
- Clear validation criteria
```

**Analysis Pattern (from plan-prime skill):**
- Use Glob to find config files
- Use Read to parse configuration
- Use Bash to test command availability
- Build a data structure of discovered tools
- Generate markdown output from template

**Error Handling:**
- Gracefully handle missing files (not all projects have all config types)
- Default to empty/minimal skill if nothing discovered
- Include helpful comments in generated skill about what was found/not found

---

## IMPLEMENTATION PLAN

### Phase 1: Project Analysis Engine

Create the logic to detect project type and discover validation commands.

**Tasks:**
- Implement multi-language project detection (Node.js, Python, Go, Java, React, etc.)
- Parse package.json scripts for test/lint/build commands
- Parse pyproject.toml for tool configurations
- Detect test frameworks by config files or imports
- Detect linters by config files
- Parse CI/CD files for additional validation commands

### Phase 2: Command Discovery

Identify specific commands for each validation category.

**Tasks:**
- Map discovered tools to executable commands
- Determine command priority/execution order
- Identify coverage tools and their invocations
- Detect build tools and build commands
- Find e2e/integration test commands vs unit tests

### Phase 3: Skill Generation

Generate the validate skill markdown file.

**Tasks:**
- Create markdown template with sections
- Populate discovered commands in logical order
- Add expected output descriptions for each command
- Include summary report section
- Handle edge cases (no tests found, multiple test commands, etc.)

### Phase 4: Meta-Skill Creation

Create the init-skill-validate skill itself.

**Tasks:**
- Write the meta-skill instructions
- Include analysis steps
- Include generation steps
- Add validation that generated skill is correct
- Document what project types are supported

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### Task 1: CREATE `.claude/skills/init-skill-validate/SKILL.md` — Meta-skill shell

**CREATE**: `.claude/skills/init-skill-validate/SKILL.md`

**IMPLEMENT**: Basic skill structure with YAML frontmatter and placeholder instructions

```yaml
---
name: init-skill-validate
description: Create or revise "validate" skill that runs all available linting, tests, coverage, and build steps for this project.
---

# Create Validate Skill

Analyze the current project to discover validation commands and generate a project-specific `validate` skill.

[Instructions to be filled in next tasks...]
```

**VALIDATE**: File exists and has valid YAML frontmatter

```bash
test -f .claude/skills/init-skill-validate/SKILL.md && echo "File created successfully"
```

---

### Task 2: ADD — Project detection logic instructions

**UPDATE**: `.claude/skills/init-skill-validate/SKILL.md`

**IMPLEMENT**: Add "## 1. Analyze Project Structure" section with instructions to:
1. Detect project type (Node.js, Python, Go, etc.) by checking for key files
2. Use Glob to find: `package.json`, `pyproject.toml`, `go.mod`, `Makefile`, `Cargo.toml`
3. Determine primary language and build system

**PATTERN**: Similar to plan-prime skill's project structure analysis

**MARKDOWN CONTENT**:
```markdown
## 1. Analyze Project Structure

Detect the project type and build system:

### Check for Node.js/JavaScript/TypeScript
```bash
# Look for package.json
ls package.json 2>/dev/null
```

If found, this is a Node.js project. Proceed to Node.js analysis.

### Check for Python
```bash
# Look for pyproject.toml, setup.py, requirements.txt
ls pyproject.toml setup.py requirements.txt 2>/dev/null | head -1
```

If found, this is a Python project. Proceed to Python analysis.

### Check for Go
```bash
# Look for go.mod
ls go.mod 2>/dev/null
```

If found, this is a Go project. Proceed to Go analysis.

### Check for Rust
```bash
# Look for Cargo.toml
ls Cargo.toml 2>/dev/null
```

If found, this is a Rust project. Proceed to Rust analysis.

### Check for Makefile
```bash
# Look for Makefile
ls Makefile makefile 2>/dev/null | head -1
```

If found, check for common targets like `test`, `lint`, `build`.
```

**VALIDATE**: Section exists and markdown is properly formatted

```bash
grep -q "## 1. Analyze Project Structure" .claude/skills/init-skill-validate/SKILL.md && echo "Section added"
```

---

### Task 3: ADD — Node.js/JavaScript validation discovery

**UPDATE**: `.claude/skills/init-skill-validate/SKILL.md`

**IMPLEMENT**: Add "## 2. Discover Node.js Validation Commands" section

**MARKDOWN CONTENT**:
```markdown
## 2. Discover Node.js Validation Commands

If `package.json` exists, analyze it for validation scripts:

### Read package.json
```bash
cat package.json | grep -A 20 '"scripts"'
```

### Identify Standard Commands

Look for these common script names in the output:
- **test** → Unit tests (usually Jest, Mocha, Vitest, etc.)
- **test:coverage** or **coverage** → Test coverage
- **test:e2e** or **e2e** → End-to-end tests
- **test:integration** or **integration** → Integration tests
- **lint** → Linting (usually ESLint)
- **lint:fix** → Auto-fix linting issues
- **type-check** or **tsc** → TypeScript type checking
- **build** → Production build
- **format** or **prettier** → Code formatting

### Detect Test Framework

Check devDependencies for test frameworks:
```bash
cat package.json | grep -E '"(jest|mocha|vitest|ava|tape|jasmine)"'
```

### Detect Linter

Check for ESLint configuration:
```bash
ls .eslintrc* eslint.config.* 2>/dev/null || grep -q '"eslint"' package.json
```

### Detect TypeScript

Check for TypeScript:
```bash
ls tsconfig.json 2>/dev/null || grep -q '"typescript"' package.json
```

### Example Discovered Commands for Node.js:

Based on the analysis above, you might discover:
- `npm test` (unit tests)
- `npm run lint` (ESLint)
- `npm run build` (Webpack/Vite/Next.js build)
- `npm run type-check` (TypeScript checking)
- `npm run test:coverage` (Coverage report)
```

**VALIDATE**: Section exists

```bash
grep -q "## 2. Discover Node.js Validation Commands" .claude/skills/init-skill-validate/SKILL.md && echo "Section added"
```

---

### Task 4: ADD — Python validation discovery

**UPDATE**: `.claude/skills/init-skill-validate/SKILL.md`

**IMPLEMENT**: Add "## 3. Discover Python Validation Commands" section

**MARKDOWN CONTENT**:
```markdown
## 3. Discover Python Validation Commands

If `pyproject.toml` or `setup.py` exists, analyze for Python tooling:

### Check for pytest
```bash
grep -E '(pytest|test)' pyproject.toml requirements*.txt 2>/dev/null || ls pytest.ini 2>/dev/null
```

If found, tests likely run with: `pytest` or `python -m pytest`

### Check for Coverage

Look for pytest-cov or coverage.py:
```bash
grep -E 'pytest-cov|coverage' pyproject.toml requirements*.txt 2>/dev/null
```

If found, coverage command: `pytest --cov` or `coverage run -m pytest`

### Check for Linters

**Ruff** (modern, fast linter):
```bash
grep -q 'ruff' pyproject.toml requirements*.txt 2>/dev/null
```
Command: `ruff check .`

**Flake8**:
```bash
grep -q 'flake8' pyproject.toml requirements*.txt 2>/dev/null || ls .flake8 setup.cfg 2>/dev/null
```
Command: `flake8`

**Pylint**:
```bash
grep -q 'pylint' pyproject.toml requirements*.txt 2>/dev/null
```
Command: `pylint src/` (adjust path)

### Check for Type Checker

**mypy**:
```bash
grep -q 'mypy' pyproject.toml requirements*.txt 2>/dev/null || ls mypy.ini 2>/dev/null
```
Command: `mypy .`

### Check for Formatter

**Black**:
```bash
grep -q 'black' pyproject.toml requirements*.txt 2>/dev/null
```
Command: `black --check .`

### Example Discovered Commands for Python:

Based on analysis, you might discover:
- `pytest -v` (unit tests)
- `pytest --cov=src --cov-report=term-missing` (coverage)
- `ruff check .` (linting)
- `mypy .` (type checking)
- `black --check .` (formatting check)
```

**VALIDATE**: Section exists

```bash
grep -q "## 3. Discover Python Validation Commands" .claude/skills/init-skill-validate/SKILL.md && echo "Section added"
```

---

### Task 5: ADD — Go validation discovery

**UPDATE**: `.claude/skills/init-skill-validate/SKILL.md`

**IMPLEMENT**: Add "## 4. Discover Go Validation Commands" section

**MARKDOWN CONTENT**:
```markdown
## 4. Discover Go Validation Commands

If `go.mod` exists:

### Standard Go Commands

Go has built-in testing and formatting:

**Tests:**
```bash
go test ./...
```

**Coverage:**
```bash
go test -cover ./...
# Or with HTML report:
go test -coverprofile=coverage.out ./... && go tool cover -html=coverage.out
```

**Formatting:**
```bash
go fmt ./...
```

**Vetting (static analysis):**
```bash
go vet ./...
```

### Check for golangci-lint

```bash
ls .golangci.yml .golangci.yaml 2>/dev/null || which golangci-lint 2>/dev/null
```

If found:
```bash
golangci-lint run
```

### Example Discovered Commands for Go:

- `go test ./...` (unit tests)
- `go test -cover ./...` (coverage)
- `go vet ./...` (static analysis)
- `golangci-lint run` (comprehensive linting)
- `go build ./...` (build check)
```

**VALIDATE**: Section exists

```bash
grep -q "## 4. Discover Go Validation Commands" .claude/skills/init-skill-validate/SKILL.md && echo "Section added"
```

---

### Task 6: ADD — Makefile and CI/CD discovery

**UPDATE**: `.claude/skills/init-skill-validate/SKILL.md`

**IMPLEMENT**: Add "## 5. Check Makefile and CI/CD Configs" section

**MARKDOWN CONTENT**:
```markdown
## 5. Check Makefile and CI/CD Configs

### Makefile Targets

If `Makefile` exists, check for common targets:
```bash
grep -E '^(test|lint|build|coverage|check|validate):' Makefile 2>/dev/null
```

These targets can often be run with `make test`, `make lint`, etc.

### GitHub Actions

Check `.github/workflows/*.yml` for additional validation commands:
```bash
find .github/workflows -name "*.yml" -o -name "*.yaml" 2>/dev/null | head -1
```

If found, scan for `run:` commands that include test/lint/build:
```bash
grep -h "run:" .github/workflows/*.yml 2>/dev/null | grep -E "(test|lint|build|coverage)"
```

### GitLab CI

Check `.gitlab-ci.yml`:
```bash
ls .gitlab-ci.yml 2>/dev/null && grep -E "(script:|  - )" .gitlab-ci.yml | grep -E "(test|lint|build)"
```

### CI/CD Insights

CI configs often reveal:
- The exact test command used
- Coverage reporting commands
- Build validation steps
- Integration test commands
```

**VALIDATE**: Section exists

```bash
grep -q "## 5. Check Makefile and CI/CD Configs" .claude/skills/init-skill-validate/SKILL.md && echo "Section added"
```

---

### Task 7: ADD — Skill generation instructions

**UPDATE**: `.claude/skills/init-skill-validate/SKILL.md`

**IMPLEMENT**: Add "## 6. Generate the Validate Skill" section

**MARKDOWN CONTENT**:
```markdown
## 6. Generate the Validate Skill

Based on the commands discovered above, create `.claude/skills/validate/SKILL.md`.

### Skill Structure Template

Use this structure:

\`\`\`yaml
---
name: validate
description: Run comprehensive validation of this project including linting, tests, coverage, and build.
---

# Comprehensive Validation

Run comprehensive validation of this project.

Execute the following commands in sequence and report results:

## 1. [First Validation Step]

\`\`\`bash
[command discovered in analysis]
\`\`\`

**Expected:** [What success looks like]

## 2. [Second Validation Step]

\`\`\`bash
[command discovered in analysis]
\`\`\`

**Expected:** [What success looks like]

[... continue for all discovered commands ...]

## N. Summary Report

After all validations complete, provide a summary report with:

- Linting status (✅ PASS / ❌ FAIL)
- Tests passed/failed
- Coverage percentage (if available)
- Build status (if applicable)
- Type checking status (if applicable)
- Any errors or warnings encountered
- Overall health assessment (PASS/FAIL)

**Format the report clearly with sections and status indicators**
\`\`\`

### Ordering Guidelines

Order commands logically:
1. **Linting** (fast, catches syntax errors early)
2. **Type checking** (fast, catches type errors before running tests)
3. **Unit tests** (core functionality)
4. **Coverage** (if separate from unit tests)
5. **Integration tests** (slower, require unit tests to pass)
6. **E2E tests** (slowest, require everything else to work)
7. **Build** (final validation that production build works)

### Writing the File

Create or overwrite `.claude/skills/validate/SKILL.md` with the generated content.

Ensure directory exists:
```bash
mkdir -p .claude/skills/validate
```

Then write the file with discovered commands.
```

**VALIDATE**: Section exists

```bash
grep -q "## 6. Generate the Validate Skill" .claude/skills/init-skill-validate/SKILL.md && echo "Section added"
```

---

### Task 8: ADD — Example output and edge cases

**UPDATE**: `.claude/skills/init-skill-validate/SKILL.md`

**IMPLEMENT**: Add "## 7. Examples and Edge Cases" section

**MARKDOWN CONTENT**:
```markdown
## 7. Examples and Edge Cases

### Example 1: Node.js Project with Jest and ESLint

Discovered commands:
- `npm run lint` (ESLint)
- `npm test` (Jest unit tests)
- `npm run test:coverage` (Jest with coverage)
- `npm run build` (Webpack build)

Generated validate skill would include all four commands in order.

### Example 2: Python Project with pytest and ruff

Discovered commands:
- `ruff check .` (linting)
- `pytest -v` (tests)
- `pytest --cov=src --cov-report=term-missing` (coverage)

Generated validate skill would include these three commands.

### Example 3: No Tests Found

If no test commands are discovered, generate a minimal skill that:
- Includes any linting/formatting that was found
- Includes a comment: "# No test suite detected"
- Suggests where to add tests

### Example 4: Multiple Test Types

If the project has unit, integration, AND e2e tests:
- Run them in order (unit → integration → e2e)
- Label each section clearly
- Note estimated execution time for slower tests

### Example 5: Makefile-Only Project

If only Makefile targets are found:
- Use `make test`, `make lint`, etc.
- Include a note that this project uses Make

### Edge Case: Mixed Projects

Some monorepos have multiple languages (e.g., Node.js frontend + Python backend).

For these:
- Detect both
- Create separate sections in validate skill: "Backend Validation" and "Frontend Validation"
- Include cd commands if needed (e.g., `cd backend && pytest`)
```

**VALIDATE**: Section exists

```bash
grep -q "## 7. Examples and Edge Cases" .claude/skills/init-skill-validate/SKILL.md && echo "Section added"
```

---

### Task 9: ADD — Validation and output section

**UPDATE**: `.claude/skills/init-skill-validate/SKILL.md`

**IMPLEMENT**: Add "## 8. Validate and Report" section at the end

**MARKDOWN CONTENT**:
```markdown
## 8. Validate and Report

After generating the skill:

### Verify File Created

```bash
test -f .claude/skills/validate/SKILL.md && echo "✅ Validate skill created successfully"
```

### Check File Size

```bash
wc -l .claude/skills/validate/SKILL.md
```

Should be at least 20 lines (non-empty skill).

### Preview Generated Skill

```bash
head -50 .claude/skills/validate/SKILL.md
```

Review the frontmatter and first few commands.

### Summary Report

Provide a summary to the user:

**Project Type Detected:** [Node.js/Python/Go/etc.]

**Validation Commands Discovered:**
- Linting: [command or "none"]
- Type Checking: [command or "none"]
- Unit Tests: [command or "none"]
- Coverage: [command or "none"]
- Integration Tests: [command or "none"]
- E2E Tests: [command or "none"]
- Build: [command or "none"]

**Generated Skill:** `.claude/skills/validate/SKILL.md`

**How to Use:** Run `/validate` to execute all validation steps.

**Next Steps:**
- Review the generated skill and customize if needed
- Run `/validate` to test it
- Commit the skill to version control for your team
```

**VALIDATE**: Section exists

```bash
grep -q "## 8. Validate and Report" .claude/skills/init-skill-validate/SKILL.md && echo "Section added"
```

---

### Task 10: ADD — Frontmatter and title

**UPDATE**: `.claude/skills/init-skill-validate/SKILL.md`

**IMPLEMENT**: Update the top of the file with complete frontmatter and descriptive title

**ENSURE YAML FRONTMATTER**:
```yaml
---
name: init-skill-validate
description: Create or revise "validate" skill that runs all available linting, tests, coverage, and build steps for this project.
---

# Create Project Validate Skill

Analyze the current project to discover validation commands and generate a project-specific `validate` skill.

## Overview

This skill examines your project to find:
- Test frameworks and test commands
- Linters and formatters
- Coverage tools
- Type checkers
- Build commands
- Integration and E2E tests

It then generates a complete `validate` skill tailored to your project that you can run with `/validate`.

## Process

This skill will:
1. Detect your project type (Node.js, Python, Go, Rust, etc.)
2. Discover validation commands from package.json, pyproject.toml, Makefile, CI configs
3. Generate `.claude/skills/validate/SKILL.md` with all discovered commands
4. Provide a summary of what was found
```

**VALIDATE**: Frontmatter is valid YAML and title exists

```bash
head -10 .claude/skills/init-skill-validate/SKILL.md | grep -q "^name: init-skill-validate" && echo "Frontmatter valid"
```

---

### Task 11: TEST — Validate the meta-skill structure

**VALIDATE**: Run comprehensive checks on the created skill file

```bash
# Check file exists
test -f .claude/skills/init-skill-validate/SKILL.md && echo "✅ File exists" || echo "❌ File missing"

# Check has YAML frontmatter
head -5 .claude/skills/init-skill-validate/SKILL.md | grep -q "^---$" && echo "✅ YAML frontmatter present" || echo "❌ Frontmatter missing"

# Check has required fields
grep -q "^name: init-skill-validate" .claude/skills/init-skill-validate/SKILL.md && echo "✅ Name field present" || echo "❌ Name missing"
grep -q "^description:" .claude/skills/init-skill-validate/SKILL.md && echo "✅ Description present" || echo "❌ Description missing"

# Check has all major sections
grep -q "## 1. Analyze Project Structure" .claude/skills/init-skill-validate/SKILL.md && echo "✅ Section 1 present" || echo "❌ Section 1 missing"
grep -q "## 2. Discover Node.js Validation Commands" .claude/skills/init-skill-validate/SKILL.md && echo "✅ Section 2 present" || echo "❌ Section 2 missing"
grep -q "## 3. Discover Python Validation Commands" .claude/skills/init-skill-validate/SKILL.md && echo "✅ Section 3 present" || echo "❌ Section 3 missing"
grep -q "## 4. Discover Go Validation Commands" .claude/skills/init-skill-validate/SKILL.md && echo "✅ Section 4 present" || echo "❌ Section 4 missing"
grep -q "## 5. Check Makefile and CI/CD Configs" .claude/skills/init-skill-validate/SKILL.md && echo "✅ Section 5 present" || echo "❌ Section 5 missing"
grep -q "## 6. Generate the Validate Skill" .claude/skills/init-skill-validate/SKILL.md && echo "✅ Section 6 present" || echo "❌ Section 6 missing"
grep -q "## 7. Examples and Edge Cases" .claude/skills/init-skill-validate/SKILL.md && echo "✅ Section 7 present" || echo "❌ Section 7 missing"
grep -q "## 8. Validate and Report" .claude/skills/init-skill-validate/SKILL.md && echo "✅ Section 8 present" || echo "❌ Section 8 missing"

# Check line count (should be substantial)
LINE_COUNT=$(wc -l < .claude/skills/init-skill-validate/SKILL.md)
if [ "$LINE_COUNT" -gt 200 ]; then
  echo "✅ Skill is comprehensive ($LINE_COUNT lines)"
else
  echo "⚠️  Skill may be incomplete ($LINE_COUNT lines)"
fi

# Check for code blocks
BLOCK_COUNT=$(grep -c '```' .claude/skills/init-skill-validate/SKILL.md)
if [ "$BLOCK_COUNT" -gt 10 ]; then
  echo "✅ Has code examples ($BLOCK_COUNT code blocks)"
else
  echo "⚠️  May need more code examples ($BLOCK_COUNT code blocks)"
fi
```

**EXPECTED**: All checks pass with ✅

---

### Task 12: MANUAL TEST — Run the meta-skill on current project

**VALIDATE**: Test the generated meta-skill by actually running it on the current project

This is a manual validation step:

1. Read the generated skill: `.claude/skills/init-skill-validate/SKILL.md`
2. Follow its instructions manually to analyze the wheel-spinner project
3. Verify it correctly discovers:
   - Node.js project (package.json)
   - Mocha tests (npm test)
   - Functions ESLint (cd functions && npm run lint)
   - Webpack build (./build_dev.sh)
4. Verify it generates a working `.claude/skills/validate/SKILL.md`
5. Verify the generated validate skill runs successfully with `/validate`

**SUCCESS CRITERIA**:
- Meta-skill discovers at least 3 validation commands for wheel-spinner
- Generated validate skill is properly formatted
- Running the generated validate skill executes commands without errors

---

## TESTING STRATEGY

### Unit Tests

Not applicable - this is a skill (markdown documentation), not code with unit tests.

### Integration Tests

**Manual Integration Test:**
1. Create the `init-skill-validate` skill following all tasks above
2. Invoke the skill on the current project (wheel-spinner)
3. Verify it generates a valid `validate` skill
4. Run the generated validate skill
5. Verify all validation commands execute

**Test on Multiple Project Types:**
- Wheel-spinner (Node.js with Mocha)
- A Python project with pytest and ruff
- A Go project with standard tooling

### Edge Cases

**Minimal Project (No Tests):**
- Project with only source code, no tests configured
- Expected: Generates minimal validate skill with note about missing tests

**Monorepo (Mixed Languages):**
- Project with backend (Python) and frontend (Node.js)
- Expected: Generates validate skill with sections for each

**Makefile-Only Project:**
- C/C++ project with only Makefile
- Expected: Discovers `make test`, `make lint`, etc.

---

## VALIDATION COMMANDS

### Level 1: File Structure

Verify the meta-skill file is created correctly:

```bash
# Check file exists in correct location
test -f .claude/skills/init-skill-validate/SKILL.md && echo "✅ Meta-skill file exists" || echo "❌ File not found"

# Check YAML frontmatter is valid
head -10 .claude/skills/init-skill-validate/SKILL.md | grep -A 3 "^---$" | grep -q "name: init-skill-validate" && echo "✅ Valid YAML" || echo "❌ Invalid YAML"

# Verify skill is comprehensive (line count)
wc -l .claude/skills/init-skill-validate/SKILL.md
```

**Expected:** File exists at correct path, has valid YAML, 200+ lines

### Level 2: Content Validation

Verify all required sections exist:

```bash
# Check for all 8 main sections
for i in {1..8}; do
  grep -q "## $i\." .claude/skills/init-skill-validate/SKILL.md && echo "✅ Section $i present" || echo "❌ Section $i missing"
done

# Check for code examples
grep -c '```bash' .claude/skills/init-skill-validate/SKILL.md
```

**Expected:** All 8 sections present, multiple bash code examples

### Level 3: Functional Test

Test the meta-skill on current project:

```bash
# Manually run the meta-skill instructions on wheel-spinner project
# This will be done by user invoking `/init-skill-validate`

# After running, verify output exists
test -f .claude/skills/validate/SKILL.md && echo "✅ Generated validate skill" || echo "❌ No validate skill generated"
```

**Expected:** Validate skill is generated

### Level 4: Generated Skill Validation

Verify the generated validate skill is usable:

```bash
# Check generated skill has valid YAML
head -5 .claude/skills/validate/SKILL.md | grep -q "^name: validate" && echo "✅ Generated skill has valid frontmatter" || echo "❌ Invalid frontmatter"

# Check generated skill has commands
grep -c '```bash' .claude/skills/validate/SKILL.md
```

**Expected:** Generated skill has valid structure and executable commands

---

## ACCEPTANCE CRITERIA

- [ ] `.claude/skills/init-skill-validate/SKILL.md` file created
- [ ] Meta-skill has valid YAML frontmatter (name, description)
- [ ] Meta-skill has 8 main sections (Analyze, Node.js, Python, Go, Makefile, Generate, Examples, Validate)
- [ ] Meta-skill includes code examples for each detection method
- [ ] Meta-skill includes instructions for generating validate skill
- [ ] Running meta-skill on wheel-spinner project discovers: npm test, eslint, build
- [ ] Generated validate skill has valid YAML frontmatter
- [ ] Generated validate skill has numbered sections for each validation command
- [ ] Generated validate skill includes expected output descriptions
- [ ] Generated validate skill includes summary report section
- [ ] Running generated validate skill executes all discovered commands
- [ ] Meta-skill handles edge cases (no tests, multiple languages, Makefile-only)

---

## COMPLETION CHECKLIST

- [ ] Task 1: Created meta-skill file with shell structure
- [ ] Task 2: Added project detection logic
- [ ] Task 3: Added Node.js validation discovery
- [ ] Task 4: Added Python validation discovery
- [ ] Task 5: Added Go validation discovery
- [ ] Task 6: Added Makefile and CI/CD discovery
- [ ] Task 7: Added skill generation instructions
- [ ] Task 8: Added examples and edge cases
- [ ] Task 9: Added validation and reporting section
- [ ] Task 10: Completed frontmatter and overview
- [ ] Task 11: Validated meta-skill structure
- [ ] Task 12: Manual test on current project
- [ ] All validation commands pass
- [ ] Generated validate skill works correctly
- [ ] Documentation is clear and comprehensive

---

## NOTES

### Design Decisions

**1. Meta-Skill Approach**
Rather than hardcoding a validate skill, we create a skill that generates project-specific validate skills. This enables:
- Reusability across projects
- Automatic discovery of project-specific tooling
- No manual configuration needed

**2. Multi-Language Support**
The meta-skill supports Node.js, Python, Go, and Rust out of the box, with extensibility for more languages. This covers the majority of development projects.

**3. Markdown-Based Skills**
Skills are markdown files with YAML frontmatter. This makes them:
- Human-readable and editable
- Easy to version control
- Simple to customize per project

**4. Discovery Over Configuration**
The skill automatically discovers commands rather than requiring manual configuration. This reduces friction but means it may miss custom setups.

**5. Graceful Degradation**
If no validation commands are found, the skill still generates a minimal validate skill with helpful notes about what's missing.

### Implementation Considerations

**Parsing Complexity:**
- package.json and pyproject.toml are structured (JSON/TOML), relatively easy to parse with grep
- Makefiles are less structured, require pattern matching
- CI/CD configs are YAML but vary significantly between platforms

**Command Execution:**
- The validate skill executes commands sequentially
- If one command fails, subsequent commands should still run (don't exit early)
- Summary report at end shows which steps passed/failed

**Cross-Platform Compatibility:**
- Commands should work on macOS, Linux, and Windows (WSL)
- Use portable shell commands where possible
- Note platform-specific issues in comments

### Future Enhancements

1. **Interactive Mode:** Let user select which discovered commands to include
2. **Custom Command Addition:** Allow user to add custom validation steps
3. **Watch Mode:** Auto-run validation on file changes
4. **Parallel Execution:** Run independent validations in parallel for speed
5. **Result Caching:** Cache validation results to avoid re-running unchanged checks
6. **More Languages:** Add support for Ruby, Java, C#, Elixir, etc.
7. **Plugin System:** Allow projects to define custom validation discovery logic

### Risks

**1. Command Detection Failures**
If a project uses non-standard script names (e.g., "check" instead of "test"), the skill may miss them.
**Mitigation:** Include common variations and check CI/CD configs for hints.

**2. Command Execution Failures**
Discovered commands may fail due to missing dependencies or environment issues.
**Mitigation:** Generated validate skill includes expected outputs so failures are clear.

**3. Over-Specification**
Generated validate skill may include too many commands, making validation slow.
**Mitigation:** User can edit the generated skill to remove unnecessary steps.

**4. Under-Specification**
Generated validate skill may miss important validation steps.
**Mitigation:** User can manually add missing commands to the generated skill.

### Documentation References

- Claude Code Skills: https://code.claude.com/docs/en/skills
- npm scripts: https://docs.npmjs.com/cli/v9/using-npm/scripts
- pytest documentation: https://docs.pytest.org/
- Go testing: https://go.dev/doc/tutorial/add-a-test

---

**Plan Version**: 1.0
**Created**: 2026-02-11
**Target Skill Location**: `.claude/skills/init-skill-validate/SKILL.md`
**Generated Artifact**: `.claude/skills/validate/SKILL.md`
