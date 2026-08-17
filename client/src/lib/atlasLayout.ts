/** Tata letak Field Research Ledger — swimlane semantis dengan perutean silsilah yang terbaca dan tidak terputus. */
import type { Experiment } from "@/lib/experimentData";

export type AtlasPosition = { x: number; y: number };
export type AtlasLane = { id: string; label: string; caption: string; y: number; height: number; tone: "primary" | "depth" | "audit" | "archive" };

const CARD_GAP = 214;
const START_X = 286;

// Koordinat mengikuti urutan kausal: bukti eksperimen bergerak ke kanan; simpul audit dan sintesis
// berada di ujung cabangnya sendiri, bukan kembali ke kiri.
const v2Positions: Record<string, AtlasPosition> = {
  // Lane 1: 953 · BENCHMARK & COUNTING (y: 28–206)
  "V2-E-001": { x: 286, y: 78 }, "V2-E-002": { x: 500, y: 78 },
  "V2-E-027": { x: 714, y: 78 }, "V2-E-028": { x: 928, y: 78 }, "V2-E-029": { x: 1142, y: 78 },
  "V2-E-025": { x: 1356, y: 78 },
  // Lane 2: 352 · REPRESENTASI SENSOR (y: 252–586)
  "V2-E-003": { x: 286, y: 304 }, "V2-E-004": { x: 500, y: 304 },
  "V2-E-005": { x: 714, y: 304 }, "V2-E-006": { x: 928, y: 304 },
  "V2-E-008": { x: 928, y: 440 }, "V2-E-009": { x: 1142, y: 440 },
  "V2-E-010": { x: 1142, y: 304 }, "V2-E-011": { x: 1356, y: 304 },
  "V2-E-030": { x: 1356, y: 440 }, "V2-E-031": { x: 1570, y: 440 },
  // Lane 3: DIAGNOSIS & DUA-TAHAP (y: 586–862)
  "V2-E-012": { x: 500, y: 610 }, "V2-E-013": { x: 714, y: 610 },
  "V2-E-014": { x: 928, y: 610 }, "V2-E-015": { x: 1142, y: 610 },
  "V2-E-016": { x: 1356, y: 610 }, "V2-E-017": { x: 1142, y: 746 },
  "V2-E-018": { x: 1356, y: 746 }, "V2-E-019": { x: 1570, y: 746 },
  "V2-E-020": { x: 1784, y: 746 }, "V2-E-021": { x: 1998, y: 746 },
  "V2-E-024": { x: 2426, y: 746 }, "V2-E-026": { x: 2640, y: 746 },
  // Lane 4: SINTESIS, AUDIT & BATAS INFERENSI (y: 862–1072)
  "V2-E-007": { x: 1142, y: 918 }, "V2-E-032": { x: 1784, y: 918 },
  "V2-E-023": { x: 1998, y: 918 }, "V2-E-022": { x: 2212, y: 918 },
  "V2-E-033": { x: 2640, y: 918 },
};

export const atlasLanes: AtlasLane[] = [
  { id: "rgb-953", label: "953 · BENCHMARK & COUNTING", caption: "reproduksi, test bersih, dan mono RGB", y: 28, height: 178, tone: "primary" },
  { id: "depth-352", label: "352 · REPRESENTASI SENSOR", caption: "RGB, inverse, edge, dan mono depth", y: 252, height: 334, tone: "depth" },
  { id: "diagnosis", label: "DIAGNOSIS & DUA-TAHAP", caption: "mekanisme kelas, classifier crop, dan pipeline", y: 586, height: 276, tone: "primary" },
  { id: "audit", label: "SINTESIS, AUDIT & BATAS INFERENSI", caption: "power, temporal shift, split, dan sintesis", y: 862, height: 210, tone: "audit" },
  { id: "dedup", label: "ARSIP · DEDUPLIKASI & ORACLE", caption: "Apr–Mei 2026 · heuristik, GT, dan E2E awal", y: 1100, height: 310, tone: "archive" },
  { id: "baseline", label: "ARSIP · BASELINE PUBLIK", caption: "Mei–Jun 2026 · counter terkontrol dan rilis E2E", y: 1450, height: 150, tone: "archive" },
  { id: "pipeline", label: "ARSIP · RESEARCH PIPELINE", caption: "Jul–Agu 2026 · diagnosis, sensor, audit, dan replikasi", y: 1640, height: 520, tone: "archive" },
  { id: "formulation", label: "ARSIP · FORMULASI", caption: "Aug 2026 · prasyarat dan cabang yang dihentikan", y: 2200, height: 154, tone: "archive" },
];

