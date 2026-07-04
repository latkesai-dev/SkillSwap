import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/swap.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-700">
          <span className="text-2xl">
            <img src={logo} alt="SkillSwap logo" className="w-6 h-6 inline-block" />
          </span>
          SkillSwap
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/browse" className="hover:text-brand-600">Browse</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-brand-600">Dashboard</Link>
              <Link to="/matches" className="hover:text-brand-600">My Matches</Link>
              <Link to="/profile" className="hover:text-brand-600">Profile</Link>
              <span className="text-slate-400">|</span>
              <span className="text-slate-800">{user.fullName}</span>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brand-600">Login</Link>
              <Link to="/register" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-lg">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
