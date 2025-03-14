import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import logo from "../assets/images/toornoi-logo.png";
import API_BASE_URL from "../config";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Vérification en cours...");
  const [isVerified, setIsVerified] = useState(false); 
  const hasFetched = useRef(false); 
  useEffect(() => {
    if (hasFetched.current) return; 
    hasFetched.current = true; 
    const token = searchParams.get("token");
    console.log("Jeton extrait :", token);

    if (!token) {
      setMessage("❌ Aucun jeton trouvé dans l'URL.");
      return;
    }

    fetch(`${API_BASE_URL}/loge/verify-email/?token=${token}`)
      .then(res => res.json())
      .then(data => {
        console.log("Réponse de l'API :", data);
        if (data.message) {
          setMessage("✅ Votre compte a été vérifié !");
          setIsVerified(true); 
        } else {
          setMessage("❌ " + data.error);
        }
      })
      .catch(() => setMessage("❌ Une erreur s'est produite. Veuillez réessayer."));
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black p-5">
      <img src={logo} alt="Logo" className="mb-10" />
      <div className="py-7 md:px-14 px-5 text-center text-(--textwhite) border border-(--border) rounded bg-(--primary)">
        <h2 className="text-xl lemon-milk-font mb-3">Vérification de l'e-mail</h2>
        <p>{message}</p>

        {isVerified && (
          <Link to="/login">
            <button className="mt-5 px-5 py-2 bg-(--accent) text-white rounded transition">
              Aller à la connexion
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
