import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";

const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Forgot Password
  const forgotPassword = async (email) => {
    setLoading(true);
    let toastId = toast.loading("Sending reset link...");

    try {
      await axios.post(`${API_BASE_URL}/loge/forgot-password/`, { email });
      toast.success("Reset link sent! Check your email.", { id: toastId });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong. Try again!";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  const resetPassword = async (password, confirmPassword, token) => {
    setLoading(true);
    setError(null);

    let toastId = toast.loading("Resetting password...");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/loge/reset-password/?token=${token}`,
        { new_password: password, confirm_password: confirmPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Password reset successful! Redirecting...", { id: toastId });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Password reset failed! Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return { forgotPassword, resetPassword, loading, error };
};

export default usePasswordReset;
