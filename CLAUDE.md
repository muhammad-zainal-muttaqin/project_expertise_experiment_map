# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Ringkasan

Field Research Ledger adalah SPA statis (React 19 + Vite + TypeScript) berisi atlas lineage eksperimen deteksi/counting TBS sawit. Seluruh data riset tersimpan sebagai katalog TypeScript di dalam repositori ini; tidak ada backend, API, atau basis data. Produksi berjalan sebagai artefak statis di GitHub Pages.

## Perintah

| Perintah | Fungsi |
|---|---|
| `pnpm install --frozen-lockfile` | Instalasi dependensi (Node.js 22, sesuai workflow CI). |
| `pnpm dev` | Server pengembangan Vite pada port 3000. |
| `pnpm check` | Pemeriksaan tipe TypeScript. Satu-satunya gerbang otomatis di CI. |
| `pnpm run build:pages` | Build GitHub Pages ke `dist/public` dengan base path repositori. |
| `pnpm build` | Build Vite ditambah bundling `server/index.ts` melalui esbuild. |
| `pnpm preview` | Menyajikan hasil build secara lokal. |
| `python3 scripts/audit_artifacts.py --project-root . --output research_notes/artifact_audit_report.json` | Audit HTTP seluruh path `artifacts` terhadap commit tersemat. |
| `python3 scripts/build_repo_dossier_catalogs.py` | Membangkitkan ulang Lampiran A pada `docs/REPOSITORY-AUDIT-*.md`. |

Tidak ada test runner. `vitest` terdaftar di devDependencies, tetapi tidak ada berkas uji maupun skrip `test`.

Catatan lingkungan Windows: `pnpm run build:pages` gagal karena skrip memakai prefiks `NODE_ENV=production` bergaya POSIX, sedangkan pnpm menjalankan skrip melalui cmd.exe. Gunakan Git Bash, atau di PowerShell jalankan:

```powershell
$env:NODE_ENV = "production"; pnpm exec vite build --mode github-pages
```

Pada mesin ini skrip Python dipanggil dengan `python`, bukan `python3`, karena alias `python3` tidak tersedia.

pnpm 10 tidak lagi membaca field `pnpm.patchedDependencies` dan `pnpm.overrides` dari `package.json`, sehingga patch `wouter` dan override `nanoid` diabaikan pada instalasi lokal. Type check dan build tetap lolos tanpa keduanya.

## Alur wajib sebelum commit

```bash
python3 scripts/audit_artifacts.py --project-root . --output research_notes/artifact_audit_report.json
cp research_notes/artifact_audit_report.json client/src/lib/artifactManifest.json
pnpm check
pnpm run build:pages
```

Langkah salin manifest tidak otomatis. Panel bukti mengimpor `client/src/lib/artifactManifest.json`, sedangkan skrip audit hanya menulis ke `research_notes/`.

## Arsitektur

### Aliran data satu arah

Tiga katalog terpisah di-*spread* ke akhir array `experiments` dalam `experimentData.ts`: `historicalExperiments.ts` (arsip `HD-*`, `HB-*`, `RP-E*`, `RP-F*`), `pipelinePertandanExperiments.ts` (seri `PT-E-*` awal), dan `latestProjectExpertiseExperiments.ts` (lanjutan seri `PT-E-*` beserta simpul `V2-E-*` terbaru). Simpul `V2-E-*` selebihnya dan keempat akar dataset ditulis sebagai literal di dalam `experimentData.ts` itu sendiri. Seluruh UI — peta, filter, lembar bukti, minimap, ekspor PNG — membaca satu array tersebut. Menambah keluarga node baru berarti cukup memasukkannya ke salah satu katalog dengan kontrak `Experiment` yang sama; tidak ada jalur khusus per komponen.

Opsi filter dibangkitkan dari data (`FilterBar.tsx` menurunkan `projectOptions`, `eraOptions`, `phaseOptions` dari array `experiments`), sehingga metadata node yang tidak konsisten langsung muncul sebagai opsi filter baru.

