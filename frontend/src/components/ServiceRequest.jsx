import { useState, useEffect } from 'react';
import { serviceService } from '../services';
import toast from 'react-hot-toast';
import { Wrench, CheckCircle, AlertCircle } from 'lucide-react';

export default function ServiceRequest({ bookingId, onServiceRequested }) {
  const [services, setServices] = useState([]);
  const [requestedIds, setRequestedIds] = useState(new Set());
  const [loadingId, setLoadingId] = useState(null);
  const [confirmService, setConfirmService] = useState(null);

  useEffect(() => {
    serviceService.getAll().then((r) => setServices(r.data));
    serviceService.getByBooking(bookingId).then((r) => {
      const ids = new Set(r.data.map((sr) => sr.serviceId).filter(Boolean));
      setRequestedIds(ids);
    }).catch(() => {});
  }, [bookingId]);

  const handleConfirm = async () => {
    const service = confirmService;
    setConfirmService(null);
    setLoadingId(service.id);
    try {
      await serviceService.request({ bookingId, serviceId: service.id });
      setRequestedIds((prev) => new Set([...prev, service.id]));
      toast.success(`${service.name} requested!`);
      onServiceRequested?.();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
        <Wrench size={20} className="text-indigo-600" /> Request Services
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {services.map((s) => {
          const isRequested = requestedIds.has(s.id);
          const isLoading = loadingId === s.id;
          return (
            <div
              key={s.id}
              className={`flex items-center justify-between border rounded-xl p-3 transition-colors ${
                isRequested ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div>
                <p className="font-medium text-sm text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-500">${s.price}</p>
              </div>
              {isRequested ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 px-2 py-1 bg-emerald-100 rounded-lg">
                  <CheckCircle size={13} /> Requested
                </span>
              ) : (
                <button
                  onClick={() => setConfirmService(s)}
                  disabled={isLoading}
                  className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {isLoading ? 'Adding...' : 'Request'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmService && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Confirm Service Request</p>
                <p className="text-xs text-slate-500">This will be charged to your bill</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700">{confirmService.name}</span>
                <span className="font-bold text-indigo-600">${confirmService.price}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                This charge will be added to your bill.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmService(null)}
                className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
