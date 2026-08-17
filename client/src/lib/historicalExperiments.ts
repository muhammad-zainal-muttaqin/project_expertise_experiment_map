/** Field Research Ledger — historical SawitMVC evidence traced to audited repository commits. */
import type { Experiment } from "@/lib/experimentData";

const source = {
  dedup: {
    repo: "research-method-dedup",
    commit: "a720f17",
    url: "https://github.com/muhammad-zainal-muttaqin/research-method-dedup/tree/a720f17",
  },
  baseline: {
    repo: "Baseline-SawitMVC",
    commit: "ee2f0ac",
    url: "https://github.com/ULM-SawitMVC/Baseline-SawitMVC/tree/ee2f0ac",
  },
  pipeline: {
    repo: "Research-Pipeline",
    commit: "4aa9ad6",
    url: "https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/tree/4aa9ad6",
  },
};

const grid = (index: number, startColumn: number, columns: number) => ({
  x: 238 + (startColumn + (index % columns)) * 206,
  y: 930 + Math.floor(index / columns) * 128,
});

type RecordInput = Omit<Experiment, "position" | "source"> & {
  sourceKey: keyof typeof source;
  position: { x: number; y: number };
};
const record = ({ sourceKey, ...item }: RecordInput): Experiment => ({
  ...item,
  source: source[sourceKey],
});

