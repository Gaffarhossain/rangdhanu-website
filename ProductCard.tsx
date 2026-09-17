import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  
  let images = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch(e) {
    if (typeof product.images === 'string') images = [product.images];
  }
  const primaryImage = images[0] || 'https://via.placeholder.com/400';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addToCart({
      productId: product.productId,
      name: product.name,
      price: product.price,
      qty: 1,
      image: primaryImage
    });
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="group block bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-lg transition-all relative">
      <Link to={`/product/${product.productId}`} className="block aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
        <img src={primaryImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount > 0 && (
            <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">-{product.discount}% OFF</span>
          )}
          {product.newArrival && (
            <span className="bg-brand text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">New</span>
          )}
        </div>
        
        <button 
          onClick={(e) => { e.preventDefault(); alert('Added to wishlist'); }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:shadow-md transition opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
        >
          <Heart className="w-4 h-4" />
        </button>

      </Link>
      <div className="px-1">
        {product.categoryId && <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{product.categoryId}</p>}
        <Link to={`/product/${product.productId}`} className="font-semibold text-brand-dark line-clamp-1 hover:text-brand transition">{product.name}</Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-gray-900 text-lg">৳ {product.price}</span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">৳ {product.oldPrice}</span>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition shadow-md shadow-brand/20"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
