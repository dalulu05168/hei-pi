import { PageContainer } from "@/components";
import { SettingsWorkspace } from "@/modules/settings";

export default function SettingsPage() {
  return (
    <PageContainer
      title="系统设置"
      showHeader={false}
      className="h-full"
    >
      <SettingsWorkspace />
    </PageContainer>
  );
}
