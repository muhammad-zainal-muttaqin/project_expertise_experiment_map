/** Field Research Ledger evidence sheet — detailed proof record for the selected completed experiment. */
import { datasetInfo, statusInfo, type Experiment } from "@/lib/experimentData";
import { getEvidenceNarrative } from "@/lib/evidenceNarratives";
import { ArrowUpRight, CalendarDays, Database, ExternalLink, GitBranch, Hash, Microscope, ScanSearch } from "lucide-react";

interface ExperimentDetailProps {
  experiment: Experiment;
}

const defaultSource = { repo: "https://github.com/muhammad-zainal-muttaqin/project-expertise", commit: "225faaeb" };
const unavailableAtPinnedCommit = new Set([
  "runs_fase6/sd101_rgb/hasil.json",
  "runs_fase6/pre953v2/hasil.json",
]);

function getArtifactTarget(experiment: Experiment, artifact: string) {
  const source = experiment.source;
  const repo = source?.url.replace(/\/tree\/[^/]+$/, "") ?? defaultSource.repo;
  const commit = source?.commit ?? defaultSource.commit;
  const commitMatch = artifact.match(/^commit\s+([0-9a-f]{7,40})/i);
  if (commitMatch) return { href: `${repo}/commit/${commitMatch[1]}`, note: "commit yang dirujuk" };
  if (artifact.includes("*")) return { href: null, note: "pola beberapa berkas; path tunggal belum diaudit" };
  const path = artifact.split(" §")[0].trim();
  if (repo === defaultSource.repo && commit === defaultSource.commit && unavailableAtPinnedCommit.has(path)) {
    return { href: null, note: `tidak tersedia pada commit ${commit}` };
  }
  return { href: `${repo}/blob/${commit}/${path}`, note: `berkas pada commit ${commit}` };
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
        return target.href
          ? <a key={artifact} href={target.href} target="_blank" rel="noreferrer" title={target.note} aria-label={`Buka ${artifact} pada sumber yang diaudit`}><code>{artifact}</code><ExternalLink size={13} /></a>
          : <div className="artifact-unavailable" key={artifact} title={target.note}><code>{artifact}</code><small>{target.note}</small></div>;
      })}</div></section>
      <a className="repo-link" href={sourceUrl} target="_blank" rel="noreferrer">Buka sumber pada commit yang diaudit <ArrowUpRight size={15} /></a>
    </aside>
  );
}