const dedup: Experiment[] = [
  record({
    id: "HD-001",
    title: "GeoLinker: deduplikasi geometri murni",
    date: "23 Apr 2026",
    era: "Arsip deduplikasi · Apr 2026",
    phase: "Track A · Geometri",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Multi-view", "Geometry"],
    model: "GeoLinker",
    seeds: "inventaris 228 JSON + 725 non-JSON · ulangan tidak dicatat",
    status: "audit_needed",
    conclusion:
      "Iterasi geometri awal sempat melaporkan 93,86%, namun angka pra-perbaikan GT tidak dipakai sebagai hasil final.",
    findings:
      "Commit riwayat menyimpan capaian awal, sedangkan rilis pasca perbaikan GT menjadi dasar interpretasi berikutnya.",
    metrics: [
      { label: "Riwayat pra-fix", value: "93,86% Acc ±1" },
      { label: "Status", value: "digantikan GT-fix" },
    ],
    artifacts: ["commit 5132ac7 · V5 dedup research"],
    parentIds: ["dataset-953"],
    sourceKey: "dedup",
    position: grid(0, 0, 4),
  }),
  record({
    id: "HD-002",
    title: "M01 selector B2–B3",
    date: "16 Mei 2026",
    era: "Arsip deduplikasi · Apr–Mei 2026",
    phase: "Track A · Heuristik",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "M01_selector_b2b3",
    seeds: "post GT-fix · ulangan tidak dicatat",
    status: "supported",
    conclusion: "Heuristik valid terbaik pada rilis pasca perbaikan GT.",
    findings:
      "Menjadi referensi historical-only untuk koreksi visibilitas tanpa training; bukan angka end-to-end detector.",
    metrics: [
      { label: "Macro Acc ±1", value: "87,62%" },
      { label: "Macro MAE", value: "0,375" },
      { label: "Profil tepat", value: "27,1%" },
    ],
    artifacts: [
      "reports/dedup_brand_new_953/accuracy_953.csv",
      "algorithms/M01_selector_b2b3.py",
    ],
    parentIds: ["HD-001"],
    sourceKey: "dedup",
    position: grid(1, 0, 4),
  }),
  record({
    id: "HD-003",
    title: "M05 blend visibility divide",
    date: "16 Mei 2026",
    era: "Arsip deduplikasi · Apr–Mei 2026",
    phase: "Track A · Heuristik",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "M05_blend_vis_divide",
    seeds: "post GT-fix · ulangan tidak dicatat",
    status: "supported",
    conclusion: "Pembanding heuristik valid di bawah M01.",
    findings:
      "M05 memperlihatkan bahwa koreksi visibilitas dapat bekerja tanpa model belajar, tetapi tidak mengungguli selector M01.",
    metrics: [
      { label: "Macro Acc ±1", value: "86,99%" },
      { label: "Macro MAE", value: "0,388" },
    ],
    artifacts: ["reports/dedup_brand_new_953/accuracy_953.csv"],
    parentIds: ["HD-002"],
    sourceKey: "dedup",
    position: grid(2, 0, 4),
  }),
  record({
    id: "HD-004",
    title: "M06 weight visibility",
    date: "16 Mei 2026",
    era: "Arsip deduplikasi · Apr–Mei 2026",
    phase: "Track A · Heuristik",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "M06_weight_visibility",
    seeds: "post GT-fix · ulangan tidak dicatat",
    status: "supported",
    conclusion: "Bobot visibilitas valid, namun bukan pemenang akurasi.",
    findings:
      "Hasil ini menegaskan beberapa formulasi valid bersaing ketat setelah GT diperbaiki.",
    metrics: [
      { label: "Macro Acc ±1", value: "86,88%" },
      { label: "Macro MAE", value: "0,371" },
    ],
    artifacts: ["reports/dedup_brand_new_953/accuracy_953.csv"],
    parentIds: ["HD-002"],
    sourceKey: "dedup",
    position: grid(3, 0, 4),
  }),
  record({
    id: "HD-005",
    title: "M07 weight coverage",
    date: "16 Mei 2026",
    era: "Arsip deduplikasi · Apr–Mei 2026",
    phase: "Track A · Heuristik",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "M07_weight_coverage",
    seeds: "post GT-fix · ulangan tidak dicatat",
    status: "supported",
    conclusion: "M07 memberi MAE heuristik valid terendah.",
    findings:
      "Kinerja akurasi setara M06, tetapi error numeriknya lebih rendah; tetap di bawah M01 pada Acc ±1.",
    metrics: [
      { label: "Macro Acc ±1", value: "86,88%" },
      { label: "Macro MAE", value: "0,368" },
    ],
    artifacts: [
      "algorithms/M07_weight_coverage.py",
      "reports/dedup_brand_new_953/accuracy_953.csv",
    ],
    parentIds: ["HD-002"],
    sourceKey: "dedup",
    position: grid(4, 0, 4),
  }),
  record({
    id: "HD-006",
    title: "M15 divisor global",
    date: "16 Mei 2026",
    era: "Arsip deduplikasi · Apr–Mei 2026",
    phase: "Track A · Heuristik",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "M15_divide_global",
    seeds: "post GT-fix · ulangan tidak dicatat",
    status: "supported",
    conclusion:
      "Koreksi global cepat menjadi baseline heuristik valid yang lebih sederhana.",
    findings:
      "Metode sangat cepat, tetapi tidak mengungguli koreksi pola visibilitas.",
    metrics: [
      { label: "Macro Acc ±1", value: "85,94%" },
      { label: "Macro MAE", value: "0,391" },
      { label: "Waktu", value: "0,005 ms/pohon" },
    ],
    artifacts: ["reports/dedup_brand_new_953/accuracy_953.csv"],
    parentIds: ["HD-002"],
    sourceKey: "dedup",
    position: grid(5, 0, 4),
  }),
  record({
    id: "HD-007",
    title: "M53 & M60: pencapaian tidak valid",
    date: "16 Mei 2026",
    era: "Arsip deduplikasi · Apr–Mei 2026",
    phase: "Track A · Audit",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting", "Audit"],
    model: "M53_three_band · M60_blind",
    seeds: "post GT-fix · ulangan tidak dicatat",
    status: "audit_needed",
    conclusion:
      "Kedua metode mencapai 90,24% tetapi tidak valid karena divisor berasal dari statistik training split.",
    findings:
      "Disimpan sebagai jejak keputusan: skor tinggi tidak boleh dibaca sebagai metode yang dapat digeneralisasi.",
    metrics: [
      { label: "Macro Acc ±1", value: "90,24%" },
      { label: "Status", value: "tidak valid" },
    ],
    artifacts: ["archive/_to_review/exp_12 may 2026/RULES.txt"],
    parentIds: ["HD-002"],
    sourceKey: "dedup",
    position: grid(6, 0, 4),
  }),
  record({
    id: "HD-008",
    title: "Ablasi arsitektur YOLO26 lokal",
    date: "14–16 Mei 2026",
    era: "Arsip deduplikasi · Mei 2026",
    phase: "Track B · Deteksi",
    dataset: "SawitMVC-953",
    inputs: ["RGB"],
    model: "YOLO26n · s · m",
    seeds: "1 run · seed 42",
    status: "supported",
    conclusion:
      "YOLO26n lokal memimpin mAP50 dan menjadi pilihan kecepatan pada batch=16.",
    findings:
      "Membuktikan model lebih kecil tidak selalu kalah dalam konfigurasi dan environment ini.",
    metrics: [
      { label: "YOLO26n mAP50", value: "0,521" },
      { label: "YOLO26s", value: "0,506", note: "mAP50" },
      { label: "YOLO26m", value: "0,509", note: "mAP50" },
    ],
    artifacts: ["ml-track/baseline-run/weights/*_results.csv"],
    parentIds: ["dataset-953"],
    sourceKey: "dedup",
    position: grid(7, 0, 4),
  }),
  record({
    id: "HD-009",
    title: "Ablasi pretraining & augmentasi",
    date: "14–16 Mei 2026",
    era: "Arsip deduplikasi · Mei 2026",
    phase: "Track B · Deteksi",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Training"],
    model: "YOLO26s",
    seeds: "1 run · seed 42",
    status: "negative",
    conclusion:
      "Tanpa augmentasi mAP50 turun dan run overfit; scratch tidak mengalahkan konfigurasi vanilla.",
    findings:
      "Augmentasi adalah komponen penting pada baseline lokal, sementara pretraining COCO tidak menentukan kemenangan di ablation ini.",
    metrics: [
      { label: "Scratch mAP50", value: "0,511" },
      { label: "Tanpa aug", value: "0,465", note: "mAP50" },
      { label: "Vanilla", value: "0,506", note: "mAP50" },
    ],
    artifacts: ["ml-track/baseline-run/weights/y26s_*_results.csv"],
    parentIds: ["HD-008"],
    sourceKey: "dedup",
    position: grid(8, 0, 4),
  }),
  record({
    id: "HD-010",
    title: "Counter ML dengan fitur GT",
    date: "14–16 Mei 2026",
    era: "Arsip deduplikasi · Mei 2026",
    phase: "Track C · Oracle counting",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "SVM RBF · RF",
    seeds: "pencarian GridSearchCV · ulangan tidak dicatat",
    status: "supported",
    conclusion:
      "Fitur GT 13-dim memberi batas atas counting yang sangat tinggi.",
    findings:
      "Perbedaan terhadap E2E kemudian memisahkan masalah counter dari propagasi galat detektor.",
    metrics: [
      { label: "SVM Acc ±1", value: "96,1%" },
      { label: "SVM Macro MAE", value: "0,318" },
      { label: "RF Acc ±1", value: "95,3%" },
    ],
    artifacts: [
      "reports/counting_svm/metrics.json",
      "reports/counting_rf/metrics.json",
    ],
    parentIds: ["HD-002"],
    sourceKey: "dedup",
    position: grid(9, 0, 4),
  }),
  record({
    id: "HD-011",
    title: "E2E YOLO26n × tiga counter",
    date: "14–16 Mei 2026",
    era: "Arsip deduplikasi · Mei 2026",
    phase: "Track D · E2E",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Multi-view", "Counting"],
    model: "YOLO26n → SVM/RF/M01",
    seeds: "split test n=95",
    status: "inconclusive",
    conclusion:
      "SVM menjadi terbaik di keluarga YOLO26n, tetap jauh dari counter berbasis GT.",
    findings:
      "Pemilihan counter mengubah skor sedikit; pipeline tetap dibatasi bukti detektor.",
    metrics: [
      { label: "SVM Acc ±1", value: "70,0%" },
      { label: "RF", value: "68,2%", note: "Acc ±1" },
      { label: "M01", value: "67,1%", note: "Acc ±1" },
    ],
    artifacts: ["reports/e2e_y26n_vanilla_local_*/metrics.json"],
    parentIds: ["HD-008", "HD-010"],
    sourceKey: "dedup",
    position: grid(10, 0, 4),
  }),
  record({
    id: "HD-012",
    title: "E2E YOLO26s × tiga counter",
    date: "14–16 Mei 2026",
    era: "Arsip deduplikasi · Mei 2026",
    phase: "Track D · E2E",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Multi-view", "Counting"],
    model: "YOLO26s → SVM/RF/M01",
    seeds: "split test n=95",
    status: "inconclusive",
    conclusion: "Paket YOLO26s tidak mengalahkan keluarga y26m dalam E2E.",
    findings:
      "Konfigurasi scratch dan no-augmentation bertindak sebagai kontrol perubahan distribusi galat detector.",
    metrics: [
      { label: "Vanilla SVM", value: "68,9%" },
      { label: "Scratch SVM", value: "68,9%" },
      { label: "No-aug SVM", value: "70,5%" },
    ],
    artifacts: ["reports/e2e_y26s_*/metrics.json"],
    parentIds: ["HD-009", "HD-010"],
    sourceKey: "dedup",
    position: grid(11, 0, 4),
  }),
  record({
    id: "HD-013",
    title: "E2E YOLO26m → SVM",
    date: "14–16 Mei 2026",
    era: "Arsip deduplikasi · Mei 2026",
    phase: "Track D · E2E",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Multi-view", "Counting"],
    model: "YOLO26m → SVM",
    seeds: "split test n=95",
    status: "supported",
    conclusion:
      "Hasil E2E terbaik generasi awal, namun masih jauh di bawah heuristik/ML dengan GT.",
    findings:
      "Menguatkan diagnosis awal: ketidakakuratan deteksi mempropagasi ke fitur counting.",
    metrics: [
      { label: "Macro Acc ±1", value: "71,6%" },
      { label: "Macro MAE", value: "1,118" },
      { label: "B3 Acc ±1", value: "60,0%" },
    ],
    artifacts: ["reports/e2e_y26m_vanilla_local_svm/metrics.json"],
    parentIds: ["HD-008", "HD-010"],
    sourceKey: "dedup",
    position: grid(12, 0, 4),
  }),
];

