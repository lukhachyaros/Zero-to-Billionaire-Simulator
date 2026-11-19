"""
E2E Test Configuration and Fixtures for Zero to Billionaire Simulator.
Defines server lifecycle management, API client helpers, test data factories,
and DOM/static file inspection utilities.
"""

import os
import sys
import time
import json
import re
import subprocess
from pathlib import Path
from typing import Dict, Any, Optional

import pytest
import requests

# Root paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
WEB_DIR = PROJECT_ROOT / "web"
SERVER_DIR = PROJECT_ROOT / "server"
REPORTS_DIR = PROJECT_ROOT / "reports"
TESTS_DIR = PROJECT_ROOT / "tests"

SCRATCH_STATE_DIR = Path(r"C:\Users\ADMIN\.gemini\antigravity\scratch\teamwork\c736b939-5afd-4569-9aeb-63cc3954506f\.agents\teamwork")

DEFAULT_PORT = 3000
BASE_URL = os.environ.get("TEST_BASE_URL", f"http://localhost:{DEFAULT_PORT}")


# ==============================================================================
# 1. Server Lifecycle Management
# ==============================================================================

def is_server_reachable(url: str, timeout: float = 1.0) -> bool:
    """Check if the backend server is accepting HTTP requests."""
    try:
        res = requests.get(f"{url}/api/health", timeout=timeout)
        if res.status_code == 200:
            return True
    except Exception:
        pass
    try:
        res = requests.get(f"{url}/", timeout=timeout)
        return res.status_code in [200, 304, 404]
    except Exception:
        return False


@pytest.fixture(scope="session")
def server_lifecycle():
    """
    Session-wide fixture that ensures the Node.js backend server is running.
    If not already running, spawns `node server/index.js` and waits for readiness,
    then terminates the process on test suite completion.
    """
    proc = None
    if not is_server_reachable(BASE_URL):
        server_entry = SERVER_DIR / "index.js"
        if server_entry.exists():
            env = os.environ.copy()
            env["PORT"] = str(DEFAULT_PORT)
            env["NODE_ENV"] = "test"
            proc = subprocess.Popen(
                ["node", str(server_entry)],
                cwd=str(PROJECT_ROOT),
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            # Poll for readiness up to 10 seconds
            start_time = time.time()
            server_ready = False
            while time.time() - start_time < 10.0:
                if is_server_reachable(BASE_URL, timeout=0.5):
                    server_ready = True
                    break
                if proc.poll() is not None:
                    # Server process terminated prematurely
                    stdout, stderr = proc.communicate()
                    break
                time.sleep(0.3)

    yield BASE_URL

    if proc is not None:
        try:
            if sys.platform == "win32":
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                               capture_output=True, check=False)
            else:
                proc.terminate()
                proc.wait(timeout=3)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass


# ==============================================================================
# 2. HTTP Client Fixtures
# ==============================================================================

class E2EClient:
    """Wrapper around requests.Session with default base_url and JSON helper methods."""

    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "ZTB-E2E-Harness/1.0 (Windows NT 10.0; Win64; x64)",
            "Accept": "application/json, text/html, */*"
        })

    def _url(self, path: str) -> str:
        if path.startswith("http://") or path.startswith("https://"):
            return path
        clean_path = path if path.startswith("/") else f"/{path}"
        return f"{self.base_url}{clean_path}"

    def get(self, path: str, **kwargs) -> requests.Response:
        kwargs.setdefault("timeout", 10.0)
        return self.session.get(self._url(path), **kwargs)

    def post(self, path: str, **kwargs) -> requests.Response:
        kwargs.setdefault("timeout", 10.0)
        return self.session.post(self._url(path), **kwargs)

    def put(self, path: str, **kwargs) -> requests.Response:
        kwargs.setdefault("timeout", 10.0)
        return self.session.put(self._url(path), **kwargs)

    def delete(self, path: str, **kwargs) -> requests.Response:
        kwargs.setdefault("timeout", 10.0)
        return self.session.delete(self._url(path), **kwargs)

    def options(self, path: str, **kwargs) -> requests.Response:
        kwargs.setdefault("timeout", 10.0)
        return self.session.options(self._url(path), **kwargs)


@pytest.fixture
def client(server_lifecycle):
    """Provides an isolated E2EClient instance per test function."""
    c = E2EClient(server_lifecycle)
    yield c
    c.session.close()


@pytest.fixture
def base_url(server_lifecycle):
    """Returns the active base URL string."""
    return server_lifecycle


# ==============================================================================
# 3. Test Data Factories
# ==============================================================================

