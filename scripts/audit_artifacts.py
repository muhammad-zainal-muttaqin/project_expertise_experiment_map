#!/usr/bin/env python3
"""Audit paths artefak Field Research Ledger pada commit GitHub yang dipasangi pin."""
from __future__ import annotations

import argparse
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

DEFAULT_SOURCE = {
    "key": "project-expertise",
    "owner": "muhammad-zainal-muttaqin",
    "repo": "project-expertise",
    "commit": "225faaeb",
}
PIPELINE_PERTANDAN_SOURCE = {
    "key": "project-expertise-pipeline-pertandan",
    "owner": "muhammad-zainal-muttaqin",
    "repo": "project-expertise",
    "commit": "c19906bbfbb4",
}
HISTORICAL_SOURCES = {
    "dedup": {"key": "research-method-dedup", "owner": "muhammad-zainal-muttaqin", "repo": "research-method-dedup", "commit": "a720f17"},
    "baseline": {"key": "Baseline-SawitMVC", "owner": "ULM-SawitMVC", "repo": "Baseline-SawitMVC", "commit": "ee2f0ac"},
    "pipeline": {"key": "Research-Pipeline", "owner": "muhammad-zainal-muttaqin", "repo": "Research-Pipeline", "commit": "4aa9ad6"},
}
ID_PATTERN = re.compile(r'\bid:\s*"([^"]+)"')
ARTIFACT_PATTERN = re.compile(r'artifacts:\s*\[([\s\S]*?)\]')
STRING_PATTERN = re.compile(r'"([^"]+)"')
SOURCE_KEY_PATTERN = re.compile(r'sourceKey:\s*"([^"]+)"')


def parse_catalog(path: Path, fallback: dict) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    matches = list(ID_PATTERN.finditer(text))
    records: list[dict] = []
    for index, match in enumerate(matches):
        block = text[match.start() : matches[index + 1].start() if index + 1 < len(matches) else len(text)]
        artifact_match = ARTIFACT_PATTERN.search(block)
        if not artifact_match:
            continue
        source_key_match = SOURCE_KEY_PATTERN.search(block)
        source = HISTORICAL_SOURCES.get(source_key_match.group(1), fallback) if source_key_match else fallback
        for artifact in STRING_PATTERN.findall(artifact_match.group(1)):
            records.append({"id": match.group(1), "artifact": artifact, "source": source})
    return records


def normalize_artifact(artifact: str) -> tuple[str, str | None]:
    if re.match(r"^commit\s+[0-9a-f]{7,40}", artifact, re.IGNORECASE):
        return "commit-reference", None
    if "*" in artifact:
        return "pattern", None
    return "file", artifact.split(" §", 1)[0].strip()


def urls_for(source: dict, path: str) -> tuple[str, str]:
    base = f"https://github.com/{source['owner']}/{source['repo']}"
    encoded_path = quote(path, safe="/")
    raw = f"https://raw.githubusercontent.com/{source['owner']}/{source['repo']}/{source['commit']}/{encoded_path}"
    return raw, f"{base}/blob/{source['commit']}/{encoded_path}"


def http_status(url: str, timeout: int) -> int | None:
    for method in ("HEAD", "GET"):
        try:
            request = Request(url, method=method, headers={"User-Agent": "Field-Research-Ledger-artifact-auditor"})
            with urlopen(request, timeout=timeout) as response:
                return response.status
        except HTTPError as error:
            if method == "HEAD" and error.code == 405:
                continue
            return error.code
        except (URLError, ValueError):
            return None
    return None


def audit_record(record: dict, timeout: int) -> dict:
    kind, path = normalize_artifact(record["artifact"])
    result = {**record, "kind": kind, "path": path, "httpStatus": None}
    if kind == "pattern":
        return {**result, "status": "needs-path"}
    if kind == "commit-reference":
        return {**result, "status": "commit-reference"}
    raw_url, web_url = urls_for(record["source"], path)
    status_code = http_status(raw_url, timeout)
    status = "verified" if status_code == 200 else "unavailable" if status_code == 404 else "needs-audit"
    return {**result, "rawUrl": raw_url, "webUrl": web_url, "httpStatus": status_code, "status": status}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--timeout", type=int, default=20)
    arguments = parser.parse_args()
    catalogs = [
        (arguments.project_root / "client/src/lib/experimentData.ts", DEFAULT_SOURCE),
        (arguments.project_root / "client/src/lib/historicalExperiments.ts", DEFAULT_SOURCE),
        (arguments.project_root / "client/src/lib/pipelinePertandanExperiments.ts", PIPELINE_PERTANDAN_SOURCE),
    ]
    missing = [str(path) for path, _ in catalogs if not path.exists()]
    if missing:
        print(f"Katalog tidak ditemukan: {', '.join(missing)}", file=sys.stderr)
        return 2
    records = [
        record
        for catalog, fallback in catalogs
        for record in parse_catalog(catalog, fallback)
    ]
    results: list[dict] = [None] * len(records)
    with ThreadPoolExecutor(max_workers=max(1, arguments.workers)) as pool:
        pending = {pool.submit(audit_record, record, arguments.timeout): index for index, record in enumerate(records)}
        for future in as_completed(pending):
            results[pending[future]] = future.result()
    status_names = ("verified", "unavailable", "needs-path", "commit-reference", "needs-audit")
    report = {
        "schemaVersion": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "auditMethod": "HTTPS HEAD (fallback GET) ke raw.githubusercontent.com pada commit tersemat",
        "summary": {name: sum(item["status"] == name for item in results) for name in status_names},
        "records": results,
    }
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report["summary"], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
