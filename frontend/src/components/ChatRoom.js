import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
//import useChat from '../customHooks/useChat'
import io from 'socket.io-client'

 let socket
const ChatRoom = () => {
    const roomId = useParams()
    let room_id = Object.values(roomId)

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    
    const SOCKET_SERVER_URL='localhost:4000'

    //join room
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        socket = io(SOCKET_SERVER_URL)
        socket.emit('joinRoom', room_id[1])
    },[room_id])
    
    //send message
    useEffect(() => {
        socket.on('message', message => {
            const messageType = {
                ...message,
                ownedByCurrentUser: message.senderId === socket.id
            }
            setMessages([...messages, messageType])
        })
    },[messages, room_id])

    //get message history
     useEffect(() => {
        socket.emit('messageHistory', room_id[1])
        socket.on('oldMessages', messages => {
            setMessages(messages)
        })
    },[room_id])

    const handleNewMessageChange = event => {
        event.preventDefault()
        setMessage(event.target.value)
    }
    const handleSendMessage =  async (event) => {
        event.preventDefault()
        await socket.emit('sendMessage', message, room_id[1], () => setMessage(''))
  }

  const getMessages = Object.fromEntries(Object
    .entries(messages)
    .map(([key, { message }]) => [key, message.body])
 )
    const messageDisplay = Object.values(getMessages).map((item, index) => {
    return <li key={index}>{item}</li>
  })

const getRoomMess = Object.fromEntries(Object
    .entries(messages)
    .map(([key, { room }]) => [key, room])
 )
  console.log(getRoomMess, 'get messages')

  return (
      <>
        <div>
            <h2>Room: {room_id[0]}</h2>
            <div>
                <ol>
                    {messageDisplay}
                </ol>
            </div>
            <textarea
            value={message}
            onChange={handleNewMessageChange}
            placeholder='write here'
            //onKeyPress={event => event.key === 'Enter' ? handleNewMessageChange(event) : null}
            />
            <button onClick={handleSendMessage}>
                send
            </button>
        </div>
      </>
  )
}

export default ChatRoom

/* className={`message-item ${
                    message.ownedByCurrentUser ? "my-message" : "received-message"}`} */