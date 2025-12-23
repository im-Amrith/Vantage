import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useWebSocket({ url, enabled }) {
  const wsRef = useRef(null)
  const [readyState, setReadyState] = useState('closed')
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)

  const connect = useCallback(() => {
    if (!url) return
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return
    }

    setError(null)
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => setReadyState('open')
    ws.onclose = () => setReadyState('closed')
    ws.onerror = () => setError('websocket_error')
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data)
        setMessages((prev) => [...prev, data])
      } catch {
        setMessages((prev) => [...prev, { type: 'raw', payload: evt.data }])
      }
    }
  }, [url])

  const disconnect = useCallback(() => {
    if (!wsRef.current) return
    wsRef.current.close()
    wsRef.current = null
  }, [])

  const sendJson = useCallback((obj) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return false
    ws.send(JSON.stringify(obj))
    return true
  }, [])

  useEffect(() => {
    if (!enabled) {
      disconnect()
      return
    }
    connect()
    return () => disconnect()
  }, [connect, disconnect, enabled])

  const lastMessage = useMemo(() => (messages.length ? messages[messages.length - 1] : null), [messages])

  return {
    readyState,
    messages,
    lastMessage,
    error,
    connect,
    disconnect,
    sendJson,
  }
}
