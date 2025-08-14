import { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, AlertCircle } from 'lucide-react';
import { getAuthHeaders } from '../utils/auth.js';
import toast from 'react-hot-toast';

const AdminProductReview = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/product/pending', {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setPendingProducts(data);
      } else {
        toast.error('Failed to fetch pending products');
      }
    } catch (error) {
      console.error('Error fetching pending products:', error);
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:3001/api/product/${productId}/review`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'approve' })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Product approved successfully!');
        fetchPendingProducts(); // Refresh the list
        setSelectedProduct(null);
      } else {
        toast.error(data.message || 'Failed to approve product');
      }
    } catch (error) {
      console.error('Error approving product:', error);
      toast.error('Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (productId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:3001/api/product/${productId}/review`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          action: 'reject',
          rejectionReason: rejectionReason.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Product rejected successfully');
        fetchPendingProducts(); // Refresh the list
        setSelectedProduct(null);
        setShowRejectModal(false);
        setRejectionReason('');
      } else {
        toast.error(data.message || 'Failed to reject product');
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast.error('Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectModal = (productId) => {
    setSelectedProduct(pendingProducts.find(p => p.product_id === productId));
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedProduct(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Review Queue</h1>
              <p className="text-gray-600">Review and approve/reject pending product submissions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-yellow-800">
                {pendingProducts.length} products pending review
              </span>
            </div>
          </div>
        </div>

        {/* Pending Products List */}
        {pendingProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No pending products</h3>
            <p className="text-gray-600">All product submissions have been reviewed!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingProducts.map((product) => (
              <div key={product.product_id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Product Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.productname}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {product.productname}
                    </h3>
                    {getStatusBadge(product.status)}
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="text-gray-600">{product.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Subcategory:</span>
                      <span className="text-gray-600">{product.subcategory}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="text-green-600 font-semibold">${product.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className="text-gray-600">{product.stock}</span>
                    </div>
                  </div>

                  {/* Submitted By */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-gray-500 mb-1">Submitted by</div>
                    <div className="text-sm font-medium text-gray-700">
                      {product.submittedBy?.firstname} {product.submittedBy?.lastname}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.submittedBy?.email}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(product.submittedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleApprove(product.product_id)}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 rounded-md transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(product.product_id)}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Images</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProduct.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedProduct.productname} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-gray-900">{selectedProduct.productname}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Category:</span>
                        <span className="ml-2 text-gray-900">{selectedProduct.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Subcategory:</span>
                        <span className="ml-2 text-gray-900">{selectedProduct.subcategory}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Price:</span>
                        <span className="ml-2 text-green-600 font-semibold">${selectedProduct.price}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Stock:</span>
                        <span className="ml-2 text-gray-900">{selectedProduct.stock}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700">{selectedProduct.description}</p>
                  </div>

                  {selectedProduct.ingredients?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.ingredients.map((ingredient, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.allergens?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Allergens</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.allergens.map((allergen, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.nutritionalInfo && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutritional Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Calories: {selectedProduct.nutritionalInfo.calories || 'N/A'}</div>
                        <div>Protein: {selectedProduct.nutritionalInfo.protein || 'N/A'}g</div>
                        <div>Carbs: {selectedProduct.nutritionalInfo.carbs || 'N/A'}g</div>
                        <div>Fat: {selectedProduct.nutritionalInfo.fat || 'N/A'}g</div>
                        <div>Fiber: {selectedProduct.nutritionalInfo.fiber || 'N/A'}g</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(selectedProduct.product_id)}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 rounded-lg transition-colors"
                >
                  <Check className="w-5 h-5" />
                  Approve Product
                </button>
                <button
                  onClick={() => openRejectModal(selectedProduct.product_id)}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                  Reject Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Reject Product</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this product. This will help the submitter understand what needs to be changed.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={closeRejectModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedProduct.product_id)}
                disabled={isProcessing || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
              >
                {isProcessing ? 'Rejecting...' : 'Reject Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductReview;
