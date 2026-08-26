# Perluasan Riwayat Eksperimen SawitMVC

- [x] Clone dan inventaris struktur, dokumen, hasil, serta riwayat commit `Research-Pipeline`.
- [x] Clone dan inventaris struktur, dokumen, hasil, serta riwayat commit `Baseline-SawitMVC`.
- [x] Clone dan inventaris struktur, dokumen, hasil, serta riwayat commit `research-method-dedup`.
- [x] Ekstrak hanya eksperimen yang telah benar-benar dijalankan, dengan metrik, seed, status, dan artefak sumber.
- [x] Buat pemetaan lineage yang memisahkan bukti historis SawitMVC-953 dari fase terkini project-expertise dan SawitMVC-Depth-352.
- [x] Integrasikan node historis serta tautan sumber spesifik ke atlas interaktif.
- [x] Verifikasi cakupan katalog, build, dan tampilan desktop/mobile.
- [x] Simpan checkpoint perluasan riwayat dan sampaikan hasil.

## Navigasi Peta

- [x] Tambahkan drag/grab untuk menggeser kanvas dengan mouse, touch, dan trackpad.
- [x] Tambahkan zoom in, zoom out, reset, serta indikator skala yang dapat diakses keyboard.
- [x] Tambahkan mode layar penuh khusus peta beserta cara keluar yang jelas.
- [x] Verifikasi peta dapat dinavigasi pada desktop dan layar kecil.
- [x] Simpan checkpoint navigasi peta dan sampaikan hasil.

## Tata Letak dan Lineage

- [x] Audit node berderajat tinggi, edge panjang, persilangan, dan klaster yang terlalu padat.
- [x] Kelompokkan eksperimen ke jalur pertanyaan riset dan era yang lebih jelas.
- [x] Terapkan posisi bertingkat serta routing ortogonal/berkoridor untuk mengurangi garis silang.
- [x] Verifikasi peta pada desktop dan ponsel.
- [x] Simpan checkpoint tata letak baru dan sampaikan hasil.

## Navigasi dan Keterjelasan Lineage

- [x] Definisikan alasan hubungan untuk setiap jenis edge lineage yang telah diaudit.
- [x] Tambahkan tooltip/panel hover edge yang menjelaskan node asal, node tujuan, dan alasan keterhubungan.
- [x] Tambahkan minimap interaktif untuk melompat ke lane dan era riset.
- [x] Tambahkan mode fokus cabang untuk menyembunyikan node serta edge di luar lineage terpilih.
- [x] Verifikasi kontrol baru pada desktop dan ponsel.
- [x] Simpan checkpoint fitur navigasi dan sampaikan hasil.

## GitHub Pages

- [x] Periksa respons halaman GitHub Pages dan konfigurasi Vite saat ini.
- [x] Pastikan base path, rujukan aset, dan fallback SPA kompatibel dengan subpath repositori.
- [x] Tambahkan workflow build dan deploy GitHub Actions untuk GitHub Pages.
- [x] Verifikasi build produksi dan deploy pertama pada URL Pages.

## Skill dan Eksplorasi Atlas

- [x] Inisialisasi serta dokumentasikan skill reusable untuk audit repositori, katalog eksperimen, lineage, dan deployment atlas.
- [x] Tambahkan pencarian teks lintas ID, judul, model, dataset, dan repositori.
- [x] Tambahkan filter interaktif untuk era, repositori, serta keluarga riset.
- [x] Tambahkan toggle tema gelap dan terang yang mempertahankan material Field Research Ledger.
- [x] Tambahkan ekspor tampilan kanvas peta saat ini sebagai PNG beresolusi tinggi.
- [x] Validasi skill dan uji fitur baru pada desktop serta ponsel.
- [x] Simpan checkpoint fitur eksplorasi dan sampaikan hasil.

## Tema dan Penjelasan Awam

