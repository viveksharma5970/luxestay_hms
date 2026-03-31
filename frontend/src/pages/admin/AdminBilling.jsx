import { useEffect, useState } from 'react';
import { bookingService, billingService, serviceService } from '../../services';
import {
  Receipt, CheckCircle, Clock, ChevronDown, ChevronUp,
  User, CalendarDays, BedDouble, Wrench, DollarSign
} from 'lucide-react';

function BillingRow({ booking: b, bill, onPay }) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesFetched, setServicesFetched] = useState(false);

  const toggle = () => {
    if (!open && !servicesFetched) {
      serviceService.getByBooking(b.id).then((r) => {
        setServices(r.data);
        setServicesFetched(true);
      }).catch(() => setServicesFetched(true));
    }
    setOpen((v) => !v);
  };

  const nights = Math.max(1, (new Date(b.checkOutDate) - new Date(b.checkInDate)) / 86400000);
  const isPaid = bill.paymentStatus === 'PAID';
  const liveTotal = bill.roomCharges + services.reduce((s, sr) => s + (sr.servicePrice ?? 0), 0);

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Summary row — click to expand */}
      <div
        onClick={toggle}
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
            <Receipt size={18} className="text-indigo-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800">{b.userName}</p>
            <p className="text-xs text-slate-400">Room {b.roomNumber} · {b.checkInDate} → {b.checkOutDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-bold text-indigo-600 text-sm">${bill.totalAmount?.toFixed(2)}</span>
          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {isPaid ? <CheckCircle size={12} /> : <Clock size={12} />}
            {bill.paymentStatus}
          </span>
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {/* Expanded detail panel */}
      {open && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-5 space-y-5">

          {/* Guest & Stay */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <User size={14} className="text-indigo-600" />, label: 'Guest', value: b.userName },
              { icon: <BedDouble size={14} className="text-indigo-600" />, label: 'Room', value: `Room ${b.roomNumber}` },
              {
                icon: <CalendarDays size={14} className="text-indigo-600" />,
                label: 'Stay',
                value: `${b.checkInDate} → ${b.checkOutDate}`,
                sub: `${nights} night${nights > 1 ? 's' : ''}`,
              },
            ].map(({ icon, label, value, sub }) => (
              <div key={label} className="bg-white rounded-xl p-3 border border-slate-100 flex items-start gap-2.5">
                <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">{icon}</div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                  {sub && <p className="text-xs text-slate-400">{sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 text-sm">
            <div className="flex justify-between px-4 py-3 text-slate-600">
              <span>Room Charges <span className="text-xs text-slate-400">({nights} nights × ${(bill.roomCharges / nights).toFixed(2)})</span></span>
              <span className="font-medium text-slate-800">${bill.roomCharges?.toFixed(2)}</span>
            </div>

            {services.length > 0 && (
              <div className="px-4 py-3 space-y-2">
                <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1">
                  <Wrench size={11} /> Facility Add-ons
                </p>
                {services.map((sr) => (
                  <div key={sr.id} className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                      {sr.serviceName}
                    </span>
                    <span className="font-medium">${sr.servicePrice?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between px-4 py-3 font-bold text-slate-800">
              <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-indigo-500" /> Total</span>
              <span className="text-indigo-600 text-base">${(servicesFetched ? liveTotal : bill.totalAmount)?.toFixed(2)}</span>
            </div>
          </div>

          {/* Invoice ID + Pay button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Invoice #{bill.id}</span>
            {!isPaid && (
              <button
                onClick={() => onPay(bill.id)}
                className="flex items-center gap-1.5 text-xs bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle size={13} /> Mark as Paid
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBilling() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const { data: bookings } = await bookingService.getAll();
    const result = await Promise.all(
      bookings.map(async (b) => {
        try {
          const { data: bill } = await billingService.getByBooking(b.id);
          return { booking: b, bill };
        } catch { return null; }
      })
    );
    setEntries(result.filter(Boolean));
  };

  useEffect(() => { fetchAll().finally(() => setLoading(false)); }, []);

  const handlePay = async (billingId, bookingId) => {
    await billingService.pay(billingId);
    // refresh only the affected entry
    const { data: bill } = await billingService.getByBooking(bookingId);
    setEntries((prev) => prev.map((e) => e.booking.id === bookingId ? { ...e, bill } : e));
  };

  if (loading) return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl h-16 animate-pulse border border-slate-100" />
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Billing</h1>
        <p className="text-slate-500 mt-1">Click any row to view full invoice details</p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 text-slate-400">No billing records yet</div>
      ) : (
        <div className="space-y-3">
          {entries.map(({ booking, bill }) => (
            <BillingRow
              key={booking.id}
              booking={booking}
              bill={bill}
              onPay={(billingId) => handlePay(billingId, booking.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
