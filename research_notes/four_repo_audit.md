# Audit Empat Repositori untuk Panel Bukti

## project-expertise

- URL: https://github.com/muhammad-zainal-muttaqin/project-expertise
- Commit yang tampak pada halaman sumber: `225faae`.
- Sumber primer yang tersedia mencakup `experiments/EKSPERIMEN.md`, `experiments/STATUS.md`, `docs/DIAGNOSIS-DEPTH.md`, `docs/LAPORAN-AKHIR.md`, `docs/REGENERASI.md`, `docs/REPRODUKSI-FASE6.md`, `results/`, dan `logs_ringkas/`.
- Register terbaru menunjukkan dua batas split penting: 512/588 citra pada `agnostic953_test_penuh` pernah ikut pretraining agnostik; 44/55 pohon test-352 berada pada train-953. Angka terdahulu tidak ditarik, tetapi cakupan kutipannya dibatasi.
- Fase diagnosis V2-E-012 sampai V2-E-016 merekonstruksi pertanyaan depth: selisih 953 vs 352 bukan bukti efek depth; kelangkaan label B3/B4 dominan, salah kelas menghabiskan sebagian besar kemampuan detektor, relief lokal depth ada tetapi kontribusinya setelah RGB tidak terbukti, dan cabang depth classifier difalsifikasi.
- Matriks monocular depth: pada 953, RGB+Mono turun dari 0,5436 ke 0,4960 dan dilaporkan signifikan; pada 352, peningkatan kecil atas RGB tidak signifikan, sedangkan kombinasi dengan sensor depth lebih buruk. Nilai validasi 352 dapat membalik urutan test, sehingga tidak dipakai untuk memeringkat model.
- Ada pelajaran operasional yang layak dijadikan detail panel: 39 TIFF korup pernah dilompati tanpa menghentikan training; per-epoch history dan dump prediksi test perlu disimpan agar audit CI dapat direproduksi; builder/checkpoint perlu memiliki gerbang integritas.
- Implikasi narasi panel: node tidak hanya membutuhkan `conclusion` generik; perlu menjelaskan operasi konkret (mis. inventaris, probe read-only, rebuild split, evaluasi), output yang diperiksa, keputusan yang berubah, dan batas pemakaian hasil.

## Research-Pipeline

- URL: https://github.com/muhammad-zainal-muttaqin/Research-Pipeline
- Commit yang tampak pada halaman sumber: `4aa9ad6`; riwayat yang terlihat mencakup 169 commit.
- Repositori menggabungkan dua jalur: tinjauan literatur YOLO/RGB-D/deteksi tandan dan eksperimen teknis yang menguji keputusan dari tinjauan tersebut. Struktur kerjanya memisahkan `literature/`, `experiments/`, `audit/`, `datasets/`, `pipeline/`, `manuscript/`, dan `tools/`.
- README membedakan bukti yang masih berlaku dari rekam historis: hasil empat kelas yang dapat dikutip adalah RF-DETR-L E-021 (test mAP50 0,6038; mAP50-95 0,2770) dengan evaluator pycocotools yang sama. E-022 memeriksa sensor Orbbec dan reproyeksi depth, tetapi klaim peningkatan deteksi belum sah; seed-42 dipertahankan hanya sebagai riwayat beserta auditnya.
- Untuk node RP-E/RP-F, panel perlu secara eksplisit menyebut jenis kerja: inventaris atau fondasi data, percobaan detector, koreksi audit, pemetaan literatur, atau publikasi/reproduksi. Metadata seperti `Probe / eksperimen tercatat` tidak cukup menjelaskan kegiatan tersebut bagi pembaca baru.

## Baseline-SawitMVC

