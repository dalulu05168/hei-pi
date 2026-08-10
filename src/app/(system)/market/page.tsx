import { PageContainer } from "@/components";
import { UnifiedMarketWorkspace } from "@/modules/market/UnifiedMarketWorkspace";
import { mexicoMarketDataService, usMarketDataService } from "@/services/market";

export default async function MarketPage() {
  const [us, mexico] = await Promise.all([usMarketDataService.getSnapshot(), mexicoMarketDataService.getSnapshot()]);
  return <PageContainer title="全球市场" showHeader={false} className="h-full"><UnifiedMarketWorkspace us={us} mexico={mexico} /></PageContainer>;
}
