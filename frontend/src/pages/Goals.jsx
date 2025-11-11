import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router';
import { goalsAPI } from '../services/api';

const Goals = () => {
  // Add CSS animations
  const styles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInFromRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .animate-fadeInUp {
      animation: fadeInUp 0.3s ease-out forwards;
    }
    
    .animate-slideInFromRight {
      animation: slideInFromRight 0.3s ease-out forwards;
    }
  `;

  // Inject styles
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    if (!document.head.querySelector('style[data-goals-styles]')) {
      styleSheet.setAttribute('data-goals-styles', 'true');
      document.head.appendChild(styleSheet);
    }
  }
  const { user, logout } = useAuth();
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    categoryId: '',
    description: '',
    quantity: '',
    activityDate: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchGoals();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await goalsAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const params = {
        limit: 20,
        ...filters
      };

      const response = await goalsAPI.getGoals(params);
      setGoals(response.data.goals);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const selectedCategory = categories.find(cat => cat.id == formData.categoryId);

      if (editingGoal) {
        const response = await goalsAPI.updateGoal(
          editingGoal.id,
          formData.categoryId,
          formData.description,
          formData.quantity,
          formData.activityDate
        );

        // Optimistic update
        setGoals(prev => prev.map(goal =>
          goal.id === editingGoal.id
            ? { ...goal, ...response.data.goal }
            : goal
        ));

        setSuccessMessage('Goal updated successfully!');
      } else {
        const response = await goalsAPI.createGoal(
          formData.categoryId,
          formData.description,
          formData.quantity,
          formData.activityDate
        );

        // Optimistic update - add new goal to the beginning of the list
        const newGoal = {
          ...response.data.goal,
          category_name: selectedCategory?.name,
          unit: selectedCategory?.unit
        };
        setGoals(prev => [newGoal, ...prev]);

        setSuccessMessage('Goal added successfully!');
      }

      // Reset form and close modal
      resetForm();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Failed to save goal:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to save goal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      categoryId: goal.category_id || '',
      description: goal.description || '',
      quantity: goal.quantity || '',
      activityDate: goal.activity_date || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      // Optimistic update - remove from UI immediately
      setGoals(prev => prev.filter(goal => goal.id !== id));

      await goalsAPI.deleteGoal(id);
      setSuccessMessage('Goal deleted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Failed to delete goal:', error);
      // Revert optimistic update on error
      fetchGoals();
      setErrorMessage('Failed to delete goal. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingGoal(null);
    setSubmitting(false);
    setErrorMessage('');
    setFormData({
      categoryId: '',
      description: '',
      quantity: '',
      activityDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="bg-black font-display text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading goals...</div>
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
                <path fill="currentColor" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" />
              </svg>
              <h1 className="text-2xl font-bold text-white">Ecotrack</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Dashboard</Link>
              <Link to="/calculate" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Calculate</Link>
              <Link to="/goals" className="text-green-500 font-medium">Goals</Link>
              <Link to="/profile" className="text-gray-300 font-medium hover:text-white hover:scale-105 transition-all duration-300">Profile</Link>
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
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMessage}
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Goals</h1>
              <p className="text-gray-400">Track and manage your carbon footprint goals</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Goals
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Add/Edit Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-800 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {editingGoal ? 'Edit Goal' : 'Add New Goal'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {errorMessage && (
                  <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 rounded text-sm">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.activityDate}
                      onChange={(e) => setFormData({ ...formData, activityDate: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting && (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {submitting
                        ? (editingGoal ? 'Updating...' : 'Adding...')
                        : (editingGoal ? 'Update Goal' : 'Add Goal')
                      }
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={submitting}
                      className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Goals List */}
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            {goals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        CO₂ Emissions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {goals.map((goal, index) => (
                      <tr
                        key={goal.id}
                        className="hover:bg-gray-800 transition-colors duration-200"
                        style={{
                          animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {goal.category_name}
                            </div>
                            {goal.description && (
                              <div className="text-sm text-gray-400 ml-4">
                                {goal.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className="bg-gray-800 px-2 py-1 rounded text-xs">
                            {goal.quantity} {goal.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className="text-red-400 bg-red-900/20 px-2 py-1 rounded text-xs">
                            {parseFloat(goal.co2_emissions).toFixed(2)} kg CO₂
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(goal.activity_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(goal)}
                              className="text-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-105 px-2 py-1 rounded hover:bg-blue-900/20"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(goal.id)}
                              className="text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-105 px-2 py-1 rounded hover:bg-red-900/20"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-300">No goals</h3>
                <p className="mt-1 text-sm text-gray-400">Get started by adding your first goal.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            )}
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

export default Goals;