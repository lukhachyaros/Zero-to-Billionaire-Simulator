#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
project-brain: Persistent Graph Memory for AI Coding Agents
===========================================================

CLI tool providing graph-structured, persistent knowledge memory stored in
`.brain/` at the project root. Keeps a summarized knowledge graph of files,
decisions, thoughts, tasks, and code dependencies so that AI coding agents
never need to re-read the entire codebase at the start of a session.

Hard Constraints:
- Python 3.10+ stdlib ONLY. No external pip dependencies.
- Cross-platform: Windows 11, macOS, Linux (pathlib everywhere, UTF-8 file I/O).
- Append-only JSONL format for nodes and edges.
- Atomic writes via temporary files and os.replace().
- File locking with timeout and stale lock detection (fcntl on Unix, msvcrt on Windows).
- All commands support the global --json flag for machine consumption.
- Exit code != 0 on error with actionable diagnostics.
"""

from __future__ import annotations

import argparse
import ast
import contextlib
import dataclasses
import datetime
from datetime import timezone
import fnmatch
import hashlib
import http.server
import json
import os
from pathlib import Path, PurePosixPath
import random
import re
import secrets
import shutil
import string
import sys
import time
from typing import Any, Callable, Dict, Generator, Iterable, Iterator, List, Optional, Set, Tuple, Union
import urllib.parse

# Platform-specific file locking support
if sys.platform == "win32":
    import msvcrt
else:
    import fcntl


# ============================================================================
# CONSTANTS & CONFIGURATION DEFAULTS
# ============================================================================

VERSION = "1.0.0"
SCHEMA_VERSION = 1
DEFAULT_PORT = 8765
DEFAULT_LOCK_TIMEOUT = 10.0
DEFAULT_STALE_LOCK_AGE = 60.0
DEFAULT_MAX_TOKENS = 2000
MAX_INDEX_CHARACTERS = 8000
MAX_SUMMARY_LENGTH = 280
BINARY_CHECK_BYTES = 8192
COMPACT_THRESHOLD = 5000

# Node Type Enumeration
VALID_NODE_TYPES: Set[str] = {
    "file", "module", "concept", "decision", "thought", "task", "bug", "test",
}

# Node Status Enumeration
VALID_NODE_STATUSES: Set[str] = {
    "active", "stale", "superseded", "done",
}

# Edge Type Enumeration
VALID_EDGE_TYPES: Set[str] = {
    "imports", "depends_on", "implements", "tests", "caused_by",
    "fixes", "supersedes", "relates_to", "derived_from",
}

# Supported parse languages in config
DEFAULT_CONFIG_LANGUAGES: Dict[str, bool] = {
    "py": True, "js": True, "ts": True, "jsx": True,
    "tsx": True, "html": True, "php": True,
}

# Default globs ignored during directory scanning
DEFAULT_IGNORE_GLOBS: List[str] = [
    "node_modules/**", ".git/**", "__pycache__/**", "*.pyc", ".brain/**",
    ".test_tmp/**", "*.lock",
]

# Markers for injecting agent instructions into markdown files
BRAIN_START_MARKER_PREFIX = "<!-- BRAIN:START"
BRAIN_START_MARKER = "<!-- BRAIN:START — managed by project-brain, do not edit this block -->"
BRAIN_END_MARKER = "<!-- BRAIN:END -->"

# Fallback agent instruction block if assets/agent-block.md is missing
DEFAULT_AGENT_BLOCK = """<!-- BRAIN:START — managed by project-brain, do not edit this block -->
## Project Brain — Graph Memory

**All commands:** `python {{BRAIN_PATH}} <command>`

