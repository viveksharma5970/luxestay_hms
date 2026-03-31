import { useState } from 'react';
import { bookingService } from '../services';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

export default function BookingForm({ room }) {
  const [form, setForm] = useState({ checkInDate: '', checkOutDate: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nights =
    form.checkInDate && form.checkOutDate
      ? Math.max(0, (new Date(form.checkOutDate) - new Date(form.checkInDate)) / 86400000)
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nights <= 0) return toast.error('Check-out must be after check-in');
    setLoading(true);
    try {
      await bookingService.create({ roomId: room.id, ...form });
      toast.success('Room booked successfully!');
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
      <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
        <CalendarDays size={20} className="text-indigo-600" /> Book This Room
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">Check-in</label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={form.checkInDate}
            onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">Check-out</label>
          <input
            type="date"
            required
            min={form.checkInDate || new Date().toISOString().split('T')[0]}
            value={form.checkOutDate}
            onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      {nights > 0 && (
        <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">
          <span className="font-semibold">{nights} night{nights > 1 ? 's' : ''}</span> × ${room.price} = <span className="font-bold">${(nights * room.price).toFixed(2)}</span>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
      >
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
