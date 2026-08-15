

===== README.md =====

# Project Expertise — Deteksi & Counting Tandan Sawit RGB+D

Volume 2 dari riset deteksi tandan buah segar (TBS) kelapa sawit.
Volume 1 ([Research-Pipeline](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline))
berisi tinjauan pustaka 182 makalah dan eksperimen diagnostik E-001 s.d. F-007.
Repo ini memulai eksperimen baru dengan tujuan yang lebih tajam.

## Tujuan

Membandingkan tiga arsitektur detektor — **YOLO26l, RT-DETR-L, RF-DETR-L** —
pada dataset **RGB** dan **RGB+Depth (4-kanal)**, lalu mengukur dampaknya
terhadap **deteksi**, **klasifikasi kematangan (B1–B4)**, dan **counting
per pohon**.

Sejak **Fase 6** tujuannya diperluas: bukan lagi hanya membandingkan tiga
arsitektur satu-tahap, tapi **memaksimalkan metrik dengan cara apa pun** —
termasuk pipeline dua-tahap dan model non-YOLO — karena diagnostik menunjukkan
pembatasan ke satu detektor tunggal-lah yang menahan angkanya (lihat
[docs/DIAGNOSIS-DEPTH.md](docs/DIAGNOSIS-DEPTH.md)).

## Status

Fase 0–6 **selesai** (`V2-E-001` s.d. `V2-E-026`). Pengumpulan metrik
dihentikan 2026-08-12.

**Baca [docs/LAPORAN-AKHIR.md](docs/LAPORAN-AKHIR.md) lebih dulu** — di situ
seluruh hasil, batasnya, dan alasan berhentinya dirangkum. Dua temuan penutup:

- **Kedua dataset terpisah ~80 hari akuisisi** (SawitMVC-YOLO Mei 2026,
  SawitMVC-Depth Juli 2026). Pada 1.408 citra ber-ID sama, B3 berbanding
  3.604 lawan 321 — perbandingan RGB-vs-RGB+D lintas-dataset mengukur populasi
  buah yang berbeda, bukan efek depth (`V2-E-022`).
- **Split test 352 tidak punya daya statistik** untuk pertanyaan ini: CI 95%
  mAP50 selebar ±0,058 pada 410 kotak GT, sementara selisih yang diperebutkan
  0,0044 (`V2-E-023`).

Satu temuan positif menutup proyek: **depth menaikkan lokalisasi, bukan
kematangan.** Uji berpasangan terakhir (resep identik, hanya kanal masukan yang
beda) memberi AP50 lokalisasi **0,7636 dengan depth vs 0,7358 tanpa** —
menembus plafon 0,733 yang sebelumnya dikira batas dataset, ternyata batas
modalitas RGB. Selisih +0,0278 dengan P(Δ>0)=0,921; CI masih memuat nol karena
split ini tidak mampu memisahkan efek di bawah ~0,10 (`V2-E-024`).

Ringkasan per fase: [experiments/STATUS.md](experiments/STATUS.md).

### Matriks hasil (test split; mAP50 pycocotools / Class ±1 Acc Ridge+F_all)

| Dataset | YOLO26l | RT-DETR-L | RF-DETR-L |
|---|---|---|---|
| RGB 953 pohon | 0,5435 / 72,16% | 0,5781 / 76,24% | 0,6012 / 76,24% |
| RGB 352 pohon | 0,3606 / 89,55% | 0,4343 / 90,91% | 0,4544 / 88,18% |
| RGB+D 352 pohon (`inverse`) | 0,3919 / 87,73% | 0,3877 / 88,64% | 0,4186 / 88,18% |
| RGB+D 352 pohon (`edge`, Fase 5) | 0,4316 / 87,27% | — | — |
| **Dua-tahap (Fase 6)** | **0,4500 / 85,91%** | — | — |

**Dua peringatan wajib sebelum mengutip matriks ini:**

1. **Baris 953 dan 352 tidak sebanding.** Bukan hanya karena ketimpangan kelas,
   tapi karena kedua dataset direkam terpisah ~80 hari pada fase kematangan
   kebun yang berbeda (`V2-E-022`). Keduanya mengukur populasi buah yang
   berbeda.
2. **Selisih antar-sel sebagian besar di bawah derau.** CI 95% mAP50 pada
   split test 352 selebar ±0,058 (`V2-E-023`). Jangan memperlakukan matriks ini
   sebagai peringkat.

Detailnya di [docs/LAPORAN-AKHIR.md](docs/LAPORAN-AKHIR.md) dan
[docs/DIAGNOSIS-DEPTH.md](docs/DIAGNOSIS-DEPTH.md).

## Navigasi

| Dokumen | Isi |
|---|---|
| [docs/LAPORAN-AKHIR.md](docs/LAPORAN-AKHIR.md) | **Mulai dari sini** — seluruh hasil, ancaman validitas, dan rekomendasi lanjutan |
| [docs/DIAGNOSIS-DEPTH.md](docs/DIAGNOSIS-DEPTH.md) | **Fase 6** — jalan penemuan kenapa RGB+D tidak menaikkan mAP, lengkap dengan probe yang bisa dijalankan ulang; §9 memuat koreksi sebab-akibat |
| [docs/REPRODUKSI-FASE6.md](docs/REPRODUKSI-FASE6.md) | **Fase 6** — urutan perintah persis untuk membangun ulang seluruh hasil, plus 9 jebakan yang wajib dihindari |
| [docs/REGENERASI.md](docs/REGENERASI.md) | Cara membangun ulang data turunan yang dihapus 2026-08-12 (dataset 4-kanal, crop, rak symlink) — perintah, urutan, verifikasi |
| [docs/REKAP.md](docs/REKAP.md) | Seluruh angka, percobaan gagal/berhasil, dan pelajaran dari Volume 1 |
| [docs/DATASET.md](docs/DATASET.md) | Spesifikasi kedua dataset |
| [docs/RENCANA.md](docs/RENCANA.md) | Rencana kerja per fase |
| [experiments/EKSPERIMEN.md](experiments/EKSPERIMEN.md) | Log append-only per hipotesis (`V2-E-0xx`) |
| [experiments/STATUS.md](experiments/STATUS.md) | Status fase + matriks hasil terkini |
| [results/](results/) | JSON hasil tiap eksperimen (sumber setiap angka yang dikutip) |

## Skrip

### Fase 1–5 (satu-tahap: detektor 3-kanal / 4-kanal)

| Skrip | Fungsi |
|---|---|
| `build_4ch_dataset.py` | Susun dataset BGRD TIFF 4-kanal |
| `create_depth_edge_dataset.py` | Varian encoding kanal depth (`edge`, `clipped`, `valid_mask`, …) |
| `train_yolo_4ch_screening.py` | Training YOLO26l generik (3- atau 4-kanal) |
| `train_yolo_4ch_dropout.py` | Modality dropout pada kanal depth |
| `train_yolo_midfusion.py` | Mid-fusion + gate taknol (lever arsitektur Fase 5) |
| `train_rfdetr_4ch.py` | RF-DETR-L 4-kanal |
| `eval_pycoco_*.py`, `run_counting_*.py`, `bootstrap_ci.py` | Evaluasi deteksi, counting, dan CI |
| `make_absolute_split.py`, `materialize_split_dirs.py` | Utilitas split (hindari bug resolusi path ultralytics) |

### Fase 6 (dua-tahap: lokalisasi terpisah dari kematangan)

| Skrip | Fungsi |
|---|---|
| `probe_depth_signal.py` | 5 diagnostik read-only yang mendasari Fase 6 — jalankan untuk memverifikasi tiap angka di `DIAGNOSIS-DEPTH.md` |
| `make_pretrain_split.py` | Daftar pohon 953 yang **bebas bocor** terhadap val/test 352 (846 pohon) |
| `make_agnostic_dataset.py` | Dataset deteksi 1-kelas ("tandan") untuk memisahkan lokalisasi dari klasifikasi |
| `build_crop_dataset.py` | Crop tandan + kanal **relief depth** + mask box target (`--sisi` mengatur resolusi) |
| `train_crop_classifier.py` | Classifier kematangan; `--tahap pretrain/finetune/gabung`, head ordinal/hybrid, gate taknol, loss auxiliary RGB-only |
| `probe_fitur_depth.py` | Uji apakah statistik depth **terpool** menambah info di atas RGB (dasar V2-E-016) |
| `eval_detector_agnostic.py` | AP50 lokalisasi murni + WBF antar-detektor |
| `pilih_detektor.py` | Pilih kombinasi detektor terbaik — **selalu di split val** |
| `sweep_inferensi.py` | Sweep imgsz × NMS IoU tanpa training |
| `eval_twostage.py` | Rekomposisi dua-tahap → mAP50 yang sebanding dengan Fase 1–5 |
| `run_counting_twostage.py` | Counting Ridge+F_all memakai fungsi yang **sama** dengan Fase 1–5 |

### Penutupan (validitas dan daya statistik)

| Skrip | Fungsi |
|---|---|
| `probe_pergeseran_temporal.py` | Bandingkan label kedua dataset pada citra ber-ID sama + baca tanggal akuisisi — dasar `V2-E-022` |
| `bootstrap_map.py` | CI 95% mAP50/AP50 dengan resampling tingkat citra; selisih antar-model **berpasangan** — dasar `V2-E-023` |
| `dump_classaware.py` | Dump prediksi detektor (RGB jpg atau 4-kanal TIFF) ke format yang bisa difusikan/di-bootstrap; `--agnostik` untuk AP50 lokalisasi |
| `fuse_final.py` | Fusi per-kelas lintas-jalur, bobot dipilih di val lalu dikunci |
| `buat_test_953_bersih.py` | Bangun split test 953 yang benar-benar tak tersentuh pretraining (19 pohon) |
| `buat_agnostic352_4ch.py` | Bangun `agnostic352_4ch` (dataset di balik `V2-E-024`); `--periksa` membandingkannya dengan direktori acuan |

## Data turunan (di luar repo, di `/workspace/`)

Semua regenerable dari skrip di atas — sengaja tidak ikut git karena besar.
**Perintah persis dan urutan ketergantungannya ada di
[docs/REGENERASI.md](docs/REGENERASI.md)**, termasuk untuk folder yang sudah
dihapus.

Masih ada di disk:

| Folder | Dibuat oleh | Isi |
|---|---|---|
| `depth_png_352/` | `reproject_depth.py` (Volume 1) | Depth tereproyeksi ke frame color, uint8 kanonik. Perantara wajib semua dataset 4-kanal |
| `SawitMVC-Depth-4ch-edge/` | `create_depth_edge_dataset.py` | TIFF 4-kanal encoding `edge` — pemenang Fase 5, dasar `V2-E-010`/`V2-E-024` |
| `agnostic953/`, `agnostic352/` | `make_agnostic_dataset.py` | Dataset YOLO 1-kelas (symlink citra + label ditulis ulang) |
| `agnostic352_4ch/` | `buat_agnostic352_4ch.py` | Versi 4-kanal dari `agnostic352` — dataset di balik `V2-E-024` |
| `agnostic953_test_{bersih,penuh}/` | `buat_test_953_bersih.py` | Split test 953 bersih (19 pohon) + versi penuh |
| `SawitMVC-Depth{,-4ch-edge}-YOLO/` | `materialize_split_dirs.py` | Rak symlink `{split}/images,labels` untuk skrip eval lama |

Dihapus 2026-08-12 saat proyek ditutup (disk + bucket backup), ~23 GB, bisa
dibangun ulang ~45 menit tanpa GPU: `SawitMVC-Depth-4ch/` (basis `inverse`),
`-clipped/`, `-valid_mask/`, `-4ch-YOLO/`, `crops_fase6/`, `crops_fase6_256/`.

