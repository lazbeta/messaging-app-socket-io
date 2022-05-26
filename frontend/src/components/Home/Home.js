import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
//components
import RoomList from '../Rooms/Rooms'
import './Home.css'

let socket

const Home = () => {
  let SOCKET_SERVER_URL = 'http://localhost:4000'
  const [room, setRoom] = useState('')
  const [rooms, setRooms] = useState([])
  const [query, setQuery] = useState('')

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

  //search bar
  const getRooms = (query , rooms) => {
    if (!query) {
      return rooms
    }
    return rooms.filter(room => room.name.toLowerCase().includes(query))
  }


  const handleQuery = event => {
    setQuery(event.target.value)
  }

  return (
    <div className='central'>
      <h1>instant messaging app socket-io mongodb</h1>
      <input className='input-field' placeholder='Search rooms' type='text' onChange={handleQuery}/>
      <div className='form-center'>
        <form onSubmit={handeleRoomChange} className='form'>
          <input
            className='input-field2'
            type="text"
            placeholder='Create room'
            value={room}
            onChange={(event) => setRoom(event.target.value)}
          />
          <button className='button-56' type="submit">Create room</button>
        </form>
      </div>
      <div className='home'>
        <RoomList getRooms={getRooms} query={query} rooms={rooms}/>
      </div>
    </div>
  )
}

export default Home
