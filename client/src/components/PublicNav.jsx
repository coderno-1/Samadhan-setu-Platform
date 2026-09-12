import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

export default function PublicNav() {
  const { user } = useAuth()
  return (
    <header className="border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/"><Logo /></Link>
        <div className="hidden items-center gap-7 md:flex">
          <a className="nav-link" href="#how-it-works">How it works</a>
          <a className="nav-link" href="#impact">Impact</a>
          <NavLink className="nav-link" to="/">Explore problems</NavLink>
        </div>
        <div className="flex items-center gap-3">
          {user ? <Link to="/dashboard" className="btn-primary px-4 py-2.5 text-sm">Go to dashboard</Link> : <><Link to="/login" className="hidden nav-link sm:block">Log in</Link><Link to="/register" className="btn-primary px-4 py-2.5 text-sm">Join the movement</Link></>}
        </div>
      </nav>
    </header>
  )
}