Tidak semua node ditulis sebagai literal. Dari 136 node, 32 di antaranya — seluruh seri `RP-E*` — dibangkitkan oleh `pipelineRecords.map(...)` di `historicalExperiments.ts`, sehingga ID-nya tidak pernah muncul sebagai `id: "RP-E..."` di dalam berkas. Mencari node pada seluruh katalog dengan `grep 'id: "'` hanya menemukan 108 ID — 104 simpul eksperimen literal ditambah empat akar dataset — dan melewatkan seluruh seri itu. Hitung node lewat `experiments.length` atau lewat `pipelineRecords`, bukan lewat pencarian teks. `scripts/audit_artifacts.py` memakai regex yang sama, sehingga seri `RP-E*` juga tidak terbaca olehnya: `artifactManifest.json` hanya memuat 104 ID unik dari 136 node. Akibatnya kedua artefak seri itu (`experiments/README.md` dan `experiments/EKSPERIMEN.md`) selalu jatuh ke cabang terakhir `getArtifactTarget` dan tampil berstatus "Perlu audit", bukan "Terverifikasi". Ini batas yang diketahui, bukan kegagalan audit.

### Posisi peta terpisah dari data node

Field `position` pada `Experiment` wajib secara tipe tetapi **tidak dipakai** oleh peta. Tata letak sebenarnya berasal dari `client/src/lib/atlasLayout.ts`:

- Seri aktif `V2-E-*` memakai koordinat eksplisit di objek `v2Positions`. Node baru harus ditambahkan di sana, atau ia jatuh ke baris residual di bagian bawah kanvas.
- Keluarga arsip ditata otomatis berdasarkan prefiks ID (`PT-E-`, `HD-`, `HB-`, `RP-E`, `RP-F`) melalui `setRow`.
- `atlasLanes` mendefinisikan swimlane; koordinat `v2Positions` harus selaras dengan rentang `y` lane yang dituju.

### Lineage dan penjelasan edge

`parentIds` membentuk graf. `ExperimentGraph.tsx` menghitung `lineageFor` (leluhur) dan `branchFor` (leluhur + turunan, untuk mode fokus), lalu `orthogonalPath` di `atlasLayout.ts` menggambar satu kurva kubik per relasi.

Meskipun simpul seri `RP-E*` dibangkitkan dari `pipelineRecords`, silsilahnya **tidak** boleh ikut dibangkitkan dari urutan array. Induknya ditetapkan eksplisit pada tabel `pipelineParents` di `historicalExperiments.ts`, bersumber dari penanda register `experiments/EKSPERIMEN.md` (`lanjutan [E-NNN]`, `pengganti E-NNN`, gerbang G, blok Konteks yang menyebut SR pendahulu, dan nomor Ide I-NN yang dipakai bersama). Entri tanpa pendahulu eksperimental berlabuh pada `HB-009`, baseline acuan yang oleh register dinyatakan sebagai pembanding seluruh seri. Tabel itu bertipe `Record<PipelineId, string[]>`, sehingga menambah entri pada `pipelineRecords` tanpa menetapkan induknya akan gagal pada `pnpm check`.

Teks tooltip edge **tidak disimpan sebagai data**. `reasonForEdge` menyusunnya secara heuristik dari status anak, selisih `inputs` induk–anak, `phase`, dan perbedaan `era`. Mengubah `inputs` atau `phase` sebuah node akan mengubah narasi hubungan yang tampil.

Narasi lembar bukti mengikuti pola serupa di `client/src/lib/evidenceNarratives.ts`: ada tabel override per ID (`specialNarratives`) dengan *fallback* `classify()` berbasis prefiks ID dan kata kunci `phase`.

### Rantai audit artefak

