# Dossier Audit Repositori — Baseline-SawitMVC

> **Fungsi dokumen.** Dossier ini menjelaskan baseline publik SawitMVC-YOLO: apa yang dihitung, mengapa penjumlahan multi-view naif tidak sah, bagaimana deteksi YOLO diubah menjadi fitur per pohon, dan bagaimana membedakan oracle ground-truth dari kinerja ujung-ke-ujung.

## Identitas dan Batas Audit

| Atribut | Nilai |
|---|---|
| Repositori | [`ULM-SawitMVC/Baseline-SawitMVC`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC) |
| Commit yang diaudit | [`ee2f0ac`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/tree/ee2f0ac) |
| Peran dalam program riset | Baseline publik multi-view, prediksi cache YOLO, counter Ridge, ground truth, split, dan evaluasi reproducible. |
| Unit evaluasi akhir | Pohon, bukan citra tunggal. |
| Split kanonik | 716 train / 96 validation / 141 test pohon. |
| Baseline end-to-end utama | YOLO26m `y26mv2` → fitur `F_all` 67-dim → Ridge. |

Repositori ini mendefinisikan masalah counting dengan hati-hati: satu tandan fisik dapat muncul pada beberapa sisi foto pohon yang sama. Karena itu, jumlah appearance bukan jumlah tandan unik. Capaian counter berbasis GT merupakan oracle yang mengisolasi problem aggregation; ia tidak boleh dilabeli sebagai akurasi sistem detektor ujung-ke-ujung. [1] [2]

## Dataset, Kelas, dan Split

| Item | Nilai |
|---|---|
| Pohon | 953 dari DAMIMAS dan LONSUM. |
| Citra | 3.992 citra dari 4 atau 8 sisi per pohon. |
| Tandan unik | 9.823 bunch dengan identitas fisik. |
| Kelas | B1 merah besar/rendah; B2 transisi; B3 hitam berduri; B4 kecil gelap/tinggi. |
| Split | Train 716, validation 96, test 141. |
| GT test | B1 117, B2 257, B3 742, B4 281; total 1.397. |

Berkas `ground_truth/split_manifest.csv` memegang field `new_split` yang dipakai sebagai protokol kanonik. Identitas bunch memungkinkan audit apakah sebuah object muncul dalam satu atau beberapa view, sehingga masalah duplikasi dapat dihitung secara langsung. [1] [3]

## Mengapa Counting Multi-view Sulit

Penjumlahan semua appearance melaporkan jumlah observasi, bukan identitas fisik. README baseline mencatat overcount kira-kira 83% atau 1,83× dari tandan unik. Pada evaluasi GT test, simpul atlas `HB-001` mencatat Class ±1 `50,00%`, Tree ±1 `6,38%`, dan Macro MAE `2,142` untuk penjumlahan naif. Ini adalah fondasi yang menjelaskan mengapa sistem membutuhkan counter tree-level, bukan sekadar detektor per citra. [1] [4]

## Pipeline Baseline

Pipeline utama mempunyai empat tahap: YOLO dijalankan pada seluruh citra sebuah pohon, semua deteksi digabung per pohon, deteksi diringkas sebagai vektor fitur, lalu counter memprediksi jumlah B1–B4. Detektor yang dilaporkan adalah YOLO26m (`y26mv2`), dilatih 60 epoch pada `imgsz=640`, batch 32, patience 60, seed 42. Validasi detector menunjukkan mAP50 gabungan `0,521`; B1 paling kuat (`0,746`) dan B4 paling lemah (`0,363`, recall `0,389`). [1] [5]

| Komponen | F0 | F_all | Arti audit |
|---|---:|---:|---|
| Dimensi | 13 | 67 | F_all memperkaya ringkasan, bukan mengganti detector. |
| Isi inti | `naive_sum`, `max_per_side`, `mean_per_side`, `n_sides` per kelas | F0 + confidence, distribusi view, posisi vertikal, area box, proporsi kelas | Menjelaskan mengapa counter mungkin membedakan bukti deteksi yang mirip secara jumlah. |
| Counter headline | ElasticNet pada F0 untuk perbandingan terkendali | Ridge pada F_all untuk baseline praktis | Kedua ranking tidak boleh dicampur karena feature set berbeda. |

