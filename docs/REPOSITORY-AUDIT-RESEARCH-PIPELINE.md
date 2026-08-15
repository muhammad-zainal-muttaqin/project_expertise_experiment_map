# Dossier Audit Repositori — Research-Pipeline

> **Fungsi dokumen.** Dossier ini menjelaskan Volume 1: korpus literatur, eksperimen RGB E-001–E-021, cabang sensor depth E-022–E-032, seri formulasi F, audit, naskah, dan pipeline produksi. Register mempertahankan hasil yang dipalsukan dan dikoreksi agar pembaca tidak mengulang jalur yang sama.

## Identitas dan Batas Audit

| Atribut | Nilai |
|---|---|
| Repositori | [`muhammad-zainal-muttaqin/Research-Pipeline`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline) |
| Commit yang diaudit | [`4aa9ad6`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/tree/4aa9ad6) |
| Peran dalam program riset | Volume 1: literatur, register eksperimen, baseline RGB final, depth-sensor audit, naskah, dan pipeline 4 kanal. |
| Hasil final yang boleh dikutip | RF-DETR-L E-021 pada SawitMVC, mAP50 `0,6038`, mAP50-95 `0,2770`, evaluasi `pycocotools` seragam. |
| Batas utama | E-022 (depth sensor awal) bersifat rekam historis/audit, bukan bukti kenaikan final. |

Repositori ini dengan sengaja memisahkan **hasil final**, **arsip**, **audit**, dan **pekerjaan ditangguhkan**. Pembaca tidak boleh memperlakukan semua skor dalam log sebagai klaim yang setara. E-021 adalah perbandingan empat kelas yang ditetapkan sebagai hasil final; cabang E-022–E-032 menjawab pertanyaan berbeda tentang sensor depth dan memiliki batas auditing sendiri. [1] [2]

## Struktur Bukti

| Lokasi | Isi dan cara menggunakannya |
|---|---|
| `literature/` | Korpus 182 ringkasan, sintesis, protokol pencarian, PDF lokal yang tidak masuk Git, dan matriks bukti. |
| `experiments/` | Register append-only, SR per ide, skrip, hasil JSON, split, log, dan audit E-022. |
| `audit/` | Claim register, evidence matrix, pemeriksaan pra-submisi, dan audit akurasi entri. |
| `manuscript/` | Sumber LaTeX, panduan penulisan, figur, dan keluaran. |
| `pipeline/` | Pipeline produksi YOLO 4-kanal untuk Orbbec Gemini; bukan bukti bahwa fusi depth sudah meningkatkan mAP. |
| `site/` | Pembuat Ruang Baca GitHub Pages; `index.html` adalah keluaran build. |

Literatur dan eksperimen bertemu pada pertanyaan yang operasional: bagaimana mendeteksi tandan empat kelas, kapan informasi RGB-D layak dimasukkan, dan bagaimana klaim dibatasi oleh konfigurasi serta bukti primer. Audit menyediakan matriks bukti dari 182 entri, tetapi kepemilikan data lokal dan PDF harus dibaca melalui dokumentasi karena berkas besar tidak disimpan di Git. [1] [3]

## Data dan Definisi Evaluasi

SawitMVC dicatat sebagai 953 pohon dengan 3.992 citra RGB, empat kelas B1–B4, serta split pohon 716/96/141 untuk pembanding E-021. SawitMVC-Depth berisi 352 pohon, 1.408 citra RGB 1280×800, dan depth Y16 848×480 dalam milimeter dari Orbbec; keduanya adalah jalur data yang berbeda. E-021 menggunakan satu protokol `pycocotools` bagi pembanding, sedangkan cabang depth diperlakukan sebagai penelitian konfigurasi dan replikasi yang tidak boleh langsung digabungkan dengan klaim benchmark RGB. [1] [4]

## Register Seri E — Eksperimen dan Putusan

