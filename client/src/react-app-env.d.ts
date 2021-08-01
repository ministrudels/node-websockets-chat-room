/// <reference types="react-scripts" />

type UserContext = {
    username: string,
    avatar: string,
    login: (u: string, a: string) => void,
    logout: () => void,
    isUserLoggedIn: boolean
}

type User = {
    username: string,
    avatar: string
}

interface ChatWebSocketMsg {
    type: 'Chat' | 'User Join' | 'User Leave',
    username: string,
    avatar: string,
    message?: string
}

// Type of websocket message ws receives
interface WebSocketMsg {
    type: 'Chat' | 'User Join' | 'User Leave' | 'User List',
    users?: {
        username: string,
        avatar: string
    }[],
    username?: string,
    avatar?: string,
    message?: string
}