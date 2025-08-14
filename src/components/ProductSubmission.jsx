import { useState, useRef } from 'react';
import { Upload, Plus, X, Save, AlertCircle } from 'lucide-react';
import { isAuthenticated, getCurrentUser, getAuthHeaders, redirectToLogin } from '../utils/auth.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProductSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [ingredients, setIngredients] = useState(['']);
  const [allergens, setAllergens] = useState(['']);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [submitAttempts, setSubmitAttempts] = useState(0);

  const [formData, setFormData] = useState({
    productname: '',
    altName: '',
    description: '',
    labelledPrice: '',
    price: '',
    stock: '',
    category: '',
    subcategory: '',
    organicCertification: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset subcategory when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        subcategory: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (selectedImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select valid image files');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, '']);
  };

  const removeIngredient = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, value) => {
    setIngredients(prev => prev.map((item, i) => i === index ? value : item));
  };

  const addAllergen = () => {
    setAllergens(prev => [...prev, '']);
  };

  const removeAllergen = (index) => {
    setAllergens(prev => prev.filter((_, i) => i !== index));
  };

  const updateAllergen = (index, value) => {
    setAllergens(prev => prev.map((item, i) => i === index ? value : item));
  };

  const uploadImagesToServer = async (files) => {
    // For now, we'll use base64 conversion
    // In production, you'd upload to a cloud service
    const imageUrls = [];
    
    for (const file of files) {
      const reader = new FileReader();
      const imageUrl = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      imageUrls.push(imageUrl);
    }
    
    return imageUrls;
  };

  const resetForm = () => {
    setFormData({
      productname: '',
      altName: '',
      description: '',
      labelledPrice: '',
      price: '',
      stock: '',
      category: '',
      subcategory: '',
      organicCertification: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: ''
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setIngredients(['']);
    setAllergens(['']);
    setIsSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug logging
    console.log('=== PRODUCT SUBMISSION DEBUG ===');
    console.log('Submit attempt:', submitAttempts + 1);
    setSubmitAttempts(prev => prev + 1);
    
    if (!isAuthenticated()) {
      toast.error('Please login to submit products');
      redirectToLogin();
      return;
    }

    // Validation
    const requiredFields = ['productname', 'description', 'category', 'subcategory', 'labelledPrice', 'price', 'stock'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields: Product Name, Description, Category, Subcategory, Labelled Price, Price, and Stock');
      return;
    }

    if (selectedImages.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    // Validate numeric fields
    if (isNaN(parseFloat(formData.labelledPrice)) || parseFloat(formData.labelledPrice) <= 0) {
      toast.error('Please enter a valid labelled price');
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) <= 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    setIsLoading(true);

    try {
      // Upload images
      const imageUrls = await uploadImagesToServer(selectedImages);
      
      console.log('Images uploaded:', imageUrls.length);
      console.log('Current user:', getCurrentUser());

      // Prepare submission data
      const submissionData = {
        ...formData,
        images: imageUrls,
        labelledPrice: parseFloat(formData.labelledPrice),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        ingredients: ingredients.filter(ing => ing.trim() !== ''),
        allergens: allergens.filter(all => all.trim() !== ''),
        // Send nutritional info as separate fields to match Product model
        calories: formData.calories ? parseFloat(formData.calories) : undefined,
        protein: formData.protein ? parseFloat(formData.protein) : undefined,
        carbs: formData.carbs ? parseFloat(formData.carbs) : undefined,
        fat: formData.fat ? parseFloat(formData.fat) : undefined,
        fiber: formData.fiber ? parseFloat(formData.fiber) : undefined
      };

      console.log('Submission data prepared:', submissionData);
      
      console.log('Submitting product data:', submissionData);
      console.log('Auth headers:', getAuthHeaders());

      const response = await fetch('http://localhost:3001/api/product/submit', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(submissionData)
      });

      console.log('Response received. Status:', response.status);
      console.log('Submission response status:', response.status);
      console.log('Submission response headers:', response.headers);

      const data = await response.json();
      console.log('Submission response data:', data);

      if (response.ok) {
        console.log('✅ Submission successful!');
        toast.success('✅ Product submitted successfully! Admin will review and approve it soon.');
        setIsSubmitted(true);
        // Don't reset form immediately, let user see success message
      } else {
        toast.error(data.message || 'Failed to submit product');
      }
    } catch (error) {
      console.error('❌ Submission failed with error:', error);
      console.error('Submission error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit New Product</h1>
          <p className="text-gray-600">Submit your organic product for admin review and approval</p>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Product Submitted Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your product has been submitted and is now under admin review.</p>
                  <p className="mt-1">You will be notified once it's approved and published.</p>
                  <p className="mt-2 text-xs text-green-600">
                    💡 <strong>Next Steps:</strong> Admin will review your product in the admin panel and either approve or reject it.
                  </p>
                  <p className="mt-2 text-xs text-green-600">
                    💡 <strong>Tip:</strong> You can check your submitted products in your profile or contact admin for status updates.
                  </p>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-green-400 hover:text-green-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="productname"
                    value={formData.productname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternative Name
                  </label>
                  <input
                    type="text"
                    name="altName"
                    value={formData.altName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category & Classification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {Object.keys(productCategories).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory *
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    disabled={!formData.category}
                  >
                    <option value="">Select Subcategory</option>
                    {formData.category && productCategories[formData.category]?.map(subcategory => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Stock</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Labelled Price *
                  </label>
                  <input
                    type="number"
                    name="labelledPrice"
                    value={formData.labelledPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images *</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Images
                  </button>
                  <span className="text-sm text-gray-500">Maximum 5 images, 5MB each</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      placeholder="Enter ingredient"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Ingredient
                </button>
              </div>
            </div>

            {/* Allergens */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergens</h3>
              <div className="space-y-3">
                {allergens.map((allergen, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={allergen}
                      onChange={(e) => updateAllergen(index, e.target.value)}
                      placeholder="Enter allergen"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {allergens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAllergen(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAllergen}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Allergen
                </button>
              </div>
            </div>

            {/* Nutritional Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutritional Information (per serving)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
                  <input
                    type="number"
                    name="fat"
                    value={formData.fat}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiber (g)</label>
                  <input
                    type="number"
                    name="fiber"
                    value={formData.fiber}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organic Certification
                </label>
                <input
                  type="text"
                  name="organicCertification"
                  value={formData.organicCertification}
                  onChange={handleInputChange}
                  placeholder="e.g., USDA Organic, EU Organic"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Submission Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Submission Process</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Step 1:</strong> Submit your product using this form<br/>
                    <strong>Step 2:</strong> Admin will review and approve/reject your product<br/>
                    <strong>Step 3:</strong> Once approved, your product will be published on the website<br/>
                    <strong>Step 4:</strong> You'll be notified of the approval status
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              {isSubmitted && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Submit Another Product
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || isSubmitted}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Submit Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductSubmission;
