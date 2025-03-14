import trophy from '../assets/images/toornoi-trophy.png';
import frame from '../assets/images/Frame.png';
import game from '../assets/images/game.png';
import rocket from '../assets/images/rocket.png';
import participants from '../assets/images/participants.png';
import prizes from '../assets/images/prizes.png';
import features from '../assets/images/athlete-overview.png';
import opponentChat from '../assets/images/athlete-chat.png';
import communityImg from '../assets/images/community.png';
import gloryImg from '../assets/images/glory-img.png';
import { Link } from 'react-router-dom';
import FeaturedTournaments from './featuredTournaments';

const Hero = () => {
  return (
    <>
    
    <div className="landing-wrapper flex sm:items-end items-center py-24 px-5 h-screen">
						<div className="container mx-auto">
							<div className="grid md:grid-cols-2  gap-6">
								<div className=" my-auto">
									<div className="landing-content">
										
											<h1 className="text-white sm:text-4xl text-3xl sm:text-left text-center lemon-milk-font font-semibold lemon-milk-font mb-5">Rejoignez la meilleure plateforme de tournoi E-gaming </h1>
										<div className="flex flex-row justify-start  items-center gap-x-3 mb-2">
											<img src={frame} alt="" />
											<p className='text-white'>Participez à plusieurs tournois</p>
										</div>
										<div className="flex flex-row justify-start  items-center gap-x-3 mb-2">
											<img src={frame} alt="" />
											<p className='text-white'>Gérez vos statistiques et vos matchs via votre compte</p>
										</div>
										<div className="flex flex-row justify-start  items-center gap-x-3 mb-5">
											<img src={frame} alt="" />
											<p className='text-white'>Gagnez des prix exclusifs</p>
										</div>
									
										<div className="mt-10 flex gap-3 sm:justify-start justify-center sm:space-x-2  rtl:space-x-reverse">
											
											<Link to="/login" className="py-3 px-5 btn bg-white text-black rounded-sm">
											S’inscrire
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-[#060606] px-5 py-16">
						<div className="container mx-auto">
							<div className="flex flex-wrap gap-5 items-center justify-between">
								<div>
								<h2
									className=" text-3xl font-bold text-white lemon-milk-font mb-3">
								Les tournois
								</h2>
									<p className="text-white">Rejoins la compétition et gagne des prix exclusifs!</p>
								</div>
								<Link to="all-tournaments" className="py-3 px-5 bg-cyan-600 text-white rounded-sm">
								Tous les tournois
											</Link>
								
							</div>
							<FeaturedTournaments/>
						
						</div>
					</div>

					<div className="bg-[#05252c] py-16 px-5"  >
						<div className="container mx-auto">
							<div className="grid lg:grid-cols-2 gap-6">
								
								<div className="my-auto">
									<div className="">
										<h2
											className="text-3xl mb-4 font-bold lemon-milk-font text-white">
											Le meilleur moyen de se lancer dans l'e-sport
										</h2>
										<p className="text-white mb-4">La plateforme Toornoi est le meilleur moyen de s'entraîner, de participer à des matchs d'entraînement et de classement, de participer à des tournois, seul ou en équipe, et à de nombreux jeux !</p>
										<div className="flex flex-row text-white justify-start items-center gap-x-3">
											<img src={game} alt="" />
											<p className="lemon-milk-medium">Rejoignez le jeu</p>
										</div>
										<div className="flex flex-row text-white justify-start items-center gap-x-3">
											<img src={rocket} alt="" />
											<p className="lemon-milk-medium">Disputez vos matchs classés</p>
										</div>
										<div className="flex flex-row text-white justify-start items-center gap-x-3">
											<img src={participants} alt="" />
											<p className="lemon-milk-medium">Participez à des compétitions</p>
										</div>
										<div className="flex flex-row text-white justify-start items-center gap-x-3">
											<img src={prizes} alt="" />
											<p className="lemon-milk-medium">Gagnez des prix</p>
										</div>
										<div className="flex mt-8">
										<Link to="/login" className="py-3 px-5 bg-cyan-600 text-white rounded-sm">
										S’inscrire
											</Link>	
										</div>
																		
									</div>
									
								</div>

								<div className="">
									
								</div>
							</div>
						</div>
					</div>

					<div className="bg-[#060606] py-16 px-5" >
						<div className="section container mx-auto">
							<div className="grid lg:grid-cols-2 gap-6 items-start">
							<div className="p-5 bg-(--secondary) rounded">
								<img src={features}	className="" alt=""/>
								</div>
									<div className="">
										<h2
											className=" text-3xl lemon-milk-font text-white mb-3">
											<span className="">Fonctionnalités du compte</span>
										</h2>
										<div className="">
											<p className="text-base text-white mb-9">
											Gérez tous vos tournois depuis un seul et même endroit, quels que soient leur structure et le format de leurs matchs. Choisissez la participation de vos joueurs. 
											</p>
										</div>
										<div className="grid md:grid-cols-2 gap-2">
											<div>
												<div className="mb-4">
												<h6 className="lemon-milk-medium text-white">🎮 Participation facile aux tournois</h6>
												<p className="text-white"> Inscription fluide, matchmaking automatique et interface intuitive pour une expérience de jeu fluide.</p>
												</div>
												<div className="mb-4">
												<h6 className="lemon-milk-medium text-white">🏆 Jeu équitable et compétitif</h6>
												<p className="text-white">Le matchmaking basé sur les compétences, les systèmes anti-triche et les compétitions vérifiées garantissent des conditions de jeu équitables.</p>
												</div>
												<div className="mb-4">
												<h6 className="lemon-milk-medium text-white">💰 Opportunités de gains</h6>
												<p className="text-white">Gagnez des prix en espèces, des sponsors et des récompenses en jeu grâce à des tournois officiels et communautaires.
												</p>
												</div>												
											</div>
											<div>
												<div className="mb-4">
												<h6 className="lemon-milk-medium text-white">📊 Suivi des performances et analyses</h6>
												<p className="text-white">Des statistiques détaillées, des classements et des analyses aident les joueurs à améliorer leurs compétences et à suivre leur progression.</p>
												</div>
												<div className="mb-4">
												<h6 className="lemon-milk-medium text-white">🌍 Communauté et réseautage</h6>
												<p className="text-white">Connectez-vous avec d'autres joueurs, formez des équipes et participez aux fonctionnalités sociales comme le chat, les forums et les diffusions en direct.</p>
												</div>
																							
											</div>
										</div>
									</div>
							</div>
						</div>
					</div>

					<div className="bg-[#05252c]  py-16 px-5"  >
						<div className="container mx-auto">
							<div className="grid lg:grid-cols-2 gap-6">
								
								<div className="my-auto">
									<div className="">
										<h2
											className="text-3xl mb-4 font-bold lemon-milk-font text-white">
											Discutez avec votre adversaire
										</h2>
										<p className="text-white mb-4">Les participants auront accès à un Tchat avant le match pour discuter avec leur adversaire. Un espace de discussion sera également mis à leur disposition pour contacter les organisateurs en cas de question concernant un problème ou le tournoi.</p>
										
										
																		
									</div>
									
								</div>

								<div className="">
									<img src={opponentChat} className="w-full"/>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-[#060606]  py-16 px-5"  >
						<div className="container mx-auto">
							<div className="grid lg:grid-cols-2 gap-6">
							<div className="">
									<img src={communityImg} className="w-full"/>
								</div>
								<div className="my-auto">
									<div className="">
										<h2
											className="text-3xl mb-4 font-bold lemon-milk-font text-white">
											Rejoignez une communauté exclusive
										</h2>
										<p className="text-white mb-4">« Rejoignez la communauté et échangez avec d'autres joueurs ! 🎮 Discutez, élaborez des stratégies et partagez vos victoires dans un espace de jeu dynamique. Jouez, rivalisez et progressez ensemble ! » 🚀🔥
										</p>
										
										
																		
									</div>
									
								</div>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-b from-[#060606]  to-[#031d29] px-5 py-16">
						<div className="sm:w-10/12 w-full mx-auto p-0 border border-neutral-600 rounded-md bg-[#060606] grid sm:grid-cols-2">
						<div className="sm:p-10 p-5">
							<h2 className="lemon-milk-font text-white mb-4">Commencez votre voyage vers la gloire</h2>
							<p className="text-white">Rivalisez, connectez-vous et atteignez le sommet dans l'arène de jeu ultime ! 🚀</p>
							<div className="mt-5 flex justify-start gap-2">
											
											<Link to="/login" className="py-3 px-5 btn bg-white text-black rounded-sm">
											S’inscrire
											</Link>
										</div>
						</div>
						<div>
							<img src={gloryImg} alt="" className="w-full h-full object-cover" />
						</div>
						</div>
					</div>
    </>
  )
}

export default Hero