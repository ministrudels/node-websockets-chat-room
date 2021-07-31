/// <reference types="react-scripts" />

type UserContext = {
    username: string,
    avatar: string,
    login: (u: string, a: string) => void,
    logout: () => void,
    isUserLoggedIn: boolean
}

interface ChatWebSocketMsg {
    type: 'User Join' | 'User Leave' | 'Chat',
    username: string,
    avatar?: string,
    message?: string
}