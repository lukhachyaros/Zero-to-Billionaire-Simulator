#!/usr/bin/env python3
"""
Zero to Billionaire Simulator — Game Data Validator, Lifespan Coverage Auditor & Sync Tool.

Usage:
  python tools/validate_game_data.py --check   # CI validation only (exits non-zero on error)
  python tools/validate_game_data.py --sync    # Validate + sync data/ -> unity/Assets/Resources/Data/ & web/game_data.js
"""

import argparse
import glob
import json
import os
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

VALID_STAT_MODIFIERS = {
    "health", "intelligence", "appearance", "happiness", "discipline", "stress",
    "luck", "parentRelationship", "socialStatus", "charisma", "financialLiteracy",
    "practicalSkills", "businessAcuity", "karma", "energy", "cash", "money", "debt"
}

VALID_CONDITION_FIELDS = VALID_STAT_MODIFIERS | {
    "age", "netWorth", "gender", "educationLevel", "hasFlag", "notHasFlag", "childrenCount"
}

VALID_OPERATORS = {"==", ">=", "<=", ">", "<", "!="}
VALID_CATEGORIES = {"childhood", "education", "career", "relationship", "finance", "culture", "family_culture"}
VALID_EDUCATION = {"Chưa đi học", "Mầm non", "Tiểu học", "THCS", "THPT", "Học nghề", "Đại học"}

FORMULA_RE = re.compile(r"^([a-zA-Z_]+)\s*(>=|<=|==|!=|>|<)\s*(-?\d+)$")


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fp:
        return json.load(fp)


def validate_events(errors: list[str], warnings: list[str]) -> dict[str, list]:
    event_files = sorted((ROOT / "data" / "events").glob("*.json"))
    if not event_files:
        errors.append("No event JSON files found in data/events/")
        return {}

    loaded_by_name = {}
    for path in event_files:
        try:
            data = load_json(path)
        except Exception as exc:
            errors.append(f"{path.relative_to(ROOT)}: Invalid JSON ({exc})")
            continue

        if not isinstance(data, list):
            errors.append(f"{path.relative_to(ROOT)}: Root must be a JSON array of events")
            continue

        loaded_by_name[path.stem] = data
        seen_ids = set()

        for idx, evt in enumerate(data):
            loc = f"{path.name}[{idx}]"
            eid = evt.get("eventId")
            if not eid or not isinstance(eid, str):
                errors.append(f"{loc}: Missing or invalid 'eventId'")
                continue
            if eid in seen_ids:
                errors.append(f"{loc}: Duplicate eventId '{eid}'")
            seen_ids.add(eid)

            for req in ("title", "description", "minAge", "maxAge", "options"):
                if req not in evt:
                    errors.append(f"{eid}: Missing required field '{req}'")

            min_age = evt.get("minAge", 0)
            max_age = evt.get("maxAge", 0)
            if min_age < 0 or max_age < min_age:
                errors.append(f"{eid}: Invalid age range [{min_age}, {max_age}]")

            cat = evt.get("category", "")
            if cat and cat not in VALID_CATEGORIES:
                warnings.append(f"{eid}: Non-standard category '{cat}'")

            for cond in evt.get("conditions", []):
                field = cond.get("field")
                op = cond.get("operatorType") or cond.get("operator")
                if field not in VALID_CONDITION_FIELDS:
                    errors.append(f"{eid}: Unknown condition field '{field}'")
                if op not in VALID_OPERATORS:
                    errors.append(f"{eid}: Invalid condition operator '{op}'")

            options = evt.get("options", [])
            if not options:
                errors.append(f"{eid}: Must have at least 1 option")

            for opt in options:
                if not opt.get("id") or not opt.get("label"):
                    errors.append(f"{eid}: Option missing 'id' or 'label'")
                outcomes = opt.get("outcomes", [])
                if not outcomes:
                    errors.append(f"{eid}/{opt.get('id')}: Option has no outcomes")
                    continue

                prob_sum = sum(float(o.get("probability", 0)) for o in outcomes)
                if not (0.95 <= prob_sum <= 1.05):
                    warnings.append(f"{eid}/{opt.get('id')}: Outcome probabilities sum to {prob_sum:.2f} (expected ~1.0)")

                for out in outcomes:
                    if not out.get("message"):
                        errors.append(f"{eid}/{opt.get('id')}: Outcome missing 'message'")
                    formula = out.get("conditionFormula") or out.get("condition")
                    if formula:
                        m = FORMULA_RE.match(formula.strip())
                        if not m:
                            errors.append(f"{eid}/{opt.get('id')}: Invalid conditionFormula '{formula}'")
                        elif m.group(1) not in VALID_CONDITION_FIELDS:
                            errors.append(f"{eid}/{opt.get('id')}: Unknown field '{m.group(1)}' in formula '{formula}'")

                    edu_set = out.get("educationSet")
                    if edu_set and edu_set not in VALID_EDUCATION:
                        errors.append(f"{eid}/{opt.get('id')}: Invalid educationSet '{edu_set}'")

                    mods = out.get("statModifiers", {})
                    for k in mods:
                        if k not in VALID_STAT_MODIFIERS:
                            errors.append(f"{eid}/{opt.get('id')}: Unknown statModifier '{k}'")
                    if max_age <= 5 and (mods.get("cash", 0) > 0 or mods.get("money", 0) > 0):
                        errors.append(f"{eid}/{opt.get('id')}: Early childhood event (age <= 5) should not grant cash")

    # Lifespan coverage check (0..95) across core + random pool
    combined = loaded_by_name.get("life_events_full", []) + loaded_by_name.get("random_yearly_events", [])
    if combined:
        uncovered_ages = []
        for age in range(0, 96):
            if not any(e["minAge"] <= age <= e["maxAge"] for e in combined):
                uncovered_ages.append(age)
        if uncovered_ages:
            warnings.append(f"Ages without any eligible event: {uncovered_ages}")

    return loaded_by_name


