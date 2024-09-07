'use client'

import useWebSocket from '@web/hooks/useWebSocket'

export default function Page() {
    const { messages, sendMessage } = useWebSocket('ws://localhost:3001/chat')

    return (
        <div>
            <h1>React App with RabbitMQ</h1>
            <button onClick={() => sendMessage('Hello from React App')}>
                Send Message
            </button>

            <h2>Received Messages:</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    )
}
