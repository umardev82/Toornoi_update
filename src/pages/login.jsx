import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSignin from "../hooks/useSignin";
import logo from "../assets/images/toornoi-logo.png";
import trophy from "../assets/images/trophy.png";
// import google from "../assets/images/google.png";
import { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";



const Login = () => {
  const { login, loading } = useSignin(); // Use Auth Hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null); // Local validation
  const [showPassword, setShowPassword] = useState(false);
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
        navigate("/my-account"); 
      }, 2000); 

    }
  };

  return (
    <>
      {/* <Toaster toastOptions={{ duration: 5000 }} /> */}
      <div className="grid lg:grid-cols-2 min-h-screen bg-(--background) items-center">
      <main id="content" className="w-full max-w-md mx-auto py-10">
              <Link to="/" className="header-logo">
                <img src={logo} alt="logo" className="mx-auto block" />
              </Link>
              <div className="p-4 sm:p-7">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-white">Login</h1>
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

                      <div className="relative w-full">
                       <input
        type={showPassword ? "text" : "password"} // Hidden by default
        id="password"
        placeholder="Enter password"
        className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight) pr-10"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
      >
        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>

                      {/* Show Error Messages */}
                      {localError && <p className="text-red-500 text-sm">{localError}</p>}

                      {/* Login Button with Loader */}
                      <button
                        type="submit"
                        className="py-2 px-3 bg-(--accent) text-white w-full rounded-sm text-sm hover:bg-transparent  border-(--accent) border transition-all flex items-center justify-center "                       
                      >                       
                          Sign in                        
                      </button>
                    </div>
                  </form>

                  {/* <button className="w-full py-2 px-3 bg-(--secondarybg) text-white rounded-sm text-sm mt-3">
                    <img src={google} className="w-4 h-4 inline mr-2" alt="google-img" />
                    Sign in with Google
                  </button> */}
                  <div className="flex justify-between items-center">
                  <p className="mt-3 text-sm text-center text-(--textlight)">
                    Don't have an account?
                    <Link to="/signup" className="text-white font-medium ml-1">Sign up here</Link>
                  </p>
                  <p className="mt-3 text-sm text-center text-(--accent)">
                    <Link to="/forgot-password" className="text-(--accent) font-medium ml-1">Forgot Password?</Link>
                  </p></div>
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

export default Login;
