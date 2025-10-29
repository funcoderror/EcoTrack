import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    // Validation logic from your script
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{8,}$/;

    if (!username.trim()) {
        setError('Username is required.');
        return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain one letter and one number.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // --- Demo Sign-up Logic ---
    // In a real application, you would make an API call here to register the user.
    // For this example, we'll just log it and redirect.
    console.log('Sign up successful for:', { username, email });

    // Redirect to the login page after a successful sign-up
    // You might want to show a success message first.
    navigate('/login');
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
              <Link to="/contact" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Contact</Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">Create Your Account</h2>
              <p className="mt-2 text-sm text-gray-400">Join Ecotrack to start your sustainability journey</p>
            </div>

            <form onSubmit={handleSignUp} className="mt-8 space-y-6">
              <div className="rounded-lg space-y-4">
                 <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Email Address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

               {/* Error Message Display */}
              {error && (
                <div className="text-sm text-red-400 text-center p-3 bg-red-500/10 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 active:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-green-500 hover:text-green-400 transition-colors">
                  Log In
                </Link>
              </p>
            </div>
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

export default SignUp;

