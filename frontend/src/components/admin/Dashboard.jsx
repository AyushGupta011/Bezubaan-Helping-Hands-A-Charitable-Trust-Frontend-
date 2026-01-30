import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Flag, 
  CreditCard, 
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Eye,
  Clock,
  Shield,
  PawPrint,
  Home,
  Calendar,
  Bell,
  Settings,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Instagram,
  Facebook
} from 'lucide-react';
import { Line, Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './admin-theme.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    fetchDashboardStats();
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        setAdminName(parsed.name || 'Admin');
      } catch (e) {
        setAdminName('Admin');
      }
    }
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = (import.meta.env.DEV && window.location.hostname === 'localhost') 
        ? 'http://localhost:4040' 
        : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040');
      const response = await axios.get(`${baseURL}/api/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard data', { position: 'top-right', autoClose: 3000 });
      // Set empty stats structure on error
      setStats({
        overview: {
          contacts: { total: 0, unread: 0 },
          volunteers: { total: 0, new: 0 },
          reports: { total: 0, open: 0, inProgress: 0 },
          donations: { successful: 0, monthAmount: 0 }
        },
        monthlyDonations: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchDashboardStats();
  };

  // Stats Data - Use real data from API
  const overviewCards = [
    {
      title: 'Total Donations',
      value: `₹${(stats?.overview?.donations?.monthAmount || 0).toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'from-orange-500 to-amber-500',
      description: `${stats?.overview?.donations?.successful || 0} successful donations`
    },
    {
      title: 'Active Volunteers',
      value: stats?.overview?.volunteers?.total || '0',
      change: '+8.2%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'from-amber-500 to-yellow-500',
      description: `${stats?.overview?.volunteers?.new || 0} new this month`
    },
    {
      title: 'Total Reports',
      value: stats?.overview?.reports?.total || '0',
      change: stats?.overview?.reports?.open > 0 ? `${stats?.overview?.reports?.open} pending` : 'All clear',
      trend: stats?.overview?.reports?.open > 0 ? 'down' : 'up',
      icon: <Flag className="w-6 h-6" />,
      color: 'from-orange-600 to-red-500',
      description: `${stats?.overview?.reports?.inProgress || 0} in progress`
    },
    {
      title: 'Contact Messages',
      value: stats?.overview?.contacts?.total || '0',
      change: stats?.overview?.contacts?.unread > 0 ? `${stats?.overview?.contacts?.unread} unread` : 'All read',
      trend: stats?.overview?.contacts?.unread > 0 ? 'down' : 'up',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-amber-600 to-orange-600',
      description: 'Total messages received'
    }
  ];

  const recentActivity = [
    { user: 'Rajesh Kumar', type: 'donation', amount: '₹10,000', status: 'completed', time: '2 hours ago' },
    { user: 'Priya Sharma', type: 'volunteer', role: 'Animal Care', status: 'approved', time: '4 hours ago' },
    { user: 'Ahmad Hassan', type: 'report', location: 'Delhi', status: 'investigating', time: '6 hours ago' },
    { user: 'Ananya Singh', type: 'adoption', animal: 'Max (Golden Retriever)', status: 'processing', time: '1 day ago' }
  ];

  const upcomingEvents = [
    { title: 'Medical Camp - Dogs', date: 'Mar 15, 2024', location: 'Mumbai Center' },
    { title: 'Volunteer Training', date: 'Mar 18, 2024', location: 'Delhi Office' },
    { title: 'Fundraising Gala', date: 'Mar 25, 2024', location: 'Bangalore' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Chart Data - Use real data from API
  const monthlyDonations = stats?.monthlyDonations || [];
  const donationLabels = monthlyDonations.slice(-5).map(d => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d._id.month - 1]} ${d._id.year}`;
  });
  const donationData = monthlyDonations.slice(-5).map(d => d.total);

  const donationTrendData = {
    labels: donationLabels.length > 0 ? donationLabels : ['No Data'],
    datasets: [
      {
        label: 'Donations',
        data: donationData.length > 0 ? donationData : [0],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f97316',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  const volunteersByRole = stats?.overview?.volunteers?.byRole || [];
  const volunteerDistributionData = {
    labels: volunteersByRole.length > 0 ? volunteersByRole.map(v => v._id) : ['No Data'],
    datasets: [
      {
        data: volunteersByRole.length > 0 ? volunteersByRole.map(v => v.count) : [1],
        backgroundColor: ['#f97316', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'],
        borderColor: ['#ea580c', '#d97706', '#059669', '#3b82f6', '#7c3aed', '#db2777'],
        borderWidth: 2,
      }
    ]
  };

  const fundingSourcesData = {
    labels: ['Individual Donations', 'Corporate Sponsors', 'Government Grants', 'Fundraising Events'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
        borderColor: ['#fff'],
        borderWidth: 2,
      }
    ]
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid var(--primary-light)',
            borderTop: '4px solid var(--primary-color)',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            marginTop: '16px',
            color: 'var(--primary-color)',
            fontWeight: '500'
          }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', paddingBottom: '80px' }}>
      <div className="content-wrapper">
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Welcome back, {adminName || 'Admin'}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="form-select"
                style={{ width: 'auto' }}
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              <button
                onClick={handleRefresh}
                style={{
                  padding: '10px 16px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--primary-color)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--bg-tertiary)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                <RefreshCw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {overviewCards.map((card, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
            >
              <div className="stat-card-header">
                <h3 className="stat-card-title">{card.title}</h3>
                <div className="stat-card-icon" style={{
                  background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
                  color: 'white'
                }}>
                  {card.icon}
                </div>
              </div>
              
              <div className="stat-card-value">{card.value}</div>
              
              <div className="stat-card-footer">
                <div className={`stat-change ${card.trend === 'up' ? 'up' : 'down'}`}>
                  {card.trend === 'up' ? (
                    <ArrowUpRight size={18} />
                  ) : (
                    <ArrowDownRight size={18} />
                  )}
                  {card.change}
                </div>
                <p className="stat-description">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Donation Trend */}
          <motion.div
            className="chart-card"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Donation Trends</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Weekly overview
                </p>
              </div>
              <button className="chart-btn">
                <Filter size={14} style={{ marginRight: '4px' }} />
                Filter
              </button>
            </div>
            <div style={{ height: '280px' }}>
              <Line
                data={donationTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'var(--bg-primary)',
                      titleColor: 'var(--text-primary)',
                      bodyColor: 'var(--text-secondary)',
                      borderColor: 'var(--border-color)',
                      borderWidth: 1,
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(249, 115, 22, 0.05)' },
                      ticks: { callback: (value) => `₹${value / 1000}k` }
                    },
                    x: { grid: { display: false } }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Volunteer Distribution */}
          <motion.div
            className="chart-card"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Volunteer Distribution</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  By category
                </p>
              </div>
              <Users size={18} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div style={{ height: '280px' }}>
              <Doughnut
                data={volunteerDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: { size: 12, weight: '500' }
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Events */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Recent Activity */}
          <motion.div
            className="chart-card"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="chart-header">
              <h3 className="chart-title">Recent Activity</h3>
              <button style={{
                padding: '6px 12px',
                background: 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'var(--primary-color)',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}>
                View All
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--bg-tertiary)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: activity.type === 'donation' ? 'rgba(16, 185, 129, 0.1)' :
                                activity.type === 'volunteer' ? 'rgba(59, 130, 246, 0.1)' :
                                activity.type === 'report' ? 'rgba(239, 68, 68, 0.1)' :
                                'rgba(139, 92, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activity.type === 'donation' ? 'var(--success-color)' :
                           activity.type === 'volunteer' ? '#3b82f6' :
                           activity.type === 'report' ? 'var(--danger-color)' :
                           'var(--secondary-color)',
                    flexShrink: 0
                  }}>
                    {activity.type === 'donation' && <CreditCard size={18} />}
                    {activity.type === 'volunteer' && <Users size={18} />}
                    {activity.type === 'report' && <Flag size={18} />}
                    {activity.type === 'adoption' && <Home size={18} />}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <p style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>
                        {activity.user}
                      </p>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {activity.time}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {activity.type === 'donation' && `Donated ${activity.amount}`}
                      {activity.type === 'volunteer' && `Joined as ${activity.role}`}
                      {activity.type === 'report' && `Report from ${activity.location}`}
                      {activity.type === 'adoption' && `Adopting ${activity.animal}`}
                    </p>
                  </div>
                  
                  <div className={`status-badge ${
                    activity.status === 'completed' || activity.status === 'approved' ? 'success' :
                    activity.status === 'investigating' || activity.status === 'processing' ? 'warning' :
                    'info'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            className="chart-card"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="chart-header">
              <h3 className="chart-title">Upcoming Events</h3>
              <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingEvents.map((event, index) => (
                <div key={index} style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.background = 'var(--bg-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }}
                >
                  <p style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>
                    {event.title}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    📅 {event.date}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    📍 {event.location}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Funding Sources */}
        <motion.div
          className="chart-card"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Funding Sources</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Revenue distribution this quarter
              </p>
            </div>
            <button className="chart-btn">
              <Download size={14} style={{ marginRight: '4px' }} />
              Export
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '20px' }}>
            <div style={{ height: '260px' }}>
              <Pie
                data={fundingSourcesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: { size: 12, weight: '500' }
                      }
                    }
                  }
                }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '12px' }}>
              {[
                { label: 'Individual Donations', value: '45%', amount: '₹2,25,000' },
                { label: 'Corporate Sponsors', value: '30%', amount: '₹1,50,000' },
                { label: 'Government Grants', value: '15%', amount: '₹75,000' },
                { label: 'Fundraising Events', value: '10%', amount: '₹50,000' }
              ].map((source, index) => (
                <div key={index} style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-tertiary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {source.label}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)' }}>
                      {source.value}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'var(--border-color)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: `linear-gradient(90deg, var(--primary-color), var(--secondary-color))`,
                      width: source.value,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {source.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full footer bg-gray-50 text-gray-700 pt-8 pb-6" style={{ marginTop: '48px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Section with Logo and Content */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-8">
            
            {/* Logo Section */}
            <div className="w-full lg:w-1/4 flex justify-center lg:justify-center">
              <img 
                className='w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg' 
                src="/assets/logo.jpeg" 
                alt="Bezubaan Logo" 
              />
            </div>
            
            {/* Content Grid */}
            <div className="w-full lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                
                {/* Quick Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Quick Links</h3>
                  <div className="space-y-3">
                    <Link to="/" className="flex items-center gap-2 hover:text-black transition-colors">
                      <PawPrint size={16} className="text-gray-500" />
                      <span>Home</span>
                    </Link>
                    <Link to="/about" className="flex items-center gap-2 hover:text-black transition-colors">
                      <PawPrint size={16} className="text-gray-500" />
                      <span>About Us</span>
                    </Link>
                    <Link to="/report" className="flex items-center gap-2 hover:text-black transition-colors">
                      <PawPrint size={16} className="text-gray-500" />
                      <span>Report Cruelty</span>
                    </Link>
                    <Link to="/contact" className="flex items-center gap-2 hover:text-black transition-colors">
                      <PawPrint size={16} className="text-gray-500" />
                      <span>Contact Us</span>
                    </Link>
                  </div>
                </div>
                
                {/* Social Media */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Social Media</h3>
                  <div className="space-y-3">
                    <a 
                      href="https://www.instagram.com/bezubaan.01" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-black transition-colors"
                    >
                      <Instagram size={16} className="text-gray-500" />
                      <span>Instagram</span>
                    </a>
                    <Link to="/" className="flex items-center gap-2 hover:text-black transition-colors">
                      <Facebook size={16} className="text-gray-500" />
                      <span>Facebook</span>
                    </Link>
                  </div>
                </div>
                
                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Our Locations</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">Jaunpur Center :</p>
                          <p className="text-gray-600 text-sm">
                            Purani Bazar near Arshad Hospital<br />
                            Shahganj, Jaunpur 223101
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">Ghaziabad Center :</p>
                          <p className="text-gray-600 text-sm">
                            Near Shankar Hotel Crossing<br />
                            Republic, Ghaziabad
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-300 my-6"></div>
          
          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Bezubaan Helping Hands Charitable Trust. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm mt-2">Made with ❤️ by Bezubaan Team</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;