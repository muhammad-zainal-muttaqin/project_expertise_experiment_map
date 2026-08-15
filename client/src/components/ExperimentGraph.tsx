/** Field Research Ledger graph — panoramic, scrollable lineage map with pencil-like connector traces. */
import { datasetRoots, experiments, statusInfo, type Experiment } from "@/lib/experimentData";
import { buildAtlasLayout, orthogonalPath } from "@/lib/atlasLayout";
import { ExperimentNode } from "@/components/ExperimentNode";
import { Hand, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface ExperimentGraphProps {
  selectedId: string;
  visible: (experiment: Experiment) => boolean;
  onSelect: (id: string) => void;
}

const lookup = new Map([...datasetRoots, ...experiments].map((item) => [item.id, item]));
const DEFAULT_ZOOM = 0.82;
const MIN_ZOOM = 0.48;
const MAX_ZOOM = 1.45;

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
  const layout = useMemo(() => buildAtlasLayout(experiments), []);
  const graphRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasWidth = layout.canvasWidth;
  const canvasHeight = layout.canvasHeight;
  const canvasStyle = { "--canvas-width": `${canvasWidth}px`, "--canvas-height": `${canvasHeight}px` } as React.CSSProperties;

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === graphRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const setZoomClamped = (nextZoom: number) => setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(nextZoom.toFixed(2)))));
  const resetView = () => {
    setZoom(DEFAULT_ZOOM);
    requestAnimationFrame(() => { if (scrollRef.current) { scrollRef.current.scrollLeft = 0; scrollRef.current.scrollTop = 0; } });
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await graphRef.current?.requestFullscreen();
    } catch { /* Fullscreen may be unavailable in an embedded preview. */ }
  };
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button, a, select, input")) return;
    dragRef.current = { active: true, lastX: event.clientX, lastY: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };
  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !scrollRef.current) return;
    scrollRef.current.scrollLeft -= event.clientX - dragRef.current.lastX;
    scrollRef.current.scrollTop -= event.clientY - dragRef.current.lastY;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastY = event.clientY;
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.active && event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current.active = false;
    setIsDragging(false);
  };
  const zoomWithWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    setZoomClamped(zoom + (event.deltaY < 0 ? 0.08 : -0.08));
  };

  return (
    <section ref={graphRef} className="graph-shell" aria-label="Peta garis keturunan eksperimen">
        <div className="graph-topbar"><div className="graph-note"><span />Tarik latar untuk menggeser peta. Roda + <kbd>Ctrl</kbd> untuk zoom; klik kartu untuk membuka bukti.</div><div className="graph-controls" aria-label="Kontrol peta"><button type="button" onClick={() => setZoomClamped(zoom - 0.1)} disabled={zoom <= MIN_ZOOM} aria-label="Perkecil peta" title="Perkecil peta"><ZoomOut size={15} /></button><output aria-label={`Zoom ${Math.round(zoom * 100)} persen`}>{Math.round(zoom * 100)}%</output><button type="button" onClick={() => setZoomClamped(zoom + 0.1)} disabled={zoom >= MAX_ZOOM} aria-label="Perbesar peta" title="Perbesar peta"><ZoomIn size={15} /></button><button type="button" onClick={resetView} aria-label="Reset tampilan peta" title="Reset tampilan"><RotateCcw size={14} /></button><button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Keluar dari layar penuh" : "Buka peta layar penuh"} title={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}>{isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button></div></div>
        <div ref={scrollRef} className={`graph-scroll ${isDragging ? "is-grabbing" : ""}`} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onWheel={zoomWithWheel}>
          <div className="zoom-stage" style={{ width: canvasWidth * zoom, height: canvasHeight * zoom }}>
          <div className="experiment-canvas" style={{ ...canvasStyle, transform: `scale(${zoom})` }}>
          {layout.lanes.map((lane) => <div key={lane.id} className={`canvas-lane canvas-lane-${lane.tone}`} style={{ top: lane.y, height: lane.height }}><strong>{lane.label}</strong><span>{lane.caption}</span></div>)}
          <svg className="lineage-svg" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} role="img" aria-label="Garis hubungan antar eksperimen">
            <defs><filter id="roughen"><feTurbulence baseFrequency="0.008" numOctaves="1" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="1" /></filter></defs>
            {experiments.flatMap((experiment, experimentIndex) => experiment.parentIds.map((parentId, parentIndex) => {
              const parent = lookup.get(parentId) as { id: string; position: { x: number; y: number } } | undefined;
              if (!parent) return null;
              const active = lineage.has(experiment.id) && lineage.has(parentId);
              const parentPosition = layout.positions[parentId] ?? parent.position;
              const childPosition = layout.positions[experiment.id] ?? experiment.position;
              const isArchiveBridge = (parentId.startsWith("RP-") || parentId.startsWith("HB-") || parentId.startsWith("HD-")) !== experiment.id.startsWith("RP-") && !experiment.id.startsWith("HB-") && !experiment.id.startsWith("HD-");
              return <path key={`${parentId}-${experiment.id}`} d={orthogonalPath(parentPosition, childPosition, experimentIndex + parentIndex, parentId.startsWith("dataset-"))} className={`lineage-path ${active ? "is-active" : ""} ${isArchiveBridge ? "is-archive-bridge" : ""}`} />;
            }))}
          </svg>
          {datasetRoots.map((root) => <button key={root.id} type="button" className={`dataset-root ${lineage.has(root.id) ? "is-active" : ""}`} style={{ left: layout.positions[root.id]?.x ?? root.position.x, top: layout.positions[root.id]?.y ?? root.position.y }} onClick={() => onSelect(root.id === "dataset-953" ? "V2-E-001" : "V2-E-003")}><span>DATASET</span><strong>{root.label}</strong><small>{root.detail}</small></button>)}
          {experiments.map((experiment) => <ExperimentNode key={experiment.id} experiment={experiment} position={layout.positions[experiment.id]} selected={experiment.id === selected.id} dimmed={!visible(experiment)} lineageActive={lineage.has(experiment.id)} onSelect={onSelect} />)}
          <div className="canvas-legend">
            {Object.entries(statusInfo).map(([status, info]) => <span key={status}><i className={info.dot} />{info.label}</span>)}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