const baseline: Experiment[] = [
  record({
    id: "HB-001",
    title: "Penjumlahan appearance naif",
    date: "16 Mei 2026",
    era: "Baseline publik · Mei 2026",
    phase: "Baseline · Duplikasi",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "Add all appearances",
    seeds: "split 141 pohon test · GT",
    status: "negative",
    conclusion:
      "Penjumlahan semua appearance tidak valid untuk count tandan unik.",
    findings:
      "Menetapkan masalah duplikasi yang kemudian menjadi fondasi semua counter tree-level.",
    metrics: [
      { label: "Class ±1", value: "50,00%" },
      { label: "Tree ±1", value: "6,38%" },
      { label: "Macro MAE", value: "2,142" },
    ],
    artifacts: ["README.md §6.1", "results/heuristics_953/accuracy_full.csv"],
    parentIds: ["HD-002"],
    sourceKey: "baseline",
    position: grid(0, 5, 4),
  }),
  record({
    id: "HB-002",
    title: "Koreksi konstanta M15",
    date: "16 Mei 2026",
    era: "Baseline publik · Mei 2026",
    phase: "Baseline · Oracle",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "M15 · empat konstanta train",
    seeds: "split 141 pohon test · GT",
    status: "supported",
    conclusion:
      "Koreksi duplikasi sederhana bekerja sangat baik bila deteksi sempurna.",
    findings:
      "Bukan hasil detector E2E; tetap menjadi bukti bahwa aggregation dapat diatasi bila evidence benar.",
    metrics: [
      { label: "Class ±1", value: "95,39%" },
      { label: "Tree ±1", value: "85,11%" },
      { label: "Macro MAE", value: "0,376" },
    ],
    artifacts: ["README.md §6.1"],
    parentIds: ["HB-001"],
    sourceKey: "baseline",
    position: grid(1, 5, 4),
  }),
  record({
    id: "HB-003",
    title: "Koreksi pola visibilitas M01",
    date: "16 Mei 2026",
    era: "Baseline publik · Mei 2026",
    phase: "Baseline · Oracle",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "M01 visibility-pattern",
    seeds: "split 141 pohon test · GT",
    status: "supported",
    conclusion:
      "Koreksi pola visibilitas memimpin check heuristik pada GT versi baseline.",
    findings:
      "Jejak ini kemudian direvisi lebih lanjut di repo dedup pasca perbaikan GT.",
    metrics: [
      { label: "Class ±1", value: "95,92%" },
      { label: "Tree ±1", value: "87,23%" },
      { label: "Macro MAE", value: "0,340" },
    ],
    artifacts: ["README.md §6.1"],
    parentIds: ["HB-002"],
    sourceKey: "baseline",
    position: grid(2, 5, 4),
  }),
  record({
    id: "HB-004",
    title: "Counter ElasticNet berbasis GT",
    date: "16 Mei 2026",
    era: "Baseline publik · Mei 2026",
    phase: "Baseline · Oracle ML",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "ElasticNet · F0 13-dim",
    seeds: "split 141 pohon test · GT",
    status: "supported",
    conclusion:
      "Counter ML hampir menyelesaikan counting saat input berupa deteksi sempurna.",
    findings:
      "Gap dengan baseline YOLO menjelaskan bahwa bottleneck utama berada sebelum regresi count.",
    metrics: [
      { label: "Class ±1", value: "98,05%" },
      { label: "Tree ±1", value: "92,20%" },
      { label: "Macro MAE", value: "0,277" },
    ],
    artifacts: ["README.md §6.2"],
    parentIds: ["HB-003", "HD-010"],
    sourceKey: "baseline",
    position: grid(3, 5, 4),
  }),
  record({
    id: "HB-005",
    title: "Matriks counter F0 terkontrol",
    date: "Mei 2026",
    era: "Baseline publik · Mei 2026",
    phase: "Baseline · Counting",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Counting"],
    model: "LR · SVM · RF · Ridge · ElasticNet",
    seeds: "split 716 train / 141 test",
    status: "supported",
    conclusion:
      "ElasticNet memimpin ketika semua model dibatasi fitur F0 yang sama.",
    findings:
      "Model comparison yang bersih; tidak boleh dicampur dengan ranking konfigurasi F_all.",
    metrics: [
      { label: "ElasticNet Class ±1", value: "76,42%" },
      { label: "Tree ±1", value: "29,79%" },
      { label: "Macro MAE", value: "1,043" },
    ],
    artifacts: [
      "results/experiments/counting_controlled_results.csv",
      "README.md §6.4",
    ],
    parentIds: ["HD-013"],
    sourceKey: "baseline",
    position: grid(4, 5, 4),
  }),
  record({
    id: "HB-006",
    title: "Matriks counter F_all terkontrol",
    date: "Mei 2026",
    era: "Baseline publik · Mei 2026",
    phase: "Baseline · Counting",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Counting"],
    model: "Ridge · F_all 67-dim",
    seeds: "split 716 train / 141 test",
    status: "supported",
    conclusion:
      "Ridge memanfaatkan bank fitur 67-dim terbaik pada setelan train_only.",
    findings:
      "F_all membantu Ridge dan RF, tetapi merugikan beberapa model lain; bukan keuntungan universal fitur lebih banyak.",
    metrics: [
      { label: "Class ±1", value: "77,48%" },
      { label: "Tree ±1", value: "32,62%" },
      { label: "Macro MAE", value: "1,036" },
    ],
    artifacts: [
      "results/experiments/counting_controlled_results.csv",
      "README.md §6.5",
    ],
    parentIds: ["HB-005"],
    sourceKey: "baseline",
    position: grid(5, 5, 4),
  }),
  record({
    id: "HB-007",
    title: "Train+validation sebagai check sekunder",
    date: "Mei 2026",
    era: "Baseline publik · Mei 2026",
    phase: "Baseline · Counting",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Counting"],
    model: "ElasticNet · F0+spatial",
    seeds: "split 812 train+val / 141 test",
    status: "negative",
    conclusion:
      "Menambah validation ke training tidak melampaui headline train-only.",
    findings:
      "Check ini mengurangi kekhawatiran bahwa baseline utama hanya menang karena strategi latih yang kurang data.",
    metrics: [
      { label: "Terbaik train+val", value: "76,60%" },
      { label: "Ridge F_all train-only", value: "77,48%" },
    ],
    artifacts: ["README.md §6.8"],
    parentIds: ["HB-006"],
    sourceKey: "baseline",
    position: grid(6, 5, 4),
  }),
  record({
    id: "HB-008",
    title: "Counter kompleks & stacking",
    date: "Mei 2026",
    era: "Baseline publik · Mei 2026",
    phase: "Baseline · Counting",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Counting"],
    model: "Ridge v4 · stacking · XGB-Optuna",
    seeds: "split 141 pohon test",
    status: "negative",
    conclusion: "Counter lebih kompleks tidak mengungguli Ridge + F_all.",
    findings:
      "Memperkuat keputusan untuk tidak menambah kompleksitas counter sebelum evidence detector membaik.",
    metrics: [
      { label: "Ridge full v4", value: "76,24%" },
      { label: "Stacking", value: "76,06%" },
      { label: "XGB-Optuna", value: "74,11%" },
    ],
    artifacts: ["experiments/exp_counting_v4.py", "README.md §6.9"],
    parentIds: ["HB-006"],
    sourceKey: "baseline",
    position: grid(7, 5, 4),
  }),
  record({
    id: "HB-009",
    title: "Baseline praktis detector → counter",
    date: "01 Jun 2026",
    era: "Baseline publik · Mei–Jun 2026",
    phase: "Baseline · Rilis",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Multi-view", "Counting"],
    model: "YOLO26m → Ridge F_all",
    seeds: "1 run · seed 42 · split 716/96/141",
    status: "supported",
    conclusion:
      "Benchmark E2E resmi rilis: Ridge + F_all pada deteksi YOLO26m.",
    findings:
      "Menjadi pembanding counting yang dilacak oleh reproduksi V2 serta analisis visibility/association berikutnya.",
    metrics: [
      { label: "Class ±1", value: "77,48%" },
      { label: "Tree ±1", value: "32,62%" },
      { label: "Macro MAE", value: "1,036" },
    ],
    artifacts: ["README.md §6.10", "benchmarks/check_release_claims.py"],
    parentIds: ["HB-006", "HB-008"],
    sourceKey: "baseline",
    position: grid(8, 5, 4),
  }),
];

