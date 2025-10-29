import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const LearnMore = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)

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
              <Link to="/contact" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Contact</Link>
               {isLoggedIn ? (
                <Link to="/profile" className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 active:scale-90">
                  Profile
                </Link>
              ) : (
                <Link to="/login" className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 active:scale-90">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-16">
          <h2 className="text-4xl font-extrabold text-white">Learn More About Sustainability</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl">
            Ecotrack provides data-driven insights to help you understand how everyday activities affect the environment. 
            From energy use to transport choices, we give you clear metrics so you can take smarter steps towards sustainability.
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl shadow-lg bg-gray-900/80 border border-gray-700">
              <h3 className="text-xl font-bold text-white">Why Carbon Matters</h3>
              <p className="mt-2 text-gray-400">
                Carbon emissions are the leading cause of climate change. Understanding and reducing your carbon footprint is essential for a greener future.
              </p>
            </div>
            <div className="p-6 rounded-xl shadow-lg bg-gray-900/80 border border-gray-700">
              <h3 className="text-xl font-bold text-white">How Ecotrack Helps</h3>
              <p className="mt-2 text-gray-400">
                We provide tools to calculate your footprint and offer recommendations to reduce it — from lifestyle changes to eco-friendly habits.
              </p>
            </div>
          </div>
        </main>

        {/* Footer Section */}
        <footer className="bg-black py-6 mt-auto border-t border-gray-800">
          <div className="container mx-auto px-6">
            <p className="text-center text-gray-500">&copy; 2025 Ecotrack. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LearnMore;
