/** Field Research Ledger graph — semantic lineage map with edge rationale, minimap, and branch focus. */
import { datasetRoots, experiments, statusInfo, type Experiment } from "@/lib/experimentData";
import { buildAtlasLayout, orthogonalPath } from "@/lib/atlasLayout";
import { ExperimentNode } from "@/components/ExperimentNode";
import { Crosshair, Download, LoaderCircle, Maximize2, Minimize2, RotateCcw, ScanLine, ZoomIn, ZoomOut } from "lucide-react";
import { toPng } from "html-to-image";
import { useEffect, useMemo, useRef, useState } from "react";

interface ExperimentGraphProps {
  selectedId: string;
  visible: (experiment: Experiment) => boolean;
  onSelect: (id: string) => void;
}

type Root = (typeof datasetRoots)[number];
type GraphRecord = Experiment | Root;
type EdgeTooltip = { parentId: string; childId: string; x: number; y: number };

const lookup = new Map<string, GraphRecord>([...datasetRoots, ...experiments].map((item) => [item.id, item]));
const DEFAULT_ZOOM = 0.82;
const MIN_ZOOM = 0.48;
const MAX_ZOOM = 1.45;

function inputsFor(node?: GraphRecord) { return node && "inputs" in node ? node.inputs : []; }

function lineageFor(selectedId: string) {
  const active = new Set<string>([selectedId]);
  const visit = (id: string) => {
    const node = lookup.get(id);
    if (node && "parentIds" in node) node.parentIds.forEach((parent) => { if (!active.has(parent)) { active.add(parent); visit(parent); } });
  };
  visit(selectedId);
  return active;
}

function branchFor(selectedId: string) {
  const branch = lineageFor(selectedId);
  const children = new Map<string, string[]>();
  experiments.forEach((experiment) => experiment.parentIds.forEach((parent) => children.set(parent, [...(children.get(parent) ?? []), experiment.id])));
  const visitDown = (id: string) => {
    if (id.startsWith("dataset-")) return;
    children.get(id)?.forEach((child) => { if (!branch.has(child)) { branch.add(child); visitDown(child); } });
  };
  visitDown(selectedId);
  return branch;
}

function reasonForEdge(parentId: string, child: Experiment) {
  const parent = lookup.get(parentId);
  const parentTitle = parent && "title" in parent ? parent.title : parent?.label ?? parentId;
  const sourceConclusion = parent && "conclusion" in parent ? parent.conclusion : undefined;
  const parentInputs = inputsFor(parent);
  const childInputs = inputsFor(child);
  const added = childInputs.filter((input) => !parentInputs.includes(input));
  let relation = "Meneruskan bukti dan konfigurasi dari eksperimen sebelumnya ke pertanyaan berikutnya.";

  if (parentId.startsWith("dataset-")) relation = `Menetapkan ${parent && "label" in parent ? parent.label : "dataset"} sebagai sumber data dan protokol evaluasi untuk run ini.`;
  else if (child.status === "audit_needed") relation = "Menjadikan hasil sebelumnya sebagai objek audit untuk membatasi klaim, mengecek kebocoran, atau mengukur ketidakpastian.";
  else if (childInputs.includes("Counting") && !parentInputs.includes("Counting")) relation = "Menguji apakah perubahan pada deteksi atau representasi benar-benar diterjemahkan ke metrik counting end-to-end.";
  else if (child.phase.includes("Diagnosis")) relation = "Menggunakan hasil pendahulu sebagai titik diagnosis untuk mencari mekanisme kesalahan, bukan sekadar membandingkan skor.";
  else if (child.phase.includes("Mono")) relation = "Memakai baseline atau representasi sebelumnya sebagai pembanding langsung untuk menguji tambahan monocular depth.";
  else if (parent && "era" in parent && parent.era && child.era && parent.era !== child.era) relation = "Mewarisi temuan arsip sebagai konteks historis; koneksi lintas era/repositori ditampilkan putus-putus.";
  else if (added.length) relation = `Mengubah atau menambahkan ${added.join(", ")} sambil mempertahankan konteks keputusan dari node asal.`;
  return { parentTitle, relation, sourceConclusion };
}

