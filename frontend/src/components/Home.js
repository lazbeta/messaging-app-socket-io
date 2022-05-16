import { useEffect, useState } from "react"
import { io } from 'socket.io-client'
//components
import RoomList from './Rooms'

let socket

const Home = () => {
    let SOCKET_SERVER_URL = 'http://localhost:4000'
    const [room, setRoom] = useState('')
    const [rooms, setRooms] = useState([])

    //get all 
    useEffect(() => {
        socket = io(SOCKET_SERVER_URL)
        return () => {
            socket.disconnect();
            socket.off();
        }
    },[SOCKET_SERVER_URL])

    //get already existing rooms
    useEffect(() => {
        socket.on('existing-rooms', rooms => {
            setRooms(rooms)
        })
    },[])

    //create new room
    useEffect(() => {
        socket.on('room-created', room => {
            setRooms([...rooms, room])
        })
    }, [rooms])

    const handeleRoomChange = event => {
        event.preventDefault()
        socket.emit('create-room', room)
        setRoom('')
    }

    console.log(rooms, 'rooms')

    return (
        <div>
            <form onSubmit={handeleRoomChange}>
                 <input
            type="text"
            value={room}
            onChange={event => setRoom(event.target.value)}
            />
                <button type="submit">Create room</button>
            </form>
            <RoomList rooms={rooms}/>
        </div>
    )
}

export default Home