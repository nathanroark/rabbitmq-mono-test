import { Elysia, t } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

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
    .listen(process.env.PORT ?? 3001) // use given port or 3001

if (process.env.NODE_ENV !== 'production')
    app.use(import('@server/libs/swagger'))

export type app = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
