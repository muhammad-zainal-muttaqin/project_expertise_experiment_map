/** Field Research Ledger filter strip — search and filters dim nodes rather than removing lineage context. */
import {
  allInputs,
  defaultEra,
  experiments,
  statusInfo,
  type DatasetId,
  type ExperimentStatus,
} from "@/lib/experimentData";
import { ChevronDown, Filter, RotateCcw, Search, X } from "lucide-react";
import { useState } from "react";

export interface AtlasFilters {
  dataset: "all" | DatasetId;
  status: "all" | ExperimentStatus;
  input: "all" | string;
  search: string;
  repository: "all" | string;
  era: "all" | string;
  phase: "all" | string;
}

const emptyFilters: AtlasFilters = {
  dataset: "all",
  status: "all",
  input: "all",
  search: "",
  repository: "all",
  era: "all",
  phase: "all",
};

/** Six dropdowns and a search field cannot show at a glance which of them are narrowing the map, so the
 *  active ones are restated as chips that clear themselves. */
function activeChips(filters: AtlasFilters) {
  const chips: { key: keyof AtlasFilters; label: string }[] = [];
  if (filters.search.trim())
    chips.push({ key: "search", label: `“${filters.search.trim()}”` });
  if (filters.dataset !== "all")
    chips.push({ key: "dataset", label: filters.dataset });
  if (filters.status !== "all")
    chips.push({ key: "status", label: statusInfo[filters.status].label });
  if (filters.input !== "all")
    chips.push({ key: "input", label: filters.input });
  if (filters.repository !== "all")
    chips.push({ key: "repository", label: filters.repository });
  if (filters.era !== "all") chips.push({ key: "era", label: filters.era });
  if (filters.phase !== "all")
    chips.push({ key: "phase", label: filters.phase });
  return chips;
}

const projectName = (repo?: string) => repo ?? "project-expertise";
const projectOptions = Array.from(
  new Set(experiments.map(experiment => projectName(experiment.source?.repo)))
).sort();
const eraOptions = Array.from(
  new Set(experiments.map(experiment => experiment.era ?? defaultEra))
).sort();
const phaseOptions = Array.from(
  new Set(experiments.map(experiment => experiment.phase))
).sort();

interface FilterBarProps {
  filters: AtlasFilters;
  onChange: (filters: AtlasFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const reset = () => onChange(emptyFilters);
  const chips = activeChips(filters);
  /* Seven controls cost 306px of a phone screen and push the map past the fold. On narrow widths the
     bar collapses to its own heading; the chip count keeps an active filter visible while closed. */
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={`filter-bar filter-bar--enhanced ${isOpen ? "" : "is-collapsed"}`}
      aria-label="Filter peta eksperimen"
    >
      <div className="filter-label">
        <Filter size={15} />
        Penyaringan bukti
      </div>
      <button
        type="button"
        className="filter-disclosure"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(current => !current)}
      >
        <Filter size={15} />
        <span>Penyaringan bukti</span>
        <ChevronDown size={15} />
      </button>
      <label className="filter-search">
        <span>Cari simpul / repositori</span>
        <div>
          <Search size={14} />
          <input
            value={filters.search}
            onChange={event =>
              onChange({ ...filters, search: event.target.value })
            }
            placeholder="ID, judul eksperimen, model, repositori…"
            aria-label="Cari simpul eksperimen atau repositori"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: "" })}
              aria-label="Hapus kata kunci pencarian"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </label>
      <label>
        <span>Dataset acuan</span>
        <select
          value={filters.dataset}
          onChange={event =>
            onChange({
              ...filters,
              dataset: event.target.value as AtlasFilters["dataset"],
            })
          }
        >
          <option value="all">Semua dataset</option>
          <option value="SawitMVC-953">SawitMVC · 953 (RGB)</option>
          <option value="SawitMVC-Depth-352">
            SawitMVC-Depth · 352 (RGB-D)
          </option>
          <option value="Lintas-dataset">Lintas-dataset</option>
          <option value="Audit">Audit</option>
        </select>
      </label>
      <label>
        <span>Status validitas</span>
        <select
          value={filters.status}
          onChange={event =>
            onChange({
              ...filters,
              status: event.target.value as AtlasFilters["status"],
            })
          }
        >
          <option value="all">Semua status</option>
          {(Object.keys(statusInfo) as ExperimentStatus[]).map(status => (
            <option value={status} key={status}>
              {statusInfo[status].label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Modalitas kanal</span>
        <select
          value={filters.input}
          onChange={event =>
            onChange({ ...filters, input: event.target.value })
          }
        >
          <option value="all">Semua kanal</option>
          {allInputs.map(input => (
            <option value={input} key={input}>
              {input}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Repositori</span>
        <select
          value={filters.repository}
          onChange={event =>
            onChange({ ...filters, repository: event.target.value })
          }
        >
          <option value="all">Semua repositori</option>
          {projectOptions.map(project => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Era penelitian</span>
        <select
          value={filters.era}
          onChange={event => onChange({ ...filters, era: event.target.value })}
        >
          <option value="all">Semua era</option>
          {eraOptions.map(era => (
            <option key={era} value={era}>
              {era}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Rumpun fase</span>
        <select
          value={filters.phase}
          onChange={event =>
            onChange({ ...filters, phase: event.target.value })
          }
        >
          <option value="all">Semua rumpun</option>
          {phaseOptions.map(phase => (
            <option key={phase} value={phase}>
              {phase}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="reset-filter" onClick={reset}>
        <RotateCcw size={14} />
        Reset filter
      </button>
      {chips.length > 0 && (
        <div
          className="filter-active"
          aria-label={`${chips.length} filter aktif`}
        >
          {chips.map(chip => (
            <button
              type="button"
              key={chip.key}
              className="filter-chip"
              onClick={() =>
                onChange({ ...filters, [chip.key]: emptyFilters[chip.key] })
              }
              aria-label={`Hapus filter ${chip.label}`}
            >
              <span>{chip.label}</span>
              <X size={11} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
