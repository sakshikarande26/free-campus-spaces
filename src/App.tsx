import { Routes, Route } from 'react-router-dom'
import MapPage from './pages/MapPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
