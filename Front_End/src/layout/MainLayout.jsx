import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import VoiceAssistant from '../components/VoiceAssistant/VoiceAssistant'

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <VoiceAssistant />
      <Outlet />
      <Footer />
    </div>
  )
}
