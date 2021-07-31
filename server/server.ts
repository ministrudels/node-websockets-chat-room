import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

// Types of websocket messages it can take
type WebSocketMsg = {
    type: 'User Join' | 'User Leave' | 'Chat',
    username: string,
    avatar?: string
    message?: string
}

const port = 8888
const server = http.createServer(express)
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
    // When a message is received by websocket, send the same message to everyone
    const broadcastChatMessage = (username: string, avatar: string, message: string) => {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify({
                    type: 'Chat',
                    username: username,
                    avatar: avatar,
                    message: message
                }))
            }
        })
    }

    ws.on('message', function incoming(data) {
        const wsMsg:WebSocketMsg = JSON.parse(data as string)
        // Just broadcast the sent message back to all client sockets
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN){
                client.send(data)
            }
        })
    })
})

server.listen(port, function() {
    console.log(`Server is listening on ${port}`)
})
