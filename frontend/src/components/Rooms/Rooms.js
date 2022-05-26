import { Link } from 'react-router-dom'
import './Rooms.css'

const RoomList = ({ rooms }) => {
  return (
    <div className='general'>
      <div className='central'>
        <h2>Room List</h2>
        {rooms.map((room) => (
          <li key={room.id} className='roomListLi'>
            <Link to={`/${room.name}/${room.id}`} className='LINK'>
              <button className="button-56" role="button">{room.name}</button>
            </Link>
          </li>
        ))}
      </div>
    </div>
  )
}

export default RoomList
