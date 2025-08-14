import { useState } from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { isAuthenticated, getCurrentUser, getAuthHeaders } from '../utils/auth.js';
import toast from 'react-hot-toast';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch('http://localhost:3001/api/cart/add', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Item added to cart successfully!');
        // Trigger cart count update in navbar (you can implement a global state or event system)
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        toast.error(data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center space-x-6">
          {/* Product Image */}
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                {product.name}
              </h3>
              <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                {product.subcategory}
              </span>
            </div>

            <p className="text-gray-700 text-sm mb-2">
              <span className="font-medium">{product.category}</span>
            </p>

            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  ${product.price}
                </span>
                {!product.inStock && (
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className={`p-2 rounded-lg transition-colors ${
                    product.inStock 
                      ? 'text-gray-600 hover:text-green-600 hover:bg-green-50' 
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isAddingToCart ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Product Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full ml-2">
            {product.subcategory}
          </span>
        </div>

        <p className="text-gray-700 text-sm mb-2">
          <span className="font-medium">{product.category}</span>
        </p>

        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              ${product.price}
            </span>
            {!product.inStock && (
              <span className="text-sm text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Eye className="w-5 h-5" />
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className={`p-2 rounded-lg transition-colors ${
                product.inStock 
                  ? 'text-gray-600 hover:text-green-600 hover:bg-green-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
