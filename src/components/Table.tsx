import { isValidElement, type ReactNode } from "react";

export interface TableColumn<T> {
  header: ReactNode;
  key: string;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  emptyMessage?: string;
  getRowKey: (row: T, index: number) => string;
  rows: T[];
}

function renderValue<T>(row: T, key: string): ReactNode {
  const value = (row as Record<string, unknown>)[key];

  if (value === null || value === undefined) {
    return null;
  }

  if (isValidElement(value)) {
    return value;
  }

  return String(value);
}

export function Table<T>({
  columns,
  emptyMessage = "No hay datos disponibles.",
  getRowKey,
  rows,
}: TableProps<T>) {
  return (
    <div className="terminal-panel terminal-scrollbar overflow-x-auto">
      <table className="w-full border-collapse text-left text-[13px] leading-5">
        <thead className="bg-white/[0.025] text-[var(--pi-color-text-muted)]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="whitespace-nowrap px-5 py-3.5 text-[10.5px] font-semibold leading-4 tracking-[0.07em]"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--pi-color-border)]">
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={getRowKey(row, rowIndex)} className="hover:bg-white/[0.018]">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-3.5 align-middle">
                    {column.render
                      ? column.render(row)
                      : renderValue(row, column.key)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={Math.max(columns.length, 1)}
                className="terminal-empty-grid px-5 py-12 text-center text-[13px] leading-5 text-[var(--pi-color-text-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
