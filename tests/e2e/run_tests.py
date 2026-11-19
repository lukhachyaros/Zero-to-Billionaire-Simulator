#!/usr/bin/env python3
"""
Standalone E2E Test Suite Runner for Zero to Billionaire Simulator.
Executes pytest across Tiers 1-4, tracks execution metrics,
and renders an end-of-run quality assurance report.
"""

import sys
import os
import time
import argparse
import subprocess
from pathlib import Path

# Paths
TESTS_E2E_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = TESTS_E2E_DIR.parent.parent

TIER_FILES = {
    1: ("Tier 1: Feature Coverage", "test_tier1_feature_coverage.py", 90),
    2: ("Tier 2: Boundary & Corner", "test_tier2_boundary_corner.py", 90),
    3: ("Tier 3: Cross-Feature (Pairwise)", "test_tier3_cross_feature.py", 18),
    4: ("Tier 4: Real-World Scenarios", "test_tier4_real_world.py", 9),
}


def run_tier(tier_num: int, extra_args: list = None) -> dict:
    """Execute a single testing tier and parse pytest results."""
    title, filename, expected_count = TIER_FILES[tier_num]
    test_path = TESTS_E2E_DIR / filename
    cmd = [
        sys.executable,
        "-m",
        "pytest",
        str(test_path),
        "-v",
        "--tb=short"
    ]
    if extra_args:
        cmd.extend(extra_args)

    start_time = time.time()
    res = subprocess.run(cmd, cwd=str(PROJECT_ROOT), capture_output=True, text=True)
    duration = time.time() - start_time

    output = res.stdout + "\n" + res.stderr
    passed = 0
    skipped = 0
    failed = 0

    # Parse pytest summary line, e.g. "== 85 passed, 5 skipped in 1.23s =="
    for line in output.splitlines():
        if "passed" in line or "skipped" in line or "failed" in line:
            import re
            m_pass = re.search(r"(\d+)\s+passed", line)
            m_skip = re.search(r"(\d+)\s+skipped", line)
            m_fail = re.search(r"(\d+)\s+failed", line)
            if m_pass:
                passed = int(m_pass.group(1))
            if m_skip:
                skipped = int(m_skip.group(1))
            if m_fail:
                failed = int(m_fail.group(1))

    return {
        "tier": tier_num,
        "title": title,
        "expected": expected_count,
        "passed": passed,
        "skipped": skipped,
        "failed": failed,
        "duration": duration,
        "exit_code": res.returncode,
        "raw_output": output
    }


def main():
    parser = argparse.ArgumentParser(description="Zero to Billionaire Simulator E2E Test Runner")
    parser.add_argument("--tier", type=int, choices=[1, 2, 3, 4], help="Run a specific tier only")
    parser.add_argument("-k", "--filter", type=str, help="Pytest filter expression")
    args, unknown = parser.parse_known_args()

    print("=" * 80)
    print("  ZERO TO BILLIONAIRE SIMULATOR — 4-TIER E2E TEST RUNNER")
    print(f"  Working Directory: {PROJECT_ROOT}")
    print(f"  Test Directory:    {TESTS_E2E_DIR}")
    print("=" * 80)

    tiers_to_run = [args.tier] if args.tier else [1, 2, 3, 4]
    results = []
    overall_start = time.time()

    for t in tiers_to_run:
        title, filename, expected = TIER_FILES[t]
        print(f"\n[RUNNING] {title} ({expected} tests expected)...")
        extra = []
        if args.filter:
            extra.extend(["-k", args.filter])
        if unknown:
            extra.extend(unknown)
        r = run_tier(t, extra)
        results.append(r)
        status = "PASSED" if r["failed"] == 0 else "FAILED"
        print(f"  -> Result: {status} ({r['passed']} passed, {r['skipped']} skipped, {r['failed']} failed) in {r['duration']:.2f}s")

    total_duration = time.time() - overall_start

    # Render Summary Table
    print("\n" + "=" * 80)
    print("                           E2E TEST SUITE EXECUTION SUMMARY")
    print("=" * 80)
    print(f"{'Tier':<6} {'Description':<35} {'Planned':<10} {'Passed':<8} {'Skipped':<9} {'Failed':<8} {'Time'}")
    print("-" * 80)

    total_expected = 0
    total_passed = 0
    total_skipped = 0
    total_failed = 0

    for r in results:
        total_expected += r["expected"]
        total_passed += r["passed"]
        total_skipped += r["skipped"]
        total_failed += r["failed"]
        print(
            f"T{r['tier']:<5} {r['title']:<35} {r['expected']:<10} {r['passed']:<8} {r['skipped']:<9} {r['failed']:<8} {r['duration']:.2f}s"
        )

    print("-" * 80)
    print(
        f"{'TOTAL':<6} {'Full E2E Matrix':<35} {total_expected:<10} {total_passed:<8} {total_skipped:<9} {total_failed:<8} {total_duration:.2f}s"
    )
    print("=" * 80)

    if total_failed > 0:
        print(f"\n[FAILURE] Encountered {total_failed} failing test(s). Check output above.")
        sys.exit(1)
    else:
        print(f"\n[SUCCESS] All executed tests passed cleanly! ({total_passed} passed, {total_skipped} skipped, 0 failed)")
        sys.exit(0)


if __name__ == "__main__":
    main()
