import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";

const useSignin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    let toastId = toast.loading("Logging in...");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/loge/login/`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = response.data.token;
      localStorage.removeItem("adminToken");
      localStorage.setItem("userToken", token); // Store token

      toast.success("Login Successful!", { id: toastId });

      return { success: true, token };
    } catch (error) {
      const errorMessage =
        error.response?.data?.non_field_errors?.[0] ||  // Extracts "Invalid email or password."
        error.response?.data?.detail || 
        "Login failed! Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useSignin;