1. `scripts/audit_artifacts.py` mem-parse kedua katalog TypeScript **dengan regex**, bukan dengan mengeksekusi TypeScript. Pola yang diandalkan: `id: "..."`, `artifacts: [...]`, dan `sourceKey: "..."` yang berada dalam blok teks yang sama antara dua `id:`.
2. Setiap path diuji dengan HEAD (fallback GET) ke `raw.githubusercontent.com` pada commit repositori sumbernya, lalu diberi status `verified`, `unavailable`, `needs-path`, `commit-reference`, atau `needs-audit`.
3. Hasil disalin manual ke `client/src/lib/artifactManifest.json`; `ExperimentDetail.tsx` mencarinya dengan kunci `` `${id}::${artifact}` ``. Tombol Raw/Unduh hanya muncul untuk JSON/CSV berstatus `verified`.

Konsekuensi: jangan merestrukturisasi katalog ke bentuk yang tidak terbaca regex, misalnya memindahkan daftar artefak ke konstanta terpisah, mengganti kutip ganda dengan template literal, atau menyisipkan `id:` lain di dalam blok node. Perubahan seperti itu membuat entri hilang dari audit tanpa pesan galat.

### Commit tersemat empat repositori

Empat repositori sumber dipasangi commit pin, dan commit tersebut diulang di beberapa berkas yang tidak saling mengimpor: `historicalExperiments.ts` (objek `source`), `experimentData.ts`, `ExperimentDetail.tsx` (`defaultSource`), `Home.tsx` (blok `rail-source`), `scripts/audit_artifacts.py` (`DEFAULT_SOURCE`/`HISTORICAL_SOURCES`), `scripts/build_repo_dossier_catalogs.py` (`REPOSITORIES`), README, serta keempat dossier. Pergantian commit harus dilakukan serempak di semua lokasi tersebut, lalu audit dijalankan ulang.

`build_repo_dossier_catalogs.py` membaca checkout lokal pada path Linux (`/home/ubuntu/<repo>`) melalui `git ls-tree`. Skrip tidak berjalan apa adanya di mesin lain tanpa menyesuaikan field `checkout`. Skrip hanya menulis ulang blok di antara `<!-- AUTO_CATALOG_START -->` dan `<!-- AUTO_CATALOG_END -->`; sintesis di luar penanda ditulis manual.

### Biaya render peta

Satu render `ExperimentGraph` menghasilkan 136 kartu node, 201 pasang `path` lineage, dan 151 `rect` minimap. Nilai yang berubah pada setiap frame — posisi gulir, posisi kursor saat menyeret — karena itu tidak boleh disimpan sebagai state React. Persegi `.minimap-viewport` ditulis langsung ke DOM melalui `viewportRectRef` dan digabungkan menjadi satu penulisan per frame oleh `updateViewport`; `zoomRef` menyediakan pembagi terkini tanpa perlu mendaftarkan ulang listener. Mengembalikannya menjadi `useState` akan memunculkan kembali long task 50–80 ms pada setiap kejadian scroll.

### Build, base path, dan aset

`vite.config.ts` menetapkan `root: client/`, alias `@` → `client/src` dan `@shared` → `shared`, serta `base: "/project_expertise_experiment_map/"` hanya pada mode `github-pages`. `App.tsx` menyerahkan base ke wouter lewat `import.meta.env.BASE_URL`. Jangan mengubah base path kecuali nama repositori berubah.

Plugin bawaan scaffold Manus (`jsxLocPlugin`, `vitePluginManusRuntime`, `vitePluginManusDebugCollector`, `vitePluginStorageProxy`) hanya aktif saat `command === "serve"`. Semuanya adalah perkakas editor dan dev server; runtime-nya saja menyisipkan sekitar 360 kB skrip inline ke `index.html` bila ikut terbawa ke build. Jangan memindahkannya kembali ke daftar plugin utama.

Atlas tidak memakai berkas gambar. Identitas visual dibentuk dari gradien CSS: hero dan lembar bukti memakai tekstur gradien pada `index.css` serta `themeReaderFix.css`, dua kartu dataset memakai `.dataset-card--953` dan `.dataset-card--352` di `atlasEnhancements.css`, dan mark merek adalah SVG sebaris di `Home.tsx`. Rujukan `/manus-storage/...` yang lama sudah dihapus karena storage tersebut tidak dapat dijangkau dan berkasnya tidak pernah ada di repositori.

