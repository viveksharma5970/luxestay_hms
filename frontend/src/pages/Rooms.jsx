import { useEffect, useState } from 'react';
import { roomService } from '../services';
import RoomCard from '../components/RoomCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const TYPES = ['ALL', 'STANDARD', 'DELUXE', 'SUITE'];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomService.getAvailable().then((r) => setRooms(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = rooms.filter((r) => {
    const matchType = filter === 'ALL' || r.type === filter;
    const matchSearch = r.roomNumber.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Available Rooms</h1>
        <p className="text-slate-500 mt-1">Find your perfect stay</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            placeholder="Search by room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-slate-400" />
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === t ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">No rooms found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((room) => <RoomCard key={room.id} room={room} />)}
        </div>
      )}
    </div>
  );
}