def validate_careers(errors: list[str]) -> list:
    path = ROOT / "data" / "careers" / "careers.json"
    if not path.exists():
        errors.append("Missing data/careers/careers.json")
        return []

    careers = load_json(path)
    ids = {c.get("careerId") for c in careers}
    if len(ids) != len(careers):
        errors.append("Duplicate careerId in careers.json")

    for c in careers:
        cid = c.get("careerId", "<missing>")
        if c.get("monthlySalary", 0) <= 0:
            errors.append(f"{cid}: monthlySalary must be > 0")
        if c.get("requiredEducation") not in VALID_EDUCATION:
            errors.append(f"{cid}: Invalid requiredEducation '{c.get('requiredEducation')}'")
        promo = c.get("promotionCareerId")
        if promo and promo not in ids:
            errors.append(f"{cid}: promotionCareerId '{promo}' does not exist")

    return careers


def validate_assets(errors: list[str]) -> list:
    path = ROOT / "data" / "economy" / "assets.json"
    if not path.exists():
        errors.append("Missing data/economy/assets.json")
        return []

    assets = load_json(path)
    ids = {a.get("assetId") for a in assets}
    if len(ids) != len(assets):
        errors.append("Duplicate assetId in assets.json")

    valid_cats = {"real_estate", "investment", "business", "vehicle"}
    for a in assets:
        aid = a.get("assetId", "<missing>")
        if a.get("cost", 0) <= 0:
            errors.append(f"{aid}: cost must be > 0")
        if a.get("category") not in valid_cats:
            errors.append(f"{aid}: Invalid asset category '{a.get('category')}'")

    return assets


def validate_backgrounds(errors: list[str]) -> list:
    path = ROOT / "data" / "backgrounds" / "starting_backgrounds.json"
    if not path.exists():
        errors.append("Missing data/backgrounds/starting_backgrounds.json")
        return []

    bgs = load_json(path)
    ids = {b.get("backgroundId") for b in bgs}
    if len(ids) != len(bgs):
        errors.append("Duplicate backgroundId in starting_backgrounds.json")

    for b in bgs:
        bid = b.get("backgroundId", "<missing>")
        if b.get("initialCash", 0) != 0:
            errors.append(f"{bid}: initialCash must be 0 for realistic newborn start")
        for k in b.get("statBonuses", {}):
            if k not in VALID_STAT_MODIFIERS:
                errors.append(f"{bid}: Unknown statBonus '{k}'")

    return bgs


