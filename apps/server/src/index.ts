import { Elysia, t } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { publishMessage, consumeMessages } from './libs/rabbitmq'

export const app = new Elysia()
    .get('/', 'ok')
    .get('/health', 'ok')
    .use(
        staticPlugin({
            prefix: ''
        })
    )
    .get('/', () => 'Hello Elysia')
    .get('/nendoroid/skadi', () => ({
        id: 1895,
        name: 'Skadi',
        type: 'Nendoroid',
        manufacture: 'Goodsmile',
        cover: `http://localhost:3001/assets/skadi.jpg`,
        license: {
            type: 'approved',
            holder: 'Hypergraph',
            from: 'Arknights'
        }
    }))
    .post('/sign-in', ({ body }: any) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        }),
        response: {
            200: t.Object({
                username: t.String(),
                password: t.String()
            }),
            400: t.Object({
                error: t.String(),
                status: t.Number()
            })
        }
    })
    .ws('/chat', {
        body: t.String(),
        response: t.String(),
        message(ws, message) {
            // Echo the received message back to the client
            ws.send(`Received: ${message}`)
            // Publish received message to RabbitMQ
            publishMessage(message)
        }
    })
    .listen(process.env.PORT ?? 3001) // use given port or 3001

if (process.env.NODE_ENV !== 'production')
    app.use(import('@server/libs/swagger'))

export type app = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

// Consume messages from RabbitMQ and send to WebSocket clients
consumeMessages((message) => {
    // Logic to broadcast message to all connected WebSocket clients
    // You need to keep track of connected clients and send messages accordingly
    console.log(`Broadcasting message from RabbitMQ: ${message}`)
})
