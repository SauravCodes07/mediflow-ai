import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { WorkflowTimeline } from "./WorkflowTimeline";
import { getPatientWorkflowTimeline, getCurrentOrgId } from "../../../lib/data/queries";

export default async function PatientWorkflowPage() {
  const orgId = await getCurrentOrgId();
  const entries = await getPatientWorkflowTimeline(orgId);

  const uniquePatients = new Set(entries.map((e) => e.patientId)).size;
  const blockerCount = entries.filter((e) => e.isBlocker).length;

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader
        title="Patient Workflow"
        description="A single timeline from admission through discharge."
      />

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)" }}>
        <StatCard label="Timeline events" value={String(entries.length)} />
        <StatCard label="Patients tracked" value={String(uniquePatients)} />
        <StatCard
          label="Blocker events"
          value={String(blockerCount)}
          tone={blockerCount > 0 ? "critical" : "neutral"}
          delta={blockerCount > 0 ? "Needs attention" : undefined}
        />
      </div>

      <WorkflowTimeline entries={entries} />
    </div>
  );
}
