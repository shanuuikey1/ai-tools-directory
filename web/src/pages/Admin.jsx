import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader,
  Search,
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  PlusCircle,
  Layers,
  Calendar,
  MapPin,
  Star,
  Lock,
  ChevronRight,
  Filter,
  ShieldAlert,
  Trash2,
  Edit,
  UserCheck,
  UserX,
  RefreshCw,
} from 'lucide-react';
import { professionalsAPI, adminAPI, servicesAPI } from '../services/api';
import SEO from '../components/SEO';

export default function Admin() {
  const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || '');
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(!!adminKey);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Dashboard Tabs: 'overview', 'applications', 'providers', 'customers', 'bookings', 'services'
  const [activeTab, setActiveTab] = useState('overview');

  // Data States
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [providers, setProviders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  // Filter/Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Action Modals & Drawers
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingApp, setUpdatingApp] = useState(false);
  const [appNotes, setAppNotes] = useState('');

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [updatingProvider, setUpdatingProvider] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [updatingCustomer, setUpdatingCustomer] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingBooking, setUpdatingBooking] = useState(false);
  const [reassigningProviderId, setReassigningProviderId] = useState('');

  const [togglingServiceId, setTogglingServiceId] = useState(null);

  // Add/Edit Service Form Drawers
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Cleaning',
    description: '',
    basePrice: '',
    imageUrl: '',
  });
  const [submittingService, setSubmittingService] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // stores service ID to delete
  const [deletingService, setDeletingService] = useState(false);

  // Fetch all dashboard data
  const fetchDashboardData = async (key) => {
    if (!key.trim()) {
      setError('Please enter admin key');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Fetch all administrative datasets in parallel
      const [statsRes, appsRes, providersRes, bookingsRes, servicesRes, customersRes] = await Promise.all([
        adminAPI.getStats(key),
        professionalsAPI.getApplications(key),
        adminAPI.getProviders(key),
        adminAPI.getBookings(key),
        adminAPI.getServices(key),
        adminAPI.getCustomers(key),
      ]);

      setStats(statsRes.data.stats);
      setApplications(appsRes.data.applications);
      setProviders(providersRes.data.providers);
      setBookings(bookingsRes.data.bookings);
      setServices(servicesRes.data.services);
      setCustomers(customersRes.data.customers);

      setAdminKey(key);
      localStorage.setItem('adminKey', key);
    } catch (err) {
      setAdminKey('');
      localStorage.removeItem('adminKey');
      setError(err.response?.data?.message || 'Authentication failed. Please check your admin key.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchDashboardData(adminKey);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetchDashboardData(keyInput);
  };

  const handleLogout = () => {
    setAdminKey('');
    localStorage.removeItem('adminKey');
    setStats(null);
    setApplications([]);
    setProviders([]);
    setCustomers([]);
    setBookings([]);
    setServices([]);
  };

  // 1. Update Professional Onboarding Application Status
  const handleUpdateAppStatus = async (appId, status) => {
    try {
      setUpdatingApp(true);
      await professionalsAPI.updateStatus(appId, status, appNotes, adminKey);

      setSuccessMessage(`Application marked as ${status}`);
      setTimeout(() => setSuccessMessage(''), 3000);

      fetchDashboardData(adminKey);
      setSelectedApp(null);
      setAppNotes('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application');
    } finally {
      setUpdatingApp(false);
    }
  };

  // 2. Update Service Provider Verification Status
  const handleUpdateProviderStatus = async (providerId, status) => {
    try {
      setUpdatingProvider(true);
      await adminAPI.verifyProvider(providerId, status, adminKey);

      setSuccessMessage(`Provider verification status updated to ${status}`);
      setTimeout(() => setSuccessMessage(''), 3000);

      fetchDashboardData(adminKey);
      setSelectedProvider(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update provider status');
    } finally {
      setUpdatingProvider(false);
    }
  };

  // 3. Toggle Customer Account Suspension
  const handleToggleCustomerStatus = async (customerId, currentStatus) => {
    try {
      setUpdatingCustomer(true);
      await adminAPI.toggleCustomer(customerId, !currentStatus, adminKey);

      setSuccessMessage(`Customer account has been ${!currentStatus ? 'activated' : 'suspended'}`);
      setTimeout(() => setSuccessMessage(''), 3000);

      fetchDashboardData(adminKey);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update customer status');
    } finally {
      setUpdatingCustomer(false);
    }
  };

  // 4. Update Booking Overrides (Status / Payment Status)
  const handleUpdateBookingOverrides = async (bookingId, newJobStatus, newPaymentStatus) => {
    try {
      setUpdatingBooking(true);
      const updateData = {};
      if (newJobStatus) updateData.status = newJobStatus;
      if (newPaymentStatus) updateData.payment_status = newPaymentStatus;

      await adminAPI.updateBooking(bookingId, updateData, adminKey);

      setSuccessMessage('Booking overrides applied successfully');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh data
      fetchDashboardData(adminKey);
      
      // Update selected booking modal state
      if (selectedBooking) {
        setSelectedBooking(prev => ({
          ...prev,
          status: newJobStatus || prev.status,
          payment_status: newPaymentStatus || prev.payment_status,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply overrides');
    } finally {
      setUpdatingBooking(false);
    }
  };

  // 5. Reassign Service Provider to Booking
  const handleReassignProvider = async (e) => {
    e.preventDefault();
    if (!reassigningProviderId) return;

    try {
      setUpdatingBooking(true);
      await adminAPI.reassignBooking(selectedBooking.id, parseInt(reassigningProviderId), adminKey);

      setSuccessMessage('Service provider reassigned successfully');
      setTimeout(() => setSuccessMessage(''), 3000);

      fetchDashboardData(adminKey);
      
      // Refresh the selected booking modal view
      const updatedB = bookings.find(b => b.id === selectedBooking.id);
      setSelectedBooking(updatedB);
      setReassigningProviderId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reassign provider');
    } finally {
      setUpdatingBooking(false);
    }
  };

  // 6. Toggle Service Catalogue Active Status
  const handleToggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      setTogglingServiceId(serviceId);
      await adminAPI.toggleService(serviceId, !currentStatus, adminKey);

      setSuccessMessage('Service availability status updated');
      setTimeout(() => setSuccessMessage(''), 3000);

      fetchDashboardData(adminKey);
    } catch (err) {
      setError('Failed to update service status');
    } finally {
      setTogglingServiceId(null);
    }
  };

  // 7. Add or Edit Service Submit
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.category || !serviceForm.basePrice) {
      setError('Name, category, and price are required');
      return;
    }

    try {
      setSubmittingService(true);
      setError('');
      
      const payload = {
        name: serviceForm.name,
        category: serviceForm.category,
        description: serviceForm.description,
        basePrice: parseFloat(serviceForm.basePrice),
        imageUrl: serviceForm.imageUrl || null,
      };

      if (showEditService && selectedServiceId) {
        // Edit flow
        await adminAPI.updateService(selectedServiceId, payload, adminKey);
        setSuccessMessage('Service updated successfully');
      } else {
        // Create flow
        await servicesAPI.create(payload, adminKey);
        setSuccessMessage('New service added to catalogue');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);

      // Reset form & state
      setServiceForm({
        name: '',
        category: 'Cleaning',
        description: '',
        basePrice: '',
        imageUrl: '',
      });
      setShowAddService(false);
      setShowEditService(false);
      setSelectedServiceId(null);
      fetchDashboardData(adminKey);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service catalogue item');
    } finally {
      setSubmittingService(false);
    }
  };

  // 8. Open Edit Service Modal
  const openEditServiceModal = (service) => {
    setServiceForm({
      name: service.name,
      category: service.category,
      description: service.description || '',
      basePrice: service.base_price.toString(),
      imageUrl: service.imageUrl || '',
    });
    setSelectedServiceId(service.id);
    setShowEditService(true);
  };

  // 9. Delete Service
  const handleDeleteService = async () => {
    if (!showDeleteConfirm) return;

    try {
      setDeletingService(true);
      setError('');
      await adminAPI.deleteService(showDeleteConfirm, adminKey);
      
      setSuccessMessage('Service deleted from catalogue');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      fetchDashboardData(adminKey);
      setShowDeleteConfirm(null);
    } catch (err) {
      // If service is linked to bookings, backend deactivates it and returns 400
      setError(err.response?.data?.message || 'Failed to delete service catalogue item');
      fetchDashboardData(adminKey);
      setShowDeleteConfirm(null);
    } finally {
      setDeletingService(false);
    }
  };

  // Helper formatting functions
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Filtering datasets based on search queries and filter dropdowns
  const filteredApps = applications.filter((app) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      app.name.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      app.phone.includes(query) ||
      app.service.toLowerCase().includes(query);
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredProviders = providers.filter((p) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.phone.includes(query);
    const matchesFilter = filterStatus === 'all' || p.verification_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredCustomers = customers.filter((c) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      (c.first_name || '').toLowerCase().includes(query) ||
      (c.last_name || '').toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query);
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && c.is_active) ||
      (filterStatus === 'suspended' && !c.is_active);
    return matchesSearch && matchesFilter;
  });

  const filteredBookings = bookings.filter((b) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      b.id.toString().includes(query) ||
      b.User?.first_name?.toLowerCase().includes(query) ||
      b.User?.last_name?.toLowerCase().includes(query) ||
      b.ServiceProvider?.name?.toLowerCase().includes(query) ||
      b.Service?.name?.toLowerCase().includes(query);
    const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate stats for custom SVG analytics charts
  const getCategoryStats = () => {
    const counts = {};
    bookings.forEach((b) => {
      if (b.status === 'completed') {
        const cat = b.Service?.category || 'General';
        counts[cat] = (counts[cat] || 0) + parseFloat(b.service_price || 0);
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getStatusStats = () => {
    const statusMap = { pending: 0, accepted: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b) => {
      if (statusMap[b.status] !== undefined) {
        statusMap[b.status] += 1;
      }
    });
    return Object.entries(statusMap).map(([name, count]) => ({ name, count }));
  };

  // Login Screen (redesigned to match site theme with glowing ambient blobs)
  if (!adminKey) {
    return (
      <>
        <SEO title="Admin Login" description="Access the Ghar Pahuch Seva administration dashboard." />
        <div className="min-h-screen bg-slate-50 text-gray-900 flex items-center justify-center px-4 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
          {/* Ambient Glowing Blobs matching the site */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-300/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sky-300/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none" />

          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-8 w-full max-w-md shadow-[0_15px_50px_rgba(0,0,0,0.05)] relative z-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-indigo-600/25 border border-white/20">
                <Lock size={28} className="text-white animate-pulse" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 text-center tracking-tight leading-tight">
                Platform Admin
              </h1>
              <p className="text-gray-500 text-sm mt-2 text-center font-medium">
                Enter secure administrative credentials to access the Operations Control Center
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200/60 rounded-2xl flex items-start space-x-3 text-red-700 animate-fade-in" role="alert">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p className="text-xs font-semibold leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="adminKey" className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2.5">
                  Secret Admin API Key
                </label>
                <input
                  id="adminKey"
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 text-center font-mono tracking-widest placeholder:tracking-normal transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <span>Access Control Panel</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // Active providers matching the selected booking category (for reassignment)
  const availableReassignProviders = selectedBooking
    ? providers.filter(
        (p) =>
          p.verification_status === 'verified' &&
          p.is_active &&
          (p.service_categories || [])
            .map((cat) => cat.toLowerCase())
            .includes((selectedBooking.Service?.category || '').toLowerCase())
      )
    : [];

  return (
    <>
      <SEO title="Admin Control Panel" description="Ghar Pahuch Seva Platform Operations Control Center" />
      <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
        
        {/* Header (premium white glassmorphism matching the site) */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shadow-inner">
                <Activity size={20} className="text-indigo-600" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight text-gray-900 flex items-center gap-2">
                  Ghar Pahuch Seva{' '}
                  <span className="px-2 py-0.5 bg-indigo-100 border border-indigo-200/50 rounded-md text-[10px] text-indigo-700 font-bold uppercase tracking-widest">
                    Admin
                  </span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Operations Control Center
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchDashboardData(adminKey)}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                title="Refresh dashboard data"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-slate-50 transition font-bold text-sm"
              >
                Log Out
              </button>
            </div>
          </div>
        </header>

        {/* Global Notifications */}
        {successMessage && (
          <div className="bg-emerald-600 text-white text-center py-2.5 text-xs font-bold animate-fade-in relative z-50 shadow-md">
            ✓ {successMessage}
          </div>
        )}

        {/* Main Dashboard Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Dashboard Navigation Tabs */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-1.5 flex gap-1 mb-8 shadow-sm overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
              {
                id: 'applications',
                label: `Applications (${applications.filter((a) => a.status === 'pending').length})`,
                icon: <Briefcase size={16} />,
              },
              { id: 'providers', label: 'Service Providers', icon: <Users size={16} /> },
              { id: 'customers', label: 'Customers', icon: <Users size={16} /> },
              { id: 'bookings', label: 'Bookings Log', icon: <Calendar size={16} /> },
              { id: 'services', label: 'Services Catalogue', icon: <Layers size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Error Message banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200/60 rounded-2xl flex items-start space-x-3 text-red-700" role="alert">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <p className="text-xs font-semibold leading-relaxed">{error}</p>
            </div>
          )}

          {/* Loading Mask */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <Loader size={40} className="text-indigo-600 animate-spin" />
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                Syncing Platform Databases...
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW ANALYTICS */}
              {activeTab === 'overview' && stats && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Financial & Platform KPI Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                        <TrendingUp size={80} className="text-indigo-600" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Total Transaction Volume
                      </p>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                        {formatCurrency(stats.financials.totalRevenue)}
                      </h3>
                      <div className="flex items-center gap-1.5 text-indigo-600 text-[11px] font-semibold mt-4">
                        <CheckCircle size={14} />
                        <span>Gross customer billing</span>
                      </div>
                    </div>

                    {/* Platform Earnings Card */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                        <Activity size={80} className="text-blue-600" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Platform Commission (25%)
                      </p>
                      <h3 className="text-2xl font-black text-blue-600 tracking-tight">
                        {formatCurrency(stats.financials.platformEarnings)}
                      </h3>
                      <div className="flex items-center gap-1.5 text-blue-600 text-[11px] font-semibold mt-4">
                        <Activity size={14} />
                        <span>Net platform revenue</span>
                      </div>
                    </div>

                    {/* Provider Earnings Card */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                        <Users size={80} className="text-emerald-600" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Worker Payouts (75%)
                      </p>
                      <h3 className="text-2xl font-black text-emerald-600 tracking-tight">
                        {formatCurrency(stats.financials.providerEarnings)}
                      </h3>
                      <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold mt-4">
                        <CheckCircle size={14} />
                        <span>Distributed to professionals</span>
                      </div>
                    </div>

                    {/* Bookings Counter Card */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                        <Calendar size={80} className="text-amber-500" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Total Platform Jobs
                      </p>
                      <h3 className="text-2xl font-black text-amber-600 tracking-tight">
                        {stats.bookings.total}
                      </h3>
                      <div className="flex items-center gap-1.5 text-amber-600 text-[11px] font-semibold mt-4">
                        <Clock size={14} />
                        <span>{stats.bookings.pending} jobs pending matching</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Category Popularity (Horizontal SVG bars) */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                      <h4 className="font-black text-base text-gray-900 mb-6 flex items-center gap-2">
                        <Layers size={18} className="text-indigo-600" />
                        Revenue Distribution by Category
                      </h4>
                      <div className="space-y-4">
                        {getCategoryStats().length > 0 ? (
                          (() => {
                            const catStats = getCategoryStats();
                            const maxValue = Math.max(...catStats.map((c) => c.value), 1);
                            return catStats.map((cat, idx) => {
                              const pct = (cat.value / maxValue) * 100;
                              return (
                                <div key={idx} className="space-y-1.5">
                                  <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-700">{cat.name}</span>
                                    <span className="text-gray-900">{formatCurrency(cat.value)}</span>
                                  </div>
                                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            });
                          })()
                        ) : (
                          <div className="text-center py-10 text-gray-400 text-xs font-semibold">
                            No completed billing records to map.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking status segmented progress bar */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                      <h4 className="font-black text-base text-gray-900 mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-indigo-600" />
                        Booking Status Pipeline
                      </h4>
                      
                      {bookings.length > 0 ? (
                        (() => {
                          const total = bookings.length;
                          const pCount = bookings.filter(b => b.status === 'pending').length;
                          const aCount = bookings.filter(b => b.status === 'accepted').length;
                          const comCount = bookings.filter(b => b.status === 'completed').length;
                          const canCount = bookings.filter(b => b.status === 'cancelled').length;

                          const pPct = (pCount / total) * 100;
                          const aPct = (aCount / total) * 100;
                          const comPct = (comCount / total) * 100;
                          const canPct = (canCount / total) * 100;

                          return (
                            <div className="space-y-8">
                              {/* Segmented horizontal bar */}
                              <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner">
                                {pCount > 0 && (
                                  <div
                                    style={{ width: `${pPct}%` }}
                                    className="bg-amber-400 hover:opacity-90 transition-opacity"
                                    title={`Pending: ${pCount}`}
                                  />
                                )}
                                {aCount > 0 && (
                                  <div
                                    style={{ width: `${aPct}%` }}
                                    className="bg-blue-500 hover:opacity-90 transition-opacity"
                                    title={`Accepted: ${aCount}`}
                                  />
                                )}
                                {comCount > 0 && (
                                  <div
                                    style={{ width: `${comPct}%` }}
                                    className="bg-emerald-500 hover:opacity-90 transition-opacity"
                                    title={`Completed: ${comCount}`}
                                  />
                                )}
                                {canCount > 0 && (
                                  <div
                                    style={{ width: `${canPct}%` }}
                                    className="bg-rose-400 hover:opacity-90 transition-opacity"
                                    title={`Cancelled: ${canCount}`}
                                  />
                                )}
                              </div>

                              {/* Legends and counts */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                                  <span className="block text-[9px] font-bold uppercase tracking-widest text-amber-800">Pending</span>
                                  <span className="block text-xl font-black text-amber-700 mt-1">{pCount}</span>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                                  <span className="block text-[9px] font-bold uppercase tracking-widest text-blue-800">Accepted</span>
                                  <span className="block text-xl font-black text-blue-700 mt-1">{aCount}</span>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                                  <span className="block text-[9px] font-bold uppercase tracking-widest text-emerald-800">Completed</span>
                                  <span className="block text-xl font-black text-emerald-700 mt-1">{comCount}</span>
                                </div>
                                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
                                  <span className="block text-[9px] font-bold uppercase tracking-widest text-rose-800">Cancelled</span>
                                  <span className="block text-xl font-black text-rose-700 mt-1">{canCount}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="text-center py-12 text-gray-400 text-xs font-semibold">
                          No bookings in pipeline.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operational Summary Breakdown */}
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-black text-base text-gray-900 mb-6">User Database Indexes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div
                        onClick={() => setActiveTab('customers')}
                        className="cursor-pointer flex justify-between items-center p-5 bg-slate-50 hover:bg-indigo-50/40 border border-gray-200/60 hover:border-indigo-100 rounded-2xl transition group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                            <Users size={18} />
                          </div>
                          <div>
                            <span className="block font-black text-sm text-gray-900">Platform Customers</span>
                            <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Manage Customer accounts</span>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-gray-900">{stats.totalCustomers}</span>
                      </div>

                      <div
                        onClick={() => setActiveTab('providers')}
                        className="cursor-pointer flex justify-between items-center p-5 bg-slate-50 hover:bg-indigo-50/40 border border-gray-200/60 hover:border-indigo-100 rounded-2xl transition group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                            <Briefcase size={18} />
                          </div>
                          <div>
                            <span className="block font-black text-sm text-gray-900">Service Providers</span>
                            <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Verify & Audit Workers</span>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-gray-900">{stats.totalProviders}</span>
                      </div>

                      <div
                        onClick={() => setActiveTab('applications')}
                        className="cursor-pointer flex justify-between items-center p-5 bg-slate-50 hover:bg-indigo-50/40 border border-gray-200/60 hover:border-indigo-100 rounded-2xl transition group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                            <Layers size={18} />
                          </div>
                          <div>
                            <span className="block font-black text-sm text-gray-900">Onboarding Applications</span>
                            <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Review pending applicants</span>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-gray-900">{stats.totalApplications}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROFESSIONAL APPLICATIONS */}
              {activeTab === 'applications' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-gray-200/80 rounded-2xl shadow-sm">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search by worker name, email, phone or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-900 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Filter size={14} className="text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-700 font-bold tracking-wide"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending Review</option>
                        <option value="verified">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Applications Grid */}
                  {filteredApps.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredApps.map((app) => (
                        <div
                          key={app.id}
                          className="bg-white border border-gray-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-gray-300/80 transition-all duration-300"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-black text-base text-gray-900">{app.name}</h3>
                                <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Applied: {formatDate(app.createdAt)}</p>
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${
                                  app.status === 'pending'
                                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                                    : app.status === 'verified'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-rose-50 border-rose-200 text-rose-700'
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>

                            <div className="space-y-2 text-xs text-gray-700 border-t border-gray-100 pt-4 mt-4">
                              <p>
                                <strong className="text-gray-400 uppercase text-[9px] tracking-wide block mb-0.5">Requested Category</strong>
                                <span className="font-bold text-indigo-600 capitalize">{app.service}</span>
                              </p>
                              <p>
                                <strong className="text-gray-400 uppercase text-[9px] tracking-wide block mb-0.5">Experience</strong>
                                <span className="font-semibold text-gray-900">{app.experience} Years</span>
                              </p>
                              <p>
                                <strong className="text-gray-400 uppercase text-[9px] tracking-wide block mb-0.5">Proposed Pricing</strong>
                                <span className="font-bold text-gray-900">{formatCurrency(app.price)}</span>
                              </p>
                              <p>
                                <strong className="text-gray-400 uppercase text-[9px] tracking-wide block mb-0.5">Contact Details</strong>
                                <span className="font-semibold text-gray-900">{app.phone} • {app.email}</span>
                              </p>
                              {app.notes && (
                                <div className="mt-3 p-3 bg-slate-50 border border-gray-200/50 rounded-xl text-[10px] text-gray-500 leading-relaxed font-medium">
                                  <strong className="text-gray-700 font-bold block mb-1">Administrative Notes:</strong>
                                  {app.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          {app.status === 'pending' && (
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="w-full mt-6 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-indigo-600/10"
                            >
                              Review & Action
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
                      <Briefcase size={44} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                        No onboarding applications found
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SERVICE PROVIDERS */}
              {activeTab === 'providers' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-gray-200/80 rounded-2xl shadow-sm">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search by worker name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-900 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Filter size={14} className="text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-700 font-bold tracking-wide"
                      >
                        <option value="all">All Verification Statuses</option>
                        <option value="verified">Verified/Approved</option>
                        <option value="pending">Pending Verification</option>
                        <option value="rejected">Suspended/Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Providers Database table */}
                  {filteredProviders.length > 0 ? (
                    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50/70 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200/80">
                              <th className="p-4 font-black">Provider Name</th>
                              <th className="p-4 font-black">Categories Served</th>
                              <th className="p-4 font-black">Contact Info</th>
                              <th className="p-4 text-center font-black">Rating</th>
                              <th className="p-4 text-center font-black">Completed Jobs</th>
                              <th className="p-4 font-black">Verification Status</th>
                              <th className="p-4 font-black text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredProviders.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                                <td className="p-4 font-bold text-gray-900">{p.name}</td>
                                <td className="p-4">
                                  <div className="flex flex-wrap gap-1.5">
                                    {(p.service_categories || []).map((cat, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] text-indigo-700 font-bold capitalize"
                                      >
                                        {cat}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="p-4 text-gray-600 font-medium">
                                  <p>{p.phone}</p>
                                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{p.email}</p>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                                    <Star size={12} className="fill-amber-500" />
                                    <span>{p.rating} / 5</span>
                                  </div>
                                </td>
                                <td className="p-4 text-center font-bold text-gray-800">{p.total_services}</td>
                                <td className="p-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${
                                      p.verification_status === 'verified'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : p.verification_status === 'pending'
                                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                                        : 'bg-rose-50 border-rose-200 text-rose-700'
                                    }`}
                                  >
                                    {p.verification_status}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex justify-end gap-2.5">
                                    {p.verification_status !== 'verified' && (
                                      <button
                                        onClick={() => handleUpdateProviderStatus(p.id, 'verified')}
                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] transition-all shadow-sm"
                                      >
                                        Verify
                                      </button>
                                    )}
                                    {p.verification_status !== 'rejected' && (
                                      <button
                                        onClick={() => handleUpdateProviderStatus(p.id, 'rejected')}
                                        className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100/60 rounded-lg transition-all font-bold text-[10px]"
                                      >
                                        Suspend
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
                      <Users size={44} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                        No service providers found
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CUSTOMERS (NEW!) */}
              {activeTab === 'customers' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-gray-200/80 rounded-2xl shadow-sm">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search by customer name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-900 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Filter size={14} className="text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-700 font-bold tracking-wide"
                      >
                        <option value="all">All Accounts</option>
                        <option value="active">Active Accounts</option>
                        <option value="suspended">Suspended Accounts</option>
                      </select>
                    </div>
                  </div>

                  {/* Customers database table */}
                  {filteredCustomers.length > 0 ? (
                    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50/70 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200/80">
                              <th className="p-4 font-black">Customer Name</th>
                              <th className="p-4 font-black">Email ID</th>
                              <th className="p-4 font-black">Phone Number</th>
                              <th className="p-4 font-black">Registration Date</th>
                              <th className="p-4 text-center font-black">Total Bookings</th>
                              <th className="p-4 font-black">Account Status</th>
                              <th className="p-4 font-black text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.map((cust) => (
                              <tr key={cust.id} className="hover:bg-slate-50/40 transition-colors">
                                <td className="p-4 font-bold text-gray-900">
                                  {cust.first_name || cust.last_name
                                    ? `${cust.first_name || ''} ${cust.last_name || ''}`
                                    : 'Guest Account'}
                                </td>
                                <td className="p-4 text-gray-700 font-semibold">{cust.email}</td>
                                <td className="p-4 text-gray-600 font-semibold">{cust.phone}</td>
                                <td className="p-4 text-gray-500 font-medium">{formatDate(cust.createdAt)}</td>
                                <td className="p-4 text-center font-bold text-gray-800">{cust.total_bookings}</td>
                                <td className="p-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${
                                      cust.is_active
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-rose-50 border-rose-200 text-rose-700'
                                    }`}
                                  >
                                    {cust.is_active ? 'Active' : 'Suspended'}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleToggleCustomerStatus(cust.id, cust.is_active)}
                                    disabled={updatingCustomer}
                                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 ml-auto ${
                                      cust.is_active
                                        ? 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100/60'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-transparent'
                                    }`}
                                  >
                                    {cust.is_active ? (
                                      <>
                                        <UserX size={12} />
                                        <span>Suspend</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck size={12} />
                                        <span>Reactivate</span>
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
                      <Users size={44} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                        No customers found
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: BOOKINGS LOG */}
              {activeTab === 'bookings' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-gray-200/80 rounded-2xl shadow-sm">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search by Booking ID, customer, provider or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-900 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Filter size={14} className="text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-700 font-bold tracking-wide"
                      >
                        <option value="all">All Job Statuses</option>
                        <option value="pending">Pending Jobs</option>
                        <option value="accepted">Accepted/Active</option>
                        <option value="completed">Completed Jobs</option>
                        <option value="cancelled">Cancelled Jobs</option>
                      </select>
                    </div>
                  </div>

                  {/* Bookings log table */}
                  {filteredBookings.length > 0 ? (
                    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50/70 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200/80">
                              <th className="p-4 font-black">ID</th>
                              <th className="p-4 font-black">Service Details</th>
                              <th className="p-4 font-black">Customer</th>
                              <th className="p-4 font-black">Service Provider</th>
                              <th className="p-4 font-black">Date & Time</th>
                              <th className="p-4 text-center font-black">Amount</th>
                              <th className="p-4 text-center font-black">Commission (25%)</th>
                              <th className="p-4 font-black">Job Status</th>
                              <th className="p-4 font-black">Payment</th>
                              <th className="p-4 font-black text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredBookings.map((b) => (
                              <tr key={b.id} className="hover:bg-slate-50/40 transition-colors">
                                <td className="p-4 font-mono text-[10px] text-gray-400 font-bold">#{b.id}</td>
                                <td className="p-4">
                                  <p className="font-bold text-gray-900">{b.Service?.name}</p>
                                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
                                    {b.Service?.category}
                                  </p>
                                </td>
                                <td className="p-4 text-gray-700 font-medium">
                                  <p className="font-bold text-gray-900">
                                    {b.User?.first_name} {b.User?.last_name}
                                  </p>
                                  <p className="text-[10px] text-gray-400">{b.User?.phone}</p>
                                </td>
                                <td className="p-4 text-gray-700 font-medium">
                                  {b.ServiceProvider ? (
                                    <>
                                      <p className="font-bold text-gray-900">{b.ServiceProvider?.name}</p>
                                      <p className="text-[10px] text-gray-400">{b.ServiceProvider?.phone}</p>
                                    </>
                                  ) : (
                                    <span className="text-gray-400 italic">Unassigned</span>
                                  )}
                                </td>
                                <td className="p-4 text-gray-600 font-medium">
                                  <p>{formatDate(b.service_date)}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">{b.service_time}</p>
                                </td>
                                <td className="p-4 text-center font-extrabold text-gray-900">
                                  {formatCurrency(b.service_price)}
                                </td>
                                <td className="p-4 text-center font-extrabold text-indigo-600">
                                  {formatCurrency(b.platform_commission)}
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${
                                      b.status === 'completed'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : b.status === 'pending'
                                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                                        : b.status === 'accepted'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-rose-50 border-rose-200 text-rose-700'
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${
                                      b.payment_status === 'completed'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : b.payment_status === 'failed'
                                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                                        : 'bg-amber-50 border-amber-200 text-amber-700'
                                    }`}
                                  >
                                    {b.payment_status === 'completed' ? 'Paid' : b.payment_status}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => {
                                      setSelectedBooking(b);
                                      setReassigningProviderId('');
                                    }}
                                    className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100/60 rounded-lg font-bold text-[10px] transition-all"
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
                      <Calendar size={44} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                        No bookings logged yet
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: SERVICES CATALOGUE */}
              {activeTab === 'services' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Action Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Service Catalogue</h2>
                      <p className="text-gray-500 text-xs font-semibold mt-0.5">
                        Manage standard service offerings, prices, and status.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setServiceForm({
                          name: '',
                          category: 'Cleaning',
                          description: '',
                          basePrice: '',
                          imageUrl: '',
                        });
                        setShowAddService(true);
                      }}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs tracking-wide shadow-sm hover:shadow-indigo-600/15 transition-all flex items-center gap-2"
                    >
                      <PlusCircle size={16} />
                      <span>Add Service</span>
                    </button>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`bg-white border rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 ${
                          service.is_active ? 'border-gray-200/85' : 'border-rose-200/60 bg-rose-50/10'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-black text-base text-gray-900 leading-tight">{service.name}</h3>
                              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-1">
                                {service.category}
                              </p>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${
                                service.is_active
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  : 'bg-rose-50 border-rose-200 text-rose-700'
                              }`}
                            >
                              {service.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 leading-relaxed font-medium mb-6">
                            {service.description || 'No descriptive catalog brief provided.'}
                          </p>

                          <div className="border-t border-gray-100 pt-4 mt-4">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Authoritative Base Price</p>
                            <p className="text-xl font-black text-gray-900 mt-0.5">{formatCurrency(service.base_price)}</p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 font-bold">Catalog ID: #{service.id}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditServiceModal(service)}
                              className="p-2 bg-slate-50 border border-gray-250 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 rounded-lg transition"
                              title="Edit service details"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(service.id)}
                              className="p-2 bg-slate-50 border border-gray-250 text-gray-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 rounded-lg transition"
                              title="Delete service"
                            >
                              <Trash2 size={14} />
                            </button>
                            <button
                              onClick={() => handleToggleServiceStatus(service.id, service.is_active)}
                              disabled={togglingServiceId === service.id}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${
                                service.is_active
                                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/50'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-transparent'
                              }`}
                            >
                              {togglingServiceId === service.id ? (
                                <Loader size={12} className="animate-spin" />
                              ) : service.is_active ? (
                                'Deactivate'
                              ) : (
                                'Activate'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* MODAL 1: APPLICATION REVIEW */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl max-w-lg w-full p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Review Application</h3>
                  <p className="text-gray-500 text-xs mt-1">Audit credentials before validating provider onboarding</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedApp(null);
                    setAppNotes('');
                  }}
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 p-4 border border-gray-200/80 rounded-xl space-y-2.5 text-xs text-gray-700 font-medium">
                <p>
                  <span className="text-gray-400 block uppercase text-[9px] tracking-wide mb-0.5">Applicant Name</span>
                  <strong className="text-gray-900 font-bold">{selectedApp.name}</strong>
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wide mb-0.5">Email ID</span>
                    <strong className="text-gray-900 font-bold">{selectedApp.email}</strong>
                  </p>
                  <p>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wide mb-0.5">Phone Number</span>
                    <strong className="text-gray-900 font-bold">{selectedApp.phone}</strong>
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <p>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wide mb-0.5">Category</span>
                    <strong className="text-indigo-600 font-bold capitalize">{selectedApp.service}</strong>
                  </p>
                  <p>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wide mb-0.5">Experience</span>
                    <strong className="text-gray-900 font-bold">{selectedApp.experience} Years</strong>
                  </p>
                  <p>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wide mb-0.5">Proposed Price</span>
                    <strong className="text-gray-900 font-bold">{formatCurrency(selectedApp.price)}</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">
                  Administrative Evaluation Notes
                </label>
                <textarea
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  placeholder="Record background check confirmations, document checks, or reason for rejection..."
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-900 resize-none font-medium"
                />
              </div>

              <div className="flex gap-4 border-t border-gray-100 pt-4">
                <button
                  onClick={() => handleUpdateAppStatus(selectedApp.id, 'verified')}
                  disabled={updatingApp}
                  className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {updatingApp && <Loader size={14} className="animate-spin" />}
                  Approve Onboarding
                </button>
                <button
                  onClick={() => handleUpdateAppStatus(selectedApp.id, 'rejected')}
                  disabled={updatingApp}
                  className="flex-1 py-3.5 px-4 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100/60 rounded-xl font-bold text-xs tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updatingApp && <Loader size={14} className="animate-spin" />}
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: BOOKING OVERRIDES & REASSIGNMENT */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl max-w-lg w-full p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Manage Booking Overrides</h3>
                  <p className="text-gray-500 text-xs mt-1">Review, override statuses, or reassign providers</p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Booking Brief */}
              <div className="bg-slate-50 p-4 border border-gray-200/80 rounded-xl space-y-3 text-xs text-gray-700 font-medium">
                <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
                  <span className="font-mono text-gray-400 font-bold">Booking ID: #{selectedBooking.id}</span>
                  <span className="font-bold text-indigo-600 capitalize">
                    {selectedBooking.Service?.name} • {selectedBooking.Service?.category}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wide">Customer</span>
                    <strong className="text-gray-900 font-bold">
                      {selectedBooking.User?.first_name} {selectedBooking.User?.last_name}
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wide">Assigned Professional</span>
                    <strong className="text-gray-900 font-bold">
                      {selectedBooking.ServiceProvider?.name || 'Unassigned'}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Overrides form */}
              <div className="space-y-4 pt-2">
                <h4 className="font-black text-xs text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-1.5">
                  Administrative Overrides
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                      Job Status Override
                    </label>
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => handleUpdateBookingOverrides(selectedBooking.id, e.target.value, null)}
                      disabled={updatingBooking}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-750 font-bold"
                    >
                      <option value="pending">Pending Approval</option>
                      <option value="accepted">Accepted / Active</option>
                      <option value="completed">Mark Completed</option>
                      <option value="cancelled">Mark Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                      Payment Status Override
                    </label>
                    <select
                      value={selectedBooking.payment_status}
                      onChange={(e) => handleUpdateBookingOverrides(selectedBooking.id, null, e.target.value)}
                      disabled={updatingBooking}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-750 font-bold"
                    >
                      <option value="pending">Pending Payment</option>
                      <option value="completed">Paid / Settled</option>
                      <option value="failed">Payment Failed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reassignment section */}
              <div className="space-y-4 pt-2">
                <h4 className="font-black text-xs text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-1.5">
                  Reassign Service Provider
                </h4>
                
                {availableReassignProviders.length > 0 ? (
                  <form onSubmit={handleReassignProvider} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                        Select Verified Provider ({selectedBooking.Service?.category})
                      </label>
                      <select
                        value={reassigningProviderId}
                        onChange={(e) => setReassigningProviderId(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-750 font-bold"
                      >
                        <option value="">-- Select Active Worker --</option>
                        {availableReassignProviders.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Rating: {p.rating}★ • Completed: {p.total_services})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={updatingBooking || !reassigningProviderId}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm disabled:opacity-40"
                    >
                      Reassign
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-850 rounded-xl text-xs flex items-start gap-3 leading-relaxed">
                    <ShieldAlert className="shrink-0 text-amber-500" size={16} />
                    <p>
                      No alternative verified, active service providers are currently registered under the{' '}
                      <strong>{selectedBooking.Service?.category}</strong> category to allow reassignment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: ADD/EDIT SERVICE DRAWER */}
        {(showAddService || showEditService) && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl max-w-md w-full p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-gray-900">
                    {showEditService ? 'Edit Catalogue Item' : 'Configure New Service'}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">Set service name, category, and catalog base price</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddService(false);
                    setShowEditService(false);
                    setSelectedServiceId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    placeholder="e.g. Toilet Deep Cleaning"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-900 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                    Service Category
                  </label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-750 font-bold"
                  >
                    <option value="Cleaning">Cleaning</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Beauty">Beauty</option>
                    <option value="AC Repair">AC Repair</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Painting">Painting</option>
                    <option value="Pest Control">Pest Control</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                    Base Catalog Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={serviceForm.basePrice}
                    onChange={(e) => setServiceForm({ ...serviceForm, basePrice: e.target.value })}
                    placeholder="e.g. 499"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-900 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                    Service Description
                  </label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    placeholder="Briefly summarize what task inclusions are covered under this service offering..."
                    rows="3"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs text-gray-900 resize-none transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddService(false);
                      setShowEditService(false);
                      setSelectedServiceId(null);
                    }}
                    className="flex-1 py-3.5 px-4 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingService}
                    className="flex-1 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs tracking-wider shadow-sm flex items-center justify-center gap-2"
                  >
                    {submittingService && <Loader size={14} className="animate-spin" />}
                    {showEditService ? 'Save Changes' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: SERVICE DELETE CONFIRMATION */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl max-w-sm w-full p-6 space-y-6 text-center">
              <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Trash2 size={22} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-black text-gray-900">Delete Service Offering</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-medium">
                  Are you sure you want to remove this service from the catalogue? This action is permanent and cannot be undone.
                </p>
              </div>

              <div className="flex gap-4 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 px-4 border border-gray-200 text-gray-750 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteService}
                  disabled={deletingService}
                  className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {deletingService && <Loader size={14} className="animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
