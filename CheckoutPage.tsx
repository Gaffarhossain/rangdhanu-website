import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useCart } from "../../context/CartContext";
import { bdLocations } from "../../data/bangladeshLocations";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<any>({});
  const [offers, setOffers] = useState<any[]>([]);
  
  const [selDivision, setSelDivision] = useState("");
  const [selDistrict, setSelDistrict] = useState("");
  const [selUpazila, setSelUpazila] = useState("");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", address: "", note: ""
  });

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
    api.getSiteSettings().then(res => res && setSettings(res));
    api.getOffers().then(res => {
      if (Array.isArray(res)) setOffers(res.filter(o => o.Status !== 'inactive'));
    });
  }, [items, navigate]);

  const activeDivision = bdLocations.find(d => d.division === selDivision);
  const activeDistrict = activeDivision?.districts.find(d => d.name === selDistrict);

  // Delivery charge logic based on district
  let deliveryCharge = 0;
  if (settings.DeliveryEnabled === "true" || true) {
    if (settings.FreeDeliveryMinimum && subtotal >= Number(settings.FreeDeliveryMinimum)) {
      deliveryCharge = 0;
    } else {
      if (selDistrict === "ঢাকা") {
        deliveryCharge = Number(settings.DeliveryInsideDhaka) || 60;
      } else {
        deliveryCharge = Number(settings.DeliveryOutsideDhaka) || 120;
      }
    }
  }

  // Offer calculation
  let discount = 0;
  const activeOffer = offers[0]; // simplistic approach
  if (activeOffer && (!activeOffer.MinimumOrder || subtotal >= Number(activeOffer.MinimumOrder))) {
    if (activeOffer.DiscountType === "percentage") {
      discount = (subtotal * Number(activeOffer.DiscountValue)) / 100;
      if (activeOffer.MaximumDiscount) {
        discount = Math.min(discount, Number(activeOffer.MaximumDiscount));
      }
    } else {
      discount = Number(activeOffer.DiscountValue);
    }
  }

  const grandTotal = subtotal - discount + deliveryCharge;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selDivision || !selDistrict || !selUpazila) {
      alert("অনুগ্রহ করে বিভাগ, জেলা এবং থানা সঠিকভাবে নির্বাচন করুন।");
      return;
    }
    
    setLoading(true);
    try {
      const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
      const randomStr = Math.floor(Math.random()*10000).toString().padStart(4, '0');
      const orderId = `RNG-${dateStr}-${randomStr}`;
      
      const orderData = {
        orderId,
        customerName: form.name,
        mobile: form.phone,
        address: `${form.address}, ${selUpazila}, ${selDistrict}, ${selDivision}`,
        note: form.note,
        subtotal,
        deliveryCharge,
        discount,
        grandTotal,
        paymentMethod: "Cash on Delivery",
        orderStatus: "Pending",
        createdAt: new Date().toISOString(),
        itemsJSON: items
      };
      
      await api.createOrder(orderData);
      clearCart();
      navigate("/order-success", { state: { orderId } });
    } catch (e) {
      alert("Failed to place order");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-12 py-12 grid lg:grid-cols-2 gap-12 bg-white">
      <div>
        <h2 className="text-2xl font-bold mb-6 pb-4 border-b">Checkout</h2>
        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
          <h3 className="text-lg font-bold">Customer Information</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Full Name / নাম *</label>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-brand focus:border-brand" placeholder="আপনার সম্পূর্ণ নাম" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Mobile Number / মোবাইল নম্বর *</label>
              <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-brand focus:border-brand" placeholder="আপনার মোবাইল নম্বর" />
            </div>
          </div>

          <h3 className="text-lg font-bold pt-4">Delivery Address / ডেলিভারি ঠিকানা</h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Division / বিভাগ *</label>
                <select required value={selDivision} onChange={e => {setSelDivision(e.target.value); setSelDistrict(""); setSelUpazila("");}} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-brand focus:border-brand">
                  <option value="" disabled>বিভাগ নির্বাচন করুন</option>
                  {bdLocations.map(d => <option key={d.division} value={d.division}>{d.division}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">District / জেলা *</label>
                <select required disabled={!selDivision} value={selDistrict} onChange={e => {setSelDistrict(e.target.value); setSelUpazila("");}} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-brand focus:border-brand disabled:opacity-50">
                  <option value="" disabled>জেলা নির্বাচন করুন</option>
                  {(activeDivision?.districts || []).map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Upazila/Thana / উপজেলা/থানা *</label>
              <select required disabled={!selDistrict} value={selUpazila} onChange={e => setSelUpazila(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-brand focus:border-brand disabled:opacity-50">
                <option value="" disabled>উপজেলা/থানা নির্বাচন করুন</option>
                {(activeDistrict?.upazilas || []).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Full Address / সম্পূর্ণ ঠিকানা *</label>
              <textarea required value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-brand focus:border-brand" rows={3} placeholder="বাসা/হোল্ডিং নম্বর, রাস্তা, গ্রাম/মহল্লা"></textarea>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Order Note / বিশেষ নোট (ঐচ্ছিক)</label>
              <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-brand focus:border-brand" rows={2} placeholder="অর্ডারের জন্য কোনো বিশেষ নোট থাকলে লিখুন"></textarea>
            </div>
          </div>
          
          <h3 className="text-lg font-bold pt-4">Payment Method</h3>
          <div className="p-4 border border-brand bg-brand-light/30 rounded-lg flex items-center gap-3">
            <input type="radio" checked readOnly className="w-5 h-5 text-brand" />
            <span className="font-medium">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
          </div>
        </form>
      </div>
      
      <div>
        <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 lg:sticky top-24">
          <h3 className="text-xl font-bold mb-6 pb-4 border-b">Order Summary</h3>
          
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.productId} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-white rounded-lg border flex-shrink-0 p-1">
                  <img src={item.image || 'https://via.placeholder.com/64'} className="w-full h-full object-cover rounded" alt="" />
                </div>
                <div className="flex-1 text-sm">
                  <h4 className="font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                  <p className="text-gray-500">Qty: {item.qty}</p>
                </div>
                <div className="font-medium whitespace-nowrap">
                  ৳ {item.price * item.qty}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-3 text-sm border-t border-gray-200 pt-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">৳ {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charge</span>
              <span className="font-medium">৳ {deliveryCharge}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand font-medium">
                <span>Discount</span>
                <span>- ৳ {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between text-xl font-bold text-gray-900">
              <span>Grand Total</span>
              <span>৳ {grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <button 
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full mt-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand-dark disabled:opacity-50 transition shadow-lg shadow-brand/20"
          >
            {loading ? "Processing..." : "Place Order (অর্ডার করুন)"}
          </button>
        </div>
      </div>
    </div>
  );
}
