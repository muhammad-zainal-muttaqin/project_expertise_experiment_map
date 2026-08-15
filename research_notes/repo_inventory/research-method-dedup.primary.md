

===== README.md =====

# Penghitungan Tandan Sawit Multi-Sisi

Pipeline ini menghitung jumlah tandan unik per pohon kelapa sawit dari foto yang diambil dari 4–8 sisi berbeda.

- **Dataset:** 953 pohon (DAMIMAS 854 + LONSUM 99)
- **Kelas:** B1 → B2 → B3 → B4 (ordinal, matang → belum matang)
- **Lisensi:** CC BY-NC 4.0

---

## Ringkasan Hasil Terbaik

### Juara Per Track

| Track | Metode | Macro MAE | Macro Acc ±1 | Keterangan |
|:---|:---|---:|---:|:---|
| A. Heuristik | [M01_selector_b2b3](algorithms/M01_selector_b2b3.py) | [0.375](reports/dedup_brand_new_953/accuracy_953.csv) | [**87.62%**](reports/dedup_brand_new_953/accuracy_953.csv) | ✅ Produksi (valid per [RULES.txt](archive/_to_review/exp_12%20may%202026/RULES.txt)) — post GT-fix 2026-05-16 |
| B. Deteksi | [YOLO26n (lokal)](ml-track/baseline-run/weights/y26n_vanilla_local_args.yaml) | — | mAP50 = [**0.521**](ml-track/baseline-run/weights/y26n_vanilla_local_results.csv) | ✅ Detektor terbaik lokal |
| C. ML Counting (fitur GT) | [SVM RBF](reports/counting_svm/metrics.json) | [**0.318**](reports/counting_svm/metrics.json) | [**96.1%**](reports/counting_svm/metrics.json) | ✅ ML terbaik dengan fitur sempurna |
| D. End-to-End | [y26m → SVM](reports/e2e_y26m_vanilla_local_svm/metrics.json) | [1.118](reports/e2e_y26m_vanilla_local_svm/metrics.json) | [**71.6%**](reports/e2e_y26m_vanilla_local_svm/metrics.json) | ⚠️ Terbaik E2E, masih di bawah heuristik |

### Metrik Terbaik Keseluruhan

| Metrik | Nilai | Metode |
|:---|---:|:---|
| Macro Acc ±1 tertinggi — ML (fitur GT) | [**96.1%**](reports/counting_svm/metrics.json) | [SVM RBF](reports/counting_svm/metrics.json) |
| Macro Acc ±1 tertinggi — heuristik valid | [**87.62%**](reports/dedup_brand_new_953/accuracy_953.csv) | [M01_selector_b2b3](algorithms/M01_selector_b2b3.py) |
| Macro Acc ±1 tertinggi — end-to-end | [**71.6%**](reports/e2e_y26m_vanilla_local_svm/metrics.json) | [y26m → SVM](reports/e2e_y26m_vanilla_local_svm/metrics.json) |
| Macro MAE terendah — ML (fitur GT) | [**0.318**](reports/counting_svm/metrics.json) | [SVM RBF](reports/counting_svm/metrics.json) |
| Macro MAE terendah — heuristik valid | [**0.368**](reports/dedup_brand_new_953/accuracy_953.csv) | [M07_weight_coverage](algorithms/M07_weight_coverage.py) |
| mAP50 terbaik (lokal, batch=16) | [**0.521**](ml-track/baseline-run/weights/y26n_vanilla_local_results.csv) | [YOLO26n](ml-track/baseline-run/weights/y26n_vanilla_local_args.yaml) |
| Tercepat | **0.005 ms/pohon** | M15_divide_global |

### Temuan Utama

Pipeline ML dengan fitur GT (Track C) mengungguli heuristik terbaik M01: SVM mencapai Macro Acc±1 = [**96.1%**](reports/counting_svm/metrics.json) dibandingkan [**86.67%**](reports/dedup_brand_new_953/accuracy_953.csv) milik M01, sehingga desain fitur 13-dim terbukti memadai apabila detektor menghasilkan deteksi yang benar.

Namun, pipeline ujung-ke-ujung (Track D) hanya mencapai Macro Acc±1 = [**71.6%**](reports/e2e_y26m_vanilla_local_svm/metrics.json) pada kombinasi terbaik (y26m → SVM), karena propagasi galat detektor YOLO merusak nilai `naive_sum`, `max_per_side`, dan `mean_per_side` sebelum masuk ke algoritma penghitung — sehingga model menerima input yang tidak akurat.

Temuan penting: seluruh [15 kombinasi E2E](ml-track/baseline-run/SUMMARY.md) (5 detektor × 3 algoritma penghitung) menghasilkan Macro Acc±1 dalam rentang **64–72%**, tanpa perbedaan signifikan antar algoritma penghitung. Hal ini membuktikan bahwa bottleneck terletak pada kualitas detektor, bukan pada algoritma penghitungan.

> ❌ M60 dan M53 mencapai 90.24%, tetapi keduanya **tidak valid** per [`archive/_to_review/exp_12 may 2026/RULES.txt`](archive/_to_review/exp_12%20may%202026/RULES.txt) karena menggunakan tabel divisor yang diturunkan dari statistik training split (kalibrasi domain-spesifik), bukan dari prinsip geometri murni, sehingga tidak dapat digeneralisasi ke kebun lain.

---

## Track A: Penghitungan Heuristik (Tanpa Training)

Metode heuristik bekerja langsung pada deteksi bounding box per sisi tanpa memerlukan proses pelatihan apa pun.

Tabel post GT-fix 2026-05-16 (semua metode naik ~0.8–1.6 pp setelah cleanup 48 trees GT — 8 wrap-around + 9 8-side over-link + 31 4-side auto-heal):

| Peringkat | Metode | Macro Acc ±1 | Macro MAE | Profil Tepat | Valid? |
|:---:|:---|---:|---:|---:|:---:|
| — | M60_blind_strict | 90.24% | 0.302 | — | ❌ |
| — | M53_three_band_override | 90.24% | 0.304 | — | ❌ |
| 1 | [**M01_selector_b2b3**](algorithms/M01_selector_b2b3.py) | [**87.62%**](reports/dedup_brand_new_953/accuracy_953.csv) | [0.375](reports/dedup_brand_new_953/accuracy_953.csv) | 27.1% | ✅ |
| 2 | M05_blend_vis_divide | 86.99% | 0.388 | 26.0% | ✅ |
| 3 | M06_weight_visibility | 86.88% | 0.371 | 26.0% | ✅ |
| 4 | [M07_weight_coverage](algorithms/M07_weight_coverage.py) | 86.88% | [**0.368**](reports/dedup_brand_new_953/accuracy_953.csv) | 26.6% | ✅ |
| 5 | M15_divide_global | 85.94% | 0.391 | 23.5% | ✅ |

Tabel lengkap 29 metode tersedia di [`reports/dedup_brand_new_953/accuracy_953.csv`](reports/dedup_brand_new_953/accuracy_953.csv).

> ❌ M60 dan M53 dinyatakan tidak valid per [`archive/_to_review/exp_12 may 2026/RULES.txt`](archive/_to_review/exp_12%20may%202026/RULES.txt) karena keduanya menggunakan tabel divisor yang diturunkan dari statistik training split. Kedua metode tersebut disimpan hanya sebagai referensi historis.

```bash
python scripts/dedup_brand_new_953.py
```

---

## Track B: Deteksi Objek (YOLO26)

Seluruh eksperimen deteksi dijalankan secara lokal dengan konfigurasi yang konsisten: `batch=16`, `imgsz=640`, `epochs=100`, `patience=50`, `seed=42`.

### Perbandingan Arsitektur

| Model | mAP50 | mAP50-95 | Kecepatan | Parameter | Bukti |
|:---|---:|---:|---:|---:|:---|
| [**YOLO26n**](ml-track/baseline-run/weights/y26n_vanilla_local_args.yaml) | [**0.521**](ml-track/baseline-run/weights/y26n_vanilla_local_results.csv) | **0.237** | **0.2 ms** | 2.4 M | [log](ml-track/baseline-run/y26n_vanilla_local_b16.txt) · [cm](ml-track/baseline-run/weights/y26n_vanilla_local/confusion_matrix_normalized.png) |
| [YOLO26s](ml-track/baseline-run/weights/y26s_vanilla_local_args.yaml) | [0.506](ml-track/baseline-run/weights/y26s_vanilla_local_results.csv) | 0.235 | 0.5 ms | 9.5 M | [log](ml-track/baseline-run/y26s_vanilla_local.txt) · [cm](ml-track/baseline-run/weights/y26s_vanilla_local/confusion_matrix_normalized.png) |
| [YOLO26m](ml-track/baseline-run/weights/y26m_vanilla_local_args.yaml) | [0.509](ml-track/baseline-run/weights/y26m_vanilla_local_results.csv) | 0.231 | 0.8 ms | 20.4 M | [log](ml-track/baseline-run/y26m_vanilla_local_retrain.txt) · [cm](ml-track/baseline-run/weights/y26m_vanilla_local/confusion_matrix_normalized.png) |

### Ablasi Konfigurasi (YOLO26s sebagai basis)

| Eksperimen | Best Epoch | mAP50 | mAP50-95 | Catatan |
|:---|---:|---:|---:|:---|
| [y26m vanilla (lokal)](ml-track/baseline-run/weights/y26m_vanilla_local_args.yaml) | [33](ml-track/baseline-run/weights/y26m_vanilla_local_results.csv) | [0.509](ml-track/baseline-run/weights/y26m_vanilla_local_results.csv) | 0.231 | [log](ml-track/baseline-run/y26m_vanilla_local_retrain.txt) · [cm](ml-track/baseline-run/weights/y26m_vanilla_local/confusion_matrix_normalized.png) · Gap kecil dari RunPod (0.528) karena perbedaan environment |
| [y26s vanilla (lokal)](ml-track/baseline-run/weights/y26s_vanilla_local_args.yaml) | [21](ml-track/baseline-run/weights/y26s_vanilla_local_results.csv) | [0.506](ml-track/baseline-run/weights/y26s_vanilla_local_results.csv) | 0.234 | [log](ml-track/baseline-run/y26s_vanilla_local.txt) · [cm](ml-track/baseline-run/weights/y26s_vanilla_local/confusion_matrix_normalized.png) · Digunakan sebagai baseline E2E |
| [y26s tanpa pretrained](ml-track/baseline-run/weights/y26s_nopretrained_args.yaml) | [57](ml-track/baseline-run/weights/y26s_nopretrained_results.csv) | [**0.511**](ml-track/baseline-run/weights/y26s_nopretrained_results.csv) | 0.231 | [log](ml-track/baseline-run/y26s_nopretrained.txt) · [cm](ml-track/baseline-run/weights/y26s_nopretrained/confusion_matrix_normalized.png) · Scratch = pretrained; COCO pretraining tidak wajib |
| [y26s tanpa augmentasi](ml-track/baseline-run/weights/y26s_noaug_args.yaml) | [6](ml-track/baseline-run/weights/y26s_noaug_results.csv) | [0.465](ml-track/baseline-run/weights/y26s_noaug_results.csv) | 0.216 | [log](ml-track/baseline-run/y26s_noaug.txt) · [cm](ml-track/baseline-run/weights/y26s_noaug/confusion_matrix_normalized.png) · Overfit, early stop pada epoch 56 |

**Insight:** [YOLO26n](ml-track/baseline-run/weights/y26n_vanilla_local_args.yaml) menjadi pilihan terbaik untuk produksi — mAP50 tertinggi ([0.521](ml-track/baseline-run/weights/y26n_vanilla_local_results.csv)) dengan kecepatan 4× lebih cepat dari y26m (0.2 ms vs 0.8 ms). Augmentasi bersifat esensial: tanpa augmentasi, mAP50 turun ke [0.465](ml-track/baseline-run/weights/y26s_noaug_results.csv) dan model overfit pada epoch ke-6.

```bash
python -c "
from ultralytics import YOLO
YOLO('yolo26n.pt').train(data='ml-track/local_data.yaml', epochs=100, batch=16, imgsz=640, seed=42)
"
```

---

## Track C: Penghitungan ML (Fitur dari GT)

Setiap pohon direpresentasikan sebagai vektor fitur 13 dimensi: `naive_sum` (B1–B4), `max_per_side` (B1–B4), `mean_per_side` (B1–B4), dan `n_sides`. Fitur diekstrak dari anotasi GT yang sempurna sebagai batas atas performa ML.

| Model | Macro MAE | Macro Acc ±1 | Acc±1 B1 | Acc±1 B2 | Acc±1 B3 | Acc±1 B4 | Profil Tepat |
|:---|---:|---:|---:|---:|---:|---:|---:|
| [**SVM (RBF, GridSearchCV)**](reports/counting_svm/metrics.json) | [**0.318**](reports/counting_svm/metrics.json) | [**96.1%**](reports/counting_svm/metrics.json) | **100.0%** | 95.8% | 91.6% | 96.8% | 27.4% |
| [RF (n=200, max_depth=10)](reports/counting_rf/metrics.json) | [0.353](reports/counting_rf/metrics.json) | [95.3%](reports/counting_rf/metrics.json) | 96.8% | 96.8% | 90.5% | 96.8% | 27.4% |

SVM ([96.1%](reports/counting_svm/metrics.json)) mengungguli heuristik terbaik M01 ([86.67%](reports/dedup_brand_new_953/accuracy_953.csv)), yang membuktikan bahwa desain fitur 13-dim sudah memadai apabila input berupa deteksi yang sempurna. Detail tersedia di [`reports/counting_svm/metrics.json`](reports/counting_svm/metrics.json) dan [`reports/counting_rf/metrics.json`](reports/counting_rf/metrics.json).

```bash
python scripts/run_counting_svm.py
python scripts/run_counting_rf.py
```

---

## Track D: Pipeline Ujung-ke-Ujung (Deteksi → Penghitungan)

Setiap detektor diuji dengan tiga algoritma penghitungan: SVM (RBF, GridSearchCV), RF (n=200, max_depth=10), dan M01 heuristik. Inferensi dijalankan pada seluruh 953 pohon; SVM dan RF dilatih ulang menggunakan fitur dari masing-masing detektor. Seluruh angka dilaporkan pada test set (n=95).

| Detektor | mAP50 | Penghitung | Macro MAE | Macro Acc ±1 | Acc±1 B1 | Acc±1 B2 | Acc±1 B3 | Acc±1 B4 | Profil Tepat |
|:---|---:|:---|---:|---:|---:|---:|---:|---:|---:|
| [y26n vanilla](reports/e2e_y26n_vanilla_local_svm/metrics.json) | 0.521 | SVM | 1.145 | 70.0% | 90.5% | 68.4% | 56.8% | 64.2% | 0.0% |
| [y26n vanilla](reports/e2e_y26n_vanilla_local_rf/metrics.json) | 0.521 | RF | 1.218 | 68.2% | 90.5% | 68.4% | 54.7% | 58.9% | 0.0% |
| [y26n vanilla](reports/e2e_y26n_vanilla_local_m01/metrics.json) | 0.521 | M01 | 1.337 | 67.1% | 87.4% | 65.3% | 51.6% | 64.2% | 2.1% |
| [y26s vanilla](reports/e2e_y26s_vanilla_local_svm/metrics.json) | 0.506 | SVM | 1.163 | 68.9% | 93.7% | 68.4% | 48.4% | 65.3% | 0.0% |
| [y26s vanilla](reports/e2e_y26s_vanilla_local_rf/metrics.json) | 0.506 | RF | 1.216 | 66.6% | 96.8% | 68.4% | 48.4% | 52.6% | 1.1% |
| [y26s vanilla](reports/e2e_y26s_vanilla_local_m01/metrics.json) | 0.506 | M01 | 1.403 | 65.5% | 89.5% | 66.3% | 38.9% | 67.4% | 2.1% |
| [y26s scratch](reports/e2e_y26s_nopretrained_svm/metrics.json) | 0.511 | SVM | 1.145 | 68.9% | 90.5% | 68.4% | 51.6% | 65.3% | 2.1% |
| [y26s scratch](reports/e2e_y26s_nopretrained_rf/metrics.json) | 0.511 | RF | 1.229 | 67.9% | 93.7% | 65.3% | 55.8% | 56.8% | 1.1% |
| [y26s scratch](reports/e2e_y26s_nopretrained_m01/metrics.json) | 0.511 | M01 | 1.266 | 69.2% | 91.6% | 63.2% | 52.6% | 69.5% | 2.1% |
| [y26s no-aug](reports/e2e_y26s_noaug_svm/metrics.json) | 0.465 | SVM | 1.126 | 70.5% | 91.6% | 69.5% | 56.8% | 64.2% | 1.1% |
| [y26s no-aug](reports/e2e_y26s_noaug_rf/metrics.json) | 0.465 | RF | 1.184 | 68.4% | 92.6% | 66.3% | 55.8% | 58.9% | 1.1% |
| [y26s no-aug](reports/e2e_y26s_noaug_m01/metrics.json) | 0.465 | M01 | 1.384 | 66.6% | 90.5% | 68.4% | 43.2% | 64.2% | 0.0% |
| [**y26m vanilla**](reports/e2e_y26m_vanilla_local_svm/metrics.json) | 0.509 | [**SVM**](reports/e2e_y26m_vanilla_local_svm/metrics.json) | [**1.118**](reports/e2e_y26m_vanilla_local_svm/metrics.json) | [**71.6%**](reports/e2e_y26m_vanilla_local_svm/metrics.json) | 92.6% | 63.2% | 60.0% | 70.5% | 2.1% |
| [y26m vanilla](reports/e2e_y26m_vanilla_local_rf/metrics.json) | 0.509 | RF | 1.211 | 67.9% | 95.8% | 68.4% | 49.5% | 57.9% | 0.0% |
| [y26m vanilla](reports/e2e_y26m_vanilla_local_m01/metrics.json) | 0.509 | M01 | 1.400 | 64.5% | 90.5% | 56.8% | 40.0% | 70.5% | 0.0% |
| [**M01 heuristik (fitur GT — target)**](reports/dedup_brand_new_953/accuracy_953.csv) | — | — | [**0.398**](reports/dedup_brand_new_953/accuracy_953.csv) | [**86.7%**](reports/dedup_brand_new_953/accuracy_953.csv) | — | — | — | — | 26.3% |

**Bottleneck:** Seluruh [15 kombinasi](ml-track/baseline-run/SUMMARY.md) detektor × penghitung menghasilkan Macro Acc±1 dalam rentang sempit **64–72%**, jauh di bawah M01 berbasis GT ([86.7%](reports/dedup_brand_new_953/accuracy_953.csv)). Pilihan algoritma penghitung (SVM, RF, atau M01) tidak mengubah kesimpulan secara signifikan — bottleneck sejati adalah propagasi galat YOLO ke nilai `naive_sum`, `max_per_side`, dan `mean_per_side`. Sebagai pembanding, SVM dengan fitur GT mencapai [96.1%](reports/counting_svm/metrics.json) (Track C) menggunakan arsitektur fitur yang identik.

**Temuan tak terduga:** y26s-noaug (mAP50=[0.465](ml-track/baseline-run/weights/y26s_noaug_results.csv), detektor terlemah) menghasilkan [SVM 70.5%](reports/e2e_y26s_noaug_svm/metrics.json), hanya 1.1 pp di bawah y26m (mAP50=[0.509](ml-track/baseline-run/weights/y26m_vanilla_local_results.csv), [SVM 71.6%](reports/e2e_y26m_vanilla_local_svm/metrics.json)). Hal ini mengindikasikan bahwa distribusi galat detektor — bukan besarnya mAP — yang menentukan kualitas fitur 13-dim untuk penghitungan.

```bash
# Jalankan pipeline E2E untuk satu detektor (inferensi + SVM + RF + M01):
python scripts/run_e2e_pipeline.py \
    --name y26m_vanilla_local \
    --weights ml-track/baseline-run/weights/y26m_vanilla_local.pt
```

---

## Kesimpulan

| Kasus Penggunaan | Rekomendasi |
|:---|:---|
| Penghitungan produksi | [**M01_selector_b2b3**](algorithms/M01_selector_b2b3.py) — Macro Acc±1 = [86.67%](reports/dedup_brand_new_953/accuracy_953.csv), valid per [RULES.txt](archive/_to_review/exp_12%20may%202026/RULES.txt) |
| Deteksi saja (akurasi) | [**YOLO26m**](ml-track/baseline-run/weights/y26m_vanilla_local_args.yaml) — mAP50 = [0.509](ml-track/baseline-run/weights/y26m_vanilla_local_results.csv) |
| Deteksi saja (kecepatan) | [**YOLO26n**](ml-track/baseline-run/weights/y26n_vanilla_local_args.yaml) — mAP50 = [0.521](ml-track/baseline-run/weights/y26n_vanilla_local_results.csv), 0.2 ms/gambar |
| Baseline riset ML | [**SVM pada fitur GT**](reports/counting_svm/metrics.json) — Macro Acc±1 = [96.1%](reports/counting_svm/metrics.json), Macro MAE = [0.318](reports/counting_svm/metrics.json) |
| Pipeline E2E terbaik | [**y26m → SVM**](reports/e2e_y26m_vanilla_local_svm/metrics.json) — Macro Acc±1 = [71.6%](reports/e2e_y26m_vanilla_local_svm/metrics.json), masih 15 pp di bawah heuristik |

---

## Validasi Ground Truth

GT JSON di `Brand-New-Dataset-YOLO/json/` harus memenuhi dua invariant struktural:

1. **Same-side uniqueness** — satu bunch tidak boleh muncul ≥ 2× di `side_index` yang sama (kamera satu sisi maksimal lihat bunch sekali). Detector: [`scripts/audit_same_side_dup.py`](scripts/audit_same_side_dup.py).
2. **Geometric adjacency (visibility cone)** — bunch hanya bisa terlihat dari sisi yg adjacent dgn home (rule update 2026-05-16 setelah validasi visual RA):
   - **4-sisi:** max distance = 1 (≤ 3 sisi visible). Mustahil di sisi opposite (distance 2).
     Contoh: home=`side_1` → visible {`side_4`, `side_1`, `side_2`}; mustahil `side_3`.
   - **8-sisi:** max distance = 3 (≤ 6 sisi visible — bunch besar/prominent). Mustahil ≥ 7 sisi.
     Normal: 5 sisi (distance ≤ 2). Edge case bunch besar: 6 sisi (distance ≤ 3).

   Detector: [`scripts/audit_impossible_visibility.py`](scripts/audit_impossible_visibility.py).

**Status audit (2026-05-16):**

| Audit | Trees affected | Bunches affected | Status |
|:---|---:|---:|:---|
| Same-side dup | 8 | 18 | ✅ FIXED (8 wrap-around trees per laporan RA) |
| Geometric violation (4-sisi 4/4) | 31 | 42 | ✅ AUTO-HEALED via [`scripts/heal_4side_visibility.py`](scripts/heal_4side_visibility.py) |
| Geometric violation (8-sisi) | 9 | 14 | ✅ CLEARED (4 manual fix + rule relaxation 2026-05-16) |
| Geometric warning | 469 | 802 | ℹ️ borderline (full visibility reach, accepted) |

**Status final:** 0 GT violations across all checks. Net +~62 unique bunches across ~48 trees. Backups: `archive/json_pre_wrap_fix_2026-05-15/`, `archive/json_pre_visibility_fix_2026-05-16/`, `archive/json_pre_visibility_heal_4side_2026-05-16/`.

Wrap-around fix detail (8 trees): backup di `archive/json_pre_wrap_fix_2026-05-15/`, runner di [`scripts/fix_wrap_around_links.py`](scripts/fix_wrap_around_links.py).

```bash
python scripts/audit_same_side_dup.py
python scripts/audit_impossible_visibility.py
```

---

## Reproduksi di Device Baru

Repo ini tracked **10.004 file** termasuk labels, JSON GT, split files, weights `.pt`, dan inference predictions. Yang **tidak** tracked: `Brand-New-Dataset-YOLO/images/` (~2.3 GB, distribusi via HuggingFace).

**Track heuristik (M01..M29) — zero download:**
```bash
git clone <repo>
pip install -r requirements.txt
python scripts/dedup_brand_new_953.py    # M01 86.67% Macro Acc±1
```
Cukup `labels/` + `json/` (sudah ter-track). Tidak butuh images.

**Track E2E ML (inferensi YOLO + counting RF/SVM) — butuh images:**
```bash
git clone <repo>
pip install -r requirements.txt
pip install huggingface_hub ultralytics scikit-learn

python scripts/setup_dataset.py          # idempotent: skip kalau images sudah ada
python scripts/run_e2e_pipeline.py --name y26m_vanilla_local \
    --weights ml-track/baseline-run/weights/y26m_vanilla_local.pt
```

---

## Panduan Cepat

```bash
# 1. Instalasi dependensi
pip install -r requirements.txt
pip install scikit-learn ultralytics huggingface_hub

# 2. Unduh dataset images dari HuggingFace (idempotent)
python scripts/setup_dataset.py

# 3. Jalankan semua track
python scripts/dedup_brand_new_953.py    # Track A: heuristik
python scripts/run_counting_svm.py       # Track C: SVM dari fitur GT
python scripts/run_counting_rf.py        # Track C: RF dari fitur GT

# Track B: training detektor
python -c "from ultralytics import YOLO; YOLO('yolo26n.pt').train(
    data='ml-track/local_data.yaml', epochs=100, batch=16, imgsz=640, seed=42,
    project='/workspace/runs/detect', name='y26n_vanilla_local')"

# Track D: pipeline E2E (inferensi + SVM + RF + M01 sekaligus)
python scripts/run_e2e_pipeline.py \
    --name y26n_vanilla_local \
    --weights ml-track/baseline-run/weights/y26n_vanilla_local.pt
```

---

## Tautan

