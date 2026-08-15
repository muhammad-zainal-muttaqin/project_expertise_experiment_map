# Dossier Audit Repositori — research-method-dedup

> **Fungsi dokumen.** Dossier ini menjelaskan lintasan deduplikasi dan counting multi-sisi yang mendahului baseline publik: heuristik berbasis geometri/visibilitas, audit ground truth, ablation YOLO lokal, counter ML pada fitur oracle, serta pipeline ujung-ke-ujung. Angka tinggi yang melanggar aturan validasi tetap dicatat sebagai rekam historis, tetapi tidak dipromosikan sebagai metode sah.

## Identitas dan Batas Audit

| Atribut | Nilai |
|---|---|
| Repositori | [`muhammad-zainal-muttaqin/research-method-dedup`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup) |
| Commit yang diaudit | [`a720f17`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/tree/a720f17) |
| Peran dalam program riset | Deduplikasi/counter pra-baseline, audit multi-view, EDA, ML oracle, dan eksperimen E2E lokal. |
| Data yang disebut | 953 pohon: DAMIMAS 854, LONSUM 99; kelas B1–B4. |
| Track | A heuristik; B deteksi YOLO26; C ML dengan fitur GT; D deteksi→counting E2E. |
| Batas headline | M53 dan M60 berangka `90,24%` tidak valid karena divisor dikalibrasi dari statistik training split. |

Repositori ini sangat berguna untuk menjawab mengapa counting tidak boleh diperlakukan sebagai penjumlahan deteksi. Namun terdapat beberapa generasi ground-truth fix dan aturan validitas internal; pembaca harus selalu menyebut versi GT, apakah inputnya GT atau prediksi detector, dan apakah metode memakai parameter yang diturunkan dari statistik train. [1] [2]

## Problem dan Dataset Kerja

Setiap pohon memiliki 4–8 foto sisi. Pipeline mengambil deteksi bounding box per sisi dan mengestimasi jumlah tandan **unik** per kelas. Vektor fitur oracle 13 dimensi merangkum `naive_sum`, `max_per_side`, `mean_per_side` untuk B1–B4, serta `n_sides`. Struktur ini sama-sama dapat dipakai heuristik maupun ML, sehingga membedakan kemampuan agregasi dari kualitas detector. [1] [3]

| Istilah | Arti untuk audit |
|---|---|
| Appearance | Tandan yang terlihat pada satu citra/sisi; dapat terulang pada sisi lain. |
| Bunch unik | Entitas fisik per pohon yang harus dihitung sekali. |
| GT feature / oracle | Fitur dibentuk dari anotasi benar; mengukur ceiling counting, bukan sistem E2E. |
| E2E | Detektor menghasilkan evidence lalu counter menggunakannya; rawan propagasi galat. |
| GT-fix | Koreksi 48 pohon yang mengubah angka metode; angka pra-fix dipertahankan sebagai riwayat, bukan headline. |

## Track A — Heuristik Deduplikasi Tanpa Training

README memisahkan metode valid dari metode yang tinggi tetapi tidak dapat digeneralisasi. Pasca GT-fix 16 Mei, M01 adalah pemenang Macro Acc ±1 valid (`87,62%`, Macro MAE `0,375`); M07 memberi MAE valid terendah (`0,368`). M53/M60 mencapai `90,24%`, tetapi keduanya menggunakan tabel divisor yang lahir dari statistik train sehingga ditolak oleh aturan validitas. [1] [4]

| Simpul / metode | Gagasan | Macro Acc ±1 | Macro MAE | Status |
|---|---|---:|---:|---|
| HD-001 GeoLinker V5 | Deduplikasi geometri iterasi awal. | 93,86% pra-fix. | — | Riwayat; digantikan GT-fix. |
| HD-002 M01 selector B2–B3 | Selektor pola visibilitas. | 87,62% | 0,375 | Valid / referensi heuristik. |
| HD-003 M05 | Blend visibility divide. | 86,99% | 0,388 | Valid. |
| HD-004 M06 | Bobot visibilitas. | 86,88% | 0,371 | Valid. |
| HD-005 M07 | Bobot coverage. | 86,88% | 0,368 | Valid; MAE terbaik. |
| HD-006 M15 | Divisor global. | 85,94% | 0,391 | Valid; sangat cepat. |
| HD-007 M53/M60 | Divisor/override terkalibrasi train. | 90,24% | 0,302/0,304 | **Tidak valid**. |

