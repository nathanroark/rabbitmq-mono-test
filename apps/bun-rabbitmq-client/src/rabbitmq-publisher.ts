// src/rabbitmq-publisher.ts
import amqp from 'amqplib/callback_api'

let connection: amqp.Connection | null = null
let channel: amqp.Channel | null = null

// Establish connection and channel once
const connectRabbitMQ = () => {
    amqp.connect('amqp://localhost', (error0, conn) => {
        if (error0) {
            console.error('Failed to connect to RabbitMQ:', error0)
            return
        }
        console.log('Connected to RabbitMQ')

        connection = conn

        connection.createChannel((error1, ch) => {
            if (error1) {
                console.error('Failed to create RabbitMQ channel:', error1)
                return
            }
            console.log('RabbitMQ channel created')
            channel = ch
        })
    })
}

// Initialize connection
connectRabbitMQ()

// Clean up resources on exit
process.on('exit', () => {
    if (connection) connection.close()
    console.log('Connection closed on app exit')
})
