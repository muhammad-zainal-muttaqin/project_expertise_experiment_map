/** Field Research Ledger evidence narrative — turns audited experiment records into reader-facing work stories. */
import type { Experiment } from "@/lib/experimentData";

export interface EvidenceNarrative {
  kind: string;
  work: string;
  evidence: string | null;
  impact: string;
  caution: string | null;
}

const specialNarratives: Record<string, Partial<EvidenceNarrative>> = {
  "RP-E002": {
    kind: "Inventaris data sumber",
    work: "Mencocokkan arsip mentah dengan register SawitMVC: 3.992 JPG raw beresolusi 3024×4032 dan 45 video orbit diperiksa, lalu nama berkas dibandingkan dengan anotasi.",
    evidence:
      "Rasio aspek raw sama dengan citra latih sehingga koordinat YOLO dapat dipakai kembali. Namun terdapat 936 nama berkas ganda, sehingga nama file saja tidak sah untuk memasangkan raw ke anotasi.",
    impact:
      "Eksperimen resolusi tinggi tidak boleh dimulai dari mapping nama file. Kerja berikutnya dialihkan ke matching konten atau tabel pengumpul data; video orbit tetap diprioritaskan sebagai jalur terpisah.",
  },
  "RP-E003": {
    kind: "Probe geometri video",
    work: "Memeriksa satu video orbit untuk melihat apakah pose kamera dapat dipulihkan sebelum merancang association lintas-view.",
    impact:
      "Hasil ini hanya membuka kelayakan probe pose; belum membuktikan bahwa geometri video memperbaiki counting.",
  },
  "RP-E006": {
    kind: "Uji falsifikasi representasi",
    work: "Menguji pseudo-depth sebagai pemisah tandan dan latar, bukan melatih detector baru.",
    impact:
      "Jalur pseudo-depth dihentikan dan tidak dipromosikan menjadi eksperimen detector.",
  },
  "RP-E021": {
    kind: "Benchmark detector final",
    work: "Membandingkan RT-DETR dan RF-DETR dengan protokol evaluasi empat kelas yang sama, lalu menetapkan pembanding detector untuk eksperimen setelahnya.",
    evidence:
      "RF-DETR-L mencapai test mAP50 0,6038 dan mAP50–95 0,2770 pada split pohon 716/96/141.",
    impact:
      "RF-DETR-L menjadi referensi detector Research-Pipeline; angka ini bukan metrik counting tree-level.",
  },
  "RP-E025": {
    kind: "Audit evaluator",
    work: "Menelusuri mengapa dua evaluator memberi angka berbeda dan menguji apakah selisih bertambah mengikuti jumlah deteksi.",
    impact:
      "pycocotools dikunci sebagai protokol pengukuran; hasil dari evaluator lama tidak boleh dicampur tanpa penyesuaian.",
  },
  "HD-001": {
    kind: "Audit ground truth dan geometri",
    work: "Mencoba menautkan tampakan tandan antar-view memakai geometri, lalu menelusuri koreksi ground truth yang mengubah interpretasi skor awal.",
    impact:
      "Skor pra-perbaikan tidak dijadikan klaim akhir. Node ini dipakai sebagai pagar audit untuk semua hasil deduplikasi sesudahnya.",
  },
  "HD-007": {
    kind: "Audit kebocoran informasi",
    work: "Menguji aturan pembagian yang tampak unggul, lalu memeriksa asal parameter pembaginya terhadap split training.",
    impact:
      "Metode dibatalkan sebagai prediktor yang dapat digeneralisasi meskipun skornya tinggi; ini menjaga atlas dari klaim leakage.",
  },
  "HB-001": {
    kind: "Baseline masalah duplikasi",
    work: "Menjumlahkan seluruh tampakan tandan di beberapa view sebagai kontrol negatif paling sederhana.",
    evidence:
      "Class ±1 hanya 50,00% dan Tree ±1 6,38%, menunjukkan setiap tandan bisa muncul lebih dari sekali.",
    impact:
      "Counting tree-level perlu association atau koreksi visibility; menjumlahkan kotak deteksi mentah tidak sah.",
  },
  "HB-004": {
    kind: "Batas atas counting",
    work: "Memberi ElasticNet fitur F0 dari deteksi ground truth, bukan keluaran detector, untuk memisahkan kualitas counter dari kesalahan deteksi.",
    evidence:
      "Dengan input sempurna, Class ±1 mencapai 98,05% dan Tree ±1 92,20%.",
    impact:
      "Kesenjangan dengan pipeline E2E menunjukkan bottleneck besar berada pada evidence detector/association sebelum regresi count.",
  },
  "HB-009": {
    kind: "Baseline E2E rilis",
    work: "Menetapkan pipeline praktis detector YOLO26m ke Ridge F_all sebagai pembanding counting tree-level yang dapat direproduksi.",
    impact:
      "Semua eksperimen counting selanjutnya harus menyebut apakah mereka membandingkan diri dengan baseline ini dan memakai split yang sebanding.",
  },
  "V2-E-001": {
    kind: "Reproduksi benchmark",
    work: "Melatih ulang tiga detector pada 953 RGB dengan konfigurasi terkontrol untuk memeriksa apakah benchmark sebelumnya dapat direproduksi.",
    impact:
      "Urutan detector yang stabil menjadi titik mula adil untuk ablation depth dan counting berikutnya.",
  },
  "V2-E-002": {
    kind: "Uji propagasi detector ke counting",
    work: "Mengalirkan keluaran tiga detector baru ke counter Ridge F_all yang sama, lalu membandingkannya dengan YOLO26m baseline.",
    evidence:
      "Tidak ada detector baru yang melampaui Class ±1 77,48%; RF-DETR-L masih memberi MAE terendah 0,993.",
    impact:
      "Meningkatkan mAP detector tidak otomatis memperbaiki counting. Jalur berikutnya perlu menilai galat detector dan agregasi secara terpisah.",
  },
  "V2-E-005": {
    kind: "Ablasi early fusion sensor",
    work: "Menambahkan depth inverse sebagai kanal keempat pada tiga arsitektur dan membandingkan setiap pasangan RGBD–RGB.",
    impact:
      "Karena arah hasil berbeda antar-arsitektur, early fusion inverse tidak dipakai sebagai klaim umum manfaat depth.",
  },
  "V2-E-006": {
    kind: "Ablasi counting ber-bootstrap",
    work: "Menguji apakah perubahan early fusion bertahan setelah keluaran detector masuk ke counter dan diulang melalui bootstrap.",
    evidence: "Seluruh CI perbandingan RGBD–RGB mencakup nol.",
    impact:
      "Tidak ada dasar statistik untuk mempromosikan depth inverse sebagai peningkatan counting.",
  },
  "V2-E-008": {
    kind: "Penyaringan encoding depth",
    work: "Menguji beberapa encoding depth pada training singkat 15 epoch untuk memilih kandidat yang layak menerima anggaran training penuh.",
    impact:
      "Sobel edge dipromosikan sebagai kandidat, tetapi angka screening tidak boleh diperlakukan sebagai hasil final 60 epoch.",
  },
  "V2-E-010": {
    kind: "Validasi detector edge-depth",
    work: "Melatih kandidat Sobel edge hingga 60 epoch dan membandingkannya dengan inverse serta baseline RGB dengan evaluator yang sama.",
    impact:
      "Kenaikan deteksi memberi alasan untuk memeriksa mekanisme edge lebih lanjut, tetapi tidak membuktikan peningkatan counting.",
  },
  "V2-E-011": {
    kind: "Audit baseline counting",
    work: "Menjalankan ulang RGB lalu membandingkan edge dengan RGB ulang dan RGB lama untuk menguji kestabilan klaim counting.",
    impact:
      "Perbedaan baseline mengubah kesimpulan; klaim kenaikan counting tidak dipromosikan tanpa pembanding yang dikunci.",
  },
  "V2-E-012": {
    kind: "Diagnosis perbandingan dataset",
    work: "Menghitung ulang komposisi kelas 953 dan 352 untuk menilai apakah selisih performa dapat dibaca sebagai efek depth.",
    impact:
      "Perbandingan 953 versus 352 bukan desain kausal depth karena distribusi kelas dan konteksnya berbeda.",
  },
  "V2-E-013": {
    kind: "Diagnosis jenis galat",
    work: "Mengevaluasi detector dengan kelas kematangan dan dengan label class-agnostic untuk memisahkan gagal menemukan tandan dari salah memberi kelas.",
    impact:
      "Jalur perbaikan bergeser ke klasifikasi ordinal/crop, bukan hanya menaikkan kapasitas locator.",
  },
  "V2-E-014": {
    kind: "Probe sinyal sensor",
    work: "Mengukur relief lokal depth pada berbagai pooling untuk menguji apakah sensor membawa sinyal ordinal sebelum dimasukkan ke model.",
    impact:
      "Depth memiliki sinyal setelah pooling, tetapi bukan peta metrik siap-fusion pada piksel mentah.",
  },
  "V2-E-015": {
    kind: "Klasifikasi tahap kedua",
    work: "Mencrop tandan dari box lalu membandingkan classifier kematangan dengan klasifikasi satu tahap detector.",
    impact:
      "Pemrosesan dua tahap layak diteruskan sebagai jalur klasifikasi; perbaikan ini tidak sama dengan kemenangan detector.",
  },
  "V2-E-016": {
    kind: "Replikasi ablasi depth",
    work: "Menguji branch depth dan fitur depth terhadap RGB dengan tiga seed untuk membedakan sinyal awal dari efek yang berulang.",
    impact:
      "Satu seed positif tidak cukup; pada replikasi depth tidak menambah informasi kondisional di atas RGB.",
  },
  "V2-E-032": {
    kind: "Matriks evaluasi monocular-depth",
    work: "Menjalankan 15 eksperimen: lima pilihan masukan (RGB, edge, mono, dan kombinasinya) masing-masing tiga seed, lalu membandingkannya terhadap jalur RGB/edge yang sepadan.",
    evidence:
      "Dua kontras monocular terhadap pembanding menunjukkan kerugian signifikan; pada 12 dari 12 kontras lain, CI95 tetap memuat nol. Sinyal mid rata-rata +0,0139 tidak cukup untuk menyebut kenaikan.",
    impact:
      "Monocular-depth tidak diteruskan sebagai booster detector. Riset kembali berfokus pada evidence edge yang sudah memiliki dasar pembanding lebih jelas.",
    caution:
      "Kontrol M_shuf belum dijalankan, sehingga mekanisme kerugian—isi mono atau bias kanal—belum dapat dipisahkan secara kausal.",
  },
};

