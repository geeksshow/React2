import { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  FileText, 
  TrendingUp, 
  Settings,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingProducts: 0
  });

  // Product management states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    stock: '',
    image: ''
  });

  // Order management states
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch users
      const usersResponse = await fetch('http://localhost:3001/api/user/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
        setStats(prev => ({ ...prev, totalUsers: usersData.users?.length || 0 }));
      }

      // Fetch products
      const productsResponse = await fetch('http://localhost:3001/api/product/all');
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);
        setStats(prev => ({ ...prev, totalProducts: productsData.products?.length || 0 }));
      }

      // Fetch pending products
      const pendingResponse = await fetch('http://localhost:3001/api/product/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingProducts(pendingData || []);
        setStats(prev => ({ ...prev, pendingProducts: pendingData?.length || 0 }));
      }

      // Fetch orders
      const ordersResponse = await fetch('http://localhost:3001/api/order/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
        setStats(prev => ({ ...prev, totalOrders: ordersData.orders?.length || 0 }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/user/${action}/${userId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          [action === 'block' ? 'isBlocked' : 'role']: action === 'block' ? true : 'admin'
        })
      });

      if (response.ok) {
        toast.success(`User ${action === 'block' ? 'blocked' : 'promoted'} successfully`);
        fetchDashboardData();
      } else {
        toast.error(`Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleProductAction = async (productId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/product/${productId}/review`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        toast.success(`Product ${action}ed successfully`);
        fetchDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || `Failed to ${action} product`);
      }
    } catch (error) {
      console.error(`Error ${action}ing product:`, error);
      toast.error(`Failed to ${action} product`);
    }
  };

  // Product CRUD functions
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/product/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          status: 'approved' // Admin products are auto-approved
        })
      });

      if (response.ok) {
        toast.success('Product added successfully!');
        setShowAddProduct(false);
        resetProductForm();
        fetchDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/product/update/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock)
        })
      });

      if (response.ok) {
        toast.success('Product updated successfully!');
        setEditingProduct(null);
        resetProductForm();
        fetchDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/product/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Product deleted successfully!');
        fetchDashboardData();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/order/update-status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success('Order status updated successfully!');
        setEditingOrder(null);
        fetchDashboardData();
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      stock: '',
      image: ''
    });
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      stock: product.stock || '',
      image: product.image || ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-full">
            <ShoppingCart className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 bg-yellow-100 rounded-full">
            <FileText className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingProducts}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">User Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.img || '/default-avatar.png'} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstname} {user.lastname}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleUserAction(user._id, 'promote')}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Promote to Admin"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleUserAction(user._id, user.isBlocked ? 'unblock' : 'block')}
                      className={user.isBlocked ? "text-green-600 hover:text-green-900" : "text-red-600 hover:text-red-900"}
                      title={user.isBlocked ? "Unblock User" : "Block User"}
                    >
                      {user.isBlocked ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Product Management</h3>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center">
                     <div className="flex-shrink-0 h-10 w-10">
                       <img className="h-10 w-10 rounded-full object-cover" src={product.images?.[0] || '/default-product.png'} alt="" />
                     </div>
                     <div className="ml-4">
                       <div className="text-sm font-medium text-gray-900">{product.productname}</div>
                       <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                     </div>
                   </div>
                 </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditProduct(product)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPendingProducts = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Pending Product Approvals</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={product.images?.[0] || '/default-product.png'} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.productname}</div>
                      <div className="text-sm text-gray-500">${product.price}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.submittedBy?.email || 'Unknown'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                      onClick={() => handleProductAction(product._id, 'approve')}
                      onClick={() => handleProductAction(product._id, 'approve')}
                      className="text-green-600 hover:text-green-900"
                      title="Approve Product"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openRejectModal(product._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Reject Product"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Order Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.slice(-6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user?.email || 'Unknown'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingOrder === order._id ? (
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingOrder === order._id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingOrder(null)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Cancel Edit"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingOrder(order._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Status"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Product Form Modal
  const renderProductForm = () => {
    const isEditing = !!editingProduct;
    const title = isEditing ? 'Edit Product' : 'Add New Product';
    const submitText = isEditing ? 'Update Product' : 'Add Product';
    const onSubmit = isEditing ? handleEditProduct : handleAddProduct;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
                resetProductForm();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Fertilizers">Fertilizers</option>
                  <option value="Pesticides">Pesticides</option>
                  <option value="Tools">Tools</option>
                  <option value="Machinery">Machinery</option>
                  <option value="Organic Products">Organic Products</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <input
                  type="text"
                  value={productForm.subcategory}
                  onChange={(e) => setProductForm({...productForm, subcategory: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={productForm.image}
                onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                  resetProductForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{submitText}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'pending', name: 'Pending', icon: FileText },
              { id: 'orders', name: 'Orders', icon: ShoppingCart },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'pending' && renderPendingProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
            <p className="text-gray-600">Settings configuration will be available here.</p>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {(showAddProduct || editingProduct) && renderProductForm()}
    </div>
  );
};

export default AdminDashboard;
