import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPage from './pages/adminpage';
import NotFound from './components/NotFound';
import UserProfile from './components/UserProfile';
import Cart from './components/Cart';
import ProductSubmission from './components/ProductSubmission';
import MyOrders from './components/MyOrders';
import OTPLogin from './components/OTPLogin';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Toaster position="top-center" />

        <Routes path="/*">
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/submit-product" element={<ProductSubmission />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp-login" element={<OTPLogin />} />
          <Route path="/adminpage/*" element={<AdminPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<MyOrders />} />

          <Route path="/*" element={<NotFound />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