1. **Start of session:** run `sync`, then read only `.brain/INDEX.md` and files listed as stale/new. Do NOT scan or read the whole repo.
2. **Find things:** run `query "<keywords>" --depth 2` before opening files. Open a file only if its node is stale or the summary is insufficient.
3. **After every file create/edit/delete:** run `touch <path> --summary "<1-2 sentences>" --link <node_id>[:edge_type]`.
4. **After every design decision, bug, or change of direction:** run `note --type decision|bug|thought|task --title "..." --summary "..." --link <node_id>[:edge_type]`. A decision replacing an older one must include `--link <old_decision_id>:supersedes`.
5. **End of session:** run `lint`, fix reported issues, then `digest`.
6. **Never** hand-edit `.brain/nodes.jsonl` or `.brain/edges.jsonl`.
<!-- BRAIN:END -->"""


# ============================================================================
# EXCEPTIONS
# ============================================================================

class BrainError(Exception):
    """Base exception for all project-brain errors."""
    pass


class BrainLockError(BrainError):
    """Raised when an error occurs during file locking operations."""
    pass


class BrainLockTimeoutError(BrainLockError):
    """Raised when acquiring a file lock times out."""
    pass


class BrainValidationError(BrainError):
    """Raised when entity schema or constraint validation fails."""
    pass


class BrainStorageError(BrainError):
    """Raised when I/O or storage integrity failures occur."""
    pass


class BrainConfigError(BrainError):
    """Raised when config.json is corrupted or invalid."""
    pass


# ============================================================================
# UTILITIES: TIMESTAMPS, SESSIONS, HASHES, PATHS
# ============================================================================

def iso_now() -> str:
    """Return the current UTC timestamp formatted as ISO 8601 string."""
    return datetime.datetime.now(timezone.utc).isoformat()


def is_pid_alive(pid: int) -> bool:
    """Return whether a process PID appears to be alive on the current OS."""
    if pid <= 0:
        return False
    if pid == os.getpid():
        return True
    try:
        if sys.platform == "win32":
            import ctypes

            process = ctypes.windll.kernel32.OpenProcess(0x1000, False, pid)
            if process:
                ctypes.windll.kernel32.CloseHandle(process)
                return True
            return False
        os.kill(pid, 0)
        return True
    except (OSError, AttributeError):
        return False


def lock_owner_is_dead(lock_path: Path) -> bool:
    """Best-effort check for a lock file whose recorded process is gone."""
    try:
        text = lock_path.read_text(encoding="utf-8")
    except OSError:
        return False
    match = re.search(r"^pid=(\d+)$", text, re.MULTILINE)
    if not match:
        return False
    return not is_pid_alive(int(match.group(1)))


def generate_session_id() -> str:
    """Generate a unique session identifier per CLI invocation."""
    ts = datetime.datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    suffix = secrets.token_hex(4)
    return f"{ts}_{suffix}"


# Global session ID for this process invocation
GLOBAL_SESSION_ID = generate_session_id()


def get_current_agent_name() -> str:
    """Determine the active agent identifier from environment or fallback."""
    return (
        os.environ.get("AGENT_NAME")
        or os.environ.get("AI_AGENT")
        or os.environ.get("USER")
        or os.environ.get("USERNAME")
        or "brain-agent"
    )


def compute_file_sha1(file_path: Path) -> str:
    """
    Compute the SHA-1 hexadecimal digest of a file on disk.
    Reads in 64 KiB chunks for minimal memory consumption.
    """
    h = hashlib.sha1()
    try:
        with open(file_path, "rb") as f:
            while chunk := f.read(65536):
                h.update(chunk)
        return h.hexdigest()
    except OSError as err:
        raise BrainStorageError(f"Failed to read file for hash computation: {file_path} ({err})") from err


def is_binary_file(file_path: Path) -> bool:
    """Check if a file is binary by inspecting the first 8192 bytes for null bytes."""
    try:
        with open(file_path, "rb") as f:
            chunk = f.read(BINARY_CHECK_BYTES)
            return b"\x00" in chunk
    except OSError:
        return True


def normalize_posix_path(path: Union[str, Path]) -> str:
    """Convert any path to a forward-slash normalized relative POSIX string."""
    return Path(path).as_posix()


def make_slug(title: str, max_words: int = 4) -> str:
    """
    Generate a URL-safe lowercase slug from the first N words of a title string.
    Words are stripped of non-alphanumeric characters and joined by dashes.
    """
    words = title.strip().split()[:max_words]
    slug_tokens: List[str] = []
    for w in words:
        cleaned = re.sub(r"[^a-zA-Z0-9]+", "", w).lower()
        if cleaned:
            slug_tokens.append(cleaned)
    if not slug_tokens:
        slug_tokens = ["item"]
    return "-".join(slug_tokens)


def find_project_root(explicit_root: Optional[Union[str, Path]] = None) -> Path:
    """
    Detect the project root directory:
    1. If explicit_root is provided, resolve and verify it exists.
    2. Otherwise, find the nearest ancestor of cwd containing `.git/`.
    3. If no `.git/` ancestor is found, fall back to cwd.
    The script does not assume its own directory is inside the project.
    """
    if explicit_root:
        p = Path(explicit_root).resolve()
        if not p.exists() or not p.is_dir():
            raise BrainError(f"Specified project root directory does not exist or is not a directory: {explicit_root}")
        return p

    current = Path.cwd().resolve()
    candidates = [current] + list(current.parents)
    for candidate in candidates:
        if (candidate / ".git").exists():
            return candidate
    return current


def find_skill_dir() -> Path:
    """
    Detect the project-brain skill directory:
    Look for SKILL.md relative to brain.py's location.
    brain.py is located in scripts/, so the skill dir is parent (../).
    """
    script_dir = Path(__file__).resolve().parent
    parent = script_dir.parent
    if (parent / "SKILL.md").exists():
        return parent
    if (script_dir / "SKILL.md").exists():
        return script_dir
    for ancestor in script_dir.parents:
        if (ancestor / "SKILL.md").exists():
            return ancestor
    return parent


# ============================================================================
# DATA MODELS: CONFIG, NODE, EDGE
# ============================================================================

@dataclasses.dataclass
class BrainConfig:
    """Project-level brain configuration loaded from .brain/config.json."""
    ignore_globs: List[str] = dataclasses.field(default_factory=lambda: list(DEFAULT_IGNORE_GLOBS))
    max_tokens: int = DEFAULT_MAX_TOKENS
    languages: Dict[str, bool] = dataclasses.field(default_factory=lambda: dict(DEFAULT_CONFIG_LANGUAGES))
    description: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        data: Dict[str, Any] = {
            "ignore_globs": self.ignore_globs,
            "max_tokens": self.max_tokens,
            "languages": self.languages,
            "schema_version": SCHEMA_VERSION,
        }
        if self.description:
            data["description"] = self.description
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> BrainConfig:
        schema_version = int(data.get("schema_version", 1))
        if schema_version > SCHEMA_VERSION:
            raise BrainConfigError(
                f"Unsupported config schema version {schema_version}; "
                f"this Brain-Net supports up to {SCHEMA_VERSION}. Upgrade Brain-Net."
            )
        return cls(
            ignore_globs=list(data.get("ignore_globs", DEFAULT_IGNORE_GLOBS)),
            max_tokens=int(data.get("max_tokens", DEFAULT_MAX_TOKENS)),
            languages=dict(data.get("languages", DEFAULT_CONFIG_LANGUAGES)),
            description=data.get("description"),
        )


@dataclasses.dataclass
class Node:
    """
    Represents a knowledge node in the project-brain graph.
    Serialized as a single JSON object per line in `.brain/nodes.jsonl`.
    """
    id: str
    type: str
    title: str
    summary: str = ""
    path: Optional[str] = None
    sha1: Optional[str] = None
    tags: List[str] = dataclasses.field(default_factory=list)
    status: str = "active"
    needs_summary: bool = False
    created: str = dataclasses.field(default_factory=iso_now)
    updated: str = dataclasses.field(default_factory=iso_now)
    session_id: str = GLOBAL_SESSION_ID
    agent: str = dataclasses.field(default_factory=get_current_agent_name)

    def validate(self) -> None:
        """Validate node fields against schema rules."""
        if not self.id or not isinstance(self.id, str):
            raise BrainValidationError("Node 'id' must be a non-empty string.")
        if self.type not in VALID_NODE_TYPES:
            raise BrainValidationError(
                f"Invalid node type '{self.type}'. Must be one of: {sorted(VALID_NODE_TYPES)}"
            )
        if not self.title or not isinstance(self.title, str):
            raise BrainValidationError("Node 'title' must be a non-empty string.")
        if self.status not in VALID_NODE_STATUSES:
            raise BrainValidationError(
                f"Invalid node status '{self.status}'. Must be one of: {sorted(VALID_NODE_STATUSES)}"
            )
        if len(self.summary) > MAX_SUMMARY_LENGTH:
            self.summary = self.summary[:MAX_SUMMARY_LENGTH]

    def to_dict(self) -> Dict[str, Any]:
        """Convert node to a dictionary formatted for JSON serialization."""
        self.validate()
        return {
            "agent": self.agent,
            "created": self.created,
            "id": self.id,
            "needs_summary": bool(self.needs_summary),
            "path": self.path,
            "schema_version": SCHEMA_VERSION,
            "session_id": self.session_id,
            "sha1": self.sha1,
            "status": self.status,
            "summary": self.summary,
            "tags": list(self.tags),
            "title": self.title,
            "type": self.type,
            "updated": self.updated,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> Node:
        """Instantiate a Node from raw dictionary."""
        schema_version = int(data.get("schema_version", 1))
        if schema_version > SCHEMA_VERSION:
            raise BrainValidationError(
                f"Unsupported node schema version {schema_version}; "
                f"this Brain-Net supports up to {SCHEMA_VERSION}. Upgrade Brain-Net."
            )
        return cls(
            id=str(data.get("id", "")),
            type=str(data.get("type", "concept")),
            title=str(data.get("title", "")),
            summary=str(data.get("summary", "")),
            path=data.get("path"),
            sha1=data.get("sha1"),
            tags=list(data.get("tags") or []),
            status=str(data.get("status", "active")),
            needs_summary=bool(data.get("needs_summary", False)),
            created=str(data.get("created") or iso_now()),
            updated=str(data.get("updated") or iso_now()),
            session_id=str(data.get("session_id", GLOBAL_SESSION_ID)),
            agent=str(data.get("agent", get_current_agent_name())),
        )


@dataclasses.dataclass
class Edge:
    """
    Represents a directed relationship between two nodes in project-brain.
    Serialized as a single JSON object per line in `.brain/edges.jsonl`.
    """
    src: str
    dst: str
    type: str
    weight: float = 1.0
    note: str = ""
    created: str = dataclasses.field(default_factory=iso_now)
    deleted: bool = False

    def validate(self) -> None:
        """Validate edge fields against schema rules."""
        if not self.src or not isinstance(self.src, str):
            raise BrainValidationError("Edge 'src' must be a non-empty string.")
        if not self.dst or not isinstance(self.dst, str):
            raise BrainValidationError("Edge 'dst' must be a non-empty string.")
        if self.type not in VALID_EDGE_TYPES:
            raise BrainValidationError(
                f"Invalid edge type '{self.type}'. Must be one of: {sorted(VALID_EDGE_TYPES)}"
            )
        try:
            self.weight = float(self.weight)
        except (ValueError, TypeError) as err:
            raise BrainValidationError(f"Edge 'weight' must be a float: {err}") from err
        if not (0.0 <= self.weight <= 1.0):
            raise BrainValidationError("Edge 'weight' must be in range [0.0, 1.0].")

    @property
    def key(self) -> Tuple[str, str, str]:
        """Unique deduplication key for this edge."""
        return (self.src, self.dst, self.type)

    def to_dict(self) -> Dict[str, Any]:
        """Convert edge to a dictionary formatted for JSON serialization."""
        self.validate()
        res: Dict[str, Any] = {
            "created": self.created,
            "dst": self.dst,
            "note": self.note,
            "schema_version": SCHEMA_VERSION,
            "src": self.src,
            "type": self.type,
            "weight": round(self.weight, 4),
        }
        if self.deleted:
            res["deleted"] = True
        return res

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> Edge:
        """Instantiate an Edge from raw dictionary."""
        schema_version = int(data.get("schema_version", 1))
        if schema_version > SCHEMA_VERSION:
            raise BrainValidationError(
                f"Unsupported edge schema version {schema_version}; "
                f"this Brain-Net supports up to {SCHEMA_VERSION}. Upgrade Brain-Net."
            )
        return cls(
            src=str(data.get("src", "")),
            dst=str(data.get("dst", "")),
            type=str(data.get("type", "relates_to")),
            weight=float(data.get("weight", 1.0)),
            note=str(data.get("note", "")),
            created=str(data.get("created") or iso_now()),
            deleted=bool(data.get("deleted", False)),
        )


# ============================================================================
# CROSS-PLATFORM FILE LOCKING
# ============================================================================

class FileLock:
    """
    Cross-platform file locking context manager with timeout and stale lock detection.
    - Unix: Uses fcntl.flock(fd, LOCK_EX | LOCK_NB)
    - Windows: Uses msvcrt.locking(fd, LK_NBLCK, 1)
    - Lock-file age is diagnostic only; OS advisory locks remain authoritative.
    """

    def __init__(
        self,
        lock_path: Path,
        timeout: float = DEFAULT_LOCK_TIMEOUT,
        stale_age: float = DEFAULT_STALE_LOCK_AGE,
    ) -> None:
        self.lock_path = lock_path.resolve()
        self.timeout = float(timeout)
        self.stale_age = float(stale_age)
        self._file_obj: Optional[Any] = None
        self._fd: Optional[int] = None
        self._is_locked: bool = False

    def acquire(self) -> None:
        """Attempt to acquire the file lock within the specified timeout."""
        start_time = time.time()
        warned_stale = False
        self.lock_path.parent.mkdir(parents=True, exist_ok=True)

        while True:
            # Detect orphaned lock metadata for diagnostics, but never unlink it.
            # Unlinking a live lock file can make concurrent processes lock
            # different inodes and bypass the critical section.
            if self.lock_path.exists():
                try:
                    stat_info = self.lock_path.stat()
                    age = time.time() - stat_info.st_mtime
                    if age > self.stale_age and not warned_stale:
                        sys.stderr.write(
                            f"[brain warning] Stale lock detected at {self.lock_path} "
                            f"(age: {age:.1f}s > {self.stale_age:.1f}s). "
                            "Waiting for the OS lock; the lock file will not be removed.\n"
                        )
                        warned_stale = True
                except OSError:
                    pass

            # Try to open and lock the file
            f = None
            try:
                f = open(self.lock_path, "a+b")
                fd = f.fileno()

                if sys.platform == "win32":
                    f.seek(0, os.SEEK_END)
                    if f.tell() == 0:
                        f.write(b" ")
                        f.flush()
                    f.seek(0)
                    msvcrt.locking(fd, msvcrt.LK_NBLCK, 1)
                else:
                    fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)

                self._file_obj = f
                self._fd = fd
                self._is_locked = True

                try:
                    f.seek(0)
                    f.truncate()
                    metadata = f"pid={os.getpid()}\ntime={iso_now()}\n".encode("utf-8")
                    f.write(metadata)
                    f.flush()
                except OSError:
                    pass
                return

            except (BlockingIOError, OSError, PermissionError):
                if f is not None:
                    try:
                        f.close()
                    except OSError:
                        pass

                if (time.time() - start_time) >= self.timeout:
                    raise BrainLockTimeoutError(
                        f"Failed to acquire file lock '{self.lock_path}' within {self.timeout}s."
                    )
                time.sleep(0.05)

    def release(self) -> None:
        """Release the OS advisory lock while retaining lock metadata.

        Retaining the file prevents a waiter that opened the old inode from
        losing synchronization when another process creates a new lock file.
        """
        if not self._is_locked:
            return

        try:
            if self._file_obj is not None and self._fd is not None:
                try:
                    if sys.platform == "win32":
                        self._file_obj.seek(0)
                        msvcrt.locking(self._fd, msvcrt.LK_UNLCK, 1)
                    else:
                        fcntl.flock(self._fd, fcntl.LOCK_UN)
                except OSError:
                    pass

                try:
                    self._file_obj.close()
                except OSError:
                    pass

        finally:
            self._file_obj = None
            self._fd = None
            self._is_locked = False

    def __enter__(self) -> FileLock:
        self.acquire()
        return self

    def __exit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        self.release()


# ============================================================================
# ATOMIC FILE I/O & STORAGE MANAGER
# ============================================================================

def atomic_write_text(target_path: Path, content: str) -> None:
    """
    Atomically write text content to target_path using a temporary file
    in the same directory and os.replace(). Forces UTF-8 encoding.
    """
    target_path = target_path.resolve()
    target_path.parent.mkdir(parents=True, exist_ok=True)
    temp_name = f".{target_path.name}.tmp.{os.getpid()}.{secrets.token_hex(4)}"
    temp_path = target_path.parent / temp_name

    try:
        with open(temp_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp_path, target_path)
    finally:
        if temp_path.exists():
            try:
                temp_path.unlink()
            except OSError:
                pass


def atomic_write_jsonl(target_path: Path, records: Iterable[Dict[str, Any]]) -> None:
    """
    Atomically serialize a collection of records to a JSONL file.
    Each record is sorted by key for stable diffs.
    """
    lines: List[str] = []
    for rec in records:
        lines.append(json.dumps(rec, sort_keys=True) + "\n")
    atomic_write_text(target_path, "".join(lines))


class BrainStorage:
    """
    Manages persistent JSONL storage in `.brain/` with file locking,
    append-only writing, atomic updates, and compaction.
    """

    def __init__(self, project_root: Path) -> None:
        self.project_root = project_root.resolve()
        self.brain_dir = self.project_root / ".brain"
        self.nodes_path = self.brain_dir / "nodes.jsonl"
        self.edges_path = self.brain_dir / "edges.jsonl"
        self.config_path = self.brain_dir / "config.json"
        self.index_path = self.brain_dir / "INDEX.md"
        self.nodes_lock_path = self.brain_dir / ".nodes.lock"
        self.edges_lock_path = self.brain_dir / ".edges.lock"

    def ensure_brain_dir(self) -> None:
        """Create the .brain directory if it does not already exist."""
        self.brain_dir.mkdir(parents=True, exist_ok=True)

    def load_config(self) -> BrainConfig:
        """Load project configuration or return default configuration."""
        if not self.config_path.exists():
            return BrainConfig()
        try:
            with open(self.config_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return BrainConfig.from_dict(data)
        except Exception as err:
            raise BrainConfigError(f"Error parsing {self.config_path}: {err}") from err

    def save_config(self, config: BrainConfig) -> None:
        """Atomically persist configuration to .brain/config.json."""
        self.ensure_brain_dir()
        text = json.dumps(config.to_dict(), indent=2, sort_keys=True) + "\n"
        atomic_write_text(self.config_path, text)

    def read_nodes(self) -> Dict[str, Node]:
        """
        Read all nodes from nodes.jsonl.
        Rule: Latest record by id wins (append-only format).
        Returns a mapping of node_id -> Node.
        """
        if not self.nodes_path.exists():
            return {}

        nodes: Dict[str, Node] = {}
        with FileLock(self.nodes_lock_path):
            with open(self.nodes_path, "r", encoding="utf-8") as f:
                for line_num, line in enumerate(f, start=1):
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        record = json.loads(line)
                        node = Node.from_dict(record)
                        nodes[node.id] = node
                    except Exception as err:
                        sys.stderr.write(
                            f"[brain warning] Failed to parse node at line {line_num} in {self.nodes_path}: {err}\n"
                        )
        return nodes

    def read_edges(self) -> List[Edge]:
        """
        Read all edges from edges.jsonl.
        Rule: Latest record by (src, dst, type) wins. If latest is marked deleted,
        the edge is excluded from the active set.
        """
        if not self.edges_path.exists():
            return []

        edge_map: Dict[Tuple[str, str, str], Edge] = {}
        with FileLock(self.edges_lock_path):
            with open(self.edges_path, "r", encoding="utf-8") as f:
                for line_num, line in enumerate(f, start=1):
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        record = json.loads(line)
                        edge = Edge.from_dict(record)
                        if edge.deleted:
                            edge_map.pop(edge.key, None)
                        else:
                            edge_map[edge.key] = edge
                    except Exception as err:
                        sys.stderr.write(
                            f"[brain warning] Failed to parse edge at line {line_num} in {self.edges_path}: {err}\n"
                        )
        return list(edge_map.values())

    def append_node(self, node: Node) -> None:
        """Append a single node record to nodes.jsonl under lock."""
        self.append_nodes([node])

    def append_nodes(self, nodes: List[Node]) -> None:
        """Append multiple node records to nodes.jsonl under lock."""
        if not nodes:
            return
        self.ensure_brain_dir()
        with FileLock(self.nodes_lock_path):
            with open(self.nodes_path, "a", encoding="utf-8", newline="\n") as f:
                for node in nodes:
                    line = json.dumps(node.to_dict(), sort_keys=True)
                    f.write(line + "\n")
                f.flush()
                os.fsync(f.fileno())
        if self.nodes_path.exists():
            try:
                with open(self.nodes_path, "r", encoding="utf-8") as f:
                    line_count = sum(1 for line in f if line.strip())
                if line_count > COMPACT_THRESHOLD:
                    self.compact()
            except OSError as err:
                raise BrainStorageError(f"Could not inspect {self.nodes_path}: {err}") from err

    def append_edge(self, edge: Edge) -> None:
        """Append a single edge record to edges.jsonl under lock."""
        self.append_edges([edge])

    def append_edges(self, edges: List[Edge]) -> None:
        """Append multiple edge records to edges.jsonl under lock."""
        if not edges:
            return
        self.ensure_brain_dir()
        with FileLock(self.edges_lock_path):
            with open(self.edges_path, "a", encoding="utf-8", newline="\n") as f:
                for edge in edges:
                    line = json.dumps(edge.to_dict(), sort_keys=True)
                    f.write(line + "\n")
                f.flush()
                os.fsync(f.fileno())
        if self.edges_path.exists():
            try:
                with open(self.edges_path, "r", encoding="utf-8") as f:
                    line_count = sum(1 for line in f if line.strip())
                if line_count > COMPACT_THRESHOLD:
                    self.compact()
            except OSError as err:
                raise BrainStorageError(f"Could not inspect {self.edges_path}: {err}") from err

    def compact(self) -> Dict[str, int]:
        """
        Merge and deduplicate nodes and edges JSONL files:
        - Nodes: keep only latest record per id.
        - Edges: keep latest record per (src, dst, type), discarding deleted records.
        Rewrites both files atomically.
        """
        self.ensure_brain_dir()
        with FileLock(self.nodes_lock_path):
            with FileLock(self.edges_lock_path):
                # Compact nodes
                nodes_before = 0
                node_map: Dict[str, Node] = {}
                if self.nodes_path.exists():
                    with open(self.nodes_path, "r", encoding="utf-8") as f:
                        for line in f:
                            if line.strip():
                                nodes_before += 1
                                try:
                                    n = Node.from_dict(json.loads(line))
                                    node_map[n.id] = n
                                except Exception as err:
                                    sys.stderr.write(
                                        f"[brain warning] Compact skipped invalid node at line "
                                        f"{nodes_before} in {self.nodes_path}: {err}\n"
                                    )

                sorted_nodes = sorted(node_map.values(), key=lambda n: n.id)
                atomic_write_jsonl(self.nodes_path, [n.to_dict() for n in sorted_nodes])

                # Compact edges
                edges_before = 0
                edge_map: Dict[Tuple[str, str, str], Edge] = {}
                if self.edges_path.exists():
                    with open(self.edges_path, "r", encoding="utf-8") as f:
                        for line in f:
                            if line.strip():
                                edges_before += 1
                                try:
                                    e = Edge.from_dict(json.loads(line))
                                    if e.deleted:
                                        edge_map.pop(e.key, None)
                                    else:
                                        edge_map[e.key] = e
                                except Exception as err:
                                    sys.stderr.write(
                                        f"[brain warning] Compact skipped invalid edge at line "
                                        f"{edges_before} in {self.edges_path}: {err}\n"
                                    )

                sorted_edges = sorted(edge_map.values(), key=lambda e: (e.src, e.dst, e.type))
                atomic_write_jsonl(self.edges_path, [e.to_dict() for e in sorted_edges])

                return {
                    "nodes_before": nodes_before,
                    "nodes_after": len(sorted_nodes),
                    "edges_before": edges_before,
                    "edges_after": len(sorted_edges),
                }


# ============================================================================
# GITIGNORE & PATH PATTERN MATCHER
# ============================================================================

class GitIgnoreRule:
    """Represents a single parsed .gitignore or ignore_glob pattern."""

    def __init__(self, raw_pattern: str) -> None:
        self.raw_pattern = raw_pattern.strip()
        self.is_negation = False
        self.dir_only = False
        self.regex: Optional[re.Pattern] = None
        self._parse()

    def _parse(self) -> None:
        pattern = self.raw_pattern
        if pattern.startswith("!"):
            self.is_negation = True
            pattern = pattern[1:]

        if pattern.endswith("/"):
            self.dir_only = True
            pattern = pattern[:-1]

        self.regex = self._pattern_to_regex(pattern)

    @staticmethod
    def _pattern_to_regex(pattern: str) -> re.Pattern:
        pattern = pattern.replace("\\", "/")
        anchored = pattern.startswith("/")
        if anchored:
            pattern = pattern[1:]
        i = 0
        regex_parts: List[str] = []
        while i < len(pattern):
            char = pattern[i]
            if char == "*":
                if i + 1 < len(pattern) and pattern[i + 1] == "*":
                    i += 2
                    if i < len(pattern) and pattern[i] == "/":
                        regex_parts.append("(?:[^/]+/)*")
                        i += 1
                    else:
                        regex_parts.append(".*")
                    continue
                regex_parts.append("[^/]*")
            elif char == "?":
                regex_parts.append("[^/]")
            elif char == "[":
                end = pattern.find("]", i + 1)
                if end != -1:
                    regex_parts.append(pattern[i:end + 1])
                    i = end
                else:
                    regex_parts.append(r"\[")
            else:
                regex_parts.append(re.escape(char))
            i += 1

        full_regex = "".join(regex_parts)
        if anchored or "/" in pattern:
            final_regex = f"^{full_regex}(?:/.*)?$"
        else:
            final_regex = f"(?:^|/){full_regex}(?:/.*)?$"
        return re.compile(final_regex, re.IGNORECASE)

    def matches(self, rel_path: str, is_dir: bool = False) -> bool:
        """Check if relative path matches this rule."""
        if self.dir_only and not is_dir and not rel_path.endswith("/"):
            return False
        clean_path = rel_path.strip("/")
        return bool(self.regex and self.regex.search(clean_path))


class GitIgnoreMatcher:
    """
    Evaluates file and directory paths against root .gitignore patterns
    and project-brain config ignore_globs.
    """

    def __init__(self, project_root: Path, extra_globs: Optional[List[str]] = None) -> None:
        self.project_root = project_root.resolve()
        self.rules: List[GitIgnoreRule] = []
        self._load_defaults()
        self._load_root_gitignore()
        if extra_globs:
            for g in extra_globs:
                self.add_pattern(g)

    def _load_defaults(self) -> None:
        self.add_pattern(".git/**")
        self.add_pattern(".brain/**")

    def _load_root_gitignore(self) -> None:
        gi_path = self.project_root / ".gitignore"
        if not gi_path.exists():
            return
        try:
            with open(gi_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    self.add_pattern(line)
        except OSError as err:
            raise BrainStorageError(f"Could not read {gi_path}: {err}") from err

    def add_pattern(self, pattern: str) -> None:
        """Add an ignore pattern."""
        if not pattern or pattern.startswith("#"):
            return
        self.rules.append(GitIgnoreRule(pattern))

    def is_ignored(self, path: Union[str, Path], is_dir: bool = False) -> bool:
        """
        Check whether a path relative to project_root is ignored.
        Respects negation (!) rules evaluated in order.
        """
        p = Path(path)
        if p.is_absolute():
            try:
                rel_path = p.relative_to(self.project_root).as_posix()
            except ValueError:
                rel_path = p.as_posix()
        else:
            rel_path = p.as_posix()

        ignored = False
        for rule in self.rules:
            if rule.matches(rel_path, is_dir=is_dir):
                ignored = not rule.is_negation
        return ignored

    def walk_project_files(self) -> Generator[Path, None, None]:
        """
        Walk project filesystem tree, skipping ignored directories and files.
        Yields non-ignored file Path objects.
        """
        for root, dirs, files in os.walk(self.project_root):
            root_path = Path(root)
            try:
                rel_dir = root_path.relative_to(self.project_root)
            except ValueError:
                rel_dir = Path(".")

            # Filter dirs in-place to prune ignored subtrees
            kept_dirs: List[str] = []
            for d in dirs:
                sub_rel = (rel_dir / d).as_posix()
                if not self.is_ignored(sub_rel, is_dir=True):
                    kept_dirs.append(d)
            dirs[:] = kept_dirs

            for f in files:
                file_path = root_path / f
                sub_rel = (rel_dir / f).as_posix()
                if not self.is_ignored(sub_rel, is_dir=False):
                    yield file_path


# ============================================================================
# LANGUAGE IMPORT EXTRACTORS
# ============================================================================

class PythonImportExtractor:
    """Extracts and resolves imported modules for Python files using the ast module."""

    @staticmethod
    def extract(file_path: Path, project_root: Path) -> List[str]:
        target_ids: Set[str] = set()
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                source = f.read()
            tree = ast.parse(source, filename=str(file_path))
        except Exception:
            return []

        rel_source_dir = file_path.parent

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    resolved = PythonImportExtractor._resolve_module(
                        alias.name, rel_source_dir, project_root
                    )
                    if resolved:
                        target_ids.add(resolved)
            elif isinstance(node, ast.ImportFrom):
                level = node.level
                base_module = node.module or ""
                if level > 0:
                    base_dir = rel_source_dir
                    for _ in range(level - 1):
                        base_dir = base_dir.parent
                    resolved = PythonImportExtractor._resolve_module(
                        base_module, base_dir, project_root
                    )
                    if resolved:
                        target_ids.add(resolved)
                    for alias in node.names:
                        sub_mod = f"{base_module}.{alias.name}" if base_module else alias.name
                        sub_res = PythonImportExtractor._resolve_module(
                            sub_mod, base_dir, project_root
                        )
                        if sub_res:
                            target_ids.add(sub_res)
                else:
                    resolved = PythonImportExtractor._resolve_module(
                        base_module, rel_source_dir, project_root
                    )
                    if resolved:
                        target_ids.add(resolved)
                    for alias in node.names:
                        sub_mod = f"{base_module}.{alias.name}" if base_module else alias.name
                        sub_res = PythonImportExtractor._resolve_module(
                            sub_mod, rel_source_dir, project_root
                        )
                        if sub_res:
                            target_ids.add(sub_res)

        my_id = f"file:{file_path.relative_to(project_root).as_posix()}"
        target_ids.discard(my_id)
        return sorted(target_ids)

    @staticmethod
    def _resolve_module(module_name: str, current_dir: Path, project_root: Path) -> Optional[str]:
        if not module_name:
            return None

        rel_path_str = module_name.replace(".", "/")
        candidates: List[Path] = [
            current_dir / f"{rel_path_str}.py",
            current_dir / rel_path_str / "__init__.py",
            project_root / f"{rel_path_str}.py",
            project_root / rel_path_str / "__init__.py",
            project_root / "src" / f"{rel_path_str}.py",
            project_root / "src" / rel_path_str / "__init__.py",
            project_root / "lib" / f"{rel_path_str}.py",
            project_root / "lib" / rel_path_str / "__init__.py",
        ]

        for cand in candidates:
            if cand.exists() and cand.is_file():
                try:
                    rel = cand.resolve().relative_to(project_root.resolve()).as_posix()
                    return f"file:{rel}"
                except ValueError:
                    pass
        return None


class JsTsImportExtractor:
    """Extracts and resolves imports for JS, TS, JSX, and TSX files."""

    RE_STATIC = re.compile(
        r"""(?:import|export)\s+(?:(?:[\w*\s{},]*)\s+from\s+)?['"]([^'"]+)['"]""",
        re.MULTILINE,
    )
    RE_DYNAMIC = re.compile(
        r"""(?:require|import)\s*\(\s*['"]([^'"]+)['"]\s*\)""",
        re.MULTILINE,
    )

    EXTENSIONS = [
        "", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
        "/index.ts", "/index.tsx", "/index.js", "/index.jsx",
    ]

    @classmethod
    def extract(cls, file_path: Path, project_root: Path) -> List[str]:
        target_ids: Set[str] = set()
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except OSError:
            return []

        specifiers: Set[str] = set()
        for match in cls.RE_STATIC.finditer(content):
            specifiers.add(match.group(1))
        for match in cls.RE_DYNAMIC.finditer(content):
            specifiers.add(match.group(1))

        current_dir = file_path.parent

        for spec in specifiers:
            if spec.startswith("."):
                base = current_dir / spec
            elif spec.startswith("/"):
                base = project_root / spec.lstrip("/")
            elif spec.startswith("@/"):
                base = project_root / "src" / spec[2:]
            elif spec.startswith("~/"):
                base = project_root / spec[2:]
            else:
                continue

            for ext in cls.EXTENSIONS:
                cand = Path(f"{base}{ext}").resolve()
                if cand.exists() and cand.is_file():
                    try:
                        rel = cand.relative_to(project_root.resolve()).as_posix()
                        target_ids.add(f"file:{rel}")
                        break
                    except ValueError:
                        pass

        my_id = f"file:{file_path.relative_to(project_root).as_posix()}"
        target_ids.discard(my_id)
        return sorted(target_ids)


class HtmlImportExtractor:
    """Extracts imported scripts and stylesheets from HTML files."""

    RE_SCRIPT = re.compile(r"""<script\b[^>]*?\bsrc=["']([^"']+)["']""", re.IGNORECASE)
    RE_LINK = re.compile(r"""<link\b[^>]*?\bhref=["']([^"']+)["']""", re.IGNORECASE)

    @classmethod
    def extract(cls, file_path: Path, project_root: Path) -> List[str]:
        target_ids: Set[str] = set()
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except OSError:
            return []

        specifiers: Set[str] = set()
        for m in cls.RE_SCRIPT.finditer(content):
            specifiers.add(m.group(1))
        for m in cls.RE_LINK.finditer(content):
            specifiers.add(m.group(1))

        current_dir = file_path.parent

        for spec in specifiers:
            if re.match(r"^(?:https?:|//|data:|mailto:|javascript:)", spec, re.IGNORECASE):
                continue
            clean_spec = spec.split("?")[0].split("#")[0]
            if clean_spec.startswith("/"):
                cand = (project_root / clean_spec.lstrip("/")).resolve()
            else:
                cand = (current_dir / clean_spec).resolve()

            if cand.exists() and cand.is_file():
                try:
                    rel = cand.relative_to(project_root.resolve()).as_posix()
                    target_ids.add(f"file:{rel}")
                except ValueError:
                    pass

        my_id = f"file:{file_path.relative_to(project_root).as_posix()}"
        target_ids.discard(my_id)
        return sorted(target_ids)


class PhpImportExtractor:
    """Extracts include and require statements from PHP files."""

    RE_PHP = re.compile(
        r"""\b(?:include|require|include_once|require_once)\s*(?:\(\s*['"]([^'"]+)['"]\s*\)|['"]([^'"]+)['"])""",
        re.IGNORECASE,
    )

    @classmethod
    def extract(cls, file_path: Path, project_root: Path) -> List[str]:
        target_ids: Set[str] = set()
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except OSError:
            return []

        specifiers: Set[str] = set()
        for m in cls.RE_PHP.finditer(content):
            spec = m.group(1) or m.group(2)
            if spec:
                specifiers.add(spec)

        current_dir = file_path.parent

        for spec in specifiers:
            if spec.startswith("/"):
                cand = (project_root / spec.lstrip("/")).resolve()
            else:
                cand = (current_dir / spec).resolve()

            if cand.exists() and cand.is_file():
                try:
                    rel = cand.relative_to(project_root.resolve()).as_posix()
                    target_ids.add(f"file:{rel}")
                except ValueError:
                    pass

        my_id = f"file:{file_path.relative_to(project_root).as_posix()}"
        target_ids.discard(my_id)
        return sorted(target_ids)


def extract_file_imports(
    file_path: Path,
    project_root: Path,
    config: BrainConfig,
) -> List[str]:
    """
    Dispatch file to appropriate import extractor based on file extension
    and enabled languages in config.
    """
    ext = file_path.suffix.lower().lstrip(".")
    if not ext:
        return []

    lang_enabled = config.languages.get(ext, False)
    if not lang_enabled:
        return []

    if ext == "py":
        return PythonImportExtractor.extract(file_path, project_root)
    elif ext in ("js", "mjs", "cjs", "jsx", "ts", "tsx"):
        return JsTsImportExtractor.extract(file_path, project_root)
    elif ext in ("html", "htm"):
        return HtmlImportExtractor.extract(file_path, project_root)
    elif ext == "php":
        return PhpImportExtractor.extract(file_path, project_root)

    return []


# ============================================================================
# GRAPH ALGORITHMS & SCORING
# ============================================================================

class GraphQueryEngine:
    """
    Executes graph-assisted searches over project-brain knowledge nodes.
    Combines lexical term scoring with breadth-first graph proximity boost.
    """

    def __init__(self, nodes: Dict[str, Node], edges: List[Edge]) -> None:
        self.nodes = nodes
        self.edges = edges
        self.adj: Dict[str, Set[str]] = {nid: set() for nid in nodes}
        for e in edges:
            if e.src in self.adj and e.dst in self.adj:
                self.adj[e.src].add(e.dst)
                self.adj[e.dst].add(e.src)

    def query(
        self,
        keyword_or_id: str,
        max_depth: int = 2,
        filter_type: Optional[str] = None,
        top_k: int = 20,
    ) -> List[Tuple[Node, float, List[Edge]]]:
        """
        Score nodes by exact ID match, token matches on title/summary/tags,
        and boost connected neighbors by depth decay.
        """
        raw_query = keyword_or_id.strip()
        if not raw_query:
            return []

        tokens = [t.lower() for t in raw_query.split() if t.strip()]
        base_scores: Dict[str, float] = {}

        # 1. Base lexical scoring
        for nid, node in self.nodes.items():
            score = 0.0
            if nid == raw_query or nid.lower() == raw_query.lower():
                score += 100.0

            title_lower = node.title.lower()
            summary_lower = node.summary.lower()
            tags_lower = [t.lower() for t in node.tags]

            if len(tokens) > 1 and raw_query.lower() in title_lower:
                score += 18.0
            if len(tokens) > 1 and raw_query.lower() in summary_lower:
                score += 12.0

            for tok in tokens:
                if tok in title_lower:
                    score += 10.0
                if tok in summary_lower:
                    score += 5.0
                for tag in tags_lower:
                    if tok == tag or tok in tag:
                        score += 8.0

            if score > 0.0:
                base_scores[nid] = score

        # 2. Graph proximity boost
        total_scores: Dict[str, float] = dict(base_scores)
        for seed_id, seed_score in base_scores.items():
            visited: Set[str] = {seed_id}
            queue: List[Tuple[str, int]] = [(seed_id, 0)]

            while queue:
                curr_id, depth = queue.pop(0)
                if depth >= max_depth:
                    continue

                next_depth = depth + 1
                decay = 0.5 ** next_depth
                boost = seed_score * decay

                for neighbor in self.adj.get(curr_id, set()):
                    if neighbor not in visited:
                        visited.add(neighbor)
                        total_scores[neighbor] = total_scores.get(neighbor, 0.0) + boost
                        queue.append((neighbor, next_depth))

        # 3. Filter by type if requested
        scored_nodes: List[Tuple[Node, float]] = []
        for nid, final_score in total_scores.items():
            node = self.nodes.get(nid)
            if not node:
                continue
            if filter_type and node.type != filter_type:
                continue
            scored_nodes.append((node, final_score))

        # 4. Sort descending by score
        scored_nodes.sort(key=lambda item: item[1], reverse=True)
        top_items = scored_nodes[:top_k]

        # 5. Attach connected edges
        results: List[Tuple[Node, float, List[Edge]]] = []
        for node, score in top_items:
            connected = [
                e for e in self.edges if e.src == node.id or e.dst == node.id
            ]
            results.append((node, score, connected))

        return results


def calculate_central_nodes(
    nodes: Dict[str, Node],
    edges: List[Edge],
    top_n: int = 10,
) -> List[Tuple[Node, int]]:
    """
    Calculate top central nodes by graph degree and recency.
    Returns list of (Node, degree).
    """
    degrees: Dict[str, int] = {nid: 0 for nid in nodes}
    for e in edges:
        if e.src in degrees:
            degrees[e.src] += 1
        if e.dst in degrees:
            degrees[e.dst] += 1

    active_items = [
        (n, degrees.get(n.id, 0))
        for n in nodes.values()
        if n.status == "active"
    ]
    active_items.sort(key=lambda item: (item[1], item[0].updated), reverse=True)
    return active_items[:top_n]


def generate_file_summary(file_path: Path) -> str:
    """Generate a short source summary from a module docstring or leading comment."""
    try:
        text = file_path.read_text(encoding="utf-8", errors="ignore")
    except OSError as err:
        raise BrainStorageError(f"Could not read source file {file_path}: {err}") from err

    if file_path.suffix.lower() == ".py":
        try:
            docstring = ast.get_docstring(ast.parse(text, filename=str(file_path)), clean=True)
            if docstring:
                return " ".join(docstring.split())[:MAX_SUMMARY_LENGTH]
        except (SyntaxError, ValueError):
            pass

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith(("<!--", "/*", "/**", "*", "//", "#")):
            line = re.sub(r"^(<!--|/\*\*?|//+|#+|\*)\s*", "", line).strip()
        if line and not line.startswith(("import ", "from ", "use ", "require(")):
            return line[:MAX_SUMMARY_LENGTH]
    return ""


def infer_project_description(project_root: Path) -> str:
    """Infer a brief project summary from root files (e.g. README.md)."""
    candidates = ["README.md", "readme.md", "README", "pyproject.toml", "package.json"]
    for c in candidates:
        p = project_root / c
        if p.exists() and p.is_file():
            try:
                with open(p, "r", encoding="utf-8", errors="ignore") as f:
                    lines = [line.strip() for line in f if line.strip()]
                for line in lines:
                    if not line.startswith("#") and not line.startswith("!") and len(line) > 20:
                        return line[:200]
            except OSError:
                pass
    return "Persistent knowledge graph memory for AI coding agents."


def detect_main_modules(project_root: Path, nodes: Dict[str, Node]) -> List[Tuple[str, int]]:
    """Detect top-level directories containing the most indexed file nodes."""
    dir_counts: Dict[str, int] = {}
    for node in nodes.values():
        if node.type == "file" and node.path:
            parts = PurePosixPath(node.path).parts
            if len(parts) > 1:
                top_dir = parts[0]
                dir_counts[top_dir] = dir_counts.get(top_dir, 0) + 1
            else:
                dir_counts["(root)"] = dir_counts.get("(root)", 0) + 1

    sorted_dirs = sorted(dir_counts.items(), key=lambda x: x[1], reverse=True)
    return sorted_dirs[:5]


def generate_index_content(
    project_root: Path,
    config: BrainConfig,
    nodes: Dict[str, Node],
    edges: List[Edge],
) -> str:
    """
    Generate the INDEX.md digest adhering to strict priority rules and
    capping total character count at MAX_INDEX_CHARACTERS (~2000 tokens).

    Priority (cut from bottom if exceeding limit):
    1. Project description
    2. Main modules
    3. Top 10 central nodes by degree + recency
    4. Recent decisions (last 5)
    5. Stale nodes needing re-read
    6. Nodes with needs_summary=True
    7. Open tasks
    """
    now_str = iso_now()

    # Section 1: Project Description
    desc = config.description or infer_project_description(project_root)
    sec1 = [
        "# Project Brain Index",
        f"*Generated: {now_str}*",
        "",
        "## Description",
        desc,
        "",
    ]

    # Section 2: Main Modules
    main_modules = detect_main_modules(project_root, nodes)
    sec2 = ["## Main Modules"]
    if main_modules:
        for mod, count in main_modules:
            sec2.append(f"- **{mod}/** ({count} files)")
    else:
        sec2.append("- (Flat project structure)")
    sec2.append("")

    # Section 3: Central Nodes
    central = calculate_central_nodes(nodes, edges, top_n=10)
    sec3 = ["## Central Nodes"]
    if central:
        for n, deg in central:
            summary_disp = f": {n.summary}" if n.summary else ""
            sec3.append(f"- `{n.id}` ({n.type}, {deg} links){summary_disp}")
    else:
        sec3.append("- No central nodes indexed.")
    sec3.append("")

    # Section 4: Recent Decisions (last 5)
    decisions = [n for n in nodes.values() if n.type == "decision"]
    decisions.sort(key=lambda n: n.created, reverse=True)
    recent_decisions = decisions[:5]
    sec4 = ["## Recent Decisions"]
    if recent_decisions:
        for d in recent_decisions:
            sec4.append(f"- **{d.title}** (`{d.id}`): {d.summary}")
    else:
        sec4.append("- No recorded decisions.")
    sec4.append("")

    # Section 5: Stale Nodes Needing Re-read
    stale_nodes = [n for n in nodes.values() if n.status == "stale"]
    stale_nodes.sort(key=lambda n: n.updated, reverse=True)
    sec5 = ["## Stale Files (Need Re-reading)"]
    if stale_nodes:
        for s in stale_nodes:
            sec5.append(f"- `{s.id}` ({s.path or s.title})")
    else:
        sec5.append("- None. All indexed files are fresh.")
    sec5.append("")

    # Section 6: Nodes with needs_summary=True
    needs_sum = [n for n in nodes.values() if n.needs_summary]
    needs_sum.sort(key=lambda n: n.created, reverse=True)
    sec6 = ["## Nodes Needing Summary"]
    if needs_sum:
        for ns in needs_sum:
            sec6.append(f"- `{ns.id}` ({ns.path or ns.title})")
    else:
        sec6.append("- None. All nodes are summarized.")
    sec6.append("")

    # Section 7: Open Tasks
    tasks = [n for n in nodes.values() if n.type == "task" and n.status == "active"]
    tasks.sort(key=lambda n: n.created, reverse=True)
    sec7 = ["## Open Tasks"]
    if tasks:
        for t in tasks:
            sec7.append(f"- [ ] **{t.title}** (`{t.id}`): {t.summary}")
    else:
        sec7.append("- None.")
    sec7.append("")

    sections: List[List[str]] = [sec1, sec2, sec3, sec4, sec5, sec6, sec7]

    # Combine sections, truncating from bottom if length exceeds MAX_INDEX_CHARACTERS
    while True:
        full_text = "\n".join("\n".join(s) for s in sections)
        if len(full_text) <= MAX_INDEX_CHARACTERS or len(sections) <= 1:
            break

        lowest_sec = sections[-1]
        if len(lowest_sec) > 3:
            lowest_sec.pop(-2)
        else:
            sections.pop()

    if len(full_text) > MAX_INDEX_CHARACTERS:
        full_text = full_text[:MAX_INDEX_CHARACTERS - 20] + "\n\n*(Truncated)*\n"

    return full_text


# ============================================================================
# EMBEDDED INTERACTIVE GRAPH VIEWER (FALLBACK)
# ============================================================================

EMBEDDED_VIEWER_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Project Brain — Knowledge Graph</title>
  <style>
    body { background: #0b0f19; color: #f3f4f6; font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; }
    h1 { color: #38bdf8; font-size: 22px; margin-bottom: 8px; }
    #stats { font-size: 13px; color: #9ca3af; margin-bottom: 16px; }
    .search { width: 100%; max-width: 480px; padding: 8px 12px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #fff; margin-bottom: 20px; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
    .card { background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 14px; }
    .badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-right: 6px; }
    .file { background: #0369a1; } .decision { background: #047857; } .thought { background: #7e22ce; } .task { background: #c2410c; } .bug { background: #b91c1c; } .concept { background: #0f766e; }
    .node-title { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
    .node-id { font-family: monospace; font-size: 12px; color: #9ca3af; word-break: break-all; }
    .summary { font-size: 13px; color: #e2e8f0; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>Project Brain — Knowledge Graph</h1>
  <div id="stats">Loading graph data...</div>
  <input type="text" id="filter" class="search" placeholder="Filter nodes by keyword, ID, or title...">
  <div id="nodes-grid" class="grid"></div>
  <script>
    let allNodes = [];
    fetch('/api/graph').then(r => r.json()).then(data => {
      allNodes = data.nodes || [];
      document.getElementById('stats').textContent = `${allNodes.length} nodes, ${(data.edges||[]).length} edges`;
      render(allNodes);
    });
    function render(nodes) {
      const container = document.getElementById('nodes-grid');
      container.innerHTML = '';
      nodes.forEach(n => {
        const c = document.createElement('div');
        c.className = 'card';
        c.innerHTML = `<span class="badge ${n.type}">${n.type}</span><span class="node-title">${n.title || n.id}</span><div class="node-id">${n.id}</div><div class="summary">${n.summary || '<em>No summary provided.</em>'}</div>`;
        container.appendChild(c);
      });
    }
    document.getElementById('filter').addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = allNodes.filter(n => (n.title||'').toLowerCase().includes(q) || (n.summary||'').toLowerCase().includes(q) || n.id.toLowerCase().includes(q));
      render(filtered);
    });
  </script>
</body>
</html>
"""


