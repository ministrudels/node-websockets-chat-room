import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

// Type of websocket message ws receives
type WebSocketMsg = {
    type: 'User Join' | 'User Leave' | 'User Typing' | 'Chat'
    username: string,
    avatar: string,
    isTyping?: boolean,
    message?: string
}

type User = {
    username: string,
    avatar: string,
}

const port = 8888
const server = http.createServer(express)
const wss = new WebSocket.Server({ server })

let users: User[] = []

// Broadcast ws message. Simply sends back the received ws msg from client to all clients
const broadcastUserWSMessage = (wsMsg: string) => {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(wsMsg)
        }
    })
}
// Broadcast user list
const broadcastUserList = () => {
    const payload = JSON.stringify({
        type: 'User List',
        users: users
    })
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload)
        }
    })
}

// Broadcast user is typing
const broadcastUserIsTyping = (ws: WebSocket) => {

}

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        const wsMsg: WebSocketMsg = JSON.parse(data as string)

        // Broadcasts the sent message back to all client sockets
        if (wsMsg.type === 'Chat') {
            broadcastUserWSMessage(data as string)
        }

        // If user joins add to current list of active users and broadcast new list of users to all clients
        if (wsMsg.type === 'User Join') {
            users.push({
                username: wsMsg.username,
                avatar: wsMsg.avatar!,
            })
            broadcastUserWSMessage(data as string)
            broadcastUserList()
        }

        // If user leaves delete from current list of active users and broadcast new list of users to all clients
        if (wsMsg.type === 'User Leave') {
            users = users.filter(user => user.username !== wsMsg.username && user.avatar !== wsMsg.avatar)
            broadcastUserWSMessage(data as string)
            broadcastUserList()
        }

    })
})

server.listen(port, function () {
    console.log(`Server is listening on ${port}`)
})
