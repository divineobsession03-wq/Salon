import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { motion } from 'motion/react';
import { LogOut, LayoutDashboard, Users, User, Scissors, Bell, Calendar as CalendarIcon, Plus, Menu, X } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, customersRes, notificationsRes] = await Promise.all([
        axios.get('/api/bookings/all'),
        axios.get('/api/auth/all'),
        axios.get('/api/notifications')
      ]);
      setBookings(bookingsRes.data);
      setCustomers(customersRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`/api/bookings/${id}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNotification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    try {
      await axios.post('/api/notifications', { title, message });
      form.reset();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
    const duration = (form.elements.namedItem('duration') as HTMLInputElement).value;
    const price = (form.elements.namedItem('price') as HTMLInputElement).value;
    const category = (form.elements.namedItem('category') as HTMLSelectElement).value;
    const imagesStr = (form.elements.namedItem('images') as HTMLInputElement).value;
    const images = imagesStr.split(',').map(url => url.trim()).filter(url => url).slice(0, 7);

    try {
      await axios.post('/api/services', { name, description, duration: Number(duration), price: Number(price), category, images });
      form.reset();
      alert('Service added successfully');
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-luxury-800 p-8">Loading data...</div>;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
            <div className="bg-white p-6 rounded-2xl border border-luxury-300 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-luxury-800 mb-2">Total Bookings</p>
              <p className="text-4xl font-serif text-luxury-900">{bookings.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-luxury-300 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-luxury-800 mb-2">Pending</p>
              <p className="text-4xl font-serif text-accent">{bookings.filter(b => b.status === 'pending').length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-luxury-300 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-luxury-800 mb-2">Completed</p>
              <p className="text-4xl font-serif text-green-700">{bookings.filter(b => b.status === 'completed').length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-luxury-300 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-luxury-800 mb-2">Total Customers</p>
              <p className="text-4xl font-serif text-luxury-900">{customers.length}</p>
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div className="p-8">
             <h2 className="font-serif text-2xl text-luxury-900 mb-8 border-b border-luxury-300 pb-4">All Reservations</h2>
             {bookings.length === 0 ? (
               <div className="text-center py-12 text-luxury-800">No reservations found.</div>
             ) : (
               <div className="overflow-x-auto bg-white rounded-2xl border border-luxury-300 shadow-sm p-6">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-luxury-300 text-[10px] uppercase tracking-[0.15em] font-semibold text-luxury-800">
                       <th className="pb-4 font-normal">Client</th>
                       <th className="pb-4 font-normal">Service</th>
                       <th className="pb-4 font-normal">Date & Time</th>
                       <th className="pb-4 font-normal">Status</th>
                       <th className="pb-4 font-normal text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {bookings.map(booking => (
                       <tr key={booking._id} className="border-b border-luxury-300 last:border-0 hover:bg-luxury-200 transition-colors">
                         <td className="py-4 text-sm font-medium text-luxury-900">{booking.user?.name || 'Unknown'}</td>
                         <td className="py-4 text-sm text-luxury-800">{booking.service?.name || 'Service'}</td>
                         <td className="py-4 text-sm text-luxury-800">
                           {booking.date ? format(new Date(booking.date), 'MMM dd, yyyy') : 'TBD'} <br/>
                           <span className="text-[10px] font-semibold tracking-widest text-accent uppercase">{booking.timeSlot}</span>
                         </td>
                         <td className="py-4">
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                              booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                              booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              booking.status === 'completed' ? 'bg-luxury-800 text-luxury-100' :
                              'bg-[#D6CDBC] text-luxury-900'
                            }`}>
                              {booking.status}
                            </span>
                         </td>
                         <td className="py-4 text-right space-x-2 flex justify-end">
                           {booking.status === 'pending' && (
                             <>
                              <button onClick={() => updateStatus(booking._id, 'approved')} className="px-4 py-2 rounded-full bg-luxury-800 text-white text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-luxury-900 transition-all">Approve</button>
                              <button onClick={() => updateStatus(booking._id, 'rejected')} className="px-4 py-2 rounded-full border border-luxury-400 text-luxury-800 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-luxury-200 transition-all">Reject</button>
                             </>
                           )}
                           {booking.status === 'approved' && (
                             <button onClick={() => updateStatus(booking._id, 'completed')} className="px-4 py-2 rounded-full bg-accent text-white text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-accent-hover transition-all">Complete</button>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </div>
        );
      case 'services':
        return (
          <div className="p-8">
            <h2 className="font-serif text-2xl text-luxury-900 mb-8 border-b border-luxury-300 pb-4">Add New Service</h2>
            <form onSubmit={handleAddService} className="bg-white rounded-2xl border border-luxury-300 shadow-sm p-6 space-y-6 max-w-2xl">
              <div>
                <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Service Name</label>
                <input name="name" type="text" required className="w-full bg-luxury-100 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Description</label>
                <textarea name="description" required rows={3} className="w-full bg-luxury-100 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Duration (mins)</label>
                  <input name="duration" type="number" required className="w-full bg-luxury-100 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Price (₹)</label>
                  <input name="price" type="number" required className="w-full bg-luxury-100 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Category</label>
                <select name="category" required className="w-full bg-luxury-100 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none">
                  <option value="Hair">Hair</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Nails">Nails</option>
                  <option value="Skincare">Skincare</option>
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Images (Comma separated URLs, 1-7 max)</label>
                <input name="images" type="text" placeholder="https://image1.jpg, https://image2.jpg" required className="w-full bg-luxury-100 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none" />
              </div>
              <button type="submit" className="px-8 py-4 bg-luxury-800 text-luxury-100 text-[10px] tracking-[0.2em] uppercase font-bold rounded-full hover:bg-luxury-900 transition-all flex items-center">
                <Plus size={14} className="mr-2" /> Add Service
              </button>
            </form>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-8">
            <h2 className="font-serif text-2xl text-luxury-900 mb-8 border-b border-luxury-300 pb-4">Manage Notifications</h2>
            
            <form onSubmit={handleAddNotification} className="bg-white rounded-2xl border border-luxury-300 shadow-sm p-6 space-y-6 max-w-2xl mb-8">
              <h3 className="font-serif text-xl text-luxury-900">Post Update</h3>
              <div>
                <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Title</label>
                <input name="title" type="text" required className="w-full bg-luxury-100 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Message</label>
                <textarea name="message" required rows={3} className="w-full bg-luxury-100 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none"></textarea>
              </div>
              <button type="submit" className="px-8 py-4 bg-luxury-800 text-luxury-100 text-[10px] tracking-[0.2em] uppercase font-bold rounded-full hover:bg-luxury-900 transition-all flex items-center">
                <Bell size={14} className="mr-2" /> Broadcast Notification
              </button>
            </form>

            <div className="bg-white rounded-2xl border border-luxury-300 shadow-sm p-6 max-w-2xl">
              <h3 className="font-serif text-xl text-luxury-900 mb-4">Recent Notifications</h3>
              <div className="space-y-4">
                {notifications.map(notif => (
                  <div key={notif._id} className="p-4 bg-luxury-100 rounded-xl border border-luxury-300">
                    <p className="font-bold text-luxury-900 mb-1">{notif.title}</p>
                    <p className="text-sm text-luxury-800 mb-2">{notif.message}</p>
                    <p className="text-[10px] text-luxury-500 uppercase tracking-widest">{new Date(notif.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="p-8">
             <h2 className="font-serif text-2xl text-luxury-900 mb-8 border-b border-luxury-300 pb-4">Our Clientele</h2>
             <div className="overflow-x-auto bg-white rounded-2xl border border-luxury-300 shadow-sm p-6">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-luxury-300 text-[10px] uppercase tracking-[0.15em] font-semibold text-luxury-800">
                       <th className="pb-4 font-normal">Name</th>
                       <th className="pb-4 font-normal">Email</th>
                     </tr>
                   </thead>
                   <tbody>
                     {customers.map(c => (
                       <tr key={c._id} className="border-b border-luxury-300 last:border-0 hover:bg-luxury-200 transition-colors">
                         <td className="py-4 text-sm font-medium text-luxury-900">{c.name}</td>
                         <td className="py-4 text-sm text-luxury-800">{c.email}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
             </div>
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
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-luxury-800 mb-6 md:mb-6">Management</p>
          <button className="md:hidden text-luxury-800 -mt-1" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="px-6">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'bookings', label: 'Bookings', icon: CalendarIcon },
              { id: 'services', label: 'Services', icon: Scissors },
              { id: 'notifications', label: 'Updates', icon: Bell },
              { id: 'customers', label: 'Clientele', icon: Users },
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
        <div className="mt-auto p-6 border-t border-luxury-300 space-y-4">
           <a 
            href="/dashboard"
            className="flex items-center space-x-3 text-sm font-medium text-luxury-800 hover:text-luxury-900 transition-colors"
          >
            <User size={18} />
            <span>View Customer Panel</span>
          </a>
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
        <div className="px-8 pb-4 border-b border-luxury-300 bg-luxury-100/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2 -ml-2 rounded-lg hover:bg-luxury-200 text-luxury-800 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu size={24} />
              </button>
              <h1 className="font-serif text-2xl md:text-3xl text-luxury-900">Director's Portal</h1>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
               <div className="w-2 h-2 rounded-full bg-green-400"></div>
               <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">System Online</span>
            </div>
        </div>
        
        {renderContent()}
      </div>

    </motion.div>
  );
}
