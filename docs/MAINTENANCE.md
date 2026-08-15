# Panduan Pemeliharaan Field Research Ledger

Dokumen ini menjelaskan **di mana** informasi atlas disimpan, **bagaimana** menambah atau mengubah penelitian, dan **apa** yang perlu diperiksa sebelum perubahan diterbitkan. Gunakan panduan ini bersama [README utama](../README.md).

> **Aturan editorial:** jangan menghapus hasil negatif, hasil belum konklusif, atau audit hanya karena tidak memperbaiki skor. Status tersebut adalah bagian dari rantai bukti yang membuat keputusan riset dapat diaudit.

## 1. Peta Lokasi Pengeditan

| Kebutuhan | Berkas utama | Berkas terkait | Catatan |
|---|---|---|---|
| Menambah atau mengubah eksperimen aktif | `client/src/lib/experimentData.ts` | `client/src/lib/atlasLayout.ts` | Dipakai untuk seri `V2-E-*` dan katalog utama. |
| Menambah arsip penelitian lama | `client/src/lib/historicalExperiments.ts` | `client/src/lib/atlasLayout.ts` | Gunakan untuk keluarga `HD-*`, `HB-*`, `RP-E*`, atau `RP-F*`. |
| Mengubah posisi/lane node aktif | `client/src/lib/atlasLayout.ts` | `experimentData.ts` | Seri aktif memakai posisi eksplisit `v2Positions`. |
| Mengubah nama, warna, atau status bukti | `client/src/lib/experimentData.ts` | `client/src/index.css` | Perbarui `statusInfo`; warna UI mengikuti kelas status. |
| Menambah dataset baru | `client/src/lib/experimentData.ts` | `Home.tsx`, `atlasLayout.ts` | Perbarui tipe, metadata, root peta, dan kartu panel kiri bila perlu. |
| Mengubah narasi lembar bukti | `client/src/components/ExperimentDetail.tsx` | `experimentData.ts` | Sebagian besar isi berasal dari `conclusion`, `findings`, dan `metrics`. |
| Mengaudit artefak dan status file | `scripts/audit_artifacts.py` | `research_notes/artifact_audit_report.json`, `client/src/lib/artifactManifest.json` | Audit HTTP pada commit tersemat; manifest kedua dipakai oleh panel bukti. |
| Memperbarui dossier audit repositori | `docs/REPOSITORY-AUDIT-*.md` | `scripts/build_repo_dossier_catalogs.py`, `research_notes/repo_inventory/` | Sintesis ditulis manual; lampiran tautan digenerasi dari pohon Git pada commit tersemat. |
| Mengubah navigasi peta/tooltip/minimap | `client/src/components/ExperimentGraph.tsx` | `navigation.css` | Jangan mengubah routing edge tanpa memeriksa mode fokus dan fullscreen. |
| Mengubah tema atau layout tiga-rail | `client/src/index.css` | `atlasEnhancements.css`, `themeReaderFix.css` | Uji terang, gelap, desktop, dan ponsel. |
| Mengubah deploy | `.github/workflows/deploy-pages.yml` | `vite.config.ts` | Base path Pages berada pada konfigurasi Vite. |

## 2. Menambah Eksperimen Baru

### 2.1 Pilih berkas yang benar

Tambahkan penelitian baru yang merupakan kelanjutan proyek aktif ke array `experiments` di `client/src/lib/experimentData.ts`. Tambahkan rekonstruksi dari repositori lampau ke `client/src/lib/historicalExperiments.ts` agar asal arsipnya tetap jelas.

Gunakan ID yang **unik dan stabil**. Jangan menggunakan ulang ID yang telah dihapus karena tautan parent, catatan paper, atau rujukan commit dapat menjadi ambigu.

| Jenis pekerjaan | Lokasi yang disarankan | Pola ID |
|---|---|---|
| Eksperimen SawitMVC aktif | `experimentData.ts` | `V2-E-034`, `V2-E-035`, dan seterusnya |
| Dedup/oracle arsip | `historicalExperiments.ts` | `HD-*` |
| Baseline publik | `historicalExperiments.ts` | `HB-*` |
| Research pipeline | `historicalExperiments.ts` | `RP-E*` atau `RP-F*` |

### 2.2 Salin template node

Salin template berikut ke dalam array yang sesuai, lalu ganti seluruh nilai contoh. Properti `position` wajib secara tipe; posisi peta seri `V2-E-*` sebenarnya dikelola lagi oleh `v2Positions` di `atlasLayout.ts`.

```ts
{
  id: "V2-E-034",
  title: "Judul ringkas eksperimen baru",
  date: "16 Agu 2026",
  phase: "Validasi",
  dataset: "SawitMVC-Depth-352",
  inputs: ["RGB", "Depth", "Counting"],
  model: "Nama model · konfigurasi inti",
  seeds: "3 seed · seed 42/43/44",
  status: "inconclusive",
  conclusion: "Simpulan paling ringkas dan paling aman untuk pembaca awam.",
  findings: "Rincian hasil, keterbatasan, dan alasan mengapa simpulan dibatasi.",
  metrics: [
    { label: "Metrik primer", value: "0,1234", note: "test bersih" },
    { label: "Delta terhadap baseline", value: "+0,0123", note: "baseline V2-E-003" },
  ],
  perClass: [
    { label: "B1/B2/B3/B4", value: "0,00 / 0,00 / 0,00 / 0,00" },
  ],
  confidence: { label: "95% CI", value: "[−0,01; +0,03]" },
  artifacts: [
    "results/nama_hasil.json",
    "experiments/v2_e034_config.yaml",
  ],
  parentIds: ["V2-E-003"],
  position: { x: 0, y: 0 },
  era: "Agu 2026",
  source: {
    repo: "project-expertise",
    commit: "abcdef0",
    url: "https://github.com/muhammad-zainal-muttaqin/project-expertise/commit/abcdef0",
  },
},
```

### 2.3 Isi setiap bidang dengan disiplin

| Bidang | Wajib | Pedoman pengisian |
|---|---:|---|
| `id` | Ya | ID unik, konsisten dengan seri eksperimen. |
| `title` | Ya | Maksimal satu gagasan utama; tampil pada kartu peta. |
| `date`, `phase`, `era` | `date` dan `phase`: ya | Gunakan tanggal dokumentasi eksperimen dan fase riset yang bermakna. |
| `dataset` | Ya | Harus cocok dengan `DatasetId` yang telah didefinisikan. |
| `inputs` | Ya | Gunakan kosakata kanal yang sudah ada bila memungkinkan, misalnya `RGB`, `Depth`, `Edge`, `Mono`, atau `Counting`. |
| `model`, `seeds` | Ya | Catat model, konfigurasi ringkas, dan pengulangan/seed yang benar-benar dijalankan. |
| `status` | Ya | Pilih `supported`, `negative`, `inconclusive`, atau `audit_needed`. |
| `conclusion` | Ya | Klaim paling singkat yang ditopang hasil; hindari klaim lebih luas daripada desain uji. |
| `findings` | Ya | Jelaskan implikasi atau batas paling penting. |
| `metrics` | Ya | Utamakan metrik yang membuktikan simpulan; setiap `value` disimpan sebagai string agar format paper dipertahankan. |
| `artifacts` | Ya | Cantumkan path hasil, konfigurasi, checkpoint, atau laporan yang dapat diaudit. |
| `parentIds` | Ya | ID dataset root atau node pendahulu yang benar-benar menjadi dasar eksperimen. |
| `position` | Ya | Tetap isi untuk memenuhi kontrak data; lihat pengaturan posisi pada Bagian 4. |
| `perClass`, `confidence`, `era`, `source` | Tidak | Isi ketika bukti tersedia; `source` sangat dianjurkan untuk node historis/audit. |

## 3. Menulis Simpulan dan Status Secara Aman

Status dan narasi harus menjawab apa yang diuji, apa hasilnya, apa maknanya, dan apa batasnya. Tabel berikut membantu membedakan empat status yang tersedia.

| Status | Kapan dipakai | Contoh gaya kalimat |
|---|---|---|
| `supported` | Bukti mendukung klaim dalam ruang lingkup desain uji. | “Pada test 352, konfigurasi ini meningkatkan mAP50 sebesar … dibanding baseline yang sama.” |
| `negative` | Varian tidak memperbaiki target atau memberi dampak merugikan. | “Early fusion ini tidak meningkatkan deteksi secara konsisten lintas arsitektur.” |
| `inconclusive` | Efek belum dapat dipastikan karena ketidakpastian, desain, atau cakupan data. | “Hasil mengindikasikan kenaikan, tetapi interval kepercayaan masih mencakup nol.” |
| `audit_needed` | Node memeriksa validitas evaluator, data, split, power, atau batas inferensi. | “Perbandingan ini belum dapat digunakan sebagai bukti efek depth karena evaluator belum seragam.” |

