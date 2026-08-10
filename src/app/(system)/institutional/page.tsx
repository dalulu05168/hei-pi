import { PageContainer } from "@/components";
import { InstitutionalWorkspace } from "@/modules/institutional";
import { institutionalReservationService } from "@/services/institutional";

export default async function InstitutionalPage() {
  const snapshot = await institutionalReservationService.getSnapshot();

  return (
    <PageContainer
      title="Reserva Institucional"
      showHeader={false}
      className="h-full"
    >
      <InstitutionalWorkspace snapshot={snapshot} />
    </PageContainer>
  );
}
