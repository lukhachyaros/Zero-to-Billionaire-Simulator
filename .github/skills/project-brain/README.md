# project-brain

<p align="center">
  <img src="docs/images/hero-banner.jpg" alt="Project Brain Banner" width="100%">
</p>

Persistent graph memory for AI coding agents. Keeps a summarized knowledge graph in `.brain/` so agents don't re-read the entire codebase each session.

<p align="center">
  <img src="docs/images/concept-diagram.jpg" alt="Concept Diagram" width="85%">
</p>

## Quick Start

```bash
# From your project root:
python path/to/project-brain/scripts/brain.py init
python path/to/project-brain/scripts/brain.py scan
python path/to/project-brain/scripts/brain.py digest
```

## Workflow Pipeline

<p align="center">
  <img src="docs/images/workflow-pipeline.jpg" alt="Workflow Pipeline" width="90%">
</p>

## Install Location by Tool

| Tool | Copy `project-brain/` to | Auto-discovered |
|---|---|---|
| Antigravity | `.agents/skills/project-brain/` or `.gemini/skills/project-brain/` | ✅ via SKILL.md |
| Codex | `.agent/skills/project-brain/` | ✅ via AGENTS.md block |
| VS Code Copilot | `.github/skills/project-brain/` | ✅ via copilot-instructions.md block |
| Claude Code | `.claude/skills/project-brain/` | ✅ via AGENTS.md block |
| Any other | Anywhere; point agent to `SKILL.md` | Manual |

## Commands

| Command | Description |
|---|---|
| `init` | Create `.brain/`, inject agent instructions into AGENTS.md / GEMINI.md / copilot-instructions.md |
| `scan` | Walk project files, create/update file nodes, extract import edges |
| `sync` | Compare stored sha1 with disk; report stale/new/deleted files |
| `touch <path>` | Update a file node's summary and sha1 |
| `note` | Add a thought, decision, bug, or task node |
| `link` / `unlink` | Add or remove edges between nodes |
| `query <keywords>` | Search nodes by keyword; return relevant subgraph |
| `digest` | Generate `.brain/INDEX.md` (≤ 2000 tokens) |
| `compact` | Merge duplicate JSONL records |
| `lint` | Check for orphan nodes, dangling edges, empty summaries |
| `doctor` | Verify setup: Python version, permissions, paths, stale locks |
| `serve` | Start local viewer at http://127.0.0.1:8765 |

All commands support `--json` for machine-readable output.

## Visual Graph Viewer

<p align="center">
  <img src="docs/images/viewer-overview.png" alt="Graph Viewer" width="90%">
</p>

```bash
python path/to/project-brain/scripts/brain.py serve --port 8765
# Open http://127.0.0.1:8765
```

Interactive force-directed graph with search, filtering, timeline, and live updates.

## Data Files

Stored in `.brain/` at project root:
- `nodes.jsonl` — one node per line (append-only)
- `edges.jsonl` — one edge per line (append-only)
- `INDEX.md` — generated digest for agent consumption
- `config.json` — ignore globs, max_tokens, language parse settings
- `*.lock` — temporary lock files (gitignored)

## Requirements

- Python 3.10+ (stdlib only, no pip install)
- Works on Windows 11, macOS, Linux

