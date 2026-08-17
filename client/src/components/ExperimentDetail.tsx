/** Field Research Ledger evidence sheet — detailed proof record for the selected completed experiment. */
import {
  datasetInfo,
  datasetRoots,
  defaultEra,
  experiments,
  statusInfo,
  type Experiment,
  type ExperimentStatus,
} from "@/lib/experimentData";
import { getEvidenceNarrative } from "@/lib/evidenceNarratives";
import artifactManifest from "@/lib/artifactManifest.json";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Database,
  ExternalLink,
  FileCode2,
  FileDown,
  Hash,
  Layers,
  Microscope,
  ScanSearch,
  Sigma,
  Waves,
  X,
} from "lucide-react";

interface ExperimentDetailProps {
  experiment: Experiment;
  onSelect: (id: string) => void;
}

const defaultSource = {
  repo: "https://github.com/muhammad-zainal-muttaqin/project-expertise",
  commit: "225faaeb",
};
type AuditState =
  | "verified"
  | "unavailable"
  | "needs-path"
  | "commit-reference"
  | "needs-audit";
type AuditRecord = {
  id: string;
  artifact: string;
  kind: "file" | "pattern" | "commit-reference";
  path: string | null;
  status: AuditState;
  httpStatus: number | null;
  rawUrl?: string;
  webUrl?: string;
};
const auditByArtifact = new Map<string, AuditRecord>(
  (artifactManifest.records as AuditRecord[]).map(record => [
    `${record.id}::${record.artifact}`,
    record,
  ])
);
const auditCopy: Record<
  AuditState,
  { label: string; note: string; className: string }
> = {
  verified: {
    label: "Terverifikasi",
    note: "Berkas tersedia pada commit yang diaudit.",
    className: "artifact-verified",
  },
  unavailable: {
    label: "Tidak tersedia",
    note: "Path ini memberi 404 pada commit yang diaudit.",
    className: "artifact-unavailable",
  },
  "needs-path": {
    label: "Perlu audit",
    note: "Ini pola beberapa berkas; satu path spesifik belum dapat diverifikasi.",
    className: "artifact-audit-needed",
  },
  "commit-reference": {
    label: "Rujukan commit",
    note: "Ini merujuk ke commit, bukan satu berkas yang dapat diaudit.",
    className: "artifact-audit-needed",
  },
  "needs-audit": {
    label: "Perlu audit",
    note: "Pemeriksaan HTTP belum memberi jawaban yang dapat dipakai.",
    className: "artifact-audit-needed",
  },
};

function getArtifactTarget(experiment: Experiment, artifact: string) {
  const audit = auditByArtifact.get(`${experiment.id}::${artifact}`);
  const source = experiment.source;
  const repo = source?.url.replace(/\/tree\/[^/]+$/, "") ?? defaultSource.repo;
  const commit = source?.commit ?? defaultSource.commit;
  const commitMatch = artifact.match(/^commit\s+([0-9a-f]{7,40})/i);
  if (commitMatch)
    return {
      href: `${repo}/commit/${commitMatch[1]}`,
      rawUrl: null,
      isDataFile: false,
      audit: auditCopy["commit-reference"],
    };
  if (audit) {
    return {
      href: audit.status === "verified" ? (audit.webUrl ?? null) : null,
      rawUrl: audit.status === "verified" ? (audit.rawUrl ?? null) : null,
      isDataFile:
        audit.status === "verified" && /\.(json|csv)$/i.test(audit.path ?? ""),
      audit: auditCopy[audit.status],
    };
  }
  if (artifact.includes("*"))
    return {
      href: null,
      rawUrl: null,
      isDataFile: false,
      audit: auditCopy["needs-path"],
    };
  const path = artifact.split(" §")[0].trim();
  return {
    href: `${repo}/blob/${commit}/${path}`,
    rawUrl: null,
    isDataFile: false,
    audit: auditCopy["needs-audit"],
  };
}

