import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import ProductCard from "../../components/ProductCard";
import HeroSlider from "../../components/HeroSlider";
import { ShieldCheck, Truck, Headphones, Wallet, Facebook, MessageCircle, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [settings, setSettings] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getSiteSettings(),
      api.getOffers(),
      api.getProducts()
    ]).then(([settingsRes, offersRes, productsRes]) => {
      if (settingsRes && !settingsRes.error) setSettings(settingsRes);
      if (offersRes && Array.isArray(offersRes)) {
        setOffers(offersRes.filter(o => o.Status !== 'inactive'));
      }
      if (productsRes && Array.isArray(productsRes)) {
        setProducts(productsRes.filter(p => p.active !== false));
      }
      setLoading(false);
    });
  }, []);

  const featured = products.slice(0, 8);

  const categories = [
    { name: "Women's Fashion", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop" },
    { name: "Men's Fashion", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop" },
    { name: "Kids Fashion", img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=200&h=200&fit=crop" },
    { name: "Three Piece", img: "https://images.unsplash.com/photo-1583496920915-d91abf07eb78?w=200&h=200&fit=crop" },
    { name: "Saree", img: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=200&h=200&fit=crop" },
    { name: "T-Shirts", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop" },
    { name: "Shirts", img: "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=200&h=200&fit=crop" },
    { name: "Pants", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=200&fit=crop" },
    { name: "Bags", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=200&h=200&fit=crop" },
    { name: "Shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
    { name: "Accessories", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=200&fit=crop" }
  ];

  if (loading) return <div className="p-12 text-center text-gray-500 min-h-[50vh] flex items-center justify-center">Loading store...</div>;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSlider settings={settings} />

      {/* Shop by Category */}
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 border-b border-gray-100">
        <h2 className="text-2xl font-bold mb-10 text-brand-dark text-center md:text-left">Shop by Category</h2>
        <div className="flex overflow-x-auto pb-6 gap-6 md:grid md:grid-cols-4 lg:grid-cols-6 snap-x hide-scrollbar">
          {categories.map((cat, i) => (
            <Link key={i} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="flex flex-col items-center gap-3 group min-w-[100px] snap-start">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 shadow-sm border border-gray-200 group-hover:border-brand group-hover:shadow-md transition-all">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-sm font-medium text-center text-gray-700 group-hover:text-brand transition">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl font-bold text-brand-dark">Featured Products</h2>
          <Link to="/shop" className="text-brand font-bold text-sm hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 gap-y-10">
          {featured.map(p => <ProductCard key={p.productId} product={p} />)}
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-12 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="bg-brand-dark rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="p-10 md:p-16 flex-1 flex flex-col justify-center relative z-10 text-white">
            <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full self-start mb-4">Limited Time</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Special Offer<br/><span className="text-brand-light">Up to 50% OFF</span></h2>
            <p className="text-gray-300 mb-8 max-w-md">On Selected Fashion Items. Upgrade your wardrobe with our premium collection today.</p>
            <Link to="/shop?filter=offers" className="self-start px-8 py-3 bg-white text-brand-dark font-bold rounded-full hover:bg-brand-light transition shadow-lg">
              Shop Offer
            </Link>
          </div>
          <div className="hidden md:block w-1/3 relative bg-brand-light">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800" alt="Special Offer" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <ShieldCheck className="w-10 h-10 text-brand mb-4" />
              <h3 className="font-bold mb-2">Quality Products</h3>
              <p className="text-sm text-gray-500">Premium quality you can trust</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <Truck className="w-10 h-10 text-brand mb-4" />
              <h3 className="font-bold mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-500">Quick and secure shipping</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <Wallet className="w-10 h-10 text-brand mb-4" />
              <h3 className="font-bold mb-2">Cash on Delivery</h3>
              <p className="text-sm text-gray-500">Pay after you receive</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <Headphones className="w-10 h-10 text-brand mb-4" />
              <h3 className="font-bold mb-2">Customer Support</h3>
              <p className="text-sm text-gray-500">We are always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-brand text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-brand-light mb-8 max-w-lg mx-auto">Get the latest updates on new arrivals, exclusive offers, and fashion tips.</p>
          <form className="flex max-w-md mx-auto bg-white p-1 rounded-full shadow-lg" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required className="flex-1 px-6 py-3 bg-transparent text-gray-900 border-none outline-none" />
            <button type="submit" className="px-8 py-3 bg-brand-dark text-white font-bold rounded-full hover:bg-gray-900 transition">
              Subscribe
            </button>
          </form>
          <div className="flex justify-center gap-6 mt-10">
            <a href="#" className="flex items-center gap-2 hover:text-brand-light transition"><Facebook className="w-5 h-5" /> Facebook</a>
            <a href="#" className="flex items-center gap-2 hover:text-brand-light transition"><MessageCircle className="w-5 h-5" /> Messenger</a>
          </div>
        </div>
      </section>
    </div>
  );
}
