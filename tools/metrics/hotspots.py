#!/usr/bin/env python3
"""Lab 7 — Hotspot matrix: static complexity (Lizard 1.25.0) x process churn (git log).

    complexity  = max cyclomatic complexity of the file's functions (McCabe, Lizard)
                  + Halstead effort E of the file (tools/metrics/halstead.py)
    churn       = number of commits that touched the file
                  (git log --format=format: --name-only | sort | uniq -c)

Risk categories (Tornhill's quadrants):
    HOTSPOT   high complexity (max CC > CC_HIGH)   + high churn (>= CHURN_HIGH)  red
    SLEEPING  high complexity                      + low churn                  yellow
    ACTIVE    low complexity                       + high churn                 green
    STABLE    low complexity                       + low churn                  grey

Usage (repo root; needs git history: actions/checkout fetch-depth: 0):
    python tools/metrics/hotspots.py --out reports/complexity
    python tools/metrics/hotspots.py --since "90 days ago" --cc-high 10 --churn-high 5
Outputs: hotspots.json, hotspots.csv, hotspots.md, lizard-functions.csv
"""
import argparse
import csv
import json
import os
import subprocess
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from halstead import SOURCE_ROOTS, analyze, source_files  # noqa: E402

import lizard  # noqa: E402

CATEGORY = {
    (True, True): ("HOTSPOT", "red — God object: refactor in the next sprint"),
    (True, False): ("SLEEPING", "yellow — refactor only with the next change request"),
    (False, True): ("ACTIVE", "green — healthy active development"),
    (False, False): ("STABLE", "grey — stable utility code"),
}


def read_churn(path):
    """Parse `uniq -c` output ("   12 path/to/file") produced outside (e.g. no git in the container)."""
    counts = Counter()
    with open(path, encoding="utf-8-sig") as fh:
        for line in fh:
            parts = line.strip().split(None, 1)
            if len(parts) == 2 and parts[0].isdigit():
                counts[parts[1].strip()] += int(parts[0])
    return counts


def churn(since=None):
    """Commits per file — the lab's command, optionally limited in time."""
    cmd = ["git", "log", "--no-merges", "--format=format:", "--name-only"]
    if since:
        cmd.append(f"--since={since}")
    out = subprocess.run(cmd, capture_output=True, text=True, check=True).stdout
    return Counter(line.strip() for line in out.splitlines() if line.strip())


def function_rows(paths):
    rows = []
    for info in lizard.analyze_files(sorted(paths)):
        for fn in info.function_list:
            rows.append({"file": info.filename, "function": fn.name, "nloc": fn.nloc,
                         "ccn": fn.cyclomatic_complexity, "params": len(fn.parameters),
                         "start": fn.start_line, "end": fn.end_line})
    return rows


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", default="reports/complexity")
    ap.add_argument("--since", default="90 days ago", help="window for the 'churn 90d' column")
    ap.add_argument("--classify-by", choices=["window", "all"], default="all",
                    help="which churn column decides the category (default: whole history)")
    ap.add_argument("--cc-high", type=int, default=10, help="high complexity: max CC > this")
    ap.add_argument("--churn-high", type=int, default=5, help="high churn: commits >= this")
    ap.add_argument("--top", type=int, default=15)
    ap.add_argument("--churn-all", help="precomputed `uniq -c` file for the whole history (instead of running git)")
    ap.add_argument("--churn-window", help="precomputed `uniq -c` file for the window")
    args = ap.parse_args()

    paths = list(source_files(SOURCE_ROOTS))
    files, overall = analyze(paths)
    churn_all = read_churn(args.churn_all) if args.churn_all else churn()
    churn_win = read_churn(args.churn_window) if args.churn_window else churn(args.since)

    rows = []
    for f in files:
        c_all, c_win = churn_all.get(f["file"], 0), churn_win.get(f["file"], 0)
        decisive = c_all if args.classify_by == "all" else c_win
        cat, note = CATEGORY[(f["max_ccn"] > args.cc_high, decisive >= args.churn_high)]
        rows.append({
            "file": f["file"], "nloc": f["nloc"], "max_cc": f["max_ccn"], "max_cc_function": f["max_ccn_fn"],
            "halstead_effort": f["E"], "commits_all": c_all, "commits_window": c_win,
            "category": cat, "note": note,
            # ranking score: complexity x change frequency (normalised effort x commits)
            "risk_score": round(f["E"] / 1e5 * decisive, 1),
        })
    rows.sort(key=lambda r: (-r["risk_score"], -r["max_cc"]))

    os.makedirs(args.out, exist_ok=True)
    summary = Counter(r["category"] for r in rows)
    with open(os.path.join(args.out, "hotspots.json"), "w", encoding="utf-8") as fh:
        json.dump({"generated_by": f"lizard {lizard.version} + git log",
                   "thresholds": {"cc_high": args.cc_high, "churn_high": args.churn_high,
                                  "window": args.since, "classify_by": args.classify_by},
                   "summary": summary, "halstead_overall": overall, "files": rows},
                  fh, ensure_ascii=False, indent=1)
    with open(os.path.join(args.out, "hotspots.csv"), "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    with open(os.path.join(args.out, "lizard-functions.csv"), "w", newline="", encoding="utf-8") as fh:
        fr = function_rows(paths)
        w = csv.DictWriter(fh, fieldnames=list(fr[0].keys()))
        w.writeheader()
        w.writerows(fr)

    head = ("| File | max CC | Halstead E | Commits (all history) | Commits (window) | Category |\n"
            "|---|---:|---:|---:|---:|---|\n")
    md = [f"# Hotspot matrix (CC > {args.cc_high}, churn >= {args.churn_high}, classified by {args.classify_by})\n",
          "Summary: " + ", ".join(f"{k} {v}" for k, v in sorted(summary.items())) + "\n", head]
    for r in rows[: args.top]:
        md.append(f"| `{r['file']}` | {r['max_cc']} | {r['halstead_effort']:,.0f} | {r['commits_all']} | "
                  f"{r['commits_window']} | **{r['category']}** |\n")
    with open(os.path.join(args.out, "hotspots.md"), "w", encoding="utf-8") as fh:
        fh.writelines(md)

    print("".join(md))
    print(f"files: {len(rows)} | reports -> {args.out}/hotspots.json, hotspots.csv, hotspots.md, lizard-functions.csv")
    return 0


if __name__ == "__main__":
    sys.exit(main())
