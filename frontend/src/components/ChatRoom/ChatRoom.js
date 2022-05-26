import react from 'react'
import { useEffect } from 'react'
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
  useEffect(() => {
    socket = io(SOCKET_SERVER_URL)
    socket.on('connect', () => {
      console.log(socket.id)
    })
    socket.emit('joinRoom', room_id[1])
  }, [room_id])

  //send message
  useEffect(() => {
    socket.on('message', (message) => {
      const messageType = {
        ...message,
        ownedByCurrentUser: message.senderid === socket.id,
      }
      setMessages((messages) => [...messages, messageType])
    })
  }, [])

  //get message history
  useEffect(() => {
    socket.emit('getHistory', roomId)
    socket.on('oldMessages', (messages) => {
      setMessages(messages)
    })
  }, [])

  //send message
  const handleNewMessageChange = (event) => {
    setMessage(event.target.value)
  }
  const handleSendMessage = () => {
    if (message) {
      console.log(message)
      socket.emit('sendMessage', message, room_id[1], () => setMessage(''))
    }
  }

  console.log(messages)

  const messageDisplay = messages.map((message, index) => {
    return (
      <li
        key={index}
        className={`message-item ${
          message.ownedByCurrentUser ? 'my-message' : 'received-message'}`}>
        {message.body}
      </li>
    )
  })

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