| ID | Pertanyaan ringkas | Putusan register | Status baca |
|---|---|---|---|
| E-001 | Apakah `class_mismatch` mengukur ambiguitas kematangan? | Dipalsukan. | Arsip. |
| E-002 | Inventaris master mentah Sawit. | Inventaris selesai. | Arsip/data foundation. |
| E-003–E-005 | Apakah DA3 menjaga dan mengaitkan pose video orbit multi-sisi? | Dikonfirmasi untuk geometri/pose. | Arsip. |
| E-006 | Apakah pseudo-depth memisahkan tandan dari latar? | Dipalsukan. | Arsip/negatif. |
| E-007 | Apakah penautan geometri lintas sisi membantu? | Dipalsukan. | Arsip/negatif. |
| E-008 | Nomor tidak digunakan. | Tidak ada run. | Tidak ada klaim. |
| E-009–E-010 | Apakah B4 terutama sulit karena ukuran, kepadatan, atau kontras? | Ukuran/kontras memberi diagnosis; kepadatan dipalsukan. | Arsip/diagnosis. |
| E-011 | Praproses yang membantu B4. | Tekstur dikonfirmasi; penajam kontras dipalsukan. | Arsip. |
| E-012 | Apakah kelas kematangan ordinal? | Dikonfirmasi. | Arsip/diagnosis. |
| E-013 | Kesiapan pipeline produksi 4 kanal. | Pipeline ada, bobot sensor belum mendukung klaim. | Ditangguhkan. |
| E-014 | Hambatan mAP: deteksi atau klasifikasi? | Klasifikasi kematangan menjadi hambatan. | Arsip/diagnosis. |
| E-015 | Pemetaan master mentah → SawitMVC. | 3.992/3.992 terpetakan. | Arsip/data lineage. |
| E-016 | Klaim plafon kematangan. | Ditarik karena bukti cacat. | Audit. |
| E-017 | Detektor dua tahap lebih baik? | Dipalsukan. | Arsip/negatif. |
| E-018 | Apakah sasaran 0,60/0,30 mungkin secara geometri? | Mungkin pada geometri anotasi. | Arsip. |
| E-019 | Resolusi tinggi dan augmentasi aman warna. | Tidak konklusif. | Arsip. |
| E-020 | RT-DETR NMS-free vs baseline. | Dikonfirmasi, kemudian dilampaui. | Arsip. |
| E-021 | RF-DETR-L versus RT-DETR pada setelan identik. | Dikonfirmasi. | **Final**. |
| E-022 | Depth sensor terregistrasi menaikkan mAP? | Fusi awal tidak didukung; klaim kenaikan belum sah. | **Audit**. |
| E-023 | Fusi awal/menengah/akhir. | Nomor menjadi direktori bukti; desain dieksekusi sebagai E-032. | Arsip/alias. |
| E-024 | Inkonsistensi prediksi lintas sisi. | Terukur `19,5%`. | Arsip. |
| E-025 | Selisih evaluator E-022. | Berskala dengan jumlah deteksi. | **Audit**. |
| E-026 | Apakah depth menstabilkan identitas lintas sisi? | Tidak konklusif; denominator berbeda. | Audit. |
| E-027 | Multi-seed early fusion YOLO26n. | Dipalsukan; depth merugikan pada dua dari tiga seed. | Arsip/negatif. |
| E-028 | Lintas-sisi pada dataset enam kali lebih besar. | Dikonfirmasi; B2 paling ambigu. | Arsip. |
| E-029 | Klausa depth pada kapasitas tinggi. | Dicabut. | **Audit**. |
| E-030 | Apakah kapasitas menentukan arah kanal keempat? | Dikonfirmasi sebagian, klaim dipersempit. | Arsip. |
| E-031 | Ketergantungan simpulan pada split. | Varians split nyata; arah Δ lebih stabil. | Arsip. |
| E-032 | Memindah titik fusi membantu? | Tidak konklusif pada rezim diuji; 12/12 CI memuat nol. | Audit. |
| E-033 | Rentang metrik depth terkalibrasi. | Audit mengoreksi rentang kanal depth yang pernah salah. | Audit. |
| E-033b | Replikasi tiga seed E-033. | Efek mAP50 tidak bertahan. | Arsip/negatif. |

