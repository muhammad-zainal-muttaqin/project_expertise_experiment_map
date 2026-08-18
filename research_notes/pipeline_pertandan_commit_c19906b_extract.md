# Ekstrak Primer — `pipeline-pertandan` pada `project-expertise` `c19906bbfbb4`

> **Tujuan catatan.** Ini adalah catatan kerja berprovenance untuk memperbarui atlas dan dossier. Angka berasal dari `pipeline-pertandan/EKSPERIMEN.md` dan `STATUS.md` pada checkout lokal `project-expertise` setelah fast-forward ke `c19906bbfbb4`. Gunakan artefak sumber yang ditautkan di setiap entri untuk audit angka.

## Identitas cabang

Cabang `pipeline-pertandan` dimulai 17 Agu 2026. Satuannya adalah tandan fisik pada sebuah pohon: deteksi per sisi, penautan lintas-sisi, lalu keputusan kelas per tandan. Deret ID `PT-E-*` terpisah dari `V2-E-*`. Dataset inti memakai SawitMVC 953 (716/96/141 pohon); replikasi memakai SawitMVC-Depth 352. Sumber umum: [`README.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/README.md), [`EKSPERIMEN.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/EKSPERIMEN.md), dan [`STATUS.md`](https://github.com/muhammad-zainal-muttaqin/project-expertise/blob/c19906bbfbb4/pipeline-pertandan/STATUS.md).

## Register ringkas

| ID | Status yang berlaku | Temuan/angka penentu | Artefak utama |
|---|---|---|---|
| PT-E-000 | Audit dasar | 9.823 tandan unik; penaut geometri test F1 0,4282/ARI 0,3912; recall per-tandan +14,49 pp terhadap per-kemunculan. | `results/probe_penautan_953.json` |
| PT-E-001 | Didukung, G0 lolos | Penggabungan oracle pada pool multi-tampak test +4,36 pp, CI95 [+2,33; +6,25]. | `results/pt_e_001_oracle.json` |
| PT-E-002 | Negatif sebelum prior arah | Varian re-ID out-of-fold terbaik: test F1 0,3979, ARI 0,3292; G1 awal gugur. | `results/pt_e_002_penaut.json` |
| PT-E-003 | Negatif sebelum prior arah | Pipeline utuh R4 0,7124 vs oracle 0,7360; penaut deteksi F1 0,1766; G2 awal gugur, tetapi gain pada pool multi +4,85 pp CI [+2,03; +7,81]. | `results/pt_e_003_endtoend.json` |
| PT-E-004 | Negatif, G3 gugur | Hitung pool C4 macro MAE 3,3422 vs Ridge+F_all C5 1,0542. | `results/pt_e_004_counting.json` |
| PT-E-006 | Didukung sebagai audit masukan | M01 GT test macro MAE 0,3404; deteksi `y26mv2` 1,1826; deteksi YOLO26l conf 0,10: 1,8298. Angka 0,3746 adalah GT, bukan end-to-end. | `results/pt_e_006_baseline_counting.json` |
| PT-E-007 | Negatif | Rem M01 meningkatkan porsi tersatukan test 29,2%→59,3%, tetapi R4 0,7139→0,6872; rem cacah sempurna memberi 0,6454. | `results/pt_e_007_rem_hitung.json` |
| PT-E-008 | Didukung, G1/G2 lolos | Prior arah putar menaikkan penaut GT test F1 0,3979→0,6486; R4 end-to-end 0,7124→0,7179 dan selisih ke oracle −1,81 pp. | `results/harapan_geser.json`, `results/pt_e_002_penaut.json`, `results/pt_e_003_endtoend.json` |
| PT-E-009 | Negatif | Sapu confidence menunjukkan conf 0,10 terbaik untuk akurasi seluruh tandan; test R4 seluruh GT 0,6474; C4 macro MAE 3,6571, C5 1,0542. | `results/pt_e_009_sapu_conf.json` |
| PT-E-010 | Sebagian didukung | 352: penaut deteksi test F1 0,7083/ARI 0,6044; pergeseran recall +9,64 pp; gain kelas oracle +2,85 pp CI [−2,00; +8,24], belum konklusif. | `results/pt_e_010_uji_352.json` |
| PT-E-011 | Audit/koreksi | Hambatan bukan mutu detektor: 953 vs 352 presisi 0,584/0,639 dan recall 0,823/0,739; 953 ~235 pasangan/pohon vs 352 ~28, prevalensi benar ~4% vs ~21%. | `results/pred_skorpenuh{,_352}_test.npz` dan GT |
| PT-E-012 | Negatif | C3 multi-tampak 0,6781, kalah dari C2 0,7087 dan C1 skor detektor+R4 0,7208. | `results/pt_e_012_c3.json` |
| PT-E-013 | Negatif | Rekonstruksi 3D depth+arah AUC 0,4511/0,5083; ΔY AUC 0,6027, tambahan gabungan hanya +0,012 dan tidak diproduksikan. | Probe depth pada dataset 352; skrip dicatat di riwayat sesi sumber. |

## Koreksi yang mengikat

1. PT-E-011 membatalkan diagnosis PT-E-009/010 bahwa kualitas detektor adalah hambatan utama. Diagnosis berlaku sekarang adalah **kepadatan adegan/kombinatorik kandidat**.
2. PT-E-008 mengubah status gerbang: setelah prior arah putar, G1 dan G2 lolos; G3 counting tetap gugur.
3. PT-E-012 dan PT-E-013 merupakan hasil negatif yang menutup C3 skala data ini dan rekonstruksi 3D depth pada protokol pengambilan handheld, bukan penolakan universal terhadap multi-view atau depth.

## Status keseluruhan yang dipakai untuk atlas

G0 lolos (+4,36 pp dengan oracle), G1 dan G2 lolos setelah PT-E-008, G3 gugur (3,4610 vs 1,0542 setelah arah putar). Node harus memakai commit `c19906bbfbb4` dan status terpisah untuk hasil negatif, hasil didukung, serta node audit/koreksi.
