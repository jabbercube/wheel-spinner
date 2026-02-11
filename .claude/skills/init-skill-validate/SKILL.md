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

## 6. Generate the Validate Skill

Based on the commands discovered above, create `.claude/skills/validate/SKILL.md`.

### Skill Structure Template

Use this structure:

```yaml
---
name: validate
description: Run comprehensive validation of this project including linting, tests, coverage, and build.
---

# Comprehensive Validation

Run comprehensive validation of this project.

Execute the following commands in sequence and report results:

## 1. [First Validation Step]

```bash
[command discovered in analysis]
```

**Expected:** [What success looks like]

## 2. [Second Validation Step]

```bash
[command discovered in analysis]
```

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
```

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