Register di atas tidak menyamakan “arsip” dengan “salah”. Beberapa eksperimen arsip memberi diagnosis berharga atau menutup jalur yang tidak layak, sedangkan audit secara eksplisit membatasi angka historis agar tidak menjadi headline yang tidak sah. [2] [5]

## Hasil Final E-021 dan Peran Benchmark RGB

E-021 membandingkan YOLO26l, RT-DETR-L, dan RF-DETR-L pada satu protokol. RF-DETR-L dicatat dengan test mAP50 `0,6038` dan mAP50-95 `0,2770`; angka itu menjadi benchmark pengembangan RGB terbaik pada commit ini, bukan klaim produksi universal dan bukan hasil SawitMVC-Depth. [1] [6]

| Pembanding E-021 | Peran | Angka yang dapat dilacak |
|---|---|---|
| YOLO26l | Baseline YOLO. | Tersedia dalam hasil E-021. |
| RT-DETR-L | Pembanding NMS-free. | Tersedia dalam hasil E-021. |
| RF-DETR-L | Pemenang final pada protokol ini. | mAP50 `0,6038`; mAP50-95 `0,2770`. |

## Cabang Sensor Depth E-022–E-032

Cabang ini memvalidasi parser kalibrasi, reproyeksi depth→RGB, dan pemeriksaan mutu sensor. Hal tersebut menjadikan pipeline data dapat diperiksa, tetapi tidak sama dengan klaim bahwa depth meningkatkan deteksi. Seed-42 E-022 mula-mula menampilkan Δ positif, kemudian audit menemukan masalah pembanding dan matriks multi-seed E-027/E-029 tidak mempertahankan klaim “depth menguntungkan”. E-032 menguji early, middle, late fusion dari nol dan mencatat 12 dari 12 interval kontras yang melintasi nol; “tidak konklusif pada rezim diuji” tidak berarti ekuivalensi antar metode. [2] [5]

| Gerbang | Pertanyaan | Status pada commit |
|---|---|---|
| G0–G1 | Data sensor, kalibrasi, reproyeksi, dan mutu depth. | Ditutup sebagai kesiapan pipeline/data. |
| G2 | Apakah seed tunggal bertahan pada matriks multi-seed? | Tertutup untuk rezim diuji melalui E-027/E-029, bukan universal. |
| G3 | Apakah putusan E-022 selaras dengan audit? | Ditutup; metrik lama tidak digunakan sebagai final. |
| G4/G6 | Apakah middle/late fusion membantu? | Tidak konklusif; CI memuat nol. |

## Seri F — Formulasi dan Gerbang Hemat GPU

Seri F berjalan paralel dengan seri E untuk perubahan formulasi di atas RF-DETR-L. Ia tidak menggantikan benchmark E-021. Gerbang tanpa GPU dipakai untuk memutus jalur yang tidak memiliki sinyal sebelum melanjutkan run mahal. [2] [7]

| ID | Komponen | Putusan / angka |
|---|---|---|
| F-001 | Prasyarat VRAM RF-DETR-L | Didukung; puncak `10.331/20.470 MiB`, sekitar `9,2` menit/epoch. |
| F-002 | Pra-saring frekuensi tinggi vs pelepah | Didukung sebagai mekanisme; DWT-HH Δ B4 `+0,0731`, Laplacian `+0,0721`. |
| F-003 | Plafon lintas-sisi K3 | Negatif; plafon `0,2794 < 0,30`, 72% galat salah di semua sisi. |
| F-004 | Baseline RF-DETR-L tiga seed | Didukung; rerata mAP50 `0,5949`, SD `0,0049`. |
| F-005 | Massa selisih logit ordinal | Didukung sebagai pra-saring; massa `0,7113`, terbesar di B3. |
| F-007 | Cabang frekuensi init-nol | Dihentikan; gate tidak aktif pada 2/12 run, bukan evaluasi lengkap. |

