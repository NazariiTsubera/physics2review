import { Link, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TopicPage from './pages/TopicPage'
import Simulation from './pages/Simulation'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <Link to="/" className="brand">Physics II Compass</Link>
          <a
            className="byline"
            href="https://github.com/NazariiTsubera"
            target="_blank"
            rel="noreferrer"
          >
            By Nazarii Tsubera
          </a>
        </div>
        <nav className="topnav">
          <Link to="/#how-to-use">How to use</Link>
          <Link to="/#topics">Topics</Link>
          <Link to="/simulation">Simulation</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topic/:slug" element={<TopicPage />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <span>University Physics II • exam-ready study guide</span>
        <span className="footer-note">Built for clarity, accuracy, and interactive practice.</span>
      </footer>
    </div>
  )
}

export default App
