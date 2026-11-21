---
name: project-brain
description: Persistent graph memory for the current project. Use at the start of any session in a project, before reading or searching the codebase, after creating/editing/deleting files, and after design decisions or bug findings. Avoids re-reading the whole repo by keeping summarized nodes and links in .brain/.
---

# Project Brain

Run all commands from the project root. `BRAIN` = `python <this-skill-dir>/scripts/brain.py`.

## Bootstrap
If `.brain/` does not exist: run `BRAIN init`, then `BRAIN scan`, then summarize every node flagged `needs_summary` using `BRAIN touch <path> --summary "..." --link ...`, then `BRAIN digest`.

## Every session
1. `BRAIN sync`. Read only `.brain/INDEX.md` and the files listed as stale/new.
2. Never scan or read the whole repo.

## While working
- Locate things with `BRAIN query "<keywords>" --depth 2` before opening files. Open a real file only if its node is stale or the summary is insufficient.
- After every file create/edit/delete: `BRAIN touch <path> --summary "<1-2 sentences>" --link <node_id>[:edge_type]`.
- After every design decision, bug, or change of direction: `BRAIN note --type decision|bug|thought|task --title ... --summary ... --link ...`. A decision replacing an older one uses `supersedes`.
- Every thought/decision node must link to at least one file or concept node.

## End of session
`BRAIN lint`, fix reported issues, then `BRAIN digest`.

## Viewer
`BRAIN serve` and open http://127.0.0.1:8765 when the user wants to see the graph.

## Rules
- Never hand-edit `.brain/nodes.jsonl` or `.brain/edges.jsonl`.
- Use `--json` when parsing output.
