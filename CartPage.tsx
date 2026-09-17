import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { api } from "../../lib/api";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQty, subtotal } = useCart();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    api.getSiteSettings().then(res => res && setSettings(res));
  }, []);

  const deliveryCharge = Number(settings.DeliveryInsideDhaka) || 60;
  const discount = 0; // Simplified for UI
  const grandTotal = subtotal + deliveryCharge - discount;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] bg-gray-50/50">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand-dark transition shadow-lg shadow-brand/20">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-[80vh] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-sm text-gray-500 mb-6">Home &gt; Cart</div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Your Cart <span className="text-gray-400 font-normal text-xl">({items.length} items)</span></h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gray-100 text-sm font-bold text-gray-500">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.productId} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center">
                  <div className="col-span-1 md:col-span-6 flex gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex-shrink-0 border border-gray-100 overflow-hidden">
                      <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <Link to={`/product/${item.productId}`} className="font-bold text-gray-900 hover:text-brand line-clamp-2 mb-1">{item.name}</Link>
                      <p className="text-sm text-gray-500">Size: M | Color: Pink</p>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 text-left md:text-center font-medium mt-2 md:mt-0">
                    <span className="md:hidden text-gray-500 text-sm mr-2">Price:</span>
                    ৳ {item.price}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center mt-2 md:mt-0">
                    <div className="flex items-center border border-gray-200 rounded-lg h-9 bg-gray-50">
                      <button onClick={() => updateQty(item.productId, item.qty - 1)} className="px-3 h-full text-gray-600 hover:text-brand">-</button>
                      <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                      <button onClick={() => updateQty(item.productId, item.qty + 1)} className="px-3 h-full text-gray-600 hover:text-brand">+</button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center mt-2 md:mt-0">
                    <span className="font-bold text-gray-900">৳ {item.price * item.qty}</span>
                    <button onClick={() => removeFromCart(item.productId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition ml-4">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Have a coupon code?</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter code" className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none" />
                <button className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition text-sm">Apply</button>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-600 border-t border-gray-100 pt-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">৳ {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-medium text-gray-900">৳ {deliveryCharge}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="font-medium text-red-500">- ৳ {discount}</span>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Grand Total</span>
                <span className="text-2xl font-bold text-brand">৳ {grandTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button onClick={() => navigate('/checkout')} className="w-full py-4 bg-brand text-white font-bold rounded-full hover:bg-brand-dark transition shadow-lg shadow-brand/20 flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/shop')} className="w-full py-4 bg-white text-gray-700 font-bold rounded-full hover:bg-gray-50 border border-gray-200 transition">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
