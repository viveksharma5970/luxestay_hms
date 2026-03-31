import { useEffect, useState } from 'react';
import { serviceService } from '../../services';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Check } from 'lucide-react';

const EMPTY = { name: '', price: '' };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchServices = () => serviceService.getAll().then((r) => setServices(r.data)).finally(() => setLoading(false));

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await serviceService.create(form);
    toast.success('Service created');
    setForm(EMPTY); setShowForm(false);
    fetchServices();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    await serviceService.delete(id);
    toast.success('Service deleted');
    fetchServices();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Services</h1>
          <p className="text-slate-500 mt-1">Manage facility & pantry services</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-slate-800">Add Service</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Service Name</label>
                <input
                  required
                  placeholder="e.g. Gym, Laundry"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Price ($)</label>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="e.g. 20"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                  <Check size={16} /> Create
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl h-20 animate-pulse border border-slate-100" />)}</div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-slate-400">No services yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{s.name}</p>
                <p className="text-sm text-indigo-600 font-bold mt-0.5">${s.price}</p>
              </div>
              <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