@pytest.fixture
def test_factories(client):
    """Provides factory helper functions for generating players, saves, and tokens."""

    class Factories:
        @staticmethod
        def create_guest(display_name: Optional[str] = None) -> Dict[str, Any]:
            payload = {}
            if display_name is not None:
                payload["displayName"] = display_name
            res = client.post("/api/auth/guest", json=payload)
            if res.status_code not in [200, 201]:
                raise RuntimeError(f"Failed to create guest: {res.status_code} {res.text}")
            return res.json()

        @staticmethod
        def make_save_payload(
            slot: int = 0,
            character_name: str = "Tỷ Phú Đất Việt",
            age: int = 25,
            net_worth: float = 50_000_000,
            generation: int = 1,
            current_job: str = "Giám Đốc Bất Động Sản",
            save_data: Optional[Dict[str, Any]] = None
        ) -> Dict[str, Any]:
            if save_data is None:
                save_data = {
                    "cash": net_worth * 0.4,
                    "bank": net_worth * 0.6,
                    "health": 95,
                    "happiness": 90,
                    "smarts": 85,
                    "inventory": ["Villa Saigon", "Mercedes Maybach"]
                }
            return {
                "slot": slot,
                "characterName": character_name,
                "age": age,
                "generation": generation,
                "currentJob": current_job,
                "netWorth": net_worth,
                "peakNetWorth": net_worth * 1.2,
                "isAlive": True,
                "saveData": save_data,
                "saveVersion": 2
            }

        @staticmethod
        def create_player_with_save(
            display_name: str = "Đặng Lê Nguyên",
            net_worth: float = 100_000_000,
            age: int = 30,
            slot: int = 0
        ) -> Dict[str, Any]:
            guest = Factories.create_guest(display_name)
            token = guest["token"]
            headers = {"Authorization": f"Bearer {token}"}
            save_payload = Factories.make_save_payload(
                slot=slot,
                character_name=guest.get("displayName", display_name),
                age=age,
                net_worth=net_worth
            )
            save_res = client.post("/api/save", json=save_payload, headers=headers)
            return {
                "guest": guest,
                "token": token,
                "playerId": guest["playerId"],
                "syncCode": guest["syncCode"],
                "displayName": guest.get("displayName", display_name),
                "savePayload": save_payload,
                "saveResponse": save_res.json() if save_res.status_code in [200, 201] else None
            }

    return Factories()


# ==============================================================================
# 4. Static & DOM Inspection Helpers
# ==============================================================================

@pytest.fixture(scope="session")
def dom_helpers():
    """Provides helpers for inspecting HTML DOM, CSS rules, and client-side JavaScript."""

    class DOMHelpers:
        @staticmethod
        def read_file(path: Path) -> str:
            if not path.exists():
                return ""
            return path.read_text(encoding="utf-8", errors="replace")

        @staticmethod
        def read_web(rel_path: str) -> str:
            return DOMHelpers.read_file(WEB_DIR / rel_path)

        @staticmethod
        def read_root(rel_path: str) -> str:
            p = PROJECT_ROOT / rel_path
            if p.exists():
                return DOMHelpers.read_file(p)
            sp = SCRATCH_STATE_DIR / rel_path
            if sp.exists():
                return DOMHelpers.read_file(sp)
            return ""

        @staticmethod
        def has_element_id(html_str: str, elem_id: str) -> bool:
            pattern = rf'id\s*=\s*["\']{re.escape(elem_id)}["\']'
            return bool(re.search(pattern, html_str, re.IGNORECASE))

        @staticmethod
        def extract_tag_by_id(html_str: str, elem_id: str) -> Optional[str]:
            pattern = rf'<([a-zA-Z0-9\-]+)[^>]*id\s*=\s*["\']{re.escape(elem_id)}["\'][^>]*>'
            match = re.search(pattern, html_str, re.IGNORECASE)
            return match.group(0) if match else None

        @staticmethod
        def has_css_class(html_str: str, class_name: str) -> bool:
            pattern = rf'class\s*=\s*["\'][^"\']*\b{re.escape(class_name)}\b[^"\']*["\']'
            return bool(re.search(pattern, html_str, re.IGNORECASE))

        @staticmethod
        def contains_js_function(js_str: str, func_name: str) -> bool:
            pattern = rf'(function\s+{re.escape(func_name)}|const\s+{re.escape(func_name)}\s*=|let\s+{re.escape(func_name)}\s*=|async\s+function\s+{re.escape(func_name)})'
            return bool(re.search(pattern, js_str))

    return DOMHelpers()
