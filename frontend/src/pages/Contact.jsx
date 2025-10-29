import { useState } from 'react';
import { Link } from 'react-router';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

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
              <Link to="/about" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">About</Link>
              <Link to="/contact" className="text-green-500 font-medium">Contact</Link>
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
                Get in <span className="text-green-500">Touch</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Have questions, suggestions, or need help? We'd love to hear from you.
              </p>
            </div>
          </section>

          {/* Contact Form and Info */}
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
                  <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                  
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-400">Thank you for reaching out. We'll get back to you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="What's this about?"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="Tell us more..."
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                      >
                        Send Message
                      </button>
                    </form>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Other Ways to Reach Us</h2>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-500/20 p-3 rounded-lg">
                          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                          <p className="text-gray-400">support@ecotrack.com</p>
                          <p className="text-gray-500 text-sm">We typically respond within 24 hours</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Office</h3>
                          <p className="text-gray-400">123 Green Street</p>
                          <p className="text-gray-400">Eco City, EC 12345</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-purple-500/20 p-3 rounded-lg">
                          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">FAQ</h3>
                          <p className="text-gray-400">Check our frequently asked questions</p>
                          <p className="text-gray-500 text-sm">Coming soon</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                    <div className="space-y-3">
                      <Link to="/about" className="block text-gray-400 hover:text-green-500 transition-colors">
                        Learn more about Ecotrack
                      </Link>
                      <Link to="/register" className="block text-gray-400 hover:text-green-500 transition-colors">
                        Create your account
                      </Link>
                      <Link to="/login" className="block text-gray-400 hover:text-green-500 transition-colors">
                        Sign in to your account
                      </Link>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                    <h3 className="text-lg font-semibold text-white mb-2">Response Time</h3>
                    <p className="text-gray-300 text-sm">
                      We aim to respond to all inquiries within 24 hours during business days. 
                      For urgent matters, please mark your subject line with "URGENT".
                    </p>
                  </div>
                </div>
              </div>
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

export default Contact;