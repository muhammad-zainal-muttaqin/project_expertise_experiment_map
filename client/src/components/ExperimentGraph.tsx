/** Field Research Ledger graph — semantic lineage map with continuous, readable routed edges. */
import {
  datasetRoots,
  experiments,
  statusInfo,
  type Experiment,
} from "@/lib/experimentData";
import { buildAtlasLayout, orthogonalPath } from "@/lib/atlasLayout";
import { ExperimentNode } from "@/components/ExperimentNode";
import { ExperimentDetail } from "@/components/ExperimentDetail";
import {
  Crosshair,
  Download,
  FileText,
  LoaderCircle,
  Maximize2,
  Minimize2,
  RotateCcw,
  ScanLine,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
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
type RoutedEdge = {
  key: string;
  parentId: string;
  child: Experiment;
  serial: number;
  sourceIndex: number;
  sourceCount: number;
  targetIndex: number;
  targetCount: number;
};

const lookup = new Map<string, GraphRecord>(
  [...datasetRoots, ...experiments].map(item => [item.id, item])
);
// Nodes carry 8–11px type; below 1.0 the titles stop being readable without a
// second zoom action, so the map opens at true size and zooms out on demand.
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.48;
const MAX_ZOOM = 1.45;

function inputsFor(node?: GraphRecord) {
  return node && "inputs" in node ? node.inputs : [];
}

function lineageFor(selectedId: string) {
  const active = new Set<string>([selectedId]);
  const visit = (id: string) => {
    const node = lookup.get(id);
    if (node && "parentIds" in node)
      node.parentIds.forEach(parent => {
        if (!active.has(parent)) {
          active.add(parent);
          visit(parent);
        }
      });
  };
  visit(selectedId);
  return active;
}

function branchFor(selectedId: string) {
  const branch = lineageFor(selectedId);
  const children = new Map<string, string[]>();
  experiments.forEach(experiment =>
    experiment.parentIds.forEach(parent =>
      children.set(parent, [...(children.get(parent) ?? []), experiment.id])
    )
  );
  const visitDown = (id: string) => {
    if (id.startsWith("dataset-")) return;
    children.get(id)?.forEach(child => {
      if (!branch.has(child)) {
        branch.add(child);
        visitDown(child);
      }
    });
  };
  visitDown(selectedId);
  return branch;
}

function reasonForEdge(parentId: string, child: Experiment) {
  const parent = lookup.get(parentId);
  const parentTitle =
    parent && "title" in parent ? parent.title : (parent?.label ?? parentId);
  const sourceConclusion =
    parent && "conclusion" in parent ? parent.conclusion : undefined;
  const parentInputs = inputsFor(parent);
  const childInputs = inputsFor(child);
  const added = childInputs.filter(input => !parentInputs.includes(input));
  let relation =
    "Meneruskan konfigurasi eksperimental dan bukti empiris dari node pendahulu ke tahapan uji berikutnya.";

  if (parentId.startsWith("dataset-"))
    relation = `Menetapkan ${parent && "label" in parent ? parent.label : "dataset"} sebagai sumber data rujukan dan protokol evaluasi terstandarisasi untuk rangkaian eksperimen ini.`;
  else if (child.status === "audit_needed")
    relation =
      "Menjadikan temuan pendahulu sebagai objek audit metodologis untuk menguji kebocoran data, batas validitas, atau ketidakpastian statistik.";
  else if (
    childInputs.includes("Counting") &&
    !parentInputs.includes("Counting")
  )
    relation =
      "Menguji apakah perbaikan representasi atau deteksi benar-benar berkorelasi positif terhadap metrik pencacahan (counting) end-to-end.";
  else if (child.phase.includes("Diagnosis"))
    relation =
      "Menggunakan hasil pendahulu sebagai titik diagnosis analitis untuk mengisolasi mekanisme galat, bukan sekadar membandingkan skor numerik.";
  else if (child.phase.includes("Mono"))
    relation =
      "Menggunakan baseline atau representasi sebelumnya sebagai pembanding langsung guna mengevaluasi efektivitas penambahan kanal depth monokular.";
  else if (
    parent &&
    "era" in parent &&
    parent.era &&
    child.era &&
    parent.era !== child.era
  )
    relation =
      "Mewariskan temuan arsip sebagai konteks historis komparatif; relasi lintas era diformulasikan untuk memperjelas trajektori riset.";
  else if (added.length)
    relation = `Memodifikasi atau mengintegrasikan masukan ${added.join(", ")} sambil mempertahankan konteks acuan keputusan dari node asal.`;
  return { parentTitle, relation, sourceConclusion };
}

export function ExperimentGraph({
  selectedId,
  visible,
  onSelect,
}: ExperimentGraphProps) {
  const lineage = lineageFor(selectedId);
  const branch = branchFor(selectedId);
  const selected =
    experiments.find(item => item.id === selectedId) ?? experiments[0];
  const layout = useMemo(() => buildAtlasLayout(experiments), []);
  const routedEdges = useMemo<RoutedEdge[]>(() => {
    const raw = experiments.flatMap((child, serial) =>
      child.parentIds.map((parentId, parentIndex) => ({
        key: `${parentId}-${child.id}`,
        parentId,
        child,
        serial: serial * 3 + parentIndex,
      }))
    );
    const outgoing = new Map<string, typeof raw>();
    const incoming = new Map<string, typeof raw>();
    raw.forEach(edge => {
      outgoing.set(edge.parentId, [
        ...(outgoing.get(edge.parentId) ?? []),
        edge,
      ]);
      incoming.set(edge.child.id, [
        ...(incoming.get(edge.child.id) ?? []),
        edge,
      ]);
    });
    const sourceCursor = new Map<string, number>();
    const targetCursor = new Map<string, number>();
    return raw.map(edge => {
      const sourceIndex = sourceCursor.get(edge.parentId) ?? 0;
      const targetIndex = targetCursor.get(edge.child.id) ?? 0;
      sourceCursor.set(edge.parentId, sourceIndex + 1);
      targetCursor.set(edge.child.id, targetIndex + 1);
      return {
        ...edge,
        sourceIndex,
        sourceCount: outgoing.get(edge.parentId)?.length ?? 1,
        targetIndex,
        targetCount: incoming.get(edge.child.id)?.length ?? 1,
      };
    });
  }, []);
  const graphRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const exportTimerRef = useRef<number | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [isFullscreenEvidenceOpen, setIsFullscreenEvidenceOpen] =
    useState(true);
  const [edgeTooltip, setEdgeTooltip] = useState<EdgeTooltip | null>(null);
  // The focus ring used to be the only way an edge stayed lit, so panning the map
  // blurred it away. A pinned key survives the drag; the tooltip stays hover-only
  // so the reason card never covers the nodes being compared.
  const [pinnedEdgeKey, setPinnedEdgeKey] = useState<string | null>(null);
  const selectNode = (id: string) => {
    setPinnedEdgeKey(null);
    onSelect(id);
  };
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const canvasWidth = layout.canvasWidth;
  const canvasHeight = layout.canvasHeight;
  const canvasStyle = {
    "--canvas-width": `${canvasWidth}px`,
    "--canvas-height": `${canvasHeight}px`,
  } as React.CSSProperties;

  /* The minimap rectangle is the only thing that follows the scroll position. Holding it in
     React state re-rendered 93 nodes, 120 edge paths and 104 minimap rects on every scroll
     event — 50-80ms of scripting per pan frame — so it is written to the DOM directly instead,
     coalesced to one write per animation frame. zoomRef keeps the divisor current without
     rebinding the listeners. */
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const viewportRectRef = useRef<SVGRectElement>(null);
  const viewportFrameRef = useRef(0);
  const writeViewport = () => {
    viewportFrameRef.current = 0;
    const element = scrollRef.current;
    const rect = viewportRectRef.current;
    if (!element || !rect) return;
    const scale = zoomRef.current;
    rect.setAttribute("x", String(element.scrollLeft / scale));
    rect.setAttribute("y", String(element.scrollTop / scale));
    rect.setAttribute("width", String(element.clientWidth / scale));
    rect.setAttribute("height", String(element.clientHeight / scale));
  };
  const updateViewport = () => {
    if (viewportFrameRef.current) return;
    viewportFrameRef.current = requestAnimationFrame(writeViewport);
  };

  useEffect(() => {
    const syncFullscreen = () =>
      setIsFullscreen(document.fullscreenElement === graphRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);
  useEffect(() => {
    updateViewport();
  }, [zoom, isFullscreen]);
  /* Resizing the window changes .graph-scroll directly, since .atlas-main is 100vh and the
     shell takes the remainder — without this the minimap rectangle keeps the old dimensions. */
  useEffect(() => {
    window.addEventListener("resize", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      if (viewportFrameRef.current)
        cancelAnimationFrame(viewportFrameRef.current);
    };
  }, []);
  /* React registers its wheel listener as passive, so preventDefault() inside an onWheel prop
     is ignored and Ctrl+wheel zooms the browser as well as the map. */
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const zoomWithWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setZoom(current =>
        Math.min(
          MAX_ZOOM,
          Math.max(
            MIN_ZOOM,
            Number((current + (event.deltaY < 0 ? 0.08 : -0.08)).toFixed(2))
          )
        )
      );
    };
    element.addEventListener("wheel", zoomWithWheel, { passive: false });
    return () => element.removeEventListener("wheel", zoomWithWheel);
  }, []);
  useEffect(
    () => () => {
      if (exportTimerRef.current !== null)
        window.clearTimeout(exportTimerRef.current);
    },
    []
  );
  useEffect(() => {
    if (isFullscreen) setIsFullscreenEvidenceOpen(true);
  }, [selectedId, isFullscreen]);

  const setZoomClamped = (nextZoom: number) =>
    setZoom(
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(nextZoom.toFixed(2))))
    );
  const resetView = () => {
    setZoom(DEFAULT_ZOOM);
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = 0;
        scrollRef.current.scrollTop = 0;
        updateViewport();
      }
    });
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await graphRef.current?.requestFullscreen();
    } catch {
      /* Browser preview may deny fullscreen. */
    }
  };
  const jumpTo = (x: number, y: number) => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollLeft = Math.max(0, x * zoom - element.clientWidth / 2);
    element.scrollTop = Math.max(0, y * zoom - element.clientHeight / 2);
    updateViewport();
  };
  const minimapDragRef = useRef(false);
  const panFromMinimap = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    jumpTo(
      ((event.clientX - rect.left) / rect.width) * canvasWidth,
      ((event.clientY - rect.top) / rect.height) * canvasHeight
    );
  };
  const endMinimapDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    minimapDragRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const exportMap = async () => {
    const canvas =
      scrollRef.current?.querySelector<HTMLElement>(".experiment-canvas");
    if (!canvas || isExporting) return;
    setIsExporting(true);
    setExportMessage("");
    try {
      const dataUrl = await toPng(canvas, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#123d2d",
        width: canvasWidth,
        height: canvasHeight,
        style: { transform: "none", transformOrigin: "top left" },
      });
      const link = document.createElement("a");
      link.download = `atlas-sawitmvc-${focusMode ? `${selected.id}-fokus` : "peta-lengkap"}-2x.png`;
      link.href = dataUrl;
      link.click();
      setExportMessage("PNG 2× siap diunduh");
    } catch {
      setExportMessage("Ekspor belum dapat dibuat. Coba lagi.");
    } finally {
      setIsExporting(false);
      if (exportTimerRef.current !== null)
        window.clearTimeout(exportTimerRef.current);
      exportTimerRef.current = window.setTimeout(
        () => setExportMessage(""),
        3200
      );
    }
  };
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      (event.target as HTMLElement).closest(
        "button, a, select, input, .edge-hitarea"
      )
    )
      return;
    dragRef.current = {
      active: true,
      lastX: event.clientX,
      lastY: event.clientY,
    };
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
    if (
      dragRef.current.active &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    )
      event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current.active = false;
    setIsDragging(false);
  };
  const showExperiment = (experiment: Experiment) =>
    !focusMode || branch.has(experiment.id);
  const showEdge = (parentId: string, childId: string) =>
    !focusMode || (branch.has(parentId) && branch.has(childId));
  const tooltipParent = edgeTooltip
    ? lookup.get(edgeTooltip.parentId)
    : undefined;
  const tooltipChild = edgeTooltip
    ? experiments.find(item => item.id === edgeTooltip.childId)
    : undefined;
  const tooltipReason =
    edgeTooltip && tooltipChild
      ? reasonForEdge(edgeTooltip.parentId, tooltipChild)
      : undefined;

  return (
    <section
      ref={graphRef}
      className={`graph-shell ${isFullscreen && isFullscreenEvidenceOpen ? "has-fullscreen-evidence" : ""}`}
      aria-label="Peta garis keturunan eksperimen"
    >
      <div className="graph-topbar">
        <div className="graph-note">
          <span />
          Tarik latar untuk menggeser peta. Arahkan ke garis untuk membaca
          alasan; roda + <kbd>Ctrl</kbd> untuk zoom.
        </div>
        <div className="graph-controls" aria-label="Kontrol peta">
          {isFullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreenEvidenceOpen(current => !current)}
              aria-pressed={isFullscreenEvidenceOpen}
              aria-label={
                isFullscreenEvidenceOpen
                  ? "Sembunyikan lembar bukti"
                  : "Tampilkan lembar bukti"
              }
              title={
                isFullscreenEvidenceOpen
                  ? "Sembunyikan lembar bukti"
                  : "Tampilkan lembar bukti"
              }
              className={isFullscreenEvidenceOpen ? "is-active" : ""}
            >
              <FileText size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={exportMap}
            disabled={isExporting}
            aria-label="Unduh peta sebagai PNG resolusi tinggi"
            title="Unduh PNG 2×"
          >
            {isExporting ? (
              <LoaderCircle className="is-spinning" size={14} />
            ) : (
              <Download size={14} />
            )}
          </button>
          <button
            type="button"
            onClick={() => setFocusMode(current => !current)}
            aria-pressed={focusMode}
            aria-label={
              focusMode
                ? "Keluar mode fokus cabang"
                : "Fokuskan cabang node terpilih"
            }
            title={
              focusMode ? "Keluar mode fokus" : "Fokus cabang node terpilih"
            }
            className={focusMode ? "is-active" : ""}
          >
            <ScanLine size={14} />
          </button>
          <button
            type="button"
            onClick={() => setZoomClamped(zoom - 0.1)}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Perkecil peta"
            title="Perkecil peta"
          >
            <ZoomOut size={15} />
          </button>
          <output aria-label={`Zoom ${Math.round(zoom * 100)} persen`}>
            {Math.round(zoom * 100)}%
          </output>
          <button
            type="button"
            onClick={() => setZoomClamped(zoom + 0.1)}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Perbesar peta"
            title="Perbesar peta"
          >
            <ZoomIn size={15} />
          </button>
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset tampilan peta"
            title="Reset tampilan"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={
              isFullscreen ? "Keluar dari layar penuh" : "Buka peta layar penuh"
            }
            title={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>
      {focusMode && (
        <div className="focus-strip">
          <ScanLine size={13} />
          <span>
            <strong>Mode fokus cabang silsilah.</strong> Menampilkan garis dependensi leluhur dan turunan untuk{" "}
            <b>{selected.id}</b>.
          </span>
          <button type="button" onClick={() => setFocusMode(false)}>
            Tampilkan seluruh atlas
          </button>
        </div>
      )}
      {exportMessage && (
        <div className="export-note" role="status">
          {exportMessage}
        </div>
      )}
      {isFullscreen && isFullscreenEvidenceOpen && (
        <aside
          className="fullscreen-evidence"
          aria-label={`Lembar bukti ${selected.id}`}
        >
          <button
            type="button"
            className="fullscreen-evidence-close"
            onClick={() => setIsFullscreenEvidenceOpen(false)}
            aria-label="Tutup lembar bukti"
            title="Tutup lembar bukti"
          >
            <X size={15} />
          </button>
          <ExperimentDetail experiment={selected} onSelect={onSelect} />
        </aside>
      )}
      <div
        ref={scrollRef}
        className={`graph-scroll ${isDragging ? "is-grabbing" : ""}`}
        onScroll={updateViewport}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="zoom-stage"
          style={{ width: canvasWidth * zoom, height: canvasHeight * zoom }}
        >
          <div
            className="experiment-canvas"
            style={{ ...canvasStyle, transform: `scale(${zoom})` }}
          >
            {layout.lanes.map(lane => (
              <div
                key={lane.id}
                className={`canvas-lane canvas-lane-${lane.tone}`}
                style={{ top: lane.y, height: lane.height }}
              >
                <strong>{lane.label}</strong>
                <span>{lane.caption}</span>
              </div>
            ))}
            <svg
              className="lineage-svg"
              viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              /* Not role="img": that role makes its subtree presentational, which would hide
                 every focusable edge button below from assistive technology. */
              role="group"
              aria-label="Garis hubungan antar eksperimen"
              shapeRendering="geometricPrecision"
              onPointerLeave={() => setEdgeTooltip(null)}
            >
              {routedEdges.map(edge => {
                const parent = lookup.get(edge.parentId) as
                  | { id: string; position: { x: number; y: number } }
                  | undefined;
                if (!parent || !showEdge(edge.parentId, edge.child.id))
                  return null;
                const active =
                  lineage.has(edge.child.id) && lineage.has(edge.parentId);
                const parentPosition =
                  layout.positions[edge.parentId] ?? parent.position;
                const childPosition =
                  layout.positions[edge.child.id] ?? edge.child.position;
                const isArchiveBridge =
                  (edge.parentId.startsWith("RP-") ||
                    edge.parentId.startsWith("HB-") ||
                    edge.parentId.startsWith("HD-")) !==
                    edge.child.id.startsWith("RP-") &&
                  !edge.child.id.startsWith("HB-") &&
                  !edge.child.id.startsWith("HD-");
                const path = orthogonalPath(
                  parentPosition,
                  childPosition,
                  edge,
                  edge.parentId.startsWith("dataset-")
                );
                const fallbackTooltip = {
                  parentId: edge.parentId,
                  childId: edge.child.id,
                  x: (parentPosition.x + childPosition.x) / 2,
                  y: (parentPosition.y + childPosition.y) / 2,
                };
                const setTooltipFromPointer = (
                  event: React.PointerEvent<SVGPathElement>
                ) => {
                  const rect =
                    event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (!rect?.width || !rect.height)
                    return setEdgeTooltip(fallbackTooltip);
                  setEdgeTooltip({
                    parentId: edge.parentId,
                    childId: edge.child.id,
                    x: ((event.clientX - rect.left) / rect.width) * canvasWidth,
                    y:
                      ((event.clientY - rect.top) / rect.height) * canvasHeight,
                  });
                };
                const pinned = pinnedEdgeKey === edge.key;
                return (
                  <g key={edge.key}>
                    <path
                      d={path}
                      className={`lineage-path ${active ? "is-active" : ""} ${isArchiveBridge ? "is-archive-bridge" : ""} ${pinned ? "is-pinned" : ""}`}
                    />
                    <path
                      d={path}
                      className={`edge-hitarea ${pinned ? "is-pinned" : ""}`}
                      tabIndex={0}
                      role="button"
                      aria-pressed={pinned}
                      aria-label={`Alasan hubungan ${edge.parentId} ke ${edge.child.id}`}
                      onPointerEnter={setTooltipFromPointer}
                      onPointerMove={setTooltipFromPointer}
                      onFocus={() => setEdgeTooltip(fallbackTooltip)}
                      onBlur={() => setEdgeTooltip(null)}
                      onClick={() =>
                        setPinnedEdgeKey(current =>
                          current === edge.key ? null : edge.key
                        )
                      }
                      onKeyDown={event => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        setPinnedEdgeKey(current =>
                          current === edge.key ? null : edge.key
                        );
                      }}
                    />
                  </g>
                );
              })}
            </svg>
            {edgeTooltip && tooltipChild && tooltipReason && (
              <aside
                className="edge-tooltip"
                role="status"
                style={{
                  left: Math.min(
                    canvasWidth - 350,
                    Math.max(18, edgeTooltip.x + 18)
                  ),
                  top: Math.min(
                    canvasHeight - 230,
                    Math.max(18, edgeTooltip.y + 18)
                  ),
                }}
              >
                <span className="edge-tooltip-kicker">
                  <Crosshair size={12} />
                  RASIONAL RELASI SILSILAH
                </span>
                <strong>
                  {tooltipParent &&
                    ("title" in tooltipParent
                      ? tooltipParent.title
                      : tooltipParent.label)}{" "}
                  <i>→</i> {tooltipChild.title}
                </strong>
                <p>{tooltipReason.relation}</p>
                {tooltipReason.sourceConclusion && (
                  <small>
                    <b>Temuan acuan pendahulu:</b> {tooltipReason.sourceConclusion}
                  </small>
                )}
              </aside>
            )}
            {datasetRoots.map(root => (
              <button
                key={root.id}
                type="button"
                className={`dataset-root ${lineage.has(root.id) ? "is-active" : ""} ${focusMode && !branch.has(root.id) ? "is-focus-hidden" : ""}`}
                style={{
                  left: layout.positions[root.id]?.x ?? root.position.x,
                  top: layout.positions[root.id]?.y ?? root.position.y,
                }}
                onClick={() =>
                  selectNode(
                    root.id === "dataset-953" ? "V2-E-001" : "V2-E-003"
                  )
                }
              >
                <span>DATASET</span>
                <strong>{root.label}</strong>
                <small>{root.detail}</small>
              </button>
            ))}
            {experiments.map(experiment => (
              <ExperimentNode
                key={experiment.id}
                experiment={experiment}
                position={layout.positions[experiment.id]}
                selected={experiment.id === selected.id}
                dimmed={!visible(experiment)}
                hidden={!showExperiment(experiment)}
                lineageActive={lineage.has(experiment.id)}
                onSelect={selectNode}
              />
            ))}
            <div className="canvas-legend">
              {Object.entries(statusInfo).map(([status, info]) => (
                <span key={status}>
                  <i className={info.dot} />
                  {info.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="graph-minimap" aria-label="Minimap atlas eksperimen">
        <div className="minimap-title">
          <span>MINIMAP ATLAS</span>
          <small>Navigasi cepat area kanvas</small>
        </div>
        <svg
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          role="group"
          aria-label="Ringkasan posisi eksperimen dan era penelitian"
          onPointerDown={event => {
            event.preventDefault();
            minimapDragRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            panFromMinimap(event);
          }}
          onPointerMove={event => {
            if (minimapDragRef.current) panFromMinimap(event);
          }}
          onPointerUp={endMinimapDrag}
          onPointerCancel={endMinimapDrag}
        >
          {layout.lanes.map(lane => (
            <g
              key={lane.id}
              role="button"
              tabIndex={0}
              aria-label={`Lompat ke ${lane.label}`}
              /* No pointer handler: lanes cover the whole minimap, so swallowing pointerdown
                 here would kill the drag before it starts. Keyboard still jumps to the lane. */
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  jumpTo(canvasWidth / 2, lane.y + lane.height / 2);
                }
              }}
            >
              <rect
                className={`minimap-lane minimap-lane-${lane.tone}`}
                x="0"
                y={lane.y}
                width={canvasWidth}
                height={lane.height}
              />
              <text x="46" y={lane.y + Math.min(42, lane.height / 2)}>
                {lane.label.replace("ARSIP · ", "")}
              </text>
            </g>
          ))}
          {datasetRoots.map(root => {
            const position = layout.positions[root.id] ?? root.position;
            return (
              <rect
                key={root.id}
                className="minimap-root"
                x={position.x}
                y={position.y}
                width="176"
                height="107"
              />
            );
          })}
          {experiments.map(experiment => {
            const position = layout.positions[experiment.id];
            return (
              <rect
                key={experiment.id}
                className={`minimap-node minimap-${experiment.status} ${experiment.id === selected.id ? "is-selected" : ""} ${focusMode && !branch.has(experiment.id) ? "is-focus-hidden" : ""}`}
                x={position.x}
                y={position.y}
                width="176"
                height="107"
              />
            );
          })}
          <rect
            ref={viewportRectRef}
            className="minimap-viewport"
            x="0"
            y="0"
            width="0"
            height="0"
          />
        </svg>
      </div>
    </section>
  );
}
