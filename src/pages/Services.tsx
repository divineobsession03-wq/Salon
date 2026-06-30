import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { format, addDays } from 'date-fns';

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/services')
      .then(res => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const openBooking = (service: any) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/bookings', {
        serviceId: selectedService._id,
        date: bookingDate,
        timeSlot: bookingTime,
        notes: ''
      });
      alert('Booking successful!');
      setIsBookingModalOpen(false);
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating booking');
    }
  };

  const categories = ['All', 'Hair', 'Makeup', 'Nails', 'Skincare'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="h-[60vh] flex items-center justify-center font-serif text-2xl text-luxury-800">Curating Services...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-luxury-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-luxury-900 mb-6">Our Services</h1>
          <div className="w-16 h-px bg-accent mx-auto mb-10"></div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-luxury-300 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                    selectedCategory === category 
                      ? 'bg-luxury-800 text-white' 
                      : 'bg-white border border-luxury-300 text-luxury-800 hover:border-accent'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredServices.map((service, i) => (
            <motion.div 
              key={service._id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-luxury-300 group overflow-hidden hover:border-accent transition-all"
            >
              <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
                <img 
                  src={(service.images && service.images.length > 0) ? service.images[0] : (service.image || `https://images.unsplash.com/photo-1595476108010-b4d1f10d5e42?auto=format&fit=crop&q=80&w=600`)} 
                  alt={service.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="md:w-3/5 p-8 flex flex-col justify-center">
                <span className="text-xs tracking-widest text-accent uppercase mb-2 block">{service.category}</span>
                <h3 className="font-serif text-2xl text-luxury-900 mb-4">{service.name}</h3>
                <p className="text-luxury-800 font-light text-sm mb-6 leading-relaxed">{service.description}</p>
                <div className="flex justify-between items-center mt-auto border-t border-luxury-300 pt-6">
                  <div>
                    <span className="block font-serif text-xl">₹{service.price}</span>
                    <span className="text-xs text-luxury-800 flex items-center mt-1"><Clock size={12} className="mr-1"/> {service.duration} mins</span>
                  </div>
                  <button 
                    onClick={() => openBooking(service)}
                    className="flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase font-bold text-luxury-900 group-hover:text-accent transition-colors"
                  >
                    <span>Reserve</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-luxury-900/40 backdrop-blur-sm"
              onClick={() => setIsBookingModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-luxury-100 w-full max-w-lg p-8 shadow-2xl"
            >
              <h3 className="font-serif text-3xl text-luxury-900 mb-2">Reserve Appointment</h3>
              <p className="text-sm text-luxury-800 mb-8">{selectedService.name} - ₹{selectedService.price}</p>
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Date</label>
                  <input 
                    type="date" 
                    required
                    min={format(new Date(), 'yyyy-MM-dd')}
                    max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full bg-luxury-200 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-luxury-800 mb-2">Time</label>
                  <select 
                    required
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                    className="w-full bg-luxury-200 border-none px-4 py-3 text-luxury-900 focus:ring-1 focus:ring-accent outline-none"
                  >
                    <option value="">Select a time</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
                <div className="pt-4 flex space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setIsBookingModalOpen(false)}
                    className="flex-1 py-4 border border-luxury-400 text-luxury-800 text-[10px] tracking-[0.2em] uppercase font-bold rounded-full hover:bg-luxury-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-luxury-800 text-luxury-100 text-[10px] tracking-[0.2em] uppercase font-bold rounded-full hover:bg-luxury-900 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
