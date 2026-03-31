import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import MyBookings from './pages/MyBookings';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms from './pages/admin/AdminRooms';
import AdminBookings from './pages/admin/AdminBookings';
import AdminServices from './pages/admin/AdminServices';
import AdminBilling from './pages/admin/AdminBilling';

function GuestLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Guest routes */}
        <Route path="/" element={<GuestLayout><Home /></GuestLayout>} />
        <Route path="/rooms" element={<GuestLayout><ProtectedRoute><Rooms /></ProtectedRoute></GuestLayout>} />
        <Route path="/rooms/:id" element={<GuestLayout><ProtectedRoute><RoomDetail /></ProtectedRoute></GuestLayout>} />
        <Route path="/my-bookings" element={<GuestLayout><ProtectedRoute role="GUEST"><MyBookings /></ProtectedRoute></GuestLayout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="billing" element={<AdminBilling />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
