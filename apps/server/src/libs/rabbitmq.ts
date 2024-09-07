// src/rabbitmq.ts
import amqp from 'amqplib/callback_api'

const connectRabbitMQ = (callback: (channel: amqp.Channel) => void) => {
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            console.error('Failed to connect to RabbitMQ:', error0)
            return
        }
        console.log('Connected to RabbitMQ')
        connection.createChannel((error1, channel) => {
            if (error1) {
                console.error('Failed to create RabbitMQ channel:', error1)
                return
            }
            console.log('RabbitMQ channel created')
            callback(channel)
        })
    })
}

export const publishMessage = (message: string) => {
    connectRabbitMQ((channel) => {
        const queue = 'elysia_to_clients'
        channel.assertQueue(queue, { durable: false })

        channel.sendToQueue(queue, Buffer.from(message))
        console.log(` [x] Sent '${message}' to queue '${queue}'`)
    })
}

export const consumeMessages = (onMessage: (msg: string) => void) => {
    connectRabbitMQ((channel) => {
        const queue = 'clients_to_elysia'
        channel.assertQueue(queue, { durable: false })

        console.log(` [*] Waiting for messages in queue '${queue}'`)
        channel.consume(
            queue,
            (msg) => {
                if (msg) {
                    const message = msg.content.toString()
                    console.log(` [x] Received message: ${message}`)
                    onMessage(message)
                } else {
                    console.log('Received an empty message')
                }
            },
            { noAck: true }
        )
    })
}
