# Agents Cheatsheet

## Claude Code Skills
- Official docs: https://code.claude.com/docs/en/skills

### Built-in
| Command | Description |
|---------|-------------|
| `/clear` | Reset context in between core PIV development cycles |

### Setup
Setup a project and its documentation.

| Command | Description |
|---------|-------------|
| `/init-create-prd` | Generate Product Requirements Document from conversation |
| `/init-create-reference` | Generate one file per module so we can split context and load only what's relevant |
| `/init-start-project` | Install dependencies, start backend and frontend servers |

### Core Development Loop
Create bite-sized features using the `Plan → Implement → Validate` development cycle.

| Command | Description |
|---------|-------------|
| `/plan-prime` | Load project context and codebase understanding |
| `/plan-feature` | Create comprehensive implementation plan with codebase analysis |
| &nbsp; | &nbsp; |
| `/implement-plan` | Execute an implementation plan step-by-step |
| &nbsp; | &nbsp; |
| `/validate-run-tests` | Run full validation: tests, linting, coverage, frontend build |
| `/validate-code-review` | Technical code review on changed files |
| `/validate-code-review-fix` | Fix issues found in code review |
| `/validate-execution-report` | Generate report after implementing a feature |
| `/validate-system-review` | Analyze implementation vs plan for process improvements |

### Improve
Evolve this project's process upon completing each feature.

| Command | Description |
|---------|-------------|
| `/improve-agent-workflow` | Improve this project's agent workflow |

### Commit & Release
Fix, release, and deploy the codebase.

| Command | Description |
|---------|-------------|
| `/commit` | Create atomic commit with appropriate tag (feat, fix, docs, etc.) |
| `/github-bug-fix-rca` | Create root cause analysis document for a GitHub issue |
| `/github-bug-fix-implement-fix` | Implement fix based on RCA document |
| `/github-draft-release` | Draft the next release |


## Key concepts
### Prioritize PRD-first development
Create documentation before you code. Your `.agents/PRD.md` becomes the source of truth for every AI 
conversation and for each granular feature. Without it AI can make bad assumptions and will context drift. 
So for:
- New projects:  Full PRD with features broken down into phases
- Brownfield:  Document existing codebase, define modules, and what comes next

### Build a modular rules architecture
Stop dumping everything in one massive file for your AI agent rules. 
Split by concern and only load what's relevant on-demand so context remains lean.
Aggressively limit the size and scope of global rules.

For example, create:

    .agents/
    ├── reference/
    │   ├── components.md   # frontend best practices
    │   ├── api.md          # backend best practices
    │   └── deploy.md       # deployment best practices
    └── GLOBAL-CONTEXT.md   # global context and rules for AI agents

The `.agents/GLOBAL-CONTEXT.md` file mentions each reference material for the AI agent to discover. 
And when working on a given module ensure the AI agent loads only necessary reference documentation 
for the current task at hand.  Limit context bloat as much as possible.

### Add bite-size features in cycles
AI performs at its best when given small tasks, one at a time.
To avoid context window degradation **reset context** between each step in the cycle.

- Step 1) Plan
- Step 2) Implement
- Step 3) Verify

Planning and implementation are **separate** conversations.  
Planning should result in a planned feature document, like so:

    Plan → [Planning Doc] → Reset Context → Implement

For example,

    .agents/
    ├── plan/
    │   └── features/
    │       ├── feature-YYYY-MM-secure_password.md    # one-off change
    |       ├── feature-users.md                      # desired state for users; evolves over time
    │       └── feature-dashboard.md                  # desired state for dashboard; evolves over time 
    └ ...


### Start planning with the `prime` command
Start each planning session with the `prime` command to load repeatable, predictable context every time.


### Adopt an evolution mindset
If you do something more than a few times, create a new command. 
Over time your agent commands and reference documentation should become specific to each project.
In addition, treat every bug as an opportunity to evolve your AI coding system. 
For each bug you can also fix:
- Global rules
- On demand context and references
- Commands & workflows

For example,
| Bug | Evolution |
|-----|-----------|
| AI uses wrong import style | New rule: always use @/ path aliases |
| AI forgets to run tests | Update structured plan to include section for tests to always run |
| AI doesn't understand auth flow | New context reference doc: auth_architecture.md |

Every time you develop a new feature, your coding agent should become smarter.

### Use high-value context engineering
Conversations with an agent can include:
- Goals
- Success criteria
- What not to do
- Documentation to reference
- Task list
- Validation strategy
- Desired codebase structure

