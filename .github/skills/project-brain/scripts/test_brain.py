#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive unittest test suite for project-brain brain.py
============================================================

Covers:
1. Import Parsers (Python, JS/TS, HTML, PHP, and dispatcher)
2. Sync (stale, deleted, new, empty reports)
3. Atomic Writes & File Locking (timeout, stale locks, concurrent writes)
4. Digest (generation, sections, token/char limits, 500+ nodes)
5. Init (structure, idempotence, marker injection, AGENTS.md preservation)
6. Query (exact ID match, lexical scoring, proximity boost, filters, depth)
7. Root Detection (current, parent, grandparent, override, errors, fallback)
8. Integration: 30-file multi-language project lifecycle
9. Note / Touch / Link / Unlink (creation, updates, schema validation)
10. Doctor (diagnostics, healthy checks, marker errors, stale locks)
11. Compact (node/edge deduplication, deletion purging, integrity)
12. Lint (orphan nodes, dangling edges, empty summaries, clean graph)

Constraints:
- Python 3.10+ stdlib only
- Cross-platform: Windows, Linux, macOS
- No placeholders or TODOs
"""

from __future__ import annotations

import argparse
import ast
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import threading
import time
from typing import Any, Dict, List, Optional
import unittest

# Resolve path to brain.py
BRAIN_PY = Path(__file__).resolve().parent / "brain.py"
sys.path.insert(0, str(BRAIN_PY.parent))
import brain

# Executable for CLI subprocess invocations
PYTHON_EXE = sys.executable or "python"

# Base temporary directory on the same filesystem mount as brain.py.
# This prevents cross-drive mount issues on Windows (e.g. workspace on D: and system temp on C:).
TEST_TMP_BASE = BRAIN_PY.parent.parent / ".test_tmp"
TEST_TMP_BASE.mkdir(parents=True, exist_ok=True)


def run_brain_cli(*args: str, cwd: Optional[Path] = None) -> subprocess.CompletedProcess[str]:
    """
    Invoke brain.py CLI via subprocess.
    In brain.py, --json and --root are top-level global parser flags.
    Any global flags in args are lifted to precede the subcommand for robust CLI invocation.
    """
    global_flags: List[str] = []
    subcmd_args: List[str] = []
    i = 0
    args_list = list(args)
    while i < len(args_list):
        arg = args_list[i]
        if arg == "--json":
            global_flags.append(arg)
            i += 1
        elif arg == "--root":
            global_flags.extend([arg, args_list[i + 1]])
            i += 2
        elif arg.startswith("--root="):
            global_flags.append(arg)
            i += 1
        else:
            subcmd_args.append(arg)
            i += 1

    cmd = [PYTHON_EXE, str(BRAIN_PY), *global_flags, *subcmd_args]
    return subprocess.run(
        cmd,
        cwd=str(cwd) if cwd else None,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )


class BaseBrainTestCase(unittest.TestCase):
    """Base test case providing a temporary git-initialized project directory."""

    def setUp(self) -> None:
        self.temp_dir_obj = tempfile.TemporaryDirectory(dir=TEST_TMP_BASE)
        self.project_root = Path(self.temp_dir_obj.name).resolve()
        # Initialize dummy .git directory for root detection
        (self.project_root / ".git").mkdir(parents=True, exist_ok=True)
        self.storage = brain.BrainStorage(self.project_root)
        self.old_cwd = os.getcwd()
        os.chdir(self.project_root)

    def tearDown(self) -> None:
        os.chdir(self.old_cwd)
        try:
            self.temp_dir_obj.cleanup()
        except OSError:
            pass

    def create_file(self, rel_path: str, content: str = "") -> Path:
        """Helper to create a text file within the project root."""
        full_path = self.project_root / rel_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content, encoding="utf-8", newline="\n")
        return full_path

    def run_cli(self, *args: str) -> subprocess.CompletedProcess[str]:
        """Invoke CLI inside current project root."""
        return run_brain_cli(*args, cwd=self.project_root)


# ============================================================================
# 1. IMPORT PARSER TESTS (4 LANGUAGES + DISPATCHER)
# ============================================================================

class TestImportParsers(BaseBrainTestCase):
    """Unit tests for Python, JS/TS, HTML, and PHP import extraction."""

    # --- Python Parser ---

    def test_python_stdlib_imports_not_resolved(self) -> None:
        source_file = self.create_file(
            "app.py",
            "import os\n"
            "import sys\n"
            "from pathlib import Path\n"
            "from math import sqrt\n"
        )
        imports = brain.PythonImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, [], "Standard library imports should not resolve to project files.")

    def test_python_project_module_import(self) -> None:
        self.create_file("utils.py", "def add(a, b): return a + b\n")
        source_file = self.create_file("app.py", "import utils\n")
        imports = brain.PythonImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, ["file:utils.py"])

    def test_python_relative_sibling_import(self) -> None:
        self.create_file("pkg/sibling.py", "X = 42\n")
        source_file = self.create_file("pkg/main.py", "from . import sibling\n")
        imports = brain.PythonImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, ["file:pkg/sibling.py"])

    def test_python_relative_parent_import(self) -> None:
        self.create_file("pkg/parent.py", "def parent_func(): pass\n")
        source_file = self.create_file("pkg/sub/child.py", "from ..parent import parent_func\n")
        imports = brain.PythonImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, ["file:pkg/parent.py"])

    def test_python_multiline_import(self) -> None:
        self.create_file("models.py", "class User: pass\nclass Order: pass\n")
        source_file = self.create_file(
            "service.py",
            "from models import (\n"
            "    User,\n"
            "    Order,\n"
            ")\n"
        )
        imports = brain.PythonImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, ["file:models.py"])

    def test_python_comments_and_strings_ignored(self) -> None:
        self.create_file("fake.py", "# dummy\n")
        source_file = self.create_file(
            "edge.py",
            "# import fake\n"
            "doc = 'from fake import thing'\n"
            "query = '''import fake'''\n"
        )
        imports = brain.PythonImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, [])

    def test_python_syntax_error_handled_gracefully(self) -> None:
        source_file = self.create_file("broken.py", "def invalid syntax @#$ 123:\n")
        imports = brain.PythonImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, [])

    def test_python_self_import_discarded(self) -> None:
        source_file = self.create_file("loop.py", "import loop\n")
        imports = brain.PythonImportExtractor.extract(source_file, self.project_root)
        self.assertNotIn("file:loop.py", imports)

    # --- JavaScript / TypeScript Parser ---

    def test_jsts_static_and_type_imports(self) -> None:
        self.create_file("module.js", "export const x = 1;\n")
        self.create_file("types.ts", "export interface T {}\n")
        source_file = self.create_file(
            "index.ts",
            "import x from './module';\n"
            "import type { T } from './types';\n"
        )
        imports = brain.JsTsImportExtractor.extract(source_file, self.project_root)
        self.assertIn("file:module.js", imports)
        self.assertIn("file:types.ts", imports)

    def test_jsts_require_and_dynamic_imports(self) -> None:
        self.create_file("module.js", "module.exports = { val: 1 };\n")
        self.create_file("dynamic.js", "export default 42;\n")
        source_file = self.create_file(
            "loader.js",
            "const x = require('./module');\n"
            "const p = import('./dynamic');\n"
        )
        imports = brain.JsTsImportExtractor.extract(source_file, self.project_root)
        self.assertIn("file:module.js", imports)
        self.assertIn("file:dynamic.js", imports)

    def test_jsts_export_from(self) -> None:
        self.create_file("sub.js", "export const foo = 100;\n")
        source_file = self.create_file("reexport.js", "export { foo } from './sub';\n")
        imports = brain.JsTsImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, ["file:sub.js"])

    def test_jsts_index_resolution(self) -> None:
        self.create_file("components/index.tsx", "export const Button = () => null;\n")
        source_file = self.create_file("App.tsx", "import { Button } from './components';\n")
        imports = brain.JsTsImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, ["file:components/index.tsx"])

    def test_jsts_alias_resolution(self) -> None:
        self.create_file("src/utils/math.ts", "export const pi = 3.14;\n")
        source_file = self.create_file("src/main.ts", "import { pi } from '@/utils/math';\n")
        imports = brain.JsTsImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, ["file:src/utils/math.ts"])

    def test_jsts_external_packages_ignored(self) -> None:
        source_file = self.create_file("vendor.ts", "import React from 'react';\nimport _ from 'lodash';\n")
        imports = brain.JsTsImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, [])

    def test_jsts_multiline_import(self) -> None:
        self.create_file("service.ts", "export const a = 1; export const b = 2;\n")
        source_file = self.create_file(
            "client.ts",
            "import {\n"
            "    a,\n"
            "    b\n"
            "} from './service';\n"
        )
        imports = brain.JsTsImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, ["file:service.ts"])

    # --- HTML Parser ---

    def test_html_script_and_link_imports(self) -> None:
        self.create_file("app.js", "console.log('app');\n")
        self.create_file("mod.js", "console.log('mod');\n")
        self.create_file("style.css", "body { margin: 0; }\n")
        source_file = self.create_file(
            "index.html",
            "<!DOCTYPE html>\n"
            "<html>\n"
            "<head>\n"
            "  <link rel=\"stylesheet\" href=\"style.css\">\n"
            "</head>\n"
            "<body>\n"
            "  <script src=\"app.js\"></script>\n"
            "  <script type=\"module\" src=\"mod.js\"></script>\n"
            "</body>\n"
            "</html>\n"
        )
        imports = brain.HtmlImportExtractor.extract(source_file, self.project_root)
        self.assertIn("file:app.js", imports)
        self.assertIn("file:mod.js", imports)
        self.assertIn("file:style.css", imports)

    def test_html_external_and_query_strings(self) -> None:
        self.create_file("bundle.js", "/* bundle */\n")
        source_file = self.create_file(
            "page.html",
            "<script src=\"https://cdn.example.com/lib.js\"></script>\n"
            "<link rel=\"stylesheet\" href=\"//fonts.googleapis.com/css\">\n"
            "<script src=\"bundle.js?v=1.2.3#main\"></script>\n"
        )
        imports = brain.HtmlImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, ["file:bundle.js"])

    def test_html_root_relative_path(self) -> None:
        self.create_file("assets/logo.png", "")
        self.create_file("static/site.css", "h1 { color: red; }\n")
        source_file = self.create_file(
            "views/sub.html",
            "<link rel=\"stylesheet\" href=\"/static/site.css\">\n"
        )
        imports = brain.HtmlImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, ["file:static/site.css"])

    # --- PHP Parser ---

    def test_php_includes_and_requires(self) -> None:
        self.create_file("file.php", "<?php $a = 1;\n")
        self.create_file("lib.php", "<?php $b = 2;\n")
        self.create_file("helper.php", "<?php $c = 3;\n")
        self.create_file("config.php", "<?php $d = 4;\n")
        source_file = self.create_file(
            "index.php",
            "<?php\n"
            "include 'file.php';\n"
            "require_once 'lib.php';\n"
            "include_once('helper.php');\n"
            "require(\"config.php\");\n"
        )
        imports = brain.PhpImportExtractor.extract(source_file, self.project_root)
        self.assertIn("file:file.php", imports)
        self.assertIn("file:lib.php", imports)
        self.assertIn("file:helper.php", imports)
        self.assertIn("file:config.php", imports)

    def test_php_missing_files_ignored(self) -> None:
        source_file = self.create_file(
            "test.php",
            "<?php require 'nonexistent_lib.php';\n"
        )
        imports = brain.PhpImportExtractor.extract(source_file, self.project_root)
        self.assertEqual(imports, [])

    # --- Extractor Dispatcher & Config ---

    def test_extract_file_imports_dispatcher(self) -> None:
        self.create_file("dep.py", "x = 1\n")
        py_file = self.create_file("main.py", "import dep\n")
        txt_file = self.create_file("doc.txt", "import dep\n")

        config = brain.BrainConfig()
        py_imports = brain.extract_file_imports(py_file, self.project_root, config)
        self.assertEqual(py_imports, ["file:dep.py"])

        txt_imports = brain.extract_file_imports(txt_file, self.project_root, config)
        self.assertEqual(txt_imports, [])

        # Disabled language in config
        config.languages["py"] = False
        py_disabled = brain.extract_file_imports(py_file, self.project_root, config)
        self.assertEqual(py_disabled, [])


# ============================================================================
# 2. SYNC TESTS
# ============================================================================

class TestSync(BaseBrainTestCase):
    """Tests for filesystem state change detection via sync."""

    def test_sync_lifecycle(self) -> None:
        file_a = self.create_file("src/a.py", "print('hello a')\n")
        file_b = self.create_file("src/b.py", "print('hello b')\n")

        # Initial scan
        res_scan = self.run_cli("scan", "--json")
        self.assertEqual(res_scan.returncode, 0)

        # Baseline sync: nothing changed
        res_sync0 = self.run_cli("sync", "--json")
        self.assertEqual(res_sync0.returncode, 0)
        data0 = json.loads(res_sync0.stdout)
        self.assertEqual(data0["stale"], [])
        self.assertEqual(data0["deleted"], [])
        self.assertEqual(data0["new"], [])

        # 1. Modify file_a
        time.sleep(0.05)
        file_a.write_text("print('modified a')\n", encoding="utf-8")
        res_sync1 = self.run_cli("sync", "--json")
        self.assertEqual(res_sync1.returncode, 0)
        data1 = json.loads(res_sync1.stdout)
        self.assertEqual(data1["stale"], ["src/a.py"])
        self.assertEqual(data1["deleted"], [])
        self.assertEqual(data1["new"], [])

        # Verify node status updated to stale in storage
        nodes = self.storage.read_nodes()
        self.assertEqual(nodes["file:src/a.py"].status, "stale")

        # 2. Delete file_b
        file_b.unlink()
        res_sync2 = self.run_cli("sync", "--json")
        self.assertEqual(res_sync2.returncode, 0)
        data2 = json.loads(res_sync2.stdout)
        self.assertIn("src/b.py", data2["deleted"])

        nodes = self.storage.read_nodes()
        self.assertEqual(nodes["file:src/b.py"].status, "superseded")

        # 3. Add new file_c
        self.create_file("src/c.py", "print('new c')\n")
        res_sync3 = self.run_cli("sync", "--json")
        self.assertEqual(res_sync3.returncode, 0)
        data3 = json.loads(res_sync3.stdout)
        self.assertIn("src/c.py", data3["new"])

        nodes = self.storage.read_nodes()
        self.assertTrue(nodes["file:src/c.py"].needs_summary)

    def test_sync_plain_text_output(self) -> None:
        self.create_file("app.py", "x = 1\n")
        self.run_cli("scan")
        self.create_file("extra.py", "y = 2\n")

        # Plain text output should list newly added file line by line
        res = self.run_cli("sync")
        self.assertEqual(res.returncode, 0)
        lines = [ln.strip() for ln in res.stdout.strip().splitlines() if ln.strip()]
        self.assertIn("extra.py", lines)


# ============================================================================
# 3. ATOMIC WRITE + LOCK TESTS
# ============================================================================

class TestAtomicWriteAndLock(BaseBrainTestCase):
    """Tests for atomic file writing, platform locking, timeouts, and concurrency."""

    def test_atomic_write_text_replaces_atomically(self) -> None:
        target = self.project_root / "test.txt"
        brain.atomic_write_text(target, "first version\n")
        self.assertEqual(target.read_text(encoding="utf-8"), "first version\n")

        # Overwrite with atomic replacement
        brain.atomic_write_text(target, "second version\n")
        self.assertEqual(target.read_text(encoding="utf-8"), "second version\n")

        # Verify no temporary files remain
        tmp_files = list(self.project_root.glob(".test.txt.tmp.*"))
        self.assertEqual(tmp_files, [])

    def test_atomic_write_jsonl(self) -> None:
        target = self.project_root / "data.jsonl"
        records = [
            {"b": 2, "a": 1},
            {"z": 26, "m": 13},
        ]
        brain.atomic_write_jsonl(target, records)
        lines = target.read_text(encoding="utf-8").strip().splitlines()
        self.assertEqual(len(lines), 2)
        # Verify JSON keys are sorted for stable diffs
        self.assertTrue(lines[0].startswith('{"a": 1, "b": 2}'))

    def test_file_lock_lifecycle(self) -> None:
        lock_file = self.project_root / ".test.lock"
        fl = brain.FileLock(lock_file, timeout=1.0)
        fl.acquire()
        self.assertTrue(lock_file.exists())
        fl.release()
        self.assertTrue(lock_file.exists())

    def test_file_lock_timeout(self) -> None:
        lock_file = self.project_root / ".timeout.lock"
        fl1 = brain.FileLock(lock_file, timeout=1.0)
        fl1.acquire()

        fl2 = brain.FileLock(lock_file, timeout=0.15)
        try:
            with self.assertRaises(brain.BrainLockTimeoutError):
                fl2.acquire()
        finally:
            fl1.release()

    def test_stale_lock_detection(self) -> None:
        lock_file = self.project_root / ".stale.lock"
        lock_file.write_text("pid=9999\ntime=past\n", encoding="utf-8")
        # Set mtime to 120 seconds in the past
        past_time = time.time() - 120.0
        os.utime(lock_file, (past_time, past_time))

        fl = brain.FileLock(lock_file, timeout=1.0, stale_age=60.0)
        # Old lock metadata must never be unlinked before OS lock acquisition.
        fl.acquire()
        fl.release()
        self.assertTrue(lock_file.exists())

    def test_concurrent_writes_threads(self) -> None:
        """Simulate two simultaneous threads writing nodes to storage without data loss."""
        errors: List[Exception] = []

        def worker(thread_idx: int) -> None:
            try:
                for item_idx in range(5):
                    nid = f"concept:t{thread_idx}_item{item_idx}"
                    node = brain.Node(
                        id=nid,
                        type="concept",
                        title=f"Node {thread_idx}-{item_idx}",
                        summary=f"Summary for {nid}",
                    )
                    self.storage.append_node(node)
            except Exception as err:
                errors.append(err)

        threads = [threading.Thread(target=worker, args=(1,)), threading.Thread(target=worker, args=(2,))]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        self.assertEqual(errors, [])
        nodes = self.storage.read_nodes()
        self.assertEqual(len(nodes), 10, "Both simultaneous writes must succeed without data loss.")


# ============================================================================
# 4. DIGEST TESTS
# ============================================================================

class TestDigest(BaseBrainTestCase):
    """Tests for INDEX.md generation, section rendering, and 8000 char capping."""

    def test_digest_generates_index_file(self) -> None:
        self.run_cli("init")
        node = brain.Node(
            id="file:src/main.py",
            type="file",
            title="main.py",
            path="src/main.py",
            summary="Application entrypoint",
            status="active",
        )
        self.storage.append_node(node)

        res = self.run_cli("digest", "--json")
        self.assertEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertEqual(data["status"], "ok")
        self.assertTrue(self.storage.index_path.exists())

    def test_digest_contains_expected_sections(self) -> None:
        self.run_cli("init")
        # Add diverse nodes
        n_file = brain.Node(id="file:app.py", type="file", title="app.py", path="app.py", summary="Core app")
        n_dec = brain.Node(id="decision:20261119-auth", type="decision", title="Use JWT", summary="Stateless auth")
        n_task = brain.Node(id="task:20261119-clean", type="task", title="Cleanup code", summary="Refactor", status="active")
        n_stale = brain.Node(id="file:stale.py", type="file", title="stale.py", path="stale.py", status="stale")
        n_sum = brain.Node(id="file:needs.py", type="file", title="needs.py", path="needs.py", needs_summary=True)

        self.storage.append_nodes([n_file, n_dec, n_task, n_stale, n_sum])
        edge = brain.Edge(src=n_file.id, dst=n_dec.id, type="implements")
        self.storage.append_edge(edge)

        self.run_cli("digest")
        content = self.storage.index_path.read_text(encoding="utf-8")

        self.assertIn("# Project Brain Index", content)
        self.assertIn("## Description", content)
        self.assertIn("## Main Modules", content)
        self.assertIn("## Central Nodes", content)
        self.assertIn("## Recent Decisions", content)
        self.assertIn("## Stale Files (Need Re-reading)", content)
        self.assertIn("## Nodes Needing Summary", content)
        self.assertIn("## Open Tasks", content)

    def test_digest_stay_within_limit_with_500_nodes(self) -> None:
        nodes: Dict[str, brain.Node] = {}
        for i in range(500):
            nid = f"file:module_{i:03d}.py"
            nodes[nid] = brain.Node(
                id=nid,
                type="file",
                title=f"module_{i:03d}.py",
                path=f"module_{i:03d}.py",
                summary=f"Detailed summary for module {i} explaining role and dependencies.",
                needs_summary=True,
                status="active",
            )

        config = brain.BrainConfig()
        content = brain.generate_index_content(self.project_root, config, nodes, [])
        self.assertLessEqual(
            len(content),
            brain.MAX_INDEX_CHARACTERS,
            f"Digest length ({len(content)}) exceeded limit {brain.MAX_INDEX_CHARACTERS}",
        )


# ============================================================================
# 5. INIT TESTS
# ============================================================================

class TestInit(BaseBrainTestCase):
    """Tests for brain init, idempotence, marker injection, and gitignore."""

    def test_init_creates_structure(self) -> None:
        res = self.run_cli("init", "--json")
        self.assertEqual(res.returncode, 0)
        self.assertTrue((self.project_root / ".brain").is_dir())
        self.assertTrue((self.project_root / ".brain" / "config.json").is_file())
        self.assertTrue((self.project_root / ".brain" / "nodes.jsonl").is_file())
        self.assertTrue((self.project_root / ".brain" / "edges.jsonl").is_file())

    def test_init_is_idempotent(self) -> None:
        res1 = self.run_cli("init")
        self.assertEqual(res1.returncode, 0)
        res2 = self.run_cli("init")
        self.assertEqual(res2.returncode, 0)

        # Ensure .gitignore has only one lock entry
        gi = (self.project_root / ".gitignore").read_text(encoding="utf-8")
        self.assertEqual(gi.count(".brain/*.lock"), 1)

    def test_init_dry_run_makes_no_changes(self) -> None:
        res = self.run_cli("init", "--dry-run", "--json")
        self.assertEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertTrue(data["dry_run"])
        self.assertFalse((self.project_root / ".brain").exists())
        self.assertFalse((self.project_root / "AGENTS.md").exists())

    def test_init_can_skip_instruction_injection(self) -> None:
        res = self.run_cli("init", "--no-instruction-injection", "--json")
        self.assertEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertEqual(data["injected_files"], [])
        self.assertTrue((self.project_root / ".brain").is_dir())
        self.assertFalse((self.project_root / "AGENTS.md").exists())

    def test_init_preserves_existing_agents_md(self) -> None:
        header_text = "# Custom Organization Rules\n\n- Rule 1: Always write tests\n- Rule 2: Keep it DRY\n"
        self.create_file("AGENTS.md", header_text)

        res = self.run_cli("init")
        self.assertEqual(res.returncode, 0)

        content = (self.project_root / "AGENTS.md").read_text(encoding="utf-8")
        self.assertTrue(content.startswith("# Custom Organization Rules"))
        self.assertIn("Rule 1: Always write tests", content)
        self.assertIn("<!-- BRAIN:START", content)
        self.assertIn("<!-- BRAIN:END -->", content)

    def test_init_marker_replacement(self) -> None:
        initial_doc = (
            "Top comment\n\n"
            "<!-- BRAIN:START — managed by project-brain, do not edit this block -->\n"
            "Old brain instructions\n"
            "<!-- BRAIN:END -->\n\n"
            "Bottom footer\n"
        )
        self.create_file("GEMINI.md", initial_doc)
        res = self.run_cli("init")
        self.assertEqual(res.returncode, 0)

        content = (self.project_root / "GEMINI.md").read_text(encoding="utf-8")
        self.assertIn("Top comment", content)
        self.assertIn("Bottom footer", content)
        self.assertNotIn("Old brain instructions", content)
        self.assertEqual(content.count("<!-- BRAIN:START"), 1)
        self.assertEqual(content.count("<!-- BRAIN:END -->"), 1)


# ============================================================================
# 6. QUERY TESTS
# ============================================================================

class TestQuery(BaseBrainTestCase):
    """Tests for graph search scoring, exact matches, proximity, and filtering."""

    def test_exact_id_match_scores_highest(self) -> None:
        n1 = brain.Node(id="file:database.py", type="file", title="Database Helper", summary="DB connection pool")
        n2 = brain.Node(id="file:other.py", type="file", title="database.py reference", summary="Uses database.py")
        engine = brain.GraphQueryEngine({n1.id: n1, n2.id: n2}, [])

        results = engine.query("file:database.py")
        self.assertGreater(len(results), 0)
        top_node, top_score, _ = results[0]
        self.assertEqual(top_node.id, "file:database.py")
        self.assertGreaterEqual(top_score, 100.0)

    def test_title_match_scores_higher_than_summary(self) -> None:
        n_title = brain.Node(id="n1", type="concept", title="Authentication Service", summary="Handles logins")
        n_summary = brain.Node(id="n2", type="concept", title="Security Helper", summary="Assists with Authentication")
        engine = brain.GraphQueryEngine({n_title.id: n_title, n_summary.id: n_summary}, [])

        results = engine.query("Authentication")
        self.assertEqual(results[0][0].id, "n1", "Title match (+10) must outscore summary match (+5).")
        self.assertGreater(results[0][1], results[1][1])

    def test_graph_proximity_boost(self) -> None:
        # A matches query; B is connected to A; C is isolated and unlinked
        node_a = brain.Node(id="node_a", type="concept", title="Payment Gateway", summary="Processes credit cards")
        node_b = brain.Node(id="node_b", type="concept", title="Receipt Generator", summary="Creates invoices")
        node_c = brain.Node(id="node_c", type="concept", title="Unrelated Utility", summary="Formatting strings")

        edge_ab = brain.Edge(src="node_a", dst="node_b", type="depends_on")
        engine = brain.GraphQueryEngine(
            {"node_a": node_a, "node_b": node_b, "node_c": node_c},
            [edge_ab],
        )

        results = engine.query("Payment", max_depth=1)
        res_ids = [r[0].id for r in results]
        self.assertIn("node_a", res_ids)
        self.assertIn("node_b", res_ids, "Connected neighbor node_b should be boosted into results.")
        self.assertNotIn("node_c", res_ids)

    def test_query_type_filter(self) -> None:
        n_file = brain.Node(id="file:auth.py", type="file", title="Auth Code", summary="Auth logic")
        n_dec = brain.Node(id="decision:auth", type="decision", title="Auth Strategy", summary="Auth decisions")
        engine = brain.GraphQueryEngine({n_file.id: n_file, n_dec.id: n_dec}, [])

        res_dec = engine.query("Auth", filter_type="decision")
        self.assertEqual(len(res_dec), 1)
        self.assertEqual(res_dec[0][0].type, "decision")

    def test_query_depth_parameter(self) -> None:
        # Chain: N1 -> N2 -> N3
        n1 = brain.Node(id="n1", type="concept", title="KeywordTarget", summary="Seed")
        n2 = brain.Node(id="n2", type="concept", title="HopOne", summary="Intermediate")
        n3 = brain.Node(id="n3", type="concept", title="HopTwo", summary="Deep")

        e1 = brain.Edge(src="n1", dst="n2", type="relates_to")
        e2 = brain.Edge(src="n2", dst="n3", type="relates_to")

        engine = brain.GraphQueryEngine({"n1": n1, "n2": n2, "n3": n3}, [e1, e2])

        res_d1 = [r[0].id for r in engine.query("KeywordTarget", max_depth=1)]
        self.assertIn("n1", res_d1)
        self.assertIn("n2", res_d1)
        self.assertNotIn("n3", res_d1)

        res_d2 = [r[0].id for r in engine.query("KeywordTarget", max_depth=2)]
        self.assertIn("n3", res_d2)

    def test_query_cli_json(self) -> None:
        self.run_cli("init")
        node = brain.Node(id="file:search.py", type="file", title="Search Engine", summary="Query tool")
        self.storage.append_node(node)

        res = self.run_cli("query", "Search", "--json")
        self.assertEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertEqual(data["query"], "Search")
        self.assertEqual(data["results"][0]["node"]["id"], "file:search.py")


# ============================================================================
# 7. ROOT DETECTION TESTS
# ============================================================================

class TestRootDetection(unittest.TestCase):
    """Tests for project root discovery via .git and explicit overrides."""

    def setUp(self) -> None:
        self.temp_dir_obj = tempfile.TemporaryDirectory(dir=TEST_TMP_BASE)
        self.test_dir = Path(self.temp_dir_obj.name).resolve()
        self.old_cwd = os.getcwd()

    def tearDown(self) -> None:
        os.chdir(self.old_cwd)
        try:
            self.temp_dir_obj.cleanup()
        except OSError:
            pass

    def test_find_root_in_current_directory(self) -> None:
        (self.test_dir / ".git").mkdir()
        os.chdir(self.test_dir)
        detected = brain.find_project_root()
        self.assertEqual(detected, self.test_dir)

    def test_find_root_in_parent_directory(self) -> None:
        (self.test_dir / ".git").mkdir()
        child_dir = self.test_dir / "subdir"
        child_dir.mkdir()
        os.chdir(child_dir)
        detected = brain.find_project_root()
        self.assertEqual(detected, self.test_dir)

    def test_find_root_in_grandparent_directory(self) -> None:
        (self.test_dir / ".git").mkdir()
        deep_dir = self.test_dir / "a" / "b"
        deep_dir.mkdir(parents=True)
        os.chdir(deep_dir)
        detected = brain.find_project_root()
        self.assertEqual(detected, self.test_dir)

    def test_root_flag_overrides_detection(self) -> None:
        other_dir = self.test_dir / "other_project"
        other_dir.mkdir()
        (self.test_dir / ".git").mkdir()
        os.chdir(self.test_dir)
        detected = brain.find_project_root(explicit_root=other_dir)
        self.assertEqual(detected, other_dir)

    def test_invalid_root_flag_raises_error(self) -> None:
        nonexistent = self.test_dir / "does_not_exist_12345"
        with self.assertRaises(brain.BrainError):
            brain.find_project_root(explicit_root=nonexistent)

    def test_fallback_when_no_git_and_no_root(self) -> None:
        # Use a temporary directory outside of any git repository tree
        old_cwd = os.getcwd()
        with tempfile.TemporaryDirectory() as sys_temp:
            plain_dir = Path(sys_temp).resolve()
            has_git = any((p / ".git").exists() for p in [plain_dir] + list(plain_dir.parents))
            if not has_git:
                try:
                    os.chdir(plain_dir)
                    detected = brain.find_project_root()
                    self.assertEqual(detected, plain_dir)
                finally:
                    os.chdir(old_cwd)


# ============================================================================
# 8. INTEGRATION TEST: 30-FILE MULTI-LANGUAGE PROJECT
# ============================================================================

class TestIntegration30Files(BaseBrainTestCase):
    """
    End-to-end integration test creating a 30-file multi-language codebase,
    exercising init, scan, sync, touch, note, digest, lint, compact, and query.
    """

    def test_full_lifecycle_30_files(self) -> None:
        # Create 30 files across 5 directories with cross-file imports
        # Group 1: backend (Python) - 7 files
        self.create_file("backend/models.py", "class BaseModel: pass\nclass User(BaseModel): pass\n")
        self.create_file("backend/utils.py", "def hash_pwd(pwd): return pwd[::-1]\n")
        self.create_file("backend/config.py", "DATABASE_URL = 'sqlite:///test.db'\n")
        self.create_file("backend/db.py", "from backend.models import User\nclass DB: pass\n")
        self.create_file("backend/auth.py", "from backend.models import User\nfrom backend.utils import hash_pwd\n")
        self.create_file("backend/helpers.py", "from backend.config import DATABASE_URL\n")
        self.create_file("backend/server.py", "from backend.auth import User\nfrom backend.helpers import DATABASE_URL\n")

        # Group 2: frontend (JS / TS) - 8 files
        self.create_file("frontend/types.ts", "export interface UserProfile { id: string; }\n")
        self.create_file("frontend/utils.js", "export function formatDate(d) { return d.toISOString(); }\n")
        self.create_file("frontend/api.ts", "import type { UserProfile } from './types';\nexport const fetchUser = () => null;\n")
        self.create_file("frontend/components.js", "import { formatDate } from './utils';\nexport const Card = null;\n")
        self.create_file("frontend/header.ts", "import { Card } from './components';\nexport const Header = () => Card;\n")
        self.create_file("frontend/footer.ts", "import { Card } from './components';\nexport const Footer = () => Card;\n")
        self.create_file("frontend/bundle.js", "/* compiled bundle */\n")
        self.create_file("frontend/app.ts", "import { Header } from './header';\nimport { Footer } from './footer';\nimport { fetchUser } from './api';\n")

        # Group 3: web (HTML / CSS) - 5 files
        self.create_file("web/style.css", "body { margin: 0; font-family: sans-serif; }\n")
        self.create_file("web/index.html", "<!DOCTYPE html><link rel=\"stylesheet\" href=\"style.css\"><script src=\"/frontend/bundle.js\"></script>\n")
        self.create_file("web/about.html", "<!DOCTYPE html><link rel=\"stylesheet\" href=\"style.css\"><script src=\"/frontend/bundle.js\"></script>\n")
        self.create_file("web/login.html", "<!DOCTYPE html><link rel=\"stylesheet\" href=\"style.css\"><script src=\"/frontend/bundle.js\"></script>\n")
        self.create_file("web/dashboard.html", "<!DOCTYPE html><link rel=\"stylesheet\" href=\"style.css\"><script src=\"/frontend/bundle.js\"></script>\n")

        # Group 4: legacy (PHP) - 7 files
        self.create_file("legacy/config.php", "<?php define('DB_HOST', 'localhost');\n")
        self.create_file("legacy/util.php", "<?php require 'config.php'; function clean($s) { return trim($s); }\n")
        self.create_file("legacy/db.php", "<?php require 'util.php'; class LegacyDB {}\n")
        self.create_file("legacy/session.php", "<?php include 'db.php'; class Session {}\n")
        self.create_file("legacy/auth.php", "<?php require_once 'db.php'; function verify_user() {}\n")
        self.create_file("legacy/user.php", "<?php require_once 'auth.php'; class UserModel {}\n")
        self.create_file("legacy/index.php", "<?php include 'user.php'; include 'session.php';\n")

        # Group 5: common (Python) - 3 files
        self.create_file("common/constants.py", "APP_NAME = 'BrainNet'\n")
        self.create_file("common/schema.py", "from common.constants import APP_NAME\nclass Schema: pass\n")
        self.create_file("common/validator.py", "from common.schema import Schema\nclass Validator: pass\n")

        # Verify exactly 30 source files
        all_created_files = [
            p for p in self.project_root.rglob("*")
            if p.is_file() and not p.as_posix().endswith((".git", ".lock"))
        ]
        self.assertEqual(len(all_created_files), 30)

        # 1. brain init
        res_init = self.run_cli("init", "--json")
        self.assertEqual(res_init.returncode, 0)
        self.assertTrue((self.project_root / ".brain").exists())

        # 2. brain scan
        res_scan = self.run_cli("scan", "--json")
        self.assertEqual(res_scan.returncode, 0)
        scan_data = json.loads(res_scan.stdout)
        self.assertGreaterEqual(scan_data["scanned_files"], 30)
        self.assertGreaterEqual(scan_data["new_nodes"], 30)
        self.assertGreater(scan_data["edges_found"], 15)

        # Verify all 30 source files were indexed into nodes
        scanned_nodes = self.storage.read_nodes()
        for f in all_created_files:
            rel = f.relative_to(self.project_root).as_posix()
            self.assertIn(f"file:{rel}", scanned_nodes)

        # 3. Touch all 30 nodes with summaries and link any unlinked docs/files to establish clean baseline
        nodes = self.storage.read_nodes()
        edges = self.storage.read_edges()
        connected_ids = {e.src for e in edges} | {e.dst for e in edges}
        for nid, node in nodes.items():
            if node.type == "file" and node.path:
                self.run_cli("touch", node.path, "--summary", f"Role summary for {node.path}")
                if nid not in connected_ids:
                    res_lk = self.run_cli("link", nid, "file:backend/server.py", "--type", "relates_to")
                    self.assertEqual(res_lk.returncode, 0)
                    connected_ids.add(nid)

        # 4. Modify 3 files
        time.sleep(0.05)
        (self.project_root / "backend/server.py").write_text("# Updated server\nimport backend.auth\n", encoding="utf-8")
        (self.project_root / "frontend/app.ts").write_text("// Updated app\nimport './api';\n", encoding="utf-8")
        (self.project_root / "legacy/index.php").write_text("<?php // updated\ninclude 'session.php';\n", encoding="utf-8")

        # 5. brain sync
        res_sync = self.run_cli("sync", "--json")
        self.assertEqual(res_sync.returncode, 0)
        sync_data = json.loads(res_sync.stdout)
        expected_stale = sorted(["backend/server.py", "frontend/app.ts", "legacy/index.php"])
        self.assertEqual(sorted(sync_data["stale"]), expected_stale)
        self.assertEqual(sync_data["new"], [])
        self.assertEqual(sync_data["deleted"], [])

        # 6. brain touch on the 3 files
        for fpath in expected_stale:
            res_touch = self.run_cli("touch", fpath, "--summary", f"Refreshed summary for {fpath}")
            self.assertEqual(res_touch.returncode, 0)

        nodes_after_touch = self.storage.read_nodes()
        for fpath in expected_stale:
            nid = f"file:{fpath}"
            self.assertEqual(nodes_after_touch[nid].status, "active")
            self.assertFalse(nodes_after_touch[nid].needs_summary)

        # 7. brain note: create thought linked to server.py
        res_note = self.run_cli(
            "note",
            "--type", "thought",
            "--title", "API Gateway Architecture",
            "--summary", "Evaluating centralized routing vs direct endpoint calls.",
            "--link", "file:backend/server.py:relates_to",
            "--json",
        )
        self.assertEqual(res_note.returncode, 0)
        note_data = json.loads(res_note.stdout)
        self.assertEqual(note_data["node"]["type"], "thought")

        # 8. brain digest
        res_digest = self.run_cli("digest", "--json")
        self.assertEqual(res_digest.returncode, 0)
        digest_data = json.loads(res_digest.stdout)
        self.assertLessEqual(digest_data["character_count"], brain.MAX_INDEX_CHARACTERS)
        self.assertTrue(self.storage.index_path.exists())

        # 9. brain compact & lint
        # Compact uncompacted append-log entries so lint passes cleanly
        self.run_cli("compact")
        res_lint = self.run_cli("lint", "--json")
        self.assertEqual(res_lint.returncode, 0, msg=f"Lint failed with: {res_lint.stdout}\nerr: {res_lint.stderr}")
        lint_data = json.loads(res_lint.stdout)
        self.assertTrue(lint_data["clean"])
        self.assertEqual(lint_data["issue_count"], 0)

        # 10. brain compact
        res_compact = self.run_cli("compact", "--json")
        self.assertEqual(res_compact.returncode, 0)
        compact_data = json.loads(res_compact.stdout)
        self.assertEqual(compact_data["status"], "ok")

        # 11. brain query
        res_query = self.run_cli("query", "server", "--json")
        self.assertEqual(res_query.returncode, 0)
        query_data = json.loads(res_query.stdout)
        self.assertGreater(len(query_data["results"]), 0)


# ============================================================================
# 9. NOTE / TOUCH / LINK / UNLINK TESTS
# ============================================================================

class TestNoteTouchLink(BaseBrainTestCase):
    """Tests for note creation validation, touch updates, link and unlink."""

    def test_note_creates_node_and_edges(self) -> None:
        self.run_cli("init")
        self.create_file("db.py", "pass\n")
        self.run_cli("scan")

        res = self.run_cli(
            "note",
            "--type", "decision",
            "--title", "Use PostgreSQL",
            "--summary", "Selected for reliability and JSON support.",
            "--link", "file:db.py:implements",
            "--json",
        )
        self.assertEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertEqual(data["node"]["type"], "decision")
        self.assertEqual(len(data["created_edges"]), 1)
        self.assertEqual(data["created_edges"][0]["type"], "implements")

    def test_note_without_link_on_thought_or_decision_fails(self) -> None:
        self.run_cli("init")
        # decision without --link must fail validation
        res_dec = self.run_cli(
            "note",
            "--type", "decision",
            "--title", "Missing Link Decision",
            "--summary", "This should fail validation.",
        )
        self.assertNotEqual(res_dec.returncode, 0)

        # thought without --link must fail validation
        res_thought = self.run_cli(
            "note",
            "--type", "thought",
            "--title", "Missing Link Thought",
            "--summary", "This should fail validation.",
        )
        self.assertNotEqual(res_thought.returncode, 0)

    def test_note_without_link_on_task_or_bug_succeeds(self) -> None:
        self.run_cli("init")
        res_task = self.run_cli(
            "note",
            "--type", "task",
            "--title", "Refactor Logging",
            "--summary", "Switch from print to logging module.",
            "--json",
        )
        self.assertEqual(res_task.returncode, 0)

        res_bug = self.run_cli(
            "note",
            "--type", "bug",
            "--title", "Memory Leak in Buffer",
            "--summary", "Unclosed stream in parser.",
            "--json",
        )
        self.assertEqual(res_bug.returncode, 0)

    def test_touch_updates_sha1_and_summary(self) -> None:
        self.run_cli("init")
        f = self.create_file("core.py", "VERSION = 1\n")
        self.run_cli("scan")

        f.write_text("VERSION = 2\n", encoding="utf-8")
        self.run_cli("sync")

        res_touch = self.run_cli("touch", "core.py", "--summary", "Application core constants")
        self.assertEqual(res_touch.returncode, 0)

        nodes = self.storage.read_nodes()
        node = nodes["file:core.py"]
        self.assertEqual(node.status, "active")
        self.assertFalse(node.needs_summary)
        self.assertEqual(node.summary, "Application core constants")
        self.assertEqual(node.sha1, brain.compute_file_sha1(f))

    def test_touch_creates_new_node_if_missing(self) -> None:
        self.run_cli("init")
        self.create_file("adhoc.py", "pass\n")
        res = self.run_cli("touch", "adhoc.py", "--summary", "Ad-hoc utility script", "--json")
        self.assertEqual(res.returncode, 0)

        nodes = self.storage.read_nodes()
        self.assertIn("file:adhoc.py", nodes)
        self.assertEqual(nodes["file:adhoc.py"].summary, "Ad-hoc utility script")

    def test_link_and_unlink(self) -> None:
        self.run_cli("init")
        n1 = brain.Node(id="concept:a", type="concept", title="A", summary="Node A")
        n2 = brain.Node(id="concept:b", type="concept", title="B", summary="Node B")
        self.storage.append_nodes([n1, n2])

        # Link A -> B
        res_link = self.run_cli("link", "concept:a", "concept:b", "--type", "depends_on", "--weight", "0.75", "--json")
        self.assertEqual(res_link.returncode, 0)

        edges = self.storage.read_edges()
        self.assertEqual(len(edges), 1)
        self.assertEqual(edges[0].src, "concept:a")
        self.assertEqual(edges[0].dst, "concept:b")
        self.assertEqual(edges[0].weight, 0.75)

        # Unlink A -> B
        res_unlink = self.run_cli("unlink", "concept:a", "concept:b", "--type", "depends_on", "--json")
        self.assertEqual(res_unlink.returncode, 0)

        edges_after = self.storage.read_edges()
        self.assertEqual(edges_after, [], "Unlinked edge should be excluded from active edges.")

    def test_link_validates_node_existence(self) -> None:
        self.run_cli("init")
        n1 = brain.Node(id="concept:real", type="concept", title="Real", summary="Real node")
        self.storage.append_node(n1)

        # Link to missing destination
        res1 = self.run_cli("link", "concept:real", "concept:missing", "--type", "relates_to")
        self.assertNotEqual(res1.returncode, 0)

        # Link from missing source
        res2 = self.run_cli("link", "concept:missing", "concept:real", "--type", "relates_to")
        self.assertNotEqual(res2.returncode, 0)


# ============================================================================
# 10. DOCTOR TESTS
# ============================================================================

class TestDoctor(BaseBrainTestCase):
    """Tests for doctor environment and repository health checks."""

    def test_doctor_healthy_project(self) -> None:
        self.run_cli("init")
        res = self.run_cli("doctor", "--json")
        self.assertEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertTrue(data["healthy"])
        self.assertEqual(data["issues"], [])

    def test_doctor_handles_missing_brain_dir(self) -> None:
        # Before init, .brain/ does not exist. doctor should create and verify it.
        res = self.run_cli("doctor", "--json")
        self.assertEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertTrue(data["healthy"])

    def test_doctor_detects_marker_mismatch(self) -> None:
        self.run_cli("init")
        # Introduce broken markers in AGENTS.md
        self.create_file(
            "AGENTS.md",
            "<!-- BRAIN:START -->\nMissing closing marker\n"
        )
        res = self.run_cli("doctor", "--json")
        self.assertNotEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertFalse(data["healthy"])
        checks = [iss["check"] for iss in data["issues"]]
        self.assertIn("marker_mismatch", checks)

    def test_doctor_detects_stale_lock(self) -> None:
        self.run_cli("init")
        stale_lock = self.storage.brain_dir / ".nodes.lock"
        stale_lock.write_text("pid=1234\n", encoding="utf-8")
        past_time = time.time() - 100.0
        os.utime(stale_lock, (past_time, past_time))

        res = self.run_cli("doctor", "--json")
        self.assertNotEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertFalse(data["healthy"])
        checks = [iss["check"] for iss in data["issues"]]
        self.assertIn("stale_lock", checks)

    def test_doctor_detects_corrupted_jsonl(self) -> None:
        self.run_cli("init")
        # Write corrupted JSON to nodes.jsonl
        self.storage.nodes_path.write_text('{"id": "node1", "title": "bad json"\n', encoding="utf-8")

        res = self.run_cli("doctor", "--json")
        self.assertNotEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertFalse(data["healthy"])
        checks = [iss["check"] for iss in data["issues"]]
        self.assertIn("jsonl_syntax", checks)


# ============================================================================
# 11. COMPACT TESTS
# ============================================================================

class TestCompact(BaseBrainTestCase):
    """Tests for JSONL compaction, record deduplication, and deleted purging."""

    def test_compact_keeps_latest_node_version(self) -> None:
        self.run_cli("init")
        v1 = brain.Node(id="file:config.py", type="file", title="config.py v1", summary="Initial")
        v2 = brain.Node(id="file:config.py", type="file", title="config.py v2", summary="Intermediate")
        v3 = brain.Node(id="file:config.py", type="file", title="config.py v3", summary="Latest version")

        # Append sequentially to simulate append-only updates
        self.storage.append_node(v1)
        self.storage.append_node(v2)
        self.storage.append_node(v3)

        raw_lines_before = self.storage.nodes_path.read_text(encoding="utf-8").strip().splitlines()
        self.assertEqual(len(raw_lines_before), 3)

        res = self.run_cli("compact", "--json")
        self.assertEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertEqual(data["nodes_compacted"], 2)

        raw_lines_after = self.storage.nodes_path.read_text(encoding="utf-8").strip().splitlines()
        self.assertEqual(len(raw_lines_after), 1)

        nodes = self.storage.read_nodes()
        self.assertEqual(nodes["file:config.py"].title, "config.py v3")
        self.assertEqual(nodes["file:config.py"].summary, "Latest version")

    def test_compact_deduplicates_edges(self) -> None:
        self.run_cli("init")
        e1 = brain.Edge(src="n1", dst="n2", type="imports", weight=0.5)
        e2 = brain.Edge(src="n1", dst="n2", type="imports", weight=1.0)

        self.storage.append_edge(e1)
        self.storage.append_edge(e2)

        res = self.run_cli("compact", "--json")
        self.assertEqual(res.returncode, 0)

        edges = self.storage.read_edges()
        self.assertEqual(len(edges), 1)
        self.assertEqual(edges[0].weight, 1.0)

    def test_compact_purges_deleted_edges(self) -> None:
        self.run_cli("init")
        e = brain.Edge(src="n1", dst="n2", type="relates_to", weight=1.0)
        e_del = brain.Edge(src="n1", dst="n2", type="relates_to", deleted=True)

        self.storage.append_edge(e)
        self.storage.append_edge(e_del)

        self.run_cli("compact")
        edges = self.storage.read_edges()
        self.assertEqual(edges, [])

        # Verify physical file contains 0 lines
        edge_lines = [ln for ln in self.storage.edges_path.read_text(encoding="utf-8").splitlines() if ln.strip()]
        self.assertEqual(len(edge_lines), 0)

    def test_compact_preserves_data_integrity(self) -> None:
        self.run_cli("init")
        n1 = brain.Node(id="node:1", type="concept", title="First", summary="Sum 1")
        n2 = brain.Node(id="node:2", type="concept", title="Second", summary="Sum 2")
        edge = brain.Edge(src="node:1", dst="node:2", type="relates_to")

        self.storage.append_nodes([n1, n2])
        self.storage.append_edge(edge)

        self.run_cli("compact")

        nodes = self.storage.read_nodes()
        edges = self.storage.read_edges()
        self.assertEqual(len(nodes), 2)
        self.assertEqual(len(edges), 1)
        self.assertEqual(nodes["node:1"].title, "First")
        self.assertEqual(nodes["node:2"].title, "Second")


# ============================================================================
# 12. LINT TESTS
# ============================================================================

class TestLint(BaseBrainTestCase):
    """Tests for knowledge graph linting: orphans, dangling edges, empty summaries."""

    def test_lint_detects_orphan_node(self) -> None:
        self.run_cli("init")
        orphan = brain.Node(
            id="concept:orphan",
            type="concept",
            title="Orphan Concept",
            summary="Has no edges connected",
            status="active",
        )
        self.storage.append_node(orphan)

        res = self.run_cli("lint", "--json")
        self.assertNotEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertFalse(data["clean"])
        issue_types = [iss["type"] for iss in data["issues"]]
        self.assertIn("orphan_node", issue_types)

    def test_lint_detects_dangling_edge(self) -> None:
        self.run_cli("init")
        n1 = brain.Node(id="concept:valid", type="concept", title="Valid", summary="Valid node")
        self.storage.append_node(n1)

        dangling_edge = brain.Edge(src="concept:valid", dst="concept:ghost", type="depends_on")
        self.storage.append_edge(dangling_edge)

        res = self.run_cli("lint", "--json")
        self.assertNotEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        issue_types = [iss["type"] for iss in data["issues"]]
        self.assertIn("dangling_edge_dst", issue_types)

    def test_lint_detects_empty_summary_on_active_node(self) -> None:
        self.run_cli("init")
        n1 = brain.Node(id="concept:a", type="concept", title="Node A", summary="")
        n2 = brain.Node(id="concept:b", type="concept", title="Node B", summary="Good summary")
        edge = brain.Edge(src="concept:a", dst="concept:b", type="relates_to")

        self.storage.append_nodes([n1, n2])
        self.storage.append_edge(edge)

        res = self.run_cli("lint", "--json")
        self.assertNotEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        issue_types = [iss["type"] for iss in data["issues"]]
        self.assertIn("empty_summary", issue_types)

    def test_lint_clean_graph(self) -> None:
        self.run_cli("init")
        n1 = brain.Node(id="concept:one", type="concept", title="Node One", summary="First concept summary")
        n2 = brain.Node(id="concept:two", type="concept", title="Node Two", summary="Second concept summary")
        edge = brain.Edge(src="concept:one", dst="concept:two", type="implements")

        self.storage.append_nodes([n1, n2])
        self.storage.append_edge(edge)

        res = self.run_cli("lint", "--json")
        self.assertEqual(res.returncode, 0)
        data = json.loads(res.stdout)
        self.assertTrue(data["clean"])
        self.assertEqual(data["issue_count"], 0)


# ============================================================================
# MAIN ENTRYPOINT
# ============================================================================

if __name__ == "__main__":
    unittest.main()
