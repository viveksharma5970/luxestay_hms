import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { roomService } from '../services';
import BookingForm from '../components/BookingForm';
import { BedDouble, Star, Tag, DollarSign } from 'lucide-react';

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomService.getAll().then((r) => {
      const found = r.data.find((rm) => rm.id === parseInt(id));
      setRoom(found);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>;
  if (!room) return <div className="text-center py-20 text-slate-400">Room not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Room Info */}
        <div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl h-64 flex items-center justify-center mb-6">
            <BedDouble size={80} className="text-white/80" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Room {room.roomNumber}</h1>
          <div className="flex items-center gap-1 mb-4">
            {[...Array(room.type === 'SUITE' ? 5 : room.type === 'DELUXE' ? 4 : 3)].map((_, i) => (
              <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-600">
              <Tag size={18} className="text-indigo-500" />
              <span>Type: <strong className="text-slate-800">{room.type}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <DollarSign size={18} className="text-indigo-500" />
              <span>Price: <strong className="text-slate-800">${room.price} / night</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${room.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {room.status}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <BookingForm room={room} />
        </div>
      </div>
    </div>
  );
}
