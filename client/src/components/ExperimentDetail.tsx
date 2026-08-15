/** Field Research Ledger evidence sheet — detailed proof record for the selected completed experiment. */
import { datasetInfo, statusInfo, type Experiment } from "@/lib/experimentData";
import { ArrowUpRight, CalendarDays, Database, ExternalLink, GitBranch, Hash, Microscope, ScanSearch } from "lucide-react";

interface ExperimentDetailProps {
  experiment: Experiment;
}

export function ExperimentDetail({ experiment }: ExperimentDetailProps) {
  const status = statusInfo[experiment.status];
  return (
    <aside className="evidence-sheet" aria-live="polite">
      <div className="sheet-topline"><span className={`status-stamp ${status.className}`}>{status.label}</span><span>{experiment.phase}</span></div>
      <div className="sheet-kicker"><Hash size={14} />{experiment.id}</div>
      <h2>{experiment.title}</h2>
      <p className="sheet-conclusion">{experiment.conclusion}</p>
      <div className="sheet-meta-grid">
        <div><Database size={14} /><span>Dataset</span><strong>{datasetInfo[experiment.dataset].short}</strong></div>
        <div><Microscope size={14} /><span>Model / metode</span><strong>{experiment.model}</strong></div>
        <div><CalendarDays size={14} /><span>Tanggal</span><strong>{experiment.date}</strong></div>
        <div><ScanSearch size={14} /><span>Seed / replikasi</span><strong>{experiment.seeds}</strong></div>
      </div>
      <section className="sheet-section">
        <div className="section-title"><span>Metrik tercatat</span><small>{experiment.inputs.join(" · ")}</small></div>
        <dl className="metric-list">{experiment.metrics.map((metric) => <div key={metric.label}><dt>{metric.label}{metric.note && <small>{metric.note}</small>}</dt><dd>{metric.value}</dd></div>)}</dl>
      </section>
      {experiment.perClass && <section className="sheet-section"><div className="section-title"><span>Per kelas / konteks</span></div><dl className="metric-list compact">{experiment.perClass.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl></section>}
      {experiment.confidence && <section className="confidence-note"><GitBranch size={15} /><div><span>{experiment.confidence.label}</span><strong>{experiment.confidence.value}</strong></div></section>}
      <section className="sheet-section"><div className="section-title"><span>Catatan interpretasi</span></div><p className="finding-text">{experiment.findings}</p></section>
      <section className="sheet-section artifact-section"><div className="section-title"><span>Artefak sumber</span><small>{experiment.artifacts.length} berkas</small></div><div className="artifact-list">{experiment.artifacts.map((artifact) => <a key={artifact} href="https://github.com/muhammad-zainal-muttaqin/project-expertise" target="_blank" rel="noreferrer"><code>{artifact}</code><ExternalLink size={13} /></a>)}</div></section>
      <a className="repo-link" href="https://github.com/muhammad-zainal-muttaqin/project-expertise" target="_blank" rel="noreferrer">Lihat repositori pada commit audited <ArrowUpRight size={15} /></a>
    </aside>
  );
}
