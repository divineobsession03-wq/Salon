import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, LogOut, Bell, LayoutDashboard, Menu, X } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, notificationsRes] = await Promise.all([
          axios.get('/api/bookings/me'),
          axios.get('/api/notifications')
        ]);
        setBookings(bookingsRes.data);
        setNotifications(notificationsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) return <div className="text-luxury-800 p-8">Loading data...</div>;

    switch (activeTab) {
      case 'bookings':
        return (
          <div className="p-8">
            <h2 className="font-serif text-2xl text-luxury-900 mb-8 border-b border-luxury-300 pb-4">Your Reservations</h2>
            
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-luxury-800 mb-4">You have no upcoming reservations.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map(booking => (
                  <div key={booking._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white rounded-xl border border-luxury-300 shadow-sm">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="font-serif text-xl text-luxury-900 mb-2">{booking.service?.name || 'Service'}</h3>
                      <div className="flex space-x-6 text-sm text-luxury-800">
                        <span className="flex items-center"><CalendarIcon size={14} className="mr-2"/> {booking.date ? format(new Date(booking.date), 'MMM dd, yyyy') : 'TBD'}</span>
                        <span className="flex items-center text-[10px] tracking-widest font-semibold uppercase"><Clock size={14} className="mr-2"/> {booking.timeSlot}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-4 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        booking.status === 'completed' ? 'bg-luxury-800 text-luxury-100' :
                        'bg-[#D6CDBC] text-luxury-900'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'notifications':
        return (
          <div className="p-8">
            <h2 className="font-serif text-2xl text-luxury-900 mb-8 border-b border-luxury-300 pb-4">Studio Updates</h2>
            
            {notifications.length === 0 ? (
              <div className="text-luxury-800 text-sm">No new updates.</div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                {notifications.map(notif => (
                  <div key={notif._id} className="p-6 bg-white rounded-xl border border-luxury-300 shadow-sm">
                    <p className="font-bold text-luxury-900 mb-1 text-lg">{notif.title}</p>
                    <p className="text-sm text-luxury-800 mb-3">{notif.message}</p>
                    <p className="text-[10px] text-luxury-500 uppercase tracking-widest">{new Date(notif.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-screen bg-luxury-100 overflow-hidden relative">
      
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <button 
          className="md:hidden fixed inset-0 w-full h-full bg-black/20 z-20 cursor-default"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0 md:ml-0' : '-translate-x-full md:translate-x-0 md:-ml-64'} fixed md:relative z-30 inset-y-0 left-0 w-64 bg-white border-r border-luxury-300 flex flex-col pt-20 transition-all duration-300 ease-in-out shrink-0`}>
        <div className="p-6 flex justify-between items-start md:block">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-luxury-800 mb-6 md:mb-6">Features</p>
          <button className="md:hidden text-luxury-800 -mt-1" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="px-6">
          <nav className="space-y-2">
            {[
              { id: 'bookings', label: 'Bookings', icon: CalendarIcon },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id ? 'bg-luxury-900 text-luxury-100' : 'text-luxury-800 hover:bg-luxury-200'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-luxury-300">
           <button 
            onClick={logout}
            className="flex items-center space-x-3 text-sm font-medium text-red-800 hover:text-red-900 transition-colors w-full"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-20 h-screen">
        <div className="px-8 pb-4 border-b border-luxury-300 bg-luxury-100/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2 -ml-2 rounded-lg hover:bg-luxury-200 text-luxury-800 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl text-luxury-900">Welcome, {user?.name}</h1>
                <p className="text-[10px] tracking-widest uppercase text-luxury-800 mt-1 hidden md:block">Your exclusive profile</p>
              </div>
            </div>
        </div>
        
        {renderContent()}
      </div>

    </motion.div>
  );
}