## Hasil Oracle: Apa yang Dapat Dicapai Jika Deteksi Benar

| Simpul atlas | Metode | Status interpretasi | Class ±1 | Tree ±1 | Macro MAE |
|---|---|---|---:|---:|---:|
| HB-001 | Jumlah semua appearance | Negatif: overcount. | 50,00% | 6,38% | 2,142 |
| HB-002 | Koreksi konstanta M15 berbasis GT | Oracle heuristik. | 95,39% | 85,11% | 0,376 |
| HB-003 | Koreksi pola visibilitas M01 berbasis GT | Oracle heuristik. | 95,92% | 87,23% | 0,340 |
| HB-004 | ElasticNet F0 berbasis GT | Oracle ML terbaik pada README baseline. | 98,05% | 92,20% | 0,277 |

Oracle ini tidak membuktikan sistem kamera dapat menghitung dengan akurasi tersebut. Ia membuktikan bahwa, bila evidence deteksi sempurna diberikan, agregasi multi-view per pohon dapat diselesaikan sangat baik. Gap besar terhadap sistem YOLO+counter menunjukkan bottleneck terutama muncul sebelum tahap regresi count. [1] [4]

## Hasil End-to-End dan Matriks Counter Terkontrol

Baseline praktis yang ditetapkan repositori adalah Ridge + `F_all`: Class ±1 `77,48%`, Tree ±1 `32,62%`, dan Macro MAE `1,036` pada 141 pohon test. Pada matriks `train_only` dengan F0 yang sama untuk semua model, ElasticNet memimpin (`76,42%`, Tree ±1 `29,79%`, MAE `1,043`). Pada F_all yang sama, Ridge memimpin (`77,48%`). Artinya, model terbaik harus selalu disebut bersama feature set dan strategi training-nya; “lebih banyak fitur” membantu Ridge/RF tetapi tidak universal bagi LR, SVM, atau ElasticNet. [1] [6]

| Kelompok evaluasi | Pertanyaan | Putusan yang dapat dipakai |
|---|---|---|
| F0 terkendali | Jika semua counter melihat fitur yang sama, mana terbaik? | ElasticNet memimpin. |
| F_all terkendali | Jika semua counter melihat 67 fitur yang sama, mana terbaik? | Ridge memimpin. |
| Train+validation | Apakah menambah validation mengganti headline train-only? | Tidak melampaui Ridge F_all train-only (`76,60%` vs `77,48%`). |
| Counter lebih kompleks (HB-008) | Apakah fleksibilitas tambahan otomatis memberi manfaat? | Negatif: Ridge full v4 `76,24%`, stacking `76,06%`, dan XGB-Optuna `74,11%` tidak melampaui Ridge F_all. |
| Rilis baseline praktis (HB-009) | Manakah paket detector→counter yang menjadi pembanding resmi? | YOLO26m → Ridge F_all; Class ±1 `77,48%`, Tree ±1 `32,62%`, Macro MAE `1,036`. |

## Implementasi dan Reproduksi

| Lokasi | Peran |
|---|---|
| `ground_truth/` | Manifest split, skema anotasi pohon, taxonomi kelas, provenance. |
| `predictions/y26mv2_per_tree/` | Deteksi YOLO cache per pohon untuk mereproduksi Track B tanpa rerun inferensi. |
| `models/yolo/y26mv2.pt` | Bobot detector baseline. |
| `models/counters/` | Artefak counter tersimpan dan instruksi evaluasi ulang. |
| `pipeline/` | Skrip aktif untuk baseline, termasuk fitur dan Track C. |
| `benchmarks/` | Perintah evaluasi dan guard headline-claim. |
| `results/experiments/` | Matriks hasil CSV terkontrol. |

README secara eksplisit mengingatkan bahwa referensi literatur di dalamnya masih placeholder dan harus diganti dengan literatur terverifikasi sebelum naskah disubmit. Dossier ini hanya melaporkan apa yang ada pada commit; ia tidak mengubah placeholder menjadi klaim bibliografis. [1]

## Artefak Inspeksi Prioritas

