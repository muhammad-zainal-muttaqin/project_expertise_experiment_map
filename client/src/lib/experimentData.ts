import { historicalExperiments } from "@/lib/historicalExperiments";

/**
 * Lapisan data Field Research Ledger — bersumber dari commit 225faaeb project-expertise.
 * Setiap simpul mewakili satu eksperimen, audit, atau sintesis yang tercatat pada EKSPERIMEN.md.
 */
export type ExperimentStatus =
  | "supported"
  | "negative"
  | "inconclusive"
  | "audit_needed";
export type DatasetId =
  | "SawitMVC-953"
  | "SawitMVC-Depth-352"
  | "Lintas-dataset"
  | "Audit";

export interface Metric {
  label: string;
  value: string;
  note?: string;
}

export interface Experiment {
  id: string;
  title: string;
  date: string;
  phase: string;
  dataset: DatasetId;
  inputs: string[];
  model: string;
  seeds: string;
  status: ExperimentStatus;
  conclusion: string;
  findings: string;
  metrics: Metric[];
  perClass?: Metric[];
  confidence?: Metric;
  artifacts: string[];
  parentIds: string[];
  position: { x: number; y: number };
  era?: string;
  source?: { repo: string; commit: string; url: string };
}

export interface DatasetRoot {
  id: string;
  label: string;
  detail: string;
  position: { x: number; y: number };
}

export const datasetRoots: DatasetRoot[] = [
  {
    id: "dataset-953",
    label: "SawitMVC · 953",
    detail: "Modalitas RGB · 953 pohon · 3.992 citra",
    position: { x: 38, y: 94 },
  },
  {
    id: "dataset-352",
    label: "SawitMVC-Depth · 352",
    detail: "Modalitas RGB + sensor depth · 352 pohon · 1.408 citra",
    position: { x: 38, y: 584 },
  },
];

