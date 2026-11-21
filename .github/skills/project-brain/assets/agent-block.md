<!-- BRAIN:START — managed by project-brain, do not edit this block -->
## Project Brain — Graph Memory

**All commands:** `python {{BRAIN_PATH}} <command>`

1. **Start of session:** run `sync`, then read only `.brain/INDEX.md` and files listed as stale/new. Do NOT scan or read the whole repo.
2. **Find things:** run `query "<keywords>" --depth 2` before opening files. Open a file only if its node is stale or the summary is insufficient.
3. **After every file create/edit/delete:** run `touch <path> --summary "<1-2 sentences>" --link <node_id>[:edge_type]`.
4. **After every design decision, bug, or change of direction:** run `note --type decision|bug|thought|task --title "..." --summary "..." --link <node_id>[:edge_type]`. A decision replacing an older one must include `--link <old_decision_id>:supersedes`.
5. **End of session:** run `lint`, fix reported issues, then `digest`.
6. **Never** hand-edit `.brain/nodes.jsonl` or `.brain/edges.jsonl`.
<!-- BRAIN:END -->