- URL: https://github.com/ULM-SawitMVC/Baseline-SawitMVC
- Commit yang tampak pada halaman sumber: `ee2f0ac`; riwayat yang terlihat mencakup 72 commit.
- Struktur sumber memisahkan baseline ke dalam `benchmarks/`, `experiments/`, `predictions/`, `ground_truth/`, `results/`, `algorithms/`, dan `pipeline/`, dengan `archive/` untuk permukaan eksperimen historis.
- Masalah yang diselesaikan bukan hanya deteksi kotak. Penghitung tingkat-pohon menerima deteksi yang realistis dan tidak sempurna, lalu perlu mengestimasi jumlah B1–B4 per pohon. Keluaran pembanding perlu menyatakan apakah fitur berasal dari ground truth atau dari prediksi detector.
- Halaman sumber menjelaskan dua batas yang sangat penting untuk panel: ElasticNet berbasis fitur F0 dari ground truth mencapai Class ±1 Acc 98,05%, sedangkan hasil praktis dengan deteksi YOLO berada pada 77,48%. Selisih 20,57 poin ini terutama menunjukkan biaya kesalahan detector, bukan kegagalan regresi counting tingkat-pohon.
- Narasi node baseline perlu menjelaskan bentuk eksperimennya (mis. perbandingan counter/regressor, skenario fitur GT, atau jalur deteksi end-to-end), lalu menyatakan apakah angkanya merupakan plafon diagnostik atau kinerja operasional yang realistis.

## research-method-dedup

- URL: https://github.com/muhammad-zainal-muttaqin/research-method-dedup
- Commit yang tampak pada halaman sumber: `a720f17`; riwayat yang terlihat mencakup 78 commit.
- Repositori ini menghitung tandan unik per pohon dari foto multi-sisi, lalu membandingkan selektor/heuristik, model ML, dan jalur end-to-end. Artefak dipisah ke `Brand-New-Dataset-YOLO/`, `algorithms/`, `reports/`, `scripts/`, `EDA_report/`, dan `ml-track/`.
- Ground truth merupakan bagian dari pekerjaan, bukan asumsi pasif: audit same-side duplicate dan audit visibilitas geometri dipakai untuk menemukan tautan yang tidak mungkin. Perbaikan terakhir memperbaiki bug wrap-around, relaksasi over-link, dan penyembuhan otomatis 4 sisi; hasilnya +62 tandan unik pada 48 pohon dan nol pelanggaran pada kedua audit.
- Skor metode bersifat bergantung pada versi ground truth. Setelah perbaikan, M01 selector B2↔B3 dilaporkan mencapai Class ±1 Acc 87,62% pada 953 pohon; laporan lain sebelumnya menyebut 86,67%. Panel harus menautkan nilai pada commit/dataset audit yang tepat dan menjelaskan bila suatu angka adalah ranking heuristik, bukan akurasi detector.
- Batas narasi: metode deduplikasi mengasumsikan JSON ground truth mematuhi invariant keunikan sisi dan visibilitas geometri; skor bukan bukti bahwa semua tandan biologis yang tertutup terlihat di foto.

## Bukti lintas-repositori yang harus diterjemahkan di panel

