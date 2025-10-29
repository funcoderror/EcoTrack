import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const Calculate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    transport: '',
    electricity: '',
    diet: '2.5', // Default to Mixed diet
    flights: '',
    waste: ''
  });
  const [result, setResult] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const transport = parseFloat(formData.transport) || 0;
    const electricity = parseFloat(formData.electricity) || 0;
    const diet = parseFloat(formData.diet);
    const flights = parseFloat(formData.flights) || 0;
    const waste = parseFloat(formData.waste) || 0;

    // Basic emission factors (approximate)
    const transportCO2 = transport * 0.2 * 365 / 1000;
    const electricityCO2 = electricity * 12 * 0.0007;
    const flightCO2 = flights * 0.25;
    const wasteCO2 = waste * 52 * 0.001;

    // Total CO2
    const total = (transportCO2 + electricityCO2 + diet + flightCO2 + wasteCO2).toFixed(2);
    const resultString = `${total} tons CO₂ / year`;
    setResult(resultString);

    // Save latest footprint and individual values in localStorage
    localStorage.setItem("latestFootprint", resultString);
    localStorage.setItem("calc_transport", transport);
    localStorage.setItem("calc_electricity", electricity);
    localStorage.setItem("calc_diet", diet);
    localStorage.setItem("calc_flights", flights);
    localStorage.setItem("calc_waste", waste);
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
              <Link to="/" className="text-gray-300 font-medium hover:text-white">Home</Link>
              <Link to="/dashboard" className="text-gray-300 font-medium hover:text-white">Dashboard</Link>
              <Link to="/profile" className="text-gray-300 font-medium hover:text-white">Profile</Link>
              <Link to="/calculate" className="text-green-500 font-medium hover:text-green-400">Calculate</Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-16">
          <h2 className="text-4xl font-extrabold text-white">Calculate Your Carbon Footprint</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl">
            Fill in your daily habits and lifestyle details to estimate your carbon footprint.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-2xl">
            <div>
              <label htmlFor="transport" className="block font-medium mb-2 text-white">Daily Transport (km)</label>
              <input id="transport" type="number" placeholder="e.g., 20" value={formData.transport} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="electricity" className="block font-medium mb-2 text-white">Monthly Electricity Usage (kWh)</label>
              <input id="electricity" type="number" placeholder="e.g., 200" value={formData.electricity} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="diet" className="block font-medium mb-2 text-white">Diet Type</label>
              <select id="diet" value={formData.diet} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="1.5">Vegetarian (~1.5 tons CO₂/year)</option>
                <option value="1.0">Vegan (~1.0 tons CO₂/year)</option>
                <option value="2.5">Mixed (~2.5 tons CO₂/year)</option>
                <option value="3.5">High Meat (~3.5 tons CO₂/year)</option>
              </select>
            </div>
            <div>
              <label htmlFor="flights" className="block font-medium mb-2 text-white">Flights Taken Last Year</label>
              <input id="flights" type="number" placeholder="e.g., 2" value={formData.flights} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="waste" className="block font-medium mb-2 text-white">Average Waste Generated (kg/week)</label>
              <input id="waste" type="number" placeholder="e.g., 5" value={formData.waste} onChange={handleChange} className="w-full p-4 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <button type="submit" className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 active:scale-95">
                Calculate
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-8 p-6 rounded-xl shadow-lg bg-gray-900/80 border border-gray-700 max-w-2xl">
              <h3 className="text-2xl font-bold text-white">Your Estimated Annual Carbon Footprint:</h3>
              <p className="mt-4 text-lg text-green-400 font-extrabold">{result}</p>
              <Link to="/setgoals" className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-transform transform hover:scale-105 active:scale-95">
                Set Goals
              </Link>
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

export default Calculate;
