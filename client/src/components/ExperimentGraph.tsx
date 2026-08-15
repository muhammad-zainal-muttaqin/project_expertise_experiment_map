/** Field Research Ledger graph — panoramic, scrollable lineage map with pencil-like connector traces. */
import { datasetRoots, experiments, statusInfo, type Experiment } from "@/lib/experimentData";
import { ExperimentNode } from "@/components/ExperimentNode";

interface ExperimentGraphProps {
  selectedId: string;
  visible: (experiment: Experiment) => boolean;
  onSelect: (id: string) => void;
}

const lookup = new Map([...datasetRoots, ...experiments].map((item) => [item.id, item]));

function lineageFor(selectedId: string) {
  const active = new Set<string>([selectedId]);
  const visit = (id: string) => {
    const node = lookup.get(id) as Experiment | undefined;
    node?.parentIds?.forEach((parent) => { if (!active.has(parent)) { active.add(parent); visit(parent); } });
  };
  visit(selectedId);
  return active;
}

export function ExperimentGraph({ selectedId, visible, onSelect }: ExperimentGraphProps) {
  const lineage = lineageFor(selectedId);
  const selected = experiments.find((item) => item.id === selectedId) ?? experiments[0];
  const canvasWidth = Math.max(2600, Math.max(...experiments.map((item) => item.position.x), ...datasetRoots.map((item) => item.position.x)) + 340);
  const canvasHeight = Math.max(880, Math.max(...experiments.map((item) => item.position.y), ...datasetRoots.map((item) => item.position.y)) + 180);
  const canvasStyle = { "--canvas-width": `${canvasWidth}px`, "--canvas-height": `${canvasHeight}px` } as React.CSSProperties;

  return (
    <section className="graph-shell" aria-label="Peta garis keturunan eksperimen">
        <div className="graph-note"><span />Klik sebuah kartu untuk membuka lembar bukti. Gulir ke bawah untuk menelusuri arsip April–Agustus 2026; filter hanya meredupkan node agar konteks keturunan tetap terbaca.</div>
        <div className="graph-scroll">
        <div className="experiment-canvas" style={canvasStyle}>
          <div className="canvas-band band-foundation"><span>FONDASI &amp; SCREENING</span></div>
          <div className="canvas-band band-diagnosis"><span>DIAGNOSIS &amp; REKOMPOSISI</span></div>
          <div className="canvas-band band-audit"><span>VALIDITAS INFERENSI</span></div>
          <div className="canvas-band band-mono"><span>MONOCULAR DEPTH</span></div>
          <div className="historical-ledger"><span>RIWAYAT SEBELUM PROJECT-EXPERTISE · APR–AUG 2026</span><small>Tiga repositori · titik audit tetap dipertahankan</small></div>
          <svg className="lineage-svg" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} role="img" aria-label="Garis hubungan antar eksperimen">
            <defs><filter id="roughen"><feTurbulence baseFrequency="0.008" numOctaves="1" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="1" /></filter></defs>
            {experiments.flatMap((experiment) => experiment.parentIds.map((parentId) => {
              const parent = lookup.get(parentId) as { position: { x: number; y: number } } | undefined;
              if (!parent) return null;
              const active = lineage.has(experiment.id) && lineage.has(parentId);
              return <path key={`${parentId}-${experiment.id}`} d={`M ${parent.position.x + 176} ${parent.position.y + 53} C ${parent.position.x + 194} ${parent.position.y + 53}, ${experiment.position.x - 18} ${experiment.position.y + 53}, ${experiment.position.x} ${experiment.position.y + 53}`} className={`lineage-path ${active ? "is-active" : ""}`} />;
            }))}
          </svg>
          {datasetRoots.map((root) => <button key={root.id} type="button" className={`dataset-root ${lineage.has(root.id) ? "is-active" : ""}`} style={{ left: root.position.x, top: root.position.y }} onClick={() => onSelect(root.id === "dataset-953" ? "V2-E-001" : "V2-E-003")}><span>DATASET</span><strong>{root.label}</strong><small>{root.detail}</small></button>)}
          {experiments.map((experiment) => <ExperimentNode key={experiment.id} experiment={experiment} selected={experiment.id === selected.id} dimmed={!visible(experiment)} lineageActive={lineage.has(experiment.id)} onSelect={onSelect} />)}
          <div className="canvas-legend">
            {Object.entries(statusInfo).map(([status, info]) => <span key={status}><i className={info.dot} />{info.label}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
