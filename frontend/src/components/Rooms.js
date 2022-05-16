import { Link } from "react-router-dom"

const RoomList = ({rooms}) => {
    return (
        <div>
            <h3>room list</h3>
            {rooms.map(room => 
            <li key={room.id}>{room.name}<Link to={`/${room.name}/${room.id}`}><button>join room</button></Link></li>)}
        </div>
    )
}

export default RoomList