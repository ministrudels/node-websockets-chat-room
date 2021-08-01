import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contexts/userContext";

// Acts as a hook to the serverside socket the ui components and the WebSocket API -  
// so that anyone using the Websocket doesnt need to know about the Websockets
const useWebSocket = () => {
    const { username, avatar } = useContext(UserContext)
    const [lastMessage, setLastMessage] = useState<ChatWebSocketMsg | null>(null)
    const ws = useRef<WebSocket>();

    // Send
    const sendChatMessage = (messageText: string) => {
        const payload: ChatWebSocketMsg = {
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
        
        ws.current.onmessage = ({ data }) => {
            setLastMessage(JSON.parse(data) as ChatWebSocketMsg)
        }

        return () => {
            sendUserLeave()
            ws.current!.close();
        };
    }, []);

    return {
        sendChatMessage,
        lastMessage
    }
}

export { useWebSocket }
