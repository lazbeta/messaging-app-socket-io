import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ChatRoom from './components/ChatRoom/ChatRoom'
import Home from './components/Home'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomName/:roomId" element={<ChatRoom />} />
      </Routes>
    </Router>
  )
}

export default App
