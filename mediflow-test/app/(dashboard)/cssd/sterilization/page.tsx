import { PageHeader } from "../../../components/ui/PageHeader";
import { SterilizationBoard } from "./SterilizationBoard";
import { getSterilizationBatches, getCurrentOrgId } from "../../../../lib/data/queries";

export default async function SterilizationPage() {
  const orgId = await getCurrentOrgId();
  const batches = await getSterilizationBatches(orgId);

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="Sterilization" description="Sterilization batch status and release tracking." />
      <SterilizationBoard batches={batches} />
    </div>
  );
}
