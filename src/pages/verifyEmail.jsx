import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import logo from "../assets/images/toornoi-logo.png";
import API_BASE_URL from "../config";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const [isVerified, setIsVerified] = useState(false); // Track verification status
  const hasFetched = useRef(false); // Prevent duplicate requests

  useEffect(() => {
    if (hasFetched.current) return; // Prevent second call
    hasFetched.current = true; // Mark as called

    const token = searchParams.get("token");
    console.log("Extracted Token:", token);

    if (!token) {
      setMessage("❌ No token found in URL.");
      return;
    }

    fetch(`${API_BASE_URL}/loge/verify-email/?token=${token}`)
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data);
        if (data.message) {
          setMessage("✅ Your account has been verified!");
          setIsVerified(true); // Set verification success
        } else {
          setMessage("❌ " + data.error);
        }
      })
      .catch(() => setMessage("❌ An error occurred. Please try again."));
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black p-5">
      <img src={logo} alt="Logo" className="mb-10" />
      <div className="py-7 md:px-14 px-5 text-center text-(--textwhite) border border-(--border) rounded bg-(--primary)">
        <h2 className="text-xl lemon-milk-font mb-3">Email Verification</h2>
        <p>{message}</p>

        
        {isVerified && (
          <Link to="/login">
            <button className="mt-5 px-5 py-2 bg-(--accent) text-white rounded  transition">
              Go to Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