Di dalam repo: `splits_fase6/` (daftar split bebas-bocor, kecil, ikut git),
`runs/` + `runs_fase6/` (bobot dan log training — **tidak pernah dihapus**,
lihat ATURAN #1 di `/workspace/CLAUDE.md`), dan `requirements-freeze.txt`
(181 paket ter-pin; lingkungan yang menghasilkan seluruh angka di sini).

## Repo terkait

| Repo | Peran |
|---|---|
| [Research-Pipeline](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline) | Volume 1: tinjauan pustaka + eksperimen diagnostik |
| [Baseline-SawitMVC](https://github.com/ULM-SawitMVC/Baseline-SawitMVC) | Pipeline counting YOLO26m + Ridge, angka baseline |


===== docs/DATASET.md =====

# Spesifikasi Dataset

## 1. SawitMVC (953 pohon, RGB)

| Properti | Nilai |
|---|---|
| Sumber | [ULM-DS-Lab/SawitMVC-YOLO](https://huggingface.co/datasets/ULM-DS-Lab/SawitMVC-YOLO) |
| Lisensi | CC BY-NC 4.0 |
| Pohon | 953 (908 difoto 4 sisi, 45 difoto 8 sisi) |
| Citra | 3.992 |
| Resolusi | 960 x 1280 (potret) |
| Bbox | 18.540 |
| Tandan unik | 9.823 |
| Kelas | B1, B2, B3, B4 |
| Sisi per pohon | 4 atau 8 |
| Split (per pohon) | 716 train / 96 val / 141 test |
| k (duplikasi lintas-sisi) | 1,89 |
| Kebun | DAMIMAS dan LONSUM, Kab. Tanah Laut, Kalsel |
| Perangkat | 10 model smartphone, eksposur otomatis |

### Distribusi kelas (seluruh dataset)

| Kelas | Tandan unik | Proporsi |
|---|---:|---:|
| B3 | terbanyak | ~38% |
| B4 | | ~20% |
| B2 | | ~18% |
| B1 | | ~12% |

### Arah kelas

**B1 = MATANG** (jingga-merah, besar, posisi paling bawah di pohon).
Menurun sampai **B4 = MENTAH** (gelap kehijauan, kecil, posisi paling atas).

### Raw master (Sawit, 3.992 citra 3024x4032)

Ada master mentah beresolusi tinggi di `/workspace/Sawit/data`. Rasio aspek
identik (0,75), sehingga koordinat YOLO ternormalisasi dari MVC berlaku
persis. Nama berkas raw **tidak unik** secara global (936 nama kembar antar
folder) — perlu pencocokan berbasis isi untuk pemetaan.

## 2. SawitMVC-Depth (352 pohon, RGB + Depth)

| Properti | Nilai |
|---|---|
| Sumber | [ULM-DS-Lab/SawitMVC-Depth](https://huggingface.co/datasets/ULM-DS-Lab/SawitMVC-Depth) |
| Lisensi | CC BY-NC 4.0 |
| Repo | **Private** (butuh token HuggingFace) |
| Pohon | 352 |
| Citra RGB | 1.408 |
| Resolusi RGB | 1.280 x 800 (lanskap) |
| Bbox | 2.299 |
| Kelas | B1, B2, B3, B4 |
| Depth | Orbbec sensor, Y16 848x480, uint16 milimeter |
| Split | **Ada** — 70/15/15 per pohon, seed 10, di `/workspace/SawitMVC-Depth-YOLO/split_stats.json` |

### Distribusi kelas (terbalik dari SawitMVC)

| Kelas | Bbox | Proporsi |
|---|---:|---:|
| B2 | 1.000 | 43,5% |
| B1 | 831 | 36,1% |
| B3 | 322 | 14,0% |
| B4 | 148 | 6,4% |

Kepadatan: 1,63 bbox/citra (vs 4,64 di SawitMVC). **Angka mAP di dataset ini
TIDAK sebanding dengan angka SawitMVC.**

### Tiga sifat penting depth (sudah terverifikasi)

1. **Sidecar `alignedTo: color` menyesatkan.** Buffer depth masih di grid
   kamera depth. Reproyeksi penuh diperlukan (`reproject_depth.py` dari
   Research-Pipeline `experiments/code/build/`), bukan `cv2.resize` naif.
2. **Dua unit kamera** dengan kalibrasi berbeda (fx_depth 416,55 vs 414,38).
   Kalibrasi wajib dibaca per berkas dari sidecar.
3. **Rentang Z_NEAR/Z_FAR** di sidecar (0,3–8,0 m) tidak cocok — gunakan
   **0,8–15,0 m**.

## 3. Perbandingan Kedua Dataset

| | SawitMVC | SawitMVC-Depth |
|---|---|---|
| Jumlah pohon | 953 | 352 |
| Citra | 3.992 | 1.408 |
| Resolusi | 960x1280 (potret) | 1280x800 (lanskap) |
| Orientasi | Potret | Lanskap |
| Bbox/citra | 4,64 | 1,63 |
| Kelas dominan | B3 | B2 |
| Kelas langka | B1 | B4 (hanya 148) |
| Depth | Tidak | Ya |
| Split resmi | Ada | Ada (70/15/15 per pohon, seed 10, tree-stratified, `SawitMVC-Depth-YOLO`) |

**Konsekuensi:** Perbandingan RGB vs RGB+D hanya sah pada dataset yang sama
(352 pohon). Angka dari 953 pohon adalah referensi terpisah.


===== docs/CATATAN-TEKNIS-FASE1.md =====

# Catatan teknis Fase 1 (untuk kelanjutan otomatis)

## Bug ditemukan & diperbaiki: resolusi path `data_rgb.yaml`

`research-pipeline/reproduce/experiments/config/data_rgb.yaml` punya
`path: ../../../evidence/experiments/splits_rgb` (relatif). Ultralytics 8.4.103
me-resolve `path:` relatif terhadap **CWD proses**, bukan terhadap lokasi file
yaml. Kalau training dijalankan dari `reproduce/experiments/` (cara "wajar"),
tiga `..` melenceng ke `/workspace/evidence/...` (tidak ada), lalu ultralytics
fallback ke `DATASETS_DIR`-relative dan menghasilkan path rusak
`/evidence/experiments/splits_rgb/val.txt` -> crash langsung di awal training.

**Perbaikan (tanpa mengubah file research-pipeline):** jalankan skrip training
dengan **CWD = `research-pipeline/reproduce/experiments/config/`** (folder
tempat `data_rgb.yaml` berada), dan panggil skrip train via path absolut.
Contoh yang benar (dipakai untuk retrain YOLO26l):

```bash
cd /workspace/research-pipeline/reproduce/experiments/config
/workspace/research-pipeline/reproduce/experiments/.venv/bin/python \
  /workspace/research-pipeline/reproduce/experiments/train/train_yolo26l.py \
  --weights /workspace/research-pipeline/reproduce/experiments/yolo26l.pt \
  --imgsz 1280 --epochs 60 --batch 4 --name yolo26l_e60_i1280_v2repro
```

Pola CWD yang sama berlaku untuk `train_rtdetr.py` (pakai `data_rgb.yaml` yang
sama). `train_rfdetr.py` beda jalur (pakai `rfdetr_ds/`, bukan yaml ultralytics)
-- perlu dicek terpisah apakah punya masalah serupa sebelum dijalankan.

## Cache dataset ke disk lokal (2026-08-08) — hasil terukur

Dataset di-cache dari `/workspace` (network mount, moosefs) ke disk lokal
overlay (`/home/claudeuser/data-cache/`): `SawitMVC` (2,4G), `SawitMVC-Depth-YOLO`
(1,6G), `depth_png_v2` (0,2G). Split file lokal + `data_rgb_local.yaml` dibuat
di `/home/claudeuser/data-cache/`; symlink `rfdetr_ds/*/images/*` dialihkan ke
cache lokal. Skrip pemicu training lokal: `scripts/train_ultra_local.py`
(replikasi `train_yolo26l.py`/`train_rtdetr.py`, hanya `--data` yang beda,
tidak mengedit file research-pipeline apa pun).

**Hasil setelah RT-DETR-L direstart dengan cache lokal:** GPU utilization naik
jadi 97% konsisten (sebelumnya osilasi 33-99%), tapi **kecepatan wall-clock per
epoch nyaris sama** (~326 detik vs ~334 detik sebelumnya). Kesimpulan:
hipotesis awal (I/O jaringan sebagai bottleneck utama) **salah** — GPU compute
RTX A4500 sendiri yang jadi batas kecepatan untuk beban kerja ini, bukan
storage. Osilasi utilization yang teramati sebelumnya kemungkinan sampling
sesaat, bukan pola I/O-wait yang konsisten.

**Keputusan:** cache lokal tetap dipertahankan (tidak merugikan, dan akan
berguna di Fase 2/3/5 yang membaca ulang dataset 352-pohon berkali-kali untuk
banyak percobaan pendek — di situ overhead scan/setup per-run yang berulang
baru benar-benar terasa). Tapi untuk mempercepat Fase 1 secara berarti,
upgrade GPU (kandidat: L4, tensor core gen-4, per log asli E-021 mencatat ~1
jam/60 epoch di L4 vs ~4-4,4 jam di A4500) lebih relevan daripada optimasi
storage lebih lanjut.

## Urutan Fase 1 (status берjalan)

1. [running] YOLO26l retrain -> `evidence/experiments/runs/yolo26l_e60_i1280_v2repro/`
2. [belum] RT-DETR-L retrain -> `..._rtdetr_l_e60_i1280_v2repro/`
3. [belum] RF-DETR-L retrain (override config lihat docs/RENCANA.md Fase 1.3)
4. [belum] Eval pycocotools ketiganya vs target E-021 (0,5300/0,5784/0,6038)
5. [belum] Inference + adaptor per-pohon (scripts/adapters/) + counting Baseline-SawitMVC
   (ikuti pola exp_counting_v3.py: fit Ridge segar pada F_all per detektor,
   BUKAN run_e2e_pipeline.py -- lihat docs/SCHEMA-PERTREE.md)
6. [belum] Tulis entri V2-E-001 (validasi reproduksi) dan V2-E-002 (mAP vs counting)
   di experiments/EKSPERIMEN.md


===== docs/DIAGNOSIS-DEPTH.md =====

# Diagnosis: Kenapa RGB+D Tidak Menaikkan mAP

Dokumen ini mencatat **jalan penemuannya**, bukan cuma kesimpulannya — supaya
tiap langkah bisa diperiksa ulang dan dibantah. Semua angka dihasilkan tanpa
melatih apa pun (probe read-only, hitungan menit) dan bisa direproduksi dengan:

```bash
.venv/bin/python scripts/probe_depth_signal.py --probe semua
```

Ditulis 2026-08-11, sebagai dasar Fase 6.

---

## 0. Premis yang mau diuji

Premis yang dipegang sebelum ini: *"dataset SawitMVC tanpa depth, walau dipotong
jadi 25%, tetap jauh di atas SawitMVC+Depth — jadi ada yang salah dengan depth."*

Angka yang memicunya nyata: YOLO26l pada 953 pohon dapat test mAP50 **0,5435**,
sementara pada 352 pohon RGB+D cuma **0,3919**. Selisihnya besar dan konsisten.

Pertanyaannya: apakah selisih itu benar-benar disebabkan depth?

---

## 1. Probe pertama: bandingkan isi kedua dataset, bukan cuma jumlah pohonnya

Yang biasa dikutip adalah jumlah pohon (953 vs 352, rasio 2,7×). Tapi mAP
dihitung dari **instance**, bukan pohon. Jadi saya hitung ulang seluruh file
label:

| Split | citra | instance | /citra | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|---|---|
| 953-train | 3.000 | 14.041 | 4,68 | 11,2% | 18,6% | **52,2%** | 17,9% |
| 953-val | 404 | 1.887 | 4,67 | 10,7% | 20,6% | 50,8% | 18,0% |
| 953-test | 588 | 2.612 | 4,44 | 9,6% | 19,0% | **53,9%** | 17,4% |
| 352-train | 980 | 1.517 | 1,55 | 35,8% | 43,6% | **14,2%** | **6,5%** |
| 352-val | 208 | 372 | 1,79 | 37,4% | 44,6% | 11,6% | 6,5% |
| 352-test | 220 | 410 | 1,86 | 35,9% | 42,4% | **15,4%** | **6,3%** |

Dua hal langsung terlihat:

1. Rasio instance bukan 2,7× tapi **9,3×** (14.041 vs 1.517) — kepadatan objek
   per citra turun dari 4,68 ke 1,55.
2. Komposisi kelasnya **terbalik**. B3 turun dari 7.333 ke 215 instance
   (**34× lebih sedikit**), B4 dari 2.513 ke 98 (**26×**).

Sekarang lihat mAP50 dipecah per kelas (YOLO26l, test split):

| | B1 | B2 | B3 | B4 | mAP50 |
|---|---|---|---|---|---|
| 953-RGB | 0,7705 | 0,4479 | **0,6050** | **0,3506** | 0,5435 |
| 352-RGB | 0,6804 | 0,4320 | **0,2001** | **0,1299** | 0,3606 |

B1 dan B2 nyaris sama. **Seluruh gap ada di B3 dan B4** — persis dua kelas yang
instance-nya menghilang. Karena mAP50 itu rata-rata makro empat kelas, dua kelas
yang kelaparan langsung menyeret separuh skor.

**Kesimpulan probe 1:** gap 953-vs-352 adalah efek kelangkaan label, bukan efek
depth. Dan konsekuensinya untuk premis awal: memotong dataset 953 jadi 25% tetap
menyisakan ~1.800 instance B3 (vs 215 di dataset depth) dengan komposisi kelas
yang sama — jadi "RGB 25% tetap menang" adalah hasil yang **diharapkan** dan
tidak menguji apa pun tentang depth.

Perbandingan yang sah cuma di dalam split 352 yang sama. Di situ, untuk YOLO26l,
RGB+D justru **di atas** RGB: 0,3919 (`inverse`) dan 0,4316 (`edge`) vs 0,3606.

---

## 2. Probe kedua: sebenarnya yang rusak itu mencari tandan, atau menamainya?

mAP50 mencampur dua kemampuan berbeda: menemukan objek (lokalisasi) dan memberi
kelas yang benar. Keduanya bisa dipisah dengan mengevaluasi bobot yang sama dua
kali — sekali normal, sekali dengan semua kelas dilipat jadi satu.

Diukur pada `runs/yolo26l_e60_i1280_rgb352/weights/best.pt`, test split.
(Reimplementasi divalidasi dulu: mAP50 saya 0,3707 vs pycocotools 0,3711.)

```
mAP50 class-aware      = 0,3707
AP50  class-agnostic   = 0,6677     <- lokalisasi murni
selisih                = 0,2970     = 44,5% dari kemampuan lokalisasi
```

Detektornya **menemukan tandan dengan baik**. Yang hangus adalah penamaan kelas.

Konfusi pada box yang sudah benar lokasinya (IoU≥0,5, conf≥0,25):

| | →B1 | →B2 | →B3 | →B4 | recall |
|---|---|---|---|---|---|
| B1 | 92 | 26 | 0 | 0 | 78,0% |
| B2 | 13 | 83 | 12 | 0 | 76,9% |
| B3 | 0 | 21 | 11 | 4 | **30,6%** |
| B4 | 0 | 1 | 3 | 5 | 55,6% |

Akurasi klasifikasi 70,5%. Perhatikan polanya: **semua kesalahan jatuh ke kelas
bertetangga**, nol kasus B1→B3 atau B1→B4. Kematangan itu kontinum, jadi ini
masalah **ordinal**, bukan klasifikasi 4-arah sembarang.

Catatan kejujuran: 70,5% itu bersyarat pada box yang berhasil dideteksi
(271 dari 410). Kalau yang tidak terdeteksi dihitung salah, akurasi atas seluruh
GT = 191/410 = **46,6%**.

---

## 3. Probe ketiga: apakah depth membawa informasi kelas sama sekali?

Ini pertanyaan intinya. Saya uji dua hipotesis berbeda.

### Hipotesis A — skala metrik (GAGAL)

Geometri pinhole itu eksak: `d_piksel = f · D_metrik / Z`. Citra tunggal tidak
bisa memulihkan ukuran fisik (ambiguitas skala monokuler), tapi dengan depth
bisa: `D = d · Z / f`. Kalau tandan B1..B4 beda ukuran fisik, ukuran metrik
harus memisahkan kelas lebih baik daripada ukuran piksel.

Hasil (2.299 box):

| | B1 | B2 | B3 | B4 |
|---|---|---|---|---|
| ukuran piksel (median) | 153,9 | 136,7 | 122,1 | 108,8 |
| Z (m, median) | 1,36 | 1,33 | 1,31 | 1,20 |

**Z hampir konstan lintas kelas.** Protokol pengambilan foto memang jarak tetap
(operator berdiri di jarak yang mirip), jadi mengalikan dengan Z cuma menggeser
skala — tidak menambah daya pisah. Hipotesis A gugur.

Bonus temuan: cakupan depth **di dalam box = 95,1% valid**. Angka "29% piksel
invalid" yang selama ini dikutip itu **latar** (langit, pohon jauh), bukan objek.
Jadi narasi "depth rusak karena banyak lubang di tandan" tidak berlaku.

### Hipotesis B — relief lokal (BERHASIL)

Kalau jarak absolut tidak informatif, mungkin yang informatif adalah **kontras
kedalaman antara tandan dan sekelilingnya**: tandan matang menonjol keluar dari
pelepah, tandan muda tertanam ke dalam.

Diukur sebagai `relief = median Z(cincin sekitar) − median Z(dalam box)`:

| | B1 | B2 | B3 | B4 |
|---|---|---|---|---|
| relief (median) | **+2,8 cm** | 0,0 cm | −1,5 cm | **−5,1 cm** |
| lebih dekat dari sekitar | 61,3% | 50,7% | 41,4% | 26,4% |

**Monoton sempurna terhadap kematangan.** Kruskal-Wallis 4 kelas:
**H = 99,8, p = 1,7×10⁻²¹**.

Ini konsisten dengan hipotesis F-002 yang sudah tercatat di Volume 1: depth
membantu untuk pembedaan **geometris** (B4 kecil/tertanam/tertutup pelepah),
bukan untuk ambiguitas **fotometrik** (warna).

---

## 4. Probe keempat: kenapa sinyal sekuat itu tidak terpakai?

Sinyalnya ada (p≈10⁻²¹), tapi amplitudonya perlu dibandingkan dengan resolusi
kanal yang dipakai untuk mengangkutnya.

Encoding yang dipakai sejak Volume 1: uint8, inverse depth, rentang tetap
`[Z_NEAR=0,8; Z_FAR=15,0]` m. Turunkan besar satu level dalam meter:

```
v = 1 + 254 · (1/Z − 1/Z_FAR) / (1/Z_NEAR − 1/Z_FAR)
dZ/dv = Z² · (1/Z_NEAR − 1/Z_FAR) / 254
```

| Z (m) | 1 level uint8 |
|---|---|
| 1,0 | 0,5 cm |
| 1,5 | 1,0 cm |
| 2,0 | 1,9 cm |
| **2,5** | **2,9 cm** |
| 3,0 | 4,2 cm |
| 4,0 | 7,5 cm |

Median Z per citra di dataset ini 2,49 m. Jadi satu level ≈ **2,9 cm**,
sementara sinyal relief median cuma **0,8 cm** — yaitu **0,27 level**. Bahkan
B4 (5,1 cm) hanya 1,8 level. Ditambah derau sensor Orbbec (~1% dari Z ≈ 2,5 cm),
**SNR per-piksel ≈ 0,3**.

Yang menarik: kanal depth-nya sendiri *terpakai penuh* (entropi 7,68 dari 8 bit,
p25–p75 membentang 114 level). Rentang dinamisnya habis untuk menggambarkan
**ramp global adegan** — tanah, batang, latar 0,8–6,4 m — yang justru
**nuisance**: median Z per citra bervariasi mean 2,49 m, std 0,82 m, rentang
0,80–6,44 m, mengikuti di mana operator berdiri, bukan mengikuti kematangan.

Jadi kanal depth membawa: amplitudo besar yang tidak relevan + sinyal relevan
yang sub-kuantum. Itu resep bagus untuk model belajar korelasi semu.

---

## 5. Probe kelima: sinyalnya bisa diselamatkan dengan pooling

Derau turun ~√N saat dirata-rata atas N piksel. Karena itu sinyal yang tenggelam
per-piksel bisa muncul setelah pooling wilayah. Diuji dengan AUC memisahkan
B1 vs B4 memakai relief yang dihitung dari N piksel acak:

| piksel di-pool | AUC train+val | AUC test |
|---|---|---|
| 1 | 0,592 | 0,577 |
| 16 | **0,724** | 0,650 |
| 256 | 0,728 | 0,593 |
| 4.096 | 0,730 | 0,621 |

Naik tajam dari 1 ke 16 piksel, lalu jenuh.

---

## 6. Sintesis: satu penjelasan yang menutup semuanya

> Sinyal depth di dataset ini bersifat **relatif, lokal, dan hanya terbaca
> setelah pooling wilayah**.

Konsekuensinya:

- **Early fusion di stem adalah tempat paling buruk.** Di sana resolusinya
  penuh dan poolingnya minimum — persis rezim ber-SNR 0,3. Ini menjelaskan
  kenapa E-022, E-027, E-032, V2-E-005/006 semuanya gagal dengan pola yang sama.
- **Kenapa `edge` (Sobel depth) satu-satunya yang menang** (V2-E-008/010):
  operator turunan **membuang ramp global** — yang nuisance — dan menonjolkan
  relief lokal. Jadi teorinya bukan cuma menjelaskan kegagalan, tapi juga
  meretrodiksi satu-satunya keberhasilan.
- **Sinyalnya cocok dengan lubang yang ada.** Probe 2 bilang yang rusak adalah
  klasifikasi ordinal; probe 3 bilang depth membawa sinyal ordinal. Diagnosis
  dan obatnya nyambung.

### Yang keliru dalam pemahaman sebelumnya

| Pemahaman lama | Hasil pengukuran |
|---|---|
| "Gap 953-vs-352 karena depth" | Karena B3/B4 34×/26× lebih langka |
| "29% piksel invalid merusak sinyal di tandan" | Di dalam box, depth 95,1% valid |
| "Depth memberi skala metrik" | Z hampir konstan (1,20–1,36 m), tidak memisahkan |
| "Depth harus di-fusi lebih pintar di backbone" | Harus dikonsumsi setelah pooling, di jalur klasifikasi |

Catatan: rentang `[0,8; 15,0]` dipilih di Volume 1 dengan memaksimalkan
**entropi seluruh citra**. Itu objektif yang keliru untuk tugas ini — ia
mengoptimalkan deskripsi langit dan pohon jauh, padahal yang dibutuhkan adalah
resolusi pada skala objek.

---

## 7. Uji akhir: ternyata sinyalnya nyata tapi REDUNDAN

Diagnosis di atas memberi resep jelas — konsumsi depth sebagai relief lokal
setelah pooling wilayah, di jalur klasifikasi. Itu dikerjakan (`V2-E-015/016`),
dan hasilnya menutup pertanyaannya dengan cara yang tidak diduga.

**Uji 1 — cabang CNN depth, 3 seed** (relief + mask valid, difusikan setelah
global pooling, gate init taknol, plus loss auxiliary RGB-only):

| seed | Δ val | Δ test |
|---|---|---|
| 101 | −0,0430 | −0,0341 |
| 202 | −0,0242 | −0,0463 |
| 303 | +0,0242 | +0,0195 |

Rata-rata −1,4pp val (p=0,55), −2,0pp test (p=0,42). Gate berhenti di ~0,11
dari init 0,10 — model tidak membuka jalur depth. Catatan: **satu seed sempat
memberi +5,9pp**, persis besaran yang kalau dilaporkan sendirian akan terbaca
sebagai kemenangan.

**Uji 2 — depth diberi kondisi paling menguntungkan.** Uji 1 bisa dibantah:
cabang CNN menaruh pooling di paling akhir, padahal §5 bilang pooling-lah yang
menyelamatkan sinyal. Jadi diuji ulang dengan 8 statistik depth yang **sudah
terpool secara analitik** (relief cincin−box, median, std, cakupan, rentang
persentil), ditempel langsung ke fitur penultimate classifier RGB terlatih:

| Fitur | val | test |
|---|---|---|
| statistik depth saja (8 dim) | 0,3468 | 0,3756 |
| RGB saja (768 dim) | 0,6774 | 0,6415 |
| RGB + statistik depth | 0,6720 | 0,6415 |

Sinyal relief terverifikasi masih utuh di crop (B1 +1,34 cm → B4 −4,29 cm,
monoton). Depth sendirian jelas di atas tebakan acak. **Kontribusi di atas RGB:
−0,5pp val, +0,0pp test.**

### Pernyataan akhirnya

> `I(Y;D) > 0` **tetapi** `I(Y;D | RGB) ≈ 0`.

Depth membawa informasi kematangan, tapi informasi itu sudah seluruhnya
terkandung di RGB. Penjelasan fisiknya sederhana: tandan yang menonjol keluar
dari pelepah juga **terlihat** besar dan matang di RGB — relief adalah *akibat*
dari variabel laten yang sama (kematangan/ukuran), bukan pengukuran independen
atasnya.

Ini **batas informasi, bukan kegagalan implementasi**. Kalau `I(Y;D|RGB) ≈ 0`,
risiko Bayes model RGB-D sama dengan model RGB, dan setiap parameter tambahan
hanya menambah error estimasi. Satu pernyataan ini menjelaskan seluruh
rangkaian hasil nol RGB-D di kedua volume — E-022, E-027, E-032, V2-E-005/006,
V2-E-009 — dan memprediksi percobaan fusi berikutnya juga akan nol.

**Batas klaim (jangan digeneralisasi):** ini berlaku untuk **klasifikasi
kematangan** pada protokol data ini (standoff hampir tetap, Z per kelas
1,20–1,36 m; depth uint8; 352 pohon). Kontribusi depth untuk **lokalisasi**
diuji terpisah — seluruh eksperimen sebelumnya mencampur kedua tugas sehingga
tidak pernah bisa menjawabnya.

## 8. Batas alat ukur

Test split 352 cuma 410 box, dengan **B4 = 26**. Selisih kecil pada mAP50 tidak
bisa dibedakan dari derau: pada Fase 5, val dan test bahkan berlawanan arah
(RGB unggul di val 0,4111 vs 0,3856; `edge` unggul di test). Multi-seed di §7
menunjukkan hal yang sama pada classifier — variasi antar-seed ±2-3pp, cukup
untuk memalsukan "kemenangan" apa pun yang dilaporkan dari satu run.

Angka apa pun dari split ini harus dibaca dengan itu di kepala.

---

## 9. Koreksi (2026-08-12): sebab yang saya tulis di Probe 1 salah

Seluruh dokumen di atas dibiarkan apa adanya karena jalan penemuannya memang
begitu. Bagian ini mengoreksi satu kesimpulan yang ternyata keliru, dan
koreksinya mengubah arti hampir semua yang menyusul.

**Yang saya tulis di Probe 1.** B3 turun dari 7.333 ke 215 instance (34×) dan B4
dari 2.513 ke 98 (26×) ketika berpindah dari dataset 953 ke 352, lalu saya
simpulkan itu **efek kelangkaan label** akibat dataset yang lebih kecil.

**Yang sebenarnya terjadi.** Angkanya benar, sebabnya salah. Kedua dataset
memakai tree ID yang sama untuk 352 pohon DAMIMAS, jadi saya bandingkan
labelnya langsung pada 1.408 citra ber-ID sama
(`scripts/probe_pergeseran_temporal.py`):

| Sumber label | Total kotak | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|
| SawitMVC-YOLO (953) | 6.523 | 566 (8,7%) | 1.098 (16,8%) | 3.604 (55,3%) | 1.255 (19,2%) |
| SawitMVC-Depth (352) | 2.299 | 829 (36,1%) | 1.001 (43,5%) | 321 (14,0%) | 148 (6,4%) |

Pada **pohon yang sama**, B3 berbeda 11,2× dan B4 8,5×. Sebabnya ada di
metadata akuisisi: dataset 953 direkam **30 April – 16 Mei 2026**, dataset 352
direkam **28–29 Juli 2026**. Jeda ~80 hari, dengan rotasi panen sawit 7–15 hari.

Jadi ini bukan dataset kecil versus dataset besar. Ini **kebun yang sama pada
fase kematangan yang berbeda**. Kohort B3 yang dominan pada Mei sudah matang
jadi B1/B2 pada Juli, sebagian sudah dipanen — konsisten dengan turunnya total
kotak dan bergesernya distribusi ke 80% B1+B2.

**Kenapa ini mengubah arti seluruh Fase 6.** Rangkaian pretrain 953 → finetune
352 yang jadi tulang punggung Fase 6 bukan transfer di dalam satu domain,
melainkan transfer melintasi pergeseran domain temporal. Model belajar dunia
yang 55% B3, lalu diuji di dunia yang 14% B3.

**Dan ini menjawab pertanyaan yang menggantung sejak Probe 2:** kenapa mencari
tandan berhasil (AP50 agnostik 0,7330) tapi menamainya rusak (mAP50 0,45)?
Karena label lokalisasi bertahan melintasi 80 hari — posisi tandan di kanopi
relatif stabil — sementara label kematangan tidak, karena benda fisiknya
berubah. Ketimpangan antara detektor dan classifier adalah sifat dari pasangan
data yang dipakai, bukan cacat arsitektur yang bisa diperbaiki dengan model
atau loss yang lebih baik.

Detail lengkap dan konsekuensinya: `experiments/EKSPERIMEN.md` entri
**V2-E-022**. Batas daya statistik yang membuat seluruh perbandingan Fase 6
tidak terbedakan: entri **V2-E-023**.


===== docs/LAPORAN-AKHIR.md =====

# Laporan Akhir — Volume 2: Deteksi dan Counting Tandan Sawit RGB vs RGB+D

**Tanggal:** 12 Agustus 2026
**Cakupan:** Fase 0–6 (`V2-E-001` s.d. `V2-E-024`)
**Status:** pengumpulan metrik dihentikan; seluruh angka final dan terlacak.

---

## 1. Ringkasan eksekutif

Volume 2 berangkat dari satu pertanyaan: **apakah menambahkan kanal depth
menaikkan mAP50 deteksi tandan sawit?** Dua puluh empat eksperimen kemudian,
jawabannya bukan "ya" atau "tidak", melainkan bahwa **pertanyaannya tidak bisa
dijawab dengan pasangan data yang tersedia** — dan itu sendiri hasil yang
terukur, bukan kegagalan mengukur.

Tiga temuan menutup persoalannya:

1. **Kedua dataset bukan pasangan yang sebanding.** SawitMVC-YOLO (953 pohon,
   tanpa depth) direkam 30 April – 16 Mei 2026; SawitMVC-Depth (352 pohon,
   dengan depth) direkam 28–29 Juli 2026. Jeda ~80 hari pada kebun yang sama.
   Distribusi kematangan bergeser drastis: pada 1.408 citra ber-ID sama,
   B3 berbanding **3.604 lawan 321** (11,2×). Setiap perbandingan
   RGB-vs-RGB+D yang melibatkan kedua dataset mengukur populasi buah yang
   berbeda, bukan efek depth.

2. **Split test 352 tidak punya daya statistik untuk pertanyaan ini.** Dengan
   410 kotak GT pada 220 citra, CI 95% untuk mAP50 selebar **±0,058**. Seluruh
   konfigurasi yang dihasilkan proyek ini — dari 0,3606 sampai 0,4544 — sebagian
   besar jatuh di dalam satu selang yang sama. Selisih 0,0044 antara pipeline
   dua-tahap terbaik dan rekor proyek adalah derau.

3. **Yang rusak adalah klasifikasi, bukan lokalisasi.** AP50 class-agnostic
   0,7330 di test-352 versus mAP50 class-aware ~0,45. Selisih itu bukan cacat
   arsitektur: label lokalisasi bertahan melintasi jeda 80 hari karena posisi
   tandan di kanopi stabil, sedangkan label kematangan tidak karena benda
   fisiknya berubah.

4. **Depth menolong — tapi untuk lokalisasi, bukan kematangan.** Uji
   berpasangan terakhir (resep identik, hanya kanal masukan yang beda)
   memberi AP50 lokalisasi **0,7636 dengan depth** versus **0,7358 tanpa**,
   selisih +0,0278 (P(Δ>0) = 0,921, CI masih memuat nol). Titik estimasinya
   **menembus plafon 0,733** yang sebelumnya diklaim sebagai batas dataset —
   ternyata itu batas modalitas RGB, bukan batas dataset. Efeknya muncul persis
   di tempat yang diprediksi temuan 1 dan 3, dan prediksi itu dibuat sebelum
   eksperimennya dijalankan.

**Rekomendasi utama:** pekerjaan lanjutan pada pertanyaan RGB-vs-RGB+D
memerlukan satu sesi akuisisi yang merekam RGB dan depth **bersamaan pada
tandan yang sama**, dengan test split yang cukup besar (perhitungan daya di
§8), dan sebaiknya menargetkan **lokalisasi** — bukan kematangan, yang sudah
terbukti redundan terhadap RGB. Tanpa itu, penambahan model, loss, atau
ensemble tidak akan mengubah kesimpulan.

---

## 2. Pertanyaan penelitian dan jawabannya

| # | Pertanyaan | Jawaban | Sumber |
|---|---|---|---|
| 1 | Apakah depth menaikkan mAP50 deteksi **4 kelas**? | **Tidak terjawab** dengan data ini. Perbandingan lintas-dataset tidak sah (§1); perbandingan di dalam 352 berada di bawah ambang deteksi statistik (§5). | V2-E-022, V2-E-023 |
| 1b | Apakah depth menaikkan AP50 **lokalisasi**? | **Ya menurut titik estimasi, belum terbukti signifikan.** 0,7636 vs 0,7358 berpasangan, +0,0278, P(Δ>0)=0,921. Menembus plafon 0,733 yang dikira batas dataset. | V2-E-024 |
| 2 | Encoding depth mana yang terbaik? | `edge` (Sobel gradien depth) menang screening dan training penuh: test mAP50 0,4316 vs `inverse` 0,3919. Selisihnya tetap belum signifikan. | V2-E-008, V2-E-010 |
| 3 | Apakah depth membawa informasi kematangan? | Ya, tapi **redundan secara kondisional** terhadap RGB: `I(Y;D) > 0` sementara `I(Y;D\|RGB) ≈ 0`. Depth saja 0,3756; RGB saja 0,6415; RGB+depth 0,6415. | V2-E-016 |
| 4 | Di mana kemampuan detektor hilang? | Pada penamaan kelas, bukan pencarian objek. AP50 agnostik 0,7330 vs mAP50 0,45. | V2-E-013, V2-E-017 |
| 5 | Apakah memperbesar model menolong? | Tidak. Dataset 953 dengan 9,8× lebih banyak kotak latih mencapai AP50 lokalisasi yang praktis sama (0,7374 vs 0,7330). Rencana `yolo26x` dibatalkan. Yang menaikkannya justru **modalitas**, bukan kapasitas (§9.1). | V2-E-017, V2-E-024 |
| 6 | Apakah pipeline dua-tahap mengalahkan satu-tahap? | Setara, tidak lebih baik. 0,4500 vs 0,4544, selisih 26× lebih kecil dari lebar CI-nya. | V2-E-020, V2-E-023 |

---

## 3. Data

| | SawitMVC-YOLO | SawitMVC-Depth |
|---|---|---|
| Pohon | 953 (DAMIMAS 854, LONSUM 99) | 352 (DAMIMAS, subset ID) |
| Citra | 3.992 (960×1280) | 1.408 (1280×800) |
| Kotak | 18.540 | 2.299 |
| Depth | — | Orbbec Y16, 848×480, mm |
| **Akuisisi** | **30 Apr – 16 Mei 2026** | **28 – 29 Juli 2026** |
| Split | 716 / 96 / 141 pohon | 245 / 52 / 55 pohon (kanonik v1.1.0) |

### Pergeseran temporal (V2-E-022)

Pada **1.408 citra dengan tree ID yang sama**:

| Sumber label | Total kotak | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|
| SawitMVC-YOLO (Mei) | 6.523 | 566 (8,7%) | 1.098 (16,8%) | **3.604 (55,3%)** | 1.255 (19,2%) |
| SawitMVC-Depth (Juli) | 2.299 | 829 (36,1%) | 1.001 (43,5%) | **321 (14,0%)** | 148 (6,4%) |

Rotasi panen sawit 7–15 hari; jeda 80 hari berarti 5–11 putaran panen. Kohort
B3 yang dominan pada Mei matang menjadi B1/B2 pada Juli, sebagian sudah
dipanen — konsisten dengan turunnya total kotak dan bergesernya distribusi ke
80% B1+B2.

Reproduksi: `scripts/probe_pergeseran_temporal.py` → `results/pergeseran_temporal.json`.

---

## 4. Hasil deteksi

### 4.1 Matriks utama (test split, mAP50 pycocotools)

| Konfigurasi | 953 pohon | 352 pohon |
|---|---|---|
| YOLO26l RGB | 0,5435 | 0,3606 |
| RT-DETR-L RGB | 0,5781 | 0,4343 |
| RF-DETR-L RGB | 0,6012 | **0,4544** |
| YOLO26l RGB+D (`inverse`) | — | 0,3919 |
| RT-DETR-L RGB+D (`inverse`) | — | 0,3877 |
| RF-DETR-L RGB+D (`inverse`) | — | 0,4186 |
| YOLO26l RGB+D (`edge`) | — | 0,4316 |
| Dua-tahap Fase 6 (v4) | — | 0,4500 |

**Kolom 953 dan 352 tidak sebanding** (§3). Perbandingan hanya sah di dalam
kolom 352.

### 4.2 Per kelas (test 352)

| Konfigurasi | B1 | B2 | B3 | B4 |
|---|---|---|---|---|
| YOLO26l RGB | 0,6842 | 0,4184 | 0,2301 | 0,1516 |
| YOLO26l RGB+D `edge` | 0,7252 | 0,5031 | 0,2240 | 0,2740 |
| RT-DETR-L RGB | 0,7680 | 0,4867 | 0,2641 | 0,2185 |
| RF-DETR-L RGB | 0,6853 | 0,5184 | **0,3477** | 0,2661 |
| Dua-tahap v4 | 0,7366 | 0,4683 | 0,3212 | 0,2738 |

B1 pada dua-tahap (0,7366) sudah **melampaui plafon lokalisasi** 0,7330 —
kelas itu tidak punya sisa ruang perbaikan. Seluruh sisa jarak ada di B2–B4.

### 4.3 Lokalisasi murni (AP50 class-agnostic)

| Model | Masukan | Split | AP50 | Catatan |
|---|---|---|---|---|
| **`agn352_4ch`** | **RGB+D `edge`** | test 352 | **0,7636** | tertinggi; menembus plafon yang diklaim V2-E-017 (§9.1) |
| `agn352_ft3` | RGB | test 352 | 0,7358 | kontrol berpasangan, resep identik |
| `agn352_ft` | RGB | test 352 | 0,7330 | plafon mAP50 pipeline dua-tahap |
| YOLO26l `v2repro` (class-aware dilipat) | RGB | test 953 | 0,7374 | **model berbeda**, bukan detektor agnostik |
| `agn953_full` | RGB | test 953 bersih | 0,7702 | 19 pohon tak tersentuh (§9.2) |
| `agn953_full` | RGB | val 953 | 0,8101 | dilaporkan selama ini; optimis 0,0399 vs set bersih |

---

## 5. Selang kepercayaan (V2-E-023)

Bootstrap pada tingkat citra, 500–1.000 ulangan, seed 42. Selisih antar-model
dihitung **berpasangan** (sampel citra yang sama untuk kedua model).

**Split test 352: 220 citra, 410 kotak GT.**

| Sumber | mAP50 | CI 95% | Lebar |
|---|---|---|---|
| YOLO26l-RGBD `edge` | 0,4270 | [0,3771; 0,4938] | 0,1167 |
| YOLO26l-RGB | 0,3677 | [0,3286; 0,4417] | 0,1130 |

Selisih berpasangan `edge` − RGB: **+0,0593**, CI 95% **[−0,0013; +0,1168]**,
P(Δ>0) = 0,972 → **tidak signifikan**.

AP50 lokalisasi juga diukur: lebar CI ~**0,101**.

**Implikasi.** Lebar CI ~0,117 sementara jarak dua-tahap (0,4500) ke RF-DETR-L
(0,4544) hanya 0,0044 — 26× lebih kecil. Bahkan selisih 0,0593 belum
signifikan. Enam versi rekomposisi dan empat skema classifier yang dikerjakan
Fase 6 seluruhnya bergerak di bawah ambang deteksi split ini.

---

## 6. Klasifikasi kematangan pada crop

Empat skema, tiga seed masing-masing (12 training, ConvNeXt-Small, head hybrid
CE+CORAL):

| Skema | Isi | test akurasi (rata ± sd) | macro F1 |
|---|---|---|---|
| `ftS` | pretrain 953 → finetune 352, crop 176 | **0,6837 ± 0,0172** | 0,6105 |
| `ftJ` | idem + jitter kotak | 0,6829 ± 0,0190 | 0,6065 |
| `ftG` | training gabungan 953+352 | 0,6724 ± 0,0161 | 0,5318 |
| `ftH` | gabungan, crop 256 @224 | 0,6569 ± 0,0252 | 0,5391 |

**Sebaran antar-seed (0,6293–0,7049, rentang 0,0756) adalah 2,8× lebih lebar
daripada sebaran antar-metode (0,0268).** Keempat skema tidak terbedakan.

Konfusi kelas selalu ke tetangga ordinal. Contoh `ftH_42` (test):

| GT \ prediksi | B1 | B2 | B3 | B4 | recall |
|---|---|---|---|---|---|
| B1 | 117 | 26 | 4 | 0 | 0,796 |
| B2 | 15 | 137 | 17 | 5 | 0,787 |
| B3 | 4 | 36 | **16** | 7 | **0,254** |
| B4 | 0 | 7 | 6 | 13 | 0,500 |

Recall B3 0,254 terjadi **meskipun B3 adalah kelas terbanyak dalam training
gabungan** (8.780 dari 18.059 crop). Penjelasannya di §3: B3 dalam korpus 953
adalah buah Mei, B3 dalam target 352 adalah buah Juli — dua populasi berbeda.

### Ablasi depth (V2-E-016)

| Masukan | Akurasi test |
|---|---|
| Depth saja | 0,3756 |
| RGB saja | 0,6415 |
| RGB + depth relief | 0,6415 |

`I(Y;D) > 0` tetapi `I(Y;D|RGB) ≈ 0` — depth membawa sinyal kematangan, tapi
sinyal itu sudah seluruhnya ada di RGB. **FALSIFIED** untuk hipotesis bahwa
depth menambah informasi kematangan.

---

## 7. Counting per pohon (Ridge + F_all)

| Konfigurasi | Class ±1 Acc |
|---|---|
| RT-DETR-L RGB 352 | **90,91%** |
| YOLO26l RGB 352 (asli) | 89,55% |
| RF-DETR-L RGB 352 | 88,18% |
| Dua-tahap v3 | 88,18% |
| YOLO26l RGB+D `inverse` | 87,73% |
| YOLO26l RGB+D `edge` | 87,27% |
| Dua-tahap v4 | 85,91% |
| YOLO26l RGB 352 (retrain) | 84,09% |

Konfigurasi terbaik untuk mAP50 **bukan** yang terbaik untuk counting: v4
menang mAP50, v3 menang counting. mAP peduli urutan deteksi di dalam kelas;
counting memakai argmax sehingga sensitif terhadap kalibrasi prior.

---

## 8. Ancaman validitas dan batasnya

1. **Pergeseran temporal (parah, tidak bisa dikoreksi pasca-hoc).** §3. Setiap
   klaim yang membandingkan 953 dan 352 tidak sah.
2. **Daya statistik (parah).** §5. Dengan 410 kotak GT, efek di bawah ~0,10
   mAP50 tidak terdeteksi. Untuk mendeteksi efek 0,03 dengan daya 80%
   dibutuhkan test split sekitar **10× lebih besar** (≈4.000 kotak).
3. **Bobot RF-DETR-L dan RT-DETR-L tidak tersimpan.** Angka 0,4544 dan 0,4343
   berasal dari `results/*.json` Fase 1–4; prediksinya tidak bisa diambil ulang,
   sehingga CI untuk kedua model itu tidak bisa dihitung. Hanya YOLO26l dan
   pipeline dua-tahap yang bisa di-bootstrap.

   Ditelusuri 2026-08-12 atas pertanyaan pengguna. Keenam direktori run yang
   dikutip `EKSPERIMEN.md` (`{rt,rf}detr_l_e60_i1280_{v2repro,rgb352,rgbd352}`)
   sudah tidak ada. Eksperimen yang memakainya (`V2-E-003`/`005`/`007`) jalan
   **9 Agustus**; backup pertama ke HF bucket **10 Agustus 13:27** — jadi
   bobotnya hilang di sela itu, sebelum ada backup yang bisa memuatnya. Tidak
   ada jejak di git (`runs/` masuk `.gitignore`) maupun di bucket; yang tersisa
   di sana cuma metrik Volume 1 (`Research-Pipeline/experiments/runs/`), bukan
   bobot. **Penyebabnya tidak bisa dibuktikan** — tidak ada log penghapusan.
   Dugaan terkuat pembersihan disk atau migrasi pod, pola yang sudah pernah
   terjadi di workspace ini (handoff 8 Agustus di `CLAUDE.md` repo ini mencatat
   bobot E-021 asli Volume 1 juga hilang saat pindah GPU).

   Yang sebenarnya mencegah ini bukan menyimpan bobot, tapi **menyimpan
   prediksinya**: `results/pred_*.npz` berukuran ~90 KB per model, cukup untuk
   menghitung CI kapan pun tanpa menjalankan detektornya lagi. Kebiasaan itu
   baru dimulai di Fase 6 (`dump_classaware.py`, `eval_twostage.py`). Untuk
   riset lanjutan: dump prediksi test **pada saat evaluasi**, bukan belakangan.
4. **`agn953_full` tidak punya test split bersih yang memadai.**
   `make_agnostic_dataset.py` hanya membuat train+val untuk `agnostic953`.
   Dari 141 pohon test kanonik 953, 122 terpakai saat pretraining; hanya 19
   pohon (76 citra, 321 kotak) yang tak tersentuh. Angka dari 19 pohon itu
   dilaporkan di §9 dengan CI-nya, dan CI itu lebar.
5. **Angka "test-953 = 0,7374" pernah dikutip keliru** sebagai hasil detektor
   agnostik. Itu detektor **class-aware** `v2repro` yang prediksinya dilipat
   jadi satu kelas — model yang berbeda. Dikoreksi di §4.3.
6. **Depth tidak teregistrasi ke kamera warna** pada rilis v1.0.0 dataset;
   reproyeksi per piksel dipakai (`reproject_depth.py`, Volume 1). Kesalahan
   registrasi tanpa reproyeksi: median 29 px, sebanding ukuran tandan kecil.

### 8.1 Audit kelengkapan split pada seluruh berkas hasil

Setiap `results/*.json` diperiksa: apakah mencatat angka val, test, atau
keduanya.

| Kelompok berkas | Isi | Penilaian |
|---|---|---|
| `detektor_pilihan_v*.json`, `sweep_inferensi_v*.json` | hanya val | **Benar sesuai protokol.** Ini berkas *pemilihan* konfigurasi; memilih di val memang yang seharusnya. Bukan lubang. |
| `twostage_final*.json` | hanya test | **Dapat diterima, tapi tidak ideal.** Konfigurasinya memang dipilih di val lewat dua berkas di atas, jadi angka test-nya sah. Namun tanpa pendamping val, pembalikan peringkat val-vs-test tidak terlihat sampai diuji terpisah. |
| `perkelas_pycoco_*.json`, `fase6_*.json`, `probe_fitur_depth.json` | val + test | Lengkap. |
| `counting_*.json`, `bootstrap_ci_352.json` | angka benar, split tidak dinyatakan | **DITUTUP.** Blok `_meta` ditambahkan ke tiap berkas: dataset, split kanonik, split evaluasi, jumlah pohon, strategi fit, pipeline, dan entri `V2-E-0xx` yang mengutipnya. Lihat catatan integritas di bawah. |
| `matrix_compiled.json` | — | **Salah tanda pada audit pertama.** Berkas ini sudah menyatakan split lewat nama kuncinya (`test_mAP50`, `test_mAP50_95`); skrip audit hanya mencari kunci bernama harfiah `test` sehingga menandainya keliru. `_meta` tetap ditambahkan untuk menegaskan, plus peringatan V2-E-022/023. |
| `agn953_full` | **tidak ada angka test sama sekali** | **Lubang nyata**, ditutup di §9.2. |

**Integritas penambahan metadata.** `scripts/lengkapi_metadata_split.py` hanya
menambah kunci `_meta`; tidak ada nilai lama yang disentuh. Ini diverifikasi
dua arah: muatan tiap berkas di-hash sebelum dan sesudah (dengan `_meta`
dilepas kembali) dan harus identik — kalau berubah, berkas dikembalikan
seperti semula dan skrip berhenti dengan status gagal. Verifikasi kedua lewat
git: `git diff --numstat` mencatat 7–10 baris **ditambah dan nol dihapus** pada
setiap berkas.

Reproduksi audit: bandingkan kunci `val`/`test` pada tiap `results/*.json`,
lalu `.venv/bin/python scripts/lengkapi_metadata_split.py --periksa`.

---

## 9. Uji terakhir: apakah depth menolong lokalisasi?

Satu-satunya perbandingan RGB vs RGB+D pada proyek ini yang **tidak** bisa
dikotori pergeseran temporal, karena class-agnostic membuang label kematangan
sepenuhnya dan hanya menyisakan "ada tandan atau tidak" — label yang terbukti
bertahan melintasi jeda 80 hari.

Rancangan berpasangan: resep, inisialisasi (`agn953_full`), seed (42), jadwal
(60 epoch, patience 45, cosine), resolusi (1280), dan batch (4) **identik**.
Satu-satunya yang berbeda adalah jumlah kanal masukan.

### 9.1 Hasil (V2-E-024)

| Model | val AP50 | @ep | **test AP50** | CI 95% | Lebar |
|---|---|---|---|---|---|
| `agn352_4ch` (RGB + `edge`) | **0,7893** | 33 | **0,7636** | [0,7144; 0,8123] | 0,0979 |
| `agn352_ft3` (RGB) | 0,7473 | 42 | 0,7358 | [0,6820; 0,7917] | 0,1097 |

Selisih berpasangan: **+0,0278**, CI 95% **[−0,0121; +0,0648]**,
P(Δ>0) = **0,921** → belum signifikan pada taraf 95%.

**Ini sinyal positif terkuat untuk depth di seluruh Volume 2**, dan
satu-satunya yang datang dari perbandingan yang benar-benar bersih. Arahnya
konsisten di val (+0,0420) dan test (+0,0278). Model 4-kanal juga menghasilkan
lebih banyak deteksi (1.660 vs 1.226) — konsisten dengan recall yang lebih
tinggi.

**Ketidaksignifikanan di sini tidak boleh dibaca sebagai "tidak ada efek".**
§5 sudah menetapkan bahwa split ini tidak mampu memisahkan efek di bawah ~0,10.
Efek terukur 0,0278 berada jauh di bawah ambang itu, jadi hasil "tidak
signifikan" sudah bisa diramalkan sebelum eksperimennya dijalankan dan tidak
membawa informasi tentang ada-tidaknya efek. Yang kurang adalah data.

**Koreksi terhadap plafon yang diklaim V2-E-017.** Entri itu menyimpulkan
"mAP50 di dataset ini tidak mungkin melewati ~0,733" karena AP50 lokalisasi
test-352 (0,7330) praktis sama dengan test-953 (0,7374) meski 953 punya 9,8×
lebih banyak kotak latih. Kesimpulan itu benar sebagai pernyataan tentang
masukan **RGB**, tetapi ditulis seolah berlaku umum. Dengan kanal depth, titik
estimasi mencapai **0,7636** — di atas keduanya. Plafon itu sifat **modalitas
masukan**, bukan sifat dataset. Perlu ditegaskan: 0,7636 masih berada di dalam
CI angka 0,7330, jadi ini pembalikan titik estimasi, bukan pembalikan yang
terbukti signifikan.

**Yang membuat hasil ini layak dipercaya lebih dari percobaan sebelumnya:**
depth menolong persis di tempat yang diprediksi teori §1 — lokalisasi, bukan
kematangan. Label posisi bertahan melintasi jeda 80 hari; label kematangan
tidak. Prediksi itu dibuat sebelum eksperimennya dijalankan.

### 9.2 Angka test `agn953_full` yang selama ini tidak ada (V2-E-025)

| Set evaluasi | Pohon | Citra | Kotak | AP50 agnostik |
|---|---|---|---|---|
| **test bersih** (tak tersentuh training) | 19 | 76 | 316 | **0,7702** |
| test penuh (122/141 pohon terpakai saat training) | 141 | 588 | 2.612 | 0,8090 |
| val (yang dilaporkan selama ini) | — | 364 | — | 0,8101 |

Angka yang sah adalah **0,7702**, bukan 0,8101. Selisih 0,0388 antara set
bersih dan set penuh adalah besarnya optimisme akibat kontaminasi — dan angka
val hampir identik dengan set terkontaminasi, persis seperti yang diharapkan
kalau keduanya berbagi pohon dengan training. Set bersih hanya 316 kotak, jadi
0,7702 harus dibaca sebagai indikasi, bukan pengukuran presisi.

### 9.3 CI untuk angka utama Fase 6 (V2-E-026)

Konfigurasi v4 dijalankan ulang dan tereproduksi persis (mAP50 0,44999 vs
0,4500; per kelas identik).

| Model | mAP50 | CI 95% | Lebar |
|---|---|---|---|
| Dua-tahap v4 | 0,4500 | [0,4054; 0,5188] | 0,1133 |
| YOLO26l-RGBD `edge` | 0,4270 | [0,3836; 0,4984] | 0,1148 |

Selisih berpasangan +0,0230, CI 95% [−0,0286; +0,0663], P(Δ>0) = 0,789 →
tidak signifikan. Enam versi rekomposisi tidak menghasilkan perbedaan yang bisa
dibuktikan pada split ini.

---

## 10. Rekomendasi

**Untuk menjawab pertanyaan depth secara meyakinkan**, yang dibutuhkan bukan
model atau loss yang lebih baik, melainkan data:

1. **Satu sesi akuisisi** yang merekam RGB dan depth bersamaan pada tandan yang
   sama. Perbandingan RGB vs RGB+D lalu menjadi ablasi kanal murni, bukan
   perbandingan lintas-waktu.
2. **Test split ≈4.000 kotak** (≈10× sekarang) supaya efek berukuran 0,03
   mAP50 terdeteksi dengan daya 80%. Ini bukan angka sembarangan: efek depth
   yang terukur di §9.1 tepat berukuran 0,028.
3. **Targetkan lokalisasi, bukan kematangan.** Di situlah satu-satunya sinyal
   depth yang bertahan muncul (§9.1), dan itu konsisten dengan teori §1.
   Kematangan sudah terbukti redundan terhadap RGB (`I(Y;D|RGB) ≈ 0`).
4. **Anotasi ulang subset 953 dengan standar Juli**, atau sebaliknya, kalau
   korpus 953 tetap ingin dipakai sebagai sumber pretraining kematangan.
   Untuk pretraining **lokalisasi** saja, korpus 953 tetap sah dan berguna —
   dan `agn953_full` (test bersih 0,7702) memang menjadi inisialisasi yang baik.

**Yang tidak perlu diulang** (sudah terbukti tidak menolong): memperbesar model
(V2-E-017), early fusion di stem (V2-E-005, V2-E-022 Volume 1), gate init-nol
(F-007), konsistensi lintas-sisi (F-003), tuning hyperparameter, SAHI, dan
ensembling classifier di luar ~3 anggota (V2-E-023).

---

## 11. Reproduksi

Urutan perintah lengkap: [REPRODUKSI-FASE6.md](REPRODUKSI-FASE6.md), termasuk
tabel sembilan jebakan yang semuanya gagal secara **diam-diam** (tanpa pesan
error) dan semuanya pernah terjadi di proyek ini.

| Berkas | Isi |
|---|---|
| `experiments/EKSPERIMEN.md` | log append-only `V2-E-001` … `V2-E-024` |
| `results/fase6_ringkas.json` | seluruh metrik Fase 6 dalam satu berkas |
| `results/pergeseran_temporal.json` | bukti pergeseran akuisisi 80 hari |
| `results/bootstrap_map*.json` | selang kepercayaan |
| `docs/DIAGNOSIS-DEPTH.md` | jalan penemuan + koreksi §9 |


===== docs/REKAP.md =====

# Rekap Volume 1 — Research-Pipeline

Seluruh angka, percobaan, dan pelajaran dari repo
[Research-Pipeline](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline)
yang relevan untuk eksperimen baru ini. Disusun agar sesi Claude baru bisa
langsung bekerja tanpa membaca seluruh Volume 1.

---

## 1. Angka Deteksi yang Berlaku (E-021, SawitMVC 953 pohon)

Keempat model dievaluasi dengan satu protokol `pycocotools` pada split
716/96/141 (per pohon, irisan nol).

| Model | Param | Resolusi | Val mAP50 | Val mAP50-95 | Test mAP50 | Test mAP50-95 |
|---|---:|---:|---:|---:|---:|---:|
| YOLO26m | 21,9 jt | 640 | 0,5195 | 0,2411 | 0,5165 | 0,2452 |
| YOLO26l | 26,3 jt | 1280 | 0,5270 | 0,2526 | 0,5300 | 0,2568 |
| RT-DETR-L | 33,0 jt | 1280 | 0,5459 | 0,2555 | 0,5784 | 0,2707 |
| **RF-DETR-L** | **35,7 jt** | **1280** | **0,5695** | **0,2604** | **0,6038** | **0,2770** |

Sumber: `experiments/results/E-021/perkelas_pycoco.json` di Research-Pipeline.

### Per kelas (RF-DETR-L, test)

| Kelas | AP50 | AP50-95 |
|---|---|---|
| B1 | tertinggi | tertinggi |
| B2 | rendah | rendah |
| B3 | sedang | sedang |
| B4 | **terendah** | **terendah** |

B4 sulit karena kecil, tertanam di pelepah, kontras rendah.
B2 sulit karena ambigu secara fotometrik dengan B3.

## 2. Angka Counting yang Berlaku (Baseline-SawitMVC, SawitMVC 953 pohon)

Detektor: YOLO26m (`y26mv2`, 60 epoch, batch 32, imgsz 640, seed 42).

### Counting dengan deteksi YOLO26m (Track B)

| Counter | Fitur | Class &plusmn;1 Acc | Tree &plusmn;1 Acc | Macro MAE |
|---|---|---:|---:|---:|
| **Ridge** | **F_all 67-dim** | **77,48%** | **32,62%** | **1,036** |
| ElasticNet | F0+spatial 21-dim | 76,77% | 31,21% | 1,039 |
| ElasticNet | F0 13-dim | 76,42% | 29,79% | 1,043 |
| LR | F0 13-dim | 75,71% | 30,50% | 1,048 |

### Counting dengan deteksi sempurna (Track C, batas atas)

| Counter | Class &plusmn;1 Acc | Tree &plusmn;1 Acc | Macro MAE |
|---|---|---:|---:|
| ElasticNet | 98,05% | 92,20% | 0,277 |
| SVM | 97,87% | 91,49% | 0,266 |
| Ridge | 97,70% | 90,78% | 0,275 |

**Gap Track B → C = 20,57 pp.** Sumber utama error adalah detektor, bukan
counter. Memperbaiki detektor adalah cara paling efektif menaikkan counting.

### Angka counting yang BELUM ADA

- YOLO26l pada 953 pohon → counting
- RT-DETR-L pada 953 pohon → counting
- RF-DETR-L pada 953 pohon → counting
- Semua model pada 352 pohon (RGB dan RGB+D) → counting

## 3. Angka dari Publikasi Baseline (DiB 2026)

Sumber: Indriani dkk., *Data in Brief* 67 (2026) 112990. Angka diverifikasi
langsung dari PDF (Tabel 3–4).

Detektor: YOLO26m, `epochs=60, batch=32, imgsz=640, patience=60, seed=42`.
**Sengaja tidak di-tuning** — titik acuan, bukan plafon.

| | AP50 | Precision | Recall |
|---|---|---|---|
| Overall | 0,531 | 0,508 | 0,571 |
| B1 | 0,739 | 0,602 | 0,776 |
| B2 | 0,433 | 0,482 | 0,441 |
| B3 | 0,599 | 0,515 | 0,674 |
| B4 | 0,354 | 0,432 | 0,393 |

Counting (test 141 pohon):

| Deteksi | Counter | Class &plusmn;1 | Tree &plusmn;1 | MAE |
|---|---|---:|---:|---:|
| GT | SVR | 96,81% | 88,65% | 0,303 |
| YOLO26m | SVR | 75,35% | 33,33% | 1,027 |

## 4. Percobaan Gagal (Jangan Diulang)

### 4.1 Early fusion depth (E-022, E-027)

**Apa:** Menambahkan depth sebagai kanal ke-4 langsung ke input YOLO.
**Hasil:** E-027 menunjukkan depth **merugikan** YOLO26n sebesar −0,0230 mAP
rerata; dua dari tiga seed signifikan negatif. E-022 kesimpulannya dicabut
setelah audit.
**Pelajaran:** Concat naif tidak bekerja. Depth pada early fusion menambah
derau, bukan sinyal.

### 4.2 Fusi menengah/akhir dari nol (E-032)

**Apa:** 15 run (5 lengan × 3 seed), 150 epoch dari nol, uji fusi
awal/menengah/akhir.
**Hasil:** Seluruh 12 CI95 memuat nol. Mid-fusion konsisten positif 3/3 seed
(rerata +0,0139) tetapi berstatus INDIKASI, bukan temuan.
**Pelajaran:** Efek depth terlalu kecil untuk diukur pada rezim dari-nol
dengan YOLO26n.

### 4.3 Gate init-nol (F-007)

**Apa:** Cabang frekuensi tinggi dengan γ = 0 saat inisialisasi, disuntik ke
RF-DETR-L.
**Hasil:** γ akhir ≈ 0 (dwt +0,0003, laplacian −6e-5). Gate tidak pernah
terbuka.
**Pelajaran:** `γ = 0` memberikan no-op sempurna sekaligus **titik mati**
sempurna — cabang samping tidak menerima gradien (dikali γ = 0), dan γ sendiri
hanya menerima derau. Setiap rancangan "cabang samping ber-gate init-nol"
menabrak masalah ini kecuali gate-nya diberi warmup, LR terpisah, inisialisasi
kecil-taknol, atau tugas pendamping.

### 4.4 Konsistensi lintas-sisi (F-003)

**Apa:** Mengukur plafon konsistensi prediksi antar sisi pohon.
**Hasil:** 0,2794 < ambang 0,30. 72% galat kelas salah di semua sisi. B4
hanya 0,1038.
**Pelajaran:** Galat kelas bukan masalah satu-sisi — model konsisten salah
di semua sisi. Menambahkan konsistensi lintas-sisi tidak akan membantu.

### 4.5 Tuning hyperparameter

**Status:** Sudah habis dijalankan oleh pengguna (batch, imgsz, augmentasi,
lr, dll). Ditegaskan dua kali. **Jangan disarankan lagi.**

### 4.6 SAHI dan teknik siap-pakai

**Status:** Sudah dicoba langsung oleh pengguna. Tidak satu pun menaikkan mAP.
**Jangan diusulkan ulang.**

## 5. Percobaan Berhasil (Boleh Dibangun di Atasnya)

### 5.1 RF-DETR-L sebagai detektor terbaik (E-021)

NMS-free, DINOv2 backbone, test mAP50 0,6038. Melewati sasaran 0,60.
Mengalahkan YOLO26l dan RT-DETR-L pada semua metrik.

### 5.2 Frekuensi tinggi memisahkan tandan dari pelepah (F-002)

DWT high-high +0,0731 pada B4 (ambang +0,02). Laplacian +0,0721 praktis seri.
Monoton B1 < B2 < B3 < B4 — semakin muda, semakin mudah dibedakan dari
pelepah via frekuensi.

### 5.3 Pipeline counting modular (Baseline-SawitMVC)

Ridge + F_all 67-dim. Hanya butuh JSON deteksi per pohon sebagai input.
Ganti detektor, evaluasi counting langsung jalan.

### 5.4 Reproyeksi depth tervalidasi (E-022)

`reproject_depth.py` memproyeksikan depth Orbbec ke bidang RGB dengan kalibrasi
per berkas. Sudah diverifikasi — bukan resize naif (yang meleset median 29 px).

### 5.5 Varians seed RF-DETR-L terukur (F-004)

SD test mAP50 = 0,0049 (rentang 0,0097). Jauh lebih kecil dari yang
diasumsikan. Rerata 3 seed: 0,5949 (jalur `run_test`).

## 6. Diagnosa yang Sudah Disepakati

1. **Bottleneck ada di detektor, bukan counter.** Counter hampir sempurna
   bila diberi deteksi bersih (98,05% vs 77,48%).
2. **Kegagalan deteksi terbelah dua:**
   - **(A) Geometris** — B4 kecil/tertanam/tertutup pelepah. Depth relevan
     di sini.
   - **(B) Fotometrik** — ambiguitas B2↔B3. Depth **tidak** membantu di sini.
3. **Kelas paling ambigu adalah B2** (0,434), bukan B4 (0,234). B4 gagal
   karena deteksi, bukan kebingungan kelas (E-028).

## 7. Caveat yang Wajib Dibawa

- Pseudo-depth berasal dari RGB yang sama → error-nya berkorelasi.
- **Tidak ada benchmark RGB-D pada TBS sawit di literatur 182 makalah.**
  "Depth menaikkan angka" = hipotesis yang falsifiable.
- Hasil naik di B4/crowded tapi datar di B2/B3 = **konfirmasi teori**, bukan
  kegagalan.
- Angka di SawitMVC-Depth (352 pohon) **tidak sebanding** dengan angka di
  SawitMVC (953 pohon) — distribusi kelas terbalik, kepadatan lebih rendah.


===== docs/RENCANA.md =====

# Rencana Kerja — 4 Fase

## Gambaran Umum

```
Fase 0   Persiapan infrastruktur          (tanpa GPU)
Fase 1   RGB 953 pohon — counting         (GPU: inference saja)
Fase 2   RGB 352 pohon — train + eval     (GPU: training)
Fase 3   RGB+D 352 pohon — train + eval   (GPU: training + modifikasi arsitektur)
Fase 4   Evaluasi dan pelaporan           (tanpa GPU)
```

Setiap fase menghasilkan angka yang mengisi matriks di README.

---

## Fase 0 — Persiapan Infrastruktur

**Tujuan:** Pastikan pipeline counting bisa menerima output dari detektor
mana pun, dan dataset SawitMVC-Depth siap dipakai.

| # | Tugas | Detail | Status |
|---|---|---|---|
| 0.1 | Adaptor format deteksi | Buat konverter output RT-DETR-L dan RF-DETR-L ke format JSON per-pohon yang sama dengan `predictions/y26mv2_per_tree/` di Baseline-SawitMVC | Belum |
| 0.2 | Siapkan split SawitMVC-Depth | Buat split train/val/test per pohon untuk 352 pohon, konsisten dengan konvensi SawitMVC (per pohon, bukan per citra) | **Selesai** — sudah ada siap pakai di `/workspace/SawitMVC-Depth-YOLO/` (70/15/15, seed 10, tree-stratified, 245/52/55 pohon), tidak perlu dibuat ulang |
| 0.3 | Verifikasi ground truth | Pastikan anotasi SawitMVC-Depth kompatibel dengan pipeline counting (format JSON, kelas B1–B4, identitas tandan) | **Selesai** — skema identik dengan SawitMVC (lihat `docs/SCHEMA-PERTREE.md`), tidak perlu shim terjemahan |
| 0.4 | Siapkan depth yang sudah diproyeksikan | Gunakan `reproject_depth.py` dari Research-Pipeline untuk memproyeksikan seluruh depth ke bidang RGB | Belum |
| 0.5 | Setup environment | `requirements.txt`, versi pustaka (ultralytics, rfdetr, pycocotools, scikit-learn) | Belum |

**Keluaran:** Infrastruktur siap, split terdefinisi, depth terproyeksi.

---

## Fase 1 — RGB 953 Pohon (SawitMVC): Counting

**Tujuan:** Isi sel counting untuk ketiga detektor pada dataset 953 pohon.
Angka deteksi sudah ada dari E-021 — yang kurang hanya counting.

| # | Tugas | Detail | Status |
|---|---|---|---|
| 1.1 | Inference YOLO26l | Jalankan YOLO26l (bobot E-021) pada 3.992 citra, simpan JSON per pohon | Belum |
| 1.2 | Inference RT-DETR-L | Jalankan RT-DETR-L (bobot E-021) pada 3.992 citra, simpan JSON per pohon | Belum |
| 1.3 | Inference RF-DETR-L | Jalankan RF-DETR-L (bobot E-021) pada 3.992 citra, simpan JSON per pohon | Belum |
| 1.4 | Counting ketiga model | Jalankan pipeline Ridge + F_all untuk ketiga set prediksi | Belum |
| 1.5 | Bandingkan | Apakah detektor dengan mAP lebih tinggi juga memberi counting lebih baik? | Belum |

**Referensi pembanding:** YOLO26m sudah ada di Baseline-SawitMVC (77,48%).

**Keluaran Fase 1:**

| Model | Test mAP50 | Class &plusmn;1 Acc | Tree &plusmn;1 Acc | Macro MAE |
|---|---|---|---|---|
| YOLO26l | 0,5300 (ada) | ? | ? | ? |
| RT-DETR-L | 0,5784 (ada) | ? | ? | ? |
| RF-DETR-L | 0,6038 (ada) | ? | ? | ? |

**Estimasi waktu:** ~1 jam GPU (inference saja), ~30 menit CPU (counting).

---

## Fase 2 — RGB 352 Pohon (SawitMVC-Depth, tanpa depth)

**Tujuan:** Bangun baseline RGB pada dataset yang sama yang nantinya akan
dibandingkan dengan RGB+D. Ini jembatan perbandingan apple-to-apple.

| # | Tugas | Detail | Status |
|---|---|---|---|
| 2.1 | Latih YOLO26l | Pada RGB 352 pohon, konfigurasi setara E-021 | Belum |
| 2.2 | Latih RT-DETR-L | Pada RGB 352 pohon, konfigurasi setara E-021 | Belum |
| 2.3 | Latih RF-DETR-L | Pada RGB 352 pohon, konfigurasi setara E-021 | Belum |
| 2.4 | Evaluasi deteksi | pycocotools, per kelas | Belum |
| 2.5 | Inference + counting | Pipeline Ridge + F_all | Belum |

**Catatan:** Dataset ini lebih kecil (352 vs 953 pohon) dan distribusi
kelasnya terbalik (B2 dominan, B4 langka). Angka pasti lebih rendah dari
Fase 1 — itu wajar, bukan kegagalan.

**Keluaran Fase 2:**

| Model | Test mAP50 | Class &plusmn;1 Acc | Tree &plusmn;1 Acc | Macro MAE |
|---|---|---|---|---|
| YOLO26l | ? | ? | ? | ? |
| RT-DETR-L | ? | ? | ? | ? |
| RF-DETR-L | ? | ? | ? | ? |

**Estimasi waktu:** ~1–2 hari GPU (3× training).

---

## Fase 3 — RGB+D 352 Pohon (4-kanal)

**Tujuan:** Ini inti eksperimen. Latih ketiga arsitektur dengan input 4-kanal
(RGB + depth), bandingkan dengan baseline RGB Fase 2.

| # | Tugas | Detail | Status |
|---|---|---|---|
| 3.1 | Modifikasi YOLO26l | Ubah stem dari 3 → 4 kanal input | Belum |
| 3.2 | Modifikasi RT-DETR-L | Ubah stem HGNetV2 dari 3 → 4 kanal | Belum |
| 3.3 | Modifikasi RF-DETR-L | **Paling sulit.** DINOv2 backbone beku, stem 3-kanal. Opsi: (a) tambah proyeksi 1-kanal → 3-kanal lalu concat, (b) tulis stem baru 4→embed_dim, (c) fusi menengah dengan cabang terpisah | Belum |
| 3.4 | Latih ketiga model | Konfigurasi identik Fase 2, hanya input berubah | Belum |
| 3.5 | Evaluasi deteksi | pycocotools, per kelas, per strata (oklusi, ukuran) | Belum |
| 3.6 | Inference + counting | Pipeline Ridge + F_all | Belum |
| 3.7 | Uji Target 1 | RGB+D &ge; RGB? Per arsitektur, per kelas | Belum |
| 3.8 | Uji Target 2 | RGB+D > RGB secara signifikan? | Belum |

### Risiko dan mitigasi

| Risiko | Bukti | Mitigasi |
|---|---|---|
| Early fusion menyebabkan regresi | E-022, E-027 | Coba pendekatan yang berbeda dari concat naif; misalnya proyeksi depth terpisah sebelum concat |
| Backbone beku menolak kanal ke-4 | Seri F (gate init-nol) | Jangan gunakan gate init-nol; gunakan warmup atau inisialisasi kecil-taknol |
| Dataset terlalu kecil (352 pohon) | — | Evaluasi dengan bootstrap CI; laporkan apakah selisih signifikan |
| Distribusi kelas terbalik | B4 hanya 148 bbox | Stratifikasi evaluasi per kelas |

**Keluaran Fase 3:**

| Model | Test mAP50 | Delta vs RGB | Class &plusmn;1 Acc | Delta vs RGB |
|---|---|---|---|---|
| YOLO26l + D | ? | ? | ? | ? |
| RT-DETR-L + D | ? | ? | ? | ? |
| RF-DETR-L + D | ? | ? | ? | ? |

**Estimasi waktu:** ~3–5 hari (termasuk debugging modifikasi arsitektur).

---

## Fase 4 — Evaluasi dan Pelaporan

| # | Tugas | Detail |
|---|---|---|
| 4.1 | Kompilasi matriks detection | mAP50, mAP50-95, P, R per kelas, semua 9 sel |
| 4.2 | Kompilasi matriks counting | Class &plusmn;1 Acc, Tree &plusmn;1 Acc, MAE, semua 9 sel |
| 4.3 | Analisis terstratifikasi | Per kelas, per strata oklusi/ukuran — di mana depth membayar? |
| 4.4 | Uji signifikansi | Bootstrap CI per pohon, 10.000 replikat |
| 4.5 | Tulis laporan | Ringkasan untuk naskah/sidang |

---

## Fase 5 — Loop Perbaikan RGB+D (dibatasi eksplisit oleh pengguna)

**Ditambahkan 2026-08-08.** Setelah Fase 3+4 menghasilkan angka RGB+D
pertama, fase ini mencari cara menaikkannya lebih jauh vs RGB. Pengguna
membatasi eksplisit: **hanya dua jenis intervensi yang boleh dicoba.**

1. **Mengubah representasi dataset** — mis. encoding depth (inverse-depth
   vs linear, HHA, surface normal, edge map turunan depth), preprocessing/
   normalisasi, augmentasi khusus kanal depth, resolusi/kanal tambahan.
2. **Mengubah arsitektur model** — mis. lokasi fusi (awal/menengah/akhir),
   desain cabang, modifikasi stem, mekanisme gating (dengan pelajaran dari
   F-007: hindari init-nol).

**Yang TIDAK boleh dicoba di fase ini** (di luar dua kategori di atas):
tuning hyperparameter (sudah terbukti mentok — lihat "Hal yang sudah dicoba
dan GAGAL" di `CLAUDE.md`), teknik inference/post-processing siap pakai
(SAHI sudah gagal), ensembling, atau trik training lain.

Setiap percobaan tetap wajib mengikuti aturan eksperimen `CLAUDE.md`: satu
hipotesis falsifiable per entri, dicatat di `experiments/EKSPERIMEN.md`
dengan verdict CONFIRMED/FALSIFIED/INCONCLUSIVE, hasil negatif dicatat
dengan bobot sama. Kandidat awal yang konsisten dengan kedua lever di atas
dan pelajaran Volume 1 (lihat `docs/REKAP.md` §4-5):

- Representasi: ganti encoding inverse-depth linear saat ini dengan encoding
  yang menonjolkan kontras dekat (di mana tandan berada), bukan seluruh
  rentang 0,8-15,0 m secara linear.
- Arsitektur: cabang depth terpisah dengan fusi menengah, inisialisasi
  kecil-taknol (bukan gate init-nol seperti F-007), dibangun di atas sinyal
  indikatif E-032 (mid-fusion 3/3 seed positif, CI masih memuat nol).

**Protokol iterasi cepat (ditambahkan 2026-08-08):** setiap percobaan Fase 5
dijalankan dengan **maksimal 15 epoch, patience 3 epoch** (bukan 60 epoch
seperti Fase 1-3) — screening cepat, bukan angka final. Alasan pengguna:
sinyal menjanjikan atau tidak sudah terlihat di 15 epoch pertama. Konsekuensi:
- Angka dari screening 15-epoch **tidak dibandingkan langsung** dengan angka
  60-epoch Fase 1-3 — hanya dipakai untuk ranking relatif antar-percobaan
  Fase 5 (mana yang layak dilanjutkan).
- Kandidat yang lolos screening (naik konsisten, bukan derau) baru dijalankan
  penuh 60 epoch untuk angka yang bisa dikutip dan dibandingkan RGB vs RGB+D.
- Tetap dicatat di `EKSPERIMEN.md` sebagai entri sendiri (mis. tag
  `[screening-15ep]` di judul), verdict tetap CONFIRMED/FALSIFIED/INCONCLUSIVE
  berdasar sinyal screening, bukan diklaim sebagai hasil final.

### Status pelaksanaan (2026-08-11)

Screening kedua lever sudah dijalankan pada YOLO26l (prioritas pertama sesuai
keputusan pengguna — paling mudah dimodifikasi, satu-satunya yang naik di
early fusion naif V2-E-005). Lihat `experiments/EKSPERIMEN.md` V2-E-008/009
untuk detail lengkap.

- **Lever representasi — 4 kandidat di-screening**: `edge` (Sobel gradient
  magnitude) menang jelas (val mAP50 0,3777 vs 0,3168/0,3221/0,3321 untuk
  dropout/clipped/valid_mask). Dipromosikan ke 60 epoch penuh — hasil test
  split: **deteksi CONFIRMED naik +10,1% mAP50** dari `inverse` (0,4316 vs
  0,3919), robust terhadap baseline RGB manapun. **Counting INCONCLUSIVE**
  — bootstrap CI berpasangan berbalik arah tergantung baseline RGB-352 yang
  dipakai (menang +3,18pp vs retrain baru, kalah −2,28pp vs angka asli
  V2-E-004) — lihat V2-E-010/011 untuk detail lengkap kenapa ini dilaporkan
  tidak konklusif, bukan dibulatkan ke arah manapun.
- **Lever arsitektur — mid-fusion + gate non-zero-init**: gate berhasil
  dihindarkan dari titik mati F-007 (bergerak 0,02→0,025), tapi sinyal
  keseluruhan TIDAK naik konsisten (plateau epoch 3, early-stop epoch 6, val
  mAP50 0,209) — kalah jauh dari kandidat representasi pada jumlah epoch
  sama. **TIDAK dipromosikan** ke 60 epoch — hasil negatif, dicatat apa
  adanya. RT-DETR-L/RF-DETR-L untuk lever arsitektur tidak dikerjakan
  (kondisional pada lever arsitektur YOLO26l lolos screening, yang tidak
  terjadi).

**Fase 5 SELESAI** (2026-08-11) — semua metrik terisi (deteksi, counting,
bootstrap CI). Lihat `experiments/EKSPERIMEN.md` V2-E-008 s/d V2-E-011.

---

## Ringkasan Estimasi

| Fase | Kebutuhan GPU | Estimasi waktu |
|---|---|---|
| 0 | Tidak | 1 hari |
| 1 | Ya (inference) | 0,5 hari |
| 2 | Ya (training) | 1–2 hari |
| 3 | Ya (training) | 3–5 hari |
| 4 | Tidak | 1 hari |
| **Total** | | **~7–10 hari** |

---

## Fase 6 — Diagnostik ulang + pipeline dua-tahap (2026-08-11)

**Pelonggaran scope oleh pengguna.** Fase 5 dibatasi ke dua lever
(representasi, arsitektur) dengan larangan eksplisit terhadap tuning
hyperparameter, SAHI, dan ensembling. Untuk Fase 6 pengguna melonggarkan:
target akhirnya aplikasi mobile (foto 4 sisi → deteksi → hasil), tapi selama
pengembangan **boleh lambat/berat, boleh dipecah multi-tahap, boleh ada
preprocessing, tidak harus YOLO, tidak harus satu pipeline** — yang penting
metriknya naik. Ditambah arahan: **tanpa rerun eksperimen lama, tanpa audit
history dulu; kejar hasil terbaik, baru trace back**. Cabang yang turun sedikit
saja atau buang waktu langsung dibuang.

Larangan Fase 5 diperlakukan **tergantikan** untuk fase ini. Kalau itu keliru,
cabang yang bersangkutan tinggal dibuang.

### Kenapa fase ini ada

Lima probe read-only (tanpa training, hitungan menit) menunjukkan rumusan
masalah Fase 1–5 keliru di tiga titik. Lengkapnya di `docs/DIAGNOSIS-DEPTH.md`
dan entri `V2-E-012` s.d. `V2-E-014`:

1. Gap 953-vs-352 adalah kelangkaan label B3/B4 (34×/26×), bukan efek depth.
2. 44,5% kemampuan detektor hangus karena salah kelas (AP50 lokalisasi 0,6677
   vs mAP50 0,3707), dan konfusinya selalu antar-kelas-tetangga → ordinal.
3. Sinyal depth adalah relief lokal ordinal (p=1,7×10⁻²¹) ber-SNR ~0,3 per
   piksel — hanya terbaca setelah pooling wilayah. Early fusion di stem adalah
   rezim terburuk untuk sinyal seperti itu.

### Rancangan

| Tahap | Isi | Alasan dari diagnostik |
|---|---|---|
| 0 | Split 953 bebas bocor (846 pohon, buang 107 pohon val/test-352) | 44 dari 55 pohon test-352 ada di train-953 — tanpa dibersihkan, pretraining tidak sah |
| 1 | Classifier kematangan pada crop, RGB vs RGB+relief-depth | menyerang headroom 0,2970; crop melakukan pooling wilayah by-construction |
| 2 | Detektor class-agnostic (1 kelas "tandan"), pretrain 953 → finetune 352 | lokalisasi lihat 2.299 positif, bukan terpecah jadi 215 (B3) / 98 (B4) |
| 3 | Rekomposisi: kelas tahap-2 ditempel ke box tahap-1 → mAP50 sebanding Fase 1–5, lalu Ridge+F_all | angka tetap bisa dibandingkan dengan seluruh riwayat |

Kanal depth yang dipakai bukan inverse-depth absolut (itu nuisance: standoff
per citra std 0,82 m) melainkan **relief** `R = Z − median lokal`, di-scale
±10 cm → 0..255 (step 0,08 cm/level vs 2,91 cm sebelumnya). Cabang depth
difusikan **setelah global pooling**, gate init taknol (F-007), plus loss
auxiliary RGB-only supaya jalur RGB tidak bisa dirusak jalur depth.

### Batas yang harus jujur disebut

Test split 352 cuma 410 box, dengan B4 = 26. Selisih kecil pada mAP50 tidak
bisa dibedakan dari derau — pada Fase 5 bahkan val dan test berlawanan arah
(RGB unggul di val 0,4111 vs 0,3856; `edge` unggul di test). Karena itu ablasi
depth Fase 6 dijalankan **multi-seed**, dan klaim tanpa pemisahan yang jelas
dari derau dilaporkan INCONCLUSIVE, bukan dibulatkan.

Soal target ~90%: yang realistis menyentuh itu adalah **Class ±1 Acc counting**
(sekarang 89,55%) dan akurasi klasifikasi kematangan per-crop. **mAP50 tidak
bisa 90%** di dataset ini — plafonnya AP50 lokalisasi (0,6677 sekarang).


===== docs/REPRODUKSI-FASE6.md =====

# Cara Mereproduksi Fase 6

Urutan persis untuk membangun ulang seluruh hasil Fase 6 dari nol. Setiap
langkah menyebutkan keluaran yang dihasilkan dan entri `EKSPERIMEN.md` yang
mengutipnya, supaya tiap angka bisa ditelusuri ke perintah yang membuatnya.

Semua dijalankan dari `/workspace/project-expertise` dengan `.venv` yang
dibangun dari `Research-Pipeline/experiments/code/requirements.txt`
(+ `timm`, lihat §0).

## 0. Prasyarat

```bash
python3 -m venv .venv --system-site-packages
.venv/bin/pip install -r /workspace/Research-Pipeline/experiments/code/requirements.txt
.venv/bin/pip install timm            # untuk classifier crop
```

Untuk lingkungan yang **persis** menghasilkan angka di repo ini, pakai
[`../requirements-freeze.txt`](../requirements-freeze.txt) (181 paket ter-pin,
Python 3.12.3) alih-alih dua baris `pip install` di atas.

Data mentah: `SawitMVC-YOLO/` (953 pohon) dan `SawitMVC-Depth/` (352 pohon)
dari HuggingFace, plus `depth_png_352/` hasil `reproject_depth.py` (Volume 1).

> **Sebagian data turunan dihapus 2026-08-12** saat proyek ditutup —
> `crops_fase6/`, `crops_fase6_256/`, dan dataset 4-kanal selain `edge`.
> Langkah §2 di bawah membangun ulang `crops_fase6/`; untuk sisanya lihat
> [REGENERASI.md](REGENERASI.md). Bobot dan `runs*/` tidak ada yang dihapus.

## 1. Diagnostik (read-only, ~5 menit, tanpa GPU)

```bash
.venv/bin/python scripts/probe_depth_signal.py --probe semua
```

Menghasilkan seluruh angka di `docs/DIAGNOSIS-DEPTH.md` dan entri
**V2-E-012/013/014**: distribusi kelas, cakupan depth dalam box, relief per
kelas + Kruskal-Wallis, tabel kuantisasi, AUC vs pooling.

## 2. Split bebas kebocoran dan dataset turunan

```bash
.venv/bin/python scripts/make_pretrain_split.py        # 846 pohon 953, irisan nol
.venv/bin/python scripts/make_agnostic_dataset.py      # agnostic953 + agnostic352 (1 kelas)
.venv/bin/python scripts/build_crop_dataset.py --src 352 --workers 8
.venv/bin/python scripts/build_crop_dataset.py --src 953 --workers 8
```

`make_pretrain_split.py` dan `make_agnostic_dataset.py` **assert** irisan nol
terhadap `val_trees.txt`/`test_trees.txt` 352 — kalau bocor, keduanya berhenti.

## 3. Detektor class-agnostic (V2-E-017/018)

```bash
# pretrain 953 — jadwal cosine harus SELESAI, jangan dipotong di tengah
.venv/bin/python scripts/train_yolo_4ch_screening.py \
  --data /workspace/agnostic953/data.yaml --epochs 12 --patience 12 \
  --imgsz 1280 --batch 4 --weights yolo26l.pt --name agn953_full

# finetune 352 — patience LONGGAR; transfer kuat bisa membuat epoch 1 jadi
# puncak palsu dan patience ketat membunuh run sebelum kurva sebenarnya mulai
.venv/bin/python scripts/train_yolo_4ch_screening.py \
  --data /workspace/agnostic352/data.yaml --epochs 60 --patience 45 \
  --imgsz 1280 --batch 4 --weights runs/agn953_full/weights/best.pt --name agn352_ft3

# RT-DETR-L sebagai anggota ensemble (arsitektur berbeda -> galat berbeda)
.venv/bin/python -c "
from ultralytics import RTDETR
RTDETR('rtdetr-l.pt').train(data='/workspace/agnostic352/data.yaml', epochs=60,
    patience=10, imgsz=1280, batch=4, seed=42, cos_lr=True,
    project='/workspace/project-expertise/runs', name='agn352_rtdetr')"
```

Ukur plafon lokalisasi:

```bash
.venv/bin/python scripts/eval_detector_agnostic.py \
  --detektor runs/agn352_ft/weights/best.pt --split test
```

## 4. Classifier kematangan pada crop (V2-E-015/016/021)

```bash
# pretrain 953
.venv/bin/python scripts/train_crop_classifier.py --tahap pretrain --mode rgb \
  --head hybrid --backbone convnext_small.fb_in22k_ft_in1k --img 176 \
  --epochs 14 --batch 24 --name pre953s

# finetune 352, 3 seed untuk ensemble
for s in 42 101 202; do
  .venv/bin/python scripts/train_crop_classifier.py --tahap finetune --mode rgb \
    --head hybrid --backbone convnext_small.fb_in22k_ft_in1k --img 176 \
    --epochs 50 --batch 24 --seed $s --init runs_fase6/pre953s/best.pt --name ftS_$s
done
```

Ablasi depth (V2-E-016) — ganti `--mode rgb` jadi `--mode rgbd`, dan uji
statistik depth terpool:

```bash
.venv/bin/python scripts/probe_fitur_depth.py --model runs_fase6/ftS_202/best.pt
```

## 5. Pemilihan, sweep, dan rekomposisi (V2-E-019/020)

**Pemilihan selalu di `--split val`.** Test hanya dipakai untuk angka akhir.

```bash
.venv/bin/python scripts/pilih_detektor.py --split val \
  --kandidat runs/agn352_ft/weights/best.pt runs/agn352_ft3/weights/best.pt \
             runs/agn352_rtdetr/weights/best.pt \
  --out results/detektor_pilihan.json

.venv/bin/python scripts/sweep_inferensi.py --split val \
  --detektor runs/agn352_ft/weights/best.pt runs/agn352_ft3/weights/best.pt \
  --out results/sweep_inferensi.json

# angka akhir (mAP50 sebanding Fase 1-5)
.venv/bin/python scripts/eval_twostage.py --split test --conf 0.005 \
  --detektor runs/agn352_ft/weights/best.pt runs/agn352_ft3/weights/best.pt \
  --classifier runs_fase6/ftS_*/best.pt runs_fase6/ftJ_*/best.pt runs_fase6/ftG_*/best.pt \
  --tta --multi-kelas --imgsz 1280 --det-iou 0.5 \
  --out results/twostage_final_v4.json

# counting, memakai fungsi Ridge+F_all yang SAMA dengan Fase 1-5
.venv/bin/python scripts/run_counting_twostage.py --tta --imgsz 1280 --det-iou 0.5 \
  --detektor runs/agn352_ft/weights/best.pt runs/agn352_ft3/weights/best.pt \
  --classifier runs_fase6/ftS_*/best.pt runs_fase6/ftJ_*/best.pt runs_fase6/ftG_*/best.pt \
  --label TwoStage-FINAL_v4 --out results/counting_twostage.json
```

## 6. Rangkuman seluruh angka

`results/fase6_ringkas.json` memuat metrik tiap detektor, tiap classifier,
tiap versi rekomposisi, dan tiap counting dalam satu berkas.

## 7. Penutupan — validitas dan daya statistik (V2-E-022/023/024)

Langkah-langkah ini yang seharusnya dijalankan **sebelum** mengejar metrik,
bukan sesudah. Urutannya sengaja ditulis begini supaya tidak terulang.

```bash
# 7.1 Apakah kedua dataset benar-benar sebanding?  (CPU, ~1 menit)
.venv/bin/python scripts/probe_pergeseran_temporal.py \
  --out results/pergeseran_temporal.json
```

Jalankan ini lebih dulu. Kalau tanggal akuisisinya berjauhan, seluruh
perbandingan lintas-dataset gugur dan sisa rencana harus dirombak.

```bash
# 7.2 Seberapa besar efek yang bisa dideteksi split ini?  (CPU, ~10 menit)
.venv/bin/python scripts/dump_classaware.py \
  --bobot runs/yolo26l_e60_i1280_rgbd352_edge/weights/best.pt \
  --data /workspace/SawitMVC-Depth-4ch-edge-YOLO --split test \
  --out results/pred_edge_test.npz

.venv/bin/python scripts/bootstrap_map.py --split test --n-boot 1000 \
  --sumber results/pred_edge_test.npz results/pred_rgb352_test.npz \
  --nama edge_rgbd yolo_rgb --out results/bootstrap_map.json
```

Kalau lebar CI jauh melebihi efek yang diharapkan, berhenti dan perbesar
data — menambah model, loss, atau ensemble tidak akan mengubah kesimpulan.

```bash
# 7.3 Uji depth untuk LOKALISASI — berpasangan, hanya kanal yang beda
.venv/bin/python scripts/train_yolo_4ch_screening.py \
  --data /workspace/agnostic352_4ch/data.yaml \
  --epochs 60 --patience 45 --imgsz 1280 --batch 4 --seed 42 \
  --weights runs/agn953_full/weights/best.pt --name agn352_4ch

for m in agn352_4ch:agnostic352_4ch agn352_ft3:SawitMVC-Depth; do
  .venv/bin/python scripts/dump_classaware.py --agnostik --split test \
    --bobot "runs/${m%%:*}/weights/best.pt" --data "/workspace/${m##*:}" \
    --out "results/pred_${m%%:*}_test.npz"
done

.venv/bin/python scripts/bootstrap_map.py --split test --agnostik --n-boot 1000 \
  --sumber results/pred_agn352_4ch_test.npz results/pred_agn352_ft3_test.npz \
  --nama agn352_4ch agn352_ft3_rgb --out results/bootstrap_lokalisasi.json
```

```bash
# 7.4 Angka test untuk agn953_full, yang tidak pernah ada
.venv/bin/python scripts/buat_test_953_bersih.py     # 19 pohon tak tersentuh
```

**Jebakan kesepuluh, yang paling mahal dari semuanya:** mengurutkan
konfigurasi berdasarkan titik estimasi tanpa selang kepercayaan. Fase 6
menghabiskan enam versi rekomposisi dan dua belas training classifier untuk
menggeser angka yang seluruhnya berada di dalam satu CI. Petunjuknya sudah ada
sejak awal dan terlewat: sebaran akurasi antar-**seed** (0,0756) 2,8× lebih
lebar daripada sebaran antar-**metode** (0,0268).

---

## Hal yang WAJIB diperhatikan saat mereproduksi

| Jebakan | Akibat kalau diabaikan |
|---|---|
| **Jangan potong jadwal cosine di tengah.** `agn953_pre-2` dihentikan di epoch 4 dari 25 sehingga fase anneal tidak pernah terjadi. | Kehilangan ~5,0 poin AP50 pretrain. |
| **Patience longgar untuk finetune ber-transfer kuat.** `agn352_ft2` mati di epoch 11 karena epoch 1 jadi puncak palsu. | Run berhenti sebelum kurva sebenarnya dimulai (0,6413 vs 0,7473). |
| **Ultralytics auto-increment nama run** (`agn953_pre` → `agn953_pre-2`). | Tahap berikutnya menunjuk direktori kosong dan diam-diam memakai bobot default. Selalu resolve direktori secara dinamis. |
| **Muat RT-DETR dengan kelas `RTDETR`, bukan `YOLO`.** `YOLO()` menerima bobotnya tanpa error tapi membangunnya sebagai `DetectionModel` biasa. | Hasil inference tidak bisa dipercaya, tanpa pesan error apa pun. |
| **Resolusi crop saat inference harus ≥ resolusi saat training.** | Crop kecil diperbesar ke ukuran input → detail warna hilang, gain lenyap tanpa error. |
| **Pemilihan detektor/konfigurasi di `val`, bukan `test`.** | Angka test menjadi tidak sah (mengepaskan model ke angka laporan). |
| **Augmentasi fotometrik harus RINGAN.** Kematangan didefinisikan oleh warna; jitter brightness ±25% dan saturasi 0,6–1,4 menghapus label. | Akurasi classifier turun ~18 poin (0,648 → 0,471). |
| **Crop butuh kanal mask box.** Dengan ctx=1,6 di kanopi padat sering ada >1 tandan per crop. | Model tidak tahu tandan mana yang dinilai. |
| **`augment=True` (TTA deteksi) tidak berpengaruh** pada YOLO26 di ultralytics 8.4. | Mengira ada gain padahal nol. |


===== docs/SCHEMA-PERTREE.md =====

# Skema JSON Per-Pohon (kontrak untuk adaptor detektor baru)

Sumber: `/workspace/Baseline-SawitMVC/predictions/y26mv2_per_tree/*.json`
(953 berkas, satu per pohon SawitMVC). Diverifikasi langsung dari isi berkas,
bukan dari dokumentasi.

## Struktur

```json
{
  "tree_name": "DAMIMAS_A21B_0001",
  "split": "test",
  "detector": "y26mv2",
  "images": {
    "side_1": {
      "side_index": 0,
      "annotations": [
        {
          "class_name": "B2",
          "bbox_yolo": [0.6173592209815979, 0.4416269361972809, 0.10798104852437973, 0.08652486652135849],
          "conf": 0.4842214584350586
        }
      ]
    },
    "side_2": { "side_index": 1, "annotations": [ ... ] }
  }
}
```

- `tree_name`: id pohon, cocok dengan `ground_truth/split_manifest.csv`.
- `split`: `train` / `val` / `test`, ikut split resmi 716/96/141.
- `detector`: nama detektor pembuat file (untuk adaptor baru: `yolo26l_v2repro`,
  `rtdetr_l_v2repro`, `rfdetr_l_v2repro`, dst).
- `images`: dict per sisi (`side_1`, `side_2`, ...), key bebas tapi harus
  konsisten dengan urutan `side_index` (0-based).
- `annotations`: list per bbox. `class_name` &isin; {B1,B2,B3,B4}. `bbox_yolo`
  = [cx, cy, w, h] ternormalisasi (format YOLO standar). `conf` = confidence
  deteksi (0-1).

**Adaptor RT-DETR-L / RF-DETR-L wajib menghasilkan struktur ini persis** —
nama field, nesting, dan normalisasi bbox harus sama, supaya
`pipeline/build_counting_features.py` dan `experiments/exp_counting_v3.py`
bisa membacanya tanpa modifikasi.

## Jalur reproduksi angka yang benar (koreksi asumsi rencana awal)

Angka yang dikutip di `docs/REKAP.md` (Ridge + F_all 67-dim: 77,48% / 32,62% /
1,036) **tidak** dihasilkan oleh `scripts/report_metrics.py` atau
`pipeline/run_e2e_pipeline.py`. Kedua skrip itu (jalur "Track B" resmi di
`pipeline/README.md`) hanya memakai fitur 13-dim dan counter {svm, rf, lr,
m01} — tidak ada Ridge di daftar itu.

Angka Ridge+F_all yang dikutip dihasilkan oleh
**`experiments/exp_counting_v3.py`** (80 konfigurasi: 8 feature set × 5 model
× 2 strategi training), yang mengimpor `_load_gt`/`_load_splits`/`CLASSES`
dari `pipeline/build_counting_features.py`. Skrip ini butuh `xgboost` dan
`lightgbm` (tidak ada di `requirements.txt` Baseline-SawitMVC maupun di venv
research-pipeline) — dipasang di venv terpisah
`/workspace/Baseline-SawitMVC/.venv` agar tidak mengubah venv research-pipeline
yang sudah pinned. Sudah diverifikasi: menjalankan
`.venv/bin/python experiments/exp_counting_v3.py` mereproduksi persis
`F_all, Ridge, train, 67dim → macro_acc 0.774823, joint_acc 0.326241,
macro_mae 1.035461` (baris teratas "TOP 15 OVERALL").

**Untuk detektor baru (YOLO26l/RT-DETR-L/RF-DETR-L retrain E-021), jalur
counting Fase 1 yang benar mengikuti pola `exp_counting_v3.py`** (fit Ridge
segar pada fitur F_all dari split train detektor tsb, evaluasi di test),
bukan `run_e2e_pipeline.py`'s Track B. Ini juga konsisten dengan
`run_counting_regularized.py`: defaultnya `pipe.fit(X_tr, y_tr)` — fit segar
per detektor, bukan load model tersimpan — kecuali `--load-model` diberikan
eksplisit.

## Kompatibilitas ground truth SawitMVC vs SawitMVC-Depth (verifikasi Fase 0.5)

Dibandingkan langsung: `/workspace/SawitMVC/data/json/{tree}.json` vs
`/workspace/SawitMVC-Depth-YOLO/{train,valid,test}/linked/{tree}.json`.

**Skemanya identik** — sama-sama punya top-level key `version, tree_id,
tree_name, split, metadata, images, bunches, summary, _confirmedLinks`, dan
struktur `bunches[i]` (`bunch_id, class, class_mismatch, appearance_count,
appearances[]`) serta `summary` (`total_unique_bunches, total_detections,
duplicates_linked, by_class, by_side`) sama persis. **Tidak perlu shim
terjemahan** — `build_counting_features.py`/`exp_counting_v3.py` dari
Baseline-SawitMVC bisa langsung membaca kedua sumber tanpa modifikasi.

Satu-satunya beda: field `split` di JSON SawitMVC-Depth-YOLO bernilai
`"field"` (bukan `train`/`val`/`test`) — pembagian split yang benar untuk
352 pohon ini datang dari **lokasi folder** (`train/`, `valid/`, `test/`) dan
`split_stats.json`, bukan dari field internal ini. Field internal `split` di
JSON SawitMVC (953 pohon) sudah benar berisi `train`/`val`/`test`. Versi
Depth juga punya field tambahan per-sisi (`rgb_sha256`, `capture_origin`,
`depth_required`) yang bersifat aditif, tidak mengganggu kompatibilitas.


===== experiments/EKSPERIMEN.md =====

# Log Eksperimen — Volume 2 (append-only)

Aturan (dari `CLAUDE.md`): satu entri = satu hipotesis falsifiable. Append-only
— entri lama tidak pernah diedit; koreksi ditulis sebagai entri baru yang
mereferensikan entri yang dikoreksi. Hasil negatif dicatat dengan bobot yang
sama dengan hasil positif. Setiap angka harus terlacak ke skrip/JSON/log.

Penomoran: **`V2-E-0xx`**, mulai dari `V2-E-001`. Sengaja terpisah dari
`E-0xx`/`F-0xx` Volume 1 (repo/riwayat berbeda; `E-021` sudah punya arti
spesifik di Volume 1, `V2-E-0xx` menghindari tabrakan referensi silang).

Bukti mentah per entri disimpan di `results/V2-E-0xx/`.

## Template

```markdown
## V2-E-0xx — <satu kalimat hipotesis falsifiable>

**Tanggal:** YYYY-MM-DD
**Hipotesis:** <pernyataan falsifiable, satu saja>
**Dataset & split:** <dataset persis + path split>
**Metode:** <skrip + invokasi CLI persis + identitas bobot/commit>
**Hasil:** <angka apa adanya, tanpa dibungkus>
**Sumber:** <path JSON/CSV/log yang membuktikan tiap angka>
**Verdict:** CONFIRMED | FALSIFIED | INCONCLUSIVE
```

---

<!-- Entri berikutnya ditambahkan di bawah baris ini, tidak pernah menyisip di atas. -->

## V2-E-001 — Reproduksi deteksi E-021 dengan tiga arsitektur pada 953 pohon SawitMVC-YOLO

**Tanggal:** 2026-08-09
**Hipotesis:** Retrain tiga arsitektur (YOLO26l, RT-DETR-L, RF-DETR-L) dengan
konfigurasi identik dengan E-021 Volume 1 menghasilkan test mAP50 dalam ±0,02 dari
angka asli, mengonfirmasi reprodusibilitas.
**Dataset & split:** SawitMVC-YOLO, 953 pohon (716 train / 96 val / 141 test),
resolusi 960×1280, evaluasi `pycocotools`.
**Metode:**
- YOLO26l: `YOLO('yolo26l.pt').train(epochs=60, imgsz=1280, batch=4, seed=42, cos_lr=True, patience=60)`
  — bobot: `models/yolo26l_e60_i1280_v2repro/best.pt`
- RT-DETR-L: `RTDETR('rtdetr-l.pt').train(...)` — config identik
  — bobot: `runs/rtdetr_l_e60_i1280_v2repro/weights/best.pt`
- RF-DETR-L: `RFDETRLarge(resolution=1280, gradient_checkpointing=True).train(epochs=60, batch_size=4, grad_accum_steps=4, seed=42)`
  — bobot: `runs/rfdetr_l_e60_i1280_v2repro/checkpoint_best_ema.pth`
  — Catatan: peak mAP50 di epoch 8, overfitting setelahnya; best EMA checkpoint otomatis tersimpan.
- Evaluasi: `scripts/eval_all_pycoco_v2repro.py`

**Hasil (test split, pycocotools):**

| Model | Params | test mAP50 | Target E-021 | Gap | test mAP50-95 |
|---|---|---|---|---|---|
| YOLO26l | 26,3jt | 0,5435 | 0,5300 | +0,014 | 0,2564 |
| RT-DETR-L | 33,0jt | 0,5781 | 0,5784 | −0,000 | 0,2629 |
| RF-DETR-L | 35,7jt | 0,6012 | 0,6038 | −0,003 | 0,2747 |

Per-kelas AP50 (test):

| Model | B1 | B2 | B3 | B4 |
|---|---|---|---|---|
| YOLO26l | 0,7705 | 0,4479 | 0,6050 | 0,3506 |
| RT-DETR-L | 0,7874 | 0,4614 | 0,6371 | 0,4266 |
| RF-DETR-L | 0,8150 | 0,5184 | 0,6553 | 0,4160 |

**Sumber:** `results/perkelas_pycoco_v2repro.json`
**Verdict:** CONFIRMED — ketiga model mereproduksi E-021 dalam ±0,014 mAP50.

---

## V2-E-002 — Counting tiga detektor v2repro pada 953 pohon (Ridge + F_all)

**Tanggal:** 2026-08-09
**Hipotesis:** Mengganti detektor YOLO26m (baseline DiB) dengan tiga arsitektur
yang lebih besar (YOLO26l, RT-DETR-L, RF-DETR-L) masing-masing meningkatkan
Class ±1 Acc counting di atas baseline 77,48%.
**Dataset & split:** SawitMVC-YOLO, 953 pohon (812 train+val / 141 test).
**Metode:**
- Inference conf=0,25 pada seluruh split via `scripts/adapters/{yolo,rtdetr,rfdetr}_to_pertree.py`
- Counting: `scripts/run_counting_v2repro.py` — Ridge + F_all (67 dim), strategy train+val,
  pola identik `exp_counting_v3.py` Baseline-SawitMVC.

**Hasil (test, 141 pohon):**

| Detektor | Class ±1 Acc | Tree ±1 Acc | Macro MAE |
|---|---|---|---|
| YOLO26m (baseline DiB) | 77,48% | 32,62% | 1,036 |
| YOLO26l v2repro | 72,16% | 30,50% | 1,090 |
| RT-DETR-L v2repro | 76,24% | 34,04% | 0,997 |
| RF-DETR-L v2repro | 76,24% | 36,17% | 0,993 |

Per-kelas (±1 Acc / MAE / bias):

| Detektor | B1 | B2 | B3 | B4 |
|---|---|---|---|---|
| YOLO26l | 94,3% / 0,43 / −0,07 | 78,7% / 1,01 / −0,15 | 48,2% / 1,70 / −0,18 | 67,4% / 1,22 / +0,10 |
| RT-DETR-L | 96,5% / 0,40 / +0,08 | 81,6% / 0,94 / −0,11 | 58,2% / 1,45 / −0,13 | 68,8% / 1,18 / +0,05 |
| RF-DETR-L | 95,7% / 0,38 / +0,03 | 82,3% / 0,94 / −0,13 | 60,3% / 1,47 / −0,02 | 66,7% / 1,18 / +0,01 |

**Sumber:** `results/counting_v2repro.json`
**Verdict:** FALSIFIED — tidak ada satu pun detektor baru yang melampaui baseline
Class ±1 Acc 77,48%. Namun RF-DETR-L memiliki Tree ±1 Acc terbaik (36,17% vs 32,62%),
Macro MAE terendah (0,993 vs 1,036), dan bias paling seimbang.
**Catatan:** YOLO26l justru lebih buruk dari YOLO26m — kemungkinan karena perbedaan
konfigurasi training (batch=4 vs 32, imgsz=1280 vs 640).
B3 tetap menjadi kelas terlemah di semua detektor (48–60% ±1 Acc).

---

## V2-E-003 — Deteksi tiga arsitektur pada 352 pohon SawitMVC-Depth (RGB)

**Tanggal:** 2026-08-09
**Hipotesis:** Tiga arsitektur (YOLO26l, RT-DETR-L, RF-DETR-L) mempertahankan
urutan performa relatif yang sama pada dataset SawitMVC-Depth 352 pohon (subset
lebih kecil) seperti pada SawitMVC 953 pohon.
**Dataset & split:** SawitMVC-Depth-YOLO, 352 pohon (245 train / 52 val / 55 test),
resolusi 1280×800, evaluasi `pycocotools`.
**Metode:**
- YOLO26l: `YOLO('yolo26l.pt').train(epochs=60, imgsz=1280, batch=4, seed=42, cos_lr=True, patience=60)`
  — bobot: `runs/yolo26l_e60_i1280_rgb352/weights/best.pt`
- RT-DETR-L: `RTDETR('rtdetr-l.pt').train(...)` — config identik
  — bobot: `runs/rtdetr_l_e60_i1280_rgb352/weights/best.pt`
- RF-DETR-L: `RFDETRLarge(resolution=1280).train(epochs=60, batch_size=4, grad_accum_steps=4, seed=42)`
  — bobot: `runs/rfdetr_l_e60_i1280_rgb352/checkpoint_best_ema.pth`
  — Peak EMA mAP50 di epoch 7, overfitting setelahnya (pola konsisten dengan 953 pohon).
- Evaluasi: `scripts/eval_pycoco_352.py`

**Hasil (test split, pycocotools):**

| Model | Params | test mAP50 | test mAP50-95 |
|---|---|---|---|
| YOLO26l | 26,3jt | 0,3606 | 0,1246 |
| RT-DETR-L | 33,0jt | 0,4343 | 0,1503 |
| RF-DETR-L | 35,7jt | 0,4544 | 0,1599 |

Per-kelas AP50 (test):

| Model | B1 | B2 | B3 | B4 |
|---|---|---|---|---|
| YOLO26l | 0,6804 | 0,4320 | 0,2001 | 0,1299 |
| RT-DETR-L | 0,7680 | 0,4867 | 0,2641 | 0,2185 |
| RF-DETR-L | 0,6853 | 0,5184 | 0,3477 | 0,2661 |

**Sumber:** `results/perkelas_pycoco_rgb352.json`
**Verdict:** CONFIRMED — urutan relatif terjaga (RF-DETR-L > RT-DETR-L > YOLO26l).
Angka absolut lebih rendah dari 953 pohon karena dataset lebih kecil (352 vs 953)
dan distribusi kelas berbeda. B3 dan B4 jauh lebih sulit di dataset ini.

---

## V2-E-004 — Counting tiga detektor RGB pada 352 pohon (Ridge + F_all)

**Tanggal:** 2026-08-09
**Hipotesis:** Detektor yang lebih baik (mAP50 lebih tinggi) menghasilkan counting
accuracy yang lebih tinggi pada 352 pohon SawitMVC-Depth.
**Dataset & split:** SawitMVC-Depth, 352 pohon (297 train+val / 55 test).
**Metode:**
- Inference conf=0,25 pada seluruh split via `scripts/run_counting_rgb352.py`
- Counting: Ridge + F_all (67 dim), strategy train+val, pola identik exp_counting_v3.py.

**Hasil (test, 55 pohon):**

| Detektor | Class ±1 Acc | Tree ±1 Acc | Macro MAE |
|---|---|---|---|
| YOLO26l | 89,55% | 69,09% | 0,577 |
| **RT-DETR-L** | **90,91%** | 67,27% | **0,532** |
| RF-DETR-L | 88,18% | 65,45% | 0,600 |

Per-kelas (±1 Acc / MAE / bias):

| Detektor | B1 | B2 | B3 | B4 |
|---|---|---|---|---|
| YOLO26l | 98,2% / 0,45 / −0,09 | 83,6% / 0,93 / −0,13 | 81,8% / 0,65 / −0,47 | 94,5% / 0,27 / −0,13 |
| RT-DETR-L | 92,7% / 0,51 / −0,04 | 81,8% / 0,84 / −0,07 | 89,1% / 0,58 / −0,07 | 100% / 0,20 / +0,02 |
| RF-DETR-L | 89,1% / 0,65 / −0,04 | 80,0% / 0,91 / +0,04 | 83,6% / 0,62 / −0,18 | 100% / 0,22 / −0,04 |

**Sumber:** `results/counting_rgb352.json`
**Verdict:** FALSIFIED — urutan counting tidak mengikuti urutan deteksi. RT-DETR-L
(mAP50 ke-2) memiliki Class ±1 Acc tertinggi (90,91%), bukan RF-DETR-L (mAP50
tertinggi). Pola serupa dengan 953 pohon: detektor terbaik secara mAP50 belum tentu
menghasilkan counting terbaik.
**Catatan:** Accuracy counting 352 pohon (88–91%) jauh lebih tinggi dari 953 pohon
(72–76%) karena distribusi kelas SawitMVC-Depth lebih seragam dan jumlah tandan per
pohon lebih sedikit. B4 mencapai 100% untuk RT-DETR-L dan RF-DETR-L.

---

## V2-E-005 — Deteksi tiga arsitektur RGBD 4-kanal pada 352 pohon SawitMVC-Depth

**Tanggal:** 2026-08-09
**Hipotesis:** Menambahkan depth sebagai kanal ke-4 (early fusion BGRD) meningkatkan
test mAP50 dibandingkan RGB saja pada ketiga arsitektur.
**Dataset & split:** SawitMVC-Depth-4ch-YOLO, 352 pohon (245 train / 52 val / 55 test),
resolusi 1280, input 4-kanal (BGRD TIFF), evaluasi `pycocotools`.
**Metode:**
- YOLO26l: `YOLO('yolo26l.pt').train(data='data_rgbd_352.yaml', epochs=60, imgsz=1280, batch=4, seed=42, cos_lr=True, patience=60)`
  — bobot: `runs/yolo26l_e60_i1280_rgbd352/weights/best.pt` (peak epoch 47)
- RT-DETR-L: `RTDETR('rtdetr-l.pt').train(data='data_rgbd_352.yaml', ...)` — config identik
  — bobot: `runs/rtdetr_l_e60_i1280_rgbd352/weights/best.pt` (peak epoch 19)
- RF-DETR-L: `train_rfdetr_4ch.py` dengan 3 patch (TIFF loader, normalisasi 4ch, conv inflate)
  — bobot: `runs/rfdetr_l_e60_i1280_rgbd352/checkpoint_best_ema.pth` (peak epoch 7)
- Evaluasi: `scripts/eval_pycoco_rgbd352.py`

**Hasil (test split, pycocotools):**

| Model | Params | RGBD mAP50 | RGB mAP50 | Δ | RGBD mAP50-95 |
|---|---|---|---|---|---|
| YOLO26l | 26,3jt | 0,3919 | 0,3606 | **+0,0313** | 0,1408 |
| RT-DETR-L | 33,0jt | 0,3877 | 0,4343 | **−0,0466** | 0,1359 |
| RF-DETR-L | 35,7jt | 0,4186 | 0,4544 | **−0,0358** | 0,1508 |

Per-kelas AP50 (RGBD test):

| Model | B1 | B2 | B3 | B4 |
|---|---|---|---|---|
| YOLO26l | 0,6857 | 0,4579 | 0,2637 | 0,1601 |
| RT-DETR-L | 0,7417 | 0,4621 | 0,2382 | 0,1090 |
| RF-DETR-L | 0,6929 | 0,5160 | 0,3158 | 0,1499 |

Delta per-kelas (RGBD − RGB):

| Model | Δ B1 | Δ B2 | Δ B3 | Δ B4 |
|---|---|---|---|---|
| YOLO26l | +0,005 | +0,026 | +0,064 | +0,030 |
| RT-DETR-L | −0,026 | −0,025 | −0,026 | −0,110 |
| RF-DETR-L | +0,008 | −0,002 | −0,032 | −0,116 |

**Sumber:** `results/perkelas_pycoco_rgbd352.json`, `results/perkelas_pycoco_rgb352.json`
**Verdict:** FALSIFIED — depth 4-kanal TIDAK meningkatkan deteksi secara konsisten.
Hanya YOLO26l yang naik (+0,031 mAP50), RT-DETR-L dan RF-DETR-L justru turun.
YOLO26l naik di semua kelas (terutama B3 +0,064), sementara RT-DETR-L dan RF-DETR-L
turun tajam di B4 (−0,110 dan −0,116). Konsisten dengan temuan Volume 1 E-022/E-027
bahwa early fusion depth cenderung merugikan.

---

## V2-E-006 — Counting tiga detektor RGBD 4-kanal pada 352 pohon (Ridge + F_all)

**Tanggal:** 2026-08-09
**Hipotesis:** Depth 4-kanal meningkatkan counting accuracy (Class ±1 Acc)
dibandingkan RGB saja pada ketiga detektor.
**Dataset & split:** SawitMVC-Depth, 352 pohon (297 train+val / 55 test).
**Metode:**
- Inference conf=0,25 pada citra 4-kanal TIFF via `scripts/run_counting_rgbd352.py`
- Counting: Ridge + F_all (67 dim), strategy train+val, pola identik exp_counting_v3.py.
- Bootstrap CI: 10.000 replikat, paired per pohon (`scripts/bootstrap_ci.py`).

**Hasil (test, 55 pohon):**

| Detektor | RGBD Class ±1 | RGB Class ±1 | Δ | RGBD Tree ±1 | RGBD MAE |
|---|---|---|---|---|---|
| YOLO26l | 87,73% | 89,55% | **−1,82pp** | 60,00% | 0,673 |
| RT-DETR-L | 88,64% | 90,91% | **−2,27pp** | 61,82% | 0,632 |
| RF-DETR-L | 88,18% | 88,18% | **±0,00pp** | 67,27% | 0,586 |

Bootstrap CI paired (RGBD − RGB, 10.000 replikat):

| Detektor | Δ Class ±1 CI95 | P(RGBD > RGB) |
|---|---|---|
| YOLO26l | [−5,9pp, +1,8pp] | 16,5% |
| RT-DETR-L | [−5,0pp, +0,5pp] | 5,6% |
| RF-DETR-L | [−2,7pp, +2,7pp] | 47,3% |

Per-kelas RGBD (±1 Acc / MAE / bias):

| Detektor | B1 | B2 | B3 | B4 |
|---|---|---|---|---|
| YOLO26l | 87,3% / 0,60 / −0,24 | 81,8% / 0,91 / −0,04 | 85,5% / 0,91 / −0,07 | 96,4% / 0,27 / −0,13 |
| RT-DETR-L | 92,7% / 0,58 / −0,07 | 81,8% / 1,02 / −0,07 | 81,8% / 0,71 / −0,16 | 98,2% / 0,22 / −0,07 |
| RF-DETR-L | 90,9% / 0,51 / −0,07 | 83,6% / 0,84 / +0,04 | 83,6% / 0,65 / −0,25 | 94,5% / 0,35 / −0,05 |

**Sumber:** `results/counting_rgbd352.json`, `results/counting_rgb352.json`, `results/bootstrap_ci_352.json`
**Verdict:** FALSIFIED — depth 4-kanal TIDAK meningkatkan counting. Bootstrap CI
menunjukkan P(RGBD>RGB) hanya 16,5% (YOLO26l), 5,6% (RT-DETR-L), dan 47,3%
(RF-DETR-L). Tidak satu pun arsitektur yang CI-nya eksklusif positif.
RF-DETR-L tepat sama (88,18%) dengan Tree ±1 Acc sedikit naik (67,27% vs 65,45%),
tapi CI simetris [−2,7pp, +2,7pp] menunjukkan ini kebetulan.
**Catatan:** Early fusion depth secara konsisten merugikan counting meskipun YOLO26l
menunjukkan sedikit perbaikan deteksi. Ini mengonfirmasi bahwa perbaikan deteksi minor
tidak otomatis menerjemahkan ke perbaikan counting.

---

## V2-E-007 — Analisis matriks 9-sel: dampak dataset dan arsitektur terhadap deteksi dan counting

**Tanggal:** 2026-08-09
**Tujuan:** Sintesis terstratifikasi dari 9 kombinasi (3 arsitektur × 3 dataset)
untuk menjawab: (1) apakah urutan arsitektur konsisten lintas dataset,
(2) apakah early fusion depth membantu, (3) bagaimana pola per-kelas berubah.

### A. Matriks deteksi (test split, pycocotools mAP50)

| | YOLO26l | RT-DETR-L | RF-DETR-L |
|---|---|---|---|
| 953-RGB | 0,5435 | 0,5781 | **0,6012** |
| 352-RGB | 0,3606 | 0,4343 | **0,4544** |
| 352-RGBD | **0,3919** | 0,3877 | 0,4186 |

**Temuan deteksi:**
1. **Urutan arsitektur stabil di RGB**: RF-DETR-L > RT-DETR-L > YOLO26l pada kedua
   dataset RGB (953 dan 352 pohon). Gap RF-DETR vs YOLO26l konsisten (~0,06–0,09).
2. **RGBD memecah urutan**: RT-DETR-L turun di bawah YOLO26l saat menerima depth
   (0,3877 vs 0,3919). RF-DETR-L tetap #1 tapi gap menyempit.
3. **Penurunan absolut 953→352**: semua arsitektur turun ~0,15–0,18 mAP50
   (efek ukuran dataset + distribusi kelas berbeda, BUKAN degradasi model).
4. **B4 paling terdampak depth**: delta B4 untuk RT-DETR-L (−0,110) dan
   RF-DETR-L (−0,116) jauh lebih besar dari kelas lain. B4 (tandan overripe)
   memiliki instance paling sedikit dan paling rentan terhadap noise depth.

### B. Matriks counting (test split, Ridge + F_all, Class ±1 Acc)

| | YOLO26l | RT-DETR-L | RF-DETR-L |
|---|---|---|---|
| 953-RGB | 72,16% | 76,24% | 76,24% |
| 352-RGB | 89,55% | **90,91%** | 88,18% |
| 352-RGBD | 87,73% | 88,64% | 88,18% |

**Temuan counting:**
1. **Detektor terbaik ≠ counter terbaik**: RF-DETR-L unggul deteksi di semua
   dataset RGB, tapi RT-DETR-L unggul counting pada 352-RGB (90,91% vs 88,18%).
   Pada 953-RGB, RT-DETR-L dan RF-DETR-L seri (76,24%).
2. **Depth merugikan counting pada 2/3 arsitektur**: YOLO26l −1,8pp, RT-DETR-L
   −2,3pp. RF-DETR-L netral (88,18% → 88,18%) tapi Tree ±1 Acc naik
   (65,45% → 67,27%).
3. **Counting 352 >> 953**: semua model mencapai 87–91% pada 352 pohon vs
   72–76% pada 953 pohon. Ini karena distribusi kelas lebih seragam dan
   jumlah tandan per pohon lebih sedikit di SawitMVC-Depth.

### C. Bootstrap CI — uji signifikansi RGBD vs RGB (10.000 replikat, paired)

| Arsitektur | Δ Class ±1 | CI 95% | P(RGBD>RGB) | Signifikan? |
|---|---|---|---|---|
| YOLO26l | −1,82pp | [−5,9, +1,8] | 16,5% | Tidak (CI memuat 0) |
| RT-DETR-L | −2,25pp | [−5,0, +0,5] | 5,6% | Marginal (CI hampir ekskl. negatif) |
| RF-DETR-L | +0,02pp | [−2,7, +2,7] | 47,3% | Tidak (CI simetris, efek ~0) |

**Kesimpulan:** Tidak ada arsitektur yang secara signifikan diuntungkan oleh depth
pada level α=0,05. RT-DETR-L mendekati signifikan ke arah NEGATIF (P=5,6%),
artinya depth kemungkinan merugikan RT-DETR-L.

### D. Analisis per-kelas terstratifikasi (352 pohon, RGB vs RGBD)

**Deteksi — kelas yang paling diuntungkan depth:**
- YOLO26l B3: +0,064 (kelas terlemah naik paling banyak)
- YOLO26l B4: +0,030
- RF-DETR-L B1: +0,008

**Deteksi — kelas yang paling dirugikan depth:**
- RF-DETR-L B4: −0,116
- RT-DETR-L B4: −0,110
- RF-DETR-L B3: −0,032

**Counting — pola bias:**
- Semua model RGBD memiliki bias negatif lebih besar di B1 dan B3
  (under-predict), terutama YOLO26l B1 (bias −0,24 vs −0,09 di RGB).
- B4 konsisten baik (acc >94%) karena instance sedikit dan Ridge mudah
  memprediksi mendekati 0.

### E. Ringkasan Fase 4

**Jawaban untuk pertanyaan utama:**

| Pertanyaan | Jawaban |
|---|---|
| Arsitektur terbaik deteksi? | RF-DETR-L (konsisten #1 di RGB) |
| Arsitektur terbaik counting? | RT-DETR-L (90,91% pada 352-RGB) |
| Apakah depth membantu deteksi? | Hanya YOLO26l (+0,031), sisanya merugikan |
| Apakah depth membantu counting? | Tidak — 0/3 arsitektur signifikan naik |
| Kelas tersulit? | B3 (matang awal) — AP50 terendah di semua kondisi |
| Kelas termudah? | B1 (mentah) — AP50 >0,68 di semua kondisi |

**Implikasi untuk Fase 5:** Early fusion naif (concat kanal) tidak efektif.
Fase 5 harus mengeksplorasi (1) representasi depth alternatif (edge, inverse,
clipping) yang mungkin memberikan sinyal lebih informatif, dan/atau (2) arsitektur
fusi yang lebih canggih (mid/late fusion, attention-based) yang tidak sekadar
menggabungkan kanal di input.

**Sumber:** `results/matrix_compiled.json`, `results/bootstrap_ci_352.json`

---

## V2-E-008 [screening-15ep] — Encoding depth alternatif pada YOLO26l 4-kanal (early fusion), 352 pohon

**Tanggal:** 2026-08-10/11
**Hipotesis:** Mengganti encoding kanal depth (arsitektur early fusion TIDAK
diubah, sama seperti V2-E-005) meningkatkan val mAP50 dibandingkan encoding
`inverse` V2-E-005 dalam protokol screening cepat (≤15 epoch, patience 3),
konsisten dengan lever representasi Fase 5 (`docs/RENCANA.md`).
**Dataset & split:** SawitMVC-Depth-4ch-{edge,clipped,valid_mask}, 352 pohon
(245 train / 52 val / 55 test, split `canonical_70_15_15` — sama persis
dengan V2-E-003..007). Depth direproyeksi ulang (`depth_meta.json`: cakupan
valid 71,0%, Z_NEAR/Z_FAR=0,8/15,0 m, sama dengan angka lama).
**Metode:**
- `edge` (Sobel gradient magnitude), `clipped` (clip@80, near-field), keduanya
  via `scripts/create_depth_edge_dataset.py` (sudah ada sebelumnya).
- `valid_mask` (BARU): pisahkan sentinel "tidak ada data" (0) dari valid-terjauh
  secara numerik (rentang valid dimampatkan ke [40,220]) — motivasi: pada
  encoding `inverse`, invalid(0) hanya beda 1 increment dari valid-terjauh(1)
  pada skala kontinu yang sama, network tak punya sinyal eksplisit membedakan
  "sensor gagal" vs "sekadar jauh". Fungsi `encode_valid_mask` di
  `scripts/create_depth_edge_dataset.py`.
- `dropout` (BARU, augmentasi kanal depth): kanal depth di-nol-kan acak p=0,25
  saat TRAIN saja, arsitektur early fusion `inverse` tidak diubah. Adaptasi
  `Research-Pipeline/pipeline/fourch.py::patch_loader` (copy, bukan
  cross-import) ke `scripts/train_yolo_4ch_dropout.py`.
- Training: `YOLO('yolo26l.pt').train(epochs=15, patience=3, imgsz=1280,
  batch=4, seed=42, cos_lr=True)` — protokol screening cepat wajib
  (`docs/RENCANA.md` Fase 5), BUKAN angka final 60-epoch.
- Metrik: val mAP50/mAP50-95 native ultralytics (bukan pycocotools test-split
  — hanya untuk ranking relatif antar-kandidat Fase 5, per protokol).

**Hasil (val split, 208 pohon, mAP50 terbaik selama training):**

| Kandidat | Epoch terbaik | val mAP50 | val mAP50-95 | Durasi |
|---|---|---|---|---|
| `inverse` (V2-E-005, acuan, 60 epoch bukan 15 — tidak di-rerun) | — | — | — | — |
| `dropout` | 15 (belum plateau) | 0,3168 | 0,1091 | 2583,7 dtk |
| **`edge`** | **15 (belum plateau)** | **0,3777** | **0,1279** | 2584,4 dtk |
| `clipped` | 14 | 0,3221 | 0,1136 | 2574,9 dtk |
| `valid_mask` | 11 | 0,3321 | 0,1022 | 2575,5 dtk |

**Sumber:** `runs/yolo26l_screening_{dropout,edge,clipped,valid_mask}352/results.csv`,
`runs/yolo26l_screening_*352/hasil.json`
**Verdict:** CONFIRMED — `edge` (Sobel gradient magnitude) unggul jelas dari
tiga kandidat lain (+0,046 s/d +0,061 mAP50), selaras F-002 (frekuensi tinggi
memisahkan tandan dari pelepah, +0,0731 pada B4). Tidak seperti tiga kandidat
lain yang mulai plateau/turun, `edge` dan `dropout` masih naik di epoch 15 —
`edge` dipromosikan ke training penuh 60 epoch (lihat V2-E-010).
**Catatan:** Angka screening 15-epoch ini TIDAK dibandingkan langsung dengan
angka 60-epoch V2-E-003/005 (dataset/protokol sama tapi durasi beda) — hanya
untuk ranking relatif antar-kandidat Fase 5, sesuai protokol.

---

## V2-E-009 [screening-15ep] — Mid-fusion depth + gate non-zero-init pada YOLO26l, 352 pohon

**Tanggal:** 2026-08-11
**Hipotesis:** Memindahkan depth dari early fusion (concat kanal ke-4 di
input) ke cabang terpisah dengan fusi aditif ber-gate di backbone menengah
(P3/8, layer index 4 `yolo26.yaml`), gate diinisialisasi kecil-taknol (0,02,
BUKAN nol seperti F-007), meningkatkan val mAP50 dibandingkan baseline RGB
352 pohon (V2-E-003, 0,3606 test) dan tidak berhenti mati seperti F-007
(gate diharapkan bergerak menjauhi inisialisasinya).
**Dataset & split:** SawitMVC-Depth-4ch (encoding `inverse`, sama dengan
V2-E-005) — 352 pohon, split sama seperti V2-E-008.
**Metode:**
- Arsitektur baru `scripts/train_yolo_midfusion.py`: stem RGB 3-kanal
  TIDAK disentuh (beda mendasar dari V2-E-005/early fusion) — dibangun
  `ch=3` eksplisit (bukan `data["channels"]=4`), bobot pratlatih COCO
  di-load bersih tanpa mismatch shape. Cabang depth terpisah (conv stride-8,
  1→16→32→512 kanal, conv terakhir diinisialisasi skala 0,1x — mitigasi
  F-007 "inisialisasi kecil-taknol"), fitur-nya dijumlahkan ke output layer 4
  dikali gate scalar `γ` (init 0,02).
- Patch di level CLASS (`BaseModel._predict_once`, cek `hasattr(self,
  "depth_branch")`) — bukan per-instance (`types.MethodType`, percobaan
  pertama GAGAL: `Trainer.final_eval()` me-reload model dari checkpoint
  lewat `AutoBackend`, method per-instance tidak ikut ter-reload walau
  `depth_branch`/`gate` sebagai submodul/parameter biasa tetap ter-reload
  benar — diverifikasi lewat smoke test save→reload→forward sebelum retry).
- Training: sama seperti V2-E-008 (15 epoch, patience 3, imgsz 1280, batch 4,
  seed 42, cos_lr).

**Hasil (val split, 208 pohon):**

| Epoch | val mAP50 | val mAP50-95 |
|---|---|---|
| 1 | 0,0799 | 0,0247 |
| 2 | 0,1615 | 0,0414 |
| **3 (terbaik)** | **0,2087** | **0,0712** |
| 4 | 0,2015 | 0,0647 |
| 5 | 0,2161 | 0,0667 |
| 6 (early-stop, patience=3) | 0,1876 | 0,0552 |

Validasi akhir (best.pt, epoch 3) per kelas: B1=0,396, B2=0,329, **B3=0,056,
B4=0,051** (mAP50-95 masing-masing 0,131/0,115/0,015/0,023).
Gate: init 0,02 → final 0,0250 (bergerak naik — TIDAK macet di titik mati
seperti F-007, secara mekanis pelajaran F-007 berhasil dihindari).
**Sumber:** `runs/yolo26l_screening_midfusion352/results.csv`,
`runs/yolo26l_screening_midfusion352/hasil.json`
**Verdict:** FALSIFIED — sinyal TIDAK naik konsisten (plateau lalu turun
setelah epoch 3, early-stop di epoch 6), kalah jauh dari keempat kandidat
representasi V2-E-008 (0,209 vs 0,317-0,378) pada jumlah epoch yang sama.
Per protokol Fase 5 (`docs/RENCANA.md`: "kandidat yang lolos screening naik
konsisten"), TIDAK dipromosikan ke 60 epoch. B3/B4 nyaris nol kemungkinan
karena cabang depth mulai dari inisialisasi acak (beda dengan kandidat
representasi yang langsung mewarisi bobot pretrained di conv pertama) —
enam epoch kemungkinan tidak cukup untuk kelas langka (B3/B4 paling sedikit
instance-nya). Dicatat sebagai hasil negatif dengan bobot yang sama — TIDAK
membantah bahwa mid-fusion+gate non-zero-init bisa bekerja secara umum,
hanya bahwa konfigurasi spesifik ini (fuse_at=4, gate init=0,02, tanpa LR
terpisah untuk cabang depth) tidak lolos screening cepat pada YOLO26l.

---

## V2-E-010 — Encoding depth `edge` (Sobel) pada YOLO26l, 60 epoch penuh, dibanding `inverse` (V2-E-005)

**Tanggal:** 2026-08-11
**Hipotesis:** Encoding depth `edge` (Sobel gradient magnitude), yang menang
screening 15-epoch (V2-E-008, val mAP50 0,3777), meningkatkan test mAP50
dibandingkan `inverse`/early fusion biasa (V2-E-005, test mAP50 0,3919) saat
dilatih penuh 60 epoch dengan protokol identik.
**Dataset & split:** SawitMVC-Depth-4ch-edge, 352 pohon (245 train / 52 val /
55 test), split `canonical_70_15_15` — sama persis dengan V2-E-003/005.
**Metode:** `scripts/train_yolo_4ch_screening.py --epochs 60 --patience 60`
(config identik V2-E-005: imgsz 1280, batch 4, seed 42, cos_lr). Evaluasi:
`scripts/eval_pycoco_rgbd352.py` (pycocotools, test split), bobot
`runs/yolo26l_e60_i1280_rgbd352_edge/weights/best.pt`.

**Hasil (test split, pycocotools):**

| | inverse (V2-E-005) | edge (V2-E-010) | Δ |
|---|---|---|---|
| mAP50 | 0,3919 | **0,4316** | **+0,0397 (+10,1% relatif)** |
| mAP50-95 | 0,1408 | 0,1441 | +0,0033 |

Per-kelas AP50 (test):

| Kelas | inverse | edge | Δ |
|---|---|---|---|
| B1 | 0,6857 | 0,7252 | +0,0395 |
| B2 | 0,4579 | 0,5031 | +0,0452 |
| B3 | 0,2637 | 0,2240 | −0,0397 |
| **B4** | 0,1601 | **0,2740** | **+0,1139** |

Dibanding RGB-352 murni (V2-E-003, test mAP50 0,3606): `edge` unggul di
**keempat kelas sekaligus** (B1 +0,0448, B2 +0,0711, B3 +0,0239, B4 +0,1441),
sesuatu yang `inverse` tidak pernah capai (`inverse` cuma unggul RGB di 1-2
kelas, campur naik-turun — lihat V2-E-005).

**Sumber:** `results/perkelas_pycoco_rgbd352.json` (kunci
`YOLO26l-RGBD-edge`), `runs/yolo26l_e60_i1280_rgbd352_edge/results.csv`,
`runs/yolo26l_e60_i1280_rgbd352_edge/hasil.json`
**Verdict:** CONFIRMED — `edge` mengalahkan `inverse` secara jelas di mAP50
keseluruhan (+10,1% relatif, di atas ambang "2-5% tidak cukup" yang jadi
standar proyek ini). Pola per-kelas selaras hipotesis F-002: **B4 (kelas
paling dirugikan early fusion di V2-E-005, −0,116) sekarang paling diuntungkan
(+0,114)** — sinyal tepi/gradien depth membantu tepat di kasus tandan
kecil/tertutup pelepah yang paling sulit dipisahkan dari fronds secara warna.
B3 sedikit turun (−0,040), konsisten dengan diagnosis bahwa B2/B3 adalah
ambiguitas fotometrik (warna) yang depth — dalam bentuk apapun — tidak bisa
menyelesaikan.
**Counting (Ridge + F_all, test 55 pohon):**

| | inverse (V2-E-006) | edge | Δ |
|---|---|---|---|
| Class ±1 Acc | 87,73% | 87,27% | −0,46pp |
| Tree ±1 Acc | 60,00% | 61,82% | +1,82pp |
| Macro MAE | 0,673 | 0,564 | −0,109 (membaik) |

Per-kelas edge (Acc/MAE/bias): B1=85,5%/0,600/−0,236, B2=81,8%/0,836/−0,182,
B3=85,5%/0,655/−0,255, B4=96,4%/0,164/−0,127.

**Sumber counting:** `results/counting_rgbd352.json` (kunci
`YOLO26l-RGBD-edge`), `runs/pertree_rgbd352/yolo_yolo26lrgbdedge/`

**Catatan penting:** deteksi naik jelas (+10,1% mAP50) TIDAK diikuti
kenaikan counting Class ±1 Acc yang setara — malah sedikit turun (−0,46pp),
meski Tree ±1 Acc dan Macro MAE membaik. Ini pola yang sama dengan V2-E-005/006
(deteksi naik tak otomatis bikin counting naik, karena pipeline counting
bergantung pada konsistensi lintas-sisi, bukan cuma mAP rata-rata). Kesimpulan
detection-level tetap CONFIRMED; kesimpulan counting-level lebih tepat
INCONCLUSIVE — perbaikan di beberapa metrik (Tree Acc, MAE), datar/sedikit
turun di metrik utama (Class Acc).

**Belum lengkap:** bootstrap CI berpasangan (edge vs RGB-352) menyusul
setelah retrain baseline RGB-352 (bobot lama tidak tersimpan di workspace
ini) selesai — akan dicatat sebagai entri terpisah, `V2-E-011`.

---

## V2-E-011 — Retrain baseline RGB-352 + bootstrap CI berpasangan: `edge` vs RGB

**Tanggal:** 2026-08-11
**Hipotesis:** `edge` (RGBD) secara signifikan mengalahkan RGB-352 murni
pada counting Class ±1 Acc (bootstrap CI berpasangan per-pohon, 10.000
replikat), melengkapi kemenangan deteksi di V2-E-010.
**Dataset & split:** SawitMVC-Depth, 352 pohon, split `canonical_70_15_15`
— identik V2-E-003/004/010.
**Metode:** Retrain YOLO26l RGB-352 dari nol (bobot lama V2-E-003 tidak
tersimpan di workspace ini) — config identik V2-E-003 (`scripts/train_yolo_4ch_screening.py
--epochs 60 --patience 60`, data `SawitMVC-Depth/data_rgb_352.yaml`).
Eval: `scripts/eval_pycoco_352.py`, `scripts/run_counting_rgb352.py`,
`scripts/bootstrap_ci.py` (entri `YOLO26l-edge` ditambahkan).

**Sanity check reproduksi retrain RGB-352 vs V2-E-003/004 asli:**

| | Asli (V2-E-003/004) | Retrain ini | Δ |
|---|---|---|---|
| Deteksi test mAP50 | 0,3606 | 0,3711 | +0,0105 (wajar, dalam variasi run) |
| Counting Class ±1 Acc | 89,55% | **84,09%** | **−5,46pp (lebih besar dari variasi biasa)** |

Deteksi reproduksi baik. Counting reproduksi lebih buruk dari yang
diharapkan — konsisten dengan pola yang berulang di proyek ini: perbedaan
kecil pada deteksi (box mana yang lolos/tidak) bisa mengubah fitur
konsistensi lintas-sisi yang dipelajari Ridge secara tidak proporsional.
Ini bukan bug, tapi konsekuensi nyata yang harus dibawa ke interpretasi
hasil di bawah.

**Hasil bootstrap CI berpasangan (edge vs retrain RGB-352 ini, 10.000 replikat):**

| Metrik | Δ | CI95 | P(RGBD>RGB) |
|---|---|---|---|
| Class ±1 Acc | +3,18pp | [−0,5pp, +7,3pp] | 94,3% |
| Tree ±1 Acc | +7,24pp | [−1,8pp, +18,2pp] | 90,0% |

**Sumber:** `results/bootstrap_ci_352.json` (kunci `YOLO26l-edge`),
`results/perkelas_pycoco_rgb352.json`, `results/counting_rgb352.json`,
`runs/yolo26l_e60_i1280_rgb352/`

**Verdict: INCONCLUSIVE untuk counting** (CI hampir tidak memuat nol tapi
masih memuat nol secara ketat; P=94,3% cukup kuat tapi belum ambang 95%
formal) — **DAN kesimpulannya berbalik arah tergantung baseline RGB mana
yang dipakai:**

- Dibanding retrain RGB-352 ini (84,09%): `edge` (87,27%) UNGGUL +3,18pp.
- Dibanding angka ASLI V2-E-004 (89,55%): `edge` (87,27%) justru KALAH −2,28pp.

Ini BUKAN kemenangan bersih seperti deteksi (V2-E-010: `edge` unggul dari
SEMUA baseline RGB manapun yang dipakai, 0,4316 vs 0,3606/0,3711 RGB-only
dan 0,3919 inverse). Untuk counting, kesimpulan sensitif terhadap noise
reproduksi baseline itu sendiri — kejujuran metodologis mengharuskan ini
dilaporkan sebagai TIDAK KONKLUSIF, bukan dibulatkan ke arah manapun yang
lebih enak didengar.

**Ringkasan Fase 5 akhir:** lever representasi (`edge`) CONFIRMED
memperbaiki deteksi (+10,1% mAP50, robust lintas-baseline), TIDAK
KONKLUSIF untuk counting (arah tergantung baseline pembanding). Lever
arsitektur (mid-fusion+gate) FALSIFIED di screening (V2-E-009). Hasil
positif deteksi ini genuinely baru — tidak ada benchmark RGB-D pada TBS
sawit sebelumnya di literatur manapun.

---

# Fase 6 — Diagnostik ulang dan pipeline dua-tahap

Konteks: pengguna meminta terobosan yang bisa dipertanggungjawabkan secara
matematis supaya depth benar-benar menaikkan metrik, dengan pelonggaran scope
eksplisit — boleh berat, boleh multi-tahap, tidak harus YOLO, tidak harus satu
pipeline. Sebelum melatih apa pun, dijalankan lima probe read-only; hasilnya
mengubah rumusan masalahnya. Jalan penemuan lengkap: `docs/DIAGNOSIS-DEPTH.md`.
Semua probe reproducible via `scripts/probe_depth_signal.py`.

---

## V2-E-012 — Gap mAP50 antara 953 dan 352 pohon disebabkan kelangkaan label B3/B4, bukan kanal depth

**Tanggal:** 2026-08-11
**Hipotesis:** Selisih test mAP50 953-vs-352 dapat dijelaskan sepenuhnya oleh
perbedaan komposisi kelas, bukan oleh kehadiran kanal depth. Falsifikasi:
kalau gap tersebar merata di keempat kelas, hipotesis ini salah.
**Dataset & split:** SawitMVC-YOLO (953) dan SawitMVC-Depth (352), seluruh
split, hitung ulang langsung dari file label.
**Metode:** `scripts/probe_depth_signal.py --probe distribusi`

**Hasil:**

| Split | citra | instance | /citra | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|---|---|
| 953-train | 3.000 | 14.041 | 4,68 | 11,2% | 18,6% | 52,2% | 17,9% |
| 953-test | 588 | 2.612 | 4,44 | 9,6% | 19,0% | 53,9% | 17,4% |
| 352-train | 980 | 1.517 | 1,55 | 35,8% | 43,6% | 14,2% | 6,5% |
| 352-test | 220 | 410 | 1,86 | 35,9% | 42,4% | 15,4% | 6,3% |

B3 train 7.333 → 215 instance (34× lebih sedikit); B4 2.513 → 98 (26×).
AP50 per kelas (YOLO26l test): B1 0,7705→0,6804, B2 0,4479→0,4320,
**B3 0,6050→0,2001, B4 0,3506→0,1299**.

**Sumber:** `results/perkelas_pycoco_v2repro.json`,
`results/perkelas_pycoco_rgb352.json`, hitung ulang label via probe.
**Verdict: CONFIRMED** — gap terkonsentrasi persis di dua kelas yang
instance-nya menghilang; B1/B2 nyaris tidak berubah.
**Konsekuensi:** perbandingan lintas dataset 953-vs-352 tidak sah dan tidak
boleh dipakai lagi untuk menilai depth. Memotong dataset 953 jadi 25% tetap
menyisakan ~1.800 instance B3 dengan komposisi kelas yang sama, jadi "RGB 25%
tetap menang" adalah hasil yang diharapkan dan tidak menguji depth.

---

## V2-E-013 — Sebagian besar kehilangan mAP50 berasal dari salah kelas, bukan gagal lokalisasi

**Tanggal:** 2026-08-11
**Hipotesis:** Pada bobot RGB-352 yang sudah ada, AP50 class-agnostic jauh di
atas mAP50 class-aware. Falsifikasi: kalau keduanya berdekatan, yang rusak
adalah lokalisasi dan pemisahan dua-tahap tidak akan menolong.
**Dataset & split:** SawitMVC-Depth 352, split kanonik, test (410 box).
**Metode:** inference `runs/yolo26l_e60_i1280_rgb352/weights/best.pt`
(conf 0,001, IoU-NMS 0,7), lalu AP50 gaya COCO dihitung dua kali — sekali
per kelas, sekali dengan seluruh kelas dilipat jadi satu. Implementasi
divalidasi lebih dulu: mAP50 hasil hitung sendiri 0,3707 vs pycocotools
0,3711 (selisih 0,0004).

**Hasil:**

| Besaran | Nilai |
|---|---|
| mAP50 class-aware | 0,3707 |
| AP50 class-agnostic (lokalisasi murni) | **0,6677** |
| Hilang karena salah kelas | **0,2970 (44,5%)** |

Konfusi pada box yang sudah benar lokasinya (IoU≥0,5, conf≥0,25):

| | →B1 | →B2 | →B3 | →B4 | recall |
|---|---|---|---|---|---|
| B1 | 92 | 26 | 0 | 0 | 78,0% |
| B2 | 13 | 83 | 12 | 0 | 76,9% |
| B3 | 0 | 21 | 11 | 4 | 30,6% |
| B4 | 0 | 1 | 3 | 5 | 55,6% |

Akurasi klasifikasi 70,5% (n=271). Seluruh kesalahan jatuh ke kelas
bertetangga — nol kasus B1→B3/B4 — jadi ini masalah **ordinal**.
Catatan kejujuran: 70,5% itu bersyarat pada box yang berhasil dideteksi
(271 dari 410); atas seluruh GT akurasinya 191/410 = **46,6%**.

**Sumber:** `scripts/eval_twostage.py` (fungsi `ap50`), log sesi 2026-08-11.
**Verdict: CONFIRMED** — plafon mAP50 pipeline ini adalah 0,6677, dan 44,5%
kemampuan yang sudah ada terbuang di tahap penamaan kelas.

---

## V2-E-014 — Sinyal depth yang tersedia adalah relief lokal ordinal, bukan skala metrik, dan sub-kuantum per piksel

**Tanggal:** 2026-08-11
**Hipotesis (A):** depth memberi skala metrik (`D = d·Z/f`) yang memisahkan
kelas lebih baik daripada ukuran piksel.
**Hipotesis (B):** depth memberi kontras kedalaman lokal antara tandan dan
sekelilingnya yang monoton terhadap kematangan.
**Dataset & split:** 2.299 box GT SawitMVC-Depth + `depth_png_352/`.
**Metode:** `scripts/probe_depth_signal.py --probe depth`

**Hasil A — FALSIFIED.** Z median per kelas nyaris konstan:
B1 1,36 m / B2 1,33 / B3 1,31 / B4 1,20. Protokol foto jarak tetap, jadi
mengalikan dengan Z hanya menggeser skala. (Temuan sampingan: depth **95,1%
valid DI DALAM box** — angka "29% invalid" yang selama ini dikutip itu latar,
bukan objek.)

**Hasil B — CONFIRMED.** Relief = median Z(cincin) − median Z(box):

| | B1 | B2 | B3 | B4 |
|---|---|---|---|---|
| relief median | **+2,8 cm** | 0,0 cm | −1,5 cm | **−5,1 cm** |
| lebih dekat dari sekitar | 61,3% | 50,7% | 41,4% | 26,4% |

Kruskal-Wallis 4 kelas: **H = 99,8, p = 1,7×10⁻²¹**. Monoton sempurna.

**Kenapa sinyal sekuat itu tidak terpakai:** encoding uint8 inverse-depth
`[0,8; 15,0]` m punya step `dZ/dv = Z²·(1/Z_NEAR − 1/Z_FAR)/254` = **2,91 cm
per level di Z=2,5 m** (median Z per citra dataset ini 2,49 m). Sinyal relief
median 0,8 cm = **0,27 level**; B4 (5,1 cm) = 1,8 level. Dengan derau sensor
~1% Z ≈ 2,5 cm, **SNR per piksel ≈ 0,3**. Rentang dinamis kanal justru habis
untuk ramp global adegan (entropi 7,68 dari 8 bit) yang **nuisance** — median
Z per citra std 0,82 m, rentang 0,80–6,44 m, mengikuti posisi operator.

Pooling memulihkan sinyalnya (AUC B1-vs-B4):

| piksel di-pool | AUC train+val | AUC test |
|---|---|---|
| 1 | 0,592 | 0,577 |
| 16 | 0,724 | 0,650 |
| 256 | 0,728 | 0,593 |
| 4.096 | 0,730 | 0,621 |

**Sumber:** `scripts/probe_depth_signal.py`, `depth_png_352/depth_meta.json`.
**Verdict: A FALSIFIED, B CONFIRMED.**
**Konsekuensi:** depth harus dikonsumsi **setelah pooling wilayah**, pada jalur
**klasifikasi**. Early fusion di stem adalah rezim terburuk (resolusi penuh,
pooling minimum) — menjelaskan kegagalan berulang E-022/E-027/E-032/V2-E-005/006,
sekaligus meretrodiksi kenapa `edge` (Sobel = high-pass yang membuang ramp
global) satu-satunya yang pernah menang (V2-E-008/010).
**Koreksi terhadap pemahaman lama:** rentang `[0,8; 15,0]` dipilih di Volume 1
dengan memaksimalkan entropi SELURUH CITRA — objektif yang keliru untuk tugas
ini, karena mengoptimalkan deskripsi langit dan pohon jauh, bukan resolusi pada
skala objek.

---

## V2-E-015 — Classifier kematangan pada crop mengalahkan klasifikasi detektor satu-tahap

**Tanggal:** 2026-08-11
**Hipotesis:** Memisahkan klasifikasi kematangan menjadi model crop tersendiri
(dengan pretraining dari 846 pohon 953 yang bebas bocor, sampling seimbang
kelas, dan mask box target) menaikkan akurasi kematangan di atas 46,6% yang
dicapai detektor Fase 1-5 atas seluruh GT.
**Dataset & split:** crop GT SawitMVC-Depth 352, split kanonik
(1.517 train / 372 val / 410 test); pretraining dari 16.542 crop 846 pohon 953
(`splits_fase6/pretrain953_*`, irisan nol dengan val/test-352 diverifikasi).
**Metode:** `scripts/build_crop_dataset.py` + `scripts/train_crop_classifier.py`,
backbone `convnext_tiny.fb_in22k_ft_in1k` (in_chans=4: RGB + mask box), head
hybrid (CE + CORAL), 45 epoch, batch 32.

**Hasil (akurasi kematangan, test split 410 crop):**

| Pendekatan | test akurasi |
|---|---|
| Tebak kelas terbanyak (B2) | 0,4244 |
| Histogram warna + regresi logistik | 0,4780 |
| **Detektor Fase 1-5 atas seluruh GT** | **0,4659** (191/410) |
| **Classifier crop (rata-rata 3 seed)** | **0,6309 ± 0,0203** |

**Dua bug sendiri yang sempat menahan hasil** (dicatat karena keduanya generik
dan mudah terulang):
1. Crop diperluas ctx=1,6 supaya cincin ikut masuk, tapi di kanopi padat sering
   ada >1 tandan per crop — tanpa penanda, model tidak tahu tandan mana yang
   dinilai. Ditambahkan kanal **mask box**.
2. Augmentasi fotometrik awal (brightness ±25%, saturasi 0,6–1,4) menghapus
   label: kematangan tandan DIDEFINISIKAN oleh warna. Diturunkan ke ±7%.
Setelah keduanya diperbaiki, pretrain 953 naik dari akurasi 0,471 → 0,648.

**Sumber:** `runs_fase6/sd{101,202,303}_rgb/hasil.json`,
`runs_fase6/pre953v2/hasil.json`.
**Verdict: CONFIRMED** — +16,5pp absolut di atas klasifikasi detektor.
**Catatan:** run dengan `in_chans=3` di `runs_fase6/` (ft_rgb_coral,
ft_rgb_hybrid, ft_rgbd_hybrid) berasal dari kode sebelum kedua bug diperbaiki
dan **tidak sebanding** — sengaja tidak dihapus, tapi tidak dipakai di angka
manapun.

---

## V2-E-016 — Informasi kematangan yang dibawa depth REDUNDAN secara kondisional terhadap RGB

**Tanggal:** 2026-08-11
**Hipotesis:** Kanal relief depth menaikkan akurasi klasifikasi kematangan di
atas RGB saja. Falsifikasi: kalau delta-nya nol atau negatif lintas seed,
hipotesis gugur.
**Dataset & split:** sama dengan V2-E-015.

### Bagian A — cabang CNN depth, 3 seed

Cabang depth terpisah (2 kanal: relief + mask valid), difusikan setelah global
pooling, gate init 0,1 (taknol, pelajaran F-007), plus loss auxiliary RGB-only.

| seed | val rgb | val rgbd | Δ | test rgb | test rgbd | Δ |
|---|---|---|---|---|---|---|
| 101 | 0,6505 | 0,6075 | −0,0430 | 0,6146 | 0,5805 | −0,0341 |
| 202 | 0,6640 | 0,6398 | −0,0242 | 0,6537 | 0,6073 | −0,0463 |
| 303 | 0,6290 | 0,6532 | +0,0242 | 0,6244 | 0,6439 | +0,0195 |

Rata-rata **Δval = −0,0143** (t=−0,72, p=0,55), **Δtest = −0,0203**
(t=−1,01, p=0,42). Gate berhenti di 0,110–0,114 dari init 0,100 — model
praktis tidak membuka jalur depth.

Catatan penting: satu seed tunggal sempat memberi **+5,9pp** — persis besaran
yang, kalau dilaporkan sendirian, akan terbaca sebagai kemenangan depth.
Multi-seed menunjukkan itu derau.

### Bagian B — statistik depth terpool secara analitik

Bagian A bisa dibantah: desain cabang CNN melanggar temuan V2-E-014 sendiri
(pooling ditaruh di akhir, sesudah 4 conv ber-stride bekerja pada medan
ber-SNR ~0,3). Jadi diuji lagi dengan depth diberi kondisi paling
menguntungkan — 8 statistik yang SUDAH terpool (relief cincin−box, median,
std, cakupan valid, rentang persentil), ditempel ke fitur penultimate
classifier RGB terlatih, dibandingkan lewat regresi logistik yang sama.

Sinyal relief terverifikasi masih utuh di crop: B1 +1,34 cm, B2 −0,24,
B3 −2,60, B4 −4,29 — tetap monoton.

| Fitur | val akurasi | test akurasi |
|---|---|---|
| statistik depth saja (8 dim) | 0,3468 | 0,3756 |
| RGB saja (768 dim) | 0,6774 | 0,6415 |
| RGB + statistik depth (776 dim) | 0,6720 | 0,6415 |

**Kontribusi depth: −0,0054 val, +0,0000 test.**

**Sumber:** `runs_fase6/sd*/hasil.json`, `results/probe_fitur_depth.json`,
`scripts/probe_fitur_depth.py`.
**Verdict: FALSIFIED.**

**Interpretasi — ini temuan utamanya.** Depth membawa informasi kematangan bila
berdiri sendiri (`I(Y;D) > 0`: relief monoton, Kruskal-Wallis p=1,7×10⁻²¹ di
V2-E-014; dan sendirian ia mencapai 0,3756 vs tebakan acak 0,25). Tetapi
informasi itu **redundan secara kondisional terhadap RGB** (`I(Y;D|RGB) ≈ 0`).
Penjelasan fisiknya sederhana: tandan yang menonjol keluar dari pelepah (B1)
juga *terlihat* besar dan matang di RGB — relief adalah **akibat** dari
variabel laten yang sama (kematangan/ukuran tandan), bukan pengukuran
independen atasnya.

**Konsekuensinya bersifat batas, bukan kegagalan implementasi.** Tidak ada
arsitektur fusi yang bisa mengekstrak informasi yang tidak ada: kalau
`I(Y;D|RGB) ≈ 0`, maka risiko Bayes model RGB-D sama dengan model RGB, dan
setiap parameter tambahan hanya menambah error estimasi. Ini menjelaskan
seluruh rangkaian hasil nol RGB-D di kedua volume (E-022, E-027, E-032,
V2-E-005/006, V2-E-009) dengan satu pernyataan, dan memprediksi bahwa
percobaan fusi berikutnya juga akan nol.

**Batas klaim ini — jangan digeneralisasi berlebihan:**
- Berlaku untuk **klasifikasi kematangan** pada dataset ini. Kontribusi depth
  untuk **lokalisasi** (menemukan tandan tertutup) belum diuji terpisah —
  seluruh eksperimen sebelumnya mencampur kedua tugas.
- Berlaku untuk protokol pengambilan data ini: jarak standoff hampir tetap
  (Z per kelas 1,20–1,36 m), depth uint8, 352 pohon. Sensor dengan presisi
  lebih tinggi atau protokol jarak bervariasi bisa memberi hasil berbeda.

---

## V2-E-017 — Lokalisasi (deteksi 1 kelas) sudah mentok di plafon dataset, bukan kurang kapasitas

**Tanggal:** 2026-08-12
**Hipotesis:** AP50 lokalisasi pada 352 pohon masih jauh di bawah yang bisa
dicapai kalau data lebih banyak. Falsifikasi: kalau dataset 953 (9,8x lebih
banyak box latih) mencapai AP50 lokalisasi yang setara, berarti keduanya sudah
menyentuh plafon resep ini dan menambah kapasitas/model tidak akan menolong.
**Dataset & split:** `agnostic352` dan `agnostic953` (label dilipat jadi 1 kelas
"tandan", `scripts/make_agnostic_dataset.py`), split kanonik yang sama dengan
Fase 1-5. Pretraining memakai 846 pohon 953 yang sudah dibersihkan dari
kebocoran (`splits_fase6/pretrain953_*`, irisan nol terverifikasi).
**Metode:** `scripts/train_yolo_4ch_screening.py` (YOLO26l) dan RTDETR untuk
pembanding arsitektur; evaluasi `scripts/eval_detector_agnostic.py`.

**Hasil — training (val split masing-masing):**

| Run | Epoch | best val AP50 | @ep | P | R |
|---|---|---|---|---|---|
| `agn953_pre-2` (pretrain dipotong) | 4 | 0,7604 | 4 | 0,7467 | 0,6976 |
| `agn953_full` (pretrain cosine utuh) | 12 | **0,8101** | 11 | 0,8044 | 0,7279 |
| `agn352_ft` (dari pretrain dipotong) | 50 | **0,7522** | 39 | 0,8105 | 0,6909 |
| `agn352_ft2` (dari pretrain utuh, patience 10) | 11 | 0,6413 | 1 | 0,7015 | 0,6075 |
| `agn352_ft3` (dari pretrain utuh, patience 45) | 60 | 0,7473 | 42 | 0,7620 | 0,6969 |
| `agn352_rtdetr` (RT-DETR-L) | 36 | 0,7157 | 26 | 0,7634 | 0,6504 |

**Hasil — pengukuran plafon, keduanya di split TEST dan bebas kebocoran:**

| Dataset | box latih | AP50 lokalisasi (test) |
|---|---|---|
| SawitMVC 953 (`v2repro`, dilatih pada split 953 yang benar) | 14.859 | **0,7374** |
| SawitMVC-Depth 352 (`agn352_ft`) | 1.517 | **0,7330** |

**Sumber:** `results/fase6_ringkas.json`, `runs/agn*/results.csv`.
**Verdict: CONFIRMED** — selisihnya hanya **0,0044** padahal dataset 953 punya
9,8x lebih banyak box latih. Lokalisasi sudah menyentuh plafon resep ini.
**Konsekuensi:** rencana memperbesar model (`yolo26x`, 59,0jt vs 26,3jt param)
DIBATALKAN sebelum dijalankan — hambatannya bukan kapasitas detektor. Sebagai
akibat lain, **mAP50 di dataset ini tidak mungkin melewati ~0,733**, karena
mAP50 <= AP50 lokalisasi secara definisi. Target 0,80 berada di atas plafon.

---

## V2-E-018 — Pretrain yang lebih baik di 953 TIDAK berpindah ke 352, dan patience bisa membunuh run di puncak palsu

**Tanggal:** 2026-08-12
**Hipotesis:** pretrain 953 yang lebih baik (0,8101 vs 0,7604, +5,0 poin)
menghasilkan finetune 352 yang lebih baik pula.
**Metode:** dua finetune dari pretrain utuh — `agn352_ft2` (patience 10) dan
`agn352_ft3` (patience 45) — dibandingkan dengan `agn352_ft` dari pretrain
yang dipotong.

**Hasil:**
- `agn352_ft2` berhenti di epoch 11 dengan best di **epoch 1** (0,6413).
  Transfer yang kuat membuat epoch 1 mencetak nilai tinggi, itu tercatat sebagai
  "best", lalu patience=10 memicu justru saat kurva sedang mendaki lagi
  (ep9 0,5924 -> ep10 0,6060 -> ep11 0,6063). Pembandingnya, `agn352_ft`, baru
  mencapai puncak di **epoch 39**. Run ini **cacat protokol**, bukan hasil.
- `agn352_ft3` (patience 45, jalan penuh 60 epoch): puncak **0,7473 @ep42**,
  vs `agn352_ft` **0,7522 @ep39**. Perbandingan epoch-per-epoch: ft3 unggul di
  14 dari 31 epoch pertama — pada dasarnya **seri**.

**Verdict: FALSIFIED** — keunggulan +5,0 poin pada domain 953 tidak berpindah
ke 352. Masuk akal: dua kamera berbeda (960x1280 HP vs 1280x800 Orbbec) dan
kepadatan objek berbeda (4,64 vs 1,55 per citra).
**Pelajaran protokol:** memotong jadwal cosine di tengah berbeda dari
early-stop saat plateau — `agn953_pre-2` yang dihentikan di epoch 4 dari 25
kehilangan seluruh fase anneal (LR masih di puncak 0,00193), dan pretrain utuh
menaikkannya +5,0 poin. Sebaliknya, patience yang terlalu ketat pada finetune
ber-transfer kuat bisa membunuh run sebelum kurva sebenarnya dimulai.

---

## V2-E-019 — WBF antar-detektor dan sweep konfigurasi inference menaikkan lokalisasi tanpa training tambahan

**Tanggal:** 2026-08-12
**Hipotesis:** menggabungkan beberapa detektor dan menyetel konfigurasi
inference menaikkan AP50 lokalisasi di atas detektor tunggal terbaik.
**Metode:** `scripts/pilih_detektor.py` (WBF, seluruh kombinasi) dan
`scripts/sweep_inferensi.py` (imgsz x NMS IoU). **Pemilihan dilakukan di split
val**, tidak pernah di test.

**Hasil (AP50 val):**

| Kombinasi | AP50 |
|---|---|
| **`agn352_ft` + `agn352_ft3` (WBF)** | **0,7577** |
| `agn352_ft` + `agn352_ft3` + `agn352_rtdetr` | 0,7443 |
| `agn352_ft` sendiri | 0,7370 |
| `agn352_ft3` sendiri | 0,7250 |
| `agn352_rtdetr` sendiri | 0,7135 |

Sweep memilih **imgsz 1280, NMS IoU 0,5** (bukan 0,7 default).
TTA deteksi (`augment=True`) diuji dan memberi **nol** perubahan — diabaikan
ultralytics untuk YOLO26.

**Verdict: CONFIRMED** — +2,1 poin dari 0,7370 ke 0,7577, tanpa training.
**Catatan penting:** `agn352_ft3` **kalah** sendirian (0,7250 vs 0,7370) tapi
gabungannya **melampaui keduanya**. Menambah RT-DETR justru menurunkan. Jadi
nilai sebuah model dalam ensemble tidak bisa dinilai dari performa tunggalnya.

---

## V2-E-020 — Pipeline dua-tahap mencapai mAP50 0,4500, setara model terbaik proyek

**Tanggal:** 2026-08-12
**Hipotesis:** memisahkan lokalisasi (detektor 1 kelas) dari klasifikasi
kematangan (classifier crop) menghasilkan mAP50 lebih tinggi daripada detektor
4-kelas satu-tahap.
**Dataset & split:** test 352 (410 box), sama persis dengan Fase 1-5.
**Metode:** `scripts/eval_twostage.py` — kelas + confidence tahap-2 ditempel ke
box tahap-1, skor = `conf_det x P(kelas)`, **multi-kelas** (tiap box memancarkan
4 deteksi), TTA 8 arah, ensemble classifier.

**Hasil:**

| Versi | Classifier | mAP50 | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|---|
| v1 | 6 | 0,4192 | 0,7188 | 0,4474 | 0,2734 | 0,2375 |
| v2 | 6 | 0,4395 | 0,7314 | 0,4689 | 0,3138 | 0,2440 |
| v3 | 3 (gabungan) | 0,4102 | 0,7358 | 0,4658 | 0,2681 | 0,1713 |
| **v4** | **9 (semua)** | **0,4500** | 0,7366 | 0,4683 | **0,3212** | **0,2738** |

Pembanding Fase 1-5 (test 352 yang sama):

| Model | mAP50 |
|---|---|
| YOLO26l RGB | 0,3711 |
| YOLO26l RGB+D `inverse` | 0,3919 |
| YOLO26l RGB+D `edge` | 0,4316 |
| RT-DETR-L RGB | 0,4343 |
| **Dua-tahap v4** | **0,4500** |
| RF-DETR-L RGB (rekor) | 0,4544 |

**Verdict: CONFIRMED terhadap satu-tahap YOLO26l** (+0,0789 absolut, +21,3%
relatif dari 0,3711), dan melampaui `edge` serta RT-DETR-L. **Belum melampaui
RF-DETR-L** — selisih 0,0044.
**Catatan:** dua-tahap unggul di B3 (0,3212 vs 0,2641 RT-DETR-L) dan B4
(0,2738 vs 0,2661 RF-DETR-L) — dua kelas yang paling langka.
**Rasio panen:** 0,4500 / 0,7330 = 0,614 dari plafon lokalisasi. Model lama
0,3711 / 0,6677 = 0,556. Jadi perbaikan datang dari KEDUA faktor.

---

## V2-E-021 — Training gabungan 953+352 menurunkan mAP50 tapi menaikkan counting

**Tanggal:** 2026-08-12
**Hipotesis:** melatih classifier pada gabungan crop 953+352 (B3: 215 -> 8.780,
B4: 98 -> 3.013) mengalahkan skema pretrain-lalu-finetune, karena tahap akhir
skema lama hanya melihat 215 crop B3 dan 98 B4 sehingga menghapus pengetahuan
kelas langka.
**Metode:** `--tahap gabung` di `scripts/train_crop_classifier.py`, 3 seed,
`convnext_small` @176; evaluasi tetap di val/test 352.

**Hasil (akurasi crop GT, rata-rata 3 seed):**

| Skema | val | test | test macro-F1 |
|---|---|---|---|
| `ftS` pretrain->finetune | 0,6729 | **0,6837** | 0,6105 |
| `ftJ` + jitter mask | 0,6900 | 0,6829 | 0,6065 |
| `ftG` gabungan | **0,6953** | 0,6724 | 0,5318 |

**Hasil hilir (test 352):**

| Konfigurasi | mAP50 | Counting Class ±1 |
|---|---|---|
| v2 (6 classifier lama) | 0,4395 | 86,82% |
| v3 (3 classifier gabungan) | **0,4102** | **88,18%** |
| v4 (9 classifier semua) | **0,4500** | 85,91% |

**Verdict: FALSIFIED untuk mAP50, CONFIRMED untuk counting.**
Gabungan menang di val tapi kalah di test — pola overfit ke domain yang salah:
dari 18.059 crop latih, **92% berasal dari 953** (kamera berbeda). Sampling
menyeimbangkan KELAS tapi tidak menyeimbangkan DOMAIN.

**Divergensi metrik yang penting dicatat:** konfigurasi terbaik untuk mAP50
(v4, 0,4500) BUKAN yang terbaik untuk counting (v3, 88,18%). Ini konsisten
secara matematis: mAP hanya peduli **urutan** deteksi di dalam tiap kelas,
sementara counting memakai **argmax** dan karenanya sensitif terhadap
kalibrasi prior kelas. Menyetel satu metrik bisa mengorbankan yang lain —
mis. NMS IoU 0,5 hasil sweep menaikkan mAP50 tapi menurunkan counting
(85,45% -> 83,18% pada v1).

**Sumber:** `results/fase6_ringkas.json`, `results/twostage_final*.json`,
`results/counting_twostage.json`, `runs_fase6/ft{S,J,G}_*/hasil.json`.

---

## V2-E-022 — Dataset 953 dan 352 adalah dua sesi akuisisi terpisah ~80 hari, bukan dua "view" pohon yang sama

**Tanggal:** 2026-08-12
**Hipotesis yang diuji (asumsi implisit seluruh Volume 2):** karena 352 pohon
DAMIMAS memakai tree ID yang sama di kedua dataset, keduanya adalah pohon yang
sama — satu direkam dengan depth, satu tanpa — sehingga 953 sah dipakai sebagai
korpus pretraining untuk 352.
**Metode:** `scripts/probe_pergeseran_temporal.py` — read-only, membandingkan
label kedua dataset pada citra ber-ID sama, dan membaca tanggal akuisisi dari
sidecar JSON 953 serta `MERGE_VERIFICATION.json` 352.

**Hasil — 1.408 citra ber-ID sama, dua himpunan label:**

| Sumber label | Total kotak | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|
| SawitMVC-YOLO (953) | 6.523 | 566 (8,7%) | 1.098 (16,8%) | **3.604 (55,3%)** | 1.255 (19,2%) |
| SawitMVC-Depth (352) | 2.299 | 829 (36,1%) | 1.001 (43,5%) | **321 (14,0%)** | 148 (6,4%) |

Rasio jumlah kotak 2,84x; B3 **11,2x**; B4 **8,5x**.

**Hasil — tanggal akuisisi:**

| Dataset | Akuisisi |
|---|---|
| SawitMVC-YOLO (953) | 30 April – 16 Mei 2026 |
| SawitMVC-Depth (352) | 28 – 29 Juli 2026 |

Jeda **~80 hari**. Rotasi panen sawit 7–15 hari, jadi ada 5–11 putaran panen di
antara kedua sesi. Citranya sendiri juga bukan berkas yang sama (953 potret
960x1280, 352 lanskap 1280x800).

**Sumber:** `results/pergeseran_temporal.json`.
**Verdict: asumsi FALSIFIED.** Tandan yang difoto Mei bukan tandan yang difoto
Juli. Kohort B3 yang dominan pada Mei sudah matang menjadi B1/B2 pada Juli, dan
sebagian sudah dipanen — konsisten dengan turunnya total kotak 6.523 ke 2.299
dan bergesernya distribusi dari 55% B3 menjadi 80% B1+B2.

**Koreksi terhadap V2-E-012.** Angka "B3 34x lebih langka di dataset 352" benar,
tetapi sebabnya salah. Itu bukan artefak dataset yang lebih kecil, melainkan
fase kematangan kebun yang berbeda **pada pohon yang sama**. Perbandingan
lintas-dataset 953-vs-352 tidak sah bukan hanya karena ketimpangan kelas, tapi
karena keduanya mengukur populasi buah yang berbeda.

**Konsekuensi untuk seluruh Fase 6.** Rangkaian pretrain 953 → finetune 352
bukan transfer di dalam satu domain, melainkan transfer melintasi pergeseran
domain temporal dengan distribusi kematangan nyaris terbalik. Ini menjelaskan
tiga hal yang sebelumnya tidak terjelaskan:

1. Recall B3 classifier hanya 0,254 dengan 36 dari 63 bocor ke B2, meskipun B3
   adalah kelas terbanyak dalam training gabungan (8.780 dari 18.059 crop).
2. `ftG` (training gabungan) mencatat val tertinggi tapi test terendah — bobot
   953 yang 8x lebih besar mendominasi prior yang salah untuk domain target.
3. Empat skema classifier (ftS/ftJ/ftG/ftH) tidak terbedakan satu sama lain:
   semuanya melawan celah domain yang sama, dan celah itu ada di data.

**Implikasi utama — mengapa detektor dan classifier timpang.** Label lokalisasi
("ada tandan di sini") bertahan melintasi jeda 80 hari karena posisi tandan di
kanopi relatif stabil. Label kematangan ("ini B3") tidak bertahan karena benda
fisiknya berubah. Itulah sebabnya AP50 class-agnostic mencapai 0,7330 sementara
mAP50 class-aware berhenti di ~0,45. Ketimpangan itu sifat pasangan data yang
dipakai, bukan cacat arsitektur.

---

## V2-E-023 — Split test 352 tidak punya daya statistik untuk membedakan konfigurasi Fase 6

**Tanggal:** 2026-08-12
**Hipotesis:** urutan konfigurasi Fase 6 berdasarkan titik estimasi mAP50
(0,4102 → 0,4192 → 0,4395 → 0,4500 → 0,4544) mencerminkan perbedaan nyata.
**Metode:** `scripts/bootstrap_map.py` — resampling pada tingkat CITRA (bukan
kotak), 500 ulangan, seed 42; selisih antar-sumber dihitung **berpasangan**
(sampel citra yang sama untuk kedua model) supaya korelasi antar-model tidak
menggelembungkan selang.

**Hasil (split test 352: 220 citra, 410 kotak GT):**

| Sumber | mAP50 | CI 95% | Lebar |
|---|---|---|---|
| YOLO26l-RGBD `edge` | 0,4270 | [0,3771; 0,4938] | **0,1167** |
| YOLO26l-RGB | 0,3677 | [0,3286; 0,4417] | **0,1130** |

Selisih berpasangan `edge` − RGB: **+0,0593**, CI 95% **[−0,0013; +0,1168]**,
P(Δ>0) = 0,972 → **tidak signifikan**, selang masih memuat nol.

**Sumber:** `results/bootstrap_map_awal.json`.
**Verdict: hipotesis FALSIFIED.** Lebar CI ~0,117 sementara jarak antara
dua-tahap terbaik (0,4500) dan rekor proyek RF-DETR-L (0,4544) hanya **0,0044**
— **26x lebih kecil dari lebar selangnya**. Seluruh urutan konfigurasi Fase 6
jatuh di dalam satu selang kepercayaan yang sama dan tidak terbedakan.

**Kegagalan metodologis yang diakui.** V2-E-011 (Fase 5) memakai bootstrap CI
dan berani menyimpulkan INCONCLUSIVE. Fase 6 meninggalkan praktik itu dan
mengurutkan konfigurasi berdasarkan titik estimasi selama enam versi
rekomposisi (v1–v6) serta empat skema classifier (12 training). Bukti bahwa
selisih-selisih itu derau sebenarnya sudah tersedia lebih awal: sebaran
akurasi test antar-seed (0,6512–0,7049) lebih lebar daripada sebaran
antar-metode (0,6707–0,6837).

**Konsekuensi.** Angka Fase 6 hanya boleh dilaporkan dengan selangnya. Setiap
pekerjaan lanjutan pada dataset ini harus menghitung daya statistik lebih dulu:
dengan 410 kotak GT, efek di bawah ~0,10 mAP50 tidak terdeteksi.

---

## V2-E-024 — Depth menaikkan LOKALISASI dan menembus plafon yang diklaim V2-E-017, tapi belum signifikan di split ini

**Tanggal:** 2026-08-12
**Hipotesis:** kanal depth menaikkan AP50 **lokalisasi** (deteksi 1 kelas).
Ini satu-satunya perbandingan RGB vs RGB+D pada proyek ini yang **tidak bisa
dikotori pergeseran temporal** (V2-E-022), karena class-agnostic membuang label
kematangan sepenuhnya dan menyisakan hanya "ada tandan atau tidak" — label yang
bertahan melintasi jeda 80 hari karena posisi tandan di kanopi relatif stabil.

**Rancangan berpasangan.** Resep, inisialisasi (`agn953_full`), seed (42),
jadwal (60 epoch, patience 45, cosine), resolusi (1280), dan batch (4)
**identik**. Satu-satunya yang berbeda: jumlah kanal masukan. Kanal ke-4 memakai
encoding `edge` (Sobel gradien depth), pemenang screening V2-E-008/010 —
diverifikasi identik dengan `SawitMVC-Depth-4ch-edge`. Bobot stem diinflasi
3→4 kanal (1092/1092 item tertransfer, terverifikasi sebelum run).

**Hasil — training (val):**

| Run | Kanal | best val AP50 | @ep | Durasi |
|---|---|---|---|---|
| `agn352_4ch` | 4 (RGB + `edge`) | **0,7893** | 33 | 165 mnt |
| `agn352_ft3` | 3 (RGB) | 0,7473 | 42 | 168 mnt |

`agn352_4ch` unggul di 21 dari 26 epoch pertama dan menyamai puncak
seumur-hidup kontrol RGB pada epoch 26.

**Hasil — split TEST, AP50 lokasi murni, dengan CI bootstrap berpasangan
(1.000 ulangan, resampling tingkat citra, seed 42):**

| Model | AP50 test | CI 95% | Lebar | n prediksi |
|---|---|---|---|---|
| `agn352_4ch` (RGB+D) | **0,7636** | [0,7144; 0,8123] | 0,0979 | 1.660 |
| `agn352_ft3` (RGB) | 0,7358 | [0,6820; 0,7917] | 0,1097 | 1.226 |

Selisih berpasangan: **+0,0278**, CI 95% **[−0,0121; +0,0648]**,
P(Δ>0) = **0,921** → **belum signifikan pada taraf 95%**.

**Sumber:** `results/bootstrap_lokalisasi.json`,
`results/pred_agn4ch_test.npz`, `results/pred_agnrgb_test.npz`,
`runs/agn352_4ch/results.csv`.

**Verdict: POSITIF TAPI BELUM KONKLUSIF.** Arah efeknya konsisten di val
(+0,0420) dan test (+0,0278), dan ini sinyal positif terkuat untuk depth di
seluruh Volume 2 — satu-satunya yang muncul dari perbandingan yang benar-benar
bersih. Tetapi selangnya masih memuat nol.

**Ketidaksignifikanan di sini TIDAK boleh dibaca sebagai "tidak ada efek".**
V2-E-023 sudah menetapkan bahwa split test ini tidak mampu memisahkan efek di
bawah ~0,10. Efek terukur 0,0278 berada jauh di bawah ambang itu, jadi hasil
"tidak signifikan" memang sudah bisa diramalkan sebelum eksperimen dijalankan
dan tidak membawa informasi tentang ada-tidaknya efek. Yang kurang adalah data,
bukan efeknya.

**Koreksi terhadap V2-E-017.** Entri itu menyimpulkan "mAP50 di dataset ini
tidak mungkin melewati ~0,733" karena AP50 lokalisasi test-352 (0,7330) praktis
sama dengan test-953 (0,7374) meski 953 punya 9,8× lebih banyak kotak latih.
Kesimpulan itu benar **sebagai pernyataan tentang masukan RGB**, tapi ditulis
seolah berlaku umum untuk dataset. Dengan kanal depth, titik estimasi lokalisasi
mencapai **0,7636** — di atas kedua angka tersebut. Plafon itu ternyata sifat
dari **modalitas masukan**, bukan sifat dataset. Perlu ditegaskan: 0,7636 masih
di dalam CI 0,7330, jadi ini pembalikan **titik estimasi**, bukan pembalikan
yang terbukti signifikan.

**Konsekuensi.** Ini menajamkan rekomendasi §10 laporan. Depth tampaknya
menolong di tempat yang persis diprediksi teori V2-E-022 — lokalisasi, bukan
kematangan. Akuisisi berikutnya sebaiknya dirancang untuk menguji **itu**,
dengan test split ≈4.000 kotak supaya efek berukuran 0,03 bisa dipisahkan.

---

## V2-E-025 — Angka test class-agnostic untuk `agn953_full`, dan besarnya efek kontaminasi pretraining

**Tanggal:** 2026-08-12
**Lubang yang ditutup:** `agn953_full` selama ini hanya punya AP50 **val**
(0,8101). `make_agnostic_dataset.py` memang hanya membuat split train+val untuk
`agnostic953` (baris `p953 = {"train": [], "val": []}`), sehingga angka test-nya
tidak pernah ada. Angka "test-953 = 0,7374" yang sempat dikutip berasal dari
model **berbeda** — detektor class-aware `v2repro` yang prediksinya dilipat jadi
satu kelas.
**Metode:** `scripts/buat_test_953_bersih.py`. Karena `pretrain953_images.txt`
mengambil semua 846 pohon bebas-bocor tanpa menghormati split kanonik 953, dari
141 pohon test kanonik hanya **19 pohon (76 citra, 316 kotak)** yang benar-benar
tak tersentuh training. Dua set dilaporkan supaya efek kontaminasi terlihat,
bukan disembunyikan.

**Hasil:**

| Set evaluasi | Pohon | Citra | Kotak | AP50 agnostik |
|---|---|---|---|---|
| **test bersih** (tak tersentuh) | 19 | 76 | 316 | **0,7702** |
| test penuh (122/141 pohon terpakai saat training) | 141 | 588 | 2.612 | 0,8090 |
| val (pembanding, dilaporkan selama ini) | — | 364 | — | 0,8101 |

**Sumber:** `results/pred_agn953_bersih.npz`, `results/pred_agn953_penuh.npz`,
`results/test953_bersih.json`.
**Verdict:** angka yang sah untuk `agn953_full` adalah **0,7702**, bukan 0,8101.
Selisih 0,0388 antara set bersih dan set penuh adalah besarnya optimisme akibat
kontaminasi — dan angka val (0,8101) hampir identik dengan set terkontaminasi
(0,8090), persis seperti yang diharapkan kalau keduanya berbagi pohon dengan
training.
**Peringatan:** set bersih hanya 316 kotak, jadi CI-nya lebih lebar lagi
daripada split test 352 (yang sudah ±0,058 pada 410 kotak). Angka 0,7702 harus
dibaca sebagai indikasi, bukan pengukuran presisi.

---

## V2-E-026 — CI untuk angka utama Fase 6: dua-tahap 0,4500 tidak terbedakan dari pembandingnya

**Tanggal:** 2026-08-12
**Metode:** konfigurasi v4 dijalankan ulang di test (9 classifier, WBF
`agn352_ft`+`agn352_ft3`, imgsz 1280, NMS IoU 0,5, TTA, multi-kelas) dengan dump
prediksi, lalu bootstrap 1.000 ulangan berpasangan.

**Hasil:** reproduksi persis — mAP50 = **0,44999** vs 0,4500 yang dilaporkan
V2-E-020, per kelas identik (B1 0,7366 / B2 0,4683 / B3 0,3212 / B4 0,2738).

| Model | mAP50 | CI 95% | Lebar |
|---|---|---|---|
| Dua-tahap v4 | 0,4500 | [0,4054; 0,5188] | 0,1133 |
| YOLO26l-RGBD `edge` | 0,4270 | [0,3836; 0,4984] | 0,1148 |

Selisih berpasangan: **+0,0230**, CI 95% **[−0,0286; +0,0663]**, P(Δ>0) = 0,789
→ **tidak signifikan**.

**Sumber:** `results/bootstrap_map.json`, `results/twostage_v4_ulang.json`.
**Verdict:** menegaskan V2-E-023. Angka utama Fase 6 tidak terbedakan dari
detektor satu-tahap yang jauh lebih sederhana, apalagi dari RF-DETR-L (0,4544)
yang bahkan lebih tinggi titik estimasinya. Seluruh kerja rekomposisi enam versi
tidak menghasilkan perbedaan yang bisa dibuktikan pada split ini.

---

## V2-E-027 — Monocular-depth sebagai kanal ke-4 pada SawitMVC 953: turun −0,0475 mAP50 di test

**Tanggal:** 2026-08-15
**Hipotesis:** peta monocular-depth (`yolo26l-depth.pt`, ukuran L) yang
ditambahkan sebagai kanal ke-4 lewat early fusion menaikkan deteksi kelas-sadar
pada SawitMVC 953 dibandingkan RGB murni. Ini sel 6 dari matriks
mono-depth; satu-satunya sel yang punya daya statistik memadai (test 2.612
kotak, bukan 410) dan bebas pergeseran temporal 80 hari.

**Data:** `/workspace/d953_rgbmono` — TIFF 4 kanal `[B,G,R,mono]`, dibangun
`scripts/buat_dataset_nch.py --dataset 953 --kanal mono`. Kanal mono = PNG uint8
inverse-depth pada `[z_near, z_far] = [0,8; 15,0] m`, di-encode dengan
`encode_inverse()` yang sama persis dengan kanal depth sensor (diimpor dari
Research-Pipeline, bukan ditulis ulang). Split kanonik 716/96/141 pohon =
3.000/404/588 citra, 14.041/1.887/**2.612** kotak.

**Resep:** identik dengan sel 5 (`yolo26l_e60_i1280_v2repro`) — `yolo26l.pt`
COCO init, imgsz 1280, batch 4, seed 42, `cos_lr`, `close_mosaic` 10,
optimizer auto, lr0 0,01. Stem di-inflate 3 -> 4 kanal oleh ultralytics.

### Metrik training (val split, 404 citra, evaluator native ultralytics)

| | nilai | epoch |
|---|---|---|
| val mAP50 terbaik | **0,5012** | ep17 |
| val mAP50-95 terbaik | 0,2295 | ep23 |
| val terakhir (ep31) | 0,4870 / 0,2231 | ep31 |

Perbandingan val-lawan-val dengan sel 5 pada epoch yang sama (kurva sel 5
dipulihkan dari kunci `train_results` di dalam `best.pt`, disimpan ke
`results/val_curve_sel5_953_rgb_v2repro.csv`):

| ep | sel 6 RGB+Mono | sel 5 RGB | selisih |
|---|---|---|---|
| 7 | 0,4612 | 0,4407 | +0,0205 |
| 17 | 0,5012 | 0,5003 | +0,0009 |
| 24 | 0,4738 | 0,5181 | −0,0444 |
| 28 | 0,4760 | 0,5219 | −0,0459 |
| 31 | 0,4870 | 0,5195 | −0,0325 |

Sel 6 tertinggal di 21 dari 31 epoch, dan di **setiap** epoch sejak ep18. Puncak
sel 5 sendiri 0,5373 @ep34. **Peringatan:** kurva val sel 6 di atas dihitung
atas 394 citra, bukan 404 — 10 citra val korup dan dilewati diam-diam oleh
ultralytics (lihat V2-E-028). Baris "selisih" di atas karena itu tidak
sepenuhnya sebanding dan tidak boleh dikutip sebagai angka; ia hanya
menunjukkan arah.

### Metrik test (pycocotools, 588 citra, 2.612 kotak GT — setelah perbaikan citra korup)

| | sel 6 RGB+Mono | sel 5 RGB | selisih |
|---|---|---|---|
| **mAP50** | **0,4960** | **0,5436** | **−0,0475** |
| mAP50-95 | 0,2322 | 0,2565 | −0,0243 |
| AP75 | 0,186 | — | — |

Per kelas AP50:

| Kelas | sel 6 | sel 5 | selisih |
|---|---|---|---|
| B1 | 0,6902 | 0,7708 | −0,0806 |
| B2 | 0,4097 | 0,4479 | −0,0382 |
| B3 | 0,5635 | 0,6051 | −0,0416 |
| B4 | 0,3206 | 0,3506 | −0,0300 |

Turun di **keempat** kelas, terbesar di B1. AP per ukuran objek (sel 6):
small 0,017 / medium 0,134 / large 0,270; AR@100 = 0,527.

### Batas yang melekat pada angka ini

1. **Dihentikan di 31 dari 60 epoch** atas keputusan pengguna, setelah kurva val
   konsisten tertinggal. `best.pt` = checkpoint ep17; `last.pt` = ep31, masih
   bisa di-resume. Sel 5 dilatih 60 epoch penuh dan puncaknya jatuh di ep34,
   **di luar jangkauan** run ini. Perbandingan ini karena itu **timpang dan
   condong menguntungkan sel 5**: cukup untuk menyimpulkan "mono tidak memberi
   keunggulan yang terlihat", tidak cukup untuk mengukur besar kerugiannya
   secara adil.
2. Satu seed. Tidak ada replikasi.
3. Training berjalan di atas 2.999 dari 3.000 citra train (satu korup).
4. CI bootstrap berpasangan sedang dihitung; hasilnya menyusul di entri
   terpisah. Sebelum itu, selisih −0,0475 belum boleh disebut signifikan.

**Sumber:** `results/eval_sel6_953_rgbmono_test.json`,
`results/pred_sel6_953_rgbmono_test.npz`, `runs/sel6_953_rgbmono/results.csv`,
`runs/sel6_953_rgbmono/DIHENTIKAN_LEBIH_AWAL`,
`results/val_curve_sel5_953_rgb_v2repro.csv`, `results/eval_sel5_953_rgb_test.json`.

**Verdict:** hipotesis **tidak didukung**. Menambahkan monocular-depth sebagai
kanal ke-4 menurunkan mAP50 sebesar 0,0475 di test, konsisten di keempat kelas,
dan konsisten pula dengan catatan lama repo ini bahwa early fusion depth adalah
regresi (E-022, E-027 Volume 1: −0,0230 pada YOLO26n). Yang **belum** bisa
dipisahkan: apakah kerugian ini berasal dari isi peta mono, atau semata dari
biaya menambah kanal pada stem yang bobot COCO-nya 3 kanal. Kontrol M_shuf
lintas-pohon adalah uji yang memisahkan keduanya dan tetap layak dijalankan
meski arahnya negatif.

---

## V2-E-028 — 39 citra TIFF korup di dataset turunan, dilewati diam-diam oleh ultralytics

**Tanggal:** 2026-08-15
**Bukan hipotesis** — catatan cacat data yang memengaruhi cara membaca V2-E-027.

**Temuan:** eval sel 6 gagal dengan `gagal membaca ...tiff`. Berkasnya ada dan
berukuran 8,5 MB tapi tidak bisa didekode oleh `cv2.imread`, pembaca
ultralytics, maupun `cv2.imdecodemulti`. Pemindaian penuh
(`scripts/perbaiki_tiff_korup.py`) menemukan 39 berkas korup:

| Dataset | split | total | korup |
|---|---|---|---|
| d953_rgbmono | train | 3.000 | 1 |
| d953_rgbmono | **val** | 404 | **10** |
| d953_rgbmono | test | 588 | 22 |
| d352_rgbmono | train | 980 | 6 |
| d352_rgbmono | val / test | 208 / 220 | 0 |
| d352_rgbedgemono (5 kanal) | semua | 1.408 | 0 |

Dua tanda tangan galat: `TIFFReadRGBAStrip` gagal (data terpotong) dan
`TIFFGetField PHOTOMETRIC` gagal (header rusak) — keduanya khas penulisan yang
terputus. Menariknya berkas 5 kanal yang ditulis `cv2.imwritemulti` justru
bersih seluruhnya; yang rusak hanya yang ditulis `cv2.imwrite`.

**Kenapa ini berbahaya, dan ini pelajaran utamanya:** ultralytics **melewati**
citra korup dengan peringatan lalu tetap menyelesaikan training. Tidak ada
kegagalan, tidak ada jejak di metrik akhir. Akibat konkretnya, metrik val sel 6
selama 31 epoch dihitung atas **394 citra** sementara baseline sel 5 dihitung
atas **404** — perbandingan yang tampak sah sepanjang malam sebenarnya
dilakukan di atas himpunan data yang berbeda. Cacat semacam ini tidak akan
pernah terlihat dari angkanya sendiri.

**Tindakan:** berkas korup dihapus (citra turunan, regenerable dalam hitungan
menit; ATURAN #1 diperiksa — nol `.pt`/`.pth`/`.ckpt` di sasaran), dibangun
ulang dengan `buat_dataset_nch.py`, cache label dibuang supaya ultralytics
memindai ulang. Verifikasi setelahnya: **0 korup** di ketiga dataset, jumlah
kanal terkonfirmasi 4/4/5, jumlah kotak kembali ke angka kanonik (test 953 =
2.612, test 352 = 410). Eval test sel 6 di V2-E-027 dijalankan **setelah**
perbaikan ini, jadi angka test-nya sah; yang tidak sepenuhnya sah hanya kurva
val-nya.

**Sumber:** `scripts/perbaiki_tiff_korup.py`, `results/tiff_korup.json`,
`results/tiff_korup_setelah_perbaikan.json`.

**Aturan yang lahir dari sini:** setiap dataset turunan diperiksa
keterbacaannya sebelum dipakai melatih, bukan sesudah. Satu pemindaian penuh
memakan ~3 menit; kalau dilewati, biayanya adalah seluruh run tidak bisa
dibandingkan dan baru ketahuan berjam-jam kemudian.

---

## V2-E-029 — CI berpasangan sel 6 vs sel 5: penurunan −0,0476 mAP50 SIGNIFIKAN

**Tanggal:** 2026-08-15
**Metode:** bootstrap berpasangan 2.000 ulangan atas citra test (seed 42), dari
dump prediksi yang disimpan saat evaluasi — `pred_sel6_953_rgbmono_test.npz` dan
`pred_sel5_953_rgb_test.npz`. GT diambil dari dataset asli
`/workspace/SawitMVC-YOLO` supaya kedua lengan dibandingkan terhadap sumber yang
sama. 588 citra, 2.612 kotak.

| Model | mAP50 | CI 95% | Lebar |
|---|---|---|---|
| Sel 6 — RGB+Mono (4 kanal) | 0,4960 | [0,4729; 0,5225] | 0,0496 |
| Sel 5 — RGB (3 kanal) | 0,5436 | [0,5206; 0,5712] | 0,0506 |

**Selisih berpasangan: −0,0476, CI 95% [−0,0671; −0,0274], P(Δ>0) = 0,000
→ SIGNIFIKAN pada 95%.**

CI selisih tidak memuat nol, dan tidak satu pun dari 2.000 ulangan menghasilkan
Δ positif. Lebar CI 0,0496 sesuai perkiraan daya statistik untuk 2.612 kotak
(bandingkan split 352 dengan 410 kotak, lebar CI ~0,11 — di sana selisih sebesar
ini tidak akan bisa dibedakan dari nol).

**Sumber:** `results/boot_sel6_vs_sel5.json`.

**Verdict:** ini hasil negatif yang **tegas**, bukan sekadar tidak terbukti.
Menambahkan monocular-depth sebagai kanal ke-4 pada SawitMVC 953 menurunkan
mAP50 secara signifikan. Perlu diingat run sel 6 berhenti di 31 dari 60 epoch
(V2-E-027 butir 1), sehingga besar penurunannya kemungkinan dilebih-lebihkan —
tapi arahnya tidak diragukan, dan konsisten di keempat kelas serta di seluruh
2.000 ulangan bootstrap. Menjalankan sel 6 sampai 60 epoch bisa memperkecil
angkanya, tidak masuk akal membalikkan tandanya.

Konsisten dengan catatan lama repo: early fusion depth adalah regresi (E-022,
E-027 Volume 1, −0,0230 pada YOLO26n). Yang masih terbuka: apakah kerugian
berasal dari isi peta mono atau dari biaya menambah kanal pada stem COCO
3-kanal. M_shuf lintas-pohon memisahkan keduanya.

---

## V2-E-030 — Sel 3 (352 RGB+Mono): naik +0,0266 atas RGB tapi tidak signifikan, dan urutan val terbalik dari test

**Tanggal:** 2026-08-15
**Hipotesis:** monocular-depth sebagai kanal ke-4 menaikkan deteksi kelas-sadar
pada SawitMVC-Depth 352, dataset yang sama tempat depth sensor terbukti menang.

**Data:** `/workspace/d352_rgbmono`, TIFF 4 kanal `[B,G,R,mono]`, split kanonik
`canonical_70_15_15` = 980/208/220 citra, 1.517/372/**410** kotak. Resep identik
dengan sel 1 dan sel 2.

**Training:** dihentikan atas keputusan pengguna di **54 dari 60 epoch** setelah
plateau terkonfirmasi. `best.pt` = ep41 (val mAP50 0,3888). Biaya
komparabilitasnya kecil — pembandingnya juga checkpoint tengah (sel 1 @ep45,
sel 2 @ep38) dan tujuh epoch yang dilewatkan seluruhnya di fase `close_mosaic`
yang menurunkan val di ketiga run. Detail: `runs/sel3_352_rgbmono/DIHENTIKAN_LEBIH_AWAL`.

### Val vs test — urutannya TERBALIK, untuk ketiga sel

| Sel | Input | ch | val puncak | test mAP50 |
|---|---|---|---|---|
| 1 | RGB | 3 | **0,4111** @ep45 | 0,3677 |
| 3 | RGB+Mono | 4 | 0,3888 @ep41 | 0,3943 |
| 2 | RGB+Depth `edge` | 4 | 0,3856 @ep38 | **0,4270** |

Peringkat val (1 > 3 > 2) adalah **kebalikan persis** peringkat test (2 > 3 > 1).
Ini pengulangan kedua dari pembalikan yang sudah terlihat pada sel 2 di V2-E-005
dan sekarang terbukti berlaku untuk seluruh trio. Val 352 hanya 208 citra;
**val split ini tidak boleh dipakai memeringkat model.** Bandingkan 953, di mana
val 404 citra dan urutannya sejalan dengan test (sel 5 val 0,5373 -> test 0,5436;
sel 6 val 0,5012 -> test 0,4960).

### Test (pycocotools, 220 citra, 410 kotak)

| | sel 3 RGB+Mono | sel 1 RGB | sel 2 RGB+Depth |
|---|---|---|---|
| mAP50 | **0,3943** | 0,3677 | 0,4270 |
| mAP50-95 | 0,1360 | — | — |

Per kelas AP50 sel 3: B1 0,7232 / B2 0,4698 / B3 0,2546 / B4 0,1295.

### CI bootstrap berpasangan (2.000 ulangan, seed 42, dari dump .npz)

| Perbandingan | Selisih | CI 95% | P(Δ>0) | Signifikan |
|---|---|---|---|---|
| sel 3 − sel 1 (mono vs RGB) | **+0,0266** | [−0,0270; +0,0739] | 0,830 | **tidak** |
| sel 3 − sel 2 (mono vs depth sensor) | **−0,0327** | [−0,0756; +0,0074] | 0,057 | **tidak** |

Lebar CI 0,099–0,116. Ketidaksignifikanan ini **sudah diperkirakan sebelum
eksperimen dijalankan**: dengan 410 kotak, selisih di bawah ~0,06 memang tidak
bisa dibedakan dari nol. Ini batas daya statistik split-nya, bukan bukti bahwa
efeknya nol.

Catatan angka: titik estimasi sel 1 dan sel 2 di sini (0,3677 dan 0,4270)
dihitung ulang dari `.npz` lewat jalur kode yang sama dengan sel 3, sehingga
perbandingan berpasangannya konsisten secara internal. Angka historis
0,3711/0,4316 berasal dari skrip eval lama; selisihnya ~0,004 dan tidak
mengubah kesimpulan apa pun.

**Sumber:** `results/eval_sel3_352_rgbmono_test.json`,
`results/pred_sel3_352_rgbmono_test.npz`, `results/boot_sel3_vs_sel1.json`,
`results/boot_sel3_vs_sel2.json`, `runs/sel3_352_rgbmono/results.csv`.

**Verdict:** arahnya **berlawanan dengan sel 6**. Di 953 mono menurunkan mAP50
secara signifikan (−0,0476, V2-E-029); di 352 mono justru menaikkannya
(+0,0266), meski tidak signifikan. Mono juga berada di antara RGB dan depth
sensor pada dataset ini — konsisten dengan probe V2-E-0xx yang menemukan mono
mereproduksi relief ordinal B1->B4 yang sama dengan sensor tapi dengan amplitudo
lebih lemah (−4,08 cm vs −5,14 cm).

Penjelasan yang tersisa dan belum diuji: (a) mono berguna pada dataset dengan
citra dekat/terkendali (352, median 1,91 m) tapi merugikan pada citra lapangan
yang lebih beragam (953, median 1,31 m); (b) perbedaannya berasal dari ukuran
data latih (980 vs 3.000 citra); (c) sel 6 dihentikan di 31 epoch sehingga
kerugiannya dilebih-lebihkan. Ketiganya bisa dibedakan, tapi butuh eksperimen
tambahan yang belum dijadwalkan.

---

## V2-E-031 — Sel 4 (352 RGB+Depth+Mono, 5 kanal): mono DI ATAS depth sensor merugikan −0,0504, signifikan

**Tanggal:** 2026-08-15
**Hipotesis:** menambahkan monocular-depth sebagai kanal kelima di atas RGB +
depth sensor menaikkan deteksi dibandingkan RGB+Depth 4 kanal (sel 2). Ini sel
terakhir matriks mono-depth, dan satu-satunya yang tuntas **60 epoch penuh**.

**Data:** `/workspace/d352_rgbedgemono`, TIFF 5 kanal `[B,G,R,edge,mono]`,
disimpan sebagai 5 halaman satu-kanal (`cv2.imwritemulti`) karena `cv2.imwrite`
menolak 5 kanal. Split kanonik 980/208/220 citra, 410 kotak test. Stem model
diverifikasi `(64, 5, 3, 3)`.

**Training:** 60/60 epoch tuntas, batch 4 utuh (nol `Reducing to batch`).
`best.pt` = **ep50**, val mAP50 0,4281.

### Val — sel 4 memuncaki SEMUA sel di 352

| Sel | Input | ch | val puncak | epoch |
|---|---|---|---|---|
| **4** | **RGB+Depth+Mono** | **5** | **0,4281** | **ep50** |
| 1 | RGB | 3 | 0,4111 | ep45 |
| 3 | RGB+Mono | 4 | 0,3888 | ep41 |
| 2 | RGB+Depth `edge` | 4 | 0,3856 | ep38 |

Sel 4 juga satu-satunya dari empat run 352 yang **naik** saat `close_mosaic`
menyala di ep51 — puncaknya justru tercapai di ep50, sementara tiga run lain
melandai turun di fase itu.

### Test (pycocotools, 220 citra, 410 kotak) — urutannya TERBALIK lagi

| Sel | Input | ch | test mAP50 | mAP50-95 |
|---|---|---|---|---|
| 2 | RGB+Depth `edge` | 4 | **0,4270** | — |
| 3 | RGB+Mono | 4 | 0,3943 | 0,1360 |
| **4** | **RGB+Depth+Mono** | **5** | **0,3766** | 0,1290 |
| 1 | RGB | 3 | 0,3677 | — |

Peringkat val (4 > 1 > 3 > 2) kembali hampir kebalikan peringkat test
(2 > 3 > 4 > 1). Ini pembalikan **keempat** berturut-turut di split 352 dan
menutup kasusnya: **val 208 citra tidak boleh dipakai memeringkat model di
dataset ini, titik.** Sel 4 memuncaki val dan tetap kalah dari sel 2 di test.

Per kelas AP50 sel 4: B1 0,7014 / B2 0,4560 / B3 0,2138 / B4 0,1351.

### CI bootstrap berpasangan (2.000 ulangan, seed 42)

| Perbandingan | Selisih | CI 95% | P(Δ>0) | Signifikan |
|---|---|---|---|---|
| sel 4 − sel 2 (mono di atas depth) | **−0,0504** | [−0,1038; −0,0015] | 0,022 | **ya** |
| sel 4 − sel 3 (5 kanal vs 4 kanal mono) | −0,0177 | [−0,0672; +0,0323] | 0,243 | tidak |

Signifikansinya tipis — batas atas CI −0,0015, nyaris menyentuh nol — jadi
sebaiknya dibaca sebagai "bukti cukup kuat untuk menolak bahwa mono membantu di
atas depth", bukan sebagai pengukuran presisi atas besarnya kerugian.

**Sumber:** `results/eval_sel4_352_rgbedgemono_test.json`,
`results/pred_sel4_352_rgbedgemono_test.npz`, `results/boot_sel4_vs_sel2.json`,
`results/boot_sel4_vs_sel3.json`, `results/riwayat_epoch/sel4_*`.

**Verdict:** hipotesis **ditolak**. Mono tidak menambah apa pun di atas depth
sensor; ia mengurangi −0,0504, dan itu signifikan meski di split yang cuma 410
kotak. Kanal kelima bukan cuma sia-sia, ia mengencerkan sinyal yang sudah
dibawa kanal depth.

---

## V2-E-032 — Matriks mono-depth lengkap: mono tidak pernah menang, dan dua kali kalah signifikan

**Tanggal:** 2026-08-15
**Ringkasan enam sel.** Semua memakai resep identik (`yolo26l.pt` COCO init,
60 epoch, batch 4, imgsz 1280, seed 42, `cos_lr`), evaluator pycocotools pada
split test, dump prediksi `.npz` disimpan saat evaluasi.

| # | Dataset | Input | ch | test mAP50 | Epoch dijalankan |
|---|---|---|---|---|---|
| 1 | 352 | RGB | 3 | 0,3677 | 60 |
| 2 | 352 | RGB+Depth `edge` | 4 | **0,4270** | 60 |
| 3 | 352 | RGB+Mono | 4 | 0,3943 | 54 (dihentikan) |
| 4 | 352 | RGB+Depth+Mono | 5 | 0,3766 | 60 |
| 5 | 953 | RGB | 3 | **0,5436** | 60 |
| 6 | 953 | RGB+Mono | 4 | 0,4960 | 31 (dihentikan) |

**Semua perbandingan berpasangan:**

| Perbandingan | Selisih | CI 95% | Signifikan |
|---|---|---|---|
| sel 6 − sel 5 — mono vs RGB, 953 | **−0,0476** | [−0,0671; −0,0274] | **YA** |
| sel 4 − sel 2 — mono di atas depth, 352 | **−0,0504** | [−0,1038; −0,0015] | **YA** |
| sel 3 − sel 2 — mono vs depth, 352 | −0,0327 | [−0,0756; +0,0074] | tidak |
| sel 4 − sel 3 — 5ch vs 4ch mono, 352 | −0,0177 | [−0,0672; +0,0323] | tidak |
| sel 3 − sel 1 — mono vs RGB, 352 | +0,0266 | [−0,0270; +0,0739] | tidak |

**Kesimpulan: monocular-depth tidak pernah menang secara signifikan di satu
pun dari lima perbandingan, dan kalah signifikan di dua.** Satu-satunya selisih
positifnya (+0,0266, sel 3 vs sel 1) tidak signifikan dan lebih kecil daripada
lebar CI-nya sendiri.

**Depth sensor tetap kanal keempat terbaik.** Sel 2 (0,4270) mengungguli sel 3
(0,3943) dan sel 4 (0,3766). Mono mereproduksi struktur yang sama dengan sensor
tapi lebih lemah (Spearman dalam kotak 0,676; relief B1->B4 −4,08 cm vs sensor
−5,14 cm), dan pelemahan itu tampaknya cukup untuk membalik manfaatnya jadi
kerugian.

**Dua batas yang harus ikut dikutip:**

1. **Daya statistik split 352 tidak memadai.** 410 kotak memberi lebar CI
   ~0,10; selisih di bawah ~0,06 memang tidak bisa dibedakan dari nol. Tiga
   dari lima perbandingan di atas berada di zona itu. Hanya sel 6 vs sel 5
   (2.612 kotak, lebar CI 0,050) yang punya daya memadai.
2. **Sel 3 dan sel 6 dihentikan lebih awal** (54 dan 31 dari 60 epoch) atas
   keputusan pengguna setelah kurva val menunjukkan arah yang jelas. Sel 6
   paling terdampak: pembandingnya memuncak di ep34, di luar jangkauan run itu,
   sehingga −0,0476 kemungkinan dilebih-lebihkan. Arahnya tidak diragukan
   (nol dari 2.000 ulangan bootstrap positif), besarannya diragukan.

**Catatan angka sel 1 dan sel 2 — jangan bingung dengan STATUS.md.** Tabel di
atas memakai estimasi titik dari *resampler* bootstrap (0,3677 dan 0,4270),
bukan dari pycocotools (0,3711 dan 0,4316 di STATUS.md / V2-E-010/011).
Selisih ~0,004 itu murni beda implementasi mAP antar-evaluator, bukan model
atau data yang berbeda: keduanya membaca `.npz` prediksi yang sama
(`pred_rgb352_test.npz`, `pred_edge_test.npz`). Semua selisih dan CI di tabel
perbandingan dihitung di dalam satu evaluator yang sama, jadi internal
konsisten — tapi **jangan campur** angka pycocotools dengan angka bootstrap
dalam satu pengurangan.

**Yang belum terjawab, dan sengaja tidak ditebak:** apakah kerugian mono
berasal dari isi petanya atau dari biaya menambah kanal pada stem COCO 3-kanal.
Kontrol M_shuf lintas-pohon memisahkan keduanya dan belum dijalankan.

---

## V2-E-033 — Dua kebocoran split yang membatasi cara membaca angka lama

**Tanggal:** 2026-08-15
**Konteks:** dua temuan sampingan yang muncul saat menelusuri daya statistik
matriks mono-depth. Keduanya **tidak** mengubah satu pun angka yang sudah
tercatat, tapi mengubah cara angka-angka itu boleh dikutip. Diverifikasi
langsung dari berkas split, bukan dari ingatan.

### 1. Pretraining agnostik Fase 6 bocor ke `test_penuh`

Split pretraining `agnostic953` (train 3.200 + val 364 = 3.564 citra,
846 pohon) berpotongan besar dengan split evaluasi `agnostic953_test_penuh`:

| Himpunan uji | Citra | Pohon | Citra bocor | Pohon bocor |
|---|---|---|---|---|
| `test_penuh` | 588 | 141 | **512/588 (87%)** | **122/141 (87%)** |
| `test_bersih` | 76 | 19 | **0/76** | **0/19** |

Jadi 87% citra `test_penuh` **secara harfiah ikut dilatih** saat pretraining
agnostik — bukan cuma pohon yang sama dari sudut lain, tapi berkas citra yang
identik. Angka apa pun dari `test_penuh` untuk model yang melewati pretraining
agnostik adalah angka **train-on-test** dan tidak boleh dikutip sebagai
performa generalisasi.

`test_bersih` (76 citra, 19 pohon) benar-benar bersih dan memang dibuat untuk
alasan ini. Itu satu-satunya himpunan yang sah untuk menilai jalur agnostik —
dengan konsekuensi 19 pohon terlalu sedikit untuk CI yang berguna.

Perbandingan yang dilaporkan di V2-E-0xx Fase 6 memakai `pred_agn953_bersih.npz`
maupun `pred_agn953_penuh.npz`; yang boleh dibaca sebagai hasil hanya yang
`bersih`.

### 2. 44 dari 55 pohon test-352 ada di dalam train-953

Split kanonik 953 (`SawitMVC-YOLO`, train 716 pohon) memuat **44 dari 55
pohon** di split test 352 (`SawitMVC-Depth-YOLO/test`).

Ini **tidak** mencemari matriks mono-depth: keenam sel dilatih dari
`yolo26l.pt` COCO, bukan dari bobot yang pernah melihat 953, jadi sel 1-4
tidak pernah bersinggungan dengan train-953. Yang tercemar adalah **rantai
transfer apa pun yang memakai bobot 953 sebagai inisialisasi untuk model 352** —
di situ 80% pohon test-352 sudah pernah dilihat. Kalau nanti ada eksperimen
finetune 953→352, hasilnya wajib dilaporkan dengan catatan ini, atau memakai
subset 11 pohon yang bersih (yang lagi-lagi terlalu kecil untuk CI).

**Verifikasi:** kedua angka dihitung dengan mencocokkan identitas pohon
(`DAMIMAS_A21B_<id>`, sufiks nomor tampilan dibuang) langsung dari isi
`splits/*.txt` dan direktori `images/`, 2026-08-15.

**Verdict:** tidak ada angka lama yang ditarik, tapi dua pembatas kutipan
ditambahkan: (a) hasil agnostik hanya sah dari `test_bersih`; (b) transfer
953→352 tidak punya split test yang bersih.


===== experiments/STATUS.md =====

# Status Eksperimen

> **Ringkasan akhir proyek ada di [../docs/LAPORAN-AKHIR.md](../docs/LAPORAN-AKHIR.md).**
> Pengumpulan metrik dihentikan 2026-08-12 setelah dua temuan menunjukkan
> pertanyaan RGB-vs-RGB+D tidak bisa dijawab dengan pasangan data ini:
> pergeseran akuisisi ~80 hari antara kedua dataset (`V2-E-022`) dan daya
> statistik split test yang tidak memadai (`V2-E-023`). Bagian di bawah
> dipertahankan apa adanya sebagai riwayat; baca bersama kedua entri itu.

## Fase saat ini: 6 — Diagnostik ulang + pipeline dua-tahap (BERJALAN)

Scope dilonggarkan pengguna: boleh berat/multi-tahap, tidak harus YOLO, tidak
harus satu pipeline — target metrik setinggi mungkin. Lima probe read-only
(tanpa training) mengubah rumusan masalahnya; jalan penemuannya lengkap di
[../docs/DIAGNOSIS-DEPTH.md](../docs/DIAGNOSIS-DEPTH.md), entri
`V2-E-012` s.d. `V2-E-014`.

**Tiga temuan yang mengoreksi pemahaman Fase 1–5:**

1. **Gap 953-vs-352 bukan efek depth** (V2-E-012) — B3 34× dan B4 26× lebih
   langka di dataset depth; gap terkonsentrasi persis di dua kelas itu
   (B3 AP50 0,605→0,200, B4 0,351→0,130), B1/B2 nyaris sama. Perbandingan
   lintas dataset 953-vs-352 **tidak sah** dan tidak dipakai lagi.
   **DIKOREKSI oleh V2-E-022:** angkanya benar, sebabnya salah. Kelangkaan itu
   bukan artefak dataset yang lebih kecil, melainkan fase kematangan berbeda
   pada pohon yang sama — kedua dataset direkam terpisah ~80 hari (Mei vs Juli
   2026). Pada 1.408 citra ber-ID sama, B3 berbanding 3.604 lawan 321.
2. **44,5% kemampuan detektor hangus karena salah kelas** (V2-E-013) — AP50
   class-agnostic 0,6677 vs mAP50 class-aware 0,3707. Mencari tandan sudah
   baik; menamainya yang rusak, dan konfusinya selalu ke kelas bertetangga
   (masalah ordinal).
3. **Sinyal depth = relief lokal, bukan skala metrik** (V2-E-014) — relief
   B1 +2,8 cm → B4 −5,1 cm, monoton, Kruskal-Wallis p=1,7×10⁻²¹; tapi
   SNR per-piksel ≈0,3 (satu level uint8 = 2,91 cm di Z=2,5 m, sinyalnya
   0,8 cm), jadi hanya terbaca setelah pooling wilayah (AUC 0,592→0,724).
   Depth **95,1% valid di dalam box** — "29% invalid" itu latar, bukan objek.

Konsekuensi desain: pisahkan lokalisasi dari klasifikasi, dan konsumsi depth
setelah pooling di jalur klasifikasi — bukan early fusion di stem.

### Status pengerjaan Fase 6

| Komponen | Status |
|---|---|
| Probe diagnostik (`probe_depth_signal.py`) | selesai — V2-E-012/013/014 |
| Split 953 bebas bocor (846 pohon) | selesai — irisan nol terverifikasi |
| Dataset crop + relief depth + mask box | selesai — 16.542 crop (953) + 2.299 (352) |
| Ablasi depth pada classifier (3 seed + statistik terpool) | selesai — FALSIFIED (V2-E-016) |
| Detektor class-agnostic (YOLO26l, RT-DETR-L) | selesai — V2-E-017/018 |
| WBF antar-detektor + sweep inference | selesai — V2-E-019 |
| Rekomposisi dua-tahap + counting | selesai — V2-E-020/021 |
| Classifier crop resolusi 256 @224 (`ftH`) | selesai — tidak menolong (test 0,6569, grup terlemah) |
| Fusi lintas-jalur dua-tahap + detektor class-aware | selesai — nihil (+0,0004), V2-E-023 |
| Probe pergeseran temporal 953 vs 352 | selesai — **V2-E-022** |
| Bootstrap CI seluruh angka Fase 6 | selesai — **V2-E-023** |
| Test split bersih untuk `agn953_full` | selesai — AP50 **0,7702** (19 pohon), V2-E-025 |
| Metadata split pada 6 berkas hasil | selesai — `_meta` ditambahkan, integritas terverifikasi |
| **Depth untuk lokalisasi (`agn352_4ch`)** | **selesai — 0,7636 vs 0,7358 RGB, V2-E-024** |
| CI angka utama Fase 6 | selesai — 0,4500 CI [0,4054; 0,5188], V2-E-026 |

### Hasil Fase 6 (test split 352, sebanding dengan Fase 1–5)

| Model | mAP50 | B1 | B2 | B3 | B4 | Counting ±1 |
|---|---|---|---|---|---|---|
| YOLO26l RGB | 0,3711 | 0,6842 | 0,4184 | 0,2301 | 0,1516 | 84,09% |
| YOLO26l RGB+D `edge` | 0,4316 | 0,7252 | 0,5031 | 0,2240 | 0,2740 | 87,27% |
| RT-DETR-L RGB | 0,4343 | 0,7680 | 0,4867 | 0,2641 | 0,2185 | **90,91%** |
| **Dua-tahap v4 (Fase 6)** | **0,4500** | 0,7366 | 0,4683 | **0,3212** | 0,2738 | 85,91% |
| RF-DETR-L RGB | **0,4544** | 0,6853 | 0,5184 | **0,3477** | 0,2661 | 88,18% |
| *Dua-tahap v3 (counting terbaik)* | 0,4102 | — | — | — | — | *88,18%* |

**Peringatan utama (V2-E-023):** CI 95% untuk mAP50 di split ini selebar
**±0,058** (220 citra, 410 kotak GT). Selisih antar-baris di tabel atas
sebagian besar **lebih kecil dari lebar selangnya** dan tidak terbedakan.
Jarak dua-tahap (0,4500) ke RF-DETR-L (0,4544) adalah 0,0044 — 26× lebih kecil
dari lebar CI. Jangan mengurutkan baris-baris ini sebagai peringkat.

**Tiga hal yang harus dibaca bersama angka di atas:**

1. **Plafon mAP50 dataset ini ≈ 0,733.** mAP50 ≤ AP50 lokalisasi secara
   definisi, dan AP50 lokalisasi test-352 = 0,7330 — praktis sama dengan
   test-953 = 0,7374 yang punya 9,8× lebih banyak box latih (V2-E-017).
   Target mAP50 0,80 berada **di atas plafon**, bukan sekadar belum tercapai.
   **DIKOREKSI oleh V2-E-024:** angka 0,733 itu plafon untuk masukan **RGB**,
   bukan plafon dataset. Dengan kanal depth, AP50 lokalisasi mencapai **0,7636**
   (kontrol RGB berpasangan: 0,7358; selisih +0,0278, P(Δ>0)=0,921, CI masih
   memuat nol). Plafon itu sifat modalitas masukan.
2. **Konfigurasi terbaik untuk mAP50 bukan yang terbaik untuk counting.**
   v4 menang mAP50 (0,4500), v3 menang counting (88,18%). mAP peduli urutan
   deteksi dalam kelas; counting memakai argmax sehingga sensitif kalibrasi
   prior (V2-E-021).
3. **Depth tetap tidak berkontribusi** pada klasifikasi kematangan:
   `I(Y;D) > 0` tapi `I(Y;D|RGB) ≈ 0` (V2-E-016). Kontribusi depth untuk
   lokalisasi belum diisolasi — ditunda atas permintaan pengguna.

---

## Fase 5 — Loop perbaikan RGB+D (SELESAI, semua metrik terisi)

Lihat [docs/RENCANA.md](../docs/RENCANA.md) untuk rencana kerja lengkap dan
[EKSPERIMEN.md](EKSPERIMEN.md) untuk log append-only per hipotesis.

**Fase 0-4: SELESAI** (V2-E-001..V2-E-007, ter-commit). Fase 5 dimulai
2026-08-10/11: screening lever representasi (4 kandidat encoding depth) dan
lever arsitektur (mid-fusion+gate) pada YOLO26l — lihat V2-E-008/009.
`edge` (Sobel gradient depth) menang screening, dipromosikan ke training
penuh 60 epoch:

- **Deteksi: CONFIRMED.** Test mAP50 0,4316 vs `inverse` 0,3919 — **+10,1%
  relatif**, robust terhadap baseline RGB manapun (V2-E-010).
- **Counting: INCONCLUSIVE.** Bootstrap CI vs retrain RGB-352 baru
  (Class Acc 84,09%, underperform 5,46pp dari angka asli V2-E-004 89,55%)
  menunjukkan `edge` unggul +3,18pp (P=94,3%, CI hampir tapi belum
  eksklusif positif) — TAPI dibanding angka RGB asli V2-E-004, `edge`
  malah kalah −2,28pp. Kesimpulan berbalik arah tergantung baseline mana
  yang dipakai — dilaporkan tidak konklusif, bukan dibulatkan (V2-E-011).
- **Arsitektur (mid-fusion+gate): FALSIFIED** di screening, tidak
  dipromosikan (V2-E-009).

### Progres Fase 0-4 (selesai penuh, ter-commit)

Semua retrain (YOLO26l/RT-DETR-L/RF-DETR-L) dan evaluasi deteksi+counting
pada RGB 953 pohon, RGB 352 pohon, dan RGB+D 352 pohon (early fusion) selesai
— lihat matriks di bawah dan `V2-E-001` s/d `V2-E-007` untuk detail metode.

### Progres Fase 5 (loop perbaikan RGB+D)

| Lever | Kandidat | val mAP50 (screening 15ep) | Verdict |
|---|---|---|---|
| Representasi | `dropout` | 0,3168 | tidak menang |
| Representasi | **`edge`** | **0,3777** | **menang → promosi 60ep** |
| Representasi | `clipped` | 0,3221 | tidak menang |
| Representasi | `valid_mask` (baru) | 0,3321 | tidak menang |
| Arsitektur | mid-fusion+gate (fuse_at=4, gate init=0,02) | 0,2087 (epoch 3, early-stop) | **FALSIFIED** — tidak lolos |

## Matriks hasil (test split, pycocotools mAP50 / Ridge+F_all Class ±1 Acc)

| Dataset | YOLO26l | RT-DETR-L | RF-DETR-L |
|---|---|---|---|
| RGB 953 pohon | Det: 0,5435 / Count: 72,16% | Det: 0,5781 / Count: 76,24% | Det: 0,6012 / Count: 76,24% |
| RGB 352 pohon (asli, V2-E-003/004) | Det: 0,3606 / Count: 89,55% | Det: 0,4343 / Count: 90,91% | Det: 0,4544 / Count: 88,18% |
| RGB 352 pohon (retrain, V2-E-011) | Det: 0,3711 / Count: 84,09% | — | — |
| RGB+D 352 pohon (early fusion, `inverse`) | Det: 0,3919 / Count: 87,73% | Det: 0,3877 / Count: 88,64% | Det: 0,4186 / Count: 88,18% |
| RGB+D 352 pohon (`edge`, Fase 5) | **Det: 0,4316 / Count: 87,27%** | — | — |

Format sel: `Det: mAP50 / Count: Class ±1 Acc`. Sumber: `results/*.json`
(V2-E-001..011), `EKSPERIMEN.md` untuk detail metode tiap sel.

**Baris `edge` — baca dengan konteks, jangan dikutip sepotong:**
- Deteksi: menang jelas dari SEMUA baris RGB/RGBD lain di atas (CONFIRMED).
- Counting: 87,27% ada DI ANTARA dua angka RGB-352 (84,09% retrain vs 89,55%
  asli) — menang atau kalah tergantung mana yang jadi pembanding. Bootstrap
  CI vs retrain: +3,18pp (P=94,3%, hampir signifikan). Vs angka asli:
  −2,28pp. Dilaporkan INCONCLUSIVE (V2-E-011), bukan salah satu arah saja.

---

## Fase 7 — Matriks monocular-depth (SELESAI 2026-08-15, enam sel terisi)

Pertanyaan tunggal: **apakah monocular-depth menaikkan performa deteksi?**
Enam sel, resep identik (`yolo26l.pt` COCO init, 60 epoch, patience 60,
batch 4, imgsz 1280, seed 42, `cos_lr`), evaluator pycocotools pada split
test, prediksi di-dump ke `.npz` saat evaluasi.

| # | Dataset | Input | ch | test mAP50 | val puncak | Epoch |
|---|---|---|---|---|---|---|
| 1 | 352 | RGB | 3 | 0,3677 | 0,4111 @ep45 | 60 |
| 2 | 352 | RGB+Depth `edge` | 4 | **0,4270** | 0,3856 @ep38 | 60 |
| 3 | 352 | RGB+Mono | 4 | 0,3943 | 0,3888 @ep41 | 54 (dihentikan) |
| 4 | 352 | RGB+Depth+Mono | 5 | 0,3766 | **0,4281** @ep50 | 60 |
| 5 | 953 | RGB | 3 | **0,5436** | 0,5373 @ep34 | 60 |
| 6 | 953 | RGB+Mono | 4 | 0,4960 | 0,5012 @ep17 | 31 (dihentikan) |

Angka sel 1 dan 2 di tabel ini dari *resampler* bootstrap; padanan
pycocotools-nya 0,3711 dan 0,4316 (baris matriks Fase 5 di atas). Beda ~0,004
itu implementasi mAP, bukan model — jangan campur antar-evaluator dalam satu
pengurangan (V2-E-032).

### Bootstrap CI berpasangan (2.000 ulangan, seed 42)

| Perbandingan | Selisih | CI 95% | Signifikan |
|---|---|---|---|
| sel 6 − sel 5 — mono vs RGB, 953 | **−0,0476** | [−0,0671; −0,0274] | **YA** |
| sel 4 − sel 2 — mono di atas depth, 352 | **−0,0504** | [−0,1038; −0,0015] | **YA** |
| sel 3 − sel 2 — mono vs depth sensor, 352 | −0,0327 | [−0,0756; +0,0074] | tidak |
| sel 4 − sel 3 — 5ch vs 4ch mono, 352 | −0,0177 | [−0,0672; +0,0323] | tidak |
| sel 3 − sel 1 — mono vs RGB, 352 | +0,0266 | [−0,0270; +0,0739] | tidak |

**Jawaban: TIDAK.** Monocular-depth tidak menang signifikan di satu pun dari
lima perbandingan, dan kalah signifikan di dua. Satu-satunya selisih positifnya
(+0,0266) lebih kecil daripada lebar CI-nya sendiri. **Depth sensor tetap kanal
keempat terbaik** (sel 2 = 0,4270, tertinggi di antara semua varian 352).

**Tiga batas yang wajib ikut dikutip:**
1. Split test 352 hanya 410 kotak → lebar CI ~0,10; selisih di bawah ~0,06
   memang tidak bisa dibedakan dari nol. Hanya sel 6 vs sel 5 (2.612 kotak,
   lebar CI 0,050) yang punya daya statistik memadai.
2. Sel 3 dan sel 6 dihentikan lebih awal (54 dan 31 dari 60 epoch) atas
   keputusan pengguna. Sel 6 paling terdampak — pembandingnya memuncak di
   ep34, di luar jangkauan run itu, jadi −0,0476 kemungkinan dilebih-lebihkan.
   Arahnya tidak diragukan (0 dari 2.000 ulangan positif), besarannya iya.
3. **Val 208 citra di split 352 tidak boleh dipakai memeringkat model.**
   Peringkat val (4 > 1 > 3 > 2) hampir persis kebalikan peringkat test
   (2 > 3 > 4 > 1) — terjadi pada keempat sel 352. Di 953 (404 citra val)
   val dan test sepakat. Lihat V2-E-030/031.

**Belum dijalankan:** kontrol M_shuf lintas-pohon, yang memisahkan "isi peta
mono" dari "biaya menambah kanal pada stem COCO 3-kanal". Selama itu belum
ada, penyebab kerugiannya tetap tidak diketahui.

Detail per sel: V2-E-027 (sel 6), V2-E-030 (sel 3), V2-E-031 (sel 4),
V2-E-032 (sintesis matriks). Riwayat per-epoch tiap run ada di
`results/riwayat_epoch/`, log training ringkas di `results/logs_ringkas/`.

### Dua pembatas kutipan yang berlaku lintas fase (V2-E-033)

1. **Hasil jalur agnostik Fase 6 hanya sah dari `test_bersih`.** 512 dari 588
   citra `agnostic953_test_penuh` (87%) ikut dilatih saat pretraining agnostik
   — berkas citra yang identik, bukan sekadar pohon yang sama. Angka dari
   `test_penuh` adalah train-on-test. `test_bersih` bersih total (0/76) tapi
   cuma 19 pohon.
2. **Tidak ada split test bersih untuk transfer 953→352.** 44 dari 55 pohon
   test-352 ada di train-953. Matriks mono-depth tidak terdampak (keenam sel
   init dari COCO, bukan dari bobot 953), tapi eksperimen finetune 953→352
   apa pun wajib mencantumkan catatan ini.
