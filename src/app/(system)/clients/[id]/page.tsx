import { PageContainer } from "@/components";
import {
  ClientDetailWorkspace,
  clientsDataStatus,
  getClientById,
} from "@/modules/clients";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params;
  const client = getClientById(id);

  return (
    <PageContainer title="客户资产深度详情" showHeader={false} className="h-full">
      <ClientDetailWorkspace
        client={client}
        dataStatus={clientsDataStatus}
        requestedId={id}
      />
    </PageContainer>
  );
}