const pipelineRecords = [
  [
    "RP-E001",
    "class_mismatch sebagai ambiguitas kematangan",
    "E-001",
    "Dipalsukan",
    "class_mismatch bukan ukuran ambiguitas yang sah.",
  ],
  [
    "RP-E002",
    "Inventaris master mentah Sawit",
    "E-002",
    "Inventaris selesai",
    "Membuka dasar data mentah bagi eksperimen resolusi tinggi.",
  ],
  [
    "RP-E003",
    "DA3 pada video orbit",
    "E-003",
    "Pose dikonfirmasi",
    "Geometri video orbit terbaca untuk pose.",
  ],
  [
    "RP-E004",
    "DA3 pada banyak video orbit",
    "E-004",
    "Dikonfirmasi",
    "Konsistensi diperiksa lintas video orbit.",
  ],
  [
    "RP-E005",
    "DA3 pada empat dan delapan sisi",
    "E-005",
    "Dikonfirmasi",
    "Penautan sisi diuji pada foto asli.",
  ],
  [
    "RP-E006",
    "Pseudo-depth pemisah tandan",
    "E-006",
    "Dipalsukan",
    "Pseudo-depth tidak memisahkan tandan dari latar secara memadai.",
  ],
  [
    "RP-E007",
    "Penautan geometri lintas-sisi",
    "E-007",
    "Dipalsukan",
    "Jalur penautan geometri tidak mendukung peningkatan.",
  ],
  [
    "RP-E009",
    "Ukuran kotak pada resolusi latih",
    "E-009",
    "Diagnosis tersedia",
    "Ukuran objek dipakai untuk mengurai kesulitan B4.",
  ],
  [
    "RP-E010",
    "Diagnosis kegagalan B4",
    "E-010",
    "Kontras dikonfirmasi",
    "Kontras, bukan kepadatan, mendominasi diagnosis B4.",
  ],
  [
    "RP-E011",
    "Praproses tekstur B4",
    "E-011",
    "Tekstur dikonfirmasi",
    "Tekstur membantu; penajam kontras dipalsukan.",
  ],
  [
    "RP-E012",
    "Ordinalitas kelas kematangan",
    "E-012",
    "Dikonfirmasi",
    "Kelas B1–B4 memperlihatkan struktur ordinal.",
  ],
  [
    "RP-E013",
    "Pipeline produksi empat kanal",
    "E-013",
    "Pipeline tersedia",
    "Pipeline sensor disiapkan, tanpa bobot sensor sebagai klaim performa.",
  ],
  [
    "RP-E014",
    "Deteksi atau klasifikasi?",
    "E-014",
    "Klasifikasi jadi hambatan",
    "Memisahkan hambatan lokalisasi dan kematangan.",
  ],
  [
    "RP-E015",
    "Pemetaan master mentah ke SawitMVC",
    "E-015",
    "3.992/3.992 terpetakan",
    "Seluruh citra master dipetakan.",
  ],
  [
    "RP-E016",
    "Plafon kematangan",
    "E-016",
    "Ditarik",
    "Bukti plafon cacat dan ditarik.",
  ],
  [
    "RP-E017",
    "Detektor dua tahap",
    "E-017",
    "Dipalsukan",
    "Dua tahap tidak mengungguli jalur yang diuji.",
  ],
  [
    "RP-E018",
    "Target 0,60/0,30 secara geometri",
    "E-018",
    "Mungkin",
    "Geometri anotasi tidak menutup target secara prinsip.",
  ],
  [
    "RP-E019",
    "Resolusi tinggi & augmentasi aman-warna",
    "E-019",
    "Tidak konklusif",
    "Kombinasi tidak menghasilkan keputusan yang kuat.",
  ],
  [
    "RP-E020",
    "RT-DETR NMS-free",
    "E-020",
    "Dikonfirmasi",
    "RT-DETR melampaui baseline sebelum kemudian dilampaui RF-DETR.",
  ],
  [
    "RP-E021",
    "RF-DETR-L vs RT-DETR",
    "E-021",
    "Final",
    "RF-DETR-L menjadi hasil empat kelas final di Research-Pipeline.",
  ],
  [
    "RP-E022",
    "Depth sensor Orbbec & early fusion",
    "E-022",
    "Audit",
    "Registrasi tervalidasi; klaim kenaikan deteksi belum sah.",
  ],
  [
    "RP-E024",
    "Inkonsistensi prediksi lintas-sisi",
    "E-024",
    "Terukur",
    "Ambiguitas lintas-sisi diukur pada SawitMVC-Depth.",
  ],
  [
    "RP-E025",
    "Audit selisih evaluator",
    "E-025",
    "Audit selesai",
    "Selisih menskala dengan jumlah deteksi; pycocotools menjadi protokol mengikat.",
  ],
  [
    "RP-E026",
    "Depth untuk stabilitas identitas",
    "E-026",
    "Tidak konklusif",
    "Denominator RGB dan RGB-D berbeda sehingga tidak ada klaim ekuivalensi.",
  ],
  [
    "RP-E027",
    "Matriks multi-seed depth YOLO26n",
    "E-027",
    "Dipalsukan",
    "Depth merugikan pada YOLO26n.",
  ],
  [
    "RP-E028",
    "Ambiguitas lintas-sisi skala besar",
    "E-028",
    "Dikonfirmasi",
    "B2 terukur sebagai kelas paling ambigu.",
  ],
  [
    "RP-E029",
    "Matriks multi-seed RT-DETR-L",
    "E-029",
    "Dicabut",
    "Klausa kapasitas tinggi untuk depth dicabut.",
  ],
  [
    "RP-E030",
    "Sapuan kapasitas YOLO26",
    "E-030",
    "Dibatasi",
    "Pola satu-seed tidak cukup untuk klaim kapasitas umum.",
  ],
  [
    "RP-E031",
    "Varians split versus seed",
    "E-031",
    "Terukur",
    "Varians split nyata dan setiap mAP harus menyebut split.",
  ],
  [
    "RP-E032",
    "Titik fusi RGB-D",
    "E-032",
    "Tidak konklusif",
    "12/12 CI95 memuat nol; mid hanya indikasi.",
  ],
  [
    "RP-E033",
    "Rentang metrik depth terkalibrasi",
    "E-033",
    "Audit",
    "Mengoreksi rentang kanal depth yang sebelumnya salah.",
  ],
  [
    "RP-E033b",
    "Replikasi tiga seed E-033",
    "E-033b",
    "Tidak bertahan",
    "Efek mAP50 E-033 tidak bertahan replikasi.",
  ],
] as const;

