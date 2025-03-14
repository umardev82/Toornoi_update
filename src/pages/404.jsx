import React from "react";
import logo from '../assets/images/toornoi-logo.png';
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-(--background) text-center">
      <img src={logo} alt="" className="mb-5 " />
      <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-400 pb-5">
        Oups !
      </h1>
      <h2 className="text-2xl font-semibold mt-4 text-(--textwhite)">404 - PAGE NON TROUVÉE</h2>
      <p className="text-(--textlight) mt-2 max-w-md">
        La page que vous recherchez a peut-être été supprimée, renommée ou est temporairement indisponible.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-(--accent) text-white font-semibold rounded-lg shadow-lg transition"
      >
        RETOUR À L'ACCUEIL
      </Link>
    </div>
  );
};

export default NotFoundPage;
