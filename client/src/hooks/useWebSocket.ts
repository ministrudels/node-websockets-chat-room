import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";

// Basically should just be a wrapper between the ui components and the WebSocket API -  
// so that anyone using the Websocket doesnt need to know about the Websocket API

const ws = new WebSocket('ws://localhost:8888')
// ws.onopen = () => {
//     console.log('websocket open')
// }
const useWebSocket = () => {
    const { username, avatar } = useContext(UserContext)
    const [lastMessage, setLastMessage] = useState<ChatWebSocketMsg | null>(null)

    // Receive
    ws.onmessage = ({ data }) => {
        const wsMsg: ChatWebSocketMsg = JSON.parse(data)
        setLastMessage(wsMsg)
    }

    // ws.onclose = () => {
    //     ws.send(JSON.stringify({
    //         type: 'User Leave',
    //         username: username,
    //     }))
    // }

    // Send
    const sendChatMessage = (messageText: string) => {
        const payload: ChatWebSocketMsg = {
            type: 'Chat',
            username: username,
            avatar: avatar,
            message: messageText
        }
        ws.send(JSON.stringify(payload))
    }

    const sendUserJoin = () => {
        ws.send(JSON.stringify({
            type: 'User Join',
            username: username,
            avatar: avatar,
        }))
    }

    const sendUserLeave = () => {
        ws.send(JSON.stringify({
            type: 'User Leave',
            username: username,
            avatar: avatar,
        }))
    }

    useEffect(() => {
        
    })

    return {
        sendUserJoin,
        sendChatMessage,
        sendUserLeave,
        lastMessage
    }
}

export { useWebSocket }
