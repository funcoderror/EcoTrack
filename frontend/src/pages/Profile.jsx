import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router';
import { usersAPI } from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await usersAPI.updateProfile(profile.firstName, profile.lastName);
      setMessage('Profile updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Network error. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

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
              <Link to="/dashboard" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Dashboard</Link>
              <Link to="/calculate" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Calculate</Link>
              <Link to="/activities" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Activities</Link>
              <Link to="/profile" className="text-green-500 font-medium">Profile</Link>
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-700">
                <span className="text-sm text-gray-400">Welcome, {user?.first_name}</span>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium">
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="animate-fadeInDown">
              <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
              <p className="text-gray-400">Manage your account information</p>
            </div>

      {/* Profile Form */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 animate-fadeInUp animate-delay-100">
        <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Messages */}
          {message && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">{message}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Account Stats */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 animate-fadeInUp animate-delay-200">
        <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center p-4 bg-gray-800 rounded-lg">
            <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Member Since</p>
              <p className="text-gray-400 text-sm">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-800 rounded-lg">
            <div className="bg-green-500/20 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Account Status</p>
              <p className="text-green-400 text-sm">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gray-900 rounded-lg p-6 border border-red-800 animate-fadeInUp animate-delay-300">
        <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
        <p className="text-gray-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          onClick={() => alert('Account deletion is not implemented yet.')}
        >
          Delete Account
        </button>
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

export default Profile;