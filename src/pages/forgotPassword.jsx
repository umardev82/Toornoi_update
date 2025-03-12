import React, { useState } from "react";
import logo from "../assets/images/toornoi-logo.png";
import { Link } from "react-router-dom";
import trophy from "../assets/images/trophy.png";
import { Toaster } from "react-hot-toast";
import usePasswordReset from "../hooks/usePasswordReset";

const ForgotPassword = () => {
  const { forgotPassword, loading } = usePasswordReset();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <>
      {/* <Toaster toastOptions={{ duration: 5000 }} /> */}
      <div className="grid lg:grid-cols-2 min-h-screen bg-(--background) items-center">
        <main className="w-full max-w-md mx-auto py-10">
          <Link to="/" className="header-logo">
            <img src={logo} alt="logo" className="mx-auto block" />
          </Link>
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-white">Forgot Your Password?</h1>
              <p className="text-(--textlight)">Enter your email and we'll send a reset link.</p>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-(--textlight)">Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2 px-3 bg-(--accent) text-white w-full rounded-sm text-sm hover:bg-transparent border-(--accent) border transition-all flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Submit"}
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

export default ForgotPassword;
