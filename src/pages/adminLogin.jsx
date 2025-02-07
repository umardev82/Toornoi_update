import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from '../hooks/adminAuth';
import logo from "../assets/images/logo.png";
import trophy from "../assets/images/trophy.png";
import { Toaster } from "react-hot-toast";

const AdminLogin = () => {
  const { login, loading } = useAuth(); // Use Auth Hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null); // Local validation
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setLocalError("Please fill in both fields.");
      return;
    }

    // Call the login function from the auth hook
    const result = await login(email, password);

    if (result.success) {
      setTimeout(() => {
        navigate("/dashboard"); 
      }, 2000); 

    }
  };

  return (
    <>
      <Toaster className="capitalize"/>
      <div className="grid lg:grid-cols-2 min-h-screen bg-(--background) items-center">
      <main id="content" className="w-full max-w-md mx-auto py-10">
              <Link to="/" className="header-logo">
                <img src={logo} alt="logo" className="mx-auto block" />
              </Link>
              <div className="p-4 sm:p-7">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-white">Admin Login</h1>
                  <p className="text-(--textlight)">Welcome back! Please enter your details.</p>
                </div>
                <div className="mt-5">
                  <form onSubmit={handleLogin}>
                    <div className="grid gap-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm mb-2 text-(--textlight)">Email</label>
                        <input
                          type="email"
                          id="email"
                          placeholder="Enter your email"
                          className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm mb-2 text-(--textlight)">Password</label>
                        <input
                          type="password"
                          id="password"
                          placeholder="Enter password"
                          className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      {/* Show Error Messages */}
                      {localError && <p className="text-red-500 text-sm">{localError}</p>}

                      <button
                        type="submit"
                        className="py-2 px-3 bg-cyan-600 text-white rounded-sm text-sm hover:bg-cyan-700 transition-all flex items-center justify-center"                       
                      >                       
                          Sign in                        
                      </button>
                    </div>
                  </form>

                 
                
                </div>
              </div>
            </main>

        <div className="hidden lg:block h-full">
        <img src={trophy} alt="logo" className="w-full h-screen object-cover" />
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
