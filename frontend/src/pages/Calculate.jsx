import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { carbonFootprintAPI } from '../services/api';

const Calculate = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Add CSS animations
  const styles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .animate-fadeInUp {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `;

  // Inject styles
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    if (!document.head.querySelector('style[data-calculate-styles]')) {
      styleSheet.setAttribute('data-calculate-styles', 'true');
      document.head.appendChild(styleSheet);
    }
  }
  const [formData, setFormData] = useState({
    transport: '',
    electricity: '',
    diet: '2.5', // Default to Mixed diet
    flights: '',
    waste: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const transport = parseFloat(formData.transport) || 0;
    const electricity = parseFloat(formData.electricity) || 0;
    const diet = parseFloat(formData.diet);
    const flights = parseFloat(formData.flights) || 0;
    const waste = parseFloat(formData.waste) || 0;

    try {
      const response = await carbonFootprintAPI.calculate(
        transport,
        electricity,
        diet,
        flights,
        waste
      );

      setResult(response.data.data);

      // Save latest footprint and individual values in localStorage for backward compatibility
      const resultString = `${response.data.data.totalCO2} tons CO₂ / year`;
      localStorage.setItem("latestFootprint", resultString);
      localStorage.setItem("calc_transport", transport);
      localStorage.setItem("calc_electricity", electricity);
      localStorage.setItem("calc_diet", diet);
      localStorage.setItem("calc_flights", flights);
      localStorage.setItem("calc_waste", waste);

    } catch (err) {
      console.error('Error calculating carbon footprint:', err);
      setError(err.response?.data?.error || err.message || 'Failed to calculate carbon footprint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black font-display text-gray-200">
      <div className="flex flex-col min-h-screen">
        {/* Header Section */}
        <header className="w-full border-b border-gray-800">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                <path fill="currentColor" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" />
              </svg>
              <h1 className="text-2xl font-bold text-white">Ecotrack</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-300 font-medium hover:text-white">Dashboard</Link>
              <Link to="/calculate" className="text-green-500 font-medium hover:text-green-400">Calculate</Link>
              <Link to="/goals" className="text-gray-300 font-medium hover:text-white">Goals</Link>
              <Link to="/profile" className="text-gray-300 font-medium hover:text-white">Profile</Link>
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-700">
                <span className="text-sm text-gray-400">Welcome, {user?.first_name}</span>
                <button onClick={logout} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium">
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-5xl font-extrabold text-white mb-4">Calculate Your Carbon Footprint</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Understand your environmental impact by calculating your annual CO₂ emissions based on your lifestyle choices.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Transport Input */}
                <div className="group">
                  <label htmlFor="transport" className="flex items-center gap-2 font-semibold mb-3 text-white">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    Daily Transport (km)
                  </label>
                  <input
                    id="transport"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 20"
                    value={formData.transport}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-2">Average distance traveled by car, bus, or other transport</p>
                </div>

                {/* Electricity Input */}
                <div className="group">
                  <label htmlFor="electricity" className="flex items-center gap-2 font-semibold mb-3 text-white">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Monthly Electricity (kWh)
                  </label>
                  <input
                    id="electricity"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 200"
                    value={formData.electricity}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all hover:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-2">Check your electricity bill for monthly usage</p>
                </div>

                {/* Diet Input */}
                <div className="group">
                  <label htmlFor="diet" className="flex items-center gap-2 font-semibold mb-3 text-white">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    Diet Type
                  </label>
                  <select
                    id="diet"
                    value={formData.diet}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-600 cursor-pointer"
                  >
                    <option value="1.0">🌱 Vegan (~1.0 tons CO₂/year)</option>
                    <option value="1.5">🥗 Vegetarian (~1.5 tons CO₂/year)</option>
                    <option value="2.5">🍽️ Mixed (~2.5 tons CO₂/year)</option>
                    <option value="3.5">🥩 High Meat (~3.5 tons CO₂/year)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">Your typical eating habits and food choices</p>
                </div>

                {/* Flights Input */}
                <div className="group">
                  <label htmlFor="flights" className="flex items-center gap-2 font-semibold mb-3 text-white">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    Flights Last Year
                  </label>
                  <input
                    id="flights"
                    type="number"
                    step="1"
                    placeholder="e.g., 2"
                    value={formData.flights}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-2">Number of round-trip flights taken in the past year</p>
                </div>
              </div>

              {/* Waste Input - Full Width */}
              <div className="group mb-8">
                <label htmlFor="waste" className="flex items-center gap-2 font-semibold mb-3 text-white">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  Average Waste Generated (kg/week)
                </label>
                <input
                  id="waste"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 5"
                  value={formData.waste}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all hover:border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-2">Estimate your weekly household waste production</p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-green-500/50 flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Calculate My Footprint
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-8 p-5 rounded-xl bg-red-900/30 border-2 border-red-500/50 backdrop-blur-sm animate-shake">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-red-300 font-semibold mb-1">Calculation Error</h4>
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="mt-12 animate-fadeInUp">
                {/* Main Result Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">Your Carbon Footprint</h3>
                    <p className="text-green-100">Annual CO₂ Emissions Estimate</p>
                  </div>

                  {/* Total Result */}
                  <div className="p-8 text-center border-b border-gray-700">
                    <div className="inline-block bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl px-8 py-6 backdrop-blur-sm">
                      <p className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
                        {result.totalCO2}
                      </p>
                      <p className="text-xl text-gray-300 font-semibold">tons CO₂ / year</p>
                    </div>
                    <p className="text-gray-400 mt-4 text-sm">
                      {result.totalCO2 < 4 ? '🌟 Great! Below average footprint' :
                        result.totalCO2 < 8 ? '👍 Good! Average footprint' :
                          '⚠️ Consider reducing your emissions'}
                    </p>
                  </div>

                  {/* Breakdown Section */}
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Emissions Breakdown
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Transport */}
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 hover:border-blue-500/50 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </div>
                            <span className="text-gray-300 font-medium">Transport</span>
                          </div>
                          <span className="text-2xl font-bold text-white">{result.breakdown.transport}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(result.breakdown.transport / result.totalCO2) * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{((result.breakdown.transport / result.totalCO2) * 100).toFixed(1)}% of total</p>
                      </div>

                      {/* Electricity */}
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 hover:border-yellow-500/50 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <span className="text-gray-300 font-medium">Electricity</span>
                          </div>
                          <span className="text-2xl font-bold text-white">{result.breakdown.electricity}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(result.breakdown.electricity / result.totalCO2) * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{((result.breakdown.electricity / result.totalCO2) * 100).toFixed(1)}% of total</p>
                      </div>

                      {/* Diet */}
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 hover:border-green-500/50 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <span className="text-gray-300 font-medium">Diet</span>
                          </div>
                          <span className="text-2xl font-bold text-white">{result.breakdown.diet}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(result.breakdown.diet / result.totalCO2) * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{((result.breakdown.diet / result.totalCO2) * 100).toFixed(1)}% of total</p>
                      </div>

                      {/* Flights */}
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 hover:border-purple-500/50 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </div>
                            <span className="text-gray-300 font-medium">Flights</span>
                          </div>
                          <span className="text-2xl font-bold text-white">{result.breakdown.flights}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(result.breakdown.flights / result.totalCO2) * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{((result.breakdown.flights / result.totalCO2) * 100).toFixed(1)}% of total</p>
                      </div>

                      {/* Waste */}
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 hover:border-red-500/50 transition-all group md:col-span-2">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </div>
                            <span className="text-gray-300 font-medium">Waste</span>
                          </div>
                          <span className="text-2xl font-bold text-white">{result.breakdown.waste}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(result.breakdown.waste / result.totalCO2) * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{((result.breakdown.waste / result.totalCO2) * 100).toFixed(1)}% of total</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-8 bg-gray-900/50 border-t border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/goals"
                        className="flex-1 text-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Track Goals
                      </Link>
                      <button
                        onClick={() => setResult(null)}
                        className="px-6 py-4 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Calculate Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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

export default Calculate;