export const experiments: Experiment[] = [
  {
    id: "V2-E-001",
    title: "Reproduksi tiga arsitektur pada 953 RGB",
    date: "09 Agu 2026",
    phase: "Fondasi",
    dataset: "SawitMVC-953",
    inputs: ["RGB"],
    model: "YOLO26l · RT-DETR-L · RF-DETR-L",
    seeds: "1 run · seed 42",
    status: "supported",
    conclusion:
      "Tiga arsitektur berhasil mereproduksi benchmark Volume 1 dengan toleransi selisih ±0,014 mAP50.",
    findings:
      "RF-DETR-L mencatatkan performa deteksi RGB-953 tertinggi dan ditetapkan sebagai acuan komparasi pada eksperimen selanjutnya.",
    metrics: [
      { label: "YOLO26l mAP50", value: "0,5435" },
      { label: "RT-DETR-L mAP50", value: "0,5781" },
      { label: "RF-DETR-L mAP50", value: "0,6012" },
      { label: "RF-DETR-L mAP50-95", value: "0,2747" },
    ],
    perClass: [
      {
        label: "YOLO26l B1/B2/B3/B4",
        value: "0,7705 / 0,4479 / 0,6050 / 0,3506",
      },
      {
        label: "RF-DETR-L B1/B2/B3/B4",
        value: "0,8150 / 0,5184 / 0,6553 / 0,4160",
      },
    ],
    artifacts: [
      "results/perkelas_pycoco_v2repro.json",
      "models/yolo26l_e60_i1280_v2repro/best.pt",
    ],
    parentIds: ["dataset-953", "RP-E021"],
    position: { x: 238, y: 52 },
  },
  {
    id: "V2-E-002",
    title: "Evaluasi pencacahan tiga detektor pada 953",
    date: "09 Agu 2026",
    phase: "Fondasi",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Counting"],
    model: "Ridge + F_all",
    seeds: "1 run · seed 42",
    status: "negative",
    conclusion:
      "Tidak ada arsitektur detektor baru yang melampaui baseline YOLO26m pada metrik akurasi Class ±1.",
    findings:
      "Detektor dengan nilai mAP tertinggi tidak secara otomatis menghasilkan estimasi pencacahan (counting) terbaik.",
    metrics: [
      { label: "Baseline YOLO26m", value: "77,48%", note: "Class ±1" },
      { label: "YOLO26l", value: "72,16%", note: "Class ±1" },
      { label: "RT-DETR-L", value: "76,24%", note: "Class ±1" },
      { label: "RF-DETR-L", value: "76,24%", note: "Class ±1" },
      { label: "MAE RF-DETR-L", value: "0,993" },
    ],
    perClass: [
      { label: "B3 paling lemah", value: "48,2–60,3%", note: "Class ±1" },
    ],
    artifacts: ["results/counting_v2repro.json"],
    parentIds: ["V2-E-001"],
    position: { x: 238, y: 196 },
  },
  {
    id: "V2-E-003",
    title: "Deteksi tiga arsitektur pada 352 RGB",
    date: "09 Agu 2026",
    phase: "Fondasi",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB"],
    model: "YOLO26l · RT-DETR-L · RF-DETR-L",
    seeds: "1 run · seed 42",
    status: "supported",
    conclusion:
      "Hierarki performa RF-DETR-L > RT-DETR-L > YOLO26l terbukti konsisten pada dataset SawitMVC-Depth-352.",
    findings:
      "Tingkat kesulitan deteksi kelas B3 dan B4 meningkat secara signifikan pada dataset Depth-352.",
    metrics: [
      { label: "YOLO26l mAP50", value: "0,3606" },
      { label: "RT-DETR-L mAP50", value: "0,4343" },
      { label: "RF-DETR-L mAP50", value: "0,4544" },
      { label: "RF-DETR-L mAP50-95", value: "0,1599" },
    ],
    perClass: [
      {
        label: "RF-DETR-L B1/B2/B3/B4",
        value: "0,6853 / 0,5184 / 0,3477 / 0,2661",
      },
    ],
    artifacts: ["results/perkelas_pycoco_rgb352.json"],
    parentIds: ["dataset-352"],
    position: { x: 238, y: 484 },
  },
  {
    id: "V2-E-004",
    title: "Evaluasi pencacahan tiga detektor pada 352 RGB",
    date: "09 Agu 2026",
    phase: "Fondasi",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Counting"],
    model: "Ridge + F_all",
    seeds: "1 run · seed 42",
    status: "negative",
    conclusion:
      "Urutan akurasi pencacahan tidak berbanding lurus dengan urutan metrik mAP50 pada tahap deteksi.",
    findings:
      "RT-DETR-L menghasilkan akurasi Class ±1 tertinggi meskipun RF-DETR-L memimpin pada tahap deteksi.",
    metrics: [
      { label: "YOLO26l", value: "89,55%", note: "Class ±1" },
      { label: "RT-DETR-L", value: "90,91%", note: "Class ±1" },
      { label: "RF-DETR-L", value: "88,18%", note: "Class ±1" },
      { label: "RT-DETR-L macro MAE", value: "0,532" },
    ],
    artifacts: ["results/counting_rgb352.json"],
    parentIds: ["V2-E-003"],
    position: { x: 238, y: 628 },
  },
  {
    id: "V2-E-005",
    title: "Early fusion RGB + depth inverse",
    date: "09 Agu 2026",
    phase: "Fondasi",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Depth"],
    model: "YOLO26l · RT-DETR-L · RF-DETR-L",
    seeds: "1 run · seed 42",
    status: "negative",
    conclusion:
      "Integrasi early fusion depth tidak memberikan peningkatan deteksi yang konsisten lintas arsitektur.",
    findings:
      "Peningkatan performa hanya teramati pada YOLO26l, sedangkan RT-DETR-L dan RF-DETR-L mengalami penurunan (terutama pada kelas B4).",
    metrics: [
      { label: "YOLO26l Δ mAP50", value: "+0,0313", note: "0,3919 vs 0,3606" },
      { label: "RT-DETR-L Δ", value: "−0,0466", note: "Δ mAP50 terhadap RGB" },
      { label: "RF-DETR-L Δ", value: "−0,0358", note: "Δ mAP50 terhadap RGB" },
    ],
    perClass: [
      {
        label: "YOLO26l RGBD B1/B2/B3/B4",
        value: "0,6857 / 0,4579 / 0,2637 / 0,1601",
      },
    ],
    artifacts: ["results/perkelas_pycoco_rgbd352.json"],
    parentIds: ["V2-E-003"],
    position: { x: 452, y: 478 },
  },
  {
    id: "V2-E-006",
    title: "Evaluasi pencacahan RGB + depth inverse",
    date: "09 Agu 2026",
    phase: "Fondasi",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Depth", "Counting"],
    model: "Ridge + F_all",
    seeds: "10.000 resampling bootstrap · seed 42",
    status: "negative",
    conclusion:
      "Metode early fusion kedalaman tidak meningkatkan akurasi pencacahan pada seluruh arsitektur yang diuji.",
    findings:
      "Selang kepercayaan (CI 95%) pada seluruh perbandingan RGB-D terhadap RGB mencakup nilai nol.",
    metrics: [
      { label: "YOLO26l Δ Class ±1", value: "−1,82 pp" },
      { label: "RT-DETR-L Δ", value: "−2,27 pp", note: "Δ Class ±1" },
      { label: "RF-DETR-L Δ", value: "±0,00 pp", note: "Δ Class ±1" },
    ],
    confidence: {
      label: "CI bootstrap RF-DETR-L",
      value: "[−2,7 pp; +2,7 pp]",
    },
    artifacts: [
      "results/counting_rgbd352.json",
      "results/bootstrap_ci_352.json",
    ],
    parentIds: ["V2-E-004", "V2-E-005"],
    position: { x: 452, y: 622 },
  },
  {
    id: "V2-E-007",
    title: "Sintesis matriks 9 sel",
    date: "09 Agu 2026",
    phase: "Sintesis",
    dataset: "Lintas-dataset",
    inputs: ["RGB", "Depth", "Counting"],
    model: "Matriks lintas arsitektur",
    seeds: "agregasi · ulangan tidak dicatat",
    status: "audit_needed",
    conclusion:
      "Sintesis awal dibatasi secara metodologis oleh temuan pergeseran temporal dan keterbatasan daya statistik data.",
    findings:
      "Disimpan sebagai rekam jejak keputusan historis, bukan sebagai bukti empiris efek kedalaman lintas dataset.",
    metrics: [
      { label: "Sel deteksi", value: "3 × 3" },
      { label: "Sel counting", value: "3 × 3" },
      { label: "Kelas paling sulit", value: "B3" },
    ],
    artifacts: [
      "results/matrix_compiled.json",
      "results/bootstrap_ci_352.json",
    ],
    parentIds: ["V2-E-001", "V2-E-006"],
    position: { x: 452, y: 766 },
  },
  {
    id: "V2-E-008",
    title: "Penyaringan representasi encoding depth",
    date: "10–11 Agu 2026",
    phase: "Fase 5",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Depth", "Edge"],
    model: "YOLO26l · 15 epoch",
    seeds: "1 run · seed 42",
    status: "supported",
    conclusion:
      "Representasi kontur Sobel (edge) unggul pada tahap penyaringan awal dan dipromosikan ke pelatihan penuh.",
    findings:
      "Metrik evaluasi 15 epoch bersifat indikatif dan tidak dapat disetarakan dengan hasil konvergensi 60 epoch.",
    metrics: [
      { label: "Edge val mAP50", value: "0,3777" },
      { label: "Valid mask", value: "0,3321", note: "val mAP50" },
      { label: "Clipped", value: "0,3221", note: "val mAP50" },
      { label: "Dropout", value: "0,3168", note: "val mAP50" },
    ],
    artifacts: ["runs/yolo26l_screening_edge352/hasil.json"],
    parentIds: ["V2-E-005"],
    position: { x: 666, y: 482 },
  },
  {
    id: "V2-E-009",
    title: "Mid-fusion depth + gating",
    date: "11 Agu 2026",
    phase: "Fase 5",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Depth", "Mid-fusion"],
    model: "YOLO26l · 15 epoch",
    seeds: "1 run · seed 42",
    status: "negative",
    conclusion:
      "Konfigurasi mid-fusion teruji tidak memenuhi ambang batas penyaringan awal sehingga tidak dipromosikan.",
    findings:
      "Mekanisme gating bergeser ke rentang 0,020–0,025, namun nilai presisi kelas B3 dan B4 mendekati nol.",
    metrics: [
      { label: "Val mAP50 terbaik", value: "0,2087", note: "epoch 3" },
      { label: "B3 AP50", value: "0,056" },
      { label: "B4 AP50", value: "0,051" },
    ],
    artifacts: ["runs/yolo26l_screening_midfusion352/hasil.json"],
    parentIds: ["V2-E-005"],
    position: { x: 666, y: 626 },
  },
  {
    id: "V2-E-010",
    title: "Validasi detektor RGB + edge-depth pelatihan penuh",
    date: "11 Agu 2026",
    phase: "Fase 5",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Depth", "Edge"],
    model: "YOLO26l · 60 epoch",
    seeds: "1 run · seed 42",
    status: "supported",
    conclusion:
      "Representasi edge-depth meningkatkan mAP50 deteksi secara nyata dibandingkan depth inverse dan baseline RGB.",
    findings:
      "Peningkatan performa deteksi tidak bertranslasi menjadi keunggulan pada akurasi pencacahan Class ±1.",
    metrics: [
      { label: "mAP50 edge", value: "0,4316" },
      { label: "Δ vs inverse", value: "+0,0397", note: "Δ mAP50" },
      { label: "mAP50-95", value: "0,1441" },
      { label: "Counting Class ±1", value: "87,27%" },
    ],
    perClass: [
      {
        label: "Δ B1/B2/B3/B4 vs inverse",
        value: "+0,0395 / +0,0452 / −0,0397 / +0,1139",
      },
    ],
    artifacts: [
      "results/perkelas_pycoco_rgbd352.json",
      "results/counting_rgbd352.json",
    ],
    parentIds: ["V2-E-008"],
    position: { x: 880, y: 482 },
  },
  {
    id: "V2-E-011",
    title: "Evaluasi stabilitas baseline pencacahan edge",
    date: "11 Agu 2026",
    phase: "Fase 5",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Depth", "Edge", "Counting"],
    model: "YOLO26l + Ridge",
    seeds: "10.000 resampling bootstrap · seed 42",
    status: "inconclusive",
    conclusion:
      "Kesimpulan perbandingan pencacahan sensitif terhadap variasi pelatihan ulang baseline sehingga belum konklusif secara ketat.",
    findings:
      "Pelatihan ulang RGB menghasilkan akurasi 84,09%, berselisih 5,46 pp dari baseline historis (89,55%).",
    metrics: [
      { label: "Edge vs retrain RGB", value: "+3,18 pp", note: "Class ±1" },
      { label: "P(Δ>0)", value: "94,3%" },
      { label: "Edge vs RGB asli", value: "−2,28 pp", note: "Class ±1" },
    ],
    confidence: { label: "CI bootstrap Class ±1", value: "[−0,5 pp; +7,3 pp]" },
    artifacts: [
      "results/bootstrap_ci_352.json",
      "results/counting_rgb352.json",
    ],
    parentIds: ["V2-E-010", "V2-E-004"],
    position: { x: 880, y: 626 },
  },
  {
    id: "V2-E-012",
    title: "Diagnosis disparitas komposisi kelas 953 vs 352",
    date: "11 Agu 2026",
    phase: "Diagnosis",
    dataset: "Lintas-dataset",
    inputs: ["Audit label"],
    model: "Probe read-only",
    seeds: "protokol deterministik · ulangan tidak dicatat",
    status: "audit_needed",
    conclusion:
      "Disparitas data terkonfirmasi nyata, dengan faktor kausal utama dikoreksi oleh pergeseran sesi akuisisi (V2-E-022).",
    findings:
      "Proporsi kelas B3/B4 sangat langka pada dataset 352; komparasi lintas dataset tidak valid untuk menguji efek kedalaman.",
    metrics: [
      { label: "B3 train 953 → 352", value: "7.333 → 215", note: "34×" },
      { label: "B4 train 953 → 352", value: "2.513 → 98", note: "26×" },
      { label: "B3 AP50", value: "0,6050 → 0,2001" },
    ],
    artifacts: [
      "results/perkelas_pycoco_v2repro.json",
      "results/perkelas_pycoco_rgb352.json",
    ],
    parentIds: ["V2-E-001", "V2-E-003"],
    position: { x: 666, y: 52 },
  },
  {
    id: "V2-E-013",
    title: "Diagnosis lokalisasi vs kesalahan klasifikasi",
    date: "11 Agu 2026",
    phase: "Diagnosis",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Class-agnostic"],
    model: "YOLO26l · evaluator AP50",
    seeds: "1 run · seed 42",
    status: "supported",
    conclusion:
      "Sebanyak 44,5% degradasi performa detektor disebabkan oleh kesalahan klasifikasi kematangan, bukan kegagalan lokalisasi objek.",
    findings:
      "Matriks konfusi terkonsentrasi antarkelas bersebelahan, mengonfirmasi bahwa masalah bersifat ordinal.",
    metrics: [
      { label: "mAP50 class-aware", value: "0,3707" },
      { label: "AP50 agnostik", value: "0,6677" },
      {
        label: "Hilang karena kelas",
        value: "0,2970 · 44,5%",
        note: "AP50 agnostik − class-aware",
      },
      { label: "Akurasi conditional", value: "70,5%" },
    ],
    artifacts: ["scripts/eval_twostage.py"],
    parentIds: ["V2-E-003"],
    position: { x: 880, y: 52 },
  },
  {
    id: "V2-E-014",
    title: "Analisis sinyal relief depth",
    date: "11 Agu 2026",
    phase: "Diagnosis",
    dataset: "SawitMVC-Depth-352",
    inputs: ["Depth", "Relief"],
    model: "Probe read-only",
    seeds: "protokol deterministik · ulangan tidak dicatat",
    status: "supported",
    conclusion:
      "Sensor kedalaman memuat sinyal ordinal yang signifikan secara statistik setelah proses spatial pooling.",
    findings:
      "Rasio sinyal terhadap derau (SNR) per piksel ≈0,3; fusi langsung pada stem masukan berada pada kondisi yang tidak optimal.",
    metrics: [
      { label: "Relief B1 → B4", value: "+2,8 → −5,1 cm" },
      { label: "Kruskal-Wallis", value: "p=1,7×10⁻²¹" },
      { label: "AUC 1 px", value: "0,577" },
      { label: "AUC 16 px", value: "0,650" },
    ],
    artifacts: [
      "results/probe_fitur_depth.json",
      "scripts/probe_depth_signal.py",
    ],
    parentIds: ["V2-E-005"],
    position: { x: 880, y: 196 },
  },
  {
    id: "V2-E-015",
    title: "Pengklasifikasi kematangan berbasis crop",
    date: "11 Agu 2026",
    phase: "Fase 6",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Mask box"],
    model: "ConvNeXt Tiny + CE/CORAL",
    seeds: "3 run · seed 101/202/303",
    status: "supported",
    conclusion:
      "Model pengklasifikasi independen berbasis crop mengungguli mekanisme klasifikasi bawaan detektor satu tahap.",
    findings:
      "Penggunaan mask bounding box dan augmentasi warna terukur menjadi koreksi implementasi yang krusial.",
    metrics: [
      { label: "Classifier crop test", value: "0,6309 ± 0,0203" },
      { label: "Detektor atas GT", value: "0,4659" },
      { label: "Baseline mayoritas", value: "0,4244" },
      { label: "RGB histogram", value: "0,4780" },
    ],
    artifacts: [
      "runs_fase6/sd101_rgb/hasil.json",
      "runs_fase6/pre953v2/hasil.json",
    ],
    parentIds: ["V2-E-013", "V2-E-014"],
    position: { x: 1094, y: 52 },
  },
  {
    id: "V2-E-016",
    title: "Ablasi depth pada model pengklasifikasi",
    date: "11 Agu 2026",
    phase: "Fase 6",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Depth", "Relief"],
    model: "CNN branch + regresi logistik",
    seeds: "3 run · seed 101/202/303",
    status: "negative",
    conclusion:
      "Kanal kedalaman terbukti redundan secara kondisional terhadap fitur RGB untuk klasifikasi tingkat kematangan.",
    findings:
      "Keunggulan awal pada satu seed (+5,9 pp) terbukti merupakan variasi acak setelah replikasi tiga seed.",
    metrics: [
      { label: "Δ test CNN", value: "−0,0203", note: "p=0,42" },
      { label: "RGB fitur test", value: "0,6415" },
      { label: "RGB + depth test", value: "0,6415" },
      { label: "Depth saja test", value: "0,3756" },
    ],
    artifacts: ["results/probe_fitur_depth.json", "runs_fase6/sd*/hasil.json"],
    parentIds: ["V2-E-014", "V2-E-015"],
    position: { x: 1094, y: 196 },
  },
  {
    id: "V2-E-017",
    title: "Batas atas lokalisasi agnostik RGB",
    date: "12 Agu 2026",
    phase: "Fase 6",
    dataset: "Lintas-dataset",
    inputs: ["RGB", "Class-agnostic"],
    model: "YOLO26l · RT-DETR-L",
    seeds: "1 run · seed 42",
    status: "audit_needed",
    conclusion:
      "Plafon lokalisasi ≈0,733 berlaku spesifik untuk representasi RGB; generalisasinya dibatasi oleh temuan V2-E-024.",
    findings:
      "Dataset 953 dengan jumlah anotasi 9,8× lebih besar menghasilkan nilai AP50 yang setara dengan dataset 352 pada masukan RGB.",
    metrics: [
      { label: "AP50 953 RGB", value: "0,7374" },
      { label: "AP50 352 RGB", value: "0,7330" },
      { label: "Selisih", value: "0,0044", note: "AP50 953 − 352" },
    ],
    artifacts: ["results/fase6_ringkas.json"],
    parentIds: ["V2-E-013"],
    position: { x: 1094, y: 340 },
  },
  {
    id: "V2-E-018",
    title: "Transfer belajar 953 → 352 dan analisis patience",
    date: "12 Agu 2026",
    phase: "Fase 6",
    dataset: "Lintas-dataset",
    inputs: ["RGB", "Transfer"],
    model: "YOLO26l class-agnostic",
    seeds: "1 run · seed 42",
    status: "negative",
    conclusion:
      "Model pretraining 953 yang lebih baik tidak meningkatkan performa adaptasi (finetuning) pada dataset 352.",
    findings:
      "Nilai patience 10 menyebabkan penghentian prematur pada puncak lokal palsu; patience 45 menunjukkan hasil yang ekuivalen.",
    metrics: [
      { label: "agn352_ft", value: "0,7522", note: "val AP50" },
      { label: "agn352_ft3", value: "0,7473", note: "val AP50" },
      { label: "agn352_ft2", value: "0,6413", note: "cacat protokol" },
    ],
    artifacts: ["results/fase6_ringkas.json", "runs/agn*/results.csv"],
    parentIds: ["V2-E-017"],
    position: { x: 1308, y: 52 },
  },
  {
    id: "V2-E-019",
    title: "Ensemble WBF dan optimasi inferensi",
    date: "12 Agu 2026",
    phase: "Fase 6",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "WBF"],
    model: "agn352_ft + agn352_ft3",
    seeds: "checkpoint val-selected · ulangan tidak dicatat",
    status: "supported",
    conclusion:
      "Penerapan Weighted Boxes Fusion (WBF) dan optimasi inferensi meningkatkan AP50 validasi tanpa pelatihan ulang.",
    findings:
      "Penambahan model RT-DETR ke dalam ensemble menurunkan performa; kapasitas ensemble tidak identik dengan skor model tunggal.",
    metrics: [
      { label: "WBF dua model", value: "0,7577", note: "val AP50" },
      { label: "agn352_ft tunggal", value: "0,7370", note: "val AP50" },
      { label: "Kenaikan", value: "+0,0207", note: "Δ val AP50" },
      { label: "NMS IoU", value: "0,5" },
    ],
    artifacts: [
      "results/detektor_pilihan_v4.json",
      "results/sweep_inferensi_v4.json",
    ],
    parentIds: ["V2-E-017", "V2-E-018"],
    position: { x: 1308, y: 196 },
  },
  {
    id: "V2-E-020",
    title: "Evaluasi pipeline deteksi dua tahap",
    date: "12 Agu 2026",
    phase: "Fase 6",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "WBF", "Crop classifier"],
    model: "Lokalisasi + 9 classifier",
    seeds: "multi-run · ulangan tidak dicatat",
    status: "inconclusive",
    conclusion:
      "Pipeline dua tahap mengungguli YOLO26l secara signifikan, namun tidak berbeda secara statistik terhadap RF-DETR-L.",
    findings:
      "Peningkatan teramati terutama pada kelas B3 dan B4, tetapi ukuran sampel uji (410 box) membatasi kekuatan uji statistik.",
    metrics: [
      { label: "Dua-tahap v4 mAP50", value: "0,4500" },
      { label: "Δ vs YOLO26l RGB", value: "+0,0789", note: "Δ mAP50" },
      { label: "RF-DETR-L", value: "0,4544", note: "mAP50" },
      { label: "Rasio plafon", value: "0,614" },
    ],
    perClass: [
      { label: "v4 B1/B2/B3/B4", value: "0,7366 / 0,4683 / 0,3212 / 0,2738" },
    ],
    artifacts: ["results/twostage_final_v4.json"],
    parentIds: ["V2-E-015", "V2-E-019"],
    position: { x: 1522, y: 52 },
  },
  {
    id: "V2-E-021",
    title: "Pengklasifikasi gabungan domain 953 + 352",
    date: "12 Agu 2026",
    phase: "Fase 6",
    dataset: "Lintas-dataset",
    inputs: ["RGB", "Transfer", "Counting"],
    model: "ConvNeXt Small · 3 seed",
    seeds: "3 run · seed tidak dicatat",
    status: "inconclusive",
    conclusion:
      "Pelatihan gabungan menurunkan mAP50 deteksi secara umum, namun memberikan peningkatan pencacahan pada konfigurasi v3.",
    findings:
      "Sebanyak 92% data pelatihan berasal dari domain 953; keseimbangan distribusi kelas tidak menjamin keseimbangan representasi domain.",
    metrics: [
      { label: "ftS crop test", value: "0,6837" },
      { label: "ftG crop test", value: "0,6724" },
      { label: "v3 mAP50 / counting", value: "0,4102 / 88,18%" },
      { label: "v4 mAP50 / counting", value: "0,4500 / 85,91%" },
    ],
    artifacts: ["results/fase6_ringkas.json", "results/counting_twostage.json"],
    parentIds: ["V2-E-015", "V2-E-020"],
    position: { x: 1522, y: 196 },
  },
  {
    id: "V2-E-022",
    title: "Audit pergeseran temporal 953 vs 352",
    date: "12 Agu 2026",
    phase: "Audit validitas",
    dataset: "Lintas-dataset",
    inputs: ["Audit metadata"],
    model: "Probe read-only",
    seeds: "protokol deterministik · ulangan tidak dicatat",
    status: "audit_needed",
    conclusion:
      "Kedua dataset berasal dari sesi akuisisi lapangan yang terpisah ~80 hari; bukan sudut pandang berbeda dari objek yang sama.",
    findings:
      "Temuan ini membatasi secara ketat validitas seluruh klaim transfer belajar dan komparasi lintas dataset untuk efek kedalaman.",
    metrics: [
      { label: "Jeda akuisisi", value: "~80 hari" },
      { label: "B3 label 953 → 352", value: "3.604 → 321" },
      { label: "Citra ID sama", value: "1.408" },
      { label: "Putaran panen", value: "5–11" },
    ],
    artifacts: ["results/pergeseran_temporal.json"],
    parentIds: ["V2-E-012", "V2-E-021"],
    position: { x: 1522, y: 340 },
  },
  {
    id: "V2-E-023",
    title: "Analisis daya statistik split uji 352",
    date: "12 Agu 2026",
    phase: "Audit validitas",
    dataset: "SawitMVC-Depth-352",
    inputs: ["Bootstrap"],
    model: "mAP paired bootstrap",
    seeds: "500 resampling bootstrap · seed 42",
    status: "audit_needed",
    conclusion:
      "Partisi uji dataset 352 memiliki daya statistik rendah untuk membedakan selisih performa marjinal antar-model.",
    findings:
      "Selisih 0,0044 antara model dua tahap dan RF-DETR-L bernilai 26× lebih kecil dibandingkan lebar selang kepercayaan bootstrap.",
    metrics: [
      { label: "n citra / GT", value: "220 / 410" },
      { label: "CI edge", value: "[0,3771; 0,4938]", note: "mAP" },
      { label: "Δ edge−RGB", value: "+0,0593", note: "mAP" },
      { label: "P(Δ>0)", value: "0,972" },
    ],
    confidence: { label: "CI bootstrap Δ", value: "[−0,0013; +0,1168]" },
    artifacts: ["results/bootstrap_map_awal.json"],
    parentIds: ["V2-E-010", "V2-E-020"],
    position: { x: 1522, y: 484 },
  },
  {
    id: "V2-E-024",
    title: "Evaluasi depth untuk lokalisasi agnostik",
    date: "12 Agu 2026",
    phase: "Fase 6",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Depth", "Edge", "Class-agnostic"],
    model: "YOLO26l",
    seeds: "1.000 resampling bootstrap · seed 42",
    status: "inconclusive",
    conclusion:
      "Arah efek penambahan depth pada lokalisasi bernilai positif, namun selang kepercayaan bootstrap masih memuat nol.",
    findings:
      "Merupakan indikasi empiris terkuat untuk manfaat depth yang terbebas dari distorsi pergeseran label kematangan.",
    metrics: [
      { label: "RGB+D AP50", value: "0,7636" },
      { label: "RGB AP50", value: "0,7358" },
      { label: "Δ", value: "+0,0278", note: "AP50 RGB+D − RGB" },
      { label: "P(Δ>0)", value: "0,921" },
    ],
    confidence: { label: "CI bootstrap Δ", value: "[−0,0121; +0,0648]" },
    artifacts: ["results/bootstrap_lokalisasi.json"],
    parentIds: ["V2-E-014", "V2-E-017", "V2-E-022"],
    position: { x: 1736, y: 340 },
  },
  {
    id: "V2-E-025",
    title: "Evaluasi test set bersih agnostik 953",
    date: "12 Agu 2026",
    phase: "Audit validitas",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Class-agnostic"],
    model: "agn953_full",
    seeds: "evaluasi ulang · ulangan tidak dicatat",
    status: "audit_needed",
    conclusion:
      "Metrik valid pada set uji bersih adalah AP50 0,7702; evaluasi penuh sebelumnya terkontaminasi data pelatihan awal.",
    findings:
      "Ukuran set uji bersih yang terbatas menjadikan metrik ini bersifat indikatif terkalibrasi, bukan estimasi presisi tinggi.",
    metrics: [
      { label: "AP50 test bersih", value: "0,7702" },
      { label: "AP50 test penuh", value: "0,8090" },
      {
        label: "Optimisme kontaminasi",
        value: "0,0388",
        note: "AP50 test penuh − bersih",
      },
      { label: "GT bersih", value: "316" },
    ],
    artifacts: [
      "results/test953_bersih.json",
      "results/pred_agn953_bersih.npz",
    ],
    parentIds: ["V2-E-017"],
    position: { x: 1736, y: 52 },
  },
  {
    id: "V2-E-026",
    title: "Uji bootstrap selang kepercayaan dua tahap v4",
    date: "12 Agu 2026",
    phase: "Audit validitas",
    dataset: "SawitMVC-Depth-352",
    inputs: ["Bootstrap", "Two-stage"],
    model: "9 classifier + WBF",
    seeds: "1.000 resampling bootstrap · seed 42",
    status: "inconclusive",
    conclusion:
      "Model dua tahap v4 tidak terbedakan secara signifikan dari representasi edge-depth maupun baseline yang lebih sederhana.",
    findings:
      "Reproduksi metrik terbukti presisi; batas konklusif bukti terletak pada keterbatasan ukuran sampel uji, bukan pada inferensi.",
    metrics: [
      { label: "mAP50 v4", value: "0,4500" },
      { label: "mAP50 edge", value: "0,4270" },
      { label: "Δ", value: "+0,0230", note: "mAP50 v4 − edge" },
      { label: "P(Δ>0)", value: "0,789" },
    ],
    confidence: { label: "CI bootstrap Δ", value: "[−0,0286; +0,0663]" },
    artifacts: ["results/bootstrap_map.json", "results/twostage_v4_ulang.json"],
    parentIds: ["V2-E-020", "V2-E-023"],
    position: { x: 1736, y: 484 },
  },
  {
    id: "V2-E-027",
    title: "RGB + depth monokular pada 953",
    date: "15 Agu 2026",
    phase: "Fase 7 · Mono",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Mono"],
    model: "YOLO26l · 4 kanal",
    seeds: "1 run · seed 42 · dihentikan ep31",
    status: "negative",
    conclusion:
      "Integrasi depth monokular tidak didukung sebagai kanal tambahan: terjadi penurunan performa pada seluruh kelas kematangan.",
    findings:
      "Pelatihan dihentikan pada epoch 31/60 karena tren negatif yang konsisten; besaran penurunan diuji lebih lanjut pada V2-E-029.",
    metrics: [
      { label: "RGB+Mono mAP50", value: "0,4960" },
      { label: "RGB mAP50", value: "0,5436" },
      { label: "Δ", value: "−0,0475", note: "mAP50 RGB+Mono − RGB" },
      { label: "mAP50-95", value: "0,2322" },
    ],
    perClass: [
      { label: "Mono B1/B2/B3/B4", value: "0,6902 / 0,4097 / 0,5635 / 0,3206" },
    ],
    artifacts: [
      "results/eval_sel6_953_rgbmono_test.json",
      "results/pred_sel6_953_rgbmono_test.npz",
    ],
    parentIds: ["V2-E-001"],
    position: { x: 1950, y: 52 },
  },
  {
    id: "V2-E-028",
    title: "Audit integritas berkas citra TIFF",
    date: "15 Agu 2026",
    phase: "Fase 7 · Mono",
    dataset: "Audit",
    inputs: ["Audit data"],
    model: "Pemindaian TIFF",
    seeds: "protokol deterministik · ulangan tidak dicatat",
    status: "audit_needed",
    conclusion:
      "Sebanyak 39 berkas TIFF korup terlewati tanpa peringatan oleh kerangka kerja Ultralytics; dataset telah diregenerasi dan divalidasi penuh.",
    findings:
      "Metrik evaluasi uji sel 6 direkam ulang pasca-perbaikan integritas data; kurva validasi terdahulu tidak sepenuhnya dapat dikomparasikan.",
    metrics: [
      { label: "TIFF korup", value: "39" },
      { label: "Test 953 korup", value: "22 / 588" },
      { label: "Setelah perbaikan", value: "0 korup" },
    ],
    artifacts: [
      "results/tiff_korup.json",
      "results/tiff_korup_setelah_perbaikan.json",
    ],
    parentIds: ["V2-E-027"],
    position: { x: 1950, y: 196 },
  },
  {
    id: "V2-E-029",
    title: "Uji bootstrap CI RGB+Mono vs RGB pada 953",
    date: "15 Agu 2026",
    phase: "Fase 7 · Mono",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Mono", "Bootstrap"],
    model: "mAP paired bootstrap",
    seeds: "2.000 resampling bootstrap · seed 42",
    status: "negative",
    conclusion:
      "Penurunan performa akibat penambahan kanal monokular terbukti signifikan secara statistik pada data uji 953.",
    findings:
      "Arah penurunan konsisten negatif pada seluruh 2.000 iterasi resampling bootstrap (P(Δ>0) = 0,000).",
    metrics: [
      { label: "Δ mAP50", value: "−0,0476" },
      { label: "P(Δ>0)", value: "0,000" },
      { label: "n GT", value: "2.612" },
    ],
    confidence: { label: "CI bootstrap Δ", value: "[−0,0671; −0,0274]" },
    artifacts: ["results/boot_sel6_vs_sel5.json"],
    parentIds: ["V2-E-027", "V2-E-028"],
    position: { x: 2164, y: 52 },
  },
  {
    id: "V2-E-030",
    title: "RGB + depth monokular pada 352",
    date: "15 Agu 2026",
    phase: "Fase 7 · Mono",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Mono"],
    model: "YOLO26l · 4 kanal",
    seeds: "1 run · seed 42 · dihentikan ep54",
    status: "inconclusive",
    conclusion:
      "Estimasi titik menunjukkan sedikit peningkatan atas RGB namun tidak signifikan secara statistik dan berada di bawah sensor depth.",
    findings:
      "Peringkat metrik validasi berbanding terbalik dengan data uji; set validasi 352 tidak valid untuk pemeringkatan akhir model.",
    metrics: [
      { label: "RGB+Mono mAP50", value: "0,3943" },
      { label: "RGB mAP50", value: "0,3677" },
      { label: "Edge-depth mAP50", value: "0,4270" },
      { label: "mAP50-95", value: "0,1360" },
    ],
    confidence: { label: "CI mono−RGB", value: "[−0,0270; +0,0739]" },
    artifacts: [
      "results/eval_sel3_352_rgbmono_test.json",
      "results/boot_sel3_vs_sel1.json",
    ],
    parentIds: ["V2-E-010"],
    position: { x: 1950, y: 622 },
  },
  {
    id: "V2-E-031",
    title: "RGB + edge-depth + depth monokular",
    date: "15 Agu 2026",
    phase: "Fase 7 · Mono",
    dataset: "SawitMVC-Depth-352",
    inputs: ["RGB", "Depth", "Edge", "Mono"],
    model: "YOLO26l · 5 kanal",
    seeds: "1 run · seed 42",
    status: "negative",
    conclusion:
      "Penambahan kanal monokular di atas representasi sensor depth menurunkan mAP50 secara signifikan.",
    findings:
      "Memperkuat kesimpulan negatif early fusion monokular; sensor depth fisik tetap merupakan kanal tambahan terbaik pada matriks 352.",
    metrics: [
      { label: "5 kanal mAP50", value: "0,3766" },
      { label: "Edge-depth", value: "0,4270", note: "mAP50" },
      { label: "Δ", value: "−0,0504", note: "mAP50 5 kanal − edge-depth" },
      { label: "P(Δ>0)", value: "0,000" },
    ],
    confidence: { label: "CI 5ch−edge", value: "[−0,1038; −0,0015]" },
    artifacts: [
      "results/eval_sel4_352_rgbedgemono_test.json",
      "results/boot_sel4_vs_sel2.json",
    ],
    parentIds: ["V2-E-010", "V2-E-030"],
    position: { x: 2164, y: 622 },
  },
  {
    id: "V2-E-032",
    title: "Matriks depth monokular lengkap",
    date: "15 Agu 2026",
    phase: "Fase 7 · Mono",
    dataset: "Lintas-dataset",
    inputs: ["RGB", "Depth", "Edge", "Mono", "Bootstrap"],
    model: "YOLO26l · enam sel",
    seeds: "1 run · seed 42",
    status: "negative",
    conclusion:
      "Representasi depth monokular tidak menunjukkan keunggulan performa; dua pengujian komparasi bahkan membuktikan penurunan performa yang signifikan.",
    findings:
      "Eksperimen kontrol permutasi kanal (M_shuf) belum dilakukan, sehingga mekanisme penurunan performa—antara keterbatasan informasi monokular atau degradasi bobot kanal—masih memerlukan verifikasi lanjutan.",
    metrics: [
      { label: "Sel 6 − sel 5", value: "−0,0476 · signifikan" },
      { label: "Sel 4 − sel 2", value: "−0,0504 · signifikan" },
      { label: "Sel 3 − sel 1", value: "+0,0266 · tidak signifikan" },
      { label: "Sel 3 − sel 2", value: "−0,0327 · tidak signifikan" },
    ],
    artifacts: [
      "results/boot_sel6_vs_sel5.json",
      "results/boot_sel4_vs_sel2.json",
      "results/boot_sel3_vs_sel1.json",
    ],
    parentIds: ["V2-E-029", "V2-E-031"],
    position: { x: 2378, y: 410 },
  },
  {
    id: "V2-E-033",
    title: "Audit kebocoran partisi data (split leakage)",
    date: "15 Agu 2026",
    phase: "Audit validitas",
    dataset: "Audit",
    inputs: ["Audit split"],
    model: "Audit metadata",
    seeds: "protokol deterministik · ulangan tidak dicatat",
    status: "audit_needed",
    conclusion:
      "Temuan kebocoran data membatasi generalisasi klaim jalur agnostik dan transfer 953→352; data terdahulu dikontekstualisasikan secara transparan.",
    findings:
      "Sebanyak 87% data uji penuh agnostik 953 teridentifikasi pernah masuk dalam data pelatihan; 44 dari 55 pohon uji 352 terdapat pada data latih 953.",
    metrics: [
      { label: "Test penuh terkontaminasi", value: "512 / 588 citra" },
      { label: "Test-352 di train-953", value: "44 / 55 pohon" },
      { label: "Status mono-depth", value: "tidak terdampak" },
    ],
    artifacts: ["experiments/EKSPERIMEN.md", "docs/LAPORAN-AKHIR.md"],
    parentIds: ["V2-E-022", "V2-E-025"],
    position: { x: 2378, y: 52 },
  },
  ...historicalExperiments,
];