| Keperluan audit | Artefak langsung pada commit `ee2f0ac` |
|---|---|
| Ringkasan metode dan hasil | [`README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/README.md) |
| Split dan ground truth | [`split_manifest.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/ground_truth/split_manifest.csv) · [`ground_truth/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/ground_truth/README.md) |
| Matriks counter | [`counting_controlled_results.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/experiments/counting_controlled_results.csv) |
| Heuristik / oracle | [`accuracy_full.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/heuristics_953/accuracy_full.csv) · [`algorithms/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/algorithms/README.md) |
| Prediksi cache | [`predictions/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/predictions/README.md) |
| Benchmark reproduce | [`benchmarks/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/benchmarks/README.md) |

## Keterkaitan dengan Atlas

Atlas menampilkan `HB-001` hingga `HB-009` sebagai baseline publik dan menghubungkannya ke jalur deduplikasi serta replikasi Volume 2. Untuk menjaga pembacaan yang sah, simpul HB oracle selalu perlu dibaca sebagai *ground-truth feature upper bound*; `HB-005`/`HB-006` adalah matriks yang membedakan F0 dan F_all; `HB-007`–`HB-008` adalah pemeriksaan negatif; dan `HB-009` adalah baseline end-to-end resmi yang dibandingkan oleh eksperimen counting berikutnya.

## Referensi

[1]: https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/README.md "Baseline-SawitMVC README pada commit ee2f0ac"
[2]: https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/ground_truth/README.md "Skema ground truth dan split"
[3]: https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/ground_truth/split_manifest.csv "Manifest split pohon"
[4]: https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/heuristics_953/accuracy_full.csv "Hasil heuristic/oracle counting"
[5]: https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/models/README.md "Detektor baseline dan reproduksi"
[6]: https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/experiments/counting_controlled_results.csv "Matriks counter terkendali"

<!-- AUTO_CATALOG_START -->
## Lampiran A — Katalog Artefak yang Dapat Diaudit

Lampiran ini digenerasi dari pohon Git pada commit yang dinyatakan di bagian identitas. Setiap tautan file memakai commit tersemat, sehingga isinya tidak bergerak ketika cabang `main` berubah. Katalog sengaja memisahkan narasi, hasil terstruktur, dan kode. Payload anotasi per-gambar tidak direntangkan ribuan baris; ia diringkas sebagai kelompok direktori dan dapat dibuka dari pohon commit.

| Inventaris | Jumlah | Keterangan |
|---|---:|---|
| Seluruh path Git | 16982 | [Buka pohon commit](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/tree/ee2f0ac) |
| Dokumen naratif / log | 31 | Markdown, TXT, atau RST di luar payload anotasi |
| Hasil terstruktur | 16848 | JSON, CSV, Parquet, atau NPZ di luar payload anotasi |
| Kode dan konfigurasi | 30 | Python, shell, YAML, TOML, atau notebook |
| Payload anotasi atau citra dikelompokkan | 0 | Diwakili direktori agar catalogue tetap dapat dibaca |

### Dokumen Naratif dan Log

- [`.github/ISSUE_TEMPLATE/bug_report.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/.github/ISSUE_TEMPLATE/bug_report.md)
- [`.github/ISSUE_TEMPLATE/new_algorithm.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/.github/ISSUE_TEMPLATE/new_algorithm.md)
- [`.github/PULL_REQUEST_TEMPLATE.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/.github/PULL_REQUEST_TEMPLATE.md)
- [`AGENTS.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/AGENTS.md)
- [`CHANGELOG.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/CHANGELOG.md)
- [`CLAUDE.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/CLAUDE.md)
- [`CONTRIBUTING.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/CONTRIBUTING.md)
- [`DRAFT.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/DRAFT.md)
- [`README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/README.md)
- [`_docx_text.txt`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/_docx_text.txt)
- [`algorithms/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/algorithms/README.md)
- [`archive/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/archive/README.md)
- [`archive/docs/e2e_pipeline_legacy.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/archive/docs/e2e_pipeline_legacy.md)
- [`archive/models/yolo/train_logs/y26m_train_log.txt`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/archive/models/yolo/train_logs/y26m_train_log.txt)
- [`archive/models/yolo/train_logs/y26n_train_log.txt`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/archive/models/yolo/train_logs/y26n_train_log.txt)
- [`archive/models/yolo/train_logs/y26s_train_log.txt`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/archive/models/yolo/train_logs/y26s_train_log.txt)
- [`benchmarks/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/benchmarks/README.md)
- [`docs/algorithms.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/docs/algorithms.md)
- [`docs/dataset.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/docs/dataset.md)
- [`docs/e2e_pipeline.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/docs/e2e_pipeline.md)
- [`docs/evaluation.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/docs/evaluation.md)
- [`docs/findings.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/docs/findings.md)
- [`docs/training.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/docs/training.md)
- [`figures/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/figures/README.md)
- [`ground_truth/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/ground_truth/README.md)
- [`models/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/models/README.md)
- [`models/counters/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/models/counters/README.md)
- [`models/yolo/train_logs/y26m_e60_p60_b32_s42_v2.txt`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/models/yolo/train_logs/y26m_e60_p60_b32_s42_v2.txt)
- [`pipeline/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/pipeline/README.md)
- [`predictions/README.md`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/predictions/README.md)
- [`requirements.txt`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/requirements.txt)

