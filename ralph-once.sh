#!/bin/bash
set -e
MAX_ITERATIONS=${1:-20}
ITERATION=0
echo "Starting agent..."
cd ~/Desktop/gwIntech
while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  ITERATION=$((ITERATION + 1))
  echo "Iteration $ITERATION"
  claude "Read plans/prd.json and progress.txt. Pick first todo task. Complete it. Output <promise>COMPLETE</promise> when done."
  if [ $? -eq 0 ]; then
    echo "Done!"
    exit 0
  fi
done
echo "Max iterations reached"
exit 1