- `project-expertise/experiments/EKSPERIMEN.md` (https://raw.githubusercontent.com/muhammad-zainal-muttaqin/project-expertise/main/experiments/EKSPERIMEN.md) memakai kontrak append-only: satu entri satu hipotesis falsifiable, metode dan angka harus menuju skrip/JSON/log, dan hasil negatif diberi bobot setara.
- Entri V2-E-002 menunjukkan bentuk cerita yang perlu diprioritaskan: tujuan praktisnya bukan “mengganti model”, melainkan menguji apakah tiga detector yang lebih besar mengangkat counting melampaui baseline 77,48%. Tidak ada yang melampaui baseline, tetapi RF-DETR-L menurunkan macro MAE ke 0,993 dan membuat bias paling seimbang. Ini adalah hasil negatif dengan konsekuensi spesifik, bukan “gagal” generik.
- Entri V2-E-005 dan V2-E-006 menunjukkan bahwa node fusion perlu menyebut metode integrasi yang tepat (early fusion BGRD empat kanal), pembanding RGB yang dipasangkan, arah setiap delta, dan apakah CI mendukung klaim. Depth tidak memberi kenaikan yang konsisten di tiga arsitektur.
- `Research-Pipeline/experiments/EKSPERIMEN.md` (https://raw.githubusercontent.com/muhammad-zainal-muttaqin/Research-Pipeline/main/experiments/EKSPERIMEN.md) mendefinisikan format cerita yang kuat: Hipotesis → Cara → Hasil → Putusan → Dampak. Log tersebut juga membedakan Seri E (diagnostik/pembanding) dari Seri F (formulasi/arsitektur), serta mengarahkan pembaca ke SR per-ide dan audit saat ada koreksi.
- Pada RP-E002, inventaris raw membuktikan 3.992 JPG raw beresolusi 3024×4032 dan 45 video. Koordinat YOLO dapat dipakai di resolusi raw karena rasio aspek identik, tetapi 936 nama berkas ganda membuat pemetaan raw ke anotasi tidak sah tanpa matching konten atau tabel dari pengumpul data. Dampak langsungnya: eksperimen resolusi penuh diblokir dan jalur video orbit diprioritaskan. Ini perlu menjadi isi panel, bukan kalimat “inventaris selesai”.
- `Baseline-SawitMVC/README.md` (https://raw.githubusercontent.com/ULM-SawitMVC/Baseline-SawitMVC/main/README.md) menegaskan bahwa menghitung semua tampakan multi-view memberi overcount sekitar 1,83×. Baseline operasional adalah YOLO26m lalu Ridge F_all (67 fitur) dengan Class ±1 Acc 77,48%, Tree ±1 Acc 32,62%, dan Macro MAE 1,036 pada 141 pohon test. Skenario GT memberi 98,05% Class ±1 Acc dan 92,20% Tree ±1 Acc, sehingga panel harus membedakan batas atas diagnostik dari performa end-to-end.
- `research-method-dedup/RESEARCH.md` (https://raw.githubusercontent.com/muhammad-zainal-muttaqin/research-method-dedup/main/RESEARCH.md) membedakan Heuristik, Deteksi, ML dengan fitur GT, dan End-to-End. Dokumen historis juga memberi banyak arahan yang sudah tertutup; panel harus menandai bila node adalah arsip/utility/historical surface, bukan rekomendasi riset aktif.

## Implikasi desain panel

Setiap node perlu menyimpan: `jenisKerja` (inventaris, probe, eksperimen pembanding, audit, sintesis, formulasi), `pertanyaan`, `langkah`, `buktiUtama`, `putusanOperasional`, `dampak`, dan `batas`. Struktur ini menghindari narasi palsu seperti “menguji peningkatan” pada node yang sebenarnya hanya memetakan data atau memperbaiki validitas ground truth.

## Verifikasi Artefak Primer — 15 Agustus 2026

| Repositori | Commit | Artefak representatif | Hasil verifikasi | Implikasi panel |
|---|---|---|---|---|
| `research-method-dedup` | `a720f17` | `algorithms/M01_selector_b2b3.py` | Tersedia; dokumen menerangkan selector trifurkasi dan koreksi B2↔B3. | Tautkan ke `blob/a720f17/algorithms/M01_selector_b2b3.py`. |
| `Baseline-SawitMVC` | `ee2f0ac` | `README.md` | Tersedia; memuat baseline tree-level dan split 716/96/141. | Tautkan ke `blob/ee2f0ac/README.md`; fragmen `§` hanya anotasi panel. |
| `Research-Pipeline` | `4aa9ad6` | `experiments/README.md` | Tersedia; memuat register E-001–E-032 dan status kutip. | Tautkan ke `blob/4aa9ad6/experiments/README.md`. |
| `project-expertise` | `225faaeb` | `runs_fase6/sd101_rgb/hasil.json`; `runs_fase6/pre953v2/hasil.json` | Kedua URL GitHub `blob` mengembalikan HTTP 404 pada commit audit. | Jangan tampilkan sebagai tautan aktif; beri label “tidak tersedia pada commit 225faaeb”. |