def validate_csharp_sources(errors: list[str]) -> int:
    cs_files = sorted((ROOT / "unity" / "Assets").rglob("*.cs"))
    for cs in cs_files:
        text = cs.read_text(encoding="utf-8")
        # Strip comments & string literals roughly for brace balance check
        cleaned = re.sub(r"//.*", "", text)
        cleaned = re.sub(r"/\*[\s\S]*?\*/", "", cleaned)
        cleaned = re.sub(r'@"(?:""|[^"])*"', '""', cleaned)
        cleaned = re.sub(r'"(?:\\.|[^"\\])*"', '""', cleaned)

        if cleaned.count("{") != cleaned.count("}"):
            errors.append(f"{cs.relative_to(ROOT)}: Unbalanced curly braces {{}}")
        if "namespace ZeroToBillionaire" not in text:
            errors.append(f"{cs.relative_to(ROOT)}: Missing ZeroToBillionaire namespace")
    return len(cs_files)


def _check_js_balance(source: str, rel_path: str, errors: list[str]):
    """Lightweight JS lexer checking balanced (), {}, [] outside strings, templates, regexes, and comments."""
    stack: list[str] = []
    matching = {")": "(", "}": "{", "]": "["}
    i = 0
    n = len(source)
    prev_sig_char = ";"

    def in_template_expr() -> bool:
        return bool(stack) and stack[-1] == "${"

    while i < n:
        ch = source[i]
        nxt = source[i + 1] if i + 1 < n else ""

        # Line comment
        if ch == "/" and nxt == "/":
            nl = source.find("\n", i)
            i = n if nl == -1 else nl + 1
            continue

        # Block comment
        if ch == "/" and nxt == "*":
            end = source.find("*/", i + 2)
            if end == -1:
                errors.append(f"{rel_path}: Unterminated /* comment")
                return
            i = end + 2
            continue

        # String literal
        if ch in ('"', "'"):
            quote = ch
            i += 1
            while i < n:
                if source[i] == "\\":
                    i += 2
                    continue
                if source[i] == quote:
                    i += 1
                    break
                i += 1
            prev_sig_char = quote
            continue

        # Template literal
        if ch == "`":
            i += 1
            while i < n:
                if source[i] == "\\":
                    i += 2
                    continue
                if source[i] == "$" and i + 1 < n and source[i + 1] == "{":
                    stack.append("${")
                    i += 2
                    prev_sig_char = "{"
                    break
                if source[i] == "`":
                    i += 1
                    prev_sig_char = "`"
                    break
                i += 1
            continue

        # Regex literal heuristic
        if ch == "/" and prev_sig_char in "=([,:;!&|?{}~+-*%^<>":
            i += 1
            in_class = False
            while i < n:
                rc = source[i]
                if rc == "\\":
                    i += 2
                    continue
                if rc == "[":
                    in_class = True
                elif rc == "]":
                    in_class = False
                elif rc == "/" and not in_class:
                    i += 1
                    break
                elif rc == "\n":
                    break
                i += 1
            while i < n and source[i].isalpha():
                i += 1
            prev_sig_char = "/"
            continue

        if ch in "({[":
            stack.append(ch)
            prev_sig_char = ch
        elif ch in ")}]":
            if ch == "}" and in_template_expr():
                stack.pop()
                # Resume outer template string
                i += 1
                while i < n:
                    if source[i] == "\\":
                        i += 2
                        continue
                    if source[i] == "$" and i + 1 < n and source[i + 1] == "{":
                        stack.append("${")
                        i += 2
                        prev_sig_char = "{"
                        break
                    if source[i] == "`":
                        i += 1
                        prev_sig_char = "`"
                        break
                    i += 1
                continue

            if not stack or stack[-1] != matching[ch]:
                errors.append(f"{rel_path}: Mismatched delimiter '{ch}'")
                return
            stack.pop()
            prev_sig_char = ch
        elif not ch.isspace():
            prev_sig_char = ch

        i += 1

    if stack:
        errors.append(f"{rel_path}: Unclosed delimiters {stack}")


