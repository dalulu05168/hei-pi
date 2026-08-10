import { PageContainer } from "@/components";
import { TemplatesWorkspace } from "@/modules/templates";
import { templateLibraryService } from "@/services/templates";

export default async function TemplatesPage() {
  const snapshot = await templateLibraryService.getSnapshot();

  return (
    <PageContainer
      title="Centro de Plantillas"
      showHeader={false}
      className="h-full"
    >
      <TemplatesWorkspace snapshot={snapshot} />
    </PageContainer>
  );
}
