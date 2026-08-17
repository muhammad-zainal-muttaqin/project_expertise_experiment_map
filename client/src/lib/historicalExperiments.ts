/** Field Research Ledger — bukti historis SawitMVC yang dilacak sampai commit repositori yang telah diaudit. */
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
      "Iterasi geometri awal sempat melaporkan akurasi 93,86%, namun metrik pra-perbaikan ground truth tidak digunakan sebagai hasil akhir.",
    findings:
      "Rekam jejak commit mencatat evaluasi historis awal, sedangkan rilis pasca-perbaikan ground truth menjadi dasar acuan interpretasi ilmiah.",
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
    conclusion:
      "Metode heuristik valid terbaik pada rilis pasca-perbaikan ground truth.",
    findings:
      "Menjadi referensi historis untuk koreksi visibilitas tanpa pelatihan model; bukan metrik detektor end-to-end.",
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
    conclusion:
      "Metode pembanding heuristik valid dengan performa di bawah M01.",
    findings:
      "M05 menunjukkan bahwa koreksi visibilitas dapat beroperasi tanpa model pembelajaran mesin, namun tidak mengungguli algoritma selektor M01.",
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
    conclusion:
      "Formulasi bobot visibilitas valid, namun bukan konfigurasi dengan akurasi tertinggi.",
    findings:
      "Hasil pengujian menegaskan beberapa formulasi valid bersaing ketat setelah perbaikan ground truth.",
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
    conclusion:
      "M07 mencatatkan nilai galat absolut rata-rata (MAE) terendah di antara metode heuristik valid.",
    findings:
      "Akurasi setara dengan M06 dengan simpangan galat numerik lebih kecil; tetap berada di bawah M01 pada metrik Acc ±1.",
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
      "Koreksi rasio global menjadi model acuan heuristik valid yang paling efisien secara komputasi.",
    findings:
      "Proses inferensi sangat cepat (0,005 ms/pohon), namun akurasinya berada di bawah pendekatan koreksi pola visibilitas spasial.",
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
      "Metode M53 dan M60 mencapai akurasi 90,24% namun didiskualifikasi karena parameter pembagi diturunkan dari data pengujian (data leakage).",
    findings:
      "Dipelihara sebagai rekam jejak audit: skor tinggi tidak dapat diklaim sebagai algoritma yang memiliki validitas generalisasi.",
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
      "YOLO26n lokal mencatatkan mAP50 tertinggi dan menjadi konfigurasi paling efisien pada batch size 16.",
    findings:
      "Membuktikan bahwa model dengan parameter lebih kecil dapat berkinerja lebih optimal pada lingkungan komputasi dan konfigurasi ini.",
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
      "Penonaktifan augmentasi menurunkan mAP50 dan memicu overfitting; inisialisasi dari awal (scratch) tidak mengungguli konfigurasi standar.",
    findings:
      "Augmentasi citra merupakan komponen esensial pada baseline lokal, sedangkan bobot pretraining COCO tidak menjadi faktor penentu utama.",
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
      "Ekstraksi fitur ground truth 13 dimensi menetapkan batas atas teoretis pencacahan yang sangat tinggi (96,1% Acc ±1).",
    findings:
      "Disparitas terhadap pipeline end-to-end mengisolasi kendala utama pada propagasi galat detektor ke modul pencacahan.",
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
      "Model SVM memberikan akurasi tertinggi pada keluarga YOLO26n, namun masih berjarak signifikan dari pencacah berbasis oracle ground truth.",
    findings:
      "Variasi modul pencacah hanya memberikan fluktuasi marjinal; performa sistem secara keseluruhan dibatasi oleh akurasi deteksi awal.",
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
    conclusion:
      "Konfigurasi YOLO26s tidak melampaui performa keluarga YOLO26m dalam evaluasi end-to-end.",
    findings:
      "Eksperimen pelatihan scratch dan tanpa augmentasi berfungsi sebagai kontrol empiris perubahan distribusi galat detektor.",
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
      "Mencapai performa end-to-end terbaik pada generasi awal (71,6% Acc ±1), namun masih berada di bawah metode berbasis oracle ground truth.",
    findings:
      "Mengonfirmasi hipotesis awal: ketidakakuratan lokalisasi dan klasifikasi deteksi terpropagasi secara langsung ke fitur pencacahan.",
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
    title: "Penjumlahan kemunculan naif",
    date: "16 Mei 2026",
    era: "Baseline publik · Mei 2026",
    phase: "Baseline · Duplikasi",
    dataset: "SawitMVC-953",
    inputs: ["Multi-view", "Counting"],
    model: "Add all appearances",
    seeds: "split 141 pohon test · GT",
    status: "negative",
    conclusion:
      "Penjumlahan seluruh kemunculan bounding box secara naif tidak valid untuk estimasi jumlah tandan unik per pohon.",
    findings:
      "Menetapkan perumusan formal masalah duplikasi multi-sudut pandang yang mendasari pengembangan seluruh modul pencacah tingkat pohon.",
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
      "Koreksi duplikasi berbasis rasio konstan berkinerja sangat tinggi saat menerima masukan deteksi sempurna (oracle).",
    findings:
      "Bukan merupakan evaluasi detektor end-to-end; membuktikan bahwa kendala agregasi dapat diselesaikan bila bukti deteksi akurat.",
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
      "Koreksi pola visibilitas M01 mencatatkan performa heuristik tertinggi pada dataset ground truth versi baseline publik.",
    findings:
      "Rekam jejak ini kemudian diperbaiki lebih lanjut pada repositori deduplikasi pasca-standarisasi ground truth.",
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
      "Model regresi ElasticNet hampir menyelesaikan permasalahan pencacahan saat diberikan masukan deteksi sempurna (Class ±1 98,05%).",
    findings:
      "Kesenjangan performa terhadap pipeline YOLO mengonfirmasi bahwa hambatan utama berada pada tahap deteksi dan asosiasi data.",
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
      "ElasticNet memimpin performa pencacahan terkontrol ketika seluruh model dievaluasi menggunakan himpunan fitur F0 yang sama.",
    findings:
      "Merupakan perbandingan model yang terstandarisasi; tidak dapat dicampuradukkan dengan evaluasi pada bank fitur F_all.",
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
      "Regresi Ridge memanfaatkan representasi bank fitur F_all 67 dimensi secara paling optimal pada skema pelatihan train-only.",
    findings:
      "Penambahan fitur F_all menguntungkan Ridge dan Random Forest, namun mendegradasi beberapa model lain; penambahan fitur tidak selalu menguntungkan secara universal.",
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
      "Penggabungan data validasi ke dalam set pelatihan tidak melampaui performa acuan skema train-only.",
    findings:
      "Uji kontrol ini memastikan bahwa keunggulan baseline utama bukan disebabkan oleh strategi pelatihan yang kekurangan data sampel.",
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
    conclusion:
      "Arsitektur pencacah yang lebih kompleks dan metode stacking tidak mengungguli kombinasi Ridge + F_all.",
    findings:
      "Memperkuat keputusan strategis untuk tidak menambah kompleksitas modul pencacah sebelum akurasi deteksi ditingkatkan.",
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
      "Benchmark end-to-end resmi rilis: regresi Ridge + F_all berbasis deteksi YOLO26m (Class ±1 77,48%).",
    findings:
      "Ditetapkan sebagai garis dasar pembanding (baseline) resmi yang dirujuk oleh seluruh reproduksi Volume 2 dan analisis asosiasi lanjutan.",
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
    "Evaluasi class_mismatch sebagai metrik ambiguitas",
    "E-001",
    "Dipalsukan",
    "class_mismatch terbukti bukan metrik ambiguitas kematangan yang valid secara teoritis maupun empiris.",
  ],
  [
    "RP-E002",
    "Inventarisasi berkas citra master SawitMVC",
    "E-002",
    "Inventaris selesai",
    "Menyediakan inventaris data mentah terverifikasi bagi perancangan eksperimen resolusi tinggi.",
  ],
  [
    "RP-E003",
    "Estimasi pose kamera DA3 pada video orbit",
    "E-003",
    "Pose dikonfirmasi",
    "Estimasi geometri kamera dari rekaman video orbit terbukti layak untuk pemulihan pose.",
  ],
  [
    "RP-E004",
    "Uji konsistensi pose DA3 lintas video orbit",
    "E-004",
    "Dikonfirmasi",
    "Konsistensi pemulihan pose geometris terverifikasi lintas berbagai rekaman video orbit.",
  ],
  [
    "RP-E005",
    "Evaluasi geometri pose DA3 fotografi multi-sisi",
    "E-005",
    "Dikonfirmasi",
    "Kesesuaian penautan sudut pandang diuji dan divalidasi pada kumpulan foto akuisisi riil.",
  ],
  [
    "RP-E006",
    "Uji keterpisahan representasi pseudo-depth",
    "E-006",
    "Dipalsukan",
    "Representasi kedalaman semu (pseudo-depth) terbukti tidak memisahkan objek tandan dari latar belakang secara memadai.",
  ],
  [
    "RP-E007",
    "Penautan fitur geometri antarsudut pandang",
    "E-007",
    "Dipalsukan",
    "Pendekatan penautan geometri antarsudut pandang tidak memberikan peningkatan akurasi yang diharapkan.",
  ],
  [
    "RP-E009",
    "Analisis dimensi bounding box resolusi latih",
    "E-009",
    "Diagnosis tersedia",
    "Distribusi dimensi bounding box dianalisis untuk mengurai faktor kesulitan deteksi kelas B4.",
  ],
  [
    "RP-E010",
    "Diagnosis faktor kegagalan deteksi B4",
    "E-010",
    "Kontras dikonfirmasi",
    "Faktor kontras visual, bukan densitas objek, teridentifikasi mendominasi kegagalan deteksi kelas B4.",
  ],
  [
    "RP-E011",
    "Pra-pemrosesan tekstur untuk deteksi B4",
    "E-011",
    "Tekstur dikonfirmasi",
    "Ekstraksi tekstur terbukti membantu deteksi B4; teknik penajaman kontras piksel tidak didukung.",
  ],
  [
    "RP-E012",
    "Struktur ordinalitas kelas kematangan B1–B4",
    "E-012",
    "Dikonfirmasi",
    "Distribusi kesalahan kelas kematangan B1–B4 mengonfirmasi adanya struktur ordinal yang teratur.",
  ],
  [
    "RP-E013",
    "Standardisasi pipeline empat kanal RGB-D",
    "E-013",
    "Pipeline tersedia",
    "Pipeline sensor empat kanal terstandarisasi disiapkan tanpa mengklaim bobot kanal sensor sebagai peningkatan performa.",
  ],
  [
    "RP-E014",
    "Isolasi galat: lokalisasi vs klasifikasi",
    "E-014",
    "Klasifikasi jadi hambatan",
    "Berhasil mengisolasi hambatan klasifikasi kematangan dari kendala lokalisasi spasial tandan.",
  ],
  [
    "RP-E015",
    "Pemetaan master citra mentah ke SawitMVC",
    "E-015",
    "3.992/3.992 terpetakan",
    "Seluruh 3.992 citra master mentah berhasil dipetakan secara terverifikasi ke dataset SawitMVC.",
  ],
  [
    "RP-E016",
    "Audit validitas klaim plafon kematangan",
    "E-016",
    "Ditarik",
    "Klaim plafon teoritis kematangan sebelumnya dinyatakan memiliki cacat metodologis dan ditarik.",
  ],
  [
    "RP-E017",
    "Evaluasi komparatif detektor dua tahap",
    "E-017",
    "Dipalsukan",
    "Arsitektur detektor dua tahap terbukti tidak mengungguli jalur pemodelan acuan yang diuji.",
  ],
  [
    "RP-E018",
    "Analisis kelayakan geometris target mAP50 0,60",
    "E-018",
    "Mungkin",
    "Karakteristik geometri anotasi membuktikan bahwa target 0,60 mAP50 secara prinsipil masih dapat dicapai.",
  ],
  [
    "RP-E019",
    "Resolusi tinggi & augmentasi pelestari warna",
    "E-019",
    "Tidak konklusif",
    "Kombinasi resolusi tinggi dan augmentasi pelestari warna belum menghasilkan kesimpulan arah yang konklusif.",
  ],
  [
    "RP-E020",
    "Benchmark RT-DETR bebas NMS",
    "E-020",
    "Dikonfirmasi",
    "Model RT-DETR melampaui baseline awal sebelum kemudian diungguli secara definitif oleh RF-DETR.",
  ],
  [
    "RP-E021",
    "Evaluasi komparatif RF-DETR-L vs RT-DETR",
    "E-021",
    "Final",
    "RF-DETR-L ditetapkan sebagai capaian detektor empat kelas final pada repositori Research-Pipeline.",
  ],
  [
    "RP-E022",
    "Registrasi sensor Orbbec & early fusion",
    "E-022",
    "Audit",
    "Registrasi sensor kedalaman tervalidasi; klaim peningkatan akurasi deteksi belum terbukti secara empiris.",
  ],
  [
    "RP-E024",
    "Kuantifikasi ambiguitas prediksi lintas-sisi",
    "E-024",
    "Terukur",
    "Tingkat ambiguitas klasifikasi lintas sudut pandang terukur secara kuantitatif pada SawitMVC-Depth.",
  ],
  [
    "RP-E025",
    "Audit diskrepansi evaluator & pycocotools",
    "E-025",
    "Audit selesai",
    "Diskrepansi evaluator terbukti berkorelasi dengan jumlah deteksi; protokol pycocotools ditetapkan sebagai standar mengikat.",
  ],
  [
    "RP-E026",
    "Evaluasi depth untuk stabilitas identitas",
    "E-026",
    "Tidak konklusif",
    "Perbedaan penyebut (denominator) antara RGB dan RGB-D membatasi klaim kesetaraan stabilitas identitas.",
  ],
  [
    "RP-E027",
    "Ablasi multi-seed depth YOLO26n",
    "E-027",
    "Dipalsukan",
    "Penambahan kanal kedalaman terbukti menurunkan performa deteksi pada arsitektur YOLO26n.",
  ],
  [
    "RP-E028",
    "Ambiguitas klasifikasi lintas-sisi skala besar",
    "E-028",
    "Dikonfirmasi",
    "Tingkat ambiguitas klasifikasi terukur secara luas dengan kelas B2 sebagai kategori paling ambigu.",
  ],
  [
    "RP-E029",
    "Ablasi multi-seed depth RT-DETR-L",
    "E-029",
    "Dicabut",
    "Hipotesis keunggulan kanal kedalaman pada model berkapasitas tinggi resmi dicabut.",
  ],
  [
    "RP-E030",
    "Analisis kapasitas arsitektur YOLO26",
    "E-030",
    "Dibatasi",
    "Pola evaluasi berbasis satu seed tidak memadai untuk menyimpulkan hubungan kapasitas model secara umum.",
  ],
  [
    "RP-E031",
    "Analisis varians: partisi split vs seed",
    "E-031",
    "Terukur",
    "Varians partisi data (split) terbukti nyata; setiap pelaporan metrik mAP wajib menyertakan identitas split.",
  ],
  [
    "RP-E032",
    "Evaluasi matriks fusi representasi RGB-D",
    "E-032",
    "Tidak konklusif",
    "Sebanyak 12 dari 12 selang kepercayaan 95% memuat nol; nilai rata-rata hanya bersifat indikatif.",
  ],
  [
    "RP-E033",
    "Audit kalibrasi rentang skala depth",
    "E-033",
    "Audit",
    "Mengoreksi rentang skala kanal kedalaman yang pada eksperimen sebelumnya mengalami kesalahan kalibrasi.",
  ],
  [
    "RP-E033b",
    "Replikasi multi-seed kalibrasi E-033",
    "E-033b",
    "Tidak bertahan",
    "Peningkatan performa mAP50 pada E-033 terbukti tidak bertahan setelah replikasi multi-seed.",
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
    conclusion:
      "Konfigurasi komputasi RF-DETR-L memenuhi batas kapasitas memori VRAM GPU pada eksekusi run tunggal.",
    findings:
      "Persyaratan reproduksi dan batas alokasi VRAM diverifikasi sebelum mengevaluasi perubahan arsitektur baru.",
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
    conclusion:
      "Fitur spasial frekuensi tinggi lolos ambang penyaringan awal untuk diferensiasi kelas B4.",
    findings:
      "Merupakan penyaringan mekanisme representasi awal, bukan klaim peningkatan mAP detektor final.",
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
    conclusion:
      "Gerbang mekanisme K3 tidak memenuhi kriteria kelayakan sehingga jalur komparasi lintas-sudut pandang dibatalkan.",
    findings:
      "Sebagian besar galat klasifikasi terjadi serentak di semua sudut pandang, sehingga konsistensi query bukan prioritas yang didukung data.",
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
      "Varians performa antar-seed pada model baseline RF-DETR-L terbukti jauh lebih kecil dari asumsi awal.",
    findings:
      "Menetapkan acuan multi-seed terstandarisasi untuk menguji modifikasi arsitektur pada eksperimen Seri F.",
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
    conclusion:
      "Gerbang representasi ordinal terkonfirmasi valid dengan konsentrasi galat terbesar berada pada kelas B3.",
    findings:
      "Temuan ini mendefinisikan fokus masalah ordinal secara lebih presisi daripada dugaan awal pada kelas B2.",
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
      "Eksperimen dihentikan karena cabang gerbang adaptif tidak aktif secara konvergen pada iterasi pengujian awal.",
    findings:
      "Keputusan penghentian dini didokumentasikan untuk transparansi riset dan efisiensi alokasi komputasi lanjutan.",
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
