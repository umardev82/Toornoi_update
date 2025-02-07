import logo from '../assets/images/logo.png';

const FooterSection = () => {
  return (
    <>
    		<footer className="section bg-black text-center px-5 py-16">
						<div>
							<img src={logo} alt="" className="mx-auto mb-5" />
							<p className="text-white mb-8">Immerse yourself in adrenaline-pumping battles and compete against the best to claim your victory on <br/> Tournaments.com today!</p>
						</div>
						<hr className=" border-neutral-600 "/>
						<div className="container flex flex-row flex-wrap items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 py-8">
							<p className="text-center text-white">© 2024 Tournaments.com | All rights reserved. </p>
							<div className="flex flex-wrap items-center gap-x-4 text-white sm:justify-end justify-center flex-row">
								<p>Tournaments</p>
								<p>Subscriptions</p>
								<p>News</p>
								<p>Discord</p>
							</div>
						</div>
					</footer>

    </>
  )
}

export default FooterSection;