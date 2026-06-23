import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, Phone, LogOut, Trash2, AlertTriangle } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setError('Please enter your password to confirm.');
      return;
    }
    setDeleting(true);
    setError('');
    try {
      await authAPI.deleteAccount(password);
      logout();
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not delete your account. Please try again.'
      );
      setDeleting(false);
    }
  };

  const closeModal = () => {
    if (deleting) return;
    setShowDelete(false);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <p className="text-lg text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-blue-600" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-blue-600" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <p className="text-gray-900">{user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Account Status</h3>
            <p className="text-green-600 text-sm">✓ Account Verified</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">5.0</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">₹0</p>
              <p className="text-sm text-gray-600">Spent</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
              Edit Profile
            </button>
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center space-x-2"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {/* Help */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-2 text-sm">
              <p>
                Email:{' '}
                <span className="text-blue-600">shanuuikey1@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete your account and personal data. This cannot be
              undone.
            </p>
            <button
              onClick={() => setShowDelete(true)}
              className="w-full px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold flex items-center justify-center space-x-2"
            >
              <Trash2 size={20} />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={22} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Delete your account?
              </h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              This permanently deletes your account and personal data. Records
              we are legally required to keep (such as paid transactions for
              tax) are anonymised, not removed. This action cannot be undone.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm your password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={deleting}
              autoFocus
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
              placeholder="Your password"
            />

            {error && (
              <p className="text-sm text-red-600 mb-3">{error}</p>
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={closeModal}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
