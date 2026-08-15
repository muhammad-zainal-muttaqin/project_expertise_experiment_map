/** Field Research Ledger evidence sheet — detailed proof record for the selected completed experiment. */
import { datasetInfo, statusInfo, type Experiment } from "@/lib/experimentData";
import { ArrowUpRight, CalendarDays, Database, ExternalLink, GitBranch, Hash, Microscope, ScanSearch } from "lucide-react";

interface ExperimentDetailProps {
  experiment: Experiment;
}

function makeReaderSummary(experiment: Experiment) {
  const dataset = datasetInfo[experiment.dataset].short;
  const inputs = experiment.inputs.length ? experiment.inputs.join(" + ") : "data yang tersedia";
  const referenceMetric = experiment.metrics[0];
  const statusMeaning: Record<Experiment["status"], string> = {
    supported: "Temuan ini memberi alasan untuk melanjutkan pendekatan tersebut, tetapi tetap perlu dibaca bersama metrik dan batas evaluasinya.",
    negative: "Jalur ini belum mengalahkan pembanding yang ada. Itu tetap berguna karena membantu menghindari percobaan lanjutan yang kemungkinan tidak efisien.",
    inconclusive: "Arahnya belum cukup jelas untuk mengambil keputusan besar. Perlu data, pengulangan, atau evaluasi tambahan sebelum menyebutnya sebagai peningkatan.",
    audit_needed: "Node ini terutama dipakai untuk memeriksa mutu bukti. Hasilnya membantu menentukan seberapa jauh klaim eksperimen lain boleh dipercaya.",
  };

  return {
    tried: `Percobaan ini memakai ${experiment.model} pada ${dataset} dengan masukan ${inputs}. Tujuannya adalah menguji apakah pilihan tersebut memberi hasil yang lebih baik dibanding jalur riset yang sudah ada.`,
    result: referenceMetric
      ? `Angka rujukan yang paling mudah dibaca adalah ${referenceMetric.label}: ${referenceMetric.value}${referenceMetric.note ? ` (${referenceMetric.note})` : ""}. ${experiment.conclusion}`
      : experiment.conclusion,
    meaning: statusMeaning[experiment.status],
    caution: `Batas yang perlu diingat: ${experiment.findings}`,
  };
}

export function ExperimentDetail({ experiment }: ExperimentDetailProps) {
  const status = statusInfo[experiment.status];
  const summary = makeReaderSummary(experiment);
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
        <div className="section-title"><span>Mulai dari sini</span><small>ringkasan untuk pembaca baru</small></div>
        <div className="reader-summary-grid">
          <article><span>Apa yang dicoba?</span><p>{summary.tried}</p></article>
          <article><span>Apa hasilnya?</span><p>{summary.result}</p></article>
          <article><span>Mengapa ini penting?</span><p>{summary.meaning}</p></article>
          <article><span>Apa batasnya?</span><p>{summary.caution}</p></article>
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
      <section className="sheet-section artifact-section"><div className="section-title"><span>File pendukung</span><small>{experiment.artifacts.length} berkas</small></div><div className="artifact-list">{experiment.artifacts.map((artifact) => <a key={artifact} href={sourceUrl} target="_blank" rel="noreferrer"><code>{artifact}</code><ExternalLink size={13} /></a>)}</div></section>
      <a className="repo-link" href={sourceUrl} target="_blank" rel="noreferrer">Buka sumber pada commit yang diaudit <ArrowUpRight size={15} /></a>
    </aside>
  );
}