- [x] Audit kelas tema dan token CSS yang mencegah tampilan gelap diterapkan secara menyeluruh.
- [x] Perbaiki toggle tema dan pastikan preferensi tersimpan secara konsisten.
- [x] Tambahkan ringkasan awam: apa yang dicoba, hasilnya, maknanya, dan batasannya pada lembar detail.
- [x] Sederhanakan label serta istilah teknis di panel detail tanpa menghapus metrik sumber.
- [x] Uji tema dan keterbacaan panel detail pada desktop serta ponsel.
- [ ] Simpan checkpoint perbaikan pengalaman baca dan sampaikan hasil.

## Perbaikan Garis Lineage

- [x] Audit path SVG, offset koridor, dan urutan layer untuk edge yang terlihat putus atau bertumpuk.
- [x] Perbaiki generator path agar setiap koneksi memakai belokan kontinu dengan koridor yang tidak saling bertabrakan.
- [x] Pastikan hit-area tooltip mengikuti path yang sama tanpa menciptakan artefak visual.
- [x] Verifikasi kontinuitas garis pada desktop dan ponsel; simpan checkpoint routing.

## Konsistensi Tema

- [x] Audit permukaan, teks, batas, dan kontrol yang masih memakai token tema berlawanan.
- [x] Bedakan kontrak warna mode terang dan gelap untuk rel, filter, lembar bukti, node, serta peta.
- [x] Verifikasi pergantian tema pada desktop dan ponsel; simpan checkpoint perbaikan.

## Bukti dalam Layar Penuh

- [x] Audit state eksperimen terpilih dan struktur kontrol layar penuh.
- [x] Tambahkan lembar bukti ringkas yang muncul di dalam peta layar penuh.
- [x] Verifikasi interaksi pilih node, baca ringkasan, dan tutup panel pada desktop serta ponsel.

## Integrasi Panel Bukti Lengkap

- [x] Hapus duplikasi ringkasan fullscreen dan pakai ulang lembar bukti utama di dalam mode layar penuh.
- [x] Sediakan kontrol buka/tutup panel tanpa mengubah data atau struktur pembuktian.
- [x] Verifikasi konsistensi isi panel biasa dan panel fullscreen pada kedua tema.

## Tata Letak Bukti dan Minimap

- [x] Audit rantai tinggi kontainer pada tampilan normal agar lembar bukti memakai seluruh ruang baca.
- [x] Buat lembar bukti normal penuh-tinggi dengan area isi yang dapat digulir secara mandiri.
- [x] Dock atau kecilkan minimap ketika lembar bukti fullscreen terbuka agar keduanya tidak saling menutup.
- [x] Verifikasi tata letak pada tema terang, gelap, dan layar penuh.

## Penyederhanaan Minimap

- [x] Hapus label bantuan teknis di atas minimap fullscreen tanpa mengubah posisi dock minimap.
- [x] Verifikasi minimap tetap tidak bertumpuk dengan lembar bukti.

## Audit Label Bantuan

- [x] Inventarisasi semua label bantuan dan anotasi orientasi yang terlihat pada atlas.
- [x] Kelompokkan label yang esensial bagi navigasi dan label yang dapat dihapus.

## Tooltip Edge Kontekstual

- [x] Audit perhitungan titik tooltip saat ini terhadap koordinat hover dan zoom peta.
- [x] Tempatkan tooltip di dekat pointer/segmen edge yang sedang di-hover dengan batas aman layar.
- [x] Verifikasi tooltip pada zoom serta mode layar penuh.

## Panel Kiri Dapat Disembunyikan

- [x] Audit struktur tiga-rail dan breakpoint yang mengatur panel kiri.
- [x] Tambahkan kontrol sembunyikan/tampilkan panel kiri dengan status yang jelas.
- [x] Verifikasi peta melebar, panel dapat dipulihkan, dan tampilan ponsel tetap aman.

## Dokumentasi Proyek

