#!/usr/bin/env python3
"""Lab 6 — Halstead baseline on top of Lizard 1.25.0 (-Ehalstead).

Lizard counts operators/operands per function. This wrapper adds -Eoutside
(imports, decorators and class fields become a "*global*" unit) and merges the
multisets, so a file or the whole repository gets one Halstead vocabulary:

    eta1 = |distinct operators|        N1 = all operator occurrences
    eta2 = |distinct operands|         N2 = all operand occurrences
    eta  = eta1 + eta2                 N  = N1 + N2
    V = N * log2(eta)                  D  = eta1 / 2 * N2 / eta2
    E = D * V

Usage (from the repo root, inside the pinned image or with lizard==1.25.0):
    python tools/metrics/halstead.py                      # global baseline
    python tools/metrics/halstead.py --files a.ts b.ts    # per-file matrix
    python tools/metrics/halstead.py --top 10 --json out.json
"""
import argparse
import json
import math
import os
import re
import sys
from collections import Counter

import lizard

SOURCE_ROOTS = ("server/src", "client/src")
EXTENSIONS = (".ts", ".tsx")
SKIP_PARTS = ("node_modules", "generated", ".next", "/test/", "__tests__")
SKIP_SUFFIXES = (".spec.ts", ".test.ts", ".test.tsx", ".d.ts", ".goodhart.ts")


def source_files(roots):
    for root in roots:
        for base, _dirs, names in os.walk(root):
            for name in sorted(names):
                path = os.path.join(base, name).replace(os.sep, "/")
                if not path.endswith(EXTENSIONS) or path.endswith(SKIP_SUFFIXES):
                    continue
                if any(part in path for part in SKIP_PARTS):
                    continue
                yield path


JSX_TAG = re.compile(r"<(/?)([A-Za-z][\w.]*)")
JSX_ATTR = re.compile(r"([A-Za-z_][\w-]*)=")
JSX_NOISE = re.compile(r"</?[A-Za-z][\w.]*|[A-Za-z_][\w-]*=|[<>/{}$]")


def normalize(ops, opnds):
    """TypeScript/TSX adaptation of Lizard's generic C-family classifier.

    Lizard 1.25.0 ships a precise classifier only for Python. For TS/TSX it
    files template-literal parts (`...`) and whole JSX chunks
    ("<div className={>\\n   ") as *operators*, so every indentation level
    became a new "distinct operator". Here:
      * template-literal parts  -> operands (string literals);
      * JSX tag  <Tag / </Tag   -> operator "<Tag>" / "</Tag>";
      * JSX attribute name      -> operand;  "{" inside JSX -> operator;
      * JSX text between tags   -> one operand (whitespace collapsed).
    """
    new_ops, new_opnds = Counter(), Counter(opnds)
    for tok, count in ops.items():
        if "`" in tok:
            new_opnds[" ".join(tok.split())] += count
        elif JSX_TAG.search(tok) or "\n" in tok or (" " in tok.strip()):
            for slash, name in JSX_TAG.findall(tok):
                new_ops[f"<{slash}{name}>"] += count
            for attr in JSX_ATTR.findall(tok):
                new_opnds[attr] += count
            new_ops["{"] += tok.count("{") * count
            text = " ".join(JSX_NOISE.sub(" ", tok).split())
            if text:
                new_opnds[text] += count
        else:
            new_ops[tok.strip()] += count
    return new_ops, new_opnds


def metrics(ops, opnds):
    eta1, eta2 = len(ops), len(opnds)
    n1, n2 = sum(ops.values()), sum(opnds.values())
    eta, n = eta1 + eta2, n1 + n2
    volume = n * math.log2(eta) if eta > 1 else 0.0
    difficulty = (eta1 / 2) * (n2 / eta2) if eta2 else 0.0
    return {
        "eta1": eta1, "eta2": eta2, "N1": n1, "N2": n2,
        "eta": eta, "N": n,
        "V": round(volume, 1), "D": round(difficulty, 2),
        "E": round(difficulty * volume, 0),
    }


