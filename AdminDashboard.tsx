import { ShoppingBag, Users, Package, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([api.getProducts(), api.getOrders()]).then(([pRes, oRes]) => {
      let pCount = 0;
      let oCount = 0;
      let revenue = 0;
      if (Array.isArray(pRes)) pCount = pRes.length;
      if (Array.isArray(oRes)) {
        oCount = oRes.length;
        revenue = oRes.reduce((acc, curr) => acc + (Number(curr.grandTotal || curr.GrandTotal) || 0), 0);
      }
      setStats({ products: pCount, orders: oCount, revenue });
    });
  }, []);

  const cards = [
    { title: "Total Revenue", value: `৳ ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "bg-green-100 text-green-600" },
    { title: "Total Orders", value: stats.orders.toString(), icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
    { title: "Total Products", value: stats.products.toString(), icon: Package, color: "bg-purple-100 text-purple-600" },
    { title: "Total Customers", value: "24", icon: Users, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${c.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 mb-1">{c.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{c.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-brand font-bold hover:underline">View All</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <ShoppingBag className="w-12 h-12 text-gray-200 mb-4" />
            <p>No recent orders to show.</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Low Stock Products</h3>
            <Link to="/admin/products" className="text-sm text-brand font-bold hover:underline">View All</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Package className="w-12 h-12 text-gray-200 mb-4" />
            <p>All products are well stocked.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
