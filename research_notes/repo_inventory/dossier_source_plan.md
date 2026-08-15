# Rencana Sumber Dossier Empat Repositori

Dokumen kerja ini menyimpan batas audit dan temuan primer yang akan diringkas ke empat dossier di `docs/`. Sumber dibaca pada commit yang sama dengan atlas; artefak mesin tidak disalin, melainkan ditautkan ke berkas pada commit tersebut.

| Repositori | Commit audit | Peran utama |
|---|---:|---|
| `project-expertise` | `225faaeb` | Volume 2: perbandingan RGB/RGB+D, diagnosis, pipeline dua tahap, monocular depth, dan audit validitas. |
| `Research-Pipeline` | `4aa9ad6` | Volume 1: korpus literatur, register E-001–E-032 dan F-001–F-007, gerbang reproduksi, serta penulisan naskah. |
| `Baseline-SawitMVC` | `ee2f0ac` | Baseline SawitMVC, pipeline prediksi-per-pohon, dan counter berbasis Ridge. |
| `research-method-dedup` | `a720f17` | Deduplikasi, association/oracle lintas-view, dan eksperimen metode pendukung. |

## project-expertise — catatan primer yang sudah dibaca

README pada commit `225faaeb` mendefinisikan tujuan membandingkan YOLO26l, RT-DETR-L, dan RF-DETR-L pada RGB serta RGB+Depth 4-kanal untuk deteksi, kematangan B1–B4, dan counting per pohon. Sejak Fase 6 ruang lingkup berkembang ke diagnosis dan pipeline dua tahap.

Matriks yang dicatat README: pada 953 RGB, mAP50 / Class ±1 Acc masing-masing YOLO26l `0,5435 / 72,16%`, RT-DETR-L `0,5781 / 76,24%`, dan RF-DETR-L `0,6012 / 76,24%`. Pada 352 RGB: `0,3606 / 89,55%`, `0,4343 / 90,91%`, `0,4544 / 88,18%`. Pada 352 RGB+Depth inverse: `0,3919 / 87,73%`, `0,3877 / 88,64%`, `0,4186 / 88,18%`; RGB+Depth edge YOLO26l `0,4316 / 87,27%`; pipeline dua tahap `0,4500 / 85,91%`.

Dua batas utama telah dicatat: 953 dan 352 berasal dari sesi akuisisi terpisah sekitar 80 hari sehingga bukan pembanding efek depth lintas-dataset; dan split test 352 memiliki CI mAP50 95% sekitar ±0,058 pada 410 GT sehingga tidak dapat mengisolasi efek kecil. Uji paired lokalisasi terakhir melaporkan AP50 `0,7636` dengan depth versus `0,7358` tanpa (+0,0278; P(Δ>0)=0,921), tetapi CI mencakup nol.

Register eksperimen utama berada pada `experiments/EKSPERIMEN.md` dan `experiments/STATUS.md`. Bagian yang relevan untuk dossier meliputi: V2-E-001 reproduksi detektor 953; V2-E-002 counting; V2-E-003–007 matriks RGB/RGBD 352; V2-E-008–011 screening encoding dan mid-fusion; V2-E-012–021 diagnosis/pipeline dua tahap; V2-E-022 pergeseran temporal; V2-E-023 daya statistik; V2-E-024–026 kontrol lokalisasi serta CI; V2-E-027–032 matriks monocular-depth; dan V2-E-033 kebocoran split.

Sumber primer yang telah disatukan untuk ekstraksi ulang berada di `project-expertise.primary.md`; inventaris path penuh ada di `project-expertise.all-paths.txt` dan `project-expertise.structured-artifacts.txt`.