/**
 * Teks di sini menjelaskan seluruh keluarga/kelompok node yang cocok pada satu
 * cabang, bukan node tertentu — hindari menulis seolah-olah ini deskripsi
 * khusus satu eksperimen. Urutan cabang penting: RP-F harus diperiksa sebelum
 * RP- umum karena "RP-F001" juga cocok dengan awalan "RP-".
 */
function classify(
  experiment: Experiment
): Pick<EvidenceNarrative, "kind" | "work" | "impact"> {
  const phase = experiment.phase.toLowerCase();
  const id = experiment.id;
  if (id.startsWith("HB-"))
    return {
      kind: "Baseline & batas atas (HB-*)",
      work: "Sebagai kelompok, node berprefiks HB- menetapkan pembanding terkontrol untuk memisahkan masalah deteksi, agregasi multi-view, dan regresi count.",
      impact:
        "Node dalam kelompok ini berfungsi sebagai pembanding angka; kecocokan jenis input dan split perlu diperiksa sebelum skornya dibandingkan dengan node lain.",
    };
  if (id.startsWith("HD-"))
    return {
      kind: "Arsip deduplikasi (HD-*)",
      work: "Sebagai kelompok, node berprefiks HD- menguji aturan association atau counter pada evidence multi-view, dengan riwayat perbaikan ground truth sebagai bagian dari evaluasi.",
      impact:
        "Kelompok ini dipakai untuk membedakan metode valid, oracle berbasis GT, dan skor yang terdiskualifikasi.",
    };
  if (id.startsWith("RP-F"))
    return {
      kind: "Gerbang formulasi (RP-F*)",
      work: "Sebagai kelompok, node berprefiks RP-F menjalankan probe atau run terbatas untuk memutuskan apakah sebuah mekanisme layak menerima eksperimen penuh.",
      impact:
        "Lolos gerbang pada kelompok ini bukan klaim performa final; gugur berarti anggaran run dialihkan ke cabang yang lebih didukung.",
    };
  if (id.startsWith("RP-"))
    return {
      kind: "Register Research-Pipeline (RP-E*)",
      work: "Sebagai kelompok, node berprefiks RP-E menjalankan probe, audit, atau pembanding yang tercatat pada register primer Research-Pipeline.",
      impact:
        "Putusan register pada kelompok ini menentukan apakah cabang diteruskan, dibatasi, atau dihentikan.",
    };
  if (phase.includes("diagnosis") || phase.includes("audit"))
    return {
      kind: "Audit atau diagnosis (kelompok fase)",
      work: "Node dalam kelompok fase audit/diagnosis ini membaca ulang data, evaluasi, atau keluaran model untuk mengisolasi sumber galat tanpa menyatakan kenaikan performa baru.",
      impact:
        "Temuan pada kelompok ini mengarahkan eksperimen berikutnya dan membatasi klaim yang sudah ada.",
    };
  if (phase.includes("sintesis"))
    return {
      kind: "Sintesis keputusan (kelompok fase)",
      work: "Node dalam kelompok fase sintesis ini menggabungkan hasil yang sudah tersedia untuk memeriksa pola lintas eksperimen.",
      impact:
        "Sintesis pada kelompok ini hanya sah sejauh benchmark, evaluator, dan desain pembandingnya sebanding.",
    };
  return {
    kind: "Eksperimen pembanding (kelompok umum)",
    work: "Node dalam kelompok umum ini menjalankan konfigurasi yang tercatat dan membandingkannya dengan jalur yang menjadi referensi pada node induk.",
    impact:
      "Hasil pada kelompok ini menentukan apakah konfigurasi diteruskan, diulang, atau ditutup.",
  };
}

/**
 * Fallback "Bukti yang ditemukan" dibentuk murni dari metrik node itu sendiri
 * (maksimal tiga pertama), bukan dari experiment.conclusion — kalimat itu
 * sudah tampil di bagian "Kesimpulan singkat" pada sheet dan tidak perlu
 * diulang di sini. Bila node tidak memiliki metrik sama sekali, kembalikan
 * null supaya panel dapat menyembunyikan kartunya.
 */
function evidenceFromMetrics(experiment: Experiment): string | null {
  const metrics = experiment.metrics.slice(0, 3);
  if (metrics.length === 0) return null;
  const clauses = metrics.map(
    metric =>
      `${metric.label}: ${metric.value}${metric.note ? ` (${metric.note})` : ""}`
  );
  return `${clauses.join("; ")}.`;
}

export function getEvidenceNarrative(
  experiment: Experiment
): EvidenceNarrative {
  const base = classify(experiment);
  const special = specialNarratives[experiment.id] ?? {};
  return {
    kind: special.kind ?? base.kind,
    work: special.work ?? base.work,
    evidence: special.evidence ?? evidenceFromMetrics(experiment),
    impact: special.impact ?? base.impact,
    caution: special.caution ?? null,
  };
}