function setRow(positions: Record<string, AtlasPosition>, ids: readonly string[], y: number, columns = ids.length) {
  ids.forEach((id, index) => {
    positions[id] = { x: START_X + (index % columns) * CARD_GAP, y: y + Math.floor(index / columns) * 136 };
  });
}

export function buildAtlasLayout(experiments: Experiment[]) {
  const positions: Record<string, AtlasPosition> = {
    "dataset-953": { x: 42, y: 76 },
    "dataset-352": { x: 42, y: 302 },
  };
  const placed = new Set<string>(Object.keys(v2Positions));
  Object.assign(positions, v2Positions);

  const dedup = experiments.filter((item) => item.id.startsWith("HD-")).map((item) => item.id);
  const baseline = experiments.filter((item) => item.id.startsWith("HB-")).map((item) => item.id);
  const pipeline = experiments.filter((item) => item.id.startsWith("RP-E")).map((item) => item.id);
  const formulation = experiments.filter((item) => item.id.startsWith("RP-F")).map((item) => item.id);
  setRow(positions, dedup, 1144, 7); dedup.forEach((id) => placed.add(id));
  setRow(positions, baseline, 1492, 9); baseline.forEach((id) => placed.add(id));
  setRow(positions, pipeline, 1684, 10); pipeline.forEach((id) => placed.add(id));
  setRow(positions, formulation, 2240, 6); formulation.forEach((id) => placed.add(id));

  const residual = experiments.filter((item) => !placed.has(item.id));
  setRow(positions, residual.map((item) => item.id), 2440, 8);
  const maxX = Math.max(...Object.values(positions).map((position) => position.x));
  const maxY = Math.max(...Object.values(positions).map((position) => position.y));
  return { positions, canvasWidth: Math.max(3060, maxX + 260), canvasHeight: Math.max(2640, maxY + 190), lanes: atlasLanes };
}

/**
 * Menghasilkan satu rute kubik utuh untuk setiap relasi. Ofset deterministiknya menjaga agar
 * tautan bersaudara tidak menumpuk pada koridor vertikal sempit yang sama.
 */
export function orthogonalPath(parent: AtlasPosition, child: AtlasPosition, route: { serial: number; sourceIndex: number; sourceCount: number; targetIndex: number; targetCount: number }, parentIsRoot = false) {
  const parentWidth = parentIsRoot ? 174 : 176;
  const parentHeight = parentIsRoot ? 104 : 107;
  const childHeight = 107;
  const startX = parent.x + parentWidth;
  const sourceSpan = Math.max(1, parentHeight - 40);
  const targetSpan = Math.max(1, childHeight - 40);
  const startY = parent.y + 20 + (route.sourceCount === 1 ? sourceSpan / 2 : (route.sourceIndex / (route.sourceCount - 1)) * sourceSpan);
  const targetX = child.x;
  const targetY = child.y + 20 + (route.targetCount === 1 ? targetSpan / 2 : (route.targetIndex / (route.targetCount - 1)) * targetSpan);
  const sourceBias = route.sourceIndex - (route.sourceCount - 1) / 2;
  const targetBias = route.targetIndex - (route.targetCount - 1) / 2;
  const horizontalDistance = targetX - startX;

  if (horizontalDistance >= 44) {
    const handle = Math.max(40, Math.min(132, horizontalDistance * 0.38));
    return `M ${startX} ${startY} C ${startX + handle} ${startY + sourceBias * 11}, ${targetX - handle} ${targetY + targetBias * 11}, ${targetX} ${targetY}`;
  }

  // Tautan audit dan arsip yang mengarah mundur memutar melalui slot vertikal yang unik, bukan
  // menumpuk menjadi satu jalan memutar berbentuk persegi yang dipakai bersama.
  const loopX = Math.max(startX, targetX) + 68 + (route.serial % 7) * 18;
  const loopY = Math.max(parent.y + parentHeight, child.y + childHeight) + 32 + (route.serial % 5) * 18;
  return `M ${startX} ${startY} C ${loopX} ${startY + sourceBias * 11}, ${loopX} ${loopY}, ${loopX} ${loopY} C ${targetX - 54} ${loopY}, ${targetX - 42} ${targetY + targetBias * 11}, ${targetX} ${targetY}`;
}
