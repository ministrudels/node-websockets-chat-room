import { useState } from "react"

const useUser = (): UserContext => {
    const [username, setUsername] = useState('')
    const [avatar, setAvatar] = useState('')
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)

    const login = (u: string, a: string) => {
        setUsername(u)
        setAvatar(a)
        setIsUserLoggedIn(true)
    }

    const logout = () => {
        setUsername('')
        setAvatar('')
        setIsUserLoggedIn(false)
    }

    return {
        username,
        avatar,
        isUserLoggedIn,
        login,
        logout
    }
}

export { useUser }