> Jangan mengubah hasil negatif menjadi “didukung” hanya karena satu metrik sekunder membaik. Status harus mengikuti pertanyaan primer dan desain pembanding yang telah ditetapkan.

## 4. Menautkan Lineage dan Menata Peta

`parentIds` membentuk garis lineage. Setiap parent harus menjawab pertanyaan sederhana: **eksperimen atau dataset mana yang menjadi prasyarat langsung bagi keputusan ini?** Satu node boleh memiliki beberapa parent, misalnya eksperimen gabungan yang menggunakan baseline deteksi dan audit evaluator.

```ts
// Lanjutan langsung dari baseline RGB 352.
parentIds: ["V2-E-003"],

// Menggabungkan baseline dan audit evaluator.
parentIds: ["V2-E-003", "V2-E-022"],

// Node awal pada dataset 953.
parentIds: ["dataset-953"],
```

### 4.1 Aturan lineage

| Aturan | Alasan |
|---|---|
| Jangan menautkan node hanya karena topiknya mirip. | Garis harus menyatakan ketergantungan bukti, metode, data, atau evaluator. |
| Hindari siklus parent–child. | Lineage harus tetap dapat dibaca sebagai alur keputusan. |
| Tautkan audit yang mengubah arti hasil. | Contohnya, audit evaluator dapat menjadi parent dari simpulan yang mengoreksi perbandingan lama. |
| Gunakan node dataset root untuk eksperimen fondasi. | Root yang tersedia adalah `dataset-953` dan `dataset-352`. |
| Periksa tooltip edge setelah menambah parent. | Tooltip menjelaskan hubungan; pastikan narasi sumber dan target tetap masuk akal. |

### 4.2 Posisi node dan lane

Seri `V2-E-*` ditata secara eksplisit di objek `v2Positions` dalam `client/src/lib/atlasLayout.ts`. Tambahkan ID baru di sana setelah membuat node supaya berada pada lane yang tepat.

```ts
const v2Positions = {
  // … posisi node yang sudah ada
  "V2-E-034": { x: 2000, y: 918 },
};
```

Peta membaca kemajuan kausal dari kiri ke kanan. Tempatkan eksperimen turunan di kanan parent bila memungkinkan; letakkan audit atau sintesis pada akhir cabang yang diperiksanya. Hindari mengubah urutan global hanya untuk memperpendek satu garis.

Arsip `HD-*`, `HB-*`, `RP-E*`, dan `RP-F*` ditata otomatis berdasarkan prefiks ID. Jika membuat keluarga arsip baru, tambahkan filter dan `setRow` yang sesuai dalam `buildAtlasLayout`, lalu pertimbangkan menambah lane baru di `atlasLanes`.

## 5. Mengubah Informasi Eksperimen yang Sudah Ada

Ubah node asli pada berkas sumbernya; jangan menambal teks di `ExperimentDetail.tsx` atau `ExperimentGraph.tsx`. Komponen akan otomatis menggunakan nilai terbaru dari katalog.

| Perubahan yang dibutuhkan | Tempat diubah | Pemeriksaan tambahan |
|---|---|---|
| Koreksi angka/metrik | `metrics`, `perClass`, atau `confidence` pada node | Pastikan `conclusion` dan `findings` masih konsisten. |
| Koreksi narasi | `conclusion` dan `findings` | Gunakan bahasa berbatas jika desain inferensi belum kuat. |
| Koreksi metadata | `date`, `phase`, `model`, `seeds`, `era`, atau `inputs` | Pastikan filter masih menemukan node pada kategori yang tepat. |
| Koreksi sumber/audit | `artifacts` dan `source` | Pastikan path/URL mengarah ke artefak yang benar. |
| Koreksi hubungan | `parentIds` | Periksa edge, tooltip, mode fokus, dan minimap. |
| Perubahan status | `status` | Periksa label, warna, dan hitungan status di panel kiri. |

Jika hasil lama benar-benar perlu dipensiunkan, jangan langsung menghapusnya. Lebih aman tambahkan node audit atau sintesis yang menerangkan mengapa hasil lama tidak lagi dapat ditafsirkan, lalu hubungkan keduanya lewat lineage.

### 5.1 Audit artefak pada commit sumber

Setiap string di `artifacts` diperlakukan sebagai path relatif pada commit sumber node. Jalankan audit setiap kali path, `source.commit`, atau katalog berubah. Perintah berikut membuat laporan untuk peninjauan dan menyalin manifest identik yang dibaca panel bukti.

```bash
python3 scripts/audit_artifacts.py \
  --project-root . \
  --output research_notes/artifact_audit_report.json
cp research_notes/artifact_audit_report.json client/src/lib/artifactManifest.json
```