export const statusInfo: Record<
  ExperimentStatus,
  { label: string; className: string; dot: string }
> = {
  supported: {
    label: "didukung",
    className: "status-supported",
    dot: "bg-[#A7D8B5]",
  },
  negative: {
    label: "negatif",
    className: "status-negative",
    dot: "bg-[#EA9678]",
  },
  inconclusive: {
    label: "belum konklusif",
    className: "status-inconclusive",
    dot: "bg-[#E8C878]",
  },
  audit_needed: {
    label: "audit / batas",
    className: "status-audit",
    dot: "bg-[#78B7C8]",
  },
};

export const datasetInfo: Record<DatasetId, { short: string; color: string }> =
  {
    "SawitMVC-953": { short: "953 RGB", color: "#AACD90" },
    "SawitMVC-Depth-352": { short: "352 Depth", color: "#8AC4D3" },
    "Lintas-dataset": { short: "Lintas", color: "#E8C878" },
    Audit: { short: "Audit", color: "#CDBAEB" },
  };

export const defaultEra = "Riset terkini · 2026";

export const allInputs = [
  "RGB",
  "Depth",
  "Edge",
  "Mono",
  "Counting",
  "Class-agnostic",
  "Bootstrap",
  "WBF",
  "Transfer",
  "Multi-view",
  "Geometry",
  "Ordinal",
  "Training",
  "Audit",
];
