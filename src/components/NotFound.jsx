import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Leaf } from 'lucide-react';
import Navbar from './Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-16 h-16 text-green-600" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-700">4</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-700">4</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-6xl md:text-8xl font-bold text-green-600 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off into the fields. 
            Let's get you back to the main path.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-primary px-8 py-3 text-lg inline-flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary px-8 py-3 text-lg inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Additional Links */}
          <div className="mt-8 space-y-2">
            <p className="text-gray-600">Or try these pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="text-green-600 hover:text-green-700 font-medium hover:underline"
              >
                Browse Products
              </Link>
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
