---
name: commit
description: Create a new commit for all uncommitted changes with an appropriate conventional commit message.
---

# Commit Changes

Create a new commit for all of our uncommitted changes.

## Process

1. Run `git status`, `git diff HEAD`, and `git status --porcelain` to see what files are uncommitted
2. Add the untracked and changed files
3. Create an atomic commit message with an appropriate message
4. Add a tag such as "feat", "fix", "docs", etc. that reflects our work
