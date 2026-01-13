#!/bin/bash
set -e
MAX_ITERATIONS=${1:-20}
ITERATION=0
echo "Starting agent..."
cd ~/Desktop/gwIntech

# Skip permission prompts
claude config set --global dangerously_skip_permissions true

# Get initial count of todo tasks
INITIAL_TODO=$(grep -c '"status": "todo"' plans/prd.json || echo 0)

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  ITERATION=$((ITERATION + 1))
  echo "Iteration $ITERATION"
  
  claude "Read plans/prd.json and progress.txt. Pick first todo task. Complete it. Mark status='done' in prd.json. Commit changes."
  
  # Check if a task was completed (todo count decreased)
  CURRENT_TODO=$(grep -c '"status": "todo"' plans/prd.json || echo 0)
  
  if [ $CURRENT_TODO -lt $INITIAL_TODO ]; then
    echo "✅ Task completed! (Todo tasks: $INITIAL_TODO → $CURRENT_TODO)"
    exit 0
  fi
  
  if [ $ITERATION -lt $MAX_ITERATIONS ]; then
    echo "⚠️  Task not complete yet, trying again..."
    sleep 2
  fi
done

echo "❌ Max iterations reached"
exit 1
