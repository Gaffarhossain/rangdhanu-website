import { Link, useLocation, Navigate } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight, Copy } from "lucide-react";
import { useState } from "react";

export default function OrderSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const [copied, setCopied] = useState(false);

  if (!orderId) {
    return <Navigate to="/shop" replace />;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50/50 py-12 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">অর্ডার সম্পন্ন হয়েছে!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। খুব শীঘ্রই আমাদের একজন প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-brand"></div>
          <p className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-widest">Tracking Number</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-bold text-gray-900 font-mono tracking-tight">{orderId}</span>
            <button 
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-brand bg-white rounded-lg border border-gray-200 shadow-sm transition"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <p className="text-xs text-brand font-medium mt-2">Copied to clipboard!</p>}
          <p className="text-sm text-gray-500 mt-4">এই Tracking Number দিয়ে আপনি অর্ডারের আপডেট দেখতে পারবেন।</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/track-order" 
            className="px-8 py-3.5 bg-brand text-white font-bold rounded-full hover:bg-brand-dark transition shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" /> Track Order
          </Link>
          <Link 
            to="/shop" 
            className="px-8 py-3.5 bg-white text-gray-700 font-bold rounded-full border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