- [`RESEARCH.md`](RESEARCH.md) — Dokumen riset lengkap
- [`archive/_to_review/exp_12 may 2026/REPORT.md`](archive/_to_review/exp_12%20may%202026/REPORT.md) — Analisis mendalam M60 (diarsipkan 2026-05-14)
- [`ml-track/baseline-run/SUMMARY.md`](ml-track/baseline-run/SUMMARY.md) — Ringkasan hasil ML (matriks E2E lengkap 15 kombinasi)
- [`ml-track/CLAUDE-TRAINING.md`](ml-track/CLAUDE-TRAINING.md) — Panduan eksperimen ML di RunPod/Vast.ai
- [`archive/_to_review/exp_13 May 2026/PROGRESS.md`](archive/_to_review/exp_13%20May%202026/PROGRESS.md) — Log progres training (diarsipkan 2026-05-14)
- [Dataset HuggingFace](https://huggingface.co/datasets/ULM-DS-Lab/SawitMVC)

---

## Sitasi

```bibtex
@dataset{palm_bunch_2026,
  title   = {Multi-View Oil Palm Bunch Dataset},
  author  = {Muttaqin, M. Zainal},
  year    = {2026},
  publisher = {HuggingFace},
  url     = {https://huggingface.co/datasets/ULM-DS-Lab/SawitMVC}
}
```

Lisensi: **CC BY-NC 4.0**


===== RESEARCH.md =====

# Research: Multi-View Oil Palm Fruit Detection & Classification
**Dataset: DAMIMAS | Ditulis: 2026-04-23 | Revisi terakhir: 2026-05-13**

---

## RINGKASAN HASIL AKHIR (2026-05-13) — Baca Ini Dulu

> Section 1–26 di bawah merupakan dokumentasi historis eksperimen. Hasil final dan angka terkini ada di sini.

### Empat Track Penelitian

| Track | Metode Terbaik | Macro Acc ±1 | Keterangan |
|:---|:---|---:|:---|
| A. Heuristik | M01_selector_b2b3 | **86.67%** | Produksi, valid per RULES.txt |
| B. Deteksi | YOLO26n lokal | mAP50 = **0.521** | batch=16, konsisten |
| C. ML Counting (fitur GT) | SVM RBF | **96.1%** | Batas atas; input deteksi sempurna |
| D. End-to-End terbaik | y26m → SVM | **71.6%** | Semua 15 kombinasi: 64–72% |

### Temuan Kunci

1. **SVM dengan fitur GT (96.1%) mengungguli M01 heuristik (86.7%)** — membuktikan bahwa desain fitur 13-dim sudah memadai apabila detektor tidak menghasilkan FP/FN.
2. **Bottleneck E2E ada di detektor, bukan algoritma penghitung** — SVM, RF, dan M01 semua menghasilkan 64–72% dengan input YOLO yang sama; perbedaan antar algoritma tidak signifikan.
3. **mAP tidak berbanding lurus dengan performa E2E** — y26s-noaug (mAP50=0.465) menghasilkan E2E SVM 70.5%, hampir sama dengan y26m (mAP50=0.509, E2E SVM 71.6%).
4. **COCO pretraining tidak wajib** — y26s dari scratch (0.511) ≈ y26s pretrained (0.506).
5. **M60 dan M53 tidak valid** per `archive/_to_review/exp_12 may 2026/RULES.txt` — menggunakan tabel divisor berbasis GT; disimpan hanya sebagai referensi historis.

### Referensi Cepat

- Hasil lengkap heuristik: `reports/dedup_brand_new_953/accuracy_953.csv`
- Hasil ML: `reports/counting_svm/`, `reports/counting_rf/`
- Hasil E2E: `reports/e2e_{name}_{method}/metrics.json`
- Bobot model: `ml-track/baseline-run/weights/*.pt`
- Panduan replikasi: `README.md`, `ml-track/CLAUDE-TRAINING.md`

---

## 0. REVISI — Status & Reframe (BACA DULU)

> Dokumen ini awalnya ditulis greenfield (asumsi proyek baru). Faktanya proyek sudah punya banyak eksperimen sebelumnya yang mendokumentasikan plateau. Section 1–26 di bawah dipertahankan sebagai infra reference & dokumentasi konseptual, **tetapi banyak yang sudah tertutup secara empiris**. Section 0 ini override segala konflik.

### 0.1 Source of Truth Sekarang

Kalau ada konflik antara Section 1–26 dan dokumen di bawah → **ikuti dokumen ini**, bukan Section 1–26:

- `CONTEXT.md` (workspace)
- Ledger eksperimen aktif: `C:/Users/Zainal/Desktop/autoresearch/results.tsv`, `C:/Users/Zainal/Desktop/bbc-autoresearch-v1/experiments/results.tsv`
- Laporan formal E0: `C:/Users/Zainal/Desktop/bbc-autoresearch-v1/LAPORAN_EKSPERIMEN.md`
- Audit dataset: `D:/Work/Assisten Dosen/YOLOBench/analysis_dataset_640/...`

### 0.2 Baseline Aktif yang Harus Dilampaui

| Rejim | Run | mAP50-95 | Catatan |
|---|---|---:|---|
| Standard val | **AR29** YOLO11l 640 b16 | **0.264** | Active fair baseline |
| Upper-bound (train+test, bukan fair) | **AR34** YOLO11l 80 ep 640 b16 | **0.269** | Bukan benchmark fair |
| E0 final | `p3_final_yolo11s_s42` | 0.265 | Verdict: **INSUFFICIENT** |
| Single-class stage-1 (bukti detector mampu) | – | **0.390** | Task 1-kelas, bukan solusi 4-kelas |

Plateau seluruh rejim 4-kelas modern: **0.24–0.27 mAP50-95**.

> **Decision metric utama: `mAP50-95`.** Bukan `mAP@0.5` (Section 8.1 lama harus dibaca dengan ini in mind).

### 0.2a Algorithmic-Only Constraint (CRITICAL)

> **Project Direction: 100% Algorithmic/Heuristic — No Training Allowed**

This research project **explicitly rejects** learned approaches for the deduplication task. All methods must be:

| Allowed | Not Allowed |
|---------|-------------|
| Handcrafted geometric rules | Neural network training |
| Statistical corrections (closed-form) | Learned embeddings (Siamese, etc.) |
| Graph algorithms (Hungarian, MST) | Gradient-based optimization |
| Camera geometry / 3D triangulation | MLP on bbox features |
| Combinatorial optimization | Model-dependent features (YOLO neck) |

**Rationale:**
- Only 228 labeled trees — too small for reliable learned matcher
- Heuristic methods achieve 92% ceiling with zero overfitting risk
- Algorithmic methods are interpretable, deterministic, and portable
- Breaking 92% requires better geometric modeling, not more parameters

**Verification requirement:** Any proposed method must satisfy:
- ✅ No gradient computation
- ✅ No parameter learning from data
- ✅ Handcrafted rules or closed-form formulas only
- ✅ Deterministic (same input → same output)

### 0.3 Bottleneck Struktural (Empirically Confirmed)

1. **B2/B3 ambiguity** — linear probe precision B2=0.394, B3=0.420; E0 confusion B2→B3 ≈34%. Hipotesis kuat: **label-ceiling**, bukan optimization.
2. **B4 small-object** — median rel_area 0.0072 (paling kecil); B4→background ≈42% di E0.
3. **Domain imbalance** — DAMIMAS ~90% image / ~94% instance; LONSUM minoritas (B1 LONSUM hanya 17 instance).
4. **Bbox quality** pada slice tersulit — audit shortlist: 3 DROP + 9 high-priority + 21 review.

### 0.4 Mapping Kelas Canonical (override Section 1.2 lama)

Dari `CONTEXT.md Section 1.7`:

| Kelas | Visual | Posisi | Kematangan |
|---|---|---|---|
| **B1** | Merah, besar, bulat | **Paling bawah** | **Paling matang** |
| **B2** | Mostly hitam, transisi ke merah, besar bulat | Atas B1 | Hampir matang |
| **B3** | Full hitam, masih berduri, lonjong | Atas B2 | Mengkal |
| **B4** | Paling kecil, paling dalam di tandan, berduri, hitam→hijau | **Paling atas** | **Paling belum matang** |

(Konsisten dengan Section 1.2 lama — tapi tegaskan ulang: urutan biologis `B1 → B4` = matang → belum matang.)

### 0.5 Section yang SUDAH TERTUTUP (Jangan Re-run tanpa Angle Struktural Baru)

| Section lama | Konten | Status faktual |
|---|---|---|
| Section 4.1 Section 4.2 Section 4.3 | Class weights, focal loss, naive oversampling B1/B4 | **CLOSED** — sudah dicoba, tidak menembus plateau |
| Section 5 (CORAL/ordinal) | Ordinal head, CORAL loss | **CLOSED** — DINOv2 CORN sudah dicoba di two-stage |
| Section 6.1 (WBF lintas view naif) | WBF basis IoU lintas view | Sanity baseline OK; bukan solusi 4-kelas |
| Section 9.2 Exp 1–6 | Knob tuning + imbalance recipe | **CLOSED** — dijawab AR29 series |
| Section 16 train script imbalance | Implementasi knob | Tetap valid sebagai utility, bukan jalur baru |
| Section 17 CORAL crop classifier | Two-stage classifier | **CLOSED** — DINOv2 CE/CORN, EfficientNet, hierarchical, wide-context — semua gagal |
| Section 18 KD teacher→student | Knowledge distillation | Layak hanya sebagai alat mobile export, **bukan** solusi 4-kelas ceiling |
| Section 20 Ablation exp01–exp10 | Matrix knob lama | Sebagian besar sudah dijawab; lihat **Section 30** untuk matrix baru |
| Section 22 Mobile export | TFLite INT8 pipeline | Tetap valid kapan pun ada model layak deploy |
| Section 25 Failure modes | Debug playbook knob | Tetap berguna sebagai referensi, bukan agenda eksperimen |

### 0.6 Section yang Sekarang Jadi HEADLINE

**[v2 UPDATE — 2026-04-23]** Arahan dosen (Bu Fatma): *"tidak usah end-to-end dulu. Inputnya (ground truth deteksi+klasifikasi)"*

Implikasi langsung:
- **Prioritas 1 sekarang: JSON-05** — counting pipeline multi-view dengan **GT label sebagai input** (bukan prediksi model)
- JSON-01 s/d JSON-04 (label audit + retrain path) **turun ke prioritas 2** — baru relevan setelah counting pipeline berjalan dan ada kebutuhan konkret meningkatkan detector
- Dataset yang dipakai: **228 pohon dengan JSON** (bukan 854 pohon penuh), karena hanya 228 yang sudah selesai di-link

**Section 23 — Multi-View Aggregation (JSON bunch-linking)** sebelumnya disebut "Stage 2 nanti". Sekarang **fokus utama v2**. Detail:

- **Section 29 JSON-05** — eksperimen counting (GT-based, no GPU, prioritas pertama)
- **Section 23** — pipeline MultiViewAggregator
- **Section 27** JSON sebagai Label-Audit Tool (defer, run setelah JSON-05)
- **Section 28** JSON sebagai Multi-View Supervision Signal (defer)
- **Section 30** Updated Ablation Matrix & Decision Tree

### 0.7 Aturan Perbandingan Hasil Baru

- **Wajib** breakdown per-domain (DAMIMAS vs LONSUM) dan per-class (B1/B2/B3/B4)
- **Wajib** bootstrap CI 95% terhadap AR29 (gap < 0.005 mAP50-95 = noise)
- **Wajib** specify rejim (standard val vs train+test vs legacy split — jangan campur)
- Klaim "improvement" tanpa CI overlap test = invalid

---

### 0.8 Quick Start — Baca Ini Sebelum Section 1–26 [v2]

> **Dokumen ini ~37K token. Section 1–26 adalah referensi infra, bukan agenda baru.**

#### Urutan Baca yang Benar (v2)

```
0.1–0.8  (sudah kamu baca)
    ↓
Section 29 JSON-05  (ACTION PERTAMA: counting pipeline, no GPU)
    ↓
Section 23          (MultiViewAggregator implementation detail)
    ↓
Section 30.2        (Decision Tree — setelah JSON-05 punya hasil)
    ↓
Section 27/28/29 JSON-01–04  (defer: label audit + retrain — baru kalau counting pipeline sudah jalan)
    ↓
Section 1–26  (buka hanya kalau perlu detail infra spesifik)
```

#### Action Pertama Sekarang: JSON-05 (GT-Based Counting)

**Arahan:** Input = ground truth label (bukan prediksi model). Tidak perlu retrain.  
**Dataset:** 228 pohon dengan JSON bunch-link.  
**Cost:** ~2 jam, tidak butuh GPU.  
**Tugas konkret:**
1. Untuk setiap pohon (dari 228 JSON), hitung **ground truth count per kelas** dari `summary.total_unique_bunches` per kelas
2. Bandingkan dengan **naive sum** (jumlah bbox dari semua 4 sisi tanpa dedup)
3. Hitung **Count MAE per kelas** — ini baseline counting pipeline

**Output:** `reports/json_05/count_mae_gt.csv` dengan kolom `tree_id, B1_gt, B2_gt, B3_gt, B4_gt, B1_naive, B2_naive, B3_naive, B4_naive, MAE_B1, ..., MAE_overall`  
**Decision rule:** lihat Section 29 JSON-05 dan Section 30.2

#### Peta Section (Fokus Utama v2)

| Section | Isi | Prioritas |
|---|---|---|
| **29 JSON-05** | Counting pipeline GT-based | **PERTAMA** |
| **23** | MultiViewAggregator implementation | **Setelah JSON-05** |
| **29 JSON-01** | Label audit cross-view | Defer |
| **29 JSON-02/03/04** | Retrain path (consensus, 3-class, consistency loss) | Defer |
| **30** | Decision tree + ablation matrix | Referensi navigasi |

#### Yang Tidak Perlu Dibuka Dulu

Section 3–22: arsitektur, augmentasi, imbalance, CORAL, KD, mobile export — sudah tertutup atau defer. Buka hanya kalau ada kebutuhan infra spesifik.

---

### 0.9 Scope JSON-05 (v2 — GT-Based Counting, Bukan End-to-End)

> Clarifikasi agar tidak scope-creep ke detection improvement:

**Yang DILAKUKAN di JSON-05:**
- Input: file JSON bunch-link (228 pohon) + label YOLO TXT original (GT)
- Task: hitung unique bunch count per kelas per pohon via JSON dedup
- Baseline: naive sum (semua bbox dari 4 sisi dijumlah tanpa dedup)
- Metric: Count MAE per kelas, Count MAE overall, per-pohon breakdown
- Laporan: visualisasi distribusi error, kelas mana yang overcounting paling parah

**Yang TIDAK dilakukan di JSON-05:**
- Tidak run model inference (tidak butuh GPU)
- Tidak modifikasi label / dataset
- Tidak bandingkan ke AR29 (beda task: counting bukan detection mAP)
- Tidak handle 626 pohon yang belum punya JSON (defer)

**Definition of Done JSON-05:**
- [ ] Script `scripts/count_gt_vs_naive.py` jalan tanpa error pada 228 JSON
- [ ] `reports/json_05/count_mae_gt.csv` tersimpan
- [ ] Summary: MAE naive per kelas (ini upper bound seberapa buruk overcounting tanpa dedup)
- [ ] Decision: apakah JSON dedup signifikan menurunkan MAE? → kalau yes, lanjut implement pipeline inference-based

---

## 1. Profil Dataset

### 1.1 Struktur Umum

| Item | Nilai |
|------|-------|
| Total pohon | 854 |
| Gambar per pohon | 4 sisi (side_1 sampai side_4) |
| Total gambar | 3,992 JPEG |
| Resolusi | 960 × 1280 px (portrait) |
| Device | Samsung SM-A566B |
| Format anotasi | YOLO TXT (normalized xywh) |
| Train / Val / Test | 2,780 / 620 / 592 |

### 1.2 Kelas Buah (Ordinal Maturity)

| ID | Nama | Warna Tandan | Ciri Khas | Posisi di Pohon | Waktu ke Panen |
|----|------|-------------|----------|----------------|----------------|
| 0  | B1   | **Kemerahan** (dominan merah) | Tandan besar, matang penuh | **Paling bawah** | ~1 bulan |
| 1  | B2   | **Setengah merah, masih ada hitam** | Transisi warna, campuran | Di atas B1 | ~2 bulan |
| 2  | B3   | **Sepenuhnya hitam** | Besar, gelap penuh | Di atas B2 | ~3 bulan |
| 3  | B4   | **Hitam kecil, ada duri tajam** | Buah muda, ukuran kecil, berduri | **Paling atas** | ~4 bulan |

> **Kritis:** B1–B4 adalah skala **ordinal**, bukan nominal. Jarak antar kelas bermakna: salah prediksi B1→B4 (selisih 3 bulan) 3× lebih berbahaya dari B1→B2 (selisih 1 bulan).

> **Implikasi visual penting:**
> - **Warna adalah diskriminator utama B1 vs B3/B4** — merah vs hitam sangat kontras, model seharusnya bisa membedakan ini dengan baik
> - **B2↔B3 paling sulit** — transisi warna merah→hitam, batas ambigu
> - **B4 unik dari ukuran dan tekstur** (kecil + berduri) tapi warnanya mirip B3
> - **Posisi vertikal** mengandung informasi implisit: B1 selalu paling bawah, B4 paling atas — bisa dieksploitasi sebagai spatial prior

### 1.3 Distribusi Kelas

| Kelas | Deteksi (Train) | Persentase | Rasio ke B3 |
|-------|----------------|-----------|-------------|
| B1    | 1,548          | 12.2%     | 0.26× |
| B2    | 2,895          | 22.9%     | 0.49× |
| B3    | 5,853          | 46.3%     | 1.00× |
| B4    | 2,347          | 18.6%     | 0.40× |
| **Total** | **12,643** | **100%** | — |

> **B3 dominan** karena mayoritas pohon yang difoto sedang dalam tahap 3 bulan pra-panen. Ini mencerminkan kondisi lapangan riil tapi menciptakan class imbalance.

### 1.4 Statistik Objek per Gambar

| Split | Gambar | Total Bbox | Avg Bbox/Gambar |
|-------|--------|-----------|----------------|
| Train | 2,780  | 12,643    | 4.55 |
| Val   | 620    | ~2,800    | ~4.5 |
| Test  | 592    | ~2,700    | ~4.5 |

### 1.5 Struktur JSON Bunch-Linking

228 dari 854 pohon (26.7%) memiliki JSON metadata yang menghubungkan bounding box yang sama terlihat dari beberapa sisi:

```
dataset_combined_1_yolo/json/  → 46 JSON (pohon 1–45)
dataset_combined_2_yolo/json/  → 72 JSON (pohon 244–576)
dataset_combined_3_yolo/json/  → 113 JSON (pohon 577–809)
```

Struktur JSON per pohon:
```json
{
  "tree_id": "DAMIMAS_A21B_0001",
  "images": {
    "side_1": {
      "filename": "DAMIMAS_A21B_0001_1.jpg",
      "annotations": [{"class": "B3", "yolo_bbox": [x, y, w, h]}, ...]
    },
    "side_2": {...},
    "side_3": {...},
    "side_4": {...}
  },
  "bunches": [
    {
      "bunch_id": 1,
      "class": "B3",
      "appearance_count": 2,
      "appearances": [
        {"side": "side_1", "box_index": 0},
        {"side": "side_4", "box_index": 1}
      ]
    }
  ],
  "summary": {
    "total_unique_bunches": 8,
    "total_detections": 17,
    "duplicates_linked": 9
  }
}
```

> **Insight penting:** 1 tandan sawit rata-rata terlihat dari 2+ sisi. Tanpa deduplication, count per pohon akan overcounting. JSON ground truth menyediakan "unique bunch count" yang akurat.

---

## 2. Formulasi Masalah

### 2.1 Task Definition

**Input:** Gambar tunggal (960×1280 JPEG) dari satu sisi pohon sawit  
**Output:** Sekumpulan bounding box, masing-masing dengan:
- Lokasi (x_center, y_center, width, height) — normalized
- Kelas (B1 / B2 / B3 / B4)
- Confidence score

**Tahap 1 (target sekarang):** Per-image object detection + classification  
**Tahap 2 (nanti):** Multi-view aggregation → count unik per kelas per pohon

### 2.2 Karakteristik Unik Problem Ini

1. **Ordinal labels** — B1 < B2 < B3 < B4 dalam skala kematangan. Standard cross-entropy tidak mengeksploitasi informasi urutan ini.

2. **Multi-view dari objek yang sama** — 4 foto per pohon dari sudut berbeda. Objek yang sama bisa muncul di 2–3 sisi. Ground truth JSON sudah meng-encode linking ini.

3. **High intra-class variance** — Pencahayaan outdoor, sudut kamera bervariasi, kondisi daun menutupi buah.

4. **Objek kecil di foto wide-angle** — Pohon sawit besar, buah relatif kecil dalam frame.

5. **Heavy class imbalance** — B3 mendominasi 46%, B1 hanya 12%.

---

## 3. Review Arsitektur yang Relevan

### 3.1 YOLO Variants

#### YOLOv8 (Ultralytics, 2023)
- **Kelebihan:** Paling mature, dokumentasi lengkap, komunitas besar, banyak tutorial
- **Kekurangan:** Sedikit kalah dari v11 untuk small objects
- **Ukuran tersedia:** n (3.2M param) / s (11.2M) / m (25.9M) / l (43.7M) / x (68.2M)
- **Rekomendasi size:** `yolov8m` untuk akurasi, `yolov8s` jika GPU terbatas

#### YOLOv11 (Ultralytics, 2024) ← **Direkomendasikan**
- **Kelebihan:** Lebih akurat dari v8 dengan param lebih sedikit, better small object detection
- **Kekurangan:** Lebih baru, resource komunitas belum sebanyak v8
- **Ukuran tersedia:** n / s / m / l / x
- **Rekomendasi size:** `yolo11m` untuk akurasi

#### YOLOv9 (2024, GELAN architecture)
- **Kelebihan:** GELAN (Generalized Efficient Layer Aggregation Network) — gradient flow lebih baik
- **Kekurangan:** Tidak di Ultralytics ecosystem, setup lebih rumit
- **Cocok jika:** Ingin eksperimen architecture, tapi butuh setup manual

#### RT-DETR (Real-Time Detection Transformer, 2023)
- **Kelebihan:** End-to-end transformer, no NMS post-processing, akurasi tinggi
- **Kekurangan:** Butuh lebih banyak GPU memory, lebih lambat dari YOLO
- **Cocok untuk:** Jika akurasi menjadi prioritas mutlak dan ada GPU yang kuat

### 3.2 Perbandingan untuk Dataset Ini

| Model | mAP COCO | Param | FPS (T4) | Mobile Export | Cocok? |
|-------|---------|-------|---------|--------------|-------|
| YOLOv8n | 37.3 | 3.2M | 140 | ✅ TFLite/ONNX | Kandidat mobile |
| YOLOv8s | 44.9 | 11.2M | 128 | ✅ | **Mobile + akurasi** |
| YOLOv8m | 50.2 | 25.9M | 82 | ⚠️ Berat untuk mobile | Train accuracy ref |
| YOLOv11n | 39.5 | 2.6M | 80 | ✅ | **Kandidat mobile terbaik** |
| YOLOv11s | 47.0 | 9.4M | 72 | ✅ | **Recommended mobile** |
| YOLOv11m | 51.5 | 20.1M | 68 | ⚠️ | Accuracy reference saja |
| RT-DETR-L | 53.0 | 32M | 75 | ❌ Tidak cocok mobile | Skip |

### 3.3 Strategi: Train Besar → Deploy Kecil (Knowledge Distillation)

Karena GPU unlimited tapi target adalah **mobile phone**, strategi terbaik:

```
STEP 1: Train teacher model (YOLOv11m) → akurasi maksimal
STEP 2: Train student model (YOLOv11n/s) dengan knowledge distillation
         Student belajar dari soft labels teacher, bukan hard labels saja
STEP 3: Export student → TFLite INT8 (Android) atau CoreML (iOS)
```

**Keuntungan dibanding langsung train YOLOv11n:**
- Student yang di-distill dari teacher yang baik ~3-5% mAP lebih tinggi
- Ukuran model tetap kecil untuk mobile

### 3.4 Mobile Export Pipeline

```
best.pt (PyTorch)
    │
    ├── ONNX (.onnx)           → Cross-platform, bisa di Android/iOS via ONNX Runtime
    ├── TFLite (.tflite)       → Android native (TensorFlow Lite)
    │     └── INT8 quantized   → 4× lebih kecil, sedikit loss akurasi
    └── CoreML (.mlmodel)      → iOS native

Ukuran estimasi YOLOv11n:
  - Float32 (PyTorch): ~5.4MB
  - INT8 quantized: ~1.4MB
  - Inference on Snapdragon 8: ~15-25ms per gambar
```

---

## 4. Strategi Handling Class Imbalance

### 4.1 Class-Weighted Loss

YOLO menggunakan BCE loss untuk classification. Bisa tambahkan weight:

```
Weight_inverse_frequency:
  B1: 12,643 / (4 × 1,548) = 2.04×
  B2: 12,643 / (4 × 2,895) = 1.09×
  B3: 12,643 / (4 × 5,853) = 0.54×
  B4: 12,643 / (4 × 2,347) = 1.35×
```

Normalize: B1=3.78, B2=2.02, B3=1.00, B4=2.50

### 4.2 Focal Loss

Focal Loss: `FL(p) = -α(1-p)^γ * log(p)`

- `γ=2.0` (default) mengurangi kontribusi easy examples
- B3 yang mudah diklasifikasi (banyak contoh) bobotnya berkurang otomatis
- B1 yang susah (sedikit contoh) mendapat bobot lebih besar

Built-in di YOLO via parameter `fl_gamma`. Rekomendasi: `fl_gamma: 1.5`

### 4.3 Oversampling Minor Class

Untuk B1 (hanya 12%): duplikat gambar yang mengandung B1 di training set.

```python
# Logika: scan train labels, jika ada kelas 0 (B1) → copy ke daftar oversample
images_with_B1 = [img for img in train_images if has_class(img, 0)]
# Oversample 2× agar B1 efektif ~24%
```

### 4.4 Augmentasi Spesifik: COLOR-AWARE (KRITIS)

> **Peringatan:** Karena warna (merah vs hitam) adalah fitur pembeda utama B1 vs B3, augmentasi warna yang terlalu agresif bisa **merusak label**. Hue jitter besar bisa membuat B1 (merah) terlihat seperti B3 (hitam) secara visual.

| Augmentasi | Parameter Aman | Tujuan | Catatan |
|-----------|---------------|--------|---------|
| Mosaic | ON | Variasi konteks, bantu minor class | Aman |
| MixUp | alpha=0.1 (rendah) | Soft labels, robustness | Hati-hati mixing B1+B3 |
| **HSV Hue** | `hsv_h: 0.015` (RENDAH) | Variasi pencahayaan | **JANGAN tinggi** — bisa ubah merah→hitam |
| **HSV Saturation** | `hsv_s: 0.4` | Variasi kejenuhan warna | Moderat, aman |
| **HSV Value** | `hsv_v: 0.4` | Variasi kecerahan | Moderat, aman |
| Random flip horizontal | ON | Sisi pohon bisa mirror | Aman |
| Random flip vertical | **OFF** | | **Jangan** — posisi vertikal B1(bawah)↔B4(atas) bermakna |
| Scale (zoom) | 0.5–1.5 | Handle small objects (B4 kecil) | Aman |
| Random erasing | p=0.2 | Simulasi occlusion daun | Aman |
| Color jitter (brightness) | 0.3 | Variasi pencahayaan lapangan | Moderat |

> **Kritis — Jangan lakukan:**
> - Hue jitter besar (hsv_h > 0.05) → B1 bisa jadi terlihat seperti B3
> - Vertical flip → B1 (yang harusnya bawah) muncul di atas seperti B4
> - Grayscale augmentation → hilangkan fitur warna sepenuhnya

---

## 4b. Eksploitasi Posisi Vertikal sebagai Spatial Prior

Karena B1 selalu di bawah dan B4 selalu di atas (secara biologis tandan sawit tumbuh dari atas ke bawah), **y_center dari bounding box mengandung informasi kelas implisit**.

### Analisis yang Perlu Dilakukan

Sebelum eksploitasi, verifikasi hipotesis ini di dataset:
```python
# Hitung rata-rata y_center per kelas dari semua train labels
# Expected: mean_y(B1) > mean_y(B3) > mean_y(B4)
# (y=1.0 = bawah gambar dalam koordinat image standar,
#  tapi YOLO origin = kiri atas, jadi bawah = y tinggi)
```

### Cara Mengeksploitasi Spatial Prior

**Opsi 1: Positional Bias di Loss (simple)**
- Tambahkan penalty jika B1 diprediksi di y_center rendah (atas gambar)
- Implementasi: custom loss term

**Opsi 2: Y-coordinate sebagai auxiliary feature**
- Concat y_center bbox ke classification feature vector sebelum softmax
- Model belajar bahwa y_center besar → likely B1

**Opsi 3: Tidak lakukan — biarkan model belajar sendiri**
- YOLO melihat spatial context lewat receptive field
- Mungkin sudah cukup tanpa explicit prior

> **Rekomendasi:** Opsi 3 dulu (baseline). Analisis apakah confusion matrix B1↔B4 tinggi — jika iya, coba Opsi 2.

---

## 5. Ordinal Classification: Pendekatan Alternatif

### 5.1 Masalah Standard Softmax untuk Ordinal Data

Standard YOLO classification head menggunakan cross-entropy:
```
L = -Σ y_i * log(p_i)
```

Ini memperlakukan B1→B4 sama dengan B1→B2. Untuk ordinal data ini suboptimal.

### 5.2 CORAL Loss (Consistent Rank Logits)

Dekomposisi ordinal ke binary tasks:
```
P(Y >= 1), P(Y >= 2), P(Y >= 3)
```

Loss:
```
L_CORAL = -Σ_k [1_{y>=k} * log(σ(s_k)) + 1_{y<k} * log(1-σ(s_k))]
```

Implementasi: tambahkan ordinal head setelah backbone YOLO, training loss = bbox_loss + CORAL_loss.

### 5.3 Weighted MSE pada Class Index

Paling sederhana: treat class index (0,1,2,3) sebagai nilai kontinu, gunakan MSE regression head:
```
L_ordinal = (predicted_index - true_index)^2
```

Misalkan B1=0, B4=3 → error B1→B4 = 9, B1→B2 = 1. Naturally weighted.

### 5.4 Rekomendasi

| Tahap | Approach |
|-------|---------|
| Baseline | Standard YOLO + cross-entropy |
| Experiment 1 | Tambah `fl_gamma` + class weights |
| Experiment 2 | Custom CORAL head (jika B1↔B4 confusion masih tinggi) |

---

## 6. Handling Multi-View (Tahap 2, Nanti)

### 6.1 Cross-View Deduplication: Weighted Box Fusion (WBF)

Setelah per-image inference, jalankan WBF untuk merge prediksi dari 4 sisi:

```
Input:  4 set boxes {B1_side1, B1_side2, B1_side3, B1_side4}
Process: IoU-based clustering → vote → merge
Output: 1 set boxes unik per pohon
```

Library: `pip install ensemble-boxes`

**Masalah:** IoU lintas view tidak bisa langsung — bounding box di side_1 dan side_3 adalah objek yang sama tapi koordinat berbeda (sudut kamera beda). Solusi:
- Gunakan visual feature similarity (embedding YOLO backbone) bukan IoU koordinat
- Atau gunakan JSON ground truth untuk supervisi linking (jika ada)

### 6.2 Evaluation Menggunakan JSON Ground Truth

JSON menyediakan ground truth "unique bunch count". Bisa evaluasi:

```
Metric: Count Accuracy per pohon per kelas
  Ground truth (JSON): {B1: 3, B2: 4, B3: 8, B4: 2}
  Prediction (setelah dedup): {B1: 2, B2: 5, B3: 9, B4: 2}
  Error: MAE per class
```

### 6.3 Struktur Pipeline Tahap 2

```
4 gambar pohon X
    │
    ├─→ YOLO inference → boxes_side_1
    ├─→ YOLO inference → boxes_side_2
    ├─→ YOLO inference → boxes_side_3
    └─→ YOLO inference → boxes_side_4
                │
                ↓
    Cross-view deduplication
    (WBF atau feature similarity)
                │
                ↓
    Unique bunch count per class
    {B1: N1, B2: N2, B3: N3, B4: N4}
                │
                ↓
    Evaluasi vs JSON ground truth
```

---

## 7. Tantangan Teknis yang Diantisipasi

### 7.1 Small Object Detection

Buah sawit di foto wide-angle bisa sangat kecil. Strategi:

| Strategi | Detail |
|---------|--------|
| Tingkatkan `imgsz` | Default 640 → coba 1280. Memory 4× lebih besar. |
| SAHI (Sliced Inference) | Bagi gambar jadi tile kecil, inference tiap tile, merge |
| Multi-scale training | `--multi_scale True` di YOLO |
| Anchor tuning | Jalankan `autoanchor` untuk dataset ini |

### 7.2 Occlusion

Tandan sawit sering terhalang daun atau tandan lain:

- **Augmentasi occlusion:** Random erasing di training
- **Deformable convolutions:** Lebih robust ke partial occlusion
- **Keypoint-based approach:** Jika bbox tidak reliable, coba center-point detection (CenterNet)

### 7.3 Intra-Class Variance Tinggi

B2 dan B3 mungkin visually mirip (warna dan tekstur overlap):

- **Hard negative mining:** Perhatikan confusion B2↔B3 di training
- **Pretrained backbone lebih kuat:** Fine-tune dari model yang dilatih di data buah/agricultural
- **Color space augmentation:** HSV jitter untuk handle variasi pencahayaan outdoor

### 7.4 Dataset Size Relatif Kecil

3,992 gambar cukup untuk fine-tuning tapi kecil untuk training from scratch:

- **Wajib:** Start dari pretrained weights (COCO-pretrained YOLO)
- **Transfer learning:** Freeze backbone layers pertama, train head saja di awal
- **Data augmentation agresif:** Mosaic, mixup, flip, color jitter wajib ON

---

## 8. Evaluation Framework

### 8.1 Metrics Tahap 1 (Per-Image)

| Metric | Keterangan | Target |
|--------|-----------|--------|
| mAP@0.5 | Standard YOLO metric | > 0.80 |
| mAP@0.5:0.95 | Lebih ketat | > 0.60 |
| mAP per class | B1, B2, B3, B4 terpisah | Gap B1-B3 < 15% |
| Precision per class | Berapa deteksi yang benar | > 0.75 semua |
| Recall per class | Berapa ground truth yang ketangkap | > 0.75 semua |
| **MAE class index** | Mean absolute error ordinal: \|pred_idx - true_idx\| | < 0.5 |
| **B1↔B4 confusion rate** | Seberapa sering prediksi meleset 3 level | < 5% |

### 8.2 Confusion Matrix Analysis

Confusion matrix untuk dataset ordinal harus diinterpretasikan berbeda:
```
Ideal:           Acceptable:         Buruk:
B1 B2 B3 B4     B1 B2 B3 B4        B1 B2 B3 B4
90  8  2  0     85 12  3  0        70  5  5 20  ← B1 ke B4 tinggi
 7 85  7  1      8 80 12  0         5 60  5 30
 2  8 85  5      3 10 78  9         5  5 60 30
 0  1  6 93      0  0  8 92         5 20 20 55
```

### 8.3 Metrics Tahap 2 (Per-Pohon)

| Metric | Keterangan |
|--------|-----------|
| Count MAE per class | \|predicted_count - true_count\| per B1-B4 |
| Total count accuracy | % pohon dengan total count error ≤ 1 |
| Dedup precision | Berapa unique bunches yang benar dideteksi |

---

## 9. Eksperimen yang Direkomendasikan

### 9.1 Training Config (GPU Unlimited)

```yaml
# ===== TEACHER MODEL (accuracy reference) =====
model: yolo11m.pt
data: dataset_combined/data.yaml
epochs: 150
imgsz: 1280          # High res — penting untuk B4 yang kecil
batch: 32            # GPU unlimited, pakai besar
lr0: 0.01
lrf: 0.01
cos_lr: true
warmup_epochs: 3
mosaic: 1.0
mixup: 0.1
close_mosaic: 15
hsv_h: 0.015         # RENDAH — warna kritis (merah B1 vs hitam B3)
hsv_s: 0.4
hsv_v: 0.4
flipud: 0.0          # MATIKAN — posisi vertikal B1↔B4 bermakna
fliplr: 0.5
scale: 0.5
erasing: 0.2
fl_gamma: 1.5        # Focal loss untuk class imbalance
cls: 0.5

# ===== STUDENT MODEL (target mobile deployment) =====
model: yolo11n.pt    # atau yolo11s.pt untuk akurasi lebih baik
# Semua hyperparameter sama, tapi tambah:
epochs: 200          # Student butuh lebih lama konvergen
# + knowledge distillation dari teacher best.pt
```

### 9.2 Urutan Eksperimen

```
Exp 1: YOLOv11m Teacher Baseline
  - imgsz=1280, batch=32, epoch=150
  - Default augment + hsv_h rendah + flipud=0
  - Tujuan: raih akurasi maksimal, lihat confusion matrix

Exp 2: Teacher + Imbalance Handling
  - Tambah fl_gamma=1.5
  - Class weights: B1=3.78, B2=2.02, B3=1.0, B4=2.50
  - Oversampling gambar dengan B1 (×2)
  - Tujuan: perbaiki mAP B1

Exp 3: Student YOLOv11n (Knowledge Distillation)
  - Gunakan soft labels dari Exp 2 teacher
  - epoch=200, imgsz=1280
  - Tujuan: model kecil dengan akurasi mendekati teacher

Exp 4: SAHI Inference (eval only, tanpa retrain)
  - Load best student dari Exp 3
  - Inference dengan SAHI tile 640×640 stride 320
  - Tujuan: lihat apakah B4 (kecil) detection naik

Exp 5 (opsional): CORAL Ordinal Head
  - Custom YOLOv11 + CORAL loss pada classification head
  - Evaluasi MAE ordinal metric vs Exp 2
  - Lakukan hanya jika B1↔B4 confusion masih > 5%

Exp 6: Mobile Export & Benchmark
  - Export Exp 3 student → TFLite INT8
  - Benchmark di device Android: latency, memory, akurasi
```

### 9.3 Ablation Study Design

| Faktor | Nilai yang diuji | Metrik utama |
|--------|----------------|-------------|
| Model size | yolo11n vs yolo11s vs yolo11m | mAP + size |
| imgsz | 640 vs 1280 | mAP B4 (small) |
| hsv_h | 0.015 vs 0.1 vs 0.5 | Confusion B1↔B3 |
| flipud | ON vs **OFF** | Confusion B1↔B4 |
| Imbalance strategy | None vs focal vs oversample vs keduanya | mAP B1 |
| Loss function | Cross-entropy vs CORAL | MAE ordinal |
| Knowledge distillation | Tanpa vs dengan teacher | mAP student |

---

## 10. Referensi Penelitian Relevan

1. **Redmon et al. (2016)** — YOLOv1: You Only Look Once, real-time object detection
2. **Jocher et al. (2023)** — YOLOv8: Ultralytics, state-of-the-art detection
3. **Wang et al. (2024)** — YOLOv9: Learning What You Want to Learn Using Programmable Gradient Information
4. **Cao et al. (2020)** — Rank consistent ordinal regression for neural networks with application to age estimation
5. **Bochkovskiy et al. (2020)** — YOLOv4: Optimal Speed and Accuracy of Object Detection
6. **Lin et al. (2020)** — Focal Loss for Dense Object Detection (RetinaNet)
7. **Sohan et al. (2023)** — A Review on YOLOv8 and Its Advancements
8. **Akiva et al. (2020)** — Finding Berries: Segmentation and Counting of Cranberries using Point Supervision and Shape Priors (relevan: counting small fruits)
9. **Sa et al. (2016)** — DeepFruits: A Fruit Detection System Using Deep Neural Networks (relevan: fruit detection domain)
10. **Zeng et al. (2023)** — SAHI: Slicing Aided Hyper Inference for small object detection

---

## 11. Roadmap Kerja

```
Fase A — Teacher Training (GPU unlimited, akurasi maksimal)
  ├── Setup: Python 3.10+, PyTorch 2.x, Ultralytics pip install
  ├── Train YOLOv11m teacher:
  │     imgsz=1280, batch=32, epoch=150
  │     hsv_h=0.015, flipud=0, fl_gamma=1.5
  ├── Analisis: confusion matrix, mAP per class, MAE ordinal
  └── Decision: apakah B1↔B4 confusion > 5%? → tentukan perlu CORAL

Fase B — Optimization Teacher
  ├── Implement oversampling B1 (×2) di train set
  ├── Experiment class weights jika focal loss belum cukup
  ├── Jika B1↔B4 masih tinggi: tambah CORAL loss head
  └── Simpan best_teacher.pt

Fase C — Student Distillation (target mobile)
  ├── Train YOLOv11n student dengan soft labels dari best_teacher.pt
  ├── epoch=200, imgsz=1280
  ├── Evaluasi: mAP student vs teacher (target gap < 5%)
  └── Simpan best_student.pt

Fase D — Mobile Export & Benchmark
  ├── Export best_student.pt → ONNX → TFLite INT8
  ├── Test di Android device: latency, RAM, akurasi
  ├── Bandingkan: Float32 vs INT8 (akurasi tradeoff)
  └── Final model untuk deployment

Fase E — Multi-View Pipeline (Tahap 2, nanti)
  ├── Load best_student.pt
  ├── Inference 4 sisi per pohon → 4 prediction sets
  ├── Cross-view deduplication (WBF atau feature similarity)
  ├── Hitung unique bunch count per class per pohon
  └── Evaluasi vs JSON ground truth (228 pohon)
```

---

## 12. Status Pertanyaan Terbuka

| # | Pertanyaan | Status | Jawaban |
|---|-----------|--------|---------|
| 1 | Definisi visual B1-B4? | ✅ TERJAWAB | B1=merah (bawah), B2=setengah merah, B3=hitam penuh, B4=hitam kecil berduri (atas) |
| 2 | JSON coverage cukup? | ⚠️ PERLU KEPUTUSAN | 26.7% coverage — evaluasi Tahap 2 hanya valid untuk 228 pohon tersebut |
| 3 | GPU available? | ✅ TERJAWAB | **Unlimited** → pakai imgsz=1280, batch=32, model besar |
| 4 | Target deployment? | ✅ TERJAWAB | **Mobile phone** → strategy: train besar (teacher) + distill ke yolo11n (student) |
| 5 | Data tambahan untuk B1? | ❓ BELUM | Apakah bisa foto lebih banyak pohon yang B1-nya dominan? |

### Keputusan Desain Final

| Aspek | Keputusan |
|-------|----------|
| **Teacher model** | YOLOv11m, imgsz=1280, epoch=150 |
| **Student/deploy model** | YOLOv11n, knowledge distillation, export TFLite INT8 |
| **Augmentasi warna** | hsv_h=0.015 (sangat rendah), flipud=OFF |
| **Imbalance** | Focal loss (γ=1.5) + oversampling B1 ×2 |
| **Loss function** | Cross-entropy baseline → CORAL jika B1↔B4 confusion > 5% |
| **Spatial prior** | Biarkan model belajar sendiri (verifikasi setelah baseline) |

---

## 13. Insight Khusus: Color-Based Feature Engineering

Karena B1 (merah) vs B3/B4 (hitam) sangat kontras secara warna, ada potensi untuk:

### 13.1 Pre-training pada Agricultural Color Dataset
- Fine-tune dari checkpoint yang sudah dilatih di data buah/tanaman
- Backbone sudah sensitif terhadap warna buah → konvergen lebih cepat
- Kandidat: model YOLO yang dilatih di dataset manggis, tomat, atau palm oil lainnya

### 13.2 Color Channel Attention
- Tambahkan channel attention yang fokus pada channel R (red) untuk membantu deteksi B1
- Channel R tinggi = likely B1 atau B2
- Bisa diimplementasikan sebagai lightweight attention module setelah input

### 13.3 HSV Color Space Input (Eksperimental)
- Konversi gambar ke HSV sebelum masuk model
- Channel H (Hue) langsung encode merah vs hitam
- Pro: informasi warna lebih eksplisit
- Con: YOLO pretrained di RGB, perlu fine-tune dari awal atau adaptor layer

### 13.4 Dual-Stream: RGB + Color Mask (Kompleks)
- Stream 1: RGB input → YOLO backbone biasa
- Stream 2: Red-mask (pixel merah di foto) → auxiliary feature
- Merge sebelum detection head
- Hanya relevan jika baseline sangat rendah untuk B1

---

# Bagian II: Implementasi

Section 14–26 berisi rincian eksekusi: struktur project, kode siap-pakai, workflow ablation step-by-step, mobile export, dan stage 2 multi-view. Snippet kode di-tulis level "tinggal copy lalu sesuaikan path", bukan production-grade — tetap fokus riset.

---

## 14. Environment & Project Structure

### 14.1 Hardware & OS

| Item | Spek Asumsi |
|------|-------------|
| GPU | 1× NVIDIA A100 / RTX 4090 / 3090 (24GB+) — minimum 16GB untuk imgsz=1280 batch=16 |
| RAM | 32GB+ |
| Disk | 50GB free (dataset + checkpoints + ablation outputs) |
| OS | Linux Ubuntu 22.04 (rekomendasi) atau Windows 11 + WSL2 |
| CUDA | 12.1+ |
| Python | 3.10 atau 3.11 |

### 14.2 `requirements.txt`

```txt
# Core deep learning
torch==2.3.0
torchvision==0.18.0
ultralytics==8.3.0

# Detection / multi-view
ensemble-boxes==1.0.9
sahi==0.11.18

# Quantization & export
onnx==1.16.0
onnxruntime-gpu==1.18.0
onnx-simplifier==0.4.36
tensorflow==2.16.1
coremltools==7.2

# Data / metrics / logging
numpy==1.26.4
pandas==2.2.2
scikit-learn==1.5.0
matplotlib==3.9.0
seaborn==0.13.2
opencv-python==4.10.0.84
Pillow==10.3.0
PyYAML==6.0.1
tqdm==4.66.4
wandb==0.17.0
albumentations==1.4.10
```

### 14.3 Setup Commands

```bash
# Conda env
conda create -n damimas python=3.10 -y
conda activate damimas

# Torch dengan CUDA 12.1
pip install torch==2.3.0 torchvision==0.18.0 --index-url https://download.pytorch.org/whl/cu121

# Sisanya
pip install -r requirements.txt

# Verifikasi GPU
python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```

### 14.4 Project Tree

```
damimas-yolo/
├── configs/
│   ├── exp01_baseline_v8m_640.yaml
│   ├── exp02_baseline_v11m_640.yaml
│   ├── exp03_v11m_1280.yaml
│   ├── exp04_v11m_1280_focal.yaml
│   ├── exp05_v11m_1280_focal_weights.yaml
│   ├── exp06_v11m_1280_focal_weights_oversample.yaml
│   ├── exp07_v11m_1280_full_imbalance_coral.yaml
│   ├── exp08_student_v11n_kd.yaml
│   ├── exp09_student_v11s_kd.yaml
│   └── exp10_student_v11n_sahi_eval.yaml
├── data/
│   └── dataset_combined/        # symlink ke D:/Work/.../dataset_combined
├── scripts/
│   ├── verify_dataset.py
│   ├── dataset_stats.py
│   ├── oversample_minor.py
│   ├── train_teacher.py
│   ├── train_student_kd.py
│   ├── eval_full.py
│   ├── sahi_inference.py
│   ├── export_mobile.py
│   ├── eval_multiview.py
│   └── run_ablation.py
├── src/
│   ├── __init__.py
│   ├── seed.py
│   ├── losses/
│   │   ├── __init__.py
│   │   ├── coral.py
│   │   └── focal_weighted.py
│   ├── heads/
│   │   ├── __init__.py
│   │   └── coral_head.py
│   ├── trainers/
│   │   ├── __init__.py
│   │   └── kd_trainer.py
│   ├── metrics/
│   │   ├── __init__.py
│   │   ├── ordinal.py
│   │   └── confusion.py
│   └── pipeline/
│       ├── __init__.py
│       └── multiview_count.py
├── runs/                        # Ultralytics auto-output
├── exports/                     # ONNX / TFLite / CoreML
├── reports/                     # ablation_summary.csv, plots
├── requirements.txt
└── README.md
```

### 14.5 Reproducibility — `src/seed.py`

```python
import os, random
import numpy as np
import torch

def seed_everything(seed: int = 42, deterministic: bool = False):
    os.environ["PYTHONHASHSEED"] = str(seed)
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    if deterministic:
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False
        os.environ["CUBLAS_WORKSPACE_CONFIG"] = ":4096:8"
    else:
        torch.backends.cudnn.benchmark = True
```

> **Catatan:** Ultralytics punya argumen `deterministic=True` di `model.train()`. AMP + multi-worker dataloader tetap punya non-determinisme kecil — accept gap <0.5% mAP antar run sebagai noise.

---

## 15. Data Preparation Scripts

### 15.1 `scripts/verify_dataset.py`

```python
"""Cek konsistensi dataset_combined: jumlah image vs label, parse data.yaml,
distribusi kelas per split."""
from pathlib import Path
import yaml
from collections import Counter

ROOT = Path("data/dataset_combined")
SPLITS = ["train", "val", "test"]

def main():
    cfg = yaml.safe_load((ROOT / "data.yaml").read_text())
    names = cfg["names"]
    print(f"Classes: {names}")
    for split in SPLITS:
        imgs = sorted((ROOT / "images" / split).glob("*.jpg"))
        lbls = sorted((ROOT / "labels" / split).glob("*.txt"))
        assert len(imgs) == len(lbls), f"{split}: {len(imgs)} img != {len(lbls)} lbl"
        # validasi paired stem
        img_stems = {p.stem for p in imgs}
        lbl_stems = {p.stem for p in lbls}
        assert img_stems == lbl_stems, f"{split}: stem mismatch"
        # distribusi kelas
        cnt = Counter()
        for lbl in lbls:
            for line in lbl.read_text().strip().splitlines():
                cls = int(line.split()[0])
                cnt[cls] += 1
        total = sum(cnt.values())
        print(f"\n[{split}] images={len(imgs)} bboxes={total}")
        for c in sorted(cnt):
            print(f"  {names[c]}: {cnt[c]} ({100*cnt[c]/total:.1f}%)")

if __name__ == "__main__":
    main()
```

### 15.2 `scripts/dataset_stats.py`

```python
"""Hitung statistik: bbox area per class, y_center per class (verifikasi spatial
prior B1 bawah / B4 atas), aspect ratio."""
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

ROOT = Path("data/dataset_combined")
NAMES = ["B1", "B2", "B3", "B4"]
OUT = Path("reports"); OUT.mkdir(exist_ok=True)

def parse_split(split):
    rows = []
    for lbl in (ROOT / "labels" / split).glob("*.txt"):
        for line in lbl.read_text().strip().splitlines():
            c, xc, yc, w, h = line.split()
            rows.append({
                "split": split, "class": NAMES[int(c)],
                "xc": float(xc), "yc": float(yc),
                "w": float(w), "h": float(h),
                "area": float(w) * float(h),
                "ar": float(w) / max(float(h), 1e-6),
            })
    return rows

def main():
    rows = []
    for s in ["train", "val", "test"]:
        rows += parse_split(s)
    df = pd.DataFrame(rows)
    df.to_csv(OUT / "bbox_stats.csv", index=False)

    # ===== Verifikasi spatial prior =====
    # YOLO origin = top-left, yc=0 atas, yc=1 bawah
    # Hipotesis: yc(B1) > yc(B4)
    print("\n=== Mean y_center per class (1=bawah gambar) ===")
    print(df.groupby("class")["yc"].agg(["mean", "median", "std"]))

    # ===== Bbox area per class =====
    print("\n=== Mean bbox area (normalized, kecil = small object) ===")
    print(df.groupby("class")["area"].agg(["mean", "median", "min", "max"]))

    # Plot
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    for cls in NAMES:
        sub = df[df["class"] == cls]
        axes[0].hist(sub["yc"], bins=40, alpha=0.5, label=cls, density=True)
        axes[1].hist(np.log10(sub["area"] + 1e-6), bins=40, alpha=0.5, label=cls, density=True)
    axes[0].set_title("y_center distribution per class"); axes[0].legend(); axes[0].set_xlabel("y_center (0=top, 1=bottom)")
    axes[1].set_title("log10(bbox area) per class"); axes[1].legend(); axes[1].set_xlabel("log10(area)")
    plt.tight_layout(); plt.savefig(OUT / "spatial_size_priors.png", dpi=140)
    print(f"\nSaved → {OUT / 'spatial_size_priors.png'}")

if __name__ == "__main__":
    main()
```

**Decision rule:** Jika `mean_yc(B1) - mean_yc(B4) > 0.15` → spatial prior nyata, pertimbangkan eksploitasi (Section 4b Opsi 2). Jika gap kecil → biarkan model belajar implisit.

### 15.3 `scripts/oversample_minor.py`

```python
"""Oversample images yang mengandung kelas minor (default: B1, kelas 0).
Output ke dataset baru agar split asli tidak rusak."""
from pathlib import Path
import shutil
import argparse

SRC = Path("data/dataset_combined")
DST = Path("data/dataset_combined_oversampled")

def has_class(label_path: Path, target_cls: int) -> bool:
    for line in label_path.read_text().strip().splitlines():
        if int(line.split()[0]) == target_cls:
            return True
    return False

def main(target_cls: int = 0, factor: int = 2):
    DST.mkdir(parents=True, exist_ok=True)
    # Copy data.yaml dengan path direvisi
    yaml_text = (SRC / "data.yaml").read_text().replace(
        str(SRC.resolve()), str(DST.resolve())
    )
    (DST / "data.yaml").write_text(yaml_text)

    for split in ["train", "val", "test"]:
        for sub in ["images", "labels"]:
            (DST / sub / split).mkdir(parents=True, exist_ok=True)
        # Copy semua file
        for img in (SRC / "images" / split).glob("*.jpg"):
            shutil.copy2(img, DST / "images" / split / img.name)
            lbl_src = SRC / "labels" / split / (img.stem + ".txt")
            shutil.copy2(lbl_src, DST / "labels" / split / lbl_src.name)
        # Oversample HANYA di train
        if split != "train":
            continue
        n_added = 0
        for img in (SRC / "images" / split).glob("*.jpg"):
            lbl = SRC / "labels" / split / (img.stem + ".txt")
            if has_class(lbl, target_cls):
                for k in range(1, factor):
                    new_stem = f"{img.stem}_aug{k}"
                    shutil.copy2(img, DST / "images" / split / f"{new_stem}.jpg")
                    shutil.copy2(lbl, DST / "labels" / split / f"{new_stem}.txt")
                    n_added += 1
        print(f"[{split}] oversample +{n_added} (target_cls={target_cls}, factor={factor})")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--target_cls", type=int, default=0)  # 0=B1
    p.add_argument("--factor", type=int, default=2)
    args = p.parse_args()
    main(args.target_cls, args.factor)
```

> **Catatan:** Oversample dengan duplikasi file (bukan augmentasi on-the-fly tambahan). Augmentasi mosaic+mixup dari YOLO trainer tetap aktif → tiap epoch duplikat terlihat berbeda secara efektif.

### 15.4 Stratified sanity check

```python
# Dijalankan setelah verify_dataset.py — pastikan val & test contain semua 4 kelas
# (Kalau ada split tanpa kelas tertentu, mAP per class jadi NaN)
```

Cukup pakai output `verify_dataset.py` Section 15.1; jika ada kelas dengan count=0 di val/test → re-split manual.

---

## 16. Training — Teacher (Stage 1)

### 16.1 `data.yaml` Template

```yaml
# data/dataset_combined/data.yaml (atau dataset_combined_oversampled/)
path: D:/Work/Assisten Dosen/Folder Linked Dataset/dataset_combined
train: images/train
val: images/val
test: images/test
nc: 4
names: [B1, B2, B3, B4]
```

### 16.2 Class Weights — Compute

```python
# src/losses/focal_weighted.py
import numpy as np

def inverse_frequency_weights(counts: dict, normalize_to: str = "B3"):
    """counts = {'B1': 1548, 'B2': 2895, 'B3': 5853, 'B4': 2347}
    Return dict {class: weight} dinormalisasi terhadap normalize_to (=1.0)."""
    n_total = sum(counts.values())
    n_cls = len(counts)
    raw = {c: n_total / (n_cls * v) for c, v in counts.items()}
    base = raw[normalize_to]
    return {c: w / base for c, w in raw.items()}

# Hasil utk dataset DAMIMAS (train):
# {'B1': 3.78, 'B2': 2.02, 'B3': 1.00, 'B4': 2.49}
```

### 16.3 `scripts/train_teacher.py`

```python
"""Training teacher YOLOv11m. Config diparse dari yaml di configs/.
Mendukung: focal loss, class weights (via monkey-patch), oversampled dataset path,
custom callback log per-class mAP & MAE ordinal."""
import argparse, yaml, json
from pathlib import Path
import numpy as np
import torch
from ultralytics import YOLO
from ultralytics.utils.metrics import ConfusionMatrix
import sys; sys.path.insert(0, ".")
from src.seed import seed_everything

NAMES = ["B1", "B2", "B3", "B4"]

def patch_class_weights(model, weights_tensor):
    """Override BCE pos_weight di v8DetectionLoss untuk classification."""
    from ultralytics.utils.loss import v8DetectionLoss
    orig_init = v8DetectionLoss.__init__
    def new_init(self, model_):
        orig_init(self, model_)
        self.bce = torch.nn.BCEWithLogitsLoss(
            pos_weight=weights_tensor.to(self.device), reduction="none"
        )
    v8DetectionLoss.__init__ = new_init

def on_val_end_callback(validator):
    """Hitung MAE ordinal & B1↔B4 confusion dari confusion matrix Ultralytics."""
    cm = validator.confusion_matrix.matrix  # (nc+1, nc+1) — kolom terakhir/baris = background
    cm = cm[:4, :4]  # ambil hanya kelas (drop background)
    if cm.sum() == 0:
        return
    # MAE ordinal: |i - j| weighted by cm[i,j]
    indices = np.arange(4)
    mae = 0.0; total = 0
    for i in range(4):
        for j in range(4):
            mae += abs(i - j) * cm[i, j]
            total += cm[i, j]
    mae /= max(total, 1)
    # B1↔B4 confusion: salah ≥3 level
    b14 = (cm[0, 3] + cm[3, 0]) / max(total, 1)
    print(f"\n[ordinal] MAE_class_index={mae:.3f}  B1↔B4_rate={b14:.4f}")
    out_dir = Path(validator.save_dir)
    (out_dir / "ordinal_metrics.json").write_text(json.dumps(
        {"mae_ordinal": float(mae), "b1_b4_rate": float(b14)}, indent=2))

def main(cfg_path: str):
    cfg = yaml.safe_load(Path(cfg_path).read_text())
    seed_everything(cfg.get("seed", 42))

    # Class weights (opsional)
    if cfg.get("use_class_weights", False):
        cw = cfg["class_weights"]  # dict {B1: 3.78, ...}
        w_tensor = torch.tensor([cw[n] for n in NAMES], dtype=torch.float32)
        patch_class_weights(None, w_tensor)
        print(f"Patched class weights: {w_tensor.tolist()}")

    model = YOLO(cfg["model"])
    model.add_callback("on_val_end", on_val_end_callback)

    results = model.train(
        data=cfg["data"],
        epochs=cfg["epochs"],
        imgsz=cfg["imgsz"],
        batch=cfg["batch"],
        lr0=cfg.get("lr0", 0.01),
        lrf=cfg.get("lrf", 0.01),
        cos_lr=cfg.get("cos_lr", True),
        warmup_epochs=cfg.get("warmup_epochs", 3),
        mosaic=cfg.get("mosaic", 1.0),
        mixup=cfg.get("mixup", 0.1),
        close_mosaic=cfg.get("close_mosaic", 15),
        hsv_h=cfg.get("hsv_h", 0.015),
        hsv_s=cfg.get("hsv_s", 0.4),
        hsv_v=cfg.get("hsv_v", 0.4),
        flipud=cfg.get("flipud", 0.0),
        fliplr=cfg.get("fliplr", 0.5),
        scale=cfg.get("scale", 0.5),
        erasing=cfg.get("erasing", 0.2),
        cls=cfg.get("cls", 0.5),
        fl_gamma=cfg.get("fl_gamma", 0.0),  # 0=disable, 1.5=focal
        project=cfg.get("project", "runs/detect"),
        name=cfg["exp_id"],
        device=cfg.get("device", 0),
        amp=cfg.get("amp", True),
        deterministic=cfg.get("deterministic", False),
        seed=cfg.get("seed", 42),
        workers=cfg.get("workers", 8),
        cache=cfg.get("cache", False),
    )
    print(f"\nDone. Best weights: {results.save_dir}/weights/best.pt")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--config", required=True)
    main(p.parse_args().config)
```

### 16.4 Config Files (contoh)

**`configs/exp02_baseline_v11m_640.yaml`:**
```yaml
exp_id: exp02_baseline_v11m_640
model: yolo11m.pt
data: data/dataset_combined/data.yaml
epochs: 100
imgsz: 640
batch: 32
lr0: 0.01
cos_lr: true
mosaic: 1.0
mixup: 0.1
close_mosaic: 10
hsv_h: 0.015
hsv_s: 0.4
hsv_v: 0.4
flipud: 0.0
fliplr: 0.5
fl_gamma: 0.0
use_class_weights: false
device: 0
seed: 42
```

**`configs/exp06_v11m_1280_focal_weights_oversample.yaml`:**
```yaml
exp_id: exp06_v11m_1280_focal_weights_oversample
model: yolo11m.pt
data: data/dataset_combined_oversampled/data.yaml   # hasil oversample_minor.py
epochs: 150
imgsz: 1280
batch: 16            # 1280 perlu memory lebih
lr0: 0.01
cos_lr: true
warmup_epochs: 3
mosaic: 1.0
mixup: 0.1
close_mosaic: 15
hsv_h: 0.015
hsv_s: 0.4
hsv_v: 0.4
flipud: 0.0
fliplr: 0.5
scale: 0.5
erasing: 0.2
fl_gamma: 1.5
cls: 0.5
use_class_weights: true
class_weights: {B1: 3.78, B2: 2.02, B3: 1.00, B4: 2.49}
device: 0
amp: true
seed: 42
workers: 8
```

### 16.5 Running

```bash
# Single GPU
python scripts/train_teacher.py --config configs/exp06_v11m_1280_focal_weights_oversample.yaml

# Multi-GPU (DDP via Ultralytics built-in)
# Edit config: device: [0,1,2,3]
# Atau via CLI:
yolo detect train model=yolo11m.pt data=... device=0,1,2,3 imgsz=1280 batch=64

# Resume training
python scripts/train_teacher.py --config configs/exp06... # otomatis resume jika last.pt ada
```

---

## 17. Custom Ordinal Head & CORAL Loss

### 17.1 Ringkasan

YOLO classification branch normal output `(B, A, nc)` logits → softmax. Untuk ordinal, ganti dengan `(B, A, nc-1)` logits → sigmoid kumulatif. Karena modifikasi head saja, backbone+neck pretrained tetap dipakai.

### 17.2 `src/heads/coral_head.py`

```python
import torch
import torch.nn as nn

class CoralOrdinalHead(nn.Module):
    """Drop-in replacement untuk classification branch.
    Output: K-1 logits per anchor; logit_k = score - bias_k untuk k=0..K-2.
    Decoding: pred_class = sum(sigmoid(logits) > 0.5).
    """
    def __init__(self, in_channels: int, num_classes: int = 4):
        super().__init__()
        self.num_classes = num_classes
        # Single shared score head
        self.score = nn.Conv2d(in_channels, 1, kernel_size=1)
        # Learnable rank biases (CORAL ensures monotonic via shared score)
        self.bias = nn.Parameter(torch.zeros(num_classes - 1))

    def forward(self, x):
        # x: (B, in_channels, H, W) atau (B, A, in_channels)
        score = self.score(x)  # (B, 1, H, W)
        # broadcast: (B, K-1, H, W)
        return score - self.bias.view(1, -1, 1, 1)
```

### 17.3 `src/losses/coral.py`

```python
import torch
import torch.nn.functional as F

def class_idx_to_levels(y: torch.Tensor, K: int) -> torch.Tensor:
    """y: (N,) int dalam [0, K-1].
    Return: (N, K-1) cumulative one-hot.
      class 0 → [0,0,0]
      class 1 → [1,0,0]
      class 2 → [1,1,0]
      class 3 → [1,1,1]
    """
    levels = torch.zeros(y.size(0), K - 1, device=y.device)
    for k in range(K - 1):
        levels[:, k] = (y > k).float()
    return levels

def coral_loss(logits: torch.Tensor, levels: torch.Tensor,
               importance_weights: torch.Tensor = None):
    """logits: (N, K-1)  levels: (N, K-1)
    importance_weights: (K-1,) bobot per task (opsional, untuk imbalance)."""
    if importance_weights is None:
        importance_weights = torch.ones(logits.size(1), device=logits.device)
    val = -torch.sum(
        (F.logsigmoid(logits) * levels +
         (F.logsigmoid(logits) - logits) * (1 - levels)) * importance_weights,
        dim=1,
    )
    return val.mean()

def decode_ordinal(logits: torch.Tensor) -> torch.Tensor:
    """logits: (N, K-1) → predicted class index (N,)."""
    return (torch.sigmoid(logits) > 0.5).sum(dim=1)
```

### 17.4 Integrasi ke YOLO — Opsi B (Recommended)

Daripada bedah `tasks.py` Ultralytics (rapuh saat upgrade), **fine-tune classification head terpisah**: pakai best.pt teacher → ekstrak crop tiap GT bbox → train classifier ordinal kecil di atas crop.

```python
# scripts/train_ordinal_head.py
"""Phase 2 training: ekstrak crop dari best teacher, fine-tune CORAL head."""
import torch, torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
from pathlib import Path
import sys; sys.path.insert(0, ".")
from src.heads.coral_head import CoralOrdinalHead
from src.losses.coral import class_idx_to_levels, coral_loss, decode_ordinal

class CropDataset(Dataset):
    def __init__(self, root: Path, split: str, transform=None):
        self.samples = []  # list of (image_path, bbox_yolo, class)
        for lbl in (root / "labels" / split).glob("*.txt"):
            img = root / "images" / split / (lbl.stem + ".jpg")
            for line in lbl.read_text().strip().splitlines():
                c, xc, yc, w, h = map(float, line.split())
                self.samples.append((img, (xc, yc, w, h), int(c)))
        self.tf = transform

    def __len__(self): return len(self.samples)
    def __getitem__(self, i):
        img_path, (xc, yc, w, h), cls = self.samples[i]
        img = Image.open(img_path).convert("RGB")
        W, H = img.size
        x1 = max(int((xc - w/2) * W), 0); y1 = max(int((yc - h/2) * H), 0)
        x2 = min(int((xc + w/2) * W), W); y2 = min(int((yc + h/2) * H), H)
        crop = img.crop((x1, y1, x2, y2))
        if self.tf: crop = self.tf(crop)
        return crop, cls

def build_ordinal_classifier(num_classes=4):
    """Backbone ResNet18 + CORAL head — kecil tapi sufficient untuk crop."""
    import torchvision.models as M
    backbone = M.resnet18(weights=M.ResNet18_Weights.IMAGENET1K_V1)
    feat_dim = backbone.fc.in_features
    backbone.fc = nn.Identity()
    head = CoralOrdinalHead(feat_dim, num_classes)
    # Adapt: head expects (B,C,1,1) — wrap
    class Wrap(nn.Module):
        def __init__(self, b, h):
            super().__init__(); self.b = b; self.h = h
        def forward(self, x):
            f = self.b(x).unsqueeze(-1).unsqueeze(-1)  # (B,C,1,1)
            return self.h(f).squeeze(-1).squeeze(-1)   # (B, K-1)
    return Wrap(backbone, head)

def train(epochs=20, lr=1e-3, batch=64, device="cuda"):
    tf = transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.02),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225]),
    ])
    tf_val = transforms.Compose([
        transforms.Resize((128, 128)), transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225]),
    ])
    root = Path("data/dataset_combined")
    train_ds = CropDataset(root, "train", tf)
    val_ds = CropDataset(root, "val", tf_val)
    train_dl = DataLoader(train_ds, batch, shuffle=True, num_workers=4)
    val_dl = DataLoader(val_ds, batch, shuffle=False, num_workers=4)
    model = build_ordinal_classifier(4).to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    sched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=epochs)

    for ep in range(epochs):
        model.train()
        for crops, ys in train_dl:
            crops, ys = crops.to(device), ys.to(device)
            logits = model(crops)                                 # (B, K-1)
            levels = class_idx_to_levels(ys, K=4)
            loss = coral_loss(logits, levels)
            opt.zero_grad(); loss.backward(); opt.step()
        sched.step()
        # Val
        model.eval()
        mae = 0.0; n = 0; b14 = 0
        with torch.no_grad():
            for crops, ys in val_dl:
                crops, ys = crops.to(device), ys.to(device)
                preds = decode_ordinal(model(crops))
                mae += (preds - ys).abs().sum().item()
                b14 += ((preds - ys).abs() == 3).sum().item()
                n += ys.size(0)
        print(f"ep {ep:02d} val MAE={mae/n:.3f} B1↔B4={b14/n:.4f}")
    torch.save(model.state_dict(), "runs/ordinal_head/best.pt")

if __name__ == "__main__":
    train()
```

**Inference combined:** YOLO deteksi bbox → crop → ordinal classifier → kelas final. Confidence detection tetap dari YOLO; classification confidence dari sigmoid product.

> **Trade-off:** Opsi B menambah latency (ekstra forward pass per bbox). Untuk mobile, kalau crop classifier dijaga kecil (ResNet18 quantized ~2MB), tambahan latency bisa dibatasi <5ms total per frame.

---

## 18. Knowledge Distillation (Teacher → Student)

### 18.1 Strategi

**Response-based KD** (paling simple & efektif untuk YOLO):
- Soft cls logits: KLDiv dengan temperature T
- Soft bbox: SmoothL1 antara teacher dan student box prediction (hanya pada anchor yang teacher confident, conf > τ)

```
L_total = L_yolo_hard(student, gt) + α * (L_cls_kd + λ_box * L_box_kd)
```

Default: α=1.0, T=4.0, λ_box=2.0, τ=0.25.

### 18.2 `src/trainers/kd_trainer.py`

```python
"""Subclass DetectionTrainer Ultralytics, inject teacher prediction ke loss."""
import torch
import torch.nn.functional as F
from ultralytics.models.yolo.detect import DetectionTrainer
from ultralytics.utils.loss import v8DetectionLoss
from ultralytics import YOLO

class KDLoss(v8DetectionLoss):
    def __init__(self, model, teacher, alpha=1.0, T=4.0, lambda_box=2.0, tau=0.25):
        super().__init__(model)
        self.teacher = teacher
        self.teacher.eval()
        for p in self.teacher.parameters(): p.requires_grad_(False)
        self.alpha = alpha
        self.T = T
        self.lambda_box = lambda_box
        self.tau = tau

    def __call__(self, preds, batch):
        loss_hard, loss_items = super().__call__(preds, batch)
        with torch.no_grad():
            t_preds = self.teacher(batch["img"])
        # preds: list of feature maps from heads
        # Asumsi struktur preds = [pred_p3, pred_p4, pred_p5], setiap pred shape
        # (B, no, H, W) di mana no = nc + reg_max*4
        kd_cls, kd_box, n_anc = 0.0, 0.0, 0
        for s_p, t_p in zip(preds, t_preds):
            s_p = s_p.permute(0, 2, 3, 1)  # (B, H, W, no)
            t_p = t_p.permute(0, 2, 3, 1)
            nc = self.nc
            s_cls = s_p[..., :nc]
            t_cls = t_p[..., :nc]
            s_box = s_p[..., nc:]
            t_box = t_p[..., nc:]
            # Mask: anchor yang teacher confident
            t_conf = t_cls.sigmoid().max(dim=-1).values  # (B,H,W)
            mask = t_conf > self.tau
            if mask.sum() == 0: continue
            s_cls_m = s_cls[mask]; t_cls_m = t_cls[mask]
            s_box_m = s_box[mask]; t_box_m = t_box[mask]
            # KL on soft cls
            kd_cls = kd_cls + F.kl_div(
                F.log_softmax(s_cls_m / self.T, dim=-1),
                F.softmax(t_cls_m / self.T, dim=-1),
                reduction="batchmean"
            ) * (self.T ** 2)
            # SmoothL1 on box (DFL bins atau xywh — sesuaikan)
            kd_box = kd_box + F.smooth_l1_loss(s_box_m, t_box_m, reduction="mean")
            n_anc += 1
        if n_anc > 0:
            kd_total = self.alpha * (kd_cls + self.lambda_box * kd_box)
            loss_hard = loss_hard + kd_total
            loss_items = torch.cat([loss_items,
                torch.tensor([kd_cls.detach(), kd_box.detach()], device=loss_items.device)])
        return loss_hard, loss_items

class KDTrainer(DetectionTrainer):
    def __init__(self, *args, teacher_weights: str, **kwargs):
        super().__init__(*args, **kwargs)
        self.teacher = YOLO(teacher_weights).model.to(self.device)

    def init_criterion(self):
        return KDLoss(self.model, self.teacher,
                      alpha=self.args.kd_alpha if hasattr(self.args,'kd_alpha') else 1.0,
                      T=self.args.kd_T if hasattr(self.args,'kd_T') else 4.0)
```

### 18.3 `scripts/train_student_kd.py`

```python
import argparse, yaml
from pathlib import Path
import sys; sys.path.insert(0, ".")
from src.seed import seed_everything
from src.trainers.kd_trainer import KDTrainer

def main(cfg_path):
    cfg = yaml.safe_load(Path(cfg_path).read_text())
    seed_everything(cfg.get("seed", 42))
    overrides = dict(
        model=cfg["model"],            # e.g. yolo11n.pt
        data=cfg["data"],
        epochs=cfg["epochs"],
        imgsz=cfg["imgsz"],
        batch=cfg["batch"],
        device=cfg.get("device", 0),
        project="runs/detect",
        name=cfg["exp_id"],
        amp=True,
    )
    trainer = KDTrainer(overrides=overrides, teacher_weights=cfg["teacher_weights"])
    trainer.train()

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--config", required=True)
    main(p.parse_args().config)
```

**`configs/exp08_student_v11n_kd.yaml`:**
```yaml
exp_id: exp08_student_v11n_kd
model: yolo11n.pt
teacher_weights: runs/detect/exp06_v11m_1280_focal_weights_oversample/weights/best.pt
data: data/dataset_combined_oversampled/data.yaml
epochs: 200
imgsz: 1280
batch: 32
device: 0
seed: 42
kd_alpha: 1.0
kd_T: 4.0
```

> **Note teknis:** Ultralytics structure head output bisa berubah antar versi. Sebelum run, tambahkan `print(s_p.shape)` di KDLoss untuk verifikasi shape; sesuaikan slicing `s_box` jika DFL diaktifkan (default v11 pakai DFL dengan reg_max=16).

---

## 19. Evaluation & Custom Metrics

### 19.1 Standard mAP

```bash
yolo detect val model=runs/detect/exp06.../weights/best.pt data=data/dataset_combined/data.yaml imgsz=1280
# Output: per-class mAP, P, R, mAP@0.5, mAP@0.5:0.95, confusion_matrix.png
```

### 19.2 `scripts/eval_full.py`

```python
"""Evaluasi lengkap: mAP per class, ordinal MAE, B1↔B4 confusion, ordinal-weighted CM."""
import argparse, json
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from ultralytics import YOLO

NAMES = ["B1", "B2", "B3", "B4"]
K = 4

def ordinal_metrics_from_cm(cm: np.ndarray):
    """cm: (K, K) confusion matrix kelas-only."""
    if cm.sum() == 0:
        return dict(mae=float("nan"), b1b4_rate=float("nan"))
    mae, total = 0.0, 0
    for i in range(K):
        for j in range(K):
            mae += abs(i - j) * cm[i, j]; total += cm[i, j]
    return dict(mae=float(mae / total),
                b1b4_rate=float((cm[0, 3] + cm[3, 0]) / total))

def ordinal_weighted_cm(cm: np.ndarray):
    """Confusion matrix dengan bobot |i-j| di off-diagonal."""
    W = np.abs(np.subtract.outer(np.arange(K), np.arange(K)))
    return cm * W

def plot_cm(cm, title, out_path, fmt="d"):
    fig, ax = plt.subplots(figsize=(5, 4))
    sns.heatmap(cm, annot=True, fmt=fmt, xticklabels=NAMES, yticklabels=NAMES,
                cmap="Blues", ax=ax)
    ax.set_xlabel("Predicted"); ax.set_ylabel("True"); ax.set_title(title)
    plt.tight_layout(); plt.savefig(out_path, dpi=140); plt.close()

def bootstrap_ci(values, n_boot=2000, ci=95):
    rng = np.random.default_rng(42)
    arr = np.array(values)
    boots = [rng.choice(arr, len(arr), replace=True).mean() for _ in range(n_boot)]
    lo, hi = np.percentile(boots, [(100-ci)/2, 100-(100-ci)/2])
    return float(arr.mean()), float(lo), float(hi)

def main(weights, data, imgsz, out_dir):
    out = Path(out_dir); out.mkdir(parents=True, exist_ok=True)
    model = YOLO(weights)
    metrics = model.val(data=data, imgsz=imgsz, save_json=True,
                        plots=True, project=str(out), name="val")
    cm_full = metrics.confusion_matrix.matrix  # (K+1, K+1)
    cm = cm_full[:K, :K].astype(np.int64)
    ordinal = ordinal_metrics_from_cm(cm)
    cm_w = ordinal_weighted_cm(cm)
    plot_cm(cm, "Confusion Matrix (raw count)", out / "cm_raw.png")
    plot_cm(cm_w, "Confusion Matrix (ordinal-weighted by |i-j|)",
            out / "cm_ordinal_weighted.png", fmt=".0f")
    summary = {
        "weights": str(weights),
        "mAP@0.5": float(metrics.box.map50),
        "mAP@0.5:0.95": float(metrics.box.map),
        "per_class_mAP@0.5": {NAMES[i]: float(v) for i, v in enumerate(metrics.box.maps)},
        "ordinal_MAE": ordinal["mae"],
        "B1_B4_confusion_rate": ordinal["b1b4_rate"],
        "ordinal_weighted_cm_sum": int(cm_w.sum()),
    }
    (out / "eval_summary.json").write_text(json.dumps(summary, indent=2))
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--weights", required=True)
    p.add_argument("--data", default="data/dataset_combined/data.yaml")
    p.add_argument("--imgsz", type=int, default=1280)
    p.add_argument("--out_dir", default="reports/eval")
    args = p.parse_args()
    main(args.weights, args.data, args.imgsz, args.out_dir)
```

### 19.4 Bootstrap Significance

Saat membandingkan exp A vs B, run val 5× dengan seed berbeda (atau 5 fold) → bootstrap mean+CI:

```python
# Pseudo: kumpulkan list mAP dari 5 run, panggil bootstrap_ci(values)
# Klaim "B > A signifikan" jika CI lower bound (B) > CI upper bound (A)
```

---

## 20. Workflow Ablation (Step-by-Step)

### 20.1 Ablation Matrix

| Exp ID | Model | imgsz | Focal | ClassW | Oversample | KD | Note |
|--------|-------|-------|-------|--------|-----------|----|----|
| exp01 | yolov8m | 640 | – | – | – | – | Sanity, framework comparison |
| exp02 | yolo11m | 640 | – | – | – | – | v11 baseline |
| exp03 | yolo11m | 1280 | – | – | – | – | High res baseline |
| exp04 | yolo11m | 1280 | γ=1.5 | – | – | – | Focal only |
| exp05 | yolo11m | 1280 | γ=1.5 | ✅ | – | – | Focal + weights |
| exp06 | yolo11m | 1280 | γ=1.5 | ✅ | ×2 B1 | – | Full imbalance ★ |
| exp07 | yolo11m | 1280 | γ=1.5 | ✅ | ×2 B1 | – | + CORAL crop classifier |
| exp08 | yolo11n | 1280 | inherit | inherit | inherit | from exp06 | Mobile target ★ |
| exp09 | yolo11s | 1280 | inherit | inherit | inherit | from exp06 | Mobile (akurasi+) |
| exp10 | exp08 weights | – | – | – | – | – | SAHI eval only |

★ = milestone utama.

### 20.2 `scripts/run_ablation.py`

```python
"""Loop semua config, jalankan train+eval, aggregate ke CSV."""
import argparse, subprocess, json, time
from pathlib import Path
import pandas as pd

CONFIGS_DIR = Path("configs")
RUNS_DIR = Path("runs/detect")
REPORTS = Path("reports"); REPORTS.mkdir(exist_ok=True)
CSV = REPORTS / "ablation_summary.csv"

def run_one(cfg_path: Path, is_kd: bool = False):
    script = "scripts/train_student_kd.py" if is_kd else "scripts/train_teacher.py"
    print(f"\n[ABLATION] running {cfg_path.name}")
    t0 = time.time()
    subprocess.run(["python", script, "--config", str(cfg_path)], check=True)
    elapsed = time.time() - t0
    return elapsed

def collect_metrics(exp_id: str):
    run_dir = RUNS_DIR / exp_id
    weights = run_dir / "weights" / "best.pt"
    if not weights.exists(): return None
    out_eval = REPORTS / "eval" / exp_id
    subprocess.run(["python", "scripts/eval_full.py",
                    "--weights", str(weights), "--out_dir", str(out_eval)], check=True)
    summary = json.loads((out_eval / "val" / "eval_summary.json").read_text()) \
              if (out_eval / "val" / "eval_summary.json").exists() else \
              json.loads((out_eval / "eval_summary.json").read_text())
    return summary

def main(only=None):
    rows = []
    cfgs = sorted(CONFIGS_DIR.glob("exp*.yaml"))
    for cfg in cfgs:
        if only and cfg.stem not in only: continue
        is_kd = "student" in cfg.stem
        elapsed = run_one(cfg, is_kd=is_kd)
        m = collect_metrics(cfg.stem)
        if m is None:
            print(f"[skip metrics] {cfg.stem}"); continue
        m["exp_id"] = cfg.stem
        m["train_seconds"] = elapsed
        rows.append(m)
        # Save incrementally
        pd.DataFrame(rows).to_csv(CSV, index=False)
    print(f"\nDone. Summary → {CSV}")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--only", nargs="*", help="Subset exp_id, e.g. exp03 exp04")
    main(p.parse_args().only)
```

### 20.3 Decision Tree

```
START → exp01 (sanity)
   │
   ├── mAP@0.5 < 0.50? → STOP, debug data pipeline
   ├── mAP@0.5 ≥ 0.50 → lanjut exp02 (v11 baseline)
   │
   ↓
exp02 → exp03 (naik res 640→1280)
   │
   ├── mAP B4 naik signifikan? → confirmed: B4 small object, lanjut high-res
   ├── mAP tidak naik → batal, kembali imgsz=640 untuk efisiensi
   │
   ↓
exp03 → exp04 (focal) → exp05 (+ weights) → exp06 (+ oversample)
   │
   ├── per-class mAP B1 sudah dalam 15% gap dari B3? → STOP imbalance, ke exp08
   ├── B1 masih jauh? → coba exp07 (CORAL crop)
   │
   ↓
exp07 keputusan:
   ├── B1↔B4 confusion < 5%? → cukup, baseline cross-entropy
   ├── B1↔B4 ≥ 5%? → adopsi CORAL untuk inference final
   │
   ↓
exp06 best → exp08 (KD ke v11n) → exp09 (KD ke v11s, jika v11n gap > 5%)
   │
   ↓
exp10 SAHI eval (cek apakah B4 detection naik di test set)
   │
   ↓
Pick best mobile model → mobile export pipeline (Section 22)
```

### 20.4 Budget Estimasi

Asumsi single A100 (40GB):

| Exp | imgsz | epochs | Est. waktu |
|-----|-------|--------|-----------|
| exp01–02 | 640 | 100 | ~3 jam |
| exp03 | 1280 | 100 | ~10 jam |
| exp04–06 | 1280 | 150 | ~14 jam masing-masing |
| exp07 | – | 20 (crop) | ~1 jam |
| exp08 | 1280 | 200 | ~12 jam |
| exp09 | 1280 | 200 | ~14 jam |
| exp10 | – | – | <30 menit (eval only) |

Total ablation full: **~80 GPU-hour** (bisa diparalel jika multi-GPU).

---

## 21. SAHI Inference (Small Object Boost)

```python
# scripts/sahi_inference.py
"""Sliced inference untuk boost B4 (small object) detection."""
import argparse
from pathlib import Path
from sahi import AutoDetectionModel
from sahi.predict import get_sliced_prediction, predict
import json

def main(weights, source, out_dir, slice_h=640, slice_w=640, overlap=0.2,
         conf_threshold=0.25, imgsz=1280):
    model = AutoDetectionModel.from_pretrained(
        model_type="ultralytics",
        model_path=weights,
        confidence_threshold=conf_threshold,
        device="cuda:0",
    )
    out = Path(out_dir); out.mkdir(parents=True, exist_ok=True)
    results_coco = []
    for img_path in sorted(Path(source).glob("*.jpg")):
        pred = get_sliced_prediction(
            str(img_path), model,
            slice_height=slice_h, slice_width=slice_w,
            overlap_height_ratio=overlap, overlap_width_ratio=overlap,
            postprocess_type="NMS", postprocess_match_threshold=0.5,
        )
        for obj in pred.object_prediction_list:
            results_coco.append({
                "image": img_path.name,
                "bbox": obj.bbox.to_xywh(),
                "category": obj.category.id,
                "score": obj.score.value,
            })
    (out / "sahi_predictions.json").write_text(json.dumps(results_coco, indent=2))
    print(f"Saved {len(results_coco)} predictions → {out}")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--weights", required=True)
    p.add_argument("--source", required=True, help="Folder gambar")
    p.add_argument("--out_dir", default="reports/sahi")
    args = p.parse_args()
    main(args.weights, args.source, args.out_dir)
```

**Compare standard vs SAHI:**
```bash
# Standard
python scripts/eval_full.py --weights runs/.../best.pt --out_dir reports/eval/exp08
# SAHI
python scripts/sahi_inference.py --weights runs/.../best.pt --source data/dataset_combined/images/test --out_dir reports/sahi/exp08
# Konversi predictions.json → COCO format → evaluasi mAP per class B4
# (kerjakan manual via pycocotools.cocoeval)
```

---

## 22. Mobile Export Pipeline

### 22.1 PT → ONNX

```python
# scripts/export_mobile.py
import argparse
from ultralytics import YOLO

def export_onnx(weights, imgsz=640, out_dir="exports"):
    m = YOLO(weights)
    path = m.export(format="onnx", imgsz=imgsz, opset=12, simplify=True,
                    dynamic=False, half=False)
    print(f"ONNX → {path}")
    return path

def export_tflite(weights, imgsz=640, int8=True):
    m = YOLO(weights)
    path = m.export(format="tflite", imgsz=imgsz, int8=int8,
                    data="data/dataset_combined/data.yaml")  # data → calibration
    print(f"TFLite → {path}")
    return path

def export_coreml(weights, imgsz=640):
    m = YOLO(weights)
    path = m.export(format="coreml", imgsz=imgsz, nms=True)
    print(f"CoreML → {path}")
    return path

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--weights", required=True)
    p.add_argument("--imgsz", type=int, default=640)
    p.add_argument("--formats", nargs="+", default=["onnx", "tflite", "coreml"])
    args = p.parse_args()
    if "onnx" in args.formats: export_onnx(args.weights, args.imgsz)
    if "tflite" in args.formats: export_tflite(args.weights, args.imgsz, int8=True)
    if "coreml" in args.formats: export_coreml(args.weights, args.imgsz)
```

> **Penting:** Ultralytics handle calibration TFLite secara otomatis kalau `data` parameter diisi (sample 100–200 dari val). Kalau perlu kontrol manual, pakai `tf.lite.TFLiteConverter` dengan `representative_dataset` generator.

### 22.2 Manual TFLite INT8 (Kontrol Lebih)

```python
# Alternatif untuk kontrol lebih granular
import tensorflow as tf, numpy as np
from PIL import Image
from pathlib import Path

def representative_dataset(calib_dir, imgsz=640, n=200):
    files = list(Path(calib_dir).glob("*.jpg"))[:n]
    def gen():
        for f in files:
            img = Image.open(f).convert("RGB").resize((imgsz, imgsz))
            arr = np.array(img, dtype=np.float32) / 255.0
            arr = arr.transpose(2, 0, 1)[None]  # NCHW
            yield [arr.astype(np.float32)]
    return gen

converter = tf.lite.TFLiteConverter.from_saved_model("exports/best_saved_model")
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.representative_dataset = representative_dataset(
    "data/dataset_combined/images/val", imgsz=640, n=200)
converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
converter.inference_input_type = tf.int8
converter.inference_output_type = tf.int8
tflite_model = converter.convert()
Path("exports/best_int8.tflite").write_bytes(tflite_model)
```

### 22.3 Verifikasi Numerical Fidelity

```bash
# Run val pada model terkompilasi
yolo detect val model=exports/best.tflite data=data/dataset_combined/data.yaml imgsz=640
# Bandingkan dengan PT → mAP loss harus < 2%
```

### 22.4 On-Device Benchmark (Android)

```bash
# Push TFLite ke device
adb push exports/best_int8.tflite /data/local/tmp/

# Pakai TFLite Benchmark Tool (download dari TF release)
adb push tflite_benchmark_model /data/local/tmp/
adb shell chmod +x /data/local/tmp/tflite_benchmark_model
adb shell /data/local/tmp/tflite_benchmark_model \
  --graph=/data/local/tmp/best_int8.tflite \
  --num_threads=4 \
  --use_gpu=true \
  --enable_op_profiling=true

# Output: latency mean / std, tier op breakdown.
# Snapdragon 8 Gen 2: expected 15–25 ms dengan GPU delegate, 30–50 ms CPU 4 thread.
```

### 22.5 NMS On-Device vs Off-Device

| Pendekatan | Pro | Con |
|------------|-----|-----|
| NMS embedded di TFLite (`nms=True`) | App tinggal pakai output, simpler | Beberapa runtime tidak support, accuracy kadang berbeda |
| NMS di app code (Java/Kotlin/Swift) | Kontrol penuh threshold | Perlu implement IoU lokal |

**Rekomendasi:** Embed NMS di model untuk Android (TFLite support OK), keep manual NMS untuk iOS CoreML jika ada masalah kompatibilitas.

---

## 23. Stage 2 — Multi-View Aggregation Pipeline

### 23.1 `src/pipeline/multiview_count.py`

```python
"""Pipeline: 4 gambar 1 pohon → unique bunch count per kelas.
Pendekatan: feature-similarity inter-view + IoU intra-view linking."""
import torch, json
import numpy as np
from pathlib import Path
from ultralytics import YOLO
from typing import List, Dict

NAMES = ["B1", "B2", "B3", "B4"]
SIDES = ["side_1", "side_2", "side_3", "side_4"]

class MultiViewAggregator:
    def __init__(self, weights: str, sim_threshold: float = 0.75,
                 conf_threshold: float = 0.25, device: str = "cuda:0"):
        self.model = YOLO(weights)
        self.sim_thr = sim_threshold
        self.conf_thr = conf_threshold
        self.device = device
        self._features = []
        self._hook = None
        self._register_hook()

    def _register_hook(self):
        """Hook untuk capture feature embedding pre-head (neck output)."""
        # Cari layer terakhir neck Ultralytics (biasanya self.model.model.model[22] / Detect head)
        # Ekstrak input dari Detect layer
        target = self.model.model.model[-1]  # Detect head
        def hook(module, inputs, outputs):
            self._features = inputs[0]  # list of feature maps from neck
        self._hook = target.register_forward_hook(hook)

    @torch.no_grad()
    def detect_one(self, img_path: str) -> List[Dict]:
        """Return list of {bbox_xyxy, class, conf, embedding}."""
        results = self.model.predict(img_path, conf=self.conf_thr,
                                     device=self.device, verbose=False)
        r = results[0]
        boxes = r.boxes
        if boxes is None or len(boxes) == 0:
            return []
        # Embedding per bbox: ROI pool dari feature map terbesar (P3)
        feat = self._features[0]  # (1, C, H, W)
        H, W = feat.shape[-2:]
        items = []
        for i in range(len(boxes)):
            xyxy = boxes.xyxy[i].cpu().numpy()
            cls = int(boxes.cls[i].item())
            conf = float(boxes.conf[i].item())
            # Map bbox ke koordinat feature map
            x1, y1, x2, y2 = xyxy
            img_h, img_w = r.orig_shape
            fx1 = int(x1 / img_w * W); fy1 = int(y1 / img_h * H)
            fx2 = max(int(x2 / img_w * W), fx1+1); fy2 = max(int(y2 / img_h * H), fy1+1)
            roi = feat[0, :, fy1:fy2, fx1:fx2]
            emb = roi.mean(dim=(1, 2)).cpu().numpy() if roi.numel() > 0 else np.zeros(feat.shape[1])
            emb = emb / (np.linalg.norm(emb) + 1e-6)
            items.append(dict(bbox=xyxy, cls=cls, conf=conf, emb=emb, side=Path(img_path).stem))
        return items

    def link_across_views(self, all_dets: List[List[Dict]]) -> List[Dict]:
        """all_dets: list panjang 4 (per side). Return unique bunches."""
        flat = [d for view in all_dets for d in view]
        if not flat:
            return []
        # Greedy clustering by cosine similarity (intra-class only)
        clusters = []
        used = [False] * len(flat)
        for i, d in enumerate(flat):
            if used[i]: continue
            cluster = [i]; used[i] = True
            for j in range(i+1, len(flat)):
                if used[j]: continue
                if flat[j]["cls"] != d["cls"]: continue
                # Jangan link di view yang sama (gunakan IoU intra-view ternyata lebih baik)
                if flat[j]["side"] == d["side"]:
                    iou = self._iou(d["bbox"], flat[j]["bbox"])
                    if iou > 0.5:
                        cluster.append(j); used[j] = True
                else:
                    sim = float(np.dot(d["emb"], flat[j]["emb"]))
                    if sim > self.sim_thr:
                        cluster.append(j); used[j] = True
            members = [flat[k] for k in cluster]
            clusters.append(dict(
                cls=d["cls"],
                confidence=float(np.mean([m["conf"] for m in members])),
                support_views=sorted({m["side"] for m in members}),
                n_appearances=len(members),
            ))
        return clusters

    @staticmethod
    def _iou(a, b):
        x1 = max(a[0], b[0]); y1 = max(a[1], b[1])
        x2 = min(a[2], b[2]); y2 = min(a[3], b[3])
        inter = max(0, x2-x1) * max(0, y2-y1)
        area_a = (a[2]-a[0]) * (a[3]-a[1])
        area_b = (b[2]-b[0]) * (b[3]-b[1])
        return inter / max(area_a + area_b - inter, 1e-6)

    def count_per_tree(self, tree_id: str, image_dir: Path) -> Dict[str, int]:
        all_dets = []
        for side in SIDES:
            img = image_dir / f"{tree_id}_{side[-1]}.jpg"
            if img.exists():
                all_dets.append(self.detect_one(str(img)))
        unique = self.link_across_views(all_dets)
        counts = {n: 0 for n in NAMES}
        for u in unique:
            counts[NAMES[u["cls"]]] += 1
        return counts
```

### 23.2 `scripts/eval_multiview.py`

```python
"""Bandingkan count per pohon vs JSON ground truth."""
import json, argparse
from pathlib import Path
import numpy as np
import sys; sys.path.insert(0, ".")
from src.pipeline.multiview_count import MultiViewAggregator, NAMES

def main(weights, json_dirs, image_root, out):
    agg = MultiViewAggregator(weights)
    rows = []
    for jd in json_dirs:
        for jp in Path(jd).glob("*.json"):
            gt = json.loads(jp.read_text())
            tree_id = gt["tree_id"]
            # GT counts dari unique bunches
            gt_counts = {n: 0 for n in NAMES}
            for b in gt["bunches"]:
                gt_counts[b["class"]] += 1
            pred_counts = agg.count_per_tree(tree_id, Path(image_root))
            row = dict(tree_id=tree_id)
            for n in NAMES:
                row[f"gt_{n}"] = gt_counts[n]
                row[f"pred_{n}"] = pred_counts[n]
                row[f"err_{n}"] = abs(gt_counts[n] - pred_counts[n])
            row["total_gt"] = sum(gt_counts.values())
            row["total_pred"] = sum(pred_counts.values())
            row["total_err"] = abs(row["total_gt"] - row["total_pred"])
            rows.append(row)
    # Aggregate
    import pandas as pd
    df = pd.DataFrame(rows)
    df.to_csv(out + ".csv", index=False)
    summary = {
        "n_trees": len(df),
        "MAE_per_class": {n: float(df[f"err_{n}"].mean()) for n in NAMES},
        "MAE_total": float(df["total_err"].mean()),
        "pct_within_1": float((df["total_err"] <= 1).mean()),
    }
    Path(out + ".json").write_text(json.dumps(summary, indent=2))
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--weights", required=True)
    p.add_argument("--json_dirs", nargs="+", required=True,
                   help="dataset_combined_{1,2,3}_yolo/json/")
    p.add_argument("--image_root", required=True,
                   help="Folder yang berisi semua gambar pohon (dataset_combined/images/all)")
    p.add_argument("--out", default="reports/multiview_eval")
    args = p.parse_args()
    main(args.weights, args.json_dirs, args.image_root, args.out)
```

### 23.3 WBF Sanity Baseline

```python
# Alternatif simpler — pakai ensemble_boxes WBF asumsikan view sebagai "model" berbeda
from ensemble_boxes import weighted_boxes_fusion

def wbf_per_tree(predictions_per_view, iou_thr=0.5, skip_box_thr=0.25):
    # predictions_per_view: list 4 dict {boxes_xyxy_norm, scores, labels}
    boxes_list = [p["boxes"] for p in predictions_per_view]
    scores_list = [p["scores"] for p in predictions_per_view]
    labels_list = [p["labels"] for p in predictions_per_view]
    boxes, scores, labels = weighted_boxes_fusion(
        boxes_list, scores_list, labels_list,
        weights=None, iou_thr=iou_thr, skip_box_thr=skip_box_thr)
    return boxes, scores, labels
```

> **Catatan:** WBF berbasis IoU koordinat — secara teori salah untuk view berbeda (sudut beda), tapi sebagai sanity check untuk batas atas overcounting masih berguna.

---

## 24. Logging, Tracking, Reproducibility

### 24.1 Wandb Setup

```python
# Tambahkan ke train_teacher.py
import wandb
wandb.init(
    project="damimas-yolo",
    name=cfg["exp_id"],
    config=cfg,
    tags=[cfg["model"], f"imgsz{cfg['imgsz']}"],
)
# Ultralytics auto-log jika wandb terinstall — atau pasang callback eksplisit
```

### 24.2 Git + Config Hash

```python
import hashlib, subprocess, json
def fingerprint(cfg: dict) -> str:
    git = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip()
    cfg_h = hashlib.sha256(json.dumps(cfg, sort_keys=True).encode()).hexdigest()[:8]
    return f"{git[:8]}-{cfg_h}"
# Simpan ke runs/{exp_id}/fingerprint.txt
```

### 24.3 Determinism Caveats

- `cudnn.deterministic=True` slowdown 5–15% pada conv besar
- AMP (mixed precision) introduces small variance bahkan dengan seed sama
- DataLoader `num_workers > 0` perlu `worker_init_fn` untuk seed konsisten
- Diterima: gap 0.3–0.5% mAP antar run sebagai noise

---

## 25. Failure Modes & Debug Playbook

| Gejala | Diagnosis | Fix |
|--------|----------|------|
| mAP B1 stuck < 0.50 | Imbalance tidak teratasi | Naikkan oversample factor ke ×3, fl_gamma ke 2.0, cek class_weights aktif |
| Loss NaN epoch 1–5 | Batch terlalu besar untuk imgsz, lr terlalu tinggi | Turunkan batch ke 8, lr0 ke 0.005, naikkan warmup ke 5 |
| mAP val anjlok setelah epoch 80 | Overfitting (mosaic OFF terlalu cepat) | Naikkan close_mosaic ke 20, tambah weight_decay |
| B1↔B4 confusion > 10% | Color cue tidak ditangkap, atau hue jitter terlalu besar | Verifikasi hsv_h ≤ 0.015, cek dataset_stats.py untuk distribusi warna B1 |
| Student gap > 5% dari teacher | KD signal lemah | Naikkan T ke 6, alpha ke 1.5, tambah feature distillation di neck (hint loss) |
| TFLite akurasi drop > 5% | Calibration data tidak representatif | Gunakan 500 sample dari train+val, swap ke per-channel quant |
| WBF count 2× truth | IoU threshold lintas view terlalu rendah | Naikkan sim_threshold ke 0.85, atau wajibkan minimal 2 view sebagai konfirmasi |
| Multi-view miss B4 | B4 kecil tidak masuk filter conf | Turunkan conf_thr ke 0.15 untuk B4 saja (per-class threshold) |
| GPU OOM imgsz=1280 batch=16 | Memory tinggi | Aktifkan `cache=False`, `workers=4`, gradient accumulation manual |

---

## 26. Verification Checklist (End-to-End)

- [ ] `python scripts/verify_dataset.py` → semua split image=label, distribusi sesuai Section 1.3
- [ ] `python scripts/dataset_stats.py` → confirm `mean_yc(B1) > mean_yc(B4)` (spatial prior)
- [ ] `python scripts/oversample_minor.py --target_cls 0 --factor 2` → folder `dataset_combined_oversampled/` siap
- [ ] Exp01 baseline jalan tanpa error → `runs/detect/exp01.../weights/best.pt` ada
- [ ] Exp06 (full imbalance) → mAP@0.5 ≥ 0.80 di test, B1 mAP gap dari B3 < 15%
- [ ] Exp08 student → mAP gap dari teacher exp06 < 5%
- [ ] `python scripts/export_mobile.py --weights ...exp08.../best.pt` → `exports/best_int8.tflite` size < 2MB
- [ ] On-device benchmark Snapdragon 8 → latency < 30ms / frame
- [ ] `python scripts/eval_multiview.py --weights ... --json_dirs dataset_combined_*_yolo/json` → MAE count per class < 1.0 pada 228 pohon
- [ ] `reports/ablation_summary.csv` lengkap dengan semua 10 exp
- [ ] Setiap milestone exp06 / exp08 memiliki `confusion_matrix.png` + `eval_summary.json` di `reports/eval/`

> **Definition of Done Stage 1+2:** Mobile model dengan latency <30ms, mAP@0.5 ≥ 0.78 (sedikit drop dari teacher), MAE count per pohon ≤ 1.0 untuk semua kelas.

---

# Bagian III: Branch JSON-Aware (Headline Sekarang)

> Ini bagian yang dirujuk oleh Section 0.6. Berdiri di atas insight CONTEXT.md bahwa **JSON multi-view adalah satu-satunya angle struktural yang belum pernah dieksplor**, sementara semua jalur "knob & arsitektur" sudah dijawab `INSUFFICIENT` oleh AR29/AR34/E0.

---

## 27. JSON sebagai Label-Audit Tool (Test Hipotesis Label-Ceiling)

### 27.1 Premis

1 tandan fisik yang sama dilihat dari ≥2 sisi pohon **harus** mendapat kelas yang sama. JSON bunch-linking sudah memberi mapping `bunch_id → list of (side, box_index)` untuk 228 pohon. Inkonsistensi label di sini adalah salah satu dari:

- **(a)** label noise (annotator beda kasih kelas berbeda untuk objek sama)
- **(b)** ambiguity nyata yang membuktikan boundary kelas tidak well-defined oleh manusia sendiri

Kedua-duanya = **upper-bound** untuk berapa tinggi model bisa naik. Ini yang E0 + ablation tidak bisa jawab tapi JSON bisa.

### 27.2 Workflow

1. Untuk setiap pohon dengan JSON, untuk setiap bunch dengan `appearance_count ≥ 2`, ekstrak kelas di setiap appearance
2. Hitung **consistency rate**: % bunch dengan label sama di semua view-nya
3. **Per kelas**, hitung "leak distribution" — saat tidak konsisten, kelas apa yang ikut muncul
4. Bandingkan inconsistency rate B2/B3 vs B1/B4

### 27.3 `scripts/audit_label_via_json.py`

```python
"""Audit konsistensi label cross-view dari JSON bunch-link.
Output: per-class inconsistency rate, leak pair matrix, shortlist bunch ambigu untuk re-review."""
import json
from pathlib import Path
from collections import Counter
import pandas as pd

JSON_DIRS = [
    "D:/Work/Assisten Dosen/Folder Linked Dataset/dataset_combined_1_yolo/json",
    "D:/Work/Assisten Dosen/Folder Linked Dataset/dataset_combined_2_yolo/json",
    "D:/Work/Assisten Dosen/Folder Linked Dataset/dataset_combined_3_yolo/json",
]
NAMES = ["B1", "B2", "B3", "B4"]
OUT = Path("reports/label_audit"); OUT.mkdir(parents=True, exist_ok=True)

def main():
    inconsistent_rows = []
    per_class_total = Counter()
    per_class_inconsistent = Counter()
    leak_pairs = Counter()  # (true_class, leaked_class)
    n_trees = 0; n_bunches_multi = 0

    for jd in JSON_DIRS:
        for jp in Path(jd).glob("*.json"):
            data = json.loads(jp.read_text())
            n_trees += 1
            for bunch in data["bunches"]:
                if bunch["appearance_count"] < 2:
                    continue
                n_bunches_multi += 1
                # Re-derive class per appearance dari images dict (tidak percaya bunch.class saja)
                labels = []
                for app in bunch["appearances"]:
                    side = app["side"]; idx = app["box_index"]
                    cls = data["images"][side]["annotations"][idx]["class"]
                    labels.append(cls)
                base = bunch["class"]
                per_class_total[base] += 1
                if len(set(labels)) > 1:
                    per_class_inconsistent[base] += 1
                    inconsistent_rows.append({
                        "tree": data["tree_id"],
                        "bunch_id": bunch["bunch_id"],
                        "json_class": base,
                        "labels": "|".join(labels),
                        "n_views": len(labels),
                    })
                    for a in labels:
                        for b in labels:
                            if a != b:
                                leak_pairs[(a, b)] += 1

    # Print summary
    print(f"\nTrees with JSON: {n_trees}")
    print(f"Multi-view bunches (appearance≥2): {n_bunches_multi}\n")
    print("Inconsistency rate per class:")
    rows = []
    for c in NAMES:
        tot = per_class_total[c]; inc = per_class_inconsistent[c]
        rate = inc / max(tot, 1)
        print(f"  {c}: {inc}/{tot} = {rate:.3%}")
        rows.append(dict(class_=c, total=tot, inconsistent=inc, rate=rate))
    pd.DataFrame(rows).to_csv(OUT / "per_class_inconsistency.csv", index=False)

    print("\nTop leak pairs (true → leaked):")
    leak_rows = []
    for (a, b), n in leak_pairs.most_common(20):
        print(f"  {a} → {b}: {n}")
        leak_rows.append(dict(true=a, leaked=b, count=n))
    pd.DataFrame(leak_rows).to_csv(OUT / "leak_pairs.csv", index=False)

    pd.DataFrame(inconsistent_rows).to_csv(OUT / "inconsistent_bunches.csv", index=False)
    print(f"\nShortlist for re-review → {OUT/'inconsistent_bunches.csv'}")

if __name__ == "__main__":
    main()
```

### 27.4 Hipotesis Falsifiable

| ID | Hipotesis | Kondisi konfirmasi | Implikasi |
|---|---|---|---|
| H-LBL-1 | B2/B3 inconsistency rate >> B1/B4 | rate(B2 ∪ B3) > 2× rate(B1 ∪ B4) | Konfirmasi label-ceiling pada B2/B3 — bukti bahwa E0 confusion 34% B2→B3 sebagian dari noise label |
| H-LBL-2 | Leak pair B2↔B3 dominan | top-1 leak pair = (B2,B3) atau (B3,B2) dengan count >> pair lain | Boundary B2/B3 yang ambigu, bukan random noise |
| H-LBL-3 | B1/B4 cross-view rate < 5% | konsistensi tinggi pada kelas paling matang & paling muda | Sanity check: warna ekstrim cukup unambiguous untuk annotator |

### 27.5 Decision Rule Pasca-Audit

- **Jika H-LBL-1 + H-LBL-2 confirmed** (mis. B2/B3 inconsistency > 15%): label-ceiling kuat → eksplisit dokumentasikan sebagai upper-bound argument; **lanjut ke Section 29 JSON-02 (consensus relabel) dan JSON-03 (3-class merge)**
- **Jika tidak confirmed** (B2/B3 inconsistency < 5%): label OK; bottleneck murni model → JSON multi-view masih layak untuk supervisi training (Section 28) atau B4 multi-view inference, **tapi reframing task tidak akan menolong**

> **Cost:** Audit ini cheap — read-only analisis, ~5 menit jalan, tidak butuh GPU. **Wajib dijalankan sebelum eksperimen JSON lain.**

---

## 28. JSON sebagai Multi-View Supervision Signal

### 28.1 Tiga Pendekatan (Urut Prioritas)

**Pendekatan A — Post-Hoc Consensus Relabeling (PRIORITAS 1, simpel)**

Untuk setiap bunch multi-view:
- Jika label konsisten → keep
- Jika tidak konsisten → vote majority. Tie → drop bbox tersebut dari training (atau tag sebagai "ambiguous", train dengan label-smoothing extra)

Output: dataset baru `dataset_combined_consensus/` dengan label yang sudah dibersihkan. Re-train YOLO11l baseline → bandingkan ke AR29.

```python
# scripts/consensus_relabel.py (sketch)
"""Generate cleaned dataset berdasarkan vote majority cross-view per bunch."""
import json, shutil
from pathlib import Path
from collections import Counter

SRC_DATA = Path("data/dataset_combined")
DST_DATA = Path("data/dataset_combined_consensus")
JSON_DIRS = [...]  # sama seperti Section 27
NAMES = ["B1", "B2", "B3", "B4"]

def main():
    # 1. Build mapping: (image_filename, box_index) → consensus_class atau "DROP"
    overrides = {}  # key: (image_stem, box_idx) → class_idx (or None=drop)
    for jd in JSON_DIRS:
        for jp in Path(jd).glob("*.json"):
            data = json.loads(jp.read_text())
            for bunch in data["bunches"]:
                if bunch["appearance_count"] < 2: continue
                labels = []
                for app in bunch["appearances"]:
                    side = app["side"]; idx = app["box_index"]
                    labels.append(data["images"][side]["annotations"][idx]["class"])
                cnt = Counter(labels)
                top, n_top = cnt.most_common(1)[0]
                if list(cnt.values()).count(n_top) > 1:
                    consensus = None  # tie → drop
                else:
                    consensus = NAMES.index(top)
                for app in bunch["appearances"]:
                    side = app["side"]; idx = app["box_index"]
                    img_stem = Path(data["images"][side]["filename"]).stem
                    overrides[(img_stem, idx)] = consensus

    # 2. Copy dataset, apply overrides ke labels/*.txt
    DST_DATA.mkdir(exist_ok=True)
    n_changed, n_dropped = 0, 0
    for split in ["train", "val", "test"]:
        (DST_DATA/"images"/split).mkdir(parents=True, exist_ok=True)
        (DST_DATA/"labels"/split).mkdir(parents=True, exist_ok=True)
        for img in (SRC_DATA/"images"/split).glob("*.jpg"):
            shutil.copy2(img, DST_DATA/"images"/split/img.name)
            lbl = SRC_DATA/"labels"/split/(img.stem + ".txt")
            new_lines = []
            for i, line in enumerate(lbl.read_text().strip().splitlines()):
                parts = line.split()
                cls = int(parts[0])
                key = (img.stem, i)
                if key in overrides:
                    new_cls = overrides[key]
                    if new_cls is None:
                        n_dropped += 1; continue
                    if new_cls != cls:
                        n_changed += 1
                        parts[0] = str(new_cls)
                new_lines.append(" ".join(parts))
            (DST_DATA/"labels"/split/(img.stem + ".txt")).write_text("\n".join(new_lines))
    # Copy data.yaml dengan path direvisi
    yaml_text = (SRC_DATA/"data.yaml").read_text().replace(
        str(SRC_DATA.resolve()), str(DST_DATA.resolve()))
    (DST_DATA/"data.yaml").write_text(yaml_text)
    print(f"Changed labels: {n_changed} | Dropped (tie): {n_dropped}")

if __name__ == "__main__":
    main()
```

> **Catatan:** Hanya 228/854 pohon punya JSON, jadi consensus hanya menyentuh subset bbox. Tetap berguna sebagai **proxy**: kalau gain mAP signifikan walau hanya 26.7% data tersentuh → label noise jelas penyebab.

**Pendekatan B — Training-Time Consistency Loss (PRIORITAS 2)**

Sample batch yang berisi pasangan view dari pohon yang sama (custom sampler). Tarik logit cls antara bbox yang link via JSON:

```
L_consist(a, b) = KLDiv(softmax(logits_a / T), softmax(logits_b / T)) * T^2
L_total = L_yolo + λ_consist * L_consist
```

Default: T=2.0, λ_consist=1.0. Hanya aktif untuk bbox yang punya cross-view link di JSON.

Skema:
1. Custom `MultiViewSampler` — setiap batch sampling 50% pasangan (view_a, view_b) dari pohon dengan JSON
2. Custom `KDLoss`-style hook — setelah forward kedua view, identifikasi bbox match via JSON, hitung KLDiv pada cls logits
3. Backward gabungan

Implementasi non-trivial — perlu modifikasi Ultralytics dataloader & loss. Estimasi 1–2 hari coding.

**Pendekatan C — Multi-View Cross-Attention Head (PRIORITAS 3, stretch)**

Forward 4 view bersamaan → classification head menerima feature pool dari semua view via cross-attention. Lebih dalam tapi kompleks. Skip dulu, evaluasi setelah B mature.

### 28.2 Mengapa Pendekatan A Dulu

- Cheap (re-run baseline = sudah ada infra dari Section 16)
- Falsifiable cepat — kalau A gagal, B/C kemungkinan juga tidak break ceiling
- Tidak butuh ubah arsitektur Ultralytics

---

## 29. Eksperimen Falsifiable JSON-Aware

| Exp ID | Hipotesis falsifiable | Cara verifikasi | Slice metric utama | Cost |
|---|---|---|---|---|
| **JSON-01** | B2/B3 cross-view inconsistency rate >> B1/B4 (label-ceiling) | Run Section 27 audit script | Inconsistency rate per kelas + leak pair matrix | ~5 menit, no GPU |
| **JSON-02** | Pendekatan A (consensus relabel) menaikkan mAP50-95 vs AR29 dengan margin > bootstrap CI | Section 28 Pendekatan A, re-train YOLO11l 640 b16 (replikasi AR29 setup), val standar | mAP50-95 overall + per-class B2/B3 + bootstrap CI | ~6 jam GPU |
| **JSON-03** | Merge B2+B3 jadi 1 kelas ("B23") menaikkan mAP B1/B4 karena task lebih mudah | Train 3-class YOLO11l 640 b16 (B1, B23, B4); evaluasi mAP B1/B4 vs baseline 4-class | mAP50-95 B1, B4, B23-merged + per-domain breakdown | ~6 jam GPU |
| **JSON-04** | Pendekatan B (consistency loss) > Pendekatan A pada slice multi-view | Custom training (Section 28-B); eval pada 228 pohon dengan JSON | mAP50-95 + cross-view prediction agreement rate | ~12 jam GPU + 1-2 hari coding |
| **JSON-05** | Multi-view post-inference dedup (pipeline Section 23) menurunkan count MAE vs sum naif | Run Section 23 MultiViewAggregator; bandingkan ke baseline = sum count per view | Count MAE per kelas per pohon (228 pohon GT) | ~2 jam, no train |

### 29.1 Stop Criteria

- **JSON-01 hasil rendah inconsistency** (< 5% di B2/B3) → label-ceiling **falsified**; JSON tidak akan menyelesaikan B2/B3 confusion. Lanjut hanya JSON-05 untuk Stage 2 deliverable; angle B2/B3 tidak punya solusi struktural di workspace ini → laporkan sebagai irreducible noise.
- **JSON-01 confirmed tinggi tapi JSON-02 tidak naik** > 0.005 mAP50-95 vs AR29 → label noise nyata tapi consensus tidak cukup; coba JSON-03.
- **JSON-03 menunjukkan B1/B4 mAP naik signifikan saat B2/B3 di-merge** → pertimbangkan **task reframing**: produk akhir = 3-class (B1, B23, B4) atau ordinal regression dengan tolerance ±1 step. Diskusikan dengan stakeholder apakah deliverable bisa diubah.
- **Semua JSON-01..04 negatif** → bottleneck struktural lebih dalam dari label/multi-view (misalnya keterbatasan resolusi sensor, occlusion fundamental); rekomendasi pivot ke koleksi data tambahan atau setup berbeda (close-up shots, multi-angle drone, dll.).

### 29.2 Wajib dilakukan tiap eksperimen JSON

- **Bootstrap CI 95%** vs AR29 (n_boot=2000)
- **Per-domain breakdown** (DAMIMAS vs LONSUM) — laporkan terpisah
- **Per-class mAP50-95** — bukan hanya overall
- **Per-size bucket** untuk B4 (small/medium berdasarkan rel_area threshold dari Section 3.4 audit)

---

## 30. Updated Ablation Matrix & Decision Tree (Override Section 20)

### 30.1 Matrix Aktif

| Exp ID | Tujuan | Status | Compare to |
|---|---|---|---|
| AR29 | Baseline standard val | **Confirmed** = 0.264 mAP50-95 | – |
| AR34 | Upper-bound train+test | **Confirmed** = 0.269 mAP50-95 | – |
| **JSON-01** | Label audit cross-view | **TODO (run dulu, cheap)** | – |
| **JSON-02** | Consensus relabel re-train | TODO (kalau JSON-01 → label-ceiling) | AR29 |
| **JSON-03** | 3-class B23-merged | TODO (kalau JSON-02 belum break) | AR29 (B1/B4 only) |
| **JSON-04** | Consistency loss training | TODO (kalau JSON-02 promising) | JSON-02 |
| **JSON-05** | Multi-view inference dedup | TODO (independent, paralel) | Baseline = naive sum |

### 30.2 Decision Tree Baru

```
JSON-01  (cheap, ~5 menit, no GPU)
   │
   ├── B2/B3 inconsistency > 15% & B1/B4 < 5%
   │     → label-ceiling kuat
   │     ↓
   │   JSON-02  (consensus relabel + retrain ~6 jam)
   │     ├── mAP50-95 naik > AR29 + 0.005 (CI overlap clear)
   │     │     → adopt sebagai label cleanup baseline
   │     │     → coba JSON-04 untuk push lebih jauh
   │     │
   │     └── tidak naik / dalam noise CI
   │           ↓
   │         JSON-03  (3-class merge ~6 jam)
   │           ├── B1/B4 mAP naik signifikan saat task disederhanakan
   │           │     → reframe task ke 3-class (atau ordinal ±1 tolerance)
   │           │     → diskusi stakeholder soal deliverable
   │           │
   │           └── tetap tidak naik
   │                 → bottleneck di luar label, kemungkinan data quality / resolusi
   │                 → pivot: koleksi data baru atau setup sensor berbeda
   │
   ├── B2/B3 inconsistency ~ B1/B4 (5–10%)
   │     → label OK; angle JSON tidak menolong B2/B3
   │     ↓
   │   skip JSON-02/03/04, langsung JSON-05 untuk Stage 2 deliverable
   │   B2/B3 ceiling = irreducible noise → laporkan honest
   │
   └── inconsistency rendah semua kelas
         → JSON tidak relevan untuk label noise
         → tetap jalankan JSON-05 sebagai Stage 2 deliverable saja
```

### 30.3 Reporting Template untuk Setiap JSON-XX Run

Wajib ada di `reports/json_xx/summary.md`:

```markdown
# Exp JSON-XX
- Date: YYYY-MM-DD
- Hypothesis: [text falsifiable]
- Setup: model, imgsz, batch, epochs, label source
- Compare to: AR29 / AR34 / JSON-YY

## Results
| Metric | This run | Baseline | Δ | Bootstrap 95% CI | Significant? |
|---|---|---|---|---|---|
| mAP50-95 overall | – | 0.264 | – | [lo, hi] | yes/no |
| mAP50-95 B1 | – | – | – | – | – |
| mAP50-95 B2 | – | – | – | – | – |
| mAP50-95 B3 | – | – | – | – | – |
| mAP50-95 B4 | – | – | – | – | – |
| DAMIMAS subset mAP | – | – | – | – | – |
| LONSUM subset mAP | – | – | – | – | – |

## Decision
- [ ] Hypothesis confirmed → next: ...
- [ ] Hypothesis falsified → close branch
- [ ] Inconclusive → ...

## Caveats
- ...
```

### 30.4 Yang TIDAK Boleh Dilakukan Lagi (Reminder)

Per CONTEXT.md Section 6 — jangan re-run kombinasi knob ini tanpa angle baru:
- imgsz 800, scale 0.7, BOX/CLS/DFL tweak, lr sweep, SGD vs AdamW, copy_paste, label_smoothing, model soup, long-run brute force
- Naive oversampling B1/B4
- HSV-only branch
- SAHI pada setup lama (versi baru Section 21 dengan model JSON-aware OK untuk evaluasi B4 spesifik)
- Two-stage 4-class classifier (DINOv2 CE/CORN, EfficientNet, hierarchical)
- YOLOv9e, RT-DETR-L, RF-DETR DINOv2, YOLO11x train+test sebagai jalan utama

Section 14–22 di Bagian II tetap valid sebagai **infra reference** (env setup, mobile export, eval skrip) — bukan sebagai jalur eksperimen baru.


===== NAMING.md =====

# NAMING.md — Method Naming Convention

**Effective:** 2026-05-10. All method names follow `M<NN>_<family>_<descriptor>`.

Hard rename (no aliases). Old names removed from code. Historical CSV snapshots preserved at `archive/reports_pre_rename_2026-05-10/`.

## Stability Rule

- `Mxx` IDs **assigned once, never re-shuffled.**
- New methods get `M(max+1)`.
- Initial assignment ranking-based on **953-tree benchmark (2026-05-10)**, tie-break by MAE ascending.
- Numeric order is **not** an ongoing ranking — read accuracy from CSV / docs.

## Family Glossary

| Family | Meaning |
|---|---|
| `selector` | Routes per regime to sub-algorithms |
| `blend` | Weighted / geometric composite of multiple estimators |
| `weight` | Geometric weighting (visibility, coverage) |
| `divide` | Global / adaptive divisor correction |
| `entropy` | Entropy-modulated divisor |
| `stack` | Stacking with bracket / density correction |
| `boost` | Per-class multiplier |
| `median` | Median-based aggregation |
| `consensus` | Multi-estimator voting |
| `anchor` | Floor-anchored specialist |
| `ordinal` | Ordinal class correction |
| `agree` | Side-agreement ratio |
| `baseline` | Reference floor (naive sum, strict match) |

## Mapping Table — Old → New (29 methods)

| New ID | New Name | Old Name(s) | Acc±1 (953) | MAE | Source File |
|:--:|---|---|:--:|:--:|---|
| M01 | `M01_selector_b2b3` | `selector_with_b2b3` | 86.67% | 0.3982 | `algorithms/M01_selector_b2b3.py` |
| M02 | `M02_selector_trifurc` | `selector_iter9_trifurc` | 86.67% | 0.3987 | `algorithms/M02_selector_trifurc.py` |
| M03 | `M03_blend_geometric` | `geometric_mean_blend` | 86.15% | 0.3961 | `algorithms/M03_blend_geometric.py` |
| M04 | `M04_blend_floor_clamped` | `floor_clamped_hybrid` | 86.04% | 0.4050 | `algorithms/M04_blend_floor_clamped.py` |
| M05 | `M05_blend_vis_divide` | `hybrid_vis_corr` | 86.04% | 0.4077 | `algorithms/M05_blend_vis_divide.py` |
| M06 | `M06_weight_visibility` | `visibility` / `v2_visibility` / `visibility_count` | 85.94% | 0.3960 | `algorithms/M06_weight_visibility.py` |
| M07 | `M07_weight_coverage` | `side_coverage` | 85.94% | 0.3930 | `algorithms/M07_weight_coverage.py` |
| M08 | `M08_divide_density_vis` | `density_scaled_vis` | 85.94% | 0.4020 | `algorithms/M08_divide_density_vis.py` |
| M09 | `M09_median_strong5` | `v9_median_strong5` / `median_strong5` | 85.73% | 0.4010 | `algorithms/M09_median_strong5.py` |
| M10 | `M10_entropy_divide` | `v8_entropy_modulated` / `entropy_modulated` | 84.78% | 0.4510 | `algorithms/M10_entropy_divide.py` |
| M11 | `M11_median_b2` | `v9_b2_median_v6` / `b2_median_v6` | 84.78% | 0.4290 | `algorithms/M11_median_b2.py` |
| M12 | `M12_selector_overrides` | `v9_selector` ⚠ overfits 228 | 84.68% | 0.4410 | `algorithms/M12_selector_overrides.py` |
| M13 | `M13_stack_bracket` | `v7_stacking_bracketed` / `stacking_bracketed` | 84.58% | 0.4280 | `algorithms/M13_stack_bracket.py` |
| M14 | `M14_stack_density` | `v7_stacking_density` / `stacking_density` | 84.58% | — | `algorithms/M14_stack_density.py` |
| M15 | `M15_divide_global` | `corrected` / `v1_corrected` / `corrected_naive` | 84.37% | 0.4160 | `algorithms/M15_divide_global.py` |
| M16 | `M16_boost_b2b4` | `v8_b2_b4_boosted` / `b2_b4_boosted` | 84.37% | — | `algorithms/M16_boost_b2b4.py` |
| M17 | `M17_selector_regime` | `v6_selector` | 84.26% | 0.4440 | `algorithms/M17_selector_regime.py` |
| M18 | `M18_entropy_stack` | `v8_entropy_stacking` | — | — | wrapper in `dedup_all_953.py` |
| M19 | `M19_divide_adaptive` | `adaptive_corrected` / `v5_adaptive_corrected` | 82.58% | 0.4600 | `algorithms/M19_divide_adaptive.py` |
| M20 | `M20_weight_visibility_grid` | `best_visibility_grid` / `v5_best_visibility` | 80.80% | 0.4600 | `algorithms/M20_weight_visibility_grid.py` |
| M21 | `M21_ordinal_b3` | `v7_ordinal_b3` / `ordinal_b3` | low | — | `algorithms/M21_ordinal_b3.py` |
| M22 | `M22_anchor_floor50` | `v8_floor_anchor_50` / `floor_anchor_50` | — | — | `algorithms/M22_anchor_floor50.py` |
| M23 | `M23_agree_side` | `v8_side_agreement` / `side_agreement` | — | — | `algorithms/M23_agree_side.py` |
| M24 | `M24_weight_class_aware` | `class_aware_vis` | 70.93% | 0.5460 | `algorithms/M24_weight_class_aware.py` |
| M25 | `M25_consensus_multi` | `v8_multi_consensus` / `multi_consensus` | 18.86% | — | `algorithms/M25_consensus_multi.py` |
| M26 | `M26_median_per_side` | `v8_per_side_median` / `per_side_median` | 18.86% | — | `algorithms/M26_median_per_side.py` |
| M27 | `M27_weight_visibility_adaptive` | `adaptive_visibility` | — | — | `algorithms/M27_weight_visibility_adaptive.py` |
| M28 | `M28_baseline_match_strict` | `relaxed_match` | 5.98% | 1.8110 | `algorithms/M28_baseline_match_strict.py` |
| M29 | `M29_baseline_naive_sum` | `naive` | 3.99% | 2.2800 | `algorithms/M29_baseline_naive_sum.py` |

**Note:** `relaxed_match` renamed `M28_baseline_match_strict` — old name was misleading (algorithm is strict-Hungarian; "relaxed" referred only to internal threshold tolerance).

## Adding a New Method

1. Pick the next available ID (`M30`, `M31`, ...).
2. Choose family from glossary (or extend glossary if genuinely new family).
3. Choose descriptor (lowercase, snake_case, ≤3 words).
4. Create `algorithms/M<NN>_<family>_<descriptor>.py` exporting `predict(detections, params=None) -> dict`.
5. Register in `scripts/dedup_brand_new_953.py` METHOD_GROUPS.
6. Append row to mapping table above.

## Cross-Imports (for refactor sanity)

- `M01_selector_b2b3` self-contained (calls own internal helpers)
- `M02_selector_trifurc` self-contained
- `M11_median_b2`, `M12_selector_overrides`, `M09_median_strong5` import `M17_selector_regime` (load_params + predict)
- `M12_selector_overrides` also imports `M13_stack_bracket`, `M16_boost_b2b4`, `M22_anchor_floor50`


===== report_10Mei2026.md =====

# Laporan Eksperimen 10 Mei 2026 — `M01_selector_b2b3`

> **Catatan penamaan (efektif 2026-05-10):** dokumen ini ditulis sebelum
> rename ke skema `Mxx_*`. Nama lama seperti "selector_with_b2b3" /
> "hybrid_vis_corr" / "geometric_mean_blend" sudah diganti otomatis.
> Lihat [`NAMING.md`](NAMING.md) untuk tabel pemetaan lengkap.

Iterasi 1–13 pada folder [`exp_10 May 2026/`](archive/_to_review/exp_10%20May%202026/) berakhir
pada algoritma **`M01_selector_b2b3`** sebagai metode terbaik baru untuk
benchmark 953 pohon Brand-New-Dataset-YOLO.

Kode produksi tersedia di [`algorithms/M01_selector_b2b3.py`](algorithms/M01_selector_b2b3.py).

---

## Hasil akhir

### Metrik primer

| Metrik | Nilai | Sumber |
|---|---:|---|
| `Acc ±1` (all 953) | **86,67%** | `reports/dedup_brand_new_953/accuracy_953.csv` |
| `MAE` | **0,3982** | `reports/dedup_brand_new_953/accuracy_953.csv` |
| Pohon gagal | **127** | dari 953 |
| `Acc ±1` train | 87,34% | held-out |
| `Acc ±1` val | 82,58% | held-out |
| `Acc ±1` test | 88,62% | held-out |
| `worst_drop` | 0,00 pp | tidak overfit |

Improvement vs juara sebelumnya `M05_blend_vis_divide` (86,04% / MAE 0,4077):
**+0,63 pp Acc±1**, **−2,32% MAE**.

### Enam metrik mandatory lengkap

Berdasarkan `reports/dedup_brand_new_953/accuracy_953.csv` (run terbaru, 2026-05-10):

| Metrik | `M01_selector_b2b3` | `M03_blend_geometric` | `M05_blend_vis_divide` |
|---|---:|---:|---:|
| **MAE per kelas** | | | |
| &nbsp;&nbsp;B1 | 0,1805 | 0,1752 | 0,2078 |
| &nbsp;&nbsp;B2 | 0,3463 | 0,3379 | 0,3400 |
| &nbsp;&nbsp;B3 | **0,7566** | 0,7671 | 0,7692 |
| &nbsp;&nbsp;B4 | 0,3095 | 0,3043 | 0,3137 |
| **Macro class-MAE** | 0,3982 | 0,3961 | 0,4077 |
| **Exact-profile accuracy** | 26,34% | 26,86% | 25,29% |
| **Total-count MAE** | 1,4145 | 1,4061 | 1,4145 |
| **Total ±1 accuracy** | 74,08% | 74,50% | 73,98% |
| **Per-class mean error (bias)** | | | |
| &nbsp;&nbsp;B1 | +0,1448 | +0,1417 | +0,1910 |
| &nbsp;&nbsp;B2 | +0,1763 | +0,1322 | +0,1343 |
| &nbsp;&nbsp;B3 | +0,1689 | +0,1522 | +0,1605 |
| &nbsp;&nbsp;B4 | −0,1039 | −0,1700 | −0,1794 |

**Temuan dari metrik lengkap:**
- **B3 adalah bottleneck** — MAE B3 (0,7566) mendominasi total error. Bahkan jika B3 sempurna, macro class-MAE masih ~0,21 (lihat iter13 analysis).
- **Exact-profile accuracy rendah** (26,34%) karena kesalahan off-by-1 pada satu atau dua kelas sangat umum — hanya ~26% pohon yang prediksi semua 4 kelas-nya tepat sama dengan ground truth.
- **Total ±1 accuracy lebih tinggi** (74,08%) — meskipun profil per kelas sering meleset sedikit, total keseluruhan tandan per pohon lebih sering tepat.
- **Semua metode top memiliki bias positif pada B1–B3** (overcount sistematis) dan **bias negatif pada B4** (undercount). Ini menunjukkan bahwa deteksi naive cenderung mengklasifikasikan tandan ke B1/B2/B3 daripada B4.

---

## Perbandingan kandidat iter11

| Metode | Acc±1 (all) | MAE | train | val | test |
|---|---:|---:|---:|---:|---:|
| `b2b3_iter9_split` | 86,67% | 0,3982 | 87,34% | 82,58% | 88,62% |
| **`M01_selector_b2b3`** | **86,67%** | **0,3982** | 87,34% | 82,58% | 88,62% |
| `iter9_baseline` | 86,67% | 0,3987 | 87,34% | 82,58% | 88,62% |
| `mode5` | 85,94% | 0,3930 | 86,35% | 83,15% | 87,43% |
| `median5` | 85,94% | 0,3930 | 86,35% | 83,15% | 87,43% |
| `b2b3_med_split` | 85,94% | 0,3930 | 86,35% | 83,15% | 87,43% |
| `trim5` | 85,94% | 0,3956 | 86,35% | 83,15% | 87,43% |
| `class_specialist` | 85,94% | 0,3959 | 86,68% | 82,02% | 87,43% |

Sumber: [`exp_10 May 2026/iter11_results.csv`](archive/_to_review/exp_10%20May%202026/iter11_results.csv).

---

## Inti algoritma

Dua tahap:

1. **Selector trifurkasi** (`M02_selector_trifurc`) memilih estimator
   dasar per profil pohon:
   - `b3frac ≥ 0,60` dan `n_total ≥ 25` → `median3_floor`
   - `naive_B1 ≥ 3` dan `b3frac < 0,45` dan `naive_B4 < 10` → `M19_divide_adaptive`
   - lainnya → `M03_blend_geometric`
2. **Koreksi split B2↔B3**: total `B2 + B3` dipertahankan, rasio
   dialokasikan ulang menurut frekuensi naive B2/B3. Menjawab ambiguitas
   visual B2↔B3 yang menyebabkan kesalahan kelas tetapi bukan kesalahan
   jumlah.

Pseudokode ringkas:

```
pred = M02_selector_trifurc(detections)
joint = pred["B2"] + pred["B3"]
if joint > 0 and ada B2 atau B3 di detections:
    frac_b3 = n_b3 / (n_b2 + n_b3)
    pred["B3"] = max(round(joint * frac_b3), max_per_side("B3"))
    pred["B2"] = max(joint - pred["B3"],     max_per_side("B2"))
return pred
```

Implementasi lengkap di [`algorithms/M01_selector_b2b3.py`](algorithms/M01_selector_b2b3.py).

---

## Mengapa target Acc±1 ≥ 90% / MAE < 0,2 tidak dicapai

Pembuktian dari [`exp_10 May 2026/iter13_FINAL_HONEST_STOP.md`](archive/_to_review/exp_10%20May%202026/iter13_FINAL_HONEST_STOP.md):

**MAE per-kelas pada `M01_selector_b2b3`:**

| Kelas | MAE | Distribusi err 0 / 1 / ≥2 |
|---|---:|---|
| B1 | 0,179 | 822 / 106 / 25 |
| B2 | 0,346 | 730 / 178 / 45 |
| B3 | **0,757** | 490 / 372 / 91 |
| B4 | 0,310 | 700 / 225 / 28 |

- Bahkan jika B3 sempurna (MAE B3 = 0), total MAE = 0,209 — masih >0,2.
- Oracle ceiling realistik (toolkit penuh, tanpa overfit risk) = **89,61%**,
  di bawah target 90%.
- 99–118 pohon `structural hard` karena ambiguitas B2↔B3 iredusibel
  (bukan derau label — JSON-01 audit mengkonfirmasi label noise = 0%).

Loop 13 iterasi dihentikan jujur: target user **tidak dapat dicapai**
dalam constraint riset (no training, no embedding) tanpa overfit.

---

## Iterasi yang dilakukan

| Iter | Tujuan | Outcome |
|---|---|---|
| 1 | Ensemble 3-estimator | winner (M03_blend_geometric) |
| 2 | Failure analysis | analisis (CSV residual) |
| 3 | Cross-validated corrections | zero-improvement (honest report) |
| 4 | Split analysis | winner (split-aware base) |
| 5 | Geo extensions | zero-improvement |
| 6 | Disagreement mining | analisis |
| 7 | Selector iter9 trifurkasi | winner |
| 8 | Multi-selector refinement | winner (refined trifurc) |
| 9 | Final benchmark iter9 | winner (86,67%) |
| 10 | Oracle ceiling analysis | 90,14% toolkit, 89,61% realistic |
| 11 | Mode-vote + b2b3 split | **winner final → `M01_selector_b2b3`** |
| 12 | Total-first reformulation | zero-improvement |
| 13 | MAE breakdown + stop | mathematical proof, loop dihentikan |

Detail tiap iterasi di [`exp_10 May 2026/iter*_report.md`](archive/_to_review/exp_10%20May%202026/).

---

## Cara pemakaian

```python
from algorithms.M01_selector_b2b3 import predict

dets = [
    {"class": "B3", "x_norm": 0.5, "y_norm": 0.4, "side_index": 0},
    # ... deteksi lainnya dari semua sisi pohon
]
counts = predict(dets)
# {"B1": int, "B2": int, "B3": int, "B4": int}
```

Tidak perlu `params` — semua konstanta sudah di-bake ke modul.


===== Brand-New-Dataset-YOLO/README.md =====

---
annotations_creators:
- expert-generated
language:
- en
size_categories:
- 1K<n<10K
task_categories:
- object-detection
pretty_name: SawitMVC
tags:
- oil-palm
- agriculture
- yolo
- multi-view
- bunch-counting
- maturity-classification
- palm-oil
- computer-vision
- deduplication
- counting
---

# SawitMVC

SawitMVC is a multi-view oil palm fruit bunch detection and counting dataset. It contains expert-reviewed YOLO annotations and per-tree JSON ground truth for counting unique fruit bunches across 4-8 camera views.

## Dataset Summary

| Property | Value |
|---|---|
| Trees | **953** (DAMIMAS: 854, LONSUM: 99) |
| Images | **3,992** (960 x 1280 px, JPEG) |
| Views per tree | 4 sides (45 trees have 8 sides) |
| Annotation format | YOLO v8 labels + JSON ground truth |
| Classes | 4 maturity levels (B1-B4) |
| Unique bunches (GT) | 9,823 |

## Tasks

1. **Object detection**: detect and classify oil palm fruit bunches in each image.
2. **Multi-view counting**: use JSON ground truth to count each physical bunch once even when it appears in multiple camera views.

## Maturity Classes

| Class ID | Label | Stage | Description |
|:---:|:---:|---|---|
| 0 | **B1** | Ripe | Red, large, round; optimal harvest stage |
| 1 | **B2** | Transitioning | Dark fruit transitioning to red |
| 2 | **B3** | Unripe | Black, spiny, elongated |
| 3 | **B4** | Very unripe | Small, deeply positioned, black to green |

Biological order: **B1 -> B2 -> B3 -> B4** from most ripe to least ripe.

## Sample Visualization

Each color represents one unique bunch. The same color across panels means the same physical bunch appears from multiple sides.

**4-view tree:**
![4-view multi-view sample with cross-view bunch pairing](sample_4view_DAMIMAS_A21B_0140.jpg)

**8-view tree:**
![8-view multi-view sample with cross-view bunch pairing](sample_8view_DAMIMAS_A21B_0823.jpg)

## Dataset Structure

```text
SawitMVC/
|-- images/                    # 3,992 images, flat structure
|-- labels/                    # 3,992 YOLO .txt files, flat structure
|-- json/                      # 953 JSON ground-truth files, one per tree
|-- data/
|   `-- ground_truth.parquet   # Per-tree ground-truth summary
|-- data.yaml                  # YOLO dataset config
|-- split_manifest.csv         # Tree-level split and stratification metadata
`-- croissant.json             # ML Croissant metadata
```

## File Naming

```text
DAMIMAS_A21B_0001_1.jpg  -> variety=DAMIMAS, code=A21B, tree=0001, side=1
DAMIMAS_A21B_0001_1.txt  -> YOLO label for the same image
DAMIMAS_A21B_0001.json   -> ground truth for all views of tree 0001
```

## YOLO Label Format

```text
# class_id  cx_norm  cy_norm  w_norm  h_norm
2           0.660417 0.408203 0.056250 0.041406
1           0.622396 0.443750 0.098958 0.087500
```

Coordinates are normalized to `[0, 1]` relative to a 960 x 1280 image. Class IDs are `0=B1`, `1=B2`, `2=B3`, `3=B4`.

## JSON Ground Truth Format

```json
{
  "version": 4,
  "tree_id": "DAMIMAS_A21B_0001",
  "split": "train",
  "metadata": {
    "date": "2026-05-16",
    "variety": "DAMIMAS"
  },
  "images": {
    "side_1": {
      "filename": "DAMIMAS_A21B_0001_1.jpg",
      "side_index": 0,
      "side_label": "Side 1",
      "bbox_count": 5,
      "annotations": [
        {
          "box_index": 0,
          "class_id": 2,
          "class_name": "B3",
          "bbox_yolo": [0.660417, 0.408203, 0.05625, 0.041406]
        }
      ]
    }
  },
  "bunches": [
    {
      "bunch_id": 1,
      "class": "B3",
      "appearance_count": 2,
      "appearances": [
        {"side": "side_1", "side_index": 0, "box_index": 0},
        {"side": "side_2", "side_index": 1, "box_index": 2}
      ]
    }
  ],
  "summary": {
    "total_unique_bunches": 8,
    "total_detections": 17,
    "duplicates_linked": 9,
    "by_class": {"B1": 1, "B2": 2, "B3": 5, "B4": 0},
    "by_side": {"side_1": 5, "side_2": 4, "side_3": 4, "side_4": 4}
  }
}
```

`summary.by_class` is the ground truth for counting evaluation. `_confirmedLinks` stores annotator-confirmed cross-view links using numeric `sideA`, `sideB`, `bboxIdA`, and `bboxIdB` references.

## Parquet Ground Truth

`data/ground_truth.parquet` contains one row per tree.

Columns: `tree_id, split, variety, num_sides, total_unique_bunches, B1, B2, B3, B4, total_detections, duplicates_linked`

Example query:

```sql
SELECT variety, AVG(total_unique_bunches) AS avg_bunches,
       SUM(B1) AS total_B1, SUM(B2) AS total_B2,
       SUM(B3) AS total_B3, SUM(B4) AS total_B4
FROM ground_truth
GROUP BY variety;
```

## Usage

```python
from datasets import load_dataset

ds = load_dataset("ULM-DS-Lab/SawitMVC", data_dir="images")
gt = load_dataset("ULM-DS-Lab/SawitMVC", data_files="data/ground_truth.parquet")
```

```python
import json
from pathlib import Path

tree = json.loads(Path("json/DAMIMAS_A21B_0001.json").read_text(encoding="utf-8-sig"))
gt = tree["summary"]["by_class"]
total = tree["summary"]["total_unique_bunches"]
```

## YOLO Training

```bash
yolo detect train data=data.yaml model=yolov8n.pt epochs=100 imgsz=960
```

## Dataset Collection

- **Source:** Field surveys at DAMIMAS and LONSUM palm oil plantations in Indonesia
- **Capture:** Smartphone cameras, 4-8 positions per tree
- **Annotation:** Expert agronomists using multi-view cross-referencing
- **Resolution:** 960 x 1280 pixels
- **Date:** February 2026

## Citation

```bibtex
@dataset{ulm_sawitmvc_2026,
  title     = {SawitMVC},
  author    = {Fatma Indriani and Setyo Wahyu Saputro and Alia Rahmi and Dwi Kartini and Triando Hamonangan Saragih and Naufal Said and Hartoni},
  year      = {2026},
  publisher = {Hugging Face},
  url       = {https://huggingface.co/datasets/ULM-DS-Lab/SawitMVC}
}
```

## License

This dataset is released under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.

You may share and adapt the dataset for non-commercial purposes with appropriate attribution. Commercial use is not permitted.



===== EDA_report/SUMMARY.md =====

# EDA Report - Brand-New-Dataset-YOLO

## Scope
- Source: `Brand-New-Dataset-YOLO/`
- JSON GT files analyzed from `json/*.json`
- Label detections analyzed from `labels/*.txt`
- Split metadata from `split_manifest.csv`
- Optional parquet read from `data/ground_truth.parquet`

## Global Counts
- Trees (JSON): **953**
- Unique bunches: **9,823**
- Annotation rows (YOLO-like entries in JSON images): **18,540**
- Confirmed links: **8,717**

## Side Distribution (Trees)
- 4 sides: 908 trees
- 8 sides: 45 trees

## Appearance Distribution (Unique Bunches) — per tree-type

Theoretical max appearance = `n_sides` (camera positions). Empty buckets shown explicitly.

### 4-side trees (n_bunches=9,278, theoretical_max=4)
- appearance_count=1: 2,394 (25.8%)
- appearance_count=2: 6,165 (66.4%)
- appearance_count=3: 719 (7.7%)
- appearance_count=4: 0 (0.0%)

### 8-side trees (n_bunches=545, theoretical_max=8)
- appearance_count=1: 101 (18.5%)
- appearance_count=2: 99 (18.2%)
- appearance_count=3: 115 (21.1%)
- appearance_count=4: 147 (27.0%)
- appearance_count=5: 71 (13.0%)
- appearance_count=6: 12 (2.2%)
- appearance_count=7: 0 (0.0%)
- appearance_count=8: 0 (0.0%)

## Unique Side Count Distribution — per tree-type

### 4-side trees (n_bunches=9,278, theoretical_max=4)
- unique_side_count=1: 2,394 (25.8%)
- unique_side_count=2: 6,165 (66.4%)
- unique_side_count=3: 719 (7.7%)
- unique_side_count=4: 0 (0.0%)

### 8-side trees (n_bunches=545, theoretical_max=8)
- unique_side_count=1: 101 (18.5%)
- unique_side_count=2: 99 (18.2%)
- unique_side_count=3: 115 (21.1%)
- unique_side_count=4: 147 (27.0%)
- unique_side_count=5: 71 (13.0%)
- unique_side_count=6: 12 (2.2%)
- unique_side_count=7: 0 (0.0%)
- unique_side_count=8: 0 (0.0%)

## Same-side Duplicates
- Bunches with 0 same-side duplicates: **9,823** / 9,823
- Bunches with ≥1 same-side duplicate: **0** (GT clean post-fix 2026-05-16)

## Key Anomaly Counters
- Bunches with `appearance_count > 4`:
  - 4-side trees: **N/A** (theoretical max = 4)
  - 8-side trees: **83** / 545 (15.2%)
- Bunches with `appearance_count > tree_n_sides` (impossible): **0**
- Rows in `tables/mismatches.csv`: **0**
- Rows in `tables/appearance_gt_tree_sides_cases.csv`: **0**

## Per-tree Yield Statistics
|   n_sides |   n_trees |   unique_mean |   unique_median |   unique_std |   det_mean |   det_median |   det_per_unique_mean |   det_per_unique_median |
|----------:|----------:|--------------:|----------------:|-------------:|-----------:|-------------:|----------------------:|------------------------:|
|         4 |       908 |         10.22 |              10 |         3.71 |      18.59 |           19 |                 1.845 |                   1.833 |
|         8 |        45 |         12.11 |              12 |         3.89 |      36.87 |           38 |                 3.107 |                   3.062 |

## Integrity Audit (JSON/TXT/Image)
- Side rows audited: **3,992**
- Missing images: **0**
- Missing labels: **0**
- JSON vs label count exact match: **100.00%**
- JSON vs bbox_count exact match: **100.00%**
- JSON vs summary.by_side exact match: **100.00%**

## Link-Graph Diagnostics
- Trees with cycle_rank > 0: **0**
- Max cycle_rank: **0**
- Max graph degree: **2**

## Class Distribution
- JSON unique bunch B1: 954
- JSON unique bunch B2: 1,791
- JSON unique bunch B3: 5,067
- JSON unique bunch B4: 2,011

### Class Mix per Tree-Type (4-side vs 8-side)
|   n_sides |   n_trees |   B1_total |   B2_total |   B3_total |   B4_total |   B1_per_tree |   B2_per_tree |   B3_per_tree |   B4_per_tree |   B1_pct |   B2_pct |   B3_pct |   B4_pct |
|----------:|----------:|-----------:|-----------:|-----------:|-----------:|--------------:|--------------:|--------------:|--------------:|---------:|---------:|---------:|---------:|
|         4 |       908 |        898 |       1687 |       4756 |       1937 |         0.989 |         1.858 |         5.238 |         2.133 |     9.68 |    18.18 |    51.26 |    20.88 |
|         8 |        45 |         56 |        104 |        311 |         74 |         1.244 |         2.311 |         6.911 |         1.644 |    10.28 |    19.08 |    57.06 |    13.58 |

### Detection Distribution from labels/*.txt
- Label class 0 (B1): 2,032
- Label class 1 (B2): 3,500
- Label class 2 (B3): 9,701
- Label class 3 (B4): 3,307

## Split Summary (from JSON)
| split   |   B1 |   B2 |   B3 |   B4 |   total_unique_bunches |   total_detections |
|:--------|-----:|-----:|-----:|-----:|-----------------------:|-------------------:|
| test    |  163 |  283 |  890 |  378 |                   1714 |               3141 |
| train   |  667 | 1172 | 3240 | 1233 |                   6312 |              11926 |
| val     |  124 |  336 |  937 |  400 |                   1797 |               3473 |

## Top Trees by Detection-per-Unique-Bunch Ratio
| tree_id           | split   |   n_sides |   total_detections |   total_unique_bunches |   det_per_unique |
|:------------------|:--------|----------:|-------------------:|-----------------------:|-----------------:|
| DAMIMAS_A21B_0820 | train   |         8 |                 47 |                     10 |          4.7     |
| DAMIMAS_A21B_0836 | train   |         8 |                 36 |                      9 |          4       |
| DAMIMAS_A21B_0831 | train   |         8 |                 52 |                     13 |          4       |
| DAMIMAS_A21B_0818 | train   |         8 |                 40 |                     10 |          4       |
| DAMIMAS_A21B_0839 | val     |         8 |                 35 |                      9 |          3.88889 |
| DAMIMAS_A21B_0824 | val     |         8 |                 41 |                     11 |          3.72727 |
| DAMIMAS_A21B_0846 | train   |         8 |                 26 |                      7 |          3.71429 |
| DAMIMAS_A21B_0832 | train   |         8 |                 37 |                     10 |          3.7     |
| DAMIMAS_A21B_0815 | train   |         8 |                 51 |                     14 |          3.64286 |
| DAMIMAS_A21B_0848 | val     |         8 |                 25 |                      7 |          3.57143 |
| DAMIMAS_A21B_0826 | val     |         8 |                 21 |                      6 |          3.5     |
| DAMIMAS_A21B_0817 | val     |         8 |                 28 |                      8 |          3.5     |
| DAMIMAS_A21B_0814 | test    |         8 |                 24 |                      7 |          3.42857 |
| DAMIMAS_A21B_0812 | train   |         8 |                 40 |                     12 |          3.33333 |
| DAMIMAS_A21B_0850 | train   |         8 |                 43 |                     13 |          3.30769 |

## Sample Mismatch Cases (same bunch repeated in same side)
- No mismatch rows.

## split_manifest.csv quick checks
- Rows in split_manifest.csv: **953**
- Unique tree_id in split_manifest.csv: **953**

## ground_truth.parquet
- Rows: **953**
- Columns (11): `tree_id, split, varietas, num_sides, total_unique_bunches, B1, B2, B3, B4, total_detections, duplicates_linked`

## Outputs
- Tables: `EDA_report/tables/*.csv`
- Plots: `EDA_report/plots/*.png`
- This summary: `EDA_report/SUMMARY.md`
- Advanced stats: `statistical_drift_tests.csv`, `data_quality_scorecard.csv`, `tree_outlier_scores.csv`


===== EDA_report/ANOMALY_CASEBOOK.md =====

# Anomaly Casebook

Source: `EDA_report/tables/appearance_gt_tree_sides_cases.csv`

Cases where `appearance_count > tree_n_sides` with side-level evidence and `_confirmedLinks` edges touching the bunch.

Total cases: **0**

_No anomalies after GT cleanup (2026-05-16). All trees satisfy `appearance_count <= tree_n_sides`._


===== reports/audit_impossible_visibility/summary.md =====

# Audit: impossible bunch visibility (geometric adjacency rule)

## Rule

Bunch wajib punya appearance di **home side** (posisi fisik bunch).
Appearance lain harus dalam circular distance ≤ `max_dist` dari home.

| n_sides_total | max_dist (hop) | normal max sides | hard max sides |
|---:|---:|---:|---:|
| 4 | 1 | 2 | 3 |
| 8 | 3 | 4 | 6 |

## Results

- JSON scanned: 953
- Trees with violation: **0**
- Trees with warning only: 469
- Bunches violation: **0**
- Bunches warning: 802
- Trees skipped (n_sides not in [4, 8]): 0

## Violations

Bunch yg tidak punya geometric valid home — secara fisik mustahil.

(none)

## Warnings

Bunch valid (geometric OK) tapi pakai full reach — borderline normal.

| tree_id | bunch | class | sides_bunch | sides total | appearance_sides | valid_home |
|---|---:|:---:|:---:|:---:|---|:---:|
| DAMIMAS_A21B_0001 | 5 | B2 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0001 | 6 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0002 | 2 | B4 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0002 | 5 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0002 | 8 | B4 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0002 | 9 | B1 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0003 | 5 | B3 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0003 | 6 | B2 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0005 | 3 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0005 | 5 | B2 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0006 | 2 | B4 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0006 | 3 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0009 | 4 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0010 | 1 | B2 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0010 | 7 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0011 | 2 | B3 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0011 | 4 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0012 | 1 | B1 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0012 | 4 | B4 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0015 | 1 | B1 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0017 | 5 | B4 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0018 | 2 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0024 | 2 | B1 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0024 | 5 | B3 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0025 | 1 | B1 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0027 | 1 | B1 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0028 | 8 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0029 | 5 | B2 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0029 | 7 | B2 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0029 | 8 | B4 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0030 | 2 | B3 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0031 | 2 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0037 | 8 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0038 | 4 | B3 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0041 | 2 | B4 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0042 | 1 | B1 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0043 | 2 | B3 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0043 | 3 | B2 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0043 | 5 | B3 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0046 | 2 | B3 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0046 | 6 | B4 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0047 | 1 | B2 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0048 | 1 | B3 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0048 | 6 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0049 | 2 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0050 | 6 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0052 | 8 | B1 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0054 | 3 | B2 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0054 | 4 | B3 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0058 | 1 | B1 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0058 | 2 | B3 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0059 | 1 | B1 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0059 | 2 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0060 | 1 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0060 | 2 | B3 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0060 | 3 | B3 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0061 | 5 | B3 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0062 | 1 | B2 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0062 | 3 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0062 | 5 | B2 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0064 | 4 | B2 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0065 | 1 | B1 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0067 | 3 | B1 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0067 | 6 | B4 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0068 | 3 | B3 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0069 | 1 | B1 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0070 | 1 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0070 | 6 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0071 | 3 | B3 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0071 | 7 | B2 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0075 | 1 | B1 | 3 | 4 | side_1,side_2,side_4 | side_1 |
| DAMIMAS_A21B_0076 | 1 | B1 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0077 | 2 | B1 | 3 | 4 | side_1,side_3,side_4 | side_4 |
| DAMIMAS_A21B_0078 | 5 | B2 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0079 | 1 | B2 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0079 | 6 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |
| DAMIMAS_A21B_0079 | 9 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0081 | 7 | B2 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0081 | 9 | B3 | 3 | 4 | side_2,side_3,side_4 | side_3 |
| DAMIMAS_A21B_0084 | 3 | B3 | 3 | 4 | side_1,side_2,side_3 | side_2 |

(... 722 more — see findings.csv)


===== reports/audit_impossible_visibility/worklist_top10.md =====

# Worklist: Top-10 worst geometric violations

**Created:** 2026-05-15
**Updated:** 2026-05-16 — RESOLVED. Top-9 8-side trees fixed manual + rule relaxation (8-side max_dist 2→3 per visual validation RA). 0 remaining 8-side violations.
**Source:** `reports/audit_impossible_visibility/findings.csv` (severity=violation, sorted desc by n_sides_bunch)
**Strategy:** fix top-10 worst via manual tool, accept remaining 4-side violations sebagai GT noise floor.

Rule violation = bunch tidak punya geometric valid home (no candidate `home ∈ appearance_sides` di mana semua appearance lain dalam circular distance ≤ N/4).

Approach per tree: buka 4 (atau 8) gambar di tool annotator, identifikasi link salah yg connect offending side ke bunch utama, hapus link itu (atau split bunch jadi 2), save.

---

## 1. DAMIMAS_A21B_0824 bunch#1 (B1) — 8/8 sides ⚠️ PALING EKSTRIM

- Appearance: `sisi_1,sisi_2,sisi_3,sisi_4,sisi_5,sisi_6,sisi_7,sisi_8`
- Offending: `sisi_4, sisi_5, sisi_6` (opposite hemisphere)
- Links touching: `lnk-7, lnk-8, lnk-9, lnk-10, lnk-11, lnk-12, lnk-13`
- Action: bunch ke-merge dgn 1-2 bunch lain di sisi opposite. Split jadi 2-3 bunch terpisah (cluster s7-s8-s1-s2-s3 vs cluster s4-s5-s6).
- Images: `Brand-New-Dataset-YOLO/images/DAMIMAS_A21B_0824_{1..8}.jpg`

## 2. DAMIMAS_A21B_0812 bunch#1 (B1) — 7/8 sides

- Appearance: `s1,s2,s3,s4,s6,s7,s8` (skip s5)
- Offending: `sisi_4, sisi_6`
- Links: `lnk-0..lnk-5`
- Action: split jadi 2 bunch (s7-s8-s1-s2-s3 vs s4 vs s6 — atau merge s4 ke cluster1 + drop link s6).
- Images: `DAMIMAS_A21B_0812_{1..8}.jpg`

## 3. DAMIMAS_A21B_0812 bunch#2 (B3) — 7/8 sides

- Same tree as #2, diff bunch
- Appearance: `s1,s2,s3,s4,s6,s7,s8`
- Offending: `sisi_4, sisi_6`
- Links: `lnk-8..lnk-13`
- Action: similar split pattern.

## 4. DAMIMAS_A21B_0823 bunch#5 (B3) — 7/8 sides

- Appearance: `s1,s2,s3,s4,s5,s6,s7` (skip s8)
- Offending: `sisi_6, sisi_7`
- Links: `lnk-16..lnk-21`
- Action: cluster s1-s5 valid; s6-s7 mungkin bunch lain.
- Images: `DAMIMAS_A21B_0823_{1..8}.jpg`

## 5. DAMIMAS_A21B_0848 bunch#2 (B3) — 7/8 sides

- Appearance: `s1,s2,s3,s4,s5,s7,s8` (skip s6)
- Offending: `sisi_4, sisi_5`
- Links: `lnk-6..lnk-11`
- Action: split — cluster s7-s8-s1-s2-s3 vs s4-s5.
- Images: `DAMIMAS_A21B_0848_{1..8}.jpg`

## 6. DAMIMAS_A21B_0811 bunch#7 (B3) — 6/8 sides

- Appearance: `s1, s4, s5, s6, s7, s8` (skip s2, s3)
- Offending: `sisi_1` (cluster utama s4-s8)
- Links: `lnk-16, lnk-20, lnk-24, lnk-26, lnk-32`
- Action: drop link yg connect sisi_1 ke bunch — sisi_1 mungkin bunch terpisah.
- Images: `DAMIMAS_A21B_0811_{1..8}.jpg`

## 7. DAMIMAS_A21B_0812 bunch#3 (B2) — 6/8 sides

- Same tree as #2 dan #3, ketiga-bunch bermasalah di tree ini → kemungkinan annotator over-link sistematik di 0812
- Appearance: `s1, s2, s5, s6, s7, s8` (skip s3, s4)
- Offending: `sisi_2`
- Links: `lnk-14..lnk-18`
- Action: drop link s2 atau split.

## 8. DAMIMAS_A21B_0814 bunch#2 (B3) — 6/8 sides

- Appearance: `s1, s2, s3, s4, s7, s8` (skip s5, s6)
- Offending: `sisi_4`
- Links: `lnk-3..lnk-7`
- Action: drop link yg connect s4 ke bunch utama (s7-s8-s1-s2-s3).
- Images: `DAMIMAS_A21B_0814_{1..8}.jpg`

## 9. DAMIMAS_A21B_0815 bunch#8 (B3) — 6/8 sides

- Appearance: `s2, s3, s4, s5, s6, s7` (skip s1, s8)
- Offending: `sisi_7`
- Links: `lnk-17..lnk-21`
- Action: drop link s7 — cluster utama s2-s6.
- Images: `DAMIMAS_A21B_0815_{1..8}.jpg`

## 10. DAMIMAS_A21B_0817 bunch#3 (B1) — 6/8 sides

- Appearance: `s1, s2, s3, s4, s5, s6` (skip s7, s8)
- Offending: `sisi_6`
- Links: `lnk-6..lnk-10`
- Action: drop link s6 — cluster utama s1-s5.
- Images: `DAMIMAS_A21B_0817_{1..8}.jpg`

---

## Tracking checklist (FINAL — all 8-side cleared)

- [x] 1. 0824 bunch#1 (8/8) — manual fix
- [x] 2. 0812 bunch#1 (7/8) — manual fix
- [x] 3. 0812 bunch#2 (7/8) — manual fix
- [x] 4. 0823 bunch#5 (7/8) — manual fix
- [x] 5. 0848 bunch#2 (7/8) — manual fix + visually-validated 6/8
- [x] 6. 0811 bunch#7 (6/8) — auto-cleared by rule relaxation (max_dist 2→3)
- [x] 7. 0812 bunch#3 (6/8) — manual fix
- [x] 8. 0814 bunch#2 (6/8) — auto-cleared
- [x] 9. 0815 bunch#8 (6/8) — auto-cleared
- [x] 10. 0817 bunch#3 (6/8) — auto-cleared

**Final result (2026-05-16):** 62 → 42 violations (−20). 0 remaining 8-side. Tersisa 42 di 4-side trees (4/4 sides — rule unchanged).

## Notes

- Tree 0812 punya 3 bunch bermasalah (#1, #2, #3) → fix sekaligus saat buka tree ini.
- Cluster 0811-0848 → 6 dari 10 worst di sini. Suggest RA review siapa annotator session ini.
- Action interpretasi koord-only — visual inspection final say (per pengalaman 0335/0323/0362).


===== reports/audit_same_side_dup/summary.md =====

# Audit: same-side duplicate appearances

- Total JSON scanned: 953
- Trees flagged: 0
- Bunch records flagged: 0
- Trees in known bug report: 8
- Extra trees flagged (not in bug report): 0
- Bug-report trees missing from findings: 8

## Trees flagged

| tree_id | bunches flagged | known bug? |
|---|---:|:---:|

## Missing (in bug report but not flagged)

- DAMIMAS_A21B_0287
- DAMIMAS_A21B_0309
- DAMIMAS_A21B_0320
- DAMIMAS_A21B_0323
- DAMIMAS_A21B_0335
- DAMIMAS_A21B_0336
- DAMIMAS_A21B_0359
- DAMIMAS_A21B_0362


===== reports/benchmark_multidim/REPORT.md =====

# Benchmark Multi-Dimensi: 11 Algoritma Dedup

**Dataset:** 953 pohon JSON (228 GT)  
**Tanggal:** 2026-04-24  
**Metrik utama:** Acc ±1 (semua kelas dalam 1 error), MAE, ms/pohon

---

## Dimensi 1: Akurasi (Acc ±1 per kelas)

Pohon dianggap **benar** jika semua 4 kelas masing-masing dalam ±1 dari GT.

| Rank | Method | Gen | Acc ±1 | MAE | MTE | Gagal |
|---:|---|---|---:|---:|---:|---:|
| 1 | `M06_weight_visibility` | ? | **86.36%** | 0.3743 | 1.4974 | 130 |
| 2 | `M20_weight_visibility_grid` | ? | **86.36%** | 0.3743 | 1.4974 | 130 |
| 3 | `M11_median_b2` | ? | **86.04%** | 0.4111 | 1.6443 | 133 |
| 4 | `M12_selector_overrides` | ? | **86.04%** | 0.4200 | 1.6800 | 133 |
| 5 | `M15_divide_global` | ? | **85.94%** | 0.3909 | 1.5635 | 134 |
| 6 | `M17_selector_regime` | ? | **85.94%** | 0.4208 | 1.6831 | 134 |
| 7 | `M10_entropy_divide` | ? | **85.83%** | 0.4328 | 1.7314 | 135 |
| 8 | `M13_stack_bracket` | ? | **85.62%** | 0.4103 | 1.6411 | 137 |
| 9 | `M14_stack_density` | ? | **85.62%** | 0.4166 | 1.6663 | 137 |
| 10 | `M16_boost_b2b4` | ? | **85.41%** | 0.3932 | 1.5729 | 139 |
| 11 | `M19_divide_adaptive` | ? | **83.95%** | 0.4441 | 1.7765 | 153 |

> MTE = Mean Total Error (jumlah absolut error semua kelas, rata-rata per pohon)

### Akurasi Per Kelas (% pohon dalam ±1)

| Method | B1 | B2 | B3 | B4 |
|---|---:|---:|---:|---:|
| `M06_weight_visibility` | 97.6% | 95.6% | 90.5% | 97.2% |
| `M20_weight_visibility_grid` | 97.6% | 95.6% | 90.5% | 97.2% |
| `M11_median_b2` | 97.6% | 95.4% | 89.3% | 97.6% |
| `M12_selector_overrides` | 97.6% | 95.2% | 89.4% | 97.6% |
| `M15_divide_global` | 97.6% | 95.6% | 89.4% | 98.1% |
| `M17_selector_regime` | 97.6% | 95.2% | 89.3% | 97.6% |
| `M10_entropy_divide` | 97.3% | 95.0% | 89.0% | 97.8% |
| `M13_stack_bracket` | 97.6% | 95.1% | 89.1% | 97.6% |
| `M14_stack_density` | 97.6% | 95.1% | 89.1% | 97.6% |
| `M16_boost_b2b4` | 97.6% | 95.3% | 89.1% | 97.2% |
| `M19_divide_adaptive` | 97.6% | 95.2% | 87.3% | 97.6% |

### Pola Error Per Kelas (over >1 / under <-1, jumlah pohon)

| Method | B1↑ | B1↓ | B2↑ | B2↓ | B3↑ | B3↓ | B4↑ | B4↓ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `M06_weight_visibility` | 23 | 0 | 30 | 12 | 60 | 31 | 4 | 23 |
| `M20_weight_visibility_grid` | 23 | 0 | 30 | 12 | 60 | 31 | 4 | 23 |
| `M11_median_b2` | 23 | 0 | 31 | 13 | 84 | 18 | 12 | 11 |
| `M12_selector_overrides` | 23 | 0 | 40 | 6 | 83 | 18 | 12 | 11 |
| `M15_divide_global` | 23 | 0 | 33 | 9 | 80 | 21 | 8 | 10 |
| `M17_selector_regime` | 23 | 0 | 40 | 6 | 84 | 18 | 12 | 11 |
| `M10_entropy_divide` | 26 | 0 | 40 | 8 | 88 | 17 | 16 | 5 |
| `M13_stack_bracket` | 23 | 0 | 39 | 8 | 85 | 19 | 14 | 9 |
| `M14_stack_density` | 23 | 0 | 39 | 8 | 85 | 19 | 14 | 9 |
| `M16_boost_b2b4` | 23 | 0 | 31 | 14 | 85 | 19 | 10 | 17 |
| `M19_divide_adaptive` | 23 | 0 | 40 | 6 | 105 | 16 | 16 | 7 |

---

## Dimensi 2: Kecepatan (ms/pohon)

Diukur dengan 30 repetisi per metode, 953 pohon per repetisi.

| Rank | Method | Mean ms | Median ms | Std ms | pohon/detik |
|---:|---|---:|---:|---:|---:|
| 1 | `M15_divide_global` | 0.0067 | 0.0067 | 0.0009 | 150154 |
| 2 | `M19_divide_adaptive` | 0.0116 | 0.0106 | 0.0024 | 86322 |
| 3 | `M14_stack_density` | 0.0206 | 0.0197 | 0.0028 | 48616 |
| 4 | `M06_weight_visibility` | 0.0327 | 0.0330 | 0.0048 | 30564 |
| 5 | `M20_weight_visibility_grid` | 0.0345 | 0.0322 | 0.0068 | 28970 |
| 6 | `M16_boost_b2b4` | 0.0588 | 0.0585 | 0.0055 | 17011 |
| 7 | `M13_stack_bracket` | 0.0730 | 0.0745 | 0.0124 | 13693 |
| 8 | `M12_selector_overrides` | 0.0992 | 0.0961 | 0.0101 | 10081 |
| 9 | `M10_entropy_divide` | 0.1301 | 0.1226 | 0.0211 | 7684 |
| 10 | `M17_selector_regime` | 0.1796 | 0.1700 | 0.0497 | 5569 |
| 11 | `M11_median_b2` | 0.5531 | 0.5500 | 0.0556 | 1808 |

---

## Dimensi 3: Robustness terhadap Noise Koordinat

Simulasi: tambah Gaussian noise σ=N% ke x_norm dan y_norm setiap bbox.  
Mengukur seberapa cepat akurasi turun ketika koordinat detector tidak sempurna.

| Method | σ=0% | σ=5% | σ=10% | σ=20% | Drop@20% |
|---|---:|---:|---:|---:|---:|
| `M06_weight_visibility` | 86.36% | 86.15% | 85.83% | 83.95% | 2.41% |
| `M20_weight_visibility_grid` | 86.36% | 86.15% | 85.83% | 83.95% | 2.41% |
| `M11_median_b2` | 86.04% | 85.10% | 85.31% | 84.78% | 1.26% |
| `M12_selector_overrides` | 86.04% | 85.31% | 85.31% | 84.78% | 1.26% |
| `M15_divide_global` | 85.94% | 85.94% | 85.94% | 85.94% | 0.00% |
| `M17_selector_regime` | 85.94% | 85.31% | 85.31% | 84.78% | 1.16% |
| `M10_entropy_divide` | 85.83% | 84.78% | 84.05% | 83.95% | 1.88% |
| `M13_stack_bracket` | 85.62% | 84.47% | 83.95% | 83.95% | 1.67% |
| `M14_stack_density` | 85.62% | 84.47% | 83.95% | 83.95% | 1.67% |
| `M16_boost_b2b4` | 85.41% | 83.84% | 83.53% | 83.53% | 1.88% |
| `M19_divide_adaptive` | 83.95% | 83.95% | 83.95% | 83.95% | 0.00% |

> Drop@20% = selisih Acc antara noise=0% dan noise=20% (lebih kecil = lebih robust)

---

## Dimensi 4: Domain Breakdown (DAMIMAS vs LONSUM)

### Domain: DAMIMAS (n=854)

| Rank | Method | Acc ±1 | MAE | Gagal |
|---:|---|---:|---:|---:|
| 1 | `M06_weight_visibility` | 85.48% | 0.3888 | 124 |
| 2 | `M20_weight_visibility_grid` | 85.48% | 0.3888 | 124 |
| 3 | `M15_divide_global` | 85.25% | 0.4063 | 126 |
| 4 | `M11_median_b2` | 85.13% | 0.4300 | 127 |
| 5 | `M12_selector_overrides` | 85.13% | 0.4397 | 127 |
| 6 | `M17_selector_regime` | 85.01% | 0.4406 | 128 |
| 7 | `M10_entropy_divide` | 84.66% | 0.4543 | 131 |
| 8 | `M13_stack_bracket` | 84.54% | 0.4300 | 132 |
| 9 | `M14_stack_density` | 84.54% | 0.4356 | 132 |
| 10 | `M16_boost_b2b4` | 84.31% | 0.4139 | 134 |
| 11 | `M19_divide_adaptive` | 82.79% | 0.4663 | 147 |

### Domain: LONSUM (n=99)

| Rank | Method | Acc ±1 | MAE | Gagal |
|---:|---|---:|---:|---:|
| 1 | `M10_entropy_divide` | 95.96% | 0.2475 | 4 |
| 2 | `M13_stack_bracket` | 94.95% | 0.2399 | 5 |
| 3 | `M14_stack_density` | 94.95% | 0.2525 | 5 |
| 4 | `M16_boost_b2b4` | 94.95% | 0.2146 | 5 |
| 5 | `M06_weight_visibility` | 93.94% | 0.2500 | 6 |
| 6 | `M19_divide_adaptive` | 93.94% | 0.2525 | 6 |
| 7 | `M20_weight_visibility_grid` | 93.94% | 0.2500 | 6 |
| 8 | `M17_selector_regime` | 93.94% | 0.2500 | 6 |
| 9 | `M11_median_b2` | 93.94% | 0.2475 | 6 |
| 10 | `M12_selector_overrides` | 93.94% | 0.2500 | 6 |
| 11 | `M15_divide_global` | 91.92% | 0.2576 | 8 |

### Breakdown Per Split (train / val / test)

| Method | test Acc | train Acc | unknown Acc | val Acc |
|---|---:|---:|---:|---:|
| `M06_weight_visibility` | 87.95% | 86.62% | 57.14% | 86.29% |
| `M20_weight_visibility_grid` | 87.95% | 86.62% | 57.14% | 86.29% |
| `M11_median_b2` | 87.35% | 87.29% | 57.14% | 82.86% |
| `M12_selector_overrides` | 87.95% | 86.96% | 57.14% | 83.43% |
| `M15_divide_global` | 89.16% | 86.29% | 57.14% | 84.00% |
| `M17_selector_regime` | 87.95% | 86.79% | 57.14% | 83.43% |
| `M10_entropy_divide` | 89.16% | 86.45% | 57.14% | 82.86% |
| `M13_stack_bracket` | 89.16% | 85.95% | 57.14% | 83.43% |
| `M14_stack_density` | 89.16% | 85.95% | 57.14% | 83.43% |
| `M16_boost_b2b4` | 87.35% | 85.95% | 57.14% | 84.00% |
| `M19_divide_adaptive` | 87.35% | 84.28% | 57.14% | 81.71% |

---

## Ringkasan: Tradeoff Antar Dimensi

| Method | Acc ±1 | Rank Acc | ms/pohon | Rank Speed | Drop@20% | Rank Robust |
|---|---:|---:|---:|---:|---:|---:|
| `M06_weight_visibility` | 86.36% | #1 | 0.033 | #4 | 2.41% | #11 |
| `M20_weight_visibility_grid` | 86.36% | #2 | 0.035 | #5 | 2.41% | #10 |
| `M11_median_b2` | 86.04% | #3 | 0.553 | #11 | 1.26% | #4 |
| `M12_selector_overrides` | 86.04% | #4 | 0.099 | #8 | 1.26% | #5 |
| `M15_divide_global` | 85.94% | #5 | 0.007 | #1 | 0.00% | #1 |
| `M17_selector_regime` | 85.94% | #6 | 0.180 | #10 | 1.16% | #3 |
| `M10_entropy_divide` | 85.83% | #7 | 0.130 | #9 | 1.88% | #8 |
| `M13_stack_bracket` | 85.62% | #8 | 0.073 | #7 | 1.67% | #6 |
| `M14_stack_density` | 85.62% | #9 | 0.021 | #3 | 1.67% | #7 |
| `M16_boost_b2b4` | 85.41% | #10 | 0.059 | #6 | 1.88% | #9 |
| `M19_divide_adaptive` | 83.95% | #11 | 0.012 | #2 | 0.00% | #2 |

> **Rekomendasi final:** `v9_selector` untuk akurasi maksimal. Untuk pipeline real-time atau inference massal, pertimbangkan `v6_selector` atau `v5_adaptive_corrected` (lebih cepat, Acc masih >93%).


===== reports/dedup_research_v5/summary_v5.md =====

# Dedup Research V5 Report
**Date:** 2026-04-23
**Best Method:** adaptive_corrected
**Acc +/-1:** 93.86%
**MAE:** 0.2774
**Bootstrap 95% CI:** 90.79% - 96.93%

## Method Comparison
```
               method  mean_MAE  acc_within_1_error  score
   adaptive_corrected    0.2774               93.86  91.09
   best_ensemble_grid    0.2774               93.86  91.09
 best_visibility_grid    0.2664               92.54  89.88
      hybrid_vis_corr    0.2697               92.54  89.85
best_class_aware_grid    0.2917               92.54  89.63
        side_coverage    0.2697               92.11  89.41
           visibility    0.2719               92.11  89.39
   density_scaled_vis    0.2719               92.11  89.39
  adaptive_visibility    0.3366               91.67  88.30
            corrected    0.2851               90.79  87.94
  naive_mean_ensemble    0.2719               90.35  87.63
        ordinal_prior    0.3158               89.04  85.88
      class_aware_vis    0.3805               85.09  81.28
    best_relaxed_grid    1.7456                6.58 -10.88
        relaxed_match    1.8969                2.63 -16.34
                naive    2.1294                2.63 -18.66
```

## Best Grid Result
- Method: adaptive_corrected
- Score: 91.09
- Acc +/-1: 93.86%
- MAE: 0.2774
- Mean Total Error: 1.11

## Bootstrap 95% CI
- Point estimate: 93.86%
- 95% CI: [90.79%, 96.93%]
- Standard Error: 1.6087
- CI lower bound <= V4 baseline (92.11%)

## Per-Class Breakdown
| Class | MAE | Acc +/-1 |
|-------|-----|----------|
| B1 | 0.110 | 100.0% |
| B2 | 0.237 | 98.2% |
| B3 | 0.434 | 96.9% |
| B4 | 0.329 | 98.2% |

## Per-Domain Breakdown
| Domain | MAE | Acc +/-1 |
|--------|-----|----------|
| train | 0.246 | 95.9% |
| val | 0.500 | 100.0% |
| test | 0.468 | 80.6% |

## Error Analysis
- Trees with error > 1: 14 / 228 (6.1%)
- Mean error sum (failing trees): 2.93

## Final Claim
**Primary metric (4-class strict Acc +/-1): 93.86%**

Outputs in `reports/dedup_research_v5/`


===== reports/full_gt_count/summary.md =====

# Laporan GT Bunch Counting — Semua Pohon
**Tanggal:** 2026-04-23
**Dataset:** DAMIMAS + LONSUM (seluruh data GT yang tersedia)

---

## 1. Ringkasan Dataset

| Item | Nilai |
|------|-------|
| Total pohon diproses | **953** |
| Domain DAMIMAS | 854 |
| Domain LONSUM | 99 |
| Pohon 4-sisi | 908 |
| Pohon 8-sisi | 45 |
| Pohon dengan JSON (dedup akurat) | **953** |
| Pohon tanpa JSON (naive sum) | **0** |

---

## 2. Jumlah Tandan per Kelas (Seluruh Pohon)

> Pohon ber-JSON: hitungan **unik/dedup** (akurat).
> Pohon non-JSON: hitungan **naif** (tanpa dedup — estimasi overcounting ~79%).

| Kelas | JSON-Dedup (953 pohon) | Naive-Sum (0 pohon) | Total |
|-------|---:|---:|---:|
| B1 | 954 | 0 | 954 |
| B2 | 1,791 | 0 | 1,791 |
| B3 | 5,067 | 0 | 5,067 |
| B4 | 2,011 | 0 | 2,011 |
| **TOTAL** | **9,823** | **0** | **9,823** |

### Estimasi True Count untuk Pohon Non-JSON
Berdasarkan hasil JSON-05 (overcounting rate 78.8%), estimasi tandan unik sesungguhnya
untuk 0 pohon non-JSON:

| Kelas | Naive Count | Est. Unique (÷1.788) |
|-------|---:|---:|
| B1 | 0 | 0 |
| B2 | 0 | 0 |
| B3 | 0 | 0 |
| B4 | 0 | 0 |
| **TOTAL** | **0** | **0** |

---

## 3. Breakdown per Domain

### DAMIMAS (854 pohon)

| Kelas | Count | % |
|-------|------:|---:|
| B1 | 946 | 10.3% |
| B2 | 1,709 | 18.5% |
| B3 | 4,653 | 50.5% |
| B4 | 1,908 | 20.7% |
| **Total** | **9,216** | 100% |

- Pohon ber-JSON: 854 | Non-JSON: 0

### LONSUM (99 pohon)

| Kelas | Count | % |
|-------|------:|---:|
| B1 | 8 | 1.3% |
| B2 | 82 | 13.5% |
| B3 | 414 | 68.2% |
| B4 | 103 | 17.0% |
| **Total** | **607** | 100% |

- Pohon ber-JSON: 99 | Non-JSON: 0

---

## 4. Breakdown per Split

### Split: TRAIN (763 pohon)

| Kelas | Count |
|-------|------:|
| B1 | 773 |
| B2 | 1,441 |
| B3 | 4,055 |
| B4 | 1,626 |
| **Total** | **7,895** |

- Pohon ber-JSON: 763 | Non-JSON: 0

### Split: VAL (95 pohon)

| Kelas | Count |
|-------|------:|
| B1 | 91 |
| B2 | 153 |
| B3 | 519 |
| B4 | 203 |
| **Total** | **966** |

- Pohon ber-JSON: 95 | Non-JSON: 0

### Split: TEST (95 pohon)

| Kelas | Count |
|-------|------:|
| B1 | 90 |
| B2 | 197 |
| B3 | 493 |
| B4 | 182 |
| **Total** | **962** |

- Pohon ber-JSON: 95 | Non-JSON: 0

---

## 5. Catatan Metodologi

- **Sumber data:** Ground truth label (bukan prediksi model) — sesuai arahan dosen
- **JSON dedup:** 228 pohon sudah di-link manual antar sisi → hitungan tandan unik akurat
- **TXT naive:** 725 pohon dihitung langsung dari file label YOLO → setiap penampakan dihitung 1×
- **Overcounting rate** (dari JSON-05): naive sum rata-rata **78.8% lebih tinggi** dari count unik
- **Pohon 8-sisi (45 pohon):** data baru dengan 8 sudut foto — dihitung naive sum (belum ada JSON)
- File detail per pohon tersimpan di: `reports/full_gt_count/count_all_trees.csv`

---

## 6. File Output

| File | Isi |
|------|-----|
| `count_all_trees.csv` | 953 baris — detail per pohon |
| `summary_by_domain.csv` | Agregat DAMIMAS vs LONSUM |
| `summary_by_split.csv` | Agregat train / val / test |
| `summary.md` | Dokumen ini |


===== reports/gt_fix_log/summary.md =====

# GT Fix Log Summary

- Total fix entries: **31**
- Trees affected: **31**

## By action

- `auto_heal_visibility_drop_offender` — 31

## By date

- `2026-05-16` — 31


===== reports/nonjson_dedup_report.md =====

# Laporan Dedup Multi-View Non-JSON

**Tanggal:** 2026-04-23  
**Dataset:** DAMIMAS + LONSUM, 953 pohon total  
**Fokus:** 717 pohon tanpa JSON ground truth  
**Referensi validasi:** 228 pohon ber-JSON

---

## 1. Ringkasan

- Benchmark JSON terbaru sekarang ada di `v6`, `v7`, dan `v8`.
- **Metode terbaik pada 228 pohon JSON adalah `v6_selector`**:
  - `Acc ±1`: **96.49%**
  - `MAE`: **0.2632**
  - `Mean Total Error`: **1.05**
- **Metode terbaik untuk 717 pohon non-JSON belum tentu sama**, karena non-JSON tidak punya GT.
- Untuk non-JSON, metode yang paling masuk akal tetap dinilai dari **kedekatan rasio dedup ke target ~0.56** dari subset JSON terverifikasi.

---

## 2. Validasi pada 228 Pohon JSON

Sumber: `reports/dedup_all_trees_final/json_228_accuracy.csv`

| Method | Mean MAE | Acc ±1 | Mean Total Err | Score |
|--------|---------:|-------:|---------------:|------:|
| **v6_selector** | **0.2632** | **96.49%** | **1.05** | **93.86** |
| stacking_bracketed_v7 | 0.2643 | 94.30% | 1.06 | 91.66 |
| stacking_density_v7 | 0.2708 | 94.30% | 1.08 | 91.59 |
| entropy_modulated_v8 | 0.2763 | 94.30% | 1.11 | 91.54 |
| v8_entropy_stacking | 0.2763 | 94.30% | 1.11 | 91.54 |
| adaptive_corrected | 0.2774 | 93.86% | 1.11 | 91.09 |
| best_ensemble_grid | 0.2774 | 93.86% | 1.11 | 91.09 |
| best_visibility_grid | 0.2664 | 92.54% | 1.07 | 89.88 |
| visibility | 0.2719 | 92.11% | 1.09 | 89.39 |
| corrected | 0.2851 | 90.79% | 1.14 | 87.94 |

Interpretasi:
- `v6_selector` sekarang **benchmark JSON internal terbaik**.
- `v7` dan `v8` tetap penting sebagai baseline baru, tetapi belum melewati `v6`.
- Jadi urutan saat ini adalah:
  - `v6_selector` > `v7/v8 best` > `adaptive_corrected v5` > `visibility v2/v4`

---

## 3. Hasil Dedup pada 717 Pohon Non-JSON

Sumber: `reports/dedup_all_trees_final/nonjson_725_summary.csv`

### 3.1 Total Count per Metode

| Method | B1 | B2 | B3 | B4 | Total | Rasio vs Naive |
|---|---:|---:|---:|---:|---:|---:|
| naive | 1618 | 2974 | 6417 | 2656 | 13665 | 100.0% |
| class_aware_vis | 917 | 1841 | 3974 | 1478 | 8210 | 60.4% |
| entropy_modulated_v8 | 898 | 1761 | 3702 | 1712 | 8073 | 59.1% |
| v8_entropy_stacking | 898 | 1761 | 3702 | 1712 | 8073 | 59.1% |
| adaptive_corrected | 855 | 1760 | 3724 | 1671 | 8010 | 58.6% |
| adaptive_visibility | 956 | 1756 | 3728 | 1559 | 7999 | 58.5% |
| v6_selector | 857 | 1764 | 3683 | 1647 | 7951 | 58.2% |
| stacking_bracketed_v7 | 864 | 1736 | 3672 | 1652 | 7924 | 58.0% |
| best_class_aware_grid | 919 | 1744 | 3718 | 1481 | 7862 | 57.5% |
| stacking_density_v7 | 831 | 1719 | 3662 | 1636 | 7848 | 57.4% |
| best_ensemble_grid | 880 | 1732 | 3653 | 1565 | 7830 | 57.3% |
| corrected | 917 | 1691 | 3573 | 1598 | 7779 | 56.9% |
| hybrid_vis_corr | 919 | 1668 | 3504 | 1505 | 7596 | 55.6% |
| side_coverage | 921 | 1665 | 3465 | 1500 | 7551 | 55.3% |
| density_scaled_vis | 919 | 1657 | 3486 | 1484 | 7546 | 55.2% |
| best_visibility_grid | 919 | 1655 | 3486 | 1481 | 7541 | 55.2% |
| visibility | 919 | 1650 | 3458 | 1483 | 7510 | 55.0% |
| ordinal_prior | 919 | 1674 | 3434 | 1483 | 7510 | 55.0% |
| naive_mean_ensemble | 917 | 1646 | 3394 | 1483 | 7440 | 54.4% |
| best_relaxed_grid | 620 | 818 | 879 | 748 | 3065 | 22.4% |
| relaxed_match | 512 | 674 | 720 | 623 | 2529 | 18.5% |

### 3.2 Rasio Dedup per Pohon

Sumber: `reports/dedup_all_trees_final/nonjson_725_ratios.csv`

| Method | Mean Ratio | Median Ratio | Std Dev |
|---|---:|---:|---:|
| class_aware_vis | 0.6042 | 0.6000 | 0.0497 |
| entropy_modulated_v8 | 0.5872 | 0.5833 | 0.0583 |
| v8_entropy_stacking | 0.5872 | 0.5833 | 0.0583 |
| best_class_aware_grid | 0.5799 | 0.5714 | 0.0492 |
| stacking_bracketed_v7 | 0.5763 | 0.5714 | 0.0589 |
| adaptive_visibility | 0.5754 | 0.5833 | 0.0623 |
| corrected | 0.5741 | 0.5714 | 0.0480 |
| adaptive_corrected | 0.5736 | 0.5769 | 0.0574 |
| v6_selector | 0.5714 | 0.5714 | 0.0575 |
| best_ensemble_grid | 0.5660 | 0.5714 | 0.0514 |
| stacking_density_v7 | 0.5636 | 0.5652 | 0.0555 |
| side_coverage | 0.5615 | 0.5556 | 0.0553 |
| hybrid_vis_corr | 0.5601 | 0.5556 | 0.0510 |
| best_visibility_grid | 0.5587 | 0.5556 | 0.0501 |
| density_scaled_vis | 0.5582 | 0.5500 | 0.0509 |
| visibility | 0.5570 | 0.5500 | 0.0509 |
| ordinal_prior | 0.5570 | 0.5500 | 0.0509 |
| naive_mean_ensemble | 0.5525 | 0.5455 | 0.0521 |
| best_relaxed_grid | 0.2604 | 0.2143 | 0.1578 |
| relaxed_match | 0.2156 | 0.1875 | 0.1208 |

---

## 4. Ranking Non-JSON

Karena non-JSON tidak punya GT, ranking yang paling defensible adalah:

`ranking = kedekatan ke target ratio ~0.56`

Target `~0.56` berasal dari verifikasi JSON-05:

```text
unique_count ≈ naive_count / 1.788 ≈ naive_count × 0.559
```

### 4.1 Ranking Kedekatan ke 0.56

| Rank | Method | Mean Ratio | Jarak ke 0.56 |
|---:|---|---:|---:|
| 1 | hybrid_vis_corr | 0.5601 | 0.0001 |
| 2 | side_coverage | 0.5615 | 0.0015 |
| 3 | stacking_density_v7 | 0.5636 | 0.0036 |
| 4 | best_ensemble_grid | 0.5660 | 0.0060 |
| 5 | v6_selector | 0.5714 | 0.0114 |
| 6 | adaptive_corrected | 0.5736 | 0.0136 |
| 7 | corrected | 0.5741 | 0.0141 |
| 8 | stacking_bracketed_v7 | 0.5763 | 0.0163 |
| 9 | best_class_aware_grid | 0.5799 | 0.0199 |
| 10 | entropy_modulated_v8 | 0.5872 | 0.0272 |
| 10 | v8_entropy_stacking | 0.5872 | 0.0272 |
| 12 | class_aware_vis | 0.6042 | 0.0442 |
| 13 | best_relaxed_grid | 0.2604 | 0.2996 |
| 14 | relaxed_match | 0.2156 | 0.3444 |

### 4.2 Implikasi

- **`v6_selector` adalah yang terbaik di JSON**, tapi **bukan yang paling dekat ke rasio non-JSON target**.
- Untuk non-JSON, metode paling stabil terhadap target dedup tetap:
  - `hybrid_vis_corr`
  - `side_coverage`
  - `stacking_density_v7`
  - `best_ensemble_grid`
  - `visibility` / `best_visibility_grid`
- `v8` cenderung lebih tinggi dari target, jadi berpotensi sedikit overcount pada data tanpa GT.

---

## 5. Rekomendasi Praktis

### 5.1 Jika ada GT / benchmark JSON

Gunakan:
- **`v6_selector`**

Karena ini sekarang yang terbaik secara akurasi:
- `96.49% Acc ±1`
- `MAE 0.2632`

### 5.2 Jika tidak ada GT / pada 717 non-JSON

Gunakan salah satu dari:
1. **`hybrid_vis_corr`**
2. **`side_coverage`**
3. **`stacking_density_v7`**
4. **`best_visibility_grid`**
5. **`visibility`**

Alasan:
- paling dekat ke rasio target `~0.56`
- lebih aman untuk inferensi tanpa label pembanding

### 5.3 Jika ingin kompromi antara benchmark JSON dan non-JSON

Gunakan:
- **`stacking_density_v7`**

Karena:
- performa JSON kuat: `94.30%`
- rasio non-JSON masih dekat target: `0.5636`
- lebih seimbang daripada `v6_selector` jika fokus Anda adalah generalisasi operasional

---

## 6. Kesimpulan

- `v6_selector` sekarang **benchmark internal terbaik** untuk 228 pohon JSON.
- `v7` dan `v8` tetap relevan, tetapi **tidak melewati v6** pada benchmark JSON.
- Untuk 717 pohon non-JSON, **metode terbaik bukan otomatis v6**.
- Tanpa GT, keputusan terbaik tetap berbasis:
  - rasio dedup yang masuk akal,
  - stabilitas antar-pohon,
  - dan kedekatan ke target `~0.56`.

Jadi garis besarnya:
- **JSON benchmark terbaik:** `v6_selector`
- **Non-JSON produksi paling aman:** `hybrid_vis_corr` / `side_coverage` / `stacking_density_v7`

---

## 7. File Output

| File | Lokasi | Isi |
|---|---|---|
| `json_228_accuracy.csv` | `reports/dedup_all_trees_final/` | Benchmark JSON semua metode termasuk v6/v7/v8 |
| `nonjson_725_counts.csv` | `reports/dedup_all_trees_final/` | Count per pohon non-JSON |
| `nonjson_725_summary.csv` | `reports/dedup_all_trees_final/` | Total count per metode |
| `nonjson_725_ratios.csv` | `reports/dedup_all_trees_final/` | Rasio dedup per metode |
| `summary_v6.md` | `reports/dedup_research_v6/` | Ringkasan v6 |
| `summary_v7.md` | `reports/dedup_research_v7/` | Ringkasan v7 |
| `summary_v8.md` | `reports/dedup_research_v8/` | Ringkasan v8 |



===== ml-track/baseline-run/SUMMARY.md =====

# SUMMARY.md - Baseline Training Pipeline
Generated by `scripts/generate_training_summary.py`

## 1. Detection: mAP Comparison (5 models)
| Model | Best Epoch | mAP50 | mAP50-95 | Notes |
|---|---:|---:|---:|---|
| y26n vanilla | 30 | 0.511 | 0.237 | RunPod, pretrained, aug ON |
| y26s vanilla | 32 | 0.501 | 0.235 | RunPod, pretrained, aug ON |
| y26m vanilla | 20 | 0.528 | 0.240 | RunPod, pretrained, aug ON - BEST mAP50 |
| y26s no-pretrained | - | - | - | scratch, aug ON - SURPRISE: beats vanilla y26s! (pending) |
| y26s no-aug | - | - | - | pretrained, aug OFF - early stop ep=56, overfit cepat (pending) |

## 2. Counting: GT Features (SVM vs RF)
| Model | Macro class-MAE | Acc+/-1 B1 | Acc+/-1 B2 | Acc+/-1 B3 | Acc+/-1 B4 | Exact-profile | Total-count MAE | Total+/-1 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| SVM (GT features) | 0.3184 | 1.000 | 0.958 | 0.916 | 0.968 | 0.274 | 1.1263 | 0.726 |
| RF (GT features) | 0.3526 | 0.968 | 0.968 | 0.905 | 0.968 | 0.274 | 1.2000 | 0.705 |

## 3. End-to-End vs Heuristic Baseline
| Metrik | M01_selector_b2b3 (heuristik) | y26s->SVM | y26s->RF |
|---|---:|---:|---:|
| Acc +/-1 (avg per class) | 0.8667 | 0.6895 | 0.6658 |
| Macro class-MAE | 0.3982 | 1.1632 | 1.2158 |
| Total-count MAE | 1.4145 | 2.3368 | 2.3368 |
| Total +/-1 acc | - | 0.3895 | 0.4000 |
| Exact-profile acc | - | 0.0000 | 0.0105 |

## 4. Narasi & Kesimpulan
### Detection Winner
- Vanilla y26m terbaik mAP50 (0.528), tapi y26n hampir setara dengan 4x lebih cepat.
- Ablasi no-pretrained: lihat ml-track/baseline-run/y26s_nopretrained.txt untuk hasil aktual.
- Ablasi no-aug: lihat ml-track/baseline-run/y26s_noaug.txt.

### Counting Winner
- SVM (Macro class-MAE 0.3184) mengungguli RF (0.3526) pada GT features.
- B3 adalah kelas tersulit (MAE tertinggi, Acc+/-1 terendah) - konsisten dengan heuristik.

### End-to-End vs Heuristic
- Heuristic baseline M01_selector_b2b3: Acc+/-1=86.67%, Macro class-MAE=0.3982.
- E2E ML pipeline: lihat tabel di atas. Jika ML >= heuristik -> ML pipeline winner.
- Jika tidak -> heuristik M01 tetap production choice.


===== reports/methods/M06_weight_visibility.md =====

# `v2_visibility` — Primary Metrics Breakdown

**Implementasi:** _(tidak punya file algoritma terpisah — lihat scripts/dedup_research_v*.py)_  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v2_visibility`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v2_visibility_per_tree.csv`](v2_visibility_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2664** | mean(per-class MAE) |
| Exact accuracy | **31.58%** | 72/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.8728** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **82.02%** | 187/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 92.54% | 211/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.1009** | mean(err_B1) across 228 pohon |
| B2 | **0.2237** | mean(err_B2) across 228 pohon |
| B3 | **0.4474** | mean(err_B3) across 228 pohon |
| B4 | **0.2939** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.1009 | 0 | 0 | 205 | 228 | 100.00% |
| B2 | 0.2237 | 0 | 5 | 182 | 223 | 97.81% |
| B3 | 0.4474 | 2 | 7 | 135 | 219 | 96.05% |
| B4 | 0.2939 | 0 | 4 | 165 | 224 | 98.25% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.092** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **-0.066** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **-0.175** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **-0.215** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.0222 ms/pohon** (45,146 pohon/detik)
- Median: 0.0218 ms
- Std: 0.0009 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 92.54% | 0.2664 | 17 | +0.00% |
| 5% | 92.11% | 0.2675 | 18 | +0.43% |
| 10% | 91.67% | 0.2686 | 19 | +0.87% |
| 20% | 91.67% | 0.2796 | 19 | +0.87% |

## Pohon yang Gagal (Acc±1 fail = 17)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0246` | train | DAMIMAS | 1.25 | 0 | 2 | 2 | 1 |
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0258` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0268` | train | DAMIMAS | 1.00 | 0 | 2 | 1 | 1 |
| `DAMIMAS_A21B_0034` | train | DAMIMAS | 0.50 | 0 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0278` | train | DAMIMAS | 0.75 | 1 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0281` | train | DAMIMAS | 0.75 | 0 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0632` | train | DAMIMAS | 0.75 | 0 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0656` | train | DAMIMAS | 0.75 | 0 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 0.75 | 1 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0562` | test | DAMIMAS | 0.75 | 0 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 0.75 | 1 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0571` | test | DAMIMAS | 0.75 | 0 | 2 | 1 | 0 |
| `DAMIMAS_A21B_0573` | test | DAMIMAS | 0.75 | 0 | 1 | 0 | 2 |
| `DAMIMAS_A21B_0574` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 5 | 0 |
| DAMIMAS_A21B_0244 | train | True | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 8 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | True | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 5 |
| DAMIMAS_A21B_0245 | train | True | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 3 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | False | 0 | 6 | 6 | 4 | 0 | 4 | 4 | 3 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 3 | 5 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |


===== reports/methods/M10_entropy_divide.md =====

# `v8_entropy_modulated` — Primary Metrics Breakdown

**Implementasi:** [`algorithms/entropy_modulated.py`](../../algorithms/entropy_modulated.py)  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v8_entropy_modulated`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v8_entropy_modulated_per_tree.csv`](v8_entropy_modulated_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2763** | mean(per-class MAE) |
| Exact accuracy | **30.70%** | 70/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.8772** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **78.95%** | 180/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 94.30% | 215/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.0965** | mean(err_B1) across 228 pohon |
| B2 | **0.2544** | mean(err_B2) across 228 pohon |
| B3 | **0.4342** | mean(err_B3) across 228 pohon |
| B4 | **0.3202** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.0965 | 0 | 0 | 206 | 228 | 100.00% |
| B2 | 0.2544 | 1 | 2 | 173 | 225 | 98.68% |
| B3 | 0.4342 | 6 | 2 | 137 | 220 | 96.49% |
| B4 | 0.3202 | 2 | 1 | 158 | 225 | 98.68% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.070** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **+0.070** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **+0.048** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **+0.110** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.1046 ms/pohon** (9,558 pohon/detik)
- Median: 0.1044 ms
- Std: 0.0023 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 94.30% | 0.2763 | 13 | +0.00% |
| 5% | 93.86% | 0.2818 | 14 | +0.44% |
| 10% | 92.98% | 0.2873 | 16 | +1.32% |
| 20% | 92.98% | 0.2873 | 16 | +1.32% |

## Pohon yang Gagal (Acc±1 fail = 13)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0002` | train | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0273` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0281` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0043` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0045` | train | DAMIMAS | 0.75 | 0 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0546` | test | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0554` | test | DAMIMAS | 1.25 | 0 | 1 | 2 | 2 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 1.00 | 1 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0574` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 6 | 0 |
| DAMIMAS_A21B_0244 | train | True | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 8 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | False | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 6 |
| DAMIMAS_A21B_0245 | train | True | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 3 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | True | 0 | 6 | 6 | 4 | 0 | 5 | 5 | 4 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 4 | 6 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |


===== reports/methods/M11_median_b2.md =====

# `v9_b2_median_v6` — Primary Metrics Breakdown

**Implementasi:** [`algorithms/b2_median_v6.py`](../../algorithms/b2_median_v6.py)  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v9_b2_median_v6`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v9_b2_median_v6_per_tree.csv`](v9_b2_median_v6_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2577** | mean(per-class MAE) |
| Exact accuracy | **29.82%** | 68/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.8640** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **82.02%** | 187/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 96.05% | 219/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.1053** | mean(err_B1) across 228 pohon |
| B2 | **0.2237** | mean(err_B2) across 228 pohon |
| B3 | **0.3947** | mean(err_B3) across 228 pohon |
| B4 | **0.3070** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.1053 | 0 | 0 | 204 | 228 | 100.00% |
| B2 | 0.2237 | 0 | 4 | 182 | 224 | 98.25% |
| B3 | 0.3947 | 2 | 1 | 141 | 225 | 98.68% |
| B4 | 0.3070 | 1 | 1 | 160 | 226 | 99.12% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.044** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **-0.101** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **+0.009** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **+0.044** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.4291 ms/pohon** (2,330 pohon/detik)
- Median: 0.4250 ms
- Std: 0.0140 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 96.05% | 0.2577 | 9 | +0.00% |
| 5% | 94.30% | 0.2621 | 13 | +1.75% |
| 10% | 94.30% | 0.2643 | 13 | +1.75% |
| 20% | 93.86% | 0.2675 | 14 | +2.19% |

## Pohon yang Gagal (Acc±1 fail = 9)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0244` | train | DAMIMAS | 0.50 | 0 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.75 | 0 | 3 | 0 | 0 |
| `DAMIMAS_A21B_0268` | train | DAMIMAS | 0.75 | 0 | 2 | 1 | 0 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 1.00 | 1 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 0.75 | 1 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0571` | test | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0574` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 5 | 0 |
| DAMIMAS_A21B_0244 | train | False | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 9 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | True | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 5 |
| DAMIMAS_A21B_0245 | train | True | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 3 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | True | 0 | 6 | 6 | 4 | 0 | 5 | 5 | 4 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 3 | 6 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |


===== reports/methods/M12_selector_overrides.md =====

# `v9_selector` — Primary Metrics Breakdown

**Implementasi:** [`algorithms/v9_selector.py`](../../algorithms/v9_selector.py)  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v9_selector`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v9_selector_per_tree.csv`](v9_selector_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2533** | mean(per-class MAE) |
| Exact accuracy | **29.39%** | 67/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.8553** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **83.77%** | 191/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 97.37% | 222/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.1053** | mean(err_B1) across 228 pohon |
| B2 | **0.2193** | mean(err_B2) across 228 pohon |
| B3 | **0.3860** | mean(err_B3) across 228 pohon |
| B4 | **0.3026** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.1053 | 0 | 0 | 204 | 228 | 100.00% |
| B2 | 0.2193 | 1 | 2 | 181 | 225 | 98.68% |
| B3 | 0.3860 | 1 | 1 | 142 | 226 | 99.12% |
| B4 | 0.3026 | 0 | 1 | 160 | 227 | 99.56% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.044** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **+0.044** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **0.000** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **+0.039** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.0792 ms/pohon** (12,619 pohon/detik)
- Median: 0.0794 ms
- Std: 0.0023 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 97.37% | 0.2533 | 6 | +0.00% |
| 5% | 95.18% | 0.2643 | 11 | +2.19% |
| 10% | 95.18% | 0.2675 | 11 | +2.19% |
| 20% | 94.74% | 0.2708 | 12 | +2.63% |

## Pohon yang Gagal (Acc±1 fail = 6)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 1.00 | 1 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0558` | test | DAMIMAS | 1.00 | 0 | 2 | 1 | 1 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 0.75 | 1 | 0 | 0 | 2 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 5 | 0 |
| DAMIMAS_A21B_0244 | train | True | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 8 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | True | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 5 |
| DAMIMAS_A21B_0245 | train | True | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 3 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | True | 0 | 6 | 6 | 4 | 0 | 5 | 5 | 4 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 4 | 6 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |


===== reports/methods/M13_stack_bracket.md =====

# `v7_stacking_bracketed` — Primary Metrics Breakdown

**Implementasi:** [`algorithms/stacking_bracketed.py`](../../algorithms/stacking_bracketed.py)  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v7_stacking_bracketed`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v7_stacking_bracketed_per_tree.csv`](v7_stacking_bracketed_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2643** | mean(per-class MAE) |
| Exact accuracy | **31.14%** | 71/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.8904** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **79.82%** | 182/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 94.30% | 215/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.0789** | mean(err_B1) across 228 pohon |
| B2 | **0.2412** | mean(err_B2) across 228 pohon |
| B3 | **0.4254** | mean(err_B3) across 228 pohon |
| B4 | **0.3114** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.0789 | 0 | 0 | 210 | 228 | 100.00% |
| B2 | 0.2412 | 1 | 2 | 176 | 225 | 98.68% |
| B3 | 0.4254 | 6 | 2 | 139 | 220 | 96.49% |
| B4 | 0.3114 | 2 | 1 | 160 | 225 | 98.68% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.044** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **+0.039** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **+0.004** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **+0.048** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.0480 ms/pohon** (20,830 pohon/detik)
- Median: 0.0481 ms
- Std: 0.0018 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 94.30% | 0.2643 | 13 | +0.00% |
| 5% | 93.86% | 0.2686 | 14 | +0.44% |
| 10% | 93.86% | 0.2697 | 14 | +0.44% |
| 20% | 93.86% | 0.2708 | 14 | +0.44% |

## Pohon yang Gagal (Acc±1 fail = 13)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0002` | train | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0273` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0281` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0043` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0045` | train | DAMIMAS | 0.75 | 0 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0546` | test | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0554` | test | DAMIMAS | 1.25 | 0 | 1 | 2 | 2 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 1.00 | 1 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0574` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 6 | 0 |
| DAMIMAS_A21B_0244 | train | True | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 8 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | False | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 6 |
| DAMIMAS_A21B_0245 | train | True | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 3 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | True | 0 | 6 | 6 | 4 | 0 | 5 | 5 | 4 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 4 | 6 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |


===== reports/methods/M14_stack_density.md =====

# `v7_stacking_density` — Primary Metrics Breakdown

**Implementasi:** [`algorithms/stacking_density.py`](../../algorithms/stacking_density.py)  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v7_stacking_density`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v7_stacking_density_per_tree.csv`](v7_stacking_density_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2708** | mean(per-class MAE) |
| Exact accuracy | **29.39%** | 67/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.9079** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **79.39%** | 181/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 94.30% | 215/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.0965** | mean(err_B1) across 228 pohon |
| B2 | **0.2412** | mean(err_B2) across 228 pohon |
| B3 | **0.4254** | mean(err_B3) across 228 pohon |
| B4 | **0.3202** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.0965 | 0 | 0 | 206 | 228 | 100.00% |
| B2 | 0.2412 | 1 | 2 | 176 | 225 | 98.68% |
| B3 | 0.4254 | 6 | 2 | 139 | 220 | 96.49% |
| B4 | 0.3202 | 2 | 1 | 158 | 225 | 98.68% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.026** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **+0.039** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **+0.004** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **+0.039** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.0142 ms/pohon** (70,585 pohon/detik)
- Median: 0.0138 ms
- Std: 0.0013 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 94.30% | 0.2708 | 13 | +0.00% |
| 5% | 93.86% | 0.2752 | 14 | +0.44% |
| 10% | 93.86% | 0.2763 | 14 | +0.44% |
| 20% | 93.86% | 0.2774 | 14 | +0.44% |

## Pohon yang Gagal (Acc±1 fail = 13)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0002` | train | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0273` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0281` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0043` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0045` | train | DAMIMAS | 0.75 | 0 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0546` | test | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0554` | test | DAMIMAS | 1.25 | 0 | 1 | 2 | 2 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 1.00 | 1 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0574` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 6 | 0 |
| DAMIMAS_A21B_0244 | train | True | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 8 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | False | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 6 |
| DAMIMAS_A21B_0245 | train | True | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 3 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | True | 0 | 6 | 6 | 4 | 0 | 5 | 5 | 4 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 4 | 6 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |


===== reports/methods/M15_divide_global.md =====

# `v1_corrected` — Primary Metrics Breakdown

**Implementasi:** _(tidak punya file algoritma terpisah — lihat scripts/dedup_research_v*.py)_  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v1_corrected`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v1_corrected_per_tree.csv`](v1_corrected_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2851** | mean(per-class MAE) |
| Exact accuracy | **30.26%** | 69/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.9035** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **78.51%** | 179/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 90.79% | 207/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.1009** | mean(err_B1) across 228 pohon |
| B2 | **0.2237** | mean(err_B2) across 228 pohon |
| B3 | **0.4868** | mean(err_B3) across 228 pohon |
| B4 | **0.3289** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.1009 | 0 | 0 | 205 | 228 | 100.00% |
| B2 | 0.2237 | 0 | 5 | 182 | 223 | 97.81% |
| B3 | 0.4868 | 7 | 6 | 130 | 215 | 94.30% |
| B4 | 0.3289 | 4 | 1 | 158 | 223 | 97.81% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.092** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **-0.048** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **-0.039** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **+0.022** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.0036 ms/pohon** (279,830 pohon/detik)
- Median: 0.0034 ms
- Std: 0.0005 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 90.79% | 0.2851 | 21 | +0.00% |
| 5% | 90.79% | 0.2851 | 21 | +0.00% |
| 10% | 90.79% | 0.2851 | 21 | +0.00% |
| 20% | 90.79% | 0.2851 | 21 | +0.00% |

## Pohon yang Gagal (Acc±1 fail = 21)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0244` | train | DAMIMAS | 0.50 | 0 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0002` | train | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0245` | train | DAMIMAS | 0.75 | 0 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0246` | train | DAMIMAS | 1.00 | 0 | 2 | 2 | 0 |
| `DAMIMAS_A21B_0011` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0268` | train | DAMIMAS | 1.00 | 0 | 2 | 1 | 1 |
| `DAMIMAS_A21B_0273` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0278` | train | DAMIMAS | 0.75 | 1 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0281` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0043` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0632` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0785` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0554` | test | DAMIMAS | 1.00 | 0 | 0 | 2 | 2 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 1.00 | 1 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0562` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 0.75 | 1 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0571` | test | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0574` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 6 | 0 |
| DAMIMAS_A21B_0244 | train | False | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 9 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | False | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 6 |
| DAMIMAS_A21B_0245 | train | False | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 4 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | False | 0 | 6 | 6 | 4 | 0 | 4 | 4 | 4 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 3 | 6 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |


===== reports/methods/M16_boost_b2b4.md =====

# `v8_b2_b4_boosted` — Primary Metrics Breakdown

**Implementasi:** [`algorithms/b2_b4_boosted.py`](../../algorithms/b2_b4_boosted.py)  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v8_b2_b4_boosted`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v8_b2_b4_boosted_per_tree.csv`](v8_b2_b4_boosted_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2632** | mean(per-class MAE) |
| Exact accuracy | **31.14%** | 71/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.9035** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **80.26%** | 183/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 92.54% | 211/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.0789** | mean(err_B1) across 228 pohon |
| B2 | **0.2675** | mean(err_B2) across 228 pohon |
| B3 | **0.4254** | mean(err_B3) across 228 pohon |
| B4 | **0.2807** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.0789 | 0 | 0 | 210 | 228 | 100.00% |
| B2 | 0.2675 | 0 | 5 | 174 | 223 | 97.81% |
| B3 | 0.4254 | 6 | 2 | 139 | 220 | 96.49% |
| B4 | 0.2807 | 2 | 3 | 169 | 223 | 97.81% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.044** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **-0.154** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **+0.004** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **-0.114** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.0477 ms/pohon** (20,951 pohon/detik)
- Median: 0.0480 ms
- Std: 0.0021 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 92.54% | 0.2632 | 17 | +0.00% |
| 5% | 93.42% | 0.2555 | 15 | -0.88% |
| 10% | 93.42% | 0.2566 | 15 | -0.88% |
| 20% | 93.42% | 0.2577 | 15 | -0.88% |

## Pohon yang Gagal (Acc±1 fail = 17)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0002` | train | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0246` | train | DAMIMAS | 1.00 | 0 | 2 | 1 | 1 |
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.75 | 0 | 3 | 0 | 0 |
| `DAMIMAS_A21B_0268` | train | DAMIMAS | 1.00 | 0 | 2 | 1 | 1 |
| `DAMIMAS_A21B_0273` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0034` | train | DAMIMAS | 0.50 | 0 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.75 | 0 | 3 | 0 | 0 |
| `DAMIMAS_A21B_0281` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0043` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0045` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0656` | train | DAMIMAS | 0.50 | 0 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0554` | test | DAMIMAS | 1.00 | 0 | 0 | 2 | 2 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 1.00 | 1 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0571` | test | DAMIMAS | 0.75 | 0 | 2 | 1 | 0 |
| `DAMIMAS_A21B_0574` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 6 | 0 |
| DAMIMAS_A21B_0244 | train | True | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 8 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | False | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 6 |
| DAMIMAS_A21B_0245 | train | True | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 3 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | False | 0 | 6 | 6 | 4 | 0 | 4 | 5 | 3 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 3 | 6 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |


===== reports/methods/M17_selector_regime.md =====

# `v6_selector` — Primary Metrics Breakdown

**Implementasi:** [`algorithms/v6_selector.py`](../../algorithms/v6_selector.py)  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v6_selector`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v6_selector_per_tree.csv`](v6_selector_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2599** | mean(per-class MAE) |
| Exact accuracy | **28.07%** | 64/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.8816** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **82.46%** | 188/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 96.05% | 219/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.1053** | mean(err_B1) across 228 pohon |
| B2 | **0.2325** | mean(err_B2) across 228 pohon |
| B3 | **0.3947** | mean(err_B3) across 228 pohon |
| B4 | **0.3070** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.1053 | 0 | 0 | 204 | 228 | 100.00% |
| B2 | 0.2325 | 2 | 2 | 179 | 224 | 98.25% |
| B3 | 0.3947 | 2 | 1 | 141 | 225 | 98.68% |
| B4 | 0.3070 | 1 | 1 | 160 | 226 | 99.12% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.044** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **+0.057** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **+0.009** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **+0.044** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.0993 ms/pohon** (10,074 pohon/detik)
- Median: 0.0986 ms
- Std: 0.0035 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 96.05% | 0.2599 | 9 | +0.00% |
| 5% | 94.30% | 0.2675 | 13 | +1.75% |
| 10% | 94.30% | 0.2697 | 13 | +1.75% |
| 20% | 93.86% | 0.2730 | 14 | +2.19% |

## Pohon yang Gagal (Acc±1 fail = 9)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0244` | train | DAMIMAS | 0.50 | 0 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0546` | test | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 1.00 | 1 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0558` | test | DAMIMAS | 1.00 | 0 | 2 | 1 | 1 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 0.75 | 1 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0574` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 5 | 0 |
| DAMIMAS_A21B_0244 | train | False | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 9 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | True | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 5 |
| DAMIMAS_A21B_0245 | train | True | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 3 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | True | 0 | 6 | 6 | 4 | 0 | 5 | 5 | 4 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 4 | 6 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |


===== reports/methods/M19_divide_adaptive.md =====

# `v5_adaptive_corrected` — Primary Metrics Breakdown

**Implementasi:** [`algorithms/adaptive_corrected.py`](../../algorithms/adaptive_corrected.py)  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v5_adaptive_corrected`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v5_adaptive_corrected_per_tree.csv`](v5_adaptive_corrected_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2774** | mean(per-class MAE) |
| Exact accuracy | **26.32%** | 60/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.9342** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **79.82%** | 182/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 93.86% | 214/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.1096** | mean(err_B1) across 228 pohon |
| B2 | **0.2368** | mean(err_B2) across 228 pohon |
| B3 | **0.4342** | mean(err_B3) across 228 pohon |
| B4 | **0.3289** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.1096 | 0 | 0 | 203 | 228 | 100.00% |
| B2 | 0.2368 | 2 | 2 | 178 | 224 | 98.25% |
| B3 | 0.4342 | 6 | 1 | 136 | 221 | 96.93% |
| B4 | 0.3289 | 3 | 1 | 157 | 224 | 98.25% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.039** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **+0.061** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **+0.057** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **+0.066** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.0073 ms/pohon** (136,242 pohon/detik)
- Median: 0.0073 ms
- Std: 0.0003 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 93.86% | 0.2774 | 14 | +0.00% |
| 5% | 93.86% | 0.2774 | 14 | +0.00% |
| 10% | 93.86% | 0.2774 | 14 | +0.00% |
| 20% | 93.86% | 0.2774 | 14 | +0.00% |

## Pohon yang Gagal (Acc±1 fail = 14)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0244` | train | DAMIMAS | 0.50 | 0 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0002` | train | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0273` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0043` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0045` | train | DAMIMAS | 0.75 | 0 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0546` | test | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0554` | test | DAMIMAS | 1.25 | 0 | 1 | 2 | 2 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 1.00 | 1 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0558` | test | DAMIMAS | 1.00 | 0 | 2 | 1 | 1 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 1.00 | 1 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0574` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 6 | 0 |
| DAMIMAS_A21B_0244 | train | False | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 9 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | False | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 6 |
| DAMIMAS_A21B_0245 | train | True | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 3 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | True | 0 | 6 | 6 | 4 | 0 | 5 | 5 | 4 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 4 | 6 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |


===== reports/methods/M20_weight_visibility_grid.md =====

# `v5_best_visibility` — Primary Metrics Breakdown

**Implementasi:** [`algorithms/best_visibility_grid.py`](../../algorithms/best_visibility_grid.py)  
**Dataset:** 228 pohon JSON (228 baris cocok dengan `method=v5_best_visibility`)  
**Raw data lengkap:** [`../benchmark_multidim/accuracy_per_tree.csv`](../benchmark_multidim/accuracy_per_tree.csv)  
**Per-method slice (filter sudah diterapkan):** [`v5_best_visibility_per_tree.csv`](v5_best_visibility_per_tree.csv)  
**Summary CSV:** [`../benchmark_multidim/accuracy_summary.csv`](../benchmark_multidim/accuracy_summary.csv)

Seluruh angka di bawah dihitung ulang dari `accuracy_per_tree.csv` oleh `scripts/generate_method_reports.py`.

## Primary Metrics

| Metric | Value | Derivation |
|---|---:|---|
| Macro class-MAE | **0.2664** | mean(per-class MAE) |
| Exact accuracy | **31.58%** | 72/228 pohon dengan err_B* = 0 di semua kelas |
| Total count MAE | **0.8728** | mean \|Σpred − Σgt\| per pohon |
| Total ±1 accuracy | **82.02%** | 187/228 pohon dengan \|Σpred − Σgt\| ≤ 1 |
| Acc ±1 per kelas per pohon (pelengkap) | 92.54% | 211/228 pohon dengan semua err_B* dalam ±1 |

## Per-Class MAE

Sumber: kolom `err_B*` di `accuracy_per_tree.csv` (sudah absolute).

| Class | MAE | Derivation |
|---|---:|---|
| B1 | **0.1009** | mean(err_B1) across 228 pohon |
| B2 | **0.2237** | mean(err_B2) across 228 pohon |
| B3 | **0.4474** | mean(err_B3) across 228 pohon |
| B4 | **0.2939** | mean(err_B4) across 228 pohon |

Cross-check versus [`accuracy_per_class.csv`](../benchmark_multidim/accuracy_per_class.csv):

| Class | MAE (csv) | over_count | under_count | exact | within1 | pct_within1 |
|---|---:|---:|---:|---:|---:|---:|
| B1 | 0.1009 | 0 | 0 | 205 | 228 | 100.00% |
| B2 | 0.2237 | 0 | 5 | 182 | 223 | 97.81% |
| B3 | 0.4474 | 2 | 7 | 135 | 219 | 96.05% |
| B4 | 0.2939 | 0 | 4 | 165 | 224 | 98.25% |

## Per-Class Mean Error (Bias)

Sumber: `pred_B* − gt_B*` di `accuracy_per_tree.csv`. Nilai `+` = overcount, `−` = undercount, `0` = tidak bias.

| Class | Mean Error | Derivation |
|---|---:|---|
| B1 | **+0.092** | mean(pred_B1 − gt_B1) across 228 pohon |
| B2 | **-0.066** | mean(pred_B2 − gt_B2) across 228 pohon |
| B3 | **-0.175** | mean(pred_B3 − gt_B3) across 228 pohon |
| B4 | **-0.215** | mean(pred_B4 − gt_B4) across 228 pohon |

## Kecepatan (pelengkap)

Sumber: [`speed_summary.csv`](../benchmark_multidim/speed_summary.csv) (30 repetisi × 228 pohon)

- Mean: **0.0228 ms/pohon** (43,833 pohon/detik)
- Median: 0.0227 ms
- Std: 0.0015 ms

## Robustness terhadap Noise Koordinat (pelengkap)

Sumber: [`robustness_summary.csv`](../benchmark_multidim/robustness_summary.csv)

| σ (noise_pct) | Acc ±1 | MAE | n_fail | Acc drop vs σ=0 |
|---:|---:|---:|---:|---:|
| 0% | 92.54% | 0.2664 | 17 | +0.00% |
| 5% | 92.11% | 0.2675 | 18 | +0.43% |
| 10% | 91.67% | 0.2686 | 19 | +0.87% |
| 20% | 91.67% | 0.2796 | 19 | +0.87% |

## Pohon yang Gagal (Acc±1 fail = 17)

| tree_id | split | domain | MAE | err_B1 | err_B2 | err_B3 | err_B4 |
|---|---|---|---:|---:|---:|---:|---:|
| `DAMIMAS_A21B_0246` | train | DAMIMAS | 1.25 | 0 | 2 | 2 | 1 |
| `DAMIMAS_A21B_0257` | train | DAMIMAS | 0.75 | 0 | 1 | 2 | 0 |
| `DAMIMAS_A21B_0258` | train | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0259` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0268` | train | DAMIMAS | 1.00 | 0 | 2 | 1 | 1 |
| `DAMIMAS_A21B_0034` | train | DAMIMAS | 0.50 | 0 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0035` | train | DAMIMAS | 0.50 | 0 | 2 | 0 | 0 |
| `DAMIMAS_A21B_0278` | train | DAMIMAS | 0.75 | 1 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0281` | train | DAMIMAS | 0.75 | 0 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0632` | train | DAMIMAS | 0.75 | 0 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0656` | train | DAMIMAS | 0.75 | 0 | 0 | 1 | 2 |
| `DAMIMAS_A21B_0557` | test | DAMIMAS | 0.75 | 1 | 0 | 2 | 0 |
| `DAMIMAS_A21B_0562` | test | DAMIMAS | 0.75 | 0 | 0 | 2 | 1 |
| `DAMIMAS_A21B_0569` | test | DAMIMAS | 0.75 | 1 | 0 | 0 | 2 |
| `DAMIMAS_A21B_0571` | test | DAMIMAS | 0.75 | 0 | 2 | 1 | 0 |
| `DAMIMAS_A21B_0573` | test | DAMIMAS | 0.75 | 0 | 1 | 0 | 2 |
| `DAMIMAS_A21B_0574` | test | DAMIMAS | 0.50 | 0 | 0 | 2 | 0 |

## Sample 10 Baris Per-Tree

Kolom penuh tersedia di per-method CSV di atas. Preview:

| tree_id | split | ok | gt_B1 | gt_B2 | gt_B3 | gt_B4 | pred_B1 | pred_B2 | pred_B3 | pred_B4 |
|---|---|---|---|---|---|---|---|---|---|---|
| DAMIMAS_A21B_0001 | train | True | 1 | 2 | 5 | 0 | 1 | 3 | 5 | 0 |
| DAMIMAS_A21B_0244 | train | True | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 8 |
| DAMIMAS_A21B_0577 | train | True | 3 | 0 | 4 | 2 | 3 | 0 | 3 | 2 |
| DAMIMAS_A21B_0002 | train | True | 1 | 0 | 7 | 4 | 2 | 0 | 6 | 5 |
| DAMIMAS_A21B_0245 | train | True | 0 | 0 | 3 | 2 | 0 | 0 | 2 | 3 |
| DAMIMAS_A21B_0578 | train | True | 1 | 5 | 1 | 0 | 1 | 4 | 1 | 0 |
| DAMIMAS_A21B_0003 | train | True | 1 | 2 | 5 | 1 | 1 | 3 | 6 | 1 |
| DAMIMAS_A21B_0246 | train | False | 0 | 6 | 6 | 4 | 0 | 4 | 4 | 3 |
| DAMIMAS_A21B_0579 | train | True | 5 | 3 | 6 | 1 | 5 | 3 | 5 | 1 |
| DAMIMAS_A21B_0004 | train | True | 0 | 0 | 8 | 0 | 0 | 0 | 8 | 0 |
