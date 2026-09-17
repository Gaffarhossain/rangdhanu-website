import { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { Upload, X, Plus, MoveUp, MoveDown } from "lucide-react";

export default function HeroSettings() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [slides, setSlides] = useState([
    {
      image: "",
      heading: "",
      subtitle: "",
      btnText: "",
      btnLink: ""
    }
  ]);

  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    api.getSiteSettings().then(res => {
      if (res && !res.error) {
        setSettings(res);
        try {
          if (res.HeroSlides) {
            const parsed = JSON.parse(res.HeroSlides);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSlides(parsed);
            }
          }
        } catch(e) {}
      }
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedSettings = {
        ...settings,
        HeroSlides: JSON.stringify(slides)
      };
      await api.updateSiteSettings(updatedSettings);
      alert("Hero settings saved successfully!");
    } catch (e) {
      alert("Failed to save hero settings.");
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await api.uploadImage(base64, file.name);
        if (res && (res.fileUrl || res.url || res.success)) {
          const newSlides = [...slides];
          newSlides[index].image = res.fileUrl || res.url || base64;
          setSlides(newSlides);
        } else {
          alert(res?.error || "Failed to upload image.");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      alert("Error reading file.");
      setUploading(false);
    }
  };

  const addSlide = () => {
    if (slides.length >= 5) {
      alert("Maximum 5 slides allowed.");
      return;
    }
    setSlides([...slides, { image: "", heading: "", subtitle: "", btnText: "", btnLink: "" }]);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) {
      alert("At least 1 slide is required.");
      return;
    }
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    setSlides(newSlides);
  };

  const moveSlide = (index: number, dir: number) => {
    if (index + dir < 0 || index + dir >= slides.length) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index + dir];
    newSlides[index + dir] = temp;
    setSlides(newSlides);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Hero Slider Configuration</h3>
          <p className="text-sm text-gray-500 mt-1">Manage the sliding banners on the public homepage.</p>
        </div>
        <button 
          onClick={addSlide}
          disabled={slides.length >= 5}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button onClick={() => moveSlide(index, -1)} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded disabled:opacity-30"><MoveUp className="w-4 h-4" /></button>
              <button onClick={() => moveSlide(index, 1)} disabled={index === slides.length - 1} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded disabled:opacity-30"><MoveDown className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <button onClick={() => removeSlide(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
            </div>
            
            <h4 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs">{index + 1}</span> 
              Slide Configuration
            </h4>

            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Slide Background Image</label>
                {slide.image ? (
                  <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden border border-gray-300 group">
                    <img src={slide.image} alt="Slide" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => { const newSlides = [...slides]; newSlides[index].image = ""; setSlides(newSlides); }}
                      className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full shadow hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors bg-white">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 font-medium">Upload Image</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, index)} disabled={uploading} />
                  </label>
                )}
              </div>
              
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                  <input type="text" value={slide.heading} onChange={e => { const newSlides = [...slides]; newSlides[index].heading = e.target.value; setSlides(newSlides); }} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-brand" placeholder="e.g. Style That Speaks for You" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input type="text" value={slide.subtitle} onChange={e => { const newSlides = [...slides]; newSlides[index].subtitle = e.target.value; setSlides(newSlides); }} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-brand" placeholder="e.g. Discover elegant fashion pieces..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input type="text" value={slide.btnText} onChange={e => { const newSlides = [...slides]; newSlides[index].btnText = e.target.value; setSlides(newSlides); }} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-brand" placeholder="e.g. Shop Now" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input type="text" value={slide.btnLink} onChange={e => { const newSlides = [...slides]; newSlides[index].btnLink = e.target.value; setSlides(newSlides); }} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-brand" placeholder="e.g. /shop" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button 
          onClick={handleSave}
          disabled={loading || uploading}
          className="px-8 py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark disabled:opacity-50 transition shadow-md"
        >
          {loading ? "Saving..." : "Save Slider Configuration"}
        </button>
      </div>
    </div>
  );
}
