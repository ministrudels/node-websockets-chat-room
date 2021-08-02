import { Button } from '@material-ui/core';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../contexts/userContext';
import { useWebSocket } from '../hooks/useWebSocket';

const UserJoin = ({ username, avatar }: { username: string, avatar: string }) => {
    return <div className='chat_announcement join'>
        <img src={avatar} className="chat_message_avatar" alt="" />
        <span>{username} joined the chat</span>
    </div>
}

const UserLeave = ({ username, avatar }: { username: string, avatar: string }) => {
    return <div className='chat_announcement leave'>
        <img src={avatar} className="chat_message_avatar" alt="" />
        <span>{username} left the chat</span>
    </div>
}

const UserChat = ({ fromUser, avatar, message }: { fromUser: string, avatar: string, message: string }) => {
    const { username } = useContext(UserContext)
    return <div className={fromUser === username ? "message_holder me" : "message_holder"}>
        <div className="message_box">
            {fromUser === username &&
                <div>
                    <span className="username">{fromUser}</span>
                    <img src={avatar} className="chat_message_avatar" alt="" />
                </div>
            }
            {fromUser !== username &&
                <div>
                    <img src={avatar} className="chat_message_avatar" alt="" />
                    <span className="username">{fromUser}</span>
                </div>
            }
            <span className="message_text">{message}</span>
        </div>
    </div>
}

const ChatItem = ({ wsMsg }: { wsMsg: ChatWebSocketMsg }) => {
    if (wsMsg.type === 'User Join') return <UserJoin username={wsMsg.username} avatar={wsMsg.avatar!} />
    if (wsMsg.type === 'User Leave') return <UserLeave username={wsMsg.username} avatar={wsMsg.avatar!} />
    return <UserChat fromUser={wsMsg.username} avatar={wsMsg.avatar!} message={wsMsg.message!} />
}

const ChatRoom = () => {
    const { username, avatar, logout } = useContext(UserContext)
    const [message, setMessage] = useState('')
    const [chatLog, setChatLog] = useState<ChatWebSocketMsg[] | null>(null)

    const { activeUsers, sendChatMessage, lastMessage } = useWebSocket()

    const handleSendMessage = () => {
        sendChatMessage(message)
        setMessage('')
    }

    const handleMessageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setMessage(e.target.value);
    }

    useEffect(() => {
        if (!lastMessage) return
        // Update Chat room state on updates from the websocket hook
        setChatLog(log => log ? log.concat(lastMessage!) : [lastMessage])
    }, [lastMessage])

    return (
        <div className={'chat_room'}>
            <div className='sidebar'>
                <div className='user_info'>
                    <img src={avatar} className='user_avatar' alt='' />
                    <span className="username">{username}</span>
                    <Button size="small" variant="contained" color="secondary" onClick={() => logout()}>
                        Logout
                    </Button>
                </div>
                <span style={{textAlign:"center"}}><b>Active Users</b></span>
                <div className='active_users'>
                    {activeUsers.map(x => <div>
                        <img src={x.avatar} className="chat_message_avatar" alt="" />
                        <span>{x.username}</span>
                    </div>)
                    }
                </div>
            </div>
            <div className={'chat_area'}>
                <div className={'chat_log'}>
                    {chatLog &&
                        chatLog.map((x, index) => <ChatItem key={index} wsMsg={x} />)
                    }
                </div>

                <div className={'chat_input'}>
                    <input
                        type="text"
                        value={message}
                        placeholder="Type a message"
                        onChange={handleMessageChange}
                        // onKeyUp={(e) => {handleKeyUp(e, message); stoppedTyping();}}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
                    />
                    <Button variant="contained" disableElevation onClick={() => handleSendMessage()}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;
