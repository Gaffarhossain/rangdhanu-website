import { useState, useEffect } from "react";
import { api } from "../../../lib/api";

export default function DeliverySettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    DeliveryEnabled: "true",
    DeliveryInsideDhaka: "60",
    DeliveryOutsideDhaka: "120",
    DeliveryDhakaDistrict: "100",
    DeliveryOtherDistrict: "150",
    FreeDeliveryMinimum: "2000",
    CodCharge: "10",
  });

  useEffect(() => {
    api.getSiteSettings().then(res => {
      if (res && !res.error) {
        setSettings(prev => ({ ...prev, ...res }));
      }
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.updateSiteSettings(settings);
      alert("Delivery settings saved successfully!");
    } catch (e) {
      alert("Failed to save delivery settings.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Delivery Charges</h3>
        <p className="text-sm text-gray-500">Configure shipping costs based on location.</p>
      </div>

      <label className="flex items-center gap-3">
        <input 
          type="checkbox" 
          checked={settings.DeliveryEnabled === "true"}
          onChange={(e) => setSettings({ ...settings, DeliveryEnabled: e.target.checked ? "true" : "false" })}
          className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
        />
        <span className="font-medium">Enable Delivery Charges</span>
      </label>

      <div className="grid sm:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Inside Dhaka Charge (BDT)</label>
          <input 
            type="number"
            min="0"
            value={settings.DeliveryInsideDhaka}
            onChange={(e) => setSettings({ ...settings, DeliveryInsideDhaka: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Outside Dhaka Charge (BDT)</label>
          <input 
            type="number"
            min="0"
            value={settings.DeliveryOutsideDhaka}
            onChange={(e) => setSettings({ ...settings, DeliveryOutsideDhaka: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Dhaka District Charge (BDT)</label>
          <input 
            type="number"
            min="0"
            value={settings.DeliveryDhakaDistrict}
            onChange={(e) => setSettings({ ...settings, DeliveryDhakaDistrict: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Other District Charge (BDT)</label>
          <input 
            type="number"
            min="0"
            value={settings.DeliveryOtherDistrict}
            onChange={(e) => setSettings({ ...settings, DeliveryOtherDistrict: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">COD Charge (BDT)</label>
          <input 
            type="number"
            min="0"
            value={settings.CodCharge}
            onChange={(e) => setSettings({ ...settings, CodCharge: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Free Delivery Minimum Order Amount (BDT)</label>
          <input 
            type="number"
            min="0"
            value={settings.FreeDeliveryMinimum}
            onChange={(e) => setSettings({ ...settings, FreeDeliveryMinimum: e.target.value })}
            placeholder="Enter 0 to disable"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
          <p className="text-xs text-gray-500">Orders above this amount will have 0 delivery charge. Set to 0 to disable.</p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex gap-4">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
