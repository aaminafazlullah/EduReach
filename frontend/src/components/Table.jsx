export default function Table({ columns, data, emptyLabel = 'No records yet.' }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-surface shadow-soft">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="bg-slate-50/80">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-xs text-muted"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50/80"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-2 align-middle text-xs text-slate-700"
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

