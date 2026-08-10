import { PageShell } from "../../components/ui/PageShell";
import { AlertsBoard } from "./AlertsBoard";

export default function Page() {
  return (
    <PageShell title="Alerts & Emergency Operations" description="Severity-tiered operational alerting, acknowledgement, assignment, and escalation.">
      <AlertsBoard />
    </PageShell>
  );
}
