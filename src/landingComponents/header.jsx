import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    // Check if userToken or adminToken exists in localStorage
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");
    
    setUserToken(userToken);
    setAdminToken(adminToken);
  }, []);

  return (
    <div className="md:bg-transparent bg-black mx-auto md:-mb-28">
      <header className="bg-transparent container mx-auto text-white flex items-center sm:px-0 p-5 justify-between">
        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="text-xl font-bold flex items-center space-x-2">
          <img src={logo} alt="Logo" />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 bg-black/70 p-5 rounded-full">
          <a href="#">Products</a>
          <a href="#">Solutions</a>
          <a href="#">Showcase</a>
          <a href="#">Pricing</a>
          <a href="#">Resources</a>
        </nav>

        {/* Conditional Buttons */}
        {adminToken ? (
          <Link to="/dashboard" className="bg-white text-black p-3 py-2 sm:px-6 rounded-lg shadow">
            Admin Dashboard
          </Link>
        ) : userToken ? (
          <Link to="/my-account" className="bg-white text-black p-3 py-2 sm:px-6 rounded-lg shadow">
            My Account
          </Link>
        ) : (
          <Link to="/login" className="bg-white text-black p-3 py-2 sm:px-6 rounded-lg shadow">
            Login
          </Link>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-start space-y-4 p-5 shadow-md md:hidden">
            <a href="#">Products</a>
            <a href="#">Solutions</a>
            <a href="#">Showcase</a>
            <a href="#">Pricing</a>
            <a href="#">Resources</a>
          </nav>
        )}
      </header>
    </div>
  );
}
