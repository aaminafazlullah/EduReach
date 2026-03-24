export default function Loader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex space-x-1">
        <div className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

