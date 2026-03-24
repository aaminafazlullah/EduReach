export default function Table({ columns, data, emptyLabel = 'No records yet.' }) {
  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-card">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-surface-2">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-wide text-ink-2"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center"
              >
                <div className="flex flex-col items-center space-y-3">
                  <svg className="h-12 w-12 text-ink-2/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-sans text-sm text-ink-2">{emptyLabel}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="transition-colors duration-150 hover:bg-surface-2/60"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 align-middle font-sans text-sm text-ink"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

