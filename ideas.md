# Eksplorasi Desain — Project Expertise Experiment Map

## Tiga arah visual

### 1. Field Research Ledger
**Very Brief Intro:** Antarmuka menyerupai buku catatan riset lapangan yang rapi: kertas hangat, tinta hijau tua, dan jejak eksperimen sebagai anotasi marjinal. Arahnya menekankan keterlacakan dan keputusan ilmiah, bukan dashboard generik.
**Probability:** 0.037

### 2. Observatory Atlas
**Very Brief Intro:** Peta eksperimen dibaca seperti konstelasi dalam observatorium data: node bercahaya lembut pada bidang gelap bertekstur, dengan garis keturunan yang membantu penelusuran keputusan. Arahnya terasa investigatif dan padat informasi.
**Probability:** 0.081

### 3. Archive Conveyor
**Very Brief Intro:** Eksperimen disusun sebagai jalur arsip horizontal dari data hingga keputusan, dengan kartu bukti yang terbuka seperti laci katalog. Arahnya editorial, taktil, dan sangat terstruktur.
**Probability:** 0.054

## Arah terpilih — Field Research Ledger

### Design Movement
**Scientific field notebook meets editorial information design.** Peta eksperimen dibangun sebagai halaman kerja peneliti yang telah ditelusuri berulang kali, bukan panel analitik perusahaan.

### Core Principles
1. **Traceable lineage:** setiap node menunjukkan asal dataset, transformasi, run, dan hasil berikut relasinya.
2. **Evidence before decoration:** status hasil, seed, dan metrik selalu lebih dominan daripada ornamen.
3. **Controlled density:** halaman mampu menampung banyak eksperimen tanpa kehilangan jalur baca utama.
4. **Readable uncertainty:** hasil negatif, belum tervalidasi, dan inconclusive dibedakan secara eksplisit dan setara dengan hasil positif.

### Color Philosophy
Basisnya adalah kertas gading hangat dan tinta hijau-hitam untuk memberi rasa arsip lapangan yang tenang. Hijau lumut menandai hasil yang mendukung, terakota menandai hasil negatif atau dihentikan, kuning oker menandai bukti awal, dan biru mineral menandai metode/evaluator. Warna dipakai sebagai bukti status, bukan dekorasi.

### Layout Paradigm
Halaman menggunakan **meja riset dua rel**: rel kiri adalah garis keturunan dataset dan keluarga eksperimen; bidang tengah adalah peta node yang dapat dipan/ditelusuri; rel kanan berubah menjadi lembar detail saat sebuah node dipilih. Kartu ringkasan menempel seperti label indeks di atas, bukan grid dashboard sentral.

### Signature Elements
1. Garis keturunan seperti goresan pensil/benang tipis yang menghubungkan dataset, representasi, run, dan evaluasi.
2. Stempel status berbentuk label arsip kecil: *supported*, *negative*, *inconclusive*, dan *audit needed*.
3. Marker node bernomor dengan cincin metrik sebagai penanda cepat hasil dan multi-seed evidence.

### Interaction Philosophy
Interaksi mengutamakan pemeriksaan: klik node membuka lembar bukti dengan metrik, seed, catatan, dan file artefak. Filter tidak menghapus konteks; node yang tidak cocok hanya diredupkan. Hover memperlihatkan hubungan langsung tanpa mengganggu peta utama.

### Animation
Node dan konektor muncul bertahap dalam urutan lineage dengan transisi opacity dan transformasi singkat 180–240 ms. Pemilihan node menyalakan highlight garis ancestry dengan gerakan ringan. Semua motion dihentikan bagi pengguna yang memilih reduced motion.

### Typography System
**Fraunces** digunakan untuk judul dataset dan heading editorial sebagai karakter riset yang humanis. **IBM Plex Sans** digunakan untuk metadata, metrik, filter, dan tabel karena padat serta mudah dipindai. Hierarki: display 34–44 px, section title 18–22 px, metadata 12–13 px, nilai metrik 20–28 px.

### Brand Essence
**Atlas eksperimen untuk peneliti visi komputer yang ingin menelusuri setiap keputusan, hasil, dan jalan buntu sebagai satu bukti yang utuh.** Kepribadian: teliti, jernih, investigatif.

### Brand Voice
Headlines terdengar seperti catatan penelitian yang tegas dan ringkas; microcopy menjelaskan status bukti tanpa menghakimi. Contoh: “Telusuri keputusan, bukan hanya skor.” dan “Hasil nol tetap merupakan bukti ketika evaluatornya terkunci.”

### Wordmark & Logo
Mark adalah **tiga garis lintasan yang berpotongan pada satu titik observasi**, membentuk huruf abstrak E tanpa teks. Ia melambangkan cabang eksperimen yang kembali ke bukti utama, dan dipakai sebagai favicon serta penanda sidebar.

### Signature Brand Color
**Canopy Ink — #1F4B3A.** Hijau gelap ini menjadi warna identitas, menautkan riset sawit dengan tinta arsip ilmiah.

## Style Decisions

- **Kertas gading hangat** menjadi material permukaan default; Canopy Ink dipusatkan sebagai tinta, garis aturan, label, dan bidang fokus peta.
- Identitas merek memakai tiga lintasan garis yang berpotongan membentuk huruf **E** abstrak; mark hanya menggunakan Canopy Ink, gading, atau warna status bukti.
- Node eksperimen dibaca sebagai **slip bukti** yang dipin pada graph paper: setiapnya membawa marker nomor, cap status, cue dataset/metode, dan benang keturunan yang terlihat.
