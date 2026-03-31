import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BedDouble, CalendarCheck, Wrench, Receipt, Hotel } from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/admin/bookings', icon: CalendarCheck, label: 'Bookings' },
  { to: '/admin/services', icon: Wrench, label: 'Services' },
  { to: '/admin/billing', icon: Receipt, label: 'Billing' },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-700">
          <Hotel size={22} className="text-indigo-400" />
          <span className="font-bold text-lg text-white">LuxeStay Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-slate-700 text-xs text-slate-500">
          © 2025 LuxeStay
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
