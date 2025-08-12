import { Link, useLocation } from 'react-router-dom'
import {
  FaHome, FaUsers, FaCoins, FaEdit, FaUserPlus, FaPlusCircle
} from 'react-icons/fa'

const navLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
  { label: 'Accounts', path: '/Accounts', icon: <FaUsers /> },
  { label: 'Pawn Tickets', path: '/pawns', icon: <FaCoins /> },
  { label: 'New Account', path: '/Accounts/add', icon: <FaUserPlus /> },
  { label: 'New Pawn Ticket', path: '/pawnticket/add', icon: <FaPlusCircle /> },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed top-0 left-0 w-[220px] min-h-screen bg-white/5 backdrop-blur-md border-r border-white/10 text-white flex flex-col p-6 shadow-lg">
      
      <h1 className="text-[18px] font-bold text-indigo-400 tracking-wide mb-8">Pawn Management</h1>

      <nav className="flex flex-col space-y-2">
        {navLinks.map(({ label, path, icon }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition font-medium ${
                isActive
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-sm">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto text-xs text-white/40 pt-6 border-t border-white/10">
        <p>© {new Date().getFullYear()} Pawn Management</p>
      </div>
    </aside>
  )
}
