import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

function AdminRoute({ children }) {
  const { user, authReady } = useAuth()

  if (!authReady) return <main className="page-shell section-space text-center text-stone-500">Checking your account…</main>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
