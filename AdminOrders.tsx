import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Search, Filter, Eye } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadOrders = () => {
    setLoading(true);
    api.getOrders().then(res => {
      if (Array.isArray(res)) {
        setOrders(res.sort((a, b) => {
          const dA = new Date(a.createdAt || a.OrderDate || 0).getTime();
          const dB = new Date(b.createdAt || b.OrderDate || 0).getTime();
          return dB - dA;
        }));
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const localOrders = JSON.parse(localStorage.getItem('rangdhanu_orders') || '[]');
      const idx = localOrders.findIndex((o: any) => o.orderId === orderId || o.OrderID === orderId);
      
      if (idx !== -1) {
        localOrders[idx].orderStatus = newStatus;
        localStorage.setItem('rangdhanu_orders', JSON.stringify(localOrders));
        loadOrders();
      }
    } catch(e) {
      console.error(e);
    }
  };

  const filtered = orders.filter(o => 
    (o.orderId || o.OrderID || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.customerName || o.CustomerName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-4 items-center w-full max-w-lg">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">No orders found.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order, i) => {
                const status = order.orderStatus || order.Status || "Pending";
                return (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-medium text-brand">{order.orderId || order.OrderID}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {order.customerName || order.CustomerName}
                    <div className="text-gray-500 text-xs font-normal mt-0.5">{order.mobile || order.Phone}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">৳ {order.grandTotal || order.GrandTotal}</td>
                  <td className="px-6 py-4">
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(order.orderId || order.OrderID, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-none outline-none appearance-none cursor-pointer
                        ${status === 'Pending' ? 'bg-orange-100 text-orange-700' : ''}
                        ${status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : ''}
                        ${status === 'Processing' ? 'bg-indigo-100 text-indigo-700' : ''}
                        ${status === 'Shipped' ? 'bg-purple-100 text-purple-700' : ''}
                        ${status === 'Delivered' ? 'bg-green-100 text-green-700' : ''}
                        ${status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}
                      `}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt || order.OrderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-brand bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition inline-flex items-center gap-2">
                      <Eye className="w-4 h-4" /> <span className="text-xs font-medium">View</span>
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
