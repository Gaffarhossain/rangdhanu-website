import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, ArrowLeft, Heart, Star, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import ProductCard from "../../components/ProductCard";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    setLoading(true);
    api.getProducts().then(res => {
      if (Array.isArray(res)) {
        const found = res.find(p => p.productId === id);
        if (found) {
          setProduct(found);
          let images = [];
          try { images = JSON.parse(found.images || '[]'); } 
          catch(e) { if (typeof found.images === 'string') images = [found.images]; }
          setActiveImage(images[0] || 'https://via.placeholder.com/400');
          
          const related = res.filter(p => p.categoryId === found.categoryId && p.productId !== id).slice(0, 4);
          setRelatedProducts(related);
        }
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
      <p className="text-gray-500 mb-8 max-w-md">The product you are looking for might have been removed or is temporarily unavailable.</p>
      <Link to="/shop" className="px-8 py-3 bg-brand text-white font-bold rounded-full hover:bg-brand-dark transition">
        Back to Shop
      </Link>
    </div>
  );

  let images = [];
  try { images = JSON.parse(product.images || '[]'); } 
  catch(e) { if (typeof product.images === 'string') images = [product.images]; }

  const handleAddToCart = () => {
    addToCart({
      productId: product.productId,
      name: product.name,
      price: product.price,
      qty,
      image: activeImage
    });
    alert(`${qty}x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const sizes = ["S", "M", "L", "XL"];
  const colors = ["bg-red-500", "bg-blue-500", "bg-black", "bg-white", "bg-gray-400"];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-brand">Home</Link> &gt; 
          <Link to="/shop" className="hover:text-brand">Shop</Link> &gt; 
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="flex gap-4">
            <div className="w-20 hidden md:flex flex-col gap-4">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[3/4] w-full rounded-lg overflow-hidden border-2 transition ${activeImage === img ? 'border-brand shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-crosshair" />
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            
            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-4 overflow-x-auto mt-4 pb-2 w-full absolute left-0 px-4 top-[calc(100%+1rem)]">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${activeImage === img ? 'border-brand' : 'border-transparent opacity-70'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="mt-20 md:mt-0">
            {product.categoryId && <Link to={`/shop?category=${product.categoryId}`} className="text-sm font-bold text-brand uppercase tracking-wider mb-2 block hover:underline">{product.categoryId}</Link>}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-gray-500 text-sm">(120 reviews)</span>
            </div>
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-bold text-gray-900">৳ {product.price}</span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xl text-gray-400 line-through mb-1">৳ {product.oldPrice}</span>
              )}
            </div>

            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide border border-green-200">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></div> In Stock
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description || "Beautiful floral dress made from premium cotton fabric. Perfect for casual outings, parties, and special occasions. Comfortable, stylish, and breathable."}</p>

            <div className="space-y-6 mb-8 border-y border-gray-100 py-6">
              {/* Size */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Size</h4>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-10 flex items-center justify-center rounded-lg border font-medium transition ${selectedSize === size ? 'border-brand bg-brand text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Color</h4>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full ${color} border-2 ring-2 ring-offset-2 transition ${selectedColor === color ? 'ring-brand' : 'ring-transparent border-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg h-12 bg-gray-50">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 h-full text-gray-600 hover:text-brand font-medium transition">-</button>
                  <span className="w-12 text-center font-bold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-4 h-full text-gray-600 hover:text-brand font-medium transition">+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 h-12 bg-brand-dark text-white font-bold rounded-lg hover:bg-gray-900 transition flex items-center justify-center"
                >
                  Buy Now
                </button>
                <button 
                  onClick={() => alert("Added to Wishlist")}
                  className="h-12 px-6 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition group"
                >
                  <Heart className="w-5 h-5 group-hover:fill-red-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-medium text-gray-600">Free Delivery<br/>On selected orders</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-medium text-gray-600">Cash on Delivery<br/>Pay after you receive</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCcw className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-medium text-gray-600">7 Days Return<br/>Easy return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/50 py-16 mt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => <ProductCard key={p.productId} product={p} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
