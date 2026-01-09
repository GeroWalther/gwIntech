#!/bin/bash
# Ralph Wiggum - Multi-Agent Orchestrator
# This script runs multiple Ralph agents in sequence until all tasks are done

set -e

MAX_ITERATIONS_PER_TASK=20  # Each agent tries up to 20 times per task
AGENT_COUNT=0

echo "🚀 Starting Multi-Agent Ralph Workflow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 Project: GW-InTech Portfolio"
echo "🔄 Max iterations per task: $MAX_ITERATIONS_PER_TASK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/Desktop/gwIntech

# Function to check if all tasks are done
check_all_done() {
  local todo_count=$(grep -c '"status": "todo"' plans/prd.json || true)
  local in_progress_count=$(grep -c '"status": "in_progress"' plans/prd.json || true)
  local total_pending=$((todo_count + in_progress_count))
  
  if [ $total_pending -eq 0 ]; then
    return 0  # All done
  else
    return 1  # Still have work
  fi
}

# Run agents in sequence until all tasks done
while true; do
  AGENT_COUNT=$((AGENT_COUNT + 1))
  
  echo ""
  echo "┌─────────────────────────────────────────┐"
  echo "│  🤖 Agent #$AGENT_COUNT Starting...              │"
  echo "└─────────────────────────────────────────┘"
  echo ""
  
  # Run one agent session (pass max iterations)
  ./ralph-once.sh $MAX_ITERATIONS_PER_TASK
  
  # Check if all tasks are complete
  if check_all_done; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 ALL TASKS COMPLETE!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📊 Final Summary:"
    echo "  - Total agents run: $AGENT_COUNT"
    echo "  - Check progress.txt for details"
    echo "  - Check git log for commits"
    echo ""
    echo "🧪 Final Validation:"
    npm run build && npm run lint && npm test
    echo ""
    echo "✅ Project complete and validated!"
    exit 0
  fi
  
  echo ""
  echo "Agent #$AGENT_COUNT completed. Moving to next task..."
  sleep 2
done
