import { Link } from "react-router-dom";
import { Facebook, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
        <div className="space-y-4">
          <Link to="/" className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-brand-light">R</span>angdhanu
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed">
            Fashion for a Better You. We bring you the latest fashion trends with the best quality and affordable prices.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition"><MessageCircle className="w-4 h-4" /></a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition"><Phone className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-brand-light transition">Home</Link></li>
            <li><Link to="/shop" className="hover:text-brand-light transition">Shop</Link></li>
            <li><Link to="/about" className="hover:text-brand-light transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-light transition">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Customer Service</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><Link to="/faq" className="hover:text-brand-light transition">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-brand-light transition">Shipping Policy</Link></li>
            <li><Link to="/returns" className="hover:text-brand-light transition">Return & Exchange</Link></li>
            <li><Link to="/terms" className="hover:text-brand-light transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Contact Us</h4>
          <ul className="space-y-4 text-gray-300 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-light flex-shrink-0" />
              <span>+880 1234 567890</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-light flex-shrink-0" />
              <span>info@rangdhanu.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-light flex-shrink-0" />
              <span>123 Fashion Street, <br/>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Rangdhanu. All rights reserved.
      </div>
    </footer>
  );
}
