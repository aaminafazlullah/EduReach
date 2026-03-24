export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  ...rest
}) {
  const base = 'inline-flex items-center justify-center rounded-md px-5 py-2.5 font-sans text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return 'bg-surface border border-border text-ink hover:bg-surface-2 hover:translate-y-[-1px] active:scale-[0.98]'
      case 'danger':
        return 'bg-red text-white hover:bg-red/90 hover:translate-y-[-1px] active:scale-[0.98] shadow-sm'
      default:
        return 'bg-accent text-white hover:bg-accent/90 hover:translate-y-[-1px] active:scale-[0.98] shadow-sm'
    }
  }

  return (
    <button className={`${base} ${getVariantStyles()} ${className}`} {...rest}>
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  )
}