Benchmark multi-dimensi menilai lebih dari akurasi: kecepatan, robustness noise koordinat, breakdown DAMIMAS/LONSUM, serta split. Itu penting karena sebuah formula dapat tampak bagus pada rata-rata tetapi rapuh terhadap domain atau penggunaan lapangan. [5]

## Track B — Deteksi YOLO26 Lokal

| Model / kondisi | mAP50 | mAP50-95 | Interpretasi |
|---|---:|---:|---|
| YOLO26n vanilla lokal | 0,521 | 0,237 | Terbaik di commit ini untuk akurasi/kecepatan batch 16. |
| YOLO26s vanilla lokal | 0,506 | 0,235 | Pembanding kecil. |
| YOLO26m vanilla lokal | 0,509 | 0,231 | Lebih besar tidak otomatis lebih tinggi. |
| YOLO26s scratch | 0,511 | 0,231 | Tidak memerlukan COCO pretraining untuk menyamai vanilla pada ablation ini. |
| YOLO26s tanpa augmentasi | 0,465 | 0,216 | Negatif; overfit dan memperlihatkan augmentasi penting. |

Semua konfigurasi lokal yang dirangkum README memakai batch 16, `imgsz=640`, 100 epoch, patience 50, dan seed 42. Perbedaan antara hasil lokal/RunPod dan versi arsitektur harus tidak disatukan sebagai pengujian satu protokol tanpa membaca lognya. [1] [6]

## Track C — Counter ML dengan Fitur Ground Truth

SVM RBF dengan GridSearchCV mencapai Macro Acc ±1 `96,1%` dan Macro MAE `0,318`; Random Forest mencapai `95,3%` dan `0,353`. Angka ini adalah bukti kuat bahwa fitur 13 dimensi membawa sinyal agregasi yang cukup **jika** detections benar. Ia bukan akurasi detector, tidak boleh dibandingkan langsung dengan mAP50, dan bukan hasil E2E. [1] [7]

| Metode | Macro Acc ±1 | Macro MAE | Batas baca |
|---|---:|---:|---|
| SVM RBF / GT | 96,1% | 0,318 | Oracle ML. |
| Random Forest / GT | 95,3% | 0,353 | Oracle ML. |
| M01 heuristik / GT | sekitar 86,7–87,62% tergantung snapshot GT-fix yang dirujuk | — | Oracle heuristik / historis. |

## Track D — Ujung-ke-Ujung Deteksi → Counting

Pada E2E, detector membentuk evidence yang tidak lagi sempurna. Sebanyak 15 kombinasi lima detector dan tiga counter berada pada rentang Macro Acc ±1 kira-kira 64–72%. Paket terbaik yang dicatat adalah YOLO26m→SVM: `71,6%`, Macro MAE `1,118`; keluarga YOLO26n→SVM mencatat `70,0%`. Ini mendukung diagnosis bahwa perubahan counter tidak mengatasi propagasi galat detector ke `naive_sum`, `max_per_side`, dan `mean_per_side`. [1] [8]

| Keluarga E2E | Counter terbaik yang dicatat | Macro Acc ±1 | Catatan |
|---|---|---:|---|
| YOLO26n | SVM | 70,0% | RF 68,2%; M01 67,1%. |
| YOLO26s vanilla | SVM | 68,9% | Scratch 68,9%; no-aug SVM 70,5% walau mAP lebih rendah. |
| YOLO26m | SVM | 71,6% | Hasil E2E terbaik generasi ini. |

> **Pembacaan penting:** mAP lebih tinggi tidak selalu mengubah kualitas counting secara proporsional. Pada commit ini, distribusi galat detector diduga lebih menentukan kualitas vektor 13 dimensi daripada satu angka mAP agregat. Ini adalah hipotesis diagnosis berbasis matriks E2E, bukan hukum umum. [1]

## Audit Ground Truth dan Visibilitas

Repositori menyimpan audit `impossible_visibility`, `same_side_dup`, log perbaikan GT, EDA, dan casebook anomali. Audit itu mendeteksi misalnya tandan yang tampak pada jumlah sisi yang tidak sesuai geometri, wrap-around link, over-link 8-side, dan duplikasi di sisi sama. Karena 48 pohon mengalami cleanup, hasil pra/post-fix harus tidak dicampur. [2] [9]

