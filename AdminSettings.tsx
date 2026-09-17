import { useSearchParams } from "react-router-dom";
import TickerSettings from "./settings/TickerSettings";
import HeroSettings from "./settings/HeroSettings";
import OfferSettings from "./settings/OfferSettings";
import DeliverySettings from "./settings/DeliverySettings";

export default function AdminSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "general";
  
  const tabs = [
    { id: "general", label: "Ticker Settings" },
    { id: "hero", label: "Hero Banner" },
    { id: "offers", label: "Offers" },
    { id: "delivery", label: "Delivery Charges" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex bg-white rounded-t-xl border border-gray-100 overflow-x-auto shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSearchParams({ tab: t.id })}
            className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors relative ${
              tab === t.id
                ? "text-brand"
                : "text-gray-500 hover:text-gray-900 bg-gray-50/50 hover:bg-gray-50"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-100 p-8">
        {tab === "general" && <TickerSettings />}
        {tab === "hero" && <HeroSettings />}
        {tab === "offers" && <OfferSettings />}
        {tab === "delivery" && <DeliverySettings />}
      </div>
    </div>
  );
}
