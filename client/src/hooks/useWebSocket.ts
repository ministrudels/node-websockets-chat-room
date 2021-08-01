import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contexts/userContext";

// Acts as a hook to the serverside socket the ui components and the WebSocket API -  
// so that anyone using the Websocket doesnt need to know about the Websockets
const useWebSocket = () => {
    const { username, avatar } = useContext(UserContext)
    const [lastMessage, setLastMessage] = useState<ChatWebSocketMsg | null>(null)
    const [activeUsers, setActiveUsers] = useState<User[]>([])
    const ws = useRef<WebSocket>();

    // Senders
    const sendChatMessage = (messageText: string) => {
        const payload = {
            type: 'Chat',
            username: username,
            avatar: avatar,
            message: messageText
        }
        ws.current!.send(JSON.stringify(payload))
    }

    const sendUserJoin = () => {
        ws.current!.send(JSON.stringify({
            type: 'User Join',
            username: username,
            avatar: avatar,
        }))
    }

    const sendUserLeave = () => {
        ws.current!.send(JSON.stringify({
            type: 'User Leave',
            username: username,
            avatar: avatar,
        }))
    }

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8888');

        ws.current.onopen = () => {
            sendUserJoin()
        }

        ws.current.onclose = () => {
            sendUserLeave()
        }

        // Receivers
        ws.current.onmessage = ({ data }) => {
            const payload = JSON.parse(data) as WebSocketMsg 
            if (['Chat', 'User Join', 'User Leave'].includes(payload.type)) setLastMessage(payload as ChatWebSocketMsg)
            if ('User List' === payload.type) setActiveUsers(payload.users!)
        }

        return () => {
            sendUserLeave()
            ws.current!.close();
        };
    }, []);

    return {
        activeUsers,
        sendChatMessage,
        lastMessage
    }
}

export { useWebSocket }
