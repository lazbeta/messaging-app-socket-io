import { useEffect, useRef, useState } from "react"
import io from "socket.io-client"

const useChat = (room_id) => {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const socketRef = useRef()


const NEW_CHAT_MESSAGE_EVENT = "sendMessage"
const SOCKET_SERVER_URL = 'http://localhost:4000'


    useEffect(() => {
        //creating websocket connection
        socketRef.current = io(SOCKET_SERVER_URL)
        
        //join room
        socketRef.current.emit('join-room', { name: room_id } )

        //listening to incoming messages
        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
            const incomingMessage = {
                ...message,
                ownedByCurrentUser: message.senderId === socketRef.current.id
            }
            setMessages((messages) => [...messages, incomingMessage])
        })

        //ends socket reference when connection is closed
        return () => {
            socketRef.current.disconnect()
        }
    },[room_id])

    //sends message to the server which forwards it to all users in the same room
    const sendMessage = () => {
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, message, room_id, () => setMessage(''))
    }

    return { messages, sendMessage }

}

export default useChat