// src/hooks/use-websocket.ts
import { useEffect, useState, useRef } from 'react'

// Define the type for WebSocket messages
type WebSocketMessage = string // Replace with a specific type if your messages are more complex

const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<WebSocketMessage[]>([])
    const ws = useRef<WebSocket | null>(null)

    useEffect(() => {
        // Create WebSocket connection
        ws.current = new WebSocket(url)

        ws.current.onopen = () => {
            console.log('WebSocket connection opened')
            // Send an initial message if needed
            // ws.current?.send('Hello from React client')
        }

        ws.current.onmessage = (event: MessageEvent<WebSocketMessage>) => {
            console.log('Received message from server:', event.data)
            // Use the correct type to avoid unsafe returns
            setMessages((prevMessages) => [...prevMessages, event.data])
        }

        ws.current.onclose = () => {
            console.log('WebSocket connection closed')
        }

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        // Cleanup function to close the WebSocket connection
        return () => {
            ws.current?.close()
        }
    }, [url])

    // Function to send messages
    const sendMessage = (message: WebSocketMessage) => {
        ws.current?.send(message)
    }

    return { messages, sendMessage }
}

export default useWebSocket