const statusFor = (verdict: string): Experiment["status"] =>
  verdict === "Final" ||
  verdict === "Dikonfirmasi" ||
  verdict === "Terukur" ||
  verdict === "Mungkin" ||
  verdict === "Tekstur dikonfirmasi" ||
  verdict === "Kontras dikonfirmasi" ||
  verdict === "Klasifikasi jadi hambatan" ||
  verdict === "3.992/3.992 terpetakan"
    ? "supported"
    : verdict === "Dipalsukan" ||
        verdict === "Dicabut" ||
        verdict === "Ditarik" ||
        verdict === "Tidak bertahan"
      ? "negative"
      : verdict === "Tidak konklusif" || verdict === "Dibatasi"
        ? "inconclusive"
        : "audit_needed";

const pipeline: Experiment[] = pipelineRecords.map(
  ([id, title, code, verdict, detail], index) => {
    const isDepth = [
      "RP-E013",
      "RP-E022",
      "RP-E024",
      "RP-E025",
      "RP-E026",
      "RP-E027",
      "RP-E029",
      "RP-E030",
      "RP-E031",
      "RP-E032",
      "RP-E033",
      "RP-E033b",
    ].includes(id);
    const isFinal = id === "RP-E021";
    const specialMetrics: Record<string, Experiment["metrics"]> = {
      "RP-E021": [
        { label: "Test mAP50", value: "0,6038" },
        { label: "Test mAP50-95", value: "0,2770" },
        { label: "Split pohon", value: "716 / 96 / 141" },
      ],
      "RP-E024": [
        { label: "Inkonsistensi", value: "19,5%" },
        { label: "Dataset", value: "SawitMVC-Depth" },
      ],
      "RP-E027": [
        { label: "Depth − RGB", value: "−0,0230" },
        { label: "Seed negatif signifikan", value: "2 / 3" },
      ],
      "RP-E028": [
        { label: "Inkonsistensi", value: "0,2329" },
        { label: "Tandan", value: "511" },
        { label: "Kelas paling ambigu", value: "B2 · 0,434" },
      ],
      "RP-E031": [
        { label: "Rentang RGB antar split", value: "0,0488", note: "mAP" },
        { label: "Rentang seed", value: "0,0321", note: "mAP" },
      ],
      "RP-E032": [
        { label: "Run", value: "15 · 5 lengan × 3 seed" },
        { label: "Kontras CI95 memuat nol", value: "12 / 12" },
        { label: "Mid rerata", value: "+0,0139" },
      ],
    };
    return record({
      id,
      title: `${code} · ${title}`,
      date: "21 Jul–06 Agu 2026",
      era: "Research-Pipeline · Jul–Agu 2026",
      phase: isDepth ? "Seri E · Sensor / audit" : "Seri E · Diagnosis",
      dataset: isDepth ? "SawitMVC-Depth-352" : "SawitMVC-953",
      inputs: isDepth ? ["RGB", "Depth", "Audit"] : ["RGB", "Multi-view"],
      model: isFinal ? "RF-DETR-L" : "Probe / eksperimen tercatat",
      seeds: isFinal
        ? "protokol pycocotools · split 716/96/141"
        : "lihat log primer",
      status: statusFor(verdict),
      conclusion: `${verdict}: ${detail}`,
      findings:
        "Node historis diringkas dari register eksperimen; detail primer dan koreksi audit dibuka pada artefak sumber.",
      metrics: specialMetrics[id] ?? [
        { label: "Putusan register", value: verdict },
        { label: "Seri", value: code },
      ],
      artifacts: ["experiments/README.md", "experiments/EKSPERIMEN.md"],
      parentIds: index === 0 ? ["HB-009"] : [pipelineRecords[index - 1][0]],
      sourceKey: "pipeline",
      position: grid(index, 9, 13),
    });
  }
);