### Hasil Terstruktur — JSON, CSV, Parquet, NPZ

- [`results/e2e_per_tree/y26mv2_lr/metrics.json`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_per_tree/y26mv2_lr/metrics.json)
- [`results/e2e_per_tree/y26mv2_lr/predictions.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_per_tree/y26mv2_lr/predictions.csv)
- [`results/e2e_per_tree/y26mv2_m01/metrics.json`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_per_tree/y26mv2_m01/metrics.json)
- [`results/e2e_per_tree/y26mv2_m01/predictions.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_per_tree/y26mv2_m01/predictions.csv)
- [`results/e2e_per_tree/y26mv2_rf/feature_importance.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_per_tree/y26mv2_rf/feature_importance.csv)
- [`results/e2e_per_tree/y26mv2_rf/metrics.json`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_per_tree/y26mv2_rf/metrics.json)
- [`results/e2e_per_tree/y26mv2_rf/predictions.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_per_tree/y26mv2_rf/predictions.csv)
- [`results/e2e_per_tree/y26mv2_svm/metrics.json`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_per_tree/y26mv2_svm/metrics.json)
- [`results/e2e_per_tree/y26mv2_svm/predictions.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_per_tree/y26mv2_svm/predictions.csv)
- [`results/e2e_upper_bound/gt_elasticnet/coefficients.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_elasticnet/coefficients.csv)
- [`results/e2e_upper_bound/gt_elasticnet/metrics.json`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_elasticnet/metrics.json)
- [`results/e2e_upper_bound/gt_elasticnet/predictions.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_elasticnet/predictions.csv)
- [`results/e2e_upper_bound/gt_lr/coefficients.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_lr/coefficients.csv)
- [`results/e2e_upper_bound/gt_lr/metrics.json`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_lr/metrics.json)
- [`results/e2e_upper_bound/gt_lr/predictions.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_lr/predictions.csv)
- [`results/e2e_upper_bound/gt_rf/feature_importance.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_rf/feature_importance.csv)
- [`results/e2e_upper_bound/gt_rf/metrics.json`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_rf/metrics.json)
- [`results/e2e_upper_bound/gt_rf/predictions.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_rf/predictions.csv)
- [`results/e2e_upper_bound/gt_ridge/coefficients.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_ridge/coefficients.csv)
- [`results/e2e_upper_bound/gt_ridge/metrics.json`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_ridge/metrics.json)
- [`results/e2e_upper_bound/gt_ridge/predictions.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_ridge/predictions.csv)
- [`results/e2e_upper_bound/gt_svm/metrics.json`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_svm/metrics.json)
- [`results/e2e_upper_bound/gt_svm/predictions.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/e2e_upper_bound/gt_svm/predictions.csv)
- [`results/experiments/best_metrics.json`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/experiments/best_metrics.json)
- [`results/experiments/best_predictions.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/experiments/best_predictions.csv)
- [`results/experiments/counting_controlled_results.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/experiments/counting_controlled_results.csv)
- [`results/experiments/counting_v2_results.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/experiments/counting_v2_results.csv)
- [`results/experiments/counting_v3_results.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/experiments/counting_v3_results.csv)
- [`results/experiments/counting_v4_results.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/experiments/counting_v4_results.csv)
- [`results/heuristics_953/accuracy_full.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/heuristics_953/accuracy_full.csv)
- [`results/heuristics_953/mean_per_tree.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/heuristics_953/mean_per_tree.csv)
- [`results/heuristics_953/per_tree.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/heuristics_953/per_tree.csv)
- [`results/heuristics_953/totals.csv`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/results/heuristics_953/totals.csv)

