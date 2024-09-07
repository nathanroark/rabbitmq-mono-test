// src/rabbitmq-consumer.ts
import amqp from 'amqplib/callback_api'

let connection: amqp.Connection | null = null
let channel: amqp.Channel | null = null

const connectRabbitMQ = () => {
    amqp.connect('amqp://localhost', (error0, conn) => {
        if (error0) {
            console.error('Failed to connect to RabbitMQ:', error0)
            return
        }
        console.log('Connected to RabbitMQ for consuming')
        connection = conn

        connection.createChannel((error1, ch) => {
            if (error1) {
                console.error('Failed to create RabbitMQ channel:', error1)
                return
            }
            console.log('RabbitMQ channel created for consuming')
            channel = ch

            const queue = 'elysia_to_clients'

            channel.assertQueue(queue, { durable: false }, (error2, _ok) => {
                if (error2) {
                    console.error('Failed to assert queue:', error2)
                    return
                }
                // console.log(
                //   ` [*] Waiting for messages in ${queue}. To exit press CTRL+C`
                // );

                if (!channel) {
                    console.error('Channel is not available')
                    return
                }

                channel.consume(
                    queue,
                    (msg) => {
                        if (msg) {
                            const messageContent = msg.content.toString()
                            console.log(` [x] Received: ${messageContent}`)
                        } else {
                            console.log('Received an empty message')
                        }
                    },
                    { noAck: true }
                )
            })
        })
    })
}

// Export the function correctly
export const consumeMessages = connectRabbitMQ

// Clean up resources on exit
process.on('exit', () => {
    if (connection) connection.close()
    console.log('Connection closed on app exit')
})
