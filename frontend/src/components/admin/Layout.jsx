import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Flag, 
  CreditCard,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  ChevronDown
} from 'lucide-react';
import './admin-theme.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Users size={20} />, label: 'Volunteers', path: '/admin/volunteers' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/admin/contacts' },
    { icon: <Flag size={20} />, label: 'Reports', path: '/admin/reports' },
    { icon: <CreditCard size={20} />, label: 'Donations', path: '/admin/donations' },
  ];

  return (
    <div className="admin-container">
      {/* Navigation Bar */}
      <nav className="admin-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="navbar-icon-btn"
            title="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/admin" className="navbar-brand">
            <img src="/assets/logo.jpeg" alt="Bezubaan Logo" />
            <span>Bezubaan Admin</span>
          </Link>
        </div>

        <div className="navbar-actions">
          <button className="navbar-icon-btn" title="Notifications">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>
          
          <div className="navbar-divider"></div>
          
          <div className="navbar-profile">
            <div className="profile-avatar">
              <User size={18} />
            </div>
            <div className="profile-info">
              <div className="profile-name">{admin?.name || 'Admin'}</div>
              <div className="profile-email">{admin?.email}</div>
            </div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="profile-dropdown"
              title="Profile menu"
            >
              <ChevronDown size={18} />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button
                  onClick={handleLogout}
                  className="dropdown-item danger"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="sidebar-item"
              title={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Backdrop for mobile when sidebar is open */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main Content - Single Scrollbar */}
      <div className={`admin-main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
