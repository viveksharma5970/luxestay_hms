import { useEffect, useState } from 'react';
import { bookingService } from '../../services';
import { CalendarCheck } from 'lucide-react';

const statusColors = {
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  PENDING: 'bg-amber-100 text-amber-700',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getAll().then((r) => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">All Bookings</h1>
        <p className="text-slate-500 mt-1">View and manage all reservations</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl h-14 animate-pulse border border-slate-100" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-slate-400">No bookings found</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['#', 'Guest', 'Room', 'Check-in', 'Check-out', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-slate-400 font-mono text-xs">#{b.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                        <CalendarCheck size={13} className="text-indigo-600" />
                      </div>
                      <span className="font-medium text-slate-800">{b.userName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">Room {b.roomNumber}</td>
                  <td className="px-5 py-4 text-slate-600">{b.checkInDate}</td>
                  <td className="px-5 py-4 text-slate-600">{b.checkOutDate}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[b.status] || 'bg-slate-100 text-slate-600'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
