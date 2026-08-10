import { IconUserPlus, IconX } from "@tabler/icons-react";
import { ClientAvatar } from "@/modules/clients";
import type { TradeInvestorPlan, TradeMode } from "../types";

interface InvestorCardProps {
  mode: TradeMode;
  onPurchaseCapitalChange: (clientId: string, value: string) => void;
  onToggleRejected: (clientId: string) => void;
  plan: TradeInvestorPlan;
  purchaseCapitalValue: string;
  rejected: boolean;
}

const personTypeLabels = {
  legacy_female: "老女",
  legacy_male: "老男",
  new_female: "新女",
  new_male: "新男",
} as const;

function formatMoney(value: number | null) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("es-MX", {
    currency: "MXN",
    currencyDisplay: "code",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function formatShares(value: number | null) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value);
}

export function InvestorCard({
  mode,
  onPurchaseCapitalChange,
  onToggleRejected,
  plan,
  purchaseCapitalValue,
  rejected,
}: InvestorCardProps) {
  const { client } = plan;
  const operationalIdentity = `${client.id}${personTypeLabels[client.personType] ?? "—"}`;

  return (
    <article
      className={`relative rounded-xl border p-3 transition-colors ${
        mode === "buy" ? "min-h-[168px]" : "min-h-[142px]"
      } ${
        rejected
          ? "border-[rgba(224,76,76,0.42)] bg-[rgba(67,15,17,0.2)]"
          : "border-[rgba(244,196,48,0.2)] bg-[#0b1622]"
      }`}
    >
      <div className="flex items-start gap-2.5 pr-8">
        <ClientAvatar avatarUrl={client.avatarUrl} name={operationalIdentity} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-[var(--pi-color-text)]">
            {operationalIdentity}
          </p>
          <span className="mt-1 inline-flex rounded border border-[rgba(244,196,48,0.24)] bg-[var(--pi-color-brand-soft)] px-1.5 py-0.5 text-[8px] font-semibold text-[#d8b65f]">
            {client.group || "—"}
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label={rejected ? `邀请 ${operationalIdentity}` : `拒绝 ${operationalIdentity}`}
        aria-pressed={rejected}
        title={rejected ? "邀请参与" : "拒绝参与"}
        onClick={() => onToggleRejected(client.id)}
        className={`absolute top-2.5 right-2.5 grid h-7 w-7 place-items-center rounded-lg border ${
          rejected
            ? "border-[rgba(244,196,48,0.42)] bg-[var(--pi-color-brand-soft)] text-[#f4c430]"
            : "border-[rgba(224,76,76,0.28)] bg-[rgba(105,22,25,0.12)] text-[#ef5555] hover:bg-[rgba(105,22,25,0.28)]"
        }`}
      >
        {rejected ? <IconUserPlus size={14} stroke={1.8} /> : <IconX size={15} stroke={2} />}
      </button>

      {mode === "buy" ? (
        <div className="mt-3 border-t border-[var(--pi-color-border)] pt-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
              可用资金（MXN）
            </p>
            <strong className="truncate font-mono text-[9px] font-medium text-[var(--pi-color-text-muted)]">
              {formatMoney(plan.availableFunds)}
            </strong>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <p className="text-[8px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
                购买资金（MXN）
              </p>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={purchaseCapitalValue}
                disabled={rejected}
                aria-label={`调整 ${operationalIdentity} 的购买资金`}
                onChange={(event) =>
                  onPurchaseCapitalChange(client.id, event.target.value)
                }
                className="mt-1 block h-6 w-full rounded border border-[rgba(244,196,48,0.2)] bg-[#08121d] px-1.5 font-mono text-[10px] font-medium text-[#f4c430] outline-none focus:border-[rgba(244,196,48,0.48)] disabled:cursor-not-allowed disabled:opacity-45"
              />
            </div>
            <div className="border-l border-[var(--pi-color-border)] pl-2">
              <p className="text-[8px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
                预计股数
              </p>
              <strong className="mt-1 block font-mono text-[11px] font-medium text-[var(--pi-color-text)]">
                {formatShares(plan.allocatedQuantity)}
              </strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--pi-color-border)] pt-2.5">
          <div>
            <p className="text-[8px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
              可卖市值
            </p>
            <strong className="mt-1 block truncate font-mono text-[11px] font-medium text-[#f4c430]">
              {formatMoney(plan.allocatedCapital)}
            </strong>
          </div>
          <div className="border-l border-[var(--pi-color-border)] pl-2">
            <p className="text-[8px] tracking-[0.08em] text-[var(--pi-color-text-faint)]">
              可卖股数
            </p>
            <strong className="mt-1 block font-mono text-[11px] font-medium text-[var(--pi-color-text)]">
              {formatShares(plan.allocatedQuantity)}
            </strong>
          </div>
        </div>
      )}

      {rejected ? (
        <span className="absolute right-3 bottom-2 text-[8px] font-semibold tracking-[0.12em] text-[#ef6666]">
          已拒绝
        </span>
      ) : null}
    </article>
  );
}
