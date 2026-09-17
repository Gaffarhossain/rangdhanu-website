import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider({ settings }: { settings: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultSlides = [
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
      heading: "Style That Speaks for You",
      subtitle: "Discover elegant fashion pieces for your everyday confidence.",
      btnText: "Shop Now",
      btnLink: "/shop"
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
      heading: "New Fashion Collection",
      subtitle: "Explore our latest fashion collection.",
      btnText: "Explore Collection",
      btnLink: "/shop?sort=newest"
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80",
      heading: "Special Fashion Offers",
      subtitle: "Enjoy attractive offers on selected products.",
      btnText: "Shop Offers",
      btnLink: "/shop?filter=offers"
    }
  ];

  let slides = defaultSlides;
  
  if (settings && settings.HeroSlides) {
    try {
      const parsed = JSON.parse(settings.HeroSlides);
      if (Array.isArray(parsed) && parsed.length > 0) {
        slides = parsed;
      }
    } catch(e) {}
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] bg-gray-900 overflow-hidden group">
      {slides.map((slide, i) => (
        <div 
          key={i} 
          className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img 
            src={slide.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600"} 
            alt={slide.heading} 
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600'; }}
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className={`space-y-6 max-w-3xl transform transition-all duration-1000 ${i === currentSlide ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-10 opacity-0'}`}>
              {slide.heading && (
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg leading-tight">
                  {slide.heading}
                </h1>
              )}
              {slide.subtitle && (
                <p className="text-lg md:text-xl font-medium text-gray-100 drop-shadow max-w-xl mx-auto">
                  {slide.subtitle}
                </p>
              )}
              {slide.btnText && (
                <div className="pt-4">
                  <Link 
                    to={slide.btnLink || "/shop"}
                    className="inline-block px-10 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand-dark transition-all shadow-xl shadow-brand/30 hover:scale-105"
                  >
                    {slide.btnText}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-brand hover:text-white transition opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-brand hover:text-white transition opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full transition-all shadow-sm ${i === currentSlide ? 'bg-brand w-8' : 'bg-white/60 hover:bg-white'}`}
          />
        ))}
      </div>
    </section>
  );
}
