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

`historicalExperiments.ts` (arsip `HD-*`, `HB-*`, `RP-E*`, `RP-F*`) di-*spread* ke akhir array `experiments` dalam `experimentData.ts`. Seluruh UI — peta, filter, lembar bukti, minimap, ekspor PNG — membaca satu array tersebut. Menambah keluarga node baru berarti cukup memasukkannya ke salah satu katalog dengan kontrak `Experiment` yang sama; tidak ada jalur khusus per komponen.

Opsi filter dibangkitkan dari data (`FilterBar.tsx` menurunkan `projectOptions`, `eraOptions`, `phaseOptions` dari array `experiments`), sehingga metadata node yang tidak konsisten langsung muncul sebagai opsi filter baru.

Tidak semua node ditulis sebagai literal. Dari 93 node, 32 di antaranya — seluruh seri `RP-E*` — dibangkitkan oleh `pipelineRecords.map(...)` di `historicalExperiments.ts`, sehingga ID-nya tidak pernah muncul sebagai `id: "RP-E..."` di dalam berkas. Mencari node dengan `grep 'id: "'` hanya menemukan 61 node dan melewatkan seluruh seri itu. Hitung node lewat `experiments.length` atau lewat `pipelineRecords`, bukan lewat pencarian teks. `scripts/audit_artifacts.py` memakai regex yang sama, sehingga seri `RP-E*` juga tidak terbaca olehnya: `artifactManifest.json` hanya memuat 61 ID unik dari 93 node. Akibatnya kedua artefak seri itu (`experiments/README.md` dan `experiments/EKSPERIMEN.md`) selalu jatuh ke cabang terakhir `getArtifactTarget` dan tampil berstatus "Perlu audit", bukan "Terverifikasi". Ini batas yang diketahui, bukan kegagalan audit.

### Posisi peta terpisah dari data node

Field `position` pada `Experiment` wajib secara tipe tetapi **tidak dipakai** oleh peta. Tata letak sebenarnya berasal dari `client/src/lib/atlasLayout.ts`:

- Seri aktif `V2-E-*` memakai koordinat eksplisit di objek `v2Positions`. Node baru harus ditambahkan di sana, atau ia jatuh ke baris residual di bagian bawah kanvas.
- Keluarga arsip ditata otomatis berdasarkan prefiks ID (`HD-`, `HB-`, `RP-E`, `RP-F`) melalui `setRow`.
- `atlasLanes` mendefinisikan swimlane; koordinat `v2Positions` harus selaras dengan rentang `y` lane yang dituju.

### Lineage dan penjelasan edge

`parentIds` membentuk graf. `ExperimentGraph.tsx` menghitung `lineageFor` (leluhur) dan `branchFor` (leluhur + turunan, untuk mode fokus), lalu `orthogonalPath` di `atlasLayout.ts` menggambar satu kurva kubik per relasi.

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

Satu render `ExperimentGraph` menghasilkan 93 kartu node, 120 pasang `path` lineage, dan 104 `rect` minimap. Nilai yang berubah pada setiap frame — posisi gulir, posisi kursor saat menyeret — karena itu tidak boleh disimpan sebagai state React. Persegi `.minimap-viewport` ditulis langsung ke DOM melalui `viewportRectRef` dan digabungkan menjadi satu penulisan per frame oleh `updateViewport`; `zoomRef` menyediakan pembagi terkini tanpa perlu mendaftarkan ulang listener. Mengembalikannya menjadi `useState` akan memunculkan kembali long task 50–80 ms pada setiap kejadian scroll.

### Build, base path, dan aset

`vite.config.ts` menetapkan `root: client/`, alias `@` → `client/src` dan `@shared` → `shared`, serta `base: "/project_expertise_experiment_map/"` hanya pada mode `github-pages`. `App.tsx` menyerahkan base ke wouter lewat `import.meta.env.BASE_URL`. Jangan mengubah base path kecuali nama repositori berubah.

Plugin bawaan scaffold Manus (`jsxLocPlugin`, `vitePluginManusRuntime`, `vitePluginManusDebugCollector`, `vitePluginStorageProxy`) hanya aktif saat `command === "serve"`. Semuanya adalah perkakas editor dan dev server; runtime-nya saja menyisipkan sekitar 360 kB skrip inline ke `index.html` bila ikut terbawa ke build. Jangan memindahkannya kembali ke daftar plugin utama.