def analyze(paths):
    exts = lizard.get_extensions(["halstead", "outside"])
    files, total_ops, total_opnds = [], Counter(), Counter()
    for info in lizard.analyze_files(sorted(paths), exts=exts):
        ops, opnds, ccns = Counter(), Counter(), []
        for fn in info.function_list:
            fn_ops, fn_opnds = normalize(getattr(fn, "_halstead_operators", Counter()),
                                         getattr(fn, "_halstead_operands", Counter()))
            ops.update(fn_ops)
            opnds.update(fn_opnds)
            if fn.name != "*global*":
                ccns.append((fn.cyclomatic_complexity, fn.name))
        total_ops.update(ops)
        total_opnds.update(opnds)
        row = metrics(ops, opnds)
        row.update({
            "file": info.filename, "nloc": info.nloc,
            "functions": len(ccns),
            "max_ccn": max(ccns)[0] if ccns else 0,
            "max_ccn_fn": max(ccns)[1] if ccns else "",
        })
        row["E_per_nloc"] = round(row["E"] / row["nloc"], 1) if row["nloc"] else 0
        row["tokens_per_nloc"] = round(row["N"] / row["nloc"], 2) if row["nloc"] else 0
        files.append(row)
    overall = metrics(total_ops, total_opnds)
    overall.update({"files": len(files), "nloc": sum(f["nloc"] for f in files)})
    return files, overall


def print_table(rows):
    head = ("file", "NLOC", "η1", "η2", "N1", "N2", "η", "N", "V", "D", "E", "E/NLOC", "maxCC")
    print("{:<62} {:>5} {:>4} {:>5} {:>6} {:>6} {:>5} {:>6} {:>9} {:>7} {:>12} {:>8} {:>5}".format(*head))
    print("-" * 150)
    for r in rows:
        print("{:<62} {:>5} {:>4} {:>5} {:>6} {:>6} {:>5} {:>6} {:>9} {:>7} {:>12,.0f} {:>8} {:>5}".format(
            r["file"][-62:], r["nloc"], r["eta1"], r["eta2"], r["N1"], r["N2"], r["eta"], r["N"],
            r["V"], r["D"], r["E"], r["E_per_nloc"], r["max_ccn"]))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--files", nargs="*", help="analyse only these files (per-file matrix)")
    ap.add_argument("--top", type=int, default=0, help="also print the N files with the largest effort E")
    ap.add_argument("--json", help="write all rows + overall to this JSON file")
    args = ap.parse_args()

    paths = args.files if args.files else list(source_files(SOURCE_ROOTS))
    files, overall = analyze(paths)
    print(f"Lizard {lizard.version} -Ehalstead -Eoutside | files: {overall['files']} | NLOC: {overall['nloc']}")

    if args.files:
        print_table(sorted(files, key=lambda r: -r["E"]))
    if args.top:
        print(f"\nTop {args.top} hotspots by effort E:")
        print_table(sorted(files, key=lambda r: -r["E"])[: args.top])

    print("\nGLOBAL HALSTEAD BASELINE (one vocabulary for the whole repository)")
    for key, label in (("eta1", "η1 distinct operators"), ("eta2", "η2 distinct operands"),
                       ("N1", "N1 total operators"), ("N2", "N2 total operands"),
                       ("eta", "η  vocabulary η1+η2"), ("N", "N  length N1+N2"),
                       ("V", "V  volume, bits"), ("D", "D  difficulty"), ("E", "E  effort")):
        print(f"  {label:<26} {overall[key]:>16,}")

    if args.json:
        os.makedirs(os.path.dirname(args.json) or ".", exist_ok=True)
        with open(args.json, "w", encoding="utf-8") as fh:
            json.dump({"overall": overall, "files": files}, fh, ensure_ascii=False, indent=1)
    return 0


if __name__ == "__main__":
    sys.exit(main())
