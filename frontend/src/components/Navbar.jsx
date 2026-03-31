import { Link, useNavigate } from 'react-router-dom';
import { Hotel, LogOut, User, LayoutDashboard } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { authService } from '../services';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    clearUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Hotel size={26} />
            <span>LuxeStay</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'ADMIN' ? (
                  <Link to="/admin/dashboard" className="flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/rooms" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Rooms</Link>
                    <Link to="/my-bookings" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">My Bookings</Link>
                  </>
                )}
                <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5">
                  <User size={15} className="text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">{user.email}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {user.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
                <Link to="/signup" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