def validate_web_client(errors: list[str]) -> int:
    web_dir = ROOT / "web"
    required = ["index.html", "styles.css", "audio.js", "vendor/three.min.js", "diorama3d.js", "game.js", "game_data.js"]
    for fname in required:
        fpath = web_dir / fname
        if not fpath.exists() or fpath.stat().st_size == 0:
            errors.append(f"Missing or empty web file: web/{fname}")

    index_path = web_dir / "index.html"
    if not index_path.exists():
        return 0

    html_text = index_path.read_text(encoding="utf-8")
    html_ids = set(re.findall(r'\bid=["\']([^"\']+)["\']', html_text))

    # Offline file:// safety checks
    if re.search(r'<script[^>]+src=["\']https?://', html_text, re.IGNORECASE):
        errors.append("web/index.html: External CDN script tags break offline file:// compatibility")

    expected_order = ["game_data.js", "audio.js", "vendor/three.min.js", "diorama3d.js", "game.js"]
    last_pos = -1
    for script_name in expected_order:
        pos = html_text.find(script_name)
        if pos == -1:
            errors.append(f"web/index.html: Missing script include '{script_name}'")
        elif pos < last_pos:
            errors.append(f"web/index.html: Script '{script_name}' loaded out of order")
        last_pos = max(last_pos, pos)

    js_files = ["audio.js", "diorama3d.js", "game.js"]
    for js_name in js_files:
        js_path = web_dir / js_name
        if not js_path.exists():
            continue
        js_text = js_path.read_text(encoding="utf-8")
        _check_js_balance(js_text, f"web/{js_name}", errors)

        if "fetch(" in js_text:
            errors.append(f"web/{js_name}: Avoid fetch() so web client works directly via file://")

        referenced_ids = set(re.findall(r'document\.getElementById\(\s*["\']([^"\']+)["\']\s*\)', js_text))
        if js_name == "game.js":
            referenced_ids |= set(re.findall(r'\bel\(\s*["\']([^"\']+)["\']\s*\)', js_text))

        missing_ids = sorted(referenced_ids - html_ids)
        for mid in missing_ids:
            errors.append(f"web/{js_name}: References DOM id '{mid}' missing from web/index.html")

    return len(required)


def simulate_90_year_lifecycle(
    events_by_name: dict, careers: list, assets: list, backgrounds: list, errors: list[str]
) -> int:
    """Headless simulation from age 0 to 90 verifying event matching, modifiers, and chaining."""
    pool = events_by_name.get("life_events_full", []) + events_by_name.get("random_yearly_events", [])
    if not pool or not backgrounds or not careers or not assets:
        return 0

    all_event_ids = {e["eventId"] for e in pool}
    for e in pool:
        for opt in e.get("options", []):
            for out in opt.get("outcomes", []):
                nxt = out.get("nextEventId")
                if nxt and nxt not in all_event_ids:
                    errors.append(f"{e['eventId']}/{opt['id']}: Broken nextEventId '{nxt}'")

    bg = backgrounds[1] if len(backgrounds) > 1 else backgrounds[0]
    stats = {
        "age": 0,
        "gender": "Nam",
        "health": 90,
        "intelligence": 75,
        "appearance": 65,
        "happiness": 80,
        "discipline": 70,
        "stress": 10,
        "luck": 60,
        "parentRelationship": 80,
        "socialStatus": 30,
        "charisma": 65,
        "financialLiteracy": 45,
        "practicalSkills": 30,
        "businessAcuity": 50,
        "karma": 60,
        "cash": bg.get("initialCash", 0) + 250_000_000,
        "debt": 0,
        "childrenCount": 1,
        "educationLevel": "Chưa đi học",
    }
    flags = set(bg.get("startingFlags", []))
    triggered_age: dict[str, int] = {}
    triggered_count = 0

    def cmp(actual: int, op: str, target: int) -> bool:
        return {
            "==": actual == target,
            ">=": actual >= target,
            "<=": actual <= target,
            ">": actual > target,
            "<": actual < target,
            "!=": actual != target,
        }.get(op, True)

    for age in range(0, 91):
        stats["age"] = age
        eligible = []
        for evt in pool:
            eid = evt["eventId"]
            one_time = evt.get("isOneTime", True)
            if one_time and eid in triggered_age:
                continue
            if not one_time and eid in triggered_age and age - triggered_age[eid] < 3:
                continue
            if not (evt["minAge"] <= age <= evt["maxAge"]):
                continue

            ok = True
            for cond in evt.get("conditions", []):
                field = cond.get("field")
                op = cond.get("operatorType") or cond.get("operator") or "=="
                if field == "hasFlag":
                    ok = cond.get("stringValue") in flags
                elif field == "notHasFlag":
                    ok = cond.get("stringValue") not in flags
                elif field == "gender":
                    ok = (stats["gender"] != cond.get("stringValue")) if op == "!=" else (stats["gender"] == cond.get("stringValue"))
                elif field == "educationLevel":
                    ok = (stats["educationLevel"] != cond.get("stringValue")) if op == "!=" else (stats["educationLevel"] == cond.get("stringValue"))
                else:
                    actual = stats["cash"] if field in ("cash", "money", "netWorth") else int(stats.get(field, 0))
                    target = int(cond.get("numberValue") if "numberValue" in cond else cond.get("value", 0))
                    ok = cmp(actual, op, target)
                if not ok:
                    break
            if ok:
                eligible.append(evt)

        if eligible:
            eligible.sort(key=lambda x: x.get("priority", 50), reverse=True)
            chosen = eligible[0]
            triggered_age[chosen["eventId"]] = age
            triggered_count += 1
            opt = chosen["options"][0]
            out = opt["outcomes"][0]
            for k, delta in out.get("statModifiers", {}).items():
                target_key = "cash" if k in ("cash", "money") else k
                if target_key in stats:
                    stats[target_key] += delta
            if out.get("educationSet"):
                stats["educationLevel"] = out["educationSet"]
            if out.get("childrenDelta", 0) > 0:
                stats["childrenCount"] += out["childrenDelta"]
            for f in out.get("unlockedFlags", []):
                flags.add(f)

    if triggered_count < 12:
        errors.append(f"Headless 0-90 simulation triggered too few events ({triggered_count} < 12)")

    return triggered_count


