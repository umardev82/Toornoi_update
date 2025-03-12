import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";

const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to extract error messages properly
  const extractErrorMessage = (error) => {
    let errorMessage = "Something went wrong. Try again!";
    
    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (typeof error.response.data === "object") {
        // Extract error message from the first key in the response object
        const firstKey = Object.keys(error.response.data)[0];
        if (Array.isArray(error.response.data[firstKey])) {
          errorMessage = error.response.data[firstKey].join(" ");
        } else {
          errorMessage = error.response.data[firstKey];
        }
      }
    }
    
    return errorMessage;
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    setLoading(true);
    let toastId = toast.loading("Sending reset link...");

    try {
      await axios.post(`${API_BASE_URL}/loge/forgot-password/`, { email });
      toast.success("Reset link sent! Check your email.", { id: toastId });
      return { success: true };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
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
      const errorMessage = extractErrorMessage(error);
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