| Status laporan | Arti untuk pembaca | Perlakuan editor |
|---|---|---|
| `verified` | Path mengembalikan HTTP 200 dari `raw.githubusercontent.com` pada commit sumber. | Tautan file aktif; JSON/CSV juga menampilkan tombol Raw dan Unduh. |
| `unavailable` | Path mengembalikan HTTP 404 pada commit sumber. | Jangan menyajikan tautan file; perbaiki path atau pertahankan sebagai catatan tidak tersedia. |
| `needs-path` | Artefak memakai pola `*`, sehingga tidak ada file tunggal yang dapat diuji. | Ganti dengan path spesifik bila ingin memberi tautan. |
| `commit-reference` | Artefak merujuk ke commit, bukan file. | Tetap gunakan tautan commit; Raw/Unduh tidak relevan. |
| `needs-audit` | Respons jaringan selain 200/404 atau kegagalan koneksi. | Jalankan ulang audit dan jangan menganggap file tersedia. |

> Status **terverifikasi** hanya menyatakan bahwa berkas dapat diakses pada commit tersebut. Status itu tidak memverifikasi isi berkas, evaluator, atau kekuatan klaim ilmiahnya.

### 5.2 Memperbarui dossier empat repositori

Dossier di `docs/REPOSITORY-AUDIT-*.md` adalah pembacaan panjang untuk membandingkan atlas dengan empat repositori sumber. Bagian sebelum penanda `<!-- AUTO_CATALOG_START -->` adalah **sintesis editorial**: perbarui hanya setelah memeriksa register eksperimen, laporan, JSON/CSV, dan audit primer. Jangan mengganti hasil negatif, audit, atau catatan GT-fix dengan ringkasan “terbaik” semata.

Lampiran A setiap dossier dibuat ulang dari pohon Git pada commit yang tertulis di identitas dokumen. Skrip sengaja mengelompokkan direktori bervolume tinggi—misalnya arsip run, prediksi per instance, atau payload anotasi—sebagai tautan ke pohon commit. Pengelompokan ini menjaga akses inspeksi lengkap tanpa menghasilkan puluhan ribu baris tautan individual.

```bash
python3 scripts/build_repo_dossier_catalogs.py
```

| Bila berubah | Tindakan aman |
|---|---|
| Commit sumber di atlas | Perbarui commit pada dossier dan konfigurasi `REPOSITORIES` dalam generator; pastikan checkout lokal ada pada commit tersebut; lalu jalankan generator. |
| Hasil/metrik pada sumber | Baca kembali artefak primer, perbarui sintesis dan referensi dossier; kemudian sinkronkan node atlas bila simpulan memang berubah. |
| Struktur file sumber | Jalankan generator agar Lampiran A mengikuti pohon terbaru yang disematkan. |
| Banyak file baru dalam satu direktori | Pertahankan pengelompokan jika direktori melewati batas katalog; tambahkan tautan langsung ke artefak prioritas pada bagian “Artefak Inspeksi Prioritas”. |

> Dossier tidak menggantikan laporan hasil primer. Jika ada perbedaan, JSON/CSV/log pada commit tersemat adalah rujukan untuk angka; register atau audit terbaru pada commit yang sama adalah rujukan untuk status dan batas interpretasi.

## 6. Menambah atau Mengubah Dataset

Dataset baru memerlukan perubahan di lebih dari satu lokasi. Urutan aman adalah memperluas tipe terlebih dahulu, lalu metadata dan akar peta.

1. Tambahkan nama dataset ke tipe `DatasetId` di `experimentData.ts`.
2. Tambahkan entri ringkas dan warna ke `datasetInfo`.
3. Tambahkan root baru ke `datasetRoots`, termasuk `id`, `label`, `detail`, dan posisi awal.
4. Tambahkan posisi root ke `buildAtlasLayout` dalam `atlasLayout.ts`.
5. Tambahkan kartu ringkasan pada panel kiri di `Home.tsx` jika dataset harus tampil sebagai akar utama.
6. Uji filter dataset, root peta, lineage dari root, minimap, dan lembar bukti.

## 7. Menghapus atau Mengarsipkan Node

Penghapusan node dapat merusak lineage. Lebih baik mempertahankan node dengan status audit/batas dan menambahkan simpulan korektif jika data lama masih bermakna historis.

Jika penghapusan benar-benar diperlukan, lakukan semuanya dalam satu perubahan:

