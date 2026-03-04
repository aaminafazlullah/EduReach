export default function Input({
  label,
  name,
  type = 'text',
  register,
  error,
  ...rest
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 placeholder:text-slate-400"
        {...(register ? register(name) : {})}
        {...rest}
      />
      {error && (
        <p className="text-xs text-red-500">
          {error.message || 'This field is required'}
        </p>
      )}
    </div>
  )
}

