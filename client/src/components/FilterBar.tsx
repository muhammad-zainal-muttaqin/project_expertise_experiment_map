/** Field Research Ledger filter strip — search and filters dim nodes rather than removing lineage context. */
import { allInputs, experiments, statusInfo, type DatasetId, type ExperimentStatus } from "@/lib/experimentData";
import { Filter, RotateCcw, Search, X } from "lucide-react";

export interface AtlasFilters {
  dataset: "all" | DatasetId;
  status: "all" | ExperimentStatus;
  input: "all" | string;
  search: string;
  repository: "all" | string;
  era: "all" | string;
  phase: "all" | string;
}

const projectName = (repo?: string) => repo ?? "project-expertise";
const projectOptions = Array.from(new Set(experiments.map((experiment) => projectName(experiment.source?.repo)))).sort();
const eraOptions = Array.from(new Set(experiments.map((experiment) => experiment.era ?? "Riset terkini · 2026"))).sort();
const phaseOptions = Array.from(new Set(experiments.map((experiment) => experiment.phase))).sort();

interface FilterBarProps {
  filters: AtlasFilters;
  onChange: (filters: AtlasFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const reset = () => onChange({ dataset: "all", status: "all", input: "all", search: "", repository: "all", era: "all", phase: "all" });
  return (
    <div className="filter-bar filter-bar--enhanced" aria-label="Filter peta eksperimen">
      <div className="filter-label"><Filter size={15} />Filter bukti</div>
      <label className="filter-search">
        <span>Cari node / proyek</span>
        <div><Search size={14} /><input value={filters.search} onChange={(event) => onChange({ ...filters, search: event.target.value })} placeholder="ID, judul, model, repo…" aria-label="Cari node atau proyek" />{filters.search && <button type="button" onClick={() => onChange({ ...filters, search: "" })} aria-label="Hapus pencarian"><X size={13} /></button>}</div>
      </label>
      <label>
        <span>Dataset</span>
        <select value={filters.dataset} onChange={(event) => onChange({ ...filters, dataset: event.target.value as AtlasFilters["dataset"] })}>
          <option value="all">Semua dataset</option><option value="SawitMVC-953">SawitMVC · 953 RGB</option><option value="SawitMVC-Depth-352">SawitMVC-Depth · 352</option><option value="Lintas-dataset">Lintas-dataset</option><option value="Audit">Audit</option>
        </select>
      </label>
      <label>
        <span>Status</span>
        <select value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value as AtlasFilters["status"] })}>
          <option value="all">Semua status</option>{(Object.keys(statusInfo) as ExperimentStatus[]).map((status) => <option value={status} key={status}>{statusInfo[status].label}</option>)}
        </select>
      </label>
      <label>
        <span>Kanal / metode</span>
        <select value={filters.input} onChange={(event) => onChange({ ...filters, input: event.target.value })}>
          <option value="all">Semua kanal</option>{allInputs.map((input) => <option value={input} key={input}>{input}</option>)}
        </select>
      </label>
      <label>
        <span>Repositori</span>
        <select value={filters.repository} onChange={(event) => onChange({ ...filters, repository: event.target.value })}>
          <option value="all">Semua proyek</option>{projectOptions.map((project) => <option key={project} value={project}>{project}</option>)}
        </select>
      </label>
      <label>
        <span>Era riset</span>
        <select value={filters.era} onChange={(event) => onChange({ ...filters, era: event.target.value })}>
          <option value="all">Semua era</option>{eraOptions.map((era) => <option key={era} value={era}>{era}</option>)}
        </select>
      </label>
      <label>
        <span>Keluarga riset</span>
        <select value={filters.phase} onChange={(event) => onChange({ ...filters, phase: event.target.value })}>
          <option value="all">Semua keluarga</option>{phaseOptions.map((phase) => <option key={phase} value={phase}>{phase}</option>)}
        </select>
      </label>
      <button type="button" className="reset-filter" onClick={reset}><RotateCcw size={14} />Reset</button>
    </div>
  );
}
