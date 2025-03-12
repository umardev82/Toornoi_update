import logo from '../assets/images/toornoi-logo.png';
import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <>
    		<footer className="section bg-black text-center px-5 py-16">
						<div>
							<img src={logo} alt="" className="mx-auto mb-5" />
							<p className="text-white mb-8">Immerse yourself in adrenaline-pumping battles and compete against the best to claim your victory on <br/> Toonoi.com today!</p>
						</div>
						<hr className=" border-neutral-600 "/>
						<div className="container flex flex-row flex-wrap items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 py-8">
							<p className="text-center text-white">© 2024 Toonoi.com | All rights reserved. </p>
							<div className="flex flex-wrap items-center gap-x-4 text-white sm:justify-end justify-center flex-row">
								<Link to="/cookies-policy">Cookies Policy</Link>
								<Link to="/terms-and-conditions">Terms and Conditions of Use</Link>
								<Link to="/legal-information">Legal Information</Link>
								<Link to="/contact-us">Contact</Link>
							</div>
						</div>
					</footer>

    </>
  )
}

export default FooterSection;