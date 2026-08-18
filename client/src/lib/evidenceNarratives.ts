/** Narasi bukti Field Research Ledger — mengubah catatan eksperimen yang telah diaudit menjadi uraian kerja yang terbaca pembaca. */
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
    kind: "Inventarisasi data sumber",
    work: "Mencocokkan arsip citra mentah dengan basis data register SawitMVC: sebanyak 3.992 berkas citra mentah (resolusi 3024×4032) dan 45 video orbit diperiksa, kemudian struktur penamaan berkas dibandingkan terhadap anotasi terkait.",
    evidence:
      "Rasio aspek citra mentah terbukti identik dengan citra latih sehingga koordinat bounding box YOLO dapat digunakan kembali. Namun, teridentifikasi 936 duplikasi penamaan berkas, sehingga penamaan berkas semata tidak valid untuk memetakan citra mentah ke anotasi.",
    impact:
      "Eksperimen resolusi tinggi tidak dapat dilakukan melalui pemetaan nama berkas secara langsung. Tahapan riset dialihkan pada pencocokan konten citra atau metadata pengumpulan data, sedangkan video orbit tetap dipertahankan sebagai jalur eksperimen independen.",
    caution:
      "Pemetaan nama berkas semata tidak dapat diandalkan karena adanya duplikasi penamaan berkas master; verifikasi konten visual mutlak diperlukan.",
  },
  "RP-E003": {
    kind: "Analisis kelayakan geometri video",
    work: "Menganalisis satu rekaman video orbit untuk menguji kelayakan estimasi pose kamera sebelum merancang mekanisme asosiasi multi-sudut pandang (cross-view).",
    impact:
      "Temuan ini mengonfirmasi kelayakan estimasi pose awal secara geometris, namun belum membuktikan bahwa integrasi geometri video mampu meningkatkan akurasi pencacahan (counting).",
    caution:
      "Estimasi pose kamera dari satu video orbit belum mencakup variasi stabilitas trajektori pada kondisi lapangan riil.",
  },
  "RP-E006": {
    kind: "Uji falsifikasi representasi",
    work: "Menguji efektivitas representasi kedalaman semu (pseudo-depth) dalam memisahkan objek tandan dari latar belakang tanpa melatih arsitektur detektor baru.",
    impact:
      "Jalur representasi pseudo-depth dihentikan dan tidak dilanjutkan ke tahap eksperimen integrasi detektor.",
    caution:
      "Hasil pemisahan latar pseudo-depth dinilai secara kualitatif; tidak dilanjutkan ke pelatihan kuantitatif karena artefak batas objek terlalu dominan.",
  },
  "RP-E021": {
    kind: "Evaluasi komparatif detektor final",
    work: "Melakukan evaluasi komparatif antara arsitektur RT-DETR dan RF-DETR menggunakan protokol pengujian empat kelas yang terstandarisasi, guna menetapkan baseline detektor untuk eksperimen lanjutan.",
    evidence:
      "Model RF-DETR-L mencapai metrik mAP50 sebesar 0,6038 dan mAP50–95 sebesar 0,2770 pada data uji (split 716/96/141 pohon).",
    impact:
      "RF-DETR-L ditetapkan sebagai model acuan detektor utama pada Research-Pipeline; metrik ini merupakan evaluasi deteksi tingkat citra, bukan estimasi pencacahan tingkat pohon (tree-level counting).",
    caution:
      "Metrik mAP deteksi tingkat citra tidak menjamin penurunan galat pada estimasi pencacahan tingkat pohon (tree-level counting).",
  },
  "RP-E025": {
    kind: "Audit protokol evaluator",
    work: "Menyelidiki diskrepansi metrik antara dua modul evaluator serta menguji korelasi selisih evaluasi terhadap peningkatan densitas deteksi.",
    impact:
      "Protokol evaluasi dibakukan secara ketat menggunakan pustaka pycocotools; metrik dari evaluator terdahulu tidak diperkenankan untuk digabungkan tanpa penyesuaian formal.",
    caution:
      "Penggabungan metrik antar-evaluator tanpa standarisasi parameter IoU pycocotools berpotensi menimbulkan bias komparasi hingga ~0,02 mAP.",
  },
  "HD-001": {
    kind: "Audit ground truth dan geometri",
    work: "Menguji penautan objek tandan antarsudut pandang berbasis geometri kamera, kemudian melakukan penelusuran koreksi ground truth yang memengaruhi interpretasi metrik awal.",
    impact:
      "Metrik sebelum perbaikan ground truth dinyatakan tidak valid sebagai klaim performa final. Node ini difungsikan sebagai batasan audit bagi seluruh pengujian deduplikasi berikutnya.",
    caution:
      "Skor akurasi pra-koreksi ground truth (93,86%) tidak valid dan dilarang dikutip sebagai baseline aktif.",
  },
  "HD-007": {
    kind: "Audit kebocoran informasi (data leakage)",
    work: "Menguji aturan pembagi heuristik yang menunjukkan skor tinggi, kemudian menelusuri dependensi parameter pembagi terhadap data pelatihan (training split).",
    impact:
      "Metode ini didiskualifikasi sebagai prediktor yang dapat digeneralisasi akibat kebocoran informasi (data leakage); keputusan ini menjaga integritas validitas ilmiah pada atlas eksperimen.",
    caution:
      "Aturan pembagi ini mengalami kebocoran data (data leakage) dan didiskualifikasi dari tolok ukur komparatif atlas.",
  },
  "HB-001": {
    kind: "Baseline masalah duplikasi naif",
    work: "Menjumlahkan seluruh deteksi kemunculan tandan dari berbagai sudut pandang sebagai kontrol negatif mendasar (metode naif).",
    evidence:
      "Akurasi Class ±1 hanya mencapai 50,00% dan Tree ±1 sebesar 6,38%, mengonfirmasi bahwa sebagian besar tandan terdeteksi berulang kali di berbagai sudut pandang.",
    impact:
      "Estimasi pencacahan tingkat pohon memerlukan pemodelan asosiasi data atau koreksi visibilitas; penjumlahan bounding box deteksi secara langsung terbukti tidak valid.",
    caution:
      "Penjumlahan langsung deteksi multi-sudut pandang menghasilkan galat duplikasi hingga 93,62% dan hanya berfungsi sebagai kontrol negatif.",
  },
  "HB-004": {
    kind: "Batas atas teoretis pencacahan (oracle)",
    work: "Melatih model ElasticNet menggunakan vektor fitur F0 yang diekstraksi dari ground truth (bukan keluaran detektor) untuk mengisolasi batas atas performa modul pencacah dari kesalahan deteksi.",
    evidence:
      "Dengan representasi masukan sempurna (oracle), akurasi Class ±1 mencapai 98,05% dan Tree ±1 mencapai 92,20%.",
    impact:
      "Disparitas yang signifikan terhadap pipeline end-to-end membuktikan bahwa kendala utama (bottleneck) berada pada tahap deteksi dan asosiasi, bukan pada modul regresi pencacah.",
    caution:
      "Akurasi 98,05% merupakan batas atas teoretis (oracle) dengan masukan sempurna dan tidak dapat dicapai secara operasional tanpa detektor sempurna.",
  },
  "HB-009": {
    kind: "Baseline end-to-end resmi rilis",
    work: "Menstandarisasi pipeline praktis yang menggabungkan detektor YOLO26m dengan regresi Ridge (fitur F_all) sebagai model acuan (baseline) pencacahan tingkat pohon yang dapat direproduksi.",
    impact:
      "Seluruh eksperimen pencacahan selanjutnya diwajibkan menyertakan perbandingan terhadap baseline ini dengan menggunakan pembagian data (split) yang sepadan.",
    caution:
      "Validitas komparasi baseline end-to-end terikat pada partisi data (split) 716/96/141 dan protokol ekstraksi fitur F_all.",
  },
  "V2-E-001": {
    kind: "Reproduksi benchmark detektor",
    work: "Melatih ulang tiga arsitektur detektor pada dataset SawitMVC-953 RGB dalam kondisi eksperimen terkontrol untuk memverifikasi reproduktifitas benchmark terdahulu.",
    impact:
      "Konsistensi hierarki performa antar-arsitektur detektor menjadi landasan komparasi yang valid bagi eksperimen ablasi sensor kedalaman dan pencacahan selanjutnya.",
    caution:
      "Hierarki performa detektor dievaluasi pada data latih RGB murni; generalisasi ke modalitas multi-kanal memerlukan penyesuaian bobot awal.",
  },
  "V2-E-002": {
    kind: "Uji propagasi deteksi ke pencacahan",
    work: "Meneruskan keluaran prediksi dari tiga arsitektur detektor ke modul pencacah Ridge (fitur F_all) yang sama, kemudian mengomparasikannya dengan baseline YOLO26m.",
    evidence:
      "Tidak ada detektor baru yang melampaui akurasi Class ±1 sebesar 77,48%; model RF-DETR-L mencatatkan galat absolut rata-rata (MAE) terendah sebesar 0,993.",
    impact:
      "Peningkatan metrik mAP pada detektor terbukti tidak berkorelasi linier dengan kenaikan akurasi pencacahan; evaluasi berikutnya perlu memisahkan antara galat deteksi dan galat agregasi multi-sudut pandang.",
    caution:
      "Propagasi prediksi detektor ke modul regresi dibatasi oleh ketidakmampuan fitur F_all dalam mengompensasi deteksi yang terlewat (false negative).",
  },
  "V2-E-005": {
    kind: "Ablasi early fusion sensor kedalaman",
    work: "Mengintegrasikan representasi depth inverse sebagai kanal keempat (early fusion) pada tiga arsitektur detektor dan membandingkan kinerja setiap pasangan konfigurasi RGB-D terhadap RGB.",
    impact:
      "Karena dampak performa bervariasi antar-arsitektur (hanya satu yang meningkat, sementara dua lainnya menurun), early fusion depth inverse tidak dapat diklaim memberikan manfaat performa secara universal.",
    caution:
      "Early fusion pada kanal masukan keempat rentan terhadap sensitivitas inisialisasi bobot dan variasi skala kedalaman mentah.",
  },
  "V2-E-006": {
    kind: "Ablasi pencacahan bootstrap",
    work: "Menguji signifikansi statistik pengaruh early fusion pada tahap pencacahan akhir menggunakan metode resampling bootstrap sebanyak 10.000 iterasi.",
    evidence:
      "Seluruh selang kepercayaan (CI 95%) selisih performa antara RGB-D dan RGB mencakup nilai nol.",
    impact:
      "Tidak ditemukan landasan statistik yang signifikan untuk menyimpulkan bahwa penambahan kanal depth inverse meningkatkan akurasi pencacahan.",
    caution:
      "Evaluasi resampling bootstrap dibatasi oleh jumlah pohon pada partisi uji; pengujian independen pada musim panen berbeda tetap disarankan.",
  },
  "V2-E-008": {
    kind: "Penyaringan representasi encoding depth",
    work: "Mengevaluasi beberapa skema encoding kedalaman pada pelatihan singkat (15 epoch) untuk menyaring kandidat representasi yang layak dilatih penuh.",
    impact:
      "Representasi kontur Sobel (edge) terpilih sebagai kandidat terbaik untuk pelatihan penuh (60 epoch), namun skor penyaringan awal tidak boleh disamakan dengan metrik konvergensi final.",
    caution:
      "Protokol penyaringan 15 epoch hanya mengukur laju pembelajaran awal dan bukan konvergensi kapasitas penuh model.",
  },
  "V2-E-010": {
    kind: "Validasi detektor edge-depth",
    work: "Melatih model kandidat berbasis representasi edge-depth selama 60 epoch penuh, kemudian mengomparasikan hasilnya terhadap model inverse dan baseline RGB menggunakan evaluator yang terstandarisasi.",
    impact:
      "Peningkatan metrik deteksi (mAP50) memberikan justifikasi untuk investigasi mekanisme representasi edge lebih lanjut, meskipun belum terbukti meningkatkan akurasi pencacahan akhir.",
    caution:
      "Peningkatan lokalisasi detektor edge-depth belum divalidasi pada skenario pohon dengan oklusi pelepah ekstrem.",
  },
  "V2-E-011": {
    kind: "Evaluasi stabilitas baseline pencacahan",
    work: "Melakukan pelatihan ulang (retrain) pada baseline RGB, kemudian membandingkan performa edge-depth terhadap baseline baru maupun baseline historis untuk menguji stabilitas komparasi pencacahan.",
    impact:
      "Variasi performa antar-pelatihan baseline memengaruhi kesimpulan statistik; klaim peningkatan pencacahan tidak dapat dipromosikan tanpa standarisasi baseline yang terkunci.",
    caution:
      "Fluktuasi akurasi pencacahan antar-seed baseline RGB mengindikasikan perlunya interval kepercayaan pada setiap evaluasi komparatif.",
  },
  "V2-E-012": {
    kind: "Diagnosis komparasi dataset",
    work: "Menganalisis disparitas distribusi dan komposisi kelas antara dataset SawitMVC-953 dan SawitMVC-Depth-352 guna mengevaluasi validitas komparasi efek sensor kedalaman.",
    impact:
      "Komparasi langsung antara dataset 953 dan 352 tidak memenuhi syarat desain kausal untuk pembuktian efek sensor kedalaman karena perbedaan signifikan pada distribusi kelas dan konteks pengambilan data.",
    caution:
      "Jeda waktu akuisisi ~80 hari antara dataset 953 dan 352 memperkenalkan bias pergeseran temporal (temporal shift) yang mengacaukan efek kausal sensor.",
  },
  "V2-E-013": {
    kind: "Diagnosis pola galat detektor",
    work: "Mengevaluasi detektor menggunakan label spesifik tingkat kematangan serta label agnostik kelas (class-agnostic) guna mengisolasi proporsi galat lokalisasi terhadap galat klasifikasi kematangan.",
    impact:
      "Sebanyak 44,5% penurunan performa detektor disebabkan oleh kesalahan klasifikasi kematangan (terutama antarkelas bertetangga), sehingga arah perbaikan dialihkan ke pemodelan klasifikasi ordinal pada citra terpotong (crop).",
    caution:
      "Isolasi galat klasifikasi tidak mengabaikan kenyataan bahwa tandan kecil pada latar belakang tetap menghadapi kendala deteksi batas objek.",
  },
  "V2-E-014": {
    kind: "Analisis sinyal sensor kedalaman",
    work: "Menganalisis karakteristik relief kedalaman lokal pada berbagai skala spatial pooling untuk menguji keberadaan sinyal ordinal kematangan sebelum dilakukan fusi ke dalam arsitektur pembelajaran mendalam.",
    impact:
      "Data sensor kedalaman terbukti memuat sinyal ordinal yang signifikan setelah agregasi spasial (pooling), namun tidak berupa representasi metrik yang optimal jika diinjeksikan langsung pada tingkat piksel mentah.",
    caution:
      "Sinyal ordinal depth hanya muncul setelah agregasi spasial (pooling); injeksi pada piksel resolusi tinggi memiliki rasio sinyal terhadap derau (SNR) rendah.",
  },
  "V2-E-015": {
    kind: "Klasifikasi kematangan tahap kedua",
    work: "Memotong area objek tandan (crop) dari bounding box hasil lokalisasi, kemudian membandingkan kinerja model pengklasifikasi kematangan independen terhadap mekanisme klasifikasi satu tahap pada detektor.",
    impact:
      "Arsitektur pipeline dua tahap terbukti mengungguli pengklasifikasi bawaan detektor; strategi ini dipromosikan sebagai jalur pemodelan klasifikasi kematangan.",
    caution:
      "Keberhasilan klasifikasi dua tahap bergantung mutlak pada kualitas pemotongan bounding box dari detektor tahap pertama.",
  },
  "V2-E-016": {
    kind: "Replikasi ablasi depth pada pengklasifikasi",
    work: "Menguji integrasi cabang fitur kedalaman (depth branch) terhadap representasi RGB pada model pengklasifikasi menggunakan replikasi tiga random seed untuk memverifikasi reproduktifitas sinyal.",
    impact:
      "Peningkatan skor yang sempat terlihat pada satu seed terbukti merupakan variasi acak (noise); setelah replikasi multi-seed, kanal kedalaman tidak memberikan informasi kondisional tambahan yang signifikan dibandingkan representasi RGB murni.",
    caution:
      "Klaim keunggulan fitur kedalaman pada satu random seed terbukti merupakan variasi acak (noise) yang gugur setelah replikasi multi-seed.",
  },
  "V2-E-032": {
    kind: "Matriks evaluasi depth monokular",
    work: "Menjalankan 15 rancangan eksperimen yang mencakup lima variasi konfigurasi masukan (RGB, edge, depth monokular, dan kombinasinya) pada masing-masing tiga random seed, kemudian membandingkan hasilnya terhadap baseline RGB dan edge yang sepadan.",
    evidence:
      "Dari hasil pengujian, dua uji kontras monokular terhadap pembanding mengalami penurunan performa secara signifikan. Pada 12 uji kontras lainnya, selang kepercayaan 95% (CI95) masih mencakup nilai nol. Nilai rata-rata +0,0139 tidak cukup signifikan untuk dikategorikan sebagai peningkatan performa.",
    impact:
      "Pemanfaatan depth monokular dihentikan dan tidak dilanjutkan sebagai modul penguat (booster) detektor. Arah riset difokuskan kembali pada representasi edge yang memiliki dasar komparasi empiris lebih kokoh.",
    caution:
      "Pengujian kontrol permutasi kanal (M_shuf) belum dilakukan, sehingga akar penurunan performa—apakah disebabkan oleh kandungan fitur monokular atau degradasi bobot kanal—belum dapat dipisahkan secara kausal.",
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
): Pick<EvidenceNarrative, "kind" | "work" | "impact" | "caution"> {
  const phase = experiment.phase.toLowerCase();
  const id = experiment.id;
  if (id.startsWith("PT-E"))
    return {
      kind: "Pipeline per-tandan (PT-E-*)",
      work: "Cabang PT-E mengubah satuan analisis dari deteksi per citra menjadi tandan fisik per pohon: menguji penautan lintas-sisi, agregasi kelas, dan dampaknya terhadap counting secara berurutan.",
      impact:
        "Setiap gerbang memisahkan nilai oracle, mutu penaut, dampak end-to-end, dan counting; hasilnya mencegah satu skor mencampur manfaat agregasi dengan galat deteksi atau asosiasi.",
      caution:
        "Status cabang harus dibaca menurut urutan koreksi: prior arah putar membuat G1/G2 lolos, G3 tetap gugur, dan diagnosis " +
          "mutu detektor kemudian dibatalkan oleh audit kepadatan kandidat PT-E-011.",
    };
  if (id.startsWith("HB-"))
    return {
      kind: "Baseline & batas atas (HB-*)",
      work: "Kelompok node berprefiks HB- menetapkan model pembanding (baseline) terkontrol guna memisahkan evaluasi performa deteksi, agregasi multi-sudut pandang, dan regresi pencacahan.",
      impact:
        "Node pada kelompok ini berfungsi sebagai tolok ukur kuantitatif; kesesuaian jenis masukan dan partisi data (split) harus diverifikasi sebelum melakukan komparasi performa dengan node lain.",
      caution:
        "Skor batas atas teoretis (oracle) mengasumsikan representasi masukan sempurna; perbandingan langsung terhadap pipeline end-to-end tanpa koreksi propagasi galat tidak valid.",
    };
  if (id.startsWith("HD-"))
    return {
      kind: "Arsip deduplikasi (HD-*)",
      work: "Kelompok node berprefiks HD- menguji metode asosiasi data dan algoritma pencacah pada bukti multi-sudut pandang, dengan rekam jejak pembaruan ground truth sebagai parameter audit.",
      impact:
        "Kelompok ini digunakan untuk memvalidasi kelayakan metode, mengevaluasi batas atas berbasis ground truth (oracle), dan memfilter skor yang didiskualifikasi akibat kebocoran data.",
      caution:
        "Metrik historis sebelum perbaikan ground truth terdiskualifikasi dan tidak diperkenankan untuk dijadikan klaim performa komparatif final.",
    };
  if (id.startsWith("RP-F"))
    return {
      kind: "Gerbang formulasi (RP-F*)",
      work: "Kelompok node berprefiks RP-F menjalankan evaluasi terarah (probe) atau pelatihan skala kecil untuk menilai kelayakan hipotesis mekanisme sebelum dialokasikan ke eksperimen skala penuh.",
      impact:
        "Kelolosan pada gerbang formulasi merupakan validasi awal mekanisme, bukan klaim performa akhir; pengujian yang tidak memenuhi ambang batas dialihkan untuk efisiensi komputasi.",
      caution:
        "Kelolosan pada gerbang formulasi hanya memverifikasi kelayakan mekanisme awal skala kecil; tidak boleh dianggap sebagai klaim peningkatan performa mAP akhir.",
    };
  if (id.startsWith("RP-"))
    return {
      kind: "Register Research-Pipeline (RP-E*)",
      work: "Kelompok node berprefiks RP-E mencatat pengujian terarah, audit data, dan eksperimen komparatif yang terdata secara kronologis pada register primer Research-Pipeline.",
      impact:
        "Hasil evaluasi pada register ini menentukan secara formal apakah suatu cabang metodologi diteruskan, dibatasi cakupannya, atau dihentikan.",
      caution:
        "Status putusan terikat secara ketat pada partisi pohon 716/96/141 dan protokol pycocotools; tidak dapat digeneralisasi pada partisi data yang berbeda.",
    };
  if (phase.includes("diagnosis") || phase.includes("audit"))
    return {
      kind: "Audit dan diagnosis metodologi",
      work: "Kelompok node audit dan diagnosis melakukan analisis mendalam terhadap integritas data, protokol evaluasi, dan keluaran model untuk mengisolasi anomali tanpa menyatakan klaim peningkatan performa baru.",
      impact:
        "Temuan audit memberikan batasan ilmiah yang mengikat terhadap klaim sebelumnya dan mengarahkan perumusan hipotesis pada siklus eksperimen berikutnya.",
      caution:
        "Temuan audit berfungsi sebagai batasan ilmiah atas klaim sebelumnya dan tidak mempromosikan klaim peningkatan skor baru.",
    };
  if (phase.includes("sintesis"))
    return {
      kind: "Sintesis keputusan komparatif",
      work: "Kelompok node sintesis mengagregasi hasil dari berbagai konfigurasi eksperimen yang telah selesai guna mengevaluasi konsistensi pola empiris lintas kondisi pengujian.",
      impact:
        "Validitas sintesis berlaku sejauh rancangan eksperimen, distribusi data, dan protokol evaluator yang digunakan memiliki komparabilitas yang setara.",
      caution:
        "Validitas sintesis dibatasi oleh kesetaraan protokol antar-eksperimen dan disparitas distribusi data akuisisi lapangan.",
    };
  return {
    kind: "Eksperimen komparatif terstruktur",
    work: "Kelompok node ini menjalankan konfigurasi eksperimen terdata dan mengomparasikan hasilnya secara sistematis terhadap jalur acuan pada node pendahulu.",
    impact:
      "Hasil pengujian empiris menentukan kelayakan konfigurasi untuk dilanjutkan ke tahap validasi lanjutan atau dihentikan.",
    caution:
      "Evaluasi terbatas pada parameter eksperimen yang tercatat; generalisasi ke kondisi pencahayaan dan kanopi baru memerlukan validasi independen.",
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
    caution: special.caution ?? base.caution,
  };
}
