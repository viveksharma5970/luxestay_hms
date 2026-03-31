import { useEffect, useState } from 'react';
import { bookingService, billingService } from '../services';
import ServiceRequest from '../components/ServiceRequest';
import InvoiceCard from '../components/InvoiceCard';
import toast from 'react-hot-toast';
import { CalendarCheck, XCircle, Receipt, ChevronDown, ChevronUp } from 'lucide-react';

const statusColors = {
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [bills, setBills] = useState({}); // bookingId → BillingResponse (single object)
  const [serviceRefreshKeys, setServiceRefreshKeys] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getMyBookings().then((r) => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  const fetchBill = async (bookingId) => {
    try {
      const { data } = await billingService.getByBooking(bookingId);
      setBills((prev) => ({ ...prev, [bookingId]: data }));
    } catch {
      setBills((prev) => ({ ...prev, [bookingId]: null }));
    }
  };

  const handleCancel = async (id) => {
    await bookingService.cancel(id);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    toast.success('Booking cancelled');
  };

  const handleGenerateBill = async (bookingId) => {
    try {
      await billingService.generate(bookingId);
      await fetchBill(bookingId);
      toast.success('Bill generated');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to generate bill');
    }
  };

  const handlePayBill = async (billingId, bookingId) => {
    try {
      await billingService.pay(billingId);
      await fetchBill(bookingId);
      toast.success('Payment successful!');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Payment failed');
    }
  };

  const toggleExpand = async (bookingId) => {
    if (expanded === bookingId) return setExpanded(null);
    setExpanded(bookingId);
    await fetchBill(bookingId);
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">My Bookings</h1>
      <p className="text-slate-500 mb-8">Manage your reservations and services</p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-slate-400">No bookings yet</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <CalendarCheck size={22} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Room {b.roomNumber}</p>
                    <p className="text-sm text-slate-500">{b.checkInDate} → {b.checkOutDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[b.status] || 'bg-slate-100 text-slate-600'}`}>
                    {b.status}
                  </span>
                  {b.status === 'CONFIRMED' && (
                    <button onClick={() => handleCancel(b.id)} className="text-red-500 hover:text-red-700 transition-colors">
                      <XCircle size={20} />
                    </button>
                  )}
                  <button onClick={() => toggleExpand(b.id)} className="text-slate-400 hover:text-slate-600">
                    {expanded === b.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {expanded === b.id && (
                <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50">
                  {b.status === 'CONFIRMED' && (
                    <ServiceRequest
                      bookingId={b.id}
                      onServiceRequested={() => {
                        fetchBill(b.id);
                        setServiceRefreshKeys((prev) => ({ ...prev, [b.id]: (prev[b.id] ?? 0) + 1 }));
                      }}
                    />
                  )}

                  {bills[b.id] ? (
                    <InvoiceCard
                      bill={bills[b.id]}
                      refreshKey={serviceRefreshKeys[b.id] ?? 0}
                      onPay={() => handlePayBill(bills[b.id].id, b.id)}
                    />
                  ) : (
                    <button
                      onClick={() => handleGenerateBill(b.id)}
                      className="flex items-center gap-2 text-sm bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl hover:border-indigo-300 transition-colors"
                    >
                      <Receipt size={16} className="text-indigo-600" /> Generate Bill
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
