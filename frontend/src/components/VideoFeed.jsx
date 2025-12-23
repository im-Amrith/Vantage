import { cn } from '../lib/utils'

export default function VideoFeed({ videoRef, className }) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-white/10 bg-black', className)}>
      <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  )
}
