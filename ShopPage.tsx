import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import ProductCard from "../../components/ProductCard";
import { Filter, Search as SearchIcon } from "lucide-react";

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(categoryFilter || "");
  const [sort, setSort] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    api.getProducts().then(res => {
      if (Array.isArray(res)) setProducts(res.filter(p => p.active !== false));
      setLoading(false);
    });
  }, []);

  const categories = [
    "Women's Fashion", "Men's Fashion", "Kids Fashion", "Three Piece", "Saree", 
    "T-Shirts", "Shirts", "Pants", "Bags", "Shoes", "Accessories"
  ];

  let filtered = products.filter(p => {
    if (selectedCat && p.categoryId !== selectedCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'newest') filtered.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="bg-white border-b border-gray-100 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-sm text-gray-500 mb-2">Home &gt; Shop</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-dark mb-2">Shop Our Collection</h1>
          <p className="text-gray-500">Find your perfect style from our latest collection.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 flex flex-col md:flex-row gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden w-full flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="flex items-center gap-2 font-medium">
            <Filter className="w-5 h-5 text-brand" /> Filters
          </button>
          <select value={sort} onChange={e => setSort(e.target.value)} className="bg-transparent border-none font-medium outline-none">
            <option value="newest">Sort by: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Sidebar Filters */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8`}>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Search Products</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
              <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
              Category
              {selectedCat && <button onClick={() => setSelectedCat("")} className="text-xs text-brand hover:underline font-normal">Clear</button>}
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category"
                    checked={selectedCat === cat}
                    onChange={() => setSelectedCat(cat)}
                    className="w-4 h-4 text-brand bg-gray-50 border-gray-300 focus:ring-brand focus:ring-2"
                  />
                  <span className={`text-sm ${selectedCat === cat ? 'text-brand font-medium' : 'text-gray-600 group-hover:text-brand transition'}`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          <div className="hidden md:flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Showing {filtered.length} results {selectedCat && <span>for <strong className="text-gray-900">{selectedCat}</strong></span>}</p>
            <select value={sort} onChange={e => setSort(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-brand">
              <option value="newest">Sort by: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6 max-w-md">We couldn't find any products matching your current filters. Try selecting a different category or clear filters.</p>
              <button onClick={() => { setSearch(""); setSelectedCat(""); }} className="px-6 py-2 bg-brand text-white rounded-full font-medium hover:bg-brand-dark transition">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filtered.map(p => <ProductCard key={p.productId} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
