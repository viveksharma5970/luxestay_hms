import { BedDouble, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const typeColors = {
  STANDARD: 'bg-slate-100 text-slate-700',
  DELUXE: 'bg-amber-100 text-amber-700',
  SUITE: 'bg-purple-100 text-purple-700',
};

export default function RoomCard({ room }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-40 flex items-center justify-center">
        <BedDouble size={56} className="text-white/80" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-slate-800">Room {room.roomNumber}</h3>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[room.type] || 'bg-slate-100 text-slate-700'}`}>
            {room.type}
          </span>
        </div>
        <div className="flex items-center gap-1 mb-4">
          {[...Array(room.type === 'SUITE' ? 5 : room.type === 'DELUXE' ? 4 : 3)].map((_, i) => (
            <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-indigo-600">${room.price}</span>
            <span className="text-slate-400 text-sm">/night</span>
          </div>
          <button
            onClick={() => navigate(`/rooms/${room.id}`)}
            className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
