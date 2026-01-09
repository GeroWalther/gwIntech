# Multi-Agent Ralph Wiggum System

## 🎯 What This Is

A **multi-agent AI development workflow** where multiple Claude agents work on different tasks across **separate context windows**, coordinating through **git history** and **shared artifacts** (`prd.json` + `progress.txt`).

**Inspired by:** [Anthropic's Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

---

## 📁 File Structure

```
your-project/
├── plans/
│   └── prd.json           ← Task list with acceptance criteria
├── progress.txt           ← Append-only log (what happened)
├── ralph-once.sh          ← Run ONE agent for ONE task
├── ralph-multi.sh         ← Run MULTIPLE agents until complete
├── ralph-parallel.sh      ← (Optional) Run agents in parallel
└── .git/                  ← Git history = persistent memory
```

---

## 🧠 How It Works

### Traditional Single-Agent (Old Way)
```
You → Write long prompt → Ralph loops 20 times → Done (maybe)
```
- One context window
- All iterations in memory
- Lose everything if it crashes

### Multi-Agent System (New Way)
```
You → Define tasks in prd.json
    ↓
Agent #1 
  → Reads prd.json + progress.txt + git log
  → Picks highest-priority "todo" task
  → Completes it
  → Commits to git (permanent memory)
  → Updates progress.txt (notes for next agent)
  → Updates prd.json (marks "done")
    ↓
Agent #2 (fresh context!)
  → Reads prd.json + progress.txt + git log
  → Sees what Agent #1 did
  → Picks next task
  → Completes it...
    ↓
... continues until all tasks done
```

### Key Differences

| Aspect | Single-Agent | Multi-Agent |
|--------|--------------|-------------|
| **Context** | One long session | Fresh per task |
| **Memory** | Loop iterations | Git + progress.txt |
| **Recovery** | Restart everything | Redo one task |
| **Scale** | Hard (context limits) | Easy (unlimited tasks) |
| **Failure** | Lose all progress | Lose one task only |
| **Parallelization** | Impossible | Possible |

---

## 📋 The PRD File (`plans/prd.json`)

### Structure

```json
{
  "project": "Your Project Name",
  "description": "What you're building",
  "rules": {
    "one_task_at_a_time": true,
    "must_pass_before_complete": ["npm run build", "npm run lint", "npm test"],
    "commit_each_task": true
  },
  "tasks": [
    {
      "id": "TASK-1",
      "title": "Task title",
      "priority": 1,
      "status": "todo",           // todo | in_progress | done | skipped
      "assigned_to": null,
      "category": "feature-name",
      "description": "What needs to be done",
      "acceptance_criteria": [
        "Specific criterion 1",
        "Specific criterion 2",
        "Tests pass",
        "Build succeeds"
      ],
      "dependencies": [],         // ["OTHER-TASK-ID"]
      "estimated_iterations": 2
    }
  ]
}
```

### Key Fields Explained

- **`id`**: Unique identifier (e.g., SETUP-1, BLOG-2, PERF-3)
- **`priority`**: Lower number = picked first (1 before 2)
- **`status`**: `"todo"` | `"in_progress"` | `"done"` | `"skipped"`
- **`category`**: Groups related tasks (e.g., "blog", "analytics", "design")
- **`dependencies`**: Won't start until these tasks are "done"
- **`acceptance_criteria`**: Agent's checklist - must all pass

---

## 📝 The Progress Log (`progress.txt`)

### Purpose

Append-only log that agents read to understand:
- What previous agents did
- What worked and what didn't
- What to do next
- Problems encountered

### Format

```
# Progress Log

## YYYY-MM-DD HH:MM - TASK-ID: Task Title
- What I did
- What worked
- What didn't work
- Notes for next agent

Next: Work on TASK-2
```

### Why This Matters

Each agent starts with a **fresh context window** (no memory of previous agents). The progress log is their **shared memory** - a human-readable explanation of project state.

---

## 🚀 Running the System

### Option 1: Run All Tasks (Sequential)

```bash
./ralph-multi.sh
```

- Runs agents one at a time
- Each completes one task
- Continues until all tasks "done"
- **Recommended** for learning and safety

### Option 2: Run One Task at a Time

```bash
./ralph-once.sh   # Agent #1 does first task
# Review, then:
./ralph-once.sh   # Agent #2 does second task
# etc...
```

- Good for learning the workflow
- Review after each task
- Manual control

### Option 3: Run Tasks in Parallel (Advanced)

```bash
./ralph-parallel.sh 3   # 3 agents simultaneously
```

- Faster but can cause git merge conflicts
- Only use if tasks are truly independent
- Requires manual conflict resolution

---

## 🔄 Agent Workflow (What Happens Inside)

When you run `./ralph-once.sh`:

### 1. **Agent Initializes**
```bash
cd ~/Desktop/gwIntech
claude --plugin ralph-wiggum
```

### 2. **Agent Reads Context**
```
- Read plans/prd.json      → See all tasks
- Read progress.txt        → Learn what's been done
- Run git log              → See code history
```

### 3. **Agent Picks Task**
```
- Find first task with:
  - status="todo"
  - No unmet dependencies
  - Lowest priority number
- Update status to "in_progress"
```

### 4. **Agent Executes Task**
```
- Implement according to acceptance_criteria
- Write tests
- Fix errors iteratively
```

### 5. **Agent Validates**
```
Run validation gates:
✅ npm run build
✅ npm run lint
✅ npm test
✅ npm run typecheck (if exists)
```

### 6. **Agent Commits**
```bash
git add .
git commit -m "feat: [TASK-ID] Brief description

Co-Authored-By: Warp <agent@warp.dev>"
```

### 7. **Agent Updates Artifacts**
```
- Update prd.json: status="done"
- Append to progress.txt: what was done
- Output: <promise>COMPLETE</promise>
```

### 8. **Next Agent Starts** (if using ralph-multi.sh)
```
Repeat from step 1 with fresh context
```

---

## 🧠 How Memory Works Across Agents

### The Problem

Each agent has a **fresh context window** - no memory of previous agents.

### The Solution

**Three-tier memory system:**

#### 1. **Git History** (Permanent Code Memory)
```bash
git log --oneline        # See all commits
git show <commit>        # See specific changes
git diff HEAD~1          # See last change
```

Agents run these commands to see actual code that exists.

#### 2. **progress.txt** (Human-Readable Notes)
```
## 2026-01-08 14:30 - SETUP-1: Test Infrastructure
- Added Vitest and React Testing Library
- Created vitest.config.js
- Tests are now running with 'npm test'
- Note: Had to use @vitejs/plugin-react, not the old plugin

Next: Work on EE-1 (hidden cat spawn)
```

Agents read this to understand **why** decisions were made.

#### 3. **prd.json** (Task Coordination)
```json
{
  "id": "SETUP-1",
  "status": "done",    // ← Tells next agent: don't do this
  ...
}
```

Prevents duplicate work and shows dependencies.

---

## 🎯 Adding New Tasks (Any Feature!)

### Step 1: Edit `plans/prd.json`

Add to the `"tasks"` array:

```json
{
  "id": "BLOG-1",
  "title": "Setup MDX for blog",
  "priority": 12,
  "status": "todo",
  "assigned_to": null,
  "category": "blog",
  "description": "Add MDX support for blog posts",
  "acceptance_criteria": [
    "Install @next/mdx",
    "Configure next.config.js",
    "Create /posts directory",
    "Add example post",
    "Build succeeds"
  ],
  "dependencies": [],
  "estimated_iterations": 2
}
```

### Step 2: Run Agents

```bash
./ralph-multi.sh
```

Done! Agents will work through all existing tasks, then pick up your new one.

---

## 📊 Monitoring Progress

### See All Tasks
```bash
cat plans/prd.json | jq '.tasks[] | {id, title, status, category}'
```

### Count Tasks by Status
```bash
echo "Todo: $(grep -c '"status": "todo"' plans/prd.json)"
echo "Done: $(grep -c '"status": "done"' plans/prd.json)"
```

### See Progress Log
```bash
cat progress.txt
```

### See Git History
```bash
git log --oneline
git log --grep="feat:"
```

### Check What Agent is Working On
```bash
grep '"status": "in_progress"' plans/prd.json
```

---

## 🏗️ Using This System in Other Projects

### ✅ Yes! It's Portable

To use this system in **any** project:

#### 1. Copy 4 Files
```bash
cp ralph-once.sh /path/to/new-project/
cp ralph-multi.sh /path/to/new-project/
cp ralph-parallel.sh /path/to/new-project/  # optional
chmod +x /path/to/new-project/ralph-*.sh
```

#### 2. Create PRD
```bash
mkdir /path/to/new-project/plans
```

Create `plans/prd.json`:
```json
{
  "project": "New Project Name",
  "rules": {
    "one_task_at_a_time": true,
    "must_pass_before_complete": ["npm run build", "npm test"],
    "commit_each_task": true
  },
  "tasks": [
    {
      "id": "TASK-1",
      "title": "First task",
      "priority": 1,
      "status": "todo",
      "category": "setup",
      "acceptance_criteria": ["..."],
      "dependencies": []
    }
  ]
}
```

#### 3. Create Progress Log
```bash
cat > progress.txt << 'EOF'
# Progress Log

## YYYY-MM-DD HH:MM - Project Initialized
- Created prd.json with initial tasks
- Ready to start

Next: Agent should work on TASK-1
EOF
```

#### 4. Initialize Git (if not already)
```bash
git init
git add .
git commit -m "Initial commit"
```

#### 5. Run
```bash
./ralph-multi.sh
```

**That's it!** The system works in any codebase.

---

## 💡 Best Practices

### ✅ DO:

1. **One PRD per codebase**
   - Add all features to one `prd.json`
   - Use `category` to organize

2. **Make tasks atomic**
   - Each task = one clear deliverable
   - 1-3 iterations ideal per task

3. **Specific acceptance criteria**
   - Agent's checklist
   - Include "Build succeeds", "Tests pass"

4. **Set dependencies**
   - Prevents agents from working out of order
   - `"dependencies": ["SETUP-1"]`

5. **Let agents commit**
   - Each task = one commit
   - Git history = memory

6. **Review after tasks**
   - Check commits
   - Validate manually
   - Adjust PRD if needed

### ❌ DON'T:

1. **Multiple PRDs for one codebase**
   - Causes confusion
   - Agents lose context
   - Exception: Separate repos

2. **Huge tasks**
   - Max 5 acceptance criteria
   - Split large tasks into smaller ones

3. **Vague criteria**
   - ❌ "Make it better"
   - ✅ "Add button with onClick handler"

4. **Skip validation**
   - Always include "Build succeeds"
   - Always include "Tests pass"

5. **Edit progress.txt manually**
   - Let agents append to it
   - Exception: Fixing mistakes

---

## 🔥 Advanced: Multi-Feature Projects

### Scenario: Building Multiple Features

**Example PRD with 3 unrelated features:**

```json
{
  "project": "Portfolio Site",
  "tasks": [
    // Infrastructure
    {"id": "SETUP-1", "category": "infrastructure", "priority": 1, ...},
    
    // Feature 1: Blog
    {"id": "BLOG-1", "category": "blog", "priority": 2, ...},
    {"id": "BLOG-2", "category": "blog", "priority": 3, ...},
    {"id": "BLOG-3", "category": "blog", "priority": 4, ...},
    
    // Feature 2: Contact Form
    {"id": "CONTACT-1", "category": "contact", "priority": 5, ...},
    {"id": "CONTACT-2", "category": "contact", "priority": 6, ...},
    
    // Feature 3: Analytics
    {"id": "ANALYTICS-1", "category": "analytics", "priority": 7, ...}
  ]
}
```

**Run:**
```bash
./ralph-multi.sh
```

**Result:**
- Agent #1: SETUP-1 (infrastructure)
- Agent #2: BLOG-1
- Agent #3: BLOG-2
- Agent #4: BLOG-3
- Agent #5: CONTACT-1
- Agent #6: CONTACT-2
- Agent #7: ANALYTICS-1

All features completed, one task at a time!

---

## 🐛 Troubleshooting

### Problem: Agent stuck on same task

**Symptoms:**
- Agent keeps failing
- Same error repeatedly

**Solution:**
```bash
# 1. Check what error it's hitting
cat progress.txt

# 2. Fix the issue manually (if obvious)
# 3. Reset task status
# Edit plans/prd.json: change status to "todo"

# 4. Run again
./ralph-once.sh
```

### Problem: Wrong task picked

**Symptoms:**
- Agent skips a task you want done

**Solution:**
```bash
# Check priorities
grep -A 2 '"priority"' plans/prd.json

# Adjust priorities (lower = picked first)
# Edit prd.json

# Re-run
./ralph-once.sh
```

### Problem: Git merge conflicts (parallel mode)

**Symptoms:**
- Multiple agents modified same file

**Solution:**
```bash
# Resolve conflicts manually
git status
# Edit conflicted files
git add .
git commit -m "fix: Resolve merge conflicts"

# Mark task as "done" in prd.json
# Continue
./ralph-multi.sh
```

### Problem: Build/test failures persist

**Symptoms:**
- Agent can't pass validation gates

**Solution:**
```bash
# Run tests manually to see full output
npm test
npm run build

# Fix the issue
# Or: simplify acceptance_criteria in prd.json

# Re-run
./ralph-once.sh
```

---

## 🧹 Cleanup After Completion

### Option 1: Archive Completed Tasks

```bash
# Extract done tasks
jq '.tasks[] | select(.status=="done")' plans/prd.json > plans/archive-2026-01.json

# Manually edit prd.json to remove done tasks
# Or leave them - they're marked "done" anyway
```

### Option 2: Start New Sprint

```bash
# Archive entire PRD
mv plans/prd.json plans/prd-sprint-1.json

# Create fresh PRD for sprint 2
cat > plans/prd.json << 'EOF'
{
  "project": "Sprint 2",
  "tasks": [...]
}
EOF
```

### Option 3: Keep Everything

Just leave completed tasks in prd.json with `"status": "done"`. It provides:
- Full project history
- Reference for similar tasks
- Audit trail

---

## 🎓 Why This System Works

### 1. **Fresh Context Each Task**
- No context pollution
- Focused attention
- Better quality

### 2. **Git = Permanent Memory**
- Survives crashes
- Works across days/weeks
- Time-travel with `git revert`

### 3. **Progress.txt = Human Notes**
- Why decisions were made
- What to watch out for
- Next steps

### 4. **PRD = Coordination**
- No duplicate work
- Clear dependencies
- One source of truth

### 5. **Scalable**
- Add any number of tasks
- Works for weeks/months
- Multiple agents can work in parallel

---

## 📚 Summary

### What You've Built

A **production-ready multi-agent AI development system** that:

✅ Coordinates multiple AI agents across separate context windows  
✅ Uses git history as persistent memory  
✅ Scales to projects of any size  
✅ Works across days, weeks, or months  
✅ Portable to any codebase  
✅ Handles failures gracefully  

### To Use in New Projects

1. Copy ralph scripts (`ralph-once.sh`, `ralph-multi.sh`)
2. Create `plans/prd.json` with your tasks
3. Create empty `progress.txt`
4. Run `./ralph-multi.sh`

### Key Files

- **`plans/prd.json`** - What to do
- **`progress.txt`** - What happened
- **`.git/`** - Permanent memory
- **`ralph-*.sh`** - Orchestration scripts

---

## 🚀 Ready to Start?

```bash
cd ~/Desktop/gwIntech
./ralph-multi.sh
```

Watch multiple AI agents build your project, one task at a time! 🤖🤖🤖