Atlas tidak memakai berkas gambar. Identitas visual dibentuk dari gradien CSS: hero dan lembar bukti memakai tekstur gradien pada `index.css` serta `themeReaderFix.css`, dua kartu dataset memakai `.dataset-card--953` dan `.dataset-card--352` di `atlasEnhancements.css`, dan mark merek adalah SVG sebaris di `Home.tsx`. Rujukan `/manus-storage/...` yang lama sudah dihapus karena storage tersebut tidak dapat dijangkau dan berkasnya tidak pernah ada di repositori.

Font Fraunces dan IBM Plex Sans disajikan dari bundel aplikasi. Berkas woff2 berada di `client/src/fonts/` dan dideklarasikan pada `client/src/fonts.css`, yang diimpor paling awal oleh `index.css`. Letaknya sengaja di `src/`, bukan `public/`, supaya Vite menulis ulang URL-nya mengikuti base path GitHub Pages. Keduanya font variabel: satu berkas per subset menanggung seluruh rentang bobot.

`server/index.ts` hanyalah penyaji berkas statis Express untuk `pnpm build` + `pnpm start`; jalur publikasi sebenarnya adalah GitHub Pages. `client/src/const.ts` dan `shared/const.ts` adalah sisa scaffolding template (OAuth/cookie) yang tidak diimpor siapa pun.

### Lapisan tampilan

Permukaan atlas hampir seluruhnya CSS kustom berbasis nama kelas pada empat berkas global: `index.css` (grid tiga-rail dan permukaan dasar), `navigation.css` (peta, minimap, dock, fullscreen), `atlasEnhancements.css` (permukaan ledger, header, filter), `themeReaderFix.css` (kontrak terang/gelap). Tailwind v4 dan shadcn/ui (`components/ui/`) tersedia, tetapi komponen atlas tidak memakainya. Perubahan tema harus diuji pada mode terang dan gelap.

Tema dipilih melalui kelas pada elemen root: `html.dark` untuk mode gelap dan `html.ledger-light` untuk mode terang. Warna belum ditokenkan, sehingga setiap nilai ditulis sebagai literal pada aturan terang lalu dinyatakan ulang di bawah `html.dark`.

Hanya `index.css` yang membungkus aturannya dalam `@layer components`; `historical.css`, `navigation.css`, `atlasEnhancements.css`, dan `themeReaderFix.css` tidak berlapis. Deklarasi tanpa layer selalu menang atas deklarasi berlapis, berapa pun spesifisitasnya. Akibatnya, satu aturan tanpa prefiks tema di keempat berkas itu mengunci properti pada kedua tema sekaligus dan membatalkan pasangan terang/gelap di `index.css` tanpa peringatan. Setiap kali menambah aturan di sana, tuliskan nilai terang pada selektor polos lalu nyatakan ulang nilai gelapnya di bawah `html.dark`. Saat menyunting, perhatikan bahwa dua aturan dengan selektor sama **saling melengkapi**, bukan saling menimpa: hanya properti yang bertabrakan yang ditimpa. Menghapus aturan yang tampak duplikat dapat menghilangkan properti yang sebenarnya masih hidup — bandingkan properti per selektor terhadap `git show HEAD:` sebelum dan sesudah pembersihan.

## Konvensi

- Seluruh teks antarmuka, komentar dokumentasi, dan dossier ditulis dalam Bahasa Indonesia.
- Aturan editorial: node berstatus `negative`, `inconclusive`, dan `audit_needed` tidak boleh dihapus atau dinaikkan statusnya karena metrik sekunder membaik. Untuk memensiunkan hasil lama, tambahkan node audit yang menjelaskan alasannya lalu hubungkan melalui `parentIds`.
- ID bersifat unik dan stabil; ID yang sudah dihapus tidak boleh dipakai ulang.
- Katalog ditulis padat, satu node per beberapa baris panjang. `printWidth` pada `.prettierrc` adalah 80, sehingga `pnpm format` akan menulis ulang katalog dan komponen secara masif. Jalankan hanya bila memang diinginkan, dan jangan pada perubahan kecil.
- Semua `value` metrik berupa string agar format angka gaya paper (koma desimal) tetap terjaga.
- Ubah node pada katalog sumbernya; jangan menambal teks di `ExperimentDetail.tsx` atau `ExperimentGraph.tsx`.

`docs/MAINTENANCE.md` memuat prosedur rinci: template node siap salin, aturan lineage, penambahan dataset, penghapusan node, dan checklist publikasi.