# ============================================================================
# HTTP REQUEST HANDLER FOR SERVE
# ============================================================================

class BrainViewerHandler(http.server.BaseHTTPRequestHandler):
    """
    HTTP server request handler for project-brain:
    - GET /: Serves assets/viewer.html or embedded viewer
    - GET /api/graph: Serves JSON nodes and edges (supports ?since=)
    - GET /api/stats: Serves JSON overview statistics
    - Handles CORS for local requests
    """

    storage: BrainStorage
    skill_dir: Path

    def log_message(self, format: str, *args: Any) -> None:
        """Suppress default HTTP access logging for clean terminal output."""
        pass

    def send_cors_headers(self) -> None:
        """Allow browser access only from loopback origins."""
        origin = self.headers.get("Origin")
        if origin:
            parsed_origin = urllib.parse.urlparse(origin)
            if parsed_origin.hostname in ("127.0.0.1", "localhost", "::1"):
                self.send_header("Access-Control-Allow-Origin", origin)
                self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:
        """Handle CORS pre-flight requests."""
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self) -> None:
        """Handle GET requests for static viewer and API endpoints."""
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        if path in ("/", "/index.html"):
            self._handle_root()
        elif path == "/api/graph":
            self._handle_api_graph(query)
        elif path == "/api/stats":
            self._handle_api_stats()
        else:
            self.send_response(404)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not Found"}).encode("utf-8"))

    def _handle_root(self) -> None:
        viewer_path = self.skill_dir / "assets" / "viewer.html"
        html_content = ""
        if viewer_path.exists() and viewer_path.is_file():
            try:
                with open(viewer_path, "r", encoding="utf-8") as f:
                    html_content = f.read()
            except OSError:
                html_content = EMBEDDED_VIEWER_HTML
        else:
            html_content = EMBEDDED_VIEWER_HTML

        data = html_content.encode("utf-8")
        self.send_response(200)
        self.send_cors_headers()
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _handle_api_graph(self, query: Dict[str, List[str]]) -> None:
        nodes_dict = self.storage.read_nodes()
        edges_list = self.storage.read_edges()

        since = query.get("since", [None])[0]
        node_id = query.get("node_id", [None])[0]
        try:
            depth = max(0, int(query.get("depth", ["0"])[0]))
        except (TypeError, ValueError):
            depth = 0
        try:
            offset = max(0, int(query.get("offset", ["0"])[0]))
        except (TypeError, ValueError):
            offset = 0
        try:
            limit = min(1000, max(1, int(query.get("limit", ["100"])[0])))
        except (TypeError, ValueError):
            limit = 100

        if since:
            filtered_nodes = [
                n.to_dict()
                for n in nodes_dict.values()
                if (n.updated >= since or n.created >= since)
            ]
            filtered_edges = [
                e.to_dict()
                for e in edges_list
                if e.created >= since
            ]
        else:
            filtered_nodes = [n.to_dict() for n in nodes_dict.values()]
            filtered_edges = [e.to_dict() for e in edges_list]

        if node_id:
            allowed_ids = {node_id} if node_id in nodes_dict else set()
            frontier = set(allowed_ids)
            for _ in range(depth):
                neighbors: Set[str] = set()
                for edge in edges_list:
                    if edge.src in frontier:
                        neighbors.add(edge.dst)
                    if edge.dst in frontier:
                        neighbors.add(edge.src)
                next_ids = frontier | neighbors
                if next_ids == frontier:
                    break
                frontier = next_ids
                allowed_ids = next_ids
            filtered_nodes = [n for n in filtered_nodes if n["id"] in allowed_ids]
            filtered_edges = [
                e for e in filtered_edges if e["src"] in allowed_ids and e["dst"] in allowed_ids
            ]

        filtered_nodes.sort(key=lambda item: item["id"])
        total = len(filtered_nodes)
        filtered_nodes = filtered_nodes[offset:offset + limit]
        visible_ids = {n["id"] for n in filtered_nodes}
        filtered_edges = [
            e for e in filtered_edges if e["src"] in visible_ids and e["dst"] in visible_ids
        ]

        payload = {
            "edges": filtered_edges,
            "nodes": filtered_nodes,
            "limit": limit,
            "offset": offset,
            "session_id": GLOBAL_SESSION_ID,
            "timestamp": iso_now(),
            "total": total,
        }

        data = json.dumps(payload, sort_keys=True).encode("utf-8")
        self.send_response(200)
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _handle_api_stats(self) -> None:
        nodes = self.storage.read_nodes()
        edges = self.storage.read_edges()

        counts_by_type: Dict[str, int] = {}
        counts_by_status: Dict[str, int] = {}

        for n in nodes.values():
            counts_by_type[n.type] = counts_by_type.get(n.type, 0) + 1
            counts_by_status[n.status] = counts_by_status.get(n.status, 0) + 1

        payload = {
            "counts_by_status": counts_by_status,
            "counts_by_type": counts_by_type,
            "total_edges": len(edges),
            "total_nodes": len(nodes),
        }

        data = json.dumps(payload, indent=2, sort_keys=True).encode("utf-8")
        self.send_response(200)
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


