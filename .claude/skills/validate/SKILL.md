---
name: validate
description: Run comprehensive validation of this project including linting, tests, coverage, and build.
---

# Comprehensive Validation

Run comprehensive validation of this project.

Execute the following commands in sequence and report results:

## 1. Unit Tests

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 18 && npm test
```

**Expected:** All Mocha tests pass. Currently 116 passing, 0 failing.

## 2. Development Build

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 18 && ./build_dev.sh
```

**Expected:** Webpack build completes successfully. Output to `dist/` directory with no build errors.

## 3. Summary Report

After all validations complete, provide a summary report with:

- **Tests passed/failed** (✅ PASS / ❌ FAIL)
  - Currently 116 passing, 0 failing
- **Build status** (✅ PASS / ❌ FAIL)
  - Webpack dev build completion
- **Any errors or warnings encountered**
- **Overall health assessment** (PASS/FAIL)

**Format the report clearly with sections and status indicators**

## Notes

- **Node Version:** This project requires Node 18. The nvm commands are included to ensure correct version.
- **Build Requirements:** Webpack build requires `NODE_OPTIONS=--openssl-legacy-provider` which is set in `build_dev.sh`.
- **No Coverage Tool:** Project uses Mocha without coverage reporting configured. Consider adding `nyc` or similar for coverage metrics.
