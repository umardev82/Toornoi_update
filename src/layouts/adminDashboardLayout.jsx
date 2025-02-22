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
import { FaPersonRunning } from "react-icons/fa6";
import { GiAmericanFootballPlayer } from "react-icons/gi";
import useProfile from '../hooks/useProfile';
import { MdPayments } from "react-icons/md";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({});
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile} = useProfile(); 

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    navigate("/");
  };

  const handleDropdownToggle = (menuName) => {
    setDropdowns((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const menuItems = [
    { name: "Home", path: "/dashboard", icon: <RiHome3Fill className="mr-2 w-5 h-5" /> },
    { name: "Messages", path: "/dashboard/messages", icon: <RiMessage2Fill className="mr-2 w-5 h-5" /> },
    {
      name: "Tournaments",
      icon: <HiMiniTrophy className="mr-2 w-5 h-5" />,
      subMenu: [
        { name: "All Tournaments", path: "/dashboard/all-tournaments", icon: <FiChevronsRight className="mr-2 w-5 h-5" /> },
        { name: "Add New Tournament", path: "/dashboard/add-tournament", icon: <FiChevronsRight className="mr-2 w-5 h-5" /> },
      ],
    },
    {
      name: "Athletes",
      icon: <FaPersonRunning className="mr-2 w-5 h-5" />,
      subMenu: [
        { name: "All Athletes", path: "/dashboard/all-athletes", icon: <FiChevronsRight className="mr-2 w-5 h-5" /> },
        { name: "Add New Athlete", path: "/dashboard/add-athlete", icon: <FiChevronsRight className="mr-2 w-5 h-5" /> },
        { name: "Registered Athletes", path: "/dashboard/registered-athletes", icon: <FiChevronsRight className="mr-2 w-5 h-5" /> },
       
      ],
    },
    {
      name: "Matches",
      icon: <GiAmericanFootballPlayer className="mr-2 w-5 h-5" />,
      subMenu: [
        { name: "All Matches", path: "/dashboard/all-matches", icon: <FiChevronsRight className="mr-2 w-5 h-5" /> },
        { name: "Add New Match", path: "/dashboard/add-match", icon: <FiChevronsRight className="mr-2 w-5 h-5" /> },
       
      ],
    },
    { name: "Payments", path: "/dashboard/payments", icon: <MdPayments className="mr-2 w-5 h-5" /> },
    { name: "Profile", path: "/dashboard/profile", icon: <BiSolidUserRectangle className="mr-2 w-5 h-5" /> },
    { name: "Settings", path: "/dashboard/settings", icon: <BiSolidUserRectangle className="mr-2 w-5 h-5" /> },
    { name: "Logout", path: "#", icon: <TbLogout2 className="mr-2 w-5 h-5" />, action: handleLogout },
  ];

  return (
    <div className="flex h-screen bg-(--background)">
      <aside className={`fixed top-0 left-0 bg-(--primary) text-white w-64 p-4 transform z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} transition-transform md:translate-x-0 h-full`}>
        <div className="flex justify-between items-center mb-4 h-20">
          <Link to="/">
          <img src={logo} alt="Logo" /></Link>
          
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="space-y-2 sidebar h-[80vh] overflow-auto pr-2">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.subMenu ? (
                <>
                  <button
                    className={`flex items-center p-3 rounded-md w-full text-left hover:bg-(--secondary) ${dropdowns[item.name] ? "bg-(--secondary)" : ""}`}
                    onClick={() => handleDropdownToggle(item.name)}
                  >
                    {item.icon} {item.name} {dropdowns[item.name] ? <ChevronUp className="ml-auto w-4 h-4" /> : <ChevronDown className="ml-auto w-4 h-4" />}
                  </button>
                  {dropdowns[item.name] && (
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
            <div className="relative">
              <button className="flex items-center gap-2 text-(--textlight)" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <img src={profile?.photo ||profile} alt="Profile" className="w-10 h-10 rounded-full border border-(--border) object-cover" />
               
                <span>{profile?.username || "Admin"}</span> {/* Show username */}
                <ChevronDown className="w-5 h-5 cursor-pointer" />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 text-black">
                  <Link to="/dashboard/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <Link to="/dashboard/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
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

export default AdminDashboardLayout;