# ============================================================================
# CLI COMMAND IMPLEMENTATIONS
# ============================================================================

def cmd_init(args: argparse.Namespace) -> int:
    """
    CLI: init
    - Create .brain/ directory and config.json if not present.
    - Read assets/agent-block.md from skill dir and inject into AGENTS.md,
      GEMINI.md, and .github/copilot-instructions.md using BRAIN markers.
    - Add .brain/*.lock to .gitignore.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)
    dry_run = bool(getattr(args, "dry_run", False))
    no_injection = bool(getattr(args, "no_instruction_injection", False))
    agent = getattr(args, "agent", "all")

    if not dry_run:
        storage.ensure_brain_dir()

    # 1. Config initialization
    if not dry_run and not storage.config_path.exists():
        storage.save_config(BrainConfig())

    # 2. Touch data files if not present
    if not dry_run and not storage.nodes_path.exists():
        atomic_write_text(storage.nodes_path, "")
    if not dry_run and not storage.edges_path.exists():
        atomic_write_text(storage.edges_path, "")

    # 3. Locate agent instruction block
    skill_dir = find_skill_dir()
    agent_block_path = skill_dir / "assets" / "agent-block.md"
    block_template = DEFAULT_AGENT_BLOCK

    if agent_block_path.exists() and agent_block_path.is_file():
        try:
            with open(agent_block_path, "r", encoding="utf-8") as f:
                block_template = f.read()
        except OSError as err:
            raise BrainStorageError(f"Could not read agent block {agent_block_path}: {err}") from err

    # Compute relative path from project root to brain.py
    brain_script = Path(__file__).resolve()
    try:
        rel_brain = brain_script.relative_to(root).as_posix()
    except ValueError:
        rel_brain = os.path.relpath(brain_script, root).replace("\\", "/")

    injected_block = block_template.replace("{{BRAIN_PATH}}", rel_brain).strip()

    # 4. Inject block into target agent guideline files
    all_targets = [
        ("codex", "AGENTS.md"),
        ("gemini", "GEMINI.md"),
        ("copilot", PurePosixPath(".github/copilot-instructions.md").as_posix()),
    ]
    if no_injection:
        target_rel_files: List[str] = []
    elif agent == "all":
        target_rel_files = [rel for _, rel in all_targets]
    else:
        target_rel_files = [rel for agent_name, rel in all_targets if agent_name == agent]
    injected_files: List[str] = []

    marker_regex = re.compile(
        r"<!--\s*BRAIN:START.*?<!--\s*BRAIN:END\s*-->",
        re.DOTALL | re.IGNORECASE,
    )

    for target_rel in target_rel_files:
        target_path = root / target_rel
        content = ""
        if target_path.exists() and target_path.is_file():
            try:
                with open(target_path, "r", encoding="utf-8") as f:
                    content = f.read()
            except OSError as err:
                raise BrainStorageError(f"Could not read instruction file {target_path}: {err}") from err

        if marker_regex.search(content):
            new_content = marker_regex.sub(injected_block, content)
        else:
            if content.strip():
                new_content = content.rstrip() + "\n\n" + injected_block + "\n"
            else:
                new_content = injected_block + "\n"

        if not dry_run:
            target_path.parent.mkdir(parents=True, exist_ok=True)
            atomic_write_text(target_path, new_content)
        injected_files.append(target_rel)

    # 5. Update .gitignore with .brain/*.lock
    gi_path = root / ".gitignore"
    lock_entry = ".brain/*.lock"
    gi_updated = False

    if gi_path.exists():
        try:
            with open(gi_path, "r", encoding="utf-8") as f:
                gi_content = f.read()
            if lock_entry not in gi_content and "*.lock" not in gi_content:
                if not dry_run:
                    with open(gi_path, "a", encoding="utf-8") as f:
                        f.write(f"\n{lock_entry}\n")
                gi_updated = True
        except OSError as err:
            raise BrainStorageError(f"Could not read {gi_path}: {err}") from err
    else:
        if not dry_run:
            try:
                with open(gi_path, "w", encoding="utf-8") as f:
                    f.write(f"{lock_entry}\n")
            except OSError as err:
                raise BrainStorageError(f"Could not write {gi_path}: {err}") from err
        else:
            gi_updated = True

    res = {
        "brain_dir": storage.brain_dir.as_posix(),
        "dry_run": dry_run,
        "gitignore_updated": gi_updated,
        "injected_files": injected_files,
        "project_root": root.as_posix(),
        "status": "ok",
    }

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        prefix = "Project Brain init dry-run" if dry_run else "Project Brain initialized"
        print(f"{prefix} at: {root}")
        print(f"Data directory: {storage.brain_dir}")
        print(f"Injected instructions into: {', '.join(injected_files)}")
        if gi_updated:
            print("Added '.brain/*.lock' to .gitignore")
    return 0


def cmd_doctor(args: argparse.Namespace) -> int:
    """
    CLI: doctor
    Verify environment health: Python version, .brain/ writability,
    SKILL.md discovery, marker conflicts, and stale lock files.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)
    issues: List[Dict[str, str]] = []
    checks: List[Dict[str, Any]] = []

    # Check 1: Python version >= 3.10
    py_ok = sys.version_info >= (3, 10)
    ver_str = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    checks.append({
        "check": "python_version",
        "detail": f"Python {ver_str}",
        "pass": py_ok,
    })
    if not py_ok:
        issues.append({
            "check": "python_version",
            "message": f"Python version {ver_str} is below required 3.10+.",
        })

    # Check 2: .brain directory existence and writability
    storage.ensure_brain_dir()
    writable = False
    try:
        test_file = storage.brain_dir / f".doctor_test_{secrets.token_hex(4)}"
        test_file.write_text("ok", encoding="utf-8")
        test_file.unlink()
        writable = True
    except OSError:
        writable = False

    checks.append({
        "check": "brain_dir_writable",
        "detail": storage.brain_dir.as_posix(),
        "pass": writable,
    })
    if not writable:
        issues.append({
            "check": "brain_dir_writable",
            "message": f".brain directory is not writable: {storage.brain_dir}",
        })

    # Check 3: Skill directory discovery
    skill_dir = find_skill_dir()
    skill_ok = (skill_dir / "SKILL.md").exists()
    checks.append({
        "check": "skill_dir",
        "detail": skill_dir.as_posix(),
        "pass": skill_ok,
    })
    if not skill_ok:
        issues.append({
            "check": "skill_dir",
            "message": f"SKILL.md not found relative to script at {skill_dir}",
        })

    # Check 4: Marker conflicts in agent docs
    target_rel_files = [
        "AGENTS.md",
        "GEMINI.md",
        PurePosixPath(".github/copilot-instructions.md").as_posix(),
    ]
    for rel_f in target_rel_files:
        fpath = root / rel_f
        if fpath.exists():
            try:
                content = fpath.read_text(encoding="utf-8")
                start_count = len(re.findall(r"<!--\s*BRAIN:START", content, re.IGNORECASE))
                end_count = len(re.findall(r"<!--\s*BRAIN:END", content, re.IGNORECASE))
                if start_count != end_count:
                    issues.append({
                        "check": "marker_mismatch",
                        "message": f"Marker count mismatch in {rel_f}: {start_count} START vs {end_count} END.",
                    })
                if start_count > 1:
                    issues.append({
                        "check": "duplicate_markers",
                        "message": f"Multiple BRAIN marker blocks detected in {rel_f} ({start_count} blocks).",
                    })
            except OSError as err:
                issues.append({
                    "check": "file_read_error",
                    "message": f"Could not read {rel_f}: {err}",
                })

    # Check 5: Stale lock metadata belongs only to a dead process
    now = time.time()
    for lock_path in (storage.nodes_lock_path, storage.edges_lock_path):
        if lock_path.exists():
            try:
                age = now - lock_path.stat().st_mtime
                if lock_owner_is_dead(lock_path):
                    issues.append({
                        "check": "stale_lock",
                        "message": f"Stale lock file detected: {lock_path} (recorded process is dead).",
                    })
                elif not lock_owner_is_dead(lock_path) and age > DEFAULT_STALE_LOCK_AGE:
                    # Legacy lock files without a PID are stale only after 60 seconds.
                    text = lock_path.read_text(encoding="utf-8")
                    if not re.search(r"^pid=(\d+)$", text, re.MULTILINE):
                        issues.append({
                            "check": "stale_lock",
                            "message": f"Stale lock file detected: {lock_path} ({age:.1f}s old).",
                        })
            except OSError as err:
                issues.append({
                    "check": "lock_read_error",
                    "message": f"Could not inspect lock file {lock_path}: {err}",
                })

    # Check 6: JSONL integrity check
    for j_path in (storage.nodes_path, storage.edges_path):
        if j_path.exists():
            try:
                with open(j_path, "r", encoding="utf-8") as f:
                    for i, line in enumerate(f, 1):
                        if line.strip():
                            json.loads(line)
            except Exception as err:
                issues.append({
                    "check": "jsonl_syntax",
                    "message": f"Corrupted JSON in {j_path} at line {i}: {err}",
                })

    is_healthy = len(issues) == 0
    res = {
        "checks": checks,
        "healthy": is_healthy,
        "issues": issues,
        "project_root": root.as_posix(),
    }

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        print("Project Brain Doctor Report")
        print("===========================")
        print(f"Project root: {root}")
        print(f"Status: {'HEALTHY' if is_healthy else 'ISSUES DETECTED'}\n")
        print("Checks:")
        for c in checks:
            mark = "PASS" if c["pass"] else "FAIL"
            print(f"  [{mark}] {c['check']}: {c['detail']}")
        if issues:
            print("\nIssues:")
            for iss in issues:
                print(f"  - [{iss['check']}] {iss['message']}")

    return 0 if is_healthy else 1


