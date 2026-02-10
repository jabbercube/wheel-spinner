---
name: validate-code-review-fix
description: Process to fix bugs found in manual/AI code review. Takes a code review file or description and a scope.
---

# Fix Code Review Issues

I ran/performed a code review and found these issues:

Code-review (file or description of issues): $ARGUMENTS[0]

Please fix these issues one by one. If the Code-review is a file read the entire file first to understand all of the issue(s) presented there.

Scope: $ARGUMENTS[1]

For each fix:
1. Explain what was wrong
2. Show the fix
3. Create and run relevant tests to verify

After all fixes, run the validate skill (`/validate`) to finalize your fixes.