| Audit | Peran |
|---|---|
| `audit_impossible_visibility` | Mencari pelanggaran jumlah sisi / geometri yang tidak mungkin. |
| `audit_same_side_dup` | Mencari occurrence tandan ganda pada sisi sama. |
| `gt_fix_log` | Mencatat tindakan perbaikan dan tanggalnya. |
| `EDA_report` | Ringkasan distribusi, anomali, dan visualisasi. |
| `full_gt_count` | Ringkasan count GT seluruh pohon/domain/split. |

## Artefak Inspeksi Prioritas

| Keperluan audit | Artefak langsung pada commit `a720f17` |
|---|---|
| Ringkasan track dan hasil | [`README.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/README.md) · [`RESEARCH.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/RESEARCH.md) |
| Akurasi heuristik | [`accuracy_953.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/dedup_brand_new_953/accuracy_953.csv) · [`M01`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M01_selector_b2b3.py) |
| Validitas M53/M60 | [`RULES.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/archive/_to_review/exp_12%20may%202026/RULES.txt) |
| Counter oracle ML | [`SVM metrics`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/counting_svm/metrics.json) · [`RF metrics`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/counting_rf/metrics.json) |
| E2E terbaik | [`YOLO26m→SVM metrics`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/e2e_y26m_vanilla_local_svm/metrics.json) |
| Benchmark multi-dimensi | [`REPORT.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/benchmark_multidim/REPORT.md) |
| Audit GT | [`impossible visibility`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/audit_impossible_visibility/summary.md) · [`same-side`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/audit_same_side_dup/summary.md) · [`GT fix`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/gt_fix_log/summary.md) |
| Dataset turunan | [`Brand-New-Dataset-YOLO README`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/Brand-New-Dataset-YOLO/README.md) · [`split manifest`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/Brand-New-Dataset-YOLO/split_manifest.csv) |

## Keterkaitan dengan Atlas

Atlas memetakan `HD-001` hingga `HD-013`. Dossier ini menambahkan latar dua hal yang tidak boleh hilang ketika node diringkas: terdapat revisi GT yang membuat angka historis tidak otomatis sebanding, dan terdapat perbedaan besar antara **oracle counting** serta **E2E counting**. Jalur ini menerangkan akar baseline publik dan mengapa eksperimen berikutnya fokus meningkatkan evidence detector, bukan hanya mengganti counter.

## Referensi

[1]: https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/README.md "research-method-dedup README pada commit a720f17"
[2]: https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/gt_fix_log/summary.md "Ringkasan perbaikan ground truth"
[3]: https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/build_counting_features.py "Pembentukan fitur counting"
[4]: https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/dedup_brand_new_953/accuracy_953.csv "Akurasi metode deduplikasi"
[5]: https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/benchmark_multidim/REPORT.md "Benchmark multi-dimensi metode deduplikasi"
[6]: https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/SUMMARY.md "Ringkasan baseline deteksi dan E2E"
[7]: https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/counting_svm/metrics.json "Metrik SVM dengan fitur GT"
[8]: https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/e2e_y26m_vanilla_local_svm/metrics.json "Metrik E2E YOLO26m ke SVM"
[9]: https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/audit_impossible_visibility/summary.md "Audit visibilitas tidak mungkin"

<!-- AUTO_CATALOG_START -->
## Lampiran A — Katalog Artefak yang Dapat Diaudit

Lampiran ini digenerasi dari pohon Git pada commit yang dinyatakan di bagian identitas. Setiap tautan file memakai commit tersemat, sehingga isinya tidak bergerak ketika cabang `main` berubah. Katalog sengaja memisahkan narasi, hasil terstruktur, dan kode. Payload anotasi per-gambar tidak direntangkan ribuan baris; ia diringkas sebagai kelompok direktori dan dapat dibuka dari pohon commit.

| Inventaris | Jumlah | Keterangan |
|---|---:|---|
| Seluruh path Git | 10065 | [Buka pohon commit](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/tree/a720f17) |
| Dokumen naratif / log | 49 | Markdown, TXT, atau RST di luar payload anotasi |
| Hasil terstruktur | 4877 | JSON, CSV, Parquet, atau NPZ di luar payload anotasi |
| Kode dan konfigurasi | 67 | Python, shell, YAML, TOML, atau notebook |
| Payload anotasi atau citra dikelompokkan | 4945 | Diwakili direktori agar catalogue tetap dapat dibaca |

### Dokumen Naratif dan Log

- [`AGENTS.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/AGENTS.md)
- [`Brand-New-Dataset-YOLO/README.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/Brand-New-Dataset-YOLO/README.md)
- [`Brand-New-Dataset-YOLO/test.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/Brand-New-Dataset-YOLO/test.txt)
- [`Brand-New-Dataset-YOLO/train.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/Brand-New-Dataset-YOLO/train.txt)
- [`Brand-New-Dataset-YOLO/val.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/Brand-New-Dataset-YOLO/val.txt)
- [`CLAUDE.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/CLAUDE.md)
- [`EDA_report/ANOMALY_CASEBOOK.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/ANOMALY_CASEBOOK.md)
- [`EDA_report/SUMMARY.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/SUMMARY.md)
- [`NAMING.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/NAMING.md)
- [`README.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/README.md)
- [`RESEARCH.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/RESEARCH.md)
- [`ml-track/CLAUDE-TRAINING.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/CLAUDE-TRAINING.md)
- [`ml-track/baseline-run/SUMMARY.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/SUMMARY.md)
- [`ml-track/baseline-run/e2e_inference.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/e2e_inference.txt)
- [`ml-track/baseline-run/e2e_inference_vanilla.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/e2e_inference_vanilla.txt)
- [`ml-track/baseline-run/e2e_rf.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/e2e_rf.txt)
- [`ml-track/baseline-run/e2e_rf_vanilla.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/e2e_rf_vanilla.txt)
- [`ml-track/baseline-run/e2e_svm.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/e2e_svm.txt)
- [`ml-track/baseline-run/e2e_svm_vanilla.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/e2e_svm_vanilla.txt)
- [`ml-track/baseline-run/vanilla_y26m.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/vanilla_y26m.txt)
- [`ml-track/baseline-run/vanilla_y26n.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/vanilla_y26n.txt)
- [`ml-track/baseline-run/vanilla_y26s.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/vanilla_y26s.txt)
- [`ml-track/baseline-run/y26m_vanilla_local_retrain.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/y26m_vanilla_local_retrain.txt)
- [`ml-track/baseline-run/y26n_vanilla_local.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/y26n_vanilla_local.txt)
- [`ml-track/baseline-run/y26n_vanilla_local_b16.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/y26n_vanilla_local_b16.txt)
- [`ml-track/baseline-run/y26s_noaug.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/y26s_noaug.txt)
- [`ml-track/baseline-run/y26s_nopretrained.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/y26s_nopretrained.txt)
- [`ml-track/baseline-run/y26s_vanilla_local.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/y26s_vanilla_local.txt)
- [`report_10Mei2026.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/report_10Mei2026.md)
- [`reports/audit_impossible_visibility/summary.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/audit_impossible_visibility/summary.md)
- [`reports/audit_impossible_visibility/worklist_top10.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/audit_impossible_visibility/worklist_top10.md)
- [`reports/audit_same_side_dup/summary.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/audit_same_side_dup/summary.md)
- [`reports/benchmark_multidim/REPORT.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/benchmark_multidim/REPORT.md)
- [`reports/dedup_research_v5/summary_v5.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/dedup_research_v5/summary_v5.md)
- [`reports/full_gt_count/summary.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/full_gt_count/summary.md)
- [`reports/gt_fix_log/summary.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/gt_fix_log/summary.md)
- [`reports/methods/M06_weight_visibility.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M06_weight_visibility.md)
- [`reports/methods/M10_entropy_divide.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M10_entropy_divide.md)
- [`reports/methods/M11_median_b2.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M11_median_b2.md)
- [`reports/methods/M12_selector_overrides.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M12_selector_overrides.md)
- [`reports/methods/M13_stack_bracket.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M13_stack_bracket.md)
- [`reports/methods/M14_stack_density.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M14_stack_density.md)
- [`reports/methods/M15_divide_global.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M15_divide_global.md)
- [`reports/methods/M16_boost_b2b4.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M16_boost_b2b4.md)
- [`reports/methods/M17_selector_regime.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M17_selector_regime.md)
- [`reports/methods/M19_divide_adaptive.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M19_divide_adaptive.md)
- [`reports/methods/M20_weight_visibility_grid.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/methods/M20_weight_visibility_grid.md)
- [`reports/nonjson_dedup_report.md`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/reports/nonjson_dedup_report.md)
- [`requirements.txt`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/requirements.txt)