def cmd_scan(args: argparse.Namespace) -> int:
    """
    CLI: scan
    Walk project tree respecting .gitignore and config ignore_globs.
    Create/update file nodes, compute SHA-1 digests, and extract language import edges.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)
    storage.ensure_brain_dir()
    config = storage.load_config()

    matcher = GitIgnoreMatcher(root, extra_globs=config.ignore_globs)
    existing_nodes = storage.read_nodes()

    now_str = iso_now()
    scanned_count = 0
    new_nodes_count = 0
    updated_nodes_count = 0

    nodes_to_write: List[Node] = []
    edges_to_write: List[Edge] = []
    file_nodes: Dict[str, Node] = {}

    for file_path in matcher.walk_project_files():
        if is_binary_file(file_path):
            continue

        try:
            rel_path = file_path.relative_to(root).as_posix()
        except ValueError:
            continue

        scanned_count += 1
        node_id = f"file:{rel_path}"
        current_sha1 = compute_file_sha1(file_path)

        existing = existing_nodes.get(node_id)
        if existing is None:
            generated_summary = generate_file_summary(file_path)
            node = Node(
                id=node_id,
                type="file",
                title=file_path.name,
                path=rel_path,
                sha1=current_sha1,
                summary=generated_summary,
                status="active",
                needs_summary=not bool(generated_summary),
                created=now_str,
                updated=now_str,
                session_id=GLOBAL_SESSION_ID,
            )
            new_nodes_count += 1
        else:
            node = Node(
                id=existing.id,
                type="file",
                title=existing.title or file_path.name,
                summary=existing.summary or generate_file_summary(file_path),
                path=rel_path,
                sha1=current_sha1,
                tags=existing.tags,
                status="stale" if existing.sha1 != current_sha1 else existing.status,
                needs_summary=existing.needs_summary if existing.sha1 == current_sha1 else True,
                created=existing.created,
                updated=now_str,
                session_id=GLOBAL_SESSION_ID,
            )
            if existing.sha1 != current_sha1 or existing.status != node.status:
                updated_nodes_count += 1

        nodes_to_write.append(node)
        file_nodes[node_id] = node

        # Extract dependencies
        imported_ids = extract_file_imports(file_path, root, config)
        for target_id in imported_ids:
            edge = Edge(
                src=node_id,
                dst=target_id,
                type="imports",
                weight=1.0,
                created=now_str,
            )
            edges_to_write.append(edge)

    storage.append_nodes(nodes_to_write)
    storage.append_edges(edges_to_write)

    res = {
        "edges_found": len(edges_to_write),
        "new_nodes": new_nodes_count,
        "scanned_files": scanned_count,
        "status": "ok",
        "updated_nodes": updated_nodes_count,
    }

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        print(f"Scan complete: {scanned_count} files indexed.")
        print(f"  New nodes: {new_nodes_count}")
        print(f"  Updated nodes: {updated_nodes_count}")
        print(f"  Import edges found: {len(edges_to_write)}")

    return 0


def cmd_sync(args: argparse.Namespace) -> int:
    """
    CLI: sync
    Compare stored sha1 with filesystem:
    - Changed files: set status='stale', update sha1
    - Deleted files: set status='superseded'
    - New files: create node with needs_summary=True
    Output ONLY the list of files the agent needs to re-read (stale + new).
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)
    config = storage.load_config()
    matcher = GitIgnoreMatcher(root, extra_globs=config.ignore_globs)

    nodes = storage.read_nodes()
    now_str = iso_now()

    stale_files: List[str] = []
    deleted_files: List[str] = []
    new_files: List[str] = []

    updated_nodes: List[Node] = []
    known_paths: Set[str] = set()

    # 1. Check existing file nodes against disk
    for node in nodes.values():
        if node.type != "file" or not node.path:
            continue

        known_paths.add(node.path)
        full_path = root / node.path

        if not full_path.exists() or not full_path.is_file():
            if node.status != "superseded":
                node.status = "superseded"
                node.updated = now_str
                node.session_id = GLOBAL_SESSION_ID
                updated_nodes.append(node)
                deleted_files.append(node.path)
        else:
            current_sha1 = compute_file_sha1(full_path)
            if current_sha1 != node.sha1:
                node.status = "stale"
                node.sha1 = current_sha1
                node.needs_summary = True
                node.updated = now_str
                node.session_id = GLOBAL_SESSION_ID
                updated_nodes.append(node)
                stale_files.append(node.path)

    # 2. Check disk for new files not yet in the graph
    for file_path in matcher.walk_project_files():
        if is_binary_file(file_path):
            continue
        try:
            rel_path = file_path.relative_to(root).as_posix()
        except ValueError:
            continue

        if rel_path not in known_paths:
            node_id = f"file:{rel_path}"
            current_sha1 = compute_file_sha1(file_path)
            new_node = Node(
                id=node_id,
                type="file",
                title=file_path.name,
                path=rel_path,
                sha1=current_sha1,
                status="active",
                needs_summary=True,
                created=now_str,
                updated=now_str,
                session_id=GLOBAL_SESSION_ID,
            )
            updated_nodes.append(new_node)
            new_files.append(rel_path)

    if updated_nodes:
        storage.append_nodes(updated_nodes)

    if args.json:
        res = {
            "deleted": sorted(deleted_files),
            "new": sorted(new_files),
            "stale": sorted(stale_files),
        }
        print(json.dumps(res, indent=2))
    else:
        re_read_files = sorted(stale_files + new_files)
        for f in re_read_files:
            print(f)

    return 0


