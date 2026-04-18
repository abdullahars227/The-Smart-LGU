import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import VoiceAssistant from '../components/VoiceAssistant/VoiceAssistant'
import MobileWhatsApp from '../components/MobileWhatsApp/MobileWhatsApp'

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <MobileWhatsApp />
      <VoiceAssistant />
      <Outlet />
      <Footer />
    </div>
  )
}
