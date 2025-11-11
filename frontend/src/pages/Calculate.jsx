import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { carbonFootprintAPI } from '../services/api';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const Calculate = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

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

  // Global average data (based on research data)
  const globalAverages = {
    transport: 1.8,
    electricity: 1.2,
    diet: 2.5,
    flights: 0.9,
    waste: 0.6,
    total: 7.0
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Create/Update chart when result changes
  useEffect(() => {
    if (result && chartRef.current) {
      // Destroy previous chart instance
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      // Create gradients
      const globalGradient = ctx.createLinearGradient(0, 0, 0, 400);
      globalGradient.addColorStop(0, 'rgba(147, 51, 234, 0.8)');
      globalGradient.addColorStop(1, 'rgba(79, 70, 229, 0.4)');

      const userGradient = ctx.createLinearGradient(0, 0, 0, 400);
      userGradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
      userGradient.addColorStop(1, 'rgba(16, 185, 129, 0.4)');

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['🚗 Transport', '⚡ Electricity', '🍽️ Diet', '✈️ Flights', '🗑️ Waste'],
          datasets: [
            {
              label: '🌍 Global Average',
              data: [
                globalAverages.transport,
                globalAverages.electricity,
                globalAverages.diet,
                globalAverages.flights,
                globalAverages.waste
              ],
              backgroundColor: globalGradient,
              borderColor: 'rgb(147, 51, 234)',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
            {
              label: '👤 Your Footprint',
              data: [
                result.breakdown.transport,
                result.breakdown.electricity,
                result.breakdown.diet,
                result.breakdown.flights,
                result.breakdown.waste
              ],
              backgroundColor: userGradient,
              borderColor: 'rgb(34, 197, 94)',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#f3f4f6',
                font: {
                  size: 15,
                  weight: 'bold',
                  family: "'Inter', sans-serif"
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'rectRounded',
                boxWidth: 12,
                boxHeight: 12
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              titleColor: '#fff',
              bodyColor: '#e5e7eb',
              borderColor: 'rgba(147, 51, 234, 0.5)',
              borderWidth: 2,
              padding: 16,
              displayColors: true,
              boxWidth: 12,
              boxHeight: 12,
              boxPadding: 6,
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 13
              },
              callbacks: {
                label: function (context) {
                  const value = context.parsed.y.toFixed(2);
                  const percentage = ((context.parsed.y / result.totalCO2) * 100).toFixed(1);
                  return context.dataset.label + ': ' + value + ' tons CO₂ (' + percentage + '%)';
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(75, 85, 99, 0.2)',
                drawBorder: false,
                lineWidth: 1
              },
              border: {
                display: false
              },
              ticks: {
                color: '#d1d5db',
                font: {
                  size: 13,
                  weight: '500'
                },
                padding: 10,
                callback: function (value) {
                  return value.toFixed(1) + ' t';
                }
              },
              title: {
                display: true,
                text: '💨 CO₂ Emissions (tons/year)',
                color: '#f3f4f6',
                font: {
                  size: 14,
                  weight: 'bold'
                },
                padding: { top: 10, bottom: 10 }
              }
            },
            x: {
              grid: {
                display: false,
                drawBorder: false
              },
              border: {
                display: false
              },
              ticks: {
                color: '#d1d5db',
                font: {
                  size: 13,
                  weight: '600'
                },
                padding: 10
              }
            }
          }
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [result, globalAverages]);

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

                {/* Comparison Chart */}
                <div className="mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden animate-fadeInUp">
                  {/* Chart Header */}
                  <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-3xl font-extrabold text-white mb-1">🌍 Carbon Footprint Comparison</h3>
                          <p className="text-purple-100 text-sm font-medium">See how your emissions stack up against global averages</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart Container */}
                  <div className="p-8 bg-gradient-to-b from-gray-900/50 to-gray-900">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 shadow-inner" style={{ height: '450px' }}>
                      <canvas ref={chartRef}></canvas>
                    </div>

                    {/* Insights */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="group bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center group-hover:bg-purple-500/40 transition-colors shadow-lg">
                            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="text-white font-bold text-lg">🌍 Global Average</h4>
                        </div>
                        <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">{globalAverages.total}</p>
                        <p className="text-sm text-purple-200 mt-2 font-medium">tons CO₂/year</p>
                      </div>

                      <div className="group bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:scale-105">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center group-hover:bg-green-500/40 transition-colors shadow-lg">
                            <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h4 className="text-white font-bold text-lg">👤 Your Total</h4>
                        </div>
                        <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">{result.totalCO2}</p>
                        <p className="text-sm text-green-200 mt-2 font-medium">tons CO₂/year</p>
                      </div>

                      <div className={`group bg-gradient-to-br ${result.totalCO2 < globalAverages.total ? 'from-green-900/40 to-teal-900/40 border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/20' : 'from-orange-900/40 to-red-900/40 border-orange-500/30 hover:border-orange-400/50 hover:shadow-orange-500/20'} rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 ${result.totalCO2 < globalAverages.total ? 'bg-green-500/30 group-hover:bg-green-500/40' : 'bg-orange-500/30 group-hover:bg-orange-500/40'} rounded-xl flex items-center justify-center transition-colors shadow-lg`}>
                            <svg className={`w-6 h-6 ${result.totalCO2 < globalAverages.total ? 'text-green-300' : 'text-orange-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={result.totalCO2 < globalAverages.total ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                            </svg>
                          </div>
                          <h4 className="text-white font-bold text-lg">📊 Difference</h4>
                        </div>
                        <p className={`text-4xl font-extrabold text-transparent bg-clip-text ${result.totalCO2 < globalAverages.total ? 'bg-gradient-to-r from-green-300 to-teal-300' : 'bg-gradient-to-r from-orange-300 to-red-300'}`}>
                          {result.totalCO2 < globalAverages.total ? '-' : '+'}{Math.abs(result.totalCO2 - globalAverages.total).toFixed(2)}
                        </p>
                        <p className={`text-sm mt-2 font-medium ${result.totalCO2 < globalAverages.total ? 'text-green-200' : 'text-orange-200'}`}>
                          {result.totalCO2 < globalAverages.total ? '✅ Below' : '⚠️ Above'} average
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mt-8 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                            💡 Personalized Tips to Reduce Your Carbon Footprint
                          </h4>
                          <ul className="text-gray-200 text-sm space-y-2.5">
                            {result.breakdown.transport > globalAverages.transport && (
                              <li className="flex items-start gap-2 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                                <span className="text-blue-400 font-bold">🚗</span>
                                <span>Consider carpooling, public transport, or cycling to reduce transport emissions</span>
                              </li>
                            )}
                            {result.breakdown.electricity > globalAverages.electricity && (
                              <li className="flex items-start gap-2 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                                <span className="text-yellow-400 font-bold">⚡</span>
                                <span>Switch to LED bulbs and unplug devices when not in use to save electricity</span>
                              </li>
                            )}
                            {result.breakdown.diet > globalAverages.diet && (
                              <li className="flex items-start gap-2 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                                <span className="text-green-400 font-bold">🍽️</span>
                                <span>Try incorporating more plant-based meals into your diet</span>
                              </li>
                            )}
                            {result.breakdown.flights > globalAverages.flights && (
                              <li className="flex items-start gap-2 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                                <span className="text-purple-400 font-bold">✈️</span>
                                <span>Consider virtual meetings or train travel for shorter distances</span>
                              </li>
                            )}
                            {result.breakdown.waste > globalAverages.waste && (
                              <li className="flex items-start gap-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                <span className="text-red-400 font-bold">🗑️</span>
                                <span>Reduce, reuse, and recycle to minimize waste generation</span>
                              </li>
                            )}
                            {result.totalCO2 <= globalAverages.total && (
                              <li className="flex items-start gap-2 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                                <span className="text-emerald-400 font-bold">🌟</span>
                                <span className="font-semibold">Great job! You're below the global average. Keep up the excellent work!</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
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
