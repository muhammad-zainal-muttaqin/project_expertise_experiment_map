# Catatan Audit Bucket Cadangan project-expertise

## Sumber dan batas provenance

- **Bucket:** `ULM-DS-Lab/project-expertise-backup`
- **URL tampilan:** <https://huggingface.co/buckets/ULM-DS-Lab/project-expertise-backup>
- **Metode inventaris:** CLI resmi Hugging Face `hf buckets list … --tree -h -R` dan `hf buckets list … -h -R`, menggunakan token sementara yang diberikan pemilik tanpa menyimpannya ke konfigurasi atau dokumen ini.
- **Waktu inventaris:** 15 Agu 2026 (waktu sandbox).
- **Sifat sumber:** Storage Bucket Hugging Face bersifat **mutable dan non-versioned**. Karena itu, bucket tidak boleh diperlakukan sebagai pengganti commit Git `225faaeb`; setiap fakta tambahan harus diberi label *bukti bucket, waktu inventaris*, bukan *bukti commit-tersemat*.

Dokumentasi resmi menjelaskan bahwa bucket merupakan object storage non-versioned dan mutable; penggunaan utamanya mencakup checkpoint, log, artefak antara, serta koleksi besar. [1]

## Ringkasan inventaris

Inventaris rekursif mencatat **59.929** objek. Direktori akar terbesar adalah `SawitMVC-YOLO` (26.838 objek), `SawitMVC-Depth` (20.120), `mono_png_953` (3.993), `project-expertise` (3.160), `SawitMVC-Depth-4ch-edge` (1.413), `mono_png_352` (1.409), `depth_png_352` (1.409), dan `Research-Pipeline` (998). Koleksi besar gambar, raw, checkpoint, lockfile, dan dependensi tidak akan disalin ke dossier karena tidak menambah pembacaan naratif; aksesnya tetap melalui bucket.

Snapshot `project-expertise/` di bucket memiliki 3.160 path non-dependensi, sedangkan pohon Git pada commit `225faaeb` memiliki 149 path. Terdapat 3.012 path yang hanya muncul pada bucket. Sebagian besar berada di `runs/` (2.903), `runs_fase6/` (86), dan `logs/` (17). Ini menunjukkan bahwa bucket menyimpan run serta payload yang lebih luas daripada snapshot Git yang dipakai atlas, tetapi bukan bukti bahwa semua run tersebut final, konsisten evaluatornya, atau layak dijadikan klaim baru.

## Kandidat bukti tambahan yang perlu dibaca sebelum masuk dossier

Hasil tambahan yang patut dibandingkan dengan narasi Volume 2, karena tidak ada pada pohon commit audit, mencakup:

| Kelompok run bucket | Berkas ringkasan yang tampak | Status awal |
|---|---|---|
| Lini AGN 352/953 | `runs/agn352_4ch/results.csv`, `runs/agn352_ft/results.csv`, `runs/agn352_ft2/results.csv`, `runs/agn352_ft3/results.csv`, `runs/agn352_rtdetr/results.csv`, `runs/agn953_full/results.csv`, `runs/agn953_pre-2/results.csv` | Perlu baca konfigurasi, evaluator, split, dan log sebelum dicatat. |
| Seleksi mono 352/953 | `runs/sel3_352_rgbmono/results.csv`, `runs/sel4_352_rgbedgemono/results.csv`, `runs/sel6_953_rgbmono/results.csv` | Kandidat untuk konteks eksperimen monocular depth; bukan bukti peningkatan tanpa perbandingan setara. |
| Run bertanda tidak valid | `runs/sel3_352_rgbmono_DATA_KORUP_dibuang_0146/results.csv`, `runs/sel3_352_rgbmono_INVALID_batch_turun_oom/results.csv`, `runs/sel4_352_rgbedgemono_INVALID_batch_turun_oom/results.csv`, `runs/sel6_953_rgbmono_INVALID_batch_turun_oom/results.csv` | Harus dipertahankan sebagai kegagalan operasional, tidak boleh dipakai untuk metrik headline. |
| Screening RGB/Depth/edge/fusion | `runs/yolo26l_e60_i1280_rgb352/results.csv`, `runs/yolo26l_e60_i1280_rgbd352_edge/results.csv`, serta run `screening_*352` | Kandidat bukti konfigurasi; perlu memastikan seed, split, dan evaluator sama. |

## Aturan integrasi

1. Gunakan artefak bucket sebagai **sumber tambahan berlabel mutable**, bukan pengganti sumber Git tersemat.
2. Tambahkan angka hanya bila CSV/JSON dapat dibaca, konfigurasi serta evaluasinya dapat diidentifikasi, dan pembandingnya sepadan.
3. Catat run bertanda `INVALID`, `KORUP`, atau gagal sebagai batas/hasil negatif operasional; jangan hitung sebagai trial valid.
4. Tautan bucket harus memuat path eksplisit dan tanggal inventaris dalam narasi, karena isi bucket dapat berubah atau hilang.
5. Bila bukti bucket mengubah simpulan node atlas, buat atau perbarui node bersumber jelas dan lakukan audit artefak sebelum menerbitkan.

## Referensi

[1]: https://huggingface.co/docs/hub/en/storage-buckets "Hugging Face Storage Buckets — non-versioned, mutable object storage"
