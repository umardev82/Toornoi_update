import Header from "../landingComponents/header";
import FooterSection from "../landingComponents/footerSection";


const LandingLayout = ({ children }) => {
    return (
        <div>
           <Header/>
            <main>{children}</main>
            <FooterSection/>
            
        </div>
    );
};

export default LandingLayout;