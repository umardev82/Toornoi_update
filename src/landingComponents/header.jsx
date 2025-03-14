import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/images/toornoi-logo.png";


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
        <Link to="/" className="text-xl font-bold flex items-center space-x-2">
          <img src={logo} alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 bg-black/70 p-5 rounded-full">
            <Link to="/">Accueil</Link>
            <Link to="/all-tournaments">Tous les tournois</Link>
            <Link to="/contact-us">Contact</Link>
         
           
        </nav>

        {/* Conditional Buttons */}
        {adminToken ? (
          <Link to="/dashboard" className="bg-white text-black p-3 py-2 sm:px-6 rounded-lg shadow">
            Tableau de bord
          </Link>
        ) : userToken ? (
          <Link to="/my-account" className="bg-white text-black p-3 py-2 sm:px-6 rounded-lg shadow">
            Mon compte
          </Link>
        ) : (
          <Link to="/login" className="bg-white text-black p-3 py-2 sm:px-6 rounded-lg shadow">
            Se connecter
          </Link>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-start space-y-4 p-5 shadow-md md:hidden">
            <Link to="/">Accueil</Link>
            <Link to="/all-tournaments">Tous les tournois</Link>
            <Link to="/contact-us">Contact</Link>
         
           
          </nav>
        )}
      </header>
    </div>
  );
}
