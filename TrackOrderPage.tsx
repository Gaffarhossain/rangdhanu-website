import { X } from "lucide-react";
import { useState } from "react";
import { Search, Package, CheckCircle2, Clock, Truck, Home } from "lucide-react";
import { api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function TrackOrderPage() {
  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setLoading(true);
    setError("");
    setOrder(null);
    
    try {
      // Find in local storage or api
      const localOrders = JSON.parse(localStorage.getItem('rangdhanu_orders') || '[]');
      let found = localOrders.find((o: any) => o.orderId === trackingId || o.OrderID === trackingId);
      
      if (!found) {
        const res = await api.getOrders();
        if (Array.isArray(res)) {
          found = res.find((o: any) => o.orderId === trackingId || o.OrderID === trackingId);
        }
      }
      
      if (found) {
        setOrder(found);
      } else {
        setError("দুঃখিত, এই ট্র্যাকিং নম্বরের কোনো অর্ডার পাওয়া যায়নি। নম্বরটি আবার চেক করুন।");
      }
    } catch(err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const statusMap: Record<string, number> = {
    'Pending': 1,
    'Confirmed': 2,
    'Processing': 3,
    'Shipped': 4,
    'Delivered': 5,
    'Cancelled': -1
  };

  const getStatusStep = (status: string) => statusMap[status] || 1;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600">আপনার অর্ডার ট্র্যাক করতে নিচে Tracking Number দিন</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Package className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input 
                type="text" 
                value={trackingId}
                onChange={e => setTrackingId(e.target.value.toUpperCase())}
                placeholder="e.g. RNG-20260918-0001" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand font-mono"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition shadow-md shadow-brand/20 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? "Searching..." : <><Search className="w-5 h-5" /> Track Order</>}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4 text-center text-sm font-medium">{error}</p>}
        </div>

        {order && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-brand text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-brand-light text-sm font-medium mb-1 uppercase tracking-wider">Tracking Number</p>
                <h2 className="text-2xl font-bold font-mono">{order.orderId || order.OrderID}</h2>
              </div>
              <div className="text-right">
                <p className="text-brand-light text-sm font-medium mb-1 uppercase tracking-wider">Order Date</p>
                <p className="font-bold">{new Date(order.createdAt || order.OrderDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">Order Status</h3>
              
              {/* Timeline */}
              {getStatusStep(order.orderStatus) !== -1 ? (
                <div className="relative flex justify-between max-w-lg mx-auto mb-12">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-brand -translate-y-1/2 z-0 transition-all duration-1000"
                    style={{ width: `${((getStatusStep(order.orderStatus) - 1) / 4) * 100}%` }}
                  ></div>

                  {[
                    { step: 1, label: 'Pending', icon: Clock },
                    { step: 2, label: 'Confirmed', icon: CheckCircle2 },
                    { step: 3, label: 'Processing', icon: Package },
                    { step: 4, label: 'Shipped', icon: Truck },
                    { step: 5, label: 'Delivered', icon: Home },
                  ].map((s) => {
                    const active = getStatusStep(order.orderStatus) >= s.step;
                    const Icon = s.icon;
                    return (
                      <div key={s.step} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${active ? 'bg-brand text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-bold absolute top-12 whitespace-nowrap ${active ? 'text-brand' : 'text-gray-400'}`}>{s.label}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                    <X className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-red-600">Order Cancelled</h3>
                  <p className="text-gray-500 mt-2">This order has been cancelled.</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8 border-t border-gray-100 pt-8 mt-12">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Delivery Details</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p><span className="font-medium text-gray-900">Name:</span> {order.customerName}</p>
                    <p><span className="font-medium text-gray-900">Phone:</span> {order.mobile}</p>
                    <p><span className="font-medium text-gray-900">Address:</span> {order.address}</p>
                    {order.note && <p><span className="font-medium text-gray-900">Note:</span> {order.note}</p>}
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4">Order Summary</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>৳ {order.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>৳ {order.deliveryCharge}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-brand">
                        <span>Discount</span>
                        <span>- ৳ {order.discount}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span>৳ {order.grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
