import { PageShell } from "../../components/ui/PageShell";
import { ReportsBoard } from "./ReportsBoard";

export default function Page() {
  return (
    <PageShell title="Reports & Export Engine" description="Generate, preview, print PDF, and export CSV for hospital operations reports.">
      <ReportsBoard />
    </PageShell>
  );
}
