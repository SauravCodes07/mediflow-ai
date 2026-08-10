import { PageHeader } from "../../../components/ui/PageHeader";
import { PacksBoard } from "./PacksBoard";
import { getInstrumentPacks, getCurrentOrgId } from "../../../../lib/data/queries";

export default async function InstrumentPacksPage() {
  const orgId = await getCurrentOrgId();
  const packs = await getInstrumentPacks(orgId);

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <PageHeader title="Instrument Packs" description="Pack inventory, identifiers and lifecycle state." />
      <PacksBoard packs={packs} />
    </div>
  );
}
