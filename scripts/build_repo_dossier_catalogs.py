#!/usr/bin/env python3
"""Mengisi lampiran katalog path primer ke empat dossier audit repositori.

Dokumen dossier berisi sintesis yang ditulis manusia. Skrip ini menambahkan
tautan satu-per-satu ke dokumen naratif, hasil terstruktur, dan kode/config
yang dapat ditinjau ulang pada commit sumber yang sama dengan atlas.
"""

from __future__ import annotations

import subprocess
from collections import Counter
from pathlib import Path
from urllib.parse import quote


PROJECT = Path(__file__).resolve().parents[1]
START = "<!-- AUTO_CATALOG_START -->"
END = "<!-- AUTO_CATALOG_END -->"
DIRECT_PATH_LIMIT = 80

REPOSITORIES = (
    {
        "name": "project-expertise",
        "checkout": Path("/home/ubuntu/project-expertise"),
        "web": "https://github.com/muhammad-zainal-muttaqin/project-expertise",
        "document": PROJECT / "docs/REPOSITORY-AUDIT-PROJECT-EXPERTISE.md",
        "sources": (
            {"label": "Snapshot Volume 2", "commit": "225faaeb"},
            {
                "label": "Cabang pipeline per-tandan",
                "commit": "c19906bbfbb4",
                "prefix": "pipeline-pertandan/",
            },
            {
                "label": "Batch eksperimen terbaru",
                "commit": "5d13720ee9c29faae0e60a8d1d00e0af9068646c",
            },
        ),
    },
    {
        "name": "Research-Pipeline",
        "checkout": Path("/home/ubuntu/Research-Pipeline"),
        "commit": "4aa9ad6",
        "web": "https://github.com/muhammad-zainal-muttaqin/Research-Pipeline",
        "document": PROJECT / "docs/REPOSITORY-AUDIT-RESEARCH-PIPELINE.md",
    },
    {
        "name": "Baseline-SawitMVC",
        "checkout": Path("/home/ubuntu/Baseline-SawitMVC"),
        "commit": "ee2f0ac",
        "web": "https://github.com/ULM-SawitMVC/Baseline-SawitMVC",
        "document": PROJECT / "docs/REPOSITORY-AUDIT-BASELINE-SAWITMVC.md",
    },
    {
        "name": "research-method-dedup",
        "checkout": Path("/home/ubuntu/research-method-dedup"),
        "commit": "a720f17",
        "web": "https://github.com/muhammad-zainal-muttaqin/research-method-dedup",
        "document": PROJECT / "docs/REPOSITORY-AUDIT-RESEARCH-METHOD-DEDUP.md",
    },
)


def git_paths(checkout: Path, commit: str) -> list[str]:
    completed = subprocess.run(
        ["git", "-C", str(checkout), "ls-tree", "-r", "--name-only", commit],
        check=True,
        capture_output=True,
        text=True,
    )
    return [line for line in completed.stdout.splitlines() if line]


def link(repo: dict, path: str) -> str:
    safe_path = quote(path, safe="/")
    return f"[`{path}`]({repo['web']}/blob/{repo['commit']}/{safe_path})"


def within_annotation_payload(path: str) -> bool:
    return path.startswith("Brand-New-Dataset-YOLO/labels/") or path.startswith(
        "Brand-New-Dataset-YOLO/images/"
    ) or path.startswith("Brand-New-Dataset-YOLO/json/")


def split_large_directories(paths: list[str]) -> tuple[list[str], list[tuple[str, int]]]:
    """Kelompokkan direktori berisi sangat banyak file otomatis/arsip.

    Setiap direktori tetap diberi tautan ke pohon commit. Hal ini menghindari
    belasan ribu baris tautan instance yang tidak menambah pembacaan audit,
    sembari tetap memberi akses manual ke seluruh JSON, CSV, log, atau prediksi.
    """
    root_counts = Counter(path.split("/", 1)[0] for path in paths)
    grouped_roots = {root for root, count in root_counts.items() if count > DIRECT_PATH_LIMIT}
    direct = [path for path in paths if path.split("/", 1)[0] not in grouped_roots]
    grouped = sorted((root, root_counts[root]) for root in grouped_roots)
    return direct, grouped


def section(title: str, paths: list[str], repo: dict, empty: str) -> list[str]:
    lines = [f"### {title}", ""]
    if not paths:
        lines.extend([empty, ""])
        return lines
    direct, grouped = split_large_directories(paths)
    lines.extend([f"- {link(repo, path)}" for path in direct])
    if grouped:
        lines.extend(["", "| Direktori bervolume tinggi | Jumlah path | Inspeksi manual |", "|---|---:|---|"])
        for directory, count in grouped:
            safe_dir = quote(directory, safe="/")
            lines.append(
                f"| `{directory}/` | {count} | [Buka seluruh isi pada commit]({repo['web']}/tree/{repo['commit']}/{safe_dir}) |"
            )
    lines.append("")
    return lines


