import React from 'react'
import logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import trophy from "../assets/images/trophy.png";
const ResetPassword = () => {
  return (
    <>
    <div className="grid lg:grid-cols-2 min-h-screen bg-(--background) items-center">
      <main id="content" className="w-full max-w-md mx-auto py-10">
              <Link to="/" className="header-logo">
                <img src={logo} alt="logo" className="mx-auto block" />
              </Link>
              <div className="p-4 sm:p-7">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-white">Reset Password</h1>
                  <p className="text-(--textlight)">Please enter your password and confirm password.</p>
                </div>
                <div className="mt-5">
                  <form >
                    <div className="grid gap-y-4">
                      <div>
                        <label htmlFor="password" className="block text-sm mb-2 text-(--textlight)">Password</label>
                        <input
                          type="password"
                          id="password"
                          placeholder="Enter your password"
                          className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight)"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm_password" className="block text-sm mb-2 text-(--textlight)">Confirm Password</label>
                        <input
                          type="confirm_password"
                          id="confirm_password"
                          placeholder="Enter your Confirm password"
                          className="py-2 px-3 block w-full bg-(--secondarybg) rounded-sm text-sm text-(--textlight)"
                          required
                        />
                      </div>


                     
                      <button
                        type="submit"
                        className="py-2 px-3 bg-(--accent) text-white w-full rounded-sm text-sm hover:bg-transparent  border-(--accent) border transition-all flex items-center justify-center "                       
                      >                       
                          Reset Password                     
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
  )
}

export default ResetPassword