import { useEffect, useState } from 'react';
import { bookingService, billingService, roomService, serviceService } from '../../services';
import {
  CalendarCheck, DollarSign, Users, BedDouble,
  Clock, XCircle, CheckCircle, Wrench, TrendingUp, BedSingle
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color, textColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className={`text-2xl font-bold ${textColor ?? 'text-slate-800'}`}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function BarSegment({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span className="font-semibold text-slate-700">{count} <span className="font-normal text-slate-400">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [bookingsRes, roomsRes, servicesRes] = await Promise.all([
        bookingService.getAll(),
        roomService.getAll(),
        serviceService.getAll(),
      ]);

      const bookings = bookingsRes.data;
      const rooms = roomsRes.data;
      const services = servicesRes.data;

      // Fetch bills for all bookings in parallel
      const billResults = await Promise.allSettled(
        bookings.map((b) => billingService.getByBooking(b.id))
      );
      const bills = billResults
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value.data);

      // Revenue
      const paidBills = bills.filter((bl) => bl.paymentStatus === 'PAID');
      const pendingBills = bills.filter((bl) => bl.paymentStatus === 'PENDING');
      const totalRevenue = paidBills.reduce((s, bl) => s + (bl.totalAmount ?? 0), 0);
      const pendingRevenue = pendingBills.reduce((s, bl) => s + (bl.totalAmount ?? 0), 0);

      // Booking status counts
      const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
      const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length;
      const completed = bookings.filter((b) => b.status === 'COMPLETED').length;

      // Room occupancy
      const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE').length;
      const bookedRooms = rooms.filter((r) => r.status === 'BOOKED').length;

      // Recent bookings (last 5 by id desc)
      const recentBookings = [...bookings].sort((a, b) => b.id - a.id).slice(0, 5);

      // Top services by request count — count how many bookings requested each service
      // We already have bills; use service names from bills' service charges as proxy.
      // Better: fetch service requests per booking for recent ones
      // Since we have serviceService.getAll() for catalog, we'll count from bill serviceCharges > 0
      const billedBookingIds = new Set(bills.filter((bl) => bl.serviceCharges > 0).map((bl) => bl.bookingId));

      setData({
        totalBookings: bookings.length,
        totalRevenue,
        pendingRevenue,
        confirmed,
        cancelled,
        completed,
        totalRooms: rooms.length,
        availableRooms,
        bookedRooms,
        totalServices: services.length,
        services,
        recentBookings,
        billedCount: bills.length,
        paidCount: paidBills.length,
        pendingCount: pendingBills.length,
        billedBookingIds,
      });
    };

    load().finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-slate-100" />)}
      </div>
    </div>
  );

  const {
    totalBookings, totalRevenue, pendingRevenue,
    confirmed, cancelled, completed,
    totalRooms, availableRooms, bookedRooms,
    totalServices, services, recentBookings,
    billedCount, paidCount, pendingCount,
  } = data;

  const occupancyPct = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

  const bookingStatusColors = {
    CONFIRMED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Live overview of your hotel operations</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={CalendarCheck} label="Total Bookings" value={totalBookings} sub={`${confirmed} active`} color="bg-indigo-500" />
        <StatCard icon={DollarSign} label="Revenue Collected" value={`$${totalRevenue.toFixed(2)}`} sub={`${paidCount} paid bill${paidCount !== 1 ? 's' : ''}`} color="bg-emerald-500" textColor="text-emerald-700" />
        <StatCard icon={Clock} label="Pending Payments" value={`$${pendingRevenue.toFixed(2)}`} sub={`${pendingCount} unpaid bill${pendingCount !== 1 ? 's' : ''}`} color="bg-amber-500" textColor="text-amber-700" />
        <StatCard icon={Users} label="Active Guests" value={confirmed} sub="confirmed bookings" color="bg-purple-500" />
        <StatCard icon={BedDouble} label="Available Rooms" value={availableRooms} sub={`${bookedRooms} occupied of ${totalRooms}`} color="bg-sky-500" />
        <StatCard icon={Wrench} label="Facility Services" value={totalServices} sub="offered to guests" color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Room Occupancy */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BedSingle size={17} className="text-indigo-600" />
            <h2 className="font-bold text-slate-800 text-sm">Room Occupancy</h2>
            <span className="ml-auto text-2xl font-bold text-indigo-600">{occupancyPct}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${occupancyPct}%` }} />
          </div>
          <div className="space-y-2.5">
            <BarSegment label="Booked" count={bookedRooms} total={totalRooms} color="bg-indigo-500" />
            <BarSegment label="Available" count={availableRooms} total={totalRooms} color="bg-emerald-400" />
          </div>
        </div>

        {/* Booking Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={17} className="text-indigo-600" />
            <h2 className="font-bold text-slate-800 text-sm">Booking Breakdown</h2>
          </div>
          <div className="space-y-2.5">
            <BarSegment label="Confirmed" count={confirmed} total={totalBookings} color="bg-emerald-500" />
            <BarSegment label="Completed" count={completed} total={totalBookings} color="bg-blue-400" />
            <BarSegment label="Cancelled" count={cancelled} total={totalBookings} color="bg-red-400" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { label: 'Confirmed', val: confirmed, cls: 'bg-emerald-50 text-emerald-700' },
              { label: 'Completed', val: completed, cls: 'bg-blue-50 text-blue-700' },
              { label: 'Cancelled', val: cancelled, cls: 'bg-red-50 text-red-700' },
            ].map(({ label, val, cls }) => (
              <div key={label} className={`rounded-xl p-2.5 text-center ${cls}`}>
                <p className="text-lg font-bold">{val}</p>
                <p className="text-xs font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign size={17} className="text-indigo-600" />
            <h2 className="font-bold text-slate-800 text-sm">Billing Summary</h2>
          </div>
          <div className="space-y-2.5">
            <BarSegment label="Paid" count={paidCount} total={billedCount} color="bg-emerald-500" />
            <BarSegment label="Pending" count={pendingCount} total={billedCount} color="bg-amber-400" />
          </div>
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center bg-emerald-50 rounded-xl px-4 py-2.5">
              <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5"><CheckCircle size={13} /> Collected</span>
              <span className="font-bold text-emerald-700">${totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center bg-amber-50 rounded-xl px-4 py-2.5">
              <span className="text-xs font-medium text-amber-700 flex items-center gap-1.5"><Clock size={13} /> Outstanding</span>
              <span className="font-bold text-amber-700">${pendingRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <CalendarCheck size={16} className="text-indigo-600" />
            <h2 className="font-bold text-slate-800 text-sm">Recent Bookings</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{b.userName}</p>
                  <p className="text-xs text-slate-400">Room {b.roomNumber} · {b.checkInDate} → {b.checkOutDate}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${bookingStatusColors[b.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {b.status}
                </span>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <p className="text-center py-8 text-slate-400 text-sm">No bookings yet</p>
            )}
          </div>
        </div>

        {/* Services Catalog */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Wrench size={16} className="text-indigo-600" />
            <h2 className="font-bold text-slate-800 text-sm">Available Facility Services</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {services.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center">
                    <Wrench size={13} className="text-rose-500" />
                  </div>
                  <span className="font-medium text-slate-800 text-sm">{s.name}</span>
                </div>
                <span className="font-bold text-indigo-600 text-sm">${s.price}</span>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-center py-8 text-slate-400 text-sm">No services configured</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