export function ExperimentGraph({ selectedId, visible, onSelect }: ExperimentGraphProps) {
  const lineage = lineageFor(selectedId);
  const branch = branchFor(selectedId);
  const selected = experiments.find((item) => item.id === selectedId) ?? experiments[0];
  const layout = useMemo(() => buildAtlasLayout(experiments), []);
  const graphRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [edgeTooltip, setEdgeTooltip] = useState<EdgeTooltip | null>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, width: 600, height: 420 });
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const canvasWidth = layout.canvasWidth;
  const canvasHeight = layout.canvasHeight;
  const canvasStyle = { "--canvas-width": `${canvasWidth}px`, "--canvas-height": `${canvasHeight}px` } as React.CSSProperties;

  const updateViewport = () => {
    const element = scrollRef.current;
    if (!element) return;
    setViewport({ x: element.scrollLeft / zoom, y: element.scrollTop / zoom, width: element.clientWidth / zoom, height: element.clientHeight / zoom });
  };

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === graphRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);
  useEffect(() => { requestAnimationFrame(updateViewport); }, [zoom, isFullscreen]);

  const setZoomClamped = (nextZoom: number) => setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(nextZoom.toFixed(2)))));
  const resetView = () => { setZoom(DEFAULT_ZOOM); requestAnimationFrame(() => { if (scrollRef.current) { scrollRef.current.scrollLeft = 0; scrollRef.current.scrollTop = 0; updateViewport(); } }); };
  const toggleFullscreen = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await graphRef.current?.requestFullscreen(); } catch { /* Browser preview may deny fullscreen. */ } };
  const jumpTo = (x: number, y: number) => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollLeft = Math.max(0, x * zoom - element.clientWidth / 2);
    element.scrollTop = Math.max(0, y * zoom - element.clientHeight / 2);
    requestAnimationFrame(updateViewport);
  };
  const exportMap = async () => {
    const canvas = scrollRef.current?.querySelector<HTMLElement>(".experiment-canvas");
    if (!canvas || isExporting) return;
    setIsExporting(true);
    setExportMessage("");
    try {
      const dataUrl = await toPng(canvas, { cacheBust: true, pixelRatio: 2, backgroundColor: "#123d2d", width: canvasWidth, height: canvasHeight, style: { transform: "none", transformOrigin: "top left" } });
      const link = document.createElement("a");
      link.download = `atlas-sawitmvc-${focusMode ? `${selected.id}-fokus` : "peta-lengkap"}-2x.png`;
      link.href = dataUrl;
      link.click();
      setExportMessage("PNG 2× siap diunduh");
    } catch {
      setExportMessage("Ekspor belum dapat dibuat. Coba lagi.");
    } finally {
      setIsExporting(false);
      window.setTimeout(() => setExportMessage(""), 3200);
    }
  };
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button, a, select, input, .edge-hitarea")) return;
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
  const zoomWithWheel = (event: React.WheelEvent<HTMLDivElement>) => { if (!event.ctrlKey && !event.metaKey) return; event.preventDefault(); setZoomClamped(zoom + (event.deltaY < 0 ? 0.08 : -0.08)); };
  const showExperiment = (experiment: Experiment) => !focusMode || branch.has(experiment.id);
  const showEdge = (parentId: string, childId: string) => !focusMode || (branch.has(parentId) && branch.has(childId));
  const tooltipParent = edgeTooltip ? lookup.get(edgeTooltip.parentId) : undefined;
  const tooltipChild = edgeTooltip ? experiments.find((item) => item.id === edgeTooltip.childId) : undefined;
  const tooltipReason = edgeTooltip && tooltipChild ? reasonForEdge(edgeTooltip.parentId, tooltipChild) : undefined;

  return (
    <section ref={graphRef} className="graph-shell" aria-label="Peta garis keturunan eksperimen">
      <div className="graph-topbar">
        <div className="graph-note"><span />Tarik latar untuk menggeser peta. Arahkan ke garis untuk membaca alasan; roda + <kbd>Ctrl</kbd> untuk zoom.</div>
        <div className="graph-controls" aria-label="Kontrol peta">
          <button type="button" onClick={exportMap} disabled={isExporting} aria-label="Unduh peta sebagai PNG resolusi tinggi" title="Unduh PNG 2×">{isExporting ? <LoaderCircle className="is-spinning" size={14} /> : <Download size={14} />}</button><button type="button" onClick={() => setFocusMode((current) => !current)} aria-pressed={focusMode} aria-label={focusMode ? "Keluar mode fokus cabang" : "Fokuskan cabang node terpilih"} title={focusMode ? "Keluar mode fokus" : "Fokus cabang node terpilih"} className={focusMode ? "is-active" : ""}><ScanLine size={14} /></button>
          <button type="button" onClick={() => setZoomClamped(zoom - 0.1)} disabled={zoom <= MIN_ZOOM} aria-label="Perkecil peta" title="Perkecil peta"><ZoomOut size={15} /></button><output aria-label={`Zoom ${Math.round(zoom * 100)} persen`}>{Math.round(zoom * 100)}%</output><button type="button" onClick={() => setZoomClamped(zoom + 0.1)} disabled={zoom >= MAX_ZOOM} aria-label="Perbesar peta" title="Perbesar peta"><ZoomIn size={15} /></button><button type="button" onClick={resetView} aria-label="Reset tampilan peta" title="Reset tampilan"><RotateCcw size={14} /></button><button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Keluar dari layar penuh" : "Buka peta layar penuh"} title={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}>{isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
        </div>
      </div>
      {focusMode && <div className="focus-strip"><ScanLine size={13} /><span><strong>Mode fokus cabang.</strong> Dependensi dan turunan <b>{selected.id}</b> dipertahankan.</span><button type="button" onClick={() => setFocusMode(false)}>Tampilkan semua</button></div>}
      {exportMessage && <div className="export-note" role="status">{exportMessage}</div>}
      <div ref={scrollRef} className={`graph-scroll ${isDragging ? "is-grabbing" : ""}`} onScroll={updateViewport} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onWheel={zoomWithWheel}>
        <div className="zoom-stage" style={{ width: canvasWidth * zoom, height: canvasHeight * zoom }}>
          <div className="experiment-canvas" style={{ ...canvasStyle, transform: `scale(${zoom})` }}>
            {layout.lanes.map((lane) => <div key={lane.id} className={`canvas-lane canvas-lane-${lane.tone}`} style={{ top: lane.y, height: lane.height }}><strong>{lane.label}</strong><span>{lane.caption}</span></div>)}
            <svg className="lineage-svg" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} role="img" aria-label="Garis hubungan antar eksperimen" onPointerLeave={() => setEdgeTooltip(null)}>
              <defs><filter id="roughen"><feTurbulence baseFrequency="0.008" numOctaves="1" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="1" /></filter></defs>
              {experiments.flatMap((experiment, experimentIndex) => experiment.parentIds.map((parentId, parentIndex) => {
                const parent = lookup.get(parentId) as { id: string; position: { x: number; y: number } } | undefined;
                if (!parent || !showEdge(parentId, experiment.id)) return null;
                const active = lineage.has(experiment.id) && lineage.has(parentId);
                const parentPosition = layout.positions[parentId] ?? parent.position;
                const childPosition = layout.positions[experiment.id] ?? experiment.position;
                const isArchiveBridge = (parentId.startsWith("RP-") || parentId.startsWith("HB-") || parentId.startsWith("HD-")) !== experiment.id.startsWith("RP-") && !experiment.id.startsWith("HB-") && !experiment.id.startsWith("HD-");
                const path = orthogonalPath(parentPosition, childPosition, experimentIndex + parentIndex, parentId.startsWith("dataset-"));
                const tooltip = { parentId, childId: experiment.id, x: (parentPosition.x + childPosition.x) / 2, y: (parentPosition.y + childPosition.y) / 2 };
                return <g key={`${parentId}-${experiment.id}`}><path d={path} className={`lineage-path ${active ? "is-active" : ""} ${isArchiveBridge ? "is-archive-bridge" : ""}`} /><path d={path} className="edge-hitarea" tabIndex={0} aria-label={`Alasan hubungan ${parentId} ke ${experiment.id}`} onPointerEnter={() => setEdgeTooltip(tooltip)} onFocus={() => setEdgeTooltip(tooltip)} onBlur={() => setEdgeTooltip(null)} /></g>;
              }))}
            </svg>
            {edgeTooltip && tooltipChild && tooltipReason && <aside className="edge-tooltip" role="status" style={{ left: Math.min(canvasWidth - 350, Math.max(18, edgeTooltip.x - 150)), top: Math.max(18, edgeTooltip.y - 112) }}><span className="edge-tooltip-kicker"><Crosshair size={12} />ALASAN LINEAGE</span><strong>{tooltipParent && ("title" in tooltipParent ? tooltipParent.title : tooltipParent.label)} <i>→</i> {tooltipChild.title}</strong><p>{tooltipReason.relation}</p>{tooltipReason.sourceConclusion && <small><b>Bukti asal:</b> {tooltipReason.sourceConclusion}</small>}</aside>}
            {datasetRoots.map((root) => <button key={root.id} type="button" className={`dataset-root ${lineage.has(root.id) ? "is-active" : ""} ${focusMode && !branch.has(root.id) ? "is-focus-hidden" : ""}`} style={{ left: layout.positions[root.id]?.x ?? root.position.x, top: layout.positions[root.id]?.y ?? root.position.y }} onClick={() => onSelect(root.id === "dataset-953" ? "V2-E-001" : "V2-E-003")}><span>DATASET</span><strong>{root.label}</strong><small>{root.detail}</small></button>)}
            {experiments.map((experiment) => <ExperimentNode key={experiment.id} experiment={experiment} position={layout.positions[experiment.id]} selected={experiment.id === selected.id} dimmed={!visible(experiment)} hidden={!showExperiment(experiment)} lineageActive={lineage.has(experiment.id)} onSelect={onSelect} />)}
            <div className="canvas-legend">{Object.entries(statusInfo).map(([status, info]) => <span key={status}><i className={info.dot} />{info.label}</span>)}</div>
          </div>
        </div>
      </div>
      <div className="graph-minimap" aria-label="Minimap atlas eksperimen">
        <div className="minimap-title"><span>MINIMAP</span><small>Klik lane untuk melompat</small></div>
        <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} role="img" aria-label="Ringkasan posisi eksperimen dan era penelitian" onPointerDown={(event) => { if ((event.target as Element).closest('[role="button"]')) return; const rect = event.currentTarget.getBoundingClientRect(); jumpTo((event.clientX - rect.left) / rect.width * canvasWidth, (event.clientY - rect.top) / rect.height * canvasHeight); }}>
          {layout.lanes.map((lane) => <g key={lane.id} role="button" tabIndex={0} aria-label={`Lompat ke ${lane.label}`} onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); jumpTo(canvasWidth / 2, lane.y + lane.height / 2); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); jumpTo(canvasWidth / 2, lane.y + lane.height / 2); } }}><rect className={`minimap-lane minimap-lane-${lane.tone}`} x="0" y={lane.y} width={canvasWidth} height={lane.height} /><text x="46" y={lane.y + Math.min(42, lane.height / 2)}>{lane.label.replace("ARSIP · ", "")}</text></g>)}
          {datasetRoots.map((root) => { const position = layout.positions[root.id] ?? root.position; return <rect key={root.id} className="minimap-root" x={position.x} y={position.y} width="176" height="107" />; })}
          {experiments.map((experiment) => { const position = layout.positions[experiment.id]; return <rect key={experiment.id} className={`minimap-node minimap-${experiment.status} ${experiment.id === selected.id ? "is-selected" : ""} ${focusMode && !branch.has(experiment.id) ? "is-focus-hidden" : ""}`} x={position.x} y={position.y} width="176" height="107" />; })}
          <rect className="minimap-viewport" x={viewport.x} y={viewport.y} width={viewport.width} height={viewport.height} />
        </svg>
      </div>
    </section>
  );
}