def _parse_link_argument(raw_link: str) -> Tuple[str, str]:
    """
    Parse a --link string in format 'node_id' or 'node_id:edge_type'.
    Supports node IDs with internal colons (e.g. file:src/app.py:implements).
    """
    raw_link = raw_link.strip()
    if ":" in raw_link:
        prefix, suffix = raw_link.rsplit(":", 1)
        if suffix in VALID_EDGE_TYPES:
            return (prefix, suffix)
    return (raw_link, "relates_to")


def cmd_note(args: argparse.Namespace) -> int:
    """
    CLI: note --type thought|decision|bug|task --title '...' --summary '...' --link <id>[:type] ...
    Create a thought, decision, bug, or task node with validated links.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)

    node_type = args.type.lower()
    if node_type not in ("thought", "decision", "bug", "task"):
        raise BrainValidationError(f"Invalid note type '{args.type}'. Must be thought, decision, bug, or task.")

    links: List[str] = args.link or []
    if node_type in ("thought", "decision") and not links:
        raise BrainValidationError(f"Each '{node_type}' node must have at least one --link target.")

    now_str = iso_now()
    ts_digits = datetime.datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    slug = make_slug(args.title)
    node_id = f"{node_type}:{ts_digits}-{slug}"

    summary_text = (args.summary or "").strip()
    if len(summary_text) > MAX_SUMMARY_LENGTH:
        summary_text = summary_text[:MAX_SUMMARY_LENGTH]

    node = Node(
        id=node_id,
        type=node_type,
        title=args.title.strip(),
        summary=summary_text,
        status="active",
        needs_summary=False,
        created=now_str,
        updated=now_str,
        session_id=GLOBAL_SESSION_ID,
    )

    edges_to_create: List[Edge] = []
    for raw_l in links:
        target_id, edge_type = _parse_link_argument(raw_l)
        edges_to_create.append(
            Edge(
                src=node_id,
                dst=target_id,
                type=edge_type,
                weight=1.0,
                created=now_str,
            )
        )

    storage.append_node(node)
    storage.append_edges(edges_to_create)

    res = {
        "created_edges": [e.to_dict() for e in edges_to_create],
        "node": node.to_dict(),
        "status": "ok",
    }

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        print(f"Created node `{node.id}`: {node.title}")
        for e in edges_to_create:
            print(f"  -> linked to `{e.dst}` via '{e.type}'")

    return 0


def cmd_touch(args: argparse.Namespace) -> int:
    """
    CLI: touch <path> --summary '...' [--link ...]
    Update file node summary, sha1, status='active', needs_summary=False, updated=now.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)

    raw_path = Path(args.path)
    if raw_path.is_absolute():
        try:
            rel_path = raw_path.resolve().relative_to(root.resolve()).as_posix()
            full_path = raw_path
        except ValueError:
            rel_path = raw_path.as_posix()
            full_path = raw_path
    else:
        rel_path = raw_path.as_posix()
        full_path = (root / raw_path).resolve()

    node_id = f"file:{rel_path}"
    now_str = iso_now()
    current_sha1 = compute_file_sha1(full_path) if full_path.exists() else None

    nodes = storage.read_nodes()
    existing = nodes.get(node_id)

    summary_text = (args.summary or "").strip()
    if len(summary_text) > MAX_SUMMARY_LENGTH:
        summary_text = summary_text[:MAX_SUMMARY_LENGTH]

    if existing:
        node = Node(
            id=existing.id,
            type="file",
            title=existing.title or full_path.name,
            summary=summary_text,
            path=rel_path,
            sha1=current_sha1 or existing.sha1,
            tags=existing.tags,
            status="active",
            needs_summary=False,
            created=existing.created,
            updated=now_str,
            session_id=GLOBAL_SESSION_ID,
        )
    else:
        node = Node(
            id=node_id,
            type="file",
            title=full_path.name,
            summary=summary_text,
            path=rel_path,
            sha1=current_sha1,
            status="active",
            needs_summary=False,
            created=now_str,
            updated=now_str,
            session_id=GLOBAL_SESSION_ID,
        )

    edges_to_create: List[Edge] = []
    for raw_l in (args.link or []):
        target_id, edge_type = _parse_link_argument(raw_l)
        edges_to_create.append(
            Edge(
                src=node_id,
                dst=target_id,
                type=edge_type,
                weight=1.0,
                created=now_str,
            )
        )

    storage.append_node(node)
    storage.append_edges(edges_to_create)

    res = {
        "created_edges": [e.to_dict() for e in edges_to_create],
        "node": node.to_dict(),
        "status": "ok",
    }

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        print(f"Updated node `{node.id}`: summary saved.")
        for e in edges_to_create:
            print(f"  -> linked to `{e.dst}` via '{e.type}'")

    return 0


