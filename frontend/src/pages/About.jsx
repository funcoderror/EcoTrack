import { Link } from 'react-router';

const About = () => {
  return (
    <div className="bg-black font-display text-gray-200">
      <div className="flex flex-col min-h-screen">
        {/* Header Section */}
        <header className="w-full border-b border-gray-800">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                <path fill="currentColor" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"/>
              </svg>
              <h1 className="text-2xl font-bold text-white">Ecotrack</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Home</Link>
              <Link to="/about" className="text-green-500 font-medium">About</Link>
              <Link to="/contact" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Contact</Link>
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-300 font-medium hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  Sign Up
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                About <span className="text-green-500">Ecotrack</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Empowering individuals to make informed decisions about their environmental impact through comprehensive carbon footprint tracking.
              </p>
            </div>
          </section>

          {/* Mission Section */}
          <section className="bg-gray-900/50 py-20">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Mission</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-gray-300 text-lg mb-6">
                      Climate change is one of the most pressing challenges of our time. At Ecotrack, we believe that individual actions, when multiplied across millions of people, can create meaningful change.
                    </p>
                    <p className="text-gray-300 text-lg mb-6">
                      Our platform makes it easy for anyone to understand their carbon footprint and take actionable steps to reduce their environmental impact.
                    </p>
                    <p className="text-gray-300 text-lg">
                      We're committed to providing accurate, science-based calculations and insights that help you make informed decisions about your daily activities.
                    </p>
                  </div>
                  <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                    <div className="text-center">
                      <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-4">Global Impact</h3>
                      <p className="text-gray-400">
                        Together, we can create a more sustainable future for our planet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-green-500">1</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">Track Activities</h3>
                    <p className="text-gray-400">
                      Log your daily activities like transportation, energy use, food consumption, and waste generation.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-blue-500">2</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">Calculate Impact</h3>
                    <p className="text-gray-400">
                      Our system automatically calculates the carbon emissions for each activity using scientific data.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-purple-500">3</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">Take Action</h3>
                    <p className="text-gray-400">
                      Get insights and recommendations to reduce your carbon footprint and make a positive impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="bg-gray-900/50 py-20">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-semibold text-white mb-4">Transparency</h3>
                    <p className="text-gray-400">
                      We use open, scientifically-backed emission factors and clearly explain how we calculate your carbon footprint.
                    </p>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-semibold text-white mb-4">Privacy</h3>
                    <p className="text-gray-400">
                      Your data is yours. We protect your privacy and never share your personal information without consent.
                    </p>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-semibold text-white mb-4">Accessibility</h3>
                    <p className="text-gray-400">
                      Environmental action shouldn't be limited by economic barriers. Our platform is free and accessible to everyone.
                    </p>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-semibold text-white mb-4">Continuous Improvement</h3>
                    <p className="text-gray-400">
                      We constantly update our calculations and features based on the latest climate science and user feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join our community of environmentally conscious individuals making a difference.
              </p>
              <Link 
                to="/register" 
                className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 inline-block"
              >
                Get Started Today
              </Link>
            </div>
          </section>
        </main>

        {/* Footer Section */}
        <footer className="bg-black py-6 border-t border-gray-800">
          <div className="container mx-auto px-6">
            <p className="text-center text-gray-500">&copy; 2025 Ecotrack. Making the world greener, one track at a time.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;