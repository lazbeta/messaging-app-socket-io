import react from 'react'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'
import './ChatRoom.css'

let socket
const ChatRoom = () => {
  const roomId = useParams()
  let room_id = Object.values(roomId)

  const [messages, setMessages] = react.useState([])
  const [message, setMessage] = react.useState('')

  const SOCKET_SERVER_URL = 'localhost:4000'

  //join room
  react.useEffect(() => {
    socket = io(SOCKET_SERVER_URL)
    socket.emit('joinRoom', room_id[1])
  }, [room_id])

  //send message
  react.useEffect(() => {
    socket.on('message', (message) => {
      const messageType = {
        ...message,
        ownedByCurrentUser: message.senderId === socket.id,
      }
      setMessages([...messages, messageType])
    })
  }, [messages, room_id])

  //get message history
  react.useEffect(() => {
    socket.emit('getHistory', roomId)
    socket.on('oldMessages', (messages) => {
      setMessages(messages)
    })
  }, [roomId])

  //send message
  const handleNewMessageChange = (event) => {
    setMessage(event.target.value)
  }
  const handleSendMessage = async (event) => {
    event.preventDefault()
    await socket.emit('sendMessage', message, room_id[1], () => setMessage(''))
  }

  const getMessages = Object.fromEntries(
    Object.entries(messages).map(([key, { body }]) => [key, body])
  )
  const messageDisplay = Object.values(getMessages).map((item, index) => {
    return (
      <li
        key={index}
        className={`message-item ${
          message.ownedByCurrentUser ? 'my-message' : 'received-message'
        }`}
      >
        {item}
      </li>
    )
  })

  console.log(messageDisplay, 'mess dispay')

  return (
    <>
      <div>
        <h2>Room: {room_id[0]}</h2>
        <div>
          <ol>{messageDisplay}</ol>
        </div>
        <textarea
          value={message}
          onChange={handleNewMessageChange}
          placeholder="write here"
          //onKeyPress={event => event.key === 'Enter' ? handleNewMessageChange(event) : null}
        />
        <button onClick={handleSendMessage}>send</button>
      </div>
    </>
  )
}

export default ChatRoom

/* className={`message-item ${
                    message.ownedByCurrentUser ? "my-message" : "received-message"}`} */
