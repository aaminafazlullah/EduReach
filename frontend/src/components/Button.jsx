export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const styles =
    variant === 'outline'
      ? 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
      : 'bg-slate-900 text-white shadow-sm hover:bg-slate-800'

  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  )
}