def cmd_link(args: argparse.Namespace) -> int:
    """
    CLI: link <src> <dst> --type <edge_type> [--note '...'] [--weight 0.5]
    Add edge between src and dst. Validates that both nodes exist.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)

    nodes = storage.read_nodes()
    if args.src not in nodes:
        raise BrainValidationError(f"Source node '{args.src}' does not exist in graph.")
    if args.dst not in nodes:
        raise BrainValidationError(f"Destination node '{args.dst}' does not exist in graph.")

    edge_type = args.type.lower()
    if edge_type not in VALID_EDGE_TYPES:
        raise BrainValidationError(f"Invalid edge type '{args.type}'. Must be one of: {sorted(VALID_EDGE_TYPES)}")

    weight = float(args.weight if args.weight is not None else 1.0)
    edge = Edge(
        src=args.src,
        dst=args.dst,
        type=edge_type,
        weight=weight,
        note=args.note or "",
        created=iso_now(),
    )

    storage.append_edge(edge)

    res = {
        "edge": edge.to_dict(),
        "status": "ok",
    }

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        print(f"Linked `{edge.src}` -> `{edge.dst}` [{edge.type}] (weight={edge.weight})")

    return 0


def cmd_unlink(args: argparse.Namespace) -> int:
    """
    CLI: unlink <src> <dst> [--type <edge_type>]
    Remove edge by appending a deletion record.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)

    edge_type = args.type.lower() if args.type else None
    if edge_type and edge_type not in VALID_EDGE_TYPES:
        raise BrainValidationError(f"Invalid edge type '{args.type}'. Must be one of: {sorted(VALID_EDGE_TYPES)}")

    edges = storage.read_edges()
    matching_edges = [
        e for e in edges
        if e.src == args.src and e.dst == args.dst and (edge_type is None or e.type == edge_type)
    ]

    deletion_records: List[Edge] = []
    now_str = iso_now()

    if matching_edges:
        for m in matching_edges:
            del_edge = Edge(
                src=m.src,
                dst=m.dst,
                type=m.type,
                weight=0.0,
                created=now_str,
                deleted=True,
            )
            deletion_records.append(del_edge)
    else:
        target_type = edge_type or "relates_to"
        deletion_records.append(
            Edge(
                src=args.src,
                dst=args.dst,
                type=target_type,
                weight=0.0,
                created=now_str,
                deleted=True,
            )
        )

    storage.append_edges(deletion_records)

    res = {
        "deleted_edges": [e.to_dict() for e in deletion_records],
        "status": "ok",
    }

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        for d in deletion_records:
            print(f"Unlinked `{d.src}` -x-> `{d.dst}` [{d.type}]")

    return 0


def cmd_compact(args: argparse.Namespace) -> int:
    """
    CLI: compact
    Read all records, keep only the latest by id, and rewrite JSONL files atomically.
    Deduplicates edges and purges deleted records.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)
    stats = storage.compact()

    res = {
        "edges_compacted": stats["edges_before"] - stats["edges_after"],
        "nodes_compacted": stats["nodes_before"] - stats["nodes_after"],
        "stats": stats,
        "status": "ok",
    }

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        print("Compaction complete:")
        print(f"  Nodes: {stats['nodes_before']} -> {stats['nodes_after']} ({res['nodes_compacted']} pruned)")
        print(f"  Edges: {stats['edges_before']} -> {stats['edges_after']} ({res['edges_compacted']} pruned)")

    return 0


def cmd_query(args: argparse.Namespace) -> int:
    """
    CLI: query <keyword|id> [--depth N] [--type ...]
    Search nodes by ID or lexical token match, boosted by graph proximity.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)

    nodes = storage.read_nodes()
    edges = storage.read_edges()

    engine = GraphQueryEngine(nodes, edges)
    results = engine.query(
        keyword_or_id=args.query,
        max_depth=int(args.depth or 2),
        filter_type=args.type,
        top_k=20,
    )

    if args.json:
        structured = []
        for node, score, connected in results:
            structured.append({
                "edges": [e.to_dict() for e in connected],
                "node": node.to_dict(),
                "score": round(score, 2),
            })
        print(json.dumps({"query": args.query, "results": structured}, indent=2))
    else:
        if not results:
            print(f"No nodes found matching query '{args.query}'.")
            return 0

        print(f"Query: '{args.query}' (found {len(results)} relevant nodes)")
        print("=" * 60)
        for node, score, connected in results:
            print(f"\n[{score:5.1f}] `{node.id}` ({node.type}, status={node.status})")
            print(f"        Title: {node.title}")
            if node.summary:
                print(f"        Summary: {node.summary}")
            if connected:
                link_strs = []
                for e in connected[:5]:
                    arrow = "->" if e.src == node.id else "<-"
                    other = e.dst if e.src == node.id else e.src
                    link_strs.append(f"{arrow} {e.type}:{other}")
                print(f"        Links: {', '.join(link_strs)}")

    return 0


