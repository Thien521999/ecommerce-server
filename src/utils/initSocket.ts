import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'

let io: Server | null = null

export const initSocket = (httpServer: ServerHttp) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.HOST || 'http://localhost:3000'
    }
  })

  io.on('connection', (socket) => {
    console.log(`🔌 User ${socket.id} connected`)

    socket.on('disconnect', (reason) => {
      console.log(`❌ User ${socket.id} disconnected: ${reason}`)
    })
  })

  return io
}

export const getSocket = () => {
  if (!io) throw new Error('Socket.io has not been initialized!')
  return io
}
