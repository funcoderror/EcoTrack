import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router';
import { usersAPI, activitiesAPI } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const statsResponse = await usersAPI.getStats();
      setStats(statsResponse.data);

      // Fetch recent activities
      const activitiesResponse = await activitiesAPI.getActivities({ limit: 5 });
      setRecentActivities(activitiesResponse.data.activities);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="bg-black font-display text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-black font-display text-gray-200">
      <div className="flex flex-col min-h-screen">
        {/* Header Section */}
        <header className="w-full border-b border-gray-800">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/dashboard" className="flex items-center gap-3">
              <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                <path fill="currentColor" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"/>
              </svg>
              <h1 className="text-2xl font-bold text-white">Ecotrack</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-green-500 font-medium">Dashboard</Link>
              <Link to="/activities" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Activities</Link>
              <Link to="/profile" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Profile</Link>
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-700">
                <span className="text-sm text-gray-400">Welcome, {user?.first_name}</span>
                <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white transition-colors">
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Track your carbon footprint and environmental impact</p>
          </div>    
      {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Emissions</p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.overall?.total_emissions ? `${parseFloat(stats.overall.total_emissions).toFixed(2)} kg` : '0 kg'}
                  </p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Activities</p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.overall?.total_activities || 0}
                  </p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average per Activity</p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.overall?.avg_emissions ? `${parseFloat(stats.overall.avg_emissions).toFixed(2)} kg` : '0 kg'}
                  </p>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.monthly?.[0]?.monthly_emissions ? `${parseFloat(stats.monthly[0].monthly_emissions).toFixed(2)} kg` : '0 kg'}
                  </p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>       
   {/* Charts and Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Category Breakdown */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">Emissions by Category</h3>
              {stats?.categories && stats.categories.length > 0 ? (
                <div className="space-y-4">
                  {stats.categories.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(category.total_emissions / stats.categories[0].total_emissions) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-400 w-16 text-right">
                          {parseFloat(category.total_emissions).toFixed(1)} kg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No data available. Start tracking your activities!</p>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Recent Activities</h3>
                <Link 
                  to="/activities" 
                  className="text-green-500 hover:text-green-400 text-sm transition-colors"
                >
                  View All
                </Link>
              </div>
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{activity.category_name}</p>
                        <p className="text-gray-400 text-sm">
                          {activity.quantity} {activity.unit} • {new Date(activity.activity_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-red-400 font-medium">
                        {parseFloat(activity.co2_emissions).toFixed(2)} kg CO₂
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No activities recorded yet</p>
                  <Link 
                    to="/activities" 
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add Your First Activity
                  </Link>
                </div>
              )}
            </div>
          </div>      
    {/* Quick Actions */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/activities" 
                className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="bg-green-500/20 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Add Activity</p>
                  <p className="text-gray-400 text-sm">Track new carbon emissions</p>
                </div>
              </Link>

              <Link 
                to="/profile" 
                className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">View Profile</p>
                  <p className="text-gray-400 text-sm">Manage your account</p>
                </div>
              </Link>

              <div className="flex items-center p-4 bg-gray-800 rounded-lg">
                <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">View Reports</p>
                  <p className="text-gray-400 text-sm">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Section */}
        <footer className="bg-black py-6 mt-auto border-t border-gray-800">
          <div className="container mx-auto px-6">
            <p className="text-center text-gray-500">&copy; 2025 Ecotrack. Making the world greener, one track at a time.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;