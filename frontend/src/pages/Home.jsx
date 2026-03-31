import { Link } from 'react-router-dom';
import {
  Hotel, Star, Shield, Clock, BedDouble, Wifi,
  UtensilsCrossed, Dumbbell, MapPin, ChevronRight, Sparkles
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const features = [
  { icon: Star,            title: 'Premium Rooms',    desc: 'Standard, Deluxe & Suite options tailored for every guest.',   color: 'bg-amber-500' },
  { icon: Shield,          title: 'Secure Booking',   desc: 'Reservations are protected and confirmed instantly.',           color: 'bg-emerald-500' },
  { icon: Clock,           title: '24/7 Services',    desc: 'Room service, laundry, gym and more around the clock.',         color: 'bg-indigo-500' },
  { icon: Wifi,            title: 'Free High-Speed Wi-Fi', desc: 'Stay connected throughout your entire stay.',              color: 'bg-sky-500' },
  { icon: UtensilsCrossed, title: 'Fine Dining',      desc: 'World-class cuisine served right to your room.',               color: 'bg-rose-500' },
  { icon: Dumbbell,        title: 'Fitness Center',   desc: 'State-of-the-art gym open 24 hours a day.',                    color: 'bg-purple-500' },
];

const roomTypes = [
  {
    type: 'Standard',
    stars: 3,
    price: 'From $89',
    desc: 'Cozy and comfortable rooms with all essential amenities for a relaxing stay.',
    gradient: 'from-slate-600 to-slate-800',
    badge: 'bg-slate-100 text-slate-700',
  },
  {
    type: 'Deluxe',
    stars: 4,
    price: 'From $149',
    desc: 'Spacious rooms with premium furnishings, city views and enhanced amenities.',
    gradient: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-100 text-amber-700',
    featured: true,
  },
  {
    type: 'Suite',
    stars: 5,
    price: 'From $299',
    desc: 'The pinnacle of luxury — private lounge, jacuzzi and personalised butler service.',
    gradient: 'from-purple-600 to-indigo-700',
    badge: 'bg-purple-100 text-purple-700',
  },
];

const testimonials = [
  { name: 'Sarah M.',    role: 'Business Traveller', text: 'Absolutely flawless experience. The suite was breathtaking and the staff were incredibly attentive.',  stars: 5 },
  { name: 'James K.',   role: 'Honeymoon Guest',    text: 'LuxeStay made our honeymoon unforgettable. Every detail was perfect from check-in to check-out.',       stars: 5 },
  { name: 'Priya R.',   role: 'Family Vacation',    text: 'The kids loved the pool and we loved the dining. Will definitely be coming back next summer!',          stars: 5 },
];

const stats = [
  { value: '500+', label: 'Happy Guests' },
  { value: '50+',  label: 'Luxury Rooms' },
  { value: '15+',  label: 'Amenities' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-300/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">

          {/* Floating badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Now accepting reservations · LuxeStay Hotel
          </div>

          <h1 className="animate-fade-up delay-100 text-5xl sm:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Your Perfect Stay<br />
            <span className="shimmer-text">Awaits You</span>
          </h1>

          <p className="animate-fade-up delay-200 text-indigo-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience unmatched luxury, world-class amenities and personalised service
            at LuxeStay — where every moment is crafted for you.
          </p>

          <div className="animate-fade-up delay-300 flex items-center justify-center gap-4 flex-wrap">
            <Link
              to={user ? '/rooms' : '/signup'}
              className="group flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              {user ? 'Browse Rooms' : 'Get Started'}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            {!user && (
              <Link
                to="/login"
                className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Floating room icon */}
          <div className="animate-float mt-16 flex justify-center">
            <div className="relative w-24 h-24 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl">
              <Hotel size={44} className="text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────────────── */}
      <section className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map(({ value, label }, i) => (
              <div key={label} className={`animate-scale-in delay-${(i + 1) * 100}`}>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-indigo-200 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-3">
            <Sparkles size={12} /> WHY CHOOSE US
          </span>
          <h2 className="text-4xl font-bold text-slate-800">Everything for a Perfect Stay</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">From the moment you arrive to the moment you leave, we take care of every detail.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={title}
              className={`animate-fade-up delay-${(i + 1) * 100} group bg-white rounded-2xl shadow-sm border border-slate-100 p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Room Types ───────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-up">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-3">
              <BedDouble size={12} /> OUR ROOMS
            </span>
            <h2 className="text-4xl font-bold text-slate-800">Choose Your Room</h2>
            <p className="text-slate-500 mt-3">Three tiers of comfort — all with exceptional service.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {roomTypes.map(({ type, stars, price, desc, gradient, badge, featured }, i) => (
              <div
                key={type}
                className={`animate-scale-in delay-${(i + 1) * 200} relative bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${featured ? 'border-amber-300 ring-2 ring-amber-200' : 'border-slate-100'}`}
              >
                {featured && (
                  <div className="absolute top-4 right-4 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    Most Popular
                  </div>
                )}
                <div className={`bg-gradient-to-br ${gradient} h-44 flex items-center justify-center`}>
                  <BedDouble size={60} className="text-white/80 animate-float" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xl text-slate-800">{type}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}>{type}</span>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(stars)].map((_, j) => (
                      <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-500 text-sm mb-5 leading-relaxed">{desc}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-indigo-600">{price}</span>
                      <span className="text-slate-400 text-xs ml-1">/night</span>
                    </div>
                    <Link
                      to={user ? '/rooms' : '/signup'}
                      className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
                    >
                      Book <ChevronRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-3">
            <Star size={12} /> GUEST REVIEWS
          </span>
          <h2 className="text-4xl font-bold text-slate-800">What Our Guests Say</h2>
          <p className="text-slate-500 mt-3">Real experiences from real guests.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, text, stars }, i) => (
            <div
              key={name}
              className={`animate-fade-up delay-${(i + 1) * 200} bg-white rounded-2xl shadow-sm border border-slate-100 p-7 hover:shadow-md transition-shadow`}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(stars)].map((_, j) => (
                  <Star key={j} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {name[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute bottom-4 right-10 w-48 h-48 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-white rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <MapPin size={32} className="mx-auto mb-4 text-indigo-200 animate-float" />
          <h2 className="text-4xl font-bold mb-4">Ready to Experience Luxury?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
            Join hundreds of satisfied guests. Book your room today and enjoy an unforgettable stay.
          </p>
          <Link
            to={user ? '/rooms' : '/signup'}
            className="group inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-10 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-lg"
          >
            {user ? 'Browse Available Rooms' : 'Create Your Account'}
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Hotel size={18} className="text-indigo-400" />
          <span className="font-bold text-white text-base">LuxeStay</span>
        </div>
        <p>© {new Date().getFullYear()} LuxeStay Hotel. All rights reserved.</p>
      </footer>

    </div>
  );
}
