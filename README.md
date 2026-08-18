# Field Research Ledger — Atlas Eksperimen SawitMVC

**Field Research Ledger** adalah atlas eksperimen interaktif untuk menelusuri keputusan riset deteksi dan *counting* tandan buah segar (TBS) kelapa sawit. Alih-alih hanya menyajikan skor akhir, aplikasi ini menyimpan hubungan antareksperimen, hasil negatif, batas inferensi, metrik, artefak pendukung, dan asal commit dalam satu peta lineage yang dapat dijelajahi.

Atlas publik tersedia di [GitHub Pages](https://muhammad-zainal-muttaqin.github.io/project_expertise_experiment_map/).

> **Prinsip utama:** sebuah hasil negatif, audit, atau hasil belum konklusif adalah bukti riset yang perlu dapat ditelusuri—bukan catatan yang dihilangkan.

## Cakupan Atlas

Atlas menggabungkan katalog eksperimen aktif dan arsip historis dari empat repositori. Setiap node merepresentasikan satu eksperimen, audit, atau formulasi yang memiliki identitas, konteks, status, metrik, simpulan, dan hubungan lineage yang eksplisit.

| Sumber | Peran di atlas | Contoh identitas node |
|---|---|---|
| `project-expertise` | Volume 2 SawitMVC-Depth, audit, *monocular depth*, dan cabang pipeline per-tandan | `V2-E-001`–`V2-E-033`, `PT-E-*` |
| `Research-Pipeline` | Riwayat pipeline, diagnosis sensor, serta formulasi | `RP-E*`, `RP-F*` |
| `Baseline-SawitMVC` | Baseline dan pembandingan metode | `HB-*` |
| `research-method-dedup` | Eksperimen deduplikasi dan oracle historis | `HD-*` |

Dataset utama yang ditampilkan adalah **SawitMVC 953** dan **SawitMVC-Depth 352**. Katalog mencakup hasil yang didukung, negatif, belum konklusif, dan audit/batas inferensi.

## Dossier Audit Empat Repositori

Selain atlas interaktif, empat dossier Markdown menyediakan pembacaan tekstual yang lebih panjang. Masing-masing dossier memakai commit sumber yang sama dengan node atlas, merangkum pertanyaan, eksperimen, metrik, keputusan, hasil negatif, dan batas interpretasi. Lampiran yang digenerasi otomatis memberi tautan inspeksi untuk dokumen, JSON/CSV/NPZ, kode, konfigurasi, serta direktori bervolume tinggi pada pohon Git yang dipasangi pin.

| Repositori | Dossier teks | Commit audit | Cakupan khusus |
|---|---|---|---|
| `project-expertise` | [Buka dossier](docs/REPOSITORY-AUDIT-PROJECT-EXPERTISE.md) | [`225faaeb`](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/225faaeb) + [`c19906bbfbb4`](https://github.com/muhammad-zainal-muttaqin/project-expertise/tree/c19906bbfbb4/pipeline-pertandan) | Volume 2, depth sensor, dua tahap, monocular depth, audit validitas, dan pipeline per-tandan PT-E. |
| `Research-Pipeline` | [Buka dossier](docs/REPOSITORY-AUDIT-RESEARCH-PIPELINE.md) | [`4aa9ad6`](https://github.com/muhammad-zainal-muttaqin/Research-Pipeline/tree/4aa9ad6) | Literatur, register seri E/F, benchmark RGB final, serta audit RGB-D. |
| `Baseline-SawitMVC` | [Buka dossier](docs/REPOSITORY-AUDIT-BASELINE-SAWITMVC.md) | [`ee2f0ac`](https://github.com/ULM-SawitMVC/Baseline-SawitMVC/tree/ee2f0ac) | Baseline deteksi→counting, oracle GT, dan matriks counter. |
| `research-method-dedup` | [Buka dossier](docs/REPOSITORY-AUDIT-RESEARCH-METHOD-DEDUP.md) | [`a720f17`](https://github.com/muhammad-zainal-muttaqin/research-method-dedup/tree/a720f17) | Deduplikasi, audit GT, oracle counting, dan eksperimen E2E historis. |

> **Cara memakai dossier:** gunakan ringkasan di bagian utama untuk orientasi, lalu buka artefak pada Lampiran A ketika ingin memeriksa angka, konfigurasi, log, atau path sumber tertentu. Direktori yang berisi ribuan hasil otomatis dikelompokkan dalam satu tautan pohon commit agar teks tetap dapat dibaca tanpa menyembunyikan sumbernya.

## Fitur Utama

| Fitur | Cara penggunaan | Manfaat pembacaan |
|---|---|---|
| **Peta lineage** | Klik node atau arahkan pointer ke garis penghubung. | Memahami eksperimen pendahulu, turunan, dan alasan hubungan. |
| **Lembar bukti** | Node terpilih tampil pada panel kanan. | Membaca ringkasan awam, metrik, batas, artefak, dan sumber audit. |
| **Audit artefak & akses data** | Perhatikan badge file di lembar bukti; gunakan **Raw** atau **Unduh** pada JSON/CSV yang terverifikasi. | Membedakan file yang tersedia pada commit sumber dari path 404, pola belum spesifik, atau rujukan commit. |
| **Pencarian & filter** | Gunakan teks bebas serta filter dataset, status, kanal, repositori, era, dan keluarga riset. | Menemukan eksperimen atau cabang tertentu tanpa menelusuri seluruh peta. |
| **Zoom, drag, dan minimap** | Tarik latar peta, gunakan roda/`Ctrl` + roda, atau klik minimap. | Menavigasi atlas besar secara cepat. |
| **Mode fokus cabang** | Aktifkan ikon fokus setelah memilih node. | Menyembunyikan jalur lain untuk membaca satu silsilah eksperimen. |
| **Layar penuh** | Gunakan ikon layar penuh pada toolbar peta. | Memperluas peta; lembar bukti lengkap dapat dibuka sebagai dock kanan. |
| **Panel kiri dapat dilipat** | Klik **Sembunyikan** pada header. | Memberi ruang lebih luas untuk peta tanpa kehilangan akses untuk memulihkan panel data. |
| **Tema terang/gelap** | Klik kontrol tema pada header. | Menyesuaikan kondisi membaca sambil menjaga warna status dan kontras. |
| **Ekspor PNG** | Klik ikon unduh pada toolbar peta. | Menyimpan tampilan peta saat ini dalam PNG beresolusi tinggi. |

## Cara Membaca Status

Status adalah bagian dari bukti, bukan penilaian kualitas peneliti. Warna dan label status dipakai konsisten pada node, filter, minimap, dan lembar bukti.

| Status | Arti |
|---|---|
| **Didukung** | Bukti pada eksperimen tersebut mendukung simpulan yang dicatat. |
| **Negatif** | Variasi yang dicoba tidak memberikan peningkatan atau menunjukkan kerugian pada konteks pengujiannya. |
| **Belum konklusif** | Bukti belum cukup untuk menarik simpulan kuat, misalnya karena interval ketidakpastian atau keterbatasan desain. |
| **Audit / batas** | Node yang menguji kualitas data, evaluator, desain inferensi, atau batas generalisasi. |

## Menjalankan Secara Lokal

Proyek memakai React, TypeScript, Vite, Tailwind CSS, dan `pnpm`. Gunakan Node.js 22 agar sejalan dengan workflow CI.

```bash
git clone https://github.com/muhammad-zainal-muttaqin/project_expertise_experiment_map.git
cd project_expertise_experiment_map
pnpm install --frozen-lockfile
pnpm dev
```

Setelah server aktif, Vite akan menampilkan URL lokal. Untuk pemeriksaan sebelum *commit*, jalankan:

```bash
pnpm check
pnpm run build:pages
```

| Perintah | Fungsi |
|---|---|
| `pnpm dev` | Menjalankan server pengembangan Vite. |
| `pnpm check` | Menjalankan pemeriksaan tipe TypeScript tanpa menghasilkan berkas keluaran. |
| `pnpm run build:pages` | Membangun artefak statis untuk GitHub Pages pada `dist/public`. |
| `pnpm build` | Menjalankan build produksi standar. |
| `pnpm preview` | Menyajikan hasil build Vite secara lokal. |
| `pnpm format` | Memformat berkas dengan Prettier. |

## Audit Artefak

Atlas tidak hanya menyimpan nama artefak. Setiap path diaudit terhadap **commit sumber yang dipasangi pin**, lalu hasilnya disimpan sebagai manifest statis agar tetap dapat dibaca di GitHub Pages. Audit saat ini mencakup 119 entri katalog: 107 file terverifikasi, 5 path tidak tersedia, 6 pola yang belum menunjuk ke satu berkas, dan 1 rujukan commit. Cabang PT-E pada commit `c19906bbfbb4` menyumbang 29 artefak dan seluruhnya terverifikasi.

| Badge panel | Makna | Akses yang diberikan |
|---|---|---|
| **Terverifikasi** | Raw GitHub mengembalikan HTTP 200 pada commit sumber. | Tautan file; JSON dan CSV juga mempunyai **Raw** serta **Unduh**. |
| **Tidak tersedia** | Path mengembalikan HTTP 404 pada commit sumber. | Tidak ada tautan yang berpotensi rusak; panel menjelaskan statusnya. |
| **Perlu audit** | Path masih berupa pola beberapa berkas atau respons belum dapat dipastikan. | Tidak ada Raw/Unduh hingga path tunggal dapat diverifikasi. |
| **Rujukan commit** | Entri menunjuk commit, bukan berkas tertentu. | Tautan ke halaman commit saja. |

Jalankan perintah berikut setelah mengubah `artifacts`, `source.commit`, atau katalog historis. Perintah pertama membangun laporan yang dapat ditinjau; perintah kedua menyegarkan manifest yang diimpor antarmuka.

```bash
python3 scripts/audit_artifacts.py \
  --project-root . \
  --output research_notes/artifact_audit_report.json
cp research_notes/artifact_audit_report.json client/src/lib/artifactManifest.json
```

> **Batas penting:** badge **Terverifikasi** hanya membuktikan bahwa berkas dapat diakses pada commit tersebut. Ia tidak menilai kebenaran isi berkas, keseragaman evaluator, maupun kekuatan simpulan ilmiah. Lihat [Panduan Pemeliharaan Atlas](docs/MAINTENANCE.md) untuk alur audit dan penanganan path yang lebih rinci.

## Struktur Proyek

```text
client/
  src/
    components/
      ExperimentGraph.tsx       # Kanvas SVG, zoom, drag, lineage, minimap, fullscreen, PNG
      ExperimentDetail.tsx      # Lembar bukti pembaca dan metrik teknis
      FilterBar.tsx             # Pencarian serta filter multidimensi
    contexts/
      ThemeContext.tsx          # Tema terang/gelap dan preferensi browser
    lib/
      experimentData.ts         # Kontrak data dan katalog eksperimen utama
      historicalExperiments.ts  # Arsip node historis dan provenance commit
      pipelinePertandanExperiments.ts # Cabang PT-E pada commit project-expertise terbaru
      artifactManifest.json     # Status artefak yang dihasilkan audit dan dibaca panel
      atlasLayout.ts            # Swimlane, posisi node, dan routing edge
    pages/
      Home.tsx                  # Komposisi tiga-rail atlas
    index.css                   # Token dasar dan layout utama
    navigation.css              # Interaksi peta, minimap, dock, dan fullscreen
    atlasEnhancements.css       # Permukaan ledger serta kontrol baca
    themeReaderFix.css          # Kontrak mode terang dan gelap
.github/workflows/
  deploy-pages.yml              # Validasi dan deploy GitHub Pages
scripts/
  audit_artifacts.py            # Audit path raw GitHub pada commit tersemat
  build_repo_dossier_catalogs.py # Pembuat lampiran tautan artefak empat dossier
research_notes/
  artifact_audit_report.json    # Laporan audit artefak yang dapat ditinjau
```

## Memelihara Katalog Eksperimen

Tambahkan atau perbarui node di `client/src/lib/experimentData.ts`. Arsip dari repositori terdahulu berada di `client/src/lib/historicalExperiments.ts`. Gunakan kontrak data yang sama supaya peta, filter, lembar bukti, minimap, dan ekspor PNG dapat membaca node baru tanpa jalur khusus.

Untuk prosedur lengkap—termasuk contoh node siap salin, pengaturan lineage, posisi peta, pembaruan dataset, penghapusan node, dan checklist publikasi—lihat **[Panduan Pemeliharaan Atlas](docs/MAINTENANCE.md)**.

Keempat dossier repository berada di `docs/REPOSITORY-AUDIT-*.md`. Mereka adalah lapisan pembacaan/audit, bukan sumber data yang dipakai langsung aplikasi; perubahan simpulan atlas tetap harus dilakukan pada katalog TypeScript, lalu diselaraskan secara sadar di dossier terkait.

| Bidang | Kegunaan |
|---|---|
| `id` | Identitas stabil eksperimen, misalnya `V2-E-034`. |
| `title` dan `phase` | Judul pembaca dan tahap riset yang terlihat pada node/panel. |
| `dataset`, `input`, `repository`, `era` | Metadata untuk filter dan konteks. |
| `status` | Kategori bukti: didukung, negatif, belum konklusif, atau audit/batas. |
| `metrics` | Nilai teknis yang tampil pada lembar bukti. |
| `conclusion` dan `findings` | Ringkasan hasil serta batas yang perlu diingat pembaca. |
| `parentIds` | Hubungan lineage dengan node pendahulu. |
| `source` dan `artifacts` | Commit, file, atau artefak yang memungkinkan audit ulang. |

Sesudah mengubah `artifacts` atau `source`, jalankan audit artefak dan salin manifest sebagaimana dijelaskan pada bagian **Audit Artefak**. Panel akan otomatis menampilkan status terbaru serta menawarkan Raw/Unduh hanya untuk JSON/CSV yang benar-benar tersedia pada commit sumber.

Saat menambahkan hubungan baru, pastikan `parentIds` hanya mengacu pada node yang benar-benar ada dan alasan hubungan dapat dijelaskan secara ilmiah. Garis lineage bukan sekadar konektor visual; ia menyatakan ketergantungan data, metode, evaluasi, atau audit antara dua keputusan riset.

## Deploy GitHub Pages

Workflow `.github/workflows/deploy-pages.yml` dijalankan pada setiap *push* ke branch `main` atau secara manual melalui `workflow_dispatch`. Workflow memasang dependensi dengan lockfile, menjalankan `pnpm run check`, membangun artefak dengan `pnpm run build:pages`, lalu menerbitkan `dist/public` ke GitHub Pages.

Konfigurasi Vite memakai base path `/project_expertise_experiment_map/` hanya untuk mode `github-pages`. Jangan mengganti base path tersebut kecuali nama repositori atau lokasi publikasi berubah.

## Kontribusi dan Pemeriksaan

Sebelum mengajukan perubahan, pastikan data tetap dapat diaudit, label tetap berbahasa Indonesia, dan hasil negatif tidak dihapus dari katalog. Lakukan pemeriksaan tipe serta build Pages; kemudian uji setidaknya pencarian/filter, pemilihan node, mode fokus, layar penuh, pergantian tema, dan ekspor PNG.

```bash
python3 scripts/audit_artifacts.py --project-root . --output research_notes/artifact_audit_report.json
cp research_notes/artifact_audit_report.json client/src/lib/artifactManifest.json
pnpm check
pnpm run build:pages
```

## Referensi

[1]: https://github.com/muhammad-zainal-muttaqin/project-expertise "Repositori project-expertise"
[2]: https://github.com/muhammad-zainal-muttaqin/Research-Pipeline "Repositori Research-Pipeline"
[3]: https://github.com/ULM-SawitMVC/Baseline-SawitMVC "Repositori Baseline-SawitMVC"
[4]: https://github.com/muhammad-zainal-muttaqin/research-method-dedup "Repositori research-method-dedup"
[5]: https://muhammad-zainal-muttaqin.github.io/project_expertise_experiment_map/ "Field Research Ledger di GitHub Pages"
