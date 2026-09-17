import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { Trash2, Plus, Edit } from "lucide-react";

export default function OfferSettings() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const res = await api.getOffers();
    if (res && Array.isArray(res)) {
      setOffers(res);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const offer = {
        ...editingOffer,
        OfferID: editingOffer.OfferID || Date.now().toString()
      };
      await api.saveOffer(offer);
      alert("Offer saved!");
      setEditingOffer(null);
      fetchOffers();
    } catch (err) {
      alert("Failed to save offer");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this offer?")) return;
    try {
      await api.deleteOffer(id);
      fetchOffers();
    } catch (err) {
      alert("Failed to delete offer");
    }
  };

  if (editingOffer) {
    return (
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{editingOffer.OfferID ? 'Edit' : 'New'} Offer</h3>
          <button type="button" onClick={() => setEditingOffer(null)} className="text-sm text-gray-500 hover:text-black">Cancel</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium">Offer Name (Internal)</label>
            <input required type="text" value={editingOffer.OfferName || ''} onChange={e => setEditingOffer({...editingOffer, OfferName: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium">Offer Title (Public)</label>
            <input required type="text" value={editingOffer.Title || ''} onChange={e => setEditingOffer({...editingOffer, Title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea value={editingOffer.Description || ''} onChange={e => setEditingOffer({...editingOffer, Description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows={2} />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Discount Type</label>
            <select value={editingOffer.DiscountType || 'percentage'} onChange={e => setEditingOffer({...editingOffer, DiscountType: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (BDT)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Discount Value</label>
            <input required type="number" min="0" max={editingOffer.DiscountType === 'percentage' ? "100" : undefined} value={editingOffer.DiscountValue || ''} onChange={e => setEditingOffer({...editingOffer, DiscountValue: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Minimum Order (BDT)</label>
            <input type="number" min="0" value={editingOffer.MinimumOrder || ''} onChange={e => setEditingOffer({...editingOffer, MinimumOrder: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Maximum Discount (BDT) (For %)</label>
            <input type="number" min="0" value={editingOffer.MaximumDiscount || ''} onChange={e => setEditingOffer({...editingOffer, MaximumDiscount: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Applicable Category (Comma separated)</label>
            <input type="text" value={editingOffer.Category || ''} onChange={e => setEditingOffer({...editingOffer, Category: e.target.value})} placeholder="e.g. Shirts, Pants" className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Applicable Product IDs (Comma separated)</label>
            <input type="text" value={editingOffer.ProductIDs || ''} onChange={e => setEditingOffer({...editingOffer, ProductIDs: e.target.value})} placeholder="Leave blank for all" className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Coupon Code (Optional)</label>
            <input type="text" value={editingOffer.CouponCode || ''} onChange={e => setEditingOffer({...editingOffer, CouponCode: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Banner Image URL</label>
            <input type="text" value={editingOffer.BannerImageUrl || ''} onChange={e => setEditingOffer({...editingOffer, BannerImageUrl: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Start Date</label>
            <input type="date" required value={editingOffer.StartDate || ''} onChange={e => setEditingOffer({...editingOffer, StartDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">End Date</label>
            <input type="date" required value={editingOffer.EndDate || ''} onChange={e => setEditingOffer({...editingOffer, EndDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          
          <div className="space-y-2 col-span-2">
             <label className="flex items-center gap-3 mt-2">
              <input type="checkbox" checked={editingOffer.Status !== 'inactive'} onChange={e => setEditingOffer({...editingOffer, Status: e.target.checked ? 'active' : 'inactive'})} className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
              <span className="font-medium">Active</span>
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="px-6 py-2 bg-black text-white font-medium rounded-lg w-full">
          {loading ? "Saving..." : "Save Offer"}
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Offers</h3>
          <p className="text-sm text-gray-500">Manage discounts and promotions.</p>
        </div>
        <button onClick={() => setEditingOffer({})} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Offer
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium">Offer Name</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Valid Till</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {offers.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No offers found.</td></tr>
            ) : offers.map((offer) => (
              <tr key={offer.OfferID}>
                <td className="px-4 py-3 font-medium">{offer.OfferName}</td>
                <td className="px-4 py-3">
                  {offer.DiscountValue}{offer.DiscountType === 'percentage' ? '%' : ' BDT'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${offer.Status !== 'inactive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {offer.Status !== 'inactive' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{offer.EndDate}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditingOffer(offer)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(offer.OfferID)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
