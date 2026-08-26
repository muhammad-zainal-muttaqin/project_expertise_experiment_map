/** Panduan penggunaan Field Research Ledger — penelusuran kunjungan pertama yang maju mengikuti
 *  tindakan yang benar-benar dilakukan.
 *
 *  Dua dari lima langkahnya menolak maju sampai pengunjung benar-benar melakukannya: memilih satu
 *  simpul, lalu menyalakan mode fokus cabang. Panel di sekelilingnya menahan sentuhan sehingga
 *  satu-satunya sasaran yang hidup adalah yang sedang dijelaskan. Justru itulah yang membuat
 *  langkahnya mengajar, bukan sekadar bercerita.
 *
 *  Lapisan ini menghalangi, tetapi tidak memerangkap. Esc, tautan lewati, dan tombol tutup
 *  mengakhiri panduan kapan saja, dan sorotannya membiarkan kendali asli tetap terjangkau papan
 *  tik alih-alih menjebak Tab di dalam kartu. Panduan yang tidak dapat ditinggalkan adalah cacat
 *  aksesibilitas, bukan fitur aksesibilitas — tujuannya memperjelas jalannya, bukan menahan
 *  siapa pun di dalamnya. */
import { ArrowRight, Check, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { experiments } from "@/lib/experimentData";

const STORAGE_KEY = "frl-panduan-selesai";

/* Jumlah simpul dan relasi diturunkan dari katalog pada waktu modul dimuat, bukan ditulis sebagai
   angka tetap, supaya kalimat panduan tidak menjadi usang setiap kali simpul baru ditambahkan. */
const NODE_COUNT = experiments.length;
const RELATION_COUNT = experiments.reduce(
  (total, item) => total + item.parentIds.length,
  0
);

interface TourStep {
  id: string;
  title: string;
  body: string;
  /** Selektor elemen yang dilubangi dari lapisan penghalang. Dikosongkan untuk langkah terpusat. */
  target?: string;
  /** Instruksi yang tampil selama langkah menunggu, beserta uji yang meloloskannya. */
  action?: { hint: string; done: () => boolean };
  /** Dijalankan sekali ketika langkah dibuka — dipakai untuk menyingkirkan sheet ponsel. */
  prepare?: () => void;
}

const closeMobileSheet = () => {
  const dismiss = document.querySelector<HTMLButtonElement>(".sheet-dismiss");
  if (dismiss && dismiss.offsetParent !== null) dismiss.click();
};

const steps: TourStep[] = [
  {
    id: "pengantar",
    title: "Cara membaca atlas ini",
    body: `Peta memuat ${NODE_COUNT} simpul eksperimen dari empat repositori, tersusun menurut silsilah: setiap simpul menunjuk pada eksperimen yang mendahuluinya. Panduan ini menempuh lima langkah dan meminta Anda mencoba dua kendali utamanya secara langsung.`,
  },
  {
    id: "pilih-simpul",
    title: "Pilih satu simpul",
    body: "Setiap kartu pada peta mewakili satu eksperimen beserta status validitasnya. Memilih kartu membuka catatan lengkapnya.",
    target: '[data-node-id="V2-E-001"]',
    action: {
      hint: "Pilih kartu V2-E-001 yang tersorot untuk melanjutkan.",
      done: () =>
        document
          .querySelector('[data-node-id="V2-E-001"]')
          ?.getAttribute("aria-pressed") === "true",
    },
  },
  {
    id: "lembar-bukti",
    title: "Lembar bukti",
    body: "Panel ini memuat Kesimpulan eksekutif, Metrik kuantitatif utama, Batasan validitas & audit, Glosarium istilah teknis, Silsilah relasi eksperimen, serta Artefak data pendukung yang statusnya sudah diaudit. Tombol induk dan turunan di dalamnya berpindah simpul tanpa menutup panel.",
    target: '[data-tour="evidence"]',
  },
  {
    id: "mode-fokus",
    title: "Mode fokus cabang",
    body: `Peta penuh menampilkan ${RELATION_COUNT} relasi sekaligus. Mode fokus menyisakan leluhur dan turunan simpul terpilih saja, sehingga satu jalur penelitian dapat dibaca terpisah dari sisanya.`,
    target: '[data-tour="focus"]',
    prepare: closeMobileSheet,
    action: {
      hint: "Aktifkan tombol fokus yang tersorot untuk melanjutkan.",
      done: () =>
        document
          .querySelector('[data-tour="focus"]')
          ?.getAttribute("aria-pressed") === "true",
    },
  },
  {
    id: "selesai",
    title: "Panduan selesai",
    body: "Bagian selebihnya dapat ditelusuri secara mandiri: penyaringan bukti mempersempit peta tanpa memutus silsilah, dan tombol Panduan pada bagian atas halaman memutar ulang langkah-langkah ini kapan saja.",
  },
];

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 8;
const GAP = 14;
/** Perkiraan awal saja; tinggi sebenarnya diukur setelah kartu dirender. */
const CARD_HEIGHT = 300;
const CARD_WIDTH = 400;

/* Sasaran panduan berkisar dari kartu simpul selebar 176px sampai panel bukti setinggi layar
   penuh. Penempatan diputuskan menurut ruang yang benar-benar tersisa: di bawah, lalu di atas, lalu
   di samping. Tanpa urutan itu kartu untuk panel setinggi layar terdorong keluar dari viewport. */
function placeCard(rect: Rect | null, height: number) {
  if (!rect) return { style: undefined, isAnchored: false };
  const { innerWidth: vw, innerHeight: vh } = window;
  const below = rect.top + rect.height + GAP;
  if (below + height <= vh) return { style: { top: below }, isAnchored: true };
  if (rect.top - GAP >= height)
    return { style: { bottom: vh - rect.top + GAP }, isAnchored: true };

  const spaceLeft = rect.left;
  const spaceRight = vw - (rect.left + rect.width);
  const top = Math.max(GAP, Math.min(rect.top, vh - height - GAP));
  if (spaceLeft > spaceRight && spaceLeft >= CARD_WIDTH + GAP)
    return { style: { top, right: vw - rect.left + GAP }, isAnchored: false };
  if (spaceRight >= CARD_WIDTH + GAP)
    return {
      style: { top, left: rect.left + rect.width + GAP },
      isAnchored: false,
    };
  return { style: undefined, isAnchored: false };
}

export function GuidedTour({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [isActionDone, setIsActionDone] = useState(false);
  const [cardHeight, setCardHeight] = useState(CARD_HEIGHT);
  const cardRef = useRef<HTMLDivElement>(null);
  const step = steps[index];

  const finish = useCallback(() => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finish]);

  /* Sasarannya berada di dalam kanvas yang dapat digulir dan sheet yang dapat terbuka, sehingga
     setiap langkah mengukur ulang setelah membawa sasarannya ke dalam pandangan, lalu terus
     mengukur selama tata letaknya belum tenang. */
  useEffect(() => {
    setIsActionDone(false);
    step.prepare?.();
    if (!step.target) {
      setRect(null);
      return;
    }
    const element = document.querySelector(step.target);
    element?.scrollIntoView({ block: "center", inline: "center" });
    const measure = () => {
      const node = document.querySelector(step.target as string);
      if (!node) return setRect(null);
      const box = node.getBoundingClientRect();
      setRect({
        top: box.top - PAD,
        left: box.left - PAD,
        width: box.width + PAD * 2,
        height: box.height + PAD * 2,
      });
    };
    measure();
    const timer = window.setInterval(measure, 220);
    window.addEventListener("resize", measure);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", measure);
    };
  }, [index, step]);

  useEffect(() => {
    if (!step.action) return;
    const timer = window.setInterval(() => {
      if (step.action?.done()) setIsActionDone(true);
    }, 180);
    return () => window.clearInterval(timer);
  }, [index, step]);

  useEffect(() => {
    cardRef.current?.focus();
  }, [index]);

  /* Kartu berubah tinggi antar-langkah dan lagi ketika kotak aksi berganti pesan, sehingga sisi
     yang muat diputuskan dari tinggi terukur, bukan dari perkiraan tetap. */
  useEffect(() => {
    const measured = cardRef.current?.offsetHeight;
    if (measured && measured !== cardHeight) setCardHeight(measured);
  });

  const isLast = index === steps.length - 1;
  const placement = placeCard(rect, cardHeight);
  const canAdvance = !step.action || isActionDone;
  const advance = () => (isLast ? finish() : setIndex(current => current + 1));

  return (
    <div className="tour-layer">
      {/* Empat panel, bukan satu lapisan tunggal: celah di antaranya adalah satu-satunya wilayah
          yang hidup, dan itulah yang menahan sentuhan agar tidak menyimpang di tengah langkah. */}
      {rect ? (
        <>
          <div
            className="tour-block"
            style={{ height: Math.max(rect.top, 0) }}
          />
          <div
            className="tour-block"
            style={{
              top: rect.top,
              height: rect.height,
              width: Math.max(rect.left, 0),
            }}
          />
          <div
            className="tour-block"
            style={{
              top: rect.top,
              left: rect.left + rect.width,
              height: rect.height,
              right: 0,
            }}
          />
          <div
            className="tour-block"
            style={{ top: rect.top + rect.height, bottom: 0 }}
          />
          <div
            className={`tour-spotlight ${isActionDone ? "is-done" : ""}`}
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }}
          />
        </>
      ) : (
        <div className="tour-block tour-block--full" />
      )}

      <div
        className={`tour-card ${placement.isAnchored ? "tour-card--anchored" : ""} ${placement.style && !placement.isAnchored ? "tour-card--beside" : ""}`}
        style={placement.style}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        tabIndex={-1}
        ref={cardRef}
      >
        <div
          className="tour-progress"
          aria-label={`Langkah ${index + 1} dari ${steps.length}`}
        >
          {steps.map((item, position) => (
            <i key={item.id} className={position <= index ? "is-passed" : ""} />
          ))}
        </div>
        <h2 id="tour-title">{step.title}</h2>
        <p>{step.body}</p>
        {step.action && (
          <p className={`tour-action ${isActionDone ? "is-done" : ""}`}>
            {isActionDone ? <Check size={14} /> : <ArrowRight size={14} />}
            {isActionDone
              ? "Berhasil. Lanjutkan ke langkah berikutnya."
              : step.action.hint}
          </p>
        )}
        <div className="tour-actions">
          <button type="button" className="tour-skip" onClick={finish}>
            Lewati panduan
          </button>
          <button
            type="button"
            className="tour-next"
            onClick={advance}
            disabled={!canAdvance}
          >
            {isLast ? "Selesai" : "Lanjut"}
          </button>
        </div>
        <button
          type="button"
          className="tour-close"
          onClick={finish}
          aria-label="Tutup panduan"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

export const hasSeenTour = () =>
  typeof window !== "undefined" &&
  window.localStorage.getItem(STORAGE_KEY) === "1";
