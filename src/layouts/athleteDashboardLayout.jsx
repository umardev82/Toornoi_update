import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { BiSolidUserRectangle } from "react-icons/bi";
import { RiHome3Fill, RiMessage2Fill } from "react-icons/ri";
import { HiMiniTrophy } from "react-icons/hi2";
import { FaBell } from "react-icons/fa";
import profile from "../assets/images/profile.png";
import logo from "../assets/images/logo.png";
import { FiChevronsRight } from "react-icons/fi";
import { TbLogout2 } from "react-icons/tb";
import { GiAmericanFootballPlayer } from "react-icons/gi";



const AthleteDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Clear admin token
    localStorage.removeItem("userToken"); // Clear user token
    navigate("/"); // Redirect to login page
  };

  // 🔹 Tournament Dropdown Handler
  const handleTournamentDropdownToggle = () => {
    setTournamentDropdownOpen(!tournamentDropdownOpen);
  };

  // 🔹 Profile Dropdown Handler
  const handleProfileDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // 🔹 Menu items with submenus
  const menuItems = [
    { name: "All Tournaments", path: "/my-account/tournaments", icon: <RiHome3Fill className="mr-2 w-5 h-5" /> },
    { name: "Matches", path: "/my-account/matches", icon: <GiAmericanFootballPlayer className="mr-2 w-5 h-5" /> },   
   { name: "Profile", path: "/my-account/profile", icon: <BiSolidUserRectangle className="mr-2 w-5 h-5" /> },
    { name: "Settings", path: "/my-account/settings", icon: <BiSolidUserRectangle className="mr-2 w-5 h-5" /> },
    { name: "Logout", path: "#", icon: <TbLogout2 className="mr-2 w-5 h-5" />, action: handleLogout },
  ];

  const handleMenuClick = () => {
    setTournamentDropdownOpen(false);
  };

  return (
    <div className="flex h-screen bg-(--background)" onClick={handleMenuClick}>
      <aside className={`fixed top-0 left-0 bg-(--primary) text-white w-64 p-4 transform z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} transition-transform md:translate-x-0 h-full`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 h-20">
          <img src={logo} alt="Logo" />
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.subMenu ? (
                <>
                  {/* Tournament Dropdown */}
                  <button
                    className={`flex  items-center p-3 rounded-md w-full text-left hover:bg-(--secondary) ${tournamentDropdownOpen ? "bg-(--secondary)" : ""}`}
                    onClick={handleTournamentDropdownToggle}
                  >
                    {item.icon} {item.name} {tournamentDropdownOpen ? <ChevronUp className="ml-auto w-4 h-4" /> : <ChevronDown className="ml-auto w-4 h-4" />}
                  </button>
                  {tournamentDropdownOpen && (
                    <div className="space-y-2 pt-3">
                      {item.subMenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`flex items-center px-4 py-2 rounded-md ${location.pathname === subItem.path ? "bg-(--secondary) text-white" : "hover:bg-(--secondary)"}`}
                        >
                          {subItem.icon} {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div>
                  {/* For Logout menu item, use the action */}
                  {item.name === "Logout" ? (
                    <button
                      onClick={item.action}
                      className="flex items-center p-3 rounded-md w-full text-left hover:bg-(--secondary)"
                    >
                      {item.icon} {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center p-3 rounded-md ${location.pathname === item.path ? "bg-(--secondary) text-white" : "hover:bg-(--secondary)"}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {item.icon} {item.name}
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
      <div className="w-full flex-1 flex flex-col md:pl-64">
        <header className="flex items-center justify-between bg-(--primary) text-white rounded-md p-4 m-4 md:m-6 relative">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="md:block hidden text-xl text-(--textlight)">
            {menuItems.find((item) => item.path === location.pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4 relative">
            <Search className="w-5 h-5 cursor-pointer hidden sm:block text-(--textlight)" />
            <FaBell className="w-5 h-5 cursor-pointer text-(--textwhite)" />
            {/* Profile Dropdown */}
            <div className="relative">
            <button className="flex items-center gap-2 text-(--textlight)" onClick={handleProfileDropdownToggle}>
              <img src={profile} alt="Profile" className="w-10 h-10 rounded-full" />
              <ChevronDown className="w-5 h-5 cursor-pointer" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 text-black">
                <Link to="/my-account/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <Link to="/my-account/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-(--background)">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AthleteDashboardLayout;
