import { Link } from 'react-router-dom'
import './Rooms.css'

const RoomList = ({ getRooms, query, rooms }) => {
  const getFilteredRooms = getRooms(query, rooms)
  return (
    <div className='general'>
      <h2>Room List</h2>
      <div>
        <ol>
          {getFilteredRooms.map((room) => (
            <li key={room.id} className='room-list'>
              <Link to={`/${room.name}/${room.id}`} className='LINK'>
                <button className="button-56" role="button">{room.name}</button>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default RoomList
