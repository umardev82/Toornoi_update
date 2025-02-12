import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";
import logo from "../assets/images/logo.png";
import trophy from "../assets/images/trophy.png";
import google from "../assets/images/google.png";
import { IoClose } from "react-icons/io5";
import { Toaster } from "react-hot-toast";

const Signup = () => {
  const { signup, loading, popupMessage, popupType, showPopup, setShowPopup } = useSignup();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: "",
    phone_number: "",   
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (localError) {
      setLocalError(null);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Check if all fields are filled
    if (!formData.username || !formData.email || !formData.password || !formData.confirm_password || !formData.date_of_birth || !formData.phone_number) {
      setLocalError("Please fill in all fields.");
      return;
    }

  
    const result = await signup(formData);
    if (result.success) {
      // Handle success
    }
  };
  

  return (
    <>
    
      <div className="grid lg:grid-cols-2 min-h-screen bg-(--background) items-center">
        <main id="content" className="w-full max-w-md mx-auto py-10">
          <Link to="/" className="header-logo">
            <img src={logo} alt="logo" className="mx-auto block" />
          </Link>
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-white">Sign Up</h1>
              <p className="text-(--textlight)">Create your account</p>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSignup} className="space-y-3">
              <label htmlFor="username" className="block text-sm mb-2 text-(--textlight)">Username</label>                  
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="py-2 px-3 bg-(--secondarybg)  rounded-sm text-sm text-(--textlight) w-full"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                     <label htmlFor="email" className="block text-sm mb-2 text-(--textlight)">Email</label>  
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="py-2 px-3 bg-(--secondarybg) w-full rounded-sm text-sm text-(--textlight)"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="password" className="block text-sm mb-2 text-(--textlight)">Password</label>  
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="py-2 px-3 bg-(--secondarybg) w-full rounded-sm text-sm text-(--textlight)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                       <label htmlFor="confirm-password" className="block text-sm mb-2 text-(--textlight)">Confirm Password</label>  
                      <input
                        type="password"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        className="py-2 px-3 bg-(--secondarybg) w-full rounded-sm text-sm text-(--textlight)"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                      />
                        <label htmlFor="date_of_birth" className="block text-sm mb-2 text-(--textlight)">Date Of Birth</label> 
                      <input
                        type="date"
                        name="date_of_birth"
                        className="py-2 px-3 bg-(--secondarybg) w-full rounded-sm text-sm text-(--textlight) min-w-[97%]"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        required
                      />
                         <label htmlFor="phone_number" className="block text-sm mb-2 text-(--textlight)">Phone Number</label> 
                      <input
                        type="text"
                        name="phone_number"
                        placeholder="Phone Number"
                        className="py-2 px-3 bg-(--secondarybg) w-full rounded-sm text-sm text-(--textlight)"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                      />
                           {/* <label htmlFor="device" className="block text-sm mb-2 text-(--textlight)">Device (mobile/desktop)</label> 
                      <input
                        type="text"
                        name="device"
                        placeholder="Device (mobile/desktop)"
                        className="py-2 px-3 bg-(--secondarybg) w-full rounded-sm text-sm text-(--textlight)"
                        value={formData.device}
                        onChange={handleChange}
                        required
                      /> */}
                        

                <button type="submit"
                  className="py-2 px-3 bg-(--accent) text-white w-full rounded-sm text-sm hover:bg-transparent border-(--accent) border transition-all flex items-center justify-center"
                  disabled={loading}>
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>
              {localError && <p className="text-red-500 text-sm mt-2">{localError}</p>}

              <button className="w-full py-2 px-3 bg-(--secondarybg) text-white rounded-sm text-sm mt-3">
                <img src={google} className="w-4 h-4 inline mr-2" alt="google-img" />
                Sign up with Google
              </button>

              <p className="mt-3 text-sm text-center text-(--textlight)">
                Already have an account?
                <Link to="/login" className="text-white font-medium ml-1">Login here</Link>
              </p>
            </div>
          </div>
        </main>

        <div className="hidden lg:block h-full">
          <img src={trophy} alt="logo" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* POPUP MODAL */}
      {showPopup && (
        
      <div className="fixed inset-0 flex items-center pt-6 justify-center bg-black/50 ">

      <div className="relative bg-white p-[50px] rounded-lg shadow-lg md:w-[40%] w-[90%] min-h-[30%] flex items-center justify-center text-center">
        <Toaster/>
        {/* Close button at the top-right */}
        <button 
          onClick={() => setShowPopup(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
        >
          <IoClose size={24} />
        </button>
    
        {/* Popup Message */}
        <p className="mt-2 text-black text-inherit" dangerouslySetInnerHTML={{ __html: popupMessage }} />
      </div>
    </div>
    
      )}
    </>
  );
};

export default Signup;
