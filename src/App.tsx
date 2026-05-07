import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import UniversitySelectPage from './pages/UniversitySelectPage'
import LoginPage from './pages/LoginPage'
import MapPage from './pages/MapPage'
import AdminPage from './pages/AdminPage'
import ReservationsPage from './pages/ReservationsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/select-university" element={<UniversitySelectPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/map" element={
        <ProtectedRoute>
          <MapPage />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminPage />
        </ProtectedRoute>
      } />
      <Route path="/reservations" element={
        <ProtectedRoute>
          <ReservationsPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
