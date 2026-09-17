import { Outlet, Link, useLocation } from "react-router-dom";
import { Settings, LayoutDashboard, ShoppingBag, Users, Package, LogOut, Tags, Gift, Image, CreditCard } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const menu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Categories", path: "/admin/categories", icon: Tags },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Offers", path: "/admin/offers", icon: Gift },
    { name: "Hero Banner", path: "/admin/hero", icon: Image },
    { name: "Ticker Settings", path: "/admin/ticker", icon: CreditCard },
    { name: "Delivery Charge", path: "/admin/delivery", icon: TruckIcon },
    { name: "Website Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-sm">
      {/* Dark Sidebar */}
      <div className="w-64 bg-gray-900 text-gray-300 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold">R</div>
          <Link to="/admin" className="text-xl font-bold text-white tracking-tight">Rangdhanu <span className="font-light">Admin</span></Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menu.map(item => {
            const Icon = item.icon;
            // Exact match for dashboard, includes for others
            const isActive = item.path === '/admin' ? location.pathname === '/admin' : location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive ? "bg-brand/20 text-brand-light border border-brand/30" : "hover:bg-gray-800 hover:text-white border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-light" : "text-gray-400"}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            Exit to Store
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
          <h1 className="text-lg font-bold text-gray-800 capitalize">
            {location.pathname === '/admin' ? 'Dashboard' : location.pathname.split('/').pop()?.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center font-bold">A</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function TruckIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
    </svg>
  );
}