## Artefak Inspeksi Prioritas

| Keperluan audit | Artefak langsung pada commit `4aa9ad6` |
|---|---|
| Pintu masuk eksperimen | [`experiments/README.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/README.md) · [`EKSPERIMEN.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/EKSPERIMEN.md) |
| Metrik final E-021 | [`METRICS.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/METRICS.md) · [`perkelas_pycoco.json`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/results/E-021/perkelas_pycoco.json) |
| Audit depth E-022 | [`AUDIT-E022.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/AUDIT-E022.md) · [`arsip seed-42`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/archive/E022-seed42-awal.md) |
| Fusi E-032 / bukti E-023 | [`README hasil E-023`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/results/E-023/README.md) |
| Reproduksi | [`REPRODUCE.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/code/REPRODUCE.md) · [`PETA-SKRIP.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/code/PETA-SKRIP.md) |
| Audit klaim / data literatur | [`core-claim-register.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/core-claim-register.md) · [`evidence-matrix-182.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/evidence-matrix-182.csv) |
| Seri F | [`SERI-F.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/SERI-F.md) |

## Keterkaitan dengan Atlas

Atlas menyajikan node `RP-E001` hingga `RP-E032` dan node seri F sebagai lapisan historis. Dossier ini harus dibaca bersama label *Final/Arsip/Audit/Ditangguhkan* di sumber asli. Node dapat memakai ringkasan satu kalimat agar peta terbaca; dossier mempertahankan konteks bahwa, misalnya, E-022 bukan hasil akhir dan E-032 bukan bukti ekuivalensi.

## Referensi

[1]: https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/README.md "Research-Pipeline README pada commit 4aa9ad6"
[2]: https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/README.md "Register status eksperimen"
[3]: https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/README.md "Indeks audit dan matriks bukti"
[4]: https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/datasets/README.md "Metadata dataset yang digunakan Research-Pipeline"
[5]: https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/LAPORAN-EKSPERIMEN.md "Laporan eksperimen dan batas klaim"
[6]: https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/METRICS.md "Metrik final E-021"
[7]: https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/experiments/SERI-F.md "Seri F formulasi dan gerbang"

<!-- AUTO_CATALOG_START -->
## Lampiran A — Katalog Artefak yang Dapat Diaudit

Lampiran ini digenerasi dari pohon Git pada commit yang dinyatakan di bagian identitas. Setiap tautan file memakai commit tersemat, sehingga isinya tidak bergerak ketika cabang `main` berubah. Katalog sengaja memisahkan narasi, hasil terstruktur, dan kode. Payload anotasi per-gambar tidak direntangkan ribuan baris; ia diringkas sebagai kelompok direktori dan dapat dibuka dari pohon commit.

| Inventaris | Jumlah | Keterangan |
|---|---:|---|
| Seluruh path Git | 1200 | [Buka pohon commit](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/tree/4aa9ad6) |
| Dokumen naratif / log | 545 | Markdown, TXT, atau RST di luar payload anotasi |
| Hasil terstruktur | 246 | JSON, CSV, Parquet, atau NPZ di luar payload anotasi |
| Kode dan konfigurasi | 191 | Python, shell, YAML, TOML, atau notebook |
| Payload anotasi atau citra dikelompokkan | 0 | Diwakili direktori agar catalogue tetap dapat dibaca |

### Dokumen Naratif dan Log

- [`CLAUDE.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/CLAUDE.md)
- [`README.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/README.md)
- [`audit/AUDIT-PRA-SUBMISI.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/AUDIT-PRA-SUBMISI.md)
- [`audit/README.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/README.md)
- [`audit/claim-audit-182.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/claim-audit-182.md)
- [`audit/core-claim-register.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/core-claim-register.md)
- [`audit/dosen-revision-status-2026-08-10.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/dosen-revision-status-2026-08-10.md)
- [`audit/entri-accuracy-check.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/entri-accuracy-check.md)
- [`audit/evidence-matrix-182.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/evidence-matrix-182.md)
- [`audit/evidence-matrix-v2.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/evidence-matrix-v2.md)
- [`datasets/README.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/datasets/README.md)
- [`docs-readme-old.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/docs-readme-old.md)
- [`legacy/README.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/legacy/README.md)
- [`manuscript/README.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/README.md)
- [`manuscript/figures/C01-distribusi-tahun.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/C01-distribusi-tahun.md)
- [`manuscript/figures/C02-distribusi-tema.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/C02-distribusi-tema.md)
- [`manuscript/figures/F01-taksonomi.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/F01-taksonomi.md)
- [`manuscript/figures/F02-timeline-yolo.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/F02-timeline-yolo.md)
- [`manuscript/figures/F03-silsilah-rgb.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/F03-silsilah-rgb.md)
- [`manuscript/figures/F04-strategi-fusi.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/F04-strategi-fusi.md)
- [`manuscript/figures/F05-pola-yolorgbd.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/F05-pola-yolorgbd.md)
- [`manuscript/figures/F06-atensi-lintasmodal.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/F06-atensi-lintasmodal.md)
- [`manuscript/figures/F07-funnel-sawit.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/F07-funnel-sawit.md)
- [`manuscript/figures/F08-pipeline-sawit.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/F08-pipeline-sawit.md)
- [`manuscript/figures/THEME.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/THEME.md)
- [`manuscript/figures/panduan-generate-gambar.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/figures/panduan-generate-gambar.md)
- [`manuscript/guides/PANDUAN-PENULISAN.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/guides/PANDUAN-PENULISAN.md)
- [`manuscript/guides/PLAN-SITUS.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/guides/PLAN-SITUS.md)
- [`manuscript/guides/PLAN-TINJAUAN-PUSTAKA.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/guides/PLAN-TINJAUAN-PUSTAKA.md)
- [`manuscript/guides/REFRAME-DECISIONS.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/guides/REFRAME-DECISIONS.md)
- [`manuscript/guides/figure-english-labels.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/guides/figure-english-labels.md)
- [`manuscript/output/papers/revision-main/CEA_review_conventions_report.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/output/papers/revision-main/CEA_review_conventions_report.md)
- [`manuscript/output/papers/revision-main/Chat.txt`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/output/papers/revision-main/Chat.txt)
- [`manuscript/source/RINGKASAN-MAIN5V2.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/source/RINGKASAN-MAIN5V2.md)
- [`pipeline/README.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/pipeline/README.md)
- [`site/README.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/site/README.md)
- [`tools/README.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/README.md)
- [`tools/presentation/README.md`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/presentation/README.md)

| Direktori bervolume tinggi | Jumlah path | Inspeksi manual |
|---|---:|---|
| `experiments/` | 110 | [Buka seluruh isi pada commit](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/tree/4aa9ad6/experiments) |
| `literature/` | 397 | [Buka seluruh isi pada commit](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/tree/4aa9ad6/literature) |

### Hasil Terstruktur — JSON, CSV, Parquet, NPZ

- [`audit/evidence-matrix-182.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/evidence-matrix-182.csv)
- [`audit/evidence-matrix-v2.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/audit/evidence-matrix-v2.csv)
- [`literature/references/revisi-dosen-2026-07-23/review_features.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/references/revisi-dosen-2026-07-23/review_features.csv)
- [`literature/search-data/openalex-counts.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search-data/openalex-counts.csv)
- [`literature/search-data/raw/known-item-test_2026-07-23.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search-data/raw/known-item-test_2026-07-23.csv)
- [`literature/search-data/raw/openalex_Q1_2026-07-23.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search-data/raw/openalex_Q1_2026-07-23.csv)
- [`literature/search-data/raw/openalex_Q2_2026-07-23.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search-data/raw/openalex_Q2_2026-07-23.csv)
- [`literature/search-data/raw/openalex_Q3_2026-07-23.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search-data/raw/openalex_Q3_2026-07-23.csv)
- [`literature/search-data/raw/openalex_Q4_2026-07-23.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search-data/raw/openalex_Q4_2026-07-23.csv)
- [`literature/search-data/raw/openalex_Q5_2026-07-23.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search-data/raw/openalex_Q5_2026-07-23.csv)
- [`literature/search-data/raw/openalex_Q6_2026-07-23.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search-data/raw/openalex_Q6_2026-07-23.csv)
- [`literature/search-data/raw/openalex_Q7_2026-07-23.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search-data/raw/openalex_Q7_2026-07-23.csv)
- [`literature/search/derived/abstract-screening-2026-08-10.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/abstract-screening-2026-08-10.csv)
- [`literature/search/derived/abstract-screening-summary-2026-08-10.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/abstract-screening-summary-2026-08-10.csv)
- [`literature/search/derived/dedup-audit-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/dedup-audit-2026-08-09.csv)
- [`literature/search/derived/dedup-resolution-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/dedup-resolution-2026-08-09.csv)
- [`literature/search/derived/dedup-resolution-review-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/dedup-resolution-review-2026-08-09.csv)
- [`literature/search/derived/fulltext-review-ledger-2026-08-10.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/fulltext-review-ledger-2026-08-10.csv)
- [`literature/search/derived/local-fulltext-audit-2026-08-10.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/local-fulltext-audit-2026-08-10.csv)
- [`literature/search/derived/local-fulltext-summary-2026-08-10.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/local-fulltext-summary-2026-08-10.csv)
- [`literature/search/derived/manual-dedup-review-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/manual-dedup-review-2026-08-09.csv)
- [`literature/search/derived/manual-dedup-review-resolved-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/manual-dedup-review-resolved-2026-08-09.csv)
- [`literature/search/derived/master-screening-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/master-screening-2026-08-09.csv)
- [`literature/search/derived/master-screening-exact-key-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/master-screening-exact-key-2026-08-09.csv)
- [`literature/search/derived/master-screening-pre-abstract-2026-08-10.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/master-screening-pre-abstract-2026-08-10.csv)
- [`literature/search/derived/master-screening-pre-title-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/master-screening-pre-title-2026-08-09.csv)
- [`literature/search/derived/master-screening-resolved-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/master-screening-resolved-2026-08-09.csv)
- [`literature/search/derived/priority-ranking-2026-08-10.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/priority-ranking-2026-08-10.csv)
- [`literature/search/derived/priority-review-wave1-2026-08-10.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/priority-review-wave1-2026-08-10.csv)
- [`literature/search/derived/priority-selection-summary-2026-08-10.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/priority-selection-summary-2026-08-10.csv)
- [`literature/search/derived/priority-shortlist-2026-08-10.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/priority-shortlist-2026-08-10.csv)
- [`literature/search/derived/title-screening-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/title-screening-2026-08-09.csv)
- [`literature/search/derived/title-screening-summary-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/derived/title-screening-summary-2026-08-09.csv)
- [`literature/search/prisma-counts-exact-key-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/prisma-counts-exact-key-2026-08-09.csv)
- [`literature/search/prisma-counts.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/prisma-counts.csv)
- [`literature/search/raw/scopus_Q1_2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/raw/scopus_Q1_2026-08-09.csv)
- [`literature/search/raw/scopus_Q2_2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/raw/scopus_Q2_2026-08-09.csv)
- [`literature/search/raw/scopus_Q3_2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/raw/scopus_Q3_2026-08-09.csv)
- [`literature/search/raw/scopus_Q4_2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/raw/scopus_Q4_2026-08-09.csv)
- [`literature/search/raw/scopus_Q5_2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/raw/scopus_Q5_2026-08-09.csv)
- [`literature/search/raw/scopus_Q6_2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/raw/scopus_Q6_2026-08-09.csv)
- [`literature/search/raw/scopus_Q7_2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/raw/scopus_Q7_2026-08-09.csv)
- [`literature/search/scopus-counts-2026-08-09.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/literature/search/scopus-counts-2026-08-09.csv)
- [`manuscript/output/papers/revision-main/review_features.csv`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/manuscript/output/papers/revision-main/review_features.csv)

