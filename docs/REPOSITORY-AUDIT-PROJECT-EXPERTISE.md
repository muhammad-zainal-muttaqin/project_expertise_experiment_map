# Dossier Audit Repositori — project-expertise

> **Fungsi dokumen.** Dossier ini adalah pembacaan tekstual untuk membandingkan atlas dengan sumber primer. Ia memetakan seluruh lintasan V2-E-001 hingga V2-E-048, dua node atlas RGB+D4, dan PT-E-000 hingga PT-E-036, mencatat hasil positif serta negatif, dan membedakan bukti hasil dari audit yang membatasi cara hasil itu dibaca.

## Identitas dan Batas Audit

| Atribut | Nilai |
|---|---|
| Repositori | [`muhammad-zainal-muttaqin/project-expertise`](https://github.com/muhammad-zainal-muttaqin/project-expertise) |
| Commit Volume 2 yang diaudit | [`225faaeb`](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/225faaeb) |
| Commit cabang per-tandan | [`c19906bbfbb4`](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/c19906bbfbb4/pipeline-pertandan) |
| Commit batch terbaru | [`74b19c2`](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/74b19c2b641b96d056a728ffecf56cd6ecd648b8) |
| Peran dalam program riset | Volume 2: reproduksi benchmark RGB, eksperimen RGB+depth, diagnosis, dua tahap, monocular-depth, dan audit validitas; dilanjutkan cabang pipeline per-tandan. |
| Unit utama | Deteksi B1–B4 per citra dan counting per pohon. |
| Dataset yang tercatat | SawitMVC RGB: 953 pohon/3.992 citra; SawitMVC-Depth: 352 pohon/1.408 citra. |
| Register primer | [`experiments/EKSPERIMEN.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/experiments/EKSPERIMEN.md) dan [`experiments/STATUS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/experiments/STATUS.md). |

Pembacaan harus berangkat dari dua batas yang menjadi keputusan audit, bukan dari ranking titik estimasi semata. Dataset 953 RGB dan 352 RGB+depth merupakan sesi akuisisi berbeda dengan jarak kira-kira 80 hari; keduanya bukan pasangan dua view dari tandan biologis yang sama. Karena itu, perbedaan performa lintas dataset tidak boleh disebut efek depth. Selain itu, test 352 memuat 220 citra dan sekitar 410 GT pada evaluasi yang dibahas, sehingga selisih kecil berada di bawah resolusi inferensi bootstrap yang tersedia. [1] [2]

## Peta Masalah dan Pertanyaan yang Dikerjakan

Repositori memulai Volume 2 dengan tiga tujuan: mereproduksi pembanding RGB Volume 1 pada 953 pohon, menjalankan matriks yang sebanding pada 352 pohon dengan sensor depth, dan menguji apakah kanal keempat dapat membantu deteksi atau counting. Seiring audit, ruang lingkup diperluas secara benar menjadi diagnosis: apakah hambatan terutama lokalisasi atau klasifikasi ordinal; apakah sinyal depth ada setelah pooling; apakah dua tahap dapat memakai crop classifier; dan apakah bukti statistik cukup kuat untuk menyatakan kenaikan. [1] [2]

> **Aturan baca yang dipakai dossier:** sebuah angka hanya dilabeli *didukung* jika bukti di commit tersebut mendukung pertanyaan yang tepat. Label *negatif* berarti jalur diuji dan tidak membantu pada rezimnya. Label *belum konklusif* berarti bukti belum memisahkan efek dari nol atau pembandingnya. Label *audit/batas* merekam masalah desain, leakage, atau keterbatasan interpretasi.

## Cabang Pipeline Per-Tandan — Commit `c19906bbfbb4`

Tiga commit setelah snapshot Volume 2 menambahkan `pipeline-pertandan/`: sebuah cabang yang menggeser satuan analisis dari kemunculan deteksi per citra menjadi **tandan fisik per pohon**. Register PT-E memisahkan empat hal yang sebelumnya mudah tercampur: plafon penggabungan kelas apabila asosiasi benar, mutu penaut lintas-sisi, hasil end-to-end setelah deteksi, serta efek terhadap counting. Tiga belas node PT-E berikut sudah masuk ke atlas dengan sumber yang dipasangi pin. [8] [9]

| ID | Pertanyaan / tindakan | Putusan | Angka atau batas penting |
|---|---|---|---|
| PT-E-000 | Probe kelayakan representasi per-tandan | Audit awal | F1 penaut `0,4282`; ARI `0,3912`; belum ada klaim gain akhir. |
| PT-E-001 | Oracle penggabungan kelas lintas-tampak | Didukung; G0 lolos | Gain test pool ≥2 `+4,36 pp`, CI `[+2,33; +6,25]`. |
| PT-E-002 | Penaut geometri/penampilan/re-ID awal | Negatif; G1 awal gugur | F1 sah terbaik `0,3979`, di bawah ambang G1 `0,65`. |
| PT-E-003 | Pipeline per-tandan end-to-end awal | Negatif; G2 awal gugur | R4 `0,7124`, F1 penaut deteksi `0,1766`. |
| PT-E-004 | Counting kelompok versus Ridge `F_all` | Negatif; G3 gugur | C4 `3,3422` MAE versus Ridge `1,0542`. |
| PT-E-006 | Audit counter historis M01 | Audit/batas | `0,3404` MAE memakai kotak GT; skor itu bukan E2E. |
| PT-E-007 | Rem penggabungan berbasis target cacah | Dipalsukan | Bahkan target cacah GT menurunkan R4 menjadi `0,6454`. |
| PT-E-008 | Prior arah putar | Didukung; G1/G2 lolos | F1 GT `0,3979 → 0,6486`; R4 pipeline `0,7179`. |
| PT-E-009 | Sapu confidence setelah prior arah | Negatif sebagai perbaikan | Metrik seluruh GT `0,6474`; metrik penyebut menyusut dibatalkan. |
| PT-E-010 | Replikasi pada Depth-352 | Belum konklusif | F1 deteksi `0,7083`, tetapi CI gain kelas mencakup nol. |
| PT-E-011 | Audit kepadatan kandidat 953 vs 352 | Audit yang mengubah diagnosis | ~235 versus ~28 pasangan/pohon; klaim bottleneck detektor dibatalkan. |
| PT-E-012 | Classifier multi-tampak C3 | Negatif | C3 attention `0,6781` di bawah C1 skor detektor `0,7208`. |
| PT-E-013 | Depth+arah untuk rekonstruksi 3D | Dipalsukan | AUC `0,4511/0,5083`; pose handheld tidak cukup terkendali. |

> **Putusan sintesis PT-E.** Penggabungan kelas memang bernilai ketika tandan yang sama telah diketahui; masalah dominan pada 953 adalah kombinatorik kandidat asosiasi. Prior urutan sisi yang berasal dari protokol akuisisi memperbaiki G1/G2, sedangkan memaksa target cacah, menaikkan confidence, classifier C3, dan rekonstruksi 3D tidak membuka jalur perbaikan yang sah. Counting E2E tetap kalah dari Ridge `F_all`; karenanya G3 belum lolos. [8] [9]

## Batch Terbaru — `new763`, `combined1716`, dan Pipeline DAMIMAS

Batch yang kini dipasangi pin pada commit `74b19c2` memperluas beberapa arah sekaligus. Jalur V2 membangun baseline dan audit generalisasi pada korpus `new763` serta `combined1716`; jalur PT-E melanjutkan pipeline per-tandan menuju proposal fisik, penaut DAMIMAS, propagasi bukti lintas-tampak, evaluasi end-to-end, pencacahan, dan eksperimen batas ensemble. Commit yang sama juga memuat iterasi 27–28 Agustus berupa pipeline empat sisi test-locked, GSP, re-ranking terpelajar, komposisi lintas-lapis, dan RGB+D4. Semua angka di bawah terikat pada commit ini; hasil evaluasi silang yang telah ditandai terkontaminasi tetap dicatat sebagai batas, bukan bukti generalisasi. [10] [11] [12] [13]

| ID | Pertanyaan / tindakan | Putusan | Angka atau batas penting |
|---|---|---|---|
| V2-E-034 | Baseline RGB seed-42 pada `new763` (763 pohon) | Didukung dengan kaveat budget tidak setara | RF-DETR `0,6129`; RT-DETR `0,5580`; YOLO `0,5163` mAP50. |
| V2-E-035 | Baseline RGB pada `combined1716` dengan budget 60 epoch | Didukung | RF-DETR `0,5960`; RT-DETR `0,5745`; YOLO `0,5389`. |
| V2-E-036 | Evaluasi lokalisasi agnostik tanpa inferensi ulang | Didukung | Rekor RF-DETR `new763` AP50 `0,7951` pada 440 citra test. |
| V2-E-037 | Confusion enam model baru | Didukung sebagai diagnosis | Kehilangan salah kelas `22,9–27,9%`; galat dominan tetap ordinal. |
| V2-E-038 | Bootstrap mAP50 berpasangan | Didukung | Semua 6 perbandingan arsitektur signifikan; RF > RT > YOLO. |
| V2-E-039 | Sweep ambang dan WBF | Campuran: lokalisasi didukung, WBF aware dipalsukan | AP50 agnostik WBF `0,8106`; mAP aware WBF `0,5538` < RF tunggal `0,5960`. |
| V2-E-040 | Generalisasi lintas-domain | Didukung dengan batas kontaminasi 352 | `new763` runtuh ke 953; `combined1716` stabil; ranking arsitektur bisa terbalik. |
| V2-E-041 | Replikasi independen lewat Ultralytics HUB | Didukung sebagai replikasi eksploratif | RT-DETR turun `−52%` agnostik dan `−71%` 4-kelas; LONSUM dikecualikan. |

### Iterasi 27–28 Agustus — Pipeline Empat Sisi, GSP, dan RGB+D4

| ID atlas | Pertanyaan / tindakan | Putusan | Angka atau batas penting |
|---|---|---|---|
| V2-E-042 | Verifikasi enam bobot remote dan garis dasar pipeline empat sisi | Didukung sebagai diagnosis | F1/MAE: Depth `0,6140/4,518`; 953 `0,5327/14,993`; duplikasi klaster dominan. |
| V2-E-043 | Pengetatan proposal dan penaut melalui sapuan pada data uji | Audit/batas atas rekayasa | F1 naik menjadi `0,8590/0,8296`, tetapi parameter dipilih langsung pada data uji. |
| V2-E-044 | Pengklasifikasi citra terpotong RGB lima epoch | Negatif untuk penggantian penuh | Akurasi kelas `70,71% → 62,95%`; campuran 25% hanya test-selected. |
| V2-E-045 | Pipeline sadar-cacah yang dikunci dari TRAIN/VALID | Didukung sebagai garis dasar uji terkunci | F1 uji Depth `0,8069`; 953 `0,8043`; MAE `0,891/1,393`. |
| V2-E-046 | GSP dan re-ranking terpelajar | Campuran: F1 didukung pada kedua dataset; mAP didukung hanya pada 953 | Δ F1 `+0,0344/+0,0465`; Δ mAP50 Depth `−0,0139`, CI mencakup nol. |
| V2-E-047 | Komposisi topology/count/class pada VALID Depth | Belum konklusif | F1 `0,8542`, MAE `0,9145`, matched `0,8500`, makro-F1 `0,6890`; seluruh CI delta mencakup nol. |
| V2-E-048 | Retraining composition-aware | Negatif | Matched tetap `0,8500`; makro-F1 `0,6850` < `0,6890`. |
| V2-RGBD4-001 | Early fusion fair RGB+D4 pada tiga arsitektur | Tidak mendukung peningkatan konsisten | Δ mAP50 YOLO `+0,0002`, RF `−0,0112`, RT `+0,0063`; seluruh CI mencakup nol. |
| V2-RGBD4-002 | Fixed late fusion RGB dan RGB+D4 | Kandidat validation-selected | YOLO union-WBF `0,5677`; RT union-NMS `0,6064`; TEST belum dibuka. |

`V2-E-046` dan `V2-E-048` berasal dari subjek commit, sedangkan `V2-E-047` hanya muncul sebagai judul bagian pada `experiments/STATUS.md`; ketiganya belum memiliki entri penuh tersendiri di `experiments/EKSPERIMEN.md`. Dua ID `V2-RGBD4-*` merupakan identitas atlas karena eksperimen sumber juga belum diberi nomor `V2-E` resmi. Perbedaan administratif ini dipertahankan sebagai batas audit, bukan dirapikan secara diam-diam. [12] [13] [14]

| ID | Pertanyaan / tindakan PT-E lanjutan | Putusan | Angka atau batas penting |
|---|---|---|---|
| PT-E-014/015 | Backbone ConvNeXt dan loss CORAL untuk modul C | Belum konklusif lintas-seed | C3 terbaik `0,7187` masih di bawah C1 `0,7208`; gain seed tunggal tidak stabil. |
| PT-E-016 | GNN pada ruang kotak GT | Belum konklusif | Δ F1 `+1,06 pp`, CI memuat nol; optimum ambang GNN `0,90`. |
| PT-E-017 | Latih penaut pada pasangan deteksi | Didukung kuat | F1 `0,1492 → 0,3788`; pool palsu `0,040`. |
| PT-E-018 | Ensemble C1/C2/C3 | Didukung | R4 `0,7464`, gain `+2,56 pp`, CI `[+0,52; +4,53]`. |
| PT-E-019 | Faktorial penaut × ensemble | Negatif untuk efek berlipat | Gabungan `+0,87 pp`, CI memuat nol; cakupan multi `29,3% → 51,2%`. |
| PT-E-020/022 | Penaut DAMIMAS dan proposal fisik unik | Didukung sebagai association, bukan counter | F1 linker `0,5171`; cakupan seluruh tandan `0,5155`; MAE pool `1,864`. |
| PT-E-021 | Proposal fisik dan relabel probabilistik | Didukung | AP50 proposal `0,8381`; mAP routing `0,5881`; AP50 B4 `0,4106`. |
| PT-E-023 | MoE strict/per-view | Negatif untuk strict; terbatas untuk per-view | Strict `0,7234` < champion `0,7378`; gain macro-F1 per-view `+1,01 pp`. |
| PT-E-024 | Propagasi confidence lintas-view | Didukung | mAP50 `0,5881 → 0,5965`, tanpa perubahan koordinat/label/kardinalitas kotak. |
| PT-E-025 | Evaluasi end-to-end fisik | Bukti E2E, belum promosi counting | Macro-F1 E2E `0,5867`; MAE pool/pohon `1,638`. |
| PT-E-026/028 | Counting multi-bank dan CatBoost | Negatif untuk macro-MAE | Anchor `1,0039` tetap champion; compact total-MAE audit `1,4882`. |
| PT-E-029 | Ensemble kelas rata-rata berbobot | Didukung dengan CI batas | Test `0,7439`; satu-view `0,6590` tetap bottleneck. |
| PT-E-030 | CORN versus CORAL | CORN didukung, CORAL dipalsukan pada resep ini | CORN `0,6983`; CORAL `0,3305`; selisih bersifat konfigurasi-spesifik. |
| PT-E-031 | Spesialis batas kelas | Negatif | Akhir `0,7340`; Δ `−0,15 pp`; 86% galat dua batas tidak cukup untuk membuka gain. |
| PT-E-032 | Audit early overfitting RF-DETR | Audit/batas | Puncak val EMA `0,5830` epoch 5; test belum dihitung pada entri ini. |
| PT-E-033/034 | Bagging dan plafon rata-rata berbobot | Negatif / audit batas | Bagged `0,7394`; plafon bobot curang `0,7523`; oracle anggota `0,8739`. |
| PT-E-035/036 | DES confidence dan gerbang pola | Negatif | Confidence–benar `0,1185`; gerbang pola CV `0,7062` < rata-rata `0,7421`; test PT-E-036 tidak dibuka. |

> **Putusan sintesis batch terbaru.** Lebih banyak data dan arsitektur tidak otomatis menambah robustness: `combined1716` stabil di domain 953 terutama karena domain itu telah hadir dalam pelatihan, sedangkan `new763` tidak. Pada pipeline per-tandan DAMIMAS, perbaikan association dan propagasi confidence tercatat jelas, tetapi counting macro-MAE dan gerbang ensemble berbasis keluaran anggota belum bergerak. Batas ini sama pentingnya dengan rekor AP50 agnostik karena mencegah klaim “deteksi terbaik” disamakan dengan generalisasi, klasifikasi kematangan, atau counting. [10] [11]

## Data, Protokol, dan Metrik

| Aspek | SawitMVC 953 | SawitMVC-Depth 352 | Implikasi audit |
|---|---:|---:|---|
| Pohon / citra | 953 / 3.992 | 352 / 1.408 | Ukuran dan komposisi tidak setara. |
| Kanal utama | RGB | RGB dan depth sensor terdaftar | Perbandingan yang sah memerlukan RGB vs RGB+depth di dalam 352. |
| Kelas | B1–B4 | B1–B4 | Kesalahan kelas banyak bersifat bersebelahan/ordinal. |
| Metrik deteksi | mAP50, mAP50-95, AP50 agnostik | Sama | AP agnostik memisahkan lokalisasi dari salah kelas. |
| Metrik counting | Class ±1, Macro MAE | Sama | Counting dapat berubah tanpa mengikuti urutan mAP. |

Reproduksi RGB 953 menetapkan RF-DETR-L sebagai pemenang mAP50 di antara tiga arsitektur yang diperiksa (`0,6012`), di atas RT-DETR-L (`0,5781`) dan YOLO26l (`0,5435`). Pada 352 RGB, urutannya tetap RF-DETR-L (`0,4544`), RT-DETR-L (`0,4343`), lalu YOLO26l (`0,3606`). Untuk counting, urutan itu tidak identik: pada 953 baseline YOLO26m tetap memiliki Class ±1 `77,48%`, sedangkan tiga replikasi yang dicatat adalah YOLO26l `72,16%`, RT-DETR-L `76,24%`, dan RF-DETR-L `76,24%`. [1] [3]

## Register Lengkap Volume 2

Tabel berikut adalah indeks tekstual dari node atlas. Untuk angka rinci, setiap item mengarah ke artefak pada commit audit atau ke register primer. Rentang ID tetap ditulis satu per satu agar hasil negatif dan audit tidak menghilang dalam sintesis.

| ID | Pertanyaan / tindakan | Putusan pada commit | Angka atau batas penting |
|---|---|---|---|
| V2-E-001 | Reproduksi YOLO26l, RT-DETR-L, RF-DETR-L pada 953 RGB | Didukung; RF-DETR-L memimpin. | mAP50 `0,5435 / 0,5781 / 0,6012`. |
| V2-E-002 | Counting tiga detektor 953 dengan Ridge `F_all` | Negatif terhadap baseline YOLO26m. | `72,16 / 76,24 / 76,24%` vs `77,48%`. |
| V2-E-003 | Reproduksi tiga arsitektur pada 352 RGB | Didukung; urutan arsitektur bertahan. | mAP50 `0,3606 / 0,4343 / 0,4544`. |
| V2-E-004 | Counting tiga detektor 352 RGB | Didukung sebagai diagnosis ranking tidak sama. | RT-DETR-L `90,91%` Class ±1. |
| V2-E-005 | Early fusion RGB+depth inverse | Negatif lintas arsitektur. | YOLO +`0,0313`; RT/RF turun. |
| V2-E-006 | Counting RGB+depth inverse | Negatif/tidak ada kenaikan yang terpisah dari nol. | Semua CI RGBD−RGB mencakup nol. |
| V2-E-007 | Sintesis matriks sembilan sel | Audit/batas; disimpan sebagai keputusan historis. | Dibatasi temporal shift dan power. |
| V2-E-008 | Screening encoding depth | Didukung sebagai *screening*, bukan hasil final. | Sobel edge val mAP50 `0,3777` pada 15 epoch. |
| V2-E-009 | Mid-fusion depth dengan gate | Negatif pada screening. | mAP50 `0,2087`; B3/B4 sangat rendah. |
| V2-E-010 | RGB + edge-depth penuh | Didukung sebagai kenaikan titik estimasi deteksi. | mAP50 `0,4316`; counting `87,27%`. |
| V2-E-011 | Retrain RGB dan bootstrap counting edge | Belum konklusif. | CI Class ±1 `[−0,5; +7,3]` pp. |
| V2-E-012 | Gap 953 vs 352 | Audit/batas; bukan sekadar ukuran dataset. | B3 train `7.333 → 215`; B4 `2.513 → 98`. |
| V2-E-013 | Lokalisasi versus salah kelas | Didukung. | AP50 agnostik `0,6677` vs aware `0,3707`. |
| V2-E-014 | Probe relief depth | Didukung sebagai sinyal terpooling. | Kruskal–Wallis `p=1,7×10⁻²¹`; AUC 16 px `0,650`. |
| V2-E-015 | Crop classifier kematangan | Didukung. | Test `0,6309 ± 0,0203`; detector GT `0,4659`. |
| V2-E-016 | Ablasi depth classifier | Negatif. | Δ CNN test `−0,0203`, `p=0,42`. |
| V2-E-017 | Plafon lokalisasi RGB | Audit/batas. | AP50 953 `0,7374`, 352 `0,7330`; generalisasi dibatasi. |
| V2-E-018 | Transfer 953→352 dan patience | Negatif/diagnostik. | Patience pendek menciptakan puncak palsu. |
| V2-E-019 | WBF dan sweep inference | Didukung pada validasi. | AP50 val `0,7577` vs `0,7370`; bukan skor tunggal. |
| V2-E-020 | Pipeline dua tahap | Belum konklusif. | mAP50 `0,4500`; CI/power belum memisahkan. |
| V2-E-021 | Classifier gabungan 953+352 | Belum konklusif. | Domain tidak seimbang; mAP/counting bergerak berlawanan. |
| V2-E-022 | Audit pergeseran temporal | Audit/batas yang mengubah klaim lintas-dataset. | Jeda ~80 hari. |
| V2-E-023 | Power test split 352 | Audit/batas. | CI Δ edge−RGB `[−0,0013; +0,1168]`. |
| V2-E-024 | Depth untuk lokalisasi agnostik | Belum konklusif, arah positif. | Δ AP50 `+0,0278`; CI `[−0,0121; +0,0648]`. |
| V2-E-025 | Test bersih agnostik 953 | Audit/batas leakage. | AP50 bersih `0,7702`; 316 GT. |
| V2-E-026 | CI dua tahap v4 | Belum konklusif. | Δ `+0,0230`; CI `[−0,0286; +0,0663]`. |
| V2-E-027 | RGB+monocular depth 953 | Negatif. | mAP50 `0,4960` vs RGB `0,5436`. |
| V2-E-028 | Audit TIFF korup | Audit/batas dan perbaikan data turunan. | 39 TIFF korup; 0 setelah perbaikan. |
| V2-E-029 | Bootstrap RGB+mono vs RGB 953 | Negatif signifikan. | Δ `−0,0476`; CI `[−0,0671; −0,0274]`. |
| V2-E-030 | RGB+mono pada 352 | Belum konklusif. | CI mono−RGB `[−0,0270; +0,0739]`. |
| V2-E-031 | RGB+edge-depth+mono | Negatif signifikan. | Δ `−0,0504`; CI `[−0,1038; −0,0015]`. |
| V2-E-032 | Matriks monocular lengkap | Negatif dalam enam sel. | Mono tidak menang; mekanisme masih terbuka tanpa M_shuf. |
| V2-E-033 | Dua kebocoran split | Audit/batas. | 512/588 citra test penuh 953 terkontaminasi pretraining; 44/55 test-352 ada di train-953. |

## Narasi Penelitian per Blok Keputusan

### Fondasi RGB dan Kanal Depth

Matriks awal tidak mendukung klaim generik bahwa menambahkan depth meningkatkan deteksi atau counting. Encoding inverse menghasilkan kenaikan hanya pada YOLO26l dan penurunan pada dua arsitektur lain. Screening lalu memilih edge/Sobel untuk ditraining penuh. Hasil edge tampak lebih baik sebagai **titik estimasi deteksi** dibanding inverse maupun RGB YOLO26l, tetapi performa counting tidak otomatis mengikuti dan bootstrap tidak memberi putusan ketat. Dengan demikian, istilah yang aman adalah “mengindikasikan kenaikan pada konfigurasi tersebut”, bukan “membuktikan depth meningkatkan”. [1] [2]

### Diagnosis Lokal, Ordinal, dan Dua Tahap

V2-E-013 memperlihatkan bahwa sebagian besar kehilangan pada mAP class-aware berasal dari pemberian kelas, bukan semata kegagalan menemukan tandan. V2-E-014 menguji mengapa sensor depth mungkin tampak lemah pada early fusion: piksel mentah memiliki SNR rendah, tetapi relief lokal setelah pooling mengandung sinyal ordinal. Dua temuan itu memotivasi pipeline dua tahap: lokalisasi, WBF, lalu classifier crop. Pipeline v4 meningkatkan perbandingan terhadap YOLO26l RGB, tetapi tidak berhasil dibedakan secara statistik dari RF-DETR-L/edge-depth pada test 352 yang kecil. [1] [2]

### Audit Kausal dan Statistik

Pergeseran temporal mengubah interpretasi paling penting di repositori ini. Perbedaan 953 vs 352 membawa perbedaan sesi, jumlah kelas, domain, dan putaran panen; karena itu bukan eksperimen kausal depth. Power audit menjelaskan bahwa beberapa ranking dengan selisih ribuan tidak memiliki presisi cukup. Test bersih 953 kemudian membatasi angka agnostik yang sempat menerima kontaminasi pretraining, dan audit split mencatat transfer 953→352 yang berbagi pohon test/train. Audit tidak menghapus artefak lama; ia memberi label batas agar angka tetap dapat ditelusuri tanpa dipakai di luar pertanyaannya. [2] [4]

### Monocular Depth

Monocular depth diuji sebagai kanal tambahan, bukan pengganti depth sensor. Pada 953, RGB+mono turun sekitar `−0,0476` mAP50 dengan interval bootstrap yang seluruhnya negatif. Pada 352, RGB+mono memiliki titik estimasi lebih tinggi dari RGB tetapi interval mencakup nol; menambahkan mono di atas edge-depth kembali merugikan secara signifikan. Matriks ini belum menjawab apakah kerugian berasal dari isi peta mono atau dari biaya menambah kanal, karena kontrol `M_shuf` belum dijalankan. [5]

### Lampiran Bukti Bucket Cadangan — Tidak Mengubah Putusan Commit

Bucket `ULM-DS-Lab/project-expertise-backup` diperiksa pada 15 Agu 2026 sebagai sumber pelengkap. Inventaris baca-saja mencatat 59.929 objek: 3.160 path non-dependensi berada dalam snapshot `project-expertise/`, berbanding 149 path pada commit atlas `225faaeb`. Selisih utamanya adalah run, log, prediksi, citra, dan checkpoint yang tidak dimasukkan ke snapshot Git. Karena Hugging Face Storage Buckets bersifat mutable serta non-versioned, artefak ini **bukan** bukti commit-tersemat dan tidak boleh mengganti angka atau putusan V2-E pada tabel register. [6] [7]

Sampel lima run kecil dibaca melalui `args.yaml`, `hasil.json` bila tersedia, dan `results.csv`. Sampel tersebut mengonfirmasi bahwa sejumlah run historis memang tersimpan, termasuk variasi RGB+mono, RGB+edge-depth+mono, 4-channel agnostik, dan RGBD-edge. Namun, berkas yang diperiksa hanya berupa kurva validasi pelatihan dan konfigurasi; tidak tersedia pada sampel ini dump prediksi, evaluator test yang disamakan, atau kontrak split yang memadai untuk mengangkat skor validasi menjadi klaim baru. Keputusan atlas untuk V2-E-027 hingga V2-E-032 karena itu **tetap tidak berubah**. [6]

| Run bucket | Konfigurasi yang terbaca | Catatan metrik dari `results.csv` | Status pembacaan |
|---|---|---|---|
| `sel6_953_rgbmono` | YOLO26l, `d953_rgbmono`, seed 42, target 60 epoch; rekaman berhenti pada epoch 31. | mAP50 validasi terakhir `0,48703`; tidak ada `hasil.json`. | Mendukung keberadaan jalur RGB+mono, tetapi bukan skor test atau replikasi setara V2-E-027. |
| `sel4_352_rgbedgemono` | YOLO26l, `d352_rgbedgemono`, 60 epoch, seed 42. | mAP50 validasi terakhir `0,38715`. | Artefak pendukung jalur edge-depth+mono; tidak mengubah putusan negatif bootstrap V2-E-031. |
| `agn352_4ch` | YOLO26l, `agnostic352_4ch`, 60 epoch, seed 42. | mAP50 validasi terakhir `0,72244`. | Rezim agnostik; tidak sebanding langsung dengan mAP class-aware pada register. |
| `agn953_full` | YOLO26l, `agnostic953`, 12 epoch, seed 42. | mAP50 validasi terakhir `0,80508`. | Rezim agnostik dan jadwal lebih pendek; hanya kandidat inspeksi, bukan benchmark 953 yang menggantikan V2-E-001. |
| `yolo26l_e60_i1280_rgbd352_edge` | YOLO26l, `data_rgbd_352_edge`, 60 epoch, seed 42. | mAP50 validasi terakhir `0,34805`. | Jejak pelatihan untuk encoding edge; perlu evaluator test yang sama sebelum dibandingkan dengan V2-E-010. |

> **Cara inspeksi manual.** Dengan akses bucket yang sah, salin path berikut ke CLI Hugging Face—misalnya `hf buckets cp hf://buckets/ULM-DS-Lab/project-expertise-backup/project-expertise/runs/sel6_953_rgbmono/results.csv .`—atau buka bucket pada halaman sumber [6]. Path yang dibaca dalam sampel adalah `project-expertise/runs/<nama-run>/{args.yaml,hasil.json,results.csv}`. Jangan memasukkan token akses ke Markdown, issue, commit, atau browser URL.

## Artefak Inspeksi Prioritas

| Keperluan audit | Artefak langsung pada commit `225faaeb` |
|---|---|
| Register dan status | [`EKSPERIMEN.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/experiments/EKSPERIMEN.md) · [`STATUS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/experiments/STATUS.md) |
| Benchmark RGB 953 | [`perkelas_pycoco_v2repro.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/perkelas_pycoco_v2repro.json) · [`counting_v2repro.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/counting_v2repro.json) |
| Matriks 352 | [`perkelas RGB`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/perkelas_pycoco_rgb352.json) · [`perkelas RGBD`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/perkelas_pycoco_rgbd352.json) · [`counting RGB`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/counting_rgb352.json) |
| Bootstrap dan power | [`bootstrap_map_awal.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/bootstrap_map_awal.json) · [`bootstrap_lokalisasi.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/bootstrap_lokalisasi.json) · [`bootstrap_map.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/bootstrap_map.json) |
| Diagnosis / dua tahap | [`probe_fitur_depth.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/probe_fitur_depth.json) · [`twostage_final_v4.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/twostage_final_v4.json) |
| Validitas | [`pergeseran_temporal.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pergeseran_temporal.json) · [`test953_bersih.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/test953_bersih.json) |
| Monocular depth | [`boot_sel6_vs_sel5.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/boot_sel6_vs_sel5.json) · [`boot_sel4_vs_sel2.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/boot_sel4_vs_sel2.json) · [`boot_sel3_vs_sel1.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/boot_sel3_vs_sel1.json) |
| Pipeline per-tandan | [`EKSPERIMEN.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/EKSPERIMEN.md) · [`STATUS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/STATUS.md) · [`hasil PT-E-001`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_001_oracle.json) · [`hasil PT-E-003`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_003_endtoend.json) · [`hasil PT-E-009`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_009_sapu_conf.json) · [`hasil PT-E-012`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_012_c3.json) |
| Pelengkap bucket mutable | [`Bucket project-expertise-backup`](https://huggingface.co/buckets/ULM-DS-Lab/project-expertise-backup) · `hf://buckets/ULM-DS-Lab/project-expertise-backup/project-expertise/runs/` · [catatan inventaris lokal](../research_notes/repo_inventory/hf_backup_audit_notes.md) |

## Keterkaitan dengan Atlas

Atlas mengimpor node V2-E-001 sampai V2-E-048, dua node atlas RGB+D4, serta PT-E-000 sampai PT-E-036 dari kontrak data `client/src/lib/experimentData.ts` dan katalog batch terbaru. Dossier ini menggunakan ID yang sama dan mengembalikan pembaca ke artefak primer. Jika sebuah simpul dan dossier tidak sepakat, rujukan otoritatif untuk angka adalah JSON/CSV pada commit di atas; rujukan otoritatif untuk putusan adalah entri yang lebih baru di register dan auditnya. Perbedaan tersebut harus dicatat sebagai pembaruan katalog, bukan diam-diam dirapikan.

Artefak bucket yang dijelaskan di atas berfungsi sebagai petunjuk pemeriksaan tambahan. Ia baru dapat mengubah atlas bila konfigurasi, split, evaluator, dan artefak testnya dapat direkonstruksi, lalu hasilnya diberi sumber/tanggal bucket secara eksplisit dan diaudit kembali. Cabang PT-E berbeda: ia berasal dari commit Git `c19906bbfbb4`, sehingga setiap node dapat diaudit sebagai sumber versioned yang terpisah dari snapshot V2 `225faaeb`.

## Referensi

[1]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/README.md "project-expertise README pada commit 225faaeb"
[2]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/experiments/EKSPERIMEN.md "Register eksperimen project-expertise"
[3]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/counting_v2repro.json "Hasil counting reproduksi tiga detektor"
[4]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/docs/LAPORAN-AKHIR.md "Laporan akhir dan batas audit project-expertise"
[5]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/boot_sel6_vs_sel5.json "Bootstrap monocular depth 953"
[6]: https://huggingface.co/buckets/ULM-DS-Lab/project-expertise-backup "ULM-DS-Lab/project-expertise-backup — storage bucket pelengkap, diinventaris 15 Agu 2026"
[7]: https://huggingface.co/docs/hub/en/storage-buckets "Dokumentasi Hugging Face Storage Buckets — object storage mutable dan non-versioned"
[8]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/EKSPERIMEN.md "Register eksperimen pipeline per-tandan"
[9]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/STATUS.md "Status board dan gerbang bukti pipeline per-tandan"
[10]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/experiments/EKSPERIMEN.md "Register V2-E pada commit terbaru"
[11]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/EKSPERIMEN.md "Register PT-E pada commit terbaru"
[12]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/PERFORMANCE_WAVE_2026-08-28.md "Lembar bukti GSP, re-ranking, dan gelombang validasi"
[13]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/NEW763_RGBD4_RESULTS.md "Ablasi RGB+D4 dan fixed late fusion"
[14]: https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/ANALISIS_PIPELINE_MENDALAM.md "Analisis mendalam dan audit administrasi ID eksperimen"

<!-- AUTO_CATALOG_START -->
## Lampiran A — Katalog Artefak yang Dapat Diaudit

Lampiran ini digenerasi dari pohon Git pada commit yang dinyatakan di bagian identitas. Setiap tautan file memakai commit tersemat, sehingga isinya tidak bergerak ketika cabang `main` berubah. Katalog sengaja memisahkan narasi, hasil terstruktur, dan kode. Payload anotasi per-gambar tidak direntangkan ribuan baris; ia diringkas sebagai kelompok direktori dan dapat dibuka dari pohon commit.

### Snapshot Volume 2 — commit `225faaeb`

| Inventaris | Jumlah | Keterangan |
|---|---:|---|
| Seluruh path Git | 149 | [Buka pohon commit](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/225faaeb) |
| Dokumen naratif / log | 16 | Markdown, TXT, atau RST di luar payload anotasi |
| Hasil terstruktur | 65 | JSON, CSV, Parquet, atau NPZ di luar payload anotasi |
| Kode dan konfigurasi | 50 | Python, shell, YAML, TOML, atau notebook |
| Payload anotasi atau citra dikelompokkan | 0 | Diwakili direktori agar catalogue tetap dapat dibaca |

### Dokumen Naratif dan Log

- [`CLAUDE.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/CLAUDE.md)
- [`README.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/README.md)
- [`docs/CATATAN-TEKNIS-FASE1.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/docs/CATATAN-TEKNIS-FASE1.md)
- [`docs/DATASET.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/docs/DATASET.md)
- [`docs/DIAGNOSIS-DEPTH.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/docs/DIAGNOSIS-DEPTH.md)
- [`docs/LAPORAN-AKHIR.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/docs/LAPORAN-AKHIR.md)
- [`docs/REGENERASI.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/docs/REGENERASI.md)
- [`docs/REKAP.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/docs/REKAP.md)
- [`docs/RENCANA.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/docs/RENCANA.md)
- [`docs/REPRODUKSI-FASE6.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/docs/REPRODUKSI-FASE6.md)
- [`docs/SCHEMA-PERTREE.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/docs/SCHEMA-PERTREE.md)
- [`experiments/EKSPERIMEN.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/experiments/EKSPERIMEN.md)
- [`experiments/STATUS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/experiments/STATUS.md)
- [`requirements-freeze.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/requirements-freeze.txt)
- [`splits_fase6/pretrain953_images.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/splits_fase6/pretrain953_images.txt)
- [`splits_fase6/pretrain953_trees.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/splits_fase6/pretrain953_trees.txt)

### Hasil Terstruktur — JSON, CSV, Parquet, NPZ

- [`results/boot_sel3_vs_sel1.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/boot_sel3_vs_sel1.json)
- [`results/boot_sel3_vs_sel2.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/boot_sel3_vs_sel2.json)
- [`results/boot_sel4_vs_sel2.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/boot_sel4_vs_sel2.json)
- [`results/boot_sel4_vs_sel3.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/boot_sel4_vs_sel3.json)
- [`results/boot_sel6_vs_sel5.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/boot_sel6_vs_sel5.json)
- [`results/bootstrap_ci_352.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/bootstrap_ci_352.json)
- [`results/bootstrap_lokalisasi.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/bootstrap_lokalisasi.json)
- [`results/bootstrap_map.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/bootstrap_map.json)
- [`results/bootstrap_map_awal.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/bootstrap_map_awal.json)
- [`results/bucket_prune_2026-08-12.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/bucket_prune_2026-08-12.json)
- [`results/counting_rgb352.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/counting_rgb352.json)
- [`results/counting_rgbd352.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/counting_rgbd352.json)
- [`results/counting_twostage.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/counting_twostage.json)
- [`results/counting_v2repro.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/counting_v2repro.json)
- [`results/detektor_pilihan.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/detektor_pilihan.json)
- [`results/detektor_pilihan_v2.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/detektor_pilihan_v2.json)
- [`results/detektor_pilihan_v3.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/detektor_pilihan_v3.json)
- [`results/detektor_pilihan_v4.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/detektor_pilihan_v4.json)
- [`results/eval_sel3_352_rgbmono_test.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/eval_sel3_352_rgbmono_test.json)
- [`results/eval_sel4_352_rgbedgemono_test.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/eval_sel4_352_rgbedgemono_test.json)
- [`results/eval_sel5_953_rgb_test.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/eval_sel5_953_rgb_test.json)
- [`results/eval_sel6_953_rgbmono_test.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/eval_sel6_953_rgbmono_test.json)
- [`results/fase6_classifier.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/fase6_classifier.json)
- [`results/fase6_ringkas.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/fase6_ringkas.json)
- [`results/matrix_compiled.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/matrix_compiled.json)
- [`results/pergeseran_temporal.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pergeseran_temporal.json)
- [`results/perkelas_pycoco_rgb352.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/perkelas_pycoco_rgb352.json)
- [`results/perkelas_pycoco_rgbd352.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/perkelas_pycoco_rgbd352.json)
- [`results/perkelas_pycoco_v2repro.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/perkelas_pycoco_v2repro.json)
- [`results/pred_agn4ch_test.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_agn4ch_test.npz)
- [`results/pred_agn953_bersih.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_agn953_bersih.npz)
- [`results/pred_agn953_penuh.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_agn953_penuh.npz)
- [`results/pred_agnrgb_test.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_agnrgb_test.npz)
- [`results/pred_edge_test.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_edge_test.npz)
- [`results/pred_edge_val.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_edge_val.npz)
- [`results/pred_rgb352_test.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_rgb352_test.npz)
- [`results/pred_rgb352_val.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_rgb352_val.npz)
- [`results/pred_sel3_352_rgbmono_test.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_sel3_352_rgbmono_test.npz)
- [`results/pred_sel4_352_rgbedgemono_test.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_sel4_352_rgbedgemono_test.npz)
- [`results/pred_sel5_953_rgb_test.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_sel5_953_rgb_test.npz)
- [`results/pred_sel6_953_rgbmono_test.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/pred_sel6_953_rgbmono_test.npz)
- [`results/probe_fitur_depth.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/probe_fitur_depth.json)
- [`results/probe_mono_vs_sensor.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/probe_mono_vs_sensor.json)
- [`results/riwayat_epoch/sel3_352_rgbmono__results.csv`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/riwayat_epoch/sel3_352_rgbmono__results.csv)
- [`results/riwayat_epoch/sel4_352_rgbedgemono__results.csv`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/riwayat_epoch/sel4_352_rgbedgemono__results.csv)
- [`results/riwayat_epoch/sel6_953_rgbmono__results.csv`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/riwayat_epoch/sel6_953_rgbmono__results.csv)
- [`results/sweep_inferensi.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/sweep_inferensi.json)
- [`results/sweep_inferensi_v2.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/sweep_inferensi_v2.json)
- [`results/sweep_inferensi_v3.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/sweep_inferensi_v3.json)
- [`results/sweep_inferensi_v4.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/sweep_inferensi_v4.json)
- [`results/test953_bersih.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/test953_bersih.json)
- [`results/tiff_korup.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/tiff_korup.json)
- [`results/tiff_korup_setelah_perbaikan.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/tiff_korup_setelah_perbaikan.json)
- [`results/twostage_final.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/twostage_final.json)
- [`results/twostage_final_v2.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/twostage_final_v2.json)
- [`results/twostage_final_v3.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/twostage_final_v3.json)
- [`results/twostage_final_v4.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/twostage_final_v4.json)
- [`results/twostage_small_ens3_tta.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/twostage_small_ens3_tta.json)
- [`results/twostage_tiny_ens3.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/twostage_tiny_ens3.json)
- [`results/twostage_tiny_ens3_mk.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/twostage_tiny_ens3_mk.json)
- [`results/twostage_v4_ulang.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/twostage_v4_ulang.json)
- [`results/twostage_v4_ulang.pred.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/twostage_v4_ulang.pred.npz)
- [`results/val_curve_sel5_953_rgb_v2repro.csv`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/val_curve_sel5_953_rgb_v2repro.csv)
- [`splits_fase6/agnostic_ringkas.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/splits_fase6/agnostic_ringkas.json)
- [`splits_fase6/pretrain953_meta.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/splits_fase6/pretrain953_meta.json)

### Kode, Konfigurasi, dan Notebook

- [`results/riwayat_epoch/sel3_352_rgbmono__args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/riwayat_epoch/sel3_352_rgbmono__args.yaml)
- [`results/riwayat_epoch/sel4_352_rgbedgemono__args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/riwayat_epoch/sel4_352_rgbedgemono__args.yaml)
- [`results/riwayat_epoch/sel6_953_rgbmono__args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/results/riwayat_epoch/sel6_953_rgbmono__args.yaml)
- [`scripts/adapters/common_pertree.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/adapters/common_pertree.py)
- [`scripts/adapters/rfdetr_to_pertree.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/adapters/rfdetr_to_pertree.py)
- [`scripts/adapters/rtdetr_to_pertree.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/adapters/rtdetr_to_pertree.py)
- [`scripts/adapters/yolo_to_pertree.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/adapters/yolo_to_pertree.py)
- [`scripts/bootstrap_ci.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/bootstrap_ci.py)
- [`scripts/bootstrap_map.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/bootstrap_map.py)
- [`scripts/bootstrap_nch.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/bootstrap_nch.py)
- [`scripts/buat_agnostic352_4ch.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/buat_agnostic352_4ch.py)
- [`scripts/buat_dataset_nch.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/buat_dataset_nch.py)
- [`scripts/buat_mono_depth.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/buat_mono_depth.py)
- [`scripts/buat_test_953_bersih.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/buat_test_953_bersih.py)
- [`scripts/build_4ch_dataset.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/build_4ch_dataset.py)
- [`scripts/build_crop_dataset.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/build_crop_dataset.py)
- [`scripts/compile_matrix.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/compile_matrix.py)
- [`scripts/create_depth_edge_dataset.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/create_depth_edge_dataset.py)
- [`scripts/dump_classaware.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/dump_classaware.py)
- [`scripts/eval_all_pycoco_v2repro.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/eval_all_pycoco_v2repro.py)
- [`scripts/eval_detector_agnostic.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/eval_detector_agnostic.py)
- [`scripts/eval_nch.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/eval_nch.py)
- [`scripts/eval_pycoco_352.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/eval_pycoco_352.py)
- [`scripts/eval_pycoco_rgbd352.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/eval_pycoco_rgbd352.py)
- [`scripts/eval_twostage.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/eval_twostage.py)
- [`scripts/fuse_final.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/fuse_final.py)
- [`scripts/jalankan_matriks.sh`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/jalankan_matriks.sh)
- [`scripts/lengkapi_metadata_split.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/lengkapi_metadata_split.py)
- [`scripts/make_absolute_split.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/make_absolute_split.py)
- [`scripts/make_agnostic_dataset.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/make_agnostic_dataset.py)
- [`scripts/make_pretrain_split.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/make_pretrain_split.py)
- [`scripts/materialize_split_dirs.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/materialize_split_dirs.py)
- [`scripts/perbaiki_tiff_korup.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/perbaiki_tiff_korup.py)
- [`scripts/pilih_detektor.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/pilih_detektor.py)
- [`scripts/probe_depth_signal.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/probe_depth_signal.py)
- [`scripts/probe_fitur_depth.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/probe_fitur_depth.py)
- [`scripts/probe_mono_vs_sensor.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/probe_mono_vs_sensor.py)
- [`scripts/probe_pergeseran_temporal.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/probe_pergeseran_temporal.py)
- [`scripts/rantai_xtree953.sh`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/rantai_xtree953.sh)
- [`scripts/run_counting_rgb352.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/run_counting_rgb352.py)
- [`scripts/run_counting_rgbd352.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/run_counting_rgbd352.py)
- [`scripts/run_counting_twostage.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/run_counting_twostage.py)
- [`scripts/run_counting_v2repro.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/run_counting_v2repro.py)
- [`scripts/sweep_inferensi.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/sweep_inferensi.py)
- [`scripts/train_crop_classifier.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/train_crop_classifier.py)
- [`scripts/train_rfdetr_4ch.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/train_rfdetr_4ch.py)
- [`scripts/train_ultra_local.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/train_ultra_local.py)
- [`scripts/train_yolo_4ch_dropout.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/train_yolo_4ch_dropout.py)
- [`scripts/train_yolo_4ch_screening.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/train_yolo_4ch_screening.py)
- [`scripts/train_yolo_midfusion.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/225faaeb/scripts/train_yolo_midfusion.py)

### Payload Anotasi atau Citra yang Dikelompokkan

Tidak ada payload anotasi atau citra yang perlu dikelompokkan.

### Komposisi Ekstensi Pohon Git

| Ekstensi | Jumlah path |
|---|---:|
| `.json` | 48 |
| `.py` | 45 |
| `.log` | 13 |
| `.md` | 13 |
| `.npz` | 13 |
| `.csv` | 4 |
| `tanpa ekstensi` | 4 |
| `.txt` | 3 |
| `.yaml` | 3 |
| `.sh` | 2 |
| `.pt` | 1 |
---

### Cabang pipeline per-tandan — commit `c19906bbfbb4`

| Inventaris | Jumlah | Keterangan |
|---|---:|---|
| Seluruh path Git | 42 | [Buka pohon commit](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/c19906bbfbb4) |
| Dokumen naratif / log | 6 | Markdown, TXT, atau RST di luar payload anotasi |
| Hasil terstruktur | 22 | JSON, CSV, Parquet, atau NPZ di luar payload anotasi |
| Kode dan konfigurasi | 13 | Python, shell, YAML, TOML, atau notebook |
| Payload anotasi atau citra dikelompokkan | 0 | Diwakili direktori agar catalogue tetap dapat dibaca |

### Dokumen Naratif dan Log

- [`pipeline-pertandan/CLAUDE.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/CLAUDE.md)
- [`pipeline-pertandan/EKSPERIMEN.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/EKSPERIMEN.md)
- [`pipeline-pertandan/README.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/README.md)
- [`pipeline-pertandan/STATUS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/STATUS.md)
- [`pipeline-pertandan/docs/HASIL.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/docs/HASIL.md)
- [`pipeline-pertandan/docs/PROPOSAL.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/docs/PROPOSAL.md)

### Hasil Terstruktur — JSON, CSV, Parquet, NPZ

- [`pipeline-pertandan/results/harapan_geser.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/harapan_geser.json)
- [`pipeline-pertandan/results/pred_skorpenuh_352_test.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pred_skorpenuh_352_test.npz)
- [`pipeline-pertandan/results/pred_skorpenuh_352_train.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pred_skorpenuh_352_train.npz)
- [`pipeline-pertandan/results/pred_skorpenuh_352_val.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pred_skorpenuh_352_val.npz)
- [`pipeline-pertandan/results/pred_skorpenuh_test.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pred_skorpenuh_test.npz)
- [`pipeline-pertandan/results/pred_skorpenuh_train.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pred_skorpenuh_train.npz)
- [`pipeline-pertandan/results/pred_skorpenuh_val.npz`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pred_skorpenuh_val.npz)
- [`pipeline-pertandan/results/probe_penautan_953.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/probe_penautan_953.json)
- [`pipeline-pertandan/results/pt_e_001_oracle.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_001_oracle.json)
- [`pipeline-pertandan/results/pt_e_002_penaut.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_002_penaut.json)
- [`pipeline-pertandan/results/pt_e_002_penaut_kontaminasi_fold.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_002_penaut_kontaminasi_fold.json)
- [`pipeline-pertandan/results/pt_e_003_endtoend.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_003_endtoend.json)
- [`pipeline-pertandan/results/pt_e_003_endtoend_tanpa_arah.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_003_endtoend_tanpa_arah.json)
- [`pipeline-pertandan/results/pt_e_003_endtoend_varianB_kelasGT.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_003_endtoend_varianB_kelasGT.json)
- [`pipeline-pertandan/results/pt_e_004_counting.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_004_counting.json)
- [`pipeline-pertandan/results/pt_e_004_counting_tanpa_arah.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_004_counting_tanpa_arah.json)
- [`pipeline-pertandan/results/pt_e_006_baseline_counting.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_006_baseline_counting.json)
- [`pipeline-pertandan/results/pt_e_007_rem_hitung.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_007_rem_hitung.json)
- [`pipeline-pertandan/results/pt_e_009_sapu_conf.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_009_sapu_conf.json)
- [`pipeline-pertandan/results/pt_e_010_uji_352.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_010_uji_352.json)
- [`pipeline-pertandan/results/pt_e_012_c3.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/pt_e_012_c3.json)
- [`pipeline-pertandan/results/validasi_dump_test.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/results/validasi_dump_test.json)

### Kode, Konfigurasi, dan Notebook

- [`pipeline-pertandan/scripts/c3_multitampak.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/c3_multitampak.py)
- [`pipeline-pertandan/scripts/eval_counting.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/eval_counting.py)
- [`pipeline-pertandan/scripts/eval_counting_baseline.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/eval_counting_baseline.py)
- [`pipeline-pertandan/scripts/eval_endtoend.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/eval_endtoend.py)
- [`pipeline-pertandan/scripts/eval_pertandan.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/eval_pertandan.py)
- [`pipeline-pertandan/scripts/eval_rem_hitung.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/eval_rem_hitung.py)
- [`pipeline-pertandan/scripts/infer_skor_penuh.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/infer_skor_penuh.py)
- [`pipeline-pertandan/scripts/penaut_pertandan.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/penaut_pertandan.py)
- [`pipeline-pertandan/scripts/probe_penautan_953.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/probe_penautan_953.py)
- [`pipeline-pertandan/scripts/reid_pertandan.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/reid_pertandan.py)
- [`pipeline-pertandan/scripts/sapu_conf.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/sapu_conf.py)
- [`pipeline-pertandan/scripts/uji_352.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/uji_352.py)
- [`pipeline-pertandan/scripts/validasi_dump.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/scripts/validasi_dump.py)

### Payload Anotasi atau Citra yang Dikelompokkan

Tidak ada payload anotasi atau citra yang perlu dikelompokkan.

### Komposisi Ekstensi Pohon Git

| Ekstensi | Jumlah path |
|---|---:|
| `.json` | 16 |
| `.py` | 13 |
| `.md` | 6 |
| `.npz` | 6 |
| `.png` | 1 |
---

### Batch eksperimen terbaru — commit `74b19c2b641b96d056a728ffecf56cd6ecd648b8`

| Inventaris | Jumlah | Keterangan |
|---|---:|---|
| Seluruh path Git | 841 | [Buka pohon commit](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/74b19c2b641b96d056a728ffecf56cd6ecd648b8) |
| Dokumen naratif / log | 55 | Markdown, TXT, atau RST di luar payload anotasi |
| Hasil terstruktur | 499 | JSON, CSV, Parquet, atau NPZ di luar payload anotasi |
| Kode dan konfigurasi | 225 | Python, shell, YAML, TOML, atau notebook |
| Payload anotasi atau citra dikelompokkan | 0 | Diwakili direktori agar catalogue tetap dapat dibaca |

### Dokumen Naratif dan Log

- [`.agents/rules/perbaikan-bahasa-penyampaian.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/.agents/rules/perbaikan-bahasa-penyampaian.md)
- [`.agents/skills/perbaikan-bahasa-penyampaian/SKILL.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/.agents/skills/perbaikan-bahasa-penyampaian/SKILL.md)
- [`AGENTS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/AGENTS.md)
- [`CLAUDE.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/CLAUDE.md)
- [`HANDOFF.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/HANDOFF.md)
- [`IDEA.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/IDEA.md)
- [`PIPELINE_DAMIMAS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/PIPELINE_DAMIMAS.md)
- [`PROPOSAL-Pipeline.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/PROPOSAL-Pipeline.md)
- [`README.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/README.md)
- [`docs/ANALISIS_PIPELINE_MENDALAM.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/ANALISIS_PIPELINE_MENDALAM.md)
- [`docs/CATATAN-TEKNIS-FASE1.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/CATATAN-TEKNIS-FASE1.md)
- [`docs/DATASET.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/DATASET.md)
- [`docs/DIAGNOSIS-DEPTH.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/DIAGNOSIS-DEPTH.md)
- [`docs/EDA-COMBINED1716.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/EDA-COMBINED1716.md)
- [`docs/LAPORAN-AKHIR.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/LAPORAN-AKHIR.md)
- [`docs/NEW763_BASELINE.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/NEW763_BASELINE.md)
- [`docs/NEW763_RGBD4_DESIGN.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/NEW763_RGBD4_DESIGN.md)
- [`docs/NEW763_RGBD4_RESULTS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/NEW763_RGBD4_RESULTS.md)
- [`docs/REGENERASI.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/REGENERASI.md)
- [`docs/REKAP.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/REKAP.md)
- [`docs/RENCANA.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/RENCANA.md)
- [`docs/REPRODUKSI-FASE6.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/REPRODUKSI-FASE6.md)
- [`docs/SCHEMA-PERTREE.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/SCHEMA-PERTREE.md)
- [`docs/WORKFLOW_KRONOLOGIS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/docs/WORKFLOW_KRONOLOGIS.md)
- [`experiments/EKSPERIMEN.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/experiments/EKSPERIMEN.md)
- [`experiments/STATUS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/experiments/STATUS.md)
- [`pipeline-pertandan/CLAUDE.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/CLAUDE.md)
- [`pipeline-pertandan/EKSPERIMEN.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/EKSPERIMEN.md)
- [`pipeline-pertandan/README.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/README.md)
- [`pipeline-pertandan/STATUS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/STATUS.md)
- [`pipeline-pertandan/docs/HASIL.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/docs/HASIL.md)
- [`pipeline-pertandan/docs/PROPOSAL.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/docs/PROPOSAL.md)
- [`pipeline-pertandan/docs/RINGKASAN-SESI-2026-08-18.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/docs/RINGKASAN-SESI-2026-08-18.md)
- [`requirements-freeze.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/requirements-freeze.txt)
- [`results/local_eval_combined1716_no_lonsum/logs_ringkas/rt-detr-l_e60_bs64.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/local_eval_combined1716_no_lonsum/logs_ringkas/rt-detr-l_e60_bs64.txt)
- [`results/local_eval_combined1716_no_lonsum/logs_ringkas/rt-detr_e60_bs16_4class.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/local_eval_combined1716_no_lonsum/logs_ringkas/rt-detr_e60_bs16_4class.txt)
- [`results/local_eval_combined1716_no_lonsum/logs_ringkas/y26l_e60_b16_4class.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/local_eval_combined1716_no_lonsum/logs_ringkas/y26l_e60_b16_4class.txt)
- [`results/local_eval_combined1716_no_lonsum/logs_ringkas/y26l_e60_bs64_p15.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/local_eval_combined1716_no_lonsum/logs_ringkas/y26l_e60_bs64_p15.txt)
- [`results/local_eval_combined1716_no_lonsum/logs_ringkas/y26x_e60_b16_4class.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/local_eval_combined1716_no_lonsum/logs_ringkas/y26x_e60_b16_4class.txt)
- [`results/local_eval_combined1716_no_lonsum/logs_ringkas/y26x_e60_bs64_p15.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/local_eval_combined1716_no_lonsum/logs_ringkas/y26x_e60_bs64_p15.txt)
- [`results/remote_eval_2026-08-27/MANIFEST.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-27/MANIFEST.md)
- [`results/remote_eval_2026-08-27/OPTIMIZED_PIPELINE.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-27/OPTIMIZED_PIPELINE.md)
- [`results/remote_eval_2026-08-27/PIPELINE_EXPERIMENTS_V3.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-27/PIPELINE_EXPERIMENTS_V3.md)
- [`results/remote_eval_2026-08-27/README.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-27/README.md)
- [`results/remote_eval_2026-08-28/GSP_LINKER.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/GSP_LINKER.md)
- [`results/remote_eval_2026-08-28/MAP_BOOST.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/MAP_BOOST.md)
- [`results/remote_eval_2026-08-28/PERFORMANCE_WAVE_2026-08-28.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/PERFORMANCE_WAVE_2026-08-28.md)
- [`results/remote_eval_2026-08-28/SHA256SUMS.validation_wave.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/SHA256SUMS.validation_wave.txt)
- [`results/remote_eval_2026-08-28/ci_artifacts/CI_SUMMARY.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/ci_artifacts/CI_SUMMARY.md)
- [`results/remote_eval_2026-08-28/validation_wave/WAVE2_RECAP.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/WAVE2_RECAP.md)
- [`results/remote_eval_2026-08-28/validation_wave/ci_artifacts/CI_SUMMARY.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/ci_artifacts/CI_SUMMARY.md)
- [`results/remote_eval_2026-08-28/validation_wave/reports/953_cluster_head_val_bootstrap.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/reports/953_cluster_head_val_bootstrap.md)
- [`results/remote_eval_2026-08-28/validation_wave/reports/depth_cluster_head_val_bootstrap.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/reports/depth_cluster_head_val_bootstrap.md)
- [`splits_fase6/pretrain953_images.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/splits_fase6/pretrain953_images.txt)
- [`splits_fase6/pretrain953_trees.txt`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/splits_fase6/pretrain953_trees.txt)

### Hasil Terstruktur — JSON, CSV, Parquet, NPZ

- [`splits_fase6/agnostic_ringkas.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/splits_fase6/agnostic_ringkas.json)
- [`splits_fase6/pretrain953_meta.json`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/splits_fase6/pretrain953_meta.json)

| Direktori bervolume tinggi | Jumlah path | Inspeksi manual |
|---|---:|---|
| `pipeline-pertandan/` | 112 | [Buka seluruh isi pada commit](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan) |
| `results/` | 385 | [Buka seluruh isi pada commit](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results) |

### Kode, Konfigurasi, dan Notebook

- [`configs/new763_abs.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/configs/new763_abs.yaml)
- [`configs/new763_rgb_abs.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/configs/new763_rgb_abs.yaml)
- [`configs/new763_rgbd4.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/configs/new763_rgbd4.yaml)
- [`pipeline-pertandan/scripts/audit_counting_total_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/audit_counting_total_damimas.py)
- [`pipeline-pertandan/scripts/bangun_crop_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/bangun_crop_damimas.py)
- [`pipeline-pertandan/scripts/c3_multitampak.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/c3_multitampak.py)
- [`pipeline-pertandan/scripts/c_backbone_ordinal.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/c_backbone_ordinal.py)
- [`pipeline-pertandan/scripts/ci_gnn.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/ci_gnn.py)
- [`pipeline-pertandan/scripts/classifier_coral_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/classifier_coral_damimas.py)
- [`pipeline-pertandan/scripts/classifier_deteksi_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/classifier_deteksi_damimas.py)
- [`pipeline-pertandan/scripts/classifier_hibrida_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/classifier_hibrida_damimas.py)
- [`pipeline-pertandan/scripts/classifier_klasik_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/classifier_klasik_damimas.py)
- [`pipeline-pertandan/scripts/counting_catboost_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/counting_catboost_damimas.py)
- [`pipeline-pertandan/scripts/counting_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/counting_damimas.py)
- [`pipeline-pertandan/scripts/counting_multibank_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/counting_multibank_damimas.py)
- [`pipeline-pertandan/scripts/des_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/des_damimas.py)
- [`pipeline-pertandan/scripts/endtoend_gabungan.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/endtoend_gabungan.py)
- [`pipeline-pertandan/scripts/ensemble_bagged_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/ensemble_bagged_damimas.py)
- [`pipeline-pertandan/scripts/ensemble_c.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/ensemble_c.py)
- [`pipeline-pertandan/scripts/ensemble_classifier_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/ensemble_classifier_damimas.py)
- [`pipeline-pertandan/scripts/ensemble_kelas_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/ensemble_kelas_damimas.py)
- [`pipeline-pertandan/scripts/eval_counting.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/eval_counting.py)
- [`pipeline-pertandan/scripts/eval_counting_baseline.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/eval_counting_baseline.py)
- [`pipeline-pertandan/scripts/eval_endtoend.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/eval_endtoend.py)
- [`pipeline-pertandan/scripts/eval_endtoend_global_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/eval_endtoend_global_damimas.py)
- [`pipeline-pertandan/scripts/eval_pertandan.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/eval_pertandan.py)
- [`pipeline-pertandan/scripts/eval_pertandan_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/eval_pertandan_damimas.py)
- [`pipeline-pertandan/scripts/eval_rem_hitung.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/eval_rem_hitung.py)
- [`pipeline-pertandan/scripts/gate_pola_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/gate_pola_damimas.py)
- [`pipeline-pertandan/scripts/gnn_deteksi.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/gnn_deteksi.py)
- [`pipeline-pertandan/scripts/gnn_penaut.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/gnn_penaut.py)
- [`pipeline-pertandan/scripts/infer_skor_penuh.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/infer_skor_penuh.py)
- [`pipeline-pertandan/scripts/jalankan_ide.sh`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/jalankan_ide.sh)
- [`pipeline-pertandan/scripts/laporkan_kepala_linker_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/laporkan_kepala_linker_damimas.py)
- [`pipeline-pertandan/scripts/linker_global_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/linker_global_damimas.py)
- [`pipeline-pertandan/scripts/moe_classifier_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/moe_classifier_damimas.py)
- [`pipeline-pertandan/scripts/moe_view_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/moe_view_damimas.py)
- [`pipeline-pertandan/scripts/penaut_pertandan.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/penaut_pertandan.py)
- [`pipeline-pertandan/scripts/probe_penautan_953.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/probe_penautan_953.py)
- [`pipeline-pertandan/scripts/reid_pertandan.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/reid_pertandan.py)
- [`pipeline-pertandan/scripts/rekonsiliasi_pohon_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/rekonsiliasi_pohon_damimas.py)
- [`pipeline-pertandan/scripts/sapu_ambang_gnn.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/sapu_ambang_gnn.py)
- [`pipeline-pertandan/scripts/sapu_conf.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/sapu_conf.py)
- [`pipeline-pertandan/scripts/set_transformer_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/set_transformer_damimas.py)
- [`pipeline-pertandan/scripts/spesialis_batas_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/spesialis_batas_damimas.py)
- [`pipeline-pertandan/scripts/stacker_damimas.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/stacker_damimas.py)
- [`pipeline-pertandan/scripts/uji_352.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/uji_352.py)
- [`pipeline-pertandan/scripts/validasi_dump.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/pipeline-pertandan/scripts/validasi_dump.py)
- [`results/new763_rgbd4/rtdetr_l_rgbd4_args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/new763_rgbd4/rtdetr_l_rgbd4_args.yaml)
- [`results/new763_rgbd4/yolo26l_rgbd4_args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/new763_rgbd4/yolo26l_rgbd4_args.yaml)
- [`results/remote_eval_2026-08-28/scripts/rank_and_emit.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/scripts/rank_and_emit.py)
- [`results/remote_eval_2026-08-28/scripts/run_test_locked.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/scripts/run_test_locked.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/adaptive_linker.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/adaptive_linker.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/build_submissions_test_locked.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/build_submissions_test_locked.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/ci_bootstrap_test_locked.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/ci_bootstrap_test_locked.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/class_bias_general.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/class_bias_general.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/class_bias_general_bootstrap.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/class_bias_general_bootstrap.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/class_bias_refine.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/class_bias_refine.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/class_bias_sweep.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/class_bias_sweep.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/cluster_head_experiment.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/cluster_head_experiment.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/composition_aware_953.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/composition_aware_953.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/composition_aware_head.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/composition_aware_head.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/count_ensemble_aborted_exhaustive.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/count_ensemble_aborted_exhaustive.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/count_ensemble_fast.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/count_ensemble_fast.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/count_meta_ensemble.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/count_meta_ensemble.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/cross_layer_953.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/cross_layer_953.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/depth_adaptive_v2.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/depth_adaptive_v2.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/e2e_paired_bootstrap.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/e2e_paired_bootstrap.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/e2e_paired_bootstrap_test_locked.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/e2e_paired_bootstrap_test_locked.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/edge_ensemble_gsp_953.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/edge_ensemble_gsp_953.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/extract_aux_crops.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/extract_aux_crops.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/extract_aux_features.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/extract_aux_features.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/extract_large_features.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/extract_large_features.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/gpu_group_head.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/gpu_group_head.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/harness.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/harness.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/head_aware_selection.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/head_aware_selection.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/knn_prototype_head.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/knn_prototype_head.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/large_member_head.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/large_member_head.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/large_stack_class_bias.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/large_stack_class_bias.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/large_stacker.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/large_stacker.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/large_stacker_val_bootstrap.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/large_stacker_val_bootstrap.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/member_head.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/member_head.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/member_head_weighted.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/member_head_weighted.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/member_stacker.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/member_stacker.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/member_validation_bootstrap.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/member_validation_bootstrap.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/multimodal_cluster_head.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/multimodal_cluster_head.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/multiscale_member_head.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/multiscale_member_head.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/multiscale_stacker.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/multiscale_stacker.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/oof_expert_stack.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/oof_expert_stack.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/pipeline_v2.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/pipeline_v2.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/residual_mlp_member.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/residual_mlp_member.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/residual_stack.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/residual_stack.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/rich_count_models.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/rich_count_models.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/side_aware_ordinal.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/side_aware_ordinal.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/stacked_heads.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/stacked_heads.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/timm_extract_features.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/timm_extract_features.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/timm_member_head.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/timm_member_head.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/timm_stack_fusion.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/timm_stack_fusion.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/topology_count_class_bootstrap.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/topology_count_class_bootstrap.py)
- [`results/remote_eval_2026-08-28/validation_wave/scripts/topology_count_class_combo.py`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/remote_eval_2026-08-28/validation_wave/scripts/topology_count_class_combo.py)
- [`results/riwayat_epoch/sel3_352_rgbmono__args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/riwayat_epoch/sel3_352_rgbmono__args.yaml)
- [`results/riwayat_epoch/sel4_352_rgbedgemono__args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/riwayat_epoch/sel4_352_rgbedgemono__args.yaml)
- [`results/riwayat_epoch/sel6_953_rgbmono__args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/riwayat_epoch/sel6_953_rgbmono__args.yaml)
- [`results/riwayat_epoch_combined1716/combined1716_rtdetr_l_rgb_s42_i1280__args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/riwayat_epoch_combined1716/combined1716_rtdetr_l_rgb_s42_i1280__args.yaml)
- [`results/riwayat_epoch_combined1716/combined1716_yolo26l_rgb_s42_i1280__args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/riwayat_epoch_combined1716/combined1716_yolo26l_rgb_s42_i1280__args.yaml)
- [`results/riwayat_epoch_new763/rtdetr_l_rgb_s42_i1280__args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/riwayat_epoch_new763/rtdetr_l_rgb_s42_i1280__args.yaml)
- [`results/riwayat_epoch_new763/yolo26l_rgb_s42_i1280__args.yaml`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/74b19c2b641b96d056a728ffecf56cd6ecd648b8/results/riwayat_epoch_new763/yolo26l_rgb_s42_i1280__args.yaml)

| Direktori bervolume tinggi | Jumlah path | Inspeksi manual |
|---|---:|---|
| `scripts/` | 118 | [Buka seluruh isi pada commit](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/74b19c2b641b96d056a728ffecf56cd6ecd648b8/scripts) |

### Payload Anotasi atau Citra yang Dikelompokkan

Tidak ada payload anotasi atau citra yang perlu dikelompokkan.

### Komposisi Ekstensi Pohon Git

| Ekstensi | Jumlah path |
|---|---:|
| `.json` | 299 |
| `.py` | 209 |
| `.npz` | 167 |
| `.md` | 45 |
| `.log` | 42 |
| `.csv` | 33 |
| `.yaml` | 12 |
| `.txt` | 10 |
| `tanpa ekstensi` | 10 |
| `.png` | 8 |
| `.sh` | 4 |
| `.out` | 1 |
| `.pt` | 1 |
<!-- AUTO_CATALOG_END -->
