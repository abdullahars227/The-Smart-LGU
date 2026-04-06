import { NavLink } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="site-footer__wave-svg">
          <path
            fill="currentColor"
            d="M0,24 C360,0 720,48 1080,24 C1260,12 1380,8 1440,12 L1440,48 L0,48 Z"
          />
        </svg>
      </div>

      <div className="container site-footer__main">
        <div className="site-footer__brand">
          <img
            src="/images/lgu-logo.jpg"
            width={72}
            height={72}
            alt=""
            className="site-footer__logo"
          />
          <div>
            <p className="site-footer__name">Lahore Garrison University</p>
            <p className="site-footer__motto">&ldquo;Knowledge is Light&rdquo;</p>
          </div>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__col">
            <h3>About</h3>
            <p>
              A modern institution focused on innovation, research, and graduates ready for
              Pakistan and the world.
            </p>
          </div>
          <div className="site-footer__col">
            <h3>Programs</h3>
            <ul>
              <li>
                <NavLink to="/bscs">BS Computer Science</NavLink>
              </li>
              <li>
                <NavLink to="/bsse">BS Software Engineering</NavLink>
              </li>
              <li>
                <NavLink to="/bsai">BS Artificial Intelligence</NavLink>
              </li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h3>Contact</h3>
            <p>DHA Phase VI, Sector C, Lahore</p>
            <p>
              <a href="tel:+924237181821">+92 42 37181821</a>
            </p>
            <p>
              <a href="mailto:info@lgu.edu.pk">info@lgu.edu.pk</a>
            </p>
            <p>
              <a href="https://lgu.edu.pk/" target="_blank" rel="noopener noreferrer">
                lgu.edu.pk
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="container site-footer__note">
          © {new Date().getFullYear()} Lahore Garrison University · Faculty of Computer Sciences
        </p>
      </div>
    </footer>
  )
}