| Direktori bervolume tinggi | Jumlah path | Inspeksi manual |
|---|---:|---|
| `experiments/` | 202 | [Buka seluruh isi pada commit](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/tree/4aa9ad6/experiments) |

### Kode, Konfigurasi, dan Notebook

- [`_config.yml`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/_config.yml)
- [`pipeline/fourch.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/pipeline/fourch.py)
- [`pipeline/infer_4ch.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/pipeline/infer_4ch.py)
- [`pipeline/prepare_depth.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/pipeline/prepare_depth.py)
- [`pipeline/train_4ch.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/pipeline/train_4ch.py)
- [`tools/audit_local_fulltext.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/audit_local_fulltext.py)
- [`tools/build_abstract_screening.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/build_abstract_screening.py)
- [`tools/build_dedup_review_report.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/build_dedup_review_report.py)
- [`tools/build_evidence_matrix.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/build_evidence_matrix.py)
- [`tools/build_literature_priority_shortlist.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/build_literature_priority_shortlist.py)
- [`tools/build_literature_screening_master.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/build_literature_screening_master.py)
- [`tools/build_main3_manuscript.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/build_main3_manuscript.py)
- [`tools/build_synthesis_table.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/build_synthesis_table.py)
- [`tools/build_title_screening.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/build_title_screening.py)
- [`tools/initialize_fulltext_review_ledger.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/initialize_fulltext_review_ledger.py)
- [`tools/openalex_search.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/openalex_search.py)
- [`tools/presentation/build_charts.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/presentation/build_charts.py)
- [`tools/presentation/build_deck.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/presentation/build_deck.py)
- [`tools/presentation/build_panel.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/presentation/build_panel.py)
- [`tools/presentation/chart_rgb.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/presentation/chart_rgb.py)
- [`tools/presentation/verify_deck.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/presentation/verify_deck.py)
- [`tools/resolve_literature_dedup.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/resolve_literature_dedup.py)
- [`tools/retrieve_fulltext_candidate.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/retrieve_fulltext_candidate.py)
- [`tools/update_fulltext_review.py`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/blob/4aa9ad6/tools/update_fulltext_review.py)

| Direktori bervolume tinggi | Jumlah path | Inspeksi manual |
|---|---:|---|
| `experiments/` | 167 | [Buka seluruh isi pada commit](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/tree/4aa9ad6/experiments) |

### Payload Anotasi atau Citra yang Dikelompokkan

Tidak ada payload anotasi atau citra yang perlu dikelompokkan.

### Komposisi Ekstensi Pohon Git

| Ekstensi | Jumlah path |
|---|---:|
| `.md` | 472 |
| `.json` | 133 |
| `.csv` | 108 |
| `.py` | 93 |
| `.txt` | 73 |
| `.yaml` | 69 |
| `.png` | 67 |
| `.sha256` | 54 |
| `.pdf` | 52 |
| `.sh` | 28 |
| `.tex` | 22 |
| `.jpg` | 8 |
| `.html` | 5 |
| `.npz` | 5 |
| `.pptx` | 3 |
| `.bib` | 2 |
| `.js` | 2 |
| `.ndjson` | 2 |
| `.yml` | 1 |
| `tanpa ekstensi` | 1 |

<!-- AUTO_CATALOG_END -->
