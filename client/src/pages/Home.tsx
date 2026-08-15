/** Field Research Ledger home — three-rail experimental archive, deliberately dense but traceable. */
import { ExperimentDetail } from "@/components/ExperimentDetail";
import { ExperimentGraph } from "@/components/ExperimentGraph";
import { FilterBar, type AtlasFilters } from "@/components/FilterBar";
import { datasetInfo, experiments, statusInfo, type ExperimentStatus } from "@/lib/experimentData";
import { BookMarked, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo, useState } from "react";

const defaultFilters: AtlasFilters = { dataset: "all", status: "all", input: "all", search: "", repository: "all", era: "all", phase: "all" };

function LineageMark() {
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 10c9 2 11 10 20 12s10 8 10 16" /><path d="M8 36c8-1 10-10 18-12s10-7 14-14" /><path d="M8 23h31" /><circle cx="24" cy="23" r="3" /></svg>;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [selectedId, setSelectedId] = useState("V2-E-032");
  const [filters, setFilters] = useState<AtlasFilters>(defaultFilters);
  const selected = experiments.find((experiment) => experiment.id === selectedId) ?? experiments[0];
  const counts = useMemo(() => Object.fromEntries((Object.keys(statusInfo) as ExperimentStatus[]).map((status) => [status, experiments.filter((item) => item.status === status).length])) as Record<ExperimentStatus, number>, []);
  const count953 = experiments.filter((item) => item.dataset === "SawitMVC-953").length;
  const count352 = experiments.filter((item) => item.dataset === "SawitMVC-Depth-352").length;
  const historicalCount = experiments.filter((item) => item.source).length;
  const visible = (experiment: typeof experiments[number]) => {
    const text = [experiment.id, experiment.title, experiment.model, experiment.phase, experiment.dataset, experiment.inputs.join(" "), experiment.era, experiment.source?.repo, experiment.conclusion].filter(Boolean).join(" ").toLocaleLowerCase("id-ID");
    const search = filters.search.trim().toLocaleLowerCase("id-ID");
    const repository = experiment.source?.repo ?? "project-expertise";
    const era = experiment.era ?? "Riset terkini · 2026";
    return (filters.dataset === "all" || experiment.dataset === filters.dataset) && (filters.status === "all" || experiment.status === filters.status) && (filters.input === "all" || experiment.inputs.includes(filters.input)) && (filters.repository === "all" || repository === filters.repository) && (filters.era === "all" || era === filters.era) && (filters.phase === "all" || experiment.phase === filters.phase) && (!search || text.includes(search));
  };

  return (
    <div className="atlas-page">
      <div className="atlas-layout">
        <aside className="left-rail">
          <div className="brand-lockup"><div className="brand-mark"><img src="/manus-storage/experiment-map-logo_44eb53b9.png" alt="Mark garis keturunan Field Research Ledger" /><LineageMark /></div><div><p>Project Expertise</p><h1>Field Research<br />Ledger</h1></div></div>
          <section className="rail-section"><div className="rail-heading">Akar data</div>
            <button type="button" className="dataset-card" style={{ backgroundImage: "url('/manus-storage/sawitmvc-dataset-card_27d70ac1.jpg')" }} onClick={() => setFilters({ ...filters, dataset: "SawitMVC-953" })}><strong>SawitMVC · 953</strong><span>RGB only · 953 pohon · 3.992 citra</span><b>{count953} jejak eksperimen →</b></button>
            <button type="button" className="dataset-card" style={{ backgroundImage: "url('/manus-storage/sawitmvc-depth-dataset-card_2e0c2ee7.jpg')" }} onClick={() => setFilters({ ...filters, dataset: "SawitMVC-Depth-352" })}><strong>SawitMVC-Depth · 352</strong><span>RGB + sensor depth · 352 pohon · 1.408 citra</span><b>{count352} jejak eksperimen →</b></button>
          </section>
          <section className="rail-section"><div className="rail-heading">Status bukti</div><div className="status-tally">{(Object.keys(statusInfo) as ExperimentStatus[]).map((status) => <button type="button" key={status} className={filters.status === status ? "is-active" : ""} onClick={() => setFilters({ ...filters, status: filters.status === status ? "all" : status })}><span><i className={statusInfo[status].dot} />{statusInfo[status].label}</span><b>{counts[status]}</b></button>)}</div></section>
          <div className="rail-source"><strong>Basis audit</strong><code>project-expertise@225faaeb</code><br /><code>Research-Pipeline@4aa9ad6</code><br /><code>Baseline-SawitMVC@ee2f0ac</code><br /><code>research-method-dedup@a720f17</code></div>
        </aside>
        <main className="atlas-main">
          <header className="atlas-header"><div className="atlas-header-actions"><button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Aktifkan tema terang" : "Aktifkan tema gelap"} title={theme === "dark" ? "Tema terang" : "Tema gelap"}>{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}<span>{theme === "dark" ? "Terang" : "Gelap"}</span></button></div><div className="atlas-eyebrow"><BookMarked size={14} />Atlas eksperimen · SawitMVC</div><h2>Telusuri keputusan, bukan hanya skor.</h2><p>Catatan lapangan interaktif untuk run, audit, hasil nol, dan batas inferensi dari empat repositori yang membentuk perjalanan riset deteksi serta counting tandan sawit.</p><div className="atlas-stats"><div className="atlas-stat"><strong>{experiments.length}</strong><span>node terdokumentasi</span></div><div className="atlas-stat"><strong>{historicalCount}</strong><span>node historis terlacak</span></div><div className="atlas-stat"><strong>{counts.negative}</strong><span>hasil negatif terjaga</span></div><div className="atlas-stat"><strong>4</strong><span>repositori diaudit</span></div></div></header>
          <FilterBar filters={filters} onChange={setFilters} />
          <ExperimentGraph selectedId={selected.id} visible={visible} onSelect={setSelectedId} />
        </main>
        <div className="right-rail"><ExperimentDetail experiment={selected} /></div>
      </div>
    </div>
  );
}