Font Fraunces dan IBM Plex Sans disajikan dari bundel aplikasi. Berkas woff2 berada di `client/src/fonts/` dan dideklarasikan pada `client/src/fonts.css`, yang diimpor paling awal oleh `index.css`. Letaknya sengaja di `src/`, bukan `public/`, supaya Vite menulis ulang URL-nya mengikuti base path GitHub Pages. Keduanya font variabel: satu berkas per subset menanggung seluruh rentang bobot.

`server/index.ts` hanyalah penyaji berkas statis Express untuk `pnpm build` + `pnpm start`; jalur publikasi sebenarnya adalah GitHub Pages. `client/src/const.ts` dan `shared/const.ts` adalah sisa scaffolding template (OAuth/cookie) yang tidak diimpor siapa pun.

### Lapisan tampilan

Permukaan atlas hampir seluruhnya CSS kustom berbasis nama kelas pada lima berkas global: `index.css` (grid tiga-rail, permukaan dasar, dan aturan panel audit artefak), `navigation.css` (peta, minimap, dock, fullscreen), `atlasEnhancements.css` (permukaan ledger, header, filter), `themeReaderFix.css` (kontrak terang/gelap), serta `responsive.css` (penyesuaian lebar sempit dan ponsel). Tailwind v4 dan shadcn/ui (`components/ui/`) tersedia, tetapi komponen atlas tidak memakainya. Perubahan tema harus diuji pada mode terang dan gelap.

Tema dipilih melalui kelas pada elemen root: `html.dark` untuk mode gelap dan `html.ledger-light` untuk mode terang. Warna belum ditokenkan, sehingga setiap nilai ditulis sebagai literal pada aturan terang lalu dinyatakan ulang di bawah `html.dark`.

Hanya `index.css` yang membungkus aturannya dalam `@layer components`; `historical.css`, `navigation.css`, `atlasEnhancements.css`, `themeReaderFix.css`, dan `responsive.css` tidak berlapis. Deklarasi tanpa layer selalu menang atas deklarasi berlapis, berapa pun spesifisitasnya. Akibatnya, satu aturan tanpa prefiks tema di kelima berkas itu mengunci properti pada kedua tema sekaligus dan membatalkan pasangan terang/gelap di `index.css` tanpa peringatan. Setiap kali menambah aturan di sana, tuliskan nilai terang pada selektor polos lalu nyatakan ulang nilai gelapnya di bawah `html.dark`. Saat menyunting, perhatikan bahwa dua aturan dengan selektor sama **saling melengkapi**, bukan saling menimpa: hanya properti yang bertabrakan yang ditimpa. Menghapus aturan yang tampak duplikat dapat menghilangkan properti yang sebenarnya masih hidup — bandingkan properti per selektor terhadap `git show HEAD:` sebelum dan sesudah pembersihan.

Urutan itu **terbalik untuk deklarasi `!important`**: deklarasi penting di dalam `@layer` mengungguli deklarasi penting tanpa layer. Karena itu `html.dark .artifact-actions a { ... !important }` di `index.css` pernah membatalkan aturan bernama sama di `themeReaderFix.css` meskipun yang terakhir tidak berlapis. Bila sebuah pasangan tema memakai `!important`, kedua salinannya harus diselaraskan, bukan hanya salinan yang tidak berlapis.

`index.css` memuat satu blok `@layer components` bernilai tema terang yang ditulis pada **selektor polos tanpa prefiks tema**, termasuk keadaan `:hover`, `.is-active`, dan `.is-selected`. Blok itu berlaku pada kedua tema, sehingga setiap properti yang tidak dinyatakan ulang di bawah `html.dark` pada berkas tak berlapis akan membawa nilai terang ke peta gelap. Keadaan interaktif adalah titik paling mudah terlewat: kartu simpul dan akar dataset sempat berubah menjadi krem saat disorot atau dipilih pada mode gelap sementara tintanya tetap terang. Setelah mengubah warna, ukur kontras pada keadaan diam **dan** keadaan terpilih di kedua tema.

