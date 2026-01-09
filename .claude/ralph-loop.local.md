---
active: true
iteration: 1
max_iterations: 50
completion_promise: "COMPLETE"
started_at: "2026-01-09T20:28:26Z"
---

Read plans/prd.json and progress.txt. Loop through ALL todo tasks one by one. For each task: complete it, mark done in prd.json, append to progress.txt, commit. Continue until ALL tasks have status='done'. Output <promise>COMPLETE</promise> when all tasks finished.
