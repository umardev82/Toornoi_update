import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import trophy from "../assets/images/trophy.png";
import { Toaster } from "react-hot-toast";
import usePasswordReset from "../hooks/usePasswordReset";

const ResetPassword = () => {
  const { resetPassword, loading } = usePasswordReset();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Get token from URL or fallback to localStorage
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    const storedToken = localStorage.getItem("resetToken");
  
    console.log("Token from URL:", urlToken);
    console.log("Token from localStorage:", storedToken);
  
    setToken(urlToken || storedToken);
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Reset Password Token:", token); // Debugging the token
  
    if (!token) {
      toast.error("Reset token is missing!");
      return;
    }
  
    const result = await resetPassword(password, confirmPassword, token);
    if (result.success) {
      localStorage.removeItem("resetToken"); // Clear token after use
      setTimeout(() => navigate("/login"), 2000);
    }
  };
  

  return (
    <>
      <Toaster />
      <div className="grid lg:grid-cols-2 min-h-screen bg-(--background) items-center">
        <main className="w-full max-w-md mx-auto p-4 sm:p-7">
          <Link to="/" className="header-logo ">
            <img src={logo} alt="logo" className="mx-auto block mb-4" />
          </Link>
          <div className="">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-white">Reset Password</h1>
              <p className="text-(--textlight)">Enter your new password.</p>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-(--textlight)">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-(--textlight)">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight)"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2 px-3 bg-(--accent) text-white w-full rounded-sm text-sm hover:bg-transparent border-(--accent) border transition-all flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
