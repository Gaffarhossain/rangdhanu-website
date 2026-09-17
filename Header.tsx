import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "Women's Fashion", "Men's Fashion", "Kids Fashion", "Three Piece", 
    "Saree", "T-Shirts", "Shirts", "Pants", "Bags", "Shoes", "Accessories", "Cosmetics"
  ];

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "New Arrivals", path: "/shop?sort=newest" },
    { name: "Offers", path: "/shop?filter=offers" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Track Order", path: "/track-order" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="border-b border-gray-200 py-4 px-4 md:px-8 lg:px-12 flex items-center justify-between sticky top-0 bg-white z-40">
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-gray-700" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="text-2xl font-bold tracking-tight text-brand-dark flex flex-col leading-none">
            <div className="flex items-center gap-1">
              <span className="text-brand">R</span>angdhanu
            </div>
            <span className="text-[9px] text-gray-500 font-medium tracking-wide mt-1">FASHION FOR A BETTER YOU</span>
          </Link>
        </div>
        
        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-gray-700">
          <Link to="/" className={`hover:text-brand transition ${location.pathname === '/' ? 'text-brand font-bold' : ''}`}>Home</Link>
          <Link to="/shop" className={`hover:text-brand transition ${location.pathname === '/shop' ? 'text-brand font-bold' : ''}`}>Shop</Link>
          
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="flex items-center gap-1 hover:text-brand transition py-2">
              Categories <ChevronDown className="w-4 h-4" />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-50">
                {categories.map(cat => (
                  <Link 
                    key={cat} 
                    to={`/shop?category=${encodeURIComponent(cat)}`} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand/5 hover:text-brand transition"
                    onClick={() => setCatOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/shop?sort=newest" className="hover:text-brand transition">New Arrivals</Link>
          <Link to="/shop?filter=offers" className="hover:text-brand transition">Offers</Link>
          <Link to="/about" className={`hover:text-brand transition ${location.pathname === '/about' ? 'text-brand font-bold' : ''}`}>About</Link>
          <Link to="/contact" className={`hover:text-brand transition ${location.pathname === '/contact' ? 'text-brand font-bold' : ''}`}>Contact</Link>
          <Link to="/track-order" className={`hover:text-brand transition ${location.pathname === '/track-order' ? 'text-brand font-bold' : ''}`}>Track Order</Link>
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5">
            <Search className="w-4 h-4 text-gray-500" />
            <form onSubmit={handleSearch}>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-32 focus:w-48 transition-all" />
            </form>
          </div>
          <button className="md:hidden text-gray-700 hover:text-brand" onClick={() => setSearchOpen(!searchOpen)}><Search className="w-5 h-5" /></button>
          
          <Link to="/cart" className="relative text-gray-700 hover:text-brand transition">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden p-4 bg-white border-b border-gray-100 absolute w-full z-30 shadow-sm">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for products..." className="bg-transparent border-none outline-none text-sm ml-3 flex-1" autoFocus />
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden flex">
          <div className="bg-white w-72 h-full shadow-xl flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <span className="font-bold text-lg text-brand-dark">Rangdhanu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-brand bg-white p-1 rounded-full shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex flex-col py-4">
              {links.slice(0,2).map(link => (
                <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 text-gray-800 font-medium hover:bg-gray-50 border-b border-gray-50">{link.name}</Link>
              ))}
              
              <div className="px-6 py-3 border-b border-gray-50">
                <span className="text-gray-800 font-medium mb-2 block">Categories</span>
                <div className="pl-4 space-y-3 flex flex-col">
                  {categories.map(cat => (
                    <Link key={cat} to={`/shop?category=${encodeURIComponent(cat)}`} onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 hover:text-brand">{cat}</Link>
                  ))}
                </div>
              </div>

              {links.slice(2).map(link => (
                <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 text-gray-800 font-medium hover:bg-gray-50 border-b border-gray-50">{link.name}</Link>
              ))}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
}
