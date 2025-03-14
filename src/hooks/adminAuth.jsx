import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    // Promise wrapped with toast.promise for success and error handling
    const loginPromise = axios.post(
      `${API_BASE_URL}/loge/superadmin/login/`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    // Displaying the toast promise for success and error handling
    return toast.promise(loginPromise, {
      loading: "Connexion...",
      success: (data) => {
        console.log("Login successful, response data:", data);
        const token = data.data.token;
        localStorage.removeItem("userToken"); 
        localStorage.setItem("adminToken", token); // Store token

        return "Connexion réussie!";
      },
      error: (err) => {
        setError(err.response?.data?.detail || "Identifiants non valides. Réessayez.");
        return err.response?.data?.detail || "La connexion a échoué!";
      },
    }).then((result) => {
      // Return the result from the toast promise
      return { success: true, token: result.data.token };
    }).catch((err) => {
      // Return error info in case of failure
      return { success: false, error: err.response?.data?.detail };
    }).finally(() => {
      setLoading(false);
    });
  };

  return { login, loading, error };
};

export default useAuth;
