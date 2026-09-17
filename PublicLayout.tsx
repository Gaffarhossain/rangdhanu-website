import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PublicLayout() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    api.getSiteSettings().then(res => {
      if (res && !res.error) setSettings(res);
    });
  }, []);

  const defaultTicker = "নতুন ফ্যাশন কালেকশন এসেছে | সারা বাংলাদেশে ডেলিভারি | Cash on Delivery Available | সহজে অর্ডার করুন | বিশেষ অফারে পণ্য কিনুন";
  const tickerText = settings?.TickerMessages || defaultTicker;

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Header />
      
      {/* Active Ticker */}
      {settings?.TickerEnabled !== "false" && (
        <div 
          className="py-2.5 text-sm font-semibold overflow-hidden whitespace-nowrap relative border-b border-black/10 shadow-sm z-30"
          style={{ 
            backgroundColor: settings?.TickerBgColor || "#166534", 
            color: settings?.TickerTextColor || "#ffffff" 
          }}
        >
          <div 
            className="inline-block animate-marquee"
            style={{
              animationDuration: `${settings?.TickerSpeed || 25}s`
            }}
          >
            <span className="px-8">{tickerText}</span>
            <span className="px-8">{tickerText}</span>
            <span className="px-8">{tickerText}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
