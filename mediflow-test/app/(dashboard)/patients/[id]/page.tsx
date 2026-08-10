import { PageShell } from "../../../components/ui/PageShell";

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageShell
      title={`Patient ${id}`}
      description="Admission, ward, procedure and readiness history for this patient."
      comingSoonNote="Dynamic route verified. Patient record data connects in a later build step."
    />
  );
}
