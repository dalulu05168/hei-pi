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
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-white/[0.025] text-[var(--pi-color-text-muted)]">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-4 py-3 text-[10px] font-medium tracking-[0.08em]">
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
                  <td key={column.key} className="px-4 py-3">
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
                className="terminal-empty-grid px-4 py-12 text-center text-[var(--pi-color-text-muted)]"
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
