import { PageHeader } from "../../components/ui/PageHeader";
import { OTBoard } from "./OTBoard";
import { getOTRooms, getCurrentOrgId } from "../../../lib/data/queries";

export default async function OTPage() {
  const orgId = await getCurrentOrgId();
  const rooms = await getOTRooms(orgId);

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="Operating Theatre" description="Room status and active case overview." />
      <OTBoard rooms={rooms} />
    </div>
  );
}
