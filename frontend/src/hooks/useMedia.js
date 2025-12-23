import { useEffect, useMemo, useRef, useState } from 'react'

export function useMedia({ enabled }) {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function start() {
      setError(null)
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        setStream(s)
      } catch (e) {
        setError(e?.message || 'camera_error')
      }
    }

    if (enabled) start()

    return () => {
      cancelled = true
    }
  }, [enabled])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (stream) {
      el.srcObject = stream
      el.play?.().catch(() => {})
    }
  }, [stream])

  useEffect(() => {
    if (!enabled && stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
  }, [enabled, stream])

  const isActive = useMemo(() => Boolean(stream), [stream])

  return { videoRef, stream, isActive, error }
}
