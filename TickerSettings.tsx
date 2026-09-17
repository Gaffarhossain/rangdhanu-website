import { useState, useEffect } from "react";
import { api } from "../../../lib/api";

export default function TickerSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    TickerEnabled: "false",
    TickerMessages: "",
    TickerBgColor: "#000000",
    TickerTextColor: "#ffffff",
    TickerSpeed: "15",
    TickerSortOrder: "1",
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
      alert("Settings saved successfully!");
    } catch (e) {
      alert("Failed to save settings.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Announcement Ticker</h3>
        <p className="text-sm text-gray-500">Display a scrolling banner at the top of your website.</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input 
            type="checkbox" 
            checked={settings.TickerEnabled === "true"}
            onChange={(e) => setSettings({ ...settings, TickerEnabled: e.target.checked ? "true" : "false" })}
            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="font-medium">Enable Ticker</span>
        </label>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Ticker Message</label>
          <input 
            type="text"
            value={settings.TickerMessages}
            onChange={(e) => setSettings({ ...settings, TickerMessages: e.target.value })}
            placeholder="e.g. Free shipping on orders over 1000 BDT!"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Scroll Speed (seconds)</label>
            <input 
              type="number"
              min="5"
              value={settings.TickerSpeed}
              onChange={(e) => setSettings({ ...settings, TickerSpeed: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sort Order</label>
            <input 
              type="number"
              min="1"
              value={settings.TickerSortOrder}
              onChange={(e) => setSettings({ ...settings, TickerSortOrder: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Background Color</label>
            <div className="flex gap-2 items-center">
              <input 
                type="color"
                value={settings.TickerBgColor}
                onChange={(e) => setSettings({ ...settings, TickerBgColor: e.target.value })}
                className="w-10 h-10 p-1 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm font-mono text-gray-500">{settings.TickerBgColor}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Text Color</label>
            <div className="flex gap-2 items-center">
              <input 
                type="color"
                value={settings.TickerTextColor}
                onChange={(e) => setSettings({ ...settings, TickerTextColor: e.target.value })}
                className="w-10 h-10 p-1 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm font-mono text-gray-500">{settings.TickerTextColor}</span>
            </div>
          </div>
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
