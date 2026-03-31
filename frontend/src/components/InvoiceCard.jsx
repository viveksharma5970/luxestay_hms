import { useEffect, useState } from 'react';
import { Receipt, CheckCircle, Clock, Wrench } from 'lucide-react';
import { serviceService } from '../services';

export default function InvoiceCard({ bill, onPay, refreshKey }) {
  // attach refreshKey to bill so the effect above re-runs when it changes
  if (bill) bill._refreshKey = refreshKey;
  const [services, setServices] = useState([]);
  const isPaid = bill?.paymentStatus === 'PAID';

  useEffect(() => {
    if (!bill?.bookingId) return;
    serviceService.getByBooking(bill.bookingId).then((r) => setServices(r.data)).catch(() => {});
  }, [bill?.bookingId, bill?._refreshKey]);

  if (!bill) return null;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt size={16} className="text-indigo-600" />
          <span className="font-bold text-slate-800 text-sm">Invoice #{bill.id}</span>
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {isPaid ? <CheckCircle size={12} /> : <Clock size={12} />}
          {bill.paymentStatus}
        </span>
      </div>

      {/* Breakdown */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Room Charges</span>
          <span className="font-medium">${bill.roomCharges?.toFixed(2)}</span>
        </div>

        {services.length > 0 && (
          <div className="border border-slate-200 rounded-xl p-3 space-y-1 bg-white/60">
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mb-1.5">
              <Wrench size={11} /> Services
            </p>
            {services.map((sr) => (
              <div key={sr.id} className="flex justify-between text-slate-600 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                  {sr.serviceName}
                </span>
                <span>${sr.servicePrice?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {bill.serviceCharges > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Service Charges</span>
            <span className="font-medium">${bill.serviceCharges?.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-800">
          <span>Total</span>
          <span className="text-indigo-600">
            ${(bill.roomCharges + services.reduce((sum, s) => sum + (s.servicePrice ?? 0), 0)).toFixed(2)}
          </span>
        </div>
      </div>

      {!isPaid && (
        <button
          onClick={onPay}
          className="w-full bg-emerald-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          Pay Now
        </button>
      )}
    </div>
  );
}
