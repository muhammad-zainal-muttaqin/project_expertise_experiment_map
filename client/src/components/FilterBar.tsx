/** Field Research Ledger filter strip — filters dim nodes rather than removing lineage context. */
import { allInputs, statusInfo, type DatasetId, type ExperimentStatus } from "@/lib/experimentData";
import { Filter, RotateCcw } from "lucide-react";

export interface AtlasFilters {
  dataset: "all" | DatasetId;
  status: "all" | ExperimentStatus;
  input: "all" | string;
}

interface FilterBarProps {
  filters: AtlasFilters;
  onChange: (filters: AtlasFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar" aria-label="Filter peta eksperimen">
      <div className="filter-label"><Filter size={15} />Filter bukti</div>
      <label>
        <span>Dataset</span>
        <select value={filters.dataset} onChange={(event) => onChange({ ...filters, dataset: event.target.value as AtlasFilters["dataset"] })}>
          <option value="all">Semua dataset</option>
          <option value="SawitMVC-953">SawitMVC · 953 RGB</option>
          <option value="SawitMVC-Depth-352">SawitMVC-Depth · 352</option>
          <option value="Lintas-dataset">Lintas-dataset</option>
          <option value="Audit">Audit</option>
        </select>
      </label>
      <label>
        <span>Status</span>
        <select value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value as AtlasFilters["status"] })}>
          <option value="all">Semua status</option>
          {(Object.keys(statusInfo) as ExperimentStatus[]).map((status) => <option value={status} key={status}>{statusInfo[status].label}</option>)}
        </select>
      </label>
      <label>
        <span>Kanal / metode</span>
        <select value={filters.input} onChange={(event) => onChange({ ...filters, input: event.target.value })}>
          <option value="all">Semua kanal</option>
          {allInputs.map((input) => <option value={input} key={input}>{input}</option>)}
        </select>
      </label>
      <button type="button" className="reset-filter" onClick={() => onChange({ dataset: "all", status: "all", input: "all" })}><RotateCcw size={14} />Reset</button>
    </div>
  );
}
