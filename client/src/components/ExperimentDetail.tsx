/** Field Research Ledger evidence sheet — detailed proof record for the selected completed experiment. */
import { datasetInfo, statusInfo, type Experiment } from "@/lib/experimentData";
import { getEvidenceNarrative } from "@/lib/evidenceNarratives";
import artifactManifest from "@/lib/artifactManifest.json";
import { ArrowUpRight, CalendarDays, Check, Database, ExternalLink, FileCode2, FileDown, GitBranch, Hash, Microscope, ScanSearch, X } from "lucide-react";

interface ExperimentDetailProps {
  experiment: Experiment;
}

const defaultSource = { repo: "https://github.com/muhammad-zainal-muttaqin/project-expertise", commit: "225faaeb" };
type AuditState = "verified" | "unavailable" | "needs-path" | "commit-reference" | "needs-audit";
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
const auditByArtifact = new Map<string, AuditRecord>((artifactManifest.records as AuditRecord[]).map((record) => [`${record.id}::${record.artifact}`, record]));
const auditCopy: Record<AuditState, { label: string; note: string; className: string }> = {
  verified: { label: "Terverifikasi", note: "Berkas tersedia pada commit yang diaudit.", className: "artifact-verified" },
  unavailable: { label: "Tidak tersedia", note: "Path ini memberi 404 pada commit yang diaudit.", className: "artifact-unavailable" },
  "needs-path": { label: "Perlu audit", note: "Ini pola beberapa berkas; satu path spesifik belum dapat diverifikasi.", className: "artifact-audit-needed" },
  "commit-reference": { label: "Rujukan commit", note: "Ini merujuk ke commit, bukan satu berkas yang dapat diaudit.", className: "artifact-audit-needed" },
  "needs-audit": { label: "Perlu audit", note: "Pemeriksaan HTTP belum memberi jawaban yang dapat dipakai.", className: "artifact-audit-needed" },
};

function getArtifactTarget(experiment: Experiment, artifact: string) {
  const audit = auditByArtifact.get(`${experiment.id}::${artifact}`);
  const source = experiment.source;
  const repo = source?.url.replace(/\/tree\/[^/]+$/, "") ?? defaultSource.repo;
  const commit = source?.commit ?? defaultSource.commit;
  const commitMatch = artifact.match(/^commit\s+([0-9a-f]{7,40})/i);
  if (commitMatch) return { href: `${repo}/commit/${commitMatch[1]}`, rawUrl: null, isDataFile: false, audit: auditCopy["commit-reference"] };
  if (audit) {
    return {
      href: audit.status === "verified" ? audit.webUrl ?? null : null,
      rawUrl: audit.status === "verified" ? audit.rawUrl ?? null : null,
      isDataFile: audit.status === "verified" && /\.(json|csv)$/i.test(audit.path ?? ""),
      audit: auditCopy[audit.status],
    };
  }
  if (artifact.includes("*")) return { href: null, rawUrl: null, isDataFile: false, audit: auditCopy["needs-path"] };
  const path = artifact.split(" §")[0].trim();
  return { href: `${repo}/blob/${commit}/${path}`, rawUrl: null, isDataFile: false, audit: auditCopy["needs-audit"] };
}