def cmd_digest(args: argparse.Namespace) -> int:
    """
    CLI: digest
    Generate .brain/INDEX.md adhering to max 8000 characters (~2000 tokens).
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)
    storage.ensure_brain_dir()
    config = storage.load_config()

    nodes = storage.read_nodes()
    edges = storage.read_edges()

    digest_md = generate_index_content(root, config, nodes, edges)
    atomic_write_text(storage.index_path, digest_md)

    res = {
        "character_count": len(digest_md),
        "index_path": storage.index_path.as_posix(),
        "status": "ok",
    }

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        print(f"Generated {storage.index_path} ({len(digest_md)} chars, <= {MAX_INDEX_CHARACTERS} max).")

    return 0


def cmd_lint(args: argparse.Namespace) -> int:
    """
    CLI: lint
    Check for orphan nodes, dangling edges, empty summaries on active nodes,
    duplicate ids, and stale lock files.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)

    nodes = storage.read_nodes()
    edges = storage.read_edges()
    issues: List[Dict[str, Any]] = []

    # 1. Orphan nodes
    connected_ids: Set[str] = set()
    for e in edges:
        connected_ids.add(e.src)
        connected_ids.add(e.dst)

    for nid, node in nodes.items():
        if node.status == "active" and nid not in connected_ids:
            issues.append({
                "id": nid,
                "message": f"Active node `{nid}` has no connected edges.",
                "type": "orphan_node",
            })

    # 2. Dangling edges
    for e in edges:
        if e.src not in nodes:
            issues.append({
                "edge": e.to_dict(),
                "message": f"Edge points from non-existent source node: `{e.src}`",
                "type": "dangling_edge_src",
            })
        if e.dst not in nodes:
            issues.append({
                "edge": e.to_dict(),
                "message": f"Edge points to non-existent destination node: `{e.dst}`",
                "type": "dangling_edge_dst",
            })

    # 3. Empty summaries on active nodes
    for nid, node in nodes.items():
        if node.status == "active" and not (node.summary or "").strip():
            issues.append({
                "id": nid,
                "message": f"Active node `{nid}` has an empty summary.",
                "type": "empty_summary",
            })

    # 4. Duplicate IDs in raw nodes.jsonl
    if storage.nodes_path.exists():
        raw_count = 0
        raw_ids: Set[str] = set()
        duplicates = 0
        try:
            with open(storage.nodes_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        raw_count += 1
                        rec = json.loads(line)
                        rid = rec.get("id")
                        if rid in raw_ids:
                            duplicates += 1
                        else:
                            raw_ids.add(rid)
            if duplicates > 0:
                issues.append({
                    "duplicates": duplicates,
                    "message": f"Found {duplicates} duplicate node records in nodes.jsonl. Run `brain compact`.",
                    "type": "uncompacted_nodes",
                })
        except Exception:
            pass

    # 5. Stale lock metadata for dead owners
    now = time.time()
    for lp in (storage.nodes_lock_path, storage.edges_lock_path):
        if lp.exists():
            try:
                age = now - lp.stat().st_mtime
                if lock_owner_is_dead(lp):
                    issues.append({
                        "age_seconds": round(age, 1),
                        "message": f"Stale lock file detected: {lp} (recorded process is dead).",
                        "path": str(lp),
                        "type": "stale_lock",
                    })
                else:
                    text = lp.read_text(encoding="utf-8")
                    if not re.search(r"^pid=(\d+)$", text, re.MULTILINE) and age > DEFAULT_STALE_LOCK_AGE:
                        issues.append({
                            "age_seconds": round(age, 1),
                            "message": f"Stale lock file detected: {lp} ({age:.1f}s old).",
                            "path": str(lp),
                            "type": "stale_lock",
                        })
            except OSError as err:
                issues.append({
                    "message": f"Could not inspect lock file {lp}: {err}",
                    "path": str(lp),
                    "type": "lock_read_error",
                })

    clean = len(issues) == 0
    res = {
        "clean": clean,
        "issue_count": len(issues),
        "issues": issues,
    }

    if args.json:
        print(json.dumps(res, indent=2))
    else:
        print("Project Brain Lint Report")
        print("=========================")
        if clean:
            print("All checks passed. Brain is clean and healthy.")
        else:
            print(f"Found {len(issues)} issue(s):")
            for iss in issues:
                print(f"  - [{iss['type']}] {iss['message']}")

    return 0 if clean else 1


def cmd_serve(args: argparse.Namespace) -> int:
    """
    CLI: serve [--port 8765]
    Start local HTTP server bound to 127.0.0.1 ONLY serving the graph viewer
    and /api/graph endpoint.
    """
    root = find_project_root(args.root)
    storage = BrainStorage(root)
    skill_dir = find_skill_dir()

    port = int(args.port or DEFAULT_PORT)
    server_address = ("127.0.0.1", port)

    BrainViewerHandler.storage = storage
    BrainViewerHandler.skill_dir = skill_dir

    try:
        httpd = http.server.HTTPServer(server_address, BrainViewerHandler)
    except OSError as err:
        sys.stderr.write(f"Failed to bind to 127.0.0.1:{port}: {err}\n")
        return 1

    url = f"http://127.0.0.1:{port}/"
    if args.json:
        print(json.dumps({"port": port, "status": "running", "url": url}))
    else:
        print(f"Project Brain viewer running at {url}")
        print("Press Ctrl+C to terminate.")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        if not args.json:
            print("\nShutting down Project Brain viewer.")
    finally:
        httpd.server_close()

    return 0


# ============================================================================
# ARGUMENT PARSER SETUP & MAIN ENTRYPOINT
# ============================================================================

def _normalize_argv(argv: List[str]) -> List[str]:
    """Move ``--json`` and ``--root <val>`` that appear after the subcommand
    to the front so the main parser sees them.

    This lets users write ``brain scan --json`` or ``brain --json scan``
    interchangeably.
    """
    # Known subcommands (positional, no leading dash)
    subcmds = {
        "init", "doctor", "scan", "sync", "note", "touch",
        "link", "unlink", "compact", "query", "digest", "lint", "serve",
    }
    global_flags: List[str] = []
    rest: List[str] = []
    i = 0
    while i < len(argv):
        arg = argv[i]
        if arg == "--json":
            global_flags.append(arg)
            i += 1
        elif arg == "--root" and i + 1 < len(argv):
            global_flags.extend([arg, argv[i + 1]])
            i += 2
        elif arg.startswith("--root="):
            global_flags.append(arg)
            i += 1
        else:
            rest.append(arg)
            i += 1
    return global_flags + rest


def build_cli_parser() -> argparse.ArgumentParser:
    """Configure the command-line interface arguments and subcommands.

    ``--json`` and ``--root`` are accepted both before and after the subcommand
    because ``main()`` normalises ``sys.argv`` before parsing.
    """
    parser = argparse.ArgumentParser(
        prog="brain",
        description="project-brain: Persistent Graph Memory for AI Coding Agents",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )

    parser.add_argument("--root", type=str, default=None, help="Explicit project root directory")
    parser.add_argument("--json", action="store_true", default=False, help="Output JSON for machine consumption")
    parser.add_argument("--version", action="version", version=f"project-brain {VERSION}")

    subparsers = parser.add_subparsers(dest="command", title="commands", description="Available brain commands")

    # init
    p_init = subparsers.add_parser("init", help="Initialize .brain/ and inject instructions into agent docs")
    p_init.add_argument("--dry-run", action="store_true", help="Preview initialization without writing files")
    p_init.add_argument("--no-instruction-injection", action="store_true", help="Initialize data without modifying agent instruction files")
    p_init.add_argument("--agent", choices=["all", "codex", "gemini", "copilot"], default="all", help="Limit instruction injection to one agent")

    # doctor
    subparsers.add_parser("doctor", help="Verify environment health, paths, writability, and locks")

    # scan
    subparsers.add_parser("scan", help="Scan project files, index nodes, and extract import dependencies")

    # sync
    subparsers.add_parser("sync", help="Check filesystem state against graph; print stale and new files")

    # note
    p_note = subparsers.add_parser("note", help="Record a thought, decision, bug, or task node with links")
    p_note.add_argument("--type", required=True, choices=["thought", "decision", "bug", "task"], help="Item type")
    p_note.add_argument("--title", required=True, type=str, help="Item title")
    p_note.add_argument("--summary", required=True, type=str, help="Short summary description (<= 280 chars)")
    p_note.add_argument("--link", action="append", default=[], help="Target node: <node_id> or <node_id>:<edge_type>")

    # touch
    p_touch = subparsers.add_parser("touch", help="Update or create a file node's summary and mark active")
    p_touch.add_argument("path", type=str, help="Relative or absolute path of file to update")
    p_touch.add_argument("--summary", required=True, type=str, help="1-2 sentence summary of file role (<= 280 chars)")
    p_touch.add_argument("--link", action="append", default=[], help="Target node: <node_id> or <node_id>:<edge_type>")

    # link
    p_link = subparsers.add_parser("link", help="Create a directed relationship between two nodes")
    p_link.add_argument("src", type=str, help="Source node ID")
    p_link.add_argument("dst", type=str, help="Destination node ID")
    p_link.add_argument("--type", required=True, choices=sorted(VALID_EDGE_TYPES), help="Relationship edge type")
    p_link.add_argument("--note", type=str, default="", help="Optional context note")
    p_link.add_argument("--weight", type=float, default=1.0, help="Relationship weight in range [0.0, 1.0]")

    # unlink
    p_unlink = subparsers.add_parser("unlink", help="Remove a directed relationship between two nodes")
    p_unlink.add_argument("src", type=str, help="Source node ID")
    p_unlink.add_argument("dst", type=str, help="Destination node ID")
    p_unlink.add_argument("--type", choices=sorted(VALID_EDGE_TYPES), default=None, help="Optional edge type")

    # compact
    subparsers.add_parser("compact", help="Merge JSONL files, purge deleted edges, and deduplicate nodes")

    # query
    p_query = subparsers.add_parser("query", help="Search graph nodes by keyword or ID with graph proximity boost")
    p_query.add_argument("query", type=str, help="Search keywords or exact node ID")
    p_query.add_argument("--depth", type=int, default=2, help="Maximum graph exploration depth for proximity boost")
    p_query.add_argument("--type", type=str, default=None, choices=sorted(VALID_NODE_TYPES), help="Filter by node type")

    # digest
    subparsers.add_parser("digest", help="Generate .brain/INDEX.md digest summary (<= 2000 tokens)")

    # lint
    subparsers.add_parser("lint", help="Verify graph integrity (orphans, dangling edges, empty summaries)")

    # serve
    p_serve = subparsers.add_parser("serve", help="Start local interactive browser viewer at http://127.0.0.1:8765")
    p_serve.add_argument("--port", type=int, default=DEFAULT_PORT, help="Local port to bind to")

    return parser


def main() -> int:
    """Main CLI entrypoint."""
    parser = build_cli_parser()
    args = parser.parse_args(_normalize_argv(sys.argv[1:]))

    if not args.command:
        parser.print_help()
        return 0

    command_handlers: Dict[str, Callable[[argparse.Namespace], int]] = {
        "compact": cmd_compact,
        "digest": cmd_digest,
        "doctor": cmd_doctor,
        "init": cmd_init,
        "link": cmd_link,
        "lint": cmd_lint,
        "note": cmd_note,
        "query": cmd_query,
        "scan": cmd_scan,
        "serve": cmd_serve,
        "sync": cmd_sync,
        "touch": cmd_touch,
        "unlink": cmd_unlink,
    }

    handler = command_handlers.get(args.command)
    if not handler:
        sys.stderr.write(f"Unknown command: {args.command}\n")
        return 1

    try:
        return handler(args)
    except BrainError as err:
        if args.json:
            print(json.dumps({"error": str(err), "status": "error"}))
        else:
            sys.stderr.write(f"Error [{args.command}]: {err}\n")
        return 1
    except Exception as err:
        if args.json:
            print(json.dumps({"error": f"Internal error: {err}", "status": "error"}))
        else:
            sys.stderr.write(f"Unexpected error [{args.command}]: {err}\n")
        return 1


if __name__ == "__main__":
    sys.exit(main())