const formulation: Experiment[] = [
  record({
    id: "RP-F001",
    title: "F-001 · Prasyarat & VRAM RF-DETR-L",
    date: "06 Agu 2026",
    era: "Research-Pipeline · Seri F",
    phase: "Formulasi · Prasyarat",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Training", "Audit"],
    model: "RF-DETR-L",
    seeds: "GPU A4500 · ulangan tidak dicatat",
    status: "supported",
    conclusion: "Resep E-021 muat dengan paralelisme satu run.",
    findings:
      "Pra-syarat replikasi dan anggaran VRAM dibuktikan sebelum jalur arsitektur baru dinilai.",
    metrics: [
      { label: "Puncak VRAM", value: "10.331 / 20.470 MiB" },
      { label: "Waktu", value: "9,2 menit/epoch" },
    ],
    artifacts: ["experiments/SERI-F.md §4"],
    parentIds: ["RP-E021"],
    sourceKey: "pipeline",
    position: grid(32, 9, 13),
  }),
  record({
    id: "RP-F002",
    title: "F-002 · P2 frekuensi vs pelepah",
    date: "06 Agu 2026",
    era: "Research-Pipeline · Seri F",
    phase: "Formulasi · Pra-saring",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Training"],
    model: "DWT-HH · Laplacian",
    seeds: "probe · ulangan tidak dicatat",
    status: "supported",
    conclusion: "Gerbang frekuensi tinggi lolos untuk keterpisahan B4.",
    findings:
      "Ini pra-saring mekanisme, bukan klaim kenaikan mAP detector akhir.",
    metrics: [
      { label: "DWT-HH Δ B4", value: "+0,0731" },
      { label: "Laplacian Δ B4", value: "+0,0721" },
      { label: "Ambang", value: "+0,02" },
    ],
    artifacts: ["experiments/SERI-F.md §4"],
    parentIds: ["RP-F001"],
    sourceKey: "pipeline",
    position: grid(33, 9, 13),
  }),
  record({
    id: "RP-F003",
    title: "F-003 · P3 plafon lintas-sisi",
    date: "06 Agu 2026",
    era: "Research-Pipeline · Seri F",
    phase: "Formulasi · Pra-saring",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Multi-view", "Geometry"],
    model: "K3 cross-side",
    seeds: "probe · ulangan tidak dicatat",
    status: "negative",
    conclusion: "Gerbang K3 gugur dan jalur lintas-sisi dibatalkan.",
    findings:
      "Mayoritas galat salah di semua sisi, sehingga konsistensi query bukan prioritas yang didukung.",
    metrics: [
      { label: "Plafon", value: "0,2794 < 0,30" },
      { label: "Galat salah semua sisi", value: "72%" },
      { label: "B4", value: "0,1038" },
    ],
    artifacts: ["experiments/SERI-F.md §4"],
    parentIds: ["RP-F001", "RP-E028"],
    sourceKey: "pipeline",
    position: grid(34, 9, 13),
  }),
  record({
    id: "RP-F004",
    title: "F-004 · Baseline RF-DETR-L tiga seed",
    date: "06 Agu 2026",
    era: "Research-Pipeline · Seri F",
    phase: "Formulasi · Baseline",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Training"],
    model: "RF-DETR-L",
    seeds: "3 run · seed tidak dicatat",
    status: "supported",
    conclusion:
      "Varians seed baseline jauh lebih kecil dari asumsi perencanaan.",
    findings:
      "Menetapkan baseline multi-seed untuk menilai perubahan arsitektur pada seri F.",
    metrics: [
      { label: "Rerata test mAP50", value: "0,5949" },
      { label: "SD seed", value: "0,0049", note: "mAP50" },
    ],
    artifacts: ["experiments/SERI-F.md §4"],
    parentIds: ["RP-E021"],
    sourceKey: "pipeline",
    position: grid(35, 9, 13),
  }),
  record({
    id: "RP-F005",
    title: "F-005 · P1 massa selisih logit",
    date: "06 Agu 2026",
    era: "Research-Pipeline · Seri F",
    phase: "Formulasi · Pra-saring",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Ordinal"],
    model: "Probe logit ordinal",
    seeds: "probe · ulangan tidak dicatat",
    status: "supported",
    conclusion: "Gerbang ordinal lolos dan massa tersulit berada pada B3.",
    findings:
      "Temuan ini menempatkan masalah ordinal lebih spesifik daripada dugaan B2 awal.",
    metrics: [
      { label: "Massa selisih logit", value: "0,7113" },
      { label: "Ambang", value: "0,30" },
      { label: "Massa terbesar", value: "B3" },
    ],
    artifacts: ["experiments/SERI-F.md §4"],
    parentIds: ["RP-E012", "RP-F004"],
    sourceKey: "pipeline",
    position: grid(36, 9, 13),
  }),
  record({
    id: "RP-F007",
    title: "F-007 · Cabang frekuensi init-nol",
    date: "06 Agu 2026",
    era: "Research-Pipeline · Seri F",
    phase: "Formulasi · Run parsial",
    dataset: "SawitMVC-953",
    inputs: ["RGB", "Training"],
    model: "K1a frequency branch",
    seeds: "2 dari 12 run terjadwal · dihentikan dini",
    status: "negative",
    conclusion:
      "Seri dihentikan karena gate tidak pernah aktif pada run parsial.",
    findings:
      "Tidak boleh dibaca sebagai pengujian lengkap; justru menjelaskan keputusan menghentikan seri dan menghemat run lanjutan.",
    metrics: [
      { label: "γ akhir DWT", value: "+0,0003" },
      { label: "γ akhir Laplacian", value: "−6e−5" },
      { label: "Run selesai", value: "2 / 12" },
    ],
    artifacts: ["experiments/SERI-F.md §4"],
    parentIds: ["RP-F002", "RP-F004"],
    sourceKey: "pipeline",
    position: grid(37, 9, 13),
  }),
];

export const historicalExperiments: Experiment[] = [
  ...dedup,
  ...baseline,
  ...pipeline,
  ...formulation,
];
