export default function Card({ title, description, children, className = '', accent = false }) {
  return (
    <section
      className={`rounded-lg bg-surface p-6 shadow-card transition-all duration-200 hover:shadow-elevated ${
        accent ? 'border-l-4 border-accent' : ''
      } ${className}`}
    >
      {(title || description) && (
        <header className={`mb-4 ${title ? 'border-t border-border pt-4' : ''}`}>
          {title && (
            <h2 className="font-display text-base font-semibold text-ink">
              {title}
            </h2>
          )}
          {description && (
            <p className="font-sans mt-1 text-sm text-ink-2">
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  )
}

