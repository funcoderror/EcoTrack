import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

const SetGoals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState({
    transportGoal: '',
    electricityGoal: '',
    flightGoal: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const isLoggedIn = true
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setGoals(prevGoals => ({ ...prevGoals, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("goal_transport", goals.transportGoal);
    localStorage.setItem("goal_electricity", goals.electricityGoal);
    localStorage.setItem("goal_flights", goals.flightGoal);
    setIsSaved(true);
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
              <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link>
              <Link to="/calculate" className="text-gray-300 hover:text-white">Calculate</Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-16">
          <h2 className="text-4xl font-extrabold text-white">Set Your Sustainability Goals</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl">
            Create personal targets to help reduce your footprint. Your progress will be tracked on your profile.
          </p>

          {!isSaved ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-2xl">
              <div>
                <label htmlFor="transportGoal" className="block font-medium mb-2 text-white">New Transport Goal (km/day)</label>
                <input id="transportGoal" type="number" placeholder="e.g., 10" value={goals.transportGoal} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div>
                <label htmlFor="electricityGoal" className="block font-medium mb-2 text-white">New Electricity Goal (kWh/month)</label>
                <input id="electricityGoal" type="number" placeholder="e.g., 150" value={goals.electricityGoal} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div>
                <label htmlFor="flightGoal" className="block font-medium mb-2 text-white">New Flight Goal (per year)</label>
                <input id="flightGoal" type="number" placeholder="e.g., 1" value={goals.flightGoal} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div>
                <button type="submit" className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 active:scale-95">
                  Save Goals
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 p-6 rounded-xl shadow-lg bg-gray-900/80 border border-gray-700 max-w-2xl">
              <h3 className="text-2xl font-bold text-green-400">Goals Saved!</h3>
              <p className="mt-4 text-lg text-white">Your new targets have been saved to your profile.</p>
              <Link to="/profile" className="mt-4 inline-block px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-transform transform hover:scale-105 active:scale-95">View Profile</Link>
            </div>
          )}
        </main>

        {/* Footer Section */}
        <footer className="bg-black py-6 mt-auto border-t border-gray-800">
          <div className="container mx-auto px-6">
            <p className="text-center text-gray-500">&copy; 2025 Ecotrack.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SetGoals;
