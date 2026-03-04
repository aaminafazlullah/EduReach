export default function Card({ title, description, children, className = '' }) {
  return (
    <section
      className={`rounded-xl bg-surface p-6 shadow-soft ring-1 ring-slate-100 ${className}`}
    >
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
      {children}
    </section>
  )
}

