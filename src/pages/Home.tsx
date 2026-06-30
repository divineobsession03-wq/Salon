import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col min-h-screen bg-luxury-100"
    >
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row min-h-[85vh] border-b border-luxury-300">
        
        {/* Left Hero */}
        <div className="w-full lg:w-7/12 p-8 lg:p-16 flex flex-col justify-center relative border-b lg:border-b-0 lg:border-r border-luxury-300 bg-luxury-100">
          <div className="max-w-xl z-10">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-[84px] font-serif leading-[0.9] text-luxury-900 mb-8"
            >
              Artistry in <br/><span className="italic font-light opacity-80">Excellence.</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg leading-relaxed text-luxury-800 opacity-70 mb-10"
            >
              Experience a curated collection of bespoke beauty treatments designed for the modern connoisseur. From cinematic bridal makeup to restorative hair spas.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-6 mb-10"
            >
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-luxury-100 bg-[#D6CDBC]"></div>
                <div className="w-10 h-10 rounded-full border-2 border-luxury-100 bg-luxury-300"></div>
                <div className="w-10 h-10 rounded-full border-2 border-luxury-100 bg-luxury-800 flex items-center justify-center text-[10px] text-white font-bold">+12k</div>
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-luxury-800">Trusted by elite clientele</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Link 
                to="/services" 
                className="group inline-flex items-center space-x-4 bg-luxury-800 text-luxury-100 px-8 py-4 text-[10px] tracking-[0.2em] uppercase font-bold rounded-full hover:bg-luxury-900 transition-all duration-300"
              >
                <span>Book Appointment</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
          
           {/* Floating Decorative Element */}
           <div className="absolute bottom-12 right-0 transform translate-x-1/2 opacity-10 pointer-events-none hidden lg:block">
             <svg width="240" height="240" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5"/></svg>
          </div>
        </div>

        {/* Right Gallery Preview */}
        <div className="w-full lg:w-5/12 bg-luxury-200 p-8 lg:p-12 flex flex-col justify-center gap-6 overflow-hidden">
           <div className="flex justify-between items-end mb-4">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-luxury-800">Featured Services</h2>
            <Link to="/services" className="text-[10px] uppercase font-bold border-b border-luxury-900 pb-1 hover:opacity-50 text-luxury-900">View All</Link>
          </div>
          
          <div className="flex flex-col gap-6">
            {[
              { title: 'Bridal Artistry', desc: 'Luxury makeup & styling packages', price: '$350+', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=200' },
              { title: 'Keratin Infusion', desc: 'Premium smoothing & repair', price: '$180', img: 'https://images.unsplash.com/photo-1560869713-7d0a2943003e?auto=format&fit=crop&q=80&w=200' }
            ].map((service, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.2) }}
                key={i} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-luxury-400 flex items-center group cursor-pointer hover:border-accent transition-all"
              >
                <div className="w-24 h-24 bg-luxury-300 rounded-xl mr-6 overflow-hidden shrink-0">
                  <div className="w-full h-full bg-cover bg-center opacity-80" style={{backgroundImage: `url('${service.img}')`}}></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl mb-1 text-luxury-900">{service.title}</h3>
                  <p className="text-xs text-luxury-800 opacity-60 mb-3">{service.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-luxury-900">{service.price}</span>
                    <Link to="/services" className="text-[10px] uppercase tracking-widest font-bold text-accent group-hover:opacity-80">Discover</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-luxury-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Star className="w-8 h-8 text-accent mx-auto mb-8" />
          <p className="font-serif text-3xl md:text-4xl text-luxury-900 leading-[1.4] mb-8 italic opacity-90">
            "The most serene and professional salon experience I have ever had. The attention to detail and the luxurious ambiance is simply unmatched."
          </p>
          <span className="text-sm tracking-widest uppercase text-luxury-800 font-semibold">Eleanor Richards</span>
        </div>
      </section>
    </motion.div>
  );
}