### Hasil Terstruktur — JSON, CSV, Parquet, NPZ

- [`Brand-New-Dataset-YOLO/croissant.json`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/Brand-New-Dataset-YOLO/croissant.json)
- [`Brand-New-Dataset-YOLO/data/ground_truth.parquet`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/Brand-New-Dataset-YOLO/data/ground_truth.parquet)
- [`Brand-New-Dataset-YOLO/split_manifest.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/Brand-New-Dataset-YOLO/split_manifest.csv)
- [`EDA_report/tables/annotations.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/annotations.csv)
- [`EDA_report/tables/appearance_gt_tree_sides_cases.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/appearance_gt_tree_sides_cases.csv)
- [`EDA_report/tables/appearances.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/appearances.csv)
- [`EDA_report/tables/bunches.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/bunches.csv)
- [`EDA_report/tables/data_quality_scorecard.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/data_quality_scorecard.csv)
- [`EDA_report/tables/ground_truth_parquet_snapshot.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/ground_truth_parquet_snapshot.csv)
- [`EDA_report/tables/image_meta.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/image_meta.csv)
- [`EDA_report/tables/integrity_side_level.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/integrity_side_level.csv)
- [`EDA_report/tables/link_graph_tree_level.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/link_graph_tree_level.csv)
- [`EDA_report/tables/links.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/links.csv)
- [`EDA_report/tables/mismatches.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/mismatches.csv)
- [`EDA_report/tables/sides.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/sides.csv)
- [`EDA_report/tables/split_manifest_snapshot.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/split_manifest_snapshot.csv)
- [`EDA_report/tables/statistical_drift_tests.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/statistical_drift_tests.csv)
- [`EDA_report/tables/tree_outlier_scores.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/tree_outlier_scores.csv)
- [`EDA_report/tables/trees.csv`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/EDA_report/tables/trees.csv)