def sync_outputs(events_by_name: dict, careers: list, assets: list, backgrounds: list):
    unity_data_dir = ROOT / "unity" / "Assets" / "Resources" / "Data"
    unity_data_dir.mkdir(parents=True, exist_ok=True)

    sync_pairs = [
        (ROOT / "data" / "events" / "life_events_full.json", unity_data_dir / "life_events_full.json"),
        (ROOT / "data" / "events" / "random_yearly_events.json", unity_data_dir / "random_yearly_events.json"),
        (ROOT / "data" / "careers" / "careers.json", unity_data_dir / "careers.json"),
        (ROOT / "data" / "economy" / "assets.json", unity_data_dir / "assets.json"),
        (ROOT / "data" / "backgrounds" / "starting_backgrounds.json", unity_data_dir / "starting_backgrounds.json"),
    ]
    for src, dst in sync_pairs:
        shutil.copyfile(src, dst)

    web_dir = ROOT / "web"
    web_dir.mkdir(parents=True, exist_ok=True)
    bundle = {
        "backgrounds": backgrounds,
        "careers": careers,
        "assets": assets,
        "milestoneEvents": events_by_name.get("life_events_full", []),
        "randomEvents": events_by_name.get("random_yearly_events", []),
    }
    web_data_js = web_dir / "game_data.js"
    web_data_js.write_text(
        "// Auto-generated from /data by tools/validate_game_data.py — DO NOT EDIT MANUALLY\n"
        "window.ZTB_DATA = " + json.dumps(bundle, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Synced 5 JSON files to unity/Assets/Resources/Data/ and generated web/game_data.js")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--sync", action="store_true", help="Sync data into Unity Resources & Web bundle")
    parser.add_argument("--check", action="store_true", help="Validate only")
    args = parser.parse_args()

    errors: list[str] = []
    warnings: list[str] = []

    events_by_name = validate_events(errors, warnings)
    careers = validate_careers(errors)
    assets = validate_assets(errors)
    backgrounds = validate_backgrounds(errors)
    cs_count = validate_csharp_sources(errors)
    sim_events = simulate_90_year_lifecycle(events_by_name, careers, assets, backgrounds, errors)

    if args.sync and not errors:
        sync_outputs(events_by_name, careers, assets, backgrounds)

    web_count = validate_web_client(errors)

    total_events = sum(len(v) for v in events_by_name.values())
    print(
        f"Summary: {total_events} events | {len(careers)} careers | {len(assets)} assets | "
        f"{len(backgrounds)} backgrounds | {cs_count} C# scripts | {web_count} web files | "
        f"{sim_events} lifecycle events simulated (0-90y)."
    )

    for w in warnings:
        print(f"WARNING: {w}")
    for e in errors:
        print(f"ERROR: {e}", file=sys.stderr)

    if errors:
        sys.exit(1)

    print("All game data schemas, lifespan coverage, C# scripts, headless simulation, and Web DOM checks PASSED!")


if __name__ == "__main__":
    main()
