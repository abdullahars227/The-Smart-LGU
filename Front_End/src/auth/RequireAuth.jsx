import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

/**
 * Wrap routes that need a signed-in user (e.g. chatbot, saved preferences).
 * Guests are redirected to /login; after sign-in they return to the page they wanted.
 */
export default function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
