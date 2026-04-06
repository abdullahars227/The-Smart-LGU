import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import './Header.css'

export default function Header() {
  const { user, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="site-header">
      <div className="container header-row">
        <div className="brand">
          <img
            className="brand-logo-img"
            src="/images/lgu-logo.jpg"
            width={48}
            height={48}
            alt=""
          />
          <div>
            <p className="brand-title">Lahore Garrison University</p>
            <p className="brand-subtitle">Faculty of Computer Sciences</p>
          </div>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
            <span className="nav-link__label">Home</span>
          </NavLink>
          <NavLink to="/bscs" className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
            <span className="nav-link__label">BSCS</span>
          </NavLink>
          <NavLink to="/bsse" className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
            <span className="nav-link__label">BSSE</span>
          </NavLink>
          <NavLink to="/bsai" className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
            <span className="nav-link__label">BSAI</span>
          </NavLink>
          <NavLink
            to="/assistant"
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            <span className="nav-link__label">Assistant</span>
          </NavLink>
          {isLoggedIn ? (
            <>
              <span className="nav-link nav-link--user" title={user?.email}>
                {user?.name || user?.email}
              </span>
              <button
                type="button"
                className="nav-link nav-link--btn"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
              <span className="nav-link__label">Sign in</span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
