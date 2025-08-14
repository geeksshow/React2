import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Star, ShoppingCart, Eye, ChevronDown, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getCurrentUser, getAuthHeaders } from '../utils/auth.js';
import { Link } from 'react-router-dom';
import ProductCard from '../components/productCard.jsx';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Organic Product Categories and Subcategories
  const productCategories = {
    'Organic Tea & Beverages': [
      'Ceylon Tea',
      'Cocktail Garnish', 
      'Coconut Water',
      'Herbal Infusions'
    ],
    'Organic Sweeteners': [
      'Sugars',
      'Syrups'
    ],
    'Organic Snacks, Fruits & Nuts': [
      'Cashews',
      'Coconut Chips',
      'Coconut Clusters',
      'Coconut Crunch',
      'Coconut Rolls',
      'Crackers',
      'Dehydrated Fruits',
      'Other'
    ],
    'Organic Grains, Beans & Pulses': [
      'Grains',
      'Legumes',
      'Rice'
    ],
    'Organic Pantry & Kitchen': [
      'Brine Solutions',
      'Coconut Cream',
      'Coconut Milk',
      'Coconut Milk - Simmer Sauces',
      'Coconut Oil',
      'Cooking Oils',
      'Desiccated',
      'Flour'
    ],
    'Organic Spices, Herbs & Seasonings': [
      'Herbs',
      'Seasonings',
      'Spices'
    ],
    'Organic Plant-Based Dairy Alternatives': [
      'Coconut Whipping Cream',
      'Condensed Coconut Milk'
    ],
    'Organic Condiments & Sauces': [
      'Coconut Aminos',
      'Jam',
      'Pastes',
      'Sauces/Marinades'
    ],
    'Fresh': [
      'Fruits',
      'Vegetables'
    ],
    'Organic Superfoods & Supplements': [
      'Coconut Latte',
      'MCT Oil',
      'Seeds',
      'Veg Powders'
    ],
    'Organic Ready Meals': [
      'Jackfruit Ready Meals'
    ]
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/product');
      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match frontend format
        const transformedProducts = data.map(product => ({
          _id: product._id,
          id: product.product_id,
          name: product.productname,
          category: product.category || 'General',
          subcategory: product.subcategory || 'Other',
          price: product.price,
          rating: 4.5, // Default rating since backend doesn't have this yet
          reviews: Math.floor(Math.random() * 200) + 50, // Random reviews for now
          image: product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image',
          description: product.description,
          inStock: product.isAvailable && product.stock > 0
        }));
        setProducts(transformedProducts);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Organic Products
              </h1>
              <p className="text-lg text-gray-700">
                Discover our comprehensive range of organic agricultural products and natural solutions
              </p>
            </div>
            
            {/* Submit Product Button for logged-in users */}
            {getCurrentUser() && (
              <Link
                to="/submit-product"
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Submit Product
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('all');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  {Object.keys(productCategories).map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter */}
              {selectedCategory !== 'all' && (
                <div className="mb-4">
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Subcategories</option>
                    {productCategories[selectedCategory]?.map(subcategory => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort */}
              <div className="mb-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4 mx-auto" />
                </button>
              </div>

              {/* Category Tree */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Browse Categories</h4>
                <div className="space-y-2">
                  {Object.entries(productCategories).map(([category, subcategories]) => (
                    <div key={category} className="border border-gray-200 rounded-md">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                      >
                        {category}
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${
                            expandedCategories.has(category) ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedCategories.has(category) && (
                        <div className="px-3 pb-2 space-y-1">
                          {subcategories.map(subcategory => (
                            <button
                              key={subcategory}
                              onClick={() => {
                                setSelectedCategory(category);
                                setSelectedSubcategory(subcategory);
                              }}
                              className="block w-full text-left text-xs text-gray-600 hover:text-green-600 py-1"
                            >
                              {subcategory}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {sortedProducts.map(product => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {sortedProducts.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg mt-8">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {sortedProducts.length} of {products.length} products
                    </p>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary px-3 py-2 text-sm">Previous</button>
                      <span className="px-3 py-2 text-sm text-gray-700">1</span>
                      <button className="btn-secondary px-3 py-2 text-sm">Next</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
