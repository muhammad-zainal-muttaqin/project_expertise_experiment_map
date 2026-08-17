/** Beranda Field Research Ledger — arsip eksperimen tiga rail, sengaja dibuat padat tetapi tetap dapat dilacak. */
import { ExperimentDetail } from "@/components/ExperimentDetail";
import { ExperimentGraph } from "@/components/ExperimentGraph";
import { FilterBar, type AtlasFilters } from "@/components/FilterBar";
import {
  datasetInfo,
  defaultEra,
  experiments,
  statusInfo,
  type ExperimentStatus,
} from "@/lib/experimentData";
import { GuidedTour, hasSeenTour } from "@/components/GuidedTour";
import {
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useMemo, useState } from "react";

const defaultFilters: AtlasFilters = {
  dataset: "all",
  status: "all",
  input: "all",
  search: "",
  repository: "all",
  era: "all",
  phase: "all",
};

function LineageMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M9 10c9 2 11 10 20 12s10 8 10 16" />
      <path d="M8 36c8-1 10-10 18-12s10-7 14-14" />
      <path d="M8 23h31" />
      <circle cx="24" cy="23" r="3" />
    </svg>
  );
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [selectedId, setSelectedId] = useState("V2-E-032");
  const [filters, setFilters] = useState<AtlasFilters>(defaultFilters);
  const [isLeftRailHidden, setIsLeftRailHidden] = useState(false);
  /* Di bawah 1081px tidak ada tempat bagi lembar bukti untuk duduk di samping peta, sehingga ia
     menjadi sheet yang naik menutupinya. Sheet terbuka ketika simpul benar-benar dipilih, bukan
     saat halaman dimuat: tiba di ponsel dan langsung disambut panel yang menutupi peta justru
     menyembunyikan hal yang hendak dibaca pengunjung. */
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  /* Kunjungan pertama membuka panduan; sesudahnya hanya tombol Panduan yang memutarnya kembali. */
  const [isTourOpen, setIsTourOpen] = useState(() => !hasSeenTour());
  const openNode = (id: string) => {
    setSelectedId(id);
    setIsSheetOpen(true);
  };
  const selected =
    experiments.find(experiment => experiment.id === selectedId) ??
    experiments[0];
  useEffect(() => {
    if (!isSheetOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSheetOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isSheetOpen]);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(statusInfo) as ExperimentStatus[]).map(status => [
          status,
          experiments.filter(item => item.status === status).length,
        ])
      ) as Record<ExperimentStatus, number>,
    []
  );
  const count953 = experiments.filter(
    item => item.dataset === "SawitMVC-953"
  ).length;
  const count352 = experiments.filter(
    item => item.dataset === "SawitMVC-Depth-352"
  ).length;
  const historicalCount = experiments.filter(item => item.source).length;
  const visible = (experiment: (typeof experiments)[number]) => {
    const text = [
      experiment.id,
      experiment.title,
      experiment.model,
      experiment.phase,
      experiment.dataset,
      experiment.inputs.join(" "),
      experiment.era,
      experiment.source?.repo,
      experiment.conclusion,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("id-ID");
    const search = filters.search.trim().toLocaleLowerCase("id-ID");
    const repository = experiment.source?.repo ?? "project-expertise";
    const era = experiment.era ?? defaultEra;
    return (
      (filters.dataset === "all" || experiment.dataset === filters.dataset) &&
      (filters.status === "all" || experiment.status === filters.status) &&
      (filters.input === "all" || experiment.inputs.includes(filters.input)) &&
      (filters.repository === "all" || repository === filters.repository) &&
      (filters.era === "all" || era === filters.era) &&
      (filters.phase === "all" || experiment.phase === filters.phase) &&
      (!search || text.includes(search))
    );
  };

  return (
    <div className="atlas-page">
      <div
        className={`atlas-layout ${isLeftRailHidden ? "is-left-rail-hidden" : ""}`}
      >
        <aside className="left-rail">
          <div className="brand-lockup">
            <div className="brand-mark">
              <LineageMark />
            </div>
            <div>
              <p>Project Expertise</p>
              <h1>
                Field Research
                <br />
                Ledger
              </h1>
            </div>
          </div>
          <section className="rail-section">
            <div className="rail-heading">Dataset acuan</div>
            <button
              type="button"
              className="dataset-card dataset-card--953"
              onClick={() =>
                setFilters({ ...filters, dataset: "SawitMVC-953" })
              }
            >
              <strong>SawitMVC · 953</strong>
              <span>Modalitas RGB · 953 pohon · 3.992 citra</span>
              <b>{count953} simpul eksperimen →</b>
            </button>
            <button
              type="button"
              className="dataset-card dataset-card--352"
              onClick={() =>
                setFilters({ ...filters, dataset: "SawitMVC-Depth-352" })
              }
            >
              <strong>SawitMVC-Depth · 352</strong>
              <span>RGB + sensor kedalaman · 352 pohon · 1.408 citra</span>
              <b>{count352} simpul eksperimen →</b>
            </button>
          </section>
          <section className="rail-section">
            <div className="rail-heading">Status validitas bukti</div>
            <div className="status-tally">
              {(Object.keys(statusInfo) as ExperimentStatus[]).map(status => (
                <button
                  type="button"
                  key={status}
                  className={filters.status === status ? "is-active" : ""}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      status: filters.status === status ? "all" : status,
                    })
                  }
                >
                  <span>
                    <i className={statusInfo[status].dot} />
                    {statusInfo[status].label}
                  </span>
                  <b>{counts[status]}</b>
                </button>
              ))}
            </div>
          </section>
          <div className="rail-source">
            <strong>Basis audit repositori</strong>
            <code>project-expertise@225faaeb</code>
            <br />
            <code>Research-Pipeline@4aa9ad6</code>
            <br />
            <code>Baseline-SawitMVC@ee2f0ac</code>
            <br />
            <code>research-method-dedup@a720f17</code>
          </div>
        </aside>
        <main className="atlas-main">
          <header className="atlas-header">
            <div className="atlas-header-actions">
              <button
                type="button"
                className="rail-toggle"
                onClick={() => setIsLeftRailHidden(current => !current)}
                aria-label={
                  isLeftRailHidden
                    ? "Tampilkan panel data"
                    : "Sembunyikan panel data"
                }
                title={
                  isLeftRailHidden
                    ? "Tampilkan panel data"
                    : "Sembunyikan panel data"
                }
              >
                {isLeftRailHidden ? (
                  <ChevronRight size={15} />
                ) : (
                  <ChevronLeft size={15} />
                )}
                <span>{isLeftRailHidden ? "Panel data" : "Sembunyikan"}</span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Aktifkan tema terang"
                    : "Aktifkan tema gelap"
                }
                title={theme === "dark" ? "Tema terang" : "Tema gelap"}
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                <span>{theme === "dark" ? "Terang" : "Gelap"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsTourOpen(true)}
                aria-label="Putar panduan penggunaan atlas"
                title="Panduan penggunaan"
              >
                <LifeBuoy size={15} />
                <span>Panduan</span>
              </button>
            </div>
            <div className="atlas-stats">
              <div className="atlas-stat">
                <strong>{experiments.length}</strong>
                <span>simpul eksperimen</span>
              </div>
              <div className="atlas-stat">
                <strong>{historicalCount}</strong>
                <span>simpul historis</span>
              </div>
              <div className="atlas-stat">
                <strong>{counts.negative}</strong>
                <span>temuan negatif</span>
              </div>
              <div className="atlas-stat">
                <strong>4</strong>
                <span>repositori diaudit</span>
              </div>
            </div>
          </header>
          <FilterBar filters={filters} onChange={setFilters} />
          <ExperimentGraph
            selectedId={selected.id}
            visible={visible}
            onSelect={openNode}
          />
        </main>
        <div
          className="sheet-scrim"
          hidden={!isSheetOpen}
          onClick={() => setIsSheetOpen(false)}
        />
        <div
          className={`right-rail ${isSheetOpen ? "is-open" : ""}`}
          data-tour="evidence"
        >
          <button
            type="button"
            className="sheet-dismiss"
            onClick={() => setIsSheetOpen(false)}
            aria-label="Tutup lembar bukti"
          >
            <X size={16} />
          </button>
          <ExperimentDetail experiment={selected} onSelect={openNode} />
        </div>
      </div>
      {isTourOpen && <GuidedTour onClose={() => setIsTourOpen(false)} />}
    </div>
  );
}
