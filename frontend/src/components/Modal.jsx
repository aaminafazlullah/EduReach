export default function Modal({ open, title, description, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm animate-page-enter">
      <div className="w-full max-w-lg rounded-xl bg-surface p-8 shadow-elevated animate-page-enter">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {(title || description) && (
              <header className="mb-6">
                {title && (
                  <h2 className="font-display text-xl font-semibold text-ink">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="font-sans mt-2 text-sm text-ink-2">
                    {description}
                  </p>
                )}
              </header>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-8 w-8 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

