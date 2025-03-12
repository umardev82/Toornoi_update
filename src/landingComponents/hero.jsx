import trophy from '../assets/images/toornoi-trophy.png';
import frame from '../assets/images/Frame.png';
import game from '../assets/images/game.png';
import rocket from '../assets/images/rocket.png';
import participants from '../assets/images/participants.png';
import prizes from '../assets/images/prizes.png';
import features from '../assets/images/features.png';
import opponentChat from '../assets/images/toornoi-chat.png';
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
										
											<h1 className="text-white sm:text-4xl text-3xl sm:text-left text-center lemon-milk-font font-semibold lemon-milk-font mb-5">Manage your 
											gaming competitions with the right tools </h1>
										<div className="flex flex-row justify-start  items-center gap-x-3 mb-2">
											<img src={frame} alt="" />
											<p className='text-white'>Participate to several tournaments</p>
										</div>
										<div className="flex flex-row justify-start  items-center gap-x-3 mb-2">
											<img src={frame} alt="" />
											<p className='text-white'>Manage all you stats and matchs via your account</p>
										</div>
										<div className="flex flex-row justify-start  items-center gap-x-3 mb-5">
											<img src={frame} alt="" />
											<p className='text-white'>Win exclusives prices</p>
										</div>
									
										<div className="mt-10 flex gap-3 sm:justify-start justify-center sm:space-x-2  rtl:space-x-reverse">
											
											<Link to="/login" className="py-3 px-5 btn bg-white text-black rounded-sm">
											Register 
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
								Featured Tournaments
								</h2>
									<p className="text-white">Join the fray in your favorite game and claim glory!</p>
								</div>
								<Link to="all-tournaments" className="py-3 px-5 bg-cyan-600 text-white rounded-sm">
								All Tournaments
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
											The best way to get into Esports
										</h2>
										<p className="text-white mb-4">The Sked platform is the best way to train, play scrims and ranked matches, participate in tournaments alone or in teams and on many games!</p>
										<div className="flex flex-row text-white justify-start items-center gap-x-3">
											<img src={game} alt="" />
											<p className="lemon-milk-medium">Join the game</p>
										</div>
										<div className="flex flex-row text-white justify-start items-center gap-x-3">
											<img src={rocket} alt="" />
											<p className="lemon-milk-medium">play your ranked matches</p>
										</div>
										<div className="flex flex-row text-white justify-start items-center gap-x-3">
											<img src={participants} alt="" />
											<p className="lemon-milk-medium">Participate in competitions</p>
										</div>
										<div className="flex flex-row text-white justify-start items-center gap-x-3">
											<img src={prizes} alt="" />
											<p className="lemon-milk-medium">Wins prizes</p>
										</div>
										<div className="flex mt-8">
										<Link to="/login" className="py-3 px-5 bg-cyan-600 text-white rounded-sm">
								          Register
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
							<div className="grid lg:grid-cols-2 gap-6">
							<div className="">
								<img src={features}	className="" alt="" />
								</div>
									<div className="">
										<h2
											className=" text-3xl lemon-milk-font text-white mb-3">
											<span className="">Account features</span>
										</h2>
										<div className="">
											<p className="text-base text-white mb-9">
											Manage all your tournaments in one place whatever their structures and matches formats. Decide how players participate in your tournaments. 
											</p>
										</div>
										<div className="grid md:grid-cols-2 gap-2">
											<div>
												<div className="mb-4">
												<h6 className="lemon-milk-medium text-white">🎮 Easy Tournament Participation</h6>
												<p className="text-white"> Seamless registration, automatic matchmaking, and a
												user-friendly interface for hassle-free gameplay.</p>
												</div>
												<div className="mb-4">
												<h6 className="lemon-milk-medium text-white">🏆 Fair & Competitive Play</h6>
												<p className="text-white">Skill-based matchmaking, anti-cheat systems, and verified
												competitions ensure a level playing field.</p>
												</div>
												<div className="mb-4">
												<h6 className="lemon-milk-medium text-white">💰 Earning Opportunities</h6>
												<p className="text-white">Win cash prizes, sponsorships, and in-game rewards through
												official and community-driven tournaments.</p>
												</div>												
											</div>
											<div>
												<div className="mb-4">
												<h6 className="lemon-milk-medium text-white">📊 Performance Tracking & Analytics</h6>
												<p className="text-white">Detailed stats, leaderboards, and insights help players
												improve their skills and track progress.</p>
												</div>
												<div className="mb-4">
												<h6 className="lemon-milk-medium text-white">🌍 Community & Networking</h6>
												<p className="text-white">Connect with fellow gamers, form teams, and engage in social
												features like chat, forums, and live streams.</p>
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
											discuss with your opponent
										</h2>
										<p className="text-white mb-4">Participants will have access to a Tchat before the match to speak with his opponent.
										Also, a chat box will be available for the players to join organizers if they have any questions regarding an issue or the tournament.</p>
										
										
																		
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
											join an exclusive community
										</h2>
										<p className="text-white mb-4">"Join the community and connect with fellow players! 🎮 Chat, strategize, and share your
										victories in a vibrant gaming space. Play, compete, and grow together!" 🚀🔥</p>
										
										
																		
									</div>
									
								</div>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-b from-[#060606]  to-[#031d29] px-5 py-16">
						<div className="sm:w-10/12 w-full mx-auto p-0 border border-neutral-600 rounded-md bg-[#060606] grid sm:grid-cols-2">
						<div className="sm:p-10 p-5">
							<h2 className="lemon-milk-font text-white mb-4">Start Your Journey to Glory</h2>
							<p className="text-white">Compete, connect, and rise to the top in the
							ultimate gaming arena!" 🚀</p>
							<div className="mt-5 flex justify-start gap-2">
											
											<Link to="/login" className="py-3 px-5 btn bg-white text-black rounded-sm">
											Register 
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