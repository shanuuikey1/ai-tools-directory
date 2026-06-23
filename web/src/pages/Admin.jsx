import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Loader, Search } from 'lucide-react';
import axios from 'axios';

export default function Admin() {
  const [applications, setApplications] = useState([]);
  const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || '');
  const [loading, setLoading] = useState(!!adminKey);
  const [error, setError] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async (key) => {
    if (!key.trim()) {
      setError('Please enter admin key');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/professionals/applications`, {
        headers: { 'x-admin-key': key },
      });
      setApplications(response.data.applications);
      setAdminKey(key);
      localStorage.setItem('adminKey', key);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications. Check your admin key.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchApplications(adminKey);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetchApplications(keyInput);
  };

  const updateApplicationStatus = async (appId, status, notes = '') => {
    try {
      setUpdating(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.patch(`${apiUrl}/professionals/applications/${appId}`,
        { status, notes },
        { headers: { 'x-admin-key': adminKey } }
      );

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === appId ? { ...app, status, notes } : app
        )
      );
      setSelectedApp(null);
      alert(`Application ${status.toUpperCase()} successfully!`);
    } catch (err) {
      alert('Failed to update application');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    verified: applications.filter(a => a.status === 'verified').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (!adminKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Professional Applications Management</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin API Key</label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter your admin key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                Your admin key is in backend/.env as ADMIN_API_KEY
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Checking...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Professional Applications</h1>
            <button
              onClick={() => {
                localStorage.removeItem('adminKey');
                setAdminKey('');
              }}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Verified</p>
              <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={32} className="text-blue-600 animate-spin" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Experience</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{app.name}</p>
                        <p className="text-sm text-gray-600">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{app.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{app.experience} years</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{app.price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'verified' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status === 'pending' && <Clock size={14} />}
                        {app.status === 'verified' && <CheckCircle size={14} />}
                        {app.status === 'rejected' && <XCircle size={14} />}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedApp.name}</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{selectedApp.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Service</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedApp.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Experience</p>
                  <p className="font-medium text-gray-900">{selectedApp.experience} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Base Price</p>
                  <p className="font-medium text-gray-900">₹{selectedApp.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Applied On</p>
                  <p className="font-medium text-gray-900">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Status</p>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  selectedApp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedApp.status === 'verified' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedApp.status === 'pending' && <Clock size={16} />}
                  {selectedApp.status === 'verified' && <CheckCircle size={16} />}
                  {selectedApp.status === 'rejected' && <XCircle size={16} />}
                  {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}
                </span>
              </div>

              {/* Notes */}
              {selectedApp.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Notes</p>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedApp.notes}</p>
                </div>
              )}

              {/* Actions */}
              {selectedApp.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => updateApplicationStatus(selectedApp.id, 'verified')}
                    disabled={updating}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all disabled:bg-gray-400 font-semibold"
                  >
                    {updating ? 'Updating...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApp.id, 'rejected')}
                    disabled={updating}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all disabled:bg-gray-400 font-semibold"
                  >
                    {updating ? 'Updating...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
