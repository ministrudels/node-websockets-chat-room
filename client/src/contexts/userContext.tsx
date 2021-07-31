import { createContext } from "react";
import { useUser } from "../hooks/useUser";

const defaultVal: UserContext = {
    username: '',
    avatar: '',
    login: () => null,
    logout: () => null,
    isUserLoggedIn: false
}

const UserContext = createContext(defaultVal)

const UserProvider: React.FC = ({ children }) => {
    const { username, avatar, login, logout, isUserLoggedIn } = useUser()
    return <UserContext.Provider
        value={{
            username,
            avatar,
            login,
            logout,
            isUserLoggedIn
        }}
    >
        {children}
    </UserContext.Provider>
}

export { UserContext, UserProvider }