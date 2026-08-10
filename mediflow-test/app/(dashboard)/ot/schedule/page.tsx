import { PageHeader } from "../../../components/ui/PageHeader";
import { ScheduleBoard } from "./ScheduleBoard";
import { getOTSchedule, getCurrentOrgId } from "../../../../lib/data/queries";

export default async function OTSchedulePage() {
  const orgId = await getCurrentOrgId();
  const procedures = await getOTSchedule(orgId);

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="OT Schedule" description="Upcoming procedures across all operating rooms." />
      <ScheduleBoard procedures={procedures} />
    </div>
  );
}
