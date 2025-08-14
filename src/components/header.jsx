import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="w-full h-[80px] shadow-2xl flex items-center px-4 md:px-10 bg-white relative">
      
      {/* Logo (Left) */}
      <div className="w-[20%] flex items-center">
        <img
          onClick={() => navigate("/")}
          src="/logo.jpg"
          alt="logo"
          className="w-[60px] h-[60px] object-cover cursor-pointer rounded-full"
        />
      </div>

      {/* Center Navigation Links */}
      <nav className="hidden md:flex w-[60%] justify-center gap-8 text-black-600 font-bold">
        <Link to="/" className="hover:text-red-400 transition">Home</Link>
        <Link to="/products" className="hover:text-red-400 transition">Products</Link>
        <Link to="/about" className="hover:text-red-400 transition">About</Link>
        <Link to="/contact" className="hover:text-red-400 transition">Contact</Link>
      </nav>

      {/* Login Button (Right) */}
      <div className="w-[20%] flex justify-end">
        <Link
          to="/login"
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