1. Hapus objek node dari `experimentData.ts` atau `historicalExperiments.ts`.
2. Hapus ID dari `v2Positions` jika node memakai seri aktif.
3. Cari seluruh `parentIds` yang mengarah ke ID itu dan ganti atau hapus hubungan yang tidak lagi valid.
4. Jalankan pemeriksaan tipe dan buka peta untuk memastikan tidak ada edge kosong atau node residual yang tidak diharapkan.

## 8. Memperbarui Tampilan dan Interaksi

Gunakan tabel ini untuk memilih berkas yang tepat. Hindari meletakkan data eksperimen di CSS atau menggandakan simpulan di komponen UI.

| Target perubahan | Berkas yang digunakan |
|---|---|
| Warna global, grid tiga-rail, tinggi panel | `client/src/index.css` |
| Peta, minimap, tooltip, fullscreen, dock | `client/src/navigation.css` dan `ExperimentGraph.tsx` |
| Permukaan ledger, header, filter | `client/src/atlasEnhancements.css` |
| Perbedaan tema terang/gelap | `client/src/themeReaderFix.css` dan `ThemeContext.tsx` |
| Ringkasan awam/metrik lembar bukti | `ExperimentDetail.tsx` |
| Filter/pencarian | `FilterBar.tsx` dan data `inputs`/metadata node |

Saat menambah istilah input yang benar-benar baru—misalnya kanal sensor baru—tambahkan juga ke `allInputs` dalam `experimentData.ts` agar filter kanal mengenalinya. Untuk istilah yang hanya variasi penulisan, gunakan istilah yang sudah ada agar filter tetap bersih.

## 9. Checklist Sebelum Menerbitkan

Jalankan perintah berikut dari root repositori.

```bash
python3 scripts/audit_artifacts.py --project-root . --output research_notes/artifact_audit_report.json
cp research_notes/artifact_audit_report.json client/src/lib/artifactManifest.json
pnpm check
pnpm run build:pages
```

Lalu lakukan pemeriksaan manual berikut.

| Area | Pertanyaan yang harus dijawab |
|---|---|
| Data | Apakah ID unik, status tepat, metrik terbaca, sumber/artifak benar, dan simpulan tidak melampaui bukti? |
| Lineage | Apakah semua parent ada, edge tidak membentuk hubungan palsu, dan tooltip edge menjelaskan alasannya? |
| Peta | Apakah node berada pada lane yang masuk akal, dapat di-*drag*/zoom, dan terlihat di minimap? |
| Filter | Apakah pencarian, dataset, status, kanal, repositori, era, serta keluarga riset menemukan node baru? |
| Bukti | Apakah lembar bukti normal dan fullscreen menampilkan isi yang sama? |
| Responsif | Apakah peta, panel kiri, dan dock bukti bekerja pada desktop serta ponsel? |
| Tema | Apakah terang dan gelap memiliki kontras yang terbaca? |
| Publikasi | Apakah build Pages sukses sebelum *push* ke `main`? |

## 10. Publikasi ke GitHub Pages

Workflow `.github/workflows/deploy-pages.yml` menerbitkan atlas setiap ada *push* ke branch `main`. Workflow memasang dependensi dari lockfile, menjalankan pemeriksaan tipe, menjalankan `pnpm run build:pages`, kemudian mengunggah `dist/public` ke GitHub Pages.

```bash
git status
git add client/src/lib/experimentData.ts client/src/lib/atlasLayout.ts
git add README.md docs/MAINTENANCE.md
git commit -m "docs: tambahkan V2-E-034 ke atlas"
git push origin main
```

Jangan mengubah `base: mode === "github-pages" ? "/project_expertise_experiment_map/" : "/"` di `vite.config.ts` kecuali nama repositori atau jalur publikasi berubah. Perubahan base path yang tidak selaras akan menyebabkan aset atau rute gagal dimuat di GitHub Pages.

## Referensi Internal

| Dokumen/berkas | Kegunaan |
|---|---|
| [README utama](../README.md) | Gambaran proyek, instalasi, fitur, dan arsitektur. |
| `client/src/lib/experimentData.ts` | Kontrak data, katalog utama, status, dataset, dan kosakata input. |
| `client/src/lib/historicalExperiments.ts` | Arsip penelitian lintas repositori. |
| `client/src/lib/atlasLayout.ts` | Lane, posisi, dan routing lineage. |
| `client/src/components/ExperimentGraph.tsx` | Interaksi peta dan navigasi. |
| `.github/workflows/deploy-pages.yml` | Validasi dan deploy GitHub Pages. |