| Direktori bervolume tinggi | Jumlah path | Inspeksi manual |
|---|---:|---|
| `archive/` | 14908 | [Buka seluruh isi pada commit](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/tree/ee2f0ac/archive) |
| `ground_truth/` | 954 | [Buka seluruh isi pada commit](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/tree/ee2f0ac/ground_truth) |
| `predictions/` | 953 | [Buka seluruh isi pada commit](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/tree/ee2f0ac/predictions) |

### Kode, Konfigurasi, dan Notebook

- [`algorithms/M01_selector_b2b3.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/algorithms/M01_selector_b2b3.py)
- [`algorithms/M02_selector_trifurc.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/algorithms/M02_selector_trifurc.py)
- [`algorithms/M03_blend_geometric.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/algorithms/M03_blend_geometric.py)
- [`algorithms/M04_blend_floor_clamped.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/algorithms/M04_blend_floor_clamped.py)
- [`algorithms/M05_blend_vis_divide.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/algorithms/M05_blend_vis_divide.py)
- [`algorithms/__init__.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/algorithms/__init__.py)
- [`archive/pipeline/run_e2e_per_image.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/archive/pipeline/run_e2e_per_image.py)
- [`archive/scripts/reproduce_e2e_per_image.sh`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/archive/scripts/reproduce_e2e_per_image.sh)
- [`benchmarks/check_release_claims.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/benchmarks/check_release_claims.py)
- [`benchmarks/run_benchmark.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/benchmarks/run_benchmark.py)
- [`experiments/exp_counting_controlled.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/experiments/exp_counting_controlled.py)
- [`experiments/exp_counting_v2.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/experiments/exp_counting_v2.py)
- [`experiments/exp_counting_v3.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/experiments/exp_counting_v3.py)
- [`experiments/exp_counting_v4.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/experiments/exp_counting_v4.py)
- [`ground_truth/data.yaml`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/ground_truth/data.yaml)
- [`pipeline/build_counting_features.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/pipeline/build_counting_features.py)
- [`pipeline/run_counting_lr.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/pipeline/run_counting_lr.py)
- [`pipeline/run_counting_regularized.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/pipeline/run_counting_regularized.py)
- [`pipeline/run_counting_rf.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/pipeline/run_counting_rf.py)
- [`pipeline/run_counting_svm.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/pipeline/run_counting_svm.py)
- [`pipeline/run_e2e_inference.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/pipeline/run_e2e_inference.py)
- [`pipeline/run_e2e_pipeline.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/pipeline/run_e2e_pipeline.py)
- [`scripts/compute_global_k.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/scripts/compute_global_k.py)
- [`scripts/export_fig1_crops.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/scripts/export_fig1_crops.py)
- [`scripts/generate_paper_figures.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/scripts/generate_paper_figures.py)
- [`scripts/report_metrics.py`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/scripts/report_metrics.py)
- [`scripts/reproduce_all.sh`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/scripts/reproduce_all.sh)
- [`scripts/reproduce_e2e_per_tree.sh`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/scripts/reproduce_e2e_per_tree.sh)
- [`scripts/reproduce_heuristics.sh`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/scripts/reproduce_heuristics.sh)
- [`scripts/reproduce_upper_bound.sh`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/blob/ee2f0ac/scripts/reproduce_upper_bound.sh)

### Payload Anotasi atau Citra yang Dikelompokkan

Tidak ada payload anotasi atau citra yang perlu dikelompokkan.

### Komposisi Ekstensi Pohon Git

| Ekstensi | Jumlah path |
|---|---:|
| `.json` | 16784 |
| `.csv` | 64 |
| `.png` | 39 |
| `.md` | 25 |
| `.py` | 24 |
| `.pdf` | 8 |
| `.txt` | 6 |
| `.pt` | 5 |
| `.sh` | 5 |
| `.tex` | 4 |
| `tanpa ekstensi` | 4 |
| `.bib` | 3 |
| `.pkl` | 3 |
| `.bst` | 2 |
| `.cls` | 2 |
| `.zip` | 2 |
| `.gz` | 1 |
| `.yaml` | 1 |
<!-- AUTO_CATALOG_END -->
