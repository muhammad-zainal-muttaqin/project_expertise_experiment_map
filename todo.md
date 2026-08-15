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

- [ ] Hapus label bantuan teknis di atas minimap fullscreen tanpa mengubah posisi dock minimap.
- [ ] Verifikasi minimap tetap tidak bertumpuk dengan lembar bukti.

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
