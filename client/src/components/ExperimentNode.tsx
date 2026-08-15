/** Field Research Ledger node — compact archival marker with evidence-first status semantics. */
import { datasetInfo, statusInfo, type Experiment } from "@/lib/experimentData";
import { Check, CircleAlert, CircleX, ShieldAlert } from "lucide-react";

interface ExperimentNodeProps {
  experiment: Experiment;
  selected: boolean;
  dimmed: boolean;
  lineageActive: boolean;
  onSelect: (id: string) => void;
}

const statusIcons = {
  supported: Check,
  negative: CircleX,
  inconclusive: CircleAlert,
  audit_needed: ShieldAlert,
};

export function ExperimentNode({ experiment, selected, dimmed, lineageActive, onSelect }: ExperimentNodeProps) {
  const status = statusInfo[experiment.status];
  const Icon = statusIcons[experiment.status];

  return (
    <button
      type="button"
      onClick={() => onSelect(experiment.id)}
      className={`experiment-node ${selected ? "is-selected" : ""} ${dimmed ? "is-dimmed" : ""} ${lineageActive ? "is-lineage" : ""}`}
      style={{ left: experiment.position.x, top: experiment.position.y }}
      aria-pressed={selected}
      aria-label={`Buka bukti ${experiment.id}: ${experiment.title}`}
    >
      <span className="node-index">{experiment.id.replace(/^(V2-E-|RP-|HB-|HD-)/, "")}</span>
      <span className={`node-status ${status.className}`}><Icon size={11} strokeWidth={2.2} />{status.label}</span>
      <strong>{experiment.title}</strong>
      <span className="node-meta"><i style={{ background: datasetInfo[experiment.dataset].color }} />{datasetInfo[experiment.dataset].short}{experiment.source && <em>{experiment.source.repo}</em>}</span>
    </button>
  );
}