| Direktori bervolume tinggi | Jumlah path | Inspeksi manual |
|---|---:|---|
| `ml-track/` | 4770 | [Buka seluruh isi pada commit](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/tree/a720f17/ml-track) |
| `reports/` | 88 | [Buka seluruh isi pada commit](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/tree/a720f17/reports) |

### Kode, Konfigurasi, dan Notebook

- [`Brand-New-Dataset-YOLO/data.yaml`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/Brand-New-Dataset-YOLO/data.yaml)
- [`algorithms/M01_selector_b2b3.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M01_selector_b2b3.py)
- [`algorithms/M02_selector_trifurc.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M02_selector_trifurc.py)
- [`algorithms/M03_blend_geometric.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M03_blend_geometric.py)
- [`algorithms/M04_blend_floor_clamped.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M04_blend_floor_clamped.py)
- [`algorithms/M05_blend_vis_divide.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M05_blend_vis_divide.py)
- [`algorithms/M06_weight_visibility.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M06_weight_visibility.py)
- [`algorithms/M07_weight_coverage.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M07_weight_coverage.py)
- [`algorithms/M08_divide_density_vis.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M08_divide_density_vis.py)
- [`algorithms/M09_median_strong5.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M09_median_strong5.py)
- [`algorithms/M10_entropy_divide.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M10_entropy_divide.py)
- [`algorithms/M11_median_b2.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M11_median_b2.py)
- [`algorithms/M12_selector_overrides.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M12_selector_overrides.py)
- [`algorithms/M13_stack_bracket.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M13_stack_bracket.py)
- [`algorithms/M14_stack_density.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M14_stack_density.py)
- [`algorithms/M15_divide_global.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M15_divide_global.py)
- [`algorithms/M16_boost_b2b4.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M16_boost_b2b4.py)
- [`algorithms/M17_selector_regime.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M17_selector_regime.py)
- [`algorithms/M18_entropy_stack.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M18_entropy_stack.py)
- [`algorithms/M19_divide_adaptive.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M19_divide_adaptive.py)
- [`algorithms/M20_weight_visibility_grid.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M20_weight_visibility_grid.py)
- [`algorithms/M21_ordinal_b3.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M21_ordinal_b3.py)
- [`algorithms/M22_anchor_floor50.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M22_anchor_floor50.py)
- [`algorithms/M23_agree_side.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M23_agree_side.py)
- [`algorithms/M24_weight_class_aware.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M24_weight_class_aware.py)
- [`algorithms/M25_consensus_multi.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M25_consensus_multi.py)
- [`algorithms/M26_median_per_side.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M26_median_per_side.py)
- [`algorithms/M27_weight_visibility_adaptive.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M27_weight_visibility_adaptive.py)
- [`algorithms/M28_baseline_match_strict.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M28_baseline_match_strict.py)
- [`algorithms/M29_baseline_naive_sum.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/M29_baseline_naive_sum.py)
- [`algorithms/__init__.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/algorithms/__init__.py)
- [`ml-track/baseline-run/weights/y26m_vanilla_local_args.yaml`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/weights/y26m_vanilla_local_args.yaml)
- [`ml-track/baseline-run/weights/y26n_vanilla_local_args.yaml`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/weights/y26n_vanilla_local_args.yaml)
- [`ml-track/baseline-run/weights/y26s_noaug_args.yaml`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/weights/y26s_noaug_args.yaml)
- [`ml-track/baseline-run/weights/y26s_nopretrained_args.yaml`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/weights/y26s_nopretrained_args.yaml)
- [`ml-track/baseline-run/weights/y26s_vanilla_local_args.yaml`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/baseline-run/weights/y26s_vanilla_local_args.yaml)
- [`ml-track/local_data.yaml`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/ml-track/local_data.yaml)
- [`scripts/audit_impossible_visibility.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/audit_impossible_visibility.py)
- [`scripts/audit_same_side_dup.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/audit_same_side_dup.py)
- [`scripts/benchmark_multidim.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/benchmark_multidim.py)
- [`scripts/build_counting_features.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/build_counting_features.py)
- [`scripts/count_all_trees.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/count_all_trees.py)
- [`scripts/dedup_all_953.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/dedup_all_953.py)
- [`scripts/dedup_brand_new_953.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/dedup_brand_new_953.py)
- [`scripts/dedup_research_v5.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/dedup_research_v5.py)
- [`scripts/dedup_research_v6.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/dedup_research_v6.py)
- [`scripts/dedup_research_v7.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/dedup_research_v7.py)
- [`scripts/dedup_research_v8.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/dedup_research_v8.py)
- [`scripts/dedup_research_v9.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/dedup_research_v9.py)
- [`scripts/eda_full_dataset.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/eda_full_dataset.py)
- [`scripts/export_gt_parquet.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/export_gt_parquet.py)
- [`scripts/extract_fix_log.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/extract_fix_log.py)
- [`scripts/fix_wrap_around_links.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/fix_wrap_around_links.py)
- [`scripts/generate_anomaly_casebook.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/generate_anomaly_casebook.py)
- [`scripts/generate_method_reports.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/generate_method_reports.py)
- [`scripts/generate_sample_viz.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/generate_sample_viz.py)
- [`scripts/generate_training_summary.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/generate_training_summary.py)
- [`scripts/heal_4side_visibility.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/heal_4side_visibility.py)
- [`scripts/regen_sample_views.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/regen_sample_views.py)
- [`scripts/run_counting_rf.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/run_counting_rf.py)
- [`scripts/run_counting_svm.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/run_counting_svm.py)
- [`scripts/run_e2e_inference.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/run_e2e_inference.py)
- [`scripts/run_e2e_m01.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/run_e2e_m01.py)
- [`scripts/run_e2e_pipeline.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/run_e2e_pipeline.py)
- [`scripts/run_e2e_rf.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/run_e2e_rf.py)
- [`scripts/run_e2e_svm.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/run_e2e_svm.py)
- [`scripts/setup_dataset.py`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/blob/a720f17/scripts/setup_dataset.py)

### Payload Anotasi atau Citra yang Dikelompokkan

| Direktori | Jumlah path | Inspeksi |
|---|---:|---|
| `Brand-New-Dataset-YOLO/json/` | 953 | [Buka direktori](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/tree/a720f17/Brand-New-Dataset-YOLO/json) |
| `Brand-New-Dataset-YOLO/labels/` | 3992 | [Buka direktori](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/tree/a720f17/Brand-New-Dataset-YOLO/labels) |

### Komposisi Ekstensi Pohon Git

| Ekstensi | Jumlah path |
|---|---:|
| `.json` | 5739 |
| `.txt` | 4011 |
| `.csv` | 90 |
| `.jpg` | 61 |
| `.py` | 60 |
| `.png` | 58 |
| `.md` | 30 |
| `.yaml` | 7 |
| `.pt` | 5 |
| `.jsonl` | 1 |
| `.lock` | 1 |
| `.parquet` | 1 |
| `tanpa ekstensi` | 1 |

<!-- AUTO_CATALOG_END -->
