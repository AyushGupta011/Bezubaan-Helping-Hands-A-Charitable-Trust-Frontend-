import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './admin-theme.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const baseURL = (import.meta.env.DEV && window.location.hostname === 'localhost')
        ? 'http://localhost:4040'
        : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040');
      const response = await axios.post(`${baseURL}/api/admin/login`, formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.data));
        toast.success('Login successful! Redirecting...', { position: 'top-right', autoClose: 2000 });
        setTimeout(() => navigate('/admin'), 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'url("/assets/background.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        zIndex: 0
      }}></div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
        {/* Login Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          border: '2px solid black'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #000000 0%, #1f2937 100%)',
            padding: '32px 24px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <img 
                src="/assets/logo.jpeg" 
                alt="Bezubaan Logo" 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  border: '3px solid white',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'block',
                  objectFit: 'cover'
                }} 
              />
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '4px',
              fontFamily: '\'Courier New\', Courier, monospace'
            }}>Bezubaan Admin</h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500',
              fontFamily: '\'Courier New\', Courier, monospace'
            }}>Secure Dashboard Access</p>
          </div>

          {/* Form */}
          <div style={{ padding: '32px 24px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Email Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                  fontFamily: "'Courier New', Courier, monospace"
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid black',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    background: 'white',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    fontFamily: '\'Courier New\', Courier, monospace'
                  }}
                  placeholder="admin@bezubaan.org"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#000000';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                  fontFamily: '\'Courier New\', Courier, monospace'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      paddingRight: '40px',
                      border: '2px solid black',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      background: 'white',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      fontFamily: '\'Courier New\', Courier, monospace'
                    }}
                    placeholder="••••••••"
                    required
                    onFocus={(e) => {
                      e.target.style.borderColor = '#000000';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'black';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#1f2937'}
                    onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px 16px',
                  background: loading 
                    ? '#1f2937'
                    : '#000000',
                  color: 'white',
                  border: '2px solid black',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  opacity: loading ? 0.7 : 1,
                  fontFamily: '\'Courier New\', Courier, monospace'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign in to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '13px',
                color: '#6b7280',
                marginBottom: '12px',
                fontFamily: '\'Courier New\', Courier, monospace'
              }}>
                🔐 Secure access for authorized personnel only
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                <span>🛡️ Protected</span>
                <span>•</span>
                <span>🔒 Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            🐾 Bezubaan • Helping Hands Charitable Trust
          </p>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '8px'
          }}>
            Animal Welfare Management System © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
