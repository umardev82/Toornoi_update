import { useEffect, useState } from "react";
import AppRoutes from "./routes/appRoutes";
import English from "../src/assets/images/english.png";
import French from "../src/assets/images/france.png";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaWhatsappSquare } from "react-icons/fa";
import { Toaster } from "react-hot-toast";


function App() {





  return (
    <>
    <Toaster  />
      <AppRoutes />

      {/* Google Translate Element */}
     
      <a href="https://wa.me/+33749805660" target="_blank">
      <FaWhatsappSquare  className="text-[#21C063] text-5xl fixed right-[50px] bottom-[20px] w-auto bg-white rounded "/>
     </a>
   
    
    </>
  );
}

export default App;