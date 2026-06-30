import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-luxury-900 text-luxury-200 py-16 border-t border-luxury-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex flex-col mb-6">
              <span className="font-serif text-3xl text-luxury-100">Heenuvanshii</span>
              <span className="font-sans text-xs tracking-[0.3em] text-luxury-300 uppercase mt-2">Salon Studio</span>
            </Link>
            <p className="text-sm text-luxury-300 max-w-sm leading-relaxed">
              Experience the pinnacle of luxury beauty. Our expert stylists and premium treatments ensure you leave feeling revitalized, confident, and radiant.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-luxury-100 mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-luxury-300">
              <li><Link to="/services" className="hover:text-accent transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-luxury-100 mb-6">Visit Us</h4>
            <ul className="space-y-4 text-sm text-luxury-300">
              <li>123 Luxury Avenue</li>
              <li>Beverly Hills, CA 90210</li>
              <li className="pt-4 font-serif italic">Mon - Sat: 10AM - 8PM</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-luxury-800 text-center text-xs text-luxury-300 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Heenuvanshii Salon Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