Arah tema sudah ditetapkan: **mode gelap menggelapkan seluruh permukaan** — rail, header, bilah filter, dan lembar bukti ikut memakai Canopy Ink, bukan hanya kanvas peta. Commit `547d051` sempat membalik arah ini menjadi kertas gading yang mengelilingi peta gelap, dan pembalikan itu meninggalkan tinta terang di atas permukaan krem pada belasan selektor. Arah gelap penuh dipulihkan pada commit sesudahnya. Bila suatu saat permukaan kertas hendak dibawa kembali ke mode gelap, seluruh tinta di atasnya harus ikut dibalik dalam satu perubahan, bukan hanya latarnya.

Di bawah 720px `.left-rail` memakai `display:contents`, sehingga `.brand-lockup` dan `.rail-source` menjadi anak langsung `.atlas-layout`. Perbedaannya hanya struktural, bukan warna: karena rail sudah gelap pada semua lebar, tinta terang untuk keduanya cukup ditulis satu kali di lingkup global.

## Konvensi

- Seluruh teks antarmuka, komentar dokumentasi, dan dossier ditulis dalam Bahasa Indonesia baku ragam ilmiah formal (sesuai EYD Edisi V / PUEBI).
- Aturan editorial: node berstatus `negative`, `inconclusive`, dan `audit_needed` tidak boleh dihapus atau dinaikkan statusnya karena metrik sekunder membaik. Untuk memensiunkan hasil lama, tambahkan node audit yang menjelaskan alasannya lalu hubungkan melalui `parentIds`.
- ID bersifat unik dan stabil; ID yang sudah dihapus tidak boleh dipakai ulang.
- Katalog ditulis padat, satu node per beberapa baris panjang. `printWidth` pada `.prettierrc` adalah 80, sehingga `pnpm format` akan menulis ulang katalog dan komponen secara masif. Jalankan hanya bila memang diinginkan, dan jangan pada perubahan kecil.
- Semua `value` metrik berupa string agar format angka gaya paper (koma desimal) tetap terjaga.
- Ubah node pada katalog sumbernya; jangan menambal teks di `ExperimentDetail.tsx` atau `ExperimentGraph.tsx`.

### Standar Bahasa & Penulisan Ilmiah Baku

Seluruh teks narasi, judul, kesimpulan, temuan teknis node, dan label antarmuka (UI) wajib mematuhi kaidah penulisan ilmiah formal (EYD Edisi V / PUEBI):

1. **Prinsip Anti-Calque (Pencegahan Terjemahan Harfiah / Mesin):**
   - Gunakan **"penurunan performa yang signifikan"** atau **"degradasi performa"** (bukan *"kerugian signifikan"* atau *"loss"*).
   - Gunakan **"selang kepercayaan 95% mencakup nilai nol (tidak signifikan secara statistik)"** (bukan *"CI95 memuat nol"*).
   - Gunakan **"tidak menunjukkan keunggulan performa"** atau **"mengalami penurunan"** (bukan *"tidak pernah menang"* atau *"kalah"*).
   - Gunakan **"disimpulkan sebagai peningkatan"** atau **"terbukti meningkatkan"** (bukan *"menyebut kenaikan"*).
   - Gunakan **"kemunculan objek (*appearance*)"** (bukan *"appearance"* mentah).

2. **Notasi Matematika, Statistika, dan Angka:**
   - **Tanda Desimal & Ribuan:** Gunakan tanda koma (`,`) untuk desimal (misal `0,6038`) dan tanda titik (`.`) untuk pemisah ribuan (misal `3.992 citra`, `2.612 objek`).
   - **Tanda Minus Matematis:** Gunakan simbol minus asli `−` (*Unicode U+2212*), bukan tanda hubung keyboard biasa `-`. Contoh: `−0,0476`.
   - **Selang Kepercayaan (*Confidence Interval*):** Tuliskan dengan format `[min; max]` menggunakan kurung siku dan titik koma, contoh: `[−0,0270; +0,0739]`.
   - **Simbol Variabel:** Cetak miring simbol matematis/variabel seperti *$p$-value*, *$n$ sampel*, *IoU*, *$\Delta$ mAP*, *$M_{shuf}$*.
   - **Rentang Satuan:** Gunakan *en dash* (`–`) untuk rentang: `B1–B4`, `10–11 Agu 2026`.