async function downloadArtifact(
  event: React.MouseEvent<HTMLAnchorElement>,
  rawUrl: string,
  filename: string
) {
  event.preventDefault();
  try {
    const response = await fetch(rawUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const objectUrl = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(rawUrl, "_blank", "noopener,noreferrer");
  }
}

const monthAbbr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
function formatAuditDate(value: string | undefined): string | null {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;
  return `${day} ${monthAbbr[monthIndex]} ${year}`;
}
const auditGeneratedAt = formatAuditDate(
  (artifactManifest as { generatedAt?: string }).generatedAt
);

/** Glossary — only terms that actually occur in the node currently open are shown, detected by a
 *  substring/regex test against conclusion, findings, and the label/value/note of every metric,
 *  perClass entry, and confidence note. */
const glossaryTerms: {
  term: string;
  definition: string;
  test: (text: string) => boolean;
}[] = [
  {
    term: "Class ±1",
    definition:
      "akurasi jumlah tandan per kelas kematangan dengan toleransi meleset paling banyak satu tandan.",
    test: text => text.includes("Class ±1"),
  },
  {
    term: "Tree ±1",
    definition:
      "akurasi jumlah tandan per pohon dengan toleransi meleset paling banyak satu tandan.",
    test: text => text.includes("Tree ±1"),
  },
  {
    term: "mAP50",
    definition:
      "rata-rata presisi deteksi pada ambang tumpang tindih IoU 0,50.",
    test: text => text.includes("mAP50"),
  },
  {
    term: "mAP50-95",
    definition:
      "rata-rata presisi deteksi yang dirata-ratakan pada ambang IoU 0,50 sampai 0,95.",
    test: text => text.includes("mAP50-95"),
  },
  {
    term: "MAE",
    definition:
      "rata-rata galat absolut antara jumlah prediksi dan jumlah sebenarnya.",
    test: text => text.includes("MAE"),
  },
  {
    term: "B1–B4",
    definition:
      "empat kelas kematangan tandan yang dipakai pada anotasi SawitMVC.",
    test: text => /\bB[1-4]\b/.test(text),
  },
  {
    term: "CI95",
    definition:
      "selang kepercayaan 95 persen; selang yang memuat nol berarti perbedaan tidak dapat dibedakan dari derau.",
    test: text => text.includes("CI95"),
  },
];
const statusGlossary: Record<ExperimentStatus, string> = {
  supported: "klaim node ini ditopang bukti pada protokol yang tercatat.",
  negative:
    "hipotesis node ini tidak terdukung; hasilnya sengaja dipertahankan sebagai jejak keputusan.",
  inconclusive: "bukti belum memisahkan efek dari derau.",
  audit_needed:
    "node ini mencatat batas validitas atau hasil audit, bukan klaim performa.",
};

function glossaryEntriesFor(experiment: Experiment) {
  const metricParts = experiment.metrics.flatMap(metric => [
    metric.label,
    metric.value,
    metric.note ?? "",
  ]);
  const perClassParts = (experiment.perClass ?? []).flatMap(metric => [
    metric.label,
    metric.value,
    metric.note ?? "",
  ]);
  const confidenceParts = experiment.confidence
    ? [experiment.confidence.label, experiment.confidence.value]
    : [];
  const text = [
    experiment.conclusion,
    experiment.findings,
    ...metricParts,
    ...perClassParts,
    ...confidenceParts,
  ].join(" ");
  return glossaryTerms.filter(entry => entry.test(text));
}

/** Lineage — parentIds resolve either to a sibling experiment (selectable) or a dataset root
 *  (shown as plain text; roots are not selectable nodes). Children are found by scanning every
 *  experiment whose parentIds includes this node's id. */
type LineageEntry = { id: string; label: string; selectable: boolean };
function lineageParents(experiment: Experiment): LineageEntry[] {
  return experiment.parentIds
    .map(id => {
      const node = experiments.find(item => item.id === id);
      if (node)
        return { id, label: `${node.id} · ${node.title}`, selectable: true };
      const root = datasetRoots.find(item => item.id === id);
      if (root) return { id, label: root.label, selectable: false };
      return null;
    })
    .filter((entry): entry is LineageEntry => entry !== null);
}
function lineageChildren(experiment: Experiment): LineageEntry[] {
  return experiments
    .filter(item => item.parentIds.includes(experiment.id))
    .map(item => ({
      id: item.id,
      label: `${item.id} · ${item.title}`,
      selectable: true,
    }));
}

export function ExperimentDetail({
  experiment,
  onSelect,
}: ExperimentDetailProps) {
  const status = statusInfo[experiment.status];
  const narrative = getEvidenceNarrative(experiment);
  const sourceUrl =
    experiment.source?.url ??
    "https://github.com/muhammad-zainal-muttaqin/project-expertise";
  const sourceLabel = experiment.source
    ? `${experiment.source.repo} · ${experiment.source.commit}`
    : "project-expertise · 225faaeb";
  const parentEntries = lineageParents(experiment);
  const childEntries = lineageChildren(experiment);
  const glossaryEntries = glossaryEntriesFor(experiment);
  return (
    <aside className="evidence-sheet" aria-live="polite">
      <div className="sheet-topline">
        <span className={`status-stamp ${status.className}`}>
          {status.label}
        </span>
      </div>
      <div className="sheet-kicker">
        <Hash size={14} />
        {experiment.id}
      </div>
      <h2>{experiment.title}</h2>
      <p className="sheet-conclusion">
        <strong>Kesimpulan singkat.</strong> {experiment.conclusion}
      </p>
      <div className="sheet-meta-grid">
        <div>
          <Database size={14} />
          <span>Dataset</span>
          <strong>{datasetInfo[experiment.dataset].short}</strong>
        </div>
        <div>
          <Microscope size={14} />
          <span>Model / metode</span>
          <strong>{experiment.model}</strong>
        </div>
        <div>
          <CalendarDays size={14} />
          <span>Tanggal</span>
          <strong>{experiment.date}</strong>
        </div>
        <div>
          <ScanSearch size={14} />
          <span>Protokol uji</span>
          <strong>{experiment.seeds}</strong>
        </div>
        <div>
          <Layers size={14} />
          <span>Keluarga riset</span>
          <strong>{experiment.phase}</strong>
        </div>
        <div>
          <Waves size={14} />
          <span>Kanal / metode</span>
          <strong>{experiment.inputs.join(" · ")}</strong>
        </div>
      </div>
      <section className="sheet-section reader-summary">
        <div className="section-title">
          <span>Cerita kerja</span>
          <small>{narrative.kind}</small>
        </div>
        <div className="reader-summary-grid">
          <article className="reader-card--work">
            <span>Yang dikerjakan</span>
            <p>{narrative.work}</p>
          </article>
          {narrative.evidence && (
            <article className="reader-card--evidence">
              <span>Bukti yang ditemukan</span>
              <p>{narrative.evidence}</p>
            </article>
          )}
          <article className="reader-card--impact">
            <span>Keputusan setelahnya</span>
            <p>{narrative.impact}</p>
          </article>
          {narrative.caution && (
            <article className="reader-card--caution">
              <span>Batas pembacaan</span>
              <p>{narrative.caution}</p>
            </article>
          )}
        </div>
      </section>
      <section className="sheet-section">
        <div className="section-title">
          <span>Angka utama</span>
          <small>rincian teknis</small>
        </div>
        <dl className="metric-list">
          {experiment.metrics.map(metric => (
            <div key={metric.label}>
              <dt>
                {metric.label}
                {metric.note && <small>{metric.note}</small>}
              </dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      {experiment.perClass && (
        <section className="sheet-section">
          <div className="section-title">
            <span>Catatan tambahan</span>
            <small>kelas atau konteks</small>
          </div>
          <dl className="metric-list compact">
            {experiment.perClass.map(metric => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {experiment.confidence && (
        <section className="confidence-note">
          <Sigma size={15} />
          <div>
            <span>{experiment.confidence.label}</span>
            <strong>{experiment.confidence.value}</strong>
          </div>
        </section>
      )}
      <section className="sheet-section">
        <div className="section-title">
          <span>Penjelasan teknis</span>
          <small>untuk pembacaan lebih lanjut</small>
        </div>
        <p className="finding-text">{experiment.findings}</p>
      </section>
      {(parentEntries.length > 0 || childEntries.length > 0) && (
        <section className="sheet-section lineage-section">
          <div className="section-title">
            <span>Rantai lineage</span>
          </div>
          {parentEntries.length > 0 && (
            <div className="lineage-row">
              <span className="lineage-row-label">Induk</span>
              <div className="lineage-chips">
                {parentEntries.map(entry =>
                  entry.selectable ? (
                    <button
                      type="button"
                      key={entry.id}
                      className="lineage-chip"
                      onClick={() => onSelect(entry.id)}
                    >
                      {entry.label}
                    </button>
                  ) : (
                    <span
                      key={entry.id}
                      className="lineage-chip lineage-chip--root"
                    >
                      {entry.label}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
          {childEntries.length > 0 && (
            <div className="lineage-row">
              <span className="lineage-row-label">Turunan</span>
              <div className="lineage-chips">
                {childEntries.map(entry => (
                  <button
                    type="button"
                    key={entry.id}
                    className="lineage-chip"
                    onClick={() => onSelect(entry.id)}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
      <section className="sheet-section glossary-section">
        <div className="section-title">
          <span>Arti istilah</span>
        </div>
        <dl className="term-list">
          {glossaryEntries.map(entry => (
            <div key={entry.term}>
              <dt>{entry.term}</dt>
              <dd>{entry.definition}</dd>
            </div>
          ))}
          <div>
            <dt>{status.label}</dt>
            <dd>{statusGlossary[experiment.status]}</dd>
          </div>
        </dl>
      </section>
      <section className="sheet-section provenance-section">
        <div className="section-title">
          <span>Jejak sumber</span>
          <small>audit sumber</small>
        </div>
        <div className="provenance-card">
          <span>Era penelitian</span>
          <strong>{experiment.era ?? defaultEra}</strong>
          <span>Repositori / commit</span>
          <code>{sourceLabel}</code>
        </div>
      </section>
      <section className="sheet-section artifact-section">
        <div className="section-title">
          <span>File pendukung</span>
          <small>
            {experiment.artifacts.length} berkas
            {auditGeneratedAt ? ` · audit ${auditGeneratedAt}` : ""}
          </small>
        </div>
        <div className="artifact-list">
          {experiment.artifacts.map(artifact => {
            const target = getArtifactTarget(experiment, artifact);
            const StatusIcon =
              target.audit.className === "artifact-verified"
                ? Check
                : target.audit.className === "artifact-unavailable"
                  ? X
                  : ScanSearch;
            const filename =
              artifact.split("/").pop()?.split(" §")[0] || "artefak";
            return (
              <div
                className={`artifact-item ${target.audit.className}`}
                key={artifact}
                title={target.audit.note}
              >
                <div className="artifact-item-top">
                  {target.href ? (
                    <a
                      className="artifact-primary-link"
                      href={target.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Buka ${artifact} pada sumber yang diaudit`}
                    >
                      <code>{artifact}</code>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <div className="artifact-primary-label">
                      <code>{artifact}</code>
                    </div>
                  )}
                  <span className="artifact-status">
                    <StatusIcon size={12} aria-hidden="true" />
                    {target.audit.label}
                  </span>
                </div>
                {target.isDataFile && target.rawUrl && (
                  <div
                    className="artifact-actions"
                    aria-label={`Akses langsung ${artifact}`}
                  >
                    <a
                      className="artifact-raw-btn"
                      href={target.rawUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FileCode2 size={12} />
                      Raw
                    </a>
                    <a
                      className="artifact-download-btn"
                      href={target.rawUrl}
                      download={filename}
                      onClick={event =>
                        downloadArtifact(event, target.rawUrl!, filename)
                      }
                    >
                      <FileDown size={12} />
                      Unduh
                    </a>
                  </div>
                )}
                {target.audit.className !== "artifact-verified" && (
                  <small className="artifact-audit-note">
                    {target.audit.note}
                  </small>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <a
        className="repo-link"
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
      >
        Buka sumber pada commit yang diaudit <ArrowUpRight size={15} />
      </a>
    </aside>
  );
}
