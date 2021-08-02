import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as uuid from 'node-uuid'

// Type of websocket message ws receives
type WebSocketMsg = {
    type: 'User Join' | 'User Leave' | 'User Typing' | 'Chat'
    username: string,
    avatar: string,
    isTyping?: boolean,
    message?: string
}

type User = {
    id: string,
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

wss.on('connection', function connection(ws: WebSocket & { id: string }) {
    ws.id = uuid.v4();

    ws.on('message', (data: string) => {
        const wsMsg: WebSocketMsg = JSON.parse(data)

        // Broadcasts the sent message back to all client sockets
        if (wsMsg.type === 'Chat') {
            broadcastUserWSMessage(data)
        }

        // If user joins, add to current list of active users and broadcast new list of users to all clients
        if (wsMsg.type === 'User Join') {
            users.push({
                id: ws.id,
                username: wsMsg.username,
                avatar: wsMsg.avatar!,
            })
            broadcastUserWSMessage(data)
            broadcastUserList()
        }
    })

    ws.on('close', (a, b) => {
        const userWhoLeft = users.filter(user => user.id === ws.id)[0]
        users = users.filter(user => user.id !== ws.id)
        broadcastUserWSMessage(JSON.stringify({
            type: 'User Leave',
            username: userWhoLeft.username,
            avatar: userWhoLeft.avatar,
        }))
        broadcastUserList()
    })
})


server.listen(port, function () {
    console.log(`Server is listening on ${port}`)
})
