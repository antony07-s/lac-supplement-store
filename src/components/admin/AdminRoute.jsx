import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

function AdminRoute({ children }) {
  const { user, authReady } = useAuth()

  if (!authReady) return <main className="page-shell section-space text-center text-stone-500">Checking your account…</main>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!user.isAdmin) {
    return (
      <main className="page-shell section-space mx-auto max-w-xl px-5 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin access required</h1>
        <p className="mt-3 text-sm text-gray-600">
          You are signed in as <strong>{user.email}</strong>, and this account does not have admin permissions.
          Ask the store owner to check the backend <code>ADMIN_EMAILS</code> setting, then sign out and sign in again.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white">Return to store</Link>
      </main>
    )
  }

  return children
}

export default AdminRoute
