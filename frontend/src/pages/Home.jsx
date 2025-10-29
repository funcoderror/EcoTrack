import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const handleCalculateClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Please log in first to calculate your carbon footprint.");
      // Navigate to login will be handled by the Link component
    }
  };

  return (
    <div className="bg-black font-display text-gray-200">
      <div className="flex flex-col min-h-screen">
        {/* Header Section */}
        <header className="w-full border-b border-gray-800">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                <path fill="currentColor" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"/>
              </svg>
              <h1 className="text-2xl font-bold text-white">Ecotrack</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-green-500 font-medium">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              {user ? (
                <Link to="/dashboard" className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
                Track Your <span className="text-green-500">Carbon Footprint</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl">
                Take control of your environmental impact. Monitor, analyze, and reduce your carbon emissions with our comprehensive tracking platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link 
                    to="/calculate" 
                    className="px-8 py-4 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Calculate Footprint
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={handleCalculateClick}
                    className="px-8 py-4 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Calculate Footprint
                  </Link>
                )}
                <Link 
                  to="/about" 
                  className="px-8 py-4 rounded-lg border border-gray-600 text-white font-bold hover:bg-gray-800 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://cdn.pixabay.com/photo/2019/04/04/22/35/europe-4103975_1280.png" 
                alt="Illustration of Earth" 
                className="w-80 h-80 animate-pulse"
              />
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-gray-900/50 py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Why Choose Ecotrack?</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Our platform makes it easy to understand and reduce your environmental impact
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-xl shadow-lg bg-gray-900 border border-gray-800 hover:border-green-500/50 transition-all duration-300">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/1892/1892751.png" 
                    alt="Tree Doodle" 
                    className="mx-auto w-20 h-20 mb-6"
                  />
                  <h3 className="text-xl font-bold text-white mb-4">Plant-Friendly Choices</h3>
                  <p className="text-gray-400">
                    Learn how your actions contribute to greener living and make environmentally conscious decisions.
                  </p>
                </div>
                <div className="p-8 rounded-xl shadow-lg bg-gray-900 border border-gray-800 hover:border-green-500/50 transition-all duration-300">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/15439/15439246.png" 
                    alt="Carbon Doodle" 
                    className="mx-auto w-20 h-20 mb-6"
                  />
                  <h3 className="text-xl font-bold text-white mb-4">Carbon Tracking</h3>
                  <p className="text-gray-400">
                    Easily calculate and track your daily carbon footprint with our intuitive tools and analytics.
                  </p>
                </div>
                <div className="p-8 rounded-xl shadow-lg bg-gray-900 border border-gray-800 hover:border-green-500/50 transition-all duration-300">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/3937/3937245.png" 
                    alt="Recycle Doodle" 
                    className="mx-auto w-20 h-20 mb-6"
                  />
                  <h3 className="text-xl font-bold text-white mb-4">Sustainable Actions</h3>
                  <p className="text-gray-400">
                    Get personalized tips and challenges for reducing emissions and living more sustainably.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Making a Global Impact</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Join thousands of users worldwide in the fight against climate change
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="p-6">
                  <div className="text-5xl font-bold text-green-500 mb-2">10K+</div>
                  <div className="text-gray-400">Active Users</div>
                </div>
                <div className="p-6">
                  <div className="text-5xl font-bold text-green-500 mb-2">50K+</div>
                  <div className="text-gray-400">Activities Tracked</div>
                </div>
                <div className="p-6">
                  <div className="text-5xl font-bold text-green-500 mb-2">25%</div>
                  <div className="text-gray-400">Average Reduction</div>
                </div>
                <div className="p-6">
                  <div className="text-5xl font-bold text-green-500 mb-2">100+</div>
                  <div className="text-gray-400">Countries</div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="bg-gray-900/30 py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Start your sustainability journey in three simple steps
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-green-500">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Sign Up & Set Goals</h3>
                  <p className="text-gray-400">
                    Create your account and set personalized sustainability goals based on your lifestyle.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-green-500">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Track Activities</h3>
                  <p className="text-gray-400">
                    Log your daily activities and automatically calculate their environmental impact.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-green-500">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Reduce & Improve</h3>
                  <p className="text-gray-400">
                    Get insights and recommendations to reduce your carbon footprint over time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Real stories from people making a difference
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">S</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Sarah Johnson</h4>
                      <p className="text-gray-400 text-sm">Environmental Activist</p>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "Ecotrack helped me reduce my carbon footprint by 30% in just 6 months. The insights are incredibly valuable!"
                  </p>
                </div>
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Mike Chen</h4>
                      <p className="text-gray-400 text-sm">Software Engineer</p>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "The tracking features are amazing. I love seeing my progress and getting personalized recommendations."
                  </p>
                </div>
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">E</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Emma Davis</h4>
                      <p className="text-gray-400 text-sm">Teacher</p>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "Simple, effective, and motivating. Ecotrack makes sustainability accessible for everyone."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          {!user && (
            <section className="bg-green-500/10 py-20">
              <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Ready to Make a Difference?
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of users who are already tracking and reducing their carbon footprint. Start your sustainability journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/register" 
                    className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 inline-block"
                  >
                    Get Started Free
                  </Link>
                  <Link 
                    to="/about" 
                    className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 inline-block"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Enhanced Footer Section */}
        <footer className="bg-black py-12 border-t border-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                    <path fill="currentColor" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"/>
                  </svg>
                  <span className="text-2xl font-bold text-white">Ecotrack</span>
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                  Making the world greener, one track at a time. Join our mission to create a sustainable future through conscious living and environmental awareness.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-green-500 transition-colors">Home</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-green-500 transition-colors">About</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-green-500 transition-colors">Contact</Link></li>
                  {user ? (
                    <>
                      <li><Link to="/dashboard" className="text-gray-400 hover:text-green-500 transition-colors">Dashboard</Link></li>
                      <li><Link to="/activities" className="text-gray-400 hover:text-green-500 transition-colors">Activities</Link></li>
                      <li><Link to="/profile" className="text-gray-400 hover:text-green-500 transition-colors">Profile</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/login" className="text-gray-400 hover:text-green-500 transition-colors">Login</Link></li>
                      <li><Link to="/register" className="text-gray-400 hover:text-green-500 transition-colors">Sign Up</Link></li>
                    </>
                  )}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Carbon Calculator</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Sustainability Tips</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Blog</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; 2025 Ecotrack. All rights reserved. Making the world greener, one track at a time.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;