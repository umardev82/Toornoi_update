import logo from '../assets/images/toornoi-logo.png';
import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <>
    		<footer className="section bg-black text-center px-5 py-16">
						<div>
							<img src={logo} alt="" className="mx-auto mb-5" />
							<p className="text-white mb-8">Plongez dans des combats palpitants et affrontez les meilleurs pour remporter la victoire sur <br/>
							Toornoi.com dès aujourd'hui !</p>
						</div>
						<hr className=" border-neutral-600 "/>
						<div className="container flex flex-row flex-wrap items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 py-8">
							<p className="text-center text-white">© 2024 Toornoi.com | Tous droits réservés. </p>
							<div className="flex flex-wrap items-center gap-x-4 text-white sm:justify-end justify-center flex-row">
								<Link to="/cookies-policy">Politique relative aux cookies</Link>
								<Link to="/terms-and-conditions">Conditions générales d'utilisation</Link>
								<Link to="/legal-information">Mentions légales</Link>
								<Link to="/contact-us">Contact</Link>
							</div>
						</div>
					</footer>

    </>
  )
}

export default FooterSection;