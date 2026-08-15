import { historicalExperiments } from "@/lib/historicalExperiments";

/**
 * Field Research Ledger data layer — sourced from project-expertise commit 225faaeb.
 * Each node represents a completed experiment, audit, or synthesis logged in EKSPERIMEN.md.
 */
export type ExperimentStatus = "supported" | "negative" | "inconclusive" | "audit_needed";
export type DatasetId = "SawitMVC-953" | "SawitMVC-Depth-352" | "Lintas-dataset" | "Audit";

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
  { id: "dataset-953", label: "SawitMVC · 953", detail: "RGB · 953 pohon · 3.992 citra", position: { x: 38, y: 94 } },
  { id: "dataset-352", label: "SawitMVC-Depth · 352", detail: "RGB + sensor depth · 352 pohon · 1.408 citra", position: { x: 38, y: 584 } },
];

export const experiments: Experiment[] = [
  {
    id: "V2-E-001", title: "Reproduksi tiga arsitektur pada 953 RGB", date: "09 Agu 2026", phase: "Fondasi", dataset: "SawitMVC-953", inputs: ["RGB"], model: "YOLO26l · RT-DETR-L · RF-DETR-L", seeds: "seed 42", status: "supported",
    conclusion: "Tiga arsitektur mereproduksi benchmark Volume 1 dalam ±0,014 mAP50.", findings: "RF-DETR-L memimpin deteksi RGB-953; ini menjadi acuan lintas eksperimen berikutnya.",
    metrics: [{ label: "YOLO26l mAP50", value: "0,5435" }, { label: "RT-DETR-L mAP50", value: "0,5781" }, { label: "RF-DETR-L mAP50", value: "0,6012" }, { label: "RF-DETR-L mAP50-95", value: "0,2747" }],
    perClass: [{ label: "YOLO26l B1/B2/B3/B4", value: "0,7705 / 0,4479 / 0,6050 / 0,3506" }, { label: "RF-DETR-L B1/B2/B3/B4", value: "0,8150 / 0,5184 / 0,6553 / 0,4160" }],
    artifacts: ["results/perkelas_pycoco_v2repro.json", "models/yolo26l_e60_i1280_v2repro/best.pt"], parentIds: ["dataset-953", "RP-E021"], position: { x: 238, y: 52 },
  },
  {
    id: "V2-E-002", title: "Counting tiga detektor 953", date: "09 Agu 2026", phase: "Fondasi", dataset: "SawitMVC-953", inputs: ["RGB", "Counting"], model: "Ridge + F_all", seeds: "seed 42", status: "negative",
    conclusion: "Tidak ada detektor baru yang melampaui baseline YOLO26m untuk Class ±1 Acc.", findings: "Detektor terbaik secara mAP tidak otomatis menghasilkan counter terbaik.",
    metrics: [{ label: "Baseline YOLO26m", value: "77,48%", note: "Class ±1" }, { label: "YOLO26l", value: "72,16%" }, { label: "RT-DETR-L", value: "76,24%" }, { label: "RF-DETR-L", value: "76,24%" }, { label: "MAE RF-DETR-L", value: "0,993" }],
    perClass: [{ label: "B3 paling lemah", value: "48,2–60,3%", note: "Class ±1" }], artifacts: ["results/counting_v2repro.json"], parentIds: ["V2-E-001"], position: { x: 238, y: 196 },
  },
  {
    id: "V2-E-003", title: "Deteksi tiga arsitektur 352 RGB", date: "09 Agu 2026", phase: "Fondasi", dataset: "SawitMVC-Depth-352", inputs: ["RGB"], model: "YOLO26l · RT-DETR-L · RF-DETR-L", seeds: "seed 42", status: "supported",
    conclusion: "Urutan RF-DETR-L > RT-DETR-L > YOLO26l bertahan pada dataset 352.", findings: "B3 dan B4 jauh lebih sulit dalam dataset Depth-352.",
    metrics: [{ label: "YOLO26l mAP50", value: "0,3606" }, { label: "RT-DETR-L mAP50", value: "0,4343" }, { label: "RF-DETR-L mAP50", value: "0,4544" }, { label: "RF-DETR-L mAP50-95", value: "0,1599" }],
    perClass: [{ label: "RF-DETR-L B1/B2/B3/B4", value: "0,6853 / 0,5184 / 0,3477 / 0,2661" }], artifacts: ["results/perkelas_pycoco_rgb352.json"], parentIds: ["dataset-352"], position: { x: 238, y: 484 },
  },
  {
    id: "V2-E-004", title: "Counting tiga detektor 352 RGB", date: "09 Agu 2026", phase: "Fondasi", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Counting"], model: "Ridge + F_all", seeds: "seed 42", status: "negative",
    conclusion: "Urutan counting tidak mengikuti urutan mAP50 deteksi.", findings: "RT-DETR-L memiliki Class ±1 Acc terbaik, walau RF-DETR-L memimpin deteksi.",
    metrics: [{ label: "YOLO26l", value: "89,55%" }, { label: "RT-DETR-L", value: "90,91%" }, { label: "RF-DETR-L", value: "88,18%" }, { label: "RT-DETR-L macro MAE", value: "0,532" }],
    artifacts: ["results/counting_rgb352.json"], parentIds: ["V2-E-003"], position: { x: 238, y: 628 },
  },
  {
    id: "V2-E-005", title: "Early fusion RGB + depth inverse", date: "09 Agu 2026", phase: "Fondasi", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Depth"], model: "YOLO26l · RT-DETR-L · RF-DETR-L", seeds: "seed 42", status: "negative",
    conclusion: "Early fusion depth tidak meningkatkan deteksi secara konsisten lintas arsitektur.", findings: "Hanya YOLO26l naik; RT-DETR-L dan RF-DETR-L turun, terutama pada B4.",
    metrics: [{ label: "YOLO26l Δ mAP50", value: "+0,0313", note: "0,3919 vs 0,3606" }, { label: "RT-DETR-L Δ", value: "−0,0466" }, { label: "RF-DETR-L Δ", value: "−0,0358" }],
    perClass: [{ label: "YOLO26l RGBD B1/B2/B3/B4", value: "0,6857 / 0,4579 / 0,2637 / 0,1601" }], artifacts: ["results/perkelas_pycoco_rgbd352.json"], parentIds: ["V2-E-003"], position: { x: 452, y: 478 },
  },
  {
    id: "V2-E-006", title: "Counting RGB + depth inverse", date: "09 Agu 2026", phase: "Fondasi", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Depth", "Counting"], model: "Ridge + F_all", seeds: "10.000 bootstrap · seed 42", status: "negative",
    conclusion: "Depth early fusion tidak meningkatkan counting pada satu pun arsitektur.", findings: "CI semua perbandingan RGBD − RGB mencakup nol.",
    metrics: [{ label: "YOLO26l Δ Class ±1", value: "−1,82 pp" }, { label: "RT-DETR-L Δ", value: "−2,27 pp" }, { label: "RF-DETR-L Δ", value: "±0,00 pp" }],
    confidence: { label: "CI RF-DETR-L", value: "[−2,7 pp; +2,7 pp]" }, artifacts: ["results/counting_rgbd352.json", "results/bootstrap_ci_352.json"], parentIds: ["V2-E-004", "V2-E-005"], position: { x: 452, y: 622 },
  },
  {
    id: "V2-E-007", title: "Sintesis matriks 9 sel", date: "09 Agu 2026", phase: "Sintesis", dataset: "Lintas-dataset", inputs: ["RGB", "Depth", "Counting"], model: "Matriks lintas arsitektur", seeds: "agregasi", status: "audit_needed",
    conclusion: "Sintesis awal kemudian dibatasi oleh temuan pergeseran temporal dan power.", findings: "Tetap disimpan sebagai simpul keputusan historis, bukan bukti efek depth lintas dataset.",
    metrics: [{ label: "Sel deteksi", value: "3 × 3" }, { label: "Sel counting", value: "3 × 3" }, { label: "Kelas paling sulit", value: "B3" }],
    artifacts: ["results/matrix_compiled.json", "results/bootstrap_ci_352.json"], parentIds: ["V2-E-001", "V2-E-006"], position: { x: 452, y: 766 },
  },
  {
    id: "V2-E-008", title: "Screening encoding depth", date: "10–11 Agu 2026", phase: "Fase 5", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Depth", "Edge"], model: "YOLO26l · 15 epoch", seeds: "seed 42", status: "supported",
    conclusion: "Encoding edge (Sobel) menang dalam screening dan dipromosikan ke training penuh.", findings: "Tidak boleh dibandingkan langsung dengan angka final 60 epoch.",
    metrics: [{ label: "Edge val mAP50", value: "0,3777" }, { label: "Valid mask", value: "0,3321" }, { label: "Clipped", value: "0,3221" }, { label: "Dropout", value: "0,3168" }],
    artifacts: ["runs/yolo26l_screening_edge352/hasil.json"], parentIds: ["V2-E-005"], position: { x: 666, y: 482 },
  },
  {
    id: "V2-E-009", title: "Mid-fusion depth + gate", date: "11 Agu 2026", phase: "Fase 5", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Depth", "Mid-fusion"], model: "YOLO26l · 15 epoch", seeds: "seed 42", status: "negative",
    conclusion: "Konfigurasi mid-fusion spesifik ini gagal di screening dan tidak dipromosikan.", findings: "Gate bergerak dari 0,02 ke 0,025 tetapi B3/B4 nyaris nol.",
    metrics: [{ label: "Val mAP50 terbaik", value: "0,2087", note: "epoch 3" }, { label: "B3 AP50", value: "0,056" }, { label: "B4 AP50", value: "0,051" }],
    artifacts: ["runs/yolo26l_screening_midfusion352/hasil.json"], parentIds: ["V2-E-005"], position: { x: 666, y: 626 },
  },
  {
    id: "V2-E-010", title: "RGB + edge-depth · training penuh", date: "11 Agu 2026", phase: "Fase 5", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Depth", "Edge"], model: "YOLO26l · 60 epoch", seeds: "seed 42", status: "supported",
    conclusion: "Edge-depth meningkatkan mAP50 deteksi jelas atas inverse dan semua baseline RGB yang diuji.", findings: "Kenaikan deteksi tidak diterjemahkan menjadi kemenangan Class ±1 counting.",
    metrics: [{ label: "mAP50 edge", value: "0,4316" }, { label: "Δ vs inverse", value: "+0,0397" }, { label: "mAP50-95", value: "0,1441" }, { label: "Counting Class ±1", value: "87,27%" }],
    perClass: [{ label: "Δ B1/B2/B3/B4 vs inverse", value: "+0,0395 / +0,0452 / −0,0397 / +0,1139" }], artifacts: ["results/perkelas_pycoco_rgbd352.json", "results/counting_rgbd352.json"], parentIds: ["V2-E-008"], position: { x: 880, y: 482 },
  },
  {
    id: "V2-E-011", title: "Retrain RGB + bootstrap counting edge", date: "11 Agu 2026", phase: "Fase 5", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Depth", "Edge", "Counting"], model: "YOLO26l + Ridge", seeds: "10.000 bootstrap · seed 42", status: "inconclusive",
    conclusion: "Kesimpulan counting berubah menurut baseline RGB; tidak konklusif secara ketat.", findings: "Retrain RGB menghasilkan 84,09%, berbeda 5,46 pp dari angka RGB asli 89,55%.",
    metrics: [{ label: "Edge vs retrain RGB", value: "+3,18 pp" }, { label: "P(Δ>0)", value: "94,3%" }, { label: "Edge vs RGB asli", value: "−2,28 pp" }],
    confidence: { label: "CI Class ±1", value: "[−0,5 pp; +7,3 pp]" }, artifacts: ["results/bootstrap_ci_352.json", "results/counting_rgb352.json"], parentIds: ["V2-E-010", "V2-E-004"], position: { x: 880, y: 626 },
  },
  {
    id: "V2-E-012", title: "Gap 953 vs 352: diagnosis komposisi kelas", date: "11 Agu 2026", phase: "Diagnosis", dataset: "Lintas-dataset", inputs: ["Audit label"], model: "Probe read-only", seeds: "deterministik", status: "audit_needed",
    conclusion: "Temuan angka benar, tetapi sebab awal dikoreksi oleh V2-E-022: ini bukan sekadar ukuran dataset.", findings: "B3/B4 jauh lebih jarang pada 352; perbandingan lintas dataset tidak valid sebagai uji depth.",
    metrics: [{ label: "B3 train 953 → 352", value: "7.333 → 215", note: "34×" }, { label: "B4 train 953 → 352", value: "2.513 → 98", note: "26×" }, { label: "B3 AP50", value: "0,6050 → 0,2001" }],
    artifacts: ["results/perkelas_pycoco_v2repro.json", "results/perkelas_pycoco_rgb352.json"], parentIds: ["V2-E-001", "V2-E-003"], position: { x: 666, y: 52 },
  },
  {
    id: "V2-E-013", title: "Lokalisasi vs salah kelas", date: "11 Agu 2026", phase: "Diagnosis", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Class-agnostic"], model: "YOLO26l · evaluator AP50", seeds: "seed 42", status: "supported",
    conclusion: "44,5% kemampuan detektor hilang karena salah kelas, bukan gagal menemukan tandan.", findings: "Konfusi seluruhnya berada pada kelas bersebelahan; masalahnya ordinal.",
    metrics: [{ label: "mAP50 class-aware", value: "0,3707" }, { label: "AP50 agnostik", value: "0,6677" }, { label: "Hilang karena kelas", value: "0,2970 · 44,5%" }, { label: "Akurasi conditional", value: "70,5%" }],
    artifacts: ["scripts/eval_twostage.py"], parentIds: ["V2-E-003"], position: { x: 880, y: 52 },
  },
  {
    id: "V2-E-014", title: "Probe relief depth", date: "11 Agu 2026", phase: "Diagnosis", dataset: "SawitMVC-Depth-352", inputs: ["Depth", "Relief"], model: "Probe read-only", seeds: "deterministik", status: "supported",
    conclusion: "Depth bukan skala metrik; relief lokal menunjukkan sinyal ordinal yang nyata setelah pooling.", findings: "SNR per piksel ≈0,3; early fusion pada stem berada pada rezim yang tidak menguntungkan.",
    metrics: [{ label: "Relief B1 → B4", value: "+2,8 → −5,1 cm" }, { label: "Kruskal-Wallis", value: "p=1,7×10⁻²¹" }, { label: "AUC 1 px", value: "0,577" }, { label: "AUC 16 px", value: "0,650" }],
    artifacts: ["results/probe_fitur_depth.json", "scripts/probe_depth_signal.py"], parentIds: ["V2-E-005"], position: { x: 880, y: 196 },
  },
  {
    id: "V2-E-015", title: "Classifier crop kematangan", date: "11 Agu 2026", phase: "Fase 6", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Mask box"], model: "ConvNeXt Tiny + CE/CORAL", seeds: "101 · 202 · 303", status: "supported",
    conclusion: "Classifier crop mengalahkan klasifikasi detektor satu-tahap atas seluruh GT.", findings: "Mask box dan augmentasi warna ringan merupakan koreksi implementasi yang krusial.",
    metrics: [{ label: "Classifier crop test", value: "0,6309 ± 0,0203" }, { label: "Detektor atas GT", value: "0,4659" }, { label: "Baseline mayoritas", value: "0,4244" }, { label: "RGB histogram", value: "0,4780" }],
    artifacts: ["runs_fase6/sd101_rgb/hasil.json", "runs_fase6/pre953v2/hasil.json"], parentIds: ["V2-E-013", "V2-E-014"], position: { x: 1094, y: 52 },
  },
  {
    id: "V2-E-016", title: "Ablasi depth pada classifier", date: "11 Agu 2026", phase: "Fase 6", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Depth", "Relief"], model: "CNN branch + regresi logistik", seeds: "101 · 202 · 303", status: "negative",
    conclusion: "Depth redundan secara kondisional terhadap RGB untuk klasifikasi kematangan dataset ini.", findings: "Satu seed positif +5,9 pp menjadi derau setelah replikasi tiga seed.",
    metrics: [{ label: "Δ test CNN", value: "−0,0203", note: "p=0,42" }, { label: "RGB fitur test", value: "0,6415" }, { label: "RGB + depth test", value: "0,6415" }, { label: "Depth saja test", value: "0,3756" }],
    artifacts: ["results/probe_fitur_depth.json", "runs_fase6/sd*/hasil.json"], parentIds: ["V2-E-014", "V2-E-015"], position: { x: 1094, y: 196 },
  },
  {
    id: "V2-E-017", title: "Plafon lokalisasi RGB", date: "12 Agu 2026", phase: "Fase 6", dataset: "Lintas-dataset", inputs: ["RGB", "Class-agnostic"], model: "YOLO26l · RT-DETR-L", seeds: "seed 42", status: "audit_needed",
    conclusion: "Plafon ≈0,733 hanya berlaku bagi input RGB; generalisasi awal dibatasi oleh V2-E-024.", findings: "Dataset 953 dengan 9,8× box latih hampir sama dengan 352 dalam AP50 RGB.",
    metrics: [{ label: "AP50 953 RGB", value: "0,7374" }, { label: "AP50 352 RGB", value: "0,7330" }, { label: "Selisih", value: "0,0044" }],
    artifacts: ["results/fase6_ringkas.json"], parentIds: ["V2-E-013"], position: { x: 1094, y: 340 },
  },
  {
    id: "V2-E-018", title: "Transfer 953 → 352 dan patience", date: "12 Agu 2026", phase: "Fase 6", dataset: "Lintas-dataset", inputs: ["RGB", "Transfer"], model: "YOLO26l class-agnostic", seeds: "seed 42", status: "negative",
    conclusion: "Pretrain lebih baik pada 953 tidak meningkatkan finetune 352.", findings: "Patience 10 menghentikan run pada puncak palsu; patience 45 mengembalikan hasil menjadi seri.",
    metrics: [{ label: "agn352_ft", value: "0,7522", note: "val AP50" }, { label: "agn352_ft3", value: "0,7473" }, { label: "agn352_ft2", value: "0,6413", note: "cacat protokol" }],
    artifacts: ["results/fase6_ringkas.json", "runs/agn*/results.csv"], parentIds: ["V2-E-017"], position: { x: 1308, y: 52 },
  },
  {
    id: "V2-E-019", title: "WBF + sweep inference", date: "12 Agu 2026", phase: "Fase 6", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "WBF"], model: "agn352_ft + agn352_ft3", seeds: "val-selected", status: "supported",
    conclusion: "WBF dua detektor dan inference tuning meningkatkan AP50 val tanpa training baru.", findings: "Menambah RT-DETR justru merugikan; nilai ensemble tidak setara skor tunggal.",
    metrics: [{ label: "WBF dua model", value: "0,7577", note: "val AP50" }, { label: "agn352_ft tunggal", value: "0,7370" }, { label: "Kenaikan", value: "+0,0207" }, { label: "NMS IoU", value: "0,5" }],
    artifacts: ["results/detektor_pilihan_v4.json", "results/sweep_inferensi_v4.json"], parentIds: ["V2-E-017", "V2-E-018"], position: { x: 1308, y: 196 },
  },
  {
    id: "V2-E-020", title: "Pipeline dua-tahap", date: "12 Agu 2026", phase: "Fase 6", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "WBF", "Crop classifier"], model: "Lokalisasi + 9 classifier", seeds: "multi-run", status: "inconclusive",
    conclusion: "Dua-tahap naik jelas atas YOLO26l namun belum melampaui RF-DETR-L dan kemudian tidak terbedakan secara statistik.", findings: "Keuntungan terutama tampak di B3/B4, tetapi evaluasi 410 box belum cukup presisi.",
    metrics: [{ label: "Dua-tahap v4 mAP50", value: "0,4500" }, { label: "Δ vs YOLO26l RGB", value: "+0,0789" }, { label: "RF-DETR-L", value: "0,4544" }, { label: "Rasio plafon", value: "0,614" }],
    perClass: [{ label: "v4 B1/B2/B3/B4", value: "0,7366 / 0,4683 / 0,3212 / 0,2738" }], artifacts: ["results/twostage_final_v4.json"], parentIds: ["V2-E-015", "V2-E-019"], position: { x: 1522, y: 52 },
  },
  {
    id: "V2-E-021", title: "Classifier gabungan 953 + 352", date: "12 Agu 2026", phase: "Fase 6", dataset: "Lintas-dataset", inputs: ["RGB", "Transfer", "Counting"], model: "ConvNeXt Small · 3 seed", seeds: "3 seed", status: "inconclusive",
    conclusion: "Training gabungan merugikan mAP50 tetapi menaikkan counting pada konfigurasi v3.", findings: "92% crop latihan berasal dari domain 953; kelas seimbang bukan domain seimbang.",
    metrics: [{ label: "ftS crop test", value: "0,6837" }, { label: "ftG crop test", value: "0,6724" }, { label: "v3 mAP50 / counting", value: "0,4102 / 88,18%" }, { label: "v4 mAP50 / counting", value: "0,4500 / 85,91%" }],
    artifacts: ["results/fase6_ringkas.json", "results/counting_twostage.json"], parentIds: ["V2-E-015", "V2-E-020"], position: { x: 1522, y: 196 },
  },
  {
    id: "V2-E-022", title: "Pergeseran temporal 953 vs 352", date: "12 Agu 2026", phase: "Audit validitas", dataset: "Lintas-dataset", inputs: ["Audit metadata"], model: "Probe read-only", seeds: "deterministik", status: "audit_needed",
    conclusion: "Dua dataset adalah sesi akuisisi berbeda ~80 hari; bukan dua view tandan yang sama.", findings: "Temuan ini membatasi seluruh klaim transfer dan perbandingan lintas dataset untuk efek depth.",
    metrics: [{ label: "Jeda akuisisi", value: "~80 hari" }, { label: "B3 label 953 → 352", value: "3.604 → 321" }, { label: "Citra ID sama", value: "1.408" }, { label: "Putaran panen", value: "5–11" }],
    artifacts: ["results/pergeseran_temporal.json"], parentIds: ["V2-E-012", "V2-E-021"], position: { x: 1522, y: 340 },
  },
  {
    id: "V2-E-023", title: "Power split test 352", date: "12 Agu 2026", phase: "Audit validitas", dataset: "SawitMVC-Depth-352", inputs: ["Bootstrap"], model: "mAP paired bootstrap", seeds: "500 ulangan · seed 42", status: "audit_needed",
    conclusion: "Split 352 tidak mampu membedakan selisih kecil yang selama ini diperingkatkan dengan titik estimasi.", findings: "Selisih 0,0044 antara dua-tahap dan RF-DETR-L adalah 26× lebih kecil dari lebar CI.",
    metrics: [{ label: "n citra / GT", value: "220 / 410" }, { label: "CI edge", value: "[0,3771; 0,4938]" }, { label: "Δ edge−RGB", value: "+0,0593" }, { label: "P(Δ>0)", value: "0,972" }],
    confidence: { label: "CI Δ", value: "[−0,0013; +0,1168]" }, artifacts: ["results/bootstrap_map_awal.json"], parentIds: ["V2-E-010", "V2-E-020"], position: { x: 1522, y: 484 },
  },
  {
    id: "V2-E-024", title: "Depth untuk lokalisasi agnostik", date: "12 Agu 2026", phase: "Fase 6", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Depth", "Edge", "Class-agnostic"], model: "YOLO26l", seeds: "1.000 bootstrap · seed 42", status: "inconclusive",
    conclusion: "Arah efek depth pada lokalisasi positif, tetapi CI masih mencakup nol.", findings: "Ini bukti positif terkuat yang tidak dikotori pergeseran label kematangan.",
    metrics: [{ label: "RGB+D AP50", value: "0,7636" }, { label: "RGB AP50", value: "0,7358" }, { label: "Δ", value: "+0,0278" }, { label: "P(Δ>0)", value: "0,921" }],
    confidence: { label: "CI Δ", value: "[−0,0121; +0,0648]" }, artifacts: ["results/bootstrap_lokalisasi.json"], parentIds: ["V2-E-014", "V2-E-017", "V2-E-022"], position: { x: 1736, y: 340 },
  },
  {
    id: "V2-E-025", title: "Test bersih agnostik 953", date: "12 Agu 2026", phase: "Audit validitas", dataset: "SawitMVC-953", inputs: ["RGB", "Class-agnostic"], model: "agn953_full", seeds: "evaluasi ulang", status: "audit_needed",
    conclusion: "Angka sah test bersih adalah 0,7702; evaluasi penuh/val terkontaminasi pretraining.", findings: "Set bersih kecil sehingga angka tetap indikatif, bukan estimasi presisi.",
    metrics: [{ label: "AP50 test bersih", value: "0,7702" }, { label: "AP50 test penuh", value: "0,8090" }, { label: "Optimisme kontaminasi", value: "0,0388" }, { label: "GT bersih", value: "316" }],
    artifacts: ["results/test953_bersih.json", "results/pred_agn953_bersih.npz"], parentIds: ["V2-E-017"], position: { x: 1736, y: 52 },
  },
  {
    id: "V2-E-026", title: "CI dua-tahap v4", date: "12 Agu 2026", phase: "Audit validitas", dataset: "SawitMVC-Depth-352", inputs: ["Bootstrap", "Two-stage"], model: "9 classifier + WBF", seeds: "1.000 bootstrap · seed 42", status: "inconclusive",
    conclusion: "Dua-tahap v4 tidak terbedakan dari edge-depth atau pembanding yang lebih sederhana.", findings: "Reproduksi ulang persis; batas bukti terletak pada ukuran split, bukan dump prediksi.",
    metrics: [{ label: "mAP50 v4", value: "0,4500" }, { label: "mAP50 edge", value: "0,4270" }, { label: "Δ", value: "+0,0230" }, { label: "P(Δ>0)", value: "0,789" }],
    confidence: { label: "CI Δ", value: "[−0,0286; +0,0663]" }, artifacts: ["results/bootstrap_map.json", "results/twostage_v4_ulang.json"], parentIds: ["V2-E-020", "V2-E-023"], position: { x: 1736, y: 484 },
  },
  {
    id: "V2-E-027", title: "RGB + monocular depth pada 953", date: "15 Agu 2026", phase: "Fase 7 · Mono", dataset: "SawitMVC-953", inputs: ["RGB", "Mono"], model: "YOLO26l · 4 kanal", seeds: "seed 42 · dihentikan ep31", status: "negative",
    conclusion: "Monocular depth tidak didukung sebagai kanal tambahan: turun di empat kelas.", findings: "Run dihentikan di epoch 31/60; arah tampak negatif, besar penurunan kemudian diuji pada V2-E-029.",
    metrics: [{ label: "RGB+Mono mAP50", value: "0,4960" }, { label: "RGB mAP50", value: "0,5436" }, { label: "Δ", value: "−0,0475" }, { label: "mAP50-95", value: "0,2322" }],
    perClass: [{ label: "Mono B1/B2/B3/B4", value: "0,6902 / 0,4097 / 0,5635 / 0,3206" }], artifacts: ["results/eval_sel6_953_rgbmono_test.json", "results/pred_sel6_953_rgbmono_test.npz"], parentIds: ["V2-E-001"], position: { x: 1950, y: 52 },
  },
  {
    id: "V2-E-028", title: "Audit TIFF korup", date: "15 Agu 2026", phase: "Fase 7 · Mono", dataset: "Audit", inputs: ["Audit data"], model: "Pemindaian TIFF", seeds: "deterministik", status: "audit_needed",
    conclusion: "39 TIFF turunan korup dilewati diam-diam oleh Ultralytics; dataset diregenerasi dan divalidasi.", findings: "Metrik test sel 6 direkam setelah perbaikan; kurva val lama tidak sepenuhnya sebanding.",
    metrics: [{ label: "TIFF korup", value: "39" }, { label: "Test 953 korup", value: "22 / 588" }, { label: "Setelah perbaikan", value: "0 korup" }],
    artifacts: ["results/tiff_korup.json", "results/tiff_korup_setelah_perbaikan.json"], parentIds: ["V2-E-027"], position: { x: 1950, y: 196 },
  },
  {
    id: "V2-E-029", title: "CI RGB+Mono vs RGB pada 953", date: "15 Agu 2026", phase: "Fase 7 · Mono", dataset: "SawitMVC-953", inputs: ["RGB", "Mono", "Bootstrap"], model: "mAP paired bootstrap", seeds: "2.000 ulangan · seed 42", status: "negative",
    conclusion: "Penurunan RGB+Mono signifikan pada test 953 yang berdaya cukup.", findings: "Besar dampak mungkin dilebihkan karena early stop, tetapi tanda negatif stabil di semua 2.000 ulangan.",
    metrics: [{ label: "Δ mAP50", value: "−0,0476" }, { label: "P(Δ>0)", value: "0,000" }, { label: "n GT", value: "2.612" }],
    confidence: { label: "CI Δ", value: "[−0,0671; −0,0274]" }, artifacts: ["results/boot_sel6_vs_sel5.json"], parentIds: ["V2-E-027", "V2-E-028"], position: { x: 2164, y: 52 },
  },
  {
    id: "V2-E-030", title: "RGB + monocular depth pada 352", date: "15 Agu 2026", phase: "Fase 7 · Mono", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Mono"], model: "YOLO26l · 4 kanal", seeds: "seed 42 · dihentikan ep54", status: "inconclusive",
    conclusion: "Titik estimasi naik atas RGB tetapi tidak signifikan dan masih di bawah sensor depth.", findings: "Peringkat val berbalik persis dengan test; val 352 tidak valid untuk pemeringkatan model.",
    metrics: [{ label: "RGB+Mono mAP50", value: "0,3943" }, { label: "RGB mAP50", value: "0,3677" }, { label: "Edge-depth mAP50", value: "0,4270" }, { label: "mAP50-95", value: "0,1360" }],
    confidence: { label: "CI mono−RGB", value: "[−0,0270; +0,0739]" }, artifacts: ["results/eval_sel3_352_rgbmono_test.json", "results/boot_sel3_vs_sel1.json"], parentIds: ["V2-E-010"], position: { x: 1950, y: 622 },
  },
  {
    id: "V2-E-031", title: "RGB + edge-depth + mono", date: "15 Agu 2026", phase: "Fase 7 · Mono", dataset: "SawitMVC-Depth-352", inputs: ["RGB", "Depth", "Edge", "Mono"], model: "YOLO26l · 5 kanal", seeds: "seed 42", status: "negative",
    conclusion: "Menambahkan mono di atas sensor depth menurunkan mAP50 secara signifikan.", findings: "Ini menguatkan hasil negatif early fusion mono; sensor depth tetap kanal keempat terbaik di matriks 352.",
    metrics: [{ label: "5 kanal mAP50", value: "0,3766" }, { label: "Edge-depth", value: "0,4270" }, { label: "Δ", value: "−0,0504" }, { label: "P(Δ>0)", value: "0,000" }],
    confidence: { label: "CI 5ch−edge", value: "[−0,1038; −0,0015]" }, artifacts: ["results/eval_sel4_352_rgbedgemono_test.json", "results/boot_sel4_vs_sel2.json"], parentIds: ["V2-E-010", "V2-E-030"], position: { x: 2164, y: 622 },
  },
  {
    id: "V2-E-032", title: "Matriks monocular depth lengkap", date: "15 Agu 2026", phase: "Fase 7 · Mono", dataset: "Lintas-dataset", inputs: ["RGB", "Depth", "Edge", "Mono", "Bootstrap"], model: "YOLO26l · enam sel", seeds: "seed 42", status: "negative",
    conclusion: "Mono tidak pernah menang; dua perbandingan menunjukkan kerugian signifikan.", findings: "Kontrol M_shuf belum dijalankan, sehingga mekanisme kerugian—isi mono atau biaya kanal—masih terbuka.",
    metrics: [{ label: "Sel 6 − sel 5", value: "−0,0476 · signifikan" }, { label: "Sel 4 − sel 2", value: "−0,0504 · signifikan" }, { label: "Sel 3 − sel 1", value: "+0,0266 · tidak signifikan" }, { label: "Sel 3 − sel 2", value: "−0,0327 · tidak signifikan" }],
    artifacts: ["results/boot_sel6_vs_sel5.json", "results/boot_sel4_vs_sel2.json", "results/boot_sel3_vs_sel1.json"], parentIds: ["V2-E-029", "V2-E-031"], position: { x: 2378, y: 410 },
  },
  {
    id: "V2-E-033", title: "Dua kebocoran split", date: "15 Agu 2026", phase: "Audit validitas", dataset: "Audit", inputs: ["Audit split"], model: "Audit metadata", seeds: "deterministik", status: "audit_needed",
    conclusion: "Kebocoran membatasi cara mengutip jalur agnostik dan transfer 953→352; angka tidak ditarik tanpa penjelasan.", findings: "87% test penuh agnostik 953 pernah terlihat dalam pretraining; 44/55 test-352 masuk train-953 untuk transfer.",
    metrics: [{ label: "Test penuh terkontaminasi", value: "512 / 588 citra" }, { label: "Test-352 di train-953", value: "44 / 55 pohon" }, { label: "Status mono-depth", value: "tidak terdampak" }],
    artifacts: ["experiments/EKSPERIMEN.md", "docs/LAPORAN-AKHIR.md"], parentIds: ["V2-E-022", "V2-E-025"], position: { x: 2378, y: 52 },
  },
  ...historicalExperiments,
];

export const statusInfo: Record<ExperimentStatus, { label: string; className: string; dot: string }> = {
  supported: { label: "didukung", className: "status-supported", dot: "bg-[#A7D8B5]" },
  negative: { label: "negatif", className: "status-negative", dot: "bg-[#EA9678]" },
  inconclusive: { label: "belum konklusif", className: "status-inconclusive", dot: "bg-[#E8C878]" },
  audit_needed: { label: "audit / batas", className: "status-audit", dot: "bg-[#78B7C8]" },
};

export const datasetInfo: Record<DatasetId, { short: string; color: string }> = {
  "SawitMVC-953": { short: "953 RGB", color: "#AACD90" },
  "SawitMVC-Depth-352": { short: "352 Depth", color: "#8AC4D3" },
  "Lintas-dataset": { short: "Lintas", color: "#E8C878" },
  Audit: { short: "Audit", color: "#CDBAEB" },
};

export const allInputs = ["RGB", "Depth", "Edge", "Mono", "Counting", "Class-agnostic", "Bootstrap", "WBF", "Transfer", "Multi-view", "Geometry", "Ordinal", "Training", "Audit"];
