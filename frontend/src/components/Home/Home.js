import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
//components
import RoomList from '../Rooms/Rooms'

let socket

const Home = () => {
  let SOCKET_SERVER_URL = 'http://localhost:4000'
  const [room, setRoom] = useState('')
  const [rooms, setRooms] = useState([])

  //get all
  useEffect(() => {
    socket = io(SOCKET_SERVER_URL)
    socket.on('connect', () => {
      console.log(socket.id)
    })
  })

  //get already existing rooms
  useEffect(() => {
    socket.on('existingRooms', (rooms) => {
      setRooms(rooms)
    })
  }, [])

  //create new room
  useEffect(() => {
    socket.on('roomCreated', (room) => {
      setRooms([...rooms, room])
    })
  }, [rooms])

  const handeleRoomChange = (event) => {
    event.preventDefault()
    socket.emit('createRoom', room)
    setRoom('')
  }

  return (
    <div>
      <form onSubmit={handeleRoomChange} className='form'>
        <input
          type="text"
          value={room}
          onChange={(event) => setRoom(event.target.value)}
        />
        <button type="submit">Create room</button>
      </form>
      <RoomList rooms={rooms} />
    </div>
  )
}

export default Home