- [x] Audit perintah, struktur data, fitur, dan konfigurasi deploy yang harus tercantum di README.
- [x] Tulis README berbahasa Indonesia untuk menjalankan, menjelajahi, dan memelihara atlas.
- [x] Validasi instruksi README terhadap skrip proyek serta alur GitHub Pages.

## Panduan Pemeliharaan Atlas

- [x] Audit kontrak eksperimen, arsip historis, tata letak, dan titik konfigurasi yang perlu dijelaskan.
- [x] Tambahkan panduan langkah demi langkah untuk menambah, mengubah, menghapus, dan mengaudit eksperimen.
- [x] Sertakan contoh node, aturan lineage, checklist validasi, serta alur publikasi GitHub Pages.
- [x] Validasi contoh panduan terhadap tipe dan skrip proyek.

## Pengayaan Cerita Panel Bukti

- [x] Inventarisasi dokumen primer, register eksperimen, hasil, dan commit dari project-expertise, Research-Pipeline, Baseline-SawitMVC, serta research-method-dedup.
- [x] Rekonstruksi tujuan, kerja konkret, output/bukti, dampak, dan batas untuk node aktif maupun arsip.
- [x] Rancang kontrak narasi panel kanan yang membedakan eksperimen, inventaris, audit, dan sintesis.
- [x] Terapkan cerita sumber pada katalog eksperimen dan verifikasi keterbacaannya di panel normal serta fullscreen.

## Tautan Artefak Primer

- [x] Audit bentuk data artefak dan URL fallback pada panel bukti.
- [x] Bentuk URL GitHub file spesifik menggunakan repositori, commit, dan path artefak.
- [x] Verifikasi beberapa artefak dari empat repositori dan tampilkan fallback yang transparan bila perlu.

## Audit Artefak dan Akses Data

- [x] Inventarisasi serta normalisasi seluruh artefak dari katalog aktif dan historis.
- [x] Audit keberadaan path pada commit sumber dan hasilkan manifest status verifikasi.
- [x] Tambahkan indikator status serta tombol Raw dan Unduh untuk artefak JSON/CSV yang tersedia.
- [x] Buat skill reusable untuk mengaudit serta memetakan artefak bersumber commit.
- [x] Validasi panel, build Pages, manifest audit, dan skill reusable.

## Penyelarasan README Audit Artefak

- [x] Tambahkan ringkasan status verifikasi artefak dan tindakan Raw/Unduh ke README.
- [x] Tambahkan perintah audit Python serta tautan ke panduan pemeliharaan rinci.
- [x] Tinjau, simpan checkpoint, dan sampaikan pembaruan dokumentasi.

## Dossier Audit Empat Repositori

- [x] Inventarisasi isi, struktur, riwayat, eksperimen, dan artefak primer pada empat commit sumber.
- [x] Tulis dossier lengkap `project-expertise` dengan metrik, keputusan, batas, dan tautan artefak inspeksi.
- [x] Tulis dossier lengkap `Research-Pipeline` dengan riwayat eksperimen dan dokumen sumber.
- [x] Tulis dossier lengkap `Baseline-SawitMVC` dengan baseline, konfigurasi, dan bukti evaluasi.
- [x] Tulis dossier lengkap `research-method-dedup` dengan metode deduplikasi, oracle, dan pembuktian terkait.
- [x] Selaraskan indeks, tautan inspeksi, dan klaim dossier dengan atlas serta validasi Markdown.
- [x] Simpan checkpoint dan sampaikan empat dossier audit.

## Audit Bucket Cadangan

- [x] Inventarisasi bucket cadangan project-expertise dengan provenance dan ukuran artefak.
- [x] Bandingkan artefak bucket dengan commit audit dan identifikasi bukti tambahan yang substantif.
- [x] Perbarui dossier hanya dengan tambahan yang dapat diverifikasi serta beri label sumber bucket.
- [x] Validasi tautan, provenance, dan ringkasan temuan bucket.

## Pemeriksaan Akses project-expertise