def build_catalog_section(repo: dict, source: dict, include_heading: bool) -> list[str]:
    source_repo = {**repo, "commit": source["commit"]}
    paths = git_paths(source_repo["checkout"], source_repo["commit"])
    prefix = source.get("prefix")
    if prefix:
        paths = [path for path in paths if path.startswith(prefix)]
    narrative_ext = {".md", ".txt", ".rst"}
    result_ext = {".json", ".csv", ".parquet", ".npz"}
    code_ext = {".py", ".sh", ".yaml", ".yml", ".toml", ".ipynb"}

    narrative = [p for p in paths if Path(p).suffix.lower() in narrative_ext and not within_annotation_payload(p)]
    structured = [p for p in paths if Path(p).suffix.lower() in result_ext and not within_annotation_payload(p)]
    code = [p for p in paths if Path(p).suffix.lower() in code_ext]

    annotation = [p for p in paths if within_annotation_payload(p)]
    annotation_dirs = Counter("/".join(p.split("/")[:2]) for p in annotation)
    suffixes = Counter(Path(p).suffix.lower() or "tanpa ekstensi" for p in paths)

    lines = []
    if include_heading:
        lines.extend(
            [
                f"### {source['label']} — commit `{source_repo['commit']}`",
                "",
            ]
        )
    lines.extend(
        [
        "| Inventaris | Jumlah | Keterangan |",
        "|---|---:|---|",
        f"| Seluruh path Git | {len(paths)} | [Buka pohon commit]({source_repo['web']}/tree/{source_repo['commit']}) |",
        f"| Dokumen naratif / log | {len(narrative)} | Markdown, TXT, atau RST di luar payload anotasi |",
        f"| Hasil terstruktur | {len(structured)} | JSON, CSV, Parquet, atau NPZ di luar payload anotasi |",
        f"| Kode dan konfigurasi | {len(code)} | Python, shell, YAML, TOML, atau notebook |",
        f"| Payload anotasi atau citra dikelompokkan | {len(annotation)} | Diwakili direktori agar catalogue tetap dapat dibaca |",
        "",
            ]
        )
    lines += section("Dokumen Naratif dan Log", narrative, source_repo, "Tidak ada dokumen naratif pada commit ini.")
    lines += section("Hasil Terstruktur — JSON, CSV, Parquet, NPZ", structured, source_repo, "Tidak ada hasil terstruktur pada commit ini.")
    lines += section("Kode, Konfigurasi, dan Notebook", code, source_repo, "Tidak ada kode atau konfigurasi pada commit ini.")

    lines.extend(["### Payload Anotasi atau Citra yang Dikelompokkan", ""])
    if annotation_dirs:
        lines.extend(["| Direktori | Jumlah path | Inspeksi |", "|---|---:|---|"])
        for directory, count in sorted(annotation_dirs.items()):
            lines.append(
                f"| `{directory}/` | {count} | [Buka direktori]({source_repo['web']}/tree/{source_repo['commit']}/{quote(directory, safe='/')}) |"
            )
        lines.append("")
    else:
        lines.extend(["Tidak ada payload anotasi atau citra yang perlu dikelompokkan.", ""])

    lines.extend(["### Komposisi Ekstensi Pohon Git", "", "| Ekstensi | Jumlah path |", "|---|---:|"])
    for suffix, count in sorted(suffixes.items(), key=lambda item: (-item[1], item[0])):
        lines.append(f"| `{suffix}` | {count} |")
    return lines


def build_catalog(repo: dict) -> str:
    sources = repo.get("sources")
    if sources is None:
        sources = ({"label": "Commit sumber", "commit": repo["commit"]},)
    lines = [
        START,
        "## Lampiran A — Katalog Artefak yang Dapat Diaudit",
        "",
        "Lampiran ini digenerasi dari pohon Git pada commit yang dinyatakan di bagian identitas. Setiap tautan file memakai commit tersemat, sehingga isinya tidak bergerak ketika cabang `main` berubah. Katalog sengaja memisahkan narasi, hasil terstruktur, dan kode. Payload anotasi per-gambar tidak direntangkan ribuan baris; ia diringkas sebagai kelompok direktori dan dapat dibuka dari pohon commit.",
        "",
    ]
    multiple_sources = len(sources) > 1
    for index, source in enumerate(sources):
        if index:
            lines.extend(["---", ""])
        lines.extend(build_catalog_section(repo, source, multiple_sources))
    lines.extend([END])
    return "\n".join(lines)


def replace_catalog(document: Path, catalog: str) -> None:
    text = document.read_text(encoding="utf-8")
    start = text.find(START)
    end = text.find(END)
    if start == -1 or end == -1 or end < start:
        raise ValueError(f"Penanda katalog tidak lengkap pada {document}")
    end += len(END)
    document.write_text(text[:start] + catalog + text[end:], encoding="utf-8")


def main() -> None:
    for repo in REPOSITORIES:
        replace_catalog(repo["document"], build_catalog(repo))
        print(f"Katalog diperbarui: {repo['document'].name}")


if __name__ == "__main__":
    main()
