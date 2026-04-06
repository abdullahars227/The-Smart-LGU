import { Route, Routes } from 'react-router-dom'
import RequireAuth from '../auth/RequireAuth'
import MainLayout from '../layout/MainLayout'
import HomePage from '../pages/Home/HomePage'
import BSCSPage from '../pages/BSCS/BSCSPage'
import BSSEPage from '../pages/BSSE/BSSEPage'
import BSAIPage from '../pages/BSAI/BSAIPage'
import LoginPage from '../pages/Auth/LoginPage'
import ChatbotPage from '../pages/Chat/ChatbotPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/bscs" element={<BSCSPage />} />
        <Route path="/bsse" element={<BSSEPage />} />
        <Route path="/bsai" element={<BSAIPage />} />
        <Route
          path="/assistant"
          element={
            <RequireAuth>
              <ChatbotPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  )
}