3. **Taksonomi Padanan Istilah Teknis Baku (EYD V / KBBI):**
   - `detector` $\rightarrow$ **detektor**
   - `monocular / monocular-depth` $\rightarrow$ **depth monokular / monokular**
   - `classifier` $\rightarrow$ **pengklasifikasi / model pengklasifikasi**
   - `counting` $\rightarrow$ **pencacahan (*counting*)**
   - `screening` $\rightarrow$ **penyaringan awal (*screening*)**
   - `early stopping / early stop` $\rightarrow$ **penghentian dini (*early stopping*)**
   - `data leakage` $\rightarrow$ **kebocoran data (*data leakage*) / kebocoran partisi data**
   - `ground truth (GT)` $\rightarrow$ **nilai acuan kebenaran (*ground truth*) / data acuan riil**
   - `oracle` $\rightarrow$ **model batas atas teoretis (*oracle*)**
   - `ablation study` $\rightarrow$ **studi ablasi / uji eliminasi komponen**
   - `baseline` $\rightarrow$ **garis dasar pembanding (*baseline*) / model acuan**
   - `bounding box` $\rightarrow$ **kotak pembatas (*bounding box*)**
   - `fine-tuning` $\rightarrow$ **penyesuaian terarah (*fine-tuning*) / adaptasi model**
   - `spatial pooling` $\rightarrow$ **agregasi spasial (*spatial pooling*)**
   - `temporal shift` $\rightarrow$ **pergeseran temporal (*temporal shift*)**
   - `booster detector` $\rightarrow$ **modul penguat (*booster*) detektor**
   - `crop` $\rightarrow$ **citra terpotong (*crop*) / pemotongan objek**
   - `noise` $\rightarrow$ **variasi acak (*noise*) / derau**

4. **Konvensi Terminologi Antarmuka (UI):**
   - *Akar data* $\rightarrow$ **Dataset acuan**
   - *Node / jejak* $\rightarrow$ **Simpul eksperimen**
   - *Status bukti* $\rightarrow$ **Status validitas bukti**
   - *Filter bukti* $\rightarrow$ **Penyaringan bukti**
   - *Alasan lineage* $\rightarrow$ **Rasional relasi silsilah**
   - *Kesimpulan singkat* $\rightarrow$ **Kesimpulan eksekutif**
   - *Cerita kerja* $\rightarrow$ **Narasi metodologi & pembuktian**
   - *Yang dikerjakan* $\rightarrow$ **Rancangan eksperimen**
   - *Bukti yang ditemukan* $\rightarrow$ **Temuan empiris terukur**
   - *Keputusan setelahnya* $\rightarrow$ **Keputusan metodologis**
   - *Batas pembacaan* $\rightarrow$ **Batasan validitas & audit**
   - *Angka utama* $\rightarrow$ **Metrik kuantitatif utama**
   - *Penjelasan teknis* $\rightarrow$ **Catatan sintesis teknis**
   - *Arti istilah* $\rightarrow$ **Glosarium istilah teknis**
   - *File pendukung* $\rightarrow$ **Artefak data pendukung**

5. **Struktur Narasi Empat Bagian (Lembar Bukti):**
   - **Rancangan Eksperimen:** Ringkasan desain eksperimen, konfigurasi input/model, dan komparasi yang dijalankan.
   - **Temuan Empiris Terukur:** Ringkasan kuantitatif terukur dengan signifikansi statistik (*confidence interval*, *p-value*, *bootstrap*).
   - **Keputusan Metodologis:** Implikasi terhadap kelanjutan arah riset.
   - **Batasan Validitas & Audit:** Peringatan audit, asumsi kontrol yang belum tuntas, atau batasan generalisasi.

`docs/MAINTENANCE.md` memuat prosedur rinci: template node siap salin, aturan lineage, penambahan dataset, penghapusan node, dan checklist publikasi.
