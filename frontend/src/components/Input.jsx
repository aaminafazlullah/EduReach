export default function Input({
  label,
  name,
  type = 'text',
  register,
  validation = {},
  error,
  ...rest
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="font-sans text-xs font-medium uppercase tracking-wide text-ink-2"
        >
          {label}
        </label>
      )}
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          className={`w-full rounded-md bg-surface py-3 px-4 text-ink outline-none transition-all duration-150 ${
            error
              ? 'border-2 border-red focus:border-red focus:ring-2 focus:ring-red/20'
              : 'border border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
          }`}
          {...(register ? register(name, validation) : {})}
          {...rest}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={`w-full rounded-md bg-surface py-3 px-4 text-ink outline-none transition-all duration-150 placeholder:text-ink-2/50 ${
            error
              ? 'border-2 border-red focus:border-red focus:ring-2 focus:ring-red/20'
              : 'border border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
          }`}
          {...(register ? register(name, validation) : {})}
          {...rest}
        />
      )}
      {error && (
        <p className="font-sans text-xs text-red">
          {error.message || 'This field is required'}
        </p>
      )}
    </div>
  )
}

