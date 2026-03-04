export default function Modal({ open, title, description, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-surface p-5 shadow-soft ring-1 ring-slate-100">
        {(title || description) && (
          <header className="mb-4">
            {title && (
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-muted">{description}</p>
            )}
          </header>
        )}
        <div>{children}</div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