async function downloadArtifact(event: React.MouseEvent<HTMLAnchorElement>, rawUrl: string, filename: string) {
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

export function ExperimentDetail({ experiment }: ExperimentDetailProps) {
  const status = statusInfo[experiment.status];
  const narrative = getEvidenceNarrative(experiment);
  const sourceUrl = experiment.source?.url ?? "https://github.com/muhammad-zainal-muttaqin/project-expertise";
  const sourceLabel = experiment.source ? `${experiment.source.repo} · ${experiment.source.commit}` : "project-expertise · 225faaeb";
  return (
    <aside className="evidence-sheet" aria-live="polite">
      <div className="sheet-topline"><span className={`status-stamp ${status.className}`}>{status.label}</span><span>{experiment.phase}</span></div>
      <div className="sheet-kicker"><Hash size={14} />{experiment.id}</div>
      <h2>{experiment.title}</h2>
      <p className="sheet-conclusion"><strong>Kesimpulan singkat.</strong> {experiment.conclusion}</p>
      <div className="sheet-meta-grid">
        <div><Database size={14} /><span>Dataset</span><strong>{datasetInfo[experiment.dataset].short}</strong></div>
        <div><Microscope size={14} /><span>Model / metode</span><strong>{experiment.model}</strong></div>
        <div><CalendarDays size={14} /><span>Tanggal</span><strong>{experiment.date}</strong></div>
        <div><ScanSearch size={14} /><span>Pengulangan uji</span><strong>{experiment.seeds}</strong></div>
      </div>
      <section className="sheet-section reader-summary">
        <div className="section-title"><span>Cerita kerja</span><small>{narrative.kind}</small></div>
        <div className="reader-summary-grid">
          <article><span>Yang dikerjakan</span><p>{narrative.work}</p></article>
          <article><span>Bukti yang ditemukan</span><p>{narrative.evidence}</p></article>
          <article><span>Keputusan setelahnya</span><p>{narrative.impact}</p></article>
          <article><span>Batas pembacaan</span><p>{narrative.caution}</p></article>
        </div>
      </section>
      <section className="sheet-section">
        <div className="section-title"><span>Angka utama</span><small>rincian teknis · {experiment.inputs.join(" · ")}</small></div>
        <dl className="metric-list">{experiment.metrics.map((metric) => <div key={metric.label}><dt>{metric.label}{metric.note && <small>{metric.note}</small>}</dt><dd>{metric.value}</dd></div>)}</dl>
      </section>
      {experiment.perClass && <section className="sheet-section"><div className="section-title"><span>Catatan tambahan</span><small>kelas atau konteks</small></div><dl className="metric-list compact">{experiment.perClass.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl></section>}
      {experiment.confidence && <section className="confidence-note"><GitBranch size={15} /><div><span>{experiment.confidence.label}</span><strong>{experiment.confidence.value}</strong></div></section>}
      <section className="sheet-section"><div className="section-title"><span>Penjelasan teknis</span><small>untuk pembacaan lebih lanjut</small></div><p className="finding-text">{experiment.findings}</p></section>
      <section className="sheet-section provenance-section"><div className="section-title"><span>Jejak sumber</span><small>audit sumber</small></div><div className="provenance-card"><span>Era penelitian</span><strong>{experiment.era ?? "project-expertise · Agustus 2026"}</strong><span>Repositori / commit</span><code>{sourceLabel}</code></div></section>
      <section className="sheet-section artifact-section"><div className="section-title"><span>File pendukung</span><small>{experiment.artifacts.length} berkas</small></div><div className="artifact-list">{experiment.artifacts.map((artifact) => {
        const target = getArtifactTarget(experiment, artifact);
        const StatusIcon = target.audit.className === "artifact-verified" ? Check : target.audit.className === "artifact-unavailable" ? X : ScanSearch;
        const filename = artifact.split("/").pop()?.split(" §")[0] || "artefak";
        return <div className={`artifact-item ${target.audit.className}`} key={artifact} title={target.audit.note}>
          <div className="artifact-item-top">
            {target.href
              ? <a className="artifact-primary-link" href={target.href} target="_blank" rel="noreferrer" aria-label={`Buka ${artifact} pada sumber yang diaudit`}><code>{artifact}</code><ExternalLink size={13} /></a>
              : <div className="artifact-primary-label"><code>{artifact}</code></div>}
            <span className="artifact-status"><StatusIcon size={12} aria-hidden="true" />{target.audit.label}</span>
          </div>
          {target.isDataFile && target.rawUrl && <div className="artifact-actions" aria-label={`Akses langsung ${artifact}`}>
            <a className="artifact-raw-btn" href={target.rawUrl} target="_blank" rel="noreferrer"><FileCode2 size={12} />Raw</a>
            <a className="artifact-download-btn" href={target.rawUrl} download={filename} onClick={(event) => downloadArtifact(event, target.rawUrl!, filename)}><FileDown size={12} />Unduh</a>
          </div>}
          {target.audit.className !== "artifact-verified" && <small className="artifact-audit-note">{target.audit.note}</small>}
        </div>;
      })}</div></section>
      <a className="repo-link" href={sourceUrl} target="_blank" rel="noreferrer">Buka sumber pada commit yang diaudit <ArrowUpRight size={15} /></a>
    </aside>
  );
}