- [x] Verifikasi checkout lokal, remote, commit aktif, dan akses baca ke project-expertise.
- [x] Sampaikan status akses serta commit yang tersedia untuk langkah riset berikutnya.

## Pembaruan project-expertise

- [x] Catat commit checkout sebelum pembaruan dan kondisi worktree.
- [x] Tarik tiga commit terbaru dari remote project-expertise secara fast-forward.
- [x] Inventarisasi perubahan dan nilai dampaknya pada dossier, artefak, serta atlas.
- [x] Sampaikan commit baru dan ringkasan pembaruan.

## Perbaikan HMR artifactAudit.css

- [x] Periksa sumber error, impor stylesheet, dan log Vite yang terkait.
- [x] Perbaiki sintaks atau referensi stylesheet yang gagal dimuat ulang.
- [x] Verifikasi HMR, pemeriksaan tipe, dan build Pages.
- [x] Simpan checkpoint serta sampaikan perbaikan.

## Integrasi Run Terbaru project-expertise

- [x] Inventarisasi run, dokumentasi, skrip, dan hasil dari commit `a8f6569` hingga `c19906b`.
- [x] Verifikasi metrik, split, evaluator, status gerbang, serta batas klaim PT-E baru.
- [x] Tambahkan eksperimen dan lineage PT-E ke katalog serta narasi panel atlas.
- [x] Selaraskan dossier project-expertise, audit artefak, dan indeks sumber commit terbaru.
- [x] Validasi data, tampilan, HMR, TypeScript, dan build Pages.
- [x] Simpan checkpoint dan sampaikan pembaruan atlas.

## Perbaikan Clipping Bilah Filter

- [x] Periksa batas lebar, grid, dan breakpoint kontrol pencarian serta dataset.
- [x] Sesuaikan tata letak filter agar label dan selector tidak terpotong pada lebar sempit.
- [x] Verifikasi keterbacaan desktop, panel sempit, dan ponsel; lalu uji build.
- [x] Simpan checkpoint dan sampaikan perbaikan clipping.

## Pembaruan Eksperimen Terbaru project-expertise

- [x] Bandingkan commit sumber terbaru dengan commit project-expertise yang telah dipetakan pada atlas.
- [x] Ekstrak eksperimen, metrik, keputusan, batas, lineage, dan artefak yang benar-benar tercatat.
- [x] Perbarui katalog atlas, narasi bukti, dossier, dan manifest audit berdasarkan sumber tersemat.
- [x] Verifikasi data, tautan artefak, tampilan, serta build GitHub Pages.
- [x] Simpan checkpoint dan sinkronkan pembaruan atlas ke GitHub.

## Perbaikan Kontras dan Teks Antarmuka

- [x] Perbaiki kontras `.rail-source` pada mode gelap tampilan desktop.
- [x] Perbaiki kontras `.filter-disclosure` pada mode gelap tampilan ponsel.
- [x] Lengkapi pasangan tema terang untuk kartu korpus `--763` dan `--combined`.
- [x] Perbaiki label “Combined · 1.716” dan keterangan kartu korpus yang terpotong.
- [x] Turunkan jumlah simpul dan relasi pada panduan penggunaan langsung dari data.

## Audit Kontras Menyeluruh Dua Tema

- [x] Ukur rasio kontras seluruh teks rail, header, filter, lembar bukti, dan peta pada kedua tema.
- [x] Pulihkan tinta gelap pada chip silsilah, glosarium, dan stempel lembar bukti yang berada di atas kertas krem mode gelap.
- [x] Tambahkan pasangan gelap untuk keadaan `:hover`, `.is-active`, dan `.is-selected` kartu simpul serta akar dataset.
- [x] Selaraskan aturan `!important` tombol artefak antara `index.css` dan `themeReaderFix.css`.
- [x] Naikkan tinta sekunder ke ambang WCAG AA 4,5:1 pada kedua tema.
- [x] Verifikasi nol pelanggaran kontras pada lebar desktop dan ponsel untuk kedua tema.
