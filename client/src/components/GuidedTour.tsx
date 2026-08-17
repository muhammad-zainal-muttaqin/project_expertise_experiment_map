/** Field Research Ledger guided tour — a first-run walkthrough that advances on the real action.
 *
 *  Two of the five steps refuse to advance until the visitor actually performs them: selecting a
 *  node, then turning on branch focus. The surrounding panels block clicks so the only live target
 *  is the one being explained, which is what makes the step teach rather than narrate.
 *
 *  It is blocking, not inescapable. Esc, the skip control, and the close button all end the tour at
 *  any point, and the spotlight leaves the real control keyboard-reachable instead of trapping Tab
 *  inside the card. A tour that cannot be left is an accessibility defect, not an accessibility
 *  feature — the point is to make the path obvious, not to hold anyone in it. */
import { ArrowRight, Check, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "frl-panduan-selesai";

interface TourStep {
  id: string;
  title: string;
  body: string;
  /** Selector of the element to cut out of the blocking layer. Omitted for centred steps. */
  target?: string;
  /** Instruction shown while the step waits, and the test that lets it pass. */
  action?: { hint: string; done: () => boolean };
  /** Runs once when the step opens — used to clear the mobile sheet out of the way. */
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
    body: "Peta memuat 93 simpul eksperimen dari empat repositori, tersusun menurut garis keturunan: setiap simpul menunjuk pada eksperimen yang mendahuluinya. Panduan ini menempuh lima langkah dan meminta Anda mencoba dua kendali utamanya secara langsung.",
  },
  {
    id: "pilih-simpul",
    title: "Pilih satu simpul",
    body: "Setiap kartu pada peta adalah satu eksperimen beserta status validitasnya. Menyentuh kartu membuka catatan lengkapnya.",
    target: '[data-node-id="V2-E-001"]',
    action: {
      hint: "Sentuh kartu V2-E-001 yang tersorot untuk melanjutkan.",
      done: () =>
        document
          .querySelector('[data-node-id="V2-E-001"]')
          ?.getAttribute("aria-pressed") === "true",
    },
  },
  {
    id: "lembar-bukti",
    title: "Lembar bukti",
    body: "Panel ini memuat kesimpulan, metrik, batasan validitas, glosarium istilah, silsilah relasi, dan tautan artefak yang statusnya sudah diaudit. Chip induk dan turunan di dalamnya berpindah simpul tanpa menutup panel.",
    target: '[data-tour="evidence"]',
  },
  {
    id: "mode-fokus",
    title: "Mode fokus cabang",
    body: "Peta penuh menampilkan 120 relasi sekaligus. Mode fokus menyisakan leluhur dan turunan simpul terpilih saja, sehingga satu jalur penelitian dapat dibaca terpisah dari sisanya.",
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
    body: "Sisanya dapat ditelusuri sendiri: penyaringan bukti mempersempit peta tanpa memutus garis keturunan, dan tombol panduan di kepala halaman memutar ulang langkah-langkah ini kapan saja.",
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

  /* Targets live inside a scrollable canvas and a sheet that can be open, so each step re-measures
     after bringing its target into view, then keeps measuring while the layout settles. */
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
      {/* Four panels rather than one overlay: the gap between them is the only live region, which is
          what stops a stray tap from wandering off mid-step. */}
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
