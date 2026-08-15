

===== README.md =====

# Research-Pipeline

Repositori ini menyatukan dua jalur riset tentang tandan buah segar kelapa sawit:

1. Tinjauan pustaka tentang YOLO, RGB-D, dan deteksi tandan.
2. Eksperimen deteksi yang menguji keputusan teknis dari tinjauan tersebut.

## Hasil yang berlaku saat ini

Hasil empat kelas yang boleh dikutip adalah **RF-DETR-L pada E-021**:
**test mAP50 0,6038** dan **mAP50-95 0,2770**. Semua pembanding E-021
dievaluasi dengan protokol `pycocotools` yang sama.

E-022 menguji depth sensor Orbbec pada dataset berbeda. Pipeline sensor dan
reproyeksi depth ke RGB telah divalidasi, tetapi **klaim peningkatan deteksi
belum sah**. Angka seed-42 dipertahankan sebagai rekam historis dan auditnya
menjelaskan mengapa angka tersebut tidak boleh dipakai sebagai hasil final.

## Saya ingin...

| Tujuan | Buka ini |
|---|---|
| Mengutip metrik final | [Metrik E-021](experiments/METRICS.md) |
| Memeriksa koreksi E-022 | [Audit E-022](experiments/AUDIT-E022.md), lalu [arsip seed-42](experiments/archive/E022-seed42-awal.md) |
| Memahami seluruh eksperimen | [Pintu masuk eksperimen](experiments/README.md) |
| Menjalankan ulang E-021 | [Panduan reproduksi](experiments/code/REPRODUCE.md) |
| Menemukan skrip dan bukti hasil | [Peta skrip](experiments/code/PETA-SKRIP.md) |
| Membaca sintesis literatur | [Sintesis lintas makalah](literature/synthesis.md) |
| Menyusun naskah | [Sumber LaTeX](manuscript/source/) dan [panduan naskah](manuscript/guides/) |
| Memeriksa keterlacakan klaim | [Audit](audit/) |

## Struktur

| Lokasi | Isi |
|---|---|
| [`literature/`](literature/) | Tinjauan pustaka: 182 ringkasan, sintesis, entri ditahan, protokol pencarian, teks terekstrak, dan PDF sumber |
| [`experiments/`](experiments/) | Eksperimen: status, log, metrik, sub-laporan, skrip (`code/`), hasil (`results/`), log training, dan split |
| [`manuscript/`](manuscript/) | Naskah: sumber LaTeX, figur, panduan penulisan, laporan, dan keluaran PDF/PPTX |
| [`pipeline/`](pipeline/) | Deliverable produksi: pipeline YOLO 4-kanal untuk kamera Orbbec Gemini |
| [`tools/`](tools/) | Skrip utilitas: pembuat matriks bukti, tabel sintesis, dan presentasi |
| [`audit/`](audit/) | Verifikasi lintas-topik: audit pra-submisi, register klaim, matriks bukti |
| [`legacy/`](legacy/) | Draf dan figur usang |
| [`site/`](site/) | Pembuat Ruang Baca dan pustaka kliennya |
| [`index.html`](index.html) | Ruang Baca publik hasil build, tetap di akar untuk GitHub Pages |

`literature/pdf/` dan `datasets/` adalah bahan lokal besar yang sengaja
tidak masuk Git.

## Perintah lokal

```bash
node site/build.js --dry
node site/build.js
latexmk -pdf -outdir=manuscript/output/papers manuscript/source/main.tex
```

Jalankan pembuat situs setelah mengubah entri literatur, sintesis, atau
laporan eksperimen. `index.html` adalah keluaran build dan tidak disunting
langsung.


===== audit/README.md =====

# Audit

Berkas verifikasi klaim dan keterlacakan untuk memastikan setiap pernyataan
di naskah dapat dilacak ke sumber primer. Folder ini diperiksa sebelum
submisi naskah ke jurnal.

## Saya ingin...

| Tujuan | Buka ini |
|---|---|
| Menjalankan daftar periksa pra-submisi | [`AUDIT-PRA-SUBMISI.md`](AUDIT-PRA-SUBMISI.md) |
| Memverifikasi klaim terhadap 182 entri | [`claim-audit-182.md`](claim-audit-182.md) |
| Melihat register klaim inti naskah | [`core-claim-register.md`](core-claim-register.md) |
| Memeriksa akurasi entri | [`entri-accuracy-check.md`](entri-accuracy-check.md) |
| Menelusuri matriks bukti | [`evidence-matrix-182.md`](evidence-matrix-182.md) (dokumentasi) dan [`evidence-matrix-182.csv`](evidence-matrix-182.csv) (data) |

## Isi folder

| Berkas | Isi |
|---|---|
| `AUDIT-PRA-SUBMISI.md` | Daftar periksa yang harus dipenuhi sebelum naskah dikirim |
| `claim-audit-182.md` | Audit setiap klaim naskah terhadap korpus 182 entri |
| `core-claim-register.md` | Register klaim inti beserta rujukan pendukungnya |
| `entri-accuracy-check.md` | Pemeriksaan akurasi isi ringkasan terhadap PDF sumber |
| `evidence-matrix-182.csv` | Matriks bukti dalam format CSV (410 KB) |
| `evidence-matrix-182.md` | Dokumentasi dan penjelasan matriks bukti |


===== datasets/README.md =====

# Datasets

Wadah dataset lokal yang dipakai untuk eksperimen. Isi folder ini **tidak
masuk Git** karena ukurannya terlalu besar — hanya metadata dan README
dataset yang dilacak.

## Isi folder

| Lokasi | Isi |
|---|---|
| `SawitMVC-Depth/` | Dataset depth sensor Orbbec: 352 pohon, 1.408 citra RGB 1280x800, depth Y16 848x480 uint16 milimeter. Sudah punya [README sendiri](SawitMVC-Depth/README.md). Sumber: [Hugging Face](https://huggingface.co/datasets/ULM-DS-Lab/SawitMVC-Depth), CC BY-NC 4.0 |

## Dataset lain yang dipakai tetapi tidak ada di repo

| Dataset | Lokasi di workspace | Isi |
|---|---|---|
| SawitMVC | `/workspace/SawitMVC/data` | 953 pohon, 3.992 citra 960x1280, label YOLO empat kelas (B1–B4) |
| Sawit (master mentah) | `/workspace/Sawit/data` | 3.992 citra 3024x4032 resolusi penuh, tanpa anotasi |


===== experiments/README.md =====

# Eksperimen: pintu masuk

Folder ini memisahkan hasil yang boleh dikutip dari riwayat, audit, dan
pekerjaan yang belum menjadi klaim ilmiah. Baca halaman ini sebelum membuka
log eksperimen yang panjang.

> **Seri F dibuka 6 Agustus 2026 — [SERI-F.md](SERI-F.md).** Seri terpisah untuk
> perubahan **formulasi dan arsitektur** (K1 cabang frekuensi, K2 kepala ordinal,
> K3 lintas-sisi), dengan gerbang penyaring tanpa GPU di depan tiap komponen.
> Berjalan paralel dengan seri E, bukan menggantikannya. Entri kronologisnya
> tetap di [EKSPERIMEN.md](EKSPERIMEN.md) dengan kode `F-0NN`.

## Status saat ini

**Final:** E-021 menetapkan RF-DETR-L sebagai hasil deteksi empat kelas terbaik
saat ini pada SawitMVC: test mAP50 **0,6038** dan mAP50-95 **0,2770** dengan
protokol `pycocotools` yang sama untuk seluruh pembanding.

**Batas E-022:** parser kalibrasi, reproyeksi depth ke RGB, dan pemeriksaan mutu
depth sudah divalidasi pada SawitMVC-Depth. Klaim bahwa kanal depth menaikkan
deteksi belum sah. Baca [audit](AUDIT-E022.md) sebelum melihat
[arsip seed-42](archive/E022-seed42-awal.md).

| Label | Arti |
|---|---|
| **Final** | Bukti dan metrik dibekukan; boleh dikutip sebagai hasil saat ini. |
| **Arsip** | Rekam eksperimen terdahulu; gunakan hanya sebagai konteks historis, bukan capaian final. |
| **Audit** | Bukti koreksi atau pemeriksaan; jangan mengutip skor lama sebagai hasil final. |
| **Ditangguhkan** | Kode, data, atau arah kerja sudah ada, tetapi belum mendukung klaim performa. |

> **Status audit terbaru (2 Agustus 2026).** Gunakan `reports.tex` dan
> `REPORT_PLAN.md` untuk putusan yang dibatasi bukti. Tabel ini adalah indeks
> handoff dan dapat memuat label historis; khususnya E-026 harus dibaca sebagai
> tidak konklusif karena denominator identitas berbeda, dan E-032 sebagai tidak
> konklusif dalam rezim diuji, bukan sebagai ekuivalensi.

## Register E-001 sampai E-032

| Eksperimen | Pertanyaan dan data | Putusan | Status kutip | Detail |
|---|---|---|---|---|
| E-001 | Apakah `class_mismatch` mengukur ambiguitas kematangan pada SawitMVC? | Dipalsukan | Arsip | [SR-001](SR/SR-001-ambiguitas-kematangan.md) |
| E-002 | Apakah master mentah Sawit dapat diinventarisasi? | Inventaris selesai | Arsip | [log](EKSPERIMEN.md) |
| E-003 | Apakah DA3 menjaga geometri video orbit? | Dikonfirmasi untuk pose | Arsip | [SR-003](SR/SR-003-da3-video-orbit.md) |
| E-004 | Apakah DA3 konsisten pada banyak video orbit? | Dikonfirmasi | Arsip | [SR-003](SR/SR-003-da3-video-orbit.md) |
| E-005 | Apakah DA3 dapat mengaitkan empat atau delapan sisi foto? | Dikonfirmasi | Arsip | [SR-004](SR/SR-004-da3-empat-sisi.md) |
| E-006 | Apakah pseudo-depth memisahkan tandan dari latar? | Dipalsukan | Arsip | [SR-005](SR/SR-005-sinyal-depth-tandan.md) |
| E-007 | Apakah penautan geometri lintas sisi membantu? | Dipalsukan | Arsip | [SR-006](SR/SR-006-penautan-geometris.md) |
| E-008 | Nomor tidak digunakan | Tidak ada run | - | [log](EKSPERIMEN.md) |
| E-009 | Apakah ukuran kotak menjelaskan kesulitan B4? | Diagnosis tersedia | Arsip | [SR-007](SR/SR-007-diagnosis-b4.md) |
| E-010 | Apakah B4 gagal karena kepadatan atau kontras? | Kontras dikonfirmasi, kepadatan dipalsukan | Arsip | [SR-007](SR/SR-007-diagnosis-b4.md) |
| E-011 | Praproses apa yang membantu B4? | Tekstur dikonfirmasi, penajam kontras dipalsukan | Arsip | [SR-008](SR/SR-008-kanal-tekstur.md) |
| E-012 | Apakah kelas kematangan bersifat ordinal? | Dikonfirmasi | Arsip | [SR-009](SR/SR-009-ordinalitas-kelas.md) |
| E-013 | Apakah pipeline produksi 4 kanal siap untuk sensor? | Pipeline tersedia, belum ada bobot sensor | Ditangguhkan | [`pipeline/`](../pipeline/) |
| E-014 | Apakah hambatan mAP ada di deteksi atau klasifikasi? | Klasifikasi kematangan menjadi hambatan | Arsip | [SR-010](SR/SR-010-hambatan-klasifikasi.md) |
| E-015 | Apakah piksel master mentah bisa dipetakan ke SawitMVC? | 3.992 dari 3.992 terpetakan | Arsip | [SR-002](SR/SR-002-resolusi-master-mentah.md) |
| E-016 | Apakah plafon kematangan dapat dibuktikan? | Ditarik karena bukti cacat | Audit | [SR-011](SR/SR-011-plafon-kematangan.md) |
| E-017 | Apakah detektor dua tahap lebih baik? | Dipalsukan | Arsip | [SR-012](SR/SR-012-dua-tahap.md) |
| E-018 | Apakah sasaran 0,60/0,30 mungkin secara geometris? | Mungkin secara geometri anotasi | Arsip | [log](EKSPERIMEN.md) |
| E-019 | Apakah resolusi tinggi dan augmentasi aman warna membantu? | Tidak konklusif | Arsip | [log](EKSPERIMEN.md) |
| E-020 | Apakah RT-DETR NMS-free melampaui baseline? | Dikonfirmasi, kemudian dilampaui E-021 | Arsip | [SR-013](SR/SR-013-rtdetr-nms-free.md) |
| E-021 | Apakah RF-DETR-L melampaui RT-DETR pada setelan identik? | Dikonfirmasi | **Final** | [METRICS](METRICS.md) dan [SR-014](SR/SR-014-rfdetr-dinov2.md) |
| E-022 | Apakah depth sensor terregistrasi menaikkan mAP? | Fusi awal tidak didukung; klaim kenaikan belum sah | **Audit** | [audit](AUDIT-E022.md) dan [arsip](archive/E022-seed42-awal.md) |
| E-023 | Fusi menengah/akhir dua cabang | **Dijalankan sebagai E-032**; nomor E-023 dipakai untuk direktori bukti | Arsip | [E-032](EKSPERIMEN.md), bukti `experiments/results/E-023/` |
| E-024 | Apakah inkonsistensi prediksi lintas-sisi terukur? | Terukur 19,5% | Arsip | [SR-016](SR/SR-016-konsistensi-lintas-sisi.md) |
| E-025 | Dari mana selisih evaluator E-022 berasal? | Menskala dengan jumlah deteksi | **Audit** | [audit](AUDIT-E022.md) dan [log](EKSPERIMEN.md) |
| E-026 | Apakah depth menstabilkan identitas lintas-sisi? | Tidak konklusif pada subset terukur; denominator RGB/RGB-D berbeda | Audit | [SR-016](SR/SR-016-konsistensi-lintas-sisi.md) |
| E-027 | Apakah kenaikan depth E-022 bertahan multi-seed? | Dipalsukan; depth merugikan pada YOLO26n | Arsip | [log](EKSPERIMEN.md) |
| E-028 | Apakah ukuran lintas-sisi bertahan pada dataset 6x lebih besar? | Dikonfirmasi; B2 kelas paling ambigu | Arsip | [SR-016](SR/SR-016-konsistensi-lintas-sisi.md) |
| E-029 | Apakah klausa "depth terpakai pada kapasitas tinggi" bertahan multi-seed? | Dicabut | **Audit** | [log](EKSPERIMEN.md), [SR-015](SR/SR-015-depth-sensor-4kanal.md) |
| E-030 | Apakah arah efek kanal ke-4 ditentukan kapasitas? | Dikonfirmasi sebagian; klaim dipersempit | Arsip | [log](EKSPERIMEN.md) |
| E-031 | Seberapa besar kesimpulan bergantung pada split? | Varians split nyata; arah Δ justru lebih stabil | Arsip | [log](EKSPERIMEN.md) |
| E-032 | Apakah memindahkan titik fusi (awal/menengah/akhir) menolong? | Tidak konklusif dalam rezim diuji; 12/12 CI memuat nol. `mid` indikasi saja; ekuivalensi belum dibuktikan | Audit | [log](EKSPERIMEN.md), [SR-015 §7b](SR/SR-015-depth-sensor-4kanal.md) |

## Urutan baca menurut kebutuhan

| Pembaca | Urutan |
|---|---|
| Pembaca hasil | Halaman ini, [METRICS.md](METRICS.md), lalu [SR-014](SR/SR-014-rfdetr-dinov2.md). |
| Pemeriksa bukti | Halaman ini, [AUDIT-E022.md](AUDIT-E022.md), [arsip E-022](archive/E022-seed42-awal.md), lalu [EKSPERIMEN.md](EKSPERIMEN.md). |
| Pelaksana reproduksi | Halaman ini, [PETA-SKRIP.md](code/PETA-SKRIP.md), [catatan E-021](code/CATATAN-TEKNIS-E021.md), lalu [REPRODUCE.md](code/REPRODUCE.md). |
| Pihak luar yang diberi tugas riset | [BRIEF-DEEP-RESEARCH.md](BRIEF-DEEP-RESEARCH.md) — paket pengarahan berbahasa Inggris berisi larangan eksplisit atas jalur yang sudah dipalsukan. Bukan hasil dan tidak boleh dikutip sebagai bukti. |
| Perencana eksperimen berikutnya | [SINTESIS-DEEP-RESEARCH.md](SINTESIS-DEEP-RESEARCH.md) — rencana E-033…E-037 hasil sintesis dua jawaban deep research, beserta tiga pra-saring tanpa GPU. **Rencana, bukan hasil**; tidak ada run yang mendukungnya. |

`EKSPERIMEN.md` tetap menjadi catatan kronologis. `SR/` merangkai bukti per ide,
dan `experiments/` menyimpan skrip serta JSON sumber.


===== experiments/EKSPERIMEN.md =====

# Catatan Eksperimen — SawitMVC

Log eksperimen yang **hanya bertambah** (*append-only*). Entri lama tidak diedit
untuk "memperbaiki" hasil; kalau kesimpulan berubah, tulis entri baru yang
merujuk entri lama.

> **Peta baca saat ini:** gunakan [README eksperimen](README.md) untuk status
> dan register, [METRICS.md](METRICS.md) untuk hasil final E-021, serta
> [arsip E-022](archive/E022-seed42-awal.md) bersama
> [AUDIT-E022.md](AUDIT-E022.md) untuk rekam dan koreksi E-022.

**Hasil negatif wajib dicatat.** Justru itu isi paling berharga di sini — ia
mencegah jalan buntu yang sama ditempuh dua kali, dan menjawab pertanyaan
reviewer "apa saja yang sudah dicoba".

> **Catatan migrasi jalur — 25 Juli 2026.** Repositori dirapikan: `docs/` dipecah
> per fungsi (`eksperimen/`, `naskah/`, `audit/`, `referensi/`), skrip
> `experiments/` dikelompokkan (`train/`, `eval/`, `build/`, `analysis/`,
> `shell/`, `config/`), dan `results/` diseragamkan per eksperimen
> (`results/E-0NN/`). **Yang disunting di entri lama hanya jalur berkas** —
> tidak ada satu pun angka, hipotesis, atau putusan yang berubah. Perintah
> reproduksi tetap ditulis relatif terhadap `experiments/` (cwd
> `/workspace/experiments`), sesuai [`experiments/code/REPRODUCE.md`](code/REPRODUCE.md) §2.
> Peta skrip baru: [`experiments/code/PETA-SKRIP.md`](code/PETA-SKRIP.md).

**Laporan per-ide ada di [`experiments/SR`](SR/)** — tiap SR merangkum satu ide dari
masalah → ide → solusi → hasil → putusan. Berkas ini adalah **log kronologis**
(E-NNN); SR adalah **pandangan per-ide**. Tiap entri E-NNN di bawah menyebut ide
dan SR yang memuatnya.

Kode eksperimen dijalankan di `/workspace/experiments/` (di luar repo). Snapshot
**kode + hasil JSON + split**-nya diarsipkan ke [`experiments/code/`](code/)
(kode) dan [`experiments/results/`](results/) (hasil, split, log)
di repo ini agar tiap perintah reproduksi tetap punya sumbernya; artefak besar
(bobot, dataset turunan) tidak diarsipkan karena bisa dibuat ulang dari skrip —
lihat [`experiments/code/README.md`](code/README.md).

> **Seri F — Formulasi, dibuka 6 Agustus 2026.** Mulai dari `F-001`, log ini
> memuat dua penomoran. **Seri E** adalah eksperimen diagnostik dan pembanding
> (praproses, titik fusi, sapuan kapasitas, varians seed/split). **Seri F**
> adalah perubahan **formulasi dan arsitektur** di atas RF-DETR-L — yaitu satu-
> satunya arah yang tersisa menurut pernyataan pengguna 21 Juli 2026 setelah
> teknik siap-pakai dan tuning habis dijalankan (CLAUDE.md §"Pernyataan pengguna").
> Isinya tiga komponen — K1 cabang frekuensi ber-gate init-nol, K2 kepala ordinal
> kumulatif berpenjaga-peringkat, K3 konsistensi query lintas-sisi — masing-masing
> didahului gerbang penyaring yang dapat menggugurkannya tanpa GPU. Aturan
> append-only, satu entri satu hipotesis falsifiable, dan kewajiban mencatat hasil
> negatif berlaku sama persis. Rangkuman per-ide: [SR-017](SR/SR-017-sintesis-deep-research.md).
>
> Nomor `E-033` sudah terpakai dua kali (rentang metrik depth, 6 Agustus 2026),
> jadi seri F **bukan** kelanjutan penomoran E — ia berjalan paralel.

Format tiap entri:

```
## E-NNN — Judul   (YYYY-MM-DD)
**Hipotesis** — apa yang diuji, dan apa yang akan memalsukannya
**Cara** — data, konfigurasi, skrip
**Hasil** — angka apa adanya
**Putusan** — DIKONFIRMASI / DIPALSUKAN / TIDAK KONKLUSIF, plus alasannya
**Dampak** — apa yang berubah pada rencana
```

Status: `DIKONFIRMASI` · `DIPALSUKAN` · `TIDAK KONKLUSIF` · `BERJALAN`

---

## Peta Ide Solusi

Sebelas ide, semuanya berlabuh pada korpus 182 sumber. I-1…I-6 adalah jalur DA3
inti; I-7…I-11 diambil dari agenda riset naskah sendiri (`evidence-body.tex`
§208, §234–262, §265, §174) sebagai cadangan bila jalur inti mentok. Eksperimen
di bawah menyebut ide yang diujinya.

| Ide | Isi | Sumber |
|---|---|---|
| **I-1** | DA3 multi-view pada video orbit | entri 198 |
| **I-2** | DA3 multi-view pada 4 sisi foto asli | entri 198 |
| **I-3** | Bangkitkan pseudo-depth untuk 3.992 gambar | entri 175/198 |
| **I-4** | YOLO 4-kanal (early fusion) vs baseline RGB | Expandable YOLO, §174 |
| **I-5** | Fusi middle/late dua cabang | Ophoff dkk., §174 |
| **I-6** | Penautan bunch lintas-sisi secara geometris (ganti k/SVR) | §208 |
| **I-7** | **Asosiasi sadar-pose berjenjang** — tangga ablasi §208: hanya penampilan → depth tanpa pose → sadar-pose → bergerbang mutu. Melaporkan empat mode gagal counting secara terpisah: terlewat, tergabung, terpecah, terduplikasi. | §208 |
| **I-8** | **Gerbang mutu depth + fallback RGB** — pakai peta `conf` DA3 sebagai gerbang; bila depth buruk, jatuh ke RGB dan laporkan kondisi terdegradasi. Naskah menyatakan tegas: bila fallback RGB menyamai fusi saat depth buruk, itu **temuan deployment, bukan hasil negatif**. | §174, §265; SA-Gate 055, D3Net 037 |
| **I-9** | **Sampel depth terkendala instans** — ambil statistik kedalaman di dalam kotak tiap bunch (bukan seluruh citra) sebagai fitur geometris per-instans: ukuran relatif, pemisahan lapisan, jarak ke tetangga. Masuk ke penghitung menggantikan fitur 13-dimensi SVR. | F08; FocusDepth entri 202 |
| **I-10** | **Kaskade deteksi-lalu-proyeksi** — deteksi 2D dulu sebagai penyaring kasar, baru proyeksikan ke 3D pada himpunan titik yang sudah diperkecil. Alternatif terhadap fusi di input, dan lebih murah di perangkat lapangan. | FusionVision, YOLOv8-URE, §174 |
| **I-11** | **Analisis terstratifikasi ukuran/oklusi/iluminasi** — bukan sekadar AP tunggal, tetapi AP per strata, supaya terlihat **di mana** depth benar-benar membayar. Inilah yang memutuskan hipotesis (A) geometris vs (B) fotometrik. | Tabel hierarki metrik, §234–262 |

Ide berikut (I-12…I-24) lahir **dari hasil eksperimen di atas**, bukan dari
korpus — masing-masing menutup atau membuka arah menurut apa yang terukur. Ini
yang membedakannya dari daftar awal: bukan agenda pustaka, melainkan konsekuensi
data.

| Ide | Isi | Lahir dari | Status |
|---|---|---|---|
| **I-12** | Pelatihan berbasis ubin (tiling) resolusi tinggi | laporan | ekspektasi diturunkan (E-009); tak dijalankan tuntas |
| **I-13** | Loss berimbang kelas / focal | laporan | belum |
| **I-14** | Detektor NMS-free (RT-DETR-L) | laporan (prioritas 1) | **DIKONFIRMASI** — detektor terbaik, +0,063 mAP50 test (E-020, [SR-013](SR/SR-013-rtdetr-nms-free.md)) |
| **I-15** | Neck multiskala lebih kuat (BiFPN) | laporan | belum |
| **I-16** | Copy-paste / augmentasi sintetis | laporan | prioritas turun untuk B4 (SR-007) |
| **I-17** | Kalibrasi ambang per strata | laporan | belum |
| **I-18** | Kepala multi-tugas (deteksi + kematangan) | laporan | → menjelma I-22 |
| **I-19** | Kalibrasi depth metrik (Metric3D/ZoeDepth) | laporan | belum (perlu bila klaim jarak) |
| **I-20** | Praproses penajam kontras untuk B4 | E-010/SR-007 | **DIPALSUKAN** (E-011) |
| **I-21** | Kanal keempat berisi tekstur, bukan depth | E-011/SR-008 | dijalankan lalu dihentikan (E-014) |
| **I-22** | Loss ordinal / kepala regresi kematangan | E-012/SR-009 | belum (probe dihentikan di E-014) |
| **I-23** | Detektor dua tahap (deteksi agnostik + kepala kematangan) | E-014/SR-010 | **DIPALSUKAN** (E-017, [SR-012](SR/SR-012-dua-tahap.md)) |
| **I-24** | Detektor 4-kelas resolusi tinggi + augmentasi aman-warna | E-014/E-016 | diuji (E-019); menempel baseline |

---

## Baseline acuan (bukan eksperimen)

Angka publikasi dari Data in Brief 67 (2026) 112990, diverifikasi langsung dari
PDF di `docs/`. Semua eksperimen di bawah dibandingkan terhadap ini.

- Deteksi YOLO26m (test): AP50 overall **0,531** — B1 0,739 / B2 0,433 /
  B3 0,599 / **B4 0,354**
- Counting (test, 141 pohon), Class ±1 Acc: GT+SVR **96,81%** vs
  YOLO26m+SVR **75,35%**
- Baseline ini **sengaja tidak di-tuning** oleh penulis (`imgsz=640`, SVR default).
  Plafon hasil tuning tim adalah angka terpisah — jangan dicampur.

---

## E-001 — `class_mismatch` sebagai ukuran ambiguitas kematangan (2026-07-21)

**Hipotesis** — Flag `class_mismatch` pada JSON per-pohon menyala saat anotator
memberi kelas berbeda pada bunch fisik yang sama dilihat dari sisi berbeda.
Karena bunch yang sama pasti punya kematangan yang sama, tingkat ketidaksepakatan
itu adalah **batas atas empiris** akurasi klasifikasi per-sisi, dan diperkirakan
menumpuk di B2↔B3 sehingga mendukung klaim "ambiguitas B2/B3 sulit direduksi".
Dipalsukan bila tingkat ketidaksepakatan mendekati nol atau tidak terkonsentrasi
di B2/B3.

**Cara** — `experiments/code/analysis/class_mismatch_stats.py` atas seluruh 953 JSON di
`SawitMVC/data/json/`. Menghitung flag, ketidaksepakatan label per-sisi terhadap
kelas konsensus bunch, matriks kebingungan, dan pecahan per split/varietas/jumlah
sisi/kelas.

**Hasil** —

| Besaran | Nilai |
|---|---|
| Bunch unik | 9.823 |
| Bunch tampak dari ≥2 sisi | 7.328 (74,6%) |
| Label antar-sisi berbeda | **0 (0,00%)** |
| Flag `class_mismatch` menyala | **0** |
| Konsistensi label sisi vs konsensus | 18.540 / 18.540 = 100,00% |

Verifikasi silang parser terhadap angka publikasi — cocok persis: 9.823 bunch,
18.540 kemunculan, sebaran kemunculan 6.264 / 834 / 147 / 71 / 12 untuk 2–6 sisi.
Jadi angka nol bukan bug parser.

**Putusan** — **DIPALSUKAN.** Flag ini bukan pengukur ambiguitas kematangan,
melainkan pemeriksa integritas data yang hasilnya bersih. Ketidaksepakatan sudah
diselesaikan sebelum rilis; DiB §4.3: *"Completed annotations were reviewed in
full by a single reviewer, who applied corrections before export."*

**Penting untuk tidak salah kutip:** angka nol ini **tidak** mendukung maupun
membantah klaim ambiguitas B2/B3 — besaran itu tidak lagi teramati pada rilis
ini. Jangan menyajikannya sebagai "konsistensi anotator 100%" seolah bukti mutu
anotasi terhadap ambiguitas.

**Dampak** — Jalan ini ditutup. Pengganti: pakai graf `_confirmedLinks` sebagai
*oracle identitas*, lalu ukur **inkonsistensi prediksi detektor** pada bunch
fisik yang sama antar-sisi. Itu mengukur ambiguitas tanpa bergantung label
manusia, dan ukuran yang sama dapat menguji apakah depth menstabilkannya.
Butuh detektor terlatih → dijalankan bersama eksperimen utama.

---

## E-002 — Inventarisasi master mentah `Sawit` (2026-07-21)

**Hipotesis** — Master mentah 3024×4032 dapat langsung dipakai untuk eksperimen
resolusi penuh memakai anotasi SawitMVC yang sudah ada, karena keduanya dataset
yang sama.

**Cara** — Pemeriksaan langsung `/workspace/Sawit/data`: hitung berkas, resolusi,
rasio aspek, tabrakan nama, properti video.

**Hasil** —

- Raw: 3.992 JPG **3024×4032** (16 GB) + **45 MP4** 1920×1080, ~21 dtk
  (~618 frame), semuanya dari `Video/Kelompok 6`.
- Rasio aspek raw dan MVC **identik (0,75)** → koordinat YOLO ternormalisasi
  berlaku persis di kedua resolusi, tanpa anotasi ulang. Luas piksel 9,9×.
- **Penghalang:** nama berkas raw tidak unik secara global — 3.992 berkas hanya
  1.352 nama unik, **936 nama kembar** antar folder `Kelompok N`
  (mis. `LONSUM_A21A_044_3.jpg` di Kelompok 2 *dan* 5 = dua pohon berbeda).
  Penomoran raw 3 digit vs MVC 4 digit. Video hanya bernama cap waktu, tanpa
  ID pohon.

**Putusan** — **TIDAK KONKLUSIF.** Premisnya benar (aspek identik, label
transferable), tetapi pemetaan raw ↔ anotasi tidak dapat dilakukan dari nama
berkas. Perlu pencocokan berbasis isi (perceptual hash / *downscale-and-compare*)
yang hasilnya wajib diverifikasi, atau tabel pemetaan dari tim pengumpul data.

**Dampak** — Eksperimen resolusi penuh diblokir sampai pemetaan tersedia.
Sebaliknya, **video menjadi aset tak terduga**: risiko terbesar rencana DA3
multi-view adalah baseline ~90° antar sisi; ratusan frame mengelilingi satu pohon
memberi baseline kecil, kondisi ideal untuk geometri multi-view. Urutan uji
diubah — DA3 pada video lebih dulu.

---

## E-003 — DA3 multi-view pada video orbit pohon (2026-07-21)

**Hipotesis** — Depth Anything 3 (entri 198) dapat merekonstruksi geometri pohon
yang konsisten dari video orbit, sehingga kedalaman antar-pandangan dapat
diandalkan untuk memisahkan bunch bertumpuk dan, lebih jauh, untuk menautkan
bunch lintas-sisi secara geometris alih-alih statistik (k ≈ 1,89 / SVR).
Dipalsukan bila rekonstruksi gagal konvergen, pose kamera tidak membentuk orbit
yang masuk akal, atau peta kedalaman kanopi tidak memisahkan lapisan.

**Cara** — `experiments/code/analysis/da3_video_test.py`, checkpoint `depth-anything/da3-large`,
`process_res=504`, GPU L4. Video `VID_20260205_090556.mp4` (1280×720, 1.315
frame, 43,6 dtk) dari `Sawit/data/Video/Kelompok 6`. Frame diambil berjarak sama,
dua kerapatan: 16 dan 48 frame. Diagnosa: (b) PCA pusat kamera → kecocokan
lingkaran pada bidang orbit; (c) rentang dinamis kedalaman + inspeksi visual
pratinjau RGB|depth|conf.

**Hasil** —

Kecepatan: 16 frame dalam **2,2 dtk** (0,14 dtk/frame). Keluaran `Prediction`
memuat `depth` (N,H,W), `conf` per piksel, `extrinsics` (N,3,4), `intrinsics`.
`is_metric` kosong → kedalaman **relatif**, bukan metrik.

(b) Pose kamera, 48 frame:

| Besaran | Nilai |
|---|---|
| Cakupan sudut | 319,7° |
| Residual lingkaran (rata-rata / maks) | 8,2% / 28,0% dari radius |
| Simpangan dari bidang (RMS) | 9,1% |
| Rasio kerataan S3/S1 | 0,111 |

Deret langkah sudut menunjukkan pola yang tegas: **indeks 0–30 halus dan searah**
(−2° s.d. −16° per frame), lalu **indeks 31–47 kacau** (−77°, +54°, −44°, +89°,
−76°). Pola batas yang sama muncul pada sampling 16 frame (halus f00–f12, kacau
f13–f15). Perpindahan pusat kamera di bagian kacau mencapai ~96% radius orbit
per langkah, padahal frame-nya tampak serupa.

(c) Kedalaman: rentang dinamis (p99−p1)/p50 = **1,97**; secara visual pelepah
terpisah satu per satu dari latar, dan **tandan buah terlihat** (gugusan B1
merah pada frame 8) dengan kanopi terpisah dari langit/tanah. Peta `conf`
tinggi tepat pada pohon dan rendah pada langit — sinyal gating mutu yang
diminta SA-Gate (055) / D3Net (037) tersedia langsung dari model.

**Putusan** — **DIKONFIRMASI SEBAGIAN.** Rekonstruksi berjalan, cepat, dan pada
~2/3 pertama video menghasilkan orbit mulus searah dengan kedalaman berlapis
yang jelas. Tetapi keandalan pose **tidak seragam sepanjang video**: sepertiga
akhir gagal.

Dua sub-hipotesis atas penyebab kegagalan ekor ini diuji dan **keduanya
dipalsukan**: (i) "operator berhenti/melayang sehingga baseline kecil" — salah,
perpindahan di ekor justru 2,2× lebih besar dari badan orbit; (ii) "baseline
antar-frame terlalu lebar akibat sampling jarang" — salah, merapatkan 16→48
frame tidak menggeser batas kegagalan. Kegagalan terlokalisasi pada **isi video
di sepertiga akhir**, dan penyebabnya belum diketahui.

**Dampak** — Jalur depth berbasis geometri layak diteruskan, tetapi **wajib
disertai penyaring keandalan pose**, bukan diasumsikan berlaku untuk seluruh
masukan. Langkah lanjutan: (1) cari penyebab kegagalan sepertiga akhir dengan
memeriksa isi frame di sana; (2) uji pada beberapa video lain — n=1 tidak cukup
untuk generalisasi; (3) uji pada kasus 4-sisi yang sebenarnya, karena
keberhasilan pada video **belum** membuktikan apa pun untuk baseline ~90°.

**Catatan keterbatasan yang harus dibawa ke entri berikutnya:**

- **n = 1 video.** Belum ada bukti generalisasi.
- Frame diekstrak `cv2` yang **mengabaikan metadata rotasi**, sehingga masukan
  miring 90°. DA3 tetap bekerja, tetapi ini variabel tak terkontrol yang harus
  diperbaiki sebelum angka apa pun dikutip.
- "Kedalaman berlapis" masih kualitatif plus proksi rentang dinamis; **belum
  terhubung ke metrik deteksi apa pun**. Belum ada klaim bahwa ini menaikkan
  AP50 B4.
- Video ini rekaman jarak dekat ke mahkota; foto dataset diambil 2–3 m dari
  batang. Transfer antar-geometri **belum diuji**.

---

## E-004 — DA3 pada banyak video, rotasi diperbaiki (2026-07-21) · Ide I-1

**Hipotesis** — Kegagalan sepertiga akhir pada E-003 bukan batas DA3, melainkan
akibat (i) masukan miring 90° karena `cv2` mengabaikan metadata rotasi, dan/atau
(ii) sifat khas video tunggal itu. Bila benar, memperbaiki rotasi dan menguji
banyak video akan menghasilkan orbit mulus pada mayoritas video. Dipalsukan bila
sebagian besar video tetap gagal, atau kegagalan tersebar merata.

**Cara** — `experiments/code/analysis/da3_video_multi.py`, `depth-anything/da3-large`,
`process_res=504`, 6 video pertama `Kelompok 6`, 32 frame per video. Ekstraksi
frame lewat **ffmpeg** (menerapkan display matrix; terkonfirmasi video memuat
`displaymatrix: rotation of -90.00 degrees`) menggantikan `cv2`. Metrik utama
`smooth_frac` = pecahan frame di dalam sapuan orbit searah terpanjang (langkah
searah, besar ≤40°).

**Hasil** —

| Video | smooth_frac | Sapuan mulus | Residual lingkaran | Kerataan |
|---|---|---|---|---|
| 090556 | 41% | 149° | 2,4% | 0,098 |
| 091514 | **100%** | 331° | 3,6% | 0,020 |
| 092017 | 97% | 335° | 3,3% | 0,049 |
| 092548 | **100%** | 362° | 4,1% | 0,041 |
| 093119 | **100%** | 379° | 5,7% | 0,025 |
| 094046 | **100%** | 385° | 7,0% | 0,034 |

Ringkasan: `smooth_frac` rata-rata **90%**, median **100%**; **5 dari 6** video
mencapai sapuan ≥270°. Residual lingkaran 2,4–7,0% dari radius, rasio kerataan
0,020–0,098 — pusat kamera benar-benar terletak pada satu bidang melingkar.
Rentang dinamis kedalaman 2,70–3,63.

Uji sebab pada frame di luar segmen mulus: **ketajaman justru lebih tinggi**
(7.725 vs 6.526; rasio 0,84), kecerahan hampir sama (rasio 1,05), gerak hampir
sama (rasio 0,94). Jadi blur, pencahayaan, dan gerak **bukan** penyebabnya.

**Putusan** — **DIKONFIRMASI.** DA3 merekonstruksi orbit pohon sawit secara andal
pada 5 dari 6 video, dengan sapuan mendekati lingkaran penuh dan geometri yang
konsisten. E-003 mengukur satu video yang kebetulan bermasalah, dan `n=1` memang
tidak layak digeneralisasi — koreksi ini persis alasan keterbatasan itu dicatat.

Sebab kegagalan video 090556 **masih belum diketahui**; tiga kandidat (baseline
kecil, sampling jarang, blur/pencahayaan/gerak) sudah dipalsukan. Jangan
mengarang penjelasan untuk sisa 1 video ini.

**Dampak** — Ide I-1 selesai dan positif. Pose kamera dan kedalaman relatif dari
DA3 cukup andal untuk dijadikan fondasi I-6 (penautan geometris) dan I-7
(asosiasi sadar-pose). Tetapi keandalannya **tidak universal** (1 dari 6 gagal),
sehingga gerbang mutu I-8 bukan hiasan melainkan syarat.

**Reproduksi** — `python analysis/da3_video_multi.py --videos 6 --frames 32`
(pembanding tanpa koreksi rotasi: tambahkan `--no-rotate`).

---

## E-005 — DA3 pada 4 dan 8 sisi foto asli (2026-07-21) · Ide I-2

**Hipotesis** — Keberhasilan DA3 pada video (E-004) belum membuktikan apa pun
untuk foto dataset: 4 posisi berjarak ~90° adalah *baseline* lebar dengan
tumpang tindih rendah pada objek yang menutupi dirinya sendiri. Diuji apakah DA3
tetap merekonstruksi geometri yang benar. Dipalsukan bila susunan pusat kamera
tidak lebih baik daripada tebakan acak, atau urutan sisi salah.

Geometri sebenarnya diketahui (operator memutari pohon pada 4 atau 8 posisi),
sehingga tersedia kebenaran acuan objektif: langkah sudut antar-sisi berurutan
seharusnya 90° (4 sisi) atau 45° (8 sisi).

**Cara** — `experiments/code/analysis/da3_sides_test.py`, `depth-anything/da3-large`,
`process_res=504`. 20 pohon 4-sisi dan 30 pohon 8-sisi, dipilih acak `seed=42`
dari 908 dan 45 pohon yang tersedia. Metrik: RMSE simpangan langkah sudut
terhadap nilai harapan, residual kecocokan lingkaran, rasio kerataan PCA, dan
kebenaran urutan melingkar. Pembanding: 2.000 simulasi sudut acak seragam.

**Hasil** —

| | 4 sisi (20 pohon) | 8 sisi (30 pohon) |
|---|---|---|
| Langkah sudut diharapkan | 90° | 45° |
| **RMSE sudut** (rata2 / median) | **17,3° / 12,6°** | **8,5° / 7,4°** |
| RMSE pembanding acak | 57,5° | 34,4° |
| **Urutan sisi benar** | **20/20 (100%)** | **30/30 (100%)** |
| Residual lingkaran | 4% | 5% |
| Rasio kerataan | 0,014 | 0,026 |
| Rentang dinamis kedalaman | 3,74 | 4,95 |
| Lebih baik dari acak | 100% | 100% |

Galat relatif keduanya konsisten: 17,3/90 = 19% dan 8,5/45 = 19%.

**Putusan** — **DIKONFIRMASI.** Risiko *wide baseline* yang dikhawatirkan tidak
terwujud. DA3 memulihkan susunan melingkar keempat/kedelapan sisi dengan urutan
benar pada **seluruh 50 pohon**, jauh di atas pembanding acak, dengan pusat
kamera yang hampir sebidang (kerataan 0,014–0,026).

**Peringatan dari inspeksi visual — jangan diabaikan:** pada pratinjau
(`results/e005/preview_*.jpg`), kedalaman memisahkan **pelepah** dari latar
dengan sangat bersih, tetapi di area mahkota tempat tandan berada peta tampak
**halus dan menyatu dengan batang**. Jadi geometri tingkat-pohon terbukti,
sementara pemisahan tingkat-tandan **belum terbukti** — padahal justru itu yang
menentukan B4. Angka RMSE sudut di atas **tidak boleh** dikutip seolah menjawab
pertanyaan tandan.

**Dampak** — Ide I-2 selesai dan positif pada tingkat pohon. Fondasi untuk I-6
dan I-7 tersedia. Namun sebelum melatih apa pun, pertanyaan tandan harus diuji
kuantitatif (→ E-006, ide I-9): apakah kedalaman di dalam kotak tandan berbeda
dari sekitarnya? Kalau tidak, fusi depth tidak akan menolong B4 berapa pun
arsitekturnya, dan itu harus diketahui sebelum jam GPU dibakar.

**Reproduksi** — `python analysis/da3_sides_test.py --trees 20 --sides 4` dan
`python analysis/da3_sides_test.py --trees 30 --sides 8 --preview 1`.

---

## E-006 — Sinyal kedalaman di tingkat tandan (2026-07-21) · Ide I-9 · [SR-005](SR/SR-005-sinyal-depth-tandan.md)

**Hipotesis** — Tandan yang tertanam/bertumpuk berada pada lapisan kedalaman
berbeda dari sekitarnya, sehingga kedalaman dapat memisahkan apa yang warna
tidak bisa (naskah §14). Dipalsukan bila kotak tandan tidak menunjukkan kontras
kedalaman lebih besar daripada kotak acak berukuran sama.

**Cara** — `experiments/code/analysis/depth_bunch_signal.py`, 40 pohon (780 kotak
kebenaran-dasar), kedalaman DA3 multi-view per pohon. Untuk tiap kotak:
bandingkan kedalaman di dalam kotak vs cincin sekelilingnya. **Kendali: 2 kotak
acak berukuran sama per kotak asli** (1.560 kendali) — perlu karena peta
kedalaman apa pun punya struktur, sehingga kotak apa pun menunjukkan kontras
tertentu. AUC lewat statistik-U Mann–Whitney; signifikansi lewat 2.000
permutasi. Dijalankan pada `process_res` 504 dan 1008.

**Hasil** —

| | kontras (504) | AUC (504) | kontras (1008) | AUC (1008) |
|---|---|---|---|---|
| Kotak tandan asli | 0,0089 | 0,6078 | 0,0096 | 0,6079 |
| Kotak acak kendali | 0,0341 | 0,5998 | 0,0364 | 0,5991 |
| **Selisih** | **−0,0252 (0,26×)** | +0,0080 | **−0,0268 (0,26×)** | +0,0088 |

p permutasi: 0,0245 (504), 0,0110 (1008). Per kelas pada 1008, **B4 justru
ber-AUC terendah: 0,6022**.

**Putusan** — **DIPALSUKAN.** Tandan tidak menonjol dalam kedalaman; kontrasnya
0,26× kotak acak, dan rasio itu **identik** pada dua resolusi sehingga bukan
artefak resolusi. Tandan tumbuh tertanam di ketiak pelepah, pada jarak praktis
sama dengan mahkota sekitarnya. Selisih AUC +0,009 signifikan secara statistik
(n besar) tetapi **ukuran efeknya dapat diabaikan** — jangan disajikan sebagai
"depth membawa sinyal".

**Dampak** — Versi "kedalaman sebagai pemisah tandan tingkat piksel" gugur, dan
**I-4 (4-kanal early fusion) diprediksi gagal** — prediksi ini dicatat *sebelum*
dijalankan agar tidak bisa dirasionalisasi belakangan. Yang **tidak** gugur:
geometri tingkat-pohon (E-004, E-005) tetap kokoh, sehingga I-6/I-7 justru
menjadi jalur paling menjanjikan karena memakai pose lintas-pandangan yang
terbukti, bukan kontras lokal yang baru dipalsukan.

**Reproduksi** — `python analysis/depth_bunch_signal.py --trees 40 [--process-res 1008]`

---

## E-007 — Penautan lintas-sisi geometris (2026-07-21) · Ide I-6/I-7 · [SR-006](SR/SR-006-penautan-geometris.md)

**Hipotesis** — Pose kamera DA3 memungkinkan penautan tandan lintas-sisi secara
geometris (tandan sama = titik 3D sama), mengalahkan koreksi statistik k=1,8905.
Dipalsukan bila mode sadar-pose tidak lebih baik daripada penampilan/depth/k.

**Cara** — `experiments/code/analysis/geometric_linking.py`, 141 pohon split uji. Tangga
ablasi §208: (A) hanya penampilan, (B) depth tanpa pose, (C) sadar-pose 3D,
(D) koreksi global k. Identitas = komponen terhubung union-find. Ambang disapu
(9 nilai untuk pose, 7 untuk lainnya).

**Hasil** — Validasi perangkat: jumlah mentah dan koreksi k direproduksi
**persis** dari DiB Tabel 4 (50,00/6,38/2,142/+2,142 dan 95,57/86,52/0,356/+0,009).

| Mode | Ambang terbaik | Class±1 | Tree±1 | MAE |
|---|---|---|---|---|
| A. penampilan | 0,1 | 77,13% | 32,62% | 0,876 |
| B. depth tanpa pose | 0,01 | 75,00% | 29,08% | 0,966 |
| C. sadar-pose (3D) | 1,0 | **69,50%** | 22,70% | 1,367 |
| D. koreksi global k | — | **95,57%** | 86,52% | 0,356 |

**Putusan** — **DIPALSUKAN.** Ketiganya kalah telak dari koreksi k, dan yang
geometris justru paling buruk. Sapuan ambang menutup kemungkinan salah setelan.
Batas klaim: kedalaman DA3 **relatif** bukan metrik, sehingga proyeksi balik
terdistorsi — eksperimen ini memalsukan **implementasi**, dan hanya melemahkan
idenya. Uji adil menuntut kedalaman metrik terkalibrasi (I-19).

**Dampak** — Koreksi k sangat kuat (95,57%) karena tandan per pohon sedikit
(median 10) dan duplikasi teratur (1,887). Ruang perbaikan di tahap counting
tipis. Bersama E-006, arah dipersempit tegas: sisa perbaikan harus dari
**detektor**. Prioritas berikutnya I-12 (ubin), I-13 (loss berimbang), I-15.

**Reproduksi** — `python analysis/geometric_linking.py --split test [--sweep]`

---

## E-009 — Ukuran kotak pada resolusi latih (2026-07-21) · Ide I-11/I-12

**Hipotesis** — B4 gagal (AP50 0,354) sebagian karena resolusi: pada
`imgsz=640`, citra 960×1280 diperkecil 2×, sehingga tandan kecil kehilangan
piksel sebelum masuk jaringan. Kalau benar, B4 akan jauh lebih kecil daripada
kelas lain dan banyak yang jatuh di bawah ambang "kecil" COCO.

**Cara** — `experiments/code/analysis/box_size_analysis.py`. Tanpa model sama sekali; hanya
mengukur geometri kotak kebenaran-dasar (train+test) setelah diskalakan ke
`imgsz=640`. Dijalankan **sebelum** hasil pelatihan ubin keluar, supaya
ekspektasinya tercatat lebih dulu.

**Hasil** —

| Kelas | n | Lebar×tinggi median (px) | Luas median | % kecil | % sedang | % besar |
|---|---|---|---|---|---|---|
| B1 | 1.831 | 63 × 69 | 4.361 | 2,6% | 82,6% | 14,8% |
| B2 | 3.112 | 57 × 64 | 3.626 | 4,4% | 86,0% | 9,6% |
| B3 | 8.742 | 52 × 56 | 2.886 | 8,8% | 85,1% | 6,1% |
| **B4** | 2.968 | **46 × 46** | **2.147** | **16,4%** | 81,2% | 2,5% |

**Putusan** — **SEBAGIAN MENDUKUNG, TETAPI MELEMAHKAN I-12.** Benar bahwa B4
paling kecil: luasnya ~separuh B1 dan 6× lebih sering masuk kategori "kecil"
COCO. Tetapi **81,2% kotak B4 masih tergolong sedang**, dengan median 46×46 px
— ukuran yang tidak problematis bagi detektor modern. Hanya 16,4% yang benar-
benar kecil.

**Dampak** — Ekspektasi terhadap I-12 (pelatihan berbasis ubin) **diturunkan
sebelum hasilnya keluar**. Ubin 2×2 akan memangkas proporsi "kecil" B4 dari
16,4% menjadi 0,2%, tetapi kalau resolusi bukan penyebab dominan, perbaikannya
akan tipis. Penyebab B4 yang lebih mungkin: **oklusi dan kontras rendah** —
tandan hitam tertanam di ketiak pelepah yang juga gelap. Itu mengarah ke ide
lain: augmentasi sadar-oklusi (I-16) dan analisis terstratifikasi oklusi (I-11),
bukan sekadar resolusi.

**Reproduksi** — `python analysis/box_size_analysis.py`

---

## E-010 — Diagnosis kegagalan B4 (2026-07-21) · Ide I-11 · [SR-007](SR/SR-007-diagnosis-b4.md)

**Hipotesis** — Kegagalan B4 (AP50 0,354) punya penyebab yang dapat diukur
langsung dari data, tanpa model. Tiga tersangka diuji berdampingan: kontras
fotometrik rendah, kepadatan/crowding, dan tumpang tindih antar-kotak.

**Cara** — `experiments/code/analysis/why_b4_fails.py` atas 400 citra uji. Kontras diukur di
ruang CIELAB antara isi kotak dan cincin sekelilingnya (ΔE, ΔLuminans, ΔWarna),
plus varians Laplacian sebagai ukuran tekstur. Kepadatan = jumlah kotak lain
yang pusatnya dalam 1,5× diagonal. **Kendali kotak acak** dipakai seperti E-006.

**Hasil** —

| Kelas | ΔE | ΔLuminans | Tekstur | Tetangga | IoU maks | %IoU>0,1 | AP50 DiB |
|---|---|---|---|---|---|---|---|
| B1 | **19,15** | 17,75 | 5.015 | 3,23 | 0,042 | 10,3% | 0,739 |
| B2 | 18,48 | 17,39 | 5.726 | 2,92 | 0,041 | 11,5% | 0,433 |
| B3 | 13,93 | 12,77 | 6.892 | 2,81 | 0,033 | 7,7% | 0,599 |
| **B4** | **11,55** | 9,93 | **7.780** | **2,58** | **0,029** | **6,4%** | **0,354** |
| *acak (kendali)* | *12,92* | *11,71* | *5.441* | — | — | — | — |

**Putusan** — **DIKONFIRMASI untuk kontras; kepadatan DIPALSUKAN.**

1. **B4 tersamar.** Kontrasnya (ΔE 11,55) **di bawah kotak acak** (12,92) —
   tandan B4 secara harfiah lebih sulit dibedakan dari latarnya daripada
   tambalan acak pada citra yang sama.
2. **Kepadatan bukan penyebab.** B4 justru punya tetangga paling sedikit (2,58)
   dan tumpang tindih paling rendah (IoU 0,029). Hipotesis "B4 gagal karena
   bertumpuk" dipalsukan.
3. **B2 gagal karena sebab berbeda.** Kontras latarnya tinggi (18,48) tetapi
   AP50 rendah — masalahnya bukan melihat tandan, melainkan membedakannya dari
   B3. Ini pemisahan (A) geometris vs (B) fotometrik yang dirumuskan di awal,
   kini **terukur**, bukan diasumsikan.

**Dampak** — Menyatukan tiga temuan menjadi satu gambaran yang koheren:
B4 **tidak** terpisah dalam kedalaman (E-006), **tidak** terpisah dalam warna
(E-010), dan **tidak** bertumpuk (E-010). Satu-satunya sinyal tersisa adalah
**tekstur**, dan justru di situ B4 tertinggi (7.780, tertinggi dari semua kelas).

Itu memberi dasar pemikiran **baru dan lebih kuat** untuk I-12: tekstur adalah
hal pertama yang hancur saat citra diperkecil 2×. Jadi ubin tetap layak diuji,
tetapi alasannya bukan "objeknya kecil" (E-009 melemahkan itu) melainkan
"petunjuk yang menentukan adalah frekuensi tinggi". Ekspektasi ini dicatat
**sebelum** hasil ubin keluar.

**Reproduksi** — `python analysis/why_b4_fails.py --images 400`

---

## E-011 — Praproses mana yang menaikkan keterpisahan B4? (2026-07-21) · Ide I-20 · [SR-008](SR/SR-008-kanal-tekstur.md)

**Hipotesis** — SR-007 menemukan B4 tersamar dalam warna tetapi bertekstur
tertinggi. Kalau begitu, praproses yang memperkuat kontras lokal atau tekstur
akan menaikkan keterpisahannya. Dipalsukan bila tidak ada praproses yang
menaikkan AUC B4 lebih dari 0,02 di atas acuan.

**Cara** — `experiments/code/analysis/contrast_boost_test.py`, 250 citra uji. Lima peta
skalar diuji (luminans asli, CLAHE, unsharp mask, besar gradien Sobel,
Laplacian). Metrik: AUC pemisahan piksel isi-kotak vs cincin, per kelas, dengan
**kendali kotak acak untuk tiap praproses**. Yang dinilai adalah selisih
terhadap kendali, bukan AUC mentah.

**Hasil** —

| Praproses | B1 | B2 | B3 | B4 | kendali | B4−kendali |
|---|---|---|---|---|---|---|
| asli (luminans) | 0,5897 | 0,6003 | 0,5753 | 0,5573 | 0,5659 | **−0,0086** |
| CLAHE | 0,5680 | 0,5833 | 0,5621 | 0,5534 | 0,5614 | −0,0080 |
| unsharp | 0,5696 | 0,5772 | 0,5582 | 0,5447 | 0,5513 | −0,0066 |
| gradien Sobel | 0,5682 | 0,5768 | 0,5909 | 0,6041 | 0,5674 | +0,0367 |
| **Laplacian** | 0,5673 | 0,5818 | 0,5970 | **0,6153** | 0,5695 | **+0,0458** |

Perbaikan Laplacian atas acuan: **+0,0544 AUC**.

**Putusan** — **DIKONFIRMASI untuk tekstur; DIPALSUKAN untuk penajam kontras.**
CLAHE dan unsharp — dugaan awal yang paling intuitif — justru sedikit
memperburuk. Yang berhasil adalah kanal **frekuensi tinggi murni**.

Yang paling menentukan: **urutan kelas berbalik**. Pada luminans asli B4 paling
tidak terpisah (0,5573, di bawah kendali); pada kanal Laplacian B4 menjadi
**kelas paling terpisah dari semuanya** (0,6153). B4 tak terlihat dalam
intensitas, tetapi terlihat dalam tekstur.

**Dampak** — Melahirkan **I-21: kanal keempat berisi tekstur, bukan kedalaman.**
Ini jauh lebih beralasan daripada RGB+D karena bersandar pada satu-satunya
sinyal yang terbukti membedakan B4 (E-006 memalsukan kedalaman, E-010
memalsukan warna dan kepadatan). Mesin 4-kanal dari I-4 dapat dipakai ulang
dengan menukar isi kanalnya.

**Reproduksi** — `python analysis/contrast_boost_test.py --images 250`

---

## E-012 — Plafon diskriminasi kematangan dari penampilan (2026-07-21) · Ide I-18 · [SR-009](SR/SR-009-ordinalitas-kelas.md)

**Hipotesis** — SR-001 gagal mengukur ambiguitas B2/B3 lewat `class_mismatch`.
SR-007 menunjukkan B2 punya kontras latar tinggi tetapi AP50 rendah, artinya
masalahnya membedakan kelas, bukan melihat tandan. Diuji langsung: dapatkah
kematangan dibedakan dari penampilan potongan kebenaran-dasar saja?

**Cara** — `experiments/code/analysis/class_separability.py`. Potongan diambil dari kotak
kebenaran-dasar sehingga **tahap deteksi dihilangkan sepenuhnya**. Fitur
sederhana dan dapat ditafsirkan (statistik LAB/HSV, varians Laplacian, besar
gradien, histogram hue = 37 dimensi). RandomForest 400 pohon, seimbang kelas,
6.000 potongan latih (1.500/kelas), 1.377 potongan uji.

**Hasil** —

Akurasi keseluruhan **52,87%** (tebak acak 25%).

| Sebenarnya | B1 | B2 | B3 | B4 | Recall |
|---|---|---|---|---|---|
| B1 | **177** | 44 | 15 | 16 | 70,2% |
| B2 | 64 | **159** | 106 | 46 | 42,4% |
| B3 | 7 | 90 | **156** | 122 | 41,6% |
| B4 | 8 | 43 | 88 | **236** | 62,9% |

Kebingungan pasangan terbesar: B3→B4 32,5%, B2→B3 28,3%, B3→B2 24,0%,
B4→B3 23,5%. Sebaliknya B3→B1 hanya **7 dari 375**.

**Putusan** — **DIKONFIRMASI: kebingungannya ORDINAL.** Kesalahan hampir
seluruhnya terjadi antar kelas bersebelahan pada rantai B1→B2→B3→B4, dan
nyaris tidak pernah melompat. Ini tanda khas satu **variabel kontinu**
(tingkat kematangan) yang dipotong menjadi empat kotak; batas kelasnya adalah
garis buatan pada rangkaian yang mulus.

**Batas klaim — penting.** Angka 52,87% diperoleh dari fitur buatan tangan yang
sengaja sederhana. Ini **batas BAWAH** keterpisahan, bukan plafon sebenarnya —
CNN hampir pasti lebih baik. Yang transferable dari eksperimen ini adalah
**struktur kebingungannya**, bukan angka absolutnya. Jangan mengutip 52,87%
sebagai "plafon akurasi kematangan".

**Dampak** — Melahirkan **I-22: loss ordinal / kepala regresi kematangan**,
yang menghukum kesalahan ke kelas tetangga lebih ringan daripada kesalahan
melompat. Menarik: metrik counting DiB (`Class ±1 Acc`) **sudah** mengakui
sifat ordinal ini, tetapi pelatihan detektornya memakai klasifikasi kategoris
biasa yang memperlakukan B2→B3 sama buruknya dengan B1→B4. Ada ketidakcocokan
antara objektif pelatihan dan metrik evaluasi — persis "mismatch objective-ke-
deployment" yang disebut `literature/references/deep-research-report.md`.

**Reproduksi** — `python analysis/class_separability.py --per-class 1500`

---

## E-013 — Pipeline produksi 4-kanal untuk sensor depth (2026-07-21) · `pipeline/`

**Konteks** — Arah baru dari pengguna: kamera lapangan berikutnya adalah
Orbbec Gemini (depth sensor sungguhan, bukan pseudo-depth). Dibutuhkan
pipeline matang: latih 4-kanal → bobot → inferensi lapangan yang menerima
RGB saja ATAU RGB+depth, tanpa mengubah aplikasi yang sudah ada.

**Hipotesis (rekayasa, falsifiable)** — Satu bobot bisa melayani dua mode uji
bila dilatih dengan *modality dropout* (kanal depth diganti nol dengan peluang
p saat latih; nol = "tidak ada data" di seluruh pipeline).

**Cara** — Kode di `pipeline/` (repo ini): `fourch.py` (kontrak pengodean
depth metrik inverse 0,3–8 m; patch pemuat; inflasi conv pertama; kelas
`Sawit4CH`), `prepare_depth.py`, `train_4ch.py`, `infer_4ch.py`. Uji asap CPU:
16 citra, 1 epoch, yolo26n — memverifikasi jalur kode, bukan kualitas model.

**Hasil** —
1. Latih→bobot→inferensi dua mode jalan ujung-ke-ujung. Bobot RGBD epoch-11
   (pelatihan GPU yang sedang berjalan) menghasilkan deteksi nyata lewat
   `Sawit4CH` pada kedua mode.
2. **Temuan yang bisa menggigit siapa pun yang memakai callback ultralytics:**
   `on_pretrain_routine_end` menyala SETELAH `ModelEMA(self.model)` disalin
   (`trainer.py` baris 383 vs 394), dan `best.pt` menyimpan EMA — jadi
   modifikasi bobot lewat callback itu **tidak masuk ke bobot tersimpan**
   kecuali `trainer.ema.ema` ikut ditambal. Diverifikasi: setelah menambal
   keduanya, norma kanal depth di `best.pt` = 0,0 persis dan bobot RGB = persis
   pratlatih (urutan BGR).
3. Urutan kanal konsisten: pembalikan BGR→RGB ultralytics hanya berlaku untuk
   3 kanal (`predictor.py:167`, `augment.py:2395`) — model 4-kanal melihat
   `[B,G,R,D]` di jalur latih maupun prediksi.

**Catatan penting** — `experiments/code/train/train_fusion.py` (I-4, sedang berjalan di GPU) TIDAK
memakai inflasi ini — conv pertamanya mulai acak. Bila RGBD/RGBT layak diulang,
ulangi lewat `pipeline/train_4ch.py` agar mulai dari bobot pratlatih penuh.

**Reproduksi** — lihat `pipeline/README.md`; uji asap: dataset mini 16 citra +
`train_4ch.py --epochs 1 --imgsz 320 --device cpu`.

---

## E-014 — Deteksi atau klasifikasi? (2026-07-21) · Ide I-23 · [SR-010](SR/SR-010-hambatan-klasifikasi.md)

**Konteks** — Sembilan ide diuji, mAP tidak bergerak. Pengguna melaporkan
berbulan-bulan mencoba teknik dari pustaka (termasuk SAHI) tanpa hasil. Sebelum
menjadwalkan ide ke-sepuluh, satu asumsi yang tidak pernah diperiksa harus
diperiksa: benarkah yang kurang itu kemampuan **menemukan** tandan?

**Hipotesis** — mAP menggabungkan dua kemampuan berbeda. Bila mAP kelas-agnostik
jauh di atas mAP 4-kelas pada bobot yang sama, maka kerugian ada di klasifikasi
kematangan, dan seluruh antrean ide berbasis deteksi salah alamat.

**Cara** — `experiments/code/eval/diag_bottleneck.py`: bobot identik (`rgb_e60_i640_s42/best.pt`),
val identik (404 citra), hanya bendera `single_cls` yang berbeda.

**Hasil** —

| Evaluasi | mAP50 | mAP50-95 | P | R |
|---|---|---|---|---|
| 4 kelas | 0,5218 | 0,2407 | 0,5307 | 0,5484 |
| Kelas-agnostik | **0,7191** | **0,3197** | 0,6950 | 0,6365 |

AP50 per kelas: B1 0,7354 · B2 0,4076 · B3 0,5561 · B4 0,3881.

**Putusan — DIKONFIRMASI.** 38% mAP50 yang mungkin diraih hilang di klasifikasi.
Efektivitas klasifikasi terukur 0,5218/0,7191 = **72,6%**. mAP50-95 agnostik
0,3197 sudah melewati sasaran 0,30.

**Dampak** — Antrean lama (ubin I-12, RGBT I-21, ordinal I-22, RGBD I-4)
dihentikan; I-4 berhenti di epoch 25/60 dengan mAP50 terbaik 0,5135 vs baseline
0,5214 — kurva datar, tanpa sinyal. Seluruh GPU dialihkan ke **I-23: detektor
dua tahap** (deteksi agnostik resolusi 960 + pengklasifikasi kematangan pada
potongan resolusi asli). Melahirkan pula **I-24**: augmentasi baseline memakai
`hsv_s=0.7` — mengacak saturasi ±70% pada tugas yang buktinya adalah warna.

**Reproduksi** — `python eval/diag_bottleneck.py`

---

## E-015 — Master mentah 3024×4032 terbuka (2026-07-21) · Ide I-2/I-23 · [SR-002](SR/SR-002-resolusi-master-mentah.md)

**Konteks** — SR-002 berstatus TIDAK KONKLUSIF (terblokir) sejak awal: nama
berkas master mentah tidak unik secara global (3.992 berkas, hanya 1.352 nama
unik, 936 nama kembar antar folder `Kelompok N`), sehingga pemetaan raw ↔
anotasi tidak bisa dilakukan lewat nama. E-014 membuat blokade ini mendadak
mahal: kalau hambatan mAP ada di penilaian kematangan, dan kematangan dinilai
dari permukaan buah, maka resolusi permukaan buah adalah sumber daya yang
paling langsung relevan — dan ia terkunci.

**Hipotesis** — Kedua tingkat adalah citra yang sama pada skala berbeda, jadi
pencocokan berbasis ISI menyelesaikan pemetaan tanpa tabel dari tim.

**Cara** — `experiments/code/build/match_raw.py`: tiap citra diperkecil lewat penskalaan DCT JPEG
(`IMREAD_REDUCED_*_8`), disamakan orientasinya ke potret, diringkas jadi vektor
abu-abu 32×40 yang dinormalkan (rerata 0, norma 1). Kecocokan = hasil kali titik
tertinggi, diverifikasi tiga lapis: skor > 0,90, jarak ke peringkat kedua
> 0,02, dan pemetaan dipaksa satu-ke-satu.

**Hasil** —

| Besaran | Nilai |
|---|---|
| Citra MVC | 3.992 |
| Citra master mentah | 3.992 |
| **Cocok** | **3.992 (100%)** |
| Ditolak karena skor lemah | 0 |
| Ditolak karena ambigu | 0 |
| Skor kecocokan **terendah** | 0,9985 |
| Selisih median ke peringkat kedua | 0,353 |

Contoh: `DAMIMAS_A21B_0001_1.jpg` → `Damimas/Kelompok 1/DAMIMAS_A21B_001_1.jpg`
(perhatikan penomoran 4 digit vs 3 digit yang membuat pencocokan nama gagal).

**Putusan — SR-002 TIDAK LAGI TERBLOKIR.** Skor terendah 0,9985 dengan selisih
median 0,353 tidak menyisakan ruang keraguan: tidak ada satu pun pasangan yang
"nyaris cocok". Karena rasio aspek kedua tingkat identik (0,75), koordinat YOLO
ternormalisasi berlaku persis — **tidak perlu anotasi ulang**.

**Dampak** — Potongan tandan bisa diambil pada 3024×4032, tempat tandan
bermedian ~220–300 px, bukan ~70–95 px seperti di SawitMVC. Pada MVC, potongan
masukan 224 px sebenarnya hasil **pembesaran** — tidak ada detail baru, hanya
interpolasi. Di master, 224 px berisi detail permukaan buah yang sebenarnya.
Ini menjadi masukan tahap 2 dari I-23.

**Reproduksi** — `python build/match_raw.py` (CPU, beberapa menit) → `experiments/results/E-015/raw_map.json`

---

## E-016 — Plafon kematangan, diukur tiga kali (2026-07-21) · Ide I-23 · [SR-011](SR/SR-011-plafon-kematangan.md)

**Konteks** — SR-010 memberi sasaran tajam: klasifikasi kematangan harus ≈83%
supaya mAP50 mencapai 0,60. E-016 menguji apakah angka itu bisa dicapai.

**Cara** — Tiga jalur bebas pada tugas identik (diberi kotak, tebak kelas):
head YOLO (`experiments/code/analysis/head_vs_crop.py`), CNN ConvNeXt-Tiny pada potongan master
3024×4032 (`experiments/code/build/build_crops_raw.py` + `experiments/code/train/train_maturity.py`), dan voting antar-sisi
dengan penautan kebenaran dasar (`experiments/code/analysis/multiview_vote.py`).

**Hasil** —

| Jalur | Akurasi | ±1 |
|---|---|---|
| Head YOLO (n=1.518) | 0,6871 | **1,0000** |
| CNN potongan master, val | 0,6910 | 0,9947 |
| CNN potongan master, test | 0,6998 | 0,9946 |
| Voting multi-sisi (992 tandan) | 0,6855 | 0,9940 |

Voting menurut jumlah sisi: 1 sisi 0,6250 · 2 sisi 0,7095 · 3 sisi 0,6506 ·
4 sisi 0,7391.

Varian perumusan metrik pada prediksi baseline yang sama (COCO):

| Perumusan | mAP50 | mAP50-95 |
|---|---|---|
| 4 kelas | 0,5153 | 0,2384 |
| Kelas-agnostik | 0,7125 | 0,3178 |
| B2+B3 digabung | 0,5829 | 0,2669 |
| Toleransi ±1 (deteksi digandakan) | 0,3467 | 0,1653 |
| Toleransi ±1 (GT digandakan) | 0,5029 | 0,2235 |

**Putusan — DIKONFIRMASI, plafonnya nyata.** Resolusi 3× tidak menolong; 2–6
sudut pandang tidak menolong. Head YOLO meleset lebih dari satu tingkat pada
**nol** dari 1.518 deteksi. Voting multi-sisi gagal karena kesalahannya
**berkorelasi antar sisi** — ambiguitas melekat pada buahnya.

**Temuan sampingan yang penting** — **mAP tidak dapat mewakili toleransi
ordinal.** Kedua cara memaksakannya justru menurunkan angka: menggandakan
deteksi meledakkan positif palsu, menggandakan GT meledakkan yang harus
ditemukan. Metrik deployment DiB `Class ±1 Acc` adalah metrik **penghitungan**,
dan tidak punya padanan di ruang metrik deteksi. Pelaporan yang jujur karena
itu harus memisahkan dua angka: AP deteksi kelas-agnostik, dan akurasi
kematangan (dengan ±1) — persis dekomposisi SR-010.

**Reproduksi** — `experiments/code/analysis/head_vs_crop.py`, `experiments/code/analysis/multiview_vote.py`, `experiments/code/eval/metric_variants.py`

---

## E-017 — Detektor dua tahap (2026-07-21) · Ide I-23 · [SR-012](SR/SR-012-dua-tahap.md)

**Konteks** — SR-010 memisahkan deteksi dari klasifikasi; SR-011 mengukur
plafon klasifikasi ~68%. I-23 menguji apakah memisahkan keduanya secara
arsitektural memberi mAP 4-kelas yang lebih baik daripada satu tahap.

**Cara** — Tahap 1: `experiments/code/train/train_agnostic.py`, yolo26m `single_cls=True`, imgsz 960,
diinisialisasi dari baseline RGB yang sudah konvergen. Tahap 2: ConvNeXt-Tiny
pada potongan master 3024×4032 (E-015). Skor gabungan = skor objek × peluang
kelas, tiap kotak menyumbang ke keempat kelas — cara skor detektor dua-tahap
klasik, bukan penyetelan angka. Evaluasi memakai pycocotools (bukan
implementasi sendiri); konsistensi evaluator diverifikasi terhadap ultralytics
pada baseline (0,5153/0,2384 vs 0,5218/0,2407).

**Integritas** — Split per pohon 716/96/141, irisan train-val, train-test, dan
val-test semuanya **nol**. Konfigurasi dipilih pada val; test hanya dilaporkan.

**Hasil tahap 1** — Dipotong pada epoch 6 dari 25 karena anggaran waktu; epoch
6 kebetulan yang terbaik.

| Deteksi kelas-agnostik | mAP50 | mAP50-95 |
|---|---|---|
| Baseline 4-kelas dievaluasi agnostik (640) | 0,7191 | 0,3197 |
| **Tahap 1 khusus agnostik (960, 6 epoch)** | **0,7730** | **0,3320** |

**Hasil tahap 2** — Dua rezim pelatihan, dua mode gagal yang berlawanan:

| Pengklasifikasi | val acc | val seimbang | Catatan |
|---|---|---|---|
| v1 (potongan MVC, tanpa penyeimbang) | 0,6910 | 0,6116 | runtuh ke B3 (B2 recall 0,317, B4 0,386) |
| v2 (potongan master, pencuplikan berimbang) | 0,5350 | 0,6656 | terlalu jauh mengoreksi (B3 recall 0,318) |
| Head YOLO (acuan) | 0,6871 | 0,6484 | — |

Augmentasi tahap 2 sengaja **aman-warna**: baseline YOLO memakai `hsv_s=0.7`
yang mengacak saturasi ±70% pada tugas yang buktinya adalah warna.

**Reproduksi** — `experiments/code/train/train_agnostic.py`, `experiments/code/build/build_crops_raw.py`,
`experiments/code/train/train_maturity_v2.py --root crops_raw`, `experiments/code/analysis/two_stage.py --crop-source raw`

---

## E-018 — Plafon lokalisasi: apakah 0,60/0,30 mungkin secara geometris? (2026-07-21) · Ide I-24

**Konteks** — Pengguna menetapkan sasaran tegas: **mAP50 0,60 dan mAP50-95 0,30
pada 4 kelas penuh**, tanpa mendefinisikan ulang metrik. Sebelum menghabiskan
berjam-jam GPU, satu hal harus diketahui: apakah kotak anotasinya sendiri cukup
ketat untuk memungkinkannya? mAP50-95 merata-ratakan ambang IoU sampai 0,95 —
kalau kotak GT digambar longgar, tidak ada model yang bisa mencapainya.

**Cara** — `experiments/code/analysis/loc_ceiling.py`: untuk tiap kotak GT val, IoU tertinggi dengan
deteksi mana pun (kelas diabaikan, conf 0,05). Pecahan GT yang tercapai pada
tiap ambang COCO memberi batas atas mAP bila kelas dan peringkat skornya
sempurna.

**Hasil** —

| | Baseline 640 | Agnostik 960 (6 epoch) |
|---|---|---|
| GT tercapai IoU≥0,50 | 0,8834 | 0,8786 |
| GT tercapai IoU≥0,75 | 0,4494 | 0,3975 |
| GT tercapai IoU≥0,90 | **0,0376** | 0,0254 |
| Median IoU terbaik | 0,7303 | 0,7110 |
| **Plafon mAP50 (kelas sempurna)** | **0,8834** | 0,8786 |
| **Plafon mAP50-95 (kelas sempurna)** | **0,4702** | 0,4448 |

**Putusan — SASARAN BERADA DI DALAM PLAFON.** mAP50 0,60 = 68% dari 0,8834;
mAP50-95 0,30 = 64% dari 0,4702. Posisi saat ini 59% dan 51%. Yang dituntut
adalah menutup celah klasifikasi dan peringkat skor, **bukan** menembus batas
ketelitian anotasi.

**Peringatan yang jujur** — hanya 3,76% kotak GT tercapai pada IoU≥0,90 dan
median IoU 0,73. Batas tandan memang kabur (buah menyatu dengan pelepah), jadi
mAP50-95 akan selalu jauh lebih berat daripada mAP50 di dataset ini.

**Koreksi terhadap E-016** — klaim "tiga pengukuran bebas" di SR-011 **cacat
dan ditarik**: voting multi-sisi memakai pengklasifikasi potongan yang sama
(jadi bukan pengukuran ketiga yang bebas), dan head YOLO dilatih dengan
`hsv_s=0.7` sedangkan pengklasifikasi potongan dilatih aman-warna — jadi
perbandingannya tidak setara. Angka 68% tetap dilaporkan apa adanya, tetapi
**tidak boleh dibaca sebagai plafon**. Jalur langsungnya — detektor 4-kelas
resolusi tinggi dengan augmentasi aman-warna — belum pernah diuji sampai E-019.

**Dampak** — Membuka **E-015 → dataset master**: `experiments/code/build/build_master_ds.py` menautkan
3.000/404/588 citra ke piksel master 3060×4080 (rasio 0,75, identik dengan MVC)
tanpa anotasi ulang dan tanpa menyalin 16 GB. Pada SawitMVC, `imgsz=1280` sudah
memakai seluruh piksel yang ada; master memungkinkan `imgsz` 1600–2048 berisi
detail nyata.

**Reproduksi** — `experiments/code/analysis/loc_ceiling.py`, `experiments/code/build/build_master_ds.py`

---

## E-019 — Detektor 4-kelas resolusi tinggi + augmentasi aman-warna (2026-07-21) · Ide I-24

**Konteks** — Setelah menarik klaim plafon (E-018), jalur paling langsung untuk
sasaran 0,60/0,30 diuji: serang tepat di klasifikasi kematangan, dari dalam
detektor 4-kelas satu tahap. Dua koreksi sekaligus — (a) augmentasi aman-warna
(`hsv_s` 0,7 → 0,15; kematangan adalah warna), (b) resolusi asli 1280 (dari 640).

**Cara** — `experiments/code/train/train_4cls_hi.py`, yolo26m diinisialisasi dari baseline yang sudah
konvergen, 50 epoch, kosinus, `close_mosaic=15`.

**Hasil** — Puncak val **mAP50 0,5263 (epoch 9) · mAP50-95 0,2361 (epoch 7)**.
Pada epoch yang sama detektor ini unggul dari baseline (ep 10: 0,5062 vs 0,4777),
tetapi puncaknya hanya menempel baseline (0,5218/0,2407) dan menurun setelahnya —
fase pasca-mosaic (epoch 35+) tidak memberi lompatan. Dihentikan pada epoch 41.

**Putusan — MENEMPEL BASELINE, tak cukup.** Diagnosis: memulai dari bobot 640
yang sudah konvergen lalu memaksanya ke 1280 mengganggu model, dan 50 epoch tak
cukup untuk pulih dari cekungan lokal itu. Bukan bukti augmentasi/resolusi tak
membantu — bukti bahwa **fine-tuning dari checkpoint resolusi lain adalah strategi
yang salah**; run berikut (yolo26x, RT-DETR) mulai bersih dari COCO.

**Reproduksi** — `python train/train_4cls_hi.py --imgsz 1280 --hsv-s 0.15`

---

## E-020 — RT-DETR sebagai detektor NMS-free (2026-07-21) · Ide I-14 · [SR-013](SR/SR-013-rtdetr-nms-free.md)

**Konteks** — Semua yang menempel plateau berasal dari keluarga YOLO, yang
memakai NMS. `literature/references/deep-research-report.md` menempatkan NMS-free sebagai prioritas 1:
NMS greedy dapat menekan kotak benar pada objek rapat/bertumpuk — persis tandan
di mahkota.

**Hipotesis** — Bila sebagian plafon deteksi berasal dari NMS, RT-DETR (Hungarian
satu-ke-satu, tanpa NMS) mengangkatnya, khususnya recall pada tandan bertumpuk.

**Cara** — `experiments/code/train/train_rtdetr.py`, RT-DETR-L (33,0 juta parameter), 1280, aman-warna,
60 epoch dari bobot COCO. Menguji hipotesis MEKANISME (bukan kapasitas), jadi
bebas dari jalur yolo26x.

**Cara (detail varian)** — RT-DETR-L (ultralytics 8.4.103, `rt-detr-l.yaml`):
backbone HGNetv2-L, encoder AIFI + RepC3, RTDETRDecoder (tanpa NMS),
**32.970.476 param**, 103,4 GFLOPs. Dihentikan ep52/60 setelah mosaic-off (ep50)
tak memberi lonjakan; `best.pt` = epoch fitness-terbaik (ep25).

**Hasil (best.pt, dievaluasi ulang bersih):**

| | mAP50 | mAP50-95 | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|---|
| VAL baseline | 0,5218 | 0,2407 | 0,7354 | 0,4076 | 0,5561 | 0,3881 |
| **VAL RT-DETR** | 0,5466 | 0,2543 | 0,7503 | 0,4413 | 0,5808 | 0,4138 |
| TEST baseline | 0,5161 | 0,2457 | 0,7410 | 0,4016 | 0,5894 | 0,3323 |
| **TEST RT-DETR** | **0,5794** | **0,2694** | 0,7891 | 0,4685 | 0,6391 | **0,4208** |

**Putusan — DIKONFIRMASI (arah), target belum tercapai.** Detektor 4-kelas
terbaik sejauh ini: unggul di keempat kelas pada kedua split, **+0,063 mAP50
test**, dan gain terbesar di **B4 (+0,0885)** — kelas paling padat/tersamar,
persis tanda tangan hipotesis NMS-free. Test tinggal −0,021 dari sasaran mAP50
0,60. **Koreksi prediksi:** selama pelatihan saya menduga plateau/DIPALSUKAN —
keliru, itu membaca last.pt yang overfit; best.pt jauh lebih baik.

**Dampak** — RT-DETR jadi tulang punggung baru menggantikan yolo26m. Lanjutan:
latih di piksel master (imgsz 1600–2048), dan RT-DETR-X (67,5 juta).

**Reproduksi** — `python train/train_rtdetr.py --weights rtdetr-l.pt --imgsz 1280`
lalu `python eval/eval_rtdetr.py`

---

## E-021 — RF-DETR-L: transformer NMS-free DINOv2 vs RT-DETR (2026-07-24) · Ide I-14 · lanjutan [E-020]

**Konteks** — E-020 mengonfirmasi arah NMS-free (RT-DETR-L) mengalahkan keluarga
YOLO. RF-DETR-L (backbone **DINOv2** pra-latih + kepala LW-DETR hasil NAS) adalah
transformer NMS-free generasi lebih baru. Pertanyaannya bukan kapasitas melainkan
apakah pada setelan **identik & adil** ia melampaui RT-DETR-L.

**Hipotesis** — RF-DETR-L layak jadi pembanding bila pada val identik ia
(a) melampaui yolo26m dan (b) mendekati/melampaui RT-DETR-L pada kedua metrik.
**DIPALSUKAN** bila run konvergen tertinggal dari RT-DETR-L pada kedua metrik.
Test hanya dilaporkan setelah checkpoint dipilih dari val.

**Cara** — `experiments/code/train/train_rfdetr.py` + `experiments/code/build/build_rfdetr_ds.py` (adaptor dataset YOLO tanpa
salin citra, split identik E-017 3000/404/588). RFDETRLarge (rfdetr 1.8.3,
**35,65 juta param**, DINOv2 patch-16 + 2-window), resolusi **1280 tepat**
(kelipatan 32; sama RT-DETR), dari bobot COCO `rf-detr-large-2026`, batch efektif
16 (batch 8 × grad-accum 2). Early-stopping patience 8 → berhenti ep17, checkpoint
terbaik **ep9 (EMA)**.

**Fairness (dijaga ketat)** — (1) Resolusi 1280 identik: default rf-detr
`multi_scale`+`expanded_scales` diam-diam mengunci ke skala TERBESAR (1440);
**dimatikan** agar benar-benar 1280. (2) Split, augmentasi aman-warna, effective
batch sekelas RT-DETR. (3) `.evaluate()` tak ada di rfdetr 1.8.3 → pakai
`run_test=True`; GPU L4 sempat kelaparan data (num_workers default 2) — dinaikkan
ke 8; batch16/workers32 meledak `/dev/shm` 26 GB → turun ke 8/8.

**Hasil (checkpoint ep9 EMA; per-kelas AP50 via COCO eval `experiments/code/eval/eval_rfdetr_perkelas.py`):**

| | mAP50 | mAP50-95 | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|---|
| VAL RT-DETR | 0,5466 | 0,2543 | 0,7503 | 0,4413 | 0,5808 | 0,4138 |
| **VAL RF-DETR** | **0,5695** | **0,2604** | 0,775 | 0,446 | 0,594 | **0,464** |
| TEST RT-DETR | 0,5794 | 0,2694 | 0,7891 | 0,4685 | 0,6391 | 0,4208 |
| **TEST RF-DETR** | **0,6038** | **0,2770** | 0,817 | 0,497 | 0,668 | 0,433 |

Sanity: val pycocotools saya (0,5695) cocok evaluator internal rf-detr (0,5699 EMA)
→ pipeline tervalidasi. `run_test` bawaan melaporkan test 0,5837/0,2653 memakai
checkpoint `best_total` (berbeda); angka di atas EMA konsisten val↔test.

**Putusan — DIKONFIRMASI.** RF-DETR-L melampaui RT-DETR-L (dan yolo26m) pada val
kedua metrik (+0,023 mAP50, +0,006 mAP50-95) dan pada test (+0,024 mAP50,
+0,008 mAP50-95). **Detektor 4-kelas terbaik baru.** Test mAP50 0,604 melewati
sasaran 0,60. Kelas tersulit tetap B4.

**Caveat kesetaraan (dicatat, sedang ditangani)** — yolo26m (21,9 jt, imgsz 640)
BUKAN pembanding sekelas RT-DETR-L (33,0 jt) / RF-DETR-L (35,7 jt @1280).
Pembanding YOLO adil = **YOLO26l (26,3 jt) @1280** config identik RT-DETR —
**BERJALAN** (`experiments/code/train/train_yolo26l.py`). Evaluator juga campur (yolo/rtdetr via
ultralytics `.val()`, rf-detr via pycocotools); unifikasi 1-protokol
`experiments/code/eval/eval_all_pycoco.py` → `experiments/results/E-021/perkelas_pycoco.json` **BERJALAN**.

**Dampak** — RF-DETR-L jadi detektor terbaik menggantikan RT-DETR-L (E-020).
Lanjutan: selesaikan YOLO26l + tabel 1-protokol; pertimbangkan latih di piksel
master.

**Reproduksi** — `python build/build_rfdetr_ds.py` → `python train_rfdetr.py --dataset
rfdetr_ds --epochs 60 --resolution 1280 --batch 8 --grad-accum 2 --workers 8` →
`python eval/eval_rfdetr_perkelas.py`. Metrik: `experiments/results/E-021/perkelas_fair.json`,
`experiments/runs/rfdetr_l_e60_i1280/evaluation.json` + `metrics.csv`.

**Lanjutan (2026-07-25) — dua caveat E-021 diselesaikan:** (1) Baseline YOLO
**param-adil YOLO26l** (26,3 jt, config IDENTIK RT-DETR: 1280/60ep/color-safe/
seed42/cos_lr/COCO) dilatih penuh — `experiments/code/train/train_yolo26l.py`, best val ep31. (2) Semua
4 model dievaluasi lewat **1-protokol pycocotools** (`experiments/code/eval/eval_all_pycoco.py` →
`experiments/results/E-021/perkelas_pycoco.json`), menghapus caveat evaluator campur. Hasil
1-protokol (mAP50/mAP50-95):

| Model | Param | VAL | TEST |
|---|---|---|---|
| YOLO26m | 21,9 jt | 0,5195 / 0,2411 | 0,5165 / 0,2452 |
| YOLO26l | 26,3 jt | 0,5270 / 0,2526 | 0,5300 / 0,2568 |
| RT-DETR-L | 33,0 jt | 0,5459 / 0,2555 | 0,5784 / 0,2707 |
| **RF-DETR-L** | 35,7 jt | **0,5695 / 0,2604** | **0,6038 / 0,2770** |

Ranking = urutan parameter di semua metrik/split. **YOLO26l (param-adil) tetap di
bawah kedua DETR** → keunggulan RF-DETR/RT-DETR **bukan efek kapasitas/resolusi**,
melainkan arsitektur NMS-free. Putusan E-021 makin kuat. Tabel penuh per-kelas:
[METRICS.md](METRICS.md) §1-protokol. Reproduksi: `python train/train_yolo26l.py` →
`python eval/eval_all_pycoco.py`.

**Laporan per-ide:** [SR-014](SR/SR-014-rfdetr-dinov2.md) (ditulis 25 Juli 2026).

---

## E-022 — Depth SENSOR Orbbec pada SawitMVC-Depth: registrasi + 4-kanal simultan (2026-07-29) · Ide I-4/I-8 · [SR-015](SR/SR-015-depth-sensor-4kanal.md)

> ### ⚠ PENCABUTAN SEBAGIAN — 2026-07-30
>
> **Seluruh kesimpulan arah-efek di entri ini bertumpu pada SATU seed (42) dan
> tidak bertahan saat direplikasi.** Replikasi 3 seed pada dua arsitektur
> (12 run YOLO26n + 9 run RT-DETR-L, 60 epoch, split per-pohon identik)
> menunjukkan:
>
> - **YOLO26n:** Δ(RGB-D − RGB) = +0,0252 / −0,0063 / −0,0013 pada seed
>   42/1337/2024. Rerata +0,0059, dan CI95 ketiganya melewati nol
>   (P(>0) = 0,851 / 0,436 / 0,406). Angka +0,0252 yang dilaporkan di bawah
>   adalah **seed paling menguntungkan dari tiga**, bukan efek yang dapat
>   dipertahankan. Pernyataan yang benar: **tidak dapat dibedakan dari nol.**
> - **B4 hanya punya 95 kotak** di dataset ini, dan AP B4 bergerak
>   0,0945 → 0,3147 hanya karena ganti seed. Seluruh Δ agregat yang
>   diperdebatkan di entri ini (±0,04) **lebih kecil daripada lantai derau
>   antar-seed pada satu kelas yang memegang 25% bobot macro-mAP.**
>
> **Dua lengan kontrol di bawah dibuat dengan kode cacat** dan angkanya tidak
> sah (lihat [AUDIT-E022.md](AUDIT-E022.md)):
> - lengan **depth pohon LAIN** mengambil donor lintas split — 192/980 citra
>   train memakai depth pohon **test**. Setelah diperbaiki, angkanya turun
>   0,3771 → 0,3301 (−0,0470). Klaim "registrasi tidak memberi apa pun"
>   **tidak lagi didukung**.
> - lengan **derau** memakai satu RNG bersama sehingga kanal ke-4 diacak ulang
>   tiap epoch — ia diam-diam mendapat augmentasi. Setelah diperbaiki derau
>   justru **naik** (RT-DETR-L 0,3552 → 0,3894), jadi temuan "derau
>   mengalahkan depth" bertahan dan bahkan diperkuat.
>
> Angka multi-seed protokol beku sedang diproduksi; entri ini akan
> **direstrukturisasi**, bukan ditambal. Sampai itu selesai, jangan mengutip
> arah-efek dari entri ini.
>
> ### ✅ RESTRUKTURISASI SELESAI — 2026-08-01
>
> Restrukturisasi yang dijanjikan di atas **sudah dilaksanakan**, dan sesuai
> aturan append-only ia berbentuk **entri-entri baru**, bukan suntingan pada
> entri ini. Angka di bawah dipertahankan utuh sebagai rekam seed-42; yang
> menggantikannya:
>
> | Entri | Menggantikan bagian mana |
> |---|---|
> | [E-025](EKSPERIMEN.md) | Selisih evaluator yang belum terjelaskan — terlacak: menskala dengan jumlah deteksi. `hasil.json` dilarang untuk perbandingan antar lengan |
> | [E-027](EKSPERIMEN.md) | Seluruh arah-efek YOLO26n. Matriks 12 run (4 modal × 3 seed): depth − RGB rerata **−0,0230**, dua seed signifikan NEGATIF |
> | [E-029](EKSPERIMEN.md) | Seluruh arah-efek RT-DETR-L. Matriks 9 run: klausa "depth terpakai pada kapasitas tinggi" **DICABUT PENUH** |
> | [E-030](EKSPERIMEN.md) | Klaim "kapasitas menentukan arah efek" — dipersempit: benar untuk kanal tanpa informasi, tidak untuk depth-vs-derau |
> | [E-031](EKSPERIMEN.md) | Keterbatasan "varians split belum diukur" — terukur 0,0488 pada lengan RGB |
>
> **Tidak ada angka di entri ini yang boleh dikutip.** Seluruhnya bertumpu pada
> satu seed, dua lengan kontrol berkode cacat, dan evaluator yang kini terlarang
> untuk perbandingan antar lengan. Untuk keadaan terkini mulai dari
> [STATUS.md](STATUS.md); untuk metrik terukur seluruh run lihat
> [METRIK-LENGKAP.md](METRIK-LENGKAP.md).

**Konteks** — Dataset baru `ULM-DS-Lab/SawitMVC-Depth` (352 pohon, 1.408 citra
RGB 1280×800, depth sensor Orbbec Y16 848×480 uint16le milimeter, 2.299 kotak
B1–B4) menyediakan hal yang selama ini kosong di STATUS.md §5: **depth SENSOR
sungguhan**, bukan pseudo-depth. Sampai E-021 hanya pseudo-depth yang pernah
diuji (E-006/SR-005, dipalsukan). Integritas 6.336 artefak diverifikasi
SHA-256 terhadap `manifests/`: 0 hilang, 0 tidak cocok.

**Peringatan pembanding, ditulis di depan** — angka apa pun di entri ini **tidak
sebanding** dengan test mAP50 0,6038 milik E-021. Dataset berbeda: prior kelas
terbalik (B3 52,3% → 14,0%; B1 11,0% → 36,1%), kotak ~2× lebih besar relatif,
orientasi berubah (960×1280 potret → 1280×800 lanskap), anotasi 18.540 → 2.299.
Satu-satunya klaim sah adalah **selisih RGB-D minus RGB di dalam dataset ini**
pada protokol identik.

### E-022a — Apakah depth benar-benar sudah tersejajar ke RGB?

**Hipotesis (H-022c)** — Buffer depth 848×480 sudah tersejajar ke bidang color
sebagaimana klaim sidecar `"alignedTo": "color"`, sehingga `cv2.resize` ke
1280×800 sudah cukup (asumsi yang dipakai `pipeline/prepare_depth.py`).
**Dipalsukan bila** geometri kalibrasi atau uji empiris menunjukkan buffer masih
di grid kamera depth.

**Cara** — `build/depth_calib.py` (parser kalibrasi per-berkas + reproyeksi),
`analysis/verify_depth_align.py` (uji berbasis kotak anotasi), `analysis/verify_depth_mi.py`
(mutual information agregat + kontrol pergeseran, bootstrap berpasangan 2000×).

**Hasil — DIPALSUKAN, tiga bukti independen:**

1. **Geometri kalibrasi.** Intrinsik depth (fx=fy=416,55, piksel persegi) bukan
   versi terskala intrinsik color: 610,87·848/1280 = 404,7 pada x tetapi
   610,87·480/800 = 366,5 pada y — tidak persegi, tidak konsisten.
2. **Tidak ada pita kosong struktural.** FOV vertikal color 66,4° > depth 59,9°.
   Bila depth sudah di-resample ke bidang color, ~34 baris atas dan ~28 baris
   bawah wajib kosong di setiap citra. Terukur: **0 baris dan 0 kolom** yang
   selalu-invalid.
3. **Mutual information.** MI(depth; abu-abu RGB) atas 150 citra:

   | Pemetaan | MI (bit) |
   |---|---|
   | H1 resize langsung | 0,2546 |
   | H2 affine-intrinsik | 0,2591 |
   | **H3 reproyeksi penuh** | **0,2852** |
   | H3 digeser +24 px (kontrol) | 0,2385 |
   | H3 digeser −24 px (kontrol) | 0,2320 |

   Selisih berpasangan **H3 − H1 = +0,0306 bit, CI95 [0,0260; 0,0354]** (tidak
   memuat 0), H3 menang di **84%** dari 150 citra. Kontrol pergeseran buatan
   menurunkan MI → metrik memang peka terhadap registrasi.

**Putusan — DIPALSUKAN.** Label `alignedTo: "color"` menyesatkan; buffer masih di
grid kamera depth pabrikan. Resize naif meleset **median 29,3 px, maksimum 61 px**
pada bidang 1280×800 — seukuran tandan B4 itu sendiri. Memakainya akan
menghasilkan hasil negatif palsu yang terbaca sebagai "depth tidak menolong",
persis skenario D3Net (entri 037).

**Dampak** — `pipeline/prepare_depth.py` **tidak boleh dipakai untuk dataset ini**.
Diganti `build/reproject_depth.py`: depth → titik 3D (intrinsik depth) → ekstrinsik →
intrinsik color + distorsi Brown-Conrady K6, forward-warp **ber-z-buffer** (tanpa
ini latar menimpa objek di tepi oklusi — justru sinyal yang dicari untuk B4),
tambal lubang **median 3×3** (operator ranking, bukan blur yang menghasilkan
kedalaman hantu melintasi batas objek).

Dua temuan pendamping yang mengubah konfigurasi:

- **Ada DUA unit kamera**, bukan satu: 660 berkas fx_depth=416,55 dan 748 berkas
  fx_depth=414,38, rotasi ekstrinsik 0,064° vs 0,562°. Kalibrasi **wajib dibaca
  per berkas**; hardcode satu set = separuh dataset salah proses, dan biasnya
  berkorelasi dengan perangkat sehingga bocor ke perbandingan antar-split.
- **Rentang metrik `fourch.py` (0,3–8,0 m) tidak cocok data ini.** 0,000% piksel
  valid di bawah 0,3 m (minimum absolut 313 mm) sementara 10,07% melebihi 8 m;
  entropi kanal hanya 6,19 dari 7,99 bit, level median 21/255. Dipilih ulang dari
  histogram **split train saja** (anti-kebocoran): **Z_NEAR=0,8 / Z_FAR=15,0**,
  entropi 7,62 bit, level median 74/255. Nilai >15 m dan 65535 (saturasi uint16)
  diperlakukan tidak valid. Angka ini dibekukan bersama bobot di
  `depth_png/depth_meta.json`.

### E-022b — Apakah depth sensor menaikkan mAP?

**Hipotesis (H-022)** — Pada SawitMVC-Depth, dengan split per-pohon identik, seed
identik, dan seluruh hiperparameter identik kecuali kehadiran kanal kedalaman,
detektor dengan masukan 4-kanal RGB+D sensor (ter-reproyeksi) mencapai test mAP50
lebih tinggi daripada baseline RGB-saja dengan **delta > +0,015**, dan CI 95%
bootstrap berpasangan **per-pohon** atas selisih itu tidak memuat 0.

**Yang memalsukan H-022** (salah satu cukup): (1) delta ≤ +0,015; (2) CI95 memuat
0; (3) delta lebih kecil daripada varians antar-seed pada lengan RGB sendiri;
(4) kontrol negatif kanal-4 = derau memberi kenaikan sebanding — maka kenaikan
berasal dari kapasitas tambahan di stem, bukan dari informasi kedalaman.

Ambang +0,015 dipilih karena reproduksi tidak bit-per-bit deterministik meski
seed=42 (deviasi wajar ±0,005 menurut `REPRODUCE.md`). Selisih ≤0,005 **tidak
boleh** dinarasikan sebagai perbaikan maupun penurunan.

**H-022b (sub-hipotesis mekanistik)** — kenaikan terkonsentrasi pada B4 dan citra
teroklusi, bukan B2/B3. Kegagalan B2/B3 sudah didiagnosis **fotometrik** (SR-007,
SR-009), jadi hasil naik di B4 tapi datar di B2/B3 adalah **konfirmasi teori**,
bukan kegagalan. **Peringatan daya uji: B4 hanya punya 148 kotak di SELURUH
dataset** (38 di test) — AP50 B4 bisa bergeser >0,1 karena beberapa kotak saja;
H-022b dilaporkan dengan CI dan tidak boleh jadi klaim utama.

**Cara** — Split per-pohon terstratifikasi `(device × unit-kamera) × kelas-dominan`,
irisan nol: train 245 pohon/980 citra/1.593 kotak · val 35/140/202 · test
72/288/504 (B4 95/15/38). Skrip: `build/make_splits_depth.py`, `build/reproject_depth.py`,
`train/train_depth4ch.py`, `eval/eval_e022_pycoco.py`.

Tiga pagar keadilan yang dipasang sengaja, semuanya jebakan senyap:

1. **HSV dimatikan di KEDUA lengan.** `RandomHSV.apply_image` melewati citra
   non-3-kanal secara diam (`ultralytics/data/augment.py:1461`) — tanpa pagar ini
   lengan RGB dapat augmentasi yang tidak didapat lengan RGB-D, dan selisihnya
   salah diatribusikan ke depth.
2. **Inflasi conv pertama** (`fourch.make_inflate_callback`): kanal 1–3 dari bobot
   pratlatih urutan BGR, kanal ke-4 = 0, model + EMA sama-sama ditambal. Tanpa ini
   conv pertama 4-kanal mulai acak dan lengan RGB-D kalah karena inisialisasi.
   Terverifikasi di log run.
3. **Modality dropout = 0** untuk lengan hipotesis. Dengan dropout 0,25 lengan
   RGB-D sebenarnya berlatih 25% tanpa depth; hasil datar lalu ditafsirkan "depth
   tidak menolong" padahal yang diuji bukan itu.

**Hasil — pasangan 1: YOLO26n (2,57 jt param, imgsz 640, 60 epoch)**

Angka lewat 1-protokol pycocotools, split test 72 pohon / 288 citra / 504 kotak:

| Lengan | mAP50 | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|
| RGB | 0,3249 | 0,6598 | 0,4342 | 0,0889 | 0,1166 |
| RGB-D 4-kanal | **0,3501** | 0,6102 | 0,4394 | **0,2001** | **0,1506** |

**delta mAP50 = +0,0252 · CI95 bootstrap berpasangan per-pohon [−0,0215; +0,0632] ·
P(delta>0) = 0,851 · B=2000**

**Putusan pasangan 1 — H-022 DIPALSUKAN.** Kriteria falsifikasi butir (2) yang
ditulis sebelum melihat hasil berbunyi "CI 95% bootstrap berpasangan per-pohon
memuat 0". CI memuat 0, jadi meski titik estimasi +0,0252 melewati ambang
+0,015, buktinya belum dapat dibedakan dari nol. Sebabnya bukan misteri: test
hanya 72 pohon / 504 kotak, dan resample **per pohon** (yang benar secara
statistik, karena 4 sisi satu pohon tidak independen) memang melebarkan CI
dibanding resample per citra yang akan menipu.

**Arah per-kelas konsisten dengan H-022b** — kenaikan terkonsentrasi pada kelas
yang kegagalannya geometris: B3 +0,1112 dan B4 +0,0340, sementara B1 justru
TURUN 0,0496. B1 adalah kelas jingga-merah paling kontras, yang memang tidak
membutuhkan isyarat kedalaman. Tetapi B4 hanya punya 38 kotak di test — tidak
ada klaim yang boleh disandarkan padanya tanpa CI per-kelas tersendiri.

**Catatan metodologis yang penting untuk pasangan berikutnya:** dengan test
sekecil ini, CI satu pasangan akan selalu lebar. Bukti yang lebih kuat adalah
**konsistensi lintas arsitektur** — bila RT-DETR-L dan RF-DETR Nano memberi
delta positif dengan pola per-kelas yang sama (naik di B3/B4, datar atau turun
di B1), itu jauh lebih sulit dijelaskan oleh kebetulan daripada satu CI lebar.
Tiga pasangan + kontrol negatif kanal-derau adalah rancangan yang sedang
dijalankan.

**Hasil — sembilan run, 60 epoch, seed 42, konfigurasi identik per pasangan**

Angka lewat 1-protokol pycocotools (RF-DETR lewat `eval/eval_rfdetr_e022.py` dari
`checkpoint_best_ema.pth`; kedua lengannya memakai evaluator yang sama sehingga
selisihnya bersih). Test = 72 pohon / 288 citra / 504 kotak.

| Kanal ke-4 | YOLO26n (2,57 jt) | RT-DETR-L (33,0 jt) | RF-DETR Nano |
|---|---|---|---|
| tidak ada (RGB) | 0,3249 | **0,4076** | 0,4196 |
| depth sensor terregistrasi | 0,3501 | 0,3900 | **0,4635** |
| derau acak | 0,3686 | 0,3535 | (val EMA 0,5093) |
| depth pohon LAIN | 0,3721 | — | — |

Selisih berpasangan, bootstrap 2000x resample per **POHON**:

| Perbandingan | delta mAP50 | CI95 | P(>0) |
|---|---|---|---|
| YOLO26n depth − RGB | +0,0252 | [−0,0215; +0,0632] | 0,851 |
| RF-DETR Nano depth − RGB | +0,0439 | [+0,0000; +0,0918] | 0,975 |
| RT-DETR-L depth − RGB | −0,0177 | [−0,0669; +0,0203] | 0,225 |
| **YOLO26n DERAU − RGB** | **+0,0437** | **[+0,0051; +0,0875]** | 0,991 |
| YOLO26n depth − derau | −0,0186 | [−0,0694; +0,0191] | 0,194 |
| YOLO26n depth − tukar | −0,0220 | [−0,0506; +0,0085] | 0,080 |
| RT-DETR-L depth − derau | +0,0365 | [−0,0014; +0,0668] | 0,971 |
| RF-DETR Nano depth − derau | +0,0087 | [−0,0372; +0,0538] | 0,649 |

**Putusan H-022 — DIPALSUKAN, pada dua kriteria independen:**

- Butir (2): CI berpasangan memuat 0 untuk ketiga arsitektur. Delta terbesar
  (RF-DETR Nano +0,0439) berbatas bawah tepat +0,0000.
- Butir (4): **kontrol negatif menyamai.** Kanal ke-4 berisi DERAU memberi
  +0,0437 dengan CI yang **tidak** memuat nol — satu-satunya delta di seluruh
  E-022 yang signifikan, dan ia berasal dari kanal tanpa informasi apa pun.

**Kontrol registrasi (baru, tidak ada di rencana awal).** Kanal ke-4 diisi peta
depth ASLI milik pohon LAIN (`train_depth4ch.py --depth-tukar`): statistik dan
tekstur depth realistis, hanya keselarasan spasialnya dihancurkan. Hasil pada
YOLO26n: 0,3721 vs depth benar 0,3501, selisih −0,0220 CI [−0,0506; +0,0085].
**Tafsir yang benar: keduanya TIDAK DAPAT DIBEDAKAN** (CI memuat nol), dan pada
B1 depth benar justru signifikan lebih buruk (−0,0662 [−0,1089; −0,0199]).
Konsekuensinya keras: **reproyeksi penuh yang dibuktikan lebih selaras di E-022a
tidak membeli apa pun pada model kecil.**

**Putusan H-022b — TIDAK KONKLUSIF, tetapi mekanismenya terlihat pada model
besar.** Pada YOLO26n, kenaikan B4 direproduksi persis oleh depth-tertukar
(0,1671 vs 0,1506) sehingga tidak bisa disebut manfaat geometris. Namun pada
RT-DETR-L, depth mengalahkan kontrol deraunya sendiri secara signifikan justru
di kelas yang diprediksi teori: **B4 +0,1001 [+0,0062; +0,1618]** dan B1 +0,0698
[+0,0306; +0,1100]. Jadi kandungan informasi depth NYATA pada model besar,
tetapi tidak cukup menutup kerugian yang ditimbulkan kanal ke-4 itu sendiri.

Pola depth-vs-derau kini lengkap untuk ketiga arsitektur dan **konsisten**: pada
**dua** model kecil depth tidak dapat dibedakan dari derau secara keseluruhan
(YOLO26n −0,0186; RF-DETR Nano +0,0087, keduanya CI memuat nol) dan justru
signifikan **lebih buruk** di B1 (−0,0734 dan −0,0446). Hanya pada RT-DETR-L
33,0 jt parameter isi kanal menentukan: B1 +0,0698 dan B4 +0,1001, keduanya CI
tidak memuat nol. **Kandungan informasi depth baru terpakai pada kapasitas tinggi.**

**Temuan struktural: arah efek kanal ke-4 ditentukan KAPASITAS MODEL, bukan isi
kanal.** Pada 2,57 jt parameter kanal ke-4 menaikkan (dan isinya tidak penting —
derau dan depth-tertukar setara atau lebih baik daripada depth benar); pada
33,0 jt parameter kanal ke-4 menurunkan (dan isinya penting — depth jauh lebih
baik daripada derau). Tafsir paling hemat: pada model kecil yang undertrained di
1.593 kotak latih, kanal ke-4 bekerja sebagai regularisasi; pada model besar
berbobot pratlatih, ia mengganggu stem 3-kanal dan depth hanya memulihkan
sebagian kerugian itu.

**Dampak — arah lanjutan yang kini didukung bukti sendiri, bukan kutipan.**
Kegagalan ada pada **cara memasukkan** depth (konkatenasi di kanal masukan), bukan
pada kandungan depth-nya. Ini persis yang diprediksi korpus (FuseNet 4-kanal
31,95 IoU di bawah RGB 32,47 sementara fusi fitur 37,29; sapuan 28 titik fusi
Ophoff, `evidence-body.tex` §174). **E-023 yang diusulkan: fusi MENENGAH dua
cabang** pada RT-DETR-L/RF-DETR, karena di situlah depth sudah terbukti membawa
informasi B4. Kontrol derau dan kontrol tukar wajib diulang di sana.

**Keterbatasan yang tidak boleh dihaluskan:**

- **Satu seed, satu split.** Semua selisih di atas ~0,02–0,04 sementara deviasi
  antar-run wajar ±0,005 dan CI-nya 0,05–0,09 lebar. Varians split belum diukur;
  3-fold CV yang direncanakan tidak dijalankan.
- **B4 hanya 148 kotak di SELURUH dataset** (38 di test). Setiap klaim per-kelas
  B4 bersandar pada puluhan kotak.
- **Dataset 8x lebih kecil** dari SawitMVC. Daya uji untuk mendeteksi efek kecil
  memang rendah; "tidak terbukti" di sini bukan "terbukti tidak ada".
- RF-DETR RGB-D dan derau: `run_test` bawaan tidak pernah berjalan pada kedua
  lengan; evaluasi test dijalankan terpisah dari `checkpoint_best_ema.pth` lewat
  `eval/eval_rfdetr_e022.py` — bukan latih ulang.
  **Koreksi 2026-07-30:** versi sebelumnya menyatakan penyebabnya kuota disk
  habis dengan `checkpoint_59.ckpt` terpotong tepat 256 MB pada kedua lengan.
  **Klaim itu tidak dapat disubstansiasi dan sudah dihapus.** Pemeriksaan disk:
  `runs_e022/rfdetrnano_rgbd/` tidak memuat `.ckpt` sama sekali, dan
  `checkpoint_59.ckpt` hanya ada di `runs_e022/rfdetrnano_derau/` dalam ukuran
  utuh 488.105.861 byte — bukan 268.435.456. Penyebab sebenarnya tidak diketahui
  dan tidak boleh dinarasikan tanpa bukti.

**Reproduksi** — `build/depth_calib.py`, `analysis/verify_depth_mi.py` (gerbang registrasi),
`build/reproject_depth.py` (PNG kanonik + `depth_meta.json`), `build/make_splits_depth.py`,
`train/train_depth4ch.py` (ultralytics; `--depth-acak`, `--depth-tukar`),
`train/train_rfdetr_4ch.py` (rfdetr 4-kanal, 4 tambalan), `eval/eval_e022_pycoco.py`,
`eval/eval_e022_paired.py`, `eval/eval_rfdetr_e022.py`. Hasil: `results/E-022/*.json`.
Split persis: `splits_depth/seed42/`. Tabel seed-42 awal:
[archive/E022-seed42-awal.md](archive/E022-seed42-awal.md). Audit koreksi:
[AUDIT-E022.md](AUDIT-E022.md).

---

## E-024 — Inkonsistensi prediksi lintas-sisi sebagai ukuran ambiguitas (2026-07-31) · pengganti E-001

**Hipotesis** — `class_mismatch` dipalsukan di E-001 sebagai ukuran ambiguitas
kematangan: nol dari 7.328 bunch multi-sisi, yang menjadikannya pemeriksa
integritas anotasi, bukan pengukur ambiguitas. CLAUDE.md mencatat penggantinya:
pakai identitas bunch lintas-sisi sebagai **oracle**, lalu ukur inkonsistensi
**prediksi detektor** pada tandan fisik yang sama. Hipotesisnya: detektor
memberi kelas kematangan berbeda pada objek fisik yang sama dilihat dari sisi
berbeda, dan ketidaksepakatan itu menumpuk pada pasangan kelas bertetangga.
**Dipalsukan bila** laju inkonsisten mendekati nol (artinya penampilan sudah
menentukan kelas secara stabil) atau tersebar merata tanpa struktur.

**Cara** — `analysis/cross_side_consistency.py`. Oracle tidak dihitung ulang:
`json/<tree>.json` sudah menyediakan `bunches[].appearances`, yaitu transitive
closure graf `_confirmedLinks` — satu entri = satu tandan fisik dengan kotak
piksel per sisi. Prediksi dibuat lewat jalur yang sama dengan evaluator E-022
(`eval_e022_pycoco.prediksi`) supaya praproses dan komposisi kanal tidak
berbeda diam-diam. Kemunculan dicocokkan ke prediksi pada IoU >= 0,5, conf
>= 0,25. Checkpoint: `yolo26n_rgb_seed42` (60 epoch, split test SawitMVC-Depth
72 pohon).

**Hasil**

| Ukuran | Nilai |
|---|---:|
| Tandan fisik di split test | 310 |
| Tampak dari >= 2 sisi | 182 |
| Terukur (>= 2 sisi terdeteksi) | 82 |
| Kemunculan terlewat | 137 / 376 = **36,4%** |
| **Tidak konsisten** | 16 / 82 = **19,5%** |

Pasangan kelas yang bertabrakan: **B1↔B2 sebanyak 11**, **B2↔B3 sebanyak 6**.
Tidak ada tabrakan yang melibatkan B4. Sebaran per kelas GT yang terukur:
B1 50, B2 25, B3 7, **B4 nol** — seluruh tandan B4 multi-sisi gagal terdeteksi
di >= 2 sisi, sehingga tidak masuk pengukuran sama sekali.

**Putusan — DIKONFIRMASI, dengan daya uji terbatas.** Detektor memberi kelas
berbeda pada tandan fisik yang sama pada 19,5% kasus, sementara anotator
manusia tidak pernah (0/7.328 di E-001). Pemisahan itu bersih: ambiguitas
berada pada klasifikasi berbasis penampilan, bukan pada labelnya. Strukturnya
juga sesuai prediksi — tabrakan terkonsentrasi pada tetangga ordinal (B1↔B2,
B2↔B3), konsisten dengan ordinalitas kelas yang dikonfirmasi E-012/SR-009.

**Yang tidak boleh dihaluskan:**

- **n = 82** tandan terukur. Setiap butir persentase bersandar pada kurang dari
  satu tandan.
- **Laju terlewat 36,4%** dicatat justru supaya "konsisten" tidak tertukar
  dengan "tidak terdeteksi". Bunch yang hanya terdeteksi di satu sisi
  dikeluarkan dari pengukuran, bukan dihitung konsisten.
- **B4 nol** — kelas yang paling penting bagi pertanyaan riset ini sama sekali
  tidak terwakili. Untuk B4, ukuran ini belum memberi apa pun.
- Satu seed, satu arsitektur, satu ambang conf. Ambang 0,25 dipilih sebagai
  default umum, bukan hasil sapuan; sensitivitasnya belum diuji.
- Angka ini **bukan** metrik performa dan tidak sebanding dengan mAP mana pun.

**Dampak** — Menyediakan ukuran ambiguitas yang tidak bergantung label manusia,
dan karena itu dapat dipakai menguji apakah kedalaman **menstabilkan** identitas
lintas-sisi: jalankan skrip yang sama pada checkpoint RGB-D sepadan dan
bandingkan laju inkonsistennya. Itu pertanyaan yang tidak terjawab oleh mAP
agregat, dan kini punya alatnya. Lengan RGB-D menyusul setelah matriks G2
selesai.

**Reproduksi** — `analysis/cross_side_consistency.py --bobot <run>/weights/best.pt
--modal rgb`. Hasil: `experiments/results/E-024/konsistensi_rgb_seed42.json`.

---

## E-025 — Selisih evaluator E-022 terlacak: celah menskala dengan jumlah deteksi (2026-07-31) · menutup gerbang G1

**Konteks** — [AUDIT-E022.md](AUDIT-E022.md) §"Selisih evaluator yang belum
terjelaskan" mencatat celah sampai 0,028 antara `hasil.json` (jalur val internal
trainer) dan `eval_e022_paired.py` (pycocotools), **tidak simetris antar lengan**,
sehingga rerata Δ YOLO26n berubah tanda. Selama itu belum terlacak, tidak ada
angka E-022 yang berstatus final. Empat kandidat didaftar audit: pemilihan
checkpoint, ambang confidence, `max_det`, dan perbedaan daftar citra.

**Hipotesis** — Celah berasal dari `maxDets`: tidak satu pun skrip menyetel
`ev.params.maxDets`, jadi COCOeval memakai default `[1, 10, 100]` sementara
prediksi dibuat dengan `max_det=300`. **Dipalsukan bila** memaksa maxDets=300
tidak mengubah AP.

**Cara** — `eval/diag_evaluator_gap.py`, satu himpunan deteksi dipakai untuk
seluruh pengukuran sehingga tiap sumber celah terisolasi. Checkpoint dilatih
ulang di RTX A4500 (asal: L4), pasangan `yolo26n_rgb_seed42` dan
`yolo26n_rgbd_seed42`, 60 epoch, split test 72 pohon / 288 citra / 504 kotak.

**Hasil**

| | RGB | RGB-D |
|---|---:|---:|
| `hasil.json` mAP50 | 0,36119 | 0,35604 |
| pycocotools mAP50 | 0,34789 | 0,35830 |
| **celah (pycoco − hasil)** | **−0,01330** | **+0,00226** |
| deteksi total | 4.610 | 11.233 |
| rerata deteksi/citra | 16,0 | 39,0 |
| citra dengan >100 deteksi | 0 | 25 |

Konsekuensinya pada arah efek:

| Δ(RGB-D − RGB) | nilai |
|---|---:|
| menurut `hasil.json` | **−0,00515** |
| menurut pycocotools | **+0,01041** |

**Putusan — hipotesis maxDets DIPALSUKAN; celahnya terlacak ke jumlah deteksi.**

1. **maxDets bukan penyebabnya.** Memaksa `maxDets=300` menghasilkan mAP50 dan
   mAP50-95 yang **identik sampai lima desimal** pada kedua lengan. Kandidat ini
   diajukan di G1 lalu digugurkan oleh pengukuran, bukan oleh argumen.
2. **Checkpoint bukan penyebabnya** — terverifikasi, kedua jalur memuat
   `weights/best.pt` yang sama, dan daftar citra identik (satu `test.txt`).
3. **Celahnya menskala dengan jumlah deteksi.** Lengan RGB-D memancarkan
   **2,44× lebih banyak** deteksi (11.233 vs 4.610). Lengan yang deteksinya
   jarang justru **dinaikkan** oleh evaluator internal ultralytics (+0,0133),
   sedangkan lengan yang padat hampir tidak (−0,0023). Asimetrinya 0,0156 —
   cukup untuk **membalik tanda** Δ, dan itu persis yang dilaporkan audit.

**Sifat gejalanya tereproduksi, besarannya tidak.** Audit mencatat celah
+0,0184 dan +0,0282 pada lengan RGB-D di seed 1337/2024 (perangkat L4); di sini
+0,0023 pada seed 42 (A4500). Yang tereproduksi adalah **arah asimetri dan
pembalikan tanda Δ**, bukan angka absolutnya.

**Mekanisme internalnya belum dibuktikan** dan tidak boleh dinarasikan seolah
sudah: yang terukur adalah korelasi celah dengan kepadatan deteksi. Dugaan
paling hemat adalah perbedaan interpolasi kurva PR (ultralytics memakai trapz
atas kurva yang disisipi titik ujung; COCOeval memakai interpolasi 101 titik),
yang perlakuannya terhadap ekor berkeyakinan-rendah memang berbeda. Itu
hipotesis, bukan temuan.

**Dampak — aturan protokol yang mengikat seluruh E-022 dan lanjutannya:**

- **`hasil.json` TIDAK BOLEH dipakai untuk membandingkan antar lengan.**
  Celahnya bukan offset tetap; ia menskala dengan jumlah deteksi, dan jumlah
  deteksi berbeda secara sistematis antar lengan. Membandingkan lengan lewat
  `hasil.json` berarti membandingkan dua metrik yang berbeda.
- **pycocotools adalah protokol tunggal**, sebagaimana sudah berlaku untuk
  E-021. Seluruh evaluasi G2 memakai `eval/eval_e022_pycoco.py` dan
  `eval/eval_e022_paired.py`.
- `hasil.json` tetap berguna sebagai pemantau kemajuan **di dalam satu run**,
  tetapi bukan sebagai angka yang dilaporkan.
- Gerbang G1 **dibuka**: matriks multi-seed G2 boleh dilanjutkan, dengan
  evaluasi terikat protokol di atas.

**Catatan cacat skrip yang ditemukan saat pengerjaan** — versi pertama
`diag_evaluator_gap.py` membaca `ev.stats`, dan `COCOeval.summarize()`
menghitung `stats[0]` dengan `maxDets=100` yang di-hardcode lalu mencari indeks
100 di `params.maxDets`. Begitu maxDets diubah ke `[1,10,300]`, nilai itu tidak
ada dan pycocotools mengembalikan sentinel **−1.0 tanpa error** — persis jenis
kegagalan senyap yang mudah lolos sebagai hasil. Diperbaiki dengan menghitung
langsung dari `ev.eval["precision"]`. Angka di tabel atas berasal dari versi
yang sudah diperbaiki.

**Reproduksi** — `eval/diag_evaluator_gap.py --run <run> --modal <rgb|rgbd>`.
Hasil: `experiments/results/E-022/diag_evaluator_gap_{rgb,rgbd}.json`.

---

## E-026 — Apakah depth menstabilkan identitas lintas-sisi? (2026-07-31) · lanjutan [E-024]

**Hipotesis** — [E-024](#) menetapkan ukuran inkonsistensi prediksi lintas-sisi
yang tidak bergantung label manusia. Pertanyaan yang ia buka: kalau kegagalan
B2/B3 bersifat **fotometrik** (SR-007, SR-009), kedalaman seharusnya **tidak**
menolong; tetapi kalau sebagian ketidakstabilan berasal dari geometri —
tandan yang tampak berbeda karena sudut, oklusi, atau jarak — kanal kedalaman
seharusnya **menurunkan** laju inkonsisten. **Dipalsukan bila** laju
inkonsisten lengan RGB-D tidak dapat dibedakan dari lengan RGB.

**Cara** — `analysis/cross_side_consistency.py` pada pasangan checkpoint
sepadan `yolo26n_rgb_seed42` dan `yolo26n_rgbd_seed42` (60 epoch, seed 42,
konfigurasi identik kecuali kehadiran kanal kedalaman ter-reproyeksi). Split
test 72 pohon. Prediksi lewat jalur evaluator E-022 yang sama, conf 0,25,
IoU pencocokan 0,5. Bootstrap 10.000× atas selisih proporsi.

**Hasil**

| | RGB | RGB-D |
|---|---:|---:|
| Tandan terukur (>= 2 sisi terdeteksi) | 82 | 75 |
| **Laju inkonsisten** | **0,1951** (16/82) | **0,2000** (15/75) |
| Laju kemunculan terlewat | 0,3644 | 0,3883 |
| Tabrakan B1↔B2 | 11 | 8 |
| Tabrakan B2↔B3 | 6 | 6 |
| Tabrakan B1↔B3 | 0 | 1 |

**selisih (RGB-D − RGB) = +0,0049 · CI95 [−0,1194; +0,1314] · P(<0) = 0,457**

**Putusan — DIPALSUKAN.** Kanal kedalaman tidak menurunkan inkonsistensi
prediksi lintas-sisi. Titik estimasinya bahkan bergerak ke arah yang salah
(+0,0049), CI memuat nol dengan lebar, dan peluang depth membantu hanya 0,457 —
tidak dapat dibedakan dari lemparan koin. Laju terlewatnya juga sedikit lebih
buruk (0,3883 vs 0,3644), jadi lengan RGB-D tidak membeli apa pun di sini,
termasuk dalam hal deteksi dasar.

**Konsisten dengan diagnosis yang sudah ada, dan itu penting.** SR-007 dan
SR-009 mendiagnosis kegagalan B2/B3 sebagai **fotometrik**, dan CLAUDE.md
mencatat sejak awal bahwa depth **tidak** akan menolong di sana. Tabrakan yang
terukur di sini memang terkonsentrasi pada tetangga ordinal B1↔B2 dan B2↔B3 —
persis kelas yang kegagalannya fotometrik. **Hasil negatif ini adalah
konfirmasi teori, bukan kegagalan eksperimen**, dan harus dilaporkan begitu.

**Yang tidak boleh dihaluskan:**

- **n kecil** (82 dan 75 tandan), sehingga CI selebar ±0,12 memang wajar. Uji
  ini **tidak berdaya** mendeteksi efek kecil; "tidak terbukti" bukan "terbukti
  tidak ada".
- **B4 nol terwakili di kedua lengan.** Kelas yang justru paling geometris —
  dan karenanya paling mungkin dibantu depth — tidak masuk pengukuran sama
  sekali karena tidak pernah terdeteksi di >= 2 sisi. **Untuk B4, hipotesis ini
  belum diuji, bukan dipalsukan.** Ini batas terpenting entri ini.
- Satu seed, satu arsitektur kecil (2,57 jt param). E-022/SR-015 menemukan
  kandungan informasi depth baru terpakai pada kapasitas tinggi (RT-DETR-L
  33,0 jt); ukuran ini belum dijalankan di sana.
- Ambang conf 0,25 belum disapu; jumlah tandan terukur bergantung padanya.

**Dampak** — Menambah satu bukti independen pada kesimpulan E-022: fusi awal
4-kanal tidak membeli apa pun pada model kecil, kini juga terlihat pada ukuran
yang sama sekali berbeda dari mAP. Ukuran ini menjadi **instrumen tambahan
untuk G4/G6**: bila fusi menengah atau akhir benar-benar bekerja, laju
inkonsisten harus turun — dan bila tidak turun, kenaikan mAP apa pun di sana
patut dicurigai sebagai efek kapasitas. Jalankan juga pada RT-DETR-L begitu
matriks G2 selesai, karena di situlah depth terbukti membawa informasi B4.

**Reproduksi** — `analysis/cross_side_consistency.py --bobot <run>/weights/best.pt
--modal <rgb|rgbd>`. Hasil: `experiments/results/E-024/konsistensi_{rgb,rgbd}_seed42.json`.

---

## E-027 — Matriks multi-seed YOLO26n, protokol beku: depth MERUGIKAN (2026-08-01) · menutup G2 bagian YOLO26n

**Konteks** — [E-022](EKSPERIMEN.md) dicabut karena bertumpu satu seed, dan
[AUDIT-E022.md](AUDIT-E022.md) menyatakan matriks multi-seed "sedang diproduksi".
Matriks itu tidak pernah selesai maupun diarsipkan. Entri ini menyelesaikannya
untuk YOLO26n: 12 run (4 modal × 3 seed), 60 epoch, kode `_fix`, seluruhnya
dievaluasi lewat pycocotools sesuai aturan mengikat [E-027 pendahulunya, E-025].

**Hipotesis** — H-022 asli: kanal depth sensor ter-reproyeksi menaikkan test
mAP50 dengan delta > +0,015 dan CI bootstrap berpasangan per-pohon tidak memuat
nol. Dipalsukan pula bila kontrol derau memberi kenaikan sebanding.

**Cara** — `shell/matriks_g2.sh` (kolam slot paralel, dapat dilanjutkan,
dijaga `periksa_run`) lalu `shell/eval_g2.sh` (bootstrap 2000× per pohon,
protokol tunggal pycocotools). Split test 72 pohon / 288 citra / 504 kotak.
Perangkat RTX A4500; angka asal E-022 diproduksi di L4.

**Hasil — 12 perbandingan berpasangan**

| Perbandingan | seed 42 | seed 1337 | seed 2024 | rerata |
|---|---:|---:|---:|---:|
| depth − RGB | +0,0104 | **−0,0414** | **−0,0379** | **−0,0230** |
| DERAU − RGB | +0,0032 | +0,0011 | **−0,0443** | −0,0133 |
| depth − derau | +0,0072 | **−0,0425** | +0,0064 | −0,0096 |
| depth − tukar | +0,0190 | −0,0272 | −0,0042 | −0,0041 |

Angka tebal = CI95 bootstrap tidak memuat nol. mAP50 lengan RGB per seed:
0,3479 / 0,3428 / 0,3749 — **rentang antar-seed 0,0321 pada satu lengan yang
konfigurasinya identik.**

**Putusan — H-022 DIPALSUKAN, dan lebih keras daripada sebelumnya.**

1. **Depth merugikan, bukan sekadar netral.** Rerata −0,0230, dan pada DUA dari
   tiga seed CI-nya tidak memuat nol dengan tanda NEGATIF (seed 1337
   [−0,073; −0,015], seed 2024 [−0,069; −0,001]). Kesimpulan lama "tidak dapat
   dibedakan dari nol" terlalu lunak untuk YOLO26n.
2. **Seed 42 terkonfirmasi sebagai seed paling menguntungkan.** Ia satu-satunya
   yang positif (+0,0104), persis peringatan yang ditulis saat pencabutan
   E-022. Melaporkan seed tunggal di sini akan membalik kesimpulan.
3. **Temuan "derau mengalahkan depth" TIDAK TEREPRODUKSI.** Pada seed-42 lama
   derau memberi +0,0437 dengan CI tidak memuat nol — satu-satunya delta
   signifikan di seluruh E-022. Di matriks bersih ini derau justru netral
   sampai merugikan (+0,0032 / +0,0011 / −0,0443, rerata −0,0133). Klausa
   SR-015 yang bersandar pada temuan itu kehilangan pijakan.
4. **Registrasi tetap tidak membeli apa pun.** depth − tukar rerata −0,0041,
   CI memuat nol di dua dari tiga seed. Reproyeksi penuh yang terbukti lebih
   selaras di E-022a tetap tidak diterjemahkan menjadi mAP pada model kecil —
   konsisten dengan putusan lama.

**Yang tidak boleh dihaluskan:**

- **CI lintas-seed sangat lebar.** Dengan n=3, CI-t rerata depth−RGB adalah
  [−0,0949; +0,0490] — memuat nol meski seluruh titik estimasinya negatif.
  Yang kuat di sini adalah **arah yang konsisten dan dua CI per-seed yang
  signifikan**, bukan rerata tiga angkanya.
- **Lantai derau antar-seed 0,0321** pada lengan RGB saja. Seluruh delta yang
  diperdebatkan (±0,04) berada pada orde yang sama dengan varians seed. Ini
  menegaskan kembali peringatan pencabutan E-022, sekarang dengan angkanya.
- **Perangkat berbeda** dari run asal (A4500 vs L4). Besaran tidak dapat
  disamakan langsung dengan angka E-022 lama; yang dibandingkan adalah pola.
- Berlaku untuk **YOLO26n saja** (2,57 jt param). Matriks RT-DETR-L berjalan
  terpisah, dan G7 menyapu YOLO26m/l untuk memisahkan kapasitas dari
  arsitektur — klaim struktural SR-015 belum diuji ulang di sini.

**Dampak** — Bagian YOLO26n pada G2 selesai dan buktinya terarsip
(`paired_yolo26n_*_seed*.json`, 12 berkas), menutup celah keterlacakan yang
ditinggalkan audit. Untuk model kecil, arah bukti kini melawan fusi awal secara
lebih tegas: bukan "tidak terbukti membantu" melainkan "terukur merugikan pada
mayoritas seed". Itu memperkuat, bukan melemahkan, alasan menempuh fusi
menengah/akhir (G4/G6).

**Reproduksi** — `shell/matriks_g2.sh` lalu `shell/eval_g2.sh`. Hasil:
`experiments/results/E-022/paired_yolo26n_{depth_vs_rgb,derau_vs_rgb,depth_vs_derau,depth_vs_tukar}_seed{42,1337,2024}.json`.

---

## E-028 — Inkonsistensi lintas-sisi di SawitMVC: daya uji 6× dan B4 akhirnya terwakili (2026-08-01) · lanjutan [E-024]/[E-026] · [SR-016](SR/SR-016-konsistensi-lintas-sisi.md)

**Konteks** — [E-024](EKSPERIMEN.md) mengukur inkonsistensi prediksi lintas-sisi
sebesar 19,5% pada SawitMVC-Depth, dan [E-026](EKSPERIMEN.md) menemukan depth
tidak menstabilkannya. Keduanya menandai batas yang sama: hanya **82 tandan
terukur**, dan **B4 nol terwakili** karena tidak pernah terdeteksi di ≥ 2 sisi.
B4 adalah kelas yang kegagalannya geometris, jadi justru itu yang paling perlu
diukur. SawitMVC punya 18.540 kotak vs 2.299 dan 4–8 sisi per pohon.

**Hipotesis** — Ukuran yang sama pada dataset yang jauh lebih besar akan (a)
memberi CI yang cukup sempit untuk dipecah per kelas, dan (b) menempatkan
tabrakan pada tetangga ordinal, dengan **B2↔B3 sebagai pasangan dominan** —
karena SR-007 dan SR-009 mendiagnosis ambiguitas kematangan justru di sana.
**Dipalsukan bila** tabrakan tersebar tanpa struktur ordinal, atau B2↔B3 bukan
pasangan terbesar.

**Cara** — `analysis/cross_side_consistency.py --data-root /workspace/SawitMVC/data
--split-dir experiments/splits/rgb/sawitmvc`. Detektor `yolo26n` dilatih
di SawitMVC dengan resep **identik** lengan RGB SawitMVC-Depth (60 epoch, imgsz
640, batch 16, seed 42, HSV mati) supaya kedua laju sebanding. Split E-021
terarsip: 716/96/141 pohon, irisan nol. Test = 141 pohon.

**Hasil**

| | SawitMVC-Depth (E-024) | **SawitMVC (E-028)** |
|---|---:|---:|
| Tandan fisik | 310 | **1.404** |
| Tampak ≥ 2 sisi | 182 | **1.022** |
| Terukur | 82 | **511** (6,2×) |
| **Laju inkonsisten** | **0,1951** | **0,2329** |
| Laju terlewat | 0,3644 | 0,3336 |

Selisih +0,0378, CI95 bootstrap [−0,0585; +0,1276] — **kedua dataset tidak dapat
dibedakan** pada ukuran ini, meski prior kelas, resolusi, dan orientasinya
berbeda jauh.

Per kelas, dengan CI Wilson — **B4 akhirnya terwakili**:

| Kelas | Laju inkonsisten | CI95 |
|---|---:|---|
| B1 | 0,2346 (19/81) | [0,156; 0,338] |
| **B2** | **0,4340 (46/106)** | [0,344; 0,529] |
| B3 | 0,1552 (43/277) | [0,117; 0,203] |
| B4 | 0,2340 (11/47) | [0,136; 0,372] |

Pasangan kelas yang bertabrakan: **B2↔B3 sebanyak 79**, B1↔B2 32, B3↔B4 25,
B1↔B3 12. **Tidak ada satu pun B1↔B4** — tabrakan yang melompati tiga tingkat
ordinal.

**Putusan — DIKONFIRMASI.** Struktur ordinalnya jelas dan kuat: tabrakan
terkonsentrasi pada tetangga langsung, meluruh dengan jarak ordinal
(79 → 32/25 → 12 → 0), dan **B2↔B3 adalah pasangan dominan** persis seperti
yang diprediksi SR-007/SR-009. Ini diperoleh **tanpa memakai label kematangan
sebagai kebenaran**, hanya identitas fisik tandan — jadi ia menguatkan diagnosis
ambiguitas B2/B3 lewat jalur bukti yang sepenuhnya berbeda dari mAP per kelas.

**B2 adalah kelas paling ambigu, bukan B4.** Laju inkonsisten B2 (0,434) hampir
tiga kali B3 (0,155) dan CI-nya tidak beririsan. Itu temuan baru: sampai sekarang
B4 selalu diperlakukan sebagai kelas bermasalah karena AP50-nya terendah, tetapi
AP rendah mencampur *kegagalan deteksi* dengan *kebingungan kelas*. Ukuran ini
memisahkan keduanya, dan begitu dipisah, B4 justru **tidak lebih ambigu daripada
B1** (0,234 vs 0,235) — kesulitan B4 memang soal menemukannya, bukan
menamainya.

**Yang tidak boleh dihaluskan:**

- **SawitMVC tanpa depth.** E-028 hanya laju BASELINE. Pertanyaan "apakah depth
  menstabilkan" tetap hanya terjawab di SawitMVC-Depth, dan di sana sudah
  dipalsukan (E-026).
- **Laju terlewat 33,4%** — sepertiga kemunculan tidak masuk pengukuran.
  Detektor yang lebih kuat akan mengubah komposisi tandan terukur, dan arah
  perubahannya tidak dapat diprediksi dari sini.
- **B4 n=47**, CI-nya masih lebar [0,136; 0,372]. Cukup untuk menyatakan B4
  tidak menonjol ambigu, belum cukup untuk memberi angka presisi.
- Satu seed, satu arsitektur kecil, ambang conf 0,25 belum disapu.
- Angka ini bukan metrik performa dan tidak sebanding dengan mAP mana pun.

**Dampak** — Menyediakan pembanding baseline berdaya uji layak untuk G4/G6:
bila fusi menengah/akhir bekerja, laju inkonsisten harus turun dari 0,2329, dan
penurunannya harus terkonsentrasi di B2↔B3 kalau mekanismenya fotometrik atau
di B3↔B4 kalau geometris. Ukuran ini kini bisa membedakan keduanya — sesuatu
yang mAP agregat tidak pernah bisa.

**Reproduksi** — `shell/g8_sawitmvc.sh`. Hasil:
`experiments/results/E-028/konsistensi_sawitmvc_rgb_seed42.json`.

---

## E-029 — Matriks multi-seed RT-DETR-L: klausa "depth terpakai pada kapasitas tinggi" DICABUT (2026-08-01) · melengkapi G2

**Konteks** — [SR-015](SR/SR-015-depth-sensor-4kanal.md) menyisakan satu klausa
positif setelah pencabutan 30 Juli: *"kandungan informasi depth NYATA pada model
besar"*, bersandar pada RT-DETR-L seed-42 depth − derau **+0,0365** dengan
**B4 +0,1001 [+0,0062; +0,1618]** signifikan. Lengan derau pembandingnya dibuat
dengan kode cacat (RNG bersama, AUDIT-E022 #4). [E-027](EKSPERIMEN.md) sudah
menunjukkan temuan sejenis gugur pada YOLO26n. Entri ini mengujinya pada
arsitektur yang melahirkannya.

**Hipotesis** — Bila klausa itu benar, depth − derau pada RT-DETR-L harus tetap
positif **dan** signifikan setelah kode diperbaiki, dengan kenaikan terkonsentrasi
di B4. **Dipalsukan bila** CI memuat nol, atau efeknya lebih kecil daripada
sebaran antar-seed.

**Cara** — 9 run (3 modal × 3 seed), 60 epoch, kode `_fix`, protokol tunggal
pycocotools ([E-025]), bootstrap 2000× per pohon. Split test 72 pohon / 288
citra / 504 kotak. Perangkat A4500.

**Hasil**

| Perbandingan | seed 42 | seed 1337 | seed 2024 | rerata | sd |
|---|---:|---:|---:|---:|---:|
| depth − RGB | −0,0350 | +0,0091 | **+0,0702** | +0,0148 | 0,0431 |
| DERAU − RGB | **−0,0533** | −0,0063 | **+0,0667** | +0,0024 | 0,0494 |
| depth − derau | +0,0183 | +0,0153 | +0,0035 | **+0,0124** | **0,0064** |

Tebal = CI95 bootstrap tidak memuat nol. mAP50 lengan RGB per seed: 0,4282 /
0,4142 / 0,3523 — **rentang antar-seed 0,0759 pada satu lengan berkonfigurasi
identik.**

**Putusan — klausa SR-015 DICABUT.**

1. **depth − derau kehilangan signifikansi di ketiga seed.** +0,0183 / +0,0153 /
   +0,0035, semuanya CI memuat nol. Angka lama +0,0365 menyusut menjadi rerata
   **+0,0124**, dan B4 +0,1001 yang menjadi tulang punggung klausa itu tidak
   direproduksi.
2. **Sebaran antar-seed mengubur efeknya.** Lengan RGB saja berayun 0,0759
   antar seed — **enam kali** rerata depth − derau. Setiap klaim sebesar ±0,04
   pada dataset ini tidak dapat dipertahankan tanpa multi-seed.
3. **Arah depth − RGB tidak stabil**: −0,0350 (seed 42) sampai +0,0702 (seed
   2024), keduanya dengan CI yang tidak memuat nol tetapi **bertanda
   berlawanan**. Dua seed yang sama-sama "signifikan" menunjuk arah berbeda —
   demonstrasi paling telanjang mengapa seed tunggal tidak cukup.

**Satu pola yang bertahan, dan ini yang menarik.** Di antara ketiga kontras,
hanya **depth − derau** yang punya sd kecil (0,0064 versus 0,0431 dan 0,0494).
CI-t lintas-seed-nya [−0,0071; +0,0318] — nyaris tidak memuat nol meski n=3.
Tafsir yang hemat: **isi kanal ke-4 berpengaruh lebih konsisten daripada
keberadaan kanal itu sendiri.** Menambahkan kanal keempat mengguncang pelatihan
secara besar dan tak terarah; mengganti isinya dari derau ke depth memberi
perbaikan kecil tetapi berulang. Itu tidak menyelamatkan fusi awal — +0,0124
jauh di bawah ambang +0,015 yang ditetapkan H-022 — tetapi ia mendukung premis
E-023: informasi depth ada, salurannya yang salah.

**Yang tidak boleh dihaluskan:**

- **n = 3 seed.** CI-t depth − derau [−0,0071; +0,0318] tetap memuat nol.
  "Nyaris signifikan" bukan signifikan, dan tidak boleh dilaporkan sebagai
  temuan positif.
- Pola sd-kecil di atas adalah **pengamatan pasca-hoc**, bukan hipotesis yang
  ditulis sebelum melihat data. Ia layak diuji terpisah di E-023, bukan
  dijadikan kesimpulan di sini.
- Perangkat A4500, bukan L4 asal; besaran tidak sebanding langsung dengan angka
  E-022 lama, yang dibandingkan adalah pola.
- Berlaku untuk fusi AWAL 4-kanal pada RT-DETR-L. Fusi menengah/akhir belum
  diuji sama sekali.

**Dampak** — Bersama [E-027](EKSPERIMEN.md), seluruh klaim positif E-022 kini
tercabut pada kedua arsitektur: tidak ada satu pun kontras yang bertahan
signifikan lintas tiga seed. G2 selesai, dan basis buktinya bersih untuk
pertama kalinya. Arah G4/G6 (fusi menengah/akhir) tetap berdiri — bukan karena
fusi awal menjanjikan, melainkan karena ia sekarang dipalsukan secara meyakinkan
pada dua arsitektur dan tiga seed.

**Reproduksi** — `shell/matriks_g2.sh` lalu `ARCH=rtdetr-l shell/eval_g2.sh`.
Hasil: `experiments/results/E-022/paired_rtdetr-l_*_seed{42,1337,2024}.json`.

---

## E-030 — Sapuan kapasitas YOLO26 n→m→l: klaim "kapasitas" SR-015 harus dipersempit (2026-08-01) · G7

**Konteks** — SR-015 menyimpulkan *"arah efek kanal ke-4 ditentukan **kapasitas
model**, bukan isi kanal"*, berdasar lompatan YOLO26n (2,57 jt) → RT-DETR-L
(33,0 jt). Lompatan itu mengubah **kapasitas dan arsitektur sekaligus**, jadi
kata "kapasitas" belum terisolasi. Diminta pengguna 1 Agustus; YOLO26m (21,9 jt)
dan YOLO26l (26,3 jt) mengisi celah **di dalam satu keluarga arsitektur**.

**Hipotesis** — Bila kapasitas yang menentukan, pola depth-vs-derau harus
berubah secara monoton sepanjang 2,57 → 21,9 → 26,3 → 33,0 jt. **Dipalsukan
bila** YOLO26m dan YOLO26l berperilaku seperti YOLO26n meski kapasitasnya
mendekati RT-DETR-L — itu menunjukkan pembedanya arsitektur.

**Cara** — 6 run baru (2 arsitektur × 3 modal), seed 42, 60 epoch, imgsz 640,
batch 8, resep identik lengan E-022. Evaluasi protokol tunggal pycocotools
([E-025]), bootstrap 2000× per pohon. `shell/sapuan_kapasitas.sh`.

**Hasil — seluruh keluarga pada seed 42**

| Model | Param | depth − RGB | DERAU − RGB | depth − derau |
|---|---:|---:|---:|---:|
| YOLO26n | 2,57 jt | +0,0104 | +0,0032 | +0,0072 |
| YOLO26m | 21,9 jt | −0,0086 | +0,0184 | −0,0270 |
| **YOLO26l** | **26,3 jt** | +0,0054 | **−0,0325** | **+0,0379** |
| RT-DETR-L | 33,0 jt | −0,0350 | **−0,0533** | +0,0183 |

Tebal = CI95 tidak memuat nol. Metrik lengkap YOLO26l (seed 42): lengan rgbd
**unggul di keempat metrik sekaligus** — mAP50 0,3612 vs rgb 0,3557, mAP50-95
0,1299 vs 0,1207, precision 0,605 vs 0,569, recall 0,520 vs 0,482 — sementara
derau terburuk (0,3232, recall anjlok ke 0,385).

**Putusan — DIKONFIRMASI SEBAGIAN; klaim SR-015 harus DIPERSEMPIT.**

Yang bertahan: **kolom DERAU − RGB berubah tanda secara monoton menurut
kapasitas.** +0,0032 → +0,0184 → **−0,0325** → **−0,0533**, dan dua nilai
terbesar signifikan. Kanal ke-4 tanpa informasi **membantu** model kecil dan
**merugikan** model besar, persis mekanisme yang ditafsirkan SR-015 (regularisasi
pada model undertrained versus gangguan pada stem pratlatih). Titik baliknya kini
terukur: **antara 21,9 dan 26,3 jt parameter.**

Yang **tidak** bertahan: kolom depth − derau **tidak monoton** (+0,0072 →
−0,0270 → +0,0379 → +0,0183). YOLO26m menyimpang dari tren, dan tidak satu pun
dari keempatnya signifikan. Jadi kalimat "arah efek kanal ke-4 ditentukan
kapasitas" hanya benar untuk **kanal tanpa informasi**; untuk selisih
depth-versus-derau — bagian yang menyangkut apakah kedalaman membawa informasi —
kapasitas **tidak** menjelaskannya.

**Rumusan yang didukung bukti, menggantikan yang lama:**

> Kapasitas model menentukan apakah **menambahkan kanal keempat** menolong atau
> merugikan, dengan titik balik antara 21,9 dan 26,3 jt parameter. Kapasitas
> **tidak** menentukan apakah **mengisi kanal itu dengan kedalaman** lebih baik
> daripada mengisinya dengan derau.

**Yang tidak boleh dihaluskan:**

- **Satu seed.** E-027 dan E-029 sudah menunjukkan sebaran antar-seed 0,032–0,076
  pada dataset ini — lebih besar daripada sebagian besar selisih di tabel atas.
  Monotonisitas kolom DERAU − RGB **belum diuji multi-seed**, dan sampai itu
  dilakukan ia adalah pola yang menarik, bukan temuan mapan.
- Hanya kolom DERAU − RGB yang punya dua nilai signifikan; sembilan sel lainnya
  CI-nya memuat nol.
- Keunggulan empat-metrik YOLO26l rgbd bersandar pada satu run tunggal.
- Perangkat A4500; berlaku untuk fusi AWAL 4-kanal pada SawitMVC-Depth.

**Dampak** — Mengubah dasar pemilihan arsitektur untuk E-023. Alasan memakai
model besar bukan lagi "di situ depth terbukti membawa informasi" (dicabut
[E-029]), melainkan yang lebih spesifik: **pada model besar, kerugian menambah
kanal keempat paling parah** — dan justru itu yang seharusnya dihapus oleh fusi
menengah/akhir, karena keduanya tidak menyentuh stem 3-kanal berbobot pratlatih.
G7 dengan demikian mempertajam prediksi yang akan diuji G4/G6, bukan sekadar
menambah baris tabel.

**Reproduksi** — `shell/sapuan_kapasitas.sh`, lalu `ARCH=yolo26m|yolo26l
SEEDS=42 shell/eval_g2.sh`. Hasil: `experiments/results/E-022/paired_yolo26{m,l}_*_seed42.json`,
metrik lengkap di `metrics_lengkap.json`.

---

## E-031 — Varians SPLIT vs varians SEED (2026-08-01) · G5, menutup SR-015 §7

**Konteks** — [SR-015](SR/SR-015-depth-sensor-4kanal.md) §7 mencatat *"varians
split belum diukur; 3-fold CV yang direncanakan tidak dijalankan"* — satu-satunya
keterbatasan E-022 yang belum tersentuh setelah [E-027]/[E-029]/[E-030] menutup
varians seed.

Dua sumber varians ini sering tertukar, dan pemisahannya menentukan:

| | Yang divariasikan | Yang diukur |
|---|---|---|
| E-027 | RNG pelatihan, split tetap | keacakan optimisasi |
| **E-031** | **split**, RNG tetap 42 | ketergantungan pada pohon mana yang jatuh di test |

**Hipotesis** — Bila kesimpulan E-022 kokoh terhadap pemilihan pohon, Δ(RGB-D −
RGB) harus stabil lintas split. **Dipalsukan bila** rentang Δ antar-split
sebanding atau melebihi efek yang diperdebatkan sepanjang E-022 (±0,02–0,04).

**Cara** — Dua split baru (`splits_depth/seed1`, `seed2`) dari
`build/make_splits_depth.py`, stratifikasi dan rasio identik seed42: 245/35/72
pohon, irisan nol. YOLO26n rgb + rgbd per split, 60 epoch, **RNG pelatihan tetap
42**, resep identik. Evaluasi pycocotools, bootstrap 2000× per pohon, tiap model
dinilai pada test split-nya sendiri.

**Hasil**

| Split | RGB | RGB-D | Δ | CI95 |
|---|---:|---:|---:|---|
| seed42 | 0,3479 | 0,3583 | +0,0104 | [−0,0246; +0,0397] |
| seed1 | 0,3137 | 0,3204 | +0,0067 | [−0,0351; +0,0450] |
| seed2 | 0,2991 | 0,3384 | **+0,0393** | **[+0,0059; +0,0665]** |

| Sumber varians | Lengan RGB | Δ(RGB-D − RGB) |
|---|---:|---:|
| **Split** (E-031, RNG tetap) | rentang **0,0488** · sd 0,0205 | rentang 0,0326 · sd 0,0146 |
| **Seed** (E-027, split tetap) | rentang 0,0321 | rentang 0,0518 |

**Putusan — varians split NYATA dan lebih besar daripada varians seed pada
performa absolut.** Lengan RGB berayun **0,0488** antar split — lebih lebar
daripada 0,0321 antar seed, dan **hampir 5× lipat** ambang +0,015 yang
ditetapkan H-022 sebagai kriteria keberhasilan depth. Kesimpulan yang mengikat:
**tidak ada angka mAP absolut pada dataset ini yang bermakna tanpa menyebut
split-nya.**

**Tetapi arah Δ justru lebih stabil terhadap split daripada terhadap seed.**
Ketiga split memberi Δ **positif** (+0,0104 / +0,0067 / +0,0393, rerata +0,0188,
sd 0,0146), sementara ketiga seed memberi tanda **berlawanan** (+0,0104 /
−0,0414 / −0,0379, sd 0,0289). Rasio sd-nya 1 : 2. Itu berlawanan dengan dugaan
yang wajar — orang mengira pemilihan pohon lebih mengguncang daripada RNG.

**Tafsir yang hemat, dan batasnya.** Pola ini konsisten dengan gagasan bahwa
selisih berpasangan **saling menghapus** komponen kesulitan split (kedua lengan
menghadapi pohon test yang sama) tetapi **tidak** menghapus lintasan optimisasi
(kedua lengan punya lintasan berbeda meski seed sama, karena arsitekturnya
berbeda satu kanal). Kalau benar, maka **menambah seed lebih berharga daripada
menambah split** untuk menguji klaim depth — dan itu justru kebalikan dari yang
direncanakan sebagai "3-fold CV" di SR-015. **Ini hipotesis dari n=3 lawan n=3;
belum diuji, dan tidak boleh dipakai sebagai dasar merancang E-023 tanpa
verifikasi.**

**Yang tidak boleh dihaluskan:**

- **n = 3 split** dan **n = 3 seed**. Membandingkan dua sd dari sampel sekecil
  itu tidak punya daya uji; rasio 1 : 2 dapat berbalik dengan mudah.
- Hanya **satu arsitektur** (YOLO26n) dan **satu kontras** (depth vs RGB).
  Kontrol derau dan tukar tidak dijalankan lintas split.
- split2 satu-satunya yang CI-nya tidak memuat nol (+0,0393). Dengan tiga split,
  satu hasil signifikan adalah yang diharapkan muncul secara kebetulan pada
  α=0,05 kira-kira 14% waktu — **bukan bukti**.
- Perangkat A4500; fusi AWAL 4-kanal; SawitMVC-Depth.

**Dampak** — Menutup keterbatasan terakhir SR-015 §7. Aturan pelaporan yang kini
berlaku: **setiap angka mAP pada dataset ini wajib menyebut split**, karena
rentang antar-split (0,0488) melampaui hampir semua efek yang pernah
diperdebatkan di E-022. Untuk G4/G6, prioritas replikasi adalah **seed lebih
dulu, split kemudian** — dengan catatan bahwa dasar prioritas itu sendiri masih
hipotesis.

**Reproduksi** — `build/make_splits_depth.py --seed 1 --seed 2`, lalu
`train_depth4ch.py --split seed{1,2}`, lalu `eval_e022_paired.py --split-dir
splits_depth/seed{1,2}`. Hasil: `experiments/results/E-022/paired_yolo26n_depth_vs_rgb_split{1,2}.json`.

---

## E-032 — Titik fusi RGB-D: awal vs menengah vs akhir, semua dari nol (2026-08-01) · G4, G6

**Hipotesis** — E-022 menguji fusi hanya pada satu titik: konkatenasi 4-kanal di
masukan. Kalau kegagalannya disebabkan TITIK fusi (depth dipaksa masuk sebelum
jaringan sempat membentuk fitur), memindahkan fusi lebih dalam harus menolong.
Dua alternatif diuji sejajar: fusi MENENGAH (cabang depth ringan sampai P2/4,
digabung sebelum P3) dan fusi AKHIR (dua backbone penuh, digabung di P3/P4/P5).

**Metode** — 5 lengan x 3 seed = 15 run, seluruhnya YOLO26 skala n, 150 epoch,
imgsz 640, batch 16, split SawitMVC-Depth seed42, **tanpa bobot pratlatih**.

Dari nol untuk SEMUA lengan, termasuk baseline RGB. Bukan penghematan — justru
3x lebih mahal — melainkan karena arsitektur dua cabang lahir dari YAML kustom
dan tidak punya checkpoint COCO yang cocok. Membandingkan fusi-dari-nol dengan
lengan pratlatih akan mengukur ada-tidaknya pralatihan, bukan titik fusi.

150 epoch, bukan 60: dari nol dengan 980 citra latih, 60 epoch underfit dan
hasil rendahnya akan salah dibaca sebagai "fusi gagal".

Lengan `derau` (kanal ke-4 berisi derau) WAJIB per SR-015 §6 — tanpanya kenaikan
apa pun tidak dapat dipisahkan dari efek menambah kapasitas.

Evaluasi: pycocotools, bootstrap berpasangan 2000x pada tingkat POHON (72 pohon,
288 citra uji). `hasil.json` trainer tidak dipakai [E-025].

**Kriteria ditetapkan SEBELUM hasil dibaca** (`eval/ringkas_e023.py`):
berbeda dari baseline = 3/3 seed sepakat tanda DAN tidak ada CI yang memuat nol;
indikasi = tanda sepakat tetapi ada CI memuat nol; selain itu = tidak berbeda.

**Hasil — Δ mAP50 terhadap baseline RGB seed yang sama**

| lengan | seed 42 | seed 1337 | seed 2024 | rerata | rentang | putusan |
|---|---|---|---|---|---|---|
| awal  | -0,0120 | +0,0234 | -0,0017 | +0,0032 | 0,0354 | tidak berbeda |
| mid   | +0,0096 | +0,0212 | +0,0110 | +0,0139 | 0,0116 | **indikasi** |
| late  | -0,0056 | +0,0070 | +0,0102 | +0,0039 | 0,0158 | tidak berbeda |
| derau | -0,0130 | +0,0025 | -0,0081 | -0,0062 | 0,0155 | tidak berbeda |

Seluruh 12 CI95 memuat nol. Tidak ada satu pun lengan yang lolos ambang
"berbeda"; `mid` satu-satunya yang tandanya sepakat di tiga seed.

**Tiga pembacaan, berurut dari yang paling didukung bukti**

1. **Efek titik fusi lebih kecil daripada derau seed.** Rentang antar-seed
   `awal` (0,0354) melampaui SELURUH selisih titik yang terukur di tabel ini.
   Pada 2,57 jt param dengan 980 citra dari nol, memindahkan titik fusi tidak
   menghasilkan efek yang dapat dipisahkan dari pemilihan seed.

2. **Fusi AKHIR tidak menolong meski menambah parameter paling banyak** (3,00 jt
   vs 2,51 jt `mid` vs 2,57 jt `awal`). Ini menjawab G6: dua backbone penuh,
   ~17% parameter tambahan, nol perbaikan yang dapat dibedakan.

3. **`mid` konsisten positif tetapi belum boleh disebut temuan.** Rentangnya
   paling sempit (0,0116) dan reratanya tertinggi (+0,0139), unggul +0,0201 atas
   kontrol derau. Itu pola yang diharapkan bila fusi menengah benar-benar
   bekerja — tetapi ketiga CI-nya memuat nol, dan dengan 4 lengan diuji, satu
   lengan bertanda sepakat 3/3 secara kebetulan bukan kejadian langka.

**Keterbatasan**

- **Satu skala (n), satu arsitektur (YOLO26), satu split.** E-030 menunjukkan
  arah efek kanal ke-4 berubah dengan kapasitas; E-031 menunjukkan varians split
  (0,0488) melampaui hampir semua efek di sini. Kesimpulan ini terikat pada
  yolo26n/split-seed42 dan TIDAK boleh digeneralkan.
- **Semua lengan dari nol.** Tidak menjawab apakah fusi menengah menolong ketika
  cabang RGB dapat memakai bobot pratlatih — konfigurasi yang justru paling
  mungkin dipakai di praktik.
- **72 pohon.** CI selebar +-0,03 adalah konsekuensi langsung ukuran uji ini,
  bukan kelemahan metode.
- Baseline seed 42 (0,3164) jauh di atas seed 1337 (0,2944) dan 2024 (0,2952).
  Seluruh lengan tampak "naik" pada dua seed terakhir sebagian karena
  baselinenya rendah — alasan tambahan untuk tidak membaca kolom per seed
  sendirian.

**Dampak** — Menutup G4 dan G6. Untuk SR-015: klaim "kanal ke-4 tidak menolong
pada kapasitas kecil" kini berlaku juga ketika fusi dipindah ke P2/4 dan
P3/P4/P5, bukan hanya di masukan — jadi penjelasan "titik fusi salah" GUGUR
sebagai kandidat penyebab. Yang tersisa sebagai kandidat: kapasitas (E-030),
kualitas depth itu sendiri, dan ukuran data.

Arah yang layak berikutnya, dan hanya jika ada alasan lain untuk melanjutkan:
`mid` pada yolo26m/l, di mana E-030 menunjukkan isi kanal ke-4 mulai penting.

**Catatan operasional** — Penjaga "lewati bila berkas hasil sudah ada" TIDAK
mencegah peluncuran ganda: hasil ditulis di akhir, jadi driver meluncurkan
salinan kedua `awal_seed2024` 20 menit setelah yang pertama mulai. Membunuh
induknya juga tidak cukup — 12 pekerja ProcessPoolExecutor menjadi yatim dan
terus berjalan. Yang dibutuhkan kunci berbasis proses (`flock` pada penanda saat
MULAI), bukan pemeriksaan keberadaan hasil.

**Reproduksi** — `shell/e023_fusi.sh` (seed 42, 1337) dan `shell/e023_seed2024.sh`,
lalu `shell/eval_e023_par.sh`, lalu `eval/ringkas_e023.py`. Bukti:
`experiments/results/E-023/paired_{awal,mid,late,derau}_vs_rgb_seed{42,1337,2024}.json`;
kurva latihan + hash bobot 15 run di direktori yang sama.
## E-033 — Rentang metrik kanal depth: 0,3/8,0 (salah) vs 0,8/15,0 (terkalibrasi) (2026-08-06) · SR-015

**Hipotesis** — `fourch.Z_NEAR/Z_FAR` di jalur produksi masih 0,3/8,0, sedangkan
E-022 memilih 0,8/15,0 dari histogram split train. Rentang yang salah membuang
sebagian besar jangkauan kanal: pada 60 citra train terukur entropi **6,190 bit
vs 7,627 bit**, median level **23 vs 72** dari 255, dan **10,22% vs 0,40%**
piksel mentok di level 1. Kalau kerugian informasi sebesar itu berdampak pada
deteksi, lengan z08 harus mengalahkan lengan z03 secara konsisten.

Ini menguji satu kandidat penyebab yang MASIH TERBUKA di SR-015 §7b setelah
titik fusi dicoret: **kualitas kanal depth itu sendiri**.

**Yang akan memalsukan** (ditetapkan sebelum satu angka pun dibaca):
- **DIPALSUKAN** (rentang tidak berdampak) bila |Δ mAP50| ≤ 0,015 pada ketiga
  arsitektur, ATAU tanda Δ tidak konsisten antar arsitektur.
- **DIKONFIRMASI** bila tanda Δ konsisten (z08 > z03) pada ketiga arsitektur
  DAN sekurang-kurangnya satu CI95 tidak memuat nol.
- Selain itu = **INDIKASI**.

**Cara** — 3 arsitektur × 2 lengan = 6 run. Seed 42 saja, 30 epoch, **tanpa
early stopping** (`patience=epochs` untuk ultralytics, `early_stopping=False`
untuk rfdetr), split SawitMVC-Depth seed42 (980/140/288 citra, 72 pohon uji).

| arsitektur | bobot awal | batch | catatan |
|---|---|---|---|
| YOLO26n | `yolo26n.pt` | 16 | ultralytics 8.4.103 |
| RT-DETR-L | `rtdetr-l.pt` | 8 | batch 8 (bukan 16) agar dua lengan muat serentak; identik di kedua lengan |
| RF-DETR Nano | pratlatih rfdetr | 8 (grad-accum 2) | normalisasi kanal depth dari train saja |

**Kedua lengan hanya berbeda pada folder PNG depth.** Set z03 dibangkitkan
dengan `build/reproject_depth.py --z-near 0.3 --z-far 8.0`, yaitu jalur
reproyeksi yang PERSIS sama dengan set z08 — kontrolnya: cakupan piksel valid
rata-rata identik **0,71032** di kedua set, jadi geometri, z-buffer, dan tambal
lubangnya benar-benar sama dan yang berbeda hanya pengodean.

Pagar keadilan (identik di kedua lengan, diverifikasi dari `args.yaml`):
`hsv_h=hsv_s=hsv_v=0` (RandomHSV melewati citra 4-kanal secara diam), modality
dropout 0, inflasi conv pertama dari bobot pratlatih (model **dan** EMA),
`deterministic=True`, seed 42, imgsz/resolution 640.

**Cacat yang ditutup sebelum run** — `DEPTH_DIR` di-hardcode di
`train/train_rfdetr_4ch.py`, `eval/eval_e022_pycoco.py`,
`eval/eval_rfdetr_e022.py`, dan diwarisi `eval/eval_e022_paired.py`. Tanpa
`--depth-dir`, bobot z03 akan dinilai memakai depth z08 — ketidakcocokan
latih/uji yang senyap dan akan memalsukan efek besar yang sebetulnya artefak.
Keempat skrip kini menerima folder depth eksplisit per lengan.

Evaluasi: pycocotools protokol tunggal, bootstrap berpasangan 2000× pada tingkat
POHON. `hasil.json` trainer tidak dipakai untuk membandingkan lengan [E-025].

**Batas yang melekat pada rancangan ini, jangan dihaluskan:**
- **Satu seed.** E-032 mengukur rentang antar-seed **0,0354** pada lengan `awal`
  YOLO26n — lebih besar daripada seluruh efek yang pernah terukur di E-022.
  CI bootstrap di sini mengukur galat pencuplikan SET UJI, **bukan** varians
  seed. Δ yang "signifikan" di sini karenanya bukti yang lebih lemah daripada
  Δ signifikan di E-032.
- **30 epoch**, bukan 60 atau 150. Angka absolutnya tidak sebanding dengan
  E-022/E-027/E-030/E-032 maupun dengan E-021.
- **Tanpa lengan RGB.** Yang diuji murni kontras z08 vs z03; eksperimen ini
  tidak dapat menjawab apakah kanal depth menolong sama sekali.
- RT-DETR-L memakai batch 8, berbeda dari E-022 yang memakai 16. Sah untuk
  kontras di dalam arsitektur, tidak sah untuk dibandingkan lintas eksperimen.

**Hasil** — Δ = z08 − z03, pycocotools, bootstrap berpasangan 2000× per pohon
(72 pohon, 288 citra uji). `*` = CI95 tidak memuat nol.

| metrik | YOLO26n | RT-DETR-L | RF-DETR Nano |
|---|---|---|---|
| mAP50 z03 (rentang salah) | 0,3485 | 0,4021 | 0,4351 |
| mAP50 z08 (terkalibrasi) | 0,3707 | 0,4126 | 0,4539 |
| **Δ mAP50** | **+0,0222** | **+0,0105** | **+0,0188** |
| CI95 Δ mAP50 | [−0,0101; +0,0571] | [−0,0285; +0,0546] | [−0,0155; +0,0558] |
| frac. bootstrap positif | 0,905 | 0,712 | 0,848 |
| Δ B1 | −0,0029 | **−0,0648** * | +0,0071 |
| Δ B2 | +0,0067 | −0,0089 | −0,0367 |
| Δ B3 | **+0,0876** * | +0,0678 | +0,0659 |
| Δ B4 | −0,0026 | +0,0480 | +0,0390 |

Rerata Δ mAP50 **+0,0172**, rentang antar-arsitektur 0,0117.
Rerata Δ B3 **+0,0738**, rentang 0,0217.

**Putusan — INDIKASI.** Kriteria yang ditetapkan di muka tidak terpenuhi ke arah
mana pun:

- **Tidak DIPALSUKAN.** Tanda Δ mAP50 **positif pada ketiga arsitektur**, dan dua
  dari tiga melebihi ambang 0,015.
- **Tidak DIKONFIRMASI.** Tidak satu pun CI95 Δ mAP50 mengecualikan nol.

Pola sekunder yang paling tahan: **Δ B3 positif pada ketiganya**
(+0,0876 / +0,0678 / +0,0659; fraksi bootstrap positif 0,989 / 0,917 / 0,900),
signifikan pada YOLO26n. Rentang antar-arsitekturnya hanya 0,0217 — sempit untuk
tiga arsitektur yang mAP50 absolutnya berbeda 0,09.

**Kontra-pola yang tidak boleh disembunyikan:** RT-DETR-L kehilangan B1 secara
signifikan (−0,0648 [−0,1123; −0,0130], fraksi positif 0,004), sementara dua
arsitektur lain tidak (−0,0029 dan +0,0071). Jadi rentang yang benar **bukan**
menang di semua lini pada semua arsitektur; pada RT-DETR-L ia menggeser kinerja
dari B1 ke B3/B4. B2 juga campur (+0,0067 / −0,0089 / −0,0367).

**Mengapa ini belum boleh disebut temuan:** E-032 mengukur ayunan antar-seed
**0,0354** pada YOLO26n — **lebih besar daripada rerata Δ mAP50 +0,0172 di sini**.
Eksperimen ini satu seed, jadi CI bootstrapnya mengukur galat pencuplikan set uji
saja dan tidak dapat memisahkan efek rentang dari lotere inisialisasi. Yang
memberi bobot lebih pada Δ B3 bukan besarnya, melainkan **tanda yang sepakat di
tiga arsitektur berbeda** — replikasi lintas-arsitektur, bukan lintas-seed.
Perlu diingat pula B3 hanya ~14% kotak dengan AP50 dasar rendah (0,16–0,39),
jadi ia kelas paling berderau; konsistensi tandanya yang menarik, bukan
magnitudonya sendirian.

**Dampak**

1. **Untuk SR-015 §7b:** "kualitas kanal depth" tetap kandidat penyebab yang
   hidup, dan kini punya bukti terarah pertamanya — memperbaiki pengodean
   menggerakkan angka ke arah yang diprediksi pada tiga arsitektur sekaligus.
   Belum cukup untuk mengubah putusan SR-015; fusi awal tetap DIPALSUKAN.
2. **Untuk jalur produksi:** `pipeline/fourch.py` masih memakai
   `Z_NEAR/Z_FAR = 0,3/8,0` sebagai konstanta modul, tanpa flag CLI. Eksperimen
   ini memberi alasan empiris untuk membongkarnya: rentang wajib parameter
   eksplisit dan wajib ditulis ke `depth_meta.json` bersama bobot, sebagaimana
   jalur eksperimen sudah melakukannya.
3. **Uji lanjutan yang dibenarkan hasil ini:** ulangi kontras z08 vs z03 pada
   **3 seed** untuk satu arsitektur (YOLO26n, paling murah). Tanpa itu +0,0172
   tidak dapat dipisahkan dari derau seed, dan klaim apa pun akan mengulang
   kesalahan yang menjatuhkan E-022.

**Cacat lingkungan yang ditemukan saat menjalankan** (bukan hasil ilmiah, tetapi
menghabiskan waktu nyata dan akan berulang):

- `nohup … &` dari shell yang time-out ikut terbunuh bersama grup prosesnya —
  dua run RT-DETR mati senyap setelah mencetak "Starting training". Pakai
  `setsid`.
- venv `.venv` tidak lengkap dibangun ulang: `tqdm`, `huggingface_hub`,
  `pytorch_lightning`, `faster_coco_eval`, `albumentations` semuanya hilang dan
  masing-masing menggagalkan RF-DETR pada titik yang berbeda. `requirements.txt`
  tidak menyebut empat yang terakhir (semuanya dependensi tak langsung `rfdetr`).
- `pip install albumentations` menarik `opencv-python-headless 5.0.0.93` —
  persis jebakan yang dicatat STATUS.md §2. Dikembalikan ke `4.11.0.86`.

**Reproduksi** — `build/reproject_depth.py --z-near 0.3 --z-far 8.0 --tujuan
depth_png_z03_8` (set z08 sudah ada), lalu `train/train_depth4ch.py` (yolo26n,
rtdetr-l) dan `train/train_rfdetr_4ch.py --depth-dir …`, lalu
`eval/eval_e022_paired.py --depth-dir-a/--depth-dir-b` dan
`eval/eval_rfdetr_e022.py --depth-dir-a/--depth-dir-b`. Bukti:
`experiments/results/E-033/paired_{yolo26n,rtdetrl,rfdetrnano}.json`.

## E-033b — Replikasi 3 seed E-033: efek mAP50 TIDAK bertahan (2026-08-06) · SR-015

**Hipotesis** — E-033 memberi INDIKASI: Δ mAP50 (z08 − z03) positif pada tiga
arsitektur, rerata +0,0172, tetapi seluruh CI memuat nol dan seluruhnya satu
seed. E-032 mengukur ayunan antar-seed 0,0354 pada YOLO26n — lebih besar
daripada efek itu. Kalau efek rentang metrik nyata, tandanya harus bertahan
ketika seed diganti.

**Yang akan memalsukan** (kriteria E-032 dipakai apa adanya): tanda Δ tidak
sepakat pada 3 seed.

**Cara** — 4 run baru YOLO26n (seed 1337 dan 2024 × lengan z08/z03), resep
IDENTIK dengan E-033 seed 42: 30 epoch, tanpa early stopping, hsv=0, dropout=0,
inflasi conv pertama, split `seed42` (split tidak diubah — yang divariasikan
hanya seed inisialisasi). Evaluasi sama: pycocotools, bootstrap berpasangan
2000× per pohon.

**Hasil — Δ mAP50 dan per kelas, YOLO26n**

| metrik | seed 42 | seed 1337 | seed 2024 | rerata | rentang |
|---|---|---|---|---|---|
| **mAP50** | **+0,0222** | **−0,0052** | **−0,0012** | **+0,0053** | 0,0274 |
| mAP50-95 | +0,0050 | −0,0048 | −0,0095 | −0,0031 | 0,0146 |
| B1 | −0,0029 | **−0,0555** * | −0,0417 | −0,0333 | 0,0526 |
| B2 | +0,0067 | +0,0162 | −0,0149 | +0,0027 | 0,0310 |
| B3 | **+0,0876** * | +0,0216 | +0,0566 | +0,0553 | 0,0660 |
| B4 | −0,0026 | −0,0032 | −0,0049 | −0,0036 | 0,0023 |

`*` = CI95 tidak memuat nol.

mAP50 absolut: z03 = 0,3485 / 0,3213 / 0,3613 (rentang antar-seed **0,0400**);
z08 = 0,3707 / 0,3161 / 0,3601 (rentang **0,0546**). **Ayunan seed pada satu
lengan lebih besar daripada seluruh selisih antar-lengan yang pernah terukur.**

**Putusan — DIPALSUKAN untuk mAP50 agregat.** Tanda Δ mAP50 tidak sepakat
(+ / − / −). Angka +0,0222 pada seed 42 — dasar seluruh INDIKASI di E-033 —
adalah **pencilan seed**, bukan efek. Rerata turun dari +0,0222 menjadi +0,0053,
lebih kecil daripada ambang 0,015 yang ditetapkan di muka.

Ini persis mode kegagalan yang menjatuhkan E-022 dan kemudian dikoreksi E-027:
satu seed yang kebetulan bagus dibaca sebagai temuan. Kali ini tertangkap
sebelum masuk laporan.

**Yang TETAP berdiri — redistribusi antar kelas.** Dua pola tidak ikut runtuh,
dan keduanya konsisten lintas seed DAN lintas arsitektur:

| kelas | 3 seed YOLO26n | RT-DETR-L | RF-DETR Nano | rerata 5 pengukuran |
|---|---|---|---|---|
| **B3** | +0,0876 * / +0,0216 / +0,0566 | +0,0678 | +0,0659 | **+0,0599**, positif **5/5** |
| **B1** | −0,0029 / −0,0555 * / −0,0417 | −0,0648 * | +0,0071 | **−0,0316**, negatif **4/5** |

Jadi memperbaiki rentang metrik **memindahkan kinerja dari B1 ke B3**, dan
kedua efek itu saling meniadakan di agregat. Itu menjelaskan mengapa mAP50
tampak bergerak positif di E-033 pada tiga arsitektur namun tidak pernah
signifikan: yang bergerak bukan total, melainkan distribusinya.

Penjelasan yang konsisten dengan fisika pengodean, **belum diuji**: rentang
0,3/8,0 memampatkan seluruh adegan ke level 1–122 dengan 10,2% piksel mentok di
level 1, sehingga jarak menengah-jauh kehilangan resolusi. Rentang 0,8/15,0
memulihkan resolusi di sana tetapi menghabiskan lebih sedikit level untuk objek
dekat. B1 (matang, cenderung terlihat besar/dekat) dan B3 tidak berada pada
rentang jarak yang sama. Ini hipotesis pasca-hoc — jangan dikutip sebagai
temuan tanpa uji terstratifikasi menurut jarak.

**Dampak**

1. **INDIKASI E-033 dicabut untuk mAP50.** Jangan mengutip +0,0172 maupun
   +0,0222. Yang boleh dikutip: rentang metrik tidak memperbaiki mAP50 agregat
   pada 3 seed, dan menggeser B1 → B3.
2. **SR-015 §7b:** "kualitas kanal depth" tetap kandidat penyebab yang hidup,
   tetapi bukti terarah pertamanya ternyata **bukan** kenaikan agregat. Kalau
   jalur depth diteruskan, ukuran yang layak dipantau adalah AP per kelas
   terstratifikasi jarak, bukan mAP50.
3. **Jalur produksi:** alasan memperbaiki `fourch.Z_NEAR/Z_FAR` sekarang
   **bukan** "menaikkan mAP" — melainkan bahwa rentang yang salah mengubah
   perilaku per kelas secara sistematis dan diam-diam. Rentang tetap wajib jadi
   parameter eksplisit yang tercatat bersama bobot, tetapi jangan dijanjikan
   memberi kenaikan angka.
4. **Pelajaran proses:** 4 run YOLO26n paralel berebut `labels.cache` bersama di
   folder dataset (`/workspace/SawitMVC-Depth/data/labels.cache`); dua run mati
   dengan `FileNotFoundError`. Anggaran VRAM saja tidak cukup — run serentak
   juga berbagi berkas cache. Geser waktu peluncuran atau pisahkan cache.

**Reproduksi** — `train/train_depth4ch.py --arch yolo26n --modal rgbd --seed
{1337,2024} --depth-dir {depth_png,depth_png_z03_8} --epochs 30`, lalu
`eval/eval_e022_paired.py --depth-dir-a/--depth-dir-b`. Bukti:
`experiments/results/E-033/paired_yolo26n_seed{1337,2024}.json`.

## F-002 — (P2) Apakah frekuensi tinggi memisahkan tandan dari PELEPAH? (2026-08-06) · gerbang K1 · [SR-017](SR/SR-017-sintesis-deep-research.md)

**Hipotesis** — K1 (cabang frekuensi samping) bersandar pada anggapan bahwa
respons frekuensi tinggi menyoroti isi tandan. E-011 sudah mengukur sesuatu yang
mirip — Laplacian +0,0458 di atas kendali pada B4, mengungguli Sobel +0,0367 —
tetapi pembandingnya **cincin sekeliling**, yang memuat apa saja: langit, batang,
tanah, tandan tetangga.

Mode gagal yang dikhawatirkan lebih spesifik: pelepah sawit adalah struktur
berfrekuensi sangat tinggi (anak daun tipis berulang), dan B4 yang gelap
kehijauan justru kelas yang paling menyatu dengannya. Bila frekuensi tinggi
tidak memisahkan tandan dari **pelepah**, cabang K1 akan belajar menyalakan
pelepah, dan kenaikan apa pun yang muncul bukan dari mekanisme yang diklaim.

**Dipalsukan bila** tidak ada satu pun lengan frekuensi tinggi yang menaikkan
AUC tandan-vs-pelepah lebih dari **+0,02** di atas kendali kotak acak pada B4
(ambang diambil dari E-011 supaya kedua uji terbaca pada skala yang sama).

**Cara** — `experiments/code/analysis/freq_vs_pelepah.py`, 250 citra
`SawitMVC-test`, 1.114 kotak GT terukur (1 kotak sebagian ditolak karena wilayah
pelepahnya < 200 piksel). Wilayah pembanding didefinisikan ulang:

    pelepah = cincin sekeliling kotak  MINUS  seluruh kotak GT tandan lain

`asli`/`gradmag`/`laplacian` disalin persis dari `contrast_boost_test.py` agar
sebanding dengan E-011. Sub-band Haar satu tingkat (LH/HL/HH) ditulis langsung
dengan numpy — `pywt` tidak terpasang. Ketiga sub-band dihaluskan Gaussian
sigma=2 **identik** dengan perlakuan gradmag/laplacian di E-011; tanpa itu
perbandingan DWT vs Laplacian tercemar beda penghalusan, bukan beda kandungan
frekuensi. Kendali kotak acak berukuran sama diperlakukan identik.

**Hasil** — AUC pemisahan piksel isi-kotak vs pelepah:

| Lengan | B1 | B2 | B3 | B4 | kendali | B4−kendali |
|---|---|---|---|---|---|---|
| asli (luminans) | 0,6016 | 0,6127 | 0,5889 | 0,5849 | 0,5694 | +0,0155 |
| gradmag (Sobel) | 0,5790 | 0,5898 | 0,6052 | 0,6289 | 0,5681 | +0,0608 |
| **laplacian** | 0,5804 | 0,5934 | 0,6133 | 0,6423 | 0,5702 | **+0,0721** |
| dwt_lh | 0,5779 | 0,5918 | 0,6068 | 0,6325 | 0,5702 | +0,0623 |
| dwt_hl | 0,5750 | 0,5818 | 0,6018 | 0,6286 | 0,5652 | +0,0634 |
| **dwt_hh** | 0,5808 | 0,5927 | 0,6134 | 0,6403 | 0,5672 | **+0,0731** |
| dwt_energi | 0,5818 | 0,5921 | 0,6113 | 0,6403 | 0,5683 | +0,0720 |

**Putusan** — **LOLOS.** Lengan terbaik dwt_hh +0,0731, lebih dari tiga kali
ambang +0,02. Mode gagal yang dikhawatirkan **tidak terjadi**: pemisahan terhadap
pelepah justru LEBIH BESAR daripada terhadap cincin generik di E-011 (Laplacian
0,0721 vs 0,0458).

Dua pembacaan yang lebih penting daripada angka gerbangnya:

1. **Urutan kelas monoton B1 < B2 < B3 < B4 pada SETIAP lengan frekuensi
   tinggi**, dan terbalik pada luminans (di sana B4 justru paling rendah,
   0,5849). Arah ini persis yang diramalkan mekanismenya: makin mentah, makin
   gelap-kehijauan, makin menyatu dengan pelepah dalam intensitas — dan makin
   terpisah dalam tekstur. Ini mereplikasi pembalikan urutan E-011 pada
   pembanding yang lebih ketat.
2. **Laplacian dan DWT-HH praktis seri** (0,0721 vs 0,0731; selisih 0,0010).
   Pada dataset ini, sub-band DWT **tidak** membeli apa pun di atas Laplacian
   biasa yang jauh lebih murah. Konsekuensinya untuk F-007: lengan Laplacian
   bukan formalitas — ia pesaing sesungguhnya, dan **DWT wajib mengalahkannya**
   untuk membenarkan mesin tambahannya.

**Dampak** — K1 boleh dilanjutkan ke F-007. Lengan `laplacian` dinaikkan
statusnya dari pembanding menjadi kandidat setara. Uji ini **tidak** membuktikan
K1 akan menaikkan mAP; ia hanya menutup satu mode gagal yang dapat membatalkannya
secara murah. Keterpisahan piksel bukan AP.

**Reproduksi** — `python analysis/freq_vs_pelepah.py --images 250`. Bukti:
`experiments/results/F-002/freq_vs_pelepah.json`.

## F-003 — (P3) Plafon keras distilasi lintas-sisi (2026-08-06) · gerbang K3 · [SR-017](SR/SR-017-sintesis-deep-research.md)

**Hipotesis** — K3 memindahkan keyakinan dari sisi yang benar ke sisi yang salah
lewat graf `_confirmedLinks`. Mekanisme itu punya plafon keras yang dapat diukur
tanpa melatih apa pun: **dari kemunculan tandan yang diprediksi salah kelas,
berapa fraksi yang punya kemunculan BENAR pada sisi lain tandan fisik yang sama?**
Bila mayoritas galat salah di semua sisi, tidak ada yang bisa ditransfer.

**Dipalsukan bila** fraksi galat-yang-dapat-diselamatkan < **0,30**.

**Cara** — `analysis/cross_side_consistency.py --dump-tandan` (flag baru; jalur
agregatnya tidak diubah) lalu `analysis/plafon_lintas_sisi.py`. Bobot
`runs_e022/yolo26n_sawitmvc_rgb_seed42`, `SawitMVC-test`, conf 0,25, IoU cocok
0,5. Oracle identitas = `bunches[].appearances` dari `json/<pohon>.json`.

Pemeriksaan kebenaran modifikasi: jalur agregat mereproduksi E-028 **persis** —
511 tandan terukur, 119 tidak konsisten, laju **0,2329**.

**Kenapa perlu inferensi ulang** — `results/E-028/konsistensi_sawitmvc_rgb_seed42.json`
diperiksa langsung dan **hanya menyimpan laju agregat**; tidak ada satu pun
prediksi per-sisi. Ini menjawab §9 butir 3 rencana: P3 tidak dapat dihitung dari
berkas itu.

**Hasil** — 1.022 tandan multi-sisi, 2.230 kemunculan: 1.078 benar, 408 salah
kelas, 744 terlewat.

| Plafon | n | fraksi | CI95 |
|---|---|---|---|
| **Kelas** (galat kelas punya sisi benar) | 114 / 408 | **0,2794** | [0,2353; 0,3235] |
| **Kehadiran** (sisi terlewat punya sisi benar) | 368 / 744 | **0,4946** | [0,4583; 0,5309] |

Sebaran sisi benar pada tandan yang bergalat: **194 tandan punya NOL sisi benar**,
93 punya satu, 10 punya dua, 4 punya tiga. Dari 408 galat kelas, **294 (72%)
salah di SEMUA sisi**.

Per kelas GT (fraksi dapat diselamatkan): B1 0,5333 (16/30) · B3 0,4257 (43/101)
· B2 0,2573 (44/171) · **B4 0,1038 (11/106)**.

**Putusan** — **DIPALSUKAN untuk suku kelas, tetapi lemah.** Titik estimasi
0,2794 di bawah ambang pra-daftar 0,30, jadi aturan yang ditulis sebelum melihat
data mengikat dan K3 tidak diteruskan. **Tetapi CI95 [0,2353; 0,3235] memuat
0,30** — data ini tidak dapat memisahkan keduanya. Ini pemalsuan lemah, bukan
tegas, dan wajib dibaca demikian.

Yang justru tegas adalah dua hal lain:

1. **72% galat kelas salah di semua sisi.** Galat kelas bukan kecelakaan per
   pandangan; ia sifat tandannya. Itu konsisten dengan E-028 (B2 paling ambigu)
   dan dengan diagnosis (B) fotometrik di CLAUDE.md — ambiguitas B2↔B3 tidak
   diselesaikan dengan melihat dari sisi lain.
2. **B4 adalah kasus terburuk: 0,1038.** Dari 106 galat kelas B4, hanya 11 punya
   saudara yang benar. Harapan bahwa K3 menolong B4 **tertutup**, dan itu
   kebetulan kelas yang paling ingin ditolong.

**Temuan sampingan yang TIDAK menyelamatkan gerbang ini** — plafon **kehadiran**
0,4946, CI95 [0,4583; 0,5309], tegas di atas 0,30. Suku konsistensi kehadiran K3
(sisi terlewat ditolong sisi yang mendeteksi) punya ruang hampir dua kali lipat
suku kelas. Itu **mekanisme yang berbeda dengan plafon yang berbeda**, bukan
penyelamat gerbang yang gagal. Bila mau dikejar, ia harus didaftarkan sebagai
hipotesis tersendiri dengan ambangnya sendiri — bukan disisipkan ke K3 setelah
melihat hasil ini.

**KAVEAT PROKSI, wajib ikut dikutip** — bobot yang dipakai **yolo26n**, bukan
RF-DETR-L (bobot E-021 hilang saat pod di-terminate). Angka ini menjawab
"apakah ada ruang secara struktural", bukan "berapa besar ruangnya pada model
final". Detektor lebih kuat menggeser plafon ke dua arah sekaligus: galat
berkurang (pembilang turun) tetapi sisi terlewat juga berkurang (penyebut naik).
Arah netonya tidak dapat ditebak dari sini. P3 definitif menunggu F-004.

**Dampak** — **F-008 (K3) tidak dijalankan.** Anggaran seri turun ~13 jam GPU.
Seri berlanjut dengan K1 (F-002 LOLOS) dan K2 (menunggu F-005). Karena tinggal
dua komponen, syarat F-009 ("≥ 2 komponen lolos") sekarang menuntut **keduanya**
lolos.

**Reproduksi** —
`python analysis/cross_side_consistency.py --bobot ../../runs/detect/runs_e022/yolo26n_sawitmvc_rgb_seed42/weights/best.pt --split-dir results/splits_rgb/sawitmvc --data-root /workspace/SawitMVC/data --dump-tandan <dump>`
lalu `python analysis/plafon_lintas_sisi.py --dump <dump>`. Bukti:
`experiments/results/F-003/{plafon_lintas_sisi,konsistensi_ulang_yolo26n}.json`.

## F-001 — Pemulihan prasyarat seri F + probe VRAM RTX A4500 (2026-08-06) · [SR-017](SR/SR-017-sintesis-deep-research.md)

**Hipotesis** — Seri F seluruhnya berdiri di atas RF-DETR-L. Sebelum satu
komponen pun dirancang, tiga hal harus dipastikan: dataset RF-DETR dapat
dibangun ulang, bobot pratlatih dapat diperoleh kembali, dan **resep E-021 muat
di GPU yang sekarang**. Yang terakhir bukan formalitas: E-021 dilatih di NVIDIA
L4 23 GB, sedangkan mesin ini RTX A4500 **20,4 GB — 2,6 GB lebih kecil**.

**Dipalsukan bila** resep E-021 (batch 8 / grad-accum 2 @1280) OOM, sehingga
seluruh seri harus memakai konfigurasi berbeda dari baseline yang dibandingkan.

**Cara** — `build/build_rfdetr_ds.py` untuk dataset; konstruksi `RFDETRLarge()`
mengunduh bobot pratlatih; lalu `train/train_rfdetr.py --smoke` 1 epoch pada
resolusi 1280 dengan VRAM disampel tiap 2 detik.

**Temuan keadaan awal (diperiksa langsung di disk, bukan diasumsikan)**

| Hal | Keadaan |
|---|---|
| Bobot RF-DETR-L E-021 | **HILANG.** `find / -name "checkpoint*.pth"` menemukan 6 berkas, semuanya `rfdetrnano` milik E-033 |
| Bobot pratlatih | **HILANG.** Hanya `rf-detr-nano.pth` di `~/.roboflow/models/`; `rf-detr-large-2026.pth` diunduh ulang (130 MB, MD5 tervalidasi) |
| `rfdetr_ds` | **KOSONG** (0 citra). Dibangun ulang jadi 3000/404/588 symlink |
| `splits_rgb/sawitmvc` | **UTUH**, path absolutnya masih resolve |
| Kriteria klasifikasi | **IA-BCE** (`ia_bce_loss: true`), bukan softmax CE — lihat Dampak |

**Hasil** —

| Ukuran | Nilai |
|---|---|
| VRAM puncak, batch 8 @1280 | **10.331 MiB** dari 20.470 |
| Kelonggaran | 10.139 MiB |
| **Paralelisme maksimum** | **1** — 2 × 10.331 = 20.662 > 20.470 |
| Menit per epoch (latih + val) | **9,2** |
| Param model | 35,6 jt (E-021 mencatat 35,7 jt) |
| `scales: [1440]` di log | **tidak muncul** — jebakan `CATATAN-TEKNIS-E021.md` #2 terhindar |
| Smoke 1 epoch | val mAP50 0,4941 · test mAP50 0,5230 |

**Putusan** — **DIKONFIRMASI.** Resep E-021 muat apa adanya; tidak perlu turun
ke batch 4. Konfigurasi dikunci untuk SELURUH lengan seri F supaya perbandingan
baseline↔perlakuan tidak tercemar beda batch.

Angka smoke 1 epoch **bukan hasil** — ia hanya bukti pipeline hidup. Jangan
dikutip. E-021 mencapai val 0,5695 pada epoch terbaiknya (epoch 9 dari 19).

**Dampak** —

1. **Paralelisme 1 adalah kendala keras.** Kelonggaran 10,1 GB terlihat lega
   tetapi tidak cukup untuk run RF-DETR-L kedua. Ini persis jebakan yang dicatat
   CLAUDE.md ("3 × 6,6 = 19,7 dari 19,7 GiB"). Seluruh run seri F **berurutan**;
   yang dapat diparalelkan hanya pekerjaan CPU.
2. **Anggaran dihitung ulang dari angka terukur**, bukan diskalakan dari L4:
   ~9,2 mnt/epoch × ~19 epoch ≈ **3 jam per seed**, jadi F-004 ≈ **9 jam**.
3. **Kriteria klasifikasi RF-DETR terbaca langsung dari kode** — menjawab
   pertanyaan yang membuka seri ini. `criterion.py:268-296`: IA-BCE, bobot
   positif `t = σ(z)^α · IoU^(1−α)` dengan `α = 0,25`, di-clamp 0,01, di-detach.
   Skor deteksi = `σ(z)` per kelas **independen**, top-k `num_select=300` atas
   grid datar Q×C (`postprocess.py:106`). **Tidak ada simpleks softmax.**
   Konsekuensinya untuk K2: residu ordinal harus berupa offset logit aditif
   ber-mean nol antar 4 kelas, bukan pergeseran pada simpleks; dan karena mAP
   COCO dihitung per kelas, yang dapat digerakkan residu itu adalah selisih
   logit **antar kelas di dalam query yang sama** — itulah yang diukur F-005.

**Reproduksi** — `build/build_rfdetr_ds.py --splits results/splits_rgb/sawitmvc --labels /workspace/SawitMVC/data/labels --output rfdetr_ds`,
lalu `train/train_rfdetr.py --dataset rfdetr_ds --resolution 1280 --batch 8 --grad-accum 2 --workers 8 --smoke --output <dir>`.
Bukti: `experiments/results/F-001/prasyarat.json`.

## F-005 — (P1) Massa selisih logit antar-kelas di dalam query yang sama (2026-08-06) · gerbang K2 · [SR-017](SR/SR-017-sintesis-deep-research.md)

**Hipotesis** — K2 menambahkan residu ordinal ber-mean nol yang **di-clip ke ±ε**.
Clip itu memberi jaminan penjaga-peringkat: urutan hanya dapat berubah bila
selisih logit < 2ε. Jaminan itu membuktikan **keamanan, bukan potensi naik** — ia
tidak menjamin ada cukup kerugian AP yang tinggal di pasangan rapat untuk
direbut. Gerbang ini mengukur massanya.

Rumusannya diubah dari rencana asli, dan alasannya dibaca dari kode (F-001):
RF-DETR memakai IA-BCE dengan `sigmoid` per kelas independen dan top-k atas grid
datar Q×C — tidak ada simpleks softmax — sedangkan mAP COCO dihitung per kelas.
Maka yang dapat digerakkan residu ber-mean nol adalah selisih logit **antar kelas
di dalam query yang sama**:

$$\Delta = z_{q,c_\text{benar}} - z_{q,c_\text{teratas salah}}$$

**Dipalsukan bila** fraksi galat kelas dengan $|\Delta| < 2\varepsilon = 0{,}6$
**< 0,30**.

**Cara** — `analysis/massa_selisih_logit.py` atas
`results/F-004/logits_test_seed42.npz`, yaitu dump logit mentah seluruh query
dari **checkpoint konvergen** `runs_f004/rfdetrl_rgb_seed42/checkpoint_best_ema.pth`
(seed 42, best epoch 5, val mAP50 0,5708). `SawitMVC-test`, pencocokan query↔GT
pada IoU ≥ 0,5.

**Checkpoint konvergen itu syarat, bukan detail.** Ukuran ini sensitif terhadap
skala logit: model yang belum konvergen punya logit rapat sehingga fraksinya
bias TINGGI. Terukur langsung — pada checkpoint probe 1-epoch F-001 fraksinya
0,7666 dengan median |Δ| 0,3086; pada checkpoint konvergen turun ke 0,7113
dengan median melebar ke 0,3633. Arahnya persis seperti yang dikhawatirkan, dan
angka yang dipakai adalah yang konvergen.

**Hasil** — 2.612 kotak GT, hanya **27 (1,0%) tidak tertangkap query mana pun**;
918 salah kelas, 1.667 benar.

| | nilai |
|---|---|
| Galat kelas dalam pita \|Δ\| < 0,6 | **653 / 918 = 0,7113** |
| Kuantil \|Δ\| galat | p10 0,060 · p25 0,159 · **p50 0,363** · p75 0,662 · p90 1,135 |

Per kelas GT (fraksi dalam pita): **B3 0,8493** (355/418) · B1 0,7551 (74/98) ·
B4 0,6087 (98/161) · **B2 0,5228** (126/241).

Pasangan tertukar, seluruhnya **kelas bertetangga**: B3→B4 202 · B3→B2 199 ·
B2→B3 177 · B4→B3 147 · B1→B2 90 · B2→B1 57.

Paparan risiko (dilaporkan, **bukan penggugur**, dan ini didaftarkan sebelum
melihat data): **769 query yang sudah BENAR juga berada di dalam pita**, jadi
rasio untung-rugi **0,849** — yang benar-berisiko sedikit LEBIH BANYAK daripada
yang salah-dapat-diperbaiki.

**Putusan** — **LOLOS.** 0,7113 jauh di atas ambang 0,30. Potensi naik K2 tidak
tertutup secara matematis.

Tiga pembacaan yang tidak boleh dihaluskan:

1. **Ini bukan ramalan kenaikan mAP.** Gerbang ini hanya menyatakan bahwa
   ruangnya ada. Apakah kepala ordinal benar-benar mengarahkan residu ke sisi
   yang benar adalah pertanyaan F-006, bukan pertanyaan ini.
2. **Rasio untung-rugi 0,849 < 1.** Residu ber-clip menyentuh lebih banyak query
   benar daripada query salah. Kepala ordinal karena itu harus **informatif**,
   bukan sekadar aktif; residu yang mendekati acak berekspektasi merugikan. Inilah
   yang membuat gate α dan clip ±ε bukan hiasan melainkan syarat keselamatan.
3. **B2 justru yang paling sedikit dapat direbut (0,5228), bukan paling banyak.**
   Rancangan meramalkan K2 paling menolong B2↔B3. Massa terbesar ternyata di
   **B3** (0,8493). Galat B2 lebih sering jauh dari batas — yakin tetapi salah —
   dan itu konsisten dengan E-028 yang menempatkan B2 sebagai kelas paling ambigu
   (0,434). Bila F-006 memberi kenaikan, kenaikannya **diperkirakan di B3, bukan
   B2**; kenaikan di B2 justru perlu dijelaskan, bukan dirayakan.

**Dampak** — K2 boleh dilanjutkan ke F-006. Dengan K1 (F-002) dan K2 (F-005)
sama-sama lolos dan K3 gugur, **kedua komponen tersisa lolos gerbangnya**,
sehingga syarat F-009 ("≥ 2 komponen lolos") terpenuhi bila keduanya juga lolos
gerbang hasilnya nanti.

**Reproduksi** — `python analysis/massa_selisih_logit.py --npz results/F-004/logits_test_seed42.npz`.
Bukti: `experiments/results/F-005/massa_selisih_logit_seed42.json`.

## F-004 — Baseline RF-DETR-L 3 seed: varians seed jalur RGB akhirnya terukur (2026-08-06) · [SR-017](SR/SR-017-sintesis-deep-research.md)

**Hipotesis** — Seluruh seri F membandingkan perlakuan terhadap baseline
RF-DETR-L. Dua hal harus dipenuhi lebih dulu: (a) resep E-021 masih tereproduksi
setelah bobotnya hilang dan GPU-nya berganti, dan (b) **varians seed jalur RGB
harus diukur** — sampai kini nol terukur untuk RF-DETR pada SawitMVC. Ambang
+0,05 yang dipakai seluruh rencana diturunkan dari E-027 (0,0321) dan E-031
(0,0488), keduanya diukur pada **YOLO26n di SawitMVC-Depth**, bukan jalur ini.

**Dipalsukan bila** ketiga seed menyimpang jauh dari E-021, sehingga tidak ada
baseline sah untuk dibandingkan.

**Cara** — `shell/f004_baseline.sh`: `train/train_rfdetr.py` seed 42/1337/2024,
resep dikunci persis ke `training_config.json` E-021 (resolusi 1280, batch 8,
grad-accum 2, workers 8, epochs 60, early stopping patience 8 min-delta 0,001,
EMA, `multi_scale=False`, `expanded_scales=False`, `ia_bce_loss=True`).
Berurutan — dua run RF-DETR-L serentak = 20.662 MiB > 20.470 (F-001).
Total 5j40m (09:36:57 → 15:17:18), rata-rata 1j53m per seed.

**Hasil** —

| seed | val mAP50 (EMA) | val mAP50-95 | test mAP50 | test mAP50-95 | epoch terbaik | total epoch |
|---|---|---|---|---|---|---|
| 42 | 0,5708 | 0,2660 | 0,5997 | 0,2738 | 5 | 14 |
| 1337 | 0,5708 | 0,2635 | 0,5900 | 0,2700 | 5 | 16 |
| 2024 | 0,5796 | 0,2699 | 0,5951 | 0,2677 | 5 | 14 |
| **rerata** | **0,5738** | 0,2665 | **0,5949** | **0,2705** | — | — |

**Varians seed jalur RGB, RF-DETR-L, SawitMVC-test:**

| Metrik | SD | Rentang |
|---|---|---|
| test mAP50 | **0,0049** | 0,0097 |
| test mAP50-95 | 0,0031 | 0,0062 |
| val mAP50 | 0,0051 | 0,0088 |

Perbandingan reproduksi harus like-for-like: `evaluation.json` E-021 (jalur
`run_test`, checkpoint `best_total`) mencatat test mAP50 **0,5837**; F-004 lewat
jalur yang SAMA memberi rerata **0,5949**. Angka **0,6038** yang biasa dikutip
berasal dari evaluasi EMA-konsisten `eval_all_pycoco.py` yang terpisah, jadi
tidak sebanding dengan tabel di atas.

**Putusan** — **DIKONFIRMASI.** Resep tereproduksi pada GPU dan checkpoint baru;
ketiga seed konsisten. Baseline seri F sah.

**Dampak — dan ini yang paling penting dari entri ini.**

**Varians seed jalur RGB 6,5× LEBIH KECIL daripada yang diandaikan rencana**
(0,0049 vs 0,0321 milik E-027). Konsekuensinya bukan sekadar "ambang diturunkan",
melainkan bahwa **dua pertanyaan yang selama ini tercampur harus dipisah**:

1. **Keterdeteksian statistik.** Dengan SD 0,0049, efek jauh di bawah 0,05 kini
   dapat dibedakan dari derau. Ambang +0,05 setara ~10 SD — menuntutnya sebagai
   syarat *deteksi* berarti membuang efek nyata yang terukur. Untuk F-006/F-007/
   F-009, syarat deteksi yang sah adalah **CI bootstrap tingkat pohon tidak
   memuat nol pada 3 seed berpasangan**, bukan +0,05.
2. **Kebermaknaan praktis.** Ambang +0,05 **tetap berlaku** sebagai bar pengguna,
   dan asalnya bukan derau melainkan pernyataan 21 Juli 2026: "kenaikan 2–5% pun
   dianggap tidak cukup" (CLAUDE.md). Itu keputusan pengguna, bukan artefak
   pengukuran, dan **tidak boleh diturunkan diam-diam** dengan alasan varians
   ternyata kecil.

Maka tiap kontras seri F wajib melaporkan **keduanya**: apakah efeknya nyata, dan
apakah efeknya cukup besar. Efek +0,015 yang CI-nya jelas di atas nol adalah
temuan yang sah dan **wajib dilaporkan apa adanya** — sekaligus wajib dinyatakan
belum memenuhi bar praktis pengguna.

**Replikasi gerbang F-005 pada ketiga seed** (fraksi galat kelas dalam pita
\|Δ\| < 0,6):

| seed | fraksi | p50 \|Δ\| | untung-rugi | B3 | B2 |
|---|---|---|---|---|---|
| 42 | 0,7113 | 0,3633 | 0,849 | 0,8493 | 0,5228 |
| 1337 | 0,6384 | 0,4004 | 0,647 | 0,7760 | 0,5290 |
| 2024 | 0,7147 | 0,3589 | 0,971 | 0,7931 | 0,5375 |

Ketiganya LOLOS jauh di atas ambang 0,30, dan dua pola kualitatifnya bertahan di
seluruh seed: **B3 selalu punya massa lebih besar daripada B2** (kebalikan dari
ramalan rancangan bahwa K2 paling menolong B2↔B3), dan **rasio untung-rugi selalu
< 1** (0,647–0,971), artinya residu ber-clip menyentuh lebih banyak query yang
sudah benar daripada yang salah. K2 karena itu menuntut kepala ordinal yang
benar-benar informatif; residu mendekati acak berekspektasi merugikan.

**Reproduksi** — `bash shell/f004_baseline.sh`. Bukti:
`experiments/results/F-004/{evaluation,metrics,sha256}_seed*.{json,csv,txt}`,
`logits_test_seed*.npz`, dan `results/F-005/massa_selisih_logit_seed*.json`.

## F-007 — (K1a) Cabang frekuensi ber-gate: GATE TIDAK PERNAH TERBUKA (2026-08-06, DIHENTIKAN) · [SR-017](SR/SR-017-sintesis-deep-research.md)

**Status: DIHENTIKAN ATAS PERMINTAAN PENGGUNA** pada 2 dari 12 run. Entri ini
mencatat apa adanya; ia **bukan** hasil lengkap dan tidak boleh dikutip sebagai
uji K1 yang tuntas.

**Hipotesis** — F-002 menunjukkan respons frekuensi tinggi memisahkan isi tandan
dari pelepah pada B4 sebesar +0,0731 di atas kendali. Bila keterpisahan piksel
itu berarti, menyuntikkan fitur frekuensi lewat side encoder sempit sebelum
projector akan menaikkan mAP.

**Cara** — `train/train_rfdetr_freq.py`, cabang samping ber-gate skalar `gamma`
berinisialisasi **nol**, disuntik pada keluaran projector. Resep latih identik
F-004 (1280, batch 8, grad-accum 2, patience 8, EMA, dari `rf-detr-large-2026.pth`).
Rencana 4 lengan x 3 seed; **yang terlaksana hanya 2 lengan pada seed 42.**

**Hasil — dan yang menentukan bukan mAP-nya, melainkan gamma-nya.**

| lengan | epoch | VAL mAP50 (EMA) | TEST mAP50 | **gamma akhir** |
|---|---|---|---|---|
| baseline F-004 seed42 | 14 | 0,5708 | 0,5997 | — |
| dwt seed42 | 12 | 0,5667 | 0,5956 | **+0,0003** |
| laplacian seed42 | 10 (dihentikan) | 0,5698 | — | **−0,00006** |

**Putusan — DIPALSUKAN untuk mekanismenya, bukan sekadar nol hasil.**

`gamma` mulai di nol dan **tidak pernah bergerak dari nol**. Injeksinya
`keluar = fitur + gamma · proyeksi(samping)`; dengan gamma ~ 1e-4 sampai -6e-5,
kontribusi cabang frekuensi **secara efektif nol**. Model perlakuan pada dasarnya
**adalah** model baseline, dan selisih mAP yang terlihat (−0,004) adalah derau
latihan, bukan efek frekuensi.

Ini **bukan** kegagalan implementasi. Uji sambungan membuktikan cabangnya
tersambung: pada gamma dibuka paksa ke 1, keluaran backbone berubah 0,807–1,089;
pada gamma = 0 selisihnya tepat 0,0; parameter pratlatih termuat penuh (14 tak
termuat, semuanya cabang samping). Cabangnya berfungsi — optimizer yang memilih
tidak memakainya.

**Sebab paling mungkin: inisialisasi nol adalah PERANGKAP, bukan sekadar
pengaman.** Gradiennya membentuk kebuntuan ayam-telur:

- gradien ke side encoder = `gamma · dL/dkeluar` → **nol persis saat gamma = 0**,
  jadi side encoder tidak pernah belajar;
- gradien ke gamma = `dL/dkeluar · proyeksi(samping)`, sedangkan `proyeksi(samping)`
  masih **acak** pada inisialisasi → sinyalnya derau di sekitar nol, sehingga
  gamma hanya berjalan acak dan tidak tumbuh.

Rancangan menuntut `gamma = 0` supaya cabang menjadi *no-op* persis dan menjawab
keberatan E-030 (cabang tak berguna tidak boleh merusak baseline). Syarat itu
terpenuhi — tetapi **ongkosnya tidak diantisipasi**: no-op yang sempurna juga
berarti titik mati yang sempurna. Siapa pun yang mengulang gagasan ini harus
mengubah salah satu dari: inisialisasi gamma kecil-tapi-taknol, warmup gamma,
LR terpisah untuk gamma, atau melatih side encoder dengan tugas pendamping
(mis. probe center-heatmap yang ada di rancangan tetapi tidak jadi dipakai).

**Yang TIDAK dapat disimpulkan dari entri ini:**

- Apakah cabang frekuensi akan menolong bila gate-nya benar-benar terbuka —
  **tidak diuji**, karena gate tidak pernah terbuka.
- Perbandingan terhadap kontrol `freq_rendah` dan `fase_diacak` — **kedua lengan
  kontrol tidak pernah dijalankan**, jadi atribusi frekuensi-vs-kapasitas tetap
  terbuka. (Meski dengan gamma ~ 0, kapasitas tambahannya pun efektif tidak
  terpakai.)
- Replikasi seed — hanya seed 42. SD seed baseline 0,0049 (F-004), jadi selisih
  −0,004 berada **di dalam derau satu seed** dan tidak dapat diklaim ke arah mana pun.

**Dampak** — K1 dalam bentuk ini tidak menghasilkan kenaikan, dan alasannya
terdiagnosis: mekanismenya tidak aktif. Ini menurunkan prior untuk seluruh
keluarga "cabang samping ber-gate init-nol" di repo ini, termasuk rancangan
intra-blok yang ditangguhkan.

**Reproduksi** — `bash shell/f007_frekuensi.sh` (hapus dulu penanda
`.selesai` + `.DIHENTIKAN-PENGGUNA` di `runs/detect/runs_f007/*_seed{1337,2024}/`).
Bukti: `experiments/results/F-007/` — `evaluation_{dwt,laplacian}_seed42.json`,
`logits_test_{dwt,laplacian}_seed42.npz`, `uji_sambungan_*.json`, `sha256_*.txt`.


===== experiments/LAPORAN-EKSPERIMEN.md =====

# Laporan Eksperimen — Deteksi & Penghitungan Tandan Sawit

**Cuplikan terkurasi (*curated snapshot*) per 1 Agustus 2026.** Dokumen ini bukan
log dan bukan pengganti log. Ia merangkai satu cerita dari basis pustaka sampai
titik jeda hari ini, lalu menunjuk ke berkas kanonik untuk tiap angkanya.

Mencakup **E-001 sampai E-032**, dua dataset, dan dua fase yang berbeda sifatnya:
pilot RGB yang berujung pada hasil terbaik (E-021), lalu blok depth sensor yang
**tidak menghasilkan manfaat terkonfirmasi dalam rezim diuji** (E-022…E-032).
Keduanya diperlakukan sama —
angka apa adanya.

Sumber kanonik yang dirangkum di sini:
[`experiments/EKSPERIMEN.md`](EKSPERIMEN.md) (log kronologis, *append-only*) ·
[`experiments/SR/README.md`](SR/README.md) (pandangan per-ide) ·
[`experiments/METRICS.md`](METRICS.md) (tabel metrik definitif E-021) ·
[`experiments/METRIK-LENGKAP.md`](METRIK-LENGKAP.md) (metrik seluruh run blok depth) ·
[`experiments/AUDIT-E022.md`](AUDIT-E022.md) (koreksi E-022) ·
[`experiments/STATUS.md`](STATUS.md) (titik jeda & jalur lanjutan) ·
[`pipeline/README.md`](../pipeline/README.md) (deliverable produksi).

> **Pembaruan audit 2 Agustus 2026.** Dokumen ini adalah snapshot kurasi
> historis. Untuk status klaim terbaru, gunakan `reports.tex` dan
> `REPORT_PLAN.md`. Khusus E-026, denominator identitas RGB dan RGB-D berbeda
> sehingga hasilnya tidak konklusif; khusus E-032, 12/12 CI memuat nol tetapi
> ekuivalensi belum dibuktikan. Status G0 tetap terbuka dan G4/G6 tidak ditutup
> secara universal.

---

## 0. Cara membaca — label yang dipakai

**Label tahap (*stage labels*)** — empat tahap yang menyusun cerita di bawah:

| Label | Arti |
|---|---|
| **LIT-182** | *Literature base* — 182 entri terverifikasi yang memasok setiap hipotesis |
| **PILOT-SAWITMVC-RGB** | *Bounded RGB pilot* — E-001…E-021, dikerjakan pada SawitMVC 960×1280 + master 3024×4032, kamera RGB saja |
| **RESULT-RFDETR-RGB** | *Final RGB result* — detektor 4-kelas terbaik yang dihasilkan pilot ini (E-021) |
| **DEPTH-SENSOR-MVCD** | *Physical depth-sensor phase* — E-022…E-032 pada SawitMVC-Depth (Orbbec, 352 pohon). **Sudah dijalankan**, dan hasilnya negatif di seluruh kontras |

Label **GEMINI-PENDING** yang dipakai versi 25 Juli sudah **tidak berlaku**:
sejak 29 Juli data depth sensor fisik tersedia dan diuji habis. Yang dulu
"menunggu satu angka pun" kini punya **54 run terarsip** (39 di E-022, 15 di
E-023) dan **49 kontras berpasangan** (37 + 12), seluruhnya dengan CI bootstrap.

**Label putusan (*verdict labels*)** — dipakai apa adanya dari log:

| Indonesia | English | Arti |
|---|---|---|
| DIKONFIRMASI | CONFIRMED | hipotesis bertahan terhadap uji yang bisa memalsukannya |
| DIPALSUKAN | FALSIFIED | hipotesis gugur; jalan ditutup |
| TIDAK KONKLUSIF | INCONCLUSIVE | uji tidak menjawab |
| DITARIK | WITHDRAWN | klaim pernah dibuat lalu dicabut karena buktinya cacat |
| MENEMPEL BASELINE | NULL RESULT | dijalankan penuh, angkanya tidak bergerak |

---

## 1. LIT-182 — dari mana hipotesisnya berasal

Repositori ini berangkat dari tinjauan pustaka: **182 entri terverifikasi** (ada
PDF lokal) dari 202 record BibTeX, 14 klaster tema, fokus 2019–2026. Tinjauan itu
sudah selesai ditulis; perannya di sini adalah memasok hipotesis yang *terlacak*,
bukan tebakan.

Yang diambil dari korpus dan benar-benar diuji:

- **Depth Anything 3** (entri 198) — geometri konsisten lintas-pandangan → E-003,
  E-004, E-005, E-006, E-007.
- **Fusi middle/late, bukan early** (sapuan 28 titik fusi Ophoff dkk.,
  `evidence-body.tex` §174) → dasar I-4/I-5.
- **Gerbang mutu depth** (SA-Gate entri 055; D3Net entri 037: depth buruk merusak
  prediksi) → I-8, masih menunggu GEMINI-PENDING.
- **Detektor NMS-free** sebagai prioritas 1 (`literature/references/deep-research-report.md`) → E-020,
  yang akhirnya menjadi hasil terbaik.

Satu batas yang harus disebut sejak awal: **tidak ada satu pun benchmark RGB-D
pada FFB sawit di dalam 182 entri itu.** Karena itu setiap klaim "depth menaikkan
angka" berstatus hipotesis desain yang bisa dipalsukan, dan memang sebagian sudah
dipalsukan di bawah.

---

## 2. PILOT-SAWITMVC-RGB — batas ruang lingkupnya

Seluruh eksperimen 21–22 Juli 2026 dikerjakan dalam pilot yang **sengaja
dibatasi**:

| Dimensi | Isi pilot |
|---|---|
| Data | SawitMVC 960×1280 (953 pohon, 18.540 bbox, 9.823 *unique bunch*) + master mentah 3024×4032 |
| Split | per pohon 716/96/141, irisan train/val/test **nol** |
| Sensor | **RGB saja.** Semua "depth" di pilot ini adalah *pseudo-depth* dari model monokular |
| Pemilihan | konfigurasi dipilih di **val**, test hanya dilaporkan |
| Acuan | DiB 67 (2026) 112990 — YOLO26m test AP50 0,531; B4 0,354 |
| Sasaran | **mAP50 0,60 · mAP50-95 0,30 pada 4 kelas penuh**, angka COCO apa adanya |

Acuan DiB itu **sengaja tidak di-tuning** oleh penulisnya (`imgsz=640`, SVR
default) — ia titik acuan, bukan plafon.

---

## 3. Peta 30 eksperimen

Semua eksperimen yang tercatat di [`experiments/EKSPERIMEN.md`](EKSPERIMEN.md), dengan
putusan apa adanya. Sepuluh dipalsukan, satu ditarik, satu dicabut — itu justru
bagian yang paling mempersempit arah kerja.

Nomor **E-008 tidak pernah dipakai** (tidak ada run), dan **E-023 dieksekusi di
bawah nomor E-032** karena rancangannya berubah sebelum dijalankan. Jadi 30
entri untuk rentang E-001…E-032, bukan 32.

### 3.1 Pilot RGB (E-001…E-021)

| E | Yang diuji | SR / ide | Putusan (ID / EN) |
|---|---|---|---|
| E-001 | `class_mismatch` sebagai ukuran ambiguitas kematangan | [SR-001](SR/SR-001-ambiguitas-kematangan.md) | DIPALSUKAN / FALSIFIED |
| E-002 | Master mentah 3024×4032 langsung pakai anotasi MVC | [SR-002](SR/SR-002-resolusi-master-mentah.md) | TIDAK KONKLUSIF / INCONCLUSIVE |
| E-003 | DA3 pada video orbit (n=1 video) | [SR-003](SR/SR-003-da3-video-orbit.md) | SEBAGIAN / PARTIAL |
| E-004 | DA3 pada 6 video, rotasi diperbaiki | [SR-003](SR/SR-003-da3-video-orbit.md) | DIKONFIRMASI / CONFIRMED |
| E-005 | DA3 pada 4 dan 8 sisi foto asli | [SR-004](SR/SR-004-da3-empat-sisi.md) | DIKONFIRMASI / CONFIRMED |
| E-006 | Kedalaman sebagai pemisah tandan (tingkat piksel) | [SR-005](SR/SR-005-sinyal-depth-tandan.md) | DIPALSUKAN / FALSIFIED |
| E-007 | Penautan tandan lintas-sisi secara geometris | [SR-006](SR/SR-006-penautan-geometris.md) | DIPALSUKAN / FALSIFIED |
| E-009 | Ukuran kotak GT pada resolusi latih | [SR-007](SR/SR-007-diagnosis-b4.md) | SEBAGIAN / PARTIAL |
| E-010 | Diagnosis penyebab kegagalan B4 | [SR-007](SR/SR-007-diagnosis-b4.md) | DIKONFIRMASI (kontras) / DIPALSUKAN (kepadatan) |
| E-011 | Praproses mana yang menaikkan keterpisahan B4 | [SR-008](SR/SR-008-kanal-tekstur.md) | DIKONFIRMASI (tekstur) / DIPALSUKAN (penajam kontras) |
| E-012 | Kematangan dari penampilan potongan GT | [SR-009](SR/SR-009-ordinalitas-kelas.md) | DIKONFIRMASI / CONFIRMED |
| E-013 | Pipeline produksi 4-kanal untuk sensor depth | [`pipeline/`](../pipeline/README.md) | SIAP PAKAI / DELIVERED |
| E-014 | Hambatan mAP: deteksi atau klasifikasi? | [SR-010](SR/SR-010-hambatan-klasifikasi.md) | DIKONFIRMASI / CONFIRMED |
| E-015 | Pemetaan master mentah lewat pencocokan isi | [SR-002](SR/SR-002-resolusi-master-mentah.md) | TERBLOKIR → DIBUKA / UNBLOCKED |
| E-016 | Plafon kematangan, diukur tiga kali | [SR-011](SR/SR-011-plafon-kematangan.md) | DITARIK / WITHDRAWN (lewat E-018) |
| E-017 | Detektor dua tahap (agnostik + kepala kematangan) | [SR-012](SR/SR-012-dua-tahap.md) | DIPALSUKAN / FALSIFIED |
| E-018 | Selubung lokalisasi empiris: 0,60/0,30 mungkin? | ide I-24 | DIKONFIRMASI / CONFIRMED |
| E-019 | Detektor 4-kelas 1280 + augmentasi aman-warna | ide I-24 | MENEMPEL BASELINE / NULL RESULT |
| E-020 | RT-DETR-L, detektor tanpa NMS | [SR-013](SR/SR-013-rtdetr-nms-free.md) | DIKONFIRMASI (arah) / CONFIRMED (direction) |
| E-021 | RF-DETR-L (DINOv2) vs RT-DETR-L pada setelan identik | [SR-014](SR/SR-014-rfdetr-dinov2.md) | DIKONFIRMASI / CONFIRMED |

### 3.2 Blok depth sensor (E-022…E-032)

Dataset berganti ke **SawitMVC-Depth**. Angka di blok ini **tidak sebanding**
dengan blok pilot — lihat §6.1.

| E | Yang diuji | SR / gerbang | Putusan (ID / EN) |
|---|---|---|---|
| E-022a | Apakah depth sensor benar sudah tersejajar ke RGB? | [SR-015](SR/SR-015-depth-sensor-4kanal.md) | DIPALSUKAN / FALSIFIED (label sidecar bohong) |
| E-022b | Apakah depth sensor 4-kanal menaikkan mAP? | [SR-015](SR/SR-015-depth-sensor-4kanal.md) | DIPALSUKAN / FALSIFIED — **seluruh entri dicabut**, lihat [audit](AUDIT-E022.md) |
| E-024 | Inkonsistensi prediksi lintas-sisi sebagai ukuran ambiguitas | [SR-016](SR/SR-016-konsistensi-lintas-sisi.md) | DIKONFIRMASI / CONFIRMED (daya uji terbatas) |
| E-025 | Dari mana selisih evaluator E-022 berasal? | gerbang G1 | DIPALSUKAN (maxDets) / celah terlacak ke jumlah deteksi |
| E-026 | Apakah depth menstabilkan identitas lintas-sisi? | [SR-016](SR/SR-016-konsistensi-lintas-sisi.md) | TIDAK KONKLUSIF / INCONCLUSIVE — denominator identitas RGB/RGB-D berbeda |
| E-027 | Matriks multi-seed YOLO26n | gerbang G2 | DIPALSUKAN / FALSIFIED — depth **merugikan** |
| E-028 | Ukuran lintas-sisi pada SawitMVC (daya uji 6,2×) | [SR-016](SR/SR-016-konsistensi-lintas-sisi.md), G8 | DIKONFIRMASI / CONFIRMED |
| E-029 | Matriks multi-seed RT-DETR-L | gerbang G2, G3 | **DICABUT** / RETRACTED (klausa kapasitas SR-015) |
| E-030 | Sapuan kapasitas YOLO26 n→m→l | gerbang G7 | DIKONFIRMASI SEBAGIAN — klaim dipersempit |
| E-031 | Varians SPLIT vs varians SEED | gerbang G5 | DIKONFIRMASI / CONFIRMED (varians split nyata) |
| E-032 | Titik fusi: awal vs menengah vs akhir, semua dari nol | gerbang G4, G6 | TIDAK KONKLUSIF / INCONCLUSIVE dalam rezim diuji — 12/12 CI memuat nol; ekuivalensi belum dibuktikan |

---

## 4. Temuan kunci

### 4.1 Geometri DA3 bekerja — tetapi bukan di tempat yang dibutuhkan

Depth Anything 3 memulihkan susunan kamera yang benar pada dua kondisi berbeda:

| Uji | Hasil |
|---|---|
| Video orbit, 6 video, 32 frame | **5 dari 6** video mencapai sapuan mulus ≥270°; `smooth_frac` median 100% |
| Foto 4 dan 8 sisi, 50 pohon | urutan sisi benar pada **50 dari 50 pohon (100%)**; RMSE sudut 17,3° (4 sisi) dan 8,5° (8 sisi) vs pembanding acak 57,5° dan 34,4° |

Rekonstruksi tingkat-pohon karena itu **DIKONFIRMASI**. Sebab kegagalan satu
video sisanya masih belum diketahui; tiga kandidat penjelasan sudah dipalsukan
dan tidak ada penjelasan pengganti yang dikarang.

Yang penting: keberhasilan ini **tingkat pohon**, bukan tingkat tandan.

### 4.2 Pseudo-depth tidak memisahkan tandan — 0,26× kendali acak

E-006 mengukur kontras kedalaman di dalam kotak tandan versus cincin
sekelilingnya, pada 40 pohon (780 kotak GT), dengan **kendali 2 kotak acak
seukuran per kotak asli** (1.560 kendali) — kendali ini wajib, karena peta
kedalaman apa pun punya struktur sehingga kotak apa pun menunjukkan kontras
tertentu.

| | kontras (res 504) | kontras (res 1008) |
|---|---|---|
| Kotak tandan asli | 0,0089 | 0,0096 |
| Kotak acak kendali | 0,0341 | 0,0364 |
| **Rasio** | **0,26×** | **0,26×** |

Tandan justru **kurang** menonjol dalam kedalaman daripada tambalan acak, dan
rasio 0,26× **identik** pada dua resolusi sehingga bukan artefak resolusi.
Selisih AUC +0,009 signifikan secara statistik pada n besar tetapi ukuran
efeknya dapat diabaikan. Per kelas, **B4 justru ber-AUC terendah (0,6022)**.

**Batas klaim yang wajib dibawa:** kedalaman ini **relatif**, bukan metrik
(`is_metric` kosong pada keluaran DA3), dan berasal dari **RGB yang sama**
sehingga galatnya berkorelasi dengan citranya. Ia prior struktural dari model
monokular, **bukan** pengukuran sensor. **Depth sensor Orbbec Gemini belum
pernah diuji sama sekali** — E-006 tidak berbicara tentangnya.

### 4.3 Tahap penghitungan sudah jenuh — koreksi k mencapai 95,57%

E-007 lebih dulu memvalidasi perangkatnya: jumlah mentah dan koreksi global
direproduksi **persis** dari Tabel 4 DiB. Lalu tangga ablasi §208 dijalankan pada
141 pohon split uji:

| Mode | Class ±1 | Tree ±1 | MAE |
|---|---|---|---|
| A. hanya penampilan | 77,13% | 32,62% | 0,876 |
| B. depth tanpa pose | 75,00% | 29,08% | 0,966 |
| C. sadar-pose (3D) | 69,50% | 22,70% | 1,367 |
| **D. koreksi global k = 1,8905** | **95,57%** | **86,52%** | **0,356** |

Penautan geometris **DIPALSUKAN**: ia kalah telak, dan justru yang paling
canggih yang paling buruk. Sapuan ambang (9 nilai untuk pose) menutup
kemungkinan salah setelan. Batas klaim: yang dipalsukan adalah **implementasi**
di atas kedalaman relatif; uji yang adil menuntut kedalaman metrik terkalibrasi.

Konsekuensi strategisnya tegas: **koreksi k sederhana sudah 95,57% bila diberi
deteksi bersih.** Ruang perbaikan di tahap counting tipis. Sisa perbaikan harus
datang dari detektor.

### 4.4 Kerugian mAP ada di klasifikasi kematangan, bukan di deteksi

E-014 mengambil **bobot yang identik** dan **val yang identik** (404 citra), lalu
mengubah satu bendera saja (`single_cls`):

| Evaluasi | mAP50 | mAP50-95 | P | R |
|---|---|---|---|---|
| 4 kelas | 0,5218 | 0,2407 | 0,5307 | 0,5484 |
| **Kelas-agnostik** | **0,7191** | **0,3197** | 0,6950 | 0,6365 |

38% mAP50 yang mungkin diraih hilang di penilaian kematangan; efektivitas
klasifikasi terukur 0,5218/0,7191 = **72,6%**. Detektor khusus agnostik pada
imgsz 960 bahkan mencapai **0,7730 / 0,3320** — mAP50-95 agnostik itu sudah
**melewati** sasaran 0,30.

Temuan pendukungnya konsisten:

- **B4 gagal karena tersamar, bukan bertumpuk.** Kontras CIELAB B4 (ΔE 11,55)
  **di bawah kotak acak** (12,92); tetangganya paling sedikit (2,58) dan IoU
  maksimumnya paling rendah (0,029).
- **Satu-satunya sinyal yang tersisa untuk B4 adalah tekstur.** Pada kanal
  Laplacian, peringkat kelas berbalik: B4 dari paling tidak terpisah (0,5573)
  menjadi **paling terpisah** (0,6153).
- **Kematangan itu kontinu.** Kebingungan hampir seluruhnya antar kelas
  bersebelahan pada rantai B1→B2→B3→B4; B3→B1 hanya 7 dari 375.

### 4.5 Selubung lokalisasi empiris — 0,8834 / 0,4702

Sebelum membakar jam GPU, E-018 memeriksa apakah kotak anotasinya sendiri
memungkinkan sasaran. Untuk tiap kotak GT val diambil IoU tertinggi dengan
deteksi mana pun (kelas diabaikan, conf 0,05):

| | Baseline 640 | Agnostik 960 |
|---|---|---|
| GT tercapai IoU≥0,50 | 0,8834 | 0,8786 |
| GT tercapai IoU≥0,75 | 0,4494 | 0,3975 |
| GT tercapai IoU≥0,90 | 0,0376 | 0,0254 |
| Median IoU terbaik | 0,7303 | 0,7110 |
| **Selubung mAP50 (kelas sempurna)** | **0,8834** | 0,8786 |
| **Selubung mAP50-95 (kelas sempurna)** | **0,4702** | 0,4448 |

Sasaran mAP50 0,60 = 68% dari 0,8834; mAP50-95 0,30 = 64% dari 0,4702. Posisi
saat ini 59% dan 51%. Artinya yang dituntut adalah menutup celah **klasifikasi
dan peringkat skor**.

**Apa yang angka ini BUKAN.** 0,8834/0,4702 adalah **selubung empiris** yang
diukur dari himpunan deteksi satu model tertentu pada satu split. Ia bukan
plafon ketelitian anotasi yang absolut, bukan batas fisik dataset, dan bukan
angka yang berlaku untuk detektor lain tanpa diukur ulang. Detektor yang
melokalisasi lebih baik akan menggeser selubungnya. Yang sah disimpulkan hanya:
sasaran **tidak** terhalang oleh kelonggaran kotak GT.

Peringatan yang menyertainya tetap berlaku: hanya 3,76% kotak GT tercapai pada
IoU≥0,90 dan median IoU terbaik 0,73 — batas tandan memang kabur, jadi mAP50-95
akan selalu jauh lebih berat daripada mAP50 di dataset ini.

Pada kesempatan yang sama, klaim "plafon kematangan 68%" dari E-016
**DITARIK**: dua dari tiga pengukurannya tidak bebas satu sama lain, dan
pembandingnya dilumpuhkan augmentasi `hsv_s=0.7`. Angka itu tidak boleh dikutip
sebagai plafon.

---

## 5. RESULT-RFDETR-RGB — hasil akhir pilot

### 5.1 Semua run detektor, berdampingan

Angka COCO/ultralytics apa adanya, dari [`experiments/METRICS.md`](METRICS.md).

**Val (dasar pemilihan konfigurasi):**

| Run | Ide/E | imgsz | mAP50 | mAP50-95 | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|---|---|---|
| yolo26m baseline | acuan | 640 | 0,5218 | 0,2407 | 0,7354 | 0,4076 | 0,5561 | 0,3881 |
| RGBD 4-kanal (*pseudo-depth*) | I-4 | 640 | 0,5041 | 0,2378 | 0,7160 | 0,3821 | 0,5336 | 0,3847 |
| 4-kelas aman-warna | E-019 | 1280 | 0,5186 | 0,2358 | 0,7011 | 0,4130 | 0,5682 | 0,3922 |
| YOLO26l (param-adil) | E-021 | 1280 | 0,5300 | 0,2516 | 0,7431 | 0,4358 | 0,5586 | 0,3825 |
| RT-DETR-L | I-14 | 1280 | 0,5466 | 0,2543 | 0,7503 | 0,4413 | 0,5808 | 0,4138 |
| **RF-DETR-L** | **E-021** | 1280 | **0,5695** | **0,2604** | 0,775 | 0,446 | 0,594 | **0,464** |

**Test (dilaporkan; tidak dipakai memilih):**

| Run | Ide/E | imgsz | mAP50 | mAP50-95 | B1 | B2 | B3 | B4 |
|---|---|---|---|---|---|---|---|---|
| DiB publikasi | acuan | 640 | 0,531 | — | 0,739 | 0,433 | 0,599 | 0,354 |
| yolo26m baseline (kami) | acuan | 640 | 0,5161 | 0,2457 | 0,7410 | 0,4016 | 0,5894 | 0,3323 |
| RGBD 4-kanal (*pseudo-depth*) | I-4 | 640 | 0,5192 | 0,2471 | 0,7509 | 0,4115 | 0,5859 | 0,3283 |
| 4-kelas aman-warna | E-019 | 1280 | 0,5418 | 0,2493 | 0,7546 | 0,4503 | 0,6037 | 0,3585 |
| YOLO26l (param-adil) | E-021 | 1280 | 0,5313 | 0,2553 | 0,7597 | 0,4223 | 0,5900 | 0,3534 |
| RT-DETR-L | I-14 | 1280 | 0,5794 | 0,2694 | 0,7891 | 0,4685 | 0,6391 | 0,4208 |
| **RF-DETR-L** | **E-021** | 1280 | **0,6038** | **0,2770** | 0,817 | 0,497 | 0,668 | 0,433 |

**Deteksi kelas-agnostik (tanpa penilaian kematangan):**

| Run | Ide/E | imgsz | split | mAP50 | mAP50-95 |
|---|---|---|---|---|---|
| baseline dievaluasi agnostik | E-014 | 640 | val | 0,7191 | 0,3197 |
| detektor khusus agnostik | I-23 | 960 | val | **0,7730** | **0,3320** |

Catatan run: RGBD 4-kanal dihentikan pada epoch 25/60 (kurva datar); E-019
dihentikan pada epoch 41 karena *fine-tune* dari checkpoint 640 mengganggu model
— itu bukti strategi inisialisasi yang salah, bukan bukti resolusi/augmentasi
gagal. RT-DETR-L dihentikan pada epoch 52; `best.pt` = epoch fitness-terbaik
(ep25).

### 5.2 RT-DETR-L: selisih terhadap baseline

RT-DETR-L (ultralytics 8.4.103, **32.970.476 parameter**, 103,4 GFLOPs, backbone
HGNetv2-L, encoder AIFI + RepC3, RTDETRDecoder), dilatih 1280 dari bobot COCO,
augmentasi aman-warna (`hsv_s=0.15`).

| TEST | mAP50 | mAP50-95 | B1 | B2 | B3 | **B4** |
|---|---|---|---|---|---|---|
| Baseline yolo26m | 0,5161 | 0,2457 | 0,7410 | 0,4016 | 0,5894 | 0,3323 |
| **RT-DETR-L** | **0,5794** | **0,2694** | 0,7891 | 0,4685 | 0,6391 | **0,4208** |
| selisih | **+0,0633** | +0,0237 | +0,0481 | +0,0669 | +0,0497 | **+0,0885** |

Ini **detektor 4-kelas terbaik yang dihasilkan pilot**: unggul pada keempat
kelas di kedua split, dengan kenaikan terbesar pada **B4 (+0,0885 test)** — kelas
yang paling tersamar.

**Batas atribusi — penting.** Pola "gain terbesar di kelas terpadat" **konsisten
dengan** hipotesis NMS-free, tetapi run ini **tidak** mengisolasi NMS sebagai
penyebab. Yang berubah sekaligus: keluarga arsitektur (transformer decoder vs
head YOLO), backbone (HGNetv2-L vs yolo26m), pencocokan Hungarian satu-ke-satu,
kapasitas (33,0 juta vs 21,9 juta parameter), bobot pratlatih COCO yang berbeda,
dan resolusi latih (1280 vs 640). Kenaikan +0,063 karena itu adalah **efek
gabungan seluruh perubahan tersebut**, bukan efek terukur dari menghapus NMS.
Menyatakan "NMS adalah penyebabnya" menuntut ablasi yang belum dijalankan —
misalnya RT-DETR pada 640, atau YOLO dengan pasca-pemrosesan diganti.

### 5.3 RF-DETR-L: sasaran mAP50 terlewati (E-021)

RF-DETR-L (rfdetr 1.8.3, **35.650.000 parameter**, backbone **DINOv2** patch-16
pra-latih + kepala LW-DETR hasil NAS), resolusi 1280 tepat, dari bobot COCO
`rf-detr-large-2026`. Checkpoint ep9 (EMA), *early-stop* ep17.

| TEST | mAP50 | mAP50-95 | B1 | B2 | B3 | **B4** |
|---|---|---|---|---|---|---|
| RT-DETR-L (E-020) | 0,5794 | 0,2694 | 0,7891 | 0,4685 | 0,6391 | 0,4208 |
| **RF-DETR-L (E-021)** | **0,6038** | **0,2770** | 0,817 | 0,497 | 0,668 | 0,433 |
| selisih | **+0,024** | +0,008 | +0,028 | +0,029 | +0,029 | +0,012 |

**Perbandingan adil, satu protokol.** Dua celah pada E-020 sudah ditutup: (1)
baseline YOLO **param-adil** YOLO26l (26,3 juta, konfigurasi identik RT-DETR)
dilatih penuh, dan (2) keempat model dievaluasi lewat **pipeline pycocotools yang
sama**, sehingga tidak ada lagi evaluator campur.

| Model | Param | VAL mAP50 / 50-95 | TEST mAP50 / 50-95 |
|---|---|---|---|
| YOLO26m | 21,9 jt | 0,5195 / 0,2411 | 0,5165 / 0,2452 |
| YOLO26l | 26,3 jt | 0,5270 / 0,2526 | 0,5300 / 0,2568 |
| RT-DETR-L | 33,0 jt | 0,5459 / 0,2555 | 0,5784 / 0,2707 |
| **RF-DETR-L** | 35,7 jt | **0,5695 / 0,2604** | **0,6038 / 0,2770** |

Urutan performa = urutan parameter di semua metrik dan kedua split. YOLO26l —
baseline YOLO sekelas DETR dari sisi kapasitas dan resolusi — **tetap di bawah
kedua DETR**. Artinya keunggulan RF-DETR/RT-DETR **bukan** efek kapasitas atau
resolusi.

**Signifikansi.** Bootstrap 2.000× *resample* gambar test (588, seed 42): selisih
berpasangan RF−RT = **+0,0255, CI 95% [0,0104 – 0,0408]**, P(RF>RT) = 0,999. CI
selisih tidak memuat nol.

**Harga yang dibayar — jangan dilewat.** RF-DETR paling akurat sekaligus paling
lambat: **118,1 ms / 8,5 FPS** di NVIDIA L4, versus RT-DETR 74,2 ms (13,5 FPS)
dan YOLO26m 24,8 ms (40,3 FPS). Untuk penerapan lapangan waktu-nyata ini
pertimbangan nyata; optimasi FP16 belum diukur.

**Confusion matrix (test, IoU 0,5, conf ≥ 0,25)** menguatkan dua diagnosis lama
secara kuantitatif: B2↔B3 adalah pasangan yang paling sering tertukar di semua
model (RF-DETR: 184 B2→B3, 60 B3→B2), dan B4 yang terlewat jadi latar jauh lebih
sedikit pada DETR (RT-DETR 91, RF-DETR 108) dibanding YOLO (YOLO26m 245,
YOLO26l 276) — sekitar 2,5× lebih baik.

### 5.4 Jarak ke sasaran

| | mAP50 | ke 0,60 | mAP50-95 | ke 0,30 |
|---|---|---|---|---|
| val | 0,5695 | **−0,031** | 0,2604 | **−0,040** |
| test | **0,6038** | **+0,004 (LEWAT)** | **0,2770** | **−0,023** |

**Sasaran mAP50 0,60 pada test terlewati untuk pertama kali.** mAP50-95 masih
kurang 0,023 — itu yang tersisa.

Bobot terbaik berada di luar repo dan dapat direproduksi dari skrip arsip:
RF-DETR `checkpoint_best_ema.pth` (142 MB), RT-DETR `best.pt` (264 MB), YOLO26l
`best.pt` (53 MB). Pengarsipannya ke penyimpanan objek belum dilakukan.

---

## 6. DEPTH-SENSOR-MVCD — blok E-022…E-032

Ini fase yang paling mahal dan **satu-satunya yang tidak menghasilkan perbaikan
apa pun**. Ia tetap ditulis penuh, karena hasil negatif yang tertutup rapat lebih
berharga daripada hasil positif yang goyah — dan karena separuh isi blok ini
adalah koreksi terhadap kesimpulan blok ini sendiri.

### 6.1 Dataset baru, dan mengapa angkanya tidak bisa dibandingkan

`ULM-DS-Lab/SawitMVC-Depth` — 352 pohon, 1.408 citra RGB **1280×800 lanskap**,
2.299 kotak B1–B4, plus **depth sensor Orbbec** Y16 848×480 uint16 milimeter per
citra. Integritas 6.336 artefak diverifikasi SHA-256: 0 hilang, 0 tidak cocok.

Inilah yang menutup lubang terbesar pilot: sampai E-021, **satu-satunya "depth"
yang pernah diuji adalah pseudo-depth monokular**, dan itu sudah dipalsukan
(§4.2). Depth sensor fisik belum pernah disentuh.

**Peringatan pembanding, mengikat.** Tidak satu pun angka di §6 sebanding dengan
test mAP50 0,6038 milik E-021:

| | SawitMVC (pilot) | SawitMVC-Depth |
|---|---|---|
| Anotasi | 18.540 kotak | 2.299 kotak |
| Orientasi | 960×1280 potret | 1280×800 lanskap |
| Prior kelas | B3 52,3% · B1 11,0% | B3 14,0% · B1 36,1% (**terbalik**) |
| Kepadatan | 4,64 kotak/citra | 1,63 kotak/citra |
| B4 | 148 kotak | **95 kotak** (38 di test) |

Satu-satunya klaim yang sah adalah **selisih antar lengan di dalam dataset ini
pada protokol identik**. Angka absolutnya tidak dapat dibawa keluar.

### 6.2 Tiga kegagalan senyap yang ditemukan lebih dulu

Sebelum satu pun klaim performa dibuat, tiga jebakan yang tidak menimbulkan error
sama sekali harus dibongkar. Ketiganya hanya ketahuan karena ada yang mustahil
secara definisi — bukan karena ada yang crash.

1. **Sidecar `"alignedTo": "color"` MENYESATKAN.** Buffer masih di grid kamera
   depth. Berkas yang sama membantah dirinya sendiri: ia mengirim ekstrinsik
   `mTrans ≈ −23,7 mm` yang mestinya nol bila benar sudah tersejajar. Tiga bukti
   independen (geometri intrinsik, tidak adanya pita kosong struktural yang
   diwajibkan selisih FOV, dan *mutual information* H3−H1 = **+0,0306 bit,
   CI95 [0,0260; 0,0354]**) mematahkan label itu. `cv2.resize` naif meleset
   **median 29,3 px, maksimum 61 px** — seukuran tandan B4 itu sendiri.
   Memakainya akan menghasilkan **hasil negatif palsu**, persis skenario D3Net
   (entri 037).
2. **Ada DUA unit kamera**, bukan satu (fx_depth 416,55 vs 414,38). Kalibrasi
   wajib dibaca **per berkas**; hardcode satu set = separuh dataset salah
   proses, dan biasnya berkorelasi dengan perangkat sehingga **bocor ke
   perbandingan antar-split**.
3. **Rentang metrik bawaan salah untuk sensor ini.** `fourch.py` memakai
   0,3–8,0 m; terukur 0,000% piksel di bawah 0,3 m dan 10,07% di atas 8 m.
   Dipilih ulang dari histogram **split train saja** (anti-kebocoran):
   **0,8 / 15,0 m**, entropi kanal naik 6,19 → **7,62 bit**.

Ditambah dua bug yang ditemukan audit *setelah* hasil pertama keluar: lengan
kontrol "depth pohon lain" mengambil donor **lintas split** (192 dari 980 citra
train memakai depth pohon **test**), dan lengan derau memakai satu RNG bersama
sehingga kanal ke-4 diacak ulang tiap epoch — ia diam-diam mendapat augmentasi.

**Pelajaran yang dibawa keluar:** pada blok ini, lima dari lima kesalahan serius
tidak menimbulkan satu pun pesan error. Itulah alasan E-032 memilih desain yang
kelemahannya **terlihat** (semua lengan dari nol) di atas desain yang lebih murah
tetapi gagal senyap.

### 6.3 Hasil pertama bertumpu pada satu seed — dan tidak bertahan

E-022 dilaporkan mula-mula pada seed 42 saja: Δ(RGB-D − RGB) = **+0,0252**,
melewati ambang +0,015 yang ditulis di depan. Tetapi CI95-nya
[−0,0215; +0,0632] memuat nol, sehingga H-022 sudah **DIPALSUKAN menurut
kriterianya sendiri** — kriteria yang ditulis sebelum hasil dibaca.

Replikasi multi-seed kemudian menunjukkan +0,0252 adalah **seed paling
menguntungkan dari tiga**:

| Kontras (YOLO26n, E-027) | seed 42 | seed 1337 | seed 2024 | rerata |
|---|---:|---:|---:|---:|
| depth − RGB | +0,0104 | **−0,0414** | **−0,0379** | **−0,0230** |
| derau − RGB | +0,0032 | +0,0011 | **−0,0443** | −0,0133 |
| depth − derau | +0,0072 | **−0,0425** | +0,0064 | −0,0096 |

Tebal = CI95 tidak memuat nol. **Untuk YOLO26n, depth bukan netral melainkan
merugikan** — dua dari tiga seed signifikan negatif.

Klausa penyelamat yang sempat ditulis SR-015 — *"depth terpakai pada kapasitas
tinggi"* — diuji terpisah pada RT-DETR-L (E-029) dan **DICABUT**: depth − derau
menyusut dari +0,0365 menjadi rerata +0,0124 dengan ketiga CI memuat nol, dan
B4 +0,1001 yang menjadi tulang punggungnya tidak direproduksi.

### 6.4 Yang bertahan justru temuan metodologis, bukan temuan depth

Tiga hasil di blok ini bertahan, dan ketiganya tentang **cara mengukur**, bukan
tentang kedalaman:

**(a) Protokol evaluasi (E-025).** `hasil.json` trainer dan `pycocotools` berbeda
hasil, dan celahnya **bukan offset tetap** — ia menskala dengan jumlah deteksi,
yang berbeda sistematis antar lengan. Hipotesis `maxDets` dipalsukan (identik
sampai lima desimal). Aturan yang kini mengikat: **`hasil.json` tidak boleh
dipakai membandingkan antar lengan.**

**(b) Varians split > varians seed (E-031).** Lengan RGB berayun **0,0488**
antar split — lebih lebar daripada 0,0321 antar seed, dan **hampir 5×** ambang
+0,015 yang dipakai H-022 sebagai kriteria keberhasilan. Konsekuensinya mengikat:
**tidak ada angka mAP absolut pada dataset ini yang bermakna tanpa menyebut
split-nya.** Yang berlawanan dengan dugaan wajar: *arah* Δ justru lebih stabil
terhadap split (3/3 positif) daripada terhadap seed (tanda berlawanan) — pola
yang konsisten dengan selisih berpasangan saling menghapus kesulitan split tetapi
tidak menghapus lintasan optimisasi. Itu **hipotesis dari n=3 lawan n=3**, bukan
temuan.

**(c) Ambiguitas terukur tanpa label manusia (E-024, E-026, E-028).** Memakai
identitas fisik tandan lintas-sisi sebagai oracle, detektor memberi kelas berbeda
pada objek yang sama sebesar **0,2329** di SawitMVC (511 tandan) dan 0,1951 di
SawitMVC-Depth (82 tandan) — sementara anotator manusia tidak pernah (0/7.328).
Tabrakannya meluruh rapi dengan jarak ordinal (79 → 32/25 → 12 → **0**) dan
**B2↔B3 dominan**, persis prediksi SR-007/SR-009 — diperoleh tanpa memakai label
kematangan sebagai kebenaran. Depth **tidak** menstabilkannya (E-026: +0,0049,
arah salah, P(depth membantu) = 0,457).

### 6.5 Kapasitas: klaimnya harus dipersempit (E-030)

SR-015 sempat menyimpulkan *"arah efek kanal ke-4 ditentukan kapasitas model"*.
Lompatan yang mendasarinya (YOLO26n 2,57 jt → RT-DETR-L 33,0 jt) mengubah
kapasitas **dan arsitektur sekaligus**, jadi kata "kapasitas" belum terisolasi.
Mengisi celahnya di dalam satu keluarga:

| Model | Param | depth − RGB | derau − RGB | depth − derau |
|---|---:|---:|---:|---:|
| YOLO26n | 2,57 jt | +0,0104 | +0,0032 | +0,0072 |
| YOLO26m | 21,9 jt | −0,0086 | +0,0184 | −0,0270 |
| YOLO26l | 26,3 jt | +0,0054 | **−0,0325** | +0,0379 |
| RT-DETR-L | 33,0 jt | −0,0350 | **−0,0533** | +0,0183 |

Yang **bertahan**: kolom derau − RGB berubah tanda secara monoton menurut
kapasitas, dengan titik balik terukur **antara 21,9 dan 26,3 jt parameter**.
Kanal ke-4 tanpa informasi membantu model kecil dan merugikan model besar.

Yang **tidak** bertahan: kolom depth − derau tidak monoton, dan tidak satu pun
dari keempatnya signifikan. Rumusan penggantinya:

> Kapasitas menentukan apakah **menambahkan kanal keempat** menolong atau
> merugikan. Kapasitas **tidak** menentukan apakah **mengisi kanal itu dengan
> kedalaman** lebih baik daripada mengisinya dengan derau.

### 6.6 Titik fusi: penjelasan terakhir yang diuji, tetapi belum menutup semua hipotesis (E-032)

Setelah fusi awal dipalsukan pada dua arsitektur dan tiga seed, satu penjelasan
tandingan masih berdiri: mungkin yang salah adalah **titik** fusinya — depth
dipaksa masuk sebelum jaringan sempat membentuk fitur. Ini hipotesis dengan dasar
pustaka yang kuat (sapuan 28 titik fusi Ophoff dkk., §174).

**5 lengan × 3 seed = 15 run, 150 epoch, semuanya dari nol.** Dari nol termasuk
baseline RGB — bukan penghematan, justru 3× lebih mahal — karena arsitektur dua
cabang tidak punya checkpoint COCO yang cocok, sehingga membandingkannya dengan
lengan pratlatih akan mengukur ada-tidaknya pralatihan, bukan titik fusi.

| lengan | seed 42 | seed 1337 | seed 2024 | rerata | rentang | putusan |
|---|---:|---:|---:|---:|---:|---|
| awal | −0,0120 | +0,0234 | −0,0017 | +0,0032 | 0,0354 | tidak berbeda |
| **mid** (P2/4) | +0,0096 | +0,0212 | +0,0110 | **+0,0139** | **0,0116** | **indikasi** |
| late (P3/P4/P5) | −0,0056 | +0,0070 | +0,0102 | +0,0039 | 0,0158 | tidak berbeda |
| derau | −0,0130 | +0,0025 | −0,0081 | −0,0062 | 0,0155 | tidak berbeda |

**Seluruh 12 CI95 memuat nol.** Kriterianya ditetapkan sebelum hasil dibaca.

Tiga pembacaan, berurut dari yang paling didukung bukti:

1. **Efek titik fusi lebih kecil daripada derau seed.** Rentang antar-seed pada
   lengan `awal` (0,0354) melampaui SELURUH selisih antar-titik yang terukur.
2. **Fusi akhir tidak menolong meski menambah parameter paling banyak** (3,00 jt
   vs 2,51 jt): dua backbone penuh, ~17% parameter tambahan, nol perbaikan.
3. **`mid` konsisten positif tetapi belum boleh disebut temuan.** Rentang
   tersempit, rerata tertinggi, unggul +0,0201 atas kontrol derau — pola yang
   diharapkan bila ia benar bekerja. Tetapi ketiga CI memuat nol, dan dengan
   4 lengan diuji, satu lengan bertanda sepakat 3/3 secara kebetulan **bukan
   kejadian langka**.

**Konsekuensi:** pada YOLO26n, satu split, 640 piksel, 150 epoch, dan
pelatihan dari nol, data tidak menunjukkan perbedaan yang dapat dibedakan
antar titik fusi. Itu mempersempit hipotesis dalam rezim ini, tetapi tidak
menutup pretrained middle/late fusion, kapasitas lain, split lain, atau data
lapangan. Kandidat yang tersisa meliputi kapasitas, kualitas depth itu sendiri,
dan ukuran data ([SR-015 §7b](SR/SR-015-depth-sensor-4kanal.md)).

### 6.7 Ringkasan blok: apa yang sebenarnya dibeli

| Pertanyaan | Jawaban setelah 11 entri |
|---|---|
| Apakah depth sensor fisik menaikkan deteksi? | **Belum terbukti** pada seluruh konfigurasi yang diuji |
| Apakah kegagalannya karena registrasi? | Tidak — registrasi divalidasi tiga cara |
| Apakah karena titik fusi? | E-032 tidak konklusif dalam rezim diuji; ekuivalensi belum dibuktikan |
| Apakah karena kapasitas model? | Sebagian, tetapi hanya untuk *ada-tidaknya* kanal ke-4, bukan untuk *isinya* |
| Apakah depth menstabilkan identitas lintas-sisi? | E-026 tidak konklusif karena denominator identitas berbeda |
| Apa yang tersisa sebagai kandidat penyebab? | Kualitas depth itu sendiri, ukuran data (980 citra latih), kapasitas |

Yang dibeli blok ini bukan perbaikan mAP, melainkan **penutupan jalur secara
meyakinkan** plus tiga instrumen yang bertahan: protokol evaluasi tunggal,
ukuran varians split, dan ukuran ambiguitas bebas-label.

---

## 7. Apa yang menunggu di depan

### 7.1 Yang sudah siap dan tidak hilang

- **[`pipeline/`](../pipeline/README.md)** — pipeline produksi YOLO 4-kanal
  (RGB + depth) untuk kamera **Orbbec Gemini**. Satu bobot melayani dua mode uji
  lewat *modality dropout*: RGB+depth saat sensor terpasang, RGB saja saat tidak.
  Kontrak kanal keempat sudah dibekukan (PNG uint8, `0` = tidak ada data,
  `1..255` = *inverse depth* pada rentang metrik tetap 0,3–8 m). Integrasi ke
  aplikasi lapangan yang sudah ada = tiga baris (`Sawit4CH`). **Belum ada bobot
  terlatih.** Catatan penting setelah §6: rentang metrik bawaannya (0,3–8 m)
  **terbukti salah** untuk Orbbec Gemini pada kasus ini — pakai 0,8/15,0 m
  (§6.2), dan `prepare_depth.py` tidak boleh dipakai untuk data ber-sidecar
  seperti SawitMVC-Depth.
- **Dataset master 3024×4032** — dirakit dari peta isi E-015 (3.992/3.992 cocok,
  skor terendah 0,9985, nol ambigu), menunjuk ke piksel master penuh tanpa
  anotasi ulang karena rasio aspeknya identik (0,75). Belum dipakai melatih
  apa pun.
- **RF-DETR-L `checkpoint_best_ema.pth`** — model terbaik (§5.3), 142 MB.
  RT-DETR-L `best.pt` (264 MB) dan YOLO26l `best.pt` (53 MB) sebagai pembanding.

### 7.2 Register gerbang G0–G8 — dan satu yang masih terbuka

Blok depth sensor dikerjakan sebagai sembilan "gerbang" (celah yang harus
ditutup sebelum kesimpulan boleh dibuat). Daftar ini **belum pernah ditulis di
repo**; ia direkonstruksi dari judul entri dan pesan commit, dan dicatat di sini
supaya dapat diverifikasi.

| Gerbang | Isi | Ditutup oleh | Status |
|---|---|---|---|
| G0 | Penjaga kelengkapan run + tautan mati | `d58eae9` | **Terbuka pada snapshot kerja; manifest dan provenance perlu dirilis bersama source/PDF** |
| G1 | Selisih evaluator `hasil.json` vs pycocotools | E-025 | Asimetri terikat; mekanisme penuh belum terselesaikan |
| G2 | Matriks multi-seed, protokol tunggal | E-027 (YOLO26n) + E-029 (RT-DETR-L) | Tertutup untuk rezim diuji, bukan universal |
| G3 | Restrukturisasi E-022 + penyelarasan putusan SR-015 | `9c5d9dd`, `86f8e65` | Tertutup |
| G4 | Fusi menengah | E-032 | **Tidak konklusif; CI memuat nol, ekuivalensi belum dibuktikan** |
| G5 | Varians split | E-031 | Terukur pada tiga split; hukum populasi belum ditetapkan |
| G6 | Fusi akhir | E-032 | **Tidak konklusif; CI memuat nol, ekuivalensi belum dibuktikan** |
| G7 | Sapuan kapasitas dalam satu keluarga | E-030 | Eksploratori satu seed; tidak menutup klaim kapasitas |
| G8 | Ukuran lintas-sisi pada dataset berdaya uji layak | E-028 | Daya uji RGB meningkat; bukan perbandingan depth |
| **G7b** | **Monotonisitas kapasitas diuji multi-seed** | — | **TERBUKA** |

**G7b belum selesai dan tidak boleh dilupakan.** Commit `7afd274` membuka 12 run
tambahan (yolo26m/l × 3 modal × seed 1337, 2024) untuk menguji apakah
monotonisitas kolom derau − RGB (§6.5) bertahan multi-seed. Yang benar-benar
terjadi:

- **7 dari 12 run selesai dilatih** dan kurvanya terarsip (seed 1337 lengkap
  untuk yolo26m dan yolo26l; seed 2024 hanya `yolo26m_rgb`).
- **0 kontras berpasangan dihitung** — `paired_yolo26{m,l}_*` hanya ada untuk
  seed 42.
- **E-030 tidak pernah diperbarui**, sehingga keterbatasan "satu seed" yang
  ditulis di sana masih berlaku apa adanya.

Konsekuensinya jujur: klaim titik balik kapasitas **antara 21,9 dan 26,3 jt
parameter** tetap berstatus **pola satu-seed**, bukan temuan. Menyelesaikan G7b
menuntut 5 run sisa (~1 jam) plus evaluasi berpasangan — murah dibanding
nilainya, karena klaim inilah yang dipakai memilih arsitektur.

### 7.3 Jalur lanjutan, prioritas turun

1. **Selesaikan G7b** (§7.2) — 5 run + evaluasi. Termurah, dan menaikkan status
   satu klaim yang sudah dipakai mengambil keputusan.
2. **RF-DETR-L pada piksel master 3024×4032** (imgsz 1600–2048) — menyerang
   lokalisasi, penentu mAP50-95 yang sasarannya kini satu-satunya yang tersisa
   (−0,023). Taruhan terbaik menutup jarak itu.
3. **Kapasitas di atas mekanisme yang sudah terbukti** — RF-DETR pada varian
   lebih besar, atau RT-DETR-X (67,5 juta parameter).
4. **Optimasi latensi RF-DETR** (FP16 `optimize_for_inference`) — 8,5 FPS
   terlalu lambat untuk lapangan waktu-nyata; perlu diukur sebelum dipakai.
5. **Loss ordinal / kepala regresi kematangan (I-22)** — menyerang ketidakcocokan
   objektif-vs-metrik dari §4.4, dan belum pernah diuji di atas detektor terbaik.
6. **`mid` pada yolo26m/l** — satu-satunya arah depth yang masih punya dasar
   (§6.6 + §6.5), dan **hanya** kalau ada alasan lain melanjutkan jalur depth.
7. **Loss berimbang/focal (I-13), neck BiFPN (I-15)** — prioritas terendah.

### 7.4 Yang menunggu keputusan pengguna, bukan sekadar teknis

- **Apakah jalur depth diteruskan sama sekali.** Ini kini pertanyaan strategis,
  bukan teknis. Depth sensor fisik sudah diuji habis (§6) dan tidak membeli apa
  pun pada konfigurasi mana pun yang dicoba. Melanjutkan berarti bertaruh pada
  salah satu dari tiga kandidat penyebab yang tersisa — kualitas depth, ukuran
  data, kapasitas — dan masing-masing eksperimen tersendiri.
- **Brondolan lepas** sebagai penanda kematangan — kriteria panen lapangan yang
  sesungguhnya, tidak terlihat dari kanopi pada jarak foto ini. Ini mengubah
  **perumusan tugas**, bukan tuning, dan perlu persetujuan sebelum disentuh.

---

## 8. Batas klaim — yang tidak boleh dibaca berlebihan

Diringkas dari peringatan yang tersebar di log; semuanya mengikat.

1. **Pseudo-depth ≠ depth sensor.** Semua angka depth di **pilot** (§4.2) berasal
   dari model monokular, bersifat **relatif** (bukan metrik), dan galatnya
   berkorelasi dengan RGB sumbernya. Depth sensor fisik diuji terpisah di §6 —
   jangan mencampur kesimpulan keduanya.
2. **Kenaikan RT-DETR bukan bukti kausal tentang NMS.** Lihat §5.2 — banyak hal
   berubah sekaligus.
3. **0,8834/0,4702 adalah selubung empiris, bukan plafon anotasi absolut.**
   Lihat §4.5.
4. **"Plafon kematangan 68%" sudah DITARIK.** Jangan dikutip.
5. **Nol `class_mismatch`** (E-001) adalah pemeriksa integritas data yang bersih;
   ia **tidak** mendukung maupun membantah klaim ambiguitas B2/B3, dan bukan
   "konsistensi anotator 100%".
6. **52,87%** dari E-012 adalah batas **bawah** keterpisahan dari fitur buatan
   tangan; yang transferable adalah struktur kebingungannya yang ordinal, bukan
   angkanya.
7. **Keberhasilan geometri DA3 bersifat tingkat-pohon.** Pemisahan tingkat-tandan
   tidak terbukti — justru dipalsukan (§4.2).
8. **mAP tidak dapat mewakili toleransi ordinal.** Kedua cara memaksakannya
   menurunkan angka; pelaporan yang jujur memisahkan AP deteksi kelas-agnostik
   dari akurasi kematangan.

Tambahan dari blok depth sensor — sama mengikatnya:

9. **Tidak ada angka E-022 yang boleh dikutip.** Seluruh entri bertumpu pada satu
   seed, dua lengan kontrol berkode cacat, dan evaluator yang kini terlarang
   untuk perbandingan antar lengan. Pakai E-027/E-029 sebagai gantinya.
10. **Angka SawitMVC-Depth tidak sebanding dengan SawitMVC.** Dataset, prior
    kelas, orientasi, dan kepadatan semuanya berbeda (§6.1). Yang sah hanya
    selisih antar lengan di dalam satu dataset.
11. **Setiap angka mAP pada SawitMVC-Depth wajib menyebut split.** Rentang
    antar-split 0,0488 melampaui hampir semua efek yang pernah diperdebatkan
    (§6.4b).
12. **`mid` (+0,0139) adalah INDIKASI, bukan temuan.** Ketiga CI memuat nol, dan
    dengan 4 lengan diuji satu tanda sepakat 3/3 bukan kejadian langka (§6.6).
13. **Titik balik kapasitas 21,9–26,3 jt masih satu seed.** G7b belum selesai
    (§7.2); jangan mengutipnya sebagai temuan multi-seed.
14. **"Depth tidak menolong" berlaku untuk yang diuji, bukan universal.** Yang
    diuji: fusi awal/menengah/akhir, YOLO26n/m/l + RT-DETR-L, 980 citra latih,
    satu sensor. Kualitas depth dan ukuran data belum terpisahkan sebagai
    penyebab.

---

## 9. Reproduksi

Kode eksperimen dijalankan di luar repo; snapshot kode, hasil JSON, dan split
diarsipkan di dalam repo bersama panduan reproduksi langkah demi langkah
(skrip → SR → keluaran, versi persis pustaka, dan celah yang diakui jujur).
Dataset: SawitMVC 960×1280 dan master 3024×4032, split per pohon 716/96/141
dengan irisan nol — invarian yang harus dijaga.

**Blok depth sensor** (§6) memakai SawitMVC-Depth, split per-pohon
terstratifikasi `(device × unit-kamera) × kelas-dominan`, 245/35/72 pohon,
irisan nol. Bukti terarsip: 39 kurva latihan + 37 kontras di
`experiments/results/E-022/`, 15 kurva latihan + 12 kontras di
`experiments/results/E-023/`. **Bobot tidak diarsipkan** (kebijakan
repo); sebagai gantinya tiap run menyimpan SHA-256 `best.pt`, sehingga hasil
latih-ulang dapat diverifikasi identik atau tidak.

Tiga jebakan yang wajib dibaca sebelum membangun ulang lingkungan — layout
`data/`, pin `opencv-python==4.11.0.86` dan `numpy==1.26.4` setelah ultralytics,
serta `reproject_depth.py --z-near 0.8 --z-far 15.0` — ada di
[STATUS.md](STATUS.md) §"Mulai dari nol setelah jeda".

Untuk deliverable produksi, seluruh perintah latih/konversi/inferensi ada di
[`pipeline/README.md`](../pipeline/README.md).

---

*Cuplikan ini dikurasi 25 Juli 2026, diperluas ke E-032 pada 1 Agustus 2026.
Angka apa adanya, hasil negatif ikut dilaporkan — dan di blok §6, hasil negatif
adalah keseluruhan isinya. Bila ada selisih antara dokumen ini dan
[`experiments/EKSPERIMEN.md`](EKSPERIMEN.md) / [`experiments/METRICS.md`](METRICS.md), yang kanonik
adalah kedua berkas itu.*


===== experiments/METRICS.md =====

# Metrik final yang boleh dikutip

Halaman ini hanya memuat metrik performa final. Saat ini, satu-satunya hasil
yang memenuhi status tersebut adalah perbandingan empat kelas E-021 pada
SawitMVC. Angka E-022 tidak ada di halaman ini karena belum mendukung klaim
peningkatan deteksi; lihat [audit E-022](AUDIT-E022.md) dan
[arsip seed-42](archive/E022-seed42-awal.md).

## E-021: perbandingan final satu protokol

Keempat model dievaluasi lewat pipeline `pycocotools` yang identik: prediksi
dengan ambang rendah, ground truth yang sama, lalu `COCOeval`. Konfigurasi
dipilih pada val; angka test hanya dilaporkan. Split per pohon adalah
716/96/141, setara 3.000/404/588 citra train/val/test dengan irisan nol.

| Model | Parameter | Resolusi | Val mAP50 | Val mAP50-95 | Test mAP50 | Test mAP50-95 |
|---|---:|---:|---:|---:|---:|---:|
| YOLO26m | 21,9 jt | 640 | 0,5195 | 0,2411 | 0,5165 | 0,2452 |
| YOLO26l | 26,3 jt | 1280 | 0,5270 | 0,2526 | 0,5300 | 0,2568 |
| RT-DETR-L | 33,0 jt | 1280 | 0,5459 | 0,2555 | 0,5784 | 0,2707 |
| **RF-DETR-L** | **35,7 jt** | **1280** | **0,5695** | **0,2604** | **0,6038** | **0,2770** |

Klaim yang dapat dikutip: **RF-DETR-L adalah detektor empat kelas terbaik pada
E-021, dengan test mAP50 0,6038 dan mAP50-95 0,2770.** Baseline YOLO26l yang
sekelas parameter tetap berada di bawah kedua model DETR dalam empat metrik
utama.

## Sumber dan reproduksi

- JSON kanonik: [`experiments/results/E-021/perkelas_pycoco.json`](results/E-021/perkelas_pycoco.json).
- Skrip evaluator: [`experiments/code/eval/eval_all_pycoco.py`](code/eval/eval_all_pycoco.py).
- Metrik lengkap per kelas, AP, AR, precision, recall, F1, bootstrap, serta
  efisiensi: [`experiments/results/E-021/`](results/E-021/).
- Catatan konfigurasi dan jebakan run: [`CATATAN-TEKNIS-E021.md`](code/CATATAN-TEKNIS-E021.md).
- Perintah lengkap: [`REPRODUCE.md`](code/REPRODUCE.md).

## Batas penggunaan

- Hasil ini berlaku untuk SawitMVC dan split E-021, bukan untuk SawitMVC-Depth.
- Hasil E-022 hanya boleh dibaca bersama [auditnya](AUDIT-E022.md); jangan
  menggunakannya sebagai bukti bahwa depth sensor meningkatkan mAP.


===== experiments/REPORT_PLAN.md =====

# Complete Research Results Report Plan

## 1. Purpose and acceptance criteria

This plan defines the evidence, narrative order, file set, visual set, and
verification gates for the complete English results report. The report is
designed as the results companion to "manuscript/source/main.tex". The
manuscript maps the literature; this report explains what was actually tried,
what was measured, why a result moved the research branch, and what remains
open.

The finished deliverable must satisfy all of the following:

1. Use Elsevier `elsarticle` formatting in "reports.tex" so the layout stays
   readable while the evidence and discussion remain the acceptance criteria.
2. Give a dedicated discussion section to every numbered slot E-001 through
   E-032.
3. State explicitly that E-008 was not run and that E-023 was executed under
   the redesigned E-032 protocol.
4. Cover the physical-depth gate register G0 through G8 and retain the open
   follow-up G7b.
5. For every experiment, state objective, hypothesis, data, configuration,
   controls, metrics, evidence, interpretation, verdict, consequence, and
   reproduction route.
6. Keep RGB pilot results and physical-depth results in separate evidence
   boundaries. Do not compare their absolute mAP values as one leaderboard.
7. Use GPT Image 2 for explanatory raster figures and deterministic charts for
   exact metric comparisons.
8. Compile to a PDF and render representative pages for visual inspection.
   Page count is descriptive, not a pass/fail criterion; the current snapshot
   is allowed to grow when additional evidence is added.
9. Give each executed experiment a substantive, evidence-rich discussion.
   A section may combine prose, a table, and a phase figure, but it must not be
   padded with forced page breaks or unsupported filler. E-008 remains a
   transparent not-run exception.
10. Make the causal transition from one experiment to the next explicit. A
    figure is useful only when its caption and surrounding prose explain what
    changed, what was held fixed, and why the next branch followed.
11. Keep every claim traceable to a repository document, script, metric table,
   JSON artifact, commit, or explicitly marked historical audit.

## 2. Repository evidence hierarchy

The report follows this precedence when sources disagree:

1. Current raw result JSON, metric manifests, and checksum manifests.
2. "experiments/METRICS.md" for the definitive E-021 comparison.
3. "experiments/AUDIT-E022.md" for corrections to the first physical-depth
   result.
4. "experiments/LAPORAN-EKSPERIMEN.md" for the curated experiment register
   and current verdicts.
5. "experiments/EKSPERIMEN.md" for the append-only chronology.
6. SR notes, reproduction READMEs, and scripts for method detail.
7. Literature and generated figures for motivation or explanation only.

The report never turns an unverified historical number into a current claim.
The report also preserves withdrawn claims so that a reader can understand
why the branch changed.

## 3. Report architecture

### Part I. Scope and evidence boundary

- Define the operational target: detect, classify, count, and support RGB-only
  fallback for fresh-fruit bunches.
- Explain the difference between the 953-tree RGB pilot and the 352-tree
  physical-depth branch.
- Freeze the repository cutoff at commit "5b63297".
- Summarize the 202 BibTeX records and 182 verified local PDFs.
- Define verdict vocabulary: confirmed, partial, falsified, inconclusive,
  withdrawn, null, delivered, and open.

### Part II. Evidence base and design translation

- Connect detector, depth, fusion, geometry, and identity literature to
  falsifiable hypotheses.
- Explain why pseudo-depth and physical sensor depth are different modalities.
- Describe the planned visual taxonomy and the complete roadmap.

### Part III. RGB pilot, E-001 through E-021

The RGB branch is narrated as a diagnostic funnel:

1. E-001 to E-005: invalidate the first ambiguity statistic and establish the
   tree-level geometry boundary.
2. E-006 to E-007: test pseudo-depth and geometric counting at the bunch level.
3. E-009 to E-012: diagnose B4 visibility, texture, and ordinal maturity.
4. E-013 to E-017: specify the production contract and decompose the mAP
   bottleneck.
5. E-018 to E-021: measure the localization envelope, test safe high
   resolution, compare RT-DETR-L, and select RF-DETR-L.

### Part IV. Physical-depth branch, E-022 through E-032

The physical-depth branch is narrated as an audit and replication funnel:

1. E-022: audit sidecar semantics, calibration, reprojection, range, and the
   first early-fusion result.
2. E-023: preserve the redesigned middle/late-fusion plan as an execution
   alias under E-032.
3. E-024 to E-026: create and test an annotation-derived cross-side identity measure.
4. E-025: bind every inter-arm comparison to one evaluator.
5. E-027 and E-029: replace seed-42 claims with corrected multi-seed matrices.
6. E-028: repeat identity measurement on the larger RGB dataset.
7. E-030 and E-031: isolate capacity and split variance.
8. E-032: test early, middle, late, and noise controls from scratch.

### Part V. Synthesis and appendices

- State the best observed RGB development benchmark with its external boundary.
- State the bounded negative physical-depth result.
- Explain exactly which hypotheses were closed and which remain open.
- Provide the full configuration ledger, script map, derived metric rules,
  complete experiment register, visual provenance, and gate register.

## 4. Per-experiment writing contract

Every "experiment" section must contain the following subsections or
equivalent paragraphs:

| Field | Required content |
|---|---|
| Objective | The scientific question in one sentence |
| Hypothesis | What would count as support and what would falsify it |
| Configuration | Dataset, split, architecture, input size, epochs, seed, batch, optimizer, augmentation, initialization, evaluator |
| Controls | Negative controls, swapped controls, same-seed pairing, or why no control was valid |
| Evidence | Exact counts, metric values, confidence intervals, and class-level results |
| Interpretation | Mechanistic explanation constrained by the measurement |
| Verdict | Confirmed, partial, falsified, inconclusive, withdrawn, null, or delivered |
| Consequence | Which next experiment or gate was opened or closed |
| Reproducibility | Script, manifest, JSON, README, or commit path |

Special provenance rules:

- A missing run is not a null result.
- A withdrawn metric remains visible but cannot be cited as current evidence.
- A cross-dataset comparison must be labeled invalid when dataset, split, or
  protocol differs.
- A CI containing zero is inconclusive for that contrast; it is not proof of
  no effect.
- A one-seed capacity pattern is a hypothesis generator until G7b is closed.

## 5. Experiment traceability matrix

| Experiment | Scientific focus | Primary evidence | Report treatment |
|---|---|---|---|
| E-001 | "class_mismatch" as ambiguity | SR-001 and E-001 log | Falsified as an ambiguity measure |
| E-002 | Reuse master annotations | SR-002 and inventory probe | Inconclusive, motivates E-015 |
| E-003 | DA3 on one orbit video | SR-003 | Partial, tree geometry only |
| E-004 | DA3 on six videos | SR-003 | Confirmed at tree level |
| E-005 | DA3 four/eight-side order | SR-004 | Confirmed for side ordering |
| E-006 | Pseudo-depth bunch signal | SR-005 and result JSON | Falsified |
| E-007 | Geometric linking and counting | SR-006 and ablation table | Falsified |
| E-008 | Reserved slot | Append-only log | Not run |
| E-009 | Ground-truth box size | SR-007 | Partial |
| E-010 | B4 contrast, texture, density | SR-007 | Contrast confirmed, density falsified |
| E-011 | Texture preprocessing | SR-008 | Texture confirmed, contrast boost falsified |
| E-012 | Ordinal maturity confusion | SR-009 | Confirmed |
| E-013 | Production RGB-D contract | "pipeline/README.md" | Delivered contract, no accuracy claim |
| E-014 | Detection versus classification bottleneck | SR-010 and diagnostic JSON | Diagnostic pending JSON identity check |
| E-015 | Master-image content mapping | SR-002 and mapping manifest | Unblocked |
| E-016 | Proposed maturity ceiling | SR-011 | Withdrawn as a hard ceiling |
| E-017 | Two-stage detector | SR-012 and evaluator outputs | Falsified |
| E-018 | Localization envelope | E-018 analysis and IoU envelope | Descriptive oracle reachability, not AP/mAP |
| E-019 | High-resolution safe-color baseline | RGB run manifest | Single-run descriptive result; no population-null claim |
| E-020 | RT-DETR-L direction | SR-013 and metrics | Multi-factor shortlist direction |
| E-021 | RF-DETR-L fair comparison | "METRICS.md" and paired bootstrap | Best observed RGB development benchmark; repeated test exposure |
| E-022 | Sensor audit and early fusion | "AUDIT-E022.md" and audit JSON | Historical metrics retracted |
| E-023 | Redesigned fusion study | E-032 manifest | Execution alias |
| E-024 | Cross-side identity measure | SR-016 and consistency JSON | Annotation-derived measure with power limits |
| E-025 | Evaluator gap | evaluator diagnostic JSON | pycocotools protocol bound |
| E-026 | Depth identity stabilization | paired consistency JSON | Inconclusive within measured subset; unequal denominators |
| E-027 | YOLO26n multi-seed matrix | 12 paired JSON files | Benefit criterion falsified; harmful in two of three seeds, not universal |
| E-028 | SawitMVC identity power | G8 consistency JSON | RGB identity power/context study; no physical-depth treatment test |
| E-029 | RT-DETR-L multi-seed matrix | 9 paired JSON files | Capacity rescue retracted |
| E-030 | YOLO26 capacity sweep | capacity metrics manifest | Partial, one seed |
| E-031 | Split versus seed variance | split manifests and paired JSON | Observed split sensitivity |
| E-032 | Early/mid/late fusion | 15-run manifest and 12 contrasts | Inconclusive within tested regime; all CIs include zero; G4/G6 not universal |

## 6. Gate traceability matrix

| Gate | Question | Closing evidence | Current status |
|---|---|---|---|
| G0 | Are all runs and links accounted for? | Run inventory and link audit | Open; manifest repair required |
| G1 | Why do trainer and pycocotools scores differ? | E-025 | Protocol bound; asymmetry characterized |
| G2 | Does a single seed generalize? | E-027 and E-029 | Closed |
| G3 | Is the E-022 decision aligned with the audit? | E-022 audit corrections | Closed |
| G4 | Does middle fusion help? | E-032 | Inconclusive within tested regime |
| G5 | Does the split change the result? | E-031 | Closed within tested split conditions; observed split sensitivity |
| G6 | Does late fusion help? | E-032 | Inconclusive within tested regime |
| G7 | Does capacity explain the channel cost? | E-030 | Exploratory, one seed |
| G8 | Is identity power sufficient on SawitMVC? | E-028 | Limited power boundary |
| G7b | Does the capacity pattern hold across seeds? | Five runs and paired evaluation still required | Open |

## 7. Visual production plan

### GPT Image 2 conceptual assets

Use GPT Image 2 for explanatory figures where exact numerical geometry is not
the claim:

| Asset | Intended role |
|---|---|
| F01 | Evidence taxonomy |
| F02 | YOLO and detector timeline |
| F03 | RGB detector lineage |
| F04 | Early, middle, and late fusion strategy |
| F05 | YOLO RGB-D input and projection patterns |
| F06 | Cross-modal attention and feature fusion |
| F07 | FFB detection-to-counting funnel |
| F08 | Production RGB-D pipeline |
| R01 | Complete roadmap from evidence to G7b |
| R02 | Physical-depth audit and training-arm logic |
| R07 | RGB-D experiment architecture and evaluator boundary |
| C01 | Literature corpus by year |
| C02 | Literature corpus by theme |
| H01 | Why RGB-D is a hypothesis for FFB perception |
| H02 | Hypothesis to control and decision-gate translation |
| H03 | Five-phase chronology from E-001 through E-032 |
| H04 | Error attribution for a negative RGB-D result |
| H05 | YOLO26, RT-DETR-L, and RF-DETR-L architecture comparison |
| H06 | Physical-depth audit and replication timeline |
| H07 | Early, middle, late, and noise fusion variants |
| H08 | E-001--E-008 RGB-D diagnostic phase |
| H09 | E-009--E-012 RGB bottleneck phase |
| H10 | E-013--E-021 production and final RGB phase |
| N19 | E-002 provenance before identity |
| N20 | E-003--E-007 geometry transfer and bunch-identity boundary |
| N21 | E-009--E-012 RGB bottleneck chain |
| N22 | E-014 detection versus maturity decomposition |
| N23 | E-015--E-019 mapping to a bounded RGB baseline |
| N24 | E-018--E-021 one RGB protocol and detector directions |
| N25 | E-022--E-032 physical-depth audit, alias, and fusion controls |
| N26 | E-024--E-026 identity denominator and evaluator binding |
| N27 | E-027--E-030 replication and capacity boundary |
| N28 | E-031 split, seed, and paired-delta variance |
| N29 | End-to-end conditional depth claim boundary |

GPT Image 2 figures are labeled conceptual. They must never be used as the
source of a metric, confidence interval, or count.

### Deterministic figures

Use code-native charts for exact data:

| Asset | Exact data shown |
|---|---|
| R03 | E-021 model comparison |
| R04 | E-027 multi-seed deltas |
| R05 | E-032 fusion contrasts |
| R06 | E-014 bottleneck gap |
| "fig-corpus-year.png" | Corpus year distribution |
| "fig-corpus-theme.png" | Corpus theme distribution |

## 8. Configuration ledger

### RGB pilot

- Dataset: SawitMVC RGB, 953 trees, 18,540 boxes, 9,823 unique bunches.
- Images: 3,000/404/588 train/validation/test, 960 by 1280 portrait.
- Tree split: 716/96/141 with zero tree intersection.
- Classes: ordered B1, B2, B3, B4.
- Baseline: YOLO26m, seed 42, 640 pixels, 60 epochs.
- E-021 comparison: YOLO26m, YOLO26l, RT-DETR-L, RF-DETR-L, 1280 pixels,
  safe-color augmentation, one pycocotools protocol.

### Physical-depth branch

- Dataset: SawitMVC-Depth, 352 trees, 1,408 RGB images, 2,299 boxes.
- RGB image geometry: 1280 by 800 landscape.
- Depth: Orbbec Y16, 848 by 480, unsigned 16-bit millimeters.
- Tree split: 245/35/72, with device and dominant-class stratification.
- Reprojection: per-file intrinsics, extrinsics, Brown-Conrady distortion,
  forward z-buffer, median hole fill.
- Raw sidecar range: 0.8 to 15.0 m selected from train only.
- Input order: [B,G,R,D], zero invalid, one to 255 inverse depth.
- Evaluation: paired tree bootstrap, 2,000 resamples, pycocotools.

### Fusion matrix

- Five arms: RGB, early, middle, late, and noise.
- Three seeds: 42, 1337, 2024.
- Fifteen runs, 150 epochs, 640 pixels, YOLO26n, from scratch.
- Twelve paired contrasts.
- Decision rule: all three seeds agree and every CI excludes zero for a
  confirmed difference; sign agreement with a CI containing zero is only an
  indication.

## 9. Build and verification plan

### Source checks

~~~powershell
rg -c '^\\experiment' reports.tex
rg -n '^\\experiment' reports.tex
Select-String -Path reports.tex -Pattern ([char]0x2014)
git diff --check
~~~

Expected experiment count is 32 and the em dash/backtick check must be zero.

### PDF build

~~~powershell
New-Item -ItemType Directory -Force output/pdf | Out-Null
& C:\Users\Zainal\bin\tectonic.exe --outdir output/pdf reports.tex
~~~

### PDF evidence

~~~powershell
& C:\Users\Zainal\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe output/pdf/reports.pdf
~~~

The page count is descriptive, not a minimum. Render the title page, roadmap
page, representative early experiment, representative detector experiment,
representative depth experiment, E-032, configuration ledger, and references.
Inspect for clipped tables, missing figures, unreadable labels, and accidental
blank pages.

## 10. Update protocol

When a new experiment or commit is added:

1. Add the raw artifact and source path first.
2. Update "experiments/EKSPERIMEN.md" and
   "experiments/LAPORAN-EKSPERIMEN.md".
3. Update the experiment and gate matrices in this plan.
4. Add or revise the dedicated experiment section in "reports.tex".
5. Add exact metric charts only from machine-readable data.
6. Rebuild and render the PDF.
7. Recheck the dataset boundary and the open-gate wording.

The report is complete only when the source, plan, figures, compiled PDF, and
verification evidence agree.


===== experiments/STATUS.md =====

# Status eksperimen

Dokumen ini adalah handoff singkat. Untuk peta lengkap, mulai dari
[README eksperimen](README.md).

> **Aktif per 6 Agustus 2026 — [seri F](SERI-F.md).** Seri baru untuk perubahan
> formulasi/arsitektur di atas RF-DETR-L. Keadaan mutakhir: **F-001** memulihkan
> prasyarat (bobot RF-DETR-L E-021 **hilang**, dilatih ulang; resep E-021 muat di
> A4500 dengan puncak 10.331/20.470 MiB, **paralelisme run = 1**); **F-002 LOLOS**
> (frekuensi tinggi memisahkan tandan dari pelepah, dwt_hh +0,0731 pada B4);
> **F-003 GUGUR** (plafon lintas-sisi 0,2794 < 0,30 → K3 dibatalkan); **F-004**
> baseline 3 seed sedang berjalan.

> **Catatan status 2 Agustus 2026.** Laporan Elsevier di `reports.tex` dan
> `experiments/REPORT_PLAN.md` adalah status audit terbaru. Bagian handoff
> lama di bawah dipertahankan untuk provenance, tetapi klaim yang menyatakan
> semua gerbang tertutup atau menyatakan E-026/E-032 sebagai hasil ekuivalen
> telah disupersesi oleh batas bukti terbaru.

## Fakta aktif

| Topik | Status |
|---|---|
| Hasil deteksi empat kelas | **RF-DETR-L E-021** adalah hasil final saat ini: test mAP50 **0,6038** dan mAP50-95 **0,2770**. |
| Dasar angka E-021 | Keempat model pembanding dinilai dengan satu protokol `pycocotools`; lihat [METRICS.md](METRICS.md). |
| Sasaran berikutnya | mAP50-95 0,30 masih kurang 0,023. |
| Data depth sensor E-022 | Parsing kalibrasi dan reproyeksi depth ke RGB tervalidasi. Klaim bahwa depth menaikkan deteksi belum boleh dibuat. |
| Varians split | **Terukur (E-031).** Lengan RGB berayun **0,0488** antar split — melampaui varians seed (0,0321) dan hampir 5× ambang H-022. **Setiap angka mAP wajib menyebut split.** |
| Matriks multi-seed YOLO26n | **Selesai (E-027).** Depth − RGB rerata **−0,0230**, dua dari tiga seed signifikan NEGATIF. Untuk YOLO26n depth **merugikan**, bukan netral. |
| Protokol evaluasi | **Mengikat (E-025):** `hasil.json` tidak boleh dipakai membandingkan antar lengan; celahnya menskala dengan jumlah deteksi. pycocotools protokol tunggal. |
| Ambiguitas lintas-sisi | Terukur tanpa label manusia: **0,2329 di SawitMVC** (511 tandan, E-028) dan 0,1951 di SawitMVC-Depth (82 tandan, E-024). E-026 **tidak konklusif** pada subset terukur karena denominator identitas RGB dan RGB-D tidak sama (82 vs 75); tidak ada klaim ekuivalensi. |
| Kelas paling ambigu | **B2 (0,434)**, bukan B4 (0,234 ≈ B1 0,235). AP50 rendah B4 adalah kegagalan DETEKSI, bukan kebingungan kelas (E-028). |

## Hasil yang boleh dikutip

Gunakan hanya [METRICS.md](METRICS.md) untuk mengutip performa final E-021.
Sumber angkanya adalah
[`experiments/results/E-021/perkelas_pycoco.json`](results/E-021/perkelas_pycoco.json).

## Pekerjaan yang dihentikan atau ditangguhkan

| Jalur | Keputusan | Rujukan |
|---|---|---|
| Pseudo-depth sebagai pemisah tandan | Dipalsukan. Hasil ini tidak menguji sensor depth fisik. | [SR-005](SR/SR-005-sinyal-depth-tandan.md) |
| Detektor dua tahap | Dipalsukan. | [SR-012](SR/SR-012-dua-tahap.md) |
| Klaim plafon kematangan E-016 | Ditarik karena bukti cacat. | [SR-011](SR/SR-011-plafon-kematangan.md) |
| Fusi awal E-022 | Tidak diteruskan sebagai bukti peningkatan deteksi. | [AUDIT-E022.md](AUDIT-E022.md) |
| Fusi menengah atau akhir E-023 | **Dijalankan sebagai E-032.** 15 run (5 lengan x 3 seed, 150 epoch, dari nol), 12 kontras berpasangan. Seluruh 12 CI95 memuat nol. `mid` konsisten positif 3/3 seed (rerata +0,0139) tetapi berstatus INDIKASI, bukan temuan; hasil **tidak konklusif dalam rezim diuji** dan G4/G6 belum tertutup secara universal. | [E-032](EKSPERIMEN.md#e-032--titik-fusi-rgb-d-awal-vs-menengah-vs-akhir-semua-dari-nol-2026-08-01--g4-g6) |

## Lanjutkan sesuai tujuan

| Tujuan | Baca |
|---|---|
| Memahami status semua eksperimen | [README eksperimen](README.md) |
| Memeriksa riwayat bertanggal | [EKSPERIMEN.md](EKSPERIMEN.md) |
| Memeriksa koreksi E-022 | [AUDIT-E022.md](AUDIT-E022.md), lalu [arsip seed-42](archive/E022-seed42-awal.md) |
| Menjalankan ulang E-021 | [catatan teknis](code/CATATAN-TEKNIS-E021.md), [reproduksi](code/REPRODUCE.md), dan [peta skrip](code/PETA-SKRIP.md) |


## Rencana E-023 — SUDAH DIJALANKAN, lihat E-032

> Bagian di bawah adalah rancangan sebelum eksekusi, dipertahankan apa adanya
> sebagai rekam keputusan. Hasilnya di [E-032](EKSPERIMEN.md); yang berubah dari
> rancangan: opsi 2 (semua dari nol) dipilih, dan driver per-seed diganti
> penjadwal berbasis anggaran VRAM di tengah jalan karena barrier per-seed
> meninggalkan GPU menganggur belasan menit tiap pergantian seed.

### Rancangan awal

Arsitektur sudah dibangun dan diverifikasi
([`train_fusion_2branch.py`](code/train/train_fusion_2branch.py)):
fusi menengah 2,51 jt param, fusi akhir 3,00 jt param, keduanya terbukti
tersambung (mengubah HANYA kanal kedalaman mengubah keluaran sebesar 6,8 dan
8,6 — sebanding dengan mengubah HANYA RGB). Yang belum dijalankan adalah
eksperimennya.

### Penghalang yang harus diputuskan lebih dulu

YAML dua cabang adalah arsitektur kustom, sehingga **tidak ada bobot COCO
pratlatih yang cocok dengan grafnya**. Seluruh lengan E-022 berangkat dari bobot
pratlatih — bahkan dengan callback khusus (`fourch.make_inflate_callback`) agar
lengan RGB-D tidak kalah karena inisialisasi. Melatih fusi dari nol lalu
membandingkannya dengan lengan E-022 yang pratlatih **bukan perbandingan sah**:
selisihnya akan didominasi ada-tidaknya pralatihan, bukan titik fusi.

| | Opsi 1 — muat sebagian | **Opsi 2 — semua dari nol** |
|---|---|---|
| Cara | Salin bobot pratlatih ke cabang RGB lewat kecocokan nama/bentuk; cabang depth dan lapisan fusi mulai acak | Latih ulang SELURUH lengan tanpa pralatihan, termasuk baseline RGB dan fusi awal |
| Biaya | ~4 run baru | ~15 run |
| Sebanding dengan E-022 | Ya, **bila** pemetaan bobotnya benar | Tidak — matriks terpisah, berdiri sendiri |
| Mode gagal | **Senyap.** Bobot tersalin sebagian, model tetap terlatih, tidak ada error, angkanya terlihat wajar | **Terlihat.** Angka absolut jatuh dan jelas tidak sebanding dengan E-021/E-022 |

**Opsi 2 dipilih**, dan alasannya bukan biaya — opsi 2 justru 3× lebih mahal.
Alasannya jenis risikonya. Sesi 31 Juli–1 Agustus menemukan tiga kegagalan senyap
berturut-turut (`alignedTo: "color"` yang bohong, `--skala` yang diabaikan
ultralytics, precision > 1 dari `evalImgs`); semuanya tidak menimbulkan error dan
hanya ketahuan karena ada yang mustahil secara definisi. Opsi 1 menambah satu
lagi risiko sejenis. Opsi 2 punya kelemahan yang **terlihat**, dan yang diuji
E-023 memang **selisih antar titik fusi**, bukan angka absolut.

### Konfigurasi yang direncanakan

| Parameter | Nilai | Alasan |
|---|---|---|
| Skala | **n** (fusi mid 2,51 jt / late 3,00 jt) | Yang diuji titik fusi, perbandingan internal antar lengan; skala l melipatkan biaya 4× untuk pertanyaan berbeda |
| Epoch | **150**, bukan 60 | 60 epoch cukup untuk model PRATLATIH. Dari nol dengan hanya 980 citra latih, 60 epoch hampir pasti *underfit* — dan hasil rendah akan salah dibaca sebagai "fusi menengah gagal" |
| Seed | **3** (42, 1337, 2024) | E-027/E-029/E-031 semuanya menunjukkan satu seed membalik tanda kesimpulan. Satu seed di sini = mengulang kesalahan yang menjatuhkan E-022 |
| Split | seed42 dulu | Varians split sudah terukur terpisah (E-031); prioritas replikasi = seed dulu, split kemudian |
| Lengan | RGB, fusi awal, fusi menengah, fusi akhir, derau | Kontrol derau WAJIB — SR-015 §6: tanpa itu kenaikan apa pun tidak dapat dibedakan dari efek kapasitas |

**5 lengan × 3 seed = 15 run, ~4,1 jam** pada RTX A4500 (dasar: laju terukur
1 Agustus, skala n 6,5 menit per run-ekuivalen pada 60 epoch, 4 paralel).

### Yang akan memalsukan, ditulis sebelum run pertama

- Fusi menengah/akhir **tidak** mengungguli fusi awal pada rerata 3 seed; atau
- Kenaikannya tidak melampaui kontrol derau pada lengan yang sama; atau
- Selisihnya lebih kecil daripada sebaran antar-seed pada lengan RGB sendiri.

### Instrumen tambahan yang sudah siap

`analysis/cross_side_consistency.py` memberi pemeriksaan silang yang tidak
dimiliki mAP: bila fusi benar bekerja, **laju inkonsisten lintas-sisi harus
turun** dari 0,2329 (baseline SawitMVC, E-028). Bila mAP naik tetapi laju
inkonsisten datar, kenaikan itu patut dicurigai sebagai efek kapasitas.
Penurunan yang terkonsentrasi di B2↔B3 menunjukkan mekanisme fotometrik; di
B3↔B4 menunjukkan geometris.

## Untuk sesi berikutnya — apa yang terbuka setelah 1 Agustus

G0 masih terbuka; G1/G3/G5/G8 sudah diaudit pada ruang lingkupnya, sementara
G4/G6 tidak konklusif dalam rezim yang diuji dan G7 baru satu seed. **Satu
gerbang susulan, G7b, TIDAK tertutup** — lihat butir 0 di bawah; registernya ada di
[LAPORAN-EKSPERIMEN.md §7.2](LAPORAN-EKSPERIMEN.md). Sisanya berurut dari yang
paling siap:

**0. G7b — monotonisitas kapasitas multi-seed. TERBUKA, dan paling murah.**
Commit `7afd274` membuka 12 run (yolo26m/l × 3 modal × seed 1337, 2024) untuk
menguji apakah pola derau − RGB di E-030 bertahan multi-seed. Yang terjadi:
**7 dari 12 run selesai dilatih** (seed 1337 lengkap untuk kedua arsitektur;
seed 2024 hanya `yolo26m_rgb`), **0 kontras berpasangan dihitung**, dan **E-030
tidak pernah diperbarui**. Akibatnya klaim titik balik kapasitas **21,9–26,3 jt
parameter** masih berstatus pola satu-seed — padahal klaim itulah yang dipakai
sebagai dasar memilih arsitektur. Kurva latihan run yang sudah jadi ada di
`experiments/results/E-022/kurva_latihan/`.

> **⚠ KOREKSI 2026-08-06 — dua angka di paragraf atas SALAH, diperiksa langsung
> di disk.** Paragraf aslinya dipertahankan sebagai rekam; yang berlaku adalah
> koreksi ini.
>
> 1. **Bobotnya TIDAK hilang.** `find runs -name best.pt` menemukan **55
>    checkpoint** utuh (`runs/detect/runs_e022/` + `runs_e023/`), termasuk
>    seluruh RT-DETR-L 3-seed dan 15 run E-023. Jangan melatih ulang apa pun
>    sebelum memeriksa `runs/detect/` lebih dulu.
> 2. **"7 dari 12 run selesai" terlalu optimistis.** Dihitung dari jumlah baris
>    `results.csv` dan ada-tidaknya `hasil.json`, yang benar-benar lengkap hanya
>    **3** run — `yolo26m_{rgb,rgbd,derau}_seed1337` (60 epoch + `hasil.json`).
>    Empat run lain punya `best.pt` tetapi TERPUTUS: `yolo26m_rgb_seed2024`
>    (15 epoch), `yolo26l_rgb_seed1337` dan `yolo26l_derau_seed1337` (18 epoch),
>    `yolo26l_rgbd_seed1337` (**2 epoch**). Lima sisanya tidak ada sama sekali.
>
> Konsekuensinya **sisa pekerjaan 9 run, bukan 5**, dan perkiraan "~1 jam"
> meleset sekitar dua kali lipat. Yang paling penting: `yolo26l` seed 1337
> **tidak** lengkap, padahal justru yolo26l yang menopang klaim titik balik
> kapasitas 21,9–26,3 jt parameter. Perlakukan seluruh matriks yolo26l sebagai
> belum dijalankan.

**1. Penjadwalan run — SUDAH DIPERBAIKI 1 Agustus.** Pustaka
`experiments/code/shell/jadwal.sh` menutup ketiga bug di bawah; jalankan
`bash shell/jadwal.sh` untuk memverifikasi (empat pemeriksaan mandiri, semuanya
lulus saat ditulis). Driver lama BELUM dialihkan memakainya — itu pekerjaan
berikutnya, dan sebaiknya dilakukan sebelum antrean besar berikutnya dijalankan.
Ketiga bug yang ditutup, masing-masing menghabiskan waktu nyata:

- *Peluncuran ganda.* Penjaga "lewati bila berkas hasil sudah ada" tidak
  melindungi apa pun selama pekerjaan berjalan, karena hasil baru ditulis di
  akhir. Driver meluncurkan salinan kedua `awal_seed2024` 20 menit setelah yang
  pertama mulai. Perbaikan: `flock` pada berkas penanda saat MULAI.
- *Pekerja yatim.* Membunuh induk tidak membunuh 12 pekerja
  `ProcessPoolExecutor`-nya; mereka terus berjalan dengan ppid 1. Bunuh per grup
  proses, bukan per pid.
- *Ambang VRAM berbasis peluncuran.* Run tumbuh 2,35 → 4,04 GB; ambang yang
  mengukur pemakaian saat peluncuran menyebabkan dua OOM. Ambang 5500 MiB
  (puncak + margin) terbukti benar sepanjang 15 run.

**2. Oversubscription CPU pada evaluasi.** `eval_e022_paired.py` memakai
`min(32, cpu_count // 4)` = 12 proses. Menjalankan 8 kontras serentak berarti 96
pekerja pada 48 core dan justru MEMPERLAMBAT. Pembagian //4 masuk akal saat
latihan GPU berbagi mesin; setelah latihan selesai ia hanya menyisakan kapasitas.
Yang benar: satu penjadwal yang tahu total core, bukan tiap kontras memutuskan
sendiri.

**3. `mid` pada kapasitas lebih besar.** E-032 menempatkan fusi menengah sebagai
INDIKASI (3/3 seed positif, rerata +0,0139, semua CI memuat nol) pada yolo26n.
E-030 menunjukkan isi kanal ke-4 baru penting pada kapasitas besar. Uji `mid`
pada yolo26m/l adalah satu-satunya arah yang punya dasar dari dua entri sekaligus
— tetapi hanya kalau ada alasan lain untuk melanjutkan jalur depth.

**4. Backlog Blok 3 — sudah dipilah menurut biaya, bukan lagi satu blok.**
Diperiksa 1 Agustus; keempat ide pertama TIDAK dapat diselesaikan sebagai
perubahan kode, masing-masing adalah eksperimen tersendiri.

| Ide | Butuh latihan? | Perkiraan biaya | Catatan |
|---|---|---|---|
| **I-17** kalibrasi ambang per strata | **tidak** | ~20 menit | **Mulai dari sini.** Bekerja pada bobot yang sudah ada; hanya perlu pemilihan ambang pada split val lalu diuji di test. Satu-satunya yang memberi hasil tanpa GPU berjam-jam |
| I-13 loss berimbang / focal | ya, 3 seed x 150 epoch | ~4 jam | Ketimpangan nyata: B3 51,6% vs B1 9,7% |
| I-22 loss ordinal | ya, 3 seed | ~4 jam | Probe dihentikan di E-014; perlu dirancang ulang |
| I-15 neck BiFPN | ya, + arsitektur baru | ~5 jam | Menyasar B4 (objek kecil) |
| I-19 depth metrik | — | terblokir | Butuh Metric3D/ZoeDepth yang belum ada. Hanya relevan bila klaim jarak dilaporkan; DA3 saat ini menghasilkan depth RELATIF (`is_metric` kosong) |

**Tiga seed adalah syarat, bukan kemewahan.** E-032 mengukur rentang antar-seed
0,0354 pada lengan `awal` — lebih besar daripada SELURUH selisih antar-lengan
yang terukur. E-031 mengukur rentang antar-split 0,0488. Menjalankan I-13, I-15,
atau I-22 dengan satu seed akan menghasilkan angka yang tidak dapat ditafsirkan,
dan itu persis kesalahan yang menjatuhkan E-022. Perkiraan biaya di atas sudah
memasukkan 3 seed; memangkasnya berarti membuang seluruh runnya.

Protokol literatur Blok 5 juga masih terbuka.

## Mulai dari nol setelah jeda — apa yang hilang dan urutan membangunnya

Sesi 31 Juli–1 Agustus berjalan di workspace sementara. **12,1 GB state berada di
luar git dan akan hilang** bila workspace direset; yang tersisa hanyalah 968
berkas ter-track. Daftar ini menjawab "apa yang harus dibangun ulang, dalam
urutan apa" supaya tidak ditemukan ulang satu per satu.

Ukuran di bawah adalah hasil `du -sh` sebenarnya, diukur 1 Agustus sesaat sebelum
pod di-terminate — bukan taksiran. Angka taksiran sebelumnya meleset pada tiga
baris (`runs_e022` 2,5 → 4,0 GB, `runs_e023` 1,1 → 0,3 GB, `.venv` 1,2 → 2,8 GB);
jumlah berkas ter-track juga dikoreksi 770 → 968 (`git ls-files | wc -l`).

| Hilang | Ukuran | Cara mendapatkan kembali |
|---|---:|---|
| `/workspace/SawitMVC/data` | 2,3 GB | HuggingFace `ULM-DS-Lab/SawitMVC` |
| `/workspace/SawitMVC-Depth/data` | 2,6 GB | HuggingFace `ULM-DS-Lab/SawitMVC-Depth` (**private**, butuh token baru) |
| `experiments/results/depth_png/` | 211 MB | `build/reproject_depth.py`, ~10 menit |
| `runs/detect/runs_e022/` (**35 checkpoint**) | 4,0 GB | latih ulang; tidak ada jalan pintas |
| `runs/detect/runs_e023/` (**15 checkpoint**) | 315 MB | `shell/e023_fusi.sh` + `shell/e023_seed2024.sh`; ~4 jam pada satu A4500. Kurva latihan, `args.yaml`, dan SHA-256 tiap `best.pt` SUDAH diarsipkan di `experiments/results/E-023/` — cukup untuk memverifikasi apakah hasil latih-ulang menghasilkan checkpoint yang sama |
| `experiments/code/.venv` | 2,8 GB | `python -m venv --system-site-packages` |

### Urutan, beserta jebakan yang sudah terverifikasi

**1. Dataset — layout wajib `data/`.** Unduhan HuggingFace mendarat dengan
`images/`, `labels/`, `json/` di **akar**, sedangkan seluruh skrip dan split
mengharapkan `<root>/data/…`. Pindahkan. Untuk SawitMVC-Depth, `MERGE_MAP.csv`
dan `MERGE_VERIFICATION.json` juga harus ada **di dalam** `data/`
(`build/make_splits_depth.py` membacanya dari sana) — sambungkan dengan symlink.
Verifikasi integritas sebelum dipakai: 6.336 artefak ber-SHA256 terhadap
`manifests/`.

**2. venv — pin opencv di `requirements.txt` tidak dapat dipasang apa adanya.**
Tertulis `opencv-python-headless==4.11.0`; versi itu tidak ada di PyPI (opencv
memakai versi 4 bagian) dan varian *headless* tidak mengekspor `cv2.imshow` yang
disentuh ultralytics saat impor. Pakai **`opencv-python==4.11.0.86`**. Pasang
juga `numpy==1.26.4` **setelah** ultralytics, karena ultralytics menariknya ke
numpy 2.x. torch diwarisi dari image sistem, jangan dipasang lewat pip.

**3. depth_png — rentang metrik dibekukan.** Jalankan
`build/reproject_depth.py --z-near 0.8 --z-far 15.0`, **bukan** nilai bawaan.
Pemeriksaan bahwa hasilnya benar: cakupan piksel valid rata-rata harus
**0,710** (nilai beku di `depth_meta.json` 0,71032). Jangan memakai
`pipeline/prepare_depth.py` untuk dataset ini.

**4. Split — sudah di git, tetapi path-nya absolut.** `splits_depth/seed{42,1,2}`
dan `splits_rgb/sawitmvc` memuat path absolut ke `/workspace/…`, baik di
`*.txt` maupun di `path:` tiap `data_*.yaml`. Bila repo di-clone ke lokasi lain,
keduanya harus disesuaikan. Path pada `data_*.yaml` **wajib absolut** —
ultralytics me-resolve entri relatif terhadap `DATASETS_DIR`, bukan terhadap
lokasi yaml.

**5. Checkpoint — tidak ada jalan pintas.** 35 bobot tidak diarsipkan (kebijakan
repo). Yang tersedia sebagai gantinya: `metrics_lengkap.json` memuat **SHA-256
dan ukuran byte** tiap `best.pt`. Setelah latih ulang, bandingkan hash-nya —
kalau angkanya berbeda, hash membedakan "checkpoint memang lain" dari "resep
tidak tereproduksi".

**6. Kredensial.** Token HuggingFace dan GitHub yang dipakai sesi ini sudah
seharusnya dicabut; siapkan yang baru.

### Yang TIDAK perlu dibangun ulang

Seluruh hasil sudah terarsip dan aman di git: 21 JSON berpasangan E-022,
`metrics_lengkap.json` (25 run, mAP50/mAP50-95/AP per kelas/P/R/F1/provenans),
hasil E-024/E-026/E-028, split, dan semua entri E-025 sampai E-031. **Membaca
kesimpulan tidak menuntut satu pun run diulang** — yang menuntut latih ulang
hanyalah melanjutkan ke E-023.


===== experiments/SR/README.md =====

# Solution Report (SR) — Indeks

Satu berkas SR untuk satu **ide solusi**. Tiap SR menjawab rantai yang sama:

```
1. Masalah      apa yang ingin diselesaikan, dan kenapa itu masalah
2. Ide          gagasan solusinya, berikut rujukan korpus yang mendasarinya
3. Solusi       apa yang benar-benar dibangun/dijalankan (skrip, konfigurasi)
4. Hasil        angka apa adanya, termasuk yang tidak menyenangkan
5. Putusan      DIKONFIRMASI / DIPALSUKAN / TIDAK KONKLUSIF, plus alasan
6. Reproduksi   perintah persis untuk mengulang
```

`experiments/EKSPERIMEN.md` adalah **log kronologis** semua eksperimen (E-NNN); berkas
SR di sini adalah **pandangan per-ide** yang merangkum satu atau beberapa E-NNN
menjadi satu cerita utuh dari masalah sampai putusan.

Kode ada di `/workspace/experiments/` (di luar repo).

## Daftar

| SR | Ide | Eksperimen | Putusan |
|---|---|---|---|
| [SR-001](SR-001-ambiguitas-kematangan.md) | Ukur plafon ambiguitas B2/B3 dari `class_mismatch` | E-001 | **DIPALSUKAN** |
| [SR-002](SR-002-resolusi-master-mentah.md) | Pakai master mentah 3024×4032 untuk B4 | E-002, E-015 | **TERBLOKIR → DIBUKA** (E-015) |
| [SR-003](SR-003-da3-video-orbit.md) | DA3 multi-view pada video orbit | E-003, E-004 | **DIKONFIRMASI** |
| [SR-004](SR-004-da3-empat-sisi.md) | DA3 multi-view pada 4/8 sisi foto | E-005 | **DIKONFIRMASI** |
| [SR-005](SR-005-sinyal-depth-tandan.md) | Kedalaman sebagai pemisah tandan (piksel) | E-006 | **DIPALSUKAN** |
| [SR-006](SR-006-penautan-geometris.md) | Penautan tandan lintas-sisi secara geometris | E-007 | **DIPALSUKAN** |
| [SR-007](SR-007-diagnosis-b4.md) | Diagnosis penyebab kegagalan B4 | E-009, E-010 | **DIKONFIRMASI** (kontras) / **DIPALSUKAN** (kepadatan) |
| [SR-008](SR-008-kanal-tekstur.md) | Kanal tekstur sebagai modalitas keempat | E-011 | **DIKONFIRMASI** (tekstur) / **DIPALSUKAN** (penajam kontras) |
| [SR-009](SR-009-ordinalitas-kelas.md) | Kematangan itu kontinu, bukan empat kotak | E-012 | **DIKONFIRMASI** |
| [SR-010](SR-010-hambatan-klasifikasi.md) | Hambatan mAP ada di klasifikasi kematangan, bukan deteksi | E-014 | **DIKONFIRMASI** |
| [SR-011](SR-011-plafon-kematangan.md) | Plafon kematangan ~68% | E-016 | **DITARIK** (bukti cacat, lihat E-018) |
| [SR-012](SR-012-dua-tahap.md) | Detektor dua tahap (deteksi agnostik + kepala kematangan) | E-017 | **DIPALSUKAN** |
| [SR-013](SR-013-rtdetr-nms-free.md) | RT-DETR-L (NMS-free): detektor 4-kelas terbaik | E-020 | **DIKONFIRMASI** (arah; target belum) |
| [SR-014](SR-014-rfdetr-dinov2.md) | RF-DETR-L (DINOv2) melampaui RT-DETR pada setelan identik | E-021 | **DIKONFIRMASI** (sasaran mAP50 terlewati) |
| [SR-015](SR-015-depth-sensor-4kanal.md) | Depth SENSOR 4-kanal simultan (dataset SawitMVC-Depth) | E-022, E-025, E-027, E-029, E-030, E-031, E-032 | Klaim manfaat fisik **belum terbukti**; fusi awal tidak bereplikasi, sedangkan matriks E-032 **tidak konklusif** dalam rezim diuji; klausa kapasitas dicabut |
| [SR-016](SR-016-konsistensi-lintas-sisi.md) | Konsistensi prediksi lintas-sisi sebagai ukuran ambiguitas | E-024, E-026, E-028 | Ukuran ambiguitas dikonfirmasi; E-026 **tidak konklusif** karena denominator identitas RGB/RGB-D berbeda |
| [SR-017](SR-017-sintesis-deep-research.md) | Sintesis deep research: K1 frekuensi, K2 ordinal, K3 lintas-sisi ([seri F](../SERI-F.md)) | F-001…F-009 | **K1 LOLOS** gerbang (F-002 +0,0731 pada B4); **K3 DIPALSUKAN** (F-003 0,2794 < 0,30, dibatalkan); K2 menunggu F-005 |

## Apa yang sudah kita pelajari — cerita singkatnya

Enam belas SR diuji; lima dipalsukan, satu ditarik, satu klausa dicabut, dan
justru itu yang mempersempit arah. Rantai temuannya:

1. **Bottleneck ada di detektor, bukan penghitung.** E-007 mereproduksi Tabel 4
   DiB persis, dan menunjukkan koreksi sederhana `k = 1,8905` sudah mencapai
   95,57% bila diberi deteksi sempurna. Ruang perbaikan di tahap counting tipis.
2. **Geometri DA3 bekerja — tetapi bukan di tempat yang kita butuhkan.** DA3
   memulihkan pose 4/8 sisi dengan benar pada 50/50 pohon (SR-004) dan orbit
   video pada 5/6 video (SR-003). Namun kedalaman **tidak** memisahkan tandan
   di tingkat piksel (SR-005), dan penautan geometris **kalah** dari koreksi
   statistik (SR-006).
3. **B4 gagal karena tersamar, bukan bertumpuk.** Kontrasnya di bawah kotak
   acak, kedalamannya tidak membedakan, dan ia justru paling renggang dari
   semua kelas (SR-007). Motivasi asli jalur kedalaman — "tandan bertumpuk" —
   ternyata salah.
4. **Satu-satunya sinyal tersisa untuk B4 adalah tekstur.** Kanal Laplacian
   membalik peringkat: B4 dari kelas paling tidak terpisah menjadi paling
   terpisah (SR-008). Penajam kontras (CLAHE, unsharp) justru gagal.
5. **B2 gagal karena sebab yang sama sekali berbeda.** Kematangan itu variabel
   kontinu yang dipotong empat; kebingungan hanya terjadi antar kelas
   bersebelahan (SR-009). Metrik DiB sudah mengakui ini lewat `Class ±1 Acc`,
   tetapi pelatihan detektornya belum.

Kesimpulan operasionalnya: **B4 butuh keterlihatan (tekstur), B2 butuh
diskriminasi ordinal.** Menggabungkan keduanya sebagai "kelas sulit" akan
menyesatkan arah kerja.

### Lanjutan cerita (SR-010 → SR-014)

6. **Kerugian mAP ada di klasifikasi, bukan deteksi.** Bobot yang sama
   dievaluasi dua kali: 4-kelas 0,5218 vs kelas-agnostik 0,7191 mAP50 — 38% yang
   mungkin diraih hilang di penilaian kematangan (SR-010). Ini menutup dasar
   seluruh antrean ide berbasis deteksi (ubin, fusi, kanal keempat, neck).
7. **SR-002 dibuka.** Master mentah 3024×4032 dipetakan lewat isi (3.992/3.992,
   nol ambigu) — resolusi penuh kini tersedia tanpa anotasi ulang (SR-002/E-015).
8. **Detektor dua tahap dipalsukan, tetapi tahap 1-nya rekor.** Deteksi agnostik
   pada 960 mencapai 0,7730/0,3320 — mAP50-95 di atas sasaran 0,30 — namun
   rakitan dua-tahap penuh (0,4787) lebih buruk dari baseline: head YOLO
   kehilangan konteks & kalibrasi bersama (SR-012).
9. **Klaim "plafon kematangan" ditarik.** Buktinya cacat (dua pengukuran tak
   bebas, satu dilumpuhkan augmentasi `hsv_s=0.7`); SR-011 ditarik lewat E-018.
   Plafon **geometris** anotasi justru menampung sasaran: dengan kelas sempurna,
   kotak yang ada memungkinkan mAP50 0,8834 / mAP50-95 0,4702 (E-018).

10. **Arsitektur NMS-free menang, dan bukan karena kapasitas.** RF-DETR-L
    (DINOv2) melampaui RT-DETR-L pada kedua metrik di kedua split, dan
    **test mAP50 0,6038 melewati sasaran 0,60** (SR-014). Baseline YOLO
    param-adil YOLO26l (26,3 juta, konfigurasi identik) tetap di bawah kedua
    DETR, sehingga penjelasan "sekadar kapasitas/resolusi" tertutup. Seluruh
    perbandingan kini satu protokol pycocotools.

Arah aktif pada titik ini: **mAP50 sudah terlewati; yang tersisa mAP50-95 0,30**
(kurang 0,023). Catatan penerapan: RF-DETR paling akurat tetapi paling lambat
(8,5 FPS di L4).

### Babak ketiga (SR-015, SR-016) — depth sensor fisik, dan penutupannya

11. **Depth SENSOR diuji, dan tidak membeli apa pun.** Sampai E-021 satu-satunya
    "depth" yang pernah diuji adalah pseudo-depth monokular. Dataset
    SawitMVC-Depth menutup lubang itu — dan jawabannya negatif di seluruh
    kontras. Fusi awal **merugikan** pada YOLO26n (rerata −0,0230, dua dari tiga
    seed signifikan negatif), dan klausa penyelamat "depth terpakai pada
    kapasitas tinggi" **dicabut** setelah diuji multi-seed pada RT-DETR-L
    (SR-015, E-027/E-029).
12. **Registrasi bukan penyebabnya.** Label sidecar `alignedTo: "color"` terbukti
    menyesatkan dan diperbaiki lewat reproyeksi penuh, divalidasi tiga cara
    (geometri, pita kosong, *mutual information* +0,0306 bit). Jadi hasil negatif
    di atas **bukan** artefak depth yang salah tempat — jebakan D3Net (entri 037)
    sudah dihindari sebelum klaim dibuat.
13. **Titik fusi juga bukan penyebabnya.** 15 run dari nol menguji fusi awal,
    menengah (P2/4), dan akhir (P3/P4/P5) sejajar: **12 dari 12 CI memuat nol**.
    Fusi akhir menambah parameter terbanyak dan tetap nol perbaikan. "Titik fusi
    salah" **dicoret** sebagai kandidat penyebab (SR-015 §7b, E-032). `mid`
    konsisten positif 3/3 seed (+0,0139) tetapi berstatus **indikasi**, bukan
    temuan.
14. **Yang bertahan dari babak ini adalah instrumennya, bukan depth-nya.** Tiga
    hal berumur panjang: protokol evaluasi tunggal (`hasil.json` dilarang untuk
    perbandingan antar lengan, E-025), varians split terukur **0,0488** —
    melebihi varians seed dan hampir 5× ambang keberhasilan yang dipakai
    (E-031), dan ukuran ambiguitas bebas-label yang mengonfirmasi **B2↔B3
    sebagai pasangan dominan** pada 511 tandan tanpa memakai label kematangan
    sebagai kebenaran (SR-016, E-028).

Kesimpulan babak ini: jalur depth **ditutup untuk konfigurasi yang diuji**, dan
yang tersisa sebagai kandidat penyebab hanya kualitas depth itu sendiri, ukuran
data (980 citra latih), dan kapasitas. Melanjutkannya adalah keputusan strategis,
bukan langkah teknis berikutnya yang otomatis.

Jalur non-depth yang belum tersentuh dan berdiri lebih kuat: piksel master
3024×4032 (imgsz 1600–2048) untuk menyerang lokalisasi, kapasitas di atas
RF-DETR, dan loss ordinal untuk B2↔B3.

## Ide yang belum dikerjakan

| Ide | Isi | Status |
|---|---|---|
| I-5 | Fusi middle/late dua cabang | belum |
| I-8 | Gerbang mutu depth + fallback RGB | belum (relevan saat data Gemini ada) |
| I-10 | Kaskade deteksi-lalu-proyeksi | belum |
| I-13 | Loss berimbang kelas / focal | belum |
| I-15 | Neck multiskala (BiFPN) | belum |
| I-22 | Loss ordinal / kepala regresi kematangan | belum (probe dihentikan di E-014) |
| — | yolo26x kapasitas 3× · 1280 · aman-warna | dihentikan demi RT-DETR; kandidat lanjutan |
| — | Latih pada piksel master (imgsz 1600–2048) | dataset siap (`experiments/code/build/build_master_ds.py`), belum |

Catatan status: I-4 (RGBD) dihentikan pada epoch 25 (mAP50 0,5135, datar);
I-21 (RGBT) dan probe ordinal dihentikan saat E-014 mengalihkan fokus ke
dekomposisi deteksi/klasifikasi.

## Ide tambahan dari `literature/references/deep-research-report.md`

Laporan itu memuat matriks 24 ide dan menempatkan **perombakan inti detektor**
sebagai prioritas pertama — kesimpulan yang **sejalan dengan temuan eksperimen
kita sendiri**: SR-005 memalsukan depth sebagai pemisah tandan, dan E-007
menunjukkan tahap counting sudah mendekati plafonnya (koreksi k mencapai 95,57%
dengan deteksi sempurna). Karena itu sisa perbaikan harus datang dari detektor.

Ide berikut diambil dari laporan tersebut, diprioritaskan menurut kecocokannya
dengan mode kegagalan yang **sudah terukur** pada dataset ini (B4 AP50 0,354;
B4 kotak terkecil; B1 hanya 9,7% dari data).

| Ide | Isi | Kenapa relevan di sini |
|---|---|---|
| **I-12** | **Pelatihan berbasis ubin (tiling) resolusi tinggi** — potong citra jadi ubin dan latih pada skala asli, bukan memperkecil seluruh citra ke 640 | Menyerang B4 langsung: pada `imgsz=640` dari sumber 960×1280, tandan B4 tinggal segelintir piksel. **Bukan tuning** — ini regime pelatihan berbeda, dan tidak memerlukan pemetaan dataset mentah yang terblokir di SR-002 |
| **I-13** | **Loss berimbang kelas / focal** | Ketimpangan nyata: B3 51,6% vs B1 9,7%. Murah dan langsung menyasar kelas minor |
| **I-14** | **Detektor NMS-free end-to-end (RT-DETR)** sebagai pembanding | Laporan menempatkan ini prioritas 1: NMS sering jadi plafon struktural pada objek rapat/bertumpuk — persis kondisi tandan di mahkota |
| **I-15** | **Neck multiskala lebih kuat (BiFPN / Gather-and-Distribute)** | Menyasar kegagalan objek kecil, yaitu B4 |
| **I-16** | **Copy-paste / augmentasi tandan sintetis** | Memperkaya kasus ekor (B1, oklusi berat) tanpa anotasi baru |
| **I-17** | **Kalibrasi ambang per strata** (ukuran/iluminasi) | Sering memberi perbaikan deployment nyata tanpa melatih ulang |
| **I-18** | **Kepala multi-tugas** (deteksi + kematangan terpisah) | Memisahkan kegagalan geometris (A) dari fotometrik (B) di dalam arsitektur |
| **I-19** | **Kalibrasi depth metrik** (Metric3D entri 177 / ZoeDepth) | Hanya relevan bila klaim geometris/jarak dilaporkan; DA3 saat ini menghasilkan depth **relatif** (`is_metric` kosong) |

Catatan penting untuk I-14: **baseline DiB sudah memakai YOLO26**, yang menurut
rancangannya sudah end-to-end tanpa NMS. Jadi sebagian argumen "ganti ke
NMS-free" mungkin sudah terpenuhi — perlu diverifikasi sebelum ide ini
dijalankan, agar tidak mengulang sesuatu yang sudah ada.


===== experiments/code/README.md =====

# Kode reproduksi eksperimen

Folder ini hanya menyimpan kode dan konfigurasi. Bukti yang dihasilkan atau
diaudit berada di [`results/`](results/).
Pemisahan ini membuat pembaca dapat membuka hasil tanpa perlu menelusuri skrip.

| Saya ingin | Buka |
|---|---|
| Melatih model | [`train/`](train/) dan [`config/`](config/) |
| Mengevaluasi checkpoint | [`eval/`](eval/) |
| Menyiapkan data turunan | [`build/`](build/) |
| Memeriksa diagnosis | [`analysis/`](analysis/) |
| Menemukan JSON, kurva, dan split | [bukti eksperimen](results/) |
| Mengulang E-021 | [`REPRODUCE.md`](REPRODUCE.md) dan [`CATATAN-TEKNIS-E021.md`](CATATAN-TEKNIS-E021.md) |

Metrik final yang boleh dikutip ada di
[`../METRICS.md`](../METRICS.md). Untuk
E-022, baca [audit](../AUDIT-E022.md) sebelum membuka
[arsip seed-42](../archive/E022-seed42-awal.md).

## Isi

| Lokasi | Fungsi |
|---|---|
| `train/` | Skrip pelatihan |
| `eval/` | Skrip pengukuran dan diagnosis metrik |
| `build/` | Penyiapan dataset turunan |
| `analysis/` | Uji hipotesis dan diagnosis |
| `shell/` | Orkestrasi antrean historis |
| `config/` | Konfigurasi dataset Ultralytics |
| [`PETA-SKRIP.md`](PETA-SKRIP.md) | Hubungan skrip, eksperimen, dan keluaran |

Untuk pipeline lapangan, gunakan
[`../pipeline/`](../pipeline/) dan bukan kode eksperimen ini.

```bash
pip install -r experiments/code/requirements.txt
python experiments/code/eval/eval_all_pycoco.py
```

Skrip utama memakai lokasi repo untuk membaca `experiments/results/`. Dataset
SawitMVC publik dan master mentah tetap perlu disediakan sesuai catatan di
[`REPRODUCE.md`](REPRODUCE.md).


===== experiments/code/REPRODUCE.md =====

# REPRODUCE — cara mereproduksi setiap angka

Panduan untuk mereproduksi hasil di `experiments/METRICS.md` / `experiments/SR`. Jawaban jujur
atas "bisakah direproduksi dari info yang ada": **ya untuk eksperimen detektor**
(E-009…E-021, termasuk RF-DETR/RT-DETR/YOLO26l), dengan catatan di §4; **ya untuk
jalur DA3** (E-003…E-007) bila DA3 dipasang.

## 1. Lingkungan (versi persis)

| Paket | Versi | Sumber |
|---|---|---|
| Python | 3.12 | — |
| torch | 2.8.0+cu128 | image sistem |
| torchvision | 0.23.0+cu128 | image sistem |
| ultralytics | **8.4.103** | pip (`requirements.txt`) |
| numpy | 1.26.4 | pip |
| opencv | 4.11.0 | pip |
| pycocotools | **2.0.11** | pip |
| **rfdetr** (E-021) | **1.8.3** | pip |
| supervision (E-021) | 0.29.1 | pip |
| ultralytics-thop / matplotlib (E-021) | 2.0.20 / — | pip |
| GPU / CUDA | NVIDIA L4 / 12.8 | — |

`pip install -r experiments/code/requirements.txt`. Versi ultralytics **penting** (nama kolom
`results.csv` & API `.val()` bisa berubah). Versi **rfdetr penting**: default
library-nya (lr, ema, warmup, dll) menentukan training RF-DETR — konfigurasi
efektif lengkap juga terekam di `results/runs/rfdetr_l_e60_i1280/training_config.json`.

## 2. Data (tidak diarsipkan — publik)

| Dataset | Lokasi diharapkan | Sumber |
|---|---|---|
| SawitMVC (960×1280, anotasi) | `/workspace/SawitMVC/data/` | HuggingFace `ULM-DS-Lab/SawitMVC`, CC BY-NC 4.0 (`download.py`) |
| Sawit master (3024×4032) | `/workspace/Sawit/data/` | `download.py` di folder itu |

**Split** ada di repo (`results/splits_rgb/*.txt`) dan **memakai path absolut**
`/workspace/SawitMVC/data/images/...`. Di lingkungan baru, taruh data di path
sama, atau `sed -i 's#/workspace/SawitMVC#/path/baru#' experiments/splits/rgb/*.txt`. Split
per pohon 716/96/141 dengan **irisan nol** — jangan diacak ulang.

## 3. Peta skrip → SR → keluaran

| Skrip | Eksperimen | SR | Keluaran |
|---|---|---|---|
| `analysis/class_mismatch_stats.py` | E-001 | SR-001 | `results/E-001/class_mismatch.json` |
| `analysis/da3_video_test.py`, `analysis/da3_video_multi.py` | E-003, E-004 | SR-003 | `results/E-003*, results/E-004` |
| `analysis/da3_sides_test.py` | E-005 | SR-004 | `results/E-005` |
| `analysis/depth_bunch_signal.py` | E-006 | SR-005 | `results/E-006` |
| `analysis/geometric_linking.py` | E-007 | SR-006 | `results/E-007` |
| `analysis/box_size_analysis.py` | E-009 | SR-007 | `results/E-009` |
| `analysis/why_b4_fails.py` | E-010 | SR-007 | `results/E-010` |
| `analysis/contrast_boost_test.py` | E-011 | SR-008 | `results/E-011` |
| `analysis/class_separability.py` | E-012 | SR-009 | `results/E-012` |
| `eval/diag_bottleneck.py` | E-014 | SR-010 | `results/E-014/diag_bottleneck.json` |
| `build/match_raw.py` | E-015 | SR-002 | `results/E-015/raw_map.json` |
| `analysis/head_vs_crop.py`, `analysis/multiview_vote.py`, `eval/metric_variants.py` | E-016 | SR-011 (ditarik) | `results/E-016/head_vs_crop.json` dll |
| `train/train_agnostic.py`, `train/train_maturity_v2.py`, `analysis/two_stage.py` | E-017 | SR-012 | `results/two_stage_val_*.json` |
| `analysis/loc_ceiling.py` | E-018 | — | `results/E-018/loc_ceiling.json` |
| `train/train_4cls_hi.py` | E-019 | — | `results/runs/c4_e50_i1280_warna/` |
| `train/train_rtdetr.py`, `eval/eval_rtdetr.py` | E-020 | SR-013 | `results/runs/rtdetr_l_e60_i1280/`, `results/E-020/rtdetr_eval.json` |
| `build/build_rfdetr_ds.py`, `train/train_rfdetr.py` | E-021 | — | `results/runs/rfdetr_l_e60_i1280/` (evaluation.json, metrics.csv, **training_config.json**) |
| `train/train_yolo26l.py` | E-021 | — | `results/runs/yolo26l_e60_i1280/`, `results/E-021/yolo26l_eval.json` |
| `eval/eval_perkelas.py`, `eval/eval_rfdetr_perkelas.py` | E-021 | — | `results/E-021/perkelas_fair.json` |
| `eval/eval_all_pycoco.py` | E-021 | — | `results/E-021/perkelas_pycoco.json` (1-protokol) |
| `eval/eval_all_metrics.py` | E-021 | — | `results/E-021/metrics_full.json` (COCO 12-stat + P/R/F1) |
| `eval/eval_extras.py` | E-021 | — | `results/{confusion,bootstrap_ci,pr_curves}.json`, `figures/*.png` |
| `eval/eval_efficiency.py` | E-021 | — | `results/E-021/efficiency.json` |
| `train/train_fusion.py` | I-4 (RGBD) | — | `results/runs/rgbd_e60_i640_s42/` |
| `eval/eval_missing.py` | — | — | `results/lintas-eksperimen/eval_missing.json` (per-kelas RGBD & c4) |

Konfigurasi persis tiap run pelatihan ada di `results/runs/<run>/args.yaml` (ultralytics)
atau `results/runs/<run>/training_config.json` (RF-DETR); kurva per-epoch di
`results/runs/<run>/results.csv` / `metrics.csv`; keluaran konsol di `logs/`. Urutan E-021:
`build/build_rfdetr_ds.py` → `train/train_rfdetr.py` → `train/train_yolo26l.py` → `eval/eval_all_pycoco.py`
→ `eval/eval_all_metrics.py` → `eval/eval_extras.py` → `eval/eval_efficiency.py`. Ringkasan jebakan
teknis di [`CATATAN-TEKNIS-E021.md`](CATATAN-TEKNIS-E021.md).

## 4. Yang TIDAK akan bit-per-bit sama (jujur)

1. **Non-determinisme GPU.** Meski `seed=42`, operasi CUDA (cuDNN, atomics)
   tidak deterministik penuh. Angka akan **sangat dekat** (±0,005 mAP), bukan
   identik. `experiments/METRICS.md` adalah angka run yang sebenarnya terjadi.
2. **Bobot terlatih tidak diarsipkan** (best 53–264 MB/run). Harus dilatih ulang
   dari skrip, atau — untuk **RF-DETR-L (model terbaik, E-021)** — diarsipkan ke
   penyimpanan objek dulu (belum dilakukan; lihat `experiments/STATUS.md` §1). Bobot
   E-021: RF-DETR `checkpoint_best_ema.pth` (142 MB), RT-DETR `best.pt` (264 MB),
   YOLO26l `best.pt` (53 MB).
3. **Dataset turunan** (crops, master_ds, depth_da3, tiles) dibuat ulang dari
   skrip build (`build/build_crops_raw.py`, `build/build_master_ds.py`, `build/gen_depth_dataset.py`).
4. **Jalur DA3 (E-003…E-007)** butuh Depth Anything 3 dipasang terpisah
   (`requirements.txt`). Tanpa DA3, SR-003…SR-006 tak bisa direproduksi; tetapi
   angka + kesimpulannya terekam di SR-nya.

## 5. Untuk sekadar MELAPORKAN (bukan menjalankan ulang)

Cukup dari repo, tanpa GPU/data:
- **Angka:** `experiments/METRICS.md` (per-kelas B1–B4, val+test, semua run; tabel
  1-protokol + metrik penuh + efisiensi + bootstrap + confusion E-021) +
  `results/*.json` (mentah: `metrics_full`, `perkelas_pycoco`, `bootstrap_ci`,
  `confusion`, `efficiency`, `pr_curves`).
- **Narasi & pembelaan tiap klaim:** `experiments/SR` + `experiments/EKSPERIMEN.md` (log
  kronologis E-001…E-021).
- **Figur:** `figures/*.png` (confusion, PR, F1-confidence — E-021).
- **Kurva pelatihan:** `results/runs/<run>/results.csv` / `metrics.csv`.
- **Konfigurasi:** `results/runs/<run>/args.yaml` (ultralytics) atau `training_config.json`
  (RF-DETR — seluruh hyperparameter efektif).

Semua klaim numerik dapat dilacak ke JSON/CSV sumbernya — itu memang prinsip repo.


===== experiments/code/CATATAN-TEKNIS-E021.md =====

# Catatan Teknis E-021 — RF-DETR / RT-DETR / YOLO26 (2026-07-24/25)

Konsolidasi **semua jebakan teknis, keputusan, dan analisis** dari run E-021 agar
tidak perlu diulang. Log mentah di `logs/` (lihat daftar di bawah). Log konsol
di-bersihkan dari spam progress-bar (carriage-return) tetapi isi bermakna utuh.

## Ringkasan hasil (1-protokol pycocotools)

| Model | Param | imgsz | VAL mAP50/50-95 | TEST mAP50/50-95 |
|---|---|---|---|---|
| YOLO26m | 21,9 jt | 640 | 0,5195 / 0,2411 | 0,5165 / 0,2452 |
| YOLO26l | 26,3 jt | 1280 | 0,5270 / 0,2526 | 0,5300 / 0,2568 |
| RT-DETR-L | 33,0 jt | 1280 | 0,5459 / 0,2555 | 0,5784 / 0,2707 |
| **RF-DETR-L** | 35,7 jt | 1280 | **0,5695 / 0,2604** | **0,6038 / 0,2770** |

Ranking = urutan parameter di semua metrik & split. RF-DETR-L test mAP50 0,6038
melewati sasaran 0,60. Sumber: `results/E-021/perkelas_pycoco.json` (per-kelas lengkap
di `experiments/METRICS.md` §1-protokol).

## Jebakan RF-DETR (rfdetr 1.8.3) — WAJIB tahu sebelum run ulang

1. **Resolusi harus kelipatan 32**, BUKAN 56. Constraint = patch_size(16) ×
   num_windows(2) = 32. Jadi 1280 valid (1280/32=40) dan cocok persis dengan
   RT-DETR. (Awalnya diduga 56 → salah; error: "resolution=1288 is not divisible
   by patch_size (16) * num_windows (2) = 32".)

2. **`multi_scale`/`expanded_scales` default melatih di 1440, BUKAN resolusi yang
   diminta.** Default `multi_scale=True`+`expanded_scales=True`, dan karena
   `do_random_resize_via_padding=False`, ia mengunci ke skala TERBESAR =
   resolusi×45/40 = 1440. **Untuk fairness @1280 WAJIB set
   `multi_scale=False, expanded_scales=False`.** Tanpa ini RF-DETR diam-diam dapat
   keunggulan resolusi. Cek log: baris "Using multi-scale training ... scales:
   [1440]" TIDAK boleh muncul.

3. **Tidak ada `.evaluate()` di rfdetr 1.8.3.** Pakai `run_test=True` di `.train()`
   → metrik test masuk `metrics.csv` (kolom `test/*`). Val dicatat tiap epoch
   (`val/mAP_50`, `val/mAP_50_95`, `val/AP/Bx`, plus varian `val/ema_*`).

4. **Per-kelas `val/AP/Bx` di metrics.csv & evaluation.json = AP50-95, BUKAN AP50.**
   Untuk AP50 per-kelas harus COCO-eval terpisah (`eval/eval_rfdetr_perkelas.py`).

5. **Checkpoint: `run_test` memakai `checkpoint_best_total.pth` untuk test**
   (memberi test 0,5837/0,2653), sedangkan checkpoint terbaik-val = EMA
   (`checkpoint_best_ema.pth`). Eval EMA konsisten val↔test memberi test
   0,6038/0,2770. Val pycocotools EMA (0,5695) cocok dengan evaluator internal
   rf-detr (0,5699) → pipeline tervalidasi. **Pakai EMA konsisten.**

6. **Resume:** `RFDETRLarge(..., resume="runs/.../last.ckpt")` (PTL ckpt_path).
   `train/train_rfdetr.py --resume` sudah mendukung.

## Jebakan performa GPU (NVIDIA L4, 23 GB, TDP 72 W)

7. **GPU kelaparan data dengan `num_workers` default 2** → util loncat 5%↔100%
   (rata-rata rendah), ~5 jam untuk 60 epoch. Naikkan ke 8. (128 core tersedia,
   tapi lihat #8.)

8. **JANGAN maksimalkan worker/batch membabi-buta.** batch16 × workers32 →
   **`/dev/shm` (26 GB) penuh → DataLoader worker di-SIGKILL** ("DataLoader worker
   (pid …) is killed by signal: Killed"). RAM host 503 GB tak relevan; batasnya
   shared-memory. **Sweet spot: batch 8 / grad-accum 2 (effective 16) / workers 8**
   → shm ~2-3 GB, GPU util ~67-100%, tanpa crash.

9. **L4 power-limited.** Pada beban penuh: util 100%, **power 70/72 W (~97%)**,
   P-State P0. "100% util tapi 70 W" itu NORMAL — L4 memang GPU hemat daya; 70 W =
   sudah mentok. **~10 mnt/epoch adalah lantai** untuk RF-DETR-L @1280 di L4;
   lebih cepat hanya dengan GPU lebih kuat atau resolusi lebih rendah (merusak
   fairness).

## Keputusan fairness (dijaga ketat)

- **Resolusi 1280 identik** untuk RT-DETR & RF-DETR & YOLO26l (YOLO26m 640 = acuan
  ringan, bukan pembanding sekelas).
- **Split identik** 3000/404/588 (E-017), augmentasi aman-warna (hsv kecil, E-019),
  seed 42, dari bobot COCO. `build/build_rfdetr_ds.py` = adaptor dataset YOLO→RF-DETR via
  symlink (tanpa salin citra).
- **Effective batch 16** untuk RF-DETR; RT-DETR/YOLO26l pakai batch 4 default
  ultralytics (perbedaan batch antar-framework kurang kritis dibanding resolusi).
- **Patience beda tapi adil:** RF-DETR patience 8 (stop ep17), RT-DETR & YOLO26l
  patience 60 (penuh). SEMUA melaporkan checkpoint **terbaik-val** — patience hanya
  soal kapan berhenti melatih, bukan checkpoint mana yang dilaporkan.
- **Baseline YOLO param-adil = YOLO26l** (26,3 jt, config IDENTIK RT-DETR). Tetap
  di bawah kedua DETR → keunggulan DETR **bukan** efek kapasitas/resolusi.
- **Evaluator campur diselesaikan:** semua 4 model dievaluasi ulang lewat
  **1-protokol pycocotools** (`eval/eval_all_pycoco.py`) — perbedaan protokol vs
  ultralytics `.val()` <0,005 (terkonfirmasi silang).

## Peta berkas run ini (di repo)

- **Skrip:** `train/train_rfdetr.py`, `build/build_rfdetr_ds.py`, `train/train_yolo26l.py`,
  `eval/eval_perkelas.py`, `eval/eval_rfdetr_perkelas.py`, `eval/eval_all_pycoco.py`
- **Hasil JSON:** `results/E-021/perkelas_fair.json` (native), `results/E-021/perkelas_pycoco.json`
  (1-protokol), `results/E-021/yolo26l_eval.json`
- **Metadata run:** `runs/rfdetr_l_e60_i1280/{evaluation.json,metrics.csv,training_config.json}`,
  `runs/yolo26l_e60_i1280/{args.yaml,results.csv}` (tanpa bobot — bisa dibuat ulang)
- **Log konsol:** `logs/logs-rfdetr-e60.txt` (training), `logs/logs-rfdetr-smoke.txt`
  (smoke), `logs/logs-rfdetr-install.txt` + `-install2.txt` (instalasi),
  `logs/logs-rfdetr-perkelas.txt` (COCO eval), `logs/logs-yolo26l.txt` (training),
  `logs/logs-pycoco-all.txt` (eval 4-model)
- **Log naratif:** [`experiments/EKSPERIMEN.md`](../EKSPERIMEN.md) E-021,
  [`experiments/METRICS.md`](../METRICS.md), [`experiments/STATUS.md`](../STATUS.md)

Bobot model (.pth/.pt/.ckpt) TIDAK diarsipkan (terlalu besar) — dibuat ulang dari
skrip di atas.


===== experiments/results/README.md =====

# results/ — indeks JSON hasil

Angka mentah di balik [metrik final E-021](../../METRICS.md),
[arsip E-022](../../archive/E022-seed42-awal.md), dan putusan
di [`../../SR/`](../../SR/). Berkas
dikelompokkan per eksperimen; namanya sengaja **tidak diubah** supaya sitasi
lama tetap dapat ditelusuri lewat pencarian nama.

| Folder | Berkas | Eksperimen | Isi | Dikutip di |
|---|---|---|---|---|
| `E-001/` | `class_mismatch.json` | E-001 | Statistik `class_mismatch` — 0 dari 7.328 bunch multi-sisi | SR-001 (**dipalsukan**) |
| `E-003/`, `E-003b/` | `report.json` | E-003 | DA3 pada video orbit | SR-003 |
| `E-004/` | `report_rot.json` | E-004 | DA3 video, uji rotasi | SR-003 |
| `E-005/` | `report_4sides.json`, `report_8sides.json` | E-005 | DA3 pada 4/8 sisi foto | SR-004 |
| `E-006/` | `report_res504.json`, `report_res1008.json` | E-006 | Kedalaman sebagai pemisah tandan, dua resolusi | SR-005 (**dipalsukan**) |
| `E-007/` | `report_test.json`, `sweep.json` | E-007 | Penautan tandan lintas-sisi secara geometris | SR-006 (**dipalsukan**) |
| `E-009/` | `box_sizes.json` | E-009 | Sebaran ukuran kotak per kelas | SR-007 |
| `E-010/` | `why_b4.json` | E-010 | Diagnosis kegagalan B4 — kontras, bukan kepadatan | SR-007 |
| `E-011/` | `contrast_boost.json` | E-011 | Lima peta penajam kontras (CLAHE, unsharp, dll.) | SR-008 |
| `E-012/` | `separability.json` | E-012 | Keterpisahan kelas kematangan | SR-009 |
| `E-014/` | `diag_bottleneck.json` | E-014 | Agnostik vs 4-kelas — lokasi hambatan | SR-010 |
| `E-015/` | `raw_map.json` | E-015 | Pemetaan 3.992 citra raw ↔ MVC berbasis isi, nol ambigu | SR-002 |
| `E-016/` | `head_vs_crop.json`, `multiview_val.json`, `metric_variants.json`, `metric_pm1.json` | E-016 | Kepala kematangan, voting antar-sisi, varian metrik | SR-011 (**ditarik**, lihat E-018) |
| `E-017/` | `two_stage_val_A.json`, `_B`, `_mini_rawtest`, `_smoke` | E-017 | Detektor dua tahap | SR-012 (**dipalsukan**) |
| `E-018/` | `loc_ceiling.json` | E-018 | Plafon lokalisasi mAP50 0,8834 / mAP50-95 0,4702 | EKSPERIMEN E-018 |
| `E-020/` | `rtdetr_eval.json` | E-020 | RT-DETR-L, per-kelas val + test | SR-013 |
| `E-021/` | `perkelas_fair.json` | E-021 | Per-kelas AP50 + AP50-95 semua model | Pelengkap E-021 |
| `E-021/` | `perkelas_pycoco.json` | E-021 | **Tabel 1-protokol** keempat model | [METRICS final](../../METRICS.md) |
| `E-021/` | `metrics_full.json` | E-021 | COCO 12-stat, per-kelas AR, P/R/F1 macro & micro | Pelengkap E-021 |
| `E-021/` | `confusion.json` | E-021 | Confusion matrix test, IoU 0,5, conf ≥ 0,25 | Pelengkap E-021 |
| `E-021/` | `bootstrap_ci.json` | E-021 | Bootstrap 2000x; selisih RF-RT signifikan | Pelengkap E-021 |
| `E-021/` | `pr_curves.json` | E-021 | Kurva PR micro & F1-confidence | Pelengkap E-021 |
| `E-021/` | `efficiency.json` | E-021 | Param, GFLOPs, latensi, FPS di NVIDIA L4 | Pelengkap E-021 |
| `E-021/` | `yolo26l_eval.json` | E-021 | YOLO26l baseline param-adil | [METRICS final](../../METRICS.md) |
| `E-022/` | `mi.json` | E-022a | Mutual information 4 kandidat pemetaan depth→RGB + kontrol pergeseran | [Arsip E-022](../../archive/E022-seed42-awal.md), hasil teknis |
| `E-022/` | `align.json` | E-022a | Uji berbasis kotak anotasi (terbukti terlalu lemah, dicatat apa adanya) | SR-015 §3 |
| `E-022/` | `depth_meta.json` | E-022 | Kontrak kanal depth yang dibekukan (Z_NEAR 0,8 / Z_FAR 15,0, aturan invalid) | SR-015 §3 |
| `E-022/` | `pycoco_yolo26n.json` | E-022b | 1-protokol pycocotools YOLO26n RGB & RGB-D | [Arsip E-022](../../archive/E022-seed42-awal.md) |
| `E-022/` | `paired_yolo26n.json` | E-022b | Selisih berpasangan RGB-D terhadap RGB, CI per-kelas | [Arsip E-022](../../archive/E022-seed42-awal.md) |
| `E-022/` | `paired_rtdetrl.json` | E-022b | Idem, RT-DETR-L | [Arsip E-022](../../archive/E022-seed42-awal.md) |
| `E-022/` | `paired_rfdetrnano.json` | E-022b | Idem, RF-DETR Nano | [Arsip E-022](../../archive/E022-seed42-awal.md) |
| `E-022/` | `paired_derau.json` | E-022b | Kontrol negatif: kanal ke-4 derau terhadap RGB | [Arsip E-022](../../archive/E022-seed42-awal.md) |
| `E-022/` | `paired_yolo26n_depth_vs_derau.json` | E-022b | Isolasi kandungan informasi depth, YOLO26n | [Arsip E-022](../../archive/E022-seed42-awal.md) |
| `E-022/` | `paired_rtdetrl_depth_vs_derau.json` | E-022b | Idem, RT-DETR-L | [Arsip E-022](../../archive/E022-seed42-awal.md) |
| `E-022/` | `paired_rfdetrnano_depth_vs_derau.json` | E-022b | Idem, RF-DETR Nano | [Arsip E-022](../../archive/E022-seed42-awal.md) |
| `E-022/` | `paired_yolo26n_depth_vs_tukar.json` | E-022b | Kontrol registrasi: depth benar terhadap depth pohon lain | [Arsip E-022](../../archive/E022-seed42-awal.md) |
| `E-022/` | `diag_evaluator_gap_{rgb,rgbd}.json` | E-025 | Pelacakan celah evaluator: checkpoint, maxDets, jumlah deteksi | [log](../../EKSPERIMEN.md) §E-025 |
| `E-022/` | `paired_yolo26n_*_seed{42,1337,2024}.json` | E-027 | **Matriks multi-seed 12 perbandingan**, protokol beku pycocotools | [log](../../EKSPERIMEN.md) §E-027 |
| `E-024/` | `konsistensi_{rgb,rgbd}_seed42.json` | E-024, E-026 | Laju inkonsistensi prediksi lintas-sisi, RGB vs RGB-D | [SR-016](../../SR/SR-016-konsistensi-lintas-sisi.md) |
| `E-028/` | `konsistensi_sawitmvc_rgb_seed42.json` | E-028 | Laju inkonsistensi lintas-sisi di SawitMVC, 511 tandan, per kelas | [SR-016](../../SR/SR-016-konsistensi-lintas-sisi.md) |
| `E-022/` | `metrics_lengkap.json` | E-022/G7/G8 | mAP50, mAP50-95, AP per kelas ×2 ambang, P/R/F1, SHA-256 tiap checkpoint | [METRIK-LENGKAP](../../METRIK-LENGKAP.md) |

## `lintas-eksperimen/`

Berkas yang tidak dapat diatribusikan ke satu eksperimen tunggal. Tidak ditebak —
didaftar apa adanya.

| Berkas | Isi | Catatan |
|---|---|---|
| `baseline_test.json` | Baseline yolo26m pada test | Titik acuan yang mendahului penomoran E-0NN |
| `eval_missing.json` | Per-kelas untuk run RGBD dan c4 | Pelengkap metrik yang belum terekam saat run aslinya |
| `smoke_rgb.json` | Keluaran uji asap `stratified_eval.py` | Tidak dirujuk dokumen mana pun; disimpan agar skripnya tetap punya jejak |

Peta skrip penghasil tiap berkas ada di [`../PETA-SKRIP.md`](../code/PETA-SKRIP.md).


===== experiments/results/E-023/README.md =====

# E-023 — fusi awal vs menengah vs akhir, semuanya dari nol

Matriks penuh 15 run (5 lengan x 3 seed, yolo26n skala n, 150 epoch, split
SawitMVC-Depth seed42, tanpa bobot pratlatih). **Ke-15 run lengkap 150/150**,
selesai 2026-08-01 pukul 15:34 UTC. `late_seed42` dan `mid_seed42` sempat
diulang setelah bug topeng 4-kanal; versi yang diarsipkan di sini adalah hasil
ulangan yang bersih.

## Kenapa arsip ini ada

`runs/` masuk `.gitignore` (baris 97), jadi `results.csv`, `args.yaml`, dan
`hasil.json` di sana hanya hidup di disk kerja yang bersifat sementara. Sembilan
run yang sudah selesai mewakili sekitar sepuluh jam GPU; menahannya sampai
seluruh matriks tuntas berarti mempertaruhkan semuanya pada satu disk tanpa
cadangan. Yang disalin ke sini hanya berkas teks — total ~234 KB.

## Isi tiap folder run

| Berkas | Keterangan |
|---|---|
| `results.csv` | metrik per epoch dari trainer |
| `args.yaml` | hiperparameter efektif, apa adanya dari ultralytics |
| `hasil.json` | ringkasan akhir trainer — **lihat peringatan di bawah** |
| `best.pt.sha256` | hash bobot; bobotnya sendiri tidak diarsipkan (kebijakan repo) |

## Peringatan: `hasil.json` tidak boleh dipakai membandingkan antar lengan

Aturan E-025. Evaluator internal trainer menghasilkan selisih yang bergantung
pada jumlah deteksi yang dipancarkan model, dan pada E-022 hal itu membalik
TANDA selisih antar lengan (-0,00515 lewat evaluator internal vs +0,01041 lewat
pycocotools). Angka di `hasil.json` disalin ke sini hanya sebagai catatan
mentah pelatihan.

Perbandingan antar lengan E-023 akan dihitung ulang dengan pycocotools atas
seluruh 15 run sekaligus, dan itulah yang menjadi dasar entri E-032.

## Bobot tidak diarsipkan

Kebijakan repo tidak menyimpan `*.pt`. `best.pt.sha256` membuat hasil latih
ulang dapat dibandingkan: kalau hash berbeda, minimal diketahui bahwa
checkpoint-nya memang lain, bukan sekadar menduga hasilnya tidak tereproduksi.
Resep latihannya ada di `experiments/code/shell/e023_fusi.sh` (seed 42 dan
1337) dan `e023_seed2024.sh` (seed 2024).

## Catatan penanda `.e023-tanda/`

Direktori penanda milik driver TIDAK sinkron dengan kenyataan dan tidak boleh
dipakai sebagai sumber kebenaran. `gagal-e023_derau_seed1337` adalah sisa
percobaan pertama yang kena OOM — penggantinya selesai 150/150 dengan bersih.
`mid_seed42` dan `late_seed42` tidak punya penanda karena diselesaikan lewat
jalur perbaikan terpisah. Jumlah epoch unik di `results.csv` adalah ukuran yang
dipakai, di sini maupun di skrip evaluasi.


===== literature/README.md =====

# Tinjauan Pustaka

Korpus tinjauan pustaka untuk riset deteksi tandan buah segar kelapa sawit.
Berisi 182 ringkasan makalah terverifikasi, 20 entri yang ditahan karena PDF
sumber tidak tersedia, sintesis lintas makalah, dan seluruh bahan pendukung
pencarian literatur.

## Saya ingin...

| Tujuan | Buka ini |
|---|---|
| Membaca ringkasan satu makalah | [`entries/`](entries/) — cari di [`INDEX.md`](entries/INDEX.md) (urut nomor) atau [`INDEX-TAHUN.md`](entries/INDEX-TAHUN.md) (per tahun dan tema) |
| Membaca sintesis lintas makalah | [`synthesis.md`](synthesis.md) — tayang juga di Ruang Baca situs |
| Memahami protokol pencarian | [`search/PROTOCOL.md`](search/PROTOCOL.md) |
| Mencari teks lengkap dari PDF | [`extracted/`](extracted/) — satu berkas `.md` per makalah |
| Melihat entri yang ditahan | [`withheld/`](withheld/) — 20 entri tanpa PDF sumber |
| Melihat bahan rujukan luar | [`references/`](references/) — PDF baseline SawitMVC, laporan deep research, revisi dosen |

## Isi folder

| Lokasi | Isi |
|---|---|
| `entries/` | 182 ringkasan makalah (satu berkas per makalah), `INDEX.md`, `INDEX-TAHUN.md` |
| `withheld/` | 20 entri yang ditahan karena PDF sumber tidak tersedia |
| `synthesis.md` | Sintesis lintas makalah dari seluruh korpus |
| `search/` | Protokol pencarian (`PROTOCOL.md`), kueri Scopus, daftar periksa mandiri |
| `extracted/` | Teks lengkap terekstrak dari PDF (satu `.md` per makalah) |
| `pdf/` | PDF sumber — **tidak masuk Git** karena terlalu besar |
| `references/` | Bahan rujukan luar: PDF baseline SawitMVC (DiB 2026), laporan deep research, catatan revisi dosen |
| `search-data/` | Data mentah hasil pencarian OpenAlex (`openalex-counts.csv`, `raw/`) |

## Catatan

- Nama berkas di `entries/` bersifat **load-bearing** — diparse oleh `site/build.js`.
  Format: `NNN - YYYY - Judul singkat - Tema.md`. Jangan mengubah nama berkas.
- Angka **182** adalah invarian yang dijaga di seluruh repo. Mengubah jumlah entri
  berarti memperbarui `synthesis.md`, naskah, dan `audit/claim-audit-182.md`.


===== manuscript/README.md =====

# Naskah

Naskah tinjauan pustaka dalam format LaTeX, tersedia dalam dua template
(IEEEtran dan Elsevier). Folder ini juga memuat figur final, panduan
penulisan, laporan eksperimen dalam format LaTeX, dan keluaran kompilasi
(PDF dan presentasi).

## Saya ingin...

| Tujuan | Buka ini |
|---|---|
| Menyunting isi naskah | [`source/evidence-body.tex`](source/evidence-body.tex) — semua penyuntingan masuk ke sini |
| Mengompilasi naskah | `latexmk -pdf -outdir=manuscript/output/papers manuscript/source/main.tex` |
| Melihat figur final | [`figures/`](figures/) — F01–F08 (`.jpg`), C01–C02, H/N/R series (`.png`) |
| Membaca panduan penulisan | [`guides/PANDUAN-PENULISAN.md`](guides/PANDUAN-PENULISAN.md) |
| Mengunduh PDF jadi | [`output/papers/`](output/papers/) — `main.pdf` (IEEEtran), `main-elsarticle.pdf` (Elsevier) |
| Melihat dek presentasi | [`output/presentation/`](output/presentation/) |

## Isi folder

| Lokasi | Isi |
|---|---|
| `source/` | Sumber LaTeX: `evidence-body.tex` (isi aktif), `main.tex` (driver IEEEtran), `main-elsarticle.tex` (driver Elsevier), `references.bib` (202 rekord BibTeX), `experiment-ledgers.tex`, `appendix-synthesis.tex` |
| `figures/` | Figur final F01–F08, distribusi korpus C01–C02, seri H/N/R, brief deskripsi (`.md`), panduan pembuatan figur, `THEME.md` |
| `guides/` | Panduan penulisan, rencana situs, rencana tinjauan pustaka, keputusan reframe, terjemahan label figur |
| `reports/` | `reports.tex` (laporan lengkap), `reports-simple.tex` (ringkas EN), `reports-simple-id.tex` (ringkas ID) |
| `output/papers/` | PDF hasil kompilasi dan artefak LaTeX (`.aux`, `.bbl`, `.log`) |
| `output/presentation/` | Dek presentasi PPTX |

## Catatan

- **Jangan menyunting `main.tex` atau `main-elsarticle.tex` untuk mengubah isi.**
  Keduanya hanya driver yang `\input` berkas `evidence-body.tex`.
- `reports.tex` dikompilasi dari akar repo, bukan dari `reports/`.
  Perintah: `latexmk -pdf -outdir=manuscript/output/papers manuscript/reports/reports.tex`


===== pipeline/README.md =====

# Pipeline YOLO 4-Kanal (RGB + Kedalaman) — Sawit FFB

Pipeline produksi untuk deteksi tandan dengan kamera *depth sensor* (Orbbec
Gemini dan sejenisnya). Satu bobot model melayani dua mode uji di lapangan:

| Mode | Kanal ke-4 | Kapan |
|---|---|---|
| RGB + depth | peta kedalaman kanonik | kamera Gemini terpasang |
| RGB saja | nol | kamera biasa / depth gagal |

Kuncinya **modality dropout**: saat pelatihan, sebagian citra sengaja diberi
kanal depth kosong (bawaan 25%), sehingga model belajar bekerja dengan dan
tanpa kedalaman. Tidak perlu dua model, tidak perlu logika ganti model di
aplikasi.

> **Batas pakai `prepare_depth.py`.** Skrip ini mengandaikan depth **sudah**
> disejajarkan ke RGB oleh SDK sensor, sehingga cukup di-resize. Itu benar untuk
> keluaran Gemini di lapangan, tetapi **tidak** untuk dataset SawitMVC-Depth:
> di sana buffer masih di grid kamera depth walau sidecar menyatakan
> `alignedTo: "color"`, dan reproyeksi penuh dikerjakan
> [`../experiments/build/reproject_depth.py`](../experiments/build/reproject_depth.py). Kedua jalur ini
> berdampingan dengan sengaja — pilih menurut asal datanya, bukan menurut mana
> yang lebih baru. Rinciannya di
> [SR-015](../SR/SR-015-depth-sensor-4kanal.md).

## Berkas

| Berkas | Fungsi |
|---|---|
| `fourch.py` | Inti: kontrak pengodean depth, patch pemuat 4-kanal + dropout, inflasi bobot pratlatih, kelas `Sawit4CH` untuk aplikasi |
| `prepare_depth.py` | Sensor uint16 mm → PNG kanonik uint8 (`--mode gemini`); pseudo-depth relatif (`--mode relative`) |
| `train_4ch.py` | Pelatihan → `best.pt` |
| `infer_4ch.py` | Inferensi citra/folder, dengan atau tanpa depth, keluar `detections.json` |

Butuh `ultralytics >= 8.4` dan `opencv-python`. Tidak ada dependensi lain.

## Kontrak kanal kedalaman — WAJIB sama saat latih dan uji

PNG uint8 satu kanal, senama dengan citranya (`foto_001.jpg` ↔ `foto_001.png`),
sejajar (*registered*) ke RGB lewat fitur *depth-to-color alignment* SDK sensor.

- `0` = tidak valid / tidak ada data (lubang sensor, atau seluruh frame saat
  mode RGB).
- `1..255` = *inverse depth* pada rentang metrik **tetap** 0,3–8 m:
  dekat → 255, jauh → 1.

Rentang metrik itu dibekukan bersama bobot (`fourch.Z_NEAR/Z_FAR`). Jangan
menormalkan per-citra pada data sensor — itu membuang jarak absolut dan membuat
nilai piksel tidak sebanding antar-frame.

## Alur kerja

```bash
# 1. konversi depth mentah sensor -> kanonik
python prepare_depth.py --src depth_mentah/ --dst depth_kanonik/ --mode gemini

# 2. latih (data.yaml lihat templat di bawah)
python train_4ch.py --data data_4ch.yaml --depth-dir depth_kanonik/ \
    --epochs 60 --batch 32 --name gemini_v1

# 3. uji lapangan
python infer_4ch.py --weights runs4ch/gemini_v1/weights/best.pt \
    --source foto_uji/ --depth-dir depth_kanonik/     # dengan depth
python infer_4ch.py --weights runs4ch/gemini_v1/weights/best.pt \
    --source foto_uji/                                # RGB saja
```

Templat `data_4ch.yaml` (layout dataset sama persis dengan SawitMVC):

```yaml
path: /path/absolut/dataset
train: train.txt        # daftar path citra, absolut atau relatif ke path
val: val.txt
test: test.txt
channels: 4             # <- ini yang membuat ultralytics membangun model 4-kanal
nc: 4
names:
  0: B1
  1: B2
  2: B3
  3: B4
```

Folder depth **tidak** disebut di yaml — ia diberikan lewat `--depth-dir` dan
dicocokkan per nama berkas. Citra tanpa PNG depth tetap ikut dilatih dengan
kanal nol (identik dengan mode RGB lapangan).

## Integrasi ke aplikasi yang sudah ada

Ganti pemanggilan YOLO lama dengan tiga baris:

```python
from fourch import Sawit4CH, encode_metric_depth

det = Sawit4CH("best.pt")                      # sekali, saat aplikasi mulai
hasil = det.predict(frame_bgr)                                 # kamera biasa
hasil = det.predict(frame_bgr, encode_metric_depth(depth_mm))  # Gemini
# hasil = {"deteksi": [{kelas, nama, skor, kotak_xyxy}...],
#          "hitung": {"B1": n, ...}, "pakai_depth": bool}
```

`Sawit4CH` juga menerima bobot 3-kanal lama — ia mendeteksi jumlah kanal dari
bobotnya dan menyusun masukan yang sesuai, jadi penggantian model tidak
mengubah kode aplikasi.

Ekspor ke ONNX/TensorRT bila diperlukan: `YOLO("best.pt").export(format="onnx")`
— masukan menjadi tensor `(1, 4, H, W)`; komposisi kanal (`fourch.compose`)
tetap dilakukan aplikasi sebelum memanggil model.

## Detail teknis yang sudah diverifikasi

- Ultralytics 8.4 membalik urutan kanal BGR→RGB **hanya untuk 3 kanal** — pada
  4 kanal, urutan `[B,G,R,D]` konsisten antara jalur latih dan prediksi
  (diverifikasi di `engine/predictor.py` dan `data/augment.py`).
- Transfer bobot bawaan ultralytics melewati conv pertama karena bentuknya
  beda (3→4 kanal). `train_4ch.py` mengisinya lewat callback: bobot RGB
  pratlatih disalin **dalam urutan BGR**, kanal depth mulai dari nol — model
  mulai persis dari perilaku RGB pratlatih.
- Pemuat 4-kanal tidak menggandakan dataset di disk; kanal depth ditempel di
  memori saat pemuatan.

## Peringatan jujur — pseudo-depth vs depth sensor

Bobot yang dilatih dengan pseudo-depth DA3 (`--mode relative`) memakai
kedalaman **relatif per-citra**; distribusinya berbeda dari inverse-depth
metrik sensor. Jangan mencampur keduanya dalam satu bobot produksi: begitu
data Gemini asli terkumpul, **latih ulang** (atau setel-halus) dengan
`--mode gemini`. Perlu diketahui pula: eksperimen E-006 memalsukan hipotesis
bahwa *pseudo*-depth memisahkan tandan dari latarnya — depth sensor asli
adalah pengukuran fisik independen yang belum diuji, dan pipeline ini yang
membuatnya bisa diuji begitu datanya ada.


===== legacy/README.md =====

# Legacy

Draf lama dan figur usang yang sudah digantikan oleh [`manuscript/`](../manuscript/).
Disimpan sebagai arsip. **Jangan menyunting berkas di sini kecuali diminta.**

## Isi folder

| Lokasi | Isi |
|---|---|
| `body.tex` | Draf lama isi naskah (97 KB) — digantikan oleh `manuscript/source/evidence-body.tex` |
| `tinjauan-pustaka.tex` | Draf mandiri tinjauan pustaka — tidak dipakai lagi |
| `verified-body.tex` | Versi terverifikasi dari body.tex lama |
| `figures-legacy/` | 8 figur lama F01–F08 (PNG, label bahasa Indonesia) — digantikan oleh `manuscript/figures/` |
| `scratch/` | Artefak kerja sementara: pratinjau PDF, berkas pengganti, dan bahan review |


===== tools/README.md =====

# Tools

Skrip utilitas yang bukan bagian eksperimen maupun naskah. Dipakai untuk
membangun artefak pendukung seperti matriks bukti, tabel sintesis, dan
dek presentasi.

## Saya ingin...

| Tujuan | Buka ini |
|---|---|
| Membangun matriks bukti | [`build_evidence_matrix.py`](build_evidence_matrix.py) — butuh `pypdf` dan folder `literature/pdf/benar/` |
| Membangun tabel sintesis | [`build_synthesis_table.py`](build_synthesis_table.py) |
| Mencari pustaka lewat OpenAlex | [`openalex_search.py`](openalex_search.py) |
| Membangun register deduplikasi dan screening | [`build_literature_screening_master.py`](build_literature_screening_master.py) |
| Menyelesaikan review konflik deduplikasi | [`resolve_literature_dedup.py`](resolve_literature_dedup.py) |
| Membuat laporan review deduplikasi yang mudah dibaca | [`build_dedup_review_report.py`](build_dedup_review_report.py) |
| Menjalankan triage judul berkepercayaan tinggi | [`build_title_screening.py`](build_title_screening.py) |
| Menjalankan triage abstrak berkepercayaan tinggi | [`build_abstract_screening.py`](build_abstract_screening.py) |
| Mengaudit full text lokal terhadap master pencarian | [`audit_local_fulltext.py`](audit_local_fulltext.py) |
| Membuat dek presentasi PPTX | [`presentation/`](presentation/) — sudah punya README sendiri |

## Isi folder

| Berkas / folder | Isi |
|---|---|
| `build_evidence_matrix.py` | Membangun matriks bukti dari `literature/entries/` dan PDF sumber |
| `build_synthesis_table.py` | Membangun tabel sintesis dari data korpus |
| `openalex_search.py` | Pencarian dan pengunduhan metadata pustaka lewat API OpenAlex |
| `build_literature_screening_master.py` | Deduplikasi raw Scopus/OpenAlex dan pembuatan audit, review manual, master screening, serta rekap PRISMA |
| `resolve_literature_dedup.py` | Resolusi konservatif konflik DOI berbeda dengan bukti judul, tahun, penulis, venue, dan provenance |
| `build_dedup_review_report.py` | Membuat laporan Markdown, HTML, dan CSV ringkas untuk kelompok deduplikasi yang tersisa |
| `build_title_screening.py` | Menandai EC5/EC6 yang jelas dari judul dan meneruskan judul lain ke screening abstrak |
| `build_abstract_screening.py` | Menandai EC1/EC5/EC6 yang sangat jelas dari abstrak dan meneruskan record lain ke pemeriksaan teks penuh |
| `audit_local_fulltext.py` | Mencocokkan PDF terverifikasi lokal dengan master pencarian dan mengekstrak bukti full text untuk kecocokan yang ditemukan |
| `presentation/` | Skrip pembuat dek PPTX: `build_charts.py`, `build_deck.py`, `build_panel.py`, `chart_rgb.py`, `verify_deck.py` |